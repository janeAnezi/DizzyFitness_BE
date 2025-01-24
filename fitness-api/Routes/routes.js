const { Login, signUp } = require('../controller/User.js');
const express = require('express');
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require('../controller/cartController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();


router.post('/signup', signUp);
router.post('/login', Login);

router.use(protect);

router.get('/cart', getCart);
router.post('/cart/add', protect, addToCart); 
router.put('/cart/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
