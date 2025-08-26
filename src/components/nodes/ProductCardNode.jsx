import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Package, Edit2, Trash2, Check, X, Plus } from 'lucide-react';

const ContentCardNode = ({ data, id, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contentData, setContentData] = useState(data.contentData || {
    title: 'Content Title',
    description: 'Content description',
    price: '',
    imageUrl: '',
    features: [],
    cardType: 'product' // product, service, article, event, etc.
  });
  const [tempContentData, setTempContentData] = useState({ ...contentData });

  const handleSave = () => {
    setContentData({ ...tempContentData });
    onUpdate && onUpdate(id, { contentData: { ...tempContentData } });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempContentData({ ...contentData });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete && onDelete(id);
  };

  const addFeature = () => {
    setTempContentData({
      ...tempContentData,
      features: [...tempContentData.features, 'New Feature']
    });
  };

  const removeFeature = (index) => {
    const newFeatures = tempContentData.features.filter((_, i) => i !== index);
    setTempContentData({ ...tempContentData, features: newFeatures });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...tempContentData.features];
    newFeatures[index] = value;
    setTempContentData({ ...tempContentData, features: newFeatures });
  };

  const getCardTypeLabel = (type) => {
    const labels = {
      product: 'Product',
      service: 'Service',
      article: 'Article',
      event: 'Event',
      course: 'Course',
      package: 'Package',
      deal: 'Deal',
      custom: 'Custom'
    };
    return labels[type] || 'Content';
  };

  return (
    <div className="bg-white rounded-lg border-2 border-green-200 shadow-lg min-w-[300px] group" style={{ backgroundColor: 'white' }}>
      <div className="bg-green-500 text-white p-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package size={16} />
          <span className="font-medium text-sm">Content Card</span>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-green-600 rounded"
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
              <label className="text-xs text-gray-600 mb-1 block">Card Type</label>
              <select
                value={tempContentData.cardType}
                onChange={(e) => setTempContentData({ ...tempContentData, cardType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
                <option value="article">Article</option>
                <option value="event">Event</option>
                <option value="course">Course</option>
                <option value="package">Package</option>
                <option value="deal">Deal</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Title</label>
              <input
                type="text"
                value={tempContentData.title}
                onChange={(e) => setTempContentData({ ...tempContentData, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter title..."
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Description</label>
              <textarea
                value={tempContentData.description}
                onChange={(e) => setTempContentData({ ...tempContentData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                rows={2}
                placeholder="Enter description..."
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Price/Value (optional)</label>
              <input
                type="text"
                value={tempContentData.price}
                onChange={(e) => setTempContentData({ ...tempContentData, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="e.g., $99, Free, Contact for pricing"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Image URL</label>
              <input
                type="text"
                value={tempContentData.imageUrl}
                onChange={(e) => setTempContentData({ ...tempContentData, imageUrl: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-600">Features/Highlights</label>
                <button
                  onClick={addFeature}
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center"
                >
                  <Plus size={10} className="mr-1" />
                  Add
                </button>
              </div>
              
              <div className="space-y-2">
                {tempContentData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 p-1 border border-gray-300 rounded text-xs"
                      placeholder="Feature or highlight"
                    />
                    <button
                      onClick={() => removeFeature(index)}
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
            <div className="text-xs text-green-600 font-medium mb-1">
              {getCardTypeLabel(contentData.cardType)}
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">{contentData.title}</div>
            <div className="text-xs text-gray-600 mb-2">{contentData.description}</div>
            {contentData.price && (
              <div className="text-sm font-bold text-green-600 mb-2">{contentData.price}</div>
            )}
            
            {contentData.imageUrl && (
              <div className="mb-2">
                <div className="w-full h-16 bg-gray-100 rounded border overflow-hidden">
                  <img 
                    src={contentData.imageUrl} 
                    alt="Content" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {contentData.features.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Highlights:</div>
                {contentData.features.map((feature, index) => (
                  <div key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    • {feature}
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
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
    </div>
  );
};

export default ContentCardNode;
