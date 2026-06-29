import 'dotenv/config';
import app from './src/app.js';
import { connectDatabase } from './src/config/db.js';

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

async function startServer() {
  await connectDatabase(mongoUri);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});