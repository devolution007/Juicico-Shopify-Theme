addEventListener('DOMContentLoaded', (event) => {
;(function (Wishlist, $) {

  var $wishlistButton = $('.wishlist-btn');
  var $wishlistTile = $('.wishlist-tile-container');
  var $wishlitcounter = $('.wishlist-counter');
  var numProductTiles = $wishlistTile.length;
  var wishlist = localStorage.getItem('user_wishlist') || [];
  var wishlist_count_set = localStorage.getItem('user_wishlist_count');
  if(wishlist_count_set == null){
    var wishlist_count = '0';
    $wishlitcounter.html(wishlist_count);
  }else{
    $wishlitcounter.html(wishlist_count_set);
  }
  if (wishlist.length > 0) {
    wishlist = JSON.parse(localStorage.getItem('user_wishlist'));
  }

  /*
   * Update button to show current state (gold for active)
   */   
  var animateWishlist = function (self) {
    $(self).toggleClass('is-active');
  };

  /*
   * Add/Remove selected item to the user's wishlist array in localStorage
   * Wishlist button class 'is-active' determines whether or not to add or remove
   * If 'is-active', remove the item, otherwise add it
   */   
  var updateWishlist = function (self) {
    var productHandle = $(self).attr('data-product-handle');
    var isRemove = $(self).hasClass('is-active');
    var wishlist_value = localStorage.getItem('user_wishlist_count');
    /* Remove */
    if (isRemove) {
      var removeIndex = wishlist.indexOf(productHandle);
      wishlist.splice(removeIndex, 1);
      var wishlist_count = localStorage.getItem('user_wishlist_count');
      //alert(wishlist_count);
      if(wishlist_count != null){
        var minus_val = -1;
        var wish_ct = Math.max(parseInt(wishlist_count) + minus_val, 0);
        ///alert(wish_ct);
        localStorage.setItem('user_wishlist_count', wish_ct);
      }
      localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
      var icon_length = $(self).find("span").length;

      if(icon_length != 0){
        $wishlistButton.html('<span class="add-wishlist"><i class="ri-heart-line"></i></span><span class="loading-wishlist load-anim"><i class="ri-loader-4-line"></i></span><span class="remove-wishlist"><i class="ri-heart-fill"></i></span>');
      }
      var wishlist_count_value = localStorage.getItem('user_wishlist_count');
      $wishlitcounter.html(wishlist_count_value);
    }
    /* Add */ 
    else {
      wishlist.push(productHandle);
      var wishlist_count = localStorage.getItem('user_wishlist_count');
      if(wishlist_count == null){
        var plus_val = 1;
        var wish_ct = plus_val;
      }else{
        var plus_val = 1;
        var wish_ct = Math.max(parseInt(wishlist_count) + plus_val, 0);;
      }
      localStorage.setItem('user_wishlist_count',wish_ct);
      localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
      var icon_length = $(self).find("span").length;
      ///alert(icon_length);
      if(icon_length != 0){
        $wishlistButton.html('<span class="add-wishlist"><i class="ri-heart-line"></i></span><span class="loading-wishlist load-anim"><i class="ri-loader-4-line"></i></span><span class="remove-wishlist"><i class="ri-heart-fill"></i></span>');
      }
      var wishlist_count_value = localStorage.getItem('user_wishlist_count');
      //alert(wishlist_count_value)
      $wishlitcounter.html(wishlist_count_value);
    }
    //console.log(JSON.stringify(wishlist));
  };

  /*
   * Loop through wishlist buttons and activate any items that are already in user's wishlist
   * Activate by adding class 'is-active'
   * Run on initialization
   */   
//   var activateItemsInWishlist = function () {
//     $wishlistButton.each(function () {
//       var productHandle = $(this).attr('data-product-handle');
//       if (wishlist.indexOf(productHandle) > -1) {
//         $(this).addClass('is-active');
//       }
//     });
//   };

  /*
   * Loop through product titles and remove any that aren't a part of the wishlist
   * Decrement numProductTiles on removal
   */   
  var activateItemsInWishlist = function () {
    $wishlistButton.each(function () {
      var productHandle = $(this).attr('data-product-handle');
      if (wishlist.indexOf(productHandle) > -1) {
        $(this).addClass('is-active');
        var icon_length = $(this).find("span").length;
        if($(this).hasClass('is-active')){
          if(icon_length != 0){
            $(this).html('<span class="add-wishlist"><i class="ri-heart-line"></i></span><span class="loading-wishlist load-anim"><i class="ri-loader-4-line"></i></span><span class="remove-wishlist"><i class="ri-heart-fill"></i></span>');
          }
        }else{
          if(icon_length != 0){
            $(this).html('<span class="add-wishlist"><i class="ri-heart-line"></i></span><span class="loading-wishlist load-anim"><i class="ri-loader-4-line"></i></span><span class="remove-wishlist"><i class="ri-heart-fill"></i></span>');
          }
        }

      }
    });
  };
  var displayOnlyWishlistItems = function () {
    $wishlistTile.each(function () {
      var productHandle = $(this).attr('data-product-handle');
      if (wishlist.indexOf(productHandle) === -1) {
        $(this).remove();
        numProductTiles--;
      }
    });
  };

  /*
   * Check if on the wishlist page and hide any items that aren't a part of the wishlist
   * If no wishlist items exist, show the empty wishlist notice
   */   
  var loadWishlist = function () {
    if (window.location.href.indexOf('pages/wishlist') > -1) {
      displayOnlyWishlistItems();
      $('.wishlist-loader').fadeOut(2000, function () {
        $('.wishlist-grid').addClass('is_visible');
        $('.wishlist-hero').addClass('is_visible');
        if (numProductTiles == 0) {
          $('.wishlist-grid-empty-list').addClass('is_visible');
          $('.wishlist-grid').hide();
        } else {
          $('.wishlist-grid-empty-list').hide();
        }
      });
    }
  };

  var bindUIActions = function () {
    $wishlistButton.click(function (e) {
      e.preventDefault();
      updateWishlist(this);
      animateWishlist(this);
    });
  };

  Wishlist.init = function () {
    bindUIActions();
    activateItemsInWishlist();
    loadWishlist();
  };
  
  // Remove All Items..
  $("#remove-done").click(function(){

    var raw = localStorage.getItem('user_wishlist');
    var length = raw.length;
    var i;
  var productHandle = $(self).attr('data-product-handle');
    var isRemove = $(self).hasClass('is-active');

    /* Remove */
    for (i=length-1; i>= 0; i--){
      var removeIndex = wishlist.indexOf(productHandle);
      wishlist.splice(removeIndex, 1);
      var wishlist_count = localStorage.getItem('user_wishlist_count');
      //alert(wishlist_count);
      if(wishlist_count != null){
        var wish_ct = Math.max(parseInt(0), 0);
        localStorage.setItem('user_wishlist_count', wish_ct);
      }
      localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
    }
    location.reload(true);

  });


}(window.Wishlist = window.Wishlist || {}, jQuery, undefined));

function reloadPage(){
  location.reload(true);
}
});
