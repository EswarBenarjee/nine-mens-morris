import React from "react";

function Message({ turn, message }) {
  return (
    <div>
      <div className={message ? "mb-2" : "mb-4"}>Player {turn}'s turn</div>
      <div>{message}</div>
    </div>
  );
}

export default Message;
