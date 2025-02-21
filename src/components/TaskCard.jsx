import { Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TaskCard = ({ task, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
        title,
        description,
        category: task.category,
        userId: task.userId,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
        data: { userId: task.userId },
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 mb-2 rounded shadow-sm hover:shadow-md transition-shadow"
        >
          {isEditing ? (
            <>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-2 p-1 border rounded"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-2 p-1 border rounded"
                rows={3}
              />
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-2 py-1 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3 className="font-medium">{task.title}</h3>
              {task.description && (
                <p className="text-gray-600 text-sm mt-1">{task.description}</p>
              )}
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;