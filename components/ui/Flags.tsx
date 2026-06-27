// Drapeaux en SVG inline (les emojis 🇹🇳/🇪🇺 ne s'affichent pas sur Windows).

export function TnFlag({ className = 'h-3.5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      className={`${className} shrink-0 rounded-sm`}
      role="img"
      aria-label="Tunisie"
    >
      <rect width="60" height="40" fill="#E70013" />
      <circle cx="30" cy="20" r="11" fill="#fff" />
      <circle cx="31" cy="20" r="7" fill="#E70013" />
      <circle cx="33.2" cy="20" r="5.6" fill="#fff" />
      <path
        fill="#E70013"
        d="M33 14.7l1.46 4.49h4.72l-3.82 2.78 1.46 4.49L33 23.67l-3.82 2.78 1.46-4.49-3.82-2.78h4.72z"
      />
    </svg>
  );
}

// 12 étoiles dorées en cercle (drapeau de l'Union européenne).
const EU_STARS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  return { x: 30 + 13 * Math.sin(a), y: 20 - 13 * Math.cos(a) };
});

export function EuFlag({ className = 'h-3.5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      className={`${className} shrink-0 rounded-sm`}
      role="img"
      aria-label="Union européenne"
    >
      <rect width="60" height="40" fill="#003399" />
      {EU_STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="1.7" fill="#FFCC00" />
      ))}
    </svg>
  );
}
