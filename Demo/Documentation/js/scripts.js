(function($){

    "use strict";
	
    /* ---------------------------------------------------------------------------
	 * Sticky header
	 * --------------------------------------------------------------------------- */
	
    function mfn_sticky(){
		var mfn_header_height = $('#Header').innerHeight();
		var mfn_menu_height = $('#Categories').innerHeight();
		
		if( $('body').hasClass('sticky-header') ){	
			var start_y = mfn_header_height;
			var window_y = $(window).scrollTop();
	
			if( window_y > start_y ){
				if( ! ($('#Categories').hasClass('is-sticky')) ){
					$('.header_placeholder').css('margin-top', mfn_menu_height);
					$('#Categories').addClass('is-sticky');
				}
			}
			else {
				if( $('#Categories').hasClass('is-sticky') ){
					$('.header_placeholder').css('margin-top',0);
					$('#Categories').removeClass('is-sticky');
				}
			}
		}
	}

	
	/* --------------------------------------------------------------------------------------------------------------------------
	 * $(document).ready
	 * ----------------------------------------------------------------------------------------------------------------------- */
	
	$(document).ready(function(){
		
		
		/* ---------------------------------------------------------------------------
		 * Main menu
		 * --------------------------------------------------------------------------- */
		
		$("#Categories .categories_menu").muffingroup_menu({
			arrows	: true
		});	
		
		mfn_sticky();
		
		
		/* ---------------------------------------------------------------------------
		 * Anchor Fix for Sticky header + Smooth scroll
		 * --------------------------------------------------------------------------- */
		
		function active(el){
			$('#Categories .categories_menu > li').removeClass('active');
			el.closest('.categories_menu > li').addClass('active');
		}
		
		var hash = window.location.hash;
		if( hash && $(hash).length ){	
			
			var stickyH = $('.sticky-header #Top_bar').innerHeight();
			
			$('html, body').animate({ 
				scrollTop: $(hash).offset().top - stickyH - 20
			}, 500);
			
			active($('#Categories').find('a[href="'+ hash +'"]'));
		}
	
		$('#Categories .categories_menu a').click(function(){
			var url = $(this).attr('href');
			var hash = '#' + url.split('#')[1];
			
			var stickyH = $('.sticky-header #Top_bar').innerHeight();
			
			if( hash && $(hash).length ){
				$('html, body').animate({ 
					scrollTop: $(hash).offset().top - stickyH - 20
				}, 500);
			}
			
			active($(this));
		});	
		
		
		/* ---------------------------------------------------------------------------
		 * Link | Smooth Scroll | .scroll
		 * --------------------------------------------------------------------------- */
		
		$( 'a.scroll' ).click( function(e){
			
			console.log(1);
			
			// prevent default if link directs to the current page
			
			var urlL = location.href.replace(/\/#.*|#.*/, '');
			var urlT = this.href.replace(/\/#.*|#.*/, '');
			if( urlL == urlT ) e.preventDefault();
			

			var hash = this.hash;

			var tabsHeaderH = $(hash).siblings('.ui-tabs-nav').innerHeight();
			
			if( hash && $(hash).length ){
				$( 'html, body' ).animate({ 
					scrollTop: $( hash ).offset().top - 130
				}, 300);
			}
		});

		
		/* ---------------------------------------------------------------------------
		 * PrettyPhoto
		 * --------------------------------------------------------------------------- */
		
		if( $(window).width() >= 768 ){
			$('a[rel^="prettyphoto"], .prettyphoto').prettyPhoto({
				show_title		: false,
				deeplinking		: false,
				social_tools	: false,
				default_width   : 853,
				default_height  : 480
			});
		}
		
	});
	
	
	/* --------------------------------------------------------------------------------------------------------------------------
	 * $(window).scroll
	 * ----------------------------------------------------------------------------------------------------------------------- */
	
	$(window).scroll(function(){
		mfn_sticky();
	});
	
	
})(jQuery);