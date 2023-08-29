import { client } from "nekdis";

client.options = {
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
    // deepcode ignore PromiseNotCaughtGeneral: This is intended, if the client throws the api should not initialize
    await client.connect().then(() => {
        logger.log("Connected to Redis");
    });
})();