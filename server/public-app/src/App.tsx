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
      <div className="w-screen flex align-middle justify-center drop-shadow-sm bg-white">
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
      <div className="flex-grow w-screen bg-[#f6f7f9] flex justify-center">
        {currentPage}
      </div>
    </div>
  );
}

export default App;
