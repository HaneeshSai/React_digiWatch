import { useEffect, useState, useRef } from "react";
import "./App.css";
import sound from "./assets/timer.wav";
const strtstp = ["Start", "Stop"];

export default function App() {
  const [hr, setHr] = useState(new Date().getHours());
  const [min, setMin] = useState(new Date().getMinutes());
  const [sec, setSec] = useState(new Date().getSeconds());
  const [ms, setms] = useState(0);
  const [state, setState] = useState(0);
  const [time, setTime] = useState(0);
  const [startStopwatch, setStartStopwatch] = useState(false);
  const [startTimer, setStartTimer] = useState(false);

  const countdown = useRef();

  let ihr = document.getElementById("hr");
  let imin = document.getElementById("min");
  let isec = document.getElementById("sec");

  useEffect(() => {
    let timer;
    let stopwatch;

    if (state === 1) {
      if (startStopwatch) {
        if (ms > 99) {
          setms(0);
          setSec(sec + 1);
        }
        if (sec > 59) {
          setSec(0);
          setMin(min + 1);
        }
        if (min > 59) {
          setMin(0);
          setHr(hr + 1);
        }
        stopwatch = setInterval(() => {
          setms(Math.round(ms + 0.9));
        }, 8);
      } else if (!startStopwatch) {
        clearInterval(stopwatch);
      }
      return () => clearInterval(stopwatch);
    }

    if (state === 2) {
      if (startTimer) {
        if (sec < 0 && min !== 0) {
          setSec(59);
          setMin(Number(min) - Number(1));
        }

        if (min < 0 && hr !== 0) {
          setMin(59);
          setHr(Number(min) - Number(1));
        }

        if (min == 0 && sec == 0 && hr !== 0) {
          setHr(hr - 1);
          setMin(59);
          setSec(59);
        }

        timer = setInterval(() => {
          setSec(sec - 1);
        }, 1000);

        if (sec === 0 && min === 0 && hr === 0) {
          new Audio(sound).play();
          clearInterval(timer);
          setStartTimer(false);
        }
      }
      return () => clearInterval(timer);
    }
  }, [ms, startStopwatch, startTimer, sec]);

  const timeclicked = (e) => {
    clearInterval(countdown.initTime);
    countdown.time = setInterval(() => {
      setHr(new Date().getHours());
      setMin(new Date().getMinutes());
      setSec(new Date().getSeconds());
    }, 1000);
  };

  const stopwatchClicked = (e) => {
    clearInterval(countdown.time);
    setHr(0);
    setMin(0);
    setSec(0);
  };

  const timerClicked = (e) => {
    setHr(0);
    setMin(0);
    setSec(0);
    clearInterval(countdown.time);
  };

  return (
    <>
      <div className="buttons">
        <button
          onClick={() => {
            setState(0);
            timeclicked();
          }}
          className={state === 0 ? "btnactive" : "btn"}
        >
          Time
        </button>
        <button
          onClick={() => {
            setState(1);
            stopwatchClicked();
          }}
          className={state === 1 ? "btnactive" : "btn"}
        >
          Stop Watch
        </button>
        <button
          onClick={() => {
            setState(2);
            timerClicked();
          }}
          className={state === 2 ? "btnactive" : "btn"}
        >
          Timer
        </button>
      </div>
      <div className="container">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            className="time"
            style={{ width: state === 1 ? "500px" : "350px" }}
          >
            <p>{hr < 10 ? `0${hr}` : hr}</p>
            <span>:</span>
            <p>{min < 10 ? `0${min}` : min}</p>
            <span>:</span>
            <p>{sec < 10 ? `0${sec}` : sec}</p>
            <span className={state === 1 ? "active" : "inactive"}>:</span>
            <p className={state === 1 ? "active" : "inactive"}>
              {ms < 10 ? `0${ms}` : ms}
            </p>
          </div>
          <div className="time-name">
            <p style={{ position: "relative", right: state !== 1 ? 0 : 13 }}>
              HOUR
            </p>
            <p style={{ position: "relative", right: state !== 1 ? -25 : 0 }}>
              MINUTE
            </p>
            <p style={{ position: "relative", left: state !== 1 ? 47 : 13 }}>
              SECOND
            </p>
            <p
              style={{ position: "relative", left: 13 }}
              className={state !== 1 ? "inactive" : ""}
            >
              MILLISECOND
            </p>
          </div>
          <div
            className="start-stop-btns"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <button
              onClick={() => {
                if (state === 1) {
                  !startStopwatch
                    ? setStartStopwatch(true)
                    : setStartStopwatch(false);
                } else if (state === 2) {
                  if (!startTimer) {
                    ihr.value = "";
                    imin.value = "";
                    isec.value = "";
                  }
                  !startTimer ? setStartTimer(true) : setStartTimer(false);
                }
              }}
              className={state !== 0 ? "active" : "inactive"}
            >
              {startStopwatch || startTimer ? strtstp[1] : strtstp[0]}
            </button>

            <button
              onClick={() => {
                if (state === 1) {
                  if (startStopwatch) {
                    return null;
                  } else {
                    setms(0);
                    setHr(0);
                    setMin(0);
                    setSec(0);
                  }
                }

                if (state === 2) {
                  setms(0);
                  setHr(0);
                  setMin(0);
                  setSec(0);
                }
              }}
              className={state !== 0 ? "active" : "inactive"}
            >
              Reset
            </button>
          </div>
          <div className={state === 2 ? "inputs" : "inactive"}>
            <p>Set timer :</p>
            <input
              id="hr"
              type="number"
              placeholder="Hr"
              maxLength="1"
              onChange={(e) => {
                if (e.target.value > 50) {
                  e.target.value = 50;
                  setHr(e.target.value);
                }
                setHr(e.target.value);
              }}
            />
            <input
              id="min"
              type="number"
              placeholder="Min"
              onChange={(e) => {
                if (e.target.value > 59) {
                  e.target.value = 59;
                  setMin(e.target.value);
                }
                setMin(e.target.value);
              }}
            />
            <input
              id="sec"
              type="number"
              placeholder="Sec"
              onChange={(e) => {
                if (e.target.value > 59) {
                  e.target.value = 59;
                  setSec(e.target.value);
                }
                setSec(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
