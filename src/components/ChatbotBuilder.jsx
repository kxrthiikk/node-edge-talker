import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
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
import { Download, Save, Upload, FolderOpen, Plus, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import NodeToolbar from './NodeToolbar';
import StartNode from './nodes/StartNode';
import MessageNode from './nodes/MessageNode';
import QuestionNode from './nodes/QuestionNode';
import ConditionNode from './nodes/ConditionNode';
import EndNode from './nodes/EndNode';
import ImageNode from './nodes/ImageNode';
import VideoNode from './nodes/VideoNode';
import Loader from './Loader';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem
} from './ui/select';

const initialNodes = [
  {
    id: '1',
    type: 'start',
    position: { x: 400, y: 100 },
    data: { label: 'Start Conversation' },
  },
];

const initialEdges = [];

// API base URL - adjust this to match your backend URL
const API_BASE_URL = 'http://whatsapp-admin.local/chatbot-flow';

const ChatbotBuilder = () => {
  // All state hooks FIRST
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState(null);
  const [currentFlowId, setCurrentFlowId] = useState(null);
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState(null);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [availableFlows, setAvailableFlows] = useState([]);
  const [showLoadDropdown, setShowLoadDropdown] = useState(false);
  const [loadingFlows, setLoadingFlows] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showLoadDropdown) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLoadDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLoadDropdown]);

  const { toast } = useToast();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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
        id: `${Date.now()}`,
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
      case 'image':
        return { imageUrl: '', caption: '' };
      case 'video':
        return { videoUrl: '', caption: '' };
      case 'end':
        return { message: 'Thank you for chatting!' };
      default:
        return {};
    }
  };

  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  const updateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
        )
      );
    },
    [setNodes]
  );

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
    link.download = `flow-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const resetForm = useCallback(async () => {
    // Show confirmation dialog if there are unsaved changes
    if (flowName.trim() || flowDescription.trim() || nodes.length > 1 || edges.length > 0) {
      const confirmed = window.confirm('Are you sure you want to create a new flow? This will clear all current work.');
      if (!confirmed) {
        return;
      }
    }

    try {
      // Call the reset form API endpoint
      const response = await fetch(`${API_BASE_URL}/reset-form`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        // Reset the form with the data from the API
        setNodes(initialNodes);
        setEdges(initialEdges);
        setFlowName(result.data.name || '');
        setFlowDescription(result.data.description || '');
        setCurrentFlowId(result.data.id);
        setSaveMessage('Form reset for new flow creation');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        // Fallback to local reset if API fails
        setNodes(initialNodes);
        setEdges(initialEdges);
        setFlowName('');
        setFlowDescription('');
        setCurrentFlowId(null);
        setSaveMessage('Form reset for new flow creation');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      // Fallback to local reset if API call fails
      setNodes(initialNodes);
      setEdges(initialEdges);
      setFlowName('');
      setFlowDescription('');
      setCurrentFlowId(null);
      setSaveMessage('Form reset for new flow creation');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  }, [setNodes, setEdges, flowName, flowDescription, nodes.length, edges.length]);

  // WhatsApp deployment function
  const deployToWhatsApp = useCallback(async () => {
    if (!currentFlowId) {
      setWhatsappMessage('Please save the flow first');
      return;
    }

    setIsDeploying(true);
    setWhatsappMessage('Deploying to WhatsApp...');

    try {
      const response = await fetch(`${API_BASE_URL}/deploy-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flow_id: currentFlowId,
          flow_data: {
            nodes,
            edges,
            timestamp: new Date().toISOString(),
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Flow deployed to WhatsApp successfully!",
          variant: "default",
        });
        setWhatsappStatus('deployed');
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        setWhatsappStatus('failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to deploy to WhatsApp: ${error.message}`,
        variant: "destructive",
      });
      setWhatsappStatus('failed');
    } finally {
      setIsDeploying(false);
    }
  }, [currentFlowId, nodes, edges]);

  // Get WhatsApp status
  const getWhatsappStatus = useCallback(async () => {
    if (!currentFlowId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/get-whatsapp-status?flow_id=${currentFlowId}`);
      const result = await response.json();

      if (result.success) {
        setWhatsappStatus(result.data.status);
      }
    } catch (error) {
      console.error('Error getting WhatsApp status:', error);
    }
  }, [currentFlowId]);

  // Check WhatsApp status when flow is loaded
  useEffect(() => {
    if (currentFlowId) {
      getWhatsappStatus();
    }
  }, [currentFlowId, getWhatsappStatus]);

  // Render WhatsApp status indicator
  const renderWhatsappStatus = () => {
    if (!currentFlowId) return null;

    let statusColor = 'bg-gray-100 text-gray-800';
    let statusIcon = null;
    let statusText = 'Not Deployed';

    switch (whatsappStatus) {
      case 'deployed':
        statusColor = 'bg-green-100 text-green-800';
        statusIcon = <CheckCircle size={12} />;
        statusText = 'Deployed';
        break;
      case 'deploying':
        statusColor = 'bg-yellow-100 text-yellow-800';
        statusText = 'Deploying...';
        break;
      case 'failed':
        statusColor = 'bg-red-100 text-red-800';
        statusIcon = <AlertCircle size={12} />;
        statusText = 'Failed';
        break;
      default:
        statusColor = 'bg-gray-100 text-gray-800';
        statusText = 'Not Deployed';
    }

    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${statusColor}`}>
        {statusIcon}
        <span>{statusText}</span>
      </div>
    );
  };

  const saveFlow = useCallback(async () => {
    if (!flowName.trim()) {
      setSaveMessage('Please enter a flow name');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const flowData = {
        nodes,
        edges,
        timestamp: new Date().toISOString(),
      };

      const payload = {
        name: flowName,
        description: flowDescription,
        flow_data: flowData,
      };

      if (currentFlowId) {
        payload.id = currentFlowId;
      }

      const response = await fetch(`${API_BASE_URL}/save-flow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        // Show appropriate message based on action
        const actionMessage = result.action === 'created' ? 'New flow created successfully!' : 'Flow updated successfully!';
        setSaveMessage(actionMessage);
        
        // Update current flow ID if it's a new flow
        if (result.data && result.data.id) {
          setCurrentFlowId(result.data.id);
        }
        
        // Reset form for new flow creation
        if (result.action === 'created') {
          resetForm();
        }
        
        // Clear message after 3 seconds
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setSaveMessage(`Error saving flow: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [nodes, edges, flowName, flowDescription, currentFlowId, resetForm]);

  const loadFlow = useCallback(async (flowId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/load-flow?id=${flowId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const { flow_data, name, description, id } = result.data;
        
        if (flow_data && flow_data.nodes && flow_data.edges) {
          setNodes(flow_data.nodes);
          setEdges(flow_data.edges);
          setFlowName(name);
          setFlowDescription(description);
          setCurrentFlowId(id);
          setSaveMessage('Flow loaded successfully!');
          setTimeout(() => setSaveMessage(''), 3000);
        }
      } else {
        setSaveMessage(`Error loading flow: ${result.message}`);
      }
    } catch (error) {
      setSaveMessage(`Error loading flow: ${error.message}`);
    }
  }, [setNodes, setEdges]);

  // Fetch available flows from API
  const fetchAvailableFlows = useCallback(async () => {
    setLoadingFlows(true);
    try {
      const response = await fetch(`${API_BASE_URL}/list`);
      const result = await response.json();
      
      if (result.success) {
        setAvailableFlows(result.data || []);
      } else {
        setSaveMessage(`Error fetching flows: ${result.message}`);
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      setSaveMessage(`Error fetching flows: ${error.message}`);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setLoadingFlows(false);
    }
  }, []);

  const showLoadDialog = useCallback(async () => {
    await fetchAvailableFlows();
    setShowLoadDropdown(true);
  }, [fetchAvailableFlows]);

  const handleLoadFlow = useCallback((flowId) => {
    if (flowId) {
      loadFlow(parseInt(flowId));
      setShowLoadDropdown(false);
    }
  }, [loadFlow]);

  // Memoize node types to prevent React Flow warnings
  const nodeTypes = useMemo(() => ({
    start: (props) => <StartNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
    message: (props) => <MessageNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
    question: (props) => <QuestionNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
    condition: (props) => <ConditionNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
    image: (props) => <ImageNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
    video: (props) => <VideoNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
    end: (props) => <EndNode {...props} onDelete={deleteNode} onUpdate={updateNodeData} />,
  }), [deleteNode, updateNodeData]);

  return (
    <div className="flex h-screen bg-gray-50">
      <NodeToolbar 
        onNodeSelect={setSelectedNodeType}
        selectedNodeType={selectedNodeType}
      />
      
      <div className="flex-1 h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-white h-full"
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
              
              {/* Flow Status Indicator */}
              <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                currentFlowId ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {currentFlowId ? `Editing Flow #${currentFlowId}` : 'Creating New Flow'}
              </div>
              
              {/* WhatsApp Status Indicator */}
              {renderWhatsappStatus()}
              
              {/* Flow Name Input */}
              <input
                type="text"
                placeholder="Flow Name"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
              
              {/* Flow Description Input */}
              <input
                type="text"
                placeholder="Description (optional)"
                value={flowDescription}
                onChange={(e) => setFlowDescription(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
              
              {/* Save Button */}
              <button
                onClick={saveFlow}
                disabled={isSaving}
                className="flex items-center space-x-2 px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-sm rounded-md transition-colors"
              >
                <Save size={16} />
                <span style={{minWidth:70}}>
                  {currentFlowId ? 'Update Flow' : 'Create Flow'}
                </span>
              </button>
              
              {/* Deploy to WhatsApp Button */}
              <button
                onClick={deployToWhatsApp}
                disabled={!currentFlowId || isDeploying}
                className="flex items-center space-x-2 px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm rounded-md transition-colors"
              >
                <MessageSquare size={16} />
                <span style={{minWidth:110}}>
                   Deploy to WhatsApp
                 </span>
              </button>
              
              {/* Load Button & Dropdown */}
              <div style={{position:'relative',display:'inline-block'}} ref={dropdownRef}>
                <button
                  onClick={showLoadDialog}
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
                >
                  <FolderOpen size={16} />
                  <span>Load Flow</span>
                </button>
                {showLoadDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '110%',
                      left: 0,
                      zIndex: 1000,
                      minWidth: 220,
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 10,
                      boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
                      padding: 16,
                    }}
                    className="mt-2"
                  >
                    {/* Dropdown Content */}
                    {loadingFlows ? (
                      <div className="flex items-center justify-center py-6 w-full">
                        <Loader />
                      </div>
                    ) : availableFlows.length > 0 ? (
                      <div className="w-full">
                        {availableFlows.map((flow) => (
                          <div
                            key={flow.id}
                            onClick={() => { handleLoadFlow(String(flow.id)); setShowLoadDropdown(false); }}
                            className="hover:bg-gray-100 cursor-pointer rounded-md px-4 py-2 flex flex-col items-start mb-1 transition-colors"
                          >
                            <span className="font-semibold text-gray-900">{flow.name || `Flow ${flow.id}`}</span>
                            <span className="text-xs text-gray-500">ID: {flow.id} - Created: {flow.created_at ? new Date(flow.created_at).toLocaleDateString() : ''}</span>
                            {flow.description && (
                              <span className="text-xs text-gray-400 mt-1">{flow.description}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-6 w-full">
                        <div className="text-lg text-gray-400">No flows available</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* New Flow Button */}
              <button
                onClick={resetForm}
                className="flex items-center space-x-2 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-md transition-colors"
              >
                <Plus size={16} />
                <span>New Flow</span>
              </button>
              
              {/* Export Button */}
              <button
                onClick={exportFlow}
                className="flex items-center space-x-2 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-md transition-colors"
              >
                <Download size={16} />
                <span>Export JSON</span>
              </button>
            </div>
            
            {/* Save Message */}
            {saveMessage && (
              <div className={`mt-2 text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {saveMessage}
              </div>
            )}
            
            {/* WhatsApp Message */}
            {whatsappMessage && (
              <div className={`mt-2 text-sm ${whatsappMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {whatsappMessage}
              </div>
            )}
          </Panel>
        </ReactFlow>
      </div>
      
      
      {/* Full Screen Loader Overlay */}
      {(isSaving || isDeploying) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default ChatbotBuilder;


