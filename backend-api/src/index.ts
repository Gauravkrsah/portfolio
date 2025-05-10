import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:\${port}`);
});