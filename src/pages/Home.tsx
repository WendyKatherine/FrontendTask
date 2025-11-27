// src/pages/Home.tsx
import { useEffect, useState, type FormEvent } from "react";
import KanbanBoard from "../components/KanbanBoard";
import { useAuth } from "../context/AuthContext";
import {
  getMyBoards,
  createBoard,
  type Board,
} from "../services/boardService";

const Home: React.FC = () => {
  const { user, token, logout } = useAuth();

  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedBoardName, setSelectedBoardName] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar tableros al entrar
  useEffect(() => {
    if (!token) return;

    const loadBoards = async () => {
      setLoadingBoards(true);
      setError(null);
      try {
        const list = await getMyBoards(token);
        setBoards(list);

        // Seleccionar el primero si aún no hay uno
        if (list.length > 0 && !selectedBoardId) {
          setSelectedBoardId(list[0]._id);
          setSelectedBoardName(list[0].name);
        }
      } catch (err: any) {
        setError(err.message || "Error cargando tableros");
      } finally {
        setLoadingBoards(false);
      }
    };

    loadBoards();
  }, [token]);

  const handleSelectBoard = (board: Board) => {
    setSelectedBoardId(board._id);
    setSelectedBoardName(board.name);
  };

  const handleCreateBoard = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!name.trim()) return;

    try {
      const newBoard = await createBoard(
        {
          name: name.trim(),
          description: description.trim() || undefined,
        },
        token
      );

      // Lo ponemos de primero en la lista y lo seleccionamos
      setBoards((prev) => [newBoard, ...prev]);
      setName("");
      setDescription("");
      setSelectedBoardId(newBoard._id);
      setSelectedBoardName(newBoard.name);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error creando tablero");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Top bar */}
      <header className="navbar bg-base-200 border-b border-base-300 px-4 lg:px-8">
        <div className="flex-1">
          <span className="text-lg font-semibold">Kanban de tareas</span>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs sm:text-sm text-base-content/70">
              {user.name} · {user.email}
            </span>
          )}
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar de tableros */}
        <aside className="w-full max-w-xs border-r border-base-300 bg-base-200/60 p-4 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold mb-2">Tus tableros</h2>

            {loadingBoards ? (
              <div className="flex justify-center py-4">
                <span className="loading loading-spinner loading-sm" />
              </div>
            ) : boards.length === 0 ? (
              <p className="text-xs text-base-content/60">
                Aún no tienes tableros. Crea el primero abajo.
              </p>
            ) : (
              <ul className="menu bg-base-100 rounded-box shadow-sm max-h-64 overflow-y-auto">
                {boards.map((board) => (
                  <li key={board._id}>
                    <button
                      className={
                        board._id === selectedBoardId ? "active" : undefined
                      }
                      onClick={() => handleSelectBoard(board)}
                    >
                      <span className="truncate">{board.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="divider my-2" />

          <div>
            <h3 className="text-sm font-semibold mb-2">Nuevo tablero</h3>

            {error && (
              <div className="alert alert-error py-1 mb-2 text-xs">
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-2" onSubmit={handleCreateBoard}>
              <input
                type="text"
                placeholder="Nombre del tablero"
                className="input input-bordered input-sm w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <textarea
                placeholder="Descripción (opcional)"
                className="textarea textarea-bordered textarea-xs w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm w-full"
                disabled={!name.trim()}
              >
                Crear tablero
              </button>
            </form>
          </div>
        </aside>

        {/* Área principal: Kanban */}
        <main className="flex-1 bg-base-100">
          {selectedBoardId ? (
            <>
              <div className="px-4 pt-4">
                <h1 className="text-lg font-semibold mb-1">
                  {selectedBoardName}
                </h1>
                <p className="text-xs text-base-content/60 mb-2">
                  Arrastra las tarjetas para moverlas entre columnas.
                </p>
              </div>
              <KanbanBoard boardId={selectedBoardId} />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-base-content/60 text-sm px-4 text-center">
              <p>
                Crea un tablero en el panel izquierdo o selecciona uno existente
                para comenzar a organizar tus tareas.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
