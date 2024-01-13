import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { TodoList } from "./components/TodoList";
import { Currency } from "./components/Currency";

function App() {
  function Page() {
    switch (page) {
      case "quests":
        return <TodoList />;
      case "currency":
        return <Currency />;
    }
  }
  const [page, setPage] = useState("quests");

  return (
    <div className="bg-neutral-800 text-neutral-50 flex flex-col h-full">
      <Header />
      <div className="grow overflow-hidden flex">
        <div className="h-full w-full max-w-xs bg-neutral-700 flex flex-col p-2 gap-2">
          <button
            className={page === "quests" ? "bg-blue-500" : "bg-neutral-600"}
            onClick={() => {
              setPage("quests");
            }}
          >
            Quests
          </button>
          <button
            className={page === "currency" ? "bg-blue-500" : "bg-neutral-600"}
            onClick={() => {
              setPage("currency");
            }}
          >
            Currency
          </button>
        </div>
        <div className="w-full">
          <Page />
        </div>
      </div>
    </div>
  );
}

export default App;
