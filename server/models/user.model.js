import mongoose, { Schema } from "mongoose";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"
import validator from 'validator';

const userSchema = new Schema({

    fullName: {
        type: String,
        required: true,
        trim: true,
    },

    username: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
        required: true,
        max: 15
    },

    avatar: {
        type: String,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate:[validator.isEmail,"Please Enter a Valid Password"]

    },
    password: {
        type: String,
        required: true,
        trim: true,
    },


    role:{
        type:String,
        default:"user"
    },

    refreshToken: {
        type: String,
    },

    resetPasswordToken:String,
    resetPasswordExpire : Date,
    


}, { timestamps: true });

// Hashing
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")){
        next();
       return;
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

//methods is an object where isPasswordCorrect is inserted as new method
userSchema.methods.isPasswordCorrect = async function (password) {  //user password
    return await bcrypt.compare(password, this.password)
}

// JWT ACCESS TOKEN
userSchema.methods.generateAccessToken = async function () {  //user password
    return Jwt.sign(
        // payload
        {   
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName

        }, process.env.ACCESS_TOKEN_SECRET,

        // expiry
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });
}

// JWT REFRESH TOKEN
userSchema.methods.generateRefreshToken = async function () {  //user password
    return Jwt.sign(
        // payload
        {   
            _id:this._id,

        }, process.env.REFRESH_TOKEN_SECRET,
        // expiry
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });

}

const User = mongoose.model('User', userSchema)
export {User};