'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import FieldsContainer from './components/fields-container';
import FieldEditorModal from './components/field-editor-modal';

// Define default source fields outside useEffect
const defaultSourceFields = [
  { id: 'text-field', type: 'text', label: 'Text Field', placeholder: 'Enter text' },
  { id: 'email-field', type: 'email', label: 'Email Field', placeholder: 'Enter email' },
  { id: 'number-field', type: 'number', label: 'Number Field', placeholder: 'Enter number' },
  { id: 'date-field', type: 'date', label: 'Date Field' },
  { id: 'checkbox-field', type: 'checkbox', label: 'Checkbox', checkboxLabel: 'Check this option' },
  { id: 'select-field', type: 'select', label: 'Select Field', options: ['Option 1', 'Option 2', 'Option 3'] },
];

export default function Home() {
  const [container1Fields, setContainer1Fields] = useState([]);
  const [container2Fields, setContainer2Fields] = useState([]);
  const [sourceFields, setSourceFields] = useState(defaultSourceFields); // Initialize with default values
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
      } else if (containerId === 'container2') {
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
    
    // Skip drop on source container
    if (targetContainerId === 'sourceContainer') return;
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;
      
      const parsedData = JSON.parse(data);
      const { field, sourceContainer, source } = parsedData;
      if (!field) return;
      
      console.log('Drop data:', parsedData);
      console.log('Target container:', targetContainerId);
      
      // Get the drop position
      const container = e.target.closest('[id^="container"]');
      if (!container) return;
      
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
      
      if (source === 'source' || sourceContainer === 'sourceContainer') {
        // Adding a new field from the source
        if (targetContainerId === 'container1') {
          let newFields = [...container1Fields];
          newFields.splice(dropIndex, 0, newField);
          updateFields('container1', newFields);
        } else if (targetContainerId === 'container2') {
          let newFields = [...container2Fields];
          newFields.splice(dropIndex, 0, newField);
          updateFields('container2', newFields);
        }
      } else if (sourceContainer === targetContainerId) {
        // Reordering within the same container
        let currentFields = sourceContainer === 'container1' ? container1Fields : container2Fields;
        
        // Remove the field from its current position
        currentFields = currentFields.filter(f => f.id !== field.id);
        
        // Insert at the new position
        currentFields.splice(dropIndex, 0, field);
        
        // Update the container
        updateFields(sourceContainer, currentFields);
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
          newFields.splice(dropIndex, 0, field);
          updateFields('container1', newFields);
        } else if (targetContainerId === 'container2') {
          let newFields = [...container2Fields];
          newFields.splice(dropIndex, 0, field);
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
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <FieldsContainer 
              containerId="sourceContainer"
              fields={sourceFields}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onEditField={handleEditField}
              source={true}
              title="Available Fields"
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Container 1</h2>
            <FieldsContainer 
              containerId="container1"
              fields={container1Fields}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onEditField={handleEditField}
              source={false}
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
              source={false}
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