import React from 'react';
import './CustomCheckmark.css';

/**
 * Custom Checkmark Component
 * A more appealing, hand-crafted looking checkmark with animations
 *
 * @param {string} size - 'sm' or 'lg' (default: 'sm')
 * @param {string} variant - 'success' or 'completed' (default: 'success')
 */
const CustomCheckmark = ({ size = 'sm', variant = 'success' }) => {
  const isSmall = size === 'sm';
  const sizeClass = isSmall ? 'w-5 h-5' : 'w-12 h-12';

  const colors = {
    success: {
      bg: 'bg-emerald-500',
      stroke: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.3)',
    },
    completed: {
      bg: 'bg-emerald-500',
      stroke: '#059669',
      glowColor: 'rgba(5, 150, 105, 0.4)',
    },
  };

  const color = colors[variant] || colors.success;

  return (
    <div className={`custom-checkmark-container ${sizeClass}`}>
      {/* Animated pulse background */}
      <div className={`custom-checkmark-pulse ${color.bg}`}></div>

      {/* Main circle with glow */}
      <div
        className={`custom-checkmark-circle ${color.bg}`}
        style={{
          boxShadow: `0 0 ${isSmall ? '10px' : '16px'} ${color.glowColor}, 0 2px 6px rgba(0,0,0,0.12)`,
        }}
      ></div>

      {/* Custom SVG checkmark with hand-drawn style */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`custom-checkmark-svg ${sizeClass}`}
      >
        {/* Hand-drawn style checkmark path with slight curve for organic feel */}
        <path
          d="M5 12.5l3.5 4c.3.4.8.4 1.1 0L19.5 6.5"
          stroke="white"
          strokeWidth={isSmall ? '2.8' : '3.2'}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="custom-checkmark-path"
        />
      </svg>
    </div>
  );
};

/**
 * On Track Badge - Complete badge component with icon and text
 */
export const OnTrackBadge = () => (
  <div className="flex items-center space-x-2">
    <CustomCheckmark size="sm" variant="success" />
    <span className="text-emerald-600 font-medium">On track</span>
  </div>
);

/**
 * Completed Badge Icon - For completed goals cards
 */
export const CompletedCheckmark = () => (
  <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform shadow-sm">
    <CustomCheckmark size="lg" variant="completed" />
  </div>
);

export default CustomCheckmark;
