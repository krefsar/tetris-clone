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

const tetri = [];

const playerElements = document.querySelectorAll('.player');
[...playerElements].forEach(element => {
  const tetris = new Tetris(element);
  tetri.push(tetris);
});

const keyListener = (event) => {
  [
    [65, 68, 83, 81, 69],
    [74, 76, 75, 85, 79],
  ].forEach((key, index) => {
    const player = tetri[index].player;

    if (event.type === 'keydown') {
      if (event.keyCode === key[0]) { 
        player.move(-1);
      } else if (event.keyCode === key[1]) {
        player.move(1);
      } else if (event.keyCode === key[3]) {
        player.rotate(-1);
      } else if (event.keyCode === key[4]) {
        player.rotate(1);
      }
    }

    if (event.keyCode === key[2]) {
      if (event.type === 'keydown') {
        if (player.dropInterval !== player.DROP_FAST) {
          player.drop();
          player.dropInterval = player.DROP_FAST;
        }
      } else {
        player.dropInterval = player.DROP_SLOW;
      }
    }
  });
};

document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);