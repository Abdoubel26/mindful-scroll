
const site = window.location.hostname.replace(".com", "")
let timeOut = null

chrome.storage.local.get(["endTime"], (data) => {

    if (data.endTime) {
        if (Date.now() >= data.endTime) {
            blockWebsite()
        } else {
            startTimer(data.endTime)
        }
    } else {
        showPopup()
    }
})


function showPopup(){

    if(document.getElementById("popup")){
        return
    }

    const overlay = document.createElement('div')
    overlay.id = "popup"
    overlay.innerHTML = `
    <div class="form">

    <h1>What are you going to do in ${site}</h1>
    <textarea rows="3" id="textarea"></textarea>

    <h1>How long are you planning to stay in ${site}</h1>
    <input id="timeInput" type="number" placeholder="minutes">  
    <button class="btn" id="btn">Start Session</button>
    </div>
    `
    document.body.appendChild(overlay)

    document.getElementById("btn").addEventListener("click", StartSession)

}

function StartSession(){
    const timeInput = document.getElementById("timeInput")


    const time = Number(timeInput.value)

    if(time <= 0 || !time){
        alert("Please Enter valid minute")
        return;
    }
    const ms = time * 60 * 1000
    const endTime = Date.now() + ms

    chrome.storage.local.set({
        endTime,
        site,
    })


    startTimer(endTime)

}

function startTimer(endTime){

    const remaining = endTime - Date.now() 

    if(remaining <= 0){
        blockWebsite()
    } else {
        timeOut = setTimeout(blockWebsite, remaining)
    }
    
}


function blockWebsite(){
    clearTimeout(timeOut)
    chrome.storage.local.clear()

    const blockScreen = document.createElement("div")
    blockScreen.id = "blocked-screen"
    blockScreen.innerHTML = `
    <img src="icons/icon.png">
    <h1>Session Ended</h1>`
    document.body.appendChild(blockScreen)
    
}
