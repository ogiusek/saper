import React from 'react';
import style from './menu.module.scss';
import { IMenu as MenuInterface } from '../App';

interface IMenu {
  setW: React.Dispatch<React.SetStateAction<number>>,
  setH: React.Dispatch<React.SetStateAction<number>>,
  setMenu: React.Dispatch<React.SetStateAction<MenuInterface>>,
};

function Menu({ setW, setH, setMenu }: IMenu) {
  const setTo = (w, h) => {
    setW(w);
    setH(h);
    setMenu("game");
  }
  const showLeaderboard = () => {
    setMenu("leaderboard");
  }
  // fetch(`${process.env.REACT_APP_API_URL}/get/score`).then(e => console.log('a: ', e))

  return (
    <div className={style.menu}>
      <button onClick={() => setTo(6, 6)}>06x06</button>
      <button onClick={() => setTo(8, 8)}>08x08</button>
      <button onClick={() => setTo(12, 12)}>12x12</button>
      <button onClick={() => setTo(16, 16)}>16x16</button>
      <button onClick={showLeaderboard}>SCORES</button>
    </div>
  );
}

export default Menu;