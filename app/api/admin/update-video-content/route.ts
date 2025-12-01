import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { VideoContentUpdate } from '@/types';

const VALID_PLACEMENTS = ['homepage_video', 'dashboard_video', 'watch_on_youtube', 'betting_essentials', 'banner_video', 'subscribe_video'];

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with cookies for authentication
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin role
    const userRole = user.app_metadata?.role;
    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Create service role client for admin operations (bypasses RLS)
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
    );

    // Parse request body
    const body: VideoContentUpdate = await request.json();
    const { placement, video_url, title, subtitle, description, show_video, show_title, show_subtitle, show_description } = body;

    // Validate placement
    if (!placement || !VALID_PLACEMENTS.includes(placement)) {
      return NextResponse.json(
        { success: false, error: 'Invalid placement value' },
        { status: 400 }
      );
    }

    // Update video content using admin client
    const { data: updatedData, error: updateError } = await supabaseAdmin
      .from('video_content')
      .update({
        video_url: video_url || '',
        title: title || '',
        subtitle: subtitle || '',
        description: description || '',
        show_video: show_video ?? true,
        show_title: show_title ?? true,
        show_subtitle: show_subtitle ?? false,
        show_description: show_description ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq('placement', placement)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating video content:', {
        admin: user.email,
        placement,
        error: updateError.message,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { success: false, error: 'Failed to update video content' },
        { status: 500 }
      );
    }

    // Insert audit log entry
    const { error: auditError } = await supabaseAdmin.from('audit_log').insert({
      admin_email: user.email!,
      action_type: 'video_content_update' as string,
      subject: placement,
      delta_or_value: `Updated video content`,
      note: `Title: ${title || 'N/A'}`,
    });

    if (auditError) {
      console.error('Error creating audit log:', {
        admin: user.email,
        action: 'video_content_update',
        subject: placement,
        error: auditError.message,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedData,
    });
  } catch (error) {
    console.error('Error in update-video-content route:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
