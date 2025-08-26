
import React from 'react';
import { 
  MessageSquare, 
  HelpCircle, 
  GitBranch, 
  Play, 
  Square, 
  Image, 
  Video,
  Package,
  FileText,
  MapPin
} from 'lucide-react';

const nodeOptions = [
  {
    type: 'start',
    label: 'Start',
    icon: Play,
    color: 'bg-green-500',
    description: 'Starting point of the conversation'
  },
  {
    type: 'message',
    label: 'Message',
    icon: MessageSquare,
    color: 'bg-blue-500',
    description: 'Send a message with image and quick replies'
  },
  {
    type: 'question',
    label: 'Question',
    icon: HelpCircle,
    color: 'bg-yellow-500',
    description: 'Ask user a question with multiple options'
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: GitBranch,
    color: 'bg-purple-500',
    description: 'Branch based on user response or condition'
  },
  {
    type: 'image',
    label: 'Image',
    icon: Image,
    color: 'bg-pink-500',
    description: 'Send an image to user'
  },
  {
    type: 'video',
    label: 'Video',
    icon: Video,
    color: 'bg-indigo-500',
    description: 'Send a video to user'
  },
  {
    type: 'contentCard',
    label: 'Content Card',
    icon: Package,
    color: 'bg-green-500',
    description: 'Showcase products, services, or any content'
  },
  {
    type: 'form',
    label: 'Form',
    icon: FileText,
    color: 'bg-purple-500',
    description: 'Collect user information with custom fields'
  },
  {
    type: 'selection',
    label: 'Selection',
    icon: MapPin,
    color: 'bg-orange-500',
    description: 'Let users choose from categories or locations'
  },
  {
    type: 'end',
    label: 'End',
    icon: Square,
    color: 'bg-red-500',
    description: 'End conversation'
  },
];

const NodeToolbar = ({ onNodeSelect, selectedNodeType }) => {
  const handleDragStart = (event, nodeType) => {
    onNodeSelect(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-4 shadow-sm overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Node Library</h2>
        <p className="text-sm text-gray-600">Drag nodes to build your chatbot</p>
      </div>
      
      <div className="space-y-3">
        {nodeOptions.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => handleDragStart(e, node.type)}
              className={`
                p-3 rounded-lg border-2 border-dashed border-gray-300 cursor-grab active:cursor-grabbing
                hover:border-gray-400 hover:bg-gray-50 transition-all duration-200
                ${selectedNodeType === node.type ? 'border-blue-400 bg-blue-50' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded ${node.color} text-white`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{node.label}</div>
                  <div className="text-xs text-gray-500">{node.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">How to use:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Drag nodes from library to canvas</li>
          <li>• Connect nodes by dragging between handles</li>
          <li>• Click nodes to edit their content</li>
          <li>• Right-click to delete nodes</li>
          <li>• Use conditions for branching logic</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">💡 Tips:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Start with a welcome message</li>
          <li>• Use questions to gather information</li>
          <li>• Add content cards for showcasing</li>
          <li>• Use forms for data collection</li>
          <li>• Always end with a clear conclusion</li>
        </ul>
      </div>
    </div>
  );
};

export default NodeToolbar;
