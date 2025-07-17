
import React from 'react';
import { MessageSquare, HelpCircle, GitBranch, Play, Square, Image, Video } from 'lucide-react';

const nodeOptions = [
  {
    type: 'message',
    label: 'Message',
    icon: MessageSquare,
    color: 'bg-blue-500',
    description: 'Send a message to user'
  },
  {
    type: 'question',
    label: 'Question',
    icon: HelpCircle,
    color: 'bg-green-500',
    description: 'Ask user a question'
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: GitBranch,
    color: 'bg-yellow-500',
    description: 'Branch based on condition'
  },
  {
    type: 'image',
    label: 'Image',
    icon: Image,
    color: 'bg-purple-500',
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
    <div className="w-64 bg-white border-r border-gray-200 p-4 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Node Library</h2>
        <p className="text-sm text-gray-600">Drag nodes to the canvas</p>
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
          <li>• Drag nodes from library</li>
          <li>• Connect nodes by dragging</li>
          <li>• Click nodes to edit</li>
          <li>• Right-click to delete</li>
        </ul>
      </div>
    </div>
  );
};

export default NodeToolbar;
