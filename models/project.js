const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {
        projectName:{
            type: String,
            require:[true,"No project name provided"],
        },
        dec:{
            type: String,
            require:[true,"No project description provided"],,
        },
        status:{
            type:string,
            enum: [NotStarted,InProgress, Complete],
            default: "NotStarted",
        },
        members: {
            type: Array,
            default: [],
        },
        maxMembers:{
            type: number,
            require:[true,"No maximum member provided"],,
        },
        currentMembers:{
            type: number,
            default:0,
            
        },
        contractId:{
            type: String,
            require:true,
        },
    },

    { timestamps: true }
);

module.exports = mongoose.model("Project",ProjectSchema);