const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const URL_HTML = 'https://www.interior.gob.es/opencms/es/prensa/nivel-alerta-terrorista/';
const BASE_IMG = 'https://www.interior.gob.es/opencms/pdf/prensa/nivel-de-alerta-antiterrorista/';

app.get('/nivel-alerta', async (req, res) => {
  try {
    const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

const response = await axios.get(URL_HTML, { httpsAgent: agent });

    const html = response.data;

    const regex = /Nivel-(\d)-NAA\.png/gi;
    const matches = [...html.matchAll(regex)];

    if (matches.length === 0) {
      return res.status(404).json({
        error: true,
        mensaje: 'No se encontró ninguna imagen con el nivel en el HTML.'
      });
    }

    const ultimo = matches[matches.length - 1];
    const nivel = parseInt(ultimo[1]);
    const nombreArchivo = ultimo[0];
    const urlImagen = BASE_IMG + nombreArchivo;

    res.json({
      error: false,
      mensaje: 'Nivel de alerta detectado correctamente.',
      nivel,
      nombreArchivo,
      url: urlImagen
    });

  } catch (err) {
    res.status(500).json({
      error: true,
      mensaje: 'Error accediendo a la web del Ministerio.',
      detalle: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Microservicio activo en http://localhost:${PORT}`);
});
