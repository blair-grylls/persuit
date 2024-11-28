import express from "express";
import cors from "cors"


const app = express();
const port = 3001;

// Middlewares
app.use(cors())

// Routes
app.get("/", (_, res) => {
  res.send("Hello world!")
});

// App start
app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
});