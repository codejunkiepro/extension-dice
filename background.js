class Extension {
    constructor() {
        this.addEventListners();
    }

    addEventListners() {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            // console.log(changeInfo);
            if (
                (tab.url.indexOf("https://nanogames.io/hash-dice") > -1 ||
                    tab.url.indexOf("https://nanogames.io/hash-dice") > -1 ||
                    tab.url.indexOf("https://nanogames.io/hash-dice") >
                    -1) &&
                changeInfo.url === undefined &&
                changeInfo.status === "complete"
            ) {
                this.injectCrashScripts(tab);
            }
        });

        chrome.runtime.onMessageExternal.addListener(
            (message, sender, sendResponse) => {
                console.log(message, sender, sendResponse)
                chrome.notifications.create(
                    "Bc.game" + message.id ? message.id : new Date().getTime(),
                    {
                        type: "basic",
                        iconUrl: "dice-icon.png",
                        title: "Bc.game Bot",
                        message: message.id ? message.msg : message,
                    }
                );
                sendResponse("ok");
            }
        );
    }


    injectCrashScripts(tab) {
        const inject = chrome.runtime.getURL("/scripts/injectCrash.js");
        const extensionId = chrome.runtime.id;
        chrome.scripting.executeScript({
            target: { tabId: tab.id, },
            func: (inject, extensionId) => {
                if (!window.addBot) {
                    const el = document.createElement("script");
                    el.src = inject;
                    document.documentElement.appendChild(el);
                    el.remove();
                    window.extensionId = extensionId;
                }
            },
            args: [inject, extensionId],
            world: "MAIN",
        });

        const code = chrome.runtime.getURL("/scripts/content-crash.js");

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (code) => {
                if (!window.diceBot) {
                    const el = document.createElement("script");
                    el.src = code;
                    document.documentElement.appendChild(el);
                    el.remove();
                }
            },
            args: [code],
            world: "MAIN",
        });
    }
}

new Extension();
