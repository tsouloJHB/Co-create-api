
import React from "react";

export const convertBinaryToString = (image)=>{
    
    
    const base64String = btoa(new Uint8Array(image.data.data).reduce(function (data, byte) {
        return data + String.fromCharCode(byte);
    }, ''));
        
    return base64String
}