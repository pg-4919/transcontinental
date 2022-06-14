const terminal = document.getElementById("terminal");

let currentDialogue = "opening";
let currentInput = "";
let playerName = "";

function evaluateGeneric(vals, fn){
    return fn.apply(null, vals);
}

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
        text: "The year is 1863, and the country is in shambles. The Civil War rages between the North and the South. Despite this, dreams of uniting the East and West move the Central Pacific and Union Pacific Railroad Companies to begin construction on a great Transcontinental Railroad. For seven years, they would forge forward from Sacramento and Omaha to meet at Promontory, Utah.<br><br>This game was based on The Oregon Trail, by Bill Heinemann, Don Rawitsch, and Paul Dillenberger. It was coded by Peter Gong and Nithin Vinothkumar.<br><br>Due to the nature of the code, it can be easily modded. If you want to mod the game, all we ask is credit.<br><br><br>Press ENTER to continue.",
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
        text: "As a Chinese immigrant, you will have to lay 690 miles of rails from Sacramento, California, to Promontory, Utah. You will brave rockslides, snowdrifts, and starvation.<br><br>Each month, you will be asked a question about the time period. If you answer correctly, you will increase your chance to experience a lucky event which will speed up construction.<br><br>If you answer incorrectly, you lay 25% less track and increase your chance of an unlucky event which will slow you down.<br><br><br>Press ENTER to continue.",
        process: input => "immigrant_question",
        valid: char => (char.match(/^\d+$/) && currentInput.length < 9)
    },
    veteran_name: {
        //wip
    }

}

function updateTerminal() {
    const text = dialogues[currentDialogue].template ? eval(dialogues[currentDialogue].text) : dialogues[currentDialogue].text;
    terminal.innerHTML = text + currentInput + (dialogues[currentDialogue].confirm ? "" : "_");
}

function addChar(char) {
    if (!dialogues[currentDialogue].valid(currentInput + char)) return;
    else currentInput += char;
    updateTerminal();
}

function deleteChar() {
    if (currentInput.length > 0) currentInput = currentInput.slice(0, -1);
    updateTerminal();
}

function processInput() {
    if (currentInput === "" && (!dialogues[currentDialogue].confirm || dialogues[currentDialogue].empty)) return;
    currentDialogue = dialogues[currentDialogue].process(currentInput);
    currentInput = "";
    updateTerminal();
}

document.addEventListener("keydown", event => {
    let char = String.fromCharCode(event.keyCode);
    console.log(event.keyCode);

    if (event.keyCode === 8) return deleteChar();
    if (event.keyCode === 13) return processInput();
    if (!char.match(/[A-Z|0-9]/i)) return;
    if (!event.shiftKey) char = char.toLowerCase();

    addChar(char);
});

window.addEventListener("load", () => {
    console.log("READY!");
    updateTerminal();
});

if("serviceWorker" in navigator) {
    navigator.serviceWorker.register("worker.js");
};
