'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

// Field Item Component
const DraggableField = ({ field, onDragStart }) => {
  return (
    <div
      className="p-4 my-2 rounded shadow bg-white cursor-move"
      draggable="true"
      onDragStart={(e) => onDragStart(e, field)}
      data-id={field.id}
    >
      <div className="font-medium">{field.label}</div>
      {field.type === 'text' && (
        <input type="text" placeholder={field.placeholder || 'Text input'} className="mt-2 p-2 border rounded w-full" disabled />
      )}
      {field.type === 'checkbox' && (
        <div className="mt-2">
          <input type="checkbox" id={`checkbox-${field.id}`} className="mr-2" disabled />
          <label htmlFor={`checkbox-${field.id}`}>{field.checkboxLabel || 'Checkbox option'}</label>
        </div>
      )}
      {field.type === 'date' && (
        <input type="date" className="mt-2 p-2 border rounded w-full" disabled />
      )}
    </div>
  );
};

// Fields Container Component
const FieldsContainer = ({ 
  containerId, 
  fields, 
  onDragOver, 
  onDrop, 
  onDragStart,
  onEditField 
}) => {
  console.log(fields, "fields");
  return (
    <div 
      className="p-4 border-2 border-gray-300 rounded min-h-64"
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, containerId)}
      id={containerId}
    >
      {fields.map((field) => (
        <div key={field.id} className="relative">
          <DraggableField field={field} onDragStart={onDragStart} />
          <button 
            className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded text-xs"
            onClick={() => onEditField(field.id, containerId)}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

// Field Editor Modal
const FieldEditorModal = ({ field, onSave, onClose }) => {
  const [editedField, setEditedField] = useState(field);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedField(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Field</h2>
        
        <div className="mb-4">
          <label className="block mb-2">Field Label</label>
          <input
            type="text"
            name="label"
            value={editedField.label}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Field Type</label>
          <select
            name="type"
            value={editedField.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="text">Text Input</option>
            <option value="checkbox">Checkbox</option>
            <option value="date">Date Picker</option>
          </select>
        </div>

        {editedField.type === 'text' && (
          <div className="mb-4">
            <label className="block mb-2">Placeholder</label>
            <input
              type="text"
              name="placeholder"
              value={editedField.placeholder || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {editedField.type === 'checkbox' && (
          <div className="mb-4">
            <label className="block mb-2">Checkbox Label</label>
            <input
              type="text"
              name="checkboxLabel"
              value={editedField.checkboxLabel || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(editedField)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [container1Fields, setContainer1Fields] = useState([]);
  const [container2Fields, setContainer2Fields] = useState([]);
  const [draggedField, setDraggedField] = useState(null);
  const [dragSourceContainer, setDragSourceContainer] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingContainer, setEditingContainer] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize fields from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultFields = [
        { id: `field1-${Date.now()}`, type: 'text', label: 'First Name', placeholder: 'Enter first name' },
        { id: `field2-${Date.now()}`, type: 'text', label: 'Last Name', placeholder: 'Enter last name' },
        { id: `field3-${Date.now()}`, type: 'checkbox', label: 'Subscribe', checkboxLabel: 'Subscribe to newsletter' },
        { id: `field4-${Date.now()}`, type: 'date', label: 'Birth Date' }
      ];

      try {
        const saved1 = localStorage.getItem('container1Fields');
        const saved2 = localStorage.getItem('container2Fields');
        
        if (saved1) {
          setContainer1Fields(JSON.parse(saved1));
        } else {
          setContainer1Fields(defaultFields);
          localStorage.setItem('container1Fields', JSON.stringify(defaultFields));
        }
        
        if (saved2) {
          setContainer2Fields(JSON.parse(saved2));
        } else {
          setContainer2Fields([]);
          localStorage.setItem('container2Fields', JSON.stringify([]));
        }
      } catch (err) {
        console.error('Error initializing fields:', err);
        setContainer1Fields(defaultFields);
        setContainer2Fields([]);
      }
      
      setIsInitialized(true);
    }
  }, []);

  // Handle storage events from other tabs
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      const handleStorage = (e) => {
        if (e.key === 'container1Fields' && e.newValue) {
          try {
            const newFields = JSON.parse(e.newValue);
            setContainer1Fields(newFields);
          } catch (err) {
            console.error('Error parsing container1Fields:', err);
          }
        } else if (e.key === 'container2Fields' && e.newValue) {
          try {
            const newFields = JSON.parse(e.newValue);
            setContainer2Fields(newFields);
          } catch (err) {
            console.error('Error parsing container2Fields:', err);
          }
        }
      };

      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, [isInitialized]);

  const updateFields = (containerId, newFields) => {
    if (typeof window !== 'undefined' && isInitialized) {
      if (containerId === 'container1') {
        setContainer1Fields(newFields);
        localStorage.setItem('container1Fields', JSON.stringify(newFields));
      } else {
        setContainer2Fields(newFields);
        localStorage.setItem('container2Fields', JSON.stringify(newFields));
      }
    }
  };

  const handleDragStart = (e, field) => {
    const container = e.target.closest('[id^="container"]')?.id;
    setDragSourceContainer(container);
    setDraggedField(field);
    e.dataTransfer.setData('application/json', JSON.stringify({ field, sourceContainer: container }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetContainerId) => {
    e.preventDefault();
    
    if (!isInitialized) return;
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;
      
      const { field, sourceContainer } = JSON.parse(data);
      if (!field || !sourceContainer) return;
      
      // Get the drop position
      const container = e.target.closest('[id^="container"]');
      const containerRect = container.getBoundingClientRect();
      const dropY = e.clientY - containerRect.top;
      
      // Find the closest field element
      const fieldElements = container.querySelectorAll('[data-id]');
      let dropIndex = -1;
      
      for (let i = 0; i < fieldElements.length; i++) {
        const fieldRect = fieldElements[i].getBoundingClientRect();
        const fieldMiddle = fieldRect.top + fieldRect.height / 2 - containerRect.top;
        
        if (dropY < fieldMiddle) {
          dropIndex = i;
          break;
        }
      }
      
      if (dropIndex === -1) {
        dropIndex = fieldElements.length;
      }
      
      // Create a new field with a unique ID
      const newField = {
        ...field,
        id: `${field.id}-${Date.now()}`
      };
      
      if (sourceContainer === targetContainerId) {
        // Reordering within the same container
        let currentFields = sourceContainer === 'container1' ? container1Fields : container2Fields;
        
        // Remove the field from its current position
        currentFields = currentFields.filter(f => f.id !== field.id);
        
        // Insert at the new position
        currentFields.splice(dropIndex, 0, newField);
        
        // Update the container
        if (sourceContainer === 'container1') {
          updateFields('container1', currentFields);
        } else {
          updateFields('container2', currentFields);
        }
      } else {
        // Moving between containers
        // Remove from source container
        if (sourceContainer === 'container1') {
          const newFields = container1Fields.filter(f => f.id !== field.id);
          updateFields('container1', newFields);
        } else if (sourceContainer === 'container2') {
          const newFields = container2Fields.filter(f => f.id !== field.id);
          updateFields('container2', newFields);
        }
        
        // Add to target container at the drop position
        if (targetContainerId === 'container1') {
          let newFields = [...container1Fields];
          newFields.splice(dropIndex, 0, newField);
          updateFields('container1', newFields);
        } else if (targetContainerId === 'container2') {
          let newFields = [...container2Fields];
          newFields.splice(dropIndex, 0, newField);
          updateFields('container2', newFields);
        }
      }
    } catch (err) {
      console.error('Error handling drop:', err);
    }
    
    setDraggedField(null);
    setDragSourceContainer(null);
  };

  const handleEditField = (fieldId, containerId) => {
    if (!isInitialized) return;
    
    let fieldToEdit;
    
    if (containerId === 'container1') {
      fieldToEdit = container1Fields.find(field => field.id === fieldId);
    } else {
      fieldToEdit = container2Fields.find(field => field.id === fieldId);
    }
    
    if (fieldToEdit) {
      setEditingField(fieldToEdit);
      setEditingContainer(containerId);
    }
  };

  const handleSaveField = (updatedField) => {
    if (!isInitialized) return;
    
    if (editingContainer === 'container1') {
      const newFields = container1Fields.map(field => 
        field.id === updatedField.id ? updatedField : field
      );
      updateFields('container1', newFields);
    } else {
      const newFields = container2Fields.map(field => 
        field.id === updatedField.id ? updatedField : field
      );
      updateFields('container2', newFields);
    }
    
    setEditingField(null);
    setEditingContainer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Head>
        <title>Form Builder - HTML Drag and Drop</title>
        <meta name="description" content="Form builder with HTML5 Drag and Drop API" />
      </Head>

      <main className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Form Field Builder</h1>
        <p className="mb-4">Drag and drop fields between containers or across browser tabs/windows</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Container 1</h2>
            <FieldsContainer 
              containerId="container1"
              fields={container1Fields}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onEditField={handleEditField}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Container 2</h2>
            <FieldsContainer 
              containerId="container2"
              fields={container2Fields}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onEditField={handleEditField}
            />
          </div>
        </div>
      </main>

      {editingField && (
        <FieldEditorModal 
          field={editingField}
          onSave={handleSaveField}
          onClose={() => {
            setEditingField(null);
            setEditingContainer(null);
          }}
        />
      )}
    </div>
  );
}