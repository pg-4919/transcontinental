try {
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

    const dialogues = {
        opening: {
            text: "THE TRANSCONTINENTAL RAILROAD<br><br>You may:<br><br>&ensp; 1. Build the railroad<br>&ensp; 2. Learn about the railroad<br><br>What is your choice? ",
            process: input => (["build", "learn"])[parseInt(input) - 1],
            valid: char => (char.match(/[1-2]/i) && current.input.length == 0)
        },
        build: {
            text: "Many kinds of people helped build the Transcontinental Railroad.<br><br>You may: <br><br>&ensp; 1. Be an immigrant from China<br>&ensp; 2. Be a veteran of the Civil War<br>&ensp; 3. Find out the differences between these choices<br><br>What is your choice? ",
            process: input => (["immigrant_name", "veteran_name", "differences"])[parseInt(input) - 1],
            valid: char => (char.match(/[1-3]/i) && current.input.length == 0)
        },
        learn: {
            confirm: true,
            text: "The year is 1863, and the country is in shambles. The Civil War rages between the North and the South. Despite this, dreams of uniting the East and West move the Central Pacific and Union Pacific Railroad Companies to begin construction on a great Transcontinental Railroad. For six long years, they would forge forward from Sacramento and Omaha to meet at Promontory, Utah.<br><br>This game was based on The Oregon Trail, by Bill Heinemann, Don Rawitsch, and Paul Dillenberger. It was coded by Peter Gong and Nithin Vinothkumar.<br><br>Due to the nature of the code, it can be easily modded. If you want to mod the game, all we ask is credit.<br><br>Huge thanks to Pix (https://www.youtube.com/c/Pix-music) for the music.<br><br><br>Press ENTER to continue.",
            process: input => "opening",
            valid: char => false
        },
        differences: {
            confirm: true,
            text: "Building a transcontinental railroad was no easy task, and both East and West faced difficult challenges.<br><br>If you choose to be a Chinese immigrant, you will have to blast your way through the Rocky Mountains and endure low pay and poor weather, but you will have less distance to cover.<br><br>If you choose to be a Civil War veteran, you will have to brave the hostile Native American tribes and powerful thunderstorms of the Great Plains, as well as a longer distance, but you will be able to lay down track faster. <br><br><br>Press ENTER to continue.",
            process: "build",
            valid: false
        },
        immigrant_name: {
            text: "What is your name? ",
            process: input => {
                playerName = input;
                return "immigrant_begin"
            },
            valid: char => (char.match(/^[\x00-\x7F]*$/) && current.input.length < 9)
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
            valid: char => (char.match(/[1-4]/i) && current.input.length == 0)
        },
        immigrant_question_2: {
            template: true,
            text: "`${generateQuestionTwo()}`",
            process: input => {
                lockGeneration = false;
                if (currentQuestion.correct == input) return "immigrant_right"
                else return "immigrant_wrong"
            },
            valid: char => (char.match(/[1-2]/i) && current.input.length == 0)
        },
        immigrant_wrong: {
            template: true,
            confirm: true,
            text: "`Sorry, the correct answer was \"${currentQuestion.choices[currentQuestion.correct - 1]}\" <br><br><br>Press ENTER to continue.`",
            process: input => {
                meters.negative++;
                trackLength += 20 * 0.75;
                current.month++;
                return "immigrant_month"
            },
            valid: char => false
        },
        immigrant_right: {
            template: true,
            confirm: true,
            text: "`\"${currentQuestion.choices[currentQuestion.correct - 1]}\" was the correct option! <br><br><br>Press ENTER to continue.`",
            process: input => {
                meters.positive++;
                trackLength += 20;
                current.month++;
                return "immigrant_month"
            },
            valid: char => false
        },
        immigrant_month: {
            template: true,
            confirm: true,
            text: "`You are currently at month ${current.month}, with ${trackLength} miles done. You have ${((690 - trackLength) > 0) ? 690 - trackLength : 'no more'} to go.<br><br>CA ${generateTrackProgress(690)}<br><br><br>Press ENTER to continue.`",
            process: input => {
                if (trackLength >= 690) return "end";
                else return generateEventImmigrant();
            },
            valid: char => false
        },
        immigrant_event: {
            template: true,
            confirm: true,
            text: "`${currentEvent.text}<br><br><br>Press ENTER to continue.`",
            process: input => "immigrant_question_4",
            valid: char => false
        },
        veteran_name: {
            text: "What is your name? ",
            process: input => {
                playerName = input;
                return "veteran_begin"
            },
            valid: char => (char.match(/^[\x00-\x7F]*$/) && current.input.length < 9)
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
            valid: char => (char.match(/[1-4]/i) && current.input.length == 0)
        },
        veteran_question_2: {
            template: true,
            text: "`${generateQuestionTwo()}`",
            process: input => {
                lockGeneration = false;
                if (currentQuestion.correct == input) return "veteran_right"
                else return "veteran_wrong"
            },
            valid: char => (char.match(/[1-2]/i) && current.input.length == 0)
        },
        veteran_wrong: {
            template: true,
            confirm: true,
            text: "`Sorry, the correct answer was \"${currentQuestion.choices[currentQuestion.correct - 1]}\" <br><br><br>Press ENTER to continue.`",
            process: input => {
                meters.negative++;
                trackLength += 40 * 0.75;
                current.month++;
                return "veteran_month"
            },
            valid: char => false
        },
        veteran_right: {
            template: true,
            confirm: true,
            text: "`\"${currentQuestion.choices[currentQuestion.correct - 1]} was the correct option!\" <br><br><br>Press ENTER to continue.`",
            process: input => {
                meters.positive++;
                trackLength += 40;
                current.month++;
                return "veteran_month"
            },
            valid: char => false
        },
        veteran_month: {
            template: true,
            confirm: true,
            text: "`You are currently at month ${current.month}, with ${trackLength} miles done. You have ${1086 - trackLength} to go.<br><br>NE ${generateTrackProgress(1086)}<br><br><br>Press ENTER to continue.`",
            process: input => {
                if (trackLength >= 1086) return "end";
                else return generateEventVeteran();
            },
            valid: char => false
        },
        veteran_event: {
            template: true,
            confirm: true,
            text: "`${currentEvent.text}<br><br><br>Press ENTER to continue.`",
            process: input => "veteran_question_4",
            valid: char => false
        },
        end: {
            confirm: true,
            template: true,
            text: "`You completed your side of the railroad in ${month} months, and reached Promontory Point, Utah! (Keep in mind, you went twice as fast as the real railroad companies.)<br><br> Thank you for playing the Transcontinental Railroad.<br><br><br>Press ENTER to play again.`",
            process: input => {
                window.location.reload();
            }
        },
    }

    function weightedRand(spec) {
        let i, j, table = [];
        for (i in spec) {
            for (j = 0; j < spec[i] * 10; j++) table.push(i);
        }
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
        const index = Math.floor(Math.random() * questions_4.length)
        currentQuestion = questions_4[index];

        if (previousQuestion == currentQuestion) currentQuestion = questions_4[index + 1] || questions_4[index - 1];

        return `${currentQuestion.question}<br><br>&ensp; 1. ${currentQuestion.choices[0]}<br>&ensp; 2. ${currentQuestion.choices[1]}<br>&ensp; 3. ${currentQuestion.choices[2]}<br>&ensp; 4. ${currentQuestion.choices[3]}<br><br>What is your choice? `;
    }

    function generateQuestionTwo() {
        if (lockGeneration) {
            return `${currentQuestion.question}<br><br>&ensp; 1. ${currentQuestion.choices[0]}<br>&ensp; 2. ${currentQuestion.choices[1]}<br><br>What is your choice? `;
        }

        lockGeneration = true;
        const previousQuestion = currentQuestion;
        const index = Math.floor(Math.random() * questions_2.length)
        currentQuestion = questions_2[index];

        if (previousQuestion == currentQuestion) currentQuestion = questions_2[index + 1] || questions_2[index - 1];

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
        //console.log("processInput")
        if (current.input === "" && (!dialogues[current.dialogue].confirm || dialogues[current.dialogue].empty)) return;
        current.dialogue = dialogues[current.dialogue].process(current.input);
        current.input = "";
        updateTerminal();
    }

    document.addEventListener("keydown", async event => {
        if (!songApproved) {
            const audio = new Audio("song.mp3");
            audio.loop = true;
            audio.addEventListener("canplaythrough", () => audio.play());
            songApproved = true;
        }
        const char = event.key;
        //console.log(char);

        if (event.key === "Backspace") return deleteChar();
        if (event.key === "Enter") return processInput();
        if (!char.match(/[A-Z|0-9]/i) || char.length > 1) return;

        addChar(char);
    });

    window.addEventListener("load", updateTerminal);

} catch (err) {
    alert(err);
}