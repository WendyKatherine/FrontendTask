// src/components/TaskColumn.tsx
import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { deleteTask, type Task, type TaskStatus } from "../services/taskService";
import { Pencil, X } from "lucide-react";
import TaskEditModal from "./TaskEditModal";
import TaskCard from "./TaskCard";


interface TaskColumnProps {
    statusKey: TaskStatus;
    tasks: Task[];
    title: string;
    onDelete: () => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ statusKey, tasks, title, onDelete }) => {

    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const openEditModal = (task: Task) => setEditingTask(task);
    const closeEditModal = () => setEditingTask(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
            return "bg-pink-100";
            case "inprogress":
            return "bg-amber-100";
            case "completed":
            return "bg-green-100";
            default:
            return "bg-white";
        }
    };

    
    return (
        <Droppable droppableId={statusKey}>
        {(provided) => (
            <div
                className="w-64 rounded p-4 shadow"
                {...provided.droppableProps}
                ref={provided.innerRef}
            >
                <h2 className="text-2xl text-center lato-light p-2">{title}</h2>

            {tasks.map((task, index) => {
                const handleDelete = async () => {
                try {
                    await deleteTask(task._id);
                    onDelete();
                } catch (error) {
                    console.error("❌ Error deleting task:", error);
                }
                };

                return (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                    <div className="relative group p-2">
                        <button
                            onClick={handleDelete}
                            className="absolute top-4 right-4 z-10 text-gray-600 hover:text-red-700"
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={() => openEditModal(task)}
                            className="absolute top-4 left-4 text-gray-600 hover:text-blue-700"
                        >
                            <Pencil size={16} />
                        </button>
                        {editingTask && (
                            <TaskEditModal
                                task={editingTask}
                                isOpen={true}
                                onClose={closeEditModal}
                                onUpdated={onDelete}
                            />
                        )}
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${getStatusColor(task.status)} rounded p-3 mb-2 shadow transition-colors duration-200`}
                        >
                            <TaskCard task={task} />
                        </div>
                    </div>
                    )}
                </Draggable>
                );
            })}

            {provided.placeholder}
            </div>
        )}
        </Droppable>
    );
};

export default TaskColumn;
