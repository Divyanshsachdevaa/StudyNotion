const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL).then( 
        () => {console.log("Connected with mongoDB")})
        .catch((err) => {
            console.log(err);
            console.log("Failed to connect with DB");
            process.exit(1);
        });
}