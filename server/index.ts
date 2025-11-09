import express from 'express';
import chalk from 'chalk';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/conn.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.get('/', (req, res) => (
    res.send('Hello, World!')
));

//Routes
app.use('/api', chatRoutes);

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(chalk.green(`Server is running on http://localhost:${PORT}`));
    } catch (error) {
        console.error(chalk.red('Failed to start server:', error));  
    }
})
