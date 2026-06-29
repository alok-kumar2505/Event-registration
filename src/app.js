import express from 'express';
import eventRoutes from './routes/eventRoutes.js';

const app = express();

app.use(express.json());
app.use('/events', eventRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
