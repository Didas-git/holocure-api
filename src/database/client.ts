import { client } from "nekdis";

client._options = {
    inject: {
        schema: {
            options: {
                prefix: "API"
            }
        }
    }
};

client.globalPrefix = "Holocure";

(async () => {
    // Connect to redis
    await client.connect().then(() => {
        logger.log("Connected to Redis");
    });
})();