
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch, Edit2, Trash2, Check, X } from 'lucide-react';

const ConditionNode = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [condition, setCondition] = useState(data.condition || 'Check condition');
  const [trueLabel, setTrueLabel] = useState(data.trueLabel || 'Yes');
  const [falseLabel, setFalseLabel] = useState(data.falseLabel || 'No');
  const [tempCondition, setTempCondition] = useState(condition);
  const [tempTrueLabel, setTempTrueLabel] = useState(trueLabel);
  const [tempFalseLabel, setTempFalseLabel] = useState(falseLabel);

  const handleSave = () => {
    setCondition(tempCondition);
    setTrueLabel(tempTrueLabel);
    setFalseLabel(tempFalseLabel);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempCondition(condition);
    setTempTrueLabel(trueLabel);
    setTempFalseLabel(falseLabel);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-yellow-200 shadow-lg min-w-[200px] group">
      <div className="bg-yellow-500 text-white p-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitBranch size={16} />
          <span className="font-medium text-sm">Condition</span>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-yellow-600 rounded"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={() => console.log('Delete node:', id)}
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
              <label className="text-xs text-gray-600 mb-1 block">Condition</label>
              <input
                value={tempCondition}
                onChange={(e) => setTempCondition(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter condition..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">True Label</label>
                <input
                  value={tempTrueLabel}
                  onChange={(e) => setTempTrueLabel(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                  placeholder="Yes"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">False Label</label>
                <input
                  value={tempFalseLabel}
                  onChange={(e) => setTempFalseLabel(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                  placeholder="No"
                />
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
            <div className="text-sm text-gray-700 font-medium mb-2">{condition}</div>
            <div className="flex justify-between text-xs">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{trueLabel}</span>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded">{falseLabel}</span>
            </div>
          </div>
        )}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-yellow-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '25%' }}
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '75%' }}
        className="w-3 h-3 bg-white border-2 border-red-500"
      />
    </div>
  );
};

export default ConditionNode;
