import { Global } from "./Global";

export interface Task {
    _id: string;
    title: string;
    description?: string;
    dueDate?: string;
    status: "pending" | "inprogress" | "completed" ;
    created_by?: string;
    image?: string;
}

const API = (endpoint: string) => `${Global.url}${endpoint}`;


//Fetch all tasks from backend and return them as a typed array.

export const getAllTasks = async (): Promise<Task[]> => {
    const res = await fetch(API("/list-tasks"));
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data = (await res.json()) as { tasks: Task[] };
    return data.tasks;
};


//Update a task by id with a partial payload
export const updateTask = async (
    id: string,
    payload: Partial<Pick<Task, "title" | "description" | "dueDate" | "status" | "image" >>
): Promise<void> => {
    const res = await fetch(API(`/update-task/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update task");
};

//Create new task
export const createTask = async (
    payload: Partial<Pick<Task, "title" | "description" | "dueDate" | "status" | "image" | "created_by">>
): Promise<Task> => {
    const res = await fetch(API("/save-task"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to save task");

    const data = await res.json();
    return data.task; // <--- importante
};


//Update a task by id with a partial payload

export const deleteTask = async (id: string): Promise<void> => {
    const res = await fetch(API(`/delete-task/${id}`), {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete task");
};

export const handleImageUpload = async (file: File, taskId: string) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const res = await fetch(`${Global.url}/upload-image-task/${taskId}`, {
        method: "POST",
        body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        console.log("✅ Imagen subida:", data.task.image);
        return data.task.image;

    } catch (err) {
        console.error("❌ Error al subir imagen:", err);
    }
};
