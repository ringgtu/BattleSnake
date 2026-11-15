// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from "./server.js";

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "Yam", // TODO: Your Battlesnake Username
    color: "#3388BB", // TODO: Choose color
    head: "Scarf", // TODO: Choose head
    tail: "Hook", // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {
  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {
    // Neck is left of head, don't move left
    isMoveSafe.left = false;
  } else if (myNeck.x > myHead.x) {
    // Neck is right of head, don't move right
    isMoveSafe.right = false;
  } else if (myNeck.y < myHead.y) {
    // Neck is below head, don't move down
    isMoveSafe.down = false;
  } else if (myNeck.y > myHead.y) {
    // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  if (myHead.x === 0) {
    isMoveSafe.left = false;
  }
  if (myHead.x + 1 >= boardWidth) {
    isMoveSafe.right = false;
  }
  if (myHead.y === 0) {
    isMoveSafe.down = false;
  }
  if (myHead.y + 1 >= boardHeight) {
    isMoveSafe.up = false;
  }

  //Step 2 - Prevent your Battlesnake from colliding with itself
  const occupiedSquare = new Set();

  for (const snakeBody of gameState.board.snakes) {
    snakeBody.body.map(({ x, y }) => occupiedSquare.add(`${x},${y}`));
  }

  const DIRECTIONS = {
    right: [1, 0],
    left: [-1, 0],
    up: [0, 1],
    down: [0, -1],
  };

  for (const [key, value] of Object.entries(DIRECTIONS)) {
    const nx = myHead.x + value[0];
    const ny = myHead.y + value[1];

    if (occupiedSquare.has(`${nx},${ny}`)) {
      isMoveSafe[key] = false;
    }
  }

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  const opponents = gameState.board.snakes;

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  const foods = gameState.board.food;
  const closeMove = safeMoves[0]

  if(foods > 0) {
    let closestFood = foods[0]
    let shortestDistance = Math.abs(myHead.x - closestFood.x) - Math.abs(myHead.y - closestFood.y)
    
    for(const food in foods) {
      const foodDistance = Math.abs(myHead.x - food.x) - Math.abs(myHead.y - food.y)

      if(foodDistance < shortestDistance){
        shortestDistance = foodDistance
        closestFood = food
        closeMove = move
      }
    }

    return { move: closeMove}
  }

  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end,
});
