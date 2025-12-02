import { NextRequest, NextResponse } from 'next/server';
import { stripe, PREMIUM_MEMBERSHIP_PRICE_ID } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Create Stripe Checkout Session without pre-filled email
    // Stripe will collect the email in the checkout form
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PREMIUM_MEMBERSHIP_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/join-now/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/join-now/canceled`,
      // Don't set customer_email - Stripe will collect it
      metadata: {
        source: 'banner_cta',
      },
    });

    // Create initial payment record with placeholder email (will be updated by webhook)
    await supabase.from('payments').insert({
      user_email: 'pending@checkout.stripe',
      stripe_session_id: session.id,
      amount: 200,
      currency: 'usd',
      status: 'pending',
      metadata: { 
        session_created_at: new Date().toISOString(),
        source: 'banner_cta',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error('Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
