function getCard(msg, config) {
    msg.channel.send("Searching...");
    var cardName = msg.content.substring(msg.content.indexOf(" ") + 1);
    var options = {
        url: "https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/"
            + cardName
            + "?collectible=1",
        headers: {
            "X-Mashape-Key": config.hearthstone.hearthstone_api_key
        }
    }
    config.hearthstone.request.get(options, (error, response, body) => {
        var cards = JSON.parse(body);
        // If no cards are found, reply that
        if (cards.error != undefined) {
            if (cards.error == 404) msg.reply("no cards with the name \"" + cardName + "\"!");
        }
        // If the specific card is found, return it
        else if (cards.length == 1) {
            msg.reply(cards[0].imgGold);
        }
        else if (cards.length > 1) {

        }
    });
}

function askForMoreInfo(){

}

module.exports = {
    getCommands(settings) {
        const get = require("request").get;
        var commands = [
            {
                command: "hs",
                reply: function hs(msg, config) {
                    // Get card based on cardname (leave away {prefix}hs)
                    getCard(msg, config)
                }
            }];
        return commands;
    },

    getConfig() {
        return {
            "request": require("request"),
            "hearthstone_api_key": "GET_FROM_CONFIG"  // To be defined in discat/MDK
        }
    }
};