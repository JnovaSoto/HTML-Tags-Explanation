// Importar dependencias principales
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import tagsRoutes from './routes/tags.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Crear aplicación Express
const app = express();
const PORT = 3000;

// Necesario para obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware de Express
app.use(express.json()); // Permite manejar JSON en las peticiones
app.use('/tags', tagsRoutes); // Rutas personalizadas en /tags
app.use(express.static(path.join(__dirname, 'public'))); // Archivos estáticos

// Configuración del motor de vistas EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get(['/', '/home'], (req, res) => {
  res.render('home', { layout: 'layout', title: 'Home'});
});

app.get('/create', (req, res) => {
  res.render('create', { layout: 'layout', title: 'Create' });
});


// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
