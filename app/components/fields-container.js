'use client';

import { DraggableField } from './draggable-field';

// Fields Container Component
export default function FieldsContainer({ 
    containerId, 
    fields, 
    onDragOver, 
    onDrop, 
    onDragStart,
    onEditField,
    source = false, // Parameter to indicate if this is a source container
    title = null // Optional title for the container
  }) {
    
    const handleDragStart = (e, field) => {
      // If this is a source container, create a deep copy of the field
      if (source) {
        // Create a deep copy of the field to avoid reference issues
        const fieldCopy = JSON.parse(JSON.stringify(field));
        e.dataTransfer.setData('application/json', JSON.stringify({ 
          field: fieldCopy,
          source: 'source' // Mark this as coming from a source container
        }));
        e.dataTransfer.effectAllowed = 'copy'; // Set to copy instead of move
      } else {
        // Normal container behavior - pass to parent handler
        onDragStart(e, field);
      }
    };

    return (
      <div className={`${source ? 'bg-white p-4 rounded-lg shadow-sm border border-gray-200' : 'min-h-[200px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'}`}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, containerId)} // Always allow drops (but source will be handled differently)
        id={containerId}
      >
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="space-y-2">
          {Array.isArray(fields) && fields.length > 0 ? (
            fields.map((field) => (
              <div key={field.id} className="relative">
                <DraggableField
                  field={field}
                  onDragStart={(e) => handleDragStart(e, field)}
                  isSource={source}
                />
                {!source && (
                  <button 
                    className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded text-xs"
                    onClick={() => onEditField(field.id, containerId)}
                  >
                    Edit
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">No fields available</div>
          )}
        </div>
      </div>
    );
  }