import React, { useState, useEffect } from 'react';

interface IStopwatch {
  startTime: number,
  isRunning: boolean,
};

function Stopwatch({ startTime, isRunning }: IStopwatch) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning)
      interval = setInterval(
        () => setTime(new Date().getTime() - new Date(startTime).getTime()), 10);
    else clearInterval(interval);

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const minutes = new Date(time).getMinutes().toString().padStart(2, '0');
  const seconds = new Date(time).getSeconds().toString().padStart(2, '0');

  return (
    // <div className="stopwatch">
    <span style={{ fontSize: "1rem", color: "white" }}>
      {startTime === 0 ? "00" : minutes}:{startTime === 0 ? "00" : seconds}
    </span>
    // </div>
  );
};

export default Stopwatch;
