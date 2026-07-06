// Servidor HTTP simples para desenvolvimento
// Execute: node server.js
// Acesse: http://localhost:8000

const http = require('http');
const fs = require('fs');
const path = require('path');

const url = require('url');

const PORT = 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

// Carregar variáveis de ambiente locais do .env
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length === 2) {
      const key = parts[0].trim();
      const val = parts[1].trim();
      if (key) {
        process.env[key] = val;
      }
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Interceptar chamadas de API do Vercel Serverless localmente
  if (pathname.startsWith('/api/')) {
    const handlerPath = '.' + pathname + '.js';
    if (fs.existsSync(handlerPath)) {
      try {
        // Limpar cache do require para permitir recarregamento ao alterar a API
        delete require.cache[require.resolve(handlerPath)];
        const handler = require(handlerPath);
        
        // Mock query e helpers do Vercel
        req.query = parsedUrl.query;
        res.status = (statusCode) => {
          res.statusCode = statusCode;
          return res;
        };
        res.json = (data) => {
          res.writeHead(res.statusCode || 200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        };
        
        // Processar body para requisições POST/PUT
        if (req.method === 'POST' || req.method === 'PUT') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              req.body = JSON.parse(body);
            } catch (e) {
              req.body = {};
            }
            handler(req, res);
          });
        } else {
          handler(req, res);
        }
      } catch (err) {
        console.error('Erro na execução da API local:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Internal Server Error in API mock', error: err.message }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: 'API Route Not Found' }));
    }
    return;
  }

  const urlWithoutQuery = req.url.split('?')[0];
  let filePath = '.' + urlWithoutQuery;
  
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📁 Servindo arquivos de: ${process.cwd()}`);
});



