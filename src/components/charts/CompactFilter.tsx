import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { FilterOption, FilterState } from './types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface CompactFilterProps {
  filters: FilterOption[];
  values: FilterState;
  onChange: (values: FilterState) => void;
  onReset?: () => void;
  className?: string;
}

const CompactFilter: React.FC<CompactFilterProps> = ({
  filters,
  values,
  onChange,
  onReset,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (id: string, value: any) => {
    onChange({ ...values, [id]: value });
  };

  const handleRemoveFilter = (id: string) => {
    const newValues = { ...values };
    delete newValues[id];
    onChange(newValues);
  };

  const activeFilters = Object.entries(values).filter(([_, v]) => 
    v !== '' && v !== null && v !== undefined && v !== false
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Active Filter Badges */}
      {activeFilters.map(([key, value]) => {
        const filter = filters.find(f => f.id === key);
        const displayValue = filter?.options?.find(o => o.value === value)?.label || value;
        return (
          <Badge
            key={key}
            variant="secondary"
            className="flex items-center gap-1 pr-1"
          >
            <span className="text-xs text-muted-foreground">{filter?.label}:</span>
            <span className="text-xs font-medium">{displayValue}</span>
            <button
              onClick={() => handleRemoveFilter(key)}
              className="ml-1 p-0.5 rounded-full hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        );
      })}

      {/* Add Filter Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
            <Filter className="w-3 h-3 mr-1" />
            Filter
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-3">
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
              Add Filter
            </h4>
            {filters.map((filter) => (
              <div key={filter.id}>
                {filter.type === 'select' && (
                  <Select
                    value={values[filter.id] || ''}
                    onValueChange={(val) => {
                      handleChange(filter.id, val);
                      setIsOpen(false);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear All */}
      {activeFilters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 px-2 text-xs text-muted-foreground"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};

export default CompactFilter;
