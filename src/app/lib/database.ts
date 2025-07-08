import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined. Check your .env.local file.");
}

const connectdb = async ()=>{
     const connectionState = mongoose.connection.readyState;

     if(connectionState === 1){
        console.log("Already Connected")
     }
     if(connectionState === 2){
        console.log("Connecting")
     }

     try{
        await mongoose.connect(MONGODB_URI, {
            dbName: "CakeShop",
            bufferCommands:true
        })
        console.log("Connected")
     } catch(error:unknown){
          if (error instanceof Error) {
             console.log("Error connecting to Database", error);
            throw new Error("Error:", error)
          }    
     }
};

export default connectdb;