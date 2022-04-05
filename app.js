const field = document.querySelector("#field");
const timeEl = document.querySelector("div.timer");
const square_number = 20;

let colors = [
  "blue",
  "green",
  "red",
  "rgb(125, 0, 184)",
  "yellow",
  "rgb(255, 102, 0)",
  "rgb(255, 0, 234)",
  "rgb(119, 48, 0)",
  "white",
  "grey",
];
colors = [...colors, ...colors]
let state;
resetState()
let intermediateState = [];

function resetState() {
  colors.sort(() => Math.random() - 0.5);
  state = colors.reduce((acc, color, index) => {
    return {
      ...acc,
      [index]: {
        id: index,
        color,
        state: "closed",
      },
    };
  }, {});
}

for (let i = 0; i < square_number; i++) {
  const square = document.createElement("div");
  square.classList.add("square");
  square.setAttribute("id", i);
  square.addEventListener("click", () => onClick(square, i));
  field.append(square);
}

function onClick(square, id) {
  if (!intervalId) {
    timerStart();
  }
  if (intermediateState.length >= 2) return;
  if (state[id].state === "success") return;
  if (intermediateState.length == 1 && intermediateState.includes(id)) {
    intermediateState = [];
    state[id].state = "closed";
    return square.style.removeProperty("background");
  }
  square.style.background = state[id].color;
  state[id].state = "opened";
  intermediateState.push(id);
  setTimeout(checkIntermediateState, 1000);
}

function checkIntermediateState() {
  if (intermediateState.length < 2) return;
  const square0 = state[intermediateState[0]];
  const square1 = state[intermediateState[1]];
  if (square0.color === square1.color) {
    state[intermediateState[0]].state = "success";
    state[intermediateState[1]].state = "success";
  } else {
    const square0_elm = document.getElementById(intermediateState[0]);
    const square1_elm = document.getElementById(intermediateState[1]);
    square0_elm.style.removeProperty("background");
    square1_elm.style.removeProperty("background");
    state[intermediateState[0]].state = "closed";
    state[intermediateState[1]].state = "closed";
  }
  intermediateState = [];
  checkFinish();
}

function checkFinish() {
  if (Object.values(state).every((elem) => elem.state === "success")) {
    timerStop();
    showGameEnd();
  }
}

function showGameEnd() {
  const finish = document.createElement("div");
  finish.classList.add("finish_container");
  finish.innerHTML = `<div class="finish">
  <h1>The end</h1>
  <div>your time: ${minute}:${second}:${millisecond}</div>
  <div>Click to restart</div>
  </div>`;
  finish.addEventListener("click", () => {
    finish.remove();
    timerReset();
    resetState();
    document.querySelectorAll('.square').forEach((el)=> el.style.removeProperty('background-color'))
  });
  document.body.append(finish);
}

const minuteElement = document.querySelector(".minute");
const secondElement = document.querySelector(".second");
const millisecondElement = document.querySelector(".millisecond");
const startButton = document.querySelector(".start");
const pauseButton = document.querySelector(".pause");
const resetButton = document.querySelector(".reset");

// --------------------------------------------------------------Timer--------------------------------------------------------------------

startButton.addEventListener("click", timerStart);

pauseButton.addEventListener("click", timerStop);

resetButton.addEventListener("click", timerReset);

function timerStart() {
  clearInterval(intervalId);
  intervalId = setInterval(startTimer, 10);
}

function timerStop() {
  clearInterval(intervalId);
  intervalId = null;
}

function timerReset() {
  clearInterval(intervalId);
  intervalId = null;
  zeroTimer();
}

function zeroTimer() {
  minute = 00;
  second = 00;
  millisecond = 00;
  minuteElement.innerText = "00";
  secondElement.innerText = "00";
  millisecondElement.innerText = "00";
}

let minute = 00;
let second = 00;
let millisecond = 00;
let intervalId;

function startTimer() {
  //millisecond
  millisecond++;
  if (millisecond < 9) {
    millisecondElement.innerText = "0" + millisecond;
  }
  if (millisecond > 9) {
    millisecondElement.innerText = millisecond;
  }
  if (millisecond > 99) {
    second++;
    secondElement.innerText = "0" + second;
    millisecond = 0;
    millisecondElement.innerText = "0" + millisecond;
  }

  //second
  if (second < 9) {
    secondElement.innerText = "0" + second;
  }
  if (second > 9) {
    secondElement.innerText = second;
  }
  if (second > 59) {
    minute++;
    minuteElement.innerText = "0" + minute;
    second = 0;
    secondElement.innerText = "0" + second;
  }

  // minute
  if (minute < 10) {
    minuteElement.innerText = "0" + minute;
  }
  if (minute > 9) {
    minuteElement.innerText = minute;
  }
}
