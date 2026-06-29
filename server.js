import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const port = process.env.PORT || 3000;

connectDB();

async function startServer() {

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();