export const Loading = () => {
  return (
    <div className="flex space-x-2">
      <span
        className="w-2 h-2 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "0s" }}
      ></span>
      <span
        className="w-2 h-2 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></span>
      <span
        className="w-2 h-2 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "0s" }}
      ></span>
      <span
        className="w-2 h-2 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></span>
    </div>
  );
};
