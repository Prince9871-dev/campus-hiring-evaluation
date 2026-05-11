const axios = require("axios");

async function register() {

    try {

        const response = await axios.post(
            "http://4.224.186.213/evaluation-service/register",
            {
                email: "princejha2003@gmail.com",
                name: "Prince Jha",
                mobileNo: "9871447728",
                githubUsername: "Prince9871-dev",
                rollNo: "E23CSEU1525",
                accessCode: "TfDxgr"
            }
        );

        console.log(response.data);

    } catch (error) {

        console.log(error.response.data);
    }
}

register();