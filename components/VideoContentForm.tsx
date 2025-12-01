'use client';

import { useState, useEffect } from 'react';
import { VideoPlacement, VideoContentUpdate } from '@/types';
import { useVideoContentStore } from '@/store/videoContentStore';

interface VideoContentFormProps {
  onSubmit: (update: VideoContentUpdate) => Promise<void>;
}

const PLACEMENT_OPTIONS: { value: VideoPlacement; label: string; description: string }[] = [
  { value: 'banner_video', label: '1. Banner Video', description: 'Top of homepage' },
  { value: 'homepage_video', label: '2. Payment Section Video', description: 'Map overlay + payment section' },
  { value: 'subscribe_video', label: '3. CTA Subscribe Video', description: 'Subscribe section with email form' },
  { value: 'dashboard_video', label: 'User Dashboard Video', description: 'Premium dashboard main video' },
  { value: 'watch_on_youtube', label: 'Watch on YouTube Button', description: 'Dashboard link button' },
  { value: 'betting_essentials', label: 'Betting Essentials Button', description: 'Dashboard link button' },
];

export default function VideoContentForm({ onSubmit }: VideoContentFormProps) {
  const { videoContent, fetchVideoContent } = useVideoContentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<VideoContentUpdate>({
    placement: 'homepage_video',
    video_url: '',
    title: '',
    subtitle: '',
    description: '',
    show_video: true,
    show_title: true,
    show_subtitle: false,
    show_description: false,
  });

  useEffect(() => {
    fetchVideoContent();
  }, [fetchVideoContent]);

  // Load existing content when placement changes
  useEffect(() => {
    const existing = videoContent.get(formData.placement);
    if (existing) {
      setFormData({
        placement: existing.placement as VideoPlacement,
        video_url: existing.video_url,
        title: existing.title,
        subtitle: existing.subtitle,
        description: existing.description,
        show_video: existing.show_video,
        show_title: existing.show_title,
        show_subtitle: existing.show_subtitle,
        show_description: existing.show_description,
      });
    }
  }, [formData.placement, videoContent]);

  const handlePlacementChange = (placement: VideoPlacement) => {
    setFormData((prev) => ({ ...prev, placement }));
  };

  const handleCancel = () => {
    const existing = videoContent.get(formData.placement);
    if (existing) {
      setFormData({
        placement: existing.placement as VideoPlacement,
        video_url: existing.video_url,
        title: existing.title,
        subtitle: existing.subtitle,
        description: existing.description,
        show_video: existing.show_video,
        show_title: existing.show_title,
        show_subtitle: existing.show_subtitle,
        show_description: existing.show_description,
      });
    } else {
      setFormData({
        placement: formData.placement,
        video_url: '',
        title: '',
        subtitle: '',
        description: '',
        show_video: true,
        show_title: true,
        show_subtitle: false,
        show_description: false,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Placement Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Select Placement
        </label>
        <select
          value={formData.placement}
          onChange={(e) => handlePlacementChange(e.target.value as VideoPlacement)}
          className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
        >
          {PLACEMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.description}
            </option>
          ))}
        </select>
      </div>

      {/* Video URL with Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-300">Video URL</label>
          <ToggleButton
            checked={formData.show_video}
            onChange={(checked) => setFormData((prev) => ({ ...prev, show_video: checked }))}
            label="Show"
          />
        </div>
        <input
          type="text"
          value={formData.video_url}
          onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
          placeholder="https://www.youtube.com/embed/..."
          className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
        />
      </div>

      {/* Title with Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-300">Title</label>
          <ToggleButton
            checked={formData.show_title}
            onChange={(checked) => setFormData((prev) => ({ ...prev, show_title: checked }))}
            label="Show"
          />
        </div>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Enter video title"
          className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
        />
      </div>

      {/* Subtitle with Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-300">Subtitle</label>
          <ToggleButton
            checked={formData.show_subtitle}
            onChange={(checked) => setFormData((prev) => ({ ...prev, show_subtitle: checked }))}
            label="Show"
          />
        </div>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
          placeholder="Enter video subtitle"
          className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
        />
      </div>

      {/* Description with Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-300">Description</label>
          <ToggleButton
            checked={formData.show_description}
            onChange={(checked) => setFormData((prev) => ({ ...prev, show_description: checked }))}
            label="Show"
          />
        </div>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter video description"
          rows={3}
          className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 rounded-xl transition-all duration-300 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

// Toggle Button Component
function ToggleButton({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
        checked
          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
          : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
      }`}
    >
      <span
        className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
          checked ? 'bg-cyan-500 text-white' : 'bg-slate-600'
        }`}
      >
        {checked && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}
