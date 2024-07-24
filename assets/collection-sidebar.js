    function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
    function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
   function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
   function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }
function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }
   function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);
  
    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));

    const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
    if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    }
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    const countContainer = document.getElementById('ProductCount');
    const countContainerDesktop = document.getElementById('ProductCountDesktop');
    document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');

    if (countContainer){
      countContainer.classList.add('loading');
    }
    if (countContainerDesktop){
      countContainerDesktop.classList.add('loading');
    }

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;

      FacetFiltersForm.filterData.some(filterDataUrl) ?
        FacetFiltersForm.renderSectionFromCache(filterDataUrl, event) :
        FacetFiltersForm.renderSectionFromFetch(url, event);
    });

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html);
        FacetFiltersForm.renderProductCount(html);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderProductCount(html);
  }

  static renderProductGridContainer(html) {
    document.getElementById('ProductGridContainer').innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductGridContainer').innerHTML;
    SPR.registerCallbacks();
    SPR.initRatingHandler();
    SPR.initDomEls();
    SPR.loadProducts();
    SPR.loadBadges();
    $(document).ready(function() {
      $('.ajax-spin-cart').on('click', function() {
        $(this).addClass('loading add-item');
        setTimeout(function () {
          $('.ajax-spin-cart').removeClass('loading');
        },1000);
        setTimeout(function () {
          $('.ajax-spin-cart').removeClass("add-item");
        },2000);
      });
      $(".ajax-spin-cart").click(function(){
        window.setTimeout(function() {
        $(".mini-cart").addClass("show");
        $(".mm-fullscreen-bg").addClass("active");
        $("body").addClass("hidden");
        }, 1000);
      });
      
      // wishlist js
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
          if(wishlist_count != null){
            var minus_val = -1;
            var wish_ct = Math.max(parseInt(wishlist_count) + minus_val, 0);
            localStorage.setItem('user_wishlist_count', wish_ct);
          }
          localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
          var icon_length = $(self).find("span").length;

          if(icon_length != 0 && attr != 'product'){
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
          if(icon_length != 0 && attr != 'product'){
            $wishlistButton.html('<span class="add-wishlist"><i class="ri-heart-line"></i></span><span class="loading-wishlist load-anim"><i class="ri-loader-4-line"></i></span><span class="remove-wishlist"><i class="ri-heart-fill"></i></span>');
          }
          var wishlist_count_value = localStorage.getItem('user_wishlist_count');
          $wishlitcounter.html(wishlist_count_value);
        }
      };

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
              if(icon_length != 0 && attr != 'product'){
                $(this).html('<span class="add-wishlist"><i class="ri-heart-line"></i></span><span class="loading-wishlist load-anim"><i class="ri-loader-4-line"></i></span><span class="remove-wishlist"><i class="ri-heart-fill"></i></span>');
              }
            }else{
              if(icon_length != 0 && attr != 'product'){
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
      $("#remove-done").click(function() {
        var raw = localStorage.getItem('user_wishlist');
        var length = raw.length;
        var i;
        var productHandle = $(self).attr('data-product-handle');
        var isRemove = $(self).hasClass('is-active');

        /* Remove */
        for (i=length-1; i>= 0; i--) {
          var removeIndex = wishlist.indexOf(productHandle);
          wishlist.splice(removeIndex, 1);
          var wishlist_count = localStorage.getItem('user_wishlist_count');
          if(wishlist_count != null) {
            var wish_ct = Math.max(parseInt(0), 0);
            localStorage.setItem('user_wishlist_count', wish_ct);
          }
          localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
        }
      });

      // wishlist ajax-spin-cart js
      $(".action-wishlist").on('click', function() {
        $(this).addClass("loading-wishlist adding-wishlist");
        setTimeout(function () {
          $(".action-wishlist").removeClass("loading-wishlist load-anim");
        },1000);
        setTimeout(function () {
          $(".adding-wishlist").removeClass("adding-wishlist");
        },2000);
      });
      (function() {
        Wishlist.init();
      }());

      $('[data-bs-toggle="tooltip"]').tooltip();
    });
  }

  static renderProductCount(html) {
    const count = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCount').innerHTML
    const container = document.getElementById('ProductCount');
    const containerDesktop = document.getElementById('ProductCountDesktop');
    container.innerHTML = count;
    container.classList.remove('loading');
    if (containerDesktop) {
      containerDesktop.innerHTML = count;
      containerDesktop.classList.remove('loading');
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements =
      parsedHTML.querySelectorAll('#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter');
    const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest('.js-filter') : undefined;
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
    }
    const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);

    if (countsToRender) FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
    })

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderAdditionalElements(html) {
    const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];

    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return;
      document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
    });

  }

  static renderCounts(source, target) {
    const targetElement = target.querySelector('.facets__selected');
    const sourceElement = source.querySelector('.facets__selected');

    if (sourceElement && targetElement) {
      target.querySelector('.facets__selected').outerHTML = source.querySelector('.facets__selected').outerHTML;
    }
  }

  static updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  static getSections() {
    return [
      {
        section: document.getElementById('product-grid').dataset.id,
      }
    ]
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target.closest('form'));
    const searchParams = new URLSearchParams(formData).toString();
    FacetFiltersForm.renderPage(searchParams, event);
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    const url = event.currentTarget.href.indexOf('?') == -1 ? '' : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    FacetFiltersForm.renderPage(url);
  }
}


FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

var PriceRange = /*#__PURE__*/function (_HTMLElement) {
    _inherits(PriceRange, _HTMLElement);

    var _super = _createSuper(PriceRange);

    function PriceRange() {
      _classCallCheck(this, PriceRange);

      return _super.apply(this, arguments);
    }

    _createClass(PriceRange, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this = this;

        this.rangeLowerBound = this.querySelector('.price-range-group input:first-child');
        this.rangeHigherBound = this.querySelector('.price-range-group input:last-child');
        this.textInputLowerBound = this.querySelector('.price-range-input:first-child input');
        this.textInputHigherBound = this.querySelector('.price-range-input:last-child input'); // Select whole text on focus for text field to improve user experience

        this.textInputLowerBound.addEventListener('focus', function () {
          return _this.textInputLowerBound.select();
        });
        this.textInputHigherBound.addEventListener('focus', function () {
          return _this.textInputHigherBound.select();
        }); // Keep in sync the range with the text input fields

        this.textInputLowerBound.addEventListener('change', function (event) {
          event.target.value = Math.max(Math.min(parseInt(event.target.value), parseInt(_this.textInputHigherBound.value || event.target.max) - 1), event.target.min);
          _this.rangeLowerBound.value = event.target.value;

          _this.rangeLowerBound.parentElement.style.setProperty('--range-min', "".concat(parseInt(_this.rangeLowerBound.value) / parseInt(_this.rangeLowerBound.max) * 100, "%"));
        });
        this.textInputHigherBound.addEventListener('change', function (event) {
          event.target.value = Math.min(Math.max(parseInt(event.target.value), parseInt(_this.textInputLowerBound.value || event.target.min) + 1), event.target.max);
          _this.rangeHigherBound.value = event.target.value;

          _this.rangeHigherBound.parentElement.style.setProperty('--range-max', "".concat(parseInt(_this.rangeHigherBound.value) / parseInt(_this.rangeHigherBound.max) * 100, "%"));
        });
        this.rangeLowerBound.addEventListener('change', function (event) {
          _this.textInputLowerBound.value = event.target.value;

          _this.textInputLowerBound.dispatchEvent(new Event('change', {
            bubbles: true
          }));
        });
        this.rangeHigherBound.addEventListener('change', function (event) {
          _this.textInputHigherBound.value = event.target.value;

          _this.textInputHigherBound.dispatchEvent(new Event('change', {
            bubbles: true
          }));
        }); // We also have to bound the two range sliders

        this.rangeLowerBound.addEventListener('input', function (event) {
          _this.dispatchEvent(new CustomEvent('collection:abort-loading', {
            bubbles: true
          }));

          event.target.value = Math.min(parseInt(event.target.value), parseInt(_this.textInputHigherBound.value || event.target.max) - 1); // Bound the value

          event.target.parentElement.style.setProperty('--range-min', "".concat(parseInt(event.target.value) / parseInt(event.target.max) * 100, "%"));
          _this.textInputLowerBound.value = event.target.value;
        });
        this.rangeHigherBound.addEventListener('input', function (event) {
          _this.dispatchEvent(new CustomEvent('collection:abort-loading', {
            bubbles: true
          }));

          event.target.value = Math.max(parseInt(event.target.value), parseInt(_this.textInputLowerBound.value || event.target.min) + 1); // Bound the value

          event.target.parentElement.style.setProperty('--range-max', "".concat(parseInt(event.target.value) / parseInt(event.target.max) * 100, "%"));
          _this.textInputHigherBound.value = event.target.value;
        });
      }
    }]);

    return PriceRange;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
  window.customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault();
      const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
      form.onActiveFilterClick(event);
    });
  }
}

customElements.define('facet-remove', FacetRemove);
