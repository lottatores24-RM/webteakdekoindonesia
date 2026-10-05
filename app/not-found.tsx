// Fallback for URLs outside any locale (middleware normally redirects these to /en).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1>Page not found</h1>
        <p>
          <a href="/en">Go to CV. Teak &amp; Deko Indonesia</a>
        </p>
      </body>
    </html>
  );
}
