import { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { TodoList } from "./components/TodoList";
import { Currency } from "./components/Currency";
import HamburgerIcon from "~icons/material-symbols-light/menu-rounded";
import CloseIcon from "~icons/material-symbols-light/close";

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

  const [isSidebarVisible, setIsSideBarVisible] = useState(false);

  useEffect(() => {
    setIsSideBarVisible(false);
  }, [page]);

  return (
    <div className="bg-neutral-800 transition-colors text-neutral-50 flex flex-col h-full">
      <div className="grow overflow-hidden flex">
        <div
          className={`h-full landscape:w-full max-w-none md:max-w-xs landscape:max-w-xs overflow-hidden overflow-y-auto ${
            isSidebarVisible ? "portrait:w-8/12" : "portrait:w-0"
          } shrink-0 min-w-0 transition-[width] bg-neutral-800`}
        >
          <div className="portrait:ml-4 flex flex-col gap-2">
            <div className="py-4 px-2">
              <Header />
            </div>
            <button
              className={`mx-2 ${
                page === "quests" ? "bg-blue-500" : "bg-neutral-600"
              }`}
              onClick={() => {
                setPage("quests");
              }}
            >
              Quests
            </button>
            <button
              className={`mx-2 ${
                page === "currency" ? "bg-blue-500" : "bg-neutral-600"
              }`}
              onClick={() => {
                setPage("currency");
              }}
            >
              Currency
            </button>
          </div>
        </div>
        <div
          className={`w-full portrait:shrink-0 bg-neutral-700 p-2 transition-[margin_border] ${
            isSidebarVisible
              ? "portrait:rounded-3xl portrait:m-4"
              : "portrait:m-0"
          } overflow-hidden overflow-y-auto max-w-full`}
          onClick={() => {
            if (isSidebarVisible) setIsSideBarVisible(false);
          }}
        >
          <span
            className="landscape:hidden"
            onClick={() => {
              setIsSideBarVisible(!isSidebarVisible);
            }}
          >
            {isSidebarVisible ? (
              <CloseIcon className="size-10" />
            ) : (
              <HamburgerIcon className="size-10" />
            )}
          </span>
          <Page />
        </div>
      </div>
    </div>
  );
}

export default App;
