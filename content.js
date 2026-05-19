const site = window.location.hostname
  .replace("www.", "")
  .replace(".com", "");

let timeOut = null;

/* ---------------------------
   LOAD STATE (PER SITE)
----------------------------*/
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


/* ---------------------------
   POPUP UI
----------------------------*/
function showPopup() {

    if (document.getElementById("popup")) return;

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

    document.body.appendChild(overlay);

    document.getElementById("btn").addEventListener("click", startSession);
    document.getElementById("leaveBtn").addEventListener("click", leaveSite);
}


/* ---------------------------
   START SESSION
----------------------------*/
function startSession() {

    const textarea = document.getElementById("textarea");
    const timeInput = document.getElementById("timeInput");

    const reason = textarea.value.trim();
    const time = Number(timeInput.value);

    // FIXED VALIDATION (was wrong before)
    if (!time || time <= 0 || !reason) {
        alert("Please enter valid intention and time");
        return;
    }

    const ms = time * 60 * 1000;
    const endTime = Date.now() + ms;

    // PER-SITE STORAGE (IMPORTANT FIX)
    chrome.storage.local.get(["sessions"], (data) => {

        const sessions = data.sessions || {};
        sessions[site] = endTime;

        chrome.storage.local.set({ sessions });
    });

    document.getElementById("popup")?.remove();

    startTimer(endTime);
}


/* ---------------------------
   TIMER SYSTEM
----------------------------*/
function startTimer(endTime) {

    clearTimeout(timeOut);

    const remaining = endTime - Date.now();

    if (remaining <= 0) {
        blockWebsite();
        return;
    }

    timeOut = setTimeout(blockWebsite, remaining);
}


/* ---------------------------
   BLOCK SCREEN
----------------------------*/
function blockWebsite() {

    if (document.getElementById("blocked-screen")) return;

    clearTimeout(timeOut);

    chrome.storage.local.get(["sessions"], (data) => {
        const sessions = data.sessions || {};
        delete sessions[site];
        chrome.storage.local.set({ sessions });
    });

    const blockScreen = document.createElement("div");
    blockScreen.id = "blocked-screen";

    blockScreen.innerHTML = `
        <img src="${chrome.runtime.getURL('icons/icon.png')}">
        <h1>Session Ended</h1>
        <h2>Your session on ${site} has ended.</h2>

        <div class="button-row">
            <button id="leaveBlock" class="primaryBtn">Leave site</button>
            <button id="extend1" class="secondaryBtn">Extend 1 min</button>
            <button id="startNewSession" class="primaryBtn">Start New Session</button>
        </div>
    `;

    document.body.appendChild(blockScreen);

    document.getElementById("leaveBlock").onclick = leaveSite;
    document.getElementById("extend1").onclick = () => extendSession(1);

    document.getElementById("startNewSession").onclick = () => {
        document.getElementById("blocked-screen")?.remove();
        showPopup();
    };
}


/* ---------------------------
   EXTEND SESSION
----------------------------*/
function extendSession(minutes) {

    const ms = minutes * 60 * 1000;
    const newEnd = Date.now() + ms;

    chrome.storage.local.get(["sessions"], (data) => {

        const sessions = data.sessions || {};
        sessions[site] = newEnd;

        chrome.storage.local.set({ sessions });
    });

    clearTimeout(timeOut);
    startTimer(newEnd);

    document.getElementById("blocked-screen")?.remove();
}


/* ---------------------------
   LEAVE SITE
----------------------------*/
function leaveSite() {
    chrome.storage.local.get(["sessions"], (data) => {
        const sessions = data.sessions || {};
        delete sessions[site];
        chrome.storage.local.set({ sessions });
    });

    window.location.href = "https://google.com";
}