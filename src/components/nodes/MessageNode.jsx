
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, Edit2, Trash2, Check, X, Image as ImageIcon, Plus } from 'lucide-react';

const MessageNode = ({ data, id, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(data.message || 'Hello!');
  const [tempMessage, setTempMessage] = useState(message);
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '');
  const [tempImageUrl, setTempImageUrl] = useState(imageUrl);
  const [showImage, setShowImage] = useState(data.showImage || false);
  const [tempShowImage, setTempShowImage] = useState(showImage);
  const [quickReplies, setQuickReplies] = useState(data.quickReplies || []);
  const [tempQuickReplies, setTempQuickReplies] = useState([...quickReplies]);

  const handleSave = () => {
    setMessage(tempMessage);
    setImageUrl(tempImageUrl);
    setShowImage(tempShowImage);
    setQuickReplies([...tempQuickReplies]);
    onUpdate && onUpdate(id, { 
      message: tempMessage, 
      imageUrl: tempImageUrl, 
      showImage: tempShowImage,
      quickReplies: [...tempQuickReplies]
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempMessage(message);
    setTempImageUrl(imageUrl);
    setTempShowImage(showImage);
    setTempQuickReplies([...quickReplies]);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete && onDelete(id);
  };

  const addQuickReply = () => {
    setTempQuickReplies([...tempQuickReplies, { text: 'New Option', action: 'next' }]);
  };

  const removeQuickReply = (index) => {
    setTempQuickReplies(tempQuickReplies.filter((_, i) => i !== index));
  };

  const updateQuickReply = (index, field, value) => {
    const newQuickReplies = [...tempQuickReplies];
    newQuickReplies[index] = { ...newQuickReplies[index], [field]: value };
    setTempQuickReplies(newQuickReplies);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-blue-200 shadow-lg min-w-[280px] group" style={{ backgroundColor: 'white' }}>
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
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Message Text</label>
              <textarea
                value={tempMessage}
                onChange={(e) => setTempMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                rows={3}
                placeholder="Enter message... (Use emojis like 🚗 🏆 💰)"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Image URL (optional)</label>
              <input
                type="text"
                value={tempImageUrl}
                onChange={(e) => setTempImageUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`showImage-${id}`}
                checked={tempShowImage}
                onChange={(e) => setTempShowImage(e.target.checked)}
                className="rounded"
              />
              <label htmlFor={`showImage-${id}`} className="text-xs text-gray-600">
                Show image with message
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-600">Quick Reply Buttons</label>
                <button
                  onClick={addQuickReply}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center"
                >
                  <Plus size={10} className="mr-1" />
                  Add
                </button>
              </div>
              
              <div className="space-y-2">
                {tempQuickReplies.map((reply, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 border border-gray-200 rounded">
                    <input
                      type="text"
                      value={reply.text}
                      onChange={(e) => updateQuickReply(index, 'text', e.target.value)}
                      className="flex-1 p-1 border border-gray-300 rounded text-xs"
                      placeholder="Button text"
                    />
                    <select
                      value={reply.action}
                      onChange={(e) => updateQuickReply(index, 'action', e.target.value)}
                      className="p-1 border border-gray-300 rounded text-xs"
                    >
                      <option value="next">Next Node</option>
                      <option value="menu">Back to Menu</option>
                      <option value="form">Open Form</option>
                    </select>
                    <button
                      onClick={() => removeQuickReply(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

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
            className="cursor-pointer hover:bg-gray-50 p-1 rounded"
            onClick={() => setIsEditing(true)}
          >
            <div className="text-sm text-gray-700 mb-2">{message}</div>
            
            {showImage && imageUrl && (
              <div className="mb-2">
                <div className="w-full h-20 bg-gray-100 rounded border overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-xs text-red-500">
                    Failed to load
                  </div>
                </div>
              </div>
            )}

            {quickReplies.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500 mb-1">Quick Replies:</div>
                {quickReplies.map((reply, index) => (
                  <div key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {reply.text}
                  </div>
                ))}
              </div>
            )}
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
