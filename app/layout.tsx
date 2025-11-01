import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "다시 학교",
  description: "함께 성장하는 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-pretendard antialiased">
        {children}
      </body>
    </html>
  );
}