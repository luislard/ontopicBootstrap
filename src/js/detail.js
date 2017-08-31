window.jQuery = require("jquery"); // Hace jQuery accesible públicamente
import ArticleService from "../ArticleService";
import ArticleDetailManager from "../ArticleDetailManager";
import PubSub from "pubsub-js";
import FooterManager from "../FooterManager";


const articleService = new ArticleService("/articles/");

const articleDetailManager = new ArticleDetailManager(".article-detail", articleService, PubSub);
articleDetailManager.init();

const footerManager = new FooterManager(".footer",".article-detail");
footerManager.init();