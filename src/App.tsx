import { useState } from "react";
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

  const buttons = [
    {
      label: "Quests",
      value: "quests",
    },
    {
      label: "Currency",
      value: "currency",
    },
  ];

  return (
    <div className="bg-neutral-800 transition-colors text-neutral-50 h-full">
      <div className="flex h-full max-h-full overflow-hidden">
        <div
          className={`h-full landscape:w-full max-w-xs overflow-hidden overflow-y-auto ${
            isSidebarVisible ? "portrait:w-8/12" : "portrait:w-0"
          } shrink-0 min-w-0 transition-[width] bg-neutral-800`}
        >
          <div className="portrait:ml-4">
            <div className="py-4 px-2">
              <Header />
            </div>
            <div className="flex flex-col gap-2">
              {buttons.map((button, key) => (
                <button
                  key={key}
                  className={`landscape:mx-2 p-4 text-left rounded ${
                    page === button.value ? "bg-blue-500" : "bg-neutral-600"
                  }`}
                  onClick={() => {
                    setIsSideBarVisible(false);
                    setPage(button.value);
                  }}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          className={`w-full portrait:shrink-0 bg-neutral-700 transition-[margin_border] ${
            isSidebarVisible
              ? "portrait:rounded-3xl portrait:m-4"
              : "portrait:m-0"
          } max-h-full max-w-full overflow-clip flex min-h-0`}
          onClick={() => {
            if (isSidebarVisible) setIsSideBarVisible(false);
          }}
        >
          <div className="h-full w-full flex flex-col min-h-0">
            <div className="shrink-0">
              <div className="flex h-14 items-center landscape:pl-2">
                <button
                  className="landscape:hidden p-2 inline-flex"
                  onClick={() => {
                    setIsSideBarVisible(!isSidebarVisible);
                  }}
                >
                  {isSidebarVisible ? (
                    <CloseIcon className="size-10" />
                  ) : (
                    <HamburgerIcon className="size-10" />
                  )}
                </button>
                <span className="capitalize text-2xl font-semibold">
                  {page}
                </span>
              </div>
            </div>
            <div className="grow overflow-auto min-h-0">
              <Page />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
