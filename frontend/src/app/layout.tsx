import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskLedger — Personal Task Management',
  description: 'A refined approach to managing your daily tasks.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#faf7f2',
              color: '#1c1814',
              border: '1px solid #d4c9b8',
              borderRadius: '2px',
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(28,24,20,0.12)',
            },
            success: { iconTheme: { primary: '#3a5c3e', secondary: '#faf7f2' } },
            error:   { iconTheme: { primary: '#8b3a1e', secondary: '#faf7f2' } },
          }}
        />
      </body>
    </html>
  );
}
