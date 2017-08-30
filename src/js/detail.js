window.jQuery = require("jquery"); // Hace jQuery accesible públicamente

import FooterManager from "../FooterManager";
const footerManager = new FooterManager(".footer",".article-detail");
footerManager.init();