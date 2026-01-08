import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - All Sports Intelligence',
  description: 'Secure admin access to All Sports Intelligence platform. Login with magic link authentication to manage global unlock progress and analytics.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}