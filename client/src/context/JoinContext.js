import React from "react";
import { createContext, useReducer } from "react";

export const JoinContext = createContext();

export const JoinReducer = (state,action) =>{
    switch (action.type){
        case 'SET_JOINS':
            return{
                joins:action.payload,
                loading:false
            }
        case 'LOADING':
            return{
                loading:true
            }         
        default:
            return state    
    }
    
}

export const JoinContextProvider = ({children}) =>{
    const [state, JoinDispatch] = useReducer(JoinReducer,{
        joins: null
    })

   

    return(
        <JoinContext.Provider value={{...state, JoinDispatch}}>
            {children}
        </JoinContext.Provider>
    )
}