const terminal = document.getElementById("terminal");

let currentDialogue = "opening";
let currentInput = "";
let playerName = "";
let trackLength = 0;
let currentQuestion;
let lockGeneration = false;
let month = 0;

function evaluateGeneric(vals, fn) {
    return fn.apply(null, vals);
}

const questions_4 = [
    {
        question: "When did construction of the railroad begin?",
        choices: [ "1862", "1863", "1864", "1865" ],
        correct: 2
    },
    {
        question: "When did construction of the railroad conclude?",
        choices: [ "1812", "1859", "1869", "1879" ],
        correct: 3
    },
    {
        question: "Where did the two rail lines meet?",
        choices: [ "Stone", "Howell", "Plymouth", "Promontory" ],
        correct: 4
    },
    {
        question: "What kind of spike was used to complete the railroad?",
        choices: [ "Bronze", "Silver", "Gold", "Platinum" ],
        correct: 3
    },
    {
        question: "How much would the railroad cost if it were built today?",
        choices: [ "1.3 billion", "130 million", "13 million", "1.3 million" ],
        correct: 1
    },
    {
        question: "What did the Treaty of Medicine Lodge do?",
        choices: [
            "Removed Native Americans from land needed by the railroad",
            "Provided medicine to all railroad workers",
            "Legalized killing Native Americans",
            "Forced Native Americans to work on the railroad" ],
        correct: 1
    },
    {
        question: "How did the Treaty of Medicine Lodge help railroad workers?",
        choices: [
            "Established \"Medicine Lodges\" for sick workers",
            "Provided extra workers for understaffed companies",
            "Allowed workers to build freely without Native American intervention",
            "Provided workers with food and tools through trade with native tribes"
        ],
        correct: 3
    },
    {
        question: "How many years did it take to build the railroad?",
        choices: [ "5", "6", "7", "8" ],
        correct: 2
    },
    {
        question: "Which president approved the railroad?",
        choices: [ "James Buchanan", "Andrew Jackson", "Ulysses S. Grant", "Abraham Lincoln" ],
        correct: 4
    },
    {
        question: "How did Native Americans react to the railroad?",
        choices: [
            "Taking the issue to the Supreme Court",
            "Sabotaging the railroad and attacking white settlements", "Helping provide supplies and food to the builders",
            "Staying neutral on the condition that the railroad not disrupt their way of life." ],
        correct: 2
    },
    {
        question: "How did Native Americans react to the railroad?",
        choices: [
            "Taking the issue to the Supreme Court",
            "Sabotaging the railroad and attacking white settlements", "Helping provide supplies and food to the builders",
            "Staying neutral on the condition that the railroad not disrupt their way of life." ],
        correct: 2
    },
];

