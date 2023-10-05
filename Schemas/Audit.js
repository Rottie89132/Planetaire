const { model, Schema } = require("mongoose");

const auditSchema = new Schema({
    createdAt:  { type:       Date,    default:     new Date()                                          },
    metadata:   { metaId:     String,  metaStatus:  String,  metaTime:       String                     }, 
    author:     { userName:   String,  userId:      String,  userAvatarUrl:  String                     },
    guild:      { guildName:  String,  guildId:     String,  guildIconUrl:   String                     },
    content:    { title:      String,  subject:     String,  favorability:   String,  updated:  Object  },
    timeseries: { 
        timeField: { field: 'createdAt', type: 'date' },
        metaField: { field: 'metadata', type: 'object' }
    }
});

const audit = model("audits", auditSchema);
module.exports = audit;
