const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const categoriesRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');


// require("./helpers/cron")

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS Middleware
app.use(cors()); // This will allow access from any origin

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/categories", categoriesRoutes);
app.use("/users", userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
