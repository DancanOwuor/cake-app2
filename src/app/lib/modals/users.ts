//Always restart the dev server (CTRL + C then npm run dev) after changing anything in your Mongoose schemas.

import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
    {
        "username": {type:String, required:true, unique: true},
        "role": {
            type: String, 
            enum: ["Admin", "localUser", "moderator"], 
            required:true
                },
        "email": {type: String, required:true, unique: true},
        "password": {type: String, required: true, unique: true},
    },
    {
        timestamps: true
    }
);

const User = models.User || model("User", userSchema)

export default User