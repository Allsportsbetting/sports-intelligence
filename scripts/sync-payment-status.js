/**
 * Manual Payment Status Sync Script
 * 
 * This script syncs payment statuses from Stripe to Supabase
 * Run with: node scripts/sync-payment-status.js
 */

require('dotenv').config({ path: '.env.local' });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncPaymentStatus() {
  console.log('🔄 Starting payment status sync...\n');

  try {
    // Get all pending payments from Supabase
    const { data: pendingPayments, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('status', 'pending');

    if (fetchError) {
      console.error('❌ Error fetching pending payments:', fetchError);
      return;
    }

    if (!pendingPayments || pendingPayments.length === 0) {
      console.log('✅ No pending payments to sync');
      return;
    }

    console.log(`📋 Found ${pendingPayments.length} pending payment(s)\n`);

    // Sync each payment
    for (const payment of pendingPayments) {
      console.log(`🔍 Checking payment: ${payment.id}`);
      console.log(`   Email: ${payment.user_email}`);
      console.log(`   Session ID: ${payment.stripe_session_id}`);

      try {
        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(
          payment.stripe_session_id
        );

        console.log(`   Stripe Status: ${session.payment_status}`);
        console.log(`   Payment Intent: ${session.payment_intent}`);

        // Determine the status
        let newStatus = 'pending';
        if (session.payment_status === 'paid') {
          newStatus = 'succeeded';
        } else if (session.payment_status === 'unpaid') {
          newStatus = 'pending';
        } else if (session.status === 'expired') {
          newStatus = 'canceled';
        }

        // Update Supabase if status changed
        if (newStatus !== payment.status) {
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: newStatus,
              stripe_payment_intent_id: session.payment_intent,
              metadata: {
                ...payment.metadata,
                synced_at: new Date().toISOString(),
                payment_status: session.payment_status,
                session_status: session.status,
              },
            })
            .eq('id', payment.id);

          if (updateError) {
            console.error(`   ❌ Error updating payment:`, updateError);
          } else {
            console.log(`   ✅ Updated status: ${payment.status} → ${newStatus}`);
          }
        } else {
          console.log(`   ℹ️  Status unchanged: ${newStatus}`);
        }

        console.log('');
      } catch (stripeError) {
        console.error(`   ❌ Error retrieving Stripe session:`, stripeError.message);
        console.log('');
      }
    }

    console.log('✅ Payment sync complete!\n');
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

// Run the sync
syncPaymentStatus();
