const { response } = require('../app');
const Join = require('../models/join');
const Post = require('../models/Post');
const User = require('../models/user');


//@desc     Request join project
//@route    POST api/join/
//@access   Private
module.exports.join_project = async(req,res)=>{
    try{
       //check if post exits
       const post = await Post.findById(req.params.id);
       const joinAlreadyExits = await Join.findOne({postId:req.params.id,userId:req.id.id});
       if(joinAlreadyExits){
        res.status(400).json("Join request already sent"); 
       }else{
        
        if(post){
            const join = await Join.create({postId:req.params.id,userId:req.id.id}); 
            res.status(201).json("Join request has been made");
           }else{
            res.status(400).json("Post not found");
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


//@desc     Response to join project by either accepting or declining 
//@route    Put api/join/response
//@access   Private
module.exports.join_response = async(req,res) =>{
    try {
        const getPost = await Post.findOne({userId:req.id.id,_id:req.body.postId});
        const findJoin = await Join.findById(req.body.joinId);
       
        if(getPost){
            
            if(findJoin){
                await Join.findByIdAndUpdate(req.body.joinId,{status:req.body.status});
                const respond = 'Request was: ' +req.body.status+"ed";
                res.status(201).json(respond);
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
           
            
            var resp = [];
            var object = {};
            join.forEach(async el => {
                var user = await User.findById(el.userId);
        
                 obj  = {
                    joinId:el.userId,
                    name:user.name,
                }
                resp.push(obj);    
                console.log(resp);
            }); 
           
            res.status(200).json(resp);
        }else{
            res.status(400).json("Post not found"); 
        }
    } catch (err) {
        console.log(err);
        res.status(400).json("Post not found"); 
    }
}
