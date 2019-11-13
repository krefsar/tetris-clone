const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

context.scale(20, 20);

const tShape = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

const oShape = [
  [2, 2],
  [2, 2],
];

const lShape = [
  [0, 3, 0],
  [0, 3, 0],
  [0, 3, 3],
];

const jShape = [
  [0, 4, 0],
  [0, 4, 0],
  [4, 4, 0],
];

const iShape = [
  [0, 5, 0, 0],
  [0, 5, 0, 0],
  [0, 5, 0, 0],
  [0, 5, 0, 0],
];

const zShape = [
  [6, 6, 0],
  [0, 6, 6],
  [0, 0, 0]
];

const sShape = [
  [0, 7, 7],
  [7, 7, 0],
  [0, 0, 0]
];

const arenaSweep = () => {
  let rowCount = 1;

  outer: for (let y = arena.length - 1; y > 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    y++;

    player.score += rowCount * 10;
    rowCount *= 2;
  }
};

const collide = (arena, player) => {
  const { matrix, pos } = player;

  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix[y].length; ++x) {
      if (matrix[y][x] !== 0 &&
        (arena[y + pos.y] &&
        arena[y + pos.y][x + pos.x]) !== 0) {
        return true;
      }
    }
  }

  return false;
};

const createMatrix = (w, h) => {
  const matrix = [];

  while (h > 0) {
    matrix.push(new Array(w).fill(0));
    h--;
  }

  return matrix;
};

const createPiece = (type) => {
  switch (type) {
    case 'T':
      return tShape;
    case 'L':
      return lShape;
    case 'S':
      return sShape;
    case 'Z':
      return zShape;
    case 'I':
      return iShape;
    case 'O':
      return oShape;
    case 'J':
      return jShape;
    default:
      return tShape;
  }
};

const draw = () => {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawShape(arena, { x: 0, y: 0 });
  drawShape(player.matrix, player.pos);
};

const drawShape = (matrix, offset) => {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
};

const hardPlayerDrop = () => {
  while (!collide(arena, player)) {
    player.pos.y++;
  }

  player.pos.y--;
  merge(arena, player);
  playerReset();
  arenaSweep();
  updateScore();
  dropCounter = 0;
};

const merge = (arena, player) => {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

const playerDrop = () =>{ 
  player.pos.y++;

  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }

  dropCounter = 0;
}

const playerMove = (dir) => {
  player.pos.x += dir;

  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

const playerReset = () => {
  const pieces = 'ILJOTSZ';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
};

const playerRotate = (dir) => {
  const pos = player.pos.x;
  let offset = 1;

  rotate(player.matrix, dir);

  while(collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));

    // in case things get crazy
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

const rotate = (matrix, dir) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [
        matrix[x][y],
        matrix[y][x],
      ] = [
        matrix[y][x],
        matrix[x][y],
      ];
    }
  }

  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
};

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

const update = (time = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
};

const updateScore = () => {
  document.getElementById('score').innerText = player.score;
};

const arena = createMatrix(12, 20);

const colors = [
  null,
  'red',
  'blue',
  'violet',
  'green',
  'yellow',
  'orange',
  'pink'
];

const player = {
  pos: {
    x: 0,
    y: 0,
  },
  matrix: null,
  score: 0,
};

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) { 
    playerMove(-1);
  } else if (event.keyCode === 39) {
    playerMove(1);
  } else if (event.keyCode === 40) {
    playerDrop();
  } else if (event.keyCode === 38) {
    hardPlayerDrop();
  } else if (event.keyCode === 81) {
    playerRotate(-1);
  } else if (event.keyCode === 87) {
    playerRotate(1);
  }
});

playerReset();
updateScore();
update();