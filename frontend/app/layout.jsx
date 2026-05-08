import { Inter, JetBrains_Mono } from 'next/font/google';
import SmoothScroll from '@/components/shared/SmoothScroll';
import ScrollProgressLine from '@/components/motion/ScrollProgressLine';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'GovBridge GrantMate',
  description: 'AI-powered GovTech platform connecting government funding to local employment',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased" style={{ backgroundColor: '#FAFAF8', color: '#0A0A0A' }}>
        <ScrollProgressLine />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
