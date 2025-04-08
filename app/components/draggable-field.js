
// Field Item Component
export const DraggableField = ({ field, onDragStart }) => {
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