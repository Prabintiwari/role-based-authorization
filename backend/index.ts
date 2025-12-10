import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes"
import productRoutes from "./routes/productRoutes"
import cartRoutes from "./routes/cartRoutes"
import fileUploadRoute from "./routes/fileUploadsRoutes"
import  responseHandler  from './middleware/responseHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({origin:"http://localhost:5173"}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts',cartRoutes)
app.use('/api/fileupload',fileUploadRoute)
app.use("/api/uploads", express.static("uploads"));

app.use(responseHandler)


app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});