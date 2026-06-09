import './globals.css';

export const metadata = {
  title: 'NeoVenturi · 3D Viewer',
  description: 'Interactive 3D model viewer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
