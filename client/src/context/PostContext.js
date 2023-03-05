import React from "react";
import { createContext, useReducer } from "react";

export const PostContext = createContext();

export const PostReducer = (state,action) =>{
    switch (action.type){
        case 'SET_POSTS':
            return{
                posts:action.payload,
                loading:false
            }
        case 'CREATE_POST':
            return{
                posts:[action.payload, ...state.posts]
            }
        case 'DELETE_POST':
            return{
                posts: state.posts.filter((w) => w._id !== action.payload._id)
           
            }   
        case 'LOADING':
            return{
                loading:true
            }         
        default:
            return state    
    }
    
}

export const PostContextProvider = ({children}) =>{
    const [state, postDispatch] = useReducer(PostReducer,{
        posts: null
    })

    console.log('Postcontext state:',state)

    return(
        <PostContext.Provider value={{...state, postDispatch}}>
            {children}
        </PostContext.Provider>
    )
}