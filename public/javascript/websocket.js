const id = new URLSearchParams(window.location.search).get("id");

let socket = new WebSocket(`ws://${location.host}/websockets?id=${id}`);

const nameInput = document.querySelector("#name-input");
const setNameBtn = document.querySelector("#set-name");

const playerOutput = document.querySelector("#player-output");

const playerOneName = document.querySelector("#player-one-name");
const playerTwoName = document.querySelector("#player-two-name");

const currentTurnOutput = document.querySelector("#current-turn");

const gameActionButton = document.querySelector("#game-action-button");

let turn = 1;
let playerNumber = 0;

let playerName = "";

socket.addEventListener("open", () => {});

socket.addEventListener("message", ({ data }) => {
  const parsedMessage = JSON.parse(data);

  const { method } = parsedMessage;

  switch (method) {
    case "init":
      updatePlayer(parsedMessage.player);
      updatePlayerNameOutput(1, parsedMessage.playerOneName);
      updatePlayerNameOutput(2, parsedMessage.playerTwoName);
      break;
    case "set-player-name":
      updatePlayerNameOutput(parsedMessage.player, parsedMessage.name);
      break;
    case "game-ready":
      enableGameBoard();
      break;
    case "game-action":
      gameAction(parsedMessage.player, parsedMessage.action);
      break;
    case "update-turn":
      turn = parsedMessage.turn;
      currentTurnOutput.innerHTML = `${turn}'s turn`;
      break;
    case "game-over":
      currentTurnOutput.innerHTML = `${parsedMessage.winner} wins!`;
      gameover = true;
    default:
      return;
  }
});

socket.addEventListener("error", (event) => {
  console.log(event);
});

socket.addEventListener("close", () => {
  console.log("Socket closed by server");
  socket = null;
});

const updatePlayerName = () => {
  if (playerName !== nameInput.value) {
    playerName = nameInput.value;
    socket.send(
      JSON.stringify({
        method: "set-player-name",
        playerName: playerName,
      })
    );
  }
};

const updatePlayer = (player) => {
  nameInput.value = `Player ${player}`;
  if (player === 1) {
    playerNumber = 1;
    playerOutput.innerHTML = "You are Player 1";
  } else if (player === 2) {
    playerNumber = 2;
    playerOutput.innerHTML = "You are Player 2";
  } else {
    playerOutput.innerHTML = "You are a spectator";
  }
};

setNameBtn.addEventListener("click", updatePlayerName);

const handleGameAction = () => {
  // check if it's your turn
  if (playerNumber !== turn) return;

  // example action
  const action = {
    position: "A2",
    piece: "Knight",
  };

  socket.send(
    JSON.stringify({
      method: "game-action",
      action: action,
    })
  );
};

gameActionButton.addEventListener("click", handleGameAction);

const updatePlayerNameOutput = (player, playerName) => {
  if (player === 1) {
    playerOneName.innerHTML = playerName;
  } else if (player === 2) {
    playerTwoName.innerHTML = playerName;
  }
};

const enableGameBoard = () => {
  // add class to show game board / make interactive
  gameActionButton.removeAttribute("disabled");
};

const gameAction = (player, action) => {
  // update game board to reflect game action
};
