
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
  