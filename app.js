import express from 'express';
import tagsRoutes from './routes/tags.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

app.use('/tags', tagsRoutes);
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
