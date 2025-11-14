'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginTransactionId, setLoginTransactionId] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Sync payment status with Supabase
    const syncPaymentStatus = async () => {
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/sync-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.error('Failed to sync payment status:', result.error);
          setSyncError(result.error || 'Failed to sync payment status');
        } else {
          console.log('✅ Payment status synced:', result.payment);
        }
      } catch (error) {
        console.error('Error syncing payment status:', error);
        setSyncError('Network error while syncing payment');
      } finally {
        // Show success page after sync attempt
        setTimeout(() => {
          setIsVerifying(false);
        }, 1000);
      }
    };

    syncPaymentStatus();
  }, [sessionId]);

  const handleDashboardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/verify-dashboard-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail.trim(),
          transactionId: loginTransactionId.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setLoginError(result.error || 'Invalid credentials');
        setIsLoggingIn(false);
        return;
      }

      // Redirect to dashboard
      window.location.href = '/user_dashboard';
    } catch (error) {
      console.error('Dashboard login error:', error);
      setLoginError('Failed to verify credentials. Please try again.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-purple-950">
      {/* Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-full px-6 py-3 shadow-2xl shadow-cyan-500/20">
          <div className="flex items-center justify-between gap-6">
            <Link href="/">
              <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity">
                Global Unlock
              </h1>
            </Link>
            <div className="text-sm text-slate-400">Payment Success</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-cyan-500/40 rounded-3xl p-8 md:p-12 shadow-2xl shadow-cyan-500/30">
            {isVerifying ? (
              <div className="text-center py-12">
                <div className="inline-block w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
                <p className="text-slate-300 text-lg">Verifying your payment...</p>
              </div>
            ) : (
              <>
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-8 flex justify-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full flex items-center justify-center border-4 border-cyan-400/50 shadow-lg shadow-cyan-500/50">
                    <svg
                      className="w-12 h-12 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </motion.div>

                {/* Success Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-400 bg-clip-text text-transparent mb-4">
                    Payment Successful!
                  </h2>
                  <p className="text-slate-300 text-lg mb-2">
                    Welcome to Premium Membership
                  </p>
                  <p className="text-slate-400 text-sm">
                    Your payment has been processed successfully
                  </p>
                </motion.div>

                {/* Benefits Reminder */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl"
                >
                  <h3 className="text-cyan-300 font-semibold mb-4 text-center">
                    You now have access to:
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-300">
                      <span className="text-xl">🎁</span>
                      <span>Exclusive Gift Rewards</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <span className="text-xl">⭐</span>
                      <span>Premium Picks</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <span className="text-xl">💬</span>
                      <span>VIP Telegram Channel</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <span className="text-xl">🏆</span>
                      <span>Special Challenges & Rewards</span>
                    </div>
                  </div>
                </motion.div>

                {/* Important Warning */}
                {sessionId && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <p className="text-amber-300 font-semibold text-sm mb-1">
                          Important: Save Your Transaction ID
                        </p>
                        <p className="text-slate-300 text-xs">
                          Save the transaction ID below for later. It will be used to login to your dashboard. If you lose it, we cannot recover it for you.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Session Info */}
                {sessionId && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8 p-4 bg-slate-800/50 border border-cyan-500/30 rounded-xl"
                  >
                    <p className="text-slate-400 text-xs mb-1">Transaction ID:</p>
                    <p className="text-cyan-300 text-sm font-mono break-all font-semibold">{sessionId}</p>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <Link href="/" className="w-full">
                    <button className="w-full py-4 px-6 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 hover:border-slate-500 text-white font-semibold text-base rounded-xl transition-all duration-300">
                      Return to Home
                    </button>
                  </Link>
                  
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold text-base rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
                  >
                    Access Dashboard
                  </button>
                </motion.div>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-500">
                    A confirmation email has been sent to your inbox
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>

      {/* Dashboard Login Modal */}
      {showLoginModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl border-2 border-cyan-500/40 rounded-3xl p-8 shadow-2xl shadow-cyan-500/30">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-2">
                  Access Dashboard
                </h2>
                <p className="text-slate-400 text-sm">
                  Enter your credentials to continue
                </p>
              </div>

              <form onSubmit={handleDashboardLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={isLoggingIn}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="login-transaction" className="block text-sm font-medium text-slate-300 mb-2">
                    Transaction ID
                  </label>
                  <input
                    id="login-transaction"
                    type="text"
                    value={loginTransactionId}
                    onChange={(e) => setLoginTransactionId(e.target.value)}
                    placeholder="cs_test_..."
                    disabled={isLoggingIn}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl border bg-red-500/10 border-red-500/30 text-red-300"
                  >
                    <p className="text-sm">{loginError}</p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    disabled={isLoggingIn}
                    className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 hover:border-slate-500 text-white font-semibold text-sm rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingIn ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      'Access Dashboard'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-purple-950">
        <div className="text-cyan-400">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
