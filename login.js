awsAccountId = "405569036831"
awsIamRole = "arn:aws:iam::" + awsAccountId + ":role/Shibboleth-PowerUser"

radioButton = document.getElementById(awsIamRole);

console.log("radioButton:" + radioButton)

radioButton.checked = true;

signInButton = document.getElementById("signin_button");
signInButton.click()

