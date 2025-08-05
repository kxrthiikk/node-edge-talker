
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';

const StartNode = ({ data }) => {
  return (
    <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 shadow-lg min-w-[150px]" style={{ backgroundColor: 'white' }}>
      <div className="flex items-center space-x-2 text-white">
        <Play size={18} />
        <span className="font-medium">Start</span>
      </div>
      <div className="text-green-100 text-sm mt-1">
        {data.label || 'Begin conversation'}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
    </div>
  );
};

export default StartNode;
