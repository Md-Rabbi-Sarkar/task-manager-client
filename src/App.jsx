import { DragDropContext } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { io } from 'socket.io-client';
import TaskForm from './components/TaskForm';
import TaskColumn from './components/TaskColumn';
import axios from 'axios';

const socket = io(import.meta.env.VITE_SOCKET_SERVER);

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState({ 'To-Do': [], 'In Progress': [], 'Done': [] });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchTasks(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTasks = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks?userId=${userId}`);
      const categorized = response.data.reduce((acc, task) => {
        acc[task.category] = [...(acc[task.category] || []), task];
        return acc;
      }, { 'To-Do': [], 'In Progress': [], 'Done': [] });
      setTasks(categorized);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    if (!user) return;
  
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks?userId=${user.uid}`);
        const categorized = response.data.reduce((acc, task) => {
          acc[task.category] = [...(acc[task.category] || []), task];
          return acc;
        }, { 'To-Do': [], 'In Progress': [], 'Done': [] });
        setTasks(categorized);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    fetchTasks();
  
   
    socket.on('task-updated', ({ userId: updatedUserId }) => {
      if (updatedUserId === user.uid) fetchTasks();
    });
  
    return () => socket.off('task-updated');
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
  console.log(result)
    
    if (!destination) return;
  
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
  
    
    const updatedTasks = { ...tasks };
  
   
    const sourceTasks = [...updatedTasks[source.droppableId]];
    const movedTask = sourceTasks.find((task) => task._id === draggableId);
  
    
    if (!movedTask) {
      console.error('Task not found:', draggableId);
      return;
    }
  
    
    sourceTasks.splice(source.index, 1);
    updatedTasks[source.droppableId] = sourceTasks;
  
    
    const destTasks = [...updatedTasks[destination.droppableId]];
    destTasks.splice(destination.index, 0, {
      ...movedTask,
      category: destination.droppableId, 
    });
    updatedTasks[destination.droppableId] = destTasks;
  
    
    setTasks(updatedTasks);
  
    try {
      
      await axios.put(`http://localhost:5000/api/tasks/${draggableId}`, {
        category: destination.droppableId, 
        order: destination.index, 
        userId: user.uid,
        title: movedTask.title,
        description: movedTask.description
        
      });
      
      socket.emit('task-updated', { userId: user.uid });
    } catch (error) {
      console.error('Error updating task:', error);
  
     
      setTasks(tasks);
    }
  };
  const handleUpdateTask = (updatedTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [updatedTask.category]: prevTasks[updatedTask.category].map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      ),
    }));
  };
  
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      Object.keys(updatedTasks).forEach((category) => {
        updatedTasks[category] = updatedTasks[category].filter(
          (task) => task._id !== taskId
        );
      });
      return updatedTasks;
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {!user ? (
        <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign in with Google
        </button>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <TaskForm userId={user.uid} onAdd={fetchTasks} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(tasks).map((category) => (
              <TaskColumn
              key={category}
              category={category}
              tasks={tasks[category]}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}

export default App;