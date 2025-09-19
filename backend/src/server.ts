import express from 'express';
import cors from 'cors';

// --- ✨ 1. Importamos todos nuestros routers modulares ✨ ---
import authRoutes from './routes/authRoutes';
import addressRoutes from './routes/addressRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import favoritesRoutes from './routes/favoritesRoutes';
import contentRoutes from './routes/contentRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import filterRoutes from './routes/filterRoutes';
import paymentRoutes from './routes/paymentRoutes';
import locationRoutes from './routes/locationRoutes';
import documentRoutes from './routes/documentRoutes';
import faqRoutes from './routes/faqRoutes';
import chatRoutes from './routes/chatRoutes';
import loggingRoutes from './routes/loggingRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import userRoutes from './routes/userRoutes';
import promotionalHubRoutes from './routes/promotionalHub.routes';
import colorRoutes from './routes/colorRoutes';
import editorialRoutes from './routes/editorialRoutes';
import batchRoutes from './routes/batchRoutes';
import featuredSaleRoutes from './routes/featuredSaleRoutes';

// --- Inicialización de la App ---
const app = express();
const port = 3001;

// --- Middlewares ---
app.use(cors());
app.use(express.json()); // Para parsear cuerpos de solicitud JSON

// --- ✨ 2. Conectamos los Routers a la App de Express ✨ ---
// Cada router se encarga de un prefijo de ruta específico.

//Rutas de productos
app.use('/api/products', productRoutes);
app.use('/api/batch', batchRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/filters', filterRoutes);
app.use('/api/promotional-hubs', promotionalHubRoutes);
app.use('/api/featured-sale', featuredSaleRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/editorials', editorialRoutes);

// Rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Rutas del carrito
app.use('/api/cart', cartRoutes);

// Rutas de pedidos
app.use('/api/orders', orderRoutes);

// Rutas de direcciones
app.use('/api/addresses', addressRoutes);

//Ruta de metodos de pago
app.use('/api/payment-methods', paymentRoutes);
app.use('/api/locations', locationRoutes);

app.use('/api/content', documentRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/logs', loggingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api', contentRoutes);

// Rutas de favoritos, que están anidadas bajo /users/:userId
// Creamos un mini-router para manejar esta anidación de forma limpia.
const userRouter = express.Router();
userRouter.use('/:userId/favorites', favoritesRoutes);
app.use('/api/users', userRouter);

// --- Iniciar el servidor ---
app.listen(port, () => {
  console.log(
    '--- SERVER.TS EJECUTÁNDOSE --- HORA:',
    new Date().toLocaleTimeString()
  );
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
  console.log(
    '✅ Arquitectura de Backend Refactorizada: Routes -> Controllers -> Services'
  );
});
