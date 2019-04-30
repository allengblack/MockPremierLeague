const express = require('express');  
const bodyParser = require('body-parser');
const db = require('./models')

const app = express();

app.use(bodyParser.json());

app.get('/api/users', (req, res) => {  
  // TODO: retreive contacts and send to requester
  return db.User.findAll()
    .then((users) => res.send(users))
    .catch((err) => {
      console.log('There was an error querying users', JSON.stringify(err))
      return res.send(err)
    });
});

app.post('/api/users', (req, res) => {  
  const { name, email } = req.body;
  return db.User.create({ name, email })
    .then((user) => res.send(user))
    .catch((err) => {
      console.log('There was an error creating a user', JSON.stringify(user))
      return res.status(400).send(err)
    })
});

app.delete('/api/users/:id', (req, res) => {  
    const id = parseInt(req.params.id)
    return db.User.findByPk(id)
      .then((user) => user.destroy())
      .then(() => res.send({ id }))
      .catch((err) => {
        console.log('***Error deleting user', JSON.stringify(err))
        res.status(400).send(err)
      })
  });

app.put('/api/users/:id', (req, res) => {  
    const id = parseInt(req.params.id)
    return db.User.findByPk(id)
    .then((user) => {
      const { name, email } = req.body
      return user.update({ name, email })
        .then(() => res.send(user))
        .catch((err) => {
          console.log('***Error updating User', JSON.stringify(err))
          res.status(400).send(err)
        })
    })
  });

app.listen(3000, () => {  
  console.log('Server is up on port 3000');
});