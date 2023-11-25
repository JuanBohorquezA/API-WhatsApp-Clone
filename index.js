const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const UserRoutes = require('./controllers/user')
const SendMessageRoutes = require('./controllers/sendMessage')
const conversacions = require('./controllers/conversacions')
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 7269;

app.use(cors());
//middleware
app.use(express.json());
app.use('/api',UserRoutes);
app.use('/api',SendMessageRoutes);
app.use('/api',conversacions);



//dbConnection
mongoose.connect(process.env.MONGOSEDB)
.then(()=>{console.log('Conectado a la base de datos');})
.catch((err)=>{console.log(err);});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});