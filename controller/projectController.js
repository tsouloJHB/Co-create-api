const Project = require('../models/project');


//@desc     Get all projects
//@route    GET api/projects/all
//@access   Public
module.exports.get_all_projects = async(req,res) =>{
    try {
        const projects = await Project.find();
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
        const projects = await Project.find({userId:req.id.id});
        res.status(200).json(projects);
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
        const projectCheck = await Project.findOne({id:req.params.id,userId:req.id.id});
        if(projectCheck){
            const updateProject = Project.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            res.status(201).json('Projected has been updated');
        }else{
            res.status(400).json("Incorrect project reference or not valid user ");
        }
       
    } catch (err) {
        res.status(400).json(err);
    }
}

//@desc     Update project
//@route    PUT api/projects/:id
//@access   Private

module.exports.delete_project = async(req,res) =>{

    try {
        const checkProject = await Project.findOne({id:req.params.id,userId:req.id.id});
        if(checkProject){
            const deleteProject = await Project.findByIdAndDelete(req.params.id);
            res.status(201).json("Project was deleted"); 
        }else{
            res.status(400).json("Project not found")
        }
         
    } catch (err) {
       res.status(400).json(err)     
    }
}