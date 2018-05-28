function getCard(cardName){
    var options = {
        url: "https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/" + cardName,
        headers: {
            "X-Mashape-Key": config.hearthstone.hearthstone_api_key
        }
      }
    config.hearthstone.request.get(options, (error, response, body) => {
        console.log(error);
        console.log(response);
        console.log(body);

        return "KAART INFO";
    });
}

module.exports = {
    getCommands(settings) {
        const get = require("request").get;
        var commands = [
            {
                command: "hs",
                reply: function ping(msg) {
                    msg.reply(
                        // Get card based on cardname (leave away {prefix}hs)
                        getCard(msg.content.substring(msg.content.indexOf(" ")))
                    );
                }
            }];
        return commands;
    },

    getConfig(){
        return {
            "request": require("request"),
            "hearthstone_api_key": "GET_FROM_CONFIG"  // To be defined in discat/MDK
        }
    }
};