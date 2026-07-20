import Script from "next/script";

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var resolved = theme === 'system' || !theme
        ? (prefersDark ? 'dark' : 'light')
        : theme;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolved);
      document.documentElement.style.colorScheme = resolved;
    } catch (e) {}
  })();
`;

export function ThemeScript() {
  return (
    <Script
      id="theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
