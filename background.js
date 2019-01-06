/*
 * init:
 * login:
 * goto:
 * done:
 *
 *
 * */
aws_region = "eu-central-1"
awsUrls = {
    ec2: "https://" + aws_region + ".console.aws.amazon.com/ec2/v2/home?region=eu-central-1#Instances:sort=tag:Name"
    ,
    elb: "https://" + aws_region + ".console.aws.amazon.com/ec2/v2/home?region=eu-central-1#LoadBalancers:"
    ,
    asg: "https://" + aws_region + ".console.aws.amazon.com/ec2/autoscaling/home?region=eu-central-1#AutoScalingGroups:view=details"
    ,
    aws: "https://" + aws_region + ".console.aws.amazon.com/console/home"
    ,
    redis: "https://" + aws_region + ".console.aws.amazon.com/elasticache/home?region=eu-central-1#redis:"
    ,
    s3: "https://s3.console.aws.amazon.com/s3/home?region=" + aws_region + "#"
    ,
    watch: "https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=" + aws_region + "#"

}

tabStatusDict = {}
tabTargetUrl = {}
tmpTargetUrl = null

function initLoginPage(tab) {
    console.log("tab is created")
    tabStatusDict[tab.id] = 'init'
    tabTargetUrl[tab.id] = tabTargetUrl[tab.openerTabId]
    tabTargetUrl[tab.openerTabId] = null
    console.log("init tab id:" + tab.id + " url:" + tabTargetUrl[tab.id])
}

function loginStart(tab) {
    tabStatusDict[tab.id] = 'login'
    chrome.tabs.executeScript(tab.id, {file: "login.js"}, null);
}

function done(tab) {
    tabStatusDict[tab.id] = null
    tabTargetUrl[tab.id] = null
}

function accessPage(tab) {
    tabStatusDict[tab.id] = 'access'
    url = tabTargetUrl[tab.id]
    console.log("goto " + url)
    chrome.tabs.update(tab.id, {url:url}, done)
}

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status != 'complete') {
        return
    }
    
    status = tabStatusDict[tabId]
    url = tab.url
    console.log("tab " + tabId + " is " + status)
    console.log(url)
    if("init" == status && "https://signin.aws.amazon.com/saml" == url) {
        loginStart(tab)
    } else if("login" == status) {
        accessPage(tab)
    }
});
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        tab = sender.tab
        target_url = null
        serviceName = request.serviceName
        target_url = awsUrls[serviceName]
  
        if(target_url) {
            tabTargetUrl[tab.id] = target_url
            chrome.tabs.create({url: 'https://aws.zalando.net', openerTabId: tab.id}, initLoginPage)
            chrome.tabs.remove(tab.id, null)
        }
    });
chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.create({url: 'select.html'}, null)
});
