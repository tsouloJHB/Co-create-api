const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {
        projectName:{
            type: String,
            require:[true,"No project name provided"],
        },
        userId:{
            type:String,
            required:[true,"No user Id provided"],
        },
        postId:{
            type:String,
            required:[true,"No post Id provided"],
        },
        image:{
            data:Buffer,
            contentType:String
        },
        desc:{
            type: String,
            require:[true,"No project description provided"],
        },
        status:{
            type:String,
            enum: ['NotStarted','InProgress', 'Complete'],
            default: "NotStarted",
        },
        members: {
            type: Array,
            default: [],
        },
        maxMembers:{
            type: Number,
            require:[true,"No maximum member provided"],
        },
        currentMembers:{
            type: Number,
            default:0,
            
        },
        tags:{
            type: Array,
            default: [],
        },
        contractId:{
            type: String,
            require:true,
        },
    },

    { timestamps: true }
);

module.exports = mongoose.model("Project",ProjectSchema);