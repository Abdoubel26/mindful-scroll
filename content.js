const site = window.location.hostname
  .replace("www.", "")
  .replace(".com", "");

let timeOut = null;

chrome.storage.local.get(["sessions"], (data) => {
    const sessions = data.sessions || {};
    const endTime = sessions[site];

    if (endTime) {
        if (Date.now() >= endTime) {
            blockWebsite();
        } else {
            startTimer(endTime);
        }
    } else {
        showPopup();
    }
});

function getShadowRoot() {
    let host = document.getElementById("mindful-scroll-root");
    if (!host) {
        host = document.createElement("div");
        host.id = "mindful-scroll-root";
        host.style.position = "fixed";
        host.style.zIndex = "999999999";
        document.body.appendChild(host);
        
        const shadowRoot = host.attachShadow({ mode: "open" });
        

        const styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href = chrome.runtime.getURL("styles.css");
        shadowRoot.appendChild(styleLink);
    }
    return host.shadowRoot;
}

function showPopup() {
    const shadow = getShadowRoot();
    if (shadow.getElementById("popup")) return;

    const overlay = document.createElement("div");
    overlay.id = "popup";

    overlay.innerHTML = `
        <div class="form">
            <h1>What are you going to do on ${site}?</h1>
            <textarea rows="3" id="textarea" placeholder="Write your intention..."></textarea>

            <h1>How long are you planning to stay on ${site}?</h1>
            <input id="timeInput" type="number" placeholder="Minutes" min="1">

            <div class="button-row">
                <button id="leaveBtn" class="primaryBtn">Leave site</button>
                <button id="btn" class="secondaryBtn">Start Session</button>
            </div>
        </div>
    `;

    shadow.appendChild(overlay);

    shadow.getElementById("btn").addEventListener("click", startSession);
    shadow.getElementById("leaveBtn").addEventListener("click", leaveSite);
}

function startSession() {
    const shadow = getShadowRoot();
    const textarea = shadow.getElementById("textarea");
    const timeInput = shadow.getElementById("timeInput");

    const reason = textarea.value.trim();
    const time = Number(timeInput.value);

    if (!time || time <= 0 || !reason) {
        alert("Please enter valid intention and time");
        return;
    }

    const ms = time * 60 * 1000;
    const endTime = Date.now() + ms;

    chrome.storage.local.get(["sessions"], (data) => {
        const sessions = data.sessions || {};
        sessions[site] = endTime;
        chrome.storage.local.set({ sessions });
    });

    shadow.getElementById("popup")?.remove();
    startTimer(endTime);
}

function startTimer(endTime) {
    clearTimeout(timeOut);

    const remaining = endTime - Date.now();

    if (remaining <= 0) {
        blockWebsite();
        return;
    }

    timeOut = setTimeout(blockWebsite, remaining);
}

function blockWebsite() {
    const shadow = getShadowRoot();
    if (shadow.getElementById("blocked-screen")) return;

    clearTimeout(timeOut);

    chrome.storage.local.get(["sessions"], (data) => {
        const sessions = data.sessions || {};
        delete sessions[site];
        chrome.storage.local.set({ sessions });
    });

    const blockScreen = document.createElement("div");
    blockScreen.id = "blocked-screen";

    blockScreen.innerHTML = `
        <h1 class="warn">⛔</h1>
        <h1>Session Ended</h1>
        <h2>Your session on ${site} has ended.</h2>

        <div class="button-row">
            <button id="startNewSession" class="secondaryBtn">Start New Session</button>
            <button id="leaveBlock" class="primaryBtn">Leave site</button>
        </div>
    `;

    shadow.appendChild(blockScreen);

    shadow.getElementById("leaveBlock").onclick = leaveSite;

    shadow.getElementById("startNewSession").onclick = () => {
        shadow.getElementById("blocked-screen")?.remove();
        showPopup();
    };
}

function extendSession(minutes) {
    const shadow = getShadowRoot();
    const ms = minutes * 60 * 1000;
    const newEnd = Date.now() + ms;

    chrome.storage.local.get(["sessions"], (data) => {
        const sessions = data.sessions || {};
        sessions[site] = newEnd;
        chrome.storage.local.set({ sessions });
    });

    clearTimeout(timeOut);
    startTimer(newEnd);

    shadow.getElementById("blocked-screen")?.remove();
}

function leaveSite() {
    chrome.storage.local.get(["sessions"], (data) => {
        const sessions = data.sessions || {};
        delete sessions[site];
        chrome.storage.local.set({ sessions });
    });

    window.location.href = "https://google.com";
}