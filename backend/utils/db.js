require('dotenv').config() ;

const mongoose = require('mongoose'); 

const connectDB = async () => {
    try{
        const uri = process.env.MONGO_URL ;
        if (!uri) {
            throw new Error('MONGO_URI is not defined');
        }
        await mongoose.connect(uri) ;
        console.log('Database connected successfully')
    }
    catch(e){
        console.log('Error in database connection');
        console.log(e);
    }
}

module.exports = connectDB ;