import "./App.css";
import { useState } from "react";
import { People } from "./pages/people";
import { Tips } from "./pages/tips";

function App() {
  const pages = [
    { title: "People", content: <People /> },
    { title: "Tips", content: <Tips /> },
  ];

  const [currentPage, setCurrentPage] = useState(<People />);

  return (
    <div className="flex flex-col w-screen h-screen bg-amber-400">
      <div className="w-screen py-2 flex align-middle justify-center drop-shadow-sm bg-white">
        {pages.map((p) => (
          <button
            onClick={() => setCurrentPage(p.content)}
            key={p.title}
            className="mx-2"
          >
            {p.title}
          </button>
        ))}
      </div>
      <div className="flex h-full overflow-hidden bg-[#f6f7f9] justify-center">
        {currentPage}
      </div>
    </div>
  );
}

export default App;
