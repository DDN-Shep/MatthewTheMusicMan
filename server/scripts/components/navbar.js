module.exports = (function() {
  'use strict';

  console.log('Navbar.js', arguments);

  var $mainnav, $subnav;

  function toggle(e) {
    console.log('toggle', e);

    var $this = $(this),
        $navbar = $this.parents('.navbar'),
        $item = $this.parent();

    $('.active', $navbar).removeClass('active');
    $item.addClass('active');

    if ($navbar.hasClass('main-nav')) {
      $('.active', $subnav).removeClass('active');
    }
    else {
      var $nav = $item.parents('.navbar-nav'),
          $target = $('[data-target="#' + $nav.attr('id') + '"] > .nav-link', $mainnav);

      toggle.call($target);
    }
  }

  function enter(e) {
    var $this = $(this),
        $navbar = $this.parents('.navbar');

    $('.hover', $navbar).removeClass('hover');
    $this.addClass('hover');

    if ($navbar.hasClass('main-nav')) {
      $('.active', $subnav).removeClass('active');
      $($this.data('target')).addClass('active');
    }
  }

  function leave(e) {
    $('.hover', $mainnav).removeClass('hover');
    $('.active', $subnav).removeClass('active');
  }

  (function initialise() {
    $mainnav = $('.main-nav');
    $subnav = $mainnav.siblings('.sub-nav');

    //$('.nav-link', $mainnav).click(toggle);
    //$('.nav-link', $subnav).click(toggle);
    $('.nav-item', $mainnav).mouseenter(enter);
    $subnav.mouseleave(leave);
    $(document.body).click(leave);
  })();

  return (function set(path) {
    if (path) toggle.call($('.nav-link[href="' + path + '"]', $mainnav.add($subnav)));
  });
})();
