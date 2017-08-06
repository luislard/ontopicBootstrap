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
        let cover_url = article.cover_url;
        let srcset = "";
        if (cover_url == "") {
            cover_url = "img/disk-150px.png";
            srcset = ' srcset="img/disk-150px.png 150w, img/disk-250px.png 250w, img/disk-300px.png 300w"';
        }
        return `<article class="article" data-id="${article.id}">
                <img src="${cover_url}" alt="${article.artist} - ${article.title}" class="cover"${srcset}>
                <div class="artist">${article.artist}</div>
                <div class="title">${article.title}</div>
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