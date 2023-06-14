import React from "react";

import { Button } from "react-bootstrap";

function Reset({ resetBoard }) {
  return (
    <div>
      <Button variant="danger" onClick={resetBoard}>
        Reset
      </Button>
    </div>
  );
}

export default Reset;
