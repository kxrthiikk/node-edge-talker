
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, Edit2, Trash2, Check, X } from 'lucide-react';

const MessageNode = ({ data, id, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(data.message || 'Hello!');
  const [tempMessage, setTempMessage] = useState(message);

  const handleSave = () => {
    setMessage(tempMessage);
    onUpdate && onUpdate(id, { message: tempMessage });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempMessage(message);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete && onDelete(id);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-blue-200 shadow-lg min-w-[200px] group">
      <div className="bg-blue-500 text-white p-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare size={16} />
          <span className="font-medium text-sm">Message</span>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-blue-600 rounded"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-red-500 rounded"
              >
                <Trash2 size={12} />
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="p-3">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={tempMessage}
              onChange={(e) => setTempMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
              rows={3}
              placeholder="Enter message..."
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Check size={14} />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded"
            onClick={() => setIsEditing(true)}
          >
            {message}
          </div>
        )}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-blue-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-blue-500"
      />
    </div>
  );
};

export default MessageNode;
