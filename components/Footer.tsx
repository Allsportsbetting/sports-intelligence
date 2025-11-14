'use client';

export default function Footer() {
  return (
    <footer className="bg-slate-950/80 backdrop-blur-xl border-t border-cyan-500/20 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          {/* Main Message */}
          <div className="text-slate-300">
            <p className="text-lg font-semibold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-2">
              Unlock Exclusive Course Content
            </p>
            <p className="text-sm text-slate-400">
              Get instant access to premium educational materials and resources
            </p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
            <svg
              className="w-4 h-4 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>All payments are secured by Stripe</span>
          </div>

          {/* Divider */}
          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-600">
              Global Unlock © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
