const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

// Browse item
app.get('/', function (req, res) {
    res.send('Hola!');
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/curso', function (req, res) {
    res.json('get Curso LOCAL!!!');
});

app.post('/curso', function (req, res) {
    let body = req.body;
    if (body.titulo === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El titulo es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }
});

app.put('/curso/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/curso', function (req, res) {
    res.json('delete curso');
});



app.listen(3000, function () {
    console.log("Escuchando puerto 3000")
});


