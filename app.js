const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const swig = require('swig');
const port = process.env.PORT || 3000;

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
app.get('/curso', function (req, res) {
    var respuesta = swig.renderFile("vistas/curso.html",
        {
            titulo: "Crear Curso"
        }
    );
    res.send(respuesta);
});


/**
 * Abre pagina estudiante.html
 */
app.get('/inscripcion', function (req, res) {
    var respuesta = swig.renderFile("vistas/estudiante.html",
        {}
    );
    res.send(respuesta);
});


/**
 * Abre pagina curso.html para crear modificar un Curso
 */
app.get('/curso/:id', function (req, res) {
    // Abrir el cliente
    MongoClient.connect('mongodb+srv://diego:oGAjHhVk2sXthtLq@cluster0-eikjc.mongodb.net/appnode',
        function (err, db) {
            if (err) {
                var respuesta = swig.renderFile('vistas/error.html', {
                    mensaje: "Ha ocurrido un problema al conectar a la base de datos"
                });
                res.send(respuesta);
            }
            var collection = db.db("appnode").collection('Curso');
            var idCurso = require('mongodb').ObjectID(req.params.id);
            collection.find({ _id: idCurso }).toArray(function (err, cursos) {
                db.close();
                var respuesta = swig.renderFile('vistas/curso.html', {
                    titulo: "Modificar Curso",
                    curso: cursos[0]
                });

                res.send(respuesta);
            });

        });
})

/**
 * Obtener el listado de cursos
 */
app.get("/cursos", function (req, res) {
    // Abrir el cliente
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
app.post('/insertarCurso', function (req, res) {
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
app.post('/modificarCurso/:id', function (req, res) {
    var curso = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        urlImagen: req.body.urlImagen,
        horas: req.body.horas,
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
            var id = require('mongodb').ObjectID(req.params.id);
            collection.update({ "_id": id }, { $set: curso }, function (err, result) {
                res.redirect("/cursos");
            })

        })

});

/**
 * Eliminar un curso
*/
app.get('/eliminarCurso/:id', function (req, res) {
    // Abrir el cliente 
    MongoClient.connect('mongodb+srv://diego:oGAjHhVk2sXthtLq@cluster0-eikjc.mongodb.net/appnode',
        function (err, db) {
            if (err) {
                var respuesta = swig.renderFile('vistas/error.html', {
                    mensaje: "Ha ocurrido un problema al conectar a la base de datos"
                });
                res.send(respuesta);
            }
            var collection = db.db("appnode").collection('Curso');
            // Transformar a Mongo ObjectID
            var id = require('mongodb').ObjectID(req.params.id);
            collection.remove({ _id: id }, function (err, result) {
                if (err) {
                    var respuesta = swig.renderFile('vistas/error.html', {
                        mensaje: "Problema al Eliminar el Curso"
                    });
                    res.send(respuesta);
                } else {
                    res.redirect("/cursos");
                }
                db.close();
            });

        });

});


/**
 * Insertar Estudiante 
 */
app.post('/insertarEstudiante', function (req, res) {
    var estudiante = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        fechaNacimiento: req.body.fechaNacimiento,
        telefono: req.body.telefono,
        pais: req.body.pais,
        provinicia: req.body.provinicia,
        direccion: req.body.direccion,
        avatar: req.body.avatar,
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
            var collection = db.db("appnode").collection('Estudiante');
            collection.insert(estudiante, function (err, result) {
                if (err) {
                    var respuesta = swig.renderFile('vistas/error.html', {
                        mensaje: "Ha ocurrido un problema al guardar el Estudiante"
                    });
                    res.send(respuesta);
                }
                // Cerrar el cliente
                db.close();
                res.redirect("/estudiantes");
            });
        });
});

/**
 * Obtener el listado de estudiantes
 */
app.get("/estudiantes", function (req, res) {
    // Abrir el cliente
    MongoClient.connect('mongodb+srv://diego:oGAjHhVk2sXthtLq@cluster0-eikjc.mongodb.net/appnode',
        function (err, db) {
            if (err) {
                var respuesta = swig.renderFile('vistas/error.html', {
                    mensaje: "Ha ocurrido un problema al conectar a la base de datos"
                });
                res.send(respuesta);
            }
            var collection = db.db("appnode").collection('Estudiante');
            collection.find({}).toArray(function (err, estudiantes) {
                var respuesta = swig.renderFile("vistas/estudiantes.html",
                    {
                        estudiantes: estudiantes
                    }
                );
                res.send(respuesta);
            })
        })
})


app.listen(port, function () {
    console.log(`Escuchando peticiones en el puerto ${port}`);
});


