if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();  
}

const express = require('express');  
const bodyParser = require('body-parser');
const routes = require('./src/routes/routes');

const PORT = +process.env.PORT;

const app = express();

app.use(bodyParser.urlencoded({ extended:  false }));
app.use(bodyParser.json());

app.use('/', routes);

app.listen(PORT, () => {  
  console.log('Server is running on port ' + PORT);
});

module.exports = app;