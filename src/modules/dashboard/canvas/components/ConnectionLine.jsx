import React from 'react';

const ConnectionLine = ({
  connection,
  sourceNode,
  targetNode,
  zoom,
  position,
  isSelected,
  onDoubleClick
}) => {
  // Calculate connection points based on handles
  const sourceWidth = sourceNode?.data?.width || sourceNode?.size?.width || 120;
  const sourceHeight = sourceNode?.data?.height || sourceNode?.size?.height || 60;
  const targetWidth = targetNode?.data?.width || targetNode?.size?.width || 120;
  const targetHeight = targetNode?.data?.height || targetNode?.size?.height || 60;
  const padding = 2;

  const parseSide = (handle) => {
    const h = String(handle || '').toLowerCase();
    if (h.includes('left')) return 'left';
    if (h.includes('right')) return 'right';
    if (h.includes('top')) return 'top';
    if (h.includes('bottom')) return 'bottom';
    return 'right';
  };

  const sourceSide = parseSide(connection.fromHandle);
  const targetSide = parseSide(connection.toHandle);

  const getPoint = (node, width, height, side) => {
    const x = node.position.x;
    const y = node.position.y;
    switch (side) {
      case 'left':
        return { x: (x - padding) * zoom + position.x, y: (y + height / 2) * zoom + position.y };
      case 'right':
        return { x: (x + width + padding) * zoom + position.x, y: (y + height / 2) * zoom + position.y };
      case 'top':
        return { x: (x + width / 2) * zoom + position.x, y: (y - padding) * zoom + position.y };
      case 'bottom':
        return { x: (x + width / 2) * zoom + position.x, y: (y + height + padding) * zoom + position.y };
      default:
        return { x: (x + width + padding) * zoom + position.x, y: (y + height / 2) * zoom + position.y };
    }
  };

  const { x: sourceX, y: sourceY } = getPoint(sourceNode, sourceWidth, sourceHeight, sourceSide);
  const { x: targetX, y: targetY } = getPoint(targetNode, targetWidth, targetHeight, targetSide);

  // Calculate control points for smooth curve
  const dx = Math.abs(targetX - sourceX);
  const dy = Math.abs(targetY - sourceY);
  const controlOffset = Math.max(40, Math.min(0.5 * Math.max(dx, dy), 240));

  // Adjust control points based on sides for nicer curves
  const controlForSide = (x, y, side, sign) => {
    switch (side) {
      case 'left':
        return { cx: x - controlOffset, cy: y };
      case 'right':
        return { cx: x + controlOffset, cy: y };
      case 'top':
        return { cx: x, cy: y - controlOffset };
      case 'bottom':
        return { cx: x, cy: y + controlOffset };
      default:
        return { cx: x + sign * controlOffset, cy: y };
    }
  };

  const { cx: sourceControlX, cy: sourceControlY } = controlForSide(sourceX, sourceY, sourceSide, +1);
  const { cx: targetControlX, cy: targetControlY } = controlForSide(targetX, targetY, targetSide, -1);

  // Create SVG path for curved connection
  const pathData = `M ${sourceX} ${sourceY} C ${sourceControlX} ${sourceControlY} ${targetControlX} ${targetControlY} ${targetX} ${targetY}`;

  const getConnectionColor = () => {
    // Only use backend style properties - no hardcoded fallbacks
    const color = connection.style?.stroke || '#4F46E5';
    console.log('[ConnectionLine] getConnectionColor:', { 
      connectionId: connection.id, 
      fullConnection: connection,
      style: connection.style, 
      stroke: connection.style?.stroke,
      color 
    });
    return color;
  };

  // Removed hardcoded shine effects - all styling comes from backend

  const getConnectionWidth = () => {
    // Only use backend style properties - no hardcoded fallbacks
    return connection.style?.strokeWidth || 3.0; // Only fallback to default width if no backend style
  };

  const getDashArray = () => {
    // Only use backend style properties - no hardcoded fallbacks
    return connection.style?.strokeDasharray || null; // Only fallback to solid if no backend style
  };

  const getMarkerEnd = () => {
    // Only use backend style properties - no hardcoded fallbacks
    if (connection.style?.arrowhead === 'none') return undefined;
    return connection.style?.arrowhead ? `url(#arrowhead-${connection.style.arrowhead})` : 'url(#arrowhead-arrow)';
  };

  const getMarkerStart = () => {
    // Only use backend style properties - no hardcoded fallbacks
    return connection.style?.markerStart || undefined;
  };

  const getArrowColor = () => {
    // Only use backend style properties - no hardcoded fallbacks
    return connection.style?.arrowColor || connection.style?.stroke || '#4F46E5';
  };

  const getArrowSize = () => {
    // Only use backend style properties - no hardcoded fallbacks
    return connection.style?.arrowSize || 10.0;
  };

  const handleDblClick = (e) => {
    e.stopPropagation();
    if (typeof connection?.onDoubleClick === 'function') {
      connection.onDoubleClick();
    }
  };

  return (
    <g className="pointer-events-none">
      {/* Removed hardcoded gradient definitions - all styling comes from backend */}

      {/* Main stroke - only use backend style properties */}
      <path
        d={pathData}
        fill="none"
        stroke={getConnectionColor()}
        strokeWidth={getConnectionWidth()}
        className="transition-all"
        strokeDasharray={getDashArray()}
        strokeOpacity={connection.style?.strokeOpacity || 1.0}
        markerStart={getMarkerStart()}
        markerEnd={getMarkerEnd()}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (typeof onDoubleClick === 'function') onDoubleClick();
          else if (typeof connection?.onDoubleClick === 'function') connection.onDoubleClick();
        }}
        style={{ pointerEvents: 'stroke', vectorEffect: 'non-scaling-stroke', cursor: 'pointer' }}
        strokeLinecap="round"
      />

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead-arrow"
          markerWidth={getArrowSize()}
          markerHeight={getArrowSize() * 0.7}
          refX={getArrowSize() - 1}
          refY={getArrowSize() * 0.35}
          orient="auto"
        >
          <polygon
            points={`0 0, ${getArrowSize()} ${getArrowSize() * 0.35}, 0 ${getArrowSize() * 0.7}`}
            fill={getArrowColor()}
          />
        </marker>
        <marker
          id="arrowhead-solid"
          markerWidth={getArrowSize()}
          markerHeight={getArrowSize() * 0.7}
          refX={getArrowSize() - 1}
          refY={getArrowSize() * 0.35}
          orient="auto"
        >
          <polygon
            points={`0 0, ${getArrowSize()} ${getArrowSize() * 0.35}, 0 ${getArrowSize() * 0.7}`}
            fill={getArrowColor()}
          />
        </marker>
        <marker
          id="arrowhead-circle"
          markerWidth={getArrowSize()}
          markerHeight={getArrowSize()}
          refX={getArrowSize() - 1}
          refY={getArrowSize() * 0.5}
          orient="auto"
        >
          <circle 
            cx={getArrowSize() - 1} 
            cy={getArrowSize() * 0.5} 
            r={getArrowSize() * 0.3} 
            fill={getArrowColor()} 
          />
        </marker>
        <marker
          id="arrowhead-diamond"
          markerWidth={getArrowSize()}
          markerHeight={getArrowSize()}
          refX={getArrowSize() - 1}
          refY={getArrowSize() * 0.5}
          orient="auto"
        >
          <polygon
            points={`${getArrowSize() - 1} 0, ${getArrowSize()} ${getArrowSize() * 0.5}, ${getArrowSize() - 1} ${getArrowSize()}, ${getArrowSize() - 2} ${getArrowSize() * 0.5}`}
            fill={getArrowColor()}
          />
        </marker>
        <marker
          id="arrowhead-open"
          markerWidth={getArrowSize()}
          markerHeight={getArrowSize() * 0.7}
          refX={getArrowSize() - 1}
          refY={getArrowSize() * 0.35}
          orient="auto"
        >
          <polygon
            points={`0 0, ${getArrowSize()} ${getArrowSize() * 0.35}, 0 ${getArrowSize() * 0.7}`}
            fill="#ffffff"
            stroke={getArrowColor()}
            strokeWidth="2"
          />
        </marker>
        <marker
          id="message-start"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
        >
          <circle cx="4" cy="4" r="3" fill="#ffffff" stroke={getConnectionColor()} strokeWidth="2" />
        </marker>
      </defs>

      {/* Connection label (if needed) */}
      {connection.label && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2 - 10}
          textAnchor="middle"
          className="pointer-events-none"
          fill={connection.style?.labelColor || '#000000'}
          fontSize={connection.style?.labelFontSize || 12}
          fontFamily={connection.style?.labelFontFamily || 'Arial, sans-serif'}
          fontWeight={connection.style?.labelFontWeight || 'normal'}
        >
          {connection.label}
        </text>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <path
          d={pathData}
          fill="none"
          stroke={getConnectionColor()}
          strokeWidth={getConnectionWidth() + 2}
          opacity="0.3"
          className="pointer-events-none"
        />
      )}
    </g>
  );
};

export default ConnectionLine;