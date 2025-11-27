import express from "express";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

//ejemplo de ruta para probar la conexión a la base de datos

app.get("/users", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM usuarios");
  res.json(rows);
});

app.post("/api/newusers", async (req, res)=>{
    

})

app.put("/api")


app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

