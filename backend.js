import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/", (req, res) => {
  res.send("Backend Guirola y Asociados conectado correctamente ✅");
});

app.get("/propiedades", async (req, res) => {
  try {
    const response = await fetch("https://api.easybroker.com/v1/properties", {
      headers: {
        "X-Authorization": process.env.EASYBROKER_API_KEY,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error consultando EasyBroker" });
  }
});

// 👇 ESTO ES CLAVE PARA VERCEL
export default app;
