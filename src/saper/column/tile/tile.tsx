import React from 'react';
import style from './tile.module.scss';

import { Tile as TileType, TileStates } from '../../../boardLogic/index.ts';

interface ITile {
  tile: TileType
  handleClick: (_: boolean) => any,
  lost: boolean
};

function Tile({ tile, handleClick, lost }: ITile) {
  return (<button className={`${style.tile} 
  ${tile.userSelect === TileStates.selected && style.selected} 
  ${tile.userSelect === TileStates.selected && tile.neighbours === 0 && style.empty}`}
    onClick={() => handleClick(false)}
    onContextMenu={(e) => Boolean(e.preventDefault()) || handleClick(true)}>
    {lost && tile.value ? <img alt="mine" src='https://www.svgrepo.com/show/378048/gnome-mines.svg' /> :
      tile.userSelect === TileStates.selected ?
        Number(tile.neighbours) :
        tile.userSelect === TileStates.flagged ?
          <img alt="flag" src='https://www.svgrepo.com/show/527047/flag.svg' /> : ""}
  </button>);
}

export default Tile;
