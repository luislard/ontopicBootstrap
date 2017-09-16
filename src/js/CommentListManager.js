import UIManager from './UIManager';
// import * as moment from 'moment';
const $ = require("jquery");
let moment = require('moment');

export default class CommentListManager extends UIManager {

    constructor(elementSelector, commentService, pubSub) {
        super(elementSelector); // llamada al constructor de la clase UIManager
        this.commentService = commentService;
        this.pubSub = pubSub;
    }

    init() {
        this.loadComments(function(){
            setTimeout(function(){
                let currentUrl = $(location).attr("href");
                let currentTarget = currentUrl.split('#',2)[1];
                $('html, body').animate({
                        scrollTop: $('#'+currentTarget).offset().top + 'px'
                    }, 1000, function(){ });
                },1000
            );
            
        });
        let self = this;
        // this.element.on("click", ".article", function() {
        //     let articleId = this.dataset.id;
        //     self.deleteSong(articleId);
        // });
        this.pubSub.subscribe("new-comment", (topic, comment) => {
            this.loadComments();
        });
        
    }

    loadComments(callback) {
        this.commentService.list(comments => {
            // Comprobamos si hay comentarios
            if (comments.length == 0) {
                // Mostramos el estado vacío
                this.setEmpty();
            } else {
                // Componemos el HTML con todos los comentarios
                this.renderComments(comments);
                // Quitamos el mensaje de cargando y mostramos la lista de comentarios
                this.setIdeal();
            }
            

        }, error => {
            // Mostrar el estado de error
            this.setError();
            // Hacemos log del error en la consola
            console.error("Error al cargar los comentarios", error);
        });
        callback();
    }

    renderComments(comments) {
        let html = `<h4 class="comment-title">Comments</h4>
                        <ul class="collection">`;
        for (let comment of comments) {
            html += this.renderComment(comment);
        }
        html += "</ul>";
        // Metemos el HTML en el div que contiene los articulos
        this.setIdealHtml(html);
        
    }

    renderComment(comment) {

        return `<li class="collection-item" data-id="${comment.id}">
                    <div class="collection-content">
                        <span class="title">${comment.first_name} ${comment.last_name}</span>
                        <p>${comment.body}</p>
                    </div>
                </li>`;
    }

    deleteComment(commentId) {
        this.setLoading();
        this.commentService.delete(commentId, success => {
            this.loadComments();
        }, error => {
            this.setError();
        })
    }

}