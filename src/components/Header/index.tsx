import logo from "/favicon.svg";

function Header() {
  return (
    <header className="shrink-0">
      <div className="p-2 flex">
        <img src={logo} />
        <span className="text-3xl px-6">SideQuest</span>
      </div>
    </header>
  );
}

export { Header };
