import UIManager from './UIManager';
// import * as moment from 'moment';
const $ = require("jquery");
let moment = require('moment');
const amountOfWordsPermittedValue = 120;

export default class CommentFormManager extends UIManager {

    constructor(elementSelector, commentService, pubSub) {
        super(elementSelector); // llamada al constructor de la clase UIManager
        this.commentService = commentService;
        this.pubSub = pubSub;
    }

    init() {
        this.loadForm(function(){});
        this.setupSubmitEventHandler();
        let self = this;
        // this.element.on("keyup", ".article", function() {
        //     let articleId = this.dataset.id;
        //     self.deleteSong(articleId);
        // });

        this.element[0].addEventListener('keyup', function (event) {

            // code to validate form
            if(self.isFormValid()){
                console.log('valid form');
            }else{
                console.log('not valid form');

            }
            self.updateWordsLeftCount($('#comment').val(),$('#word-count'), amountOfWordsPermittedValue);
            
        });

        

        this.element.find('#send')[0].addEventListener('click',function(event){
            self.element.submit();
        });
        
        
    }

    send() {
        this.setLoading();
        const comment = {
            article_id: 1,
            first_name: this.element.find('#first_name').val(),
            last_name: this.element.find('#last_name').val(),
            email: this.element.find('#email').val(),
            body: this.element.find('#comment').val()
        };
        let self = this;
        this.commentService.save(comment, success => {
            this.pubSub.publish("new-comment", comment); // publicamos el evento que informa de la creación de un comentario
            this.resetForm();
            self.updateWordsLeftCount($('#comment').val(),$('#word-count'), amountOfWordsPermittedValue);
            this.setIdeal();
        }, error => {
            this.setErrorHtml("Se ha producido un error al guardar el comentario en el servidor.");
            this.setError();
        });
    }

    resetForm() {
        this.element[0].reset(); // resetea el formulario
    }

    disableFormControls() {
        this.element.find("input, button").attr("disabled", true);
    }

    enableFormControls() {
        this.element.find("input, button").attr("disabled", false);
    }


    setupSubmitEventHandler() {
        this.element.on("submit", () => {
            this.validateAndSendData();
            // en jQuery podemos hacer un preventDefault haciendo un return false en los manejadores de evento
            return false; // == event.preventDefault();
        });
    }

    validateAndSendData() {
        if (this.isFormValid()) {
            this.send();
        }
    }

    loadForm(callback) {
        // Componemos el HTML con todos los comentarios
        this.renderForm();
        // Quitamos el mensaje de cargando y mostramos la lista de comentarios
        this.setIdeal();

        callback();
    }

    renderForm() {
        let html = `<h2>Leave a Comment</h2>
                    <div class="form-group">
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
                        <span class="error no-visibility" id="email_error">This field should not be blank and must be a valid email.</span>
                    </div>
                    <div class="form-group">
                    <div class="word-count-container">
                        <p>You have <span class="word-count" id="word-count">${amountOfWordsPermittedValue}</span> words left.</p>
                    </div>
                        <label for="comment" class="label">Write a Comment</label>
                        <textarea name="comment" id="comment"></textarea>
                        <span class="error no-visibility" id="comment_error">This field should not be blank and should contain less than ${amountOfWordsPermittedValue} words.</span>
                    </div>
                    <div class="form-group">
                        <button type="button" id="send">Send</button>
                    </div>`;
        // Metemos el HTML en el div que contiene los articulos
        this.setIdealHtml(html);
    }

    /**
     * This function counts the words of a string.
     * @param str
     * @returns {Number}
     */
    countWords(str){
        // normalize spaces
        str = str.replace(/\s+/gm," ");
        // deleting start and end spaces
        str = str.trim();
        var arr = str.split(" ");
        var count = arr.length;
        if (arr[0] === ''){
            return 0;
        }else{
            return count;
        }
    }

    /**
     * 
     * @param {string} str 
     * @param {*} element 
     * @param {integer} amountOfWordsPermitted 
     */
    updateWordsLeftCount(str,element,amountOfWordsPermitted){
        element.html(amountOfWordsPermitted - this.countWords(str));
    }

    /**
     * This function check if the amount of words permited is not exceeded
     */
    isWordCountNotExeeded(textAreaInput,amountOfWordsPermitted){
        if(this.countWords(textAreaInput.val()) <= amountOfWordsPermitted) {
            textAreaInput.removeClass('hasError');
            textAreaInput.next('.error').addClass('no-visibility');
            return true;
        }else{
            textAreaInput.addClass('hasError');
            textAreaInput.next('.error').removeClass('no-visibility');
            return false;
        }
    }

    /**
     * This functions checks if the given input has a valid email,
     * returns true when the email is valid.
     * @param JqueryInputEmail
     * @returns {boolean}
     */
    checkEmailFormat(inputEmail){
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
        if(inputEmail.val().match(mailformat)){
            return true;
        }else{
            return false;
        }
    }

    /**
     *
     * This function checks if the input or textarea is not blank,
     * returns true when is not blank.
     *
     * @param Jqueryinput|textarea
     * @returns {boolean}
     */
    isInputNotBlank(input){

        var content = input.val();
        if(content != ""){
            return true;
        }else{
            return false;
        }
    }

    addError(element){
        element.addClass('hasError');
        element.next('.error').removeClass('no-visibility');
    }

    removeError(element){
        element.removeClass('hasError');
        element.next('.error').addClass('no-visibility');
    }

    isFormValid(){
        let nameInput = $('#first_name');
        let lastNameInput = $('#last_name');
        let emailInput = $('#email');
        let commentTextarea = $('#comment');
        let errors = [];

        if(this.isInputNotBlank(nameInput)){
            this.removeError(nameInput);
            errors.push(false);
        }else{
            this.addError(nameInput);
            errors.push(true);
        }
        if(this.isInputNotBlank(lastNameInput)){
            this.removeError(lastNameInput);
            errors.push(false);
        }else{
            this.addError(lastNameInput);
            errors.push(true);
        }
        if(this.isInputNotBlank(emailInput)){
            if(this.checkEmailFormat(emailInput)){
                this.removeError(emailInput);
                errors.push(false);
            }else{
                this.addError(emailInput);
                errors.push(true);

            }
        }else{
            this.addError(emailInput);
            errors.push(true);

        }
        if(this.isInputNotBlank(commentTextarea) && this.isWordCountNotExeeded(commentTextarea,amountOfWordsPermittedValue)){
            this.removeError(commentTextarea);
            errors.push(false);
        }else{
            this.addError(commentTextarea);
            errors.push(true);

        }

        var errorCount = 0;
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] === true){
                errorCount++;
            }
        }

        if(errorCount > 0){
            return false;
        }else{
            return true;
        }
    }

}