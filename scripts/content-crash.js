var configJSON = {
    "initialValue": 0.1500,
    "totalBetAmount": 9364,
    "bets": [
        { "betAmount": 1, "payout": 10 },
        { "betAmount": 1, "payout": 10 },
        { "betAmount": 8.334, "payout": 1.3 },
        { "betAmount": 1.265, "payout": 9.96 },
        { "betAmount": 1.462, "payout": 9.96 },
        { "betAmount": 15.689, "payout": 1.96 },
        { "betAmount": 3.725, "payout": 9.39 },
        { "betAmount": 4.229, "payout": 9.39 },
        { "betAmount": 5.441, "payout": 8.39 },
        { "betAmount": 7.222, "payout": 7.39 },
        { "betAmount": 9.994, "payout": 6.39 },
        { "betAmount": 14.661, "payout": 5.39 },
        { "betAmount": 9.479, "payout": 9.39 },
        { "betAmount": 12.112, "payout": 8.39 },
        { "betAmount": 15.981, "payout": 7.39 },
        { "betAmount": 22.003, "payout": 6.39 },
        { "betAmount": 16.818, "payout": 9.39 },
        { "betAmount": 18.882, "payout": 9.39 },
        { "betAmount": 59.266, "payout": 4 },
        { "betAmount": 37.178, "payout": 7.39 },
        { "betAmount": 51.066, "payout": 6.39 },
        { "betAmount": 38.952, "payout": 9.39 },
        { "betAmount": 43.655, "payout": 9.39 },
        { "betAmount": 55.537, "payout": 8.39 },
        { "betAmount": 72.998, "payout": 7.39 },
        { "betAmount": 100.177, "payout": 6.39 }
    ]
}

var Bot = (function (window) {
    console.log("Crash Bot ready to start!!");
    console.log("Must Do with 1/262,144");
    // -------- start script -------------
    let isStop = false;
    let initialBetAmount = configJSON.initialValue;
    // let betAmount = initialBetAmount;
    let minBetAmount = 0.00001;
    let maxIndex = 0;
    let betIndex = 0;
    let pnl = 0;
    let info = getInfo(14);
    // -------------- end vars -----------
    let low = 40,
        high = 4999;
    let initDeviation = 5000;
    let deviation = initDeviation;
    let direction = 1;
    var interval = null;
    var event = new Event("End Bet");
    async function playBet() {
        try {
            if (!isStop) {
                const startTime = new Date();
                // calculate low and high from previous result and set values
                let { betAmount, payout } = configJSON.bets[betIndex];
                betAmount = initialBetAmount * betAmount;

                pnl -= betAmount;
                let result = await startBet(betAmount, payout);
                pnl += betAmount * result;

                if (result > 0) {
                    betIndex = 0;

                } else {
                    betIndex++;
                }


                displayStatus(pnl, betAmount, betIndex, maxIndex);
                const endTime = new Date();
                allTime += endTime.getTime() - startTime.getTime();
                getTime();
                // // console.timeEnd("time");
                // if (betIndex > 14) {
                //     botStop();
                // }
                // // playBet();
                // document.dispatchEvent(event);
            }
        } catch (error) {
            botStop();
            console.error(error);
        }
    }
    //
    return {
        initialBetAmount: initialBetAmount,
        runBot: function () {
            isStop = false;
            initialBetAmount = getFormValue();
            diceInstance.betInterval = 0;
            // document.querySelector(".tabs-navs > button:last-child").click();
            // diceInstance && diceInstance.addListener('betEnd', playBet);
            // document.addEventListener("End Bet", playBet);
            diceInstance && diceInstance.addListener('game_prepare', playBet);
            // playBet();
        },
        stopBot: function () {
            isStop = true;
            diceInstance.removeAllListeners();
        },
        eventListner: function () {
            setEventListner();
        },
        reset: function () {
            betIndex = 0;
            betAmount = initialBetAmount;
            pnl = 0;
            displayStatus(pnl, betAmount, betIndex);
        },
    };
})(window);

window.diceBot = Bot;

var allTime = 0;
var diceInstance = null;
getDiceUI().then(() => {
    Bot.eventListner();
});

console.log('ass')

function toggleInOut(flag) {
    if (flag && !diceInstance.isIn) {
        diceInstance.changeToggleWin();
    } else if (!flag && diceInstance.isIn) {
        diceInstance.changeToggleWin();
    }
}

function setAmount(amount) {
    diceInstance.setAmount(diceInstance.amount.sub(diceInstance.amount).add(amount));
}

function setMaxRate(rate) {
    diceInstance.maxRate = rate;
}

function startBet(amount, payout) {
    setAmount(amount);
    setMaxRate(payout);
    return diceInstance.script.handleBet({ amount, payout });
}

function getMaxIndex(array) {
    let maxIndex = 0;
    let max = Math.max(...array);
    return Array.from(array).findIndex(max);
}

function botStop() {
    var botButton = document.querySelector(".bot-button");
    Bot.stopBot();
    botButton.classList.add("bot-stop");
    botButton.innerHTML = "Start Bot";
    botButton.classList.remove("bot-start");
}

function getFormValue() {
    return document.getElementById("initial-money").value * 1;
}

function setLowAndHigh(result) {
    let high = result + 2524,
        low = result - 2524;
    if (high > 9999) {
        high = 9999;
        low = 4950;
    } else if (low < 0) {
        low = 0;
        high = 5049;
    }

    diceInstance.high = high;
    diceInstance.low = low;
}

function getDiceUI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (document.querySelector(".reset-button") && window.crash) {
                document.getElementById("initial-money").value =
                    Bot.initialBetAmount;
                diceInstance = window.crash;
                resolve();
            } else {
                resolve(getDiceUI());
            }
        }, 10);
    });
}

function setEventListner() {
    document
        .querySelector(".reset-button")
        .addEventListener("click", function () {
            console.log("reset time");
            allTime = 0;
            getTime();
            Bot.reset();
        });

    var botButton = document.querySelector(".bot-button");
    // var setButton = document.querySelector(".set-button");
    botButton.addEventListener("click", function () {
        if (this.classList.contains("bot-stop")) {
            Bot.runBot();
            this.classList.add("bot-start");
            this.innerHTML = "Stop Bot";
            this.classList.remove("bot-stop");
        } else {
            Bot.stopBot();
            this.classList.add("bot-stop");
            this.innerHTML = "Start Bot";
            this.classList.remove("bot-start");
        }
    });
}

function getTime() {
    // var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    var seconds = allTime / 1000;
    var time = fancyTimeFormat(seconds);
    document.querySelector(".time-box").innerHTML = time;
    return time;
}

function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function displayStatus(pnl, betAmount, betIndex, depth) {
    // console.log(`depth=${depth}, index=${index}, streak=${streak}`);
    const money = window.allMoney || 1;
    document.querySelector(".status-details").innerHTML = `profit=${pnl.toFixed(
        4
    )}, percent=${((pnl / money) * 100).toFixed(3)}%`;
    document.querySelector(
        ".status-details1"
        // ).innerHTML = `depth=${depth}, streak=${streak}, index=${index}`;
    ).innerHTML = `betIndex=${betIndex}, betAmount=${betAmount.toFixed(
        4
    )}, ${depth}`;
}

function getInfo(count) {
    var rate = 1,
        payout = 2,
        total = 1,
        info = [1];
    for (var i = 1; i <= count; i++) {
        rate = ((i + total) / (payout - 1)).toFixed(3);
        total += rate * 1;
        // console.log(rate);
        info.push(rate * 1);
    }
    return info;
}
