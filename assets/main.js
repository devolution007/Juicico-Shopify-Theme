$(window).on('load', function() {
  "use strict";
  $('.megamenu-li').parent('.container').parent('ul').addClass('mega-menu');
  $('.banner-wrap').parent('.container').parent('ul').addClass('bottom-banner');
  $('.menu-banner').parent('.container').parent('ul').addClass('banner-menu');
  $('.submenu-li').parent('.container').parent('ul').addClass('sub-menu');

  $('.submenu-li').parent('ul').addClass('sub-menu');
  $('.megamenu-li').parent('ul').addClass('mega-menu');
  $('.bannermenu-li').parent('ul').addClass('banner-menu');

  $('.slow-window').fadeOut('slow');

  var popup = localStorage.getItem('popup_value'); 
  if(popup != 1){
    $('#news-letter-modal').modal('show');
  }

  $('#popup-close').on('click',function(){
      localStorage.setItem('popup_value', '1');
  });
  $("button.navbar-toggle").on('click', function() {
    $(".main-menu-area").addClass("active");
    $(".mm-fullscreen-bg").addClass("active");
    $("body").addClass("hidden");
  });

  $(".close-box").on('click', function() {
    $(".main-menu-area").removeClass("active");
    $(".mm-fullscreen-bg").removeClass("active");
    $("body").removeClass("hidden");
  });

  $(".shopping-cart a.cart-count").on('click', function() {
    $(".mini-cart").addClass("show");
    $(".mm-fullscreen-bg").addClass("active");
  });

  $(".shopping-cart-close i").on('click', function() {
    $(".mini-cart").removeClass("show");
    $(".mm-fullscreen-bg").removeClass("active");
     $("body").removeClass("hidden");
  });

   $(".ajax-spin-cart").on('click', function() {
    window.setTimeout(function() {
      $(".mini-cart").addClass("show");
      $(".mm-fullscreen-bg").addClass("active");
      $("body").addClass("hidden");
    }, 1000);
  });

  // filter button js
  $("button.filter-button").on('click', function() {
    $(".filter-sidebar").addClass("active");
    $(".mm-fullscreen-bg").addClass("active");
  });

  $("button.close-filter-sidebar").on('click', function() {
    $(".filter-sidebar").removeClass("active");
    $(".mm-fullscreen-bg").removeClass("active");
  });

  $(".mm-fullscreen-bg").on('click', function() {
    $(".mini-cart").removeClass("show");
    $(".main-menu-area").removeClass("active");
    $(".mm-fullscreen-bg").removeClass("active");
    $(".filter-sidebar").removeClass("active");
    $("body").removeClass("hidden");
  });

  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });

  $('.play-button, .popup-vimeo, .popup-gmaps').magnificPopup({
    tClose: 'Close (Esc)',
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

      
  $('#top').on('click', function() {
    $("html, body").animate({ scrollTop: 0 }, 0);
    return false;
    });
  });

$(window).scroll(function(){
  if ($(this).scrollTop() > 1000) {
    $('#top').fadeIn();
  } else {
    $('#top').fadeOut();
  }

  var sticky = $('.header-bottom-wrap'),
  scroll = $(window).scrollTop();
  if (scroll >= 150) {
    sticky.addClass('is-sticky');
  }
  else {
    sticky.removeClass('is-sticky');
  }

  $('label.box-area').on('click', function () {
    if($('.cust-checkbox').is(':checked')) {
      $('.agree').removeClass('disabled');
    }
    else {
      $('.agree').addClass('disabled');
    }
  });
  
});