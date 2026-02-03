import React, { useState } from 'react';
import ChartWrapper from './ChartWrapper';
import { ChartConfig } from './types';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

interface GridColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface GridViewProps {
  data: any[];
  columns?: GridColumn[];
  config?: ChartConfig;
  className?: string;
  onRowClick?: (row: any) => void;
}

const GridView: React.FC<GridViewProps> = ({
  data,
  columns,
  config = {},
  className,
  onRowClick,
}) => {
  const { title = 'Grid View' } = config;
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Auto-generate columns from data if not provided
  const autoColumns: GridColumn[] = columns || (data.length > 0
    ? Object.keys(data[0]).map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        sortable: true,
      }))
    : []);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const order = sortOrder === 'asc' ? 1 : -1;
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * order;
    }
    return String(aVal).localeCompare(String(bVal)) * order;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Active': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      'Inactive': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'Pending': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  return (
    <ChartWrapper title={title} className={className}>
      <div className="h-full overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
            <tr>
              {autoColumns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    "px-3 py-2 text-left font-medium text-muted-foreground",
                    col.sortable && "cursor-pointer hover:text-foreground transition-colors"
                  )}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-muted-foreground/50">
                        {sortKey === col.key ? (
                          sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/50 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {autoColumns.map(col => (
                  <td key={col.key} className="px-3 py-2">
                    {col.render ? col.render(row[col.key], row) : (
                      col.key === 'status' ? (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-xs font-medium",
                          getStatusColor(row[col.key])
                        )}>
                          {row[col.key]}
                        </span>
                      ) : col.key === 'price' ? (
                        <span className="font-medium">${row[col.key]}</span>
                      ) : (
                        row[col.key]
                      )
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    </ChartWrapper>
  );
};

export default GridView;
