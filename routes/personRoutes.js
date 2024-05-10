const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Person = require('./../models/Person'); 
const { jwtAuthMiddleWare, generateToken }= require('./../jwt');

router.get("/data",jwtAuthMiddleWare, async (req, res) => {
    try {
        const data = await Person.find({});
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal server error" });
    }
})
router.post("/person",async (req,res)=>{
    try{
        const data=req.body;
        const newPerson=new Person(data);
        await newPerson.save();

        const payload={
            id:newPerson.id,
            username:newPerson.username

        }

        const token = generateToken(payload);
        console.log(JSON.stringify(payload));
        console.log('token is',token);
        res.status(200).json({newPerson:newPerson,token:token});
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'invalidor internal server error'});
    }
})

router.post('/login', async(req, res) => {
    try{
        // Extract username and password from request body
        const {username, password} = req.body;

        // Find the user by username
        const user = await Person.findOne({username: username});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // generate Token 
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.put("/update/:id", async (req, res) => {
    try {
        const id = req.params.id; // Get the ID from the URL parameter
        const data = req.body; // Get the updated data from the request body

        // Perform the update operation
        const updatedPerson = await Person.findByIdAndUpdate(id, data, { new: true });

        if (!updatedPerson) {
            // If no person found with the given ID
            return res.status(404).json({ error: "Person not found" });
        }

        // Send a response indicating successful update
        res.json({ message: "Person updated successfully", updatedPerson });
    } catch (err) {
        // Handle any errors that occur during the update operation
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/data/:work",async(req,res)=>{
    try{
        const work=req.params.work;
        const data = await Person.find({work:work});
        res.json(data);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
})


module.exports = router;
