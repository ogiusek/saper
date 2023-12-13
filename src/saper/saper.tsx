import React, { useEffect, useReducer, useState } from 'react';
import style from './saper.module.scss';

import { getBoard, TileStates, Tile as TileType } from '../boardLogic/index.ts';
import Column from './column/column.tsx';
import Stopwatch from './stopwatch/stopwatch.tsx';
import WinScreen from './winScreen/winScreen.tsx';
import { IMenu } from '../App.tsx';

interface ISaper {
  w: number,
  h: number,
  mines: number,
  setMenu: React.Dispatch<React.SetStateAction<IMenu>>
};

interface ITimer {
  runs: boolean,
  start: number,
  end?: number
};
function timerReducer(state: ITimer, action: 'start' | 'stop' | 'restart'): ITimer {
  if (action === 'start') {
    if (state.end === undefined) state.start = new Date().getTime();
    else state.start = new Date(new Date().getTime() - (state.end - state.start)).getTime();
    state.runs = true;
  } else if (action === 'stop') {
    state.end = new Date().getTime();
    state.runs = false;
  }
  else if (action === 'restart') {
    state.start = 0;
    state.end = undefined;
    state.runs = false;
  }
  return state;
}

function Saper({ w, h, mines, setMenu }: ISaper) {
  const [board, setBoard] = useState(getBoard(w, h, mines));
  const [popup, setPopup] = useState(<React.Fragment />);

  const [interactive, setInteractive] = useState(true);
  const [won, setWon] = useState(false);

  const [timer, dispachTimer] = useReducer(timerReducer, { start: 0, runs: false } as ITimer);
  const minesOnMap = Math.floor(w * h * (mines / 100));

  const reset = () => {
    setInteractive(true);
    dispachTimer('restart');
    setWon(false);
    setBoard(getBoard(w, h, mines));
  }

  const onEnd = () => {
    setInteractive(false);
    dispachTimer('stop');
  }

  const onWin = () => {
    onEnd();
    setWon(true);
    setPopup(<WinScreen
      time_in_ms={new Date().getTime() - timer.start} hide={() => setPopup(<React.Fragment />)}
      board_size={`${w.toString().padStart(2, '0')}X${h.toString().padStart(2, '0')}`} />);
  }

  const onLose = () => { onEnd(); }

  useEffect(() => {
    board.flat().filter(e => e.userSelect !== TileStates.selected).length === minesOnMap && onWin();
  }, [board, setWon, setInteractive]);

  const handleClick = (rightClick: boolean, x: number, y: number) => {
    if (board[x][y].userSelect === TileStates.selected) return;
    let newBoard: TileType[][] = JSON.parse(JSON.stringify(board));

    while ((newBoard[x][y].value ||
      newBoard[x][y].neighbours !== 0) &&
      newBoard.flat().filter(e => e.userSelect === TileStates.usnelected).length === newBoard.flat().length)
      newBoard = getBoard(w, h, mines);

    const foundZero = (x: number, y: number) => {
      newBoard[x][y].userSelect = TileStates.selected;
      if (newBoard[x][y].neighbours === 0) ["-1,-1", "-1,0", "-1,1", "0,-1", "0,1", "1,-1", "1,0", "1,1"].map(e => {
        const nX = x + Number(e.split(",")[0]), nY = y + Number(e.split(",")[1]);
        if (nX >= 0 && nX < w && nY >= 0 && nY < h && newBoard[nX][nY].userSelect === TileStates.usnelected) foundZero(nX, nY);
      });
    }

    if (!rightClick && newBoard[x][y].value === true) onLose();

    else if (!rightClick) {
      newBoard[x][y].userSelect = TileStates.selected;
      if (newBoard[x][y].neighbours === 0) foundZero(x, y);
    } else if (rightClick && newBoard[x][y].userSelect === TileStates.flagged)
      newBoard[x][y].userSelect = TileStates.usnelected;
    else if (rightClick)
      newBoard[x][y].userSelect = TileStates.flagged;

    if (timer.start === 0) dispachTimer('start');
    setBoard(newBoard);
  }

  return (<div className={style.background}>
    {popup}
    <div className={style.topIcons}>
      <button onClick={() => setMenu("menu")}><img alt="menu" src='https://www.svgrepo.com/show/532203/menu-alt-1.svg' /></button>
      <Stopwatch isRunning={timer.runs} startTime={timer.start} />
      <button className={style.reset} onClick={reset}><img alt="reset" src='https://www.svgrepo.com/show/451239/reset.svg' /></button>
    </div>

    <div className={style.board} style={{ pointerEvents: interactive ? "all" : "none" }}>
      {board.map((e, i) => <Column column={e} key={i} lost={!interactive && !won} handleClick={(value: boolean, y: number) => handleClick(value, i, y)} />)}
    </div>

    <div className={style.mines}>
      {board.flat().reduce((acc, e) => acc + Number(e.userSelect === TileStates.flagged), 0)}/{minesOnMap}
      <img alt="mine" src="https://www.svgrepo.com/show/378048/gnome-mines.svg" />
    </div>
  </div >);
}

export default Saper;
