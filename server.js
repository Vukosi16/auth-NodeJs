import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import dbconnection from './database/database.js';
import authRoute from './routes/auth-routes.js';
import homeRoute from './routes/home-routes.js';
import adminRoute from './routes/admin-routes.js';
import uploadImageRoute from './routes/image-routes.js';


dbconnection();
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/home', homeRoute);
app.use('/api/admin', adminRoute);
app.use('/api/image', uploadImageRoute);

app.listen(port, () => {
    console.log("Listening now on port", port);
});
