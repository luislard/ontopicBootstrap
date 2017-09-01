window.jQuery = require("jquery"); // Hace jQuery accesible públicamente
import ArticleService from "../ArticleService";
import CommentService from "../CommentService";
import ArticleDetailManager from "../ArticleDetailManager";
import CommentListManager from "../CommentListManager";
import PubSub from "pubsub-js";
import FooterManager from "../FooterManager";


const articleService = new ArticleService("/articles/");
const commentService = new CommentService("/comments/");

const articleDetailManager = new ArticleDetailManager(".article-detail", articleService, PubSub);
articleDetailManager.init();

const commentListManager = new CommentListManager(".comments", commentService, PubSub);
commentListManager.init();

const footerManager = new FooterManager(".footer",".article-detail");
footerManager.init();