import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
