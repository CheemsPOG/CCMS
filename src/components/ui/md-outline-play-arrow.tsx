interface MDOutlinePlayArrowProps {
  className?: string;
  size?: number;
  onClick?: () => void;
  title?: string;
}

/**
 * Material Design Outline Play Arrow Icon Component
 *
 * This component renders a play arrow icon in the Material Design outline style.
 * It's designed to be interactive with hover effects and click handlers.
 *
 * @param className - Additional CSS classes to apply to the SVG
 * @param size - Size of the icon (width and height)
 * @param onClick - Click handler function
 * @param title - Tooltip text for accessibility
 */
export function MDOutlinePlayArrow({
  className = "",
  size = 24,
  onClick,
  title = "Play",
}: MDOutlinePlayArrowProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`cursor-pointer transition-colors duration-200 hover:text-[#4a5568] ${className}`}
      onClick={onClick}
      role="button"
      aria-label={title}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Play arrow path - Material Design outline style */}
      <path
        d="M8 5V19L19 12L8 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default MDOutlinePlayArrow;
