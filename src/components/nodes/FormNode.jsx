import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Edit2, Trash2, Check, X, Plus } from 'lucide-react';

const FormNode = ({ data, id, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data.formData || {
    title: 'Form Title',
    description: 'Please fill out this form',
    formType: 'contact', // contact, booking, survey, registration, custom
    fields: [],
    submitMessage: 'Thank you for your submission!',
    submitAction: 'next' // next, email, webhook, custom
  });
  const [tempFormData, setTempFormData] = useState({ ...formData });

  const handleSave = () => {
    setFormData({ ...tempFormData });
    onUpdate && onUpdate(id, { formData: { ...tempFormData } });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempFormData({ ...formData });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete && onDelete(id);
  };

  const addField = () => {
    setTempFormData({
      ...tempFormData,
      fields: [...tempFormData.fields, {
        label: 'New Field',
        type: 'text',
        required: false,
        placeholder: '',
        options: [] // for select, radio, checkbox
      }]
    });
  };

  const removeField = (index) => {
    const newFields = tempFormData.fields.filter((_, i) => i !== index);
    setTempFormData({ ...tempFormData, fields: newFields });
  };

  const updateField = (index, field, value) => {
    const newFields = [...tempFormData.fields];
    newFields[index] = { ...newFields[index], [field]: value };
    setTempFormData({ ...tempFormData, fields: newFields });
  };

  const addFieldOption = (fieldIndex) => {
    const newFields = [...tempFormData.fields];
    newFields[fieldIndex].options = [...(newFields[fieldIndex].options || []), 'New Option'];
    setTempFormData({ ...tempFormData, fields: newFields });
  };

  const removeFieldOption = (fieldIndex, optionIndex) => {
    const newFields = [...tempFormData.fields];
    newFields[fieldIndex].options.splice(optionIndex, 1);
    setTempFormData({ ...tempFormData, fields: newFields });
  };

  const updateFieldOption = (fieldIndex, optionIndex, value) => {
    const newFields = [...tempFormData.fields];
    newFields[fieldIndex].options[optionIndex] = value;
    setTempFormData({ ...tempFormData, fields: newFields });
  };

  const getFormTypeLabel = (type) => {
    const labels = {
      contact: 'Contact Form',
      booking: 'Booking Form',
      survey: 'Survey',
      registration: 'Registration',
      order: 'Order Form',
      feedback: 'Feedback',
      appointment: 'Appointment',
      custom: 'Custom Form'
    };
    return labels[type] || 'Form';
  };

  const getFieldTypeOptions = () => {
    return [
      { value: 'text', label: 'Text Input' },
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone Number' },
      { value: 'number', label: 'Number' },
      { value: 'date', label: 'Date' },
      { value: 'time', label: 'Time' },
      { value: 'textarea', label: 'Text Area' },
      { value: 'select', label: 'Dropdown' },
      { value: 'radio', label: 'Radio Buttons' },
      { value: 'checkbox', label: 'Checkbox' },
      { value: 'file', label: 'File Upload' },
      { value: 'url', label: 'URL' },
      { value: 'password', label: 'Password' }
    ];
  };

  const needsOptions = (type) => {
    return ['select', 'radio', 'checkbox'].includes(type);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-purple-200 shadow-lg min-w-[320px] group" style={{ backgroundColor: 'white' }}>
      <div className="bg-purple-500 text-white p-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText size={16} />
          <span className="font-medium text-sm">Form</span>
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
              <label className="text-xs text-gray-600 mb-1 block">Form Type</label>
              <select
                value={tempFormData.formType}
                onChange={(e) => setTempFormData({ ...tempFormData, formType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="contact">Contact Form</option>
                <option value="booking">Booking Form</option>
                <option value="survey">Survey</option>
                <option value="registration">Registration</option>
                <option value="order">Order Form</option>
                <option value="feedback">Feedback</option>
                <option value="appointment">Appointment</option>
                <option value="custom">Custom Form</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Form Title</label>
              <input
                type="text"
                value={tempFormData.title}
                onChange={(e) => setTempFormData({ ...tempFormData, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Form Title"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Description</label>
              <textarea
                value={tempFormData.description}
                onChange={(e) => setTempFormData({ ...tempFormData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                rows={2}
                placeholder="Form description..."
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Submit Message</label>
              <input
                type="text"
                value={tempFormData.submitMessage}
                onChange={(e) => setTempFormData({ ...tempFormData, submitMessage: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Thank you for your submission!"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Submit Action</label>
              <select
                value={tempFormData.submitAction}
                onChange={(e) => setTempFormData({ ...tempFormData, submitAction: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="next">Continue to Next Node</option>
                <option value="email">Send Email</option>
                <option value="webhook">Send to Webhook</option>
                <option value="database">Save to Database</option>
                <option value="end">End Conversation</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-600">Form Fields</label>
                <button
                  onClick={addField}
                  className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 flex items-center"
                >
                  <Plus size={10} className="mr-1" />
                  Add Field
                </button>
              </div>
              
              <div className="space-y-2">
                {tempFormData.fields.map((field, index) => (
                  <div key={index} className="p-2 border border-gray-200 rounded space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(index, 'label', e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded text-xs"
                        placeholder="Field label"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateField(index, 'type', e.target.value)}
                        className="p-1 border border-gray-300 rounded text-xs"
                      >
                        {getFieldTypeOptions().map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeField(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="Placeholder text"
                    />
                    
                    {needsOptions(field.type) && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-gray-600">Options</label>
                          <button
                            onClick={() => addFieldOption(index)}
                            className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded"
                          >
                            + Add
                          </button>
                        </div>
                        <div className="space-y-1">
                          {(field.options || []).map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-1">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateFieldOption(index, optionIndex, e.target.value)}
                                className="flex-1 p-1 border border-gray-300 rounded text-xs"
                                placeholder="Option text"
                              />
                              <button
                                onClick={() => removeFieldOption(index, optionIndex)}
                                className="p-0.5 text-red-500 hover:bg-red-50 rounded"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`required-${index}`}
                        checked={field.required}
                        onChange={(e) => updateField(index, 'required', e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor={`required-${index}`} className="text-xs text-gray-600">
                        Required field
                      </label>
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
            <div className="text-xs text-purple-600 font-medium mb-1">
              {getFormTypeLabel(formData.formType)}
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">{formData.title}</div>
            <div className="text-xs text-gray-600 mb-2">{formData.description}</div>
            
            {formData.fields.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Fields:</div>
                {formData.fields.map((field, index) => (
                  <div key={index} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                    {field.label} ({field.type}) {field.required && '*'}
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-2">
              Submit: {formData.submitMessage}
            </div>
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

export default FormNode;
