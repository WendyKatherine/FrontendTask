import { useState, type FormEvent } from "react";
import { createTask, type TaskStatus } from "../services/taskService";

interface TaskCreateProps {
  boardId: string;
  onTaskCreated: () => void;
}

const TaskCreate: React.FC<TaskCreateProps> = ({ boardId, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status] = useState<TaskStatus>("pending"); // siempre crea en "pending"
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    setError(null);

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        status,
        created_by: "Wendy",
        boardId,
      });

      // Limpiar form y refrescar lista
      setTitle("");
      setDescription("");
      setDueDate("");
      onTaskCreated();
    } catch (err: any) {
      console.error("❌ Error creating task:", err);
      setError(err.message || "Error al crear tarea");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSaveTask}>
      {error && (
        <div className="alert alert-error py-1 text-xs">
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs">Título</span>
        </label>
        <input
          type="text"
          placeholder="Ej. Configurar autenticación"
          className="input input-bordered input-sm w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs">Descripción</span>
        </label>
        <textarea
          placeholder="Detalle opcional de la tarea"
          className="textarea textarea-bordered textarea-xs w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs">Fecha límite</span>
        </label>
        <input
          type="date"
          className="input input-bordered input-sm w-full"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-sm w-full mt-2"
        disabled={isSaving || !title.trim()}
      >
        {isSaving ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          "Guardar tarea"
        )}
      </button>
    </form>
  );
};

export default TaskCreate;
