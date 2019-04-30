const express = require('express');  
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

const PORT = +process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended:  false }));
app.use(bodyParser.json());

app.use('/', routes);

app.listen(PORT, () => {  
  console.log('Server is running on port ' + PORT);
});