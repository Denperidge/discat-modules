function getCard(msg, config) {
    msg.channel.send("Searching...");
    var cardName = msg.content.substring(msg.content.indexOf(" ") + 1);
    var options = {
        url: "https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/"
            + cardName
            + "?collectible=1",
        headers: {
            "X-Mashape-Key": config.Hearthstone.hearthstone_api_key
        }
    }
    config.Hearthstone.request.get(options, (error, response, body) => {
        var cards = JSON.parse(body);
        console.log(cards);
        console.log(cards.length);
        // If no cards are found, reply that
        if (cards.error != undefined) {
            if (cards.error == 404) msg.reply("no cards with the name \"" + cardName + "\"!");
        }
        // If the specific card is found, return it
        else if (cards.length == 1) {
            msg.reply(cards[0].imgGold);
        }
        else if (cards.length > 1) {
            console.log(cards);
            var strCards = "";
            for (var i = 0; i < cards.length; i++)
                strCards += i + ": " + cards[i].name + "\n";

            strCards.lastIndexOf(0, strCards.lastIndexOf("\n"));
            awaitSpecificCardIndex(msg, cards, strCards);
        }
    });
}

function awaitSpecificCardIndex(msg, cards, strCards) {
    msg.reply("Multiple cards found! Type the number of the card you want \n" + strCards);
    msg.channel
        .awaitMessages(m => m.author == msg.author, { max: 1, time: 60000, errors: ["time"] })
        .then(collected => {
            var requestedcardmsg = collected.first();
            var requestedcard;

            if (requestedcardmsg.content.toLowerCase() == "cancel") msg.reply("Hearthstone card search cancelled!");
            else if (isNaN((requestedcard = parseInt(requestedcardmsg.content)))) {
                msg.reply = "That isn't a valid number! Try again, or type cancel to cancel";
                awaitSpecificCardIndex(msg, card, strCards);
            }
            else if (requestedcard < 0 || requestedcard >= cards.length) {
                msg.reply("That number is not part of the options! Please select a number between 0 and " + (cards.length - 1) + ", or type cancel to cancel");
                awaitSpecificCardIndex(msg, card, strCards);
            }
            else msg.reply(cards[requestedcard]);
        })
        .catch(x => console.log(x));
}

function askForMoreInfo() {

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