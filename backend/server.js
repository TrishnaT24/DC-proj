const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/tasksRoute');
const cors = require("cors");
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const startServer = async () => {
  const connected = await connectDB();
  if (connected) {
    const PORT = process.env.PORT || 5000;
    app.use('/api', taskRoutes); // 🔁 Mount routes
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
};

startServer();
