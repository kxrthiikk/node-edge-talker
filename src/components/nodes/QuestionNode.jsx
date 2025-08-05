import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { HelpCircle, Edit2, Trash2, Check, X, Plus } from 'lucide-react';

const QuestionNode = ({ data, id, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [question, setQuestion] = useState(data.question || 'What would you like to know?');
  const [options, setOptions] = useState(data.options || ['Option 1', 'Option 2']);
  const [tempQuestion, setTempQuestion] = useState(question);
  const [tempOptions, setTempOptions] = useState([...options]);

  const handleSave = () => {
    setQuestion(tempQuestion);
    setOptions([...tempOptions]);
    onUpdate && onUpdate(id, { question: tempQuestion, options: [...tempOptions] });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempQuestion(question);
    setTempOptions([...options]);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete && onDelete(id);
  };

  const addOption = () => {
    setTempOptions([...tempOptions, `Option ${tempOptions.length + 1}`]);
  };

  const removeOption = (index) => {
    setTempOptions(tempOptions.filter((_, i) => i !== index));
  };

  const updateOption = (index, value) => {
    const newOptions = [...tempOptions];
    newOptions[index] = value;
    setTempOptions(newOptions);
  };

  return (
    <div className="bg-white opacity-100 rounded-lg border-2 border-green-200 shadow-lg min-w-[250px] group" style={{ backgroundColor: 'white' }}>
      <div className="bg-green-500 text-white p-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HelpCircle size={16} />
          <span className="font-medium text-sm">Question</span>
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
              <label className="text-xs text-gray-600 mb-1 block">Question</label>
              <textarea
                value={tempQuestion}
                onChange={(e) => setTempQuestion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                rows={2}
                placeholder="Enter question..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-600">Options</label>
                <button
                  onClick={addOption}
                  className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <Plus size={12} />
                </button>
              </div>

              <div className="space-y-2">
                {tempOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 p-1 border border-gray-300 rounded text-sm"
                      placeholder={`Option ${index + 1}`}
                    />
                    {tempOptions.length > 1 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X size={12} />
                      </button>
                    )}
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
            <div className="text-sm text-gray-700 font-medium mb-2">{question}</div>
            <div className="space-y-1">
              {options.map((option, index) => (
                <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
      {options.map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Bottom}
          id={`option-${index}`}
          style={{ left: `${20 + index * 30}%` }}
          className="w-3 h-3 bg-white border-2 border-green-500"
        />
      ))}
    </div>
  );
};

export default QuestionNode;