const dialogues = {
    opening: {
        text: "THE TRANSCONTINENTAL RAILROAD<br><br>You may:<br><br>&ensp; 1. Build the railroad<br>&ensp; 2. Learn about the railroad<br><br>What is your choice? ",
        process: input => (["build", "learn"])[parseInt(input) - 1],
        valid: char => (char.match(/[1-2]/i) && currentInput.length == 0)
    },
    build: {
        text: "Many kinds of people helped build the Transcontinental Railroad.<br><br>You may: <br><br>&ensp; 1. Be an immigrant from China<br>&ensp; 2. Be a veteran of the Civil War<br>&ensp; 3. Find out the differences between these choices<br><br>What is your choice? ",
        process: input => (["immigrant_name", "veteran_name", "differences"])[parseInt(input) - 1],
        valid: char => (char.match(/[1-3]/i) && currentInput.length == 0)
    },
    learn: {
        confirm: true,
        text: "The year is 1863, and the country is in shambles. The Civil War rages between the North and the South. Despite this, dreams of uniting the East and West move the Central Pacific and Union Pacific Railroad Companies to begin construction on a great Transcontinental Railroad. For six long years, they would forge forward from Sacramento and Omaha to meet at Promontory, Utah.<br><br>This game was based on The Oregon Trail, by Bill Heinemann, Don Rawitsch, and Paul Dillenberger. It was coded by Peter Gong and Nithin Vinothkumar.<br><br>Due to the nature of the code, it can be easily modded. If you want to mod the game, all we ask is credit.<br><br><br>Press ENTER to continue.",
        process: input => "opening",
        valid: char => false
    },
    differences: {
        confirm: true,
        text: "Building a transcontinental railroad was no easy task, and both East and West faced difficult challenges.<br><br>If you choose to be a Chinese immigrant, you will have to blast your way through the Rocky Mountains and endure low pay and poor weather, but you will have less distance to cover.<br><br>If you choose to be a Civil War veteran, you will have to brave the hostile Native American tribes and powerful thunderstorms of the Great Plains, as well as a longer distance, but you will be able to lay down track faster. <br><br><br>Press ENTER to continue.",
        process: input => "build",
        valid: char => false
    },
    immigrant_name: {
        text: "What is your name? ",
        process: input => {
            playerName = input;
            return "immigrant_begin"
        },
        valid: char => (char.match(/^[\x00-\x7F]*$/) && currentInput.length < 9)
    },
    immigrant_begin: {
        confirm: true,
        text: "As a Chinese immigrant, you will have to lay 690 miles of rails from Sacramento, California, to Promontory, Utah. You will brave rockslides, snowdrifts, and starvation.<br><br>Each month, you will be asked a question about the time period. If you answer correctly, you will increase your chance to experience a lucky event which will speed up construction.<br><br>If you answer incorrectly, you lay 25% less track and increase your chance of an unlucky event which will slow you down.<br><br>To speed up the game, you will build twice as fast as the real Central Pacific.<br><br><br>Press ENTER to continue.",
        process: input => {
            //console.log(lockGeneration)
            return "immigrant_question_4"
        },
        valid: char => false
    },
    immigrant_question_4: {
        template: true,
        text: "`${generateQuestionFour()}`",
        process: input => {
            lockGeneration = false;
            if (currentQuestion.correct == input) return "immigrant_right"
            else return "immigrant_wrong"
        },
        valid: char => (char.match(/[1-4]/i) && currentInput.length == 0)
    },
    immigrant_wrong: {
        template: true,
        confirm: true,
        text: "`Sorry, the correct answer was ${currentQuestion.choices[currentQuestion.correct - 1]} <br><br><br>Press ENTER to continue.`",
        process: input => {
            trackLength += 20 * 0.75;
            month++;
            return "immigrant_month"
        },
        valid: char => false
    },
    immigrant_right: {
        template: true,
        confirm: true,
        text: "`${currentQuestion.choices[currentQuestion.correct - 1]} was the correct option! <br><br><br>Press ENTER to continue.`",
        process: input => {
            trackLength += 20;
            month++;
            return "immigrant_month"
        },
        valid: char => false
    },
    immigrant_month: {
        template: true,
        confirm: true,
        text: "`You are currently at month ${month}, with ${trackLength} miles done. You have ${690 - trackLength} to go.<br><br>CA ${generateTrackProgress(690)}<br><br><br>Press ENTER to continue.`",
        process: input => {
            return "immigrant_question_4";
        },
        valid: char => false
    },
    veteran_name: {
        text: "What is your name? ",
        process: input => {
            playerName = input;
            return "veteran_begin"
        },
        valid: char => (char.match(/^[\x00-\x7F]*$/) && currentInput.length < 9)
    },
    veteran_begin: {
        confirm: true,
        text: "As a Civil War veteran, you will have to lay 1086 miles of rails from Omaha, Nebraska, to Promontory, Utah. You will have to endure Native American raids and powerful thunderstorms.<br><br>Each month, you will be asked a question about the time period. If you answer correctly, you will increase your chance to experience a lucky event which will speed up construction.<br><br>If you answer incorrectly, you lay 25% less track and increase your chance of an unlucky event which will slow you down.<br><br>To speed up the game, you will build twice as fast as the real Union Pacific.<br><br><br>Press ENTER to continue.",
        process: input => {
            //console.log(lockGeneration)
            return "veteran_question_4"
        },
        valid: char => false
    },
    veteran_question_4: {
        template: true,
        text: "`${generateQuestionFour()}`",
        process: input => {
            lockGeneration = false;
            if (currentQuestion.correct == input) return "veteran_right"
            else return "veteran_wrong"
        },
        valid: char => (char.match(/[1-4]/i) && currentInput.length == 0)
    },
    veteran_wrong: {
        template: true,
        confirm: true,
        text: "`Sorry, the correct answer was ${currentQuestion.choices[currentQuestion.correct - 1]} <br><br><br>Press ENTER to continue.`",
        process: input => {
            trackLength += 40 * 0.75;
            month++;
            return "veteran_month"
        },
        valid: char => false
    },
    veteran_right: {
        template: true,
        confirm: true,
        text: "`${currentQuestion.choices[currentQuestion.correct - 1]} was the correct option! <br><br><br>Press ENTER to continue.`",
        process: input => {
            trackLength += 40;
            month++;
            return "veteran_month"
        },
        valid: char => false
    },
    veteran_month: {
        template: true,
        confirm: true,
        text: "`You are currently at month ${month}, with ${trackLength} miles done. You have ${1086 - trackLength} to go.<br><br>CA ${generateTrackProgress(1086)}<br><br><br>Press ENTER to continue.`",
        process: input => {
            return "veteran_question_4";
        },
        valid: char => false
    },
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
    const index = Math.floor(Math.random() * questions_4.length)
    currentQuestion = questions_4[index];

    if (previousQuestion == currentQuestion) currentQuestion = questions_4[index + 1] || questions_4[index - 1];

    return `${currentQuestion.question}<br><br>&ensp; 1. ${currentQuestion.choices[0]}<br>&ensp; 2. ${currentQuestion.choices[1]}<br>&ensp; 3. ${currentQuestion.choices[2]}<br>&ensp; 4. ${currentQuestion.choices[3]}<br><br>What is your choice? `;
}

function updateTerminal() {
    //console.log("updateTerminal")
    const text = dialogues[currentDialogue].template ? eval(dialogues[currentDialogue].text) : dialogues[currentDialogue].text;
    terminal.innerHTML = text + currentInput + (dialogues[currentDialogue].confirm ? "" : "_");
}

function addChar(char) {
    //console.log("addChar")
    if (!dialogues[currentDialogue].valid(currentInput + char)) return;
    else currentInput += char;
    updateTerminal();
}

function deleteChar() {
    //console.log("deleteChar")
    if (currentInput.length > 0) currentInput = currentInput.slice(0, -1);
    updateTerminal();
}

function processInput() {
    //console.log("processInput")
    if (currentInput === "" && (!dialogues[currentDialogue].confirm || dialogues[currentDialogue].empty)) return;
    currentDialogue = dialogues[currentDialogue].process(currentInput);
    currentInput = "";
    updateTerminal();
}

document.addEventListener("keydown", event => {
    const char = event.key;
    //console.log(char);

    if (event.key === "Backspace") return deleteChar();
    if (event.key === "Enter") return processInput();
    if (!char.match(/[A-Z|0-9]/i) || char.length > 1) return;

    addChar(char);
});

window.addEventListener("load", () => {
    //console.log("READY!");
    updateTerminal();
});
