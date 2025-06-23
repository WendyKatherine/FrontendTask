// src/components/TaskEditModal.tsx
import React, { useState, useEffect } from "react";
import type { Task } from "../services/taskService";
import { updateTask } from "../services/taskService";

interface TaskEditModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onUpdated: () => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, isOpen, onClose, onUpdated }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [dueDate, setDueDate] = useState(task.dueDate?.slice(0, 10) || "");
    const [status, setStatus] = useState(task.status);

    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description || "");
        setDueDate(task.dueDate?.slice(0, 10) || "");
        setStatus(task.status);
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await updateTask(task._id, { title, description, dueDate, status });
        onUpdated(); // Refresca la lista
        onClose();   // Cierra el modal
        } catch (error) {
        console.error("❌ Error updating task:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 modal bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-amber-100 rounded-lg p-6 w-[80%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
                type="text"
                className="border p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                className="border p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="date"
                className="border p-2"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
            />
            <select
                className="border p-2"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
            >
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
            </select>

            <div className="flex justify-end gap-2 mt-4">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                Cancel
                </button>
                <button
                type="submit"
                className="px-4 py-2 bg-amber-200 text-white rounded hover:bg-amber-300"
                >
                Save
                </button>
            </div>
            </form>
        </div>
        </div>
    );
};

export default TaskEditModal;
