'use client';

import { useState } from 'react';
import { DraggableField } from './draggable-field';

const defaultFields = [
  { id: 'text-field', type: 'text', label: 'Text Field', placeholder: 'Enter text' },
  { id: 'email-field', type: 'email', label: 'Email Field', placeholder: 'Enter email' },
  { id: 'number-field', type: 'number', label: 'Number Field', placeholder: 'Enter number' },
  { id: 'date-field', type: 'date', label: 'Date Field' },
  { id: 'checkbox-field', type: 'checkbox', label: 'Checkbox', checkboxLabel: 'Check this option' },
  { id: 'select-field', type: 'select', label: 'Select Field', options: ['Option 1', 'Option 2', 'Option 3'] },
];

export default function FieldsSource() {
  const [fields] = useState(defaultFields);

  const handleDragStart = (e, field) => {
    // Create a deep copy of the field to avoid reference issues
    const fieldCopy = JSON.parse(JSON.stringify(field));
    e.dataTransfer.setData('application/json', JSON.stringify({ 
      field: fieldCopy,
      source: 'source'
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Available Fields</h3>
      <div className="space-y-2">
        {fields.map((field) => (
          <DraggableField
            key={field.id}
            field={field}
            onDragStart={handleDragStart}
            isSource={true}
          />
        ))}
      </div>
    </div>
  );
} 