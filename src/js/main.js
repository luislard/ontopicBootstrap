window.jQuery = require("jquery"); // Hace jQuery accesible públicamente

import ArticleService from "../ArticleService";
import ArticleListManager from "../ArticleListManager";
import PubSub from "pubsub-js";
import FooterManager from "../FooterManager";

const articleService = new ArticleService("/articles/");

const articleListManager = new ArticleListManager(".article-list", articleService, PubSub);
articleListManager.init();

const footerManager = new FooterManager(".footer");
footerManager.init();


