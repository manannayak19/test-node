const mongoose = require("mongoose");
const connectToDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully")
    }catch(e){
        console.error("Connection failed");
        process.exit(1)
    }
}

module.exports = connectToDB;