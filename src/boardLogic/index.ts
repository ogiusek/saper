// const TileStates = {
//   usnelected: 0,
//   selected: 1,
//   flagged: 2,
// };

enum TileStates {
  usnelected,
  selected,
  flagged,
};

interface Tile {
  value: boolean,
  userSelect: TileStates,
  neighbours: number
};

function getPureBoard(w, h, procent = 100 / 6) {
  const board = Array(w).fill(null).map(() =>
    Array(h).fill(false));
  const mines = Math.floor((w * h) * (procent / 100));
  let placedMines = 0;
  while (placedMines < mines) {
    const x = Math.floor(Math.random() * w);
    const y = Math.floor(Math.random() * h);
    if (!board[x][y]) {
      board[x][y] = true;
      placedMines++;
    }
  }
  return board;
}

function getBoard(w, h, procent = 100 / 6) {
  let board = getPureBoard(w, h, procent);
  return board.map((col, cI) => col.map((e, eI) => {
    return {        // tile structure
      value: e,
      userSelect: TileStates.usnelected,
      neighbours: ["-1,-1", "-1,0", "-1,1", "0,-1", "0,1", "1,-1", "1,0", "1,1"].reduce((acc, e) => {
        const x = cI + Number(e.split(",")[0]);
        const y = eI + Number(e.split(",")[1]);
        return acc + (
          x >= 0 && x < board.length &&
          y >= 0 && y < board[x].length &&
          board[x][y]);
      }, 0)
    } as Tile;
  }));
}

export { getBoard, TileStates, Tile };