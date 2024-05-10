const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const personSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    work:{
        type:String,
        enum:['chef','waiter','manager'],
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    address:{
        type:String
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

personSchema.pre('save',async function(next){
    const person=this;
    if(!person.isModified('password'))
        return next();
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(person.password,salt);
        person.password=hashedPassword;
    }
    catch(err){
        return next(err);
    }
})

personSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}


const Person=mongoose.model('Person',personSchema);

module.exports=Person;