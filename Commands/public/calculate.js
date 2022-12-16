const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Minutes that needs to be charged")
    .setDMPermission(true)
    .addStringOption((option) =>
        option.setName("quick").setDescription("choose a time.").setRequired(false)
        .addChoices (
		        { name: '14:00', value: '14:00' },
                { name: '00:00', value: '00:00' },
                { name: '02:00', value: '02:00' })   
        )
    .addStringOption((option) => option.setName("custom").setDescription("Provide a time.")
    .setRequired(false)),

    execute(interaction, client) {
        const { options } = interaction;
        input = options.getString("quick")
        const Ok1 = " minute of AB needs to be charged."
        const Ok2 = " minutes of AB needs to be charged."
        const bad = "Please provide a valid time method:\nUse HH: 00 to 23, MM: 00 to 59."
        const NoInput = "No input provided."

        Info = new Date();
        date = Info.getDate();
        year = Info.getFullYear();        
        month = Info.getMonth();  
        hour = Info.getHours();    
        min = Info.getMinutes();

        if(input == undefined)
        {input = options.getString("custom")}

        if(input == undefined)
        {Output = NoInput}
        else 
        {
            splitInput = input.split(':');
            Hours = (splitInput[0]);
            Mins = (splitInput[1]);	

            if(isNaN(Hours) || isNaN(Mins))
            {Output = bad}
                else 
                {
                    if(hour == 24)
                    {hour = 00}
                
                    if (Hours >= hour)
                    {if(Hours == hour)
                        {if(Mins >= min){realdate = date}
                        else{realdate = date + 1}}	
                        else{realdate = date}}
                    else{realdate = date + 1}
                
                    ToDate = Date.UTC(year, month,	
                    realdate, Hours, Mins);
                    now = Date.UTC(year, month, 
                    date, hour, min);
                    
                    distance = ToDate - now;
                    minutes = Math.floor((distance % (1000 
                    * 60 * 60 * 60 )) / (1000 * 60));
                    
                    if (Hours< 24 && Mins < 60)
                    {if(minutes == 1)
                        {Output= minutes + Ok1}
                        else{Output= minutes + Ok2}}
                    else{Output = bad}
                }
        }
        interaction.reply({content: `${Output}`, ephemeral: true })
    }
}