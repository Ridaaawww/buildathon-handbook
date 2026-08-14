import '../styles/index.css';

export const metadata = {
  title: 'Idea Bank',
  description:
    'Browse and filter buildathon project ideas and beginner starters, each with a full build brief.',
};

// Applied before first paint so the stored theme does not flash.
const THEME_SCRIPT = `
try {
  var t = localStorage.getItem('idea-bank-theme');
  if (t) document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
