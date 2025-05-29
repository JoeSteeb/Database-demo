import "./App.css";
import { useState } from "react";
import { People } from "./pages/people";
import { Businesses } from "./pages/businesses";
import { Tips } from "./pages/tips";

function App() {
  const pages = [
    { title: "People", content: <People /> },
    { title: "Businesses", content: <Businesses /> },
    { title: "Tips", content: <Tips /> },
  ];

  const [currentPage, setCurrentPage] = useState({
    title: "People",
    content: <People />,
  });

  return (
    <div className="flex flex-col w-screen h-screen bg-amber-400">
      <div className="w-screen py-2 flex align-middle justify-center drop-shadow-sm bg-white">
        {pages.map((p) => {
          if (p.title == currentPage.title) {
            return (
              <button
                onClick={() => setCurrentPage(p)}
                key={p.title}
                className="mx-2 bg-[#e2e2e2] text-black rounded px-4 py-2"
                // className="bg-amber-600"
              >
                {p.title}
              </button>
            );
          } else {
            return (
              <button
                onClick={() => setCurrentPage(p)}
                key={p.title}
                className="mx-2 text-gray-500 hover:text-black"
              >
                {p.title}
              </button>
            );
          }
        })}
      </div>
      <div className="flex h-full overflow-hidden bg-[#f6f7f9] justify-center">
        {currentPage.content}
      </div>
    </div>
  );
}

export default App;
