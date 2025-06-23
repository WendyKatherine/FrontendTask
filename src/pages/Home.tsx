import KanbanBoard from "../components/KanbanBoard.tsx";

const Home = () => {
    return (
        <div className="h-[100vh] bg-background flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4 lato-black">Task kanban board</h1>
            <KanbanBoard />
        </div>
    );
};

export default Home;
