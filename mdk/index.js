#!/usr/bin/env node
const Discord = require('discord.js');
const client = new Discord.Client();

var commands;
var config;
var prefix = "!";

function loadMDK(callback) {
    commands = {};
    config = {};

    const fs = require("fs");

    if (require("./config.json").prefix != undefined) prefix = require("./config.json").prefix;

    fs.readdir("../modules/", (err, modules) => {
        if (err) throw err;

        for (var i = 0; i < modules.length; i++) {
            var moduleCommands = require(__dirname.replace("mdk", "modules/") + modules[i] + "/module.js").getCommands(
                require(__dirname.replace("mdk", "modules/") + modules[i] + "/config.json").serverdefaults
            );

            if (require(__dirname.replace("mdk", "modules/") + modules[i] + "/module.js").getConfig != undefined){
                config[modules[i]] = require(__dirname.replace("mdk", "modules/") + modules[i] + "/module.js").getConfig();

                var configKeys = Object.keys(config[modules[i]]);
                for (var j = 0; j < configKeys.length; j++){
                    // If value of a config parameter has GET_FROM_CONFIG
                    if (config[modules[i]][configKeys[j]] == "GET_FROM_CONFIG"){
                        // Get it's data from config.json and set it
                        config[modules[i]][configKeys[j]] = require("./config.json").third_party[configKeys[j]]
                    }
                }
            }

            for (var j = 0; j < moduleCommands.length; j++) {
                var moduleCommand = moduleCommands[j];
                commands[prefix + moduleCommand.command] = moduleCommand.reply;
            }

            // Delete the cache so that reloadMDK can properly reload instead of cache being used
            delete require.cache[__dirname.replace("mdk", "modules\\") + modules[i] + "\\module.js"];
            delete require.cache[__dirname.replace("mdk", "modules\\") + modules[i] + "\\config.json"];
        }
        callback();
    });
}

client.on('ready', () => {
    loadMDK(() => {
        var exampleCommand = Object.keys(commands)[Math.floor(Math.random() * Object.keys(commands).length)];
        console.log(`Discat MDK running  as ${client.user.tag}!`);
        console.log(`Test your commands by using (for example) ${exampleCommand}`);
    });
});

client.on('message', msg => {
    var reply;
    if (msg.author == client.user) return;
    if ((reply = commands[msg.content.toLowerCase().split(" ")[0]]) != null)
        reply(msg, config);
    else if (msg.content == prefix + "reloadmdk") {
        loadMDK(() => {
            msg.reply("Reloaded!");
            console.log("Reloaded!");
        });
    }
});

client.login(require("./config.json").bot_token);