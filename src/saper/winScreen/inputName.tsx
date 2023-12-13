import React, { useEffect, useState } from "react";
import style from "./winScreen.module.scss";

interface IInputName {
  confirmName: (_: string) => any
}

const nickRegex = /^(?=[a-zA-Z0-9_-]{3,32}$)[a-zA-Z0-9_-]+$/;

function InputName({ confirmName }: IInputName) {
  const [nick, setNick] = useState('');
  const [isValid, setIsValid] = useState(false);

  const onSubmit = () => {
    if (!isValid) return;
    confirmName(nick);
  }

  useEffect(() => setIsValid(nickRegex.test(nick)), [nick]);

  return <form className={style.form} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
    <label htmlFor="inputId">nickname</label>
    <input id="inputId" type="text" min={3} max={32} value={nick} onChange={(e) => setNick(e.target.value)} required />
    <button type="submit" disabled={!isValid} className={`${isValid && style.valid}`}>Submit</button>
  </form>;
}

export default InputName;