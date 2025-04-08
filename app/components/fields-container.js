'use client';

import { DraggableField } from './draggable-field';

// Fields Container Component
export default function FieldsContainer({ 
    containerId, 
    fields, 
    onDragOver, 
    onDrop, 
    onDragStart,
    onEditField 
  }) {
    console.log(fields, "fields");
    return (
      <div 
        className="min-h-[200px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, containerId)}
        id={containerId}
      >
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field.id} className="relative">
              <DraggableField
                field={field}
                onDragStart={(e) => onDragStart(e, field)}
                isSource={false}
              />
              <button 
                className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded text-xs"
                onClick={() => onEditField(field.id, containerId)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  