import "./globals.css";

type PropsType = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: PropsType) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}