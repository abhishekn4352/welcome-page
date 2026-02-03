import React, { useState } from 'react';
import { Filter, X, RotateCcw, Search, Calendar, ChevronDown } from 'lucide-react';
import { FilterOption, FilterState } from './types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface CommonFilterProps {
  filters: FilterOption[];
  values: FilterState;
  onChange: (values: FilterState) => void;
  onReset?: () => void;
  onApply?: () => void;
  className?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

const CommonFilter: React.FC<CommonFilterProps> = ({
  filters,
  values,
  onChange,
  onReset,
  onApply,
  className,
  showSearch = true,
  searchPlaceholder = 'Search...',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (id: string, value: any) => {
    onChange({ ...values, [id]: value });
  };

  const handleReset = () => {
    const resetValues: FilterState = {};
    filters.forEach(f => {
      resetValues[f.id] = f.type === 'toggle' ? false : '';
    });
    onChange(resetValues);
    setSearchValue('');
    onReset?.();
  };

  const activeFiltersCount = Object.values(values).filter(v => 
    v !== '' && v !== null && v !== undefined && v !== false
  ).length;

  return (
    <div className={cn("bg-card rounded-xl border border-border p-4", className)}>
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                handleChange('search', e.target.value);
              }}
              className="pl-9 h-9"
            />
          </div>
        )}

        {/* Quick Filters */}
        {filters.slice(0, 3).map((filter) => (
          <div key={filter.id} className="min-w-[150px]">
            {filter.type === 'select' && (
              <Select
                value={values[filter.id] || ''}
                onValueChange={(val) => handleChange(filter.id, val)}
              >
                <SelectTrigger className="h-9">
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
            {filter.type === 'date' && (
              <Input
                type="date"
                value={values[filter.id] || ''}
                onChange={(e) => handleChange(filter.id, e.target.value)}
                className="h-9"
              />
            )}
          </div>
        ))}

        {/* More Filters Button */}
        {filters.length > 3 && (
          <Popover open={isExpanded} onOpenChange={setIsExpanded}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Advanced Filters</h4>
                {filters.slice(3).map((filter) => (
                  <div key={filter.id} className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      {filter.label}
                    </label>
                    {filter.type === 'select' && (
                      <Select
                        value={values[filter.id] || ''}
                        onValueChange={(val) => handleChange(filter.id, val)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder={`Select ${filter.label}`} />
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
                    {filter.type === 'text' && (
                      <Input
                        value={values[filter.id] || ''}
                        onChange={(e) => handleChange(filter.id, e.target.value)}
                        placeholder={filter.label}
                        className="h-8"
                      />
                    )}
                    {filter.type === 'date' && (
                      <Input
                        type="date"
                        value={values[filter.id] || ''}
                        onChange={(e) => handleChange(filter.id, e.target.value)}
                        className="h-8"
                      />
                    )}
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false);
                      onApply?.();
                    }}
                    className="flex-1"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Reset Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-9 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CommonFilter;
