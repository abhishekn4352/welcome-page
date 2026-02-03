/**
 * Utility functions for calculating connection points and paths
 */

/**
 * Calculate connection points between two nodes
 * @param {Object} sourceNode - Source node object
 * @param {Object} targetNode - Target node object
 * @param {number} zoom - Current zoom level
 * @param {Object} position - Canvas position offset
 * @param {string} sourceHandle - Source handle position (optional)
 * @param {string} targetHandle - Target handle position (optional)
 * @returns {Object} Connection points and path data
 */
export const calculateConnectionPoints = (sourceNode, targetNode, zoom, position, sourceHandle = 'right', targetHandle = 'left') => {
  // Get actual node dimensions
  const sourceWidth = sourceNode.data?.width || 200;
  const sourceHeight = sourceNode.data?.height || 100;
  const targetWidth = targetNode.data?.width || 200;
  const targetHeight = targetNode.data?.height || 100;

  // Calculate source connection point
  let sourceX, sourceY;
  switch (sourceHandle) {
    case 'left':
      sourceX = sourceNode.position.x * zoom + position.x;
      sourceY = (sourceNode.position.y + sourceHeight / 2) * zoom + position.y;
      break;
    case 'right':
      sourceX = (sourceNode.position.x + sourceWidth) * zoom + position.x;
      sourceY = (sourceNode.position.y + sourceHeight / 2) * zoom + position.y;
      break;
    case 'top':
      sourceX = (sourceNode.position.x + sourceWidth / 2) * zoom + position.x;
      sourceY = sourceNode.position.y * zoom + position.y;
      break;
    case 'bottom':
      sourceX = (sourceNode.position.x + sourceWidth / 2) * zoom + position.x;
      sourceY = (sourceNode.position.y + sourceHeight) * zoom + position.y;
      break;
    default:
      sourceX = (sourceNode.position.x + sourceWidth) * zoom + position.x;
      sourceY = (sourceNode.position.y + sourceHeight / 2) * zoom + position.y;
  }

  // Calculate target connection point
  let targetX, targetY;
  switch (targetHandle) {
    case 'left':
      targetX = targetNode.position.x * zoom + position.x;
      targetY = (targetNode.position.y + targetHeight / 2) * zoom + position.y;
      break;
    case 'right':
      targetX = (targetNode.position.x + targetWidth) * zoom + position.x;
      targetY = (targetNode.position.y + targetHeight / 2) * zoom + position.y;
      break;
    case 'top':
      targetX = (targetNode.position.x + targetWidth / 2) * zoom + position.x;
      targetY = targetNode.position.y * zoom + position.y;
      break;
    case 'bottom':
      targetX = (targetNode.position.x + targetWidth / 2) * zoom + position.x;
      targetY = (targetNode.position.y + targetHeight) * zoom + position.y;
      break;
    default:
      targetX = targetNode.position.x * zoom + position.x;
      targetY = (targetNode.position.y + targetHeight / 2) * zoom + position.y;
  }

  // Calculate control points for smooth curve
  const distance = Math.abs(targetX - sourceX);
  const controlOffset = Math.min(distance * 0.5, 100); // Limit control offset for better curves
  
  let sourceControlX, sourceControlY, targetControlX, targetControlY;
  
  if (sourceHandle === 'right' && targetHandle === 'left') {
    // Horizontal connection
    sourceControlX = sourceX + controlOffset;
    sourceControlY = sourceY;
    targetControlX = targetX - controlOffset;
    targetControlY = targetY;
  } else if (sourceHandle === 'left' && targetHandle === 'right') {
    // Reverse horizontal connection
    sourceControlX = sourceX - controlOffset;
    sourceControlY = sourceY;
    targetControlX = targetX + controlOffset;
    targetControlY = targetY;
  } else if (sourceHandle === 'bottom' && targetHandle === 'top') {
    // Vertical connection
    sourceControlX = sourceX;
    sourceControlY = sourceY + controlOffset;
    targetControlX = targetX;
    targetControlY = targetY - controlOffset;
  } else if (sourceHandle === 'top' && targetHandle === 'bottom') {
    // Reverse vertical connection
    sourceControlX = sourceX;
    sourceControlY = sourceY - controlOffset;
    targetControlX = targetX;
    targetControlY = targetY + controlOffset;
  } else {
    // Default to horizontal
    sourceControlX = sourceX + controlOffset;
    sourceControlY = sourceY;
    targetControlX = targetX - controlOffset;
    targetControlY = targetY;
  }

  // Create SVG path for curved connection
  const pathData = `M ${sourceX} ${sourceY} C ${sourceControlX} ${sourceControlY} ${targetControlX} ${targetControlY} ${targetX} ${targetY}`;

  return {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY,
    pathData,
    distance
  };
};

/**
 * Get connection color based on connection type and state
 * @param {Object} connection - Connection object
 * @param {boolean} isSelected - Whether connection is selected
 * @returns {string} Color value
 */
export const getConnectionColor = (connection, isSelected) => {
  if (isSelected) return '#2563EB'; // Primary blue
  switch (connection.type) {
    case 'data': return '#64748B'; // Slate
    case 'error': return '#DC2626'; // Red
    case 'success': return '#059669'; // Green
    case 'warning': return '#D97706'; // Amber
    default: return '#64748B';
  }
};

/**
 * Get connection width based on selection state
 * @param {boolean} isSelected - Whether connection is selected
 * @returns {number} Stroke width
 */
export const getConnectionWidth = (isSelected) => {
  return isSelected ? 3 : 2;
};

/**
 * Calculate optimal spacing between nodes
 * @param {Object} sourceNode - Source node
 * @param {Object} targetNode - Target node
 * @returns {number} Recommended spacing
 */
export const calculateOptimalSpacing = (sourceNode, targetNode) => {
  const sourceWidth = sourceNode.data?.width || 200;
  const targetWidth = targetNode.data?.width || 200;
  const avgWidth = (sourceWidth + targetWidth) / 2;
  return Math.max(50, avgWidth * 0.3); // Minimum 50px, or 30% of average width
};


