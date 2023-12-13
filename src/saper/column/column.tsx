import React from 'react';
import style from './column.module.scss';

import { Tile as TileType } from '../../boardLogic/index.ts';
import Tile from './tile/tile.tsx';

interface IColumn {
  column: TileType[],
  handleClick: (_: boolean, y: number) => any,
  lost: boolean
};

function Column({ column, handleClick, lost }: IColumn) {
  return (<div className={style.column}>
    {column.map((e, i) => <Tile tile={e} key={i} lost={lost}
      handleClick={(value) => handleClick(value, i)} />)}
  </div>);
}

export default Column;
