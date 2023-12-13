import React, { useEffect, useReducer, useState } from 'react';
import style from './leaderboard.module.scss';

import { IMenu } from '../App';

interface ILeaderboard {
  setMenu: React.Dispatch<React.SetStateAction<IMenu>>
};

interface IFilters {
  user_name?: string,
  board_size?: string,
  page: number
};

interface IFiltersAction {
  type: 'user_name' | 'board_size' | 'next_page' | 'prev_page',
  state?: string
};

interface IScore {
  nickname: string,
  board_size: string,
  time_in_ms: number
};

function filtersReducer(state: IFilters, action: IFiltersAction): IFilters {
  state[action.type] = action.state;
  return state;
}

function getScores(filters: IFilters, abortController?: AbortController): Promise<IScore[]> {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    filters.board_size && params.append("board_size", filters.board_size);
    filters.user_name && params.append("user_name", filters.user_name);
    fetch(`${process.env.REACT_APP_API_URL}/get/score?${params.toString()}`, {
      signal: abortController?.signal
    }).then(response => response.json()).then((result: IScore[]) => resolve(result)).catch(reject)
  });
}

function Leaderboard({ setMenu }: ILeaderboard) {
  const [scores, setScores] = useState<IScore[]>();
  const [filters, dispachFilters] = useReducer(filtersReducer, { page: 0, board_size: "06X06", user_name: '' } as IFilters);

  function dispachWithFetch(action: IFiltersAction) {
    dispachFilters(action);
    setScores([]);
  }

  useEffect(() => {
    const abortController = new AbortController();
    getScores(filters, abortController).then(scores => {
      setScores(scores);
    });
    return () => abortController.abort();
  }, [filters, filters.board_size, filters.user_name, filters.page, dispachFilters]);

  return (
    <div className={style.leaderboard}>
      <button className={style.menuButton} onClick={() => setMenu("menu")}><img alt="menu" src='https://www.svgrepo.com/show/532203/menu-alt-1.svg' /></button>
      <div className={style.dropdown}>
        <button className={style.dropdownButton} onClick={e => e.currentTarget.classList.toggle(style.checked)}></button>
        <div className={style.dropdownMenu}>
          <label htmlFor={style.boardSize}>board size</label>
          <select id={style.boardSize} onChange={(e) => dispachWithFetch({ type: "board_size", state: e.target.value })}>
            <option value={"06X06"}>06X06</option>
            <option value={"08X08"}>08X08</option>
            <option value={"12X12"}>12X12</option>
            <option value={"16X16"}>16X16</option>
          </select>
          <label htmlFor={style.userName}>user name</label>
          <input id={style.userName} type='text' value={filters.user_name} onChange={(e) => dispachWithFetch({ type: 'user_name', state: e.target.value })} />
        </div>
      </div>
      <ul>
        <li>
          <p>board</p>
          <p>nickname</p>
          <p>time</p>
        </li>
        {scores?.map((e, i) => {
          return <li key={i}>
            <p>{e.board_size}</p>
            <p>{e.nickname}</p>
            <p>{Math.round(e.time_in_ms / 10) / 100}s</p>
          </li>;
        })}
      </ul>
    </div >
  );
}

export default Leaderboard;