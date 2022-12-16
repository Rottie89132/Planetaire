module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
      
      if(!interaction.isContextMenuCommand()) return;  
      const context = client.commands.get(interaction.commandName)
      
      if(!context) 
      return interaction.reply({
        content: "An error has occured",
        ephemeral: true
      }) 

      if(context.developer && interaction.user.id !== "322393281306689536")
      return interaction.reply({
        content: "This is a developer only command",
        ephemeral: true
      })

      context.execute(interaction, client);
    }  
  }