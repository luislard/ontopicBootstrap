import UIManager from './UIManager';
// import * as moment from 'moment';
const $ = require("jquery");
let moment = require('moment');

export default class ArticleListManager extends UIManager {

    constructor(elementSelector, articleService, pubSub) {
        super(elementSelector); // llamada al constructor de la clase UIManager
        this.articleService = articleService;
        this.pubSub = pubSub;
    }

    init() {
        this.loadArticles();
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
        this.pubSub.subscribe("new-article", (topic, song) => {
            this.loadSongs();
        });
        this.pubSub.subscribe("update-article", (topic, article) => {
            this.loadArticles();
        });
    }

    loadArticles() {
        this.articleService.list(articles => {
            // Comprobamos si hay articulos
            if (articles.length == 0) {
                let emptyHtml = `
                            <div class="empty-container">
                                <img src="../img/no_data.png"/>
                                <p class="empty-msg">
                                    There is no articles in this moment!
                                    Please come by later...
                                </p>
                            </div>
                            `;
                this.setEmptyHtml(emptyHtml);
                // Mostramos el estado vacío
                this.setEmpty();
            } else {
                // Componemos el HTML con todos los articulos
                this.renderArticles(articles);
                
                this.renderPagination();
                
                // Quitamos el mensaje de cargando y mostramos la lista de articulos
                this.setIdeal();
            }
        }, error => {

            let errorHtml = `
                            <div class="error-container">
                                <img src="../img/oops.png"/>
                                <p class="error-msg">
                                    Oops something happened, please take a screenshot of this page and send us a message to eng.luisrosales@gmail.com
                                </p>
                            </div>
                            `;
            this.setErrorHtml(errorHtml);
            // Mostrar el estado de error
            this.setError();
            // Hacemos log del error en la consola
            console.error("Error al cargar los articulos", error);
        });
    }

    renderArticles(articles) {
        let html = `<div class="row">`;
        for (let article of articles) {
            html += this.renderArticle(article);
        }
        html += `</div>`;
        // Metemos el HTML en el div que contiene los articulos
        this.setIdealHtml(html);
    }

    renderArticle(article) {

        let likedClass = '';
        let isLiked = localStorage.getItem(article.id);
        
        if(isLiked == 'true'){
            likedClass = 'liked';
        }

        let html = '';

        html += `<article class="col-xs-12 col-sm-6 col-md-4 article" data-id="${article.id}">
                    <div class="article-wrapper">`
                    if(article.video){
        html +=         `<video  controls class="article-video">
                            <source src="../videos/${article.video}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>`;
                    }else{
        html +=         `<img src="../img/${article.cover}" alt="${article.cover_alt}" class="article-img">`;
                    }

        html +=         `<div class="article-stats">
                            <div class="published-time">Published: <span class="text">${this.writeDate(article.published_at)}</span></div>
                            <div class="stats-buttons">
                                <div class="msg-count"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span> <span class="count">${article.comments.length}</span></div>
                                <div class="fav-count ${likedClass}"><span class="glyphicon glyphicon-heart" aria-hidden="true"></span> <span class="count">${article.likes_qty}</span></div>
                                <div class="share-icon"><span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span></div>
                            </div>
                        </div>
                        <header class="article-title">${article.title}</header>
                        <p class="short-desc">${article.short_description}</p>
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

                return html;
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

    }

    renderPagination(){

        let html = `<div class="row">
                    <div class="pagination-container">
                    <nav aria-label="Page navigation">
                    <ul class="pagination">
                        <li>
                        <a href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                        </li>
                        <li><a href="#">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li><a href="#">4</a></li>
                        <li><a href="#">5</a></li>
                        <li>
                        <a href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                        </li>
                    </ul>
                    </nav>
                    </div>
                    </div>`;
        this.appendToIdealHtml(html);
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