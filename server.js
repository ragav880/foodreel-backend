
require('dotenv').config();
const app = require('./src/app');
const connectDb = require('./src/db/db');

connectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})