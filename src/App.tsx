import React, { useState } from 'react';
import style from './App.module.scss';

import Saper from './saper/saper.tsx';
import Menu from './menu/menu.tsx';
import Leaderboard from './leaderboard/leaderboard.tsx';

type IMenu = "game" | "menu" | "leaderboard";

function App() {
  const [menu, setMenu] = useState<IMenu>("menu");
  const [w, setW] = useState(8);
  const [h, setH] = useState(8);

  return (
    <div className={style.app}>
      {menu === "game" && <Saper setMenu={setMenu} w={w} h={h} mines={100 / 6} />}
      {menu === "menu" && <Menu setMenu={setMenu} setW={setW} setH={setH} />}
      {menu === "leaderboard" && <Leaderboard setMenu={setMenu} />}
    </div>
  );
}

export { IMenu };
export default App;