import Global from "./Global";

export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  created_by?: string;
  image?: string;
  board?: string;
}

// Asegúrate que VITE_API_URL = "http://localhost:3900/api"
// Entonces TASK_BASE = "http://localhost:3900/api/task"
const TASK_BASE = `${Global.url}/task`;

// ─────────────────────────────────────────────
// Obtener todas las tareas (opcional: por tablero)
// ─────────────────────────────────────────────
export const getAllTasks = async (boardId?: string): Promise<Task[]> => {
  const query = boardId ? `?boardId=${encodeURIComponent(boardId)}` : "";
  const res = await fetch(`${TASK_BASE}/list-tasks${query}`);

  // Si por alguna razón el backend viejo devuelve 404, tomamos [].
  if (res.status === 404) {
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const data = (await res.json()) as { tasks: Task[] };
  return data.tasks;
};



// ─────────────────────────────────────────────
// Actualizar tarea
// ─────────────────────────────────────────────
export const updateTask = async (
  id: string,
  payload: Partial<Pick<Task, "title" | "description" | "dueDate" | "status" | "image">>
): Promise<void> => {
  const res = await fetch(`${TASK_BASE}/update-task/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update task");
  }
};

// ─────────────────────────────────────────────
// Crear tarea
// ─────────────────────────────────────────────
export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
  image?: string;
  created_by?: string;
  boardId: string; // 🔹 requerido por el backend
}

export const createTask = async (
  payload: CreateTaskPayload
): Promise<Task> => {
  const res = await fetch(`${TASK_BASE}/save-task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to save task");
  }

  const data = await res.json();
  return data.task;
};

// ─────────────────────────────────────────────
// Eliminar tarea
// ─────────────────────────────────────────────
export const deleteTask = async (id: string): Promise<void> => {
  const res = await fetch(`${TASK_BASE}/delete-task/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete task");
  }
};

// ─────────────────────────────────────────────
// Subir imagen de tarea
// ─────────────────────────────────────────────
export const handleImageUpload = async (
  file: File,
  taskId: string
): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(`${TASK_BASE}/upload-image-task/${taskId}`, {
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
