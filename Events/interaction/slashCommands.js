module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
      
      if(!interaction.isChatInputCommand()) return;  
      const command = client.commands.get(interaction.commandName)
      
      if(!command) 
      return interaction.reply({
        content: "An error has occured",
        ephemeral: true
      }) 

      if(command.developer && interaction.user.id !== "322393281306689536")
      return interaction.reply({
        content: "This is a developer only command",
        ephemeral: true
      })

      command.execute(interaction, client);
    }  
  }