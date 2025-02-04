import express, { Application } from "express";
import router from "./routes/users";

const app: Application = express();

app.use(express.json());

app.use("/users", router);

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
