const { SlashCommandBuilder } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Minutes that needs to be charged")
    .setDMPermission(true)
    .addStringOption((option) => option.setName("starttime").setDescription("Provide a time."))
    .addStringOption((option) =>
        option.setName("quick").setDescription("choose a time.").setRequired(false)
        .addChoices (
		        { name: '14:00', value: '14:00' },
                { name: '00:00', value: '00:00' },
                { name: '02:00', value: '02:00' })   
        )
    .addStringOption((option) => option.setName("custom").setDescription("Provide a time.")
    .setRequired(false)),

    async execute(interaction, client) {
        const { options } = interaction;
        const starttime = options.getString("starttime");
        const input = options.getString("quick") || options.getString("custom");
        const Ok1 = " minute of AB needs to be charged.";
        const Ok2 = " minutes of AB needs to be charged.";
        const bad = "Please provide a valid time method:\nUse HH: 00 to 23, MM: 00 to 59.";
        const NoInput = "No input provided.";

        let Info = new Date();
        let date = Info.getDate();
        let year = Info.getFullYear();        
        let month = Info.getMonth();  
        let hour = Info.getHours() + Number(process.env.TimeDifference);  
        let min = Info.getMinutes();

        await interaction.deferReply({ephemeral: true});
        interaction.guildId ? interaction.editReply({content: `Calculating required minites of AB!`, ephemeral: true }) : '';
        
        if(!input) 
            return interaction.editReply({content: `${NoInput}`, ephemeral: true });
        
        const [ Hours, Mins ] = input.split(':');
        
        if(isNaN(Hours) || isNaN(Mins))
            return interaction.editReply({content: `${bad}`, ephemeral: true });

        if(starttime) {
            if(!starttime.includes(":"))
                return interaction.editReply({content: `${bad}`, ephemeral: true });
        }

        
        hour == 24 ? 24 : 00
        const realdate = (Hours >= hour && 
            (Hours > hour || Mins >= min)) ? date : date + 1;

        const ToDate = Date.UTC(year, month, realdate, Hours, Mins);
        const now = starttime ? Date.UTC(year, month, date, starttime.split(":")[0], starttime.split(":")[1]) : Date.UTC(year, month, date, hour, min);  
        const distance = ToDate - now;
        const minutes = Math.floor((distance % (1000 * 60 * 60 * 60 )) / (1000 * 60));
        
        let Output = (Hours >= 0 && Mins >= 0 && Hours < 24 && Mins < 60) ? 
            (minutes === 1 ? minutes + Ok1 : minutes + Ok2) : bad;

        if(starttime){
            const [ StartHours, StartMins ] = starttime.split(':');
            Output = (StartHours >= 0 && StartMins >= 0 && StartHours < 24 && StartMins < 60) ? 
            (minutes === 1 ? minutes + Ok1 : minutes + Ok2) : bad;
        }
        
        interaction.editReply({content: `${Output}`, ephemeral: true })
        
    }
}