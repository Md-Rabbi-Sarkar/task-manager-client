import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const TaskColumn = ({ category, tasks, onUpdate, onDelete }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{category}</h2>
      <Droppable droppableId={category}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;