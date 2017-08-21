import UIManager from './UIManager';

export default class ArticleListManager extends UIManager {

    constructor(elementSelector, articleService, pubSub) {
        super(elementSelector); // llamada al constructor de la clase UIManager
        this.articleService = articleService;
        this.pubSub = pubSub;
    }

    init() {
        this.loadArticles();
        let self = this;
        this.element.on("click", ".article", function() {
            let songId = this.dataset.id;
            self.deleteSong(songId);
        });
        this.pubSub.subscribe("new-article", (topic, song) => {
            this.loadSongs();
        });
    }

    loadArticles() {
        this.articleService.list(articles => {
            // Comprobamos si hay articulos
            if (articles.length == 0) {
                // Mostramos el estado vacío
                this.setEmpty();
            } else {
                // Componemos el HTML con todos los articulos
                this.renderArticles(articles);
                // Quitamos el mensaje de cargando y mostramos la lista de articulos
                this.setIdeal();
            }
        }, error => {
            // Mostrar el estado de error
            this.setError();
            // Hacemos log del error en la consola
            console.error("Error al cargar los articulos", error);
        });
    }

    renderArticles(articles) {
        let html = "";
        for (let article of articles) {
            html += this.renderArticle(article);
        }
        // Metemos el HTML en el div que contiene los articulos
        this.setIdealHtml(html);
    }

    renderArticle(article) {
        return `<article class="col-xs-12 col-sm-6 col-md-4 article" data-id="${article.id}">
                    <div class="article-wrapper">
                        <img src="${article.cover}" alt="${article.cover-alt}" class="article-img">
                        <div class="article-stats">
                            <div class="published-time">Published: <span class="text">${article.published_at}</span></div>
                            <div class="msg-count"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span> <span class="count">${article.comments.length}</span></div>
                            <div class="share-icon"><span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span></div>
                        </div>
                        <header class="article-title">${article.title}</header>
                        <p class="short-desc">${article.short-descrtiption}</p>
                        <div class="article-author">
                            <div class="wrapper">
                                <div class="author-img-container">
                                    <img src="${article.author-img}" alt="${article.author-name}" class="article-author-img"/>
                                </div>
                                <div class="author-text-container">
                                    <div class="label">About the author:</div>
                                    <div class="author-name">${article.author-name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>`;
    }

    deleteArticle(articleId) {
        this.setLoading();
        this.articleService.delete(articleId, success => {
            this.loadArticles();
        }, error => {
            this.setError();
        })
    }

}