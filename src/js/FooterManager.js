const $ = require("jquery");

export default class FooterManager {

    constructor(selector) {
        
        this.element = $(selector);
    }

    init(){

        // Add smooth scrolling on all links inside the navbar
        this.element.on('click', function(event) {
            // Make sure this.hash has a value before overriding default behavior
            
            // if (this.hash !== "") {
                // Prevent default anchor click behavior
                event.preventDefault();


                // Using jQuery's animate() method to add smooth page scroll
                // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                $('html, body').animate({
                    scrollTop: $('#list-container').offset().top
                }, 800, function(){
            
                    // Add hash (#) to URL when done scrolling (default click behavior)
                    window.location.hash = '#list-container';
                });
            // }  // End if
        });
    }
}