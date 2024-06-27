const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require("multer");
const ProducMain = require('./skemat/ProduktSkema');
const { v4: uuidv4 } = require('uuid');
const Reservation = require('./skemat/Rezervation')
const User = require('./skemat/User')




require('dotenv').config();
require('./auth'); 
require('./db');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "uploads/");
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
  (req, res) => {
    // Redirect to the frontend after successful login
    res.redirect('http://localhost:3000/home');
  }
);

app.get('/auth/google/success', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.get('/auth/google/logout', (req, res) => {
  req.logout((err) => {
      if (err) {
          console.error('Error logging out:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }
      req.session.destroy((err) => {
          if (err) {
              console.error('Error destroying session:', err);
              return res.status(500).json({ message: 'Internal Server Error' });
          }
          res.clearCookie('connect.sid');
          res.status(200).json({ message: 'Logout successful' });
      });
  });
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Login failed');
});

app.post('/uploadProduct', upload.single('file'), async (req, res) => {
  try {
    const { productName, price, description } = req.body;
    const file = req.file;

    const newProduct = new ProducMain({
      id: uuidv4(),
      productNameTxt: productName,
      productImg: file.filename,
      priceTxt: price,
      descriptionTxt: description,
      filename: file.filename,
      path: file.path,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    await newProduct.save();
    res.status(200).json({ message: 'Product uploaded successfully', newProduct });
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const product = await ProducMain.find({});
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    await ProducMain.findByIdAndDelete(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.post('/reserve', async (req, res) => {
  const { productId, userId } = req.body;

  try {

    const product = await ProducMain.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product is available for reservation
    if (product.priceTxt <= 0) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    // Create the reservation
    const reservation = new Reservation({
      productId,
      userId,
      reservedAt: new Date(),
    });

    await reservation.save();

    // Decrement the product quantity
    product.priceTxt -= 1;
    await product.save();

    res.status(200).json({ message: 'Product reserved successfully' });
  } catch (error) {
    console.error('Error reserving product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});






app.get('/productsPrice', async (req, res) => {
  try {
    const products = await ProducMain.find();

    if (products.length === 0) {
      return res.status(200).json({ products: [], lowestPriceProduct: null, highestPriceProduct: null });
    }

    const prices = products.map(product => parseFloat(product.priceTxt));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const lowestPriceProduct = products.find(product => parseFloat(product.priceTxt) === minPrice);
    const highestPriceProduct = products.find(product => parseFloat(product.priceTxt) === maxPrice);

    res.status(200).json({
      products,
      lowestPriceProduct,
      highestPriceProduct
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET all reservations

app.get('/reservations', async (req, res) => {
  try {

    const reservations = await Reservation.find();


      const formattedReservations = [];

      // Iterate through each reservation
      for (const reservation of reservations) {
          const userID = reservation.userId;
          const USER = await User.findOne({ googleId: userID });

          const productID = reservation.productId;
          const PRODUCT = await ProducMain.findById(productID);

          const reservationData = {
              reservedAt: reservation.reservedAt,
              userDisplayName: USER ? USER.displayName : null,
              productNameTxt: PRODUCT ? PRODUCT.productNameTxt : null
          };

          formattedReservations.push(reservationData);
      }

      // Send formatted reservations data to the frontend
      res.status(200).json(formattedReservations);
  } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});







const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
