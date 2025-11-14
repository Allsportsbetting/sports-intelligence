import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Syncing payment status for session:', sessionId);

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('📋 Stripe session details:', {
      id: session.id,
      payment_status: session.payment_status,
      payment_intent: session.payment_intent,
      status: session.status,
    });

    // Determine the status
    let newStatus: 'pending' | 'succeeded' | 'canceled' | 'failed' = 'pending';
    if (session.payment_status === 'paid') {
      newStatus = 'succeeded';
    } else if (session.payment_status === 'unpaid') {
      newStatus = 'pending';
    } else if (session.status === 'expired') {
      newStatus = 'canceled';
    }

    // Update payment record in Supabase
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: newStatus,
        stripe_payment_intent_id: session.payment_intent as string,
        metadata: {
          synced_at: new Date().toISOString(),
          payment_status: session.payment_status,
          session_status: session.status,
        },
      })
      .eq('stripe_session_id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating payment:', error);
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      );
    }

    console.log('✅ Payment status synced:', {
      id: data.id,
      email: data.user_email,
      status: data.status,
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: data.id,
        status: data.status,
        email: data.user_email,
      },
    });
  } catch (error: any) {
    console.error('❌ Error syncing payment status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync payment status' },
      { status: 500 }
    );
  }
}
