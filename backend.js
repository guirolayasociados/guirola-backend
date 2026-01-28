import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { zona, tipo, minPrecio, maxPrecio, habitaciones } = req.query;

    let url = "https://api.easybroker.com/v1/properties?";

    if (zona) url += `search=${encodeURIComponent(zona)}&`;
    if (tipo) url += `property_type=${encodeURIComponent(tipo)}&`;
    if (minPrecio) url += `min_price=${minPrecio}&`;
    if (maxPrecio) url += `max_price=${maxPrecio}&`;
    if (habitaciones) url += `bedrooms=${habitaciones}&`;

    const response = await fetch(url, {
  method: "GET",
  headers: {
    "X-Authorization": process.env.EASYBROKER_API_KEY,
    "Accept": "application/json"
  }
});


    if (!response.ok) {
      return res.status(500).json({
        error: "Error consultando EasyBroker",
        status: response.status
      });
    }

    const data = await response.json();

    if (!data.content || data.content.length === 0) {
      return res.json({
        total: 0,
        propiedades: [],
        mensaje: "No se encontraron propiedades para esta búsqueda"
      });
    }

    const resultados = data.content.map(p => ({
      titulo: p.title || "Propiedad disponible",
      precio: p.public_price || "Consultar",
      zona: p.location || "Guatemala",
      habitaciones: p.bedrooms || "N/D",
      enlace: `https://www.guirolayasociados.com/propiedad/${p.public_id}`
    }));

    res.status(200).json({
      total: resultados.length,
      propiedades: resultados,
      mensaje: "Resultados oficiales de Guirola y Asociados"
    });

  } catch (error) {
    console.error("ERROR BACKEND:", error);
    res.status(500).json({ error: "Fallo interno del servidor" });
  }
}


