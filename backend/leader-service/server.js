const express = require('express');
const dotenv = require('dotenv');
const leaderRouter = require('./leaderRoutes');
const cors = require("cors");
const app = express();

const {
  connectToRabbitMQ,
  consumeTaskCreated,
  consumeTaskUpdated
} = require('../messageQueue/rabbitmq');

dotenv.config();

app.use(cors());
app.use(express.json());

const startLeaderServer = async () => {
    const PORT = process.env.PORT_LEADER || 5000;
    app.use('/api', leaderRouter); // 🔁 Mount routes
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};




(async () => {
  try {
    await connectToRabbitMQ();

    // Start consumers if needed
    await consumeTaskCreated((task) => {
      console.log('📥 Received Task Created:', task);
    });

    await consumeTaskUpdated((task) => {
      console.log('📥 Received Task Updated:', task);
    });

  } catch (err) {
    console.error('🐰 RabbitMQ connection failed:', err);
    process.exit(1); // crash early if rabbitmq is critical
  }
})();

module.exports=startLeaderServer



