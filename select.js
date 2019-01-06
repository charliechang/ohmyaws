lastServiceName = null
clearTimerHandler = null

function clearLastServiceName() {
    lastServiceName = null
}

function clearLastServiceNameDelay() {
    if(clearTimerHandler) {
        clearTimeout(clearTimerHandler)
    }
    clearTimerHandler = setTimeout(clearLastServiceName, 1000)
}

function selectService() {
    serviceName = document.getElementById("service_input").value;
    if(lastServiceName != serviceName) {
        chrome.runtime.sendMessage({serviceName: serviceName},null);
        lastServiceName = serviceName
        clearLastServiceNameDelay()
    }
}

function keyPressedWithDelay() {
    setTimeout(selectService, 100)
}

document.addEventListener('DOMContentLoaded', function () {
    inputElem = document.getElementById('service_input')
    inputElem.addEventListener('keypress', keyPressedWithDelay);
    inputElem.focus()
});
