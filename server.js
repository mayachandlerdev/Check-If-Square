const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://firstuser:firstuser@isitasquare-qitxw.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "IsItASquare";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  //console.log(db)
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {square: result})
  })
})

app.post('/messages', (req, res) => {
  let square = parseInt(req.body.square)
  if (square === Math.sqrt(square)*Math.sqrt(square)){
    console.log('is a square')
  }else{
  console.log('not a sqaure')
  }
  db.collection('messages').save({square: square}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/messagesDown', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.square, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp - 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
