const mongoose = require('mongoose');
const Cart = require('../models/Cart.js');
const Equipment = require('../models/Equipment.js');  // Your existing equipment model

// Get cart for a user
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have authentication middleware

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
        totalAmount: 0,
        totalQuantity: 0
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let { productId, quantity, title, price, image } = req.body;

    console.log('Add to cart request body:', req.body);
    console.log('User ID:', userId);

    // Convert productId to a string and ensure it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId.toString())) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    productId = new mongoose.Types.ObjectId(productId);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
        totalAmount: 0,
        totalQuantity: 0
      });
    }

    // Find the equipment
    const equipment = await Equipment.findById(productId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Check if item exists in cart
    const cartItem = cart.items.find(item => 
      item.productId.toString() === productId.toString()
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        title: equipment.title,
        price: equipment.price,
        image: equipment.image,
        quantity
      });
    }

    // Update cart totals
    cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: error.message });
  }
};





// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    let { productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    productId = new mongoose.Types.ObjectId(productId);

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find(item => 
      item.productId.toString() === productId.toString()
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;

    // Update cart totals
    cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    productId = new mongoose.Types.ObjectId(productId);

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.productId.toString() !== productId.toString()
    );

    // Update cart totals
    cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalAmount = 0;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
