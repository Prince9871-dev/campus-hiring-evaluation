const axios = require("axios");

async function getNotifications() {

    try {
        const response = await axios.get(
            "http://4.224.186.213/evaluation-service/notifications",
            {
                headers: {
                    Authorization:'Bearer YOUR_TOKEN'
                }
            }
        );

        const notifications = response.data.notifications;
        function getWeight(type) {
            if (type === "Placement") {
                return 3;
            }
            if (type === "Result") {
                return 2;
            }
            return 1;
        }
        notifications.sort((a, b) => {

            let scoreA =
                getWeight(a.Type)*1000000000+
                new Date(a.Timestamp).getTime();

            let scoreB =
                getWeight(b.Type)*1000000000+
                new Date(b.Timestamp).getTime();

            return scoreB - scoreA;
        });

        const top10 = notifications.slice(0, 10);

        console.log("\nTop 10 Priority Notifications\n");

        top10.forEach((item, index) => {

            console.log(`${index + 1}.`);
            console.log("Type:", item.Type);
            console.log("Message:", item.Message);
            console.log("Time:", item.Timestamp);

            console.log("-------------------");
        });

    } catch (error) {

        console.log(error.message);
    }
}

getNotifications();