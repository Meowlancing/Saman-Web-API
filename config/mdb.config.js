const mongoose = require('mongoose');
require('dotenv').config()

exports.setup = function () {
        console.log("Connecting to Franchise Hub database...")
        try {
                mongoose.connect(process.env.MONGO_URI);
                console.log("Connected ✓");
        } catch (e) {
                console.log("Connection failed: Exiting...");
                console.error(e);
                process.exit(1);
        }
};
