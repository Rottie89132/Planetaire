const Pusher = require("pusher");
const express = require('express');
const cron = require('node-cron');
const http = require('http');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const token = JSON.parse(fs.readFileSync('token.json'));

const pusher = new Pusher({
  appId: process.env.PusherAppID,
  key: process.env.PusherAppKey,
  secret: process.env.PusherAppSecret,
  cluster: process.env.cluster,
  useTLS: true
});

updateKeyValue = () => {
  let sessionToken = crypto.randomUUID()
  token.session = sessionToken
  fs.writeFileSync('token.json', JSON.stringify(token, null, 4))
}

cron.schedule('*/2 * * * *', async () => { 
  console.log(`\n\x1b[34mℹ\x1b[0m Attempting to reconnect to server!`)

  setTimeout(() => {
    const req = http.request(process.env.ServerUrl, (res) => {
      const startTime = performance.now();

      res.on('data', () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`\x1b[32m✔\x1b[0m Reconnected successfully in ${duration.toFixed(2)} milliseconds!`);
      });
    });

    req.on('error', (error) => {});
    req.end();
  }, 1000)
});

cron.schedule('*/15 * * * *', () => { 
  updateKeyValue() 
});

module.exports = {
    name: "ready",
    once: "true",
    execute(client) {

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }))

      app.get('/status', (req, res) => { res.status(200).json( {status: 200, message: 'OK'}) });
      
      
      app.post('/api/guildUpdate', async (req, res) => {
        const Header = req.headers
        const authUser = Header.authorization
      
        if(authUser != token.session) 
          return res.status(401).json({message: "Unauthorized: credentials are invalid"});
        updateKeyValue();

        return res.status(200).json({Message: 'OK: DataBase is updated successfully'});
      
      })

      app.post('/api/feed', async (req, res) => {
        const audit = require("../../Schemas/Audit");
        const Header = req.headers
        const authUser = Header.authorization

        console.log(token)
        console.log(authUser)

        if(authUser != token.session) 
          return res.status(401).json({message: "Unauthorized: credentials are invalid"});
        updateKeyValue();
        
        try {
          const { member, guild, content, meta } = req.body

          const Changelog = await audit.create({
            metadata: { metaId:     meta.id,          metaStatus:   meta.StatusMessage, metaTime:       new Date().toLocaleString()                           },
            author:   { userName:   member.nickname,  userId:       member.userId,      userAvatarUrl:  member.displayAvatarURL                               },
            guild:    { guildName:  guild.name,       guildId:      guild.id,           guildIconUrl:   guild.iconURL                                         },
            content:  { title:      content.title,    subject:      content.subject,    favorability:   content.favorability, updated: content.updated || {}  }
          })

          pusher.trigger("Socket", "event", Changelog);
          return res.status(200).json({Message: 'OK: Changelog updated'});
        } catch { 
          return res.status(405).json({Message: 'Not Allowed: Invalid request'}) 
        }
    }); 
    server.listen(4000);
  }

}