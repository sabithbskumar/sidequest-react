import "./App.css";
import { Header } from "./components/Header";
import { TodoList } from "./components/TodoList";

function App() {
  return (
    <div className="bg-neutral-800 text-neutral-50 flex flex-col h-full">
      <Header />
      <div className="grow overflow-hidden">
        <TodoList />
      </div>
    </div>
  );
}

export default App;
