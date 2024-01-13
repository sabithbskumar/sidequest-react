import "./App.css";
import { TodoList } from "./components/TodoList";

function App() {
  return (
    <div className="bg-neutral-800 text-neutral-50 flex flex-col h-full">
      <header className="bg-neutral-600 shrink-0">
        <div className="py-2">
          <span className="text-3xl px-6">SideQuest</span>
        </div>
      </header>
      <div className="grow overflow-hidden">
        <TodoList />
      </div>
    </div>
  );
}

export default App;
