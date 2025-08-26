import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MapPin, Edit2, Trash2, Check, X, Plus } from 'lucide-react';

const SelectionNode = ({ data, id, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectionData, setSelectionData] = useState(data.selectionData || {
    title: 'Select Option',
    description: 'Choose from the available options',
    selectionType: 'location', // location, category, department, service, etc.
    primaryLabel: 'District',
    secondaryLabel: 'Showroom',
    items: []
  });
  const [tempSelectionData, setTempSelectionData] = useState({ ...selectionData });

  const handleSave = () => {
    setSelectionData({ ...tempSelectionData });
    onUpdate && onUpdate(id, { selectionData: { ...tempSelectionData } });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSelectionData({ ...selectionData });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete && onDelete(id);
  };

  const addPrimaryItem = () => {
    setTempSelectionData({
      ...tempSelectionData,
      items: [...tempSelectionData.items, { 
        name: 'New ' + tempSelectionData.primaryLabel, 
        subItems: [] 
      }]
    });
  };

  const removePrimaryItem = (index) => {
    const newItems = tempSelectionData.items.filter((_, i) => i !== index);
    setTempSelectionData({ ...tempSelectionData, items: newItems });
  };

  const updatePrimaryItem = (index, field, value) => {
    const newItems = [...tempSelectionData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setTempSelectionData({ ...tempSelectionData, items: newItems });
  };

  const addSecondaryItem = (primaryIndex) => {
    const newItems = [...tempSelectionData.items];
    newItems[primaryIndex].subItems.push({
      name: 'New ' + tempSelectionData.secondaryLabel,
      details: '',
      contact: ''
    });
    setTempSelectionData({ ...tempSelectionData, items: newItems });
  };

  const removeSecondaryItem = (primaryIndex, secondaryIndex) => {
    const newItems = [...tempSelectionData.items];
    newItems[primaryIndex].subItems.splice(secondaryIndex, 1);
    setTempSelectionData({ ...tempSelectionData, items: newItems });
  };

  const updateSecondaryItem = (primaryIndex, secondaryIndex, field, value) => {
    const newItems = [...tempSelectionData.items];
    newItems[primaryIndex].subItems[secondaryIndex] = {
      ...newItems[primaryIndex].subItems[secondaryIndex],
      [field]: value
    };
    setTempSelectionData({ ...tempSelectionData, items: newItems });
  };

  const getSelectionTypeLabel = (type) => {
    const labels = {
      location: 'Location',
      category: 'Category',
      department: 'Department',
      service: 'Service',
      product: 'Product',
      course: 'Course',
      event: 'Event',
      custom: 'Custom'
    };
    return labels[type] || 'Selection';
  };

  const getDefaultLabels = (type) => {
    const defaults = {
      location: { primary: 'District', secondary: 'Showroom' },
      category: { primary: 'Category', secondary: 'Subcategory' },
      department: { primary: 'Department', secondary: 'Team' },
      service: { primary: 'Service Type', secondary: 'Service' },
      product: { primary: 'Category', secondary: 'Product' },
      course: { primary: 'Subject', secondary: 'Course' },
      event: { primary: 'Event Type', secondary: 'Event' },
      custom: { primary: 'Primary', secondary: 'Secondary' }
    };
    return defaults[type] || defaults.custom;
  };

  const handleSelectionTypeChange = (type) => {
    const labels = getDefaultLabels(type);
    setTempSelectionData({
      ...tempSelectionData,
      selectionType: type,
      primaryLabel: labels.primary,
      secondaryLabel: labels.secondary
    });
  };

  return (
    <div className="bg-white rounded-lg border-2 border-orange-200 shadow-lg min-w-[350px] group" style={{ backgroundColor: 'white' }}>
      <div className="bg-orange-500 text-white p-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin size={16} />
          <span className="font-medium text-sm">Selection</span>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-orange-600 rounded"
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
              <label className="text-xs text-gray-600 mb-1 block">Selection Type</label>
              <select
                value={tempSelectionData.selectionType}
                onChange={(e) => handleSelectionTypeChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="location">Location</option>
                <option value="category">Category</option>
                <option value="department">Department</option>
                <option value="service">Service</option>
                <option value="product">Product</option>
                <option value="course">Course</option>
                <option value="event">Event</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Title</label>
              <input
                type="text"
                value={tempSelectionData.title}
                onChange={(e) => setTempSelectionData({ ...tempSelectionData, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Select your option"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Description</label>
              <textarea
                value={tempSelectionData.description}
                onChange={(e) => setTempSelectionData({ ...tempSelectionData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                rows={2}
                placeholder="Choose from the available options..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Primary Label</label>
                <input
                  type="text"
                  value={tempSelectionData.primaryLabel}
                  onChange={(e) => setTempSelectionData({ ...tempSelectionData, primaryLabel: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="Primary label"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Secondary Label</label>
                <input
                  type="text"
                  value={tempSelectionData.secondaryLabel}
                  onChange={(e) => setTempSelectionData({ ...tempSelectionData, secondaryLabel: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="Secondary label"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-600">{tempSelectionData.primaryLabel}s & {tempSelectionData.secondaryLabel}s</label>
                <button
                  onClick={addPrimaryItem}
                  className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 flex items-center"
                >
                  <Plus size={10} className="mr-1" />
                  Add {tempSelectionData.primaryLabel}
                </button>
              </div>
              
              <div className="space-y-3">
                {tempSelectionData.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-2 border border-gray-200 rounded space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updatePrimaryItem(itemIndex, 'name', e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded text-xs font-medium"
                        placeholder={`${tempSelectionData.primaryLabel} name`}
                      />
                      <button
                        onClick={() => addSecondaryItem(itemIndex)}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        + {tempSelectionData.secondaryLabel}
                      </button>
                      <button
                        onClick={() => removePrimaryItem(itemIndex)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    
                    <div className="space-y-2 ml-4">
                      {item.subItems.map((subItem, subItemIndex) => (
                        <div key={subItemIndex} className="p-2 border border-gray-100 rounded space-y-1">
                          <input
                            type="text"
                            value={subItem.name}
                            onChange={(e) => updateSecondaryItem(itemIndex, subItemIndex, 'name', e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded text-xs"
                            placeholder={`${tempSelectionData.secondaryLabel} name`}
                          />
                          <input
                            type="text"
                            value={subItem.details}
                            onChange={(e) => updateSecondaryItem(itemIndex, subItemIndex, 'details', e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded text-xs"
                            placeholder="Details (address, description, etc.)"
                          />
                          <input
                            type="text"
                            value={subItem.contact}
                            onChange={(e) => updateSecondaryItem(itemIndex, subItemIndex, 'contact', e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded text-xs"
                            placeholder="Contact info (phone, email, etc.)"
                          />
                          <button
                            onClick={() => removeSecondaryItem(itemIndex, subItemIndex)}
                            className="text-xs text-red-500 hover:bg-red-50 px-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
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
            <div className="text-xs text-orange-600 font-medium mb-1">
              {getSelectionTypeLabel(selectionData.selectionType)}
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">{selectionData.title}</div>
            <div className="text-xs text-gray-600 mb-2">{selectionData.description}</div>
            
            {selectionData.items.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Available:</div>
                {selectionData.items.map((item, index) => (
                  <div key={index} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                    {item.name} ({item.subItems.length} {selectionData.secondaryLabel.toLowerCase()}s)
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
        className="w-3 h-3 bg-white border-2 border-orange-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-orange-500"
      />
    </div>
  );
};

export default SelectionNode;
