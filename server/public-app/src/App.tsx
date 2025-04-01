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
    <div className="flex flex-col w-screen h-screen">
      <div className="w-screen flex align-middle justify-center bg-amber-50">
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
      <div className="flex-grow w-screen bg-amber-200">{currentPage}</div>
    </div>
  );
}

export default App;
