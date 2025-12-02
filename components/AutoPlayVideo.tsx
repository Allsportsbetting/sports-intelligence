'use client';

import { useRef, useEffect, useState } from 'react';

interface AutoPlayVideoProps {
  src: string;
  title?: string;
  className?: string;
}

export default function AutoPlayVideo({ src, title = 'Video', className = '' }: AutoPlayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Convert YouTube URL to embed URL with enablejsapi for control
  const getEmbedUrl = (url: string, shouldPlay: boolean) => {
    let embedUrl = url;
    
    // Convert youtube.com/watch URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    // Convert youtu.be URLs to embed format
    else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    // Add parameters for autoplay control
    const separator = embedUrl.includes('?') ? '&' : '?';
    const params = shouldPlay 
      ? `${separator}autoplay=1&mute=1&enablejsapi=1`
      : `${separator}autoplay=0&enablejsapi=1`;
    
    return `${embedUrl}${params}`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Video is in view when at least 50% visible
          setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.5);
        });
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: '-10% 0px -10% 0px', // Trigger slightly inside viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative aspect-video bg-black rounded-2xl overflow-hidden ${className}`}>
      <iframe
        key={isInView ? 'playing' : 'paused'} // Force re-render to change autoplay state
        src={getEmbedUrl(src, isInView)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-2xl"
      />
    </div>
  );
}
