import express from "express";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import cors from "cors";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());
app.use(cors());

//ruta para registrar datos

app.post("/api/register", async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    // valida que todos los campos esten llenos
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son necesarios",
      });
    }

    //validar si el correo ya esta en uso
    const [existingUser] = await db.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );
    // si el correo esta en usuario muestra el mensaje
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El correo ya está registrado",
      });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    // procedemos a insertar los datos
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, correo, contraseña) values (?, ?, ?)",
      [nombre, correo, hashedPassword]
    );

    

    //muestra el mensaje cuando el usuario se registro correctamente
    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: {
        id: result.insertId,
        nombre,
        correo,
      },
    });

    //muestra un error si el usuario no se pudo registrar
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
});

//ruta para obtener los usuarios
app.get("/users", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM usuarios");
  res.json(rows);
});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
