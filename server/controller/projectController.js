const Project = require('../models/project');
const Post = require('../models/Post');
const User = require('../models/user');
const GroupChatModel = require('../models/GroupChatModel');


//@desc     Get all projects
//@route    GET api/projects/all
//@access   Public
module.exports.get_all_projects = async(req,res) =>{
    try {
        const projects = await Project.find()
        
        res.status(200).json(projects);
    } catch (err) {
        res.status(400).json(err);
    }
}


//@desc     Get all user projects
//@route    GET api/projects/
//@access   Private
module.exports.get_user_projects = async(req,res) =>{
    try {
        const projects = [];
       
            const allProjects = await Project.find();
            await Promise.all(
                allProjects.map(async (el)=>{
                    if(el.members.includes(req.id.id) || el.userId == req.id.id){
                        projects.push(el);    
                    }                    
                })
            );
        
        res.status(200).json(projects);
    } catch (err) {
        res.status(400).json(err);
    }
}

//@desc     Get project by postId
//@route    GET api/projects/
//@access   Private
module.exports.get_projectByPostId = async(req,res) =>{
    const postId = req.params.postId
    console.log(req.params)
    try {
        const project = await Project.findOne({postId});
        res.status(200).json(project);
    } catch (err) {
        res.status(400).json(err);
    }
}

//@desc     Update project
//@route    PUT api/projects/:id
//@access   Private
module.exports.update_project = async(req,res) =>{
    try {
        //check if project id is valid
        const projectCheck = await Project.findOne({_id:req.params.id,userId:req.id.id});
        //check if max number changed and is not less that current members
        if(req.body.maxMembers){
            const currentMembers = projectCheck.members.length;
            if(req.body.maxMembers < currentMembers){
                res.status(400).json('You cant\'t set members no to less than current members');
                return;
            }
        }
      
        
        if(projectCheck){
            const updateProject = await Project.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            await Post.findByIdAndUpdate(updateProject.postId ,{$set:req.body});
       
            res.status(201).json('Projected has been updated');
        }else{
            res.status(400).json("Incorrect project reference or not valid user ");
        }
       
    } catch (err) {
        res.status(400).json(err);
    }
}

//@desc     Delete project
//@route    PUT api/projects/:id
//@access   Delete 

module.exports.delete_project = async(req,res) =>{

    try {
        const checkProject = await Project.findOne({_id:req.params.id});
        if(checkProject){
            const deleteProject = await Project.findByIdAndDelete(req.params.id);
            // delete group chat
            const deleteGroupChat = await GroupChatModel.findOneAndDelete({postId:checkProject._id})
            //delete post
            const deletePost = await Post.findByIdAndDelete(checkProject.postId)

            res.status(201).json("Project was deleted"); 
        }else{
            res.status(400).json("Project not found")
        }
         
    } catch (err) {
       res.status(400).json(err)     
    }
}

//@desc     Delete project
//@route    PUT api/projects/:id
//@access   Delete
// module.exports.update_project = async(req,res) =>{
//     try {
//         await Project.findByIdAndUpdate(req.params.id,{
//             $set:req.body
//         });
//         if(req.body.desc){
//             const getProject = await Project.findById(req.params.id);
//             await Post.findByIdAndUpdate(getProject.postId ,{desc:req.body.desc});
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// }

module.exports.start_group = async(req,res) =>{
        try {
            const project = await Project.findById(req.params.id);
            if(!project){
                res.status(400).json('Incorrect project Id');
                return;
            }
            if(project.members.length <= 1){
                res.status(400).json('The project has to have at least 2 members ');
                return;
            }
            if(project.status == "InProgress"){
                res.status(400).json('Project already started');
                return;
            }
            await Project.findByIdAndUpdate(req.params.id,{status:'InProgress'});
            res.status(201).json('Project started');
        } catch (err) {
            res.status(500).json(err);
        }
}


module.exports.leave_project = async(req,res) =>{
    try {
        const project = await Project.findById(req.params.id);
        if(!project){
            res.status(400).json('Project not found');
            return;
        }
        if(project.userId == req.id.id){
            res.status(400).json('You can\'t leave the project as the admin');
            return;
        }
        if(!project.members.includes(req.id.id)){
            res.status(400).json('User is not part of the project');
            return;
        } 
        //leave project
        const currentMembers = project.currentMembers -1;
      
        await Project.findByIdAndUpdate(req.params.id,{$pull :{members:req.id.id},currentMembers:currentMembers,status:"Pending"});
        //reduce current members
        //leave group
        await GroupChatModel.findOneAndUpdate({projectId:project.id},{$pull:{members:req.id.id}});     
        res.status(201).json("User has left the project");
    } catch (err) {
        console.log(err)
        res.status(400).json(err);
    }
}

module.exports.remove_user_from_project = async(req,res) =>{
    try {
        const project = await Project.findById(req.params.id);
        const user = await User.findById(req.body.userId);
        console.log(req.body.userId);
        console.log(user);
        if(!project){
            res.status(400).json('Project not found');
            return;
        }
        if(!user){
            res.status(400).json('User dose not exits');
            return;
        }
        if(project.userId !== req.id.id){
            res.status(400).json('Only admins can remove members in a project');
            return;
        }
        if(req.body.userId == req.id.id){
            res.status(400).json('You can\'t remove yourself instead assign your admin rights to another user');
            return;
        }
        const currentMembers = project.currentMembers -1;
        //if project current members is 1 then set the project status to pending 
        await Project.findByIdAndUpdate(req.params.id,{$pull :{members:req.body.userId},currentMembers:currentMembers,status:"Pending"});
        await GroupChatModel.findOneAndUpdate({projectId:project.id},{$pull:{members:req.body.userId}});     
        res.status(201).json("User has been removed");
        //reduce current members
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

module.exports.delete_project_func = async(postId) =>{
    try {
        const project  = await Project.findOneAndDelete({postId:postId});    
        return true;
    } catch (error) {
        //log message
        return false;
    }
  
}



