import UIManager from './UIManager';
// import * as moment from 'moment';
const $ = require("jquery");
let moment = require('moment');

export default class CommentFormManager extends UIManager {

    constructor(elementSelector, commentService, pubSub) {
        super(elementSelector); // llamada al constructor de la clase UIManager
        this.commentService = commentService;
        this.pubSub = pubSub;
    }

    init() {
        this.loadForm();
        this.setupSubmitEventHandler();
        // let self = this;
        // this.element.on("click", ".article", function() {
        //     let articleId = this.dataset.id;
        //     self.deleteSong(articleId);
        // });
    }

    setupSubmitEventHandler(){

    };

    loadForm() {
        // Componemos el HTML con todos los comentarios
        this.renderForm();
        // Quitamos el mensaje de cargando y mostramos la lista de comentarios
        this.setIdeal();
    }

    renderForm() {
        let html = `<div class="form-group">
                        <label for="first_name" class="label">First Name</label>
                        <input type="text" name="first_name" id="first_name" placeholder="e.g. Luis">
                        <span class="error no-visibility" id="first_name_error">This field should not be blank.</span>
                    </div>
                    <div class="form-group">
                        <label for="last_name" class="label">Last Name</label>
                        <input type="text" name="last_name" id="last_name" placeholder="e.g. Rosales">
                        <span class="error no-visibility" id="last_name_error">This field should not be blank.</span>
                    
                    </div>
                    <div class="form-group">
                        <label for="email" class="label">Email</label>
                        <input type="email" name="email" id="email" placeholder="e.g. mail@somedomain.com">
                        <span class="error no-visibility" id="email_error">This field should not be blank.</span>
                    </div>
                    <div class="form-group">
                        <label for="comment" class="label">Write a Comment</label>
                        <textarea name="comment" id="comment"></textarea>
                        <span class="error no-visibility" id="comment_error">This field should not be blank.</span>
                    </div>
                    <div class="form-group">
                        <button type="button" id="send">Send</button>
                    </div>`;
        // Metemos el HTML en el div que contiene los articulos
        this.setIdealHtml(html);
    }

}