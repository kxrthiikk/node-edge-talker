import React, { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Save, MessageSquare, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

// Simple Chatbot Builder Component
const SimpleChatbotBuilder = () => {
  const [chatbotConfig, setChatbotConfig] = useState({
    name: '',
    description: '',
    welcomeMessage: 'Hello! How can I help you today?',
    dataSources: [],
    forms: []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState(null);

  const { toast } = useToast();

  // API base URL - adjust this to match your backend URL
  const API_BASE_URL = 'http://whatsapp-admin.local/chatbot';

  // Add new data source
  const addDataSource = useCallback(() => {
    const newDataSource = {
      id: Date.now(),
      name: '',
      type: 'list', // list, table, cards
      endpoint: '',
      fields: [],
      displayFormat: 'list'
    };
    
    setChatbotConfig(prev => ({
      ...prev,
      dataSources: [...prev.dataSources, newDataSource]
    }));
  }, []);

  // Add new form
  const addForm = useCallback(() => {
    const newForm = {
      id: Date.now(),
      name: '',
      fields: [],
      submitEndpoint: '',
      successMessage: 'Thank you! Your submission has been received.'
    };
    
    setChatbotConfig(prev => ({
      ...prev,
      forms: [...prev.forms, newForm]
    }));
  }, []);

  // Update data source
  const updateDataSource = useCallback((id, updates) => {
    setChatbotConfig(prev => ({
      ...prev,
      dataSources: prev.dataSources.map(ds => 
        ds.id === id ? { ...ds, ...updates } : ds
      )
    }));
  }, []);

  // Update form
  const updateForm = useCallback((id, updates) => {
    setChatbotConfig(prev => ({
      ...prev,
      forms: prev.forms.map(form => 
        form.id === id ? { ...form, ...updates } : form
      )
    }));
  }, []);

  // Delete data source
  const deleteDataSource = useCallback((id) => {
    setChatbotConfig(prev => ({
      ...prev,
      dataSources: prev.dataSources.filter(ds => ds.id !== id)
    }));
  }, []);

  // Delete form
  const deleteForm = useCallback((id) => {
    setChatbotConfig(prev => ({
      ...prev,
      forms: prev.forms.filter(form => form.id !== id)
    }));
  }, []);

  // Add field to data source
  const addDataSourceField = useCallback((dataSourceId) => {
    const newField = {
      id: Date.now(),
      name: '',
      label: '',
      type: 'text', // text, number, date, image, url
      isDisplay: true,
      isSearchable: false
    };

    updateDataSource(dataSourceId, {
      fields: [...(chatbotConfig.dataSources.find(ds => ds.id === dataSourceId)?.fields || []), newField]
    });
  }, [chatbotConfig.dataSources, updateDataSource]);

  // Add field to form
  const addFormField = useCallback((formId) => {
    const newField = {
      id: Date.now(),
      name: '',
      label: '',
      type: 'text', // text, email, number, select, textarea, file
      required: false,
      options: [] // for select type
    };

    updateForm(formId, {
      fields: [...(chatbotConfig.forms.find(form => form.id === formId)?.fields || []), newField]
    });
  }, [chatbotConfig.forms, updateForm]);

  // Save chatbot configuration
  const saveChatbot = useCallback(async () => {
    if (!chatbotConfig.name.trim()) {
      setSaveMessage('Please enter a chatbot name');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatbotConfig),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Chatbot configuration saved successfully!",
          variant: "default",
        });
        setSaveMessage('Chatbot saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setSaveMessage(`Error saving chatbot: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [chatbotConfig, toast]);

  // Deploy to WhatsApp
  const deployToWhatsApp = useCallback(async () => {
    setIsDeploying(true);
    setWhatsappStatus('deploying');

    try {
      const response = await fetch(`${API_BASE_URL}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatbotConfig),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Chatbot deployed to WhatsApp successfully!",
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
        description: `Failed to deploy: ${error.message}`,
        variant: "destructive",
      });
      setWhatsappStatus('failed');
    } finally {
      setIsDeploying(false);
    }
  }, [chatbotConfig, toast]);

  // Data Source Field Component
  const DataSourceField = ({ field, dataSourceId, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempField, setTempField] = useState(field);

    const handleSave = () => {
      onUpdate(dataSourceId, {
        fields: chatbotConfig.dataSources.find(ds => ds.id === dataSourceId).fields.map(f => 
          f.id === field.id ? tempField : f
        )
      });
      setIsEditing(false);
    };

    const handleDelete = () => {
      onUpdate(dataSourceId, {
        fields: chatbotConfig.dataSources.find(ds => ds.id === dataSourceId).fields.filter(f => f.id !== field.id)
      });
    };

    return (
      <div className="border border-gray-200 rounded-lg p-3 mb-2">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Field Name"
              value={tempField.name}
              onChange={(e) => setTempField({...tempField, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Display Label"
              value={tempField.label}
              onChange={(e) => setTempField({...tempField, label: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
            <select
              value={tempField.type}
              onChange={(e) => setTempField({...tempField, type: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="image">Image</option>
              <option value="url">URL</option>
            </select>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tempField.isDisplay}
                  onChange={(e) => setTempField({...tempField, isDisplay: e.target.checked})}
                  className="mr-2"
                />
                Display in list
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tempField.isSearchable}
                  onChange={(e) => setTempField({...tempField, isSearchable: e.target.checked})}
                  className="mr-2"
                />
                Searchable
              </label>
            </div>
            <div className="flex space-x-2">
              <button onClick={handleSave} className="p-1 bg-green-500 text-white rounded">
                <Check size={14} />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 bg-gray-500 text-white rounded">
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{field.name || 'Unnamed Field'}</div>
              <div className="text-sm text-gray-500">{field.label} ({field.type})</div>
            </div>
            <div className="flex space-x-1">
              <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-gray-100 rounded">
                <Edit2 size={14} />
              </button>
              <button onClick={handleDelete} className="p-1 hover:bg-red-100 rounded text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Form Field Component
  const FormField = ({ field, formId, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempField, setTempField] = useState(field);

    const handleSave = () => {
      onUpdate(formId, {
        fields: chatbotConfig.forms.find(form => form.id === formId).fields.map(f => 
          f.id === field.id ? tempField : f
        )
      });
      setIsEditing(false);
    };

    const handleDelete = () => {
      onUpdate(formId, {
        fields: chatbotConfig.forms.find(form => form.id === formId).fields.filter(f => f.id !== field.id)
      });
    };

    return (
      <div className="border border-gray-200 rounded-lg p-3 mb-2">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Field Name"
              value={tempField.name}
              onChange={(e) => setTempField({...tempField, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Display Label"
              value={tempField.label}
              onChange={(e) => setTempField({...tempField, label: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
            <select
              value={tempField.type}
              onChange={(e) => setTempField({...tempField, type: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
              <option value="textarea">Textarea</option>
              <option value="file">File</option>
            </select>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={tempField.required}
                onChange={(e) => setTempField({...tempField, required: e.target.checked})}
                className="mr-2"
              />
              Required field
            </label>
            <div className="flex space-x-2">
              <button onClick={handleSave} className="p-1 bg-green-500 text-white rounded">
                <Check size={14} />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 bg-gray-500 text-white rounded">
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{field.name || 'Unnamed Field'}</div>
              <div className="text-sm text-gray-500">{field.label} ({field.type}) {field.required && '(Required)'}</div>
            </div>
            <div className="flex space-x-1">
              <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-gray-100 rounded">
                <Edit2 size={14} />
              </button>
              <button onClick={handleDelete} className="p-1 hover:bg-red-100 rounded text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">WhatsApp Chatbot Builder</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={saveChatbot}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-md transition-colors"
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Chatbot'}</span>
              </button>
              <button
                onClick={deployToWhatsApp}
                disabled={isDeploying}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition-colors"
              >
                <MessageSquare size={16} />
                <span>{isDeploying ? 'Deploying...' : 'Deploy to WhatsApp'}</span>
              </button>
            </div>
          </div>
          
          {saveMessage && (
            <div className={`text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {saveMessage}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Configuration */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chatbot Name</label>
                <input
                  type="text"
                  value={chatbotConfig.name}
                  onChange={(e) => setChatbotConfig({...chatbotConfig, name: e.target.value})}
                  placeholder="Enter chatbot name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={chatbotConfig.description}
                  onChange={(e) => setChatbotConfig({...chatbotConfig, description: e.target.value})}
                  placeholder="Enter chatbot description"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
                <textarea
                  value={chatbotConfig.welcomeMessage}
                  onChange={(e) => setChatbotConfig({...chatbotConfig, welcomeMessage: e.target.value})}
                  placeholder="Enter welcome message"
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Data Sources</h2>
              <button
                onClick={addDataSource}
                className="flex items-center space-x-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                <Plus size={16} />
                <span>Add Data Source</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {chatbotConfig.dataSources.map((dataSource) => (
                <div key={dataSource.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={dataSource.name}
                      onChange={(e) => updateDataSource(dataSource.id, { name: e.target.value })}
                      placeholder="Data Source Name"
                      className="flex-1 p-2 border border-gray-300 rounded text-sm mr-2"
                    />
                    <button
                      onClick={() => deleteDataSource(dataSource.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={dataSource.endpoint}
                      onChange={(e) => updateDataSource(dataSource.id, { endpoint: e.target.value })}
                      placeholder="API Endpoint URL"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    <select
                      value={dataSource.type}
                      onChange={(e) => updateDataSource(dataSource.id, { type: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="list">List</option>
                      <option value="table">Table</option>
                      <option value="cards">Cards</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Fields</span>
                      <button
                        onClick={() => addDataSourceField(dataSource.id)}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        + Add Field
                      </button>
                    </div>
                    {dataSource.fields.map((field) => (
                      <DataSourceField
                        key={field.id}
                        field={field}
                        dataSourceId={dataSource.id}
                        onUpdate={updateDataSource}
                        onDelete={deleteDataSource}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forms */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Forms</h2>
              <button
                onClick={addForm}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                <Plus size={16} />
                <span>Add Form</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chatbotConfig.forms.map((form) => (
                <div key={form.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateForm(form.id, { name: e.target.value })}
                      placeholder="Form Name"
                      className="flex-1 p-2 border border-gray-300 rounded text-sm mr-2"
                    />
                    <button
                      onClick={() => deleteForm(form.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={form.submitEndpoint}
                      onChange={(e) => updateForm(form.id, { submitEndpoint: e.target.value })}
                      placeholder="Submit Endpoint URL"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    <textarea
                      value={form.successMessage}
                      onChange={(e) => updateForm(form.id, { successMessage: e.target.value })}
                      placeholder="Success Message"
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Form Fields</span>
                      <button
                        onClick={() => addFormField(form.id)}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        + Add Field
                      </button>
                    </div>
                    {form.fields.map((field) => (
                      <FormField
                        key={field.id}
                        field={field}
                        formId={form.id}
                        onUpdate={updateForm}
                        onDelete={deleteForm}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleChatbotBuilder;
