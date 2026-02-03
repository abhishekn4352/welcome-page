import React, { useRef, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import Icon from '../other/AppIcon';
import CompactFilter from '../../viewer/components/CompactFilter';
import SmartWidget from '../../viewer/components/SmartWidget';
import {
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  ScatterChart as RechartsScatterChart,
  Scatter,
  ComposedChart as RechartsComposedChart,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// ============================================================================
// SHARED UTILITIES & CONSTANTS
// ============================================================================

// Modern Color Palette
const CHART_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

// Reusable Custom Tooltip with enhanced styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '10px 14px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
        fontSize: '12px',
        backdropFilter: 'blur(10px)',
        color: '#fff'
      }}>
        <p style={{ fontWeight: '700', color: '#f3f4f6', marginBottom: '8px', fontSize: '13px' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }} />
            <span style={{ color: '#d1d5db', fontSize: '11px' }}>{entry.name}:</span>
            <span style={{ fontWeight: '600', color: '#fff', marginLeft: '4px' }}>
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Shared Axis Props for consistency
const axisProps = {
  tick: { fontSize: 12, fill: '#6b7280', fontWeight: '500' },
  axisLine: { stroke: '#e5e7eb', strokeWidth: 1.5 },
  tickLine: { stroke: '#e5e7eb', strokeWidth: 1 },
  tickMargin: 10,
  stroke: '#e5e7eb',
};

const gridProps = {
  strokeDasharray: '4 4',
  vertical: false,
  stroke: '#e5e7eb',
  opacity: 0.6
};

// ============================================================================
// SIMPLE FORM WIDGETS
// ============================================================================
const ButtonWidget = ({ config, width = 160, height = 40 }) => {
  const label = config?.label || 'Submit';
  const variant = config?.variant || 'primary';
  const bg = variant === 'primary' ? '#2563eb' : variant === 'success' ? '#16a34a' : '#6b7280';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width, height }}>
      <button style={{
        background: bg,
        color: 'white',
        border: 'none',
        borderRadius: 6,
        padding: '8px 14px',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer'
      }}>{label}</button>
    </div>
  );
};

const InputWidget = ({ config, width = 280, height = 60 }) => {
  const label = config?.label || 'Label';
  const placeholder = config?.placeholder || 'Type here...';
  const required = !!config?.required;
  const minLength = Number(config?.minLength) || 0;
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validate = (val) => {
    if (required && !val) return `${label} is required`;
    if (minLength > 0 && val.length < minLength) return `${label} must be at least ${minLength} characters`;
    if ((config?.type === 'email' || config?.email) && val) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!ok) return 'Enter a valid email';
    }
    return '';
  };

  const onBlur = () => setError(validate(value));

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: '#374151' }}>{label}{required ? ' *' : ''}</label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => { setValue(e.target.value); if (error) setError(''); }}
        onBlur={onBlur}
        type={config?.type === 'email' || config?.email ? 'email' : 'text'}
        style={{
          width: '100%',
          height: 32,
          border: `1px solid ${error ? '#ef4444' : '#e5e7eb'}`,
          borderRadius: 6,
          padding: '0 10px',
          fontSize: 12
        }}
      />
      {error && <span style={{ color: '#ef4444', fontSize: 11 }}>{error}</span>}
    </div>
  );
};

const CheckboxWidget = ({ config, width = 280, height = 40 }) => {
  const label = config?.label || 'Checkbox';
  return (
    <div style={{ width, height, display: 'flex', alignItems: 'center', gap: 8 }}>
      <input type="checkbox" style={{ width: 16, height: 16 }} />
      <span style={{ fontSize: 12, color: '#374151' }}>{label}</span>
    </div>
  );
};

