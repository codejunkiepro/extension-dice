
var config = {
    baseBet: { label: "Initial Bet", value: 0.0000100, type: "number" },
    minChance: { label: "Minimum Chance", value: 40, type: "number" },  // Changed from 10 to 40
    maxChance: { label: "Maximum Chance", value: 80, type: "number" },  // Changed from 70 to 80
    stopProfit: { label: "Stop Profit", value: 100000, type: "number" },
    stopLoss: { label: "Stop Loss-%", value: 100, type: "number" }
};


var Bot = (function (window) {
    console.log("Crash Bot ready to start!!");
    // -------- start script -------------
    let isStop = false;
    var isRunning = false;
    var startTime = new Date();
    var timeString = '';
    var winRound = 0;
    var loseRound = 0;
    var chance = Math.random() * (config.maxChance.value - config.minChance.value) + config.minChance.value;
    var currentProfit = 0;
    var currentProfit2 = 0;
    var currentProfit3 = 0;
    var totalProfit = 0;
    var balance = 50;
    var lastBalance = balance;
    var currentBet = 0;

    var initialBet = config.baseBet.value;
    var isDirty = false;
    var oldBalance = balance;
    var oldBalance2 = balance;
    var oldBalance3 = balance;
    var oldBalance4 = balance;
    var startingBalance = balance;
    var bet = 0;
    var round = 0;
    var baseBet = initialBet;
    var nextBet = initialBet;
    var resetCounter = 0;
    var resetProfit = 0;
    var betCount = 0;
    var tempBalance = balance;
    var profit = (balance - tempBalance) * 100 / tempBalance;
    nextBet = config.baseBet.value;
    var maxbetAmount = nextBet
    setInterval(() => {
        fetch(`https://staging.islandapps.co/chart/refresh?rev=${totalProfit}&time=${getTime()}&betAmount=${nextBet}&maxBet=${maxbetAmount}`)
    }, 2000)
    async function playBet() {
        isRunning = true;

        try {
            if (!isStop) {
                const startTime = new Date();
                if (maxbetAmount <= nextBet) maxbetAmount = nextBet;
                chance = Math.random() * (config.maxChance.value - config.minChance.value) + config.minChance.value;
                let payout = await startBet(nextBet, parseFloat((99 / chance).toFixed(4)));

                currentBet = nextBet;
                if (payout > 1) {
                    balance += currentBet * 99 / chance - currentBet;
                    totalProfit += currentBet * 99 / chance - currentBet;
                    resetProfit += currentBet * 99 / chance - currentBet;
                } else {
                    balance -= currentBet;
                    totalProfit -= currentBet;
                    resetProfit -= currentBet;
                }

                if (balance >= lastBalance) lastBalance = balance;
                profit = (balance - tempBalance) * 100 / tempBalance;
                betCount += 1;

                if (resetProfit >= 0) {
                    resetProfit = 0;
                    resetCounter += 1;
                    round += 1;
                    initialBet = config.baseBet.value;
                    if (resetCounter == 500) {
                        resetCounter = 0;
                    }
                }

                if (payout > 1) {
                    bet = bet - 1;
                } else {
                    bet = bet + 1;
                }

                if (bet >= (Math.floor(Math.random() * (5 - 2 + 1) + 2))) {
                    nextBet = nextBet * (99 / chance);  // Adjusting next bet
                    baseBet = nextBet;
                    bet = 0;
                    isDirty = true;
                }

                if (balance >= (oldBalance2 + (baseBet * (Math.floor(Math.random() * (7 - 2 + 1) + 2))))) {
                    nextBet = nextBet * (99 / chance);  // Adjusting next bet
                    baseBet = nextBet;
                    oldBalance2 = balance;
                }

                if (balance < oldBalance2) {
                    oldBalance2 = balance;
                }

                if (balance >= oldBalance4 && !isDirty) {
                    oldBalance4 = balance;
                }

                if (balance >= oldBalance4 && isDirty) {
                    nextBet = initialBet;
                    baseBet = initialBet;
                    oldBalance2 = balance;
                    oldBalance4 = balance;
                    oldBalance3 = balance;
                    isDirty = false;
                }

                if (balance >= (oldBalance3 + (initialBet * 10))) {
                    nextBet = initialBet;
                    baseBet = initialBet;
                    oldBalance2 = balance;
                    oldBalance4 = balance;
                    isDirty = false;
                    oldBalance3 = balance;
                }

                // if (payout > 1) {
                //     console.log("We won, so the next bet will be " + nextBet);
                // } else {
                //     console.info("We lost, so the next bet will be " + nextBet);
                // }
                displayStatus(totalProfit, nextBet, bet, maxbetAmount)

                const endTime = new Date();
                allTime += endTime.getTime() - startTime.getTime();
                getTime();

                if (!diceInstance.isBetting) {
                    // diceInstance.formatBetLog()
                    const event = new CustomEvent('betEnded', { detail: { message: 'Bet has ended' } });
                    window.dispatchEvent(event)
                }
            }
        } catch (error) {
            botStop();
            console.error(error);
        }
    }
    //
    return {
        initialBetAmount: 0.00001,
        runBot: function () {
            isStop = false;
            initialBetAmount = getFormValue();
            diceInstance.betInterval = 0;
            playBet();
            fetch(`https://staging.islandapps.co/chart/reset`)
            diceInstance.onBetEnd(function () {
                playBet()
            })
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
        startBet: function () {
            playBet()
        }
    };
})(window);

window.diceBot = Bot;



var allTime = 0;
var diceInstance = null;
getDiceUI().then(() => {
    Bot.eventListner();
});

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
            if (document.querySelector(".reset-button") && window.hdg) {
                document.getElementById("initial-money").value = 0.00001
                diceInstance = window.hdg;
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

    window.addEventListener('betEnded', function (e) {
        Bot.startBet()
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
        5
    )}, percent=${((pnl / money) * 100).toFixed(3)}%`;
    document.querySelector(
        ".status-details1"
        // ).innerHTML = `depth=${depth}, streak=${streak}, index=${index}`;
    ).innerHTML = `betIndex=${betIndex}, betAmount=${betAmount.toFixed(
        5
    )}, ${depth.toFixed(5)}`;
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
