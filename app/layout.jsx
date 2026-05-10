import './globals.css';

export const metadata = {
  title: 'FriendType',
  description: '友情人格测试',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
