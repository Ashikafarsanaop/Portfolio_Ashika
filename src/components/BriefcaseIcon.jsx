export default function BriefcaseIcon({ size = 32, className = "", title = "Briefcase" }) {
  return (
    <svg
      width={size}
      height={(size * 160) / 200}
      viewBox="0 0 200 160"
      className={`brand-icon ${className}`}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <ellipse cx="100" cy="142" rx="52" ry="9" fill="#000000" opacity="0.12" />
      <path
        d="M68 44 V28 Q68 21 75 21 H125 Q132 21 132 28 V44 H120 V32 Q120 30 118 30 H82 Q80 30 80 32 V44 Z"
        fill="#B91C2E"
      />
      <rect x="20" y="42" width="160" height="88" rx="1" fill="#B91C2E" />
      <path
        d="M20 76 Q100 112 180 76"
        stroke="#FFFFFF"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="100" cy="99" r="6.5" fill="#FFFFFF" />
    </svg>
  );
}
