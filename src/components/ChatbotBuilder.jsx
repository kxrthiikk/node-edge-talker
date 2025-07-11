
import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Download } from 'lucide-react';

import NodeToolbar from './NodeToolbar';
import StartNode from './nodes/StartNode';
import MessageNode from './nodes/MessageNode';
import QuestionNode from './nodes/QuestionNode';
import ConditionNode from './nodes/ConditionNode';
import EndNode from './nodes/EndNode';

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  question: QuestionNode,
  condition: ConditionNode,
  end: EndNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'start',
    position: { x: 400, y: 100 },
    data: { label: 'Start Conversation' },
  },
];

const initialEdges = [];

const ChatbotBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStart = useCallback((event, node) => {
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      
      if (!selectedNodeType) return;

      const reactFlowBounds = event.target.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const newNode = {
        id: `${Date.now()}`, // Use timestamp for unique IDs
        type: selectedNodeType,
        position,
        data: getDefaultNodeData(selectedNodeType),
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeType(null);
    },
    [selectedNodeType, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const getDefaultNodeData = (type) => {
    switch (type) {
      case 'message':
        return { message: 'Hello! How can I help you today?' };
      case 'question':
        return { question: 'What would you like to know?', options: ['Option 1', 'Option 2'] };
      case 'condition':
        return { condition: 'Check user input', trueLabel: 'Yes', falseLabel: 'No' };
      case 'end':
        return { message: 'Thank you for chatting!' };
      default:
        return {};
    }
  };

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

  const exportFlow = useCallback(() => {
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(flowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chatbot-flow-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  // Create enhanced node types with delete functionality
  const enhancedNodeTypes = {
    start: (props) => <StartNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
    message: (props) => <MessageNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
    question: (props) => <QuestionNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
    condition: (props) => <ConditionNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
    end: (props) => <EndNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <NodeToolbar 
        onNodeSelect={setSelectedNodeType}
        selectedNodeType={selectedNodeType}
      />
      
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDragStart={onNodeDragStart}
          nodeTypes={enhancedNodeTypes}
          fitView
          className="bg-white"
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#f1f5f9" size={1} />
          <Controls className="bg-white border border-gray-200 rounded-lg shadow-sm" />
          <MiniMap 
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
            nodeColor="#3b82f6"
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          <Panel position="top-center" className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-800">Chatbot Builder</h1>
              <button
                onClick={exportFlow}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
              >
                <Download size={16} />
                <span>Export JSON</span>
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default ChatbotBuilder;
