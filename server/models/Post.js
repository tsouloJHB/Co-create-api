const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        max: 500,
      },
      projectName: {
        type: String,
        max: 50,
      },
      tags:{
        type: Array,
        default: [],
      },
      image:{
        data:Buffer,
        contentType:String
      },
      views: {  
        type: Array,
        default: [],
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Post", PostSchema);
  