import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Membership - All Sports Intelligence',
  description: 'Join our premium membership for exclusive sports intelligence benefits. Get VIP access, premium picks, special rewards, and join our exclusive Telegram community for just $2.',
  keywords: [
    'premium membership',
    'sports intelligence premium',
    'VIP access',
    'exclusive sports data',
    'premium picks',
    'sports analytics membership'
  ],
  openGraph: {
    title: 'Premium Membership - All Sports Intelligence',
    description: 'Join our premium membership for exclusive sports intelligence benefits. Limited time launch offer - just $2!',
    type: 'website',
  },
  twitter: {
    title: 'Premium Membership - All Sports Intelligence',
    description: 'Join our premium membership for exclusive sports intelligence benefits. Limited time launch offer - just $2!',
  },
};

export default function JoinNowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}