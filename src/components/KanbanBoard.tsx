import React, { useEffect, useState, useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import {
  getAllTasks,
  updateTask,
  type Task as TaskType,
  type TaskStatus,
} from "../services/taskService";
import TaskColumn from "./TaskColumn";
import TaskCreate from "./TaskCreate";

type TasksByStatus = Record<TaskStatus, TaskType[]>;

const COLUMN_STATUSES: Record<TaskStatus, string> = {
  pending: "Pendiente",
  "in-progress": "En progreso",
  completed: "Completadas",
};

interface KanbanBoardProps {
  boardId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardId }) => {
  const [tasks, setTasks] = useState<TasksByStatus>({
    pending: [],
    "in-progress": [],
    completed: [],
  });

  const fetchTasks = useCallback(async () => {
    try {
      if (!boardId) {
        setTasks({
          pending: [],
          "in-progress": [],
          completed: [],
        });
        return;
      }

      const data = await getAllTasks(boardId);

      const grouped: TasksByStatus = {
        pending: [],
        "in-progress": [],
        completed: [],
      };

      data.forEach((task) => {
        const status = (task.status ?? "pending") as TaskStatus;
        if (!grouped[status]) {
          grouped.pending.push(task);
        } else {
          grouped[status].push(task);
        }
      });

      setTasks(grouped);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    }
  }, [boardId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceCol = source.droppableId as TaskStatus;
    const destCol = destination.droppableId as TaskStatus;

    if (sourceCol === destCol && source.index === destination.index) return;

    const updatedTasks: TasksByStatus = {
      pending: [...tasks.pending],
      "in-progress": [...tasks["in-progress"]],
      completed: [...tasks.completed],
    };

    const [movedTask] = updatedTasks[sourceCol].splice(source.index, 1);
    movedTask.status = destCol;
    updatedTasks[destCol].splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);

    try {
      await updateTask(movedTask._id, { status: destCol });
    } catch (error) {
      console.error("❌ Error updating task:", error);
      fetchTasks(); // re-sync si falla
    }
  };

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
        {/* Card para crear tareas */}
        <div className="card w-full lg:w-72 bg-base-200/70 border border-base-300 shadow-md backdrop-blur-sm">
          <div className="card-body">
            <h2 className="card-title text-base-content justify-between">
              Nueva tarea
              <span className="badge badge-secondary badge-sm">+1</span>
            </h2>
            <p className="text-xs text-base-content/70 mb-2">
              Crea una nota para este tablero y arrástrala entre columnas.
            </p>

            <TaskCreate boardId={boardId} onTaskCreated={fetchTasks} />
          </div>
        </div>

        {/* Columnas Kanban */}
        <div className="flex-1 overflow-x-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 min-w-max">
              {(Object.keys(COLUMN_STATUSES) as TaskStatus[]).map(
                (statusKey) => (
                  <TaskColumn
                    key={statusKey}
                    statusKey={statusKey}
                    tasks={tasks[statusKey]}
                    title={COLUMN_STATUSES[statusKey]}
                    onDelete={fetchTasks}
                  />
                )
              )}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
