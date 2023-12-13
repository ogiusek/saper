import React, { useState } from "react";
import style from "./winScreen.module.scss";
import InputName from "./inputName.tsx";

interface IWinScreen {
  board_size: string,
  time_in_ms: number,
  hide: () => any,
};

function WinScreen({ board_size, time_in_ms, hide }: IWinScreen) {
  const [popup, setPopup] = useState(<React.Fragment />);

  function postScore(nick: string) {
    const body = JSON.stringify({ nickname: nick, time_in_ms: time_in_ms, board_size: board_size });
    fetch(`${process.env.REACT_APP_API_URL}/post/score`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: body
    }).then(e => e.status).then((status) => hide());
  }

  function saveResult() {
    setPopup(<InputName confirmName={postScore} />);
  }

  return (<div>
    {popup}
    <div className={style.background} onClick={hide}></div>
    <div className={style.modal}>
      <p>You have won in {Math.round(time_in_ms / 1000)}s</p>
      <p>on {board_size} size board.</p>
      <button onClick={saveResult}>Save result</button>
    </div>
  </div>);
}

export default WinScreen;