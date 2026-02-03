import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  ConnectionMode,
  MiniMap,
  Panel,
  BackgroundVariant,
} from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize, Eye, EyeOff } from 'lucide-react';
import ConnectionLine from './components/ConnectionLine';

/**
 * EnhancedCanvas - Read-Only Viewer Version
 * 
 * @param {Object} props
 * @param {Array} props.nodes
 * @param {Array} props.edges
 * @param {Function} props.onNodesChange
 * @param {Function} props.onEdgesChange
 * @param {Function} props.onConnect
 * @param {Function} props.onInit
 * @param {Function} props.onNodeClick
 * @param {Object} props.nodeTypes
 * @param {boolean} props.isExecuting
 */
export const EnhancedCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onInit,
  onNodeClick,
  onNodeDoubleClick,
  nodeTypes,
  isExecuting,
  selectedNodes = [],
  onSelectionChange,
  nodesDraggable,
}) => {
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [backgroundVariant, setBackgroundVariant] = useState(BackgroundVariant.Dots);
  const reactFlowInstance = useRef(null);
  const canvasRef = useRef(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  const handleInit = useCallback((instance) => {
    reactFlowInstance.current = instance;
    if (onInit) onInit(instance);
    instance.fitView({ padding: 0.1 });
    try {
      const vp = instance.getViewport();
      setViewport(vp);
    } catch { }
  }, [onInit]);

  const fitView = () => {
    reactFlowInstance.current?.fitView({ padding: 0.1 });
  };

  const zoomIn = () => {
    reactFlowInstance.current?.zoomIn();
  };

  const zoomOut = () => {
    reactFlowInstance.current?.zoomOut();
  };

  // Render Connections manually if needed (legacy visual workflow logic)
  // This logic is preserved from the original file to ensure custom connection types rendering
  const renderBpmnConnections = () => {
    // Build a unique list of connections from nodes[].connections
    const connectionItems = [];
    const seen = new Set();
    nodes.forEach((n) => {
      const arr = Array.isArray(n.connections) ? n.connections : [];
      arr.forEach((c) => {
        // Semantics reversed: toNodeId is visual source, fromNodeId is visual target
        const sourceId = c.toNodeId ? String(c.toNodeId) : String(n.id);
        const targetId = String(c.fromNodeId);
        const key = `${sourceId}-${targetId}-${c.fromHandle || ''}-${c.toHandle || ''}`;
        if (seen.has(key)) return;
        seen.add(key);

        // Find source and target nodes by serverId or client ID
        const sourceNode = nodes.find(sn =>
          String(sn.data?.serverId) === String(sourceId) ||
          String(sn.id) === String(sourceId)
        );
        const targetNode = nodes.find(tn =>
          String(tn.data?.serverId) === String(targetId) ||
          String(tn.id) === String(targetId)
        );

        if (sourceNode && targetNode) {
          connectionItems.push({
            id: key,
            source: sourceNode.id, // Use client ID for source
            target: targetNode.id, // Use client ID for target
            connection_type: c.connection_type || c.type,
            fromHandle: c.toHandle, // swap for visual rendering
            toHandle: c.fromHandle,
            style: c.style, // Include the backend style data
            label: c.label,
            metadata: c.metadata,
            isConditional: c.isConditional,
            fromNodeId: c.fromNodeId,
            toNodeId: c.toNodeId
          });
        }
      });
    });

    if (connectionItems.length === 0) return null;

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        {connectionItems.map((conn) => {
          const findNodeByAnyId = (val) =>
            nodes.find(nn => String(nn.id) === String(val) || String(nn.data?.serverId) === String(val));
          const sourceNode = findNodeByAnyId(conn.source);
          const targetNode = findNodeByAnyId(conn.target);
          if (!sourceNode || !targetNode) return null;

          return (
            <ConnectionLine
              key={conn.id}
              connection={conn}
              sourceNode={sourceNode}
              targetNode={targetNode}
              zoom={viewport.zoom}
              position={{ x: viewport.x, y: viewport.y }}
              isSelected={false}
              readOnly={true}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="relative w-full h-full" ref={canvasRef}>
      {/* Background overlay */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 opacity-50`} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange} // Optional: allow movement if desired, or disable
        onEdgesChange={onEdgesChange}
        onInit={handleInit}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className="transition-all duration-500 bg-white"
        fitView
        attributionPosition="bottom-left"
        connectionMode={ConnectionMode.Loose}
        snapToGrid={true}
        snapGrid={[15, 15]}
        nodesDraggable={nodesDraggable !== undefined ? nodesDraggable : false}
        nodesConnectable={false} // READ ONLY
        elementsSelectable={true}
        selectednodes={selectedNodes.join(',')} // Lowercase for DOM element or remove if not needed for styling
        onSelectionChange={onSelectionChange}
        onMove={(_, v) => setViewport(v)}
        onMoveEnd={(_, v) => setViewport(v)}
        multiSelectionKeyCode={null} // Disable multi-selection
        selectionOnDrag={false} // Disable selection box
        panOnDrag={true} // Enable panning
        minZoom={0.5}
        maxZoom={2}
      >
        {renderBpmnConnections()}

        <Controls
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
          position="bottom-left"
        />
        <Background
          color="#e5e7eb"
          gap={20}
          size={1}
          variant={backgroundVariant}
        />
        {showMiniMap && (
          <MiniMap
            style={{
              backgroundColor: '#f3f4f6',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
              width: 200,
              height: 150
            }}
            nodeColor={() => '#3b82f6'}
            maskColor="rgba(243, 244, 246, 0.7)"
            pannable={true}
            zoomable={true}
            position="bottom-right"
          />
        )}
        <Panel position="top-left" className="space-y-2" style={{ top: '10px', left: '10px', zIndex: 100 }}>
          <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={zoomIn}
                className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 rounded flex items-center justify-center transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={zoomOut}
                className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 rounded flex items-center justify-center transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={fitView}
                className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 rounded flex items-center justify-center transition-colors"
                title="Fit View"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <button
                type="button"
                onClick={() => setShowMiniMap(!showMiniMap)}
                className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 rounded flex items-center justify-center transition-colors"
                title="Toggle Minimap"
              >
                {showMiniMap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};