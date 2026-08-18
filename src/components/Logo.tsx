export function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="22" fill="none" stroke="#22d3ee" strokeWidth="3" opacity="0.4" />
      <circle cx="32" cy="32" r="5" fill="#22d3ee" />
      <g className="animate-radar-sweep" style={{ transformBox: "view-box", transformOrigin: "32px 32px" }}>
        <line x1="32" y1="32" x2="32" y2="10" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
