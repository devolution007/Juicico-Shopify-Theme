/* override functions api.jquery.js */
Shopify.onItemAdded = function(line_item) {
  Shopify.getCart();
};

Shopify.onCartUpdate = function(cart) {
  Shopify.cartUpdateInfo(cart, '.cart-item-loop');
};

Shopify.cartUpdateInfo = function(cart, cart_cell_id) {
  var formatMoney = "";
  if ((typeof cart_cell_id) === 'string') {
    var cart_cell = jQuery(cart_cell_id);
    if (cart_cell.length) {

      cart_cell.empty();

      jQuery.each(cart, function(key, value) {

        if (key === 'items') {
      
          if (value.length) {
            jQuery(".cart-item-loop, .cart-item-title, .subtotal-title-area").css({"display": "block"});
            jQuery(".cart-empty-title").css({"display": "none"});
            
            var table = jQuery(cart_cell_id);
            jQuery.each(value, function(i, item) {
              if(i > 19){
                  return false;
              }
              jQuery('<li class="cart-item"><div class="cart-image"><a href="'+item.url+'"><img src="'+item.image+'" alt="'+ item.alt+'" width="'+item.image.width+'" height="'+item.image.height+'" class="img-fluid" loading="lazy"></a></div><div class="cart-title"><a href="' + item.url + '">' + item.title.substring(0, 50) +'</a><div class="cart-pro-info"><div class="cart-qty-price"><span class="quantity-'+item.id+'">' + item.quantity + '</span> × <span class="price-box"><span class="new-price">' + Shopify.formatMoney(item.price, "") + '</span></span></div><div class="product-quantity-action"><div class="product-quantity" data-variant="'+item.id+'"><div class="cart-plus-minus"><div class="dec qtybutton">-</div><input value="'+item.quantity+'" type="text" name="quantity" min="1" pattern="[0-9]*"><div class="inc qtybutton">+</div></div></div><div class="delete-item-cart"><a class="remove_from_cart" href="javascript:void(0);" onclick="Shopify.removeItem(' + item.variant_id + ')"><i class="feather-trash-2"></i></a></div></div></div></div></li>').appendTo(table);
            });
          }
          else {
            jQuery(".cart-item-loop, .cart-item-title, .subtotal-title-area").css({"display": "none"});
          jQuery(".cart-empty-title").css({"display": "block"});
          }
        }
      });
    }
  }
  
  //console.log(cart.total_price);
  
  jQuery(".subtotal-price").html(Shopify.formatMoney(cart.total_price, ""));
  jQuery(".bigcounter").html(cart.item_count);

  jQuery('.currency .active').trigger('click');
  ///location.reload(true);
}

//Utils
function changeHtmlValue (cell, value) {
  var $cartLinkText = jQuery(cell);
  $cartLinkText.html(value);
};