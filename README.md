# discat-modules

Even though Discat is a closed-source bot, all the commands are open source. You're not only free to learn from and use this code, but also to pull request your own commands into Discat!

## Writing your own modules

Modules are the total package: the code that Discat should execute, the logo that Discat should display, the default server settings, etc.

First, start of with forking the repository and cloning your copy, and switching to the dev branch

```
git clone https://github.com/StijnDotExe/discat-modules.git
git checkout dev
```

If you're gonna develop your module, you need to create these files:

### module.js

This is the code that Discat shall run to initialize the commands! Simply put, you need to create the function **getCommands** which returns an array of objects with a **command** and **reply**. Here's an example:

```javascript
module.exports = {
  getCommands(settings) {
      var commands = [
        {
          command: "ping",
          reply: function ping(msg){
            msg.reply("pong");
          }
        },
        {
          command: "pong",
          reply: function pong(msg){
            msg.reply("ping");
          }
        }
      ];
      return commands;
  }
};
```

*Don't worry, the prefix will be automatically added by Discat*

#### Allowing command customization

However, if you want to allow the server to customize certain settings, you can easily do so! Just utulize the settings object that'll get passed.

```javascript
module.exports = {
  getCommands(settings) {
    var commands = [
      {
        command: "ping",
        reply: function ping(msg){
          msg.reply("pong");
        }
       }
     ];

     if (settings.pongenabled == true){ 
       commands.push({
         command: "pong",
         reply: function pong(msg){
           msg.reply("ping");
         }
       });
     }
     return commands;
  }
};
```

However, you'll need to allow the server owners to change these settings (and have a default setting just in case). This is where config.json jumps in

### config.json

The config.json is a simple json file of one object with the following values:

- Name: *string* that holds the name of the module

- Description: a *string* which holds a  short description of what your module/commands does/do

- developed_by: the name(s) of who developed the module

- serverdefaults: an object that holds the settings, customizable by the server owner. The keys hold the names of the option, whilst the value holds the default value *(optional)*

Example:

```json
{
    "name": "ping",
    "description": "A basic command example",
    "developed_by": "StijnDotExe",
    "serverdefaults": {
        "pongenabled": false
    }
}
```

### serversettings.pug (optional)

The settings page for customizing the server-wide settings (serverdefaults) will be automatically generated based on what type each setting is. However, if you want to create your own serversettings page, go wild. Just add serversettings.pug to your module folder and that should be it. Just make sure you send a patch request like this:

```javascript
var body = {
  "Discord_Server_Id": document.body.id,
  // document.body.id holds the server id
  "Discat_Module_Name": "YOURMODULENAME",
  "Discat_Module_New_Settings": {}
};

body.Discat_Module_New_Settings["pongenabled"] = true;

var request = new XMLHttpRequest();
request.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200){
    alert("Module updated!");
    location.reload();
  }
}
request.open("PATCH", "www.discat.website/moduleserversettings", true);
request.setRequestHeader("Content-Type", "application/json");
request.send(JSON.stringify(body));
```

### logo.png

This speaks for itself: this is the logo of your module! Give it a small 48px X 48px size, my server doesn't have infinite storage space. And obviously no nsfw stuff, even if your module is nsfw.

### Testing your module

That's it! Your module has been developed. Add it to the modules folder, so that the structure looks like this:

```
____Discat-modules
    |____ modules
             |____ ping
                       |____ config.json
                       |____ logo.png
                       |____ module.js
```

And then test it out! Open the mdk folder, and create a config.json file with the following structure

```
{
    "bot_token": "YOUR_BOT_TOKEN_FROM_https://discordapp.com/developers/applications/me"
}
```

*You can also customize the prefix the MDK uses by adding the prefix key and a string value of your choosing*

And then boot it up by executing run.sh or just running "node index.js" and test it out!



## Adding your module to Discat

Now let's add your module to Discat! 

- Commit and push your changes to your fork repository

- Create a pull request to this one

- If your module is safe and useful, the PR will be accepted and your module is added to the dev branch

- From there I'll help you iron out any bugs and increase performance if needed and where possible

- Afterwards it'll be merged into master. Once this is done, Discat will update it's modules: including yours!

And that's it! Your module is now on Discat. Thanks a lot for your contribution!



## License

These modules are  licensed under MIT! This quote from [choosalicense](https://choosealicense.com/) sums it up:

```
The MIT License is a permissive license that is short and to the point. It lets people do anything they want with your code as long as they provide attribution back to you and don’t hold you liable.
```

Open the [LICENSE FILE](/LICENSE.md) if you want all the legalities.