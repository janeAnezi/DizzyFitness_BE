// const mongoose = require('mongoose');
// const User = require('./Equipment')

// const CartItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',  // Assuming your gym equipment model is named 'Equipment'
//     required: true
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   image: {
//     type: String,
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1
//   }
// });

// const CartSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true
//   },
//   items: [CartItemSchema],
//   totalAmount: {
//     type: Number,
//     default: 0
//   },
//   totalQuantity: {
//     type: Number,
//     default: 0
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Cart', CartSchema);
