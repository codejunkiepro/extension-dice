(function (window) {
    async function getControlPanel() {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (document.querySelector(".game-control-panel")) {
                    resolve();
                } else {
                    resolve(getControlPanel());
                }
            }, 10);
        });
    }
    async function injectUI() {
        // const inject =
        //     '<style>.button-container {display: flex;justify-content: space-around;margin-top: 1.875rem;}.bot-button.bot-stop {width: 100%;padding: 7px;background-color: var(--primary-color);background-image: conic-gradient(from 1turn, #6acf15, #209b44);color: white;border-radius: 2px;}.bot-button.bot-start {width: 100%;padding: 7px;background-color: #17c128;background-image: conic-gradient(from 1turn, #cf1515, #b11f77);color: white;border-radius: 2px;}.bot-button {height: 3.625rem;}.reset-button {padding: 0.5rem 0.9375rem;background-color: #31343c;border-radius: var(--border-radius);color: var(--text-color);}.title-container {display: flex;justify-content: space-between;align-items: center;/* cursor: move; *//* margin: 0 1.125rem 0.375rem; */}.dot {height: 15px;width: 15px;background-color: #ff0000;border-radius: 50%;display: inline-block;}.dot.dot-blur {background-color: #00ff00;}.details p {font-size: medium;}.bot-ui .coin-icon {margin-right: 0.3125rem;width: 1.25rem;height: 1.25rem;}.bot-ui input {font-weight: 700;}</style><div class="title-container"><h2>Time: <span class="time-box">00:00</span></h2><button class="reset-button">Reset Time</button></div><div class="details"><p class="status-details">profit=0.00001, betAmount=0.00001</p><p class="status-details1">depth=0, streak=0, index=0</p></div><div class="ui-input small bot-ui"><div class="input-label">Initial Amount</div><div class="input-control"><img class="coin-icon" src="/coin/BCD.black.png" /><input type="text" id="initial-money" value="0.00005" /></div></div><div class="button-container"><button class="bot-button bot-stop">Start Bot</button></div>';
        // var container = document.createElement("div");
        // container.setAttribute("style", `width: 100%;margin-top: 1.875rem;`);
        // container.setAttribute("class", "bot-contanier");
        // container.innerHTML = inject;
        await getControlPanel();
        // document.querySelector(".game-control-panel").append(container);
        window.addBot = true;
        document.querySelector('.tabs').remove()
        document.querySelector('.s1emapvn').remove()
        var iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'width: 100%;height:650px;')
        iframe.setAttribute('src', 'https://staging.islandapps.co/bc-graph')
        document.querySelector('.srzgz44').append(iframe)

    }
    injectUI();
    console.log('asdfasdfasdfaf')
    if (window.extensionId) {
        window.addEventListener("PassToBackground", function (evt) {
            chrome.runtime.sendMessage(window.extensionId, evt.detail, (response) => {
                console.log(response)
            });
        }, false)
    }
})(window);
