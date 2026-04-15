interface ArxonLogoProps {
  size?: number;
  variant?: 'blue' | 'gold' | 'white' | 'dark';
  className?: string;
}

/**
 * Arxon geometric "A" logo — bold triangular form with inner cutout
 * and angular right-side depth slash matching the original brand mark.
 */
const ArxonLogo = ({ size = 48, variant = 'blue', className = '' }: ArxonLogoProps) => {
  const gradients: Record<string, [string, string]> = {
    gold: ['#dbb665', '#a07828'],
    blue: ['#a1a1aa', '#3f3f46'],
    white: ['#ffffff', '#cbd5e1'],
    dark: ['#3f3f46', '#18181b'],
  };
  const [c1, c2] = gradients[variant] || gradients.blue;
  const id = `arxon-${variant}-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={id} x1="25" y1="8" x2="75" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>

      {/* Main A — outer triangle with inner triangular cutout */}
      <path
        fillRule="evenodd"
        d={`
          M 50 8
          L 13 90
          L 33 90
          L 41 73
          L 59 73
          L 67 90
          L 87 90
          Z
          M 50 38
          L 44 52
          L 56 52
          Z
        `}
        fill={`url(#${id})`}
      />

      {/* Right-side angular depth cut — shadow overlay */}
      <path
        d="M 63 80 L 67 90 L 87 90 L 74 62 Z"
        fill={c2}
        opacity="0.5"
      />
    </svg>
  );
};

export default ArxonLogo;
