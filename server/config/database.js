const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    const rawUrl = 
        process.env.dataBase_url || 
        process.env.DATABASE_URL || 
        process.env.MONGODB_URI || 
        process.env.MONGO_URI;

    const dbUrl = rawUrl ? rawUrl.trim() : null;

    if (!dbUrl) {
        console.error('❌ Missing database connection string in environment variables (dataBase_url, DATABASE_URL, or MONGODB_URI).');
        return;
    }

    mongoose.connect(dbUrl)
    .then(() => {
        console.log('✅ Database connected successfully');
    })
    .catch((error) => {
        console.error('❌ Error connecting to the database:', error.message);
    });
};
