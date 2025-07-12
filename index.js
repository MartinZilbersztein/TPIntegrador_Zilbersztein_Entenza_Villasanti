import express from "express";
import cors from "cors";
import EventRouter from "./src/controllers/event-controller.js";
import UserRouter from "./src/controllers/user-controller.js";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.use('/api/event', EventRouter);
app.use('/api/event/:id', EventRouter);
app.use('/api/user/', UserRouter);


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});