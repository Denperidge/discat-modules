module.exports = {
    // Every module should contain one function: getCommands, which returns an array of functions (commands)
    getCommands(settings) {
        var commands = [{
            command: "ping",
            reply: function ping(msg){
                msg.reply("pong");
            }
        }];

        if (settings.pong == true){  // Variable linked to serversettings and config.json.defaults
            commands.push({
                command: "pong",
                reply: function ping(msg){
                    msg.reply("pong");
                }
            });
        }
        
        return commands;
    }

    
};