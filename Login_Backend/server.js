const express = require("express");
const cors = require("cors");
const PORT = 8000;

const connectDB = require("./config/dbconnect");
const seedAdmin = require("./seeders/adminSeeder");
const authroutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
const Userroute = require("./routes/userRoutes");

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);



app.use(cors());

app.use(express.json());


app.use('/api/user', Userroute);
app.use("/api/auth", authroutes);

app.get("/api/admin", protect(["admin"]), (req, res) => {
  res.json({ msg: "Welcome Admin" });
});
app.get("/api/student", protect(["student"]), (req, res) => {
  res.json({ msg: "Welcome Student" });
});
app.get("/api/teacher", protect(["teacher"]), (req, res) => {
  res.json({ msg: "Welcome Teacher" });
});

connectDB().then(() => {
  seedAdmin();
  app.listen(PORT, console.log(`Backend is running on the ${PORT}`));
});

