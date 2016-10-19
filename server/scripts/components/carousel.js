module.exports = function() {
  'use strict';

  console.log('Carousel.js', arguments);

  function preload(src) {
    var image = new Image();

    image.src = src;
  }

  return (function initialise() {
    return $('.carousel-item[data-src]', $('.carousel').carousel({
        interval: 5000
      })).each(function() {
        var $this = $(this),
            src = $this.attr('data-src');

        preload(src);

        $this.prepend([
          '<div style="background-image: url(', src, ')"></div>'
        ].join(''));
      });
  })();
};
