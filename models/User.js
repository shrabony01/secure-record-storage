import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must use a valid email address"],
  },
  password: {
    type : String,
    required: true,
    minlength : 5,
  },
});
//Automatically hash user password before saving to MongoDB
userSchema.pre("save",async function(){
    if(this.isNew || this.isModified("password")){
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password ,saltRounds);
    }
});
//Compare plain-text login password with stored hash
userSchema.method.isCorrectPassword = async function (password){
    return bcrypt.compare(password,this.password);
};

const User = model("User",userSchema);
export default User;