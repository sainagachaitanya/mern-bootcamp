import "dotenv/config"
import express from 'express'
import ConnectDatabase from './config/db.js'
import router from "./routes/Routes.js"; 
import ErrorHandler from "./middleware/ErrorHandler.js";
import cors from "cors"

// Connect to Database
ConnectDatabase();

// Inititiate Express
const app = express();

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/v1/bootcamps", router)

// error handler
app.use(ErrorHandler)

// Run server
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`[INFO] Server Running on port ${PORT}`))