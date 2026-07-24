import "./BoardContainer.css";

export default function BoardContainer({ children }) {
  return (
    <div className="board-container">
      <div className="board-inner">
        {children}
      </div>
    </div>
  );
}