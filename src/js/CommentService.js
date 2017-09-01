const $ = require("jquery");

export default class CommentService {

    constructor(url) {
        this.url = url;
    }

    // Obtener listado de articulos
    list(successCallback, errorCallback) {
        $.ajax({
            url: this.url,
            success: successCallback,
            error: errorCallback
        });
    }

    // Crear o actualizar articulo
    save(comment, successCallback, errorCallback) {
        if (comment.id) {
            this.update(comment, successCallback, errorCallback);
        } else {
            this.create(comment, successCallback, errorCallback);
        }
    }

    // Crear una cancion
    create(comment, successCallback, errorCallback) {
        $.ajax({
            url: this.url,
            method: "post",
            data: comment,
            success: successCallback,
            error: errorCallback
        })
    }

    // Obtener el detalle de articulo
    getDetail(commentId, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${commentId}`,
            success: successCallback,
            error: errorCallback
        })
    }

    // Actualizar una articulo
    update(comment, successCallback, errorCallback) {

        let commentData = JSON.stringify(comment);

        $.ajax({
            url: `${this.url}${comment.id}`,
            method: "put",
            data: commentData,
            contentType: "application/json",
            success: successCallback,
            error: errorCallback
        })
    }

    // Borrar una articulo (articleService.delete(4, response => {}, error => {}))
    delete(commentId, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${commentId}`,
            method: 'delete', // método HTTP a utilizar
            success: successCallback,
            error: errorCallback
        })
    }

}