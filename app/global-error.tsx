'use client';

// Capture les erreurs du layout racine (remplace tout le document).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#0A0D0B',
          color: '#F5F0E6',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '1.25rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Une erreur est survenue
          </h1>
          <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
            Veuillez réessayer dans un instant.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg,#E8A33D,#D4A04C)',
              color: '#0A0D0B',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
