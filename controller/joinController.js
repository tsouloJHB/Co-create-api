
const Join = require('../models/join');
const Post = require('../models/Post');
const User = require('../models/user');
const Project = require('../models/project');


//@desc     Request join project
//@route    POST api/join/
//@access   Private
module.exports.join_project = async(req,res)=>{
    try{
       //check if post exits
       const post = await Post.findById(req.params.id);
       const joinAlreadyExits = await Join.findOne({postId:req.params.id,userId:req.id.id});
       //check if user is not joining their own post
       const checkPostUserId = await Post.findOne({userId:req.id.id});
       if(joinAlreadyExits){
        res.status(400).json("Join request already sent"); 
       }else{
        if(!checkPostUserId){
            if(post){
                //create join record
                const join = await Join.create({postId:req.params.id,userId:req.id.id}); 
                
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

    try {
        const findJoin = await Join.find({postId:req.params.id,userId:req.id.id});
        if(findJoin){
            await Join.findOneAndDelete({postId:req.params.id,userId:req.id.id});
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
        const findJoin = await Join.findById(req.body.joinId);
       
        if(getPost){
            
            if(findJoin){
                //check if user is already accepted for the project
                const join = await Join.findByIdAndUpdate(req.body.joinId,{status:req.body.status});
                const respond = 'Request was: ' +req.body.status+"ed";
                //update project and add user to project
                const acceptJoin = await addAcceptedUserToProject(req.body.status,join.userId,req.body.postId,req.id.id);
                if(acceptJoin.response){
                    res.status(201).json(respond);
                }else{
                    //revert join
                    await Join.findByIdAndUpdate(req.body.joinId,{status:"Rejected"});
                    res.status(400).json(acceptJoin.message);
                }
               
            }else{
                res.status(400).json("Join request not found");
            }
        }else{
            res.status(400).json("Post not found"); 
        }

    } catch (err) {
        res.status(400).json(err); 
    }
}



//@desc     Get joins request for post
//@route    Get api/join/:id
//@access   Private
module.exports.get_join_requests  = async(req,res)  =>{
    try {
        //check if post exits 
      
        const findPost = await Post.find({postId:req.params.id,userId:req.id.id});
       
        if(findPost){
            
            const join = await Join.find({postId:req.params.id});
            var obj = {};
            const joinRequest = await Promise.all(
                join.map(async (el) => {
                    var user = await User.findById(el.userId);  
                  obj = {
                    joinId:el.id,
                    name:user.name,
                    bio:user.desc,
                    occupation:user.occupation,
                    email:user.email
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


const addAcceptedUserToProject = async(status,userId,postId,projectUserId)=>{
    let acceptResponse = {
        response:false,
        message:"Project not updated",
    };
    if(status == 'Accept'){
        console.log(status); 
        try {
            const findProjectMaxNumber = await Project.findOne({postId:postId,userId:projectUserId});
            
            let membersAmount = findProjectMaxNumber.members.length+1;
            if(membersAmount <= findProjectMaxNumber.maxMembers){
                //const addProject = await Project.findOneAndUpdate({postId:postId},{ $push: { members: userId } }); 
                acceptResponse.response = true;
                return acceptResponse;
            }else{
                acceptResponse.response = false;
                acceptResponse.message = 'The project has reached its maximum members';
                return acceptResponse;
            }
            
            //update join status
        } catch (err) {
            console.log(err);
            acceptResponse.message = err;
            acceptResponse.message = false;
            return acceptResponse;
        }
       
    }
    return acceptResponse;
}
