import { type Task } from "../services/taskService";

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {

    return (
        <div>
            <p className="text-sm text-center text-[#383129] lato-bold pt-4">{task.title}</p>
            {task.description && (
                <p className="text-sm text-center text-[#383129] lato-regular pb-4">{task.description}</p>
            )}
            {task.image && (
                <img src={task.image} alt={task.title} />
            )}
            {task.dueDate && (
                <p className="text-xs text-center text-[#383129] mt-1">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
            )}
            {task.created_by &&(
                <p className="text-xs text-center text-[#383129] mt-1">
                    Created by: {task.created_by}
                </p>
            )}
        </div>
    );
};

export default TaskCard;