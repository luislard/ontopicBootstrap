const $ = require("jquery");

export default class ArticleService {

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
    save(article, successCallback, errorCallback) {
        if (article.id) {
            this.update(article, successCallback, errorCallback);
        } else {
            this.create(article, successCallback, errorCallback);
        }
    }

    // Crear una cancion
    create(article, successCallback, errorCallback) {
        $.ajax({
            url: this.url,
            method: "post",
            data: article,
            success: successCallback,
            error: errorCallback
        })
    }

    // Obtener el detalle de articulo
    getDetail(articleId, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${articleId}`,
            success: successCallback,
            error: errorCallback
        })
    }

    // Actualizar una articulo
    update(article, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${article.id}`,
            method: "put",
            data: article,
            success: successCallback,
            error: errorCallback
        })
    }

    // Borrar una articulo (articleService.delete(4, response => {}, error => {}))
    delete(songId, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${songId}`,
            method: 'delete', // método HTTP a utilizar
            success: successCallback,
            error: errorCallback
        })
    }

}