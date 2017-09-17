import UIManager from './UIManager';
// import * as moment from 'moment';
const $ = require("jquery");
let moment = require('moment');

export default class ArticleDetailManager extends UIManager {

    constructor(elementSelector, articleService, pubSub) {
        super(elementSelector); // llamada al constructor de la clase UIManager
        this.articleService = articleService;
        this.pubSub = pubSub;
    }

    init() {
        this.loadArticle(function(){});
        let self = this;
        // this.element.on("click", ".article", function() {
        //     let articleId = this.dataset.id;
        //     self.deleteSong(articleId);
        // });
        this.element.on("click", ".fav-count", function() {
            self.likeArticle(this);
             
            // self.articleService.update();
            // console.log(articleId);
        });
        this.pubSub.subscribe("update-article", (topic, article) => {
            this.loadArticle();
        });
    }

    loadArticle(callback) {
        this.articleService.getDetail(1,article => {
            // Comprobamos si hay articulos
            if (article == 0) {
                // Mostramos el estado vacío
                this.setEmpty();
            } else {
                // Componemos el HTML con todos los articulos
                this.renderArticle(article);
                // Quitamos el mensaje de cargando y mostramos la lista de articulos
                this.setIdeal();
            }
        }, error => {
            let errorHtml = "";
            errorHtml += `
                            <p>An error has ocurred</p>
                         `;
            this.setErrorHtml(errorHtml);
            
            // Mostrar el estado de error
            this.setError();
            // Hacemos log del error en la consola
            console.error("Error al cargar el articulo", error);
        });
        callback();
    }

    renderArticle(article) {

        let likedClass = '';
        let isLiked = localStorage.getItem(article.id);
        
        if(isLiked == 'true'){
            likedClass = 'liked';
        }

        let html = "";
        html += `<article class="article" data-id="${article.id}">
                    <div class="article-wrapper">
                        <div class="img-container">
                            <img src="../img/${article.cover}" alt="${article.cover_alt}" class="article-img">
                        </div>
                        <div class="article-stats">
                            <div class="published-time">Published: <span class="text">${this.writeDate(article.published_at)}</span></div>
                            <div class="stats-buttons">
                                <div class="msg-count"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span> <span class="count">${article.comments.length}</span></div>
                                <div class="fav-count ${likedClass}"><span class="glyphicon glyphicon-heart" aria-hidden="true"></span> <span class="count">${article.likes_qty}</span></div>
                                <div class="share-icon"><span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span></div>
                            </div>
                        </div>
                        <header class="article-title"><h1>${article.title}</h1></header>
                        <p class="long-desc">${article.description}</p>
                        <div class="article-author">
                            <div class="wrapper">
                                <div class="author-img-container">
                                    <img src="../img/${article.author_img}" alt="${article.author_name}" class="article-author-img"/>
                                </div>
                                <div class="author-text-container">
                                    <div class="label">About the author:</div>
                                    <div class="author-name">${article.author_name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>`;

        this.setIdealHtml(html);
    }

    deleteArticle(articleId) {
        this.setLoading();
        this.articleService.delete(articleId, success => {
            this.loadArticles();
        }, error => {
            this.setError();
        })
    }

    likeArticle(domElement){
        let articleId = $(domElement).parents('.article').data('id');
        this.articleService.getDetail(
            articleId, 
            (data) => {
                this.incrementArticleLike(data);
            },
            function(){alert('Something happened when trying to retrieve the data from article'+articleId);}
        );



            // self.articleService.getDetail(articleId, function(data){ 
            //     let newQty = parseInt(data.likes_qty) + 1;
            //     data.likes_qty = newQty;
            //     let article = data;
            //     self.articleService.update(article, function(data){self.pubSub.publish("update-article", data);alert('updated');console.log(data);},function(){alert('something hapened during the updating')});

            // }, function(){alert('Something happened when trying to retrieve the data from article'+articleId);});
    }



    incrementArticleLike(articleData){
            let newQty;
            let isLiked = false;
        if(localStorage.getItem(articleData.id) === null || localStorage.getItem(articleData.id) == 'false'){
            newQty = parseInt(articleData.likes_qty) + 1;
            isLiked = true;
        }else{
            newQty = parseInt(articleData.likes_qty) - 1;
            isLiked = false;
        }
        articleData.likes_qty = newQty;
        let article = articleData;
        this.articleService.update(
            article, 
            (data) => {
                this.updateWebStorage(data,isLiked);
                if(isLiked){
                    alert('Liked!');

                }else{
                    alert('Unliked!');

                }
                this.pubSub.publish("update-article", data);
                
                
            },
            function(){
                alert('something hapened during the updating')
            }
        );
    
    }

    updateWebStorage(article,isLiked){
        if(isLiked == true){
            localStorage[article.id] = 'true';
        }else{
            localStorage[article.id] = 'false';
        }

    }

    writeDate(dateStr){
        const date = moment(dateStr);
        const now = moment(new Date());

        let diffSec = now.diff(date, 'seconds');
        let diffMin = now.diff(date, 'minutes');
        let diffHours = now.diff(date, 'hours');
        let diffDays = now.diff(date, 'days');

        if (diffSec <= 60){
            return diffSec + ' seconds ago';

        }else if(diffMin <= 60){
            return diffMin + ' minutes ago';
        }else if(diffHours <= 24){
            return diffHours + ' hours ago';

        }else if(diffDays <= 7){
            return 'on ' + date.format('dddd');

        }else{
            return 'at ' + date.format('YYYY-MM-DD');

        }

    }

}