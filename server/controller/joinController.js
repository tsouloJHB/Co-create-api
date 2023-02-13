
const Join = require('../models/join');
const Post = require('../models/Post');
const User = require('../models/user');
const Project = require('../models/project');
const GroupChatController = require('../controller/GroupChatController');



let returnResponse = {
    response:false,
    message:"",
};

//@desc     Request join project
//@route    POST api/join/
//@access   Private
module.exports.join_project = async(req,res)=>{
    try{
        const postId = req.body.postId
       //check if post exits
      
       const post = await Post.findById(postId);
       
       const joinAlreadyExits = await Join.findOne({postId,userId:req.id.id});
    
       //check if user is not joining their own post
       const checkPostUserId = await Post.findOne({userId:req.id.id,_id:postId});
       console.log(checkPostUserId)
       if(joinAlreadyExits){
        res.status(400).json("Join request already sent"); 
       }else{
        if(!checkPostUserId){
            if(post){
                //create join record
                const join = await Join.create({postId,userId:req.id.id}); 
                
                res.status(201).json("Join request has been made");
               }else{
                res.status(400).json("Post not found");
            }     
        }else{
            res.status(400).json("You can't join your own post");
        }
        
       }
    
       
    }catch (err){
     
        res.status(400).json("error joining project");
    }
}

//@desc     Revoke join project
//@route    Delete api/join/
//@access   Private
module.exports.delete_join = async(req,res) =>{
    const postId = req.params.postId;
    try {
        const findJoin = await Join.find({postId,userId:req.id.id});
        if(findJoin){
            await Join.findOneAndDelete({postId,userId:req.id.id});
            res.status(201).json('join revoked');
        }else{
            res.status(400).json("Join history not found"); 
        }
    } catch (err) {
        res.status(400).json(err);
    }
}


//@desc     Respond to join project by either accepting or declining request
//@route    Put api/join/response
//@access   Private
module.exports.join_response = async(req,res) =>{
    try {
        const getPost = await Post.findOne({userId:req.id.id,_id:req.body.postId});
        const foundJoin = await Join.findById(req.body.joinId);
        const userInProjectCheck = await checkIfUserExitsInProject(foundJoin.userId,req.id.id,req.body.postId);
        if(getPost){
            if(foundJoin && userInProjectCheck.response){

                //check if user is already accepted for the project

                const join = await Join.findByIdAndUpdate(req.body.joinId,{status:req.body.status});
                const respond = 'Request was: ' +req.body.status+"ed";
                //update project and add user to project
                const acceptJoin = await addAcceptedUserToProject(req.body.status,join.userId,req.body.postId,req.id.id);
                if(acceptJoin.response){ 
                    //remove join request
                    await Join.findByIdAndDelete(req.body.joinId);
                    res.status(201).json(respond);
                }else{
                    //revert join
                    await Join.findByIdAndUpdate(req.body.joinId,{status:"Rejected"});
                    res.status(400).json(acceptJoin.message);
                }
               
            }else{
                const message = userInProjectCheck.message != "" ?  userInProjectCheck.message : "Join request not found";
                res.status(400).json(message);
            }
        }else{
            res.status(400).json("Post not found"); 
        }

    } catch (err) {
        
        res.status(500).json("The Server application encountered an error"); 
    }
}



//@desc     Get joins request for post
//@route    Get api/join/:id
//@access   Private
module.exports.get_join_requests  = async(req,res)  =>{
    try {
        //check if post exits 
      
        const findPost = await Post.find({postId:req.params.id,userId:req.id.id});
        if(findPost ){
            
            const join = await Join.find({postId:req.params.id});
            var obj = {};
            const joinRequest = await Promise.all(
                join.map(async (el) => {
                    var user = await User.findById(el.userId);  
                  obj = {
                    joinId:el.id,
                    name:user.name,
                    surname:user.surname,
                    image:user.image,
                    bio:user.desc,
                    occupation:user.occupation,
                    email:user.email,
                    status:el.status
                  }
                  return obj;
                })
              );
          
            res.status(200).json(joinRequest);
        }else{
            res.status(400).json("Post not found"); 
        }
    } catch (err) {
        console.log(err);
        res.status(400).json("Post not found"); 
    }
}


//@desc     Get  all join request for user
//@route    Get api/join/request
//@access   Private

module.exports.get_all_join_requests = async(req,res) =>{
   
   try {
	 const foundJoin = await Join.find({userId:req.id.id});
	    if(foundJoin.length !== 0){
           
	        res.status(200).json(foundJoin)
	    }else{
	        res.status(200).json({})
	    }
    } catch (err) {
        res.status(500).json(err);
    }
}

const addAcceptedUserToProject = async(status,userId,postId,projectUserId)=>{
    returnResponse.message ="Project not updated";
   
    if(status == 'Accepted'){
      
        try {
            const foundProject = await Project.findOne({postId:postId,userId:projectUserId});
            
            let membersAmount = foundProject.members.length+1;
            if(membersAmount <= foundProject.maxMembers){
                const addProject = await Project.findOneAndUpdate({postId:postId},{ $push: { members: userId },currentMembers:membersAmount });
                //await Join.findByIdAndDelete(req.body.joinId);
                if(membersAmount == foundProject.maxMembers){
                    await Project.findOneAndUpdate({postId:postId},{status:"InProgress"});
                  
                }
                 //add user to group chat
                await GroupChatController.addUserToGroupChat(userId,foundProject.id);
                returnResponse.response = true;
                return returnResponse;
            }else{
                returnResponse.response = false;
                returnResponse.message = 'The project has reached its maximum members';
                return returnResponse;
            }
            
            //update join status
        } catch (err) {
            console.log(err);
            returnResponse.message = err;
            returnResponse.response = false;
            return returnResponse;
        }
       
    }
    returnResponse.response = false
    return returnResponse;
}

//check if user is already a member of a project
const checkIfUserExitsInProject = async(userId,projectUserId,postId) =>{
    const project = await Project.findOne({postId:postId,userId:projectUserId});
    if(project.members.includes(userId)){
        returnResponse.response = false;
        returnResponse.message = "User has already joined the project";
        return returnResponse;
    }
    returnResponse.response = true;
    return returnResponse;   
}

//delete all joins
module.exports.delete_all_joins = async(postId) =>{
    try {
        const findJoin = await Join.find({postId:postId});
        if(findJoin.length > 0){
            const joinRemove = await Promise.all(
                findJoin.map(async (el) => {
                    await Join.findByIdAndDelete(el.id);
                })
              );
              return true;
        }
    } catch (err) {
        return false
    }
    return false;
}

