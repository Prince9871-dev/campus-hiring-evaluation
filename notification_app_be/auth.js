const axios = require("axios");

async function auth() {

    try {

        const response = await axios.post(
            "http://4.224.186.213/evaluation-service/auth",
            {
                email: "princejha4477@gmail.com",
                name: "prince jha",
                rollNo: "e23cseu1525",
                accessCode: "TfDxgr",
                clientID: "YOUR_CLIENT_ID",
                clientSecret: "YOUR_CLIENT_SECRET"
            }
        );

        console.log(response.data);

    } catch (error) {

        console.log(error.response.data);
    }
}

auth();