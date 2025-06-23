import React, { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { getAllTasks, updateTask } from "../services/taskService";
import type { Task as TaskType } from "../services/taskService";
import TaskColumn from "./TaskColumn";
import TaskCreate from "./TaskCreate";

const COLUMN_STATUSES: Record<keyof TasksByStatus, string> = {
    pending: "Pending",
    completed: "Completed",
    inprogress: "In Progress",
};


interface TasksByStatus {
    pending: TaskType[];
    completed: TaskType[];
    inprogress: Task[];
}

interface Task {
    _id: string;
    title: string;
    description?: string;
    dueDate?: string;
    status: "pending" | "completed" | "inprogress";
    created_by?: string;
    image?: string;
}

const KanbanBoard: React.FC = () => {
    const [tasks, setTasks] = useState<TasksByStatus>({
        pending: [],
        completed: [],
        inprogress: [],
    });

    // Agrega esto dentro del componente
    const fetchTasks = async () => {
        const data = await getAllTasks();
        const grouped = {
            pending: [] as TaskType[],
            inprogress: [] as TaskType[],
            completed: [] as TaskType[],
        };

        data.forEach((task) => {
            grouped[task.status].push(task);
        });

        setTasks(grouped);
    };

    useEffect(() => {
        fetchTasks();
    }, []);


    useEffect(() => {
        const fetchTasks = async () => {
        const data = await getAllTasks();
        const grouped: TasksByStatus = {
            pending: [],
            completed: [],
            inprogress: [],
        };

        data.forEach((task: Task) => {
            grouped[task.status].push(task);
        });

        setTasks(grouped);
        };

        fetchTasks();
    }, []);

    const onDragEnd = async (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceCol = source.droppableId as keyof TasksByStatus;
        const destCol = destination.droppableId as keyof TasksByStatus;

        if (sourceCol === destCol && source.index === destination.index) return;

        const draggedTask = tasks[sourceCol][source.index];
        const updatedTasks = { ...tasks };

        updatedTasks[sourceCol].splice(source.index, 1);
        draggedTask.status = destCol;
        updatedTasks[destCol].splice(destination.index, 0, draggedTask);

        setTasks(updatedTasks);
        await updateTask(draggedTask._id, { status: destCol });
    };

    return (
        <div className="flex gap-6 p-4 overflow-x-auto">
            <div className="w-64 bg-white rounded p-4 shadow">
                <h2 className="text-2xl text-center lato-light"> Create note</h2>
                <TaskCreate onTaskCreated={fetchTasks} />
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(COLUMN_STATUSES).map(([statusKey, title]) => (
                    <TaskColumn
                        key={statusKey}
                        statusKey={statusKey as keyof TasksByStatus}
                        tasks={tasks[statusKey as keyof TasksByStatus]}
                        title={title}
                        onDelete={fetchTasks}
                    />
                ))}
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
