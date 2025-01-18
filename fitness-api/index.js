require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fitness = require('./gymData.json');
const mongoose = require('mongoose')
const routes = require('./Routes/routes.js')
const port = process.env.PORT || 5000;

const app = express()
// middleware
app.use(cors())
app.use(express.urlencoded({limit:"50mb"}))
app.use(bodyParser.json())
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




mongoose
.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>{console.log('DB Connected')})
  .catch((error)=>{console.log(error)})

  app.use('/api', routes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})