const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("users")
        .setDescription("Gets status of all users in server!"),
    execute: async (interaction, client) => {

        let status = interaction.user.presence;
        // let game = interaction.user.presence.game.name;
        console.log(status);
        return interaction.reply({content: "status is " + status, ephemeral: true});

        // let username = newMember.user.username;
        // let status = newMember.user.presence.status;
    },
};

