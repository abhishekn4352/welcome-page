import React from 'react';
import { cn } from '@/lib/utils';

interface ChartWrapperProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  loading?: boolean;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  subtitle,
  children,
  className,
  actions,
  loading = false,
}) => {
  return (
    <div className={cn(
      "bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full",
      className
    )}>
      {(title || actions) && (
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            {title && (
              <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="flex-1 p-4 min-h-0 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartWrapper;
