/*
 * init:
 * login:
 * goto:
 * done:
 *
 *
 * */
aws_region = "eu-central-1"
default_account_name = "reco"
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
    watch: "https://" + aws_region + ".console.aws.amazon.com/cloudwatch/home?region=" + aws_region + "#"
    ,
    53: "https://console.aws.amazon.com/route53/home?region=" + aws_region + "#"
    ,
    ebs: "https://" + aws_region + ".console.aws.amazon.com/ec2/v2/home?region=" + aws_region + "#Volumes:sort=availabilityZone"
}

tabStatusDict = {}
tabTargetUrl = {}
tabAccountUrl = {}
tmpTargetUrl = null

function initLoginPage(tab) {
    console.log("tab is created")
    tabStatusDict[tab.id] = 'init'
    tabTargetUrl[tab.id] = tabTargetUrl[tab.openerTabId]
    tabAccountUrl[tab.id] = tabAccountUrl[tab.openerTabId]
    tabTargetUrl[tab.openerTabId] = null
    tabAccountUrl[tab.openerTabId] = null
    console.log("init tab id:" + tab.id + " account:" + tabAccountUrl[tab.id] + " url:" + tabTargetUrl[tab.id])
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

function findServiceName(rawInput) {
    for(const key in awsUrls) {
        if(rawInput.endsWith(key)) {
            return awsUrls[key]
        }
    }
    return null
}

function findAccountName(rawInput) {
    for(const key in awsUrls) {
        if(rawInput.endsWith(key)) {
            return rawInput.substring(0, rawInput.length - key.length)
        }
    }
    return null
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
        account_name = findAccountName(request.serviceName)
        target_url = findServiceName(request.serviceName)
  
        if(target_url) {
            tabAccountUrl[tab.id] = account_name
            tabTargetUrl[tab.id] = target_url
            chrome.tabs.create({url: 'https://aws-chooser.zalando.net/direct', openerTabId: tab.id}, initLoginPage)
            chrome.tabs.remove(tab.id, null)
        }
    });
chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.create({url: 'select.html'}, null)
});
