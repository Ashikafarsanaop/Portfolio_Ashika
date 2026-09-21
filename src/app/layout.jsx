import "./globals.css";

export const metadata = {
  title: "Professional Portfolio",
  description: "Professional portfolio and project showcase",
  icons: {
    icon: "/briefcase-icon.svg"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}