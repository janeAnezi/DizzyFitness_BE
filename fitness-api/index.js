require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fitness = require('./gymData.json');
const mongoose = require('mongoose')
const routes = require('./Routes/routes.js')
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express()
// middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({limit:"50mb"}))
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/fitness', (req, res) => {
  // Check if category query exists
  const category = req.query.category;
  let filteredFitness = fitness;
  
  // If category is provided, filter the data
  if (category) {
    filteredFitness = fitness.filter(item => item.category === category);
  }

  res.send(filteredFitness);
});


app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});



mongoose
.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, 
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
 })
  .then(()=>{console.log('DB Connected')})
  .catch((error)=>{console.log(error)})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})