import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconBgColor = 'bg-slate-900',
  iconColor = 'text-white',
  bgColor = 'bg-white',
  borderColor = 'border-slate-200',
  trendUp = true,
  showProgress = false,
  progressValue = 0,
  progressColor = 'bg-amber-500',
  footer,
}) => {
  const TrendIcon = trendUp ? TrendingUp : TrendingDown;
  const trendColor = trendUp ? 'text-emerald-600' : 'text-rose-600';

  return (
    <div className={`${bgColor} rounded-xl p-6 border ${borderColor}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {change && (
          <span className={`flex items-center ${trendColor} text-sm font-medium`}>
            <TrendIcon className="w-4 h-4 mr-1" />
            {change}
          </span>
        )}
        {changeLabel && !change && (
          <span className="text-slate-600 text-sm font-medium">{changeLabel}</span>
        )}
      </div>

      {/* Title & Value */}
      <div className="text-sm text-slate-500 mb-1">{title}</div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
          <div
            className={`${progressColor} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
      )}

      {/* Footer */}
      {footer && <div className="text-xs text-slate-500 mt-2">{footer}</div>}
    </div>
  );
};

export default StatCard;
