import React from "react";

function Pawn({ id, extraClasses }) {
  const color = id === 2 ? "#fff" : "#000";
  return (
    <span
      className={extraClasses + " pawn"}
      style={{ backgroundColor: color }}
    ></span>
  );
}

export default Pawn;
