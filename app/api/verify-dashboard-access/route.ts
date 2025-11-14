import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email, transactionId } = await request.json();

    if (!email || !transactionId) {
      return NextResponse.json(
        { success: false, error: 'Email and transaction ID are required' },
        { status: 400 }
      );
    }

    console.log('🔍 Verifying dashboard access:', { email, transactionId });

    // Query payments table to verify credentials
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_email', email.trim().toLowerCase())
      .eq('stripe_session_id', transactionId.trim())
      .eq('status', 'succeeded')
      .single();

    if (error || !payment) {
      console.error('❌ Verification failed:', error?.message || 'No matching payment found');
      return NextResponse.json(
        { success: false, error: 'Invalid email or transaction ID' },
        { status: 401 }
      );
    }

    console.log('✅ Dashboard access verified:', {
      email: payment.user_email,
      transactionId: payment.stripe_session_id,
    });

    // Create a session token (you can enhance this with JWT if needed)
    const sessionToken = Buffer.from(
      JSON.stringify({
        email: payment.user_email,
        transactionId: payment.stripe_session_id,
        timestamp: Date.now(),
      })
    ).toString('base64');

    return NextResponse.json({
      success: true,
      sessionToken,
      user: {
        email: payment.user_email,
        transactionId: payment.stripe_session_id,
      },
    });
  } catch (error: any) {
    console.error('❌ Error verifying dashboard access:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
