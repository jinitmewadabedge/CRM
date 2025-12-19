export const GradientIcon = ({ Icon, size = 28 }) => {
  return (
    <svg width={size} height={size}>
      <defs>
        <linearGradient id="pinkBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" /> {/* pink */}
          <stop offset="100%" stopColor="#3b82f6" /> {/* blue */}
        </linearGradient>
      </defs>

      <Icon
        width={size}
        height={size}
        stroke="url(#pinkBlueGradient)"
        strokeWidth={1.8}
        fill="none"
      />
    </svg>
  );
};
