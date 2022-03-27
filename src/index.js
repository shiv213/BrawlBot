const {REST} = require("@discordjs/rest"); // Define REST.
const {Routes} = require("discord-api-types/v9"); // Define Routes.
const fs = require("fs"); // Define fs (file system).
const {Client, Intents, Collection} = require("discord.js"); // Define Client, Intents, and Collection.
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES],
}); // Connect to our discord bot.
const commands = new Collection(); // Where the bot (slash) commands will be stored.
const commandarray = []; // Array to store commands for sending to the REST API.
const token = process.env.DISCORD_TOKEN; // Token from Railway Env Variable.
const commandFiles = fs
    .readdirSync("src/commands")
    .filter(file => file.endsWith(".js")); // Get and filter all the files in the "Commands" Folder.

// Loop through the command files
for (const file of commandFiles) {
    const command = require(`./commands/${file}`); // Get and define the command file.
    commands.set(command.data.name, command); // Set the command name and file for handler to use.
    commandarray.push(command.data.toJSON()); // Push the command data to an array (for sending to the API).
}

// Execute code when the "ready" client event is triggered.
client.once("ready", () => {

    const rest = new REST({version: "9"}).setToken(token); // Define "rest" for use in registering commands
    // Register slash commands.
    ;(async () => {
        try {
            console.log("Started refreshing application (/) commands.");

            await rest.put(Routes.applicationCommands(client.user.id), {
                body: commandarray,
            });

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error(error);
        }
    })();
    console.log(`Logged in as ${client.user.tag}!`);
});

// Command handler.
client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        return interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

client.on('presenceUpdate', async (oldMember, newMember) => {
    console.log("presence change")
    console.log(newMember)
    let channel = newMember.guild.channels.fetch('957027456429199370').then(c => {
        let curr_activities = []
        newMember.activities.forEach(x => curr_activities.push(x.name));
        console.log(curr_activities);
        // TODO Check if just started or has been playing
        // @Ahaan Kanaujia <kanaujia.ahaan@gmail.com>
        if (curr_activities.includes("bash")) {
            c.send("@everyone <@!" + newMember.userId + "> is now playing Brawlhalla!");
        }
    });
});

client.login(token); // Login to the bot client via the defined "token" string.
