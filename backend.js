import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { zona, tipo, minPrecio, maxPrecio, habitaciones } = req.query;

    let url = "https://api.easybroker.com/v1/properties?";
    if (zona) url += `search=${zona}&`;
    if (tipo) url += `property_type=${tipo}&`;
    if (minPrecio) url += `min_price=${minPrecio}&`;
    if (maxPrecio) url += `max_price=${maxPrecio}&`;
    if (habitaciones) url += `bedrooms=${habitaciones}&`;

    const response = await fetch(url, {
      headers: {
        "X-Authorization": process.env.EASYBROKER_API_KEY
      }
    });

    const data = await response.json();

    const resultados = data.content.map(p => ({
      titulo: p.title,
      precio: p.public_price,
      zona: p.location,
      habitaciones: p.bedrooms,
      link: `https://www.guirolayasociados.com/propiedad/${p.public_id}`
    }));

    res.status(200).json({
      total: resultados.length,
      propiedades: resultados,
      mensaje: "Resultados obtenidos desde Guirola y Asociados"
    });

  } catch (error) {
    res.status(500).json({ error: "Error consultando propiedades" });
  }
}
