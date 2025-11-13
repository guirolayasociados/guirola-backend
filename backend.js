import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Backend Guirola y Asociados conectado correctamente ✅");
});

// Ruta principal: búsqueda de propiedades
app.get("/propiedades", async (req, res) => {
  const { tipo, zona, operacion } = req.query;

  try {
    const response = await fetch("https://api.easybroker.com/v1/properties", {
      headers: {
        "X-Authorization": process.env.EASYBROKER_API_KEY,
      },
    });

    const data = await response.json();
    if (!data.content) return res.json({ mensaje: "No se encontraron propiedades." });

    // Filtrar solo publicadas y que coincidan con la búsqueda
    const filtradas = data.content.filter((p) => {
      const publicada = p.public_url !== null;
      const coincideTipo = tipo ? p.property_type?.toLowerCase().includes(tipo.toLowerCase()) : true;
      const coincideZona = zona ? p.location?.toLowerCase().includes(zona.toLowerCase()) : true;
      const coincideOperacion = operacion ? p.operations.some(op => op.type.toLowerCase().includes(operacion.toLowerCase())) : true;
      return publicada && coincideTipo && coincideZona && coincideOperacion;
    });

    if (filtradas.length === 0) {
      return res.json({ mensaje: "No hay resultados para esta búsqueda." });
    }

    const resultados = filtradas.map((p) => ({
      titulo: p.title,
      enlace: p.public_url,
    }));

    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error consultando EasyBroker" });
  }
});

app.listen(PORT, () => console.log(`Servidor Guirola ejecutándose en puerto ${PORT}`));
