
import React, { useState, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Image, Edit2, Trash2, Check, X, Upload } from 'lucide-react';

const ImageNode = ({ data, id, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '');
  const [caption, setCaption] = useState(data.caption || '');
  const [tempImageUrl, setTempImageUrl] = useState(imageUrl);
  const [tempCaption, setTempCaption] = useState(caption);
  const fileInputRef = useRef(null);

  const handleSave = () => {
    setImageUrl(tempImageUrl);
    setCaption(tempCaption);
    onUpdate && onUpdate(id, { imageUrl: tempImageUrl, caption: tempCaption });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempImageUrl(imageUrl);
    setTempCaption(caption);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete && onDelete(id);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    setTempImageUrl(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-purple-200 shadow-lg min-w-[250px] group">
      <div className="bg-purple-500 text-white p-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image size={16} />
          <span className="font-medium text-sm">Image</span>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-purple-600 rounded"
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
              <label className="text-xs text-gray-600 mb-1 block">Image URL</label>
              <input
                value={tempImageUrl}
                onChange={handleUrlChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter image URL..."
              />
            </div>
            
            <div className="text-center">
              <span className="text-xs text-gray-500">or</span>
            </div>
            
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-2 border border-dashed border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <Upload size={16} />
                <span>Upload Image</span>
              </button>
            </div>
            
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Caption (optional)</label>
              <input
                value={tempCaption}
                onChange={(e) => setTempCaption(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter caption..."
              />
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
            {imageUrl ? (
              <div className="space-y-2">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-sm text-red-500">Failed to load image</div>
                {caption && (
                  <div className="text-sm text-gray-600">{caption}</div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded text-gray-500">
                <div className="text-center">
                  <Image size={24} className="mx-auto mb-2" />
                  <div className="text-sm">Click to add image</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-purple-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-purple-500"
      />
    </div>
  );
};

export default ImageNode;
