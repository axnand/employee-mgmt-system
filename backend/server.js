import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import logRoutes from './routes/logRoutes.js';
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/logs', logRoutes);
app.get("/", (req, res) => {
    res.send("Server is up and running!");
  });


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
