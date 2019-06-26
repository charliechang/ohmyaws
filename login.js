
if(null == accountName || '' == accountName) {
    console.log('accountName is empty')
    accountName = "reco"
}
console.log('accountName:' + accountName)


function selectAccount() {
    optgroups = document.getElementsByClassName('optgroup')
    if(0 == optgroups.length) {
        setTimeout(selectAccount, 200);
    } else {
        dataGroupDiv = null
        // Exactly match
        for(var i = 0;i < optgroups.length;i++) {
            dataGroupName = optgroups[i].getAttribute('data-group')
            if(dataGroupName == accountName) {
                console.log(dataGroupName + " is selected by exact match")
                dataGroupDiv = optgroups[i]
                break;
            }
        }
        //Fuzzy Match
        if(null == dataGroupDiv) {
            for(var i = 0;i < optgroups.length;i++) {
                dataGroupName = optgroups[i].getAttribute('data-group')
                if(dataGroupName.indexOf(accountName) >= 0) {
                    console.log(dataGroupName + " is selected by fuzzy match")
                    dataGroupDiv = optgroups[i]
                    break
                }
            }
        }

        if(null != dataGroupDiv) {
            console.log(dataGroupDiv)
            optionDivs = dataGroupDiv.getElementsByClassName('option')
            if(1 == optionDivs.length) {
                optionDivs[0].click()
            } else {
                manualOptionDiv = null
                deployerOptionDiv = null
                defaultOptionDiv = null
                for(var i = 0;i < optionDivs.length;i++) {
                    role = optionDivs[i].getAttribute('data-value')
                    if(role.startsWith('Manual')) {
                        manualOptionDiv = optionDivs[i]
                    } else if(role.startsWith('Deployer')) {
                        deployerOptionDiv = optionDivs[i]
                    } else {
                        defaultOptionDiv = optionDivs[i]
                    }
                }
                console.log('manual', manualOptionDiv)
                console.log('deployer', deployerOptionDiv)
                console.log('default', defaultOptionDiv)

                if(manualOptionDiv != null) {
                    manualOptionDiv.click()
                } else if(deployerOptionDiv != null) {
                    deployerOptionDiv.click()
                } else {
                    defaultOptionDiv.click()
                }
            }
        }
        
    }
}

setTimeout(selectAccount, 200);
