import dotenv from 'dotenv';
import app from './src/app.js';
import connectToDb from './src/config/database.js';

dotenv.config();

connectToDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
