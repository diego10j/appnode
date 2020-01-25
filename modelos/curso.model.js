
module.exports = {
    Curso : function (titulo, descripcion, urlImagen, horas  ) { 
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.urlImagen = urlImagen;
    this.horas = horas;
    this.fechaCrea = new Date();
}   
};
