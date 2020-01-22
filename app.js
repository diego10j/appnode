const express = require('express');
const app = express();
var Curso = require('./modelos/curso.model');

var MongoClient = require('mongodb').MongoClient;


// Browse item
app.get('/', function(req, res){
    res.send('Hola!');
});


app.listen(3000, function() { 
    console.log("Escuchando puerto 3000")
} );


