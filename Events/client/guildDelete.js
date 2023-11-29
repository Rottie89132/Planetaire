const fs = require('fs');

module.exports = {
    name: "guildDelete",
    async execute(guild, interaction) {
        const server = require("../../Schemas/Server");
        
        await server.findOneAndRemove({GuildID: guild.id})
        const token = JSON.parse(fs.readFileSync('token.json'));
        await fetch(`${process.env.DomainUrl}/api/guildUpdate`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'authorization': `${token.session}`},
        })

    }
}