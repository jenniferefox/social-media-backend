import express, { Application } from "express";
import router from "./routes/users";
import cors from "cors";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/", router);

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
