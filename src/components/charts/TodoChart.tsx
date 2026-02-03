import React from 'react';
import ChartWrapper from './ChartWrapper';
import { ChartConfig } from './types';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoItem {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'high' | 'medium' | 'low';
}

interface TodoChartProps {
  data: TodoItem[];
  config?: ChartConfig;
  className?: string;
  onStatusChange?: (id: number, status: TodoItem['status']) => void;
}

const TodoChart: React.FC<TodoChartProps> = ({
  data,
  config = {},
  className,
  onStatusChange,
}) => {
  const { title = 'To-Do Chart' } = config;

  const getStatusIcon = (status: TodoItem['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: TodoItem['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return (
      <span className={cn('px-1.5 py-0.5 rounded text-[10px] uppercase font-medium', colors[priority])}>
        {priority}
      </span>
    );
  };

  const statusGroups = {
    'todo': data.filter(item => item.status === 'todo'),
    'in-progress': data.filter(item => item.status === 'in-progress'),
    'done': data.filter(item => item.status === 'done'),
  };

  const total = data.length;
  const completed = statusGroups.done.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <ChartWrapper 
      title={title} 
      className={className}
      subtitle={`${completed} of ${total} completed (${progress.toFixed(0)}%)`}
    >
      <div className="h-full flex flex-col gap-3 overflow-auto">
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Task list */}
        <div className="flex-1 space-y-1.5 overflow-auto">
          {data.map(item => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border transition-colors",
                item.status === 'done' 
                  ? 'bg-muted/50 border-muted' 
                  : 'bg-card border-border hover:border-primary/50'
              )}
            >
              <button
                onClick={() => {
                  const nextStatus: Record<TodoItem['status'], TodoItem['status']> = {
                    'todo': 'in-progress',
                    'in-progress': 'done',
                    'done': 'todo',
                  };
                  onStatusChange?.(item.id, nextStatus[item.status]);
                }}
                className="shrink-0"
              >
                {getStatusIcon(item.status)}
              </button>
              <span className={cn(
                "flex-1 text-sm",
                item.status === 'done' && "line-through text-muted-foreground"
              )}>
                {item.title}
              </span>
              {getPriorityBadge(item.priority)}
            </div>
          ))}
        </div>
      </div>
    </ChartWrapper>
  );
};

export default TodoChart;
