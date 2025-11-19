import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { tipo, zona, operacion } = req.query;

  try {
    const response = await fetch("https://api.easybroker.com/v1/properties", {
      headers: {
        "X-Authorization": process.env.EASYBROKER_API_KEY,
      },
    });

    const data = await response.json();

    if (!data.content) {
      return res.json({ mensaje: "No se encontraron propiedades." });
    }

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

    res.status(200).json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error consultando EasyBroker" });
  }
}
