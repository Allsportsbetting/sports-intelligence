-- Create payments table
-- This table tracks Stripe payment states
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'canceled', 'failed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.payments IS 'Tracks Stripe payment transactions';
COMMENT ON COLUMN public.payments.user_email IS 'Email of user who made payment';
COMMENT ON COLUMN public.payments.stripe_payment_intent_id IS 'Stripe PaymentIntent ID';
COMMENT ON COLUMN public.payments.stripe_session_id IS 'Stripe Checkout Session ID';
COMMENT ON COLUMN public.payments.amount IS 'Payment amount in cents';
COMMENT ON COLUMN public.payments.status IS 'Payment status: pending, succeeded, canceled, or failed';

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_email ON public.payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent ON public.payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON public.payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);
