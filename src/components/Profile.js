import React from "react";
import Pawn from "./Pawn";

import Container from "react-bootstrap/Container";

function Profile({ id, currentCount }) {
  const Pawns = [];
  for (let i = 0; i < currentCount[id - 1].active; i++) {
    Pawns.push(<Pawn id={id} key={i} extraClasses="mx-2" />);
  }

  return (
    <Container className="p-3">
      <div>
        {id === 2 && <p>{Pawns}</p>}
        <p>
          <img
            src={
              "https://api.multiavatar.com/" +
              id +
              19 +
              ".png?apikey=yBoYaxDPm5GuAl"
            }
            alt="Profile"
            height={30}
            width={30}
            className="mb-1 me-2"
          />
          Player {id}
        </p>
        {id === 1 && <p>{Pawns}</p>}
      </div>
    </Container>
  );
}

export default Profile;
