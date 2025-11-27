import Global from "./Global";
import type { Task } from "./taskService";

export interface Board {
  _id: string;
  name: string;
  description?: string;
  owner: string;      // id de usuario
  members: string[];  // ids de usuarios
  createdAt: string;
  updatedAt: string;
}

const BOARD_BASE = `${Global.url}/board`;

async function handleBoardResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error en la petición");
  }
  return data;
}

// GET /api/board  (tableros del usuario autenticado)
export async function getMyBoards(token: string): Promise<Board[]> {
  const res = await fetch(BOARD_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleBoardResponse<Board[]>(res);
}

// POST /api/board  (crear tablero)
export async function createBoard(
  payload: { name: string; description?: string },
  token: string
): Promise<Board> {
  const res = await fetch(BOARD_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleBoardResponse<Board>(res);
}

// GET /api/board/:id  (tablero + tareas)
export async function getBoardWithTasks(
  id: string,
  token: string
): Promise<{ board: Board; tasks: Task[] }> {
  const res = await fetch(`${BOARD_BASE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleBoardResponse<{ board: Board; tasks: Task[] }>(res);
}
