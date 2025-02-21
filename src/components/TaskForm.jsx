import { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ userId, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      category: 'To-Do',
      userId,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/tasks', newTask);
      onAdd(userId); 
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
   
      
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-lg shadow-md ">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={50}
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={200}
        rows={3}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Add Task
      </button>
    </form>
   
  );
};

export default TaskForm;