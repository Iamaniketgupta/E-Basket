import { ApiError } from "../utils/apiError.js";

const authorizesRoles = (roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user?.role)){
           throw new ApiError(401,`Role : ${req.user.role} is not allowed to access this ` )
        }   
        next();    
    };
}
export {authorizesRoles}