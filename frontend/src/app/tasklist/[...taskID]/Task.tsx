import React, { useState } from "react";
import Image from "next/image";
import EditIcon from "@/assets/pngs/edit.png";
import DeleteIcon from "@/assets/pngs/delete.png";

interface TaskProps {
  task: {
    id: string;
    name: string;
    completed: boolean;
  };
  isOwnerOrEditor: boolean;
  onCheckboxChange: (task: { id: string; name: string; completed: boolean }) => void;
  onEditTaskSave: (taskId: string, newName: string, currentCompleted: boolean) => void;
  onDeleteTask: (taskId: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, isOwnerOrEditor, onCheckboxChange, onEditTaskSave, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskName, setEditTaskName] = useState<string>(task.name);
  
  const [completed, setCompleted] = useState<boolean>(task.completed);

  const handleCheckboxChange = () => {
    const newCompletedState = !completed;
    setCompleted(newCompletedState);
    onCheckboxChange({ ...task, completed: newCompletedState });
  };

  const handleSaveEdit = () => {
    onEditTaskSave(task.id, editTaskName, completed);
    setIsEditing(false);
  };

  return (
    <li
      key={task.id}
      className={`border-b border-gray-300 py-3 px-4 flex items-center justify-between rounded-lg mb-2 ${
        completed ? "bg-gray-100" : "bg-white"
      }`}
    >
      <div className="flex items-center">
        {isOwnerOrEditor && (
          <input
            type="checkbox"
            checked={completed}
            onChange={handleCheckboxChange}
            className="mr-2 w-5 h-5 cursor-pointer"
          />
        )}
        {isEditing ? (
          <input
            type="text"
            value={editTaskName}
            onChange={(e) => setEditTaskName(e.target.value)}
            className="border text-white border-gray-300 rounded-lg px-2 py-1"
            autoFocus
          />
        ) : (
          <span className={`text-base ${completed ? "line-through text-gray-500" : ""}`}>{task.name}</span>
        )}
      </div>
      {isOwnerOrEditor && (
        <div className="flex space-x-2">
          {isEditing ? (
            <button
              onClick={handleSaveEdit}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-1 rounded-lg shadow transition"
            >
              Save
            </button>
          ) : (
            <button
              className="flex items-center justify-center w-8 h-8"
              onClick={() => setIsEditing(true)}
            >
              <Image src={EditIcon} alt="Edit" width={20} />
            </button>
          )}
          <button
            className="flex items-center justify-center w-8 h-8"
            onClick={() => onDeleteTask(task.id)}
          >
            <Image src={DeleteIcon} alt="Delete" width={21} className="mt-[2.5px]" />
          </button>
        </div>
      )}
    </li>
  );
};

export default Task;
