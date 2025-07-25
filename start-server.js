const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // Normalizar la URL y obtener la ruta del archivo
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // Comprobar si el archivo existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.statusCode = 404;
      res.end('Archivo no encontrado');
      return;
    }

    // Obtener la extensión del archivo para determinar el tipo MIME
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Leer y servir el archivo
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error interno del servidor');
        return;
      }

      // Establecer las cabeceras y enviar el contenido
      res.setHeader('Content-Type', contentType);
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
  console.log(`Abre tu navegador y ve a http://localhost:${PORT} para ver el sitio.`);
  console.log(`Presiona Ctrl+C para detener el servidor.`);
});
