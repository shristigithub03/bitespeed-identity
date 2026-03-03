import express from "express";
import pool from "./db";
import identifyRoute from "./routes/identify";

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});
app.use("/identify", identifyRoute);


app.listen(3000, () => {
  console.log("Server running on port 3000");
});