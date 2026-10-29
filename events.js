const events = {
    immigrant: {
        positive: [
            {
                text: "Your team was caught in a snowdrift!<br><br>Lose 1 month.",
                time: 1,
                rails: 0
            },
            {
                text: "A massive rockslide damaged your latest section of track<br><br>Lose 5 miles.",
                time: 1,
                rails: 5
            },
            {
                text: "You meet an impassable mountain! You have to use risky explosives to get through.<br><br>Lose 2 months.",
                time: 2,
                rails: 0
            },
            {
                text: "One of your explosive crates went off, damaging the track as well as injuring workers.<br><br>Lose 1 month and 5 miles of rails.",
                time: 1,
                rails: 5
            }
        ],
        
        negative: [
            {
                text: "Your team gets ahold of higher quality nitroglycerine, speeding up your progress through the mountains.<br><br>Gain 5 miles.",
                rails: 5
            },
            {
                text: "The weather is wonderful this month, and you're able to lay down track faster without it constantly snowing.<br><br>Gain 7 miles.",
                rails: 7
            },
            {
                text: "You get an extra supply of food, helping keep you energized while working.<br><br>Gain 3 miles.",
                rails: 3
            }
        ]
    },

    veteran: {
        positive: [
            {
                text: "You make a treaty with native tribes, leaving you to lay tracks unhindered.<br><br>Gain 5 miles.",
                rails: 5
            },
            {
                text: "The weather is excellent this month, and you're able to work faster without constantly being inside a thunderstorm.<br><br>Gain 7 miles.",
                rails: 7
            },
            {
                text: "A new batch of workers joins your team.<br><br>Gain 3 miles.",
                rails: 3
            },
        ],

        negative: [
            {
                text: "Native Americans tear up a section of your track.<br><br>Lose 10 miles.",
                time: 0,
                rails: 10
            },
            {
                text: "A Native American raid steals most of your supplies.<br><br>Lose 1 month.",
                time: 1,
                rails: 0
            },
            {
                text: "Your progress is interrupted by a massive buffalo herd which will not budge.<br><br>Lose 2 months.",
                time: 2,
                rails: 0
            },
            {
                text: "A tornado forms over your track! It destroys the railroad as well as necessary supplies.<br><br>Lose 2 months and 15 miles of rails.",
                time: 2,
                rails: 15
            },
        ]
    }
}