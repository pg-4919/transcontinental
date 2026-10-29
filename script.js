
const terminal = document.getElementById("terminal");

let playerName = "";
let trackLength = 0;
let currentQuestion;
let lockGeneration = false;
let currentEvent;
let songApproved = false;

const meters = { positive: 0, negative: 0 };
const current = {
    dialogue: "opening",
    input: "",
    track: 0,
    month: 0,
    question: {}
};

function evaluateGeneric(vals, fn) {
    return fn.apply(null, vals);
}


function weightedRand(spec) {
    const table = [];
    for (let i in spec) for (let j = 0; j < spec[i] * 10; j++) table.push(i);
    return table[Math.floor(Math.random() * table.length)];
}

function generateEventImmigrant() {
    meters.positive += parseInt(weightedRand({ 0: 0.7, 1: 0.3 }));
    meters.negative += parseInt(weightedRand({ 0: 0.7, 1: 0.3 }));

    if (meters.positive > 8) {
        currentEvent = events.immigrant.positive[Math.floor(Math.random() * 3)]
        trackLength += currentEvent.rails;
        meters.positive = 0;
        return "immigrant_event";
    }
    if (meters.negative > 5) {
        currentEvent = events.immigrant.negative[weightedRand({ 0: 4, 1: 3, 2: 2, 3: 1 })];
        trackLength -= currentEvent.rails;
        current.month += currentEvent.time;
        meters.negative = 0;
        return "immigrant_event";
    }

    if (Math.random() > 0.33) return "immigrant_question_4";
    else return "immigrant_question_2";
}

function generateEventVeteran() {
    meters.positive += parseInt(weightedRand({ 0: 0.7, 1: 0.3 }));
    meters.negative += parseInt(weightedRand({ 0: 0.7, 1: 0.3 }));

    if (meters.positive > 8) {
        currentEvent = events.veteran.positive[Math.floor(Math.random() * 3)]
        trackLength += currentEvent.rails;
        meters.positive = 0;
        return "veteran_event";
    }
    if (meters.negative > 5) {
        currentEvent = events.veteran.negative[weightedRand({ 0: 4, 1: 3, 2: 2, 3: 1 })];
        trackLength -= currentEvent.rails;
        current.month += currentEvent.time;
        meters.negative = 0;
        return "veteran_event";
    }

    if (Math.random() > 0.33) return "veteran_question_4";
    else return "veteran_question_2";
}

function generateTrackProgress(total) {
    const progressPercent = Math.round((trackLength / total) * 100);
    //console.log(`PROGRESS PERCENT: ${progressPercent}`)
    return `${"=".repeat(Math.round(progressPercent / 10))}${"-".repeat(10 - Math.round(progressPercent / 10))} UT | ${progressPercent}%`
}

function generateQuestionFour() {
    //console.log("generateQuestion4")
    if (lockGeneration) {
        //console.log("Generation blocked");
        return `${currentQuestion.question}<br><br>&ensp; 1. ${currentQuestion.choices[0]}<br>&ensp; 2. ${currentQuestion.choices[1]}<br>&ensp; 3. ${currentQuestion.choices[2]}<br>&ensp; 4. ${currentQuestion.choices[3]}<br><br>What is your choice? `;
    }

    lockGeneration = true;
    const previousQuestion = currentQuestion;
    const index = Math.floor(Math.random() * questions.four.length)
    currentQuestion = questions.four[index];

    if (previousQuestion == currentQuestion) currentQuestion = questions.four[index + 1] || questions.four[index - 1];

    return `${currentQuestion.question}<br><br>&ensp; 1. ${currentQuestion.choices[0]}<br>&ensp; 2. ${currentQuestion.choices[1]}<br>&ensp; 3. ${currentQuestion.choices[2]}<br>&ensp; 4. ${currentQuestion.choices[3]}<br><br>What is your choice? `;
}

function generateQuestionTwo() {
    if (lockGeneration) {
        return `${currentQuestion.question}<br><br>&ensp; 1. ${currentQuestion.choices[0]}<br>&ensp; 2. ${currentQuestion.choices[1]}<br><br>What is your choice? `;
    }

    lockGeneration = true;
    const previousQuestion = currentQuestion;
    const index = Math.floor(Math.random() * questions.two.length)
    currentQuestion = questions.two[index];

    if (previousQuestion == currentQuestion) currentQuestion = questions.two[index + 1] || questions.two[index - 1];

    return `${currentQuestion.question}<br><br>&ensp; 1. ${currentQuestion.choices[0]}<br>&ensp; 2. ${currentQuestion.choices[1]}<br><br>What is your choice? `;
}

function updateTerminal() {
    //console.log("updateTerminal")
    const text = dialogues[current.dialogue].template ? eval(dialogues[current.dialogue].text) : dialogues[current.dialogue].text;
    terminal.innerHTML = text + current.input + (dialogues[current.dialogue].confirm ? "" : "_");
}

function addChar(char) {
    //console.log("addChar")
    if (!dialogues[current.dialogue].valid(current.input + char)) return;
    else current.input += char;
    updateTerminal();
}

function deleteChar() {
    //console.log("deleteChar")
    if (current.input.length > 0) current.input = current.input.slice(0, -1);
    updateTerminal();
}

function processInput() {
    //if (current.input === "" && (!dialogues[current.dialogue].confirm || dialogues[current.dialogue].empty)) return;
    current.dialogue = dialogues[current.dialogue].process(current.input);
    current.input = "";
    updateTerminal();
}

document.addEventListener("keypress", async event => {
    if (!songApproved) {
        const audio = new Audio("song.mp3");
        audio.loop = true;
        audio.addEventListener("canplaythrough", () => audio.play());
        songApproved = true;
    }
    const char = event.key;

    if (event.key === "Backspace") return deleteChar();
    if (event.key === "Enter") return processInput();
    if (!char.match(/[A-Z|0-9]/i) || char.length > 1) return;

    addChar(char);
});

window.addEventListener("load", updateTerminal);
window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("./worker.js", { scope: "https://pg-4919.github.io/transcontinental" });
});