const FormWidget = ({ config, width = 320, height = 220 }) => {
  const fields = Array.isArray(config?.fields) ? config.fields : [];
  const submitLabel = config?.submitLabel || 'Submit';
  const styleCfg = config?.style || {};
  const read = (key, altKey) => (styleCfg[key] !== undefined ? styleCfg[key] : (altKey !== undefined ? styleCfg[altKey] : undefined));
  const containerStyles = {
    width: read('width') || '100%',
    padding: read('padding') !== undefined ? read('padding') : 10,
    margin: read('margin') !== undefined ? read('margin') : 0,
    border: read('border') || '1px solid #e5e7eb',
    borderRadius: read('borderRadius', 'border-radius') !== undefined ? read('borderRadius', 'border-radius') : 8,
    background: read('backgroundColor', 'background-color') || '#ffffff',
    color: read('color') || '#374151',
    fontSize: read('fontSize', 'font-size') !== undefined ? read('fontSize', 'font-size') : 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  };
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f, i) => [i, ''])));
  const [checks, setChecks] = useState(() => Object.fromEntries(fields.map((f, i) => [i, false])));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateField = (f, val, checked) => {
    if (f.type === 'checkbox') {
      if (f.required && !checked) return 'Required';
      return '';
    }
    if (f.required && !val) return 'Required';
    if (f.minLength && val && val.length < f.minLength) return `Min ${f.minLength} chars`;
    if (f.type === 'email' && val) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!ok) return 'Invalid email';
    }
    return '';
  };

  const onSubmit = () => {
    const nextErrors = {};
    fields.forEach((f, i) => {
      nextErrors[i] = validateField(f, values[i], checks[i]);
    });
    setErrors(nextErrors);
    const hasErr = Object.values(nextErrors).some(Boolean);
    setSubmitted(!hasErr);
  };

  return (
    <div style={{ width, height, ...containerStyles }}>
      {fields.map((f, idx) => {
        if (f.type === 'checkbox') {
          return (
            <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151' }}>
              <input
                type="checkbox"
                checked={!!checks[idx]}
                onChange={(e) => { const v = e.target.checked; setChecks({ ...checks, [idx]: v }); if (errors[idx]) setErrors({ ...errors, [idx]: '' }); }}
                style={{ width: 16, height: 16 }}
              />
              {f.label || 'Checkbox'}{f.required ? ' *' : ''}
              {errors[idx] && <span style={{ color: '#ef4444', marginLeft: 8 }}>{errors[idx]}</span>}
            </label>
          );
        }
        if (f.type === 'radio') {
          const options = Array.isArray(f.options) && f.options.length ? f.options : ['Option 1', 'Option 2'];
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#374151' }}>{f.label || 'Choose'}{f.required ? ' *' : ''}</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {options.map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#374151' }}>
                    <input type="radio" name={`form-radio-${idx}`} />
                    {opt}
                  </label>
                ))}
              </div>
              {errors[idx] && <span style={{ color: '#ef4444', fontSize: 11 }}>{errors[idx]}</span>}
            </div>
          );
        }
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, color: '#374151' }}>{f.label || 'Field'}{f.required ? ' *' : ''}</label>
            <input
              type={f.type || 'text'}
              placeholder={f.placeholder || ''}
              value={values[idx] || ''}
              onChange={(e) => { setValues({ ...values, [idx]: e.target.value }); if (errors[idx]) setErrors({ ...errors, [idx]: '' }); }}
              onBlur={() => {
                const err = validateField(f, values[idx], checks[idx]);
                if (err) setErrors({ ...errors, [idx]: err });
              }}
              style={{
                width: '100%',
                height: 32,
                border: `1px solid ${errors[idx] ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: read('borderRadius', 'border-radius') !== undefined ? read('borderRadius', 'border-radius') : 6,
                padding: typeof read('padding') !== 'undefined' ? read('padding') : '0 10px',
                fontSize: containerStyles.fontSize,
                color: containerStyles.color
              }}
            />
            {errors[idx] && <span style={{ color: '#ef4444', fontSize: 11 }}>{errors[idx]}</span>}
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        {submitted && <span style={{ color: '#16a34a', fontSize: 12 }}>Form is valid!</span>}
        <button onClick={onSubmit} style={{
          background: '#2563eb',
          color: containerStyles.color === '#374151' ? '#fff' : containerStyles.color,
          border: 'none',
          borderRadius: read('borderRadius', 'border-radius') !== undefined ? read('borderRadius', 'border-radius') : 6,
          padding: '8px 12px',
          fontSize: containerStyles.fontSize,
          fontWeight: 600,
          cursor: 'pointer'
        }}>{submitLabel}</button>
      </div>
    </div>
  );
};

const dotStyle = {
  position: 'absolute',
  width: 12,
  height: 12,
  background: '#3b82f6',
  border: '2px solid #fff',
  borderRadius: '50%',
  zIndex: 2,
};

// Resize handles component for widgets
const ResizeHandles = ({ width, height, onResize, id }) => {
  const initialSize = useRef({ width, height });
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const directionRef = useRef(null);

  const onMouseDown = (direction) => (e) => {
    e.stopPropagation();
    e.preventDefault();

    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    initialSize.current = { width, height };
    directionRef.current = direction;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;

    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    const direction = directionRef.current;
    let delta = { x: 0, y: 0 };

    if (direction.includes('left')) delta.x = -dx;
    if (direction.includes('right')) delta.x = dx;
    if (direction.includes('top')) delta.y = -dy;
    if (direction.includes('bottom')) delta.y = dy;

    onResize(id, direction, delta, initialSize.current);
  };

  const onMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <>
      {/* Corner handles */}
      <div
        className="resize-handle nodrag nopan"
        style={{
          position: 'absolute',
          left: -8,
          top: -8,
          width: 12,
          height: 12,
          background: '#2563eb',
          borderRadius: 2,
          cursor: 'nwse-resize',
          zIndex: 10
        }}
        onMouseDown={onMouseDown('top-left')}
      />
      <div
        className="resize-handle nodrag nopan"
        style={{
          position: 'absolute',
          right: -8,
          top: -8,
          width: 12,
          height: 12,
          background: '#2563eb',
          borderRadius: 2,
          cursor: 'nesw-resize',
          zIndex: 10
        }}
        onMouseDown={onMouseDown('top-right')}
      />
      <div
        className="resize-handle nodrag nopan"
        style={{
          position: 'absolute',
          left: -8,
          bottom: -8,
          width: 12,
          height: 12,
          background: '#2563eb',
          borderRadius: 2,
          cursor: 'nesw-resize',
          zIndex: 10
        }}
        onMouseDown={onMouseDown('bottom-left')}
      />
      <div
        className="resize-handle nodrag nopan"
        style={{
          position: 'absolute',
          right: -8,
          bottom: -8,
          width: 12,
          height: 12,
          background: '#2563eb',
          borderRadius: 2,
          cursor: 'nwse-resize',
          zIndex: 10
        }}
        onMouseDown={onMouseDown('bottom-right')}
      />

      {/* Edge center handles */}
      <div
        className="resize-handle nodrag nopan"
        style={{
          position: 'absolute',
          left: '50%',
          top: -8,
          transform: 'translateX(-50%)',
          width: 12,
          height: 12,
          background: '#2563eb',
          borderRadius: 2,
          cursor: 'ns-resize',
          zIndex: 10
        }}
        onMouseDown={onMouseDown('top')}
      />
      <div
        className="resize-handle nodrag nopan"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -8,
          transform: 'translateX(-50%)',
          width: 12,
          height: 12,
          background: '#2563eb',
          borderRadius: 2,
          cursor: 'ns-resize',
          zIndex: 10
        }}
        onMouseDown={onMouseDown('bottom')}
      />
      <div
        className="resize-handle nodrag nopan"
        style={{
          position: 'absolute',
          top: '50%',
          left: -8,
          transform: 'translateY(-50%)',
          width: 12,
          height: 12,
          background: '#2563eb',
          borderRadius: 2,
          cursor: 'ew-resize',
          zIndex: 10
        }}
        onMouseDown={onMouseDown('left')}
      />
      <div
        className="resize-handle nodrag nopan"
        style={{
          position: 'absolute',
          top: '50%',
          right: -8,
          transform: 'translateY(-50%)',
          width: 12,
          height: 12,
          background: '#2563eb',
          borderRadius: 2,
          cursor: 'ew-resize',
          zIndex: 10
        }}
        onMouseDown={onMouseDown('right')}
      />
    </>
  );
};

// Enhanced BarChart with Recharts - modern styling and rounded corners
const BarChart = ({ config, width = 500, height = 350 }) => {
  let finalData = [];
  let dataKey = 'value';

  if (config?.data && Array.isArray(config.data) && config.data.length > 0) {
    finalData = config.data;
    const firstItem = config.data[0];
    const keys = Object.keys(firstItem);
    dataKey = keys.find(k => k !== 'name') || 'value';
  } else {
    // Legacy fallback
    const bars = config?.bars || [
      { label: 'A', value: 20 }, 
      { label: 'B', value: 45 }, 
      { label: 'C', value: 25 }, 
      { label: 'D', value: 10 }
    ];
    finalData = bars.map((bar, index) => ({
      name: bar.label || `Item ${index + 1}`,
      value: Number(bar.value) || 0,
      fill: bar.color || CHART_COLORS[index % CHART_COLORS.length]
    }));
  }

  return (
    <div style={{ width: width, height: height, overflow: 'hidden' }}>
      <RechartsBarChart width={width} height={height} data={finalData} margin={{ top: 20, right: 20, left: 60, bottom: 60 }}>
        <CartesianGrid {...gridProps} />
        <XAxis 
          dataKey="name" 
          {...axisProps}
          label={{ value: config?.xAxisLabel || 'Categories', position: 'insideBottom', offset: -10, style: { fontSize: 12, fill: '#374151', fontWeight: '500' } }}
        />
        <YAxis 
          {...axisProps}
          label={{ value: config?.yAxisLabel || 'Values', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#374151', fontWeight: '500' } }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6', opacity: 0.6 }} />
        <Bar 
          dataKey={dataKey} 
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
        >
          {finalData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </RechartsBarChart>
    </div>
  );
};

// Enhanced LineChart with Recharts - thicker lines with shadow effects
const LineChart = ({ config, width = 500, height = 350 }) => {
  let finalData = config?.data || [];
  let lines = [];
  
  if (finalData.length > 0) {
    const keys = Object.keys(finalData[0]).filter(k => k !== 'name');
    lines = keys.map((k, i) => ({ 
      key: k, 
      color: k === 'value2' ? '#ef4444' : CHART_COLORS[i % CHART_COLORS.length] 
    }));
  } else if (config?.labels && config?.datasets) {
    // Legacy converter
    finalData = config.labels.map((label, i) => {
      const pt = { name: label };
      config.datasets.forEach((ds, dsi) => { pt[`series${dsi}`] = ds.data[i]; });
      return pt;
    });
    lines = config.datasets.map((ds, i) => ({ 
      key: `series${i}`, 
      color: ds.borderColor || CHART_COLORS[i % CHART_COLORS.length] 
    }));
  } else {
    // Default mockup
    finalData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => ({ name: d, value: Math.floor(Math.random() * 50) + 20 }));
    lines = [{ key: 'value', color: '#3b82f6' }];
  }

  return (
    <div style={{ width: width, height: height, overflow: 'hidden' }}>
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          <filter id="shadow" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.15)"/>
          </filter>
        </defs>
      </svg>
      
      <RechartsLineChart width={width} height={height} data={finalData} margin={{ top: 20, right: 20, left: 60, bottom: 60 }}>
        <CartesianGrid {...gridProps} />
        <XAxis 
          dataKey="name" 
          {...axisProps}
          label={{ value: config?.xAxisLabel || 'Time Period', position: 'insideBottomRight', offset: -10, style: { fontSize: 12, fill: '#374151', fontWeight: '500' } }}
        />
        <YAxis 
          {...axisProps}
          label={{ value: config?.yAxisLabel || 'Values', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#374151', fontWeight: '500' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        {lines.map((line, index) => (
          <Line 
            key={index} 
            type="monotone"
            dataKey={line.key} 
            stroke={line.color} 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: line.color }}
            filter="url(#shadow)"
          />
        ))}
      </RechartsLineChart>
    </div>
  );
};

// Enhanced PieChart with Recharts - modern legend and color distribution
const PieChart = ({ config, width = 400, height = 400 }) => {
  const data = config?.data || [];
  const dataKey = data.length ? Object.keys(data[0]).find(k => k !== 'name' && k !== 'fill') || 'value' : 'value';

  if (!data.length) {
    return <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#6b7280' }}>No Data</div>;
  }

  return (
    <div style={{ width: width, height: height, overflow: 'hidden' }}>
      <RechartsPieChart width={width} height={height}>
        <Pie 
          data={data} 
          cx="50%" 
          cy="50%" 
          innerRadius={0}
          outerRadius={Math.min(width, height) * 0.35} 
          dataKey={dataKey} 
          paddingAngle={2}
          stroke="#fff"
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
          wrapperStyle={{ fontSize: '11px', color: '#4b5563' }}
        />
      </RechartsPieChart>
    </div>
  );
};

// Enhanced RadarChart with Recharts - modern styling
const RadarChart = ({ config, width = 200, height = 200 }) => {
  const data = config?.data || [];
  if (!data.length) {
    return <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#6b7280' }}>No Data</div>;
  }
  
  const keys = Object.keys(data[0]).filter(k => k !== 'subject' && k !== 'fullMark');
  const keyA = keys[0];
  const keyB = keys[1];

  return (
    <div style={{ width: width, height: height, overflow: 'hidden' }}>
      <RechartsRadarChart width={width} height={height} data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6b7280' }} />
        <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={false} axisLine={false} />
        
        <Radar name="Series A" dataKey={keyA} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
        {keyB && (
          <Radar name="Series B" dataKey={keyB} stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
        )}
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
      </RechartsRadarChart>
    </div>
  );
};

// Enhanced AreaChart with Recharts - gradient fills with modern styling
const AreaChart = ({ config, width = 280, height = 120 }) => {
  const data = config?.data || [];
  const firstItem = data[0] || {};
  const keys = Object.keys(firstItem);
  const dataKey1 = keys.find(k => k !== 'name' && k !== 'uv' && k !== 'pv') || 'uv';
  const dataKey2 = keys.find(k => k !== 'name' && k !== dataKey1 && k !== 'uv') || 'pv';

  return (
    <div style={{ width: width, height: height, overflow: 'hidden' }}>
      <RechartsAreaChart width={width} height={height} data={data} margin={{ top: 10, right: 20, left: 50, bottom: 40 }}>
        <defs>
          <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis 
          dataKey="name" 
          {...axisProps}
          label={{ value: config?.xAxisLabel || 'Time', position: 'insideBottomRight', offset: -5, style: { fontSize: 11, fill: '#374151' } }}
        />
        <YAxis 
          {...axisProps}
          label={{ value: config?.yAxisLabel || 'Value', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#374151' } }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }} />
        
        <Area 
          type="monotone" 
          dataKey={dataKey1} 
          stroke="#3b82f6" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorPrimary)" 
          activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
        />
        {dataKey2 && dataKey2 !== 'pv' && (
          <Area 
            type="monotone" 
            dataKey={dataKey2} 
            stroke="#ef4444" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorSecondary)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: '#dc2626' }}
          />
        )}
      </RechartsAreaChart>
    </div>
  );
};

const ScatterChart = ({ config, width = 280, height = 120 }) => {
  const data = config?.data || [];
  return (
    <div style={{ width: width, height: height, overflow: 'hidden' }}>
      <RechartsScatterChart width={width} height={height} data={data} margin={{ top: 10, right: 20, left: 50, bottom: 40 }}>
        <CartesianGrid {...gridProps} />
        <XAxis 
          dataKey="x" 
          {...axisProps}
          label={{ value: config?.xAxisLabel || 'X Axis', position: 'insideBottomRight', offset: -5, style: { fontSize: 11, fill: '#374151' } }}
        />
        <YAxis 
          dataKey="y" 
          {...axisProps}
          label={{ value: config?.yAxisLabel || 'Y Axis', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#374151' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Scatter dataKey="z" fill="#3b82f6" />
      </RechartsScatterChart>
    </div>
  );
};

// DoughnutChart with Recharts - rounded arcs with modern styling
const DoughnutChart = ({ config, width = 200, height = 200 }) => {
  const data = config?.data || [];
  const dataKey = data.length ? Object.keys(data[0]).find(k => k !== 'name' && k !== 'fill') || 'value' : 'value';

  if (!data.length) {
    return <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#6b7280' }}>No Data</div>;
  }

  return (
    <div style={{ width: width, height: height, overflow: 'hidden' }}>
      <RechartsPieChart width={width} height={height}>
        <Pie 
          data={data} 
          cx="50%" 
          cy="50%" 
          innerRadius={Math.min(width, height) * 0.20}
          outerRadius={Math.min(width, height) * 0.35} 
          dataKey={dataKey} 
          paddingAngle={4}
          stroke="none"
          cornerRadius={4}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
          wrapperStyle={{ fontSize: '11px', color: '#4b5563' }}
        />
      </RechartsPieChart>
    </div>
  );
};

const ComposedChart = ({ config, width = 320, height = 150 }) => {
  const data = config?.data || [];
  // Determine data keys dynamically
  const firstItem = data[0] || {};
  const keys = Object.keys(firstItem);
  const dataKeyBar = keys.find(k => k !== 'name' && k !== 'pv' && k !== 'uv') || 'pv';
  const dataKeyLine = keys.find(k => k !== 'name' && k !== dataKeyBar && k !== 'uv') || 'uv';

  return (
    <div style={{ width: width, height: height, overflow: 'hidden' }}>
      <RechartsComposedChart width={width} height={height} data={data} margin={{ top: 20, right: 20, left: 60, bottom: 50 }}>
        <CartesianGrid {...gridProps} />
        <XAxis 
          dataKey="name" 
          {...axisProps}
          label={{ value: config?.xAxisLabel || 'Categories', position: 'insideBottomRight', offset: -8, style: { fontSize: 11, fill: '#374151' } }}
        />
        <YAxis 
          {...axisProps}
          label={{ value: config?.yAxisLabel || 'Values', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#374151' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKeyBar} barSize={20} fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Line type="monotone" dataKey={dataKeyLine} stroke="#ef4444" strokeWidth={2} />
      </RechartsComposedChart>
    </div>
  );
};

const WidgetNode = ({ data = {}, id, isConnectable, isSelected, width: propWidth, height: propHeight }) => {
  const cfg = data.config || {};
  const type = data.widgetType || data.type || data.paletteType;
  const title = data.title || cfg.title || data.label || data.name || '';
  const description = data.description || cfg.description || '';

  // Get widget dimensions from props (if resized) or data strings
  const width = propWidth || data.width || 500;
  const height = propHeight || data.height || 350;

  // Debug logging to help troubleshoot widget rendering
  // console.log('[WidgetNode] Rendering widget:', {
  //   id,
  //   type,
  //   widgetType: data.widgetType,
  //   dataType: data.type,
  //   paletteType: data.paletteType,
  //   hasConfig: !!cfg,
  //   configData: cfg.data,
  //   configBars: cfg.bars,
  //   configDatasets: cfg.datasets,
  //   configLabels: cfg.labels,
  //   configType: cfg.type,
  //   width,
  //   height,
  //   fullConfig: cfg,
  //   fullData: data
  // });

  // Handle resize functionality
  const handleResize = (nodeId, direction, delta, initialSize) => {
    if (data.onResizeNode) {
      data.onResizeNode(nodeId, direction, delta, initialSize);
    }
  };

  // Calculate available height for content
  const uiFilters = (cfg?.baseFilters && Array.isArray(cfg.baseFilters))
    ? cfg.baseFilters.filter(f => f.type && f.options)
    : [];
  const hasFilters = uiFilters.length > 0;

  // Header is ~42px. Filter row is ~48px.
  // We subtract these from the total height so the chart knows its actual available space.
  // This prevents the bottom (X-axis) from being clipped by overflow:hidden.
  const headerHeight = 42;
  const filterRowHeight = hasFilters ? 50 : 0;
  const contentHeight = Math.max(100, height - headerHeight - filterRowHeight);

  // Helper to render embedded filters
  const renderEmbeddedFilters = () => {
    if (!hasFilters) return null;

    return (
      <div className="flex flex-wrap gap-2.5 items-center px-3 py-2.5 border-b border-gray-200/70 bg-gradient-to-r from-white to-slate-50 nodrag w-full" style={{ zIndex: 10, minHeight: 42 }}>
        {uiFilters.map((f, idx) => {
          // Normalize options string
          let opts = [];
          if (typeof f.options === 'string') {
            opts = f.options.split(',').map(s => s.trim());
          } else if (Array.isArray(f.options)) {
            opts = f.options;
          }

          // Config for CompactFilter
          const filterConfig = {
            filterType: f.type || 'text',
            label: '', // Compact mode
            name: f.field,
            filterKey: f.field,
            filterOptions: opts
          };

          return (
            <div key={idx} style={{ maxWidth: 100, flex: '1 1 auto' }}>
              <CompactFilter
                config={filterConfig}
                value={data.individualFilters?.[f.field] || ''}
                onChange={(val) => {
                  if (data.onIndividualFilterChange) {
                    data.onIndividualFilterChange(id, f.field, val);
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const content = (() => {
    switch (type) {
      case 'widget-form': return <FormWidget config={cfg} width={width} height={contentHeight} />;
      case 'compact-filter': return (
        <div style={{ padding: '8px', height: '100%', overflow: 'visible' }} className="nodrag">
          <CompactFilter
            config={cfg}
            value={data.globalFilters?.[cfg.filterKey]}
            onChange={(val) => {
              if (data.onGlobalFilterChange && cfg.filterKey) {
                data.onGlobalFilterChange(cfg.filterKey, val);
              }
            }}
          />
        </div>
      );
      case 'widget-barchart': return <BarChart config={cfg} width={width} height={contentHeight} />;
      case 'widget-linechart': return <LineChart config={cfg} width={width} height={contentHeight} />;
      case 'widget-piechart': return <PieChart config={cfg} width={width} height={contentHeight} />;
      case 'widget-radarchart': return <RadarChart config={cfg} width={width} height={contentHeight} />;
      case 'widget-areachart': return <AreaChart config={cfg} width={width} height={contentHeight} />;
      case 'widget-scatterchart': return <ScatterChart config={cfg} width={width} height={contentHeight} />;
      case 'widget-doughnutchart': return <DoughnutChart config={cfg} width={width} height={contentHeight} />;
      case 'widget-compositechart': return <ComposedChart config={cfg} width={width} height={contentHeight} />;
      case 'smartChart': return <SmartWidget config={cfg} globalFilters={data.globalFilters} />;
      default: return <div style={{ fontSize: 12, color: '#6b7280', width, height: contentHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Widget</div>;
    }
  })();

  return (
    <div
      className={`relative group bg-white/95 rounded-xl shadow-md border border-gray-200/80 flex flex-col overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{ width, height, transition: 'box-shadow 0.2s, border-color 0.2s' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-gray-200/70 bg-gradient-to-r from-slate-50 via-white to-slate-50 handle h-11 shrink-0">
        <div className="flex flex-col min-w-0">
          {/* IconComponent is not defined in the original code, removing for safety */}
          <span className="text-sm font-semibold text-gray-800 truncate select-none" title={title}>
            {title}
          </span>
          {description && (
            <span className="text-[11px] text-gray-500 truncate" title={description}>{description}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Action buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); data.onDeleteNode && data.onDeleteNode(id); }}
            className="h-7 w-7 rounded-md border border-gray-200 bg-white/80 text-gray-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
            title="Delete"
          >
            <Icon name="Scissors" size={14} color="#2563eb" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); data.onCopyNode && data.onCopyNode(id); }}
            className="h-7 w-7 rounded-md border border-gray-200 bg-white/80 text-gray-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
            title="Copy"
          >
            <Icon name="Copy" size={14} color="#2563eb" />
          </button>
        </div>
      </div>

      {/* Render Embedded Filters in a new responsive sub-row */}
      {renderEmbeddedFilters()}

      {/* Content */}
      <div style={{
        padding: 0,
        background: 'transparent',
        border: 'none',
        width: '100%',
        flex: 1,
        minHeight: 0,
        overflow: type === 'compact-filter' ? 'visible' : 'hidden'
      }}>
        {content}
      </div>

      {/* Connection handles */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: isSelected ? 1 : 0 }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: isSelected ? 1 : 0 }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: isSelected ? 1 : 0 }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: isSelected ? 1 : 0 }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: isSelected ? 1 : 0 }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: isSelected ? 1 : 0 }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: isSelected ? 1 : 0 }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: isSelected ? 1 : 0 }} />
    </div>

  );
};

export default WidgetNode;