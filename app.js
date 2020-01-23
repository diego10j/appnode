const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const swig = require('swig');

//Acceso a contenido carpeta public
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

/**
 * Abre pagina index.html
 */
app.get('/', function (req, res) {
    var respuesta = swig.renderFile("vistas/index.html",
        {}
    );
    res.send(respuesta);
});

/**
 * Abre pagina curso.html para crear un nuevo Curso
 */
app.get('/nuevoCurso', function (req, res) {
    var respuesta = swig.renderFile("vistas/curso.html",
        {
            titulo: "Crear Curso"  
        }
    );
    res.send(respuesta);
});

app.get("/cursos", function (req, res) {
    // Tomar datos del modelo
    MongoClient.connect('mongodb+srv://diego:oGAjHhVk2sXthtLq@cluster0-eikjc.mongodb.net/appnode',
        function (err, db) {
            if (err) {
                var respuesta = swig.renderFile('vistas/error.html', {
                    mensaje: "Ha ocurrido un problema al conectar a la base de datos"
                });
                res.send(respuesta);
            }
            var collection = db.db("appnode").collection('Curso');
            collection.find({}).toArray(function (err, cursos) {
                var respuesta = swig.renderFile("vistas/cursos.html",
                    {
                        cursos: cursos
                    }
                );
                res.send(respuesta);
            })
        })
})
 
/**
 * Insertar Curso 
 */
app.post('/curso', function (req, res) {
    var curso = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        urlImagen: req.body.urlImagen,
        horas: req.body.horas,
        fechaCrea: new Date()
    }
    MongoClient.connect('mongodb+srv://diego:oGAjHhVk2sXthtLq@cluster0-eikjc.mongodb.net/appnode',
        function (err, db) {
            if (err) {
                var respuesta = swig.renderFile('vistas/error.html', {
                    mensaje: "Ha ocurrido un problema al conectar a la base de datos"
                });
                res.send(respuesta);
            }
            var collection = db.db("appnode").collection('Curso');
            collection.insert(curso, function (err, result) {
                if (err) {
                    var respuesta = swig.renderFile('vistas/error.html', {
                        mensaje: "Ha ocurrido un problema al guardar el Curso"
                    });
                    res.send(respuesta);
                }
                // Cerrar el cliente
                db.close();
                res.redirect("/cursos");
            });
        });
});

/**
 * Modificar Curso
 */
app.put('/curso/:id', function (req, res) {

    MongoClient.connect('mongodb+srv://diego:oGAjHhVk2sXthtLq@cluster0-eikjc.mongodb.net/appnode',
        function (err, db) {
            if (err) {
                res.send("Error al conectar");
            }
            var collection = db.db("appnode").collection('Curso');

            var id = require('mongodb').ObjectID(req.params.id);

            collection.update({ "_id": id }, { $set: { "titulo": "titulo cambiado" } }, function (err, result) {
                res.redirect("/anuncios");
            })

        })


    let id = req.params.id;
    res.json({
        id
    });
}); 

/**
 * Eliminar un curso
*/
app.get('/eliminarCurso/:id', function (req, res) {
        // Abrir el cliente 
        MongoClient.connect('mongodb+srv://diego:oGAjHhVk2sXthtLq@cluster0-eikjc.mongodb.net/appnode',
        function(err, db) {
            if (err) {
                var respuesta = swig.renderFile('vistas/error.html', {
                    mensaje: "Ha ocurrido un problema al conectar a la base de datos"
                });
                res.send(respuesta);
            }        
            var collection = db.db("appnode").collection('Curso');            
            // Transformar a Mongo ObjectID
            var id = require('mongodb').ObjectID(req.params.id);     
            collection.remove({ _id : id }, function (err, result) {
                if (err) {
                    var respuesta = swig.renderFile('vistas/error.html', {
                        mensaje : "Problema al Eliminar el Curso"
                    });
                    res.send(respuesta);
                } else {
                    res.redirect("/cursos");
                }
                db.close();
            });
          
        }); 

});



app.listen(3000, function () {
    console.log("Escuchando puerto 3000")
});


