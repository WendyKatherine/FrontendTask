import React, { useState } from "react";
import { createTask, handleImageUpload, updateTask } from "../services/taskService";

interface TaskCreateProps {
  onTaskCreated: () => void;
}

const TaskCreate: React.FC<TaskCreateProps> = ({ onTaskCreated }) => {
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ dueDate, setDueDate] = useState("");
    const [ image, setImage ] = useState<string | undefined>(undefined);
    const [ created_by, setCreatedBy ] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleSaveTask = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const newTask = await createTask({
                title,
                description,
                dueDate,
                status: "pending",
                created_by,
            });

            if (file) {
                const imageUrl = await handleImageUpload(file, newTask._id);
                if (imageUrl) {
                    await updateTask(newTask._id, { image: imageUrl });
                }
            }

            setTitle("");
            setDescription("");
            setDueDate("");
            setImage(undefined);
            setCreatedBy("");
            setFile(null);

            onTaskCreated();

        } catch (error) {
            console.error("❌ Error creating task:", error);
        }
    };

    return (
        <div className="bg-amber-200 rounded p-3 mb-2 shadow hover:shadow-md transition-shadow duration-200 mt-2">
            <form onSubmit={handleSaveTask}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-md text-[#383129] p-1 text-sm w-full my-1"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="rounded-md text-[#383129] p-1 text-sm w-full my-1"
                />
                <input 
                    type="date"
                    name="task-date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="rounded-md text-[#383129] p-1 text-sm w-full my-1"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    value={image}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="bg-white shadow-sm rounded-md text-[#383129] text-sm w-full p-1"
                />
                <input
                    type="text"
                    placeholder="Created by"
                    value={created_by}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    className="rounded-md text-[#383129]  p-1 text-sm w-full my-1 mb-2"
                    required
                />
                <div className="flex flex-col justify-center items-center">
                    <button
                        type="submit"
                        className="bg-white text-[#383129] px-4 py-1 rounded hover:bg-amber-50 transition text-center"
                    >
                        Save
                    </button>
                </div>
                
            </form>
        </div>
    )
}

export default TaskCreate;