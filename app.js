const field = document.querySelector('#field')
const timeEl = document.querySelector('#time')
const square_number = 20

let time = 0
let colors = [
    'blue',
    'green',
    'red',
    'rgb(125, 0, 184)',
    'yellow',
    'rgb(255, 102, 0)',
    'rgb(255, 0, 234)',
    'rgb(119, 48, 0)',
    'white',
    'grey',
]
colors = [...colors, ...colors].sort(() => Math.random() - 0.5);
let state = colors.reduce((acc, color, index) => {
    return {
        ...acc,
        [index]: {
            id: index,
            color,
            state: 'closed',
        }
    };
}, {});
let intermediateState = [];

for (let i = 0; i < square_number; i++) {
    const square = document.createElement('div')
    square.classList.add('square')
    square.setAttribute('id', i);
    square.addEventListener('click', () => onClick(square, i))
    field.append(square)
}

function onClick(square, id) {
    if (intermediateState.length >= 2)
        return;
    if (state[id].state === 'success')
        return;
    if (intermediateState.length == 1 && intermediateState.includes(id)) {
        intermediateState = [];
        state[id].state = 'closed'
        return square.style.removeProperty('background');
    }
    square.style.background = state[id].color;
    state[id].state = 'opened';
    intermediateState.push(id);
    setTimeout(checkIntermediateState, 1000); 
}

function checkIntermediateState() {
    if (intermediateState.length < 2)
        return;
    const square0 = state[intermediateState[0]];
    const square1 = state[intermediateState[1]];
    if (square0.color === square1.color) {
        state[intermediateState[0]].state = 'success';
        state[intermediateState[1]].state = 'success';
    } else {
        const square0_elm = document.getElementById(intermediateState[0]);
        const square1_elm = document.getElementById(intermediateState[1]);
        square0_elm.style.removeProperty('background');
        square1_elm.style.removeProperty('background');
        state[intermediateState[0]].state = 'closed';
        state[intermediateState[1]].state = 'closed';
    }
    intermediateState = [];
}