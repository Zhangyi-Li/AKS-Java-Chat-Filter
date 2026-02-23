import './globals.css';

export const metadata = {
  title: 'AKS Chat Filter',
  description: 'Chat message filtering application',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-purple min-h-screen flex items-center justify-center p-5">
        {children}
      </body>
    </html>
  );
}
