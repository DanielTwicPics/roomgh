(function( $ ){

	var defaults = {
		stream: 'img',
		onLoad : function() {}
	}

	var methods = {

		init : function( options ) {

			if(window[plugin] === undefined) {
				window[plugin] = new Array();
			}

			var pi = window[plugin].length;

			window[plugin].push(pi);

			window[plugin][pi] = $.extend({}, defaults, options);
			window[plugin][pi].element = $(this);

			window[plugin][pi].element.each(function() {

				window[plugin][pi].width = window[plugin][pi].element.outerWidth(true);
				window[plugin][pi].height = window[plugin][pi].element.outerHeight(true);

			});

			$(window).resize(function() { methods.resize(pi); });

			methods.construct(pi);

		},
		construct : function(pi) {

			window[plugin][pi].images = [];
			window[plugin][pi].rap = new Array();
			window[plugin][pi].streams = window[plugin][pi].element.find(window[plugin][pi].stream);
			window[plugin][pi].count = window[plugin][pi].streams.length;

			window[plugin][pi].streams.each(function(p) {
				var _self = $(this);
				window[plugin][pi].images[p] = new Image();
				window[plugin][pi].images[p].onload = function() {

					window[plugin][pi].rap[p] = this.width / this.height;

					if(window[plugin][pi].height > window[plugin][pi].width) {  // format portrait

						window[plugin][pi]._h = window[plugin][pi].height;
						window[plugin][pi]._mt = -window[plugin][pi]._h/2;
						window[plugin][pi]._w = window[plugin][pi]._h * window[plugin][pi].rap[p];
						window[plugin][pi]._ml = -window[plugin][pi]._w/2;

					} else {  // format landscape

						window[plugin][pi]._w = window[plugin][pi].width;
						window[plugin][pi]._ml = -window[plugin][pi]._w/2;
						window[plugin][pi]._h = window[plugin][pi]._w / window[plugin][pi].rap[p];
						window[plugin][pi]._mt = -window[plugin][pi]._h/2;

					}

					if(window[plugin][pi]._h < window[plugin][pi].height) {

						window[plugin][pi]._h = window[plugin][pi].height;
						window[plugin][pi]._mt = -window[plugin][pi]._h/2;
						window[plugin][pi]._w = window[plugin][pi]._h * window[plugin][pi].rap[p];
						window[plugin][pi]._ml = -window[plugin][pi]._w/2;

					}

					_self.css({
						'width': window[plugin][pi]._w,
						'height': window[plugin][pi]._h,
						'margin': window[plugin][pi]._mt + 'px 0 0 '+ window[plugin][pi]._ml +'px'
					}).attr('data-width', this.width).attr('data-height', this.height);

					if(!--window[plugin][pi].count) { window[plugin][pi].onLoad(); }
				};
				//Handle srcset
				var singleImg = $(this)[0];
				var src = $(this).attr('src');
				if (typeof singleImg.currentSrc !== 'undefined' && singleImg.currentSrc !== '') {
					src = singleImg.currentSrc;
				}
				window[plugin][pi].images[p].src = src;
			});

		},
		resize : function(pi) {

			if( window[plugin][pi] != undefined ) {

				window[plugin][pi].width = window[plugin][pi].element.outerWidth(true);
				window[plugin][pi].height = window[plugin][pi].element.outerHeight(true);

				window[plugin][pi].streams.each(function(p) {
					var _self = $(this);

					if(window[plugin][pi].height > window[plugin][pi].width) {  // format portrait

						var _h = window[plugin][pi].height;
						var _mt = -_h/2;
						var _w = _h * window[plugin][pi].rap[p];
						var _ml = -_w/2;

					} else {  // format landscape

						var _w = window[plugin][pi].width;
						var _ml = -_w/2;
						var _h = _w / window[plugin][pi].rap[p];
						var _mt = -_h/2;

					}

					if(_h < window[plugin][pi].height) {
						var _h = window[plugin][pi].height;
						var _mt = -_h/2;
						var _w = _h * window[plugin][pi].rap[p];
						var _ml = -_w/2;
					}

					_self.css({
						'width': _w,
						'height': _h,
						'margin': _mt + 'px 0 0 '+ _ml +'px'
					});

				});

			}

		}

	};

	var plugin = 'resizeCenter';

	$.fn.resizeCenter = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.resizeCenter' );
		}

	};

})( jQuery );