// backend/src/app.ts
// Este archivo es el punto de entrada del backend. Configuramos el servidor Express, 
// los middlewares, cargamos las rutas y servimos la build estática del frontend.
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import sportRoutes from "../routes/sport.routes";
import eventRoutes from '../routes/event.routes';
import usuarioRoutes from '../routes/usuario.routes';
import equipoRoutes from '../routes/equipo.routes';
import inscripcionRoutes from '../routes/inscripcion.routes';

import pool from '../database/database';
import jwt from 'jsonwebtoken';

// Extender la interfaz Request para incluir la propiedad user
declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

const app = express();

// Habilitar CORS
app.use(cors());

// Middleware para parsear JSON y datos de formularios
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }))

// Rutas API (se montan con el prefijo /api)
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Servir estáticamente las fotos de jugadores:
//   – carpeta física: <proyecto>/assets/images/players/
//   – URL pública:   /players/<nombre-fichero>
app.use(
    '/players',
    express.static(
      path.join(__dirname, '..', 'assets', 'images', 'players'),
      { fallthrough: false }
    )
  );

  app.use(
    '/sports',
    express.static(
      path.join(__dirname, '..', 'assets', 'images', 'sports'),
      { fallthrough: false }
    )
  );


app.use('/api', sportRoutes);
app.use('/api', equipoRoutes);
app.use('/api', inscripcionRoutes);
app.use('/api/events', eventRoutes);
app.use("/api/", usuarioRoutes);

// SERVIR EL FRONTEND
// Suponiendo que la build web de tu app se encuentra en la carpeta 'web-build' en la raíz del proyecto.
// Dado que tu carpeta backend está dentro de la del frontend, la ruta se ajusta:
const staticPath = path.join(__dirname, "..", 'dist');

app.use(express.static(staticPath));

// Ruta catch-all: cualquier petición que no coincida con las rutas anteriores se servirá el index.html.
// Esto permite que el enrutado del lado del cliente (React Router, etc.) funcione correctamente.
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});



// Middleware para manejo de errores (si ocurre algún error en alguna ruta o middleware)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error caught in middleware:", err);
  res.status(500).json({
    message: 'Something broke!',
    error: err.message, // (for debugging only, remove in production)
  });
});

// Función para verificar la conexión a la base de datos
async function verifyDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos exitosa');
    connection.release();
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err);
    // Puedes detener el servidor en caso de error crítico si lo deseas:
    // process.exit(1);
  }
}

// Configuramos el puerto (por defecto 3000)
const PORT = process.env.PORT || 3000;

verifyDBConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
