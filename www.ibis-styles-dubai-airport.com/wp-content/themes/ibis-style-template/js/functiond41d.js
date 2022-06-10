// Because of the use of the defer mode, we need to be sure all CSS are parsed before
var _jquery_webfont_inte = setInterval(function() {
	if(typeof(WebFont) !== "undefined") {
		clearInterval(_jquery_webfont_inte);
		WebFont.load({
			custom: {
			  families: ['Gotham']
			},
			fontactive: function(familyName, fvd) {
				
				jQuery(document).ready(function($){
					function replace_fullsizeurl_srcs() {
						if (!_is_mobile) { return; }
						if ($(window).width() > 767) {
							$('img[data-fullsizeurl]').each(function() {
								var img = $(this), fullsizeurl = img.data('fullsizeurl');
								if (typeof fullsizeurl !== 'undefined' && fullsizeurl != '') {
									img.removeAttr('srcset');  img.removeAttr('sizes');	img.attr('src', fullsizeurl);
									img.removeAttr('data-fullsizeurl');
								}
							});
						}
					}
					replace_fullsizeurl_srcs();

					// Fix For Vietnamese font
					if($('html').hasClass('lang_vi')) {
						$('*').each(function(n, elm) {
							if($(elm).css('font-family') !== '') {
								var _s = '';
								if(elm.getAttribute('style') !== null) { 
									var _s = elm.getAttribute('style');
									if(_s.slice(-1) !== ';') { _s += ';'; }
								}
								elm.setAttribute('style', _s + 'font-family : Arial, sans-serif !important');
							}
						});
					}

					// Split le nom de l'hotel pour un en gras
					$('#hotel-name h2, #footer-two h3').each(function() {
						var splitted  = $(this).text().split(' ')[0];
						var replaced = "<span class='bolded'>"+splitted+"</span>"
						$(this).html($(this).html().replace(splitted,replaced));
					});

					// Seobar
					$('#seobar').appendTo('footer').show();
					
					// Equilibrate the left and right columns
					var _left_h = $('.left-column').innerHeight();
					var _right_h = $('.right-column').innerHeight();
					if(_left_h >= _right_h) { $('.right-column').height(_left_h); } else { $('.left-column').height(_right_h); }

					// Main book button
					if(_is_mobile === false) {
						$('#book_button').appendTo($('nav > div.w-container'));
						$(document).trigger('book_button_alter');
					}
					window.__toggle_book_panel = function() {
						if($('#book_panel').hasClass('open')) {
							$('#book_panel').removeClass('open');
							$('div.book_overlay').fadeOut(250, function() { $('html, body').css('overflow', 'auto'); });
						} else {
                            $(document).trigger('accor_event.open_calendar');
							$('div.book_overlay').fadeIn(250, function() { 
								$('html, body').css('overflow', 'hidden'); $('#book_panel').addClass('open');
							});
						}
					};
					$('#book_button').on('click', __toggle_book_panel);

					// Book button for rooms
					$('.roomtype li a.book, #bookthisroom > a').accorBookNowLink();
					
					// Booking form
					if($('body').hasClass('home')) {
						$('#booking').insertAfter($('#main_slideshow'));
						var mincheckout, checkin_date, checkout_date, checkin_dp = $('#bookingform-check #checkin-check'), checkout_dp = $('#bookingform-check #checkout-check');
						$('#bookingform-check').accorBookingInitDatepickers(
							{ 
								onSelect: function ( dateText, inst ) {	
									$('#bookingform-check label[for="checkin-check"] > span').text(dateText);
									checkin_date = checkin_dp.datepicker('getDate');
									checkout_date = checkout_dp.datepicker('getDate');
									if (checkout_date <= checkin_date) {
										mincheckout = new Date(checkin_date.getTime()+86400000);							
										checkout_dp.datepicker('option', 'minDate', mincheckout);
										checkout_dp.datepicker('setDate', mincheckout);
										var _month = mincheckout.getMonth()+1;
										$('#bookingform-check label[for="checkout-check"] > span').text(mincheckout.getDate()+'/'+(_month < 10 ? '0'+_month : _month)+'/'+mincheckout.getFullYear());
									}
									checkin_dp.trigger('change');
									checkout_dp.trigger('change');
								} 
							},
							{ 
								onSelect: function ( dateText, inst ) { 
									$('#bookingform-check label[for="checkout-check"] > span').text(dateText);
									checkin_date = checkin_dp.datepicker('getDate');
									checkout_date = checkout_dp.datepicker('getDate');
									if (checkin_date >= checkout_date) {
										maxcheckin = new Date(checkout_date.getTime()-86400000);
										checkin_dp.datepicker('option', 'minDate', maxcheckin);
										checkin_dp.datepicker('setDate', maxcheckin);
										var _month = maxcheckin.getMonth()+1;
										$('#bookingform-check label[for="checkin-check"] > span').text(maxcheckin.getDate()+'/'+(_month < 10 ? '0'+_month : _month)+'/'+maxcheckin.getFullYear());
									}
									checkin_dp.trigger('change');
									checkout_dp.trigger('change');
								}
							}
						);
						$('#bookingform-check').accorBookingForm();
						$('#bookingform-check').appendTo($('#booking'));
						$('#bookingform-check label').on('click', function() { 
							$(this).next('input').trigger('click');
							$('ul.select_children').stop(true, true).fadeOut();
							$('ul.select_adults').stop(true, true).fadeOut();
						});

						var _adults_text = $('label[for="adultNumber-check"]').text();
						var _children_text = $('label[for="childrenNumber-check"]').text();
						var _select_adults = $('<ul class="select_adults"></ul>');
						var _select_children = $('<ul class="select_children"></ul>');
						$('#adultNumber-check').children().each(function() {
							var _li = $('<li>'+$(this).attr('value')+'</li>');
							_li.appendTo(_select_adults);
						});
						_select_adults.appendTo($('#bookingform-check div.adults'));
						$('#childrenNumber-check').children().each(function() {
							var _li = $('<li>'+$(this).attr('value')+'</li>');
							_li.appendTo(_select_children);
						});
						_select_children.appendTo($('#bookingform-check div.children'));
						$('label[for="adultNumber-check"]').data('text', _adults_text).on('click', function() { checkin_dp.datepicker('hide'); checkout_dp.datepicker('hide'); $('ul.select_children').stop(true, true).fadeOut(); $('ul.select_adults').stop(true, true).fadeIn(); });
						$('label[for="childrenNumber-check"]').data('text', _children_text).on('click', function() { checkin_dp.datepicker('hide'); checkout_dp.datepicker('hide'); $('ul.select_adults').stop(true, true).fadeOut(); $('ul.select_children').stop(true, true).fadeIn(); });		
						$('.select_adults li, .select_children li').each(function() {
							$(this).on('click', function() {
								var _parent = $(this).parents('div.field').first();
								var _label = _parent.find('label').first();
								_parent.find('select option[value="'+ $(this).text() +'"]').prop('selected', true);
								_label.text(_label.data('text') + ' : ' + $(this).text());
								$(this).parents('ul').first().fadeOut();
							});
						});
						/* Extended fields - July 2019 */
						var extend_button = $('#bookingform-check .extend_fields');
						var extended_fields = $('#bookingform-check .extended_fields');
						var childrenages_row = extended_fields.find('.childrenages_row');
						extend_button.click(function() {
							$(this).toggleClass('open');
							extended_fields.toggleClass('hidden');
						});
						$('#bookingform-check select[name=childrenNumber]').change(function() {
							var nChildren = parseInt($(this).val(), 10);
							if (nChildren > 0) {
								extend_button.addClass('open');
								childrenages_row.removeClass('hidden');
								extended_fields.removeClass('hidden');
							} else {
								childrenages_row.addClass('hidden');
							}
							$('.field.childrenAge0,.field.childrenAge1,.field.childrenAge2').addClass('hidden');
							for (var i = 0; i<nChildren; i++) {
								$('.field.childrenAge' + i).removeClass('hidden');
							}
						});
						$('#bookingform-check .select_children li').on('click', function() {
							setTimeout(function() {
								$('#bookingform-check select[name=childrenNumber]').trigger('change');
							}, 50);
						});
						/* END Extended fields - July 2019 */
						/**/		
						$('#bookingform').accorBookingInitDatepickers();
						$('#bookingform').accorBookingForm();
						$('#childrenNumber').on('change', function() {
							$('div[class*="childrenAge"]').stop(true,true).hide();
							var _val = $(this).val();
							for(_i = 0; _i < _val; _i++) {
								$('div.childrenAge'+_i).stop(true,true).slideDown();
							}
						});
						$('img.book_close').on('click', __toggle_book_panel);
						/**/
					} else {
						$('#bookingform').accorBookingInitDatepickers();
						$('#bookingform').accorBookingForm();
						$('#childrenNumber').on('change', function() {
							$('div[class*="childrenAge"]').stop(true,true).hide();
							var _val = $(this).val();
							for(_i = 0; _i < _val; _i++) {
								$('div.childrenAge'+_i).stop(true,true).slideDown();
							}
						});
						$('img.book_close').on('click', __toggle_book_panel);
					}
					
					// homepage
					if($('body').hasClass('home')) {
						if($(window).scrollTop() > $('#booking').offset().top + $('#booking').innerHeight() - $('#header').innerHeight()){
							$('#book_button').addClass('shown');
						} else {
							$('#book_button').removeClass('shown');
						}
						$(document).trigger('book_button_alter');
					}



					// Homepage Video
					if($('#video-container').length > 0) {
						$('body').addClass('hasVideo');
						$('#video-container').appendTo('#main_slideshow');
						var _video_play = $('<span id="hp_video_play" class="video-play"></span>');
						_video_play.appendTo('#main_slideshow');
						_video_play.on('click', function() {
							if(player !== undefined) {
								$('#booking').css('opacity',0);
								player.playVideo();
								$('.main_slideshow').animate({'opacity':0}, function() {
									$('#main_slideshow').height(player_h);
									$('body').addClass('playing-video');
								});
							}
						});
						$('.stop_video').on('click', function() { onPlayerStateChange({'data' : 0}); });
						$('.mute_video').on('click', function() {
							if($(this).hasClass('muted')) {
								$(this).removeClass('muted');
								player.setVolume(100);
							} else {
								$(this).addClass('muted');
								(typeof riseVolume !== 'undefined') && clearInterval(riseVolume);
								player.setVolume(0);
							}
						});
					}

					// Main slideshow
					function detectIE() {
						var ua = window.navigator.userAgent;
						var msie = ua.indexOf('MSIE ');
						if (msie > 0) { return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10); }
						var trident = ua.indexOf('Trident/');
						if (trident > 0) { var rv = ua.indexOf('rv:'); return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10); }
						var edge = ua.indexOf('Edge/');
						if (edge > 0) { return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10); }
						return false;
					}
					// - Fix for IE
					var IEversion = detectIE();	
					if(IEversion !== false) {
						$('.main_slideshow li img').each(function() {
							if (!$(this).attr('srcset')) return;
							var _img = $(this).attr('srcset').split(', ');
							_img = _img[_img.length-1].split(' ');
							$(this).attr('src', _img[0]);
						});
					}
					$('.main_slideshow').each(function() {
						var _self = $(this);
						var window_width = $(window).innerWidth();
						var _height = window_width * 25 /100;
						if(_is_mobile === true) {
							if (window_width > 767 && _height < 350) {
								_height = 350;
							} else {
								_height = window_width * 60 /100;
							}
						}
						_self.height(_height);
						$('#main_slideshow').height(_height + $('#header').innerHeight());
						
						
						if(_self.data('type') === 'full' || _is_mobile === true) {
						
							var _next_prev = false;
							if($(this).find('ul > li').length > 1) {
								_next_prev = true;
								var _span_prev = $('<span class="prev"></span>');
								_span_prev.appendTo($(this));
								var _span_next = $('<span class="next"></span>');
								_span_next.appendTo($(this));
							}
							_self.resizeCenter({
								onLoad: function() {
									_self.appendTo($('#main_slideshow'));
									_self.find('ul.cycle').on('cycle-initialized', function( event, opts ) {
										_self.find('img').animate({'opacity' : 1});
									});
									$('#main_slideshow').removeClass('loading');
									_self.find('ul.cycle').cycle({
										fx : 'fadeout', 
										timeout : 6000,
										swipe : true,
										slides : '> li',
										sync : true,
										next : (_next_prev === true ? _span_next : ''),
										prev : (_next_prev === true ? _span_prev : '')
									});
								}
							});
			
			
						} else {

							slideShow();
						
						}	
					});
		$('div.see-gallery').appendTo($('#main_slideshow')).show();
					
					// Webfonts
					/*
					WebFont.load({
						custom: {
						  families: ['FuturaStd-Book']
						},
						fontactive: function(familyName, fvd) {
							*/
							
							// Main menu : submenus
							$('nav li.has-child').each(function() {
								var _self = $(this);
								if(_is_mobile === false) {
									var _pos = _self.position().left;
									if($('body').hasClass('rtl')) {
										_pos = _self.innerWidth() - _self.find('> ul').innerWidth() + _pos;
									}
									_self.find('> ul').css('left', _pos);
								}
							});
							
							// Rooms menu
							if($('#room-nav div.room_slider').length > 0) {
								$('#room-nav div.room_slider').attr('data-initial-width', $('#room-nav div.room_slider').innerWidth());
								var _slider_w = $('#room-nav div.room_slider').innerWidth() + $('.previous_room').innerWidth() + $('.next_room').innerWidth();
								var _slider_diff = $('#room-nav').innerWidth() - _slider_w;
								if(_slider_diff < 0) {
									$('#room-nav div.room_slider').width($('#room-nav div.room_slider').innerWidth()+_slider_diff);
								} else {
									$('#room-nav div.room_slider').width($('#room-nav div.room_slider').data('initital-width'));
								}
								var _w = 1;
								$('#room-nav div.room_slider li').each(function() { _w += Math.ceil($(this).outerWidth(true)); });				
								$('#room-nav div.room_slider ul').width(_w);
								var _p = _k = 0, _w = $('#room-nav div.room_slider').innerWidth(), _current = 1, _pos = {};
								$('#room-nav div.room_slider li').each(function(i) {
									if(i === 0) { _k++; $(this).addClass('step-'+_k); _pos[_k] = i; }
									_p += Math.ceil($(this).outerWidth(true));
									if(_p >= _w) { _k++; $(this).addClass('step-'+_k); _p = 0; _pos[_k] = $('#room-nav div.room_slider li').index(this); }
								});
								$('a.previous_room').click(function() {
									_current--; 
									if(_current <= 0) { _current = _k; }
									$('#room-nav div.room_slider ul').animate({'left':-$('li.step-'+_current).position().left});
								});
								$('a.next_room').click(function() {
									_current++;
									if(_current > _k) { _current = 1; }
									$('#room-nav div.room_slider ul').animate({'left':-$('li.step-'+_current).position().left});
								});
								var _c = $('#room-nav div.room_slider li').index($('li.room-active'));
								for(var n in _pos) {
									if(_c > _pos[n] && _c < _pos[(parseInt(n)+1)] && typeof(_pos[(parseInt(n)+1)]) !== 'undefined') { $('#room-nav div.room_slider ul').css('left', -$('li.step-'+n).position().left); _current = parseInt(n); break; }
									else if(typeof(_pos[(parseInt(n)+1)]) === 'undefined') { $('#room-nav div.room_slider ul').css('left', -$('li.step-'+n).position().left); _current = parseInt(n); break; }
									else if(_c === _pos[n]) { $('#room-nav div.room_slider ul').css('left', -$('li.step-'+n).position().left); _current = parseInt(n); break; }
								}
							} else {
								$('#room-nav .horizontal-nav').horizontalNav();
							}
							if($(window).scrollTop() > $('.main_slideshow').innerHeight()){
								$('#room-nav').addClass('fixed');
							} else {
								$('#room-nav').removeClass('fixed');
							}
							
							/*
						}
					});
					*/
					
					// Languages
					$('#lang').on('click', function() {
						if(_is_mobile === false) {
							var content_html = $(this).find('.languages').html();
							$.fancybox({
								padding: 0,
								href: '',
								content : '<div id="popup_content"><strong>'+ _choose_language +'</strong><hr><ul>'+content_html+'</ul></div>',
								scrolling : 'no',
								helpers : { overlay : { locked : false } },
								afterShow : function() {
									$('#popup_content li.select > select').attr('data-xiti','transverse::language::selection').live('change', function() {
										var _url = $(this).find('option:selected').data('url');
										if(_url !== undefined) {
                                            $(document).trigger('accor_event.other_language');
											var w = window.open(_url, '_blank');
											w.focus();
										}
									});
								}
							});
						}
					});	
					
					// Homepage highlighted pages	
					if(_is_mobile === false) {
						$('#highlighted ul li').each(function() {
							var _height = parseFloat($('#highlighted ul li:first').innerWidth() * 80 / 100);
							$(this).css('height', _height);
							// we want to optimize the google pagespeed score and give the user the joy to enjoy nice images
							$(this).find('img').waypoint(function() {
								var _self = $(this);
								var _src = _self.data('src');
								var _parent = $(this).parents('li.w-resp').first();
								_self.get(0).onload = function() {
									_parent.resizeCenter({onLoad: function() { _self.animate({'opacity' : 1}); } });
								}
								_self.attr('src', _src);
							}, {
								offset: '100%'
							});
						});
					} else {
						$('#highlighted ul li').each(function() {
							var _self = $(this).find('img');
							var _src = _self.data('src');
							_self.attr('src', _src).css({'opacity' : 1});
						});
					}
					
					// Map
					if(typeof(_hotel) != 'undefined' && typeof($.fn.FBMap) != 'undefined') {
						$('#map_canvas').FBMap({
							lat : _hotel.lat,
							lng : _hotel.lng,
							marker : _hotel.marker,
							train_station : _hotel.img_path + 'point.png',
							airport : _hotel.img_path + 'point.png',
							subway_station : _hotel.img_path + 'point.png',
							taxi_stand : _hotel.img_path + 'point.png',
							cafe : _hotel.img_path + 'point.png',
							restaurant : _hotel.img_path + 'point.png',
							museum : _hotel.img_path + 'point.png',
							art_gallery : _hotel.img_path + 'point.png',
							blank : _hotel.img_path + 'point.png',
							noplaces_text : map_noplaces_text,
							link_text : map_directions_text,
							zoomControl : {
							  'display': true,
							  'style': 'LARGE',
							  'position': ($('body').hasClass('rtl')) ? 'LEFT_TOP' : 'RIGHT_TOP'
							},
							'infobox_options' : {
								'boxStyle': {
									'background': ""
								},
								'closeBoxURL': ""
							},
							mapStyle : [
								{ "featureType": "landscape.man_made", "elementType": "geometry", "stylers": [ { "color": "#F5EFE2" } ] },
								{ "featureType": "landscape.natural", "elementType": "geometry", "stylers": [ { "color": "#bde6ab" } ] },
								{ "featureType": "landscape.natural.terrain", "elementType": "geometry", "stylers": [ { "visibility": "off" } ] },
								{ "featureType": "poi", "elementType": "labels", "stylers": [ { "visibility": "off" } ] },
								{ "featureType": "poi.business", "elementType": "all", "stylers": [ { "visibility": "off" } ] },
								{ "featureType": "poi.medical", "elementType": "geometry", "stylers": [ { "color": "#D8E0DB" } ] },
								{ "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#B5E1C8" } ] },
								{ "featureType": "road", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },
								{ "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#fff" } ] },
								{ "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#efd151" } ] },
								{ "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [ { "color": "#ffffff" } ] },
								{ "featureType": "road.local", "elementType": "geometry.fill", "stylers": [ { "color": "black" } ] },
								{ "featureType": "transit.station.airport", "elementType": "geometry.fill", "stylers": [ { "color": "#cfb2db" } ] },
								{ "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#B9D8F7" } ] }
							],			
							pois : ((typeof(pois) !== 'undefined') ? pois : null),
							display_pois : true,
							group_fit_bounds : false
						});
						$('#map_buttons > span').on('click', function() { $('#map_buttons > span').removeClass('active'); $(this).addClass('active'); });
						var _wait_poi = setInterval(function() {			
							if($('#monuments > li').first().children().length > 0) {
								clearInterval(_wait_poi);
								$('#monuments').horizontalNav();
								$('#monuments li > label').each(function() {
									$(this).on('click', function(){
										if(!$(this).parents('li').first().hasClass('current')) {
											$('#monuments li').removeClass('current');
											$(this).parents('li').first().addClass('current');
											$('#places_content').css({'display':'block'});
										} else {
											$('#monuments li').removeClass('current');
											$('#places_content').css({'display':'none'});
										}
									});
								});
								$('#monuments li > strong').each(function() {
									$(this).on('click', function(){
										var _category = $(this).text();
										if(!$(this).parents('li').first().hasClass('current')) {
											$('#places_list').html('');
											$('#monuments li').removeClass('current');
											$(this).parents('li').first().addClass('current');
											$($(this).next('ul').html()).clone().appendTo($('#places_list'));
											$('#places_content').css({'display':'block'});
										} else {
											$('#monuments li').removeClass('current');
											$('#places_content').css({'display':'none'});
										}
									});
								});
							}
						}, 50);
						$('#streetview').on('click', function() { $('#places_content').hide(); });
						if(_is_mobile === true) {
							$('#map_ctx, #map_canvas').height($(window).innerWidth());
						}
					}
					
					// Resize and center images
					$('.w-resp').each(function() {		
						var _self = $(this);
						_self.resizeCenter({
							onLoad: function() { setTimeout( function() { _self.find('img.resp').animate({'opacity' : 1}); }, 200); }
						});
					});
					
					// Tripadvisor
					$('#tripadvisor ul').first().cycle({slides: "> li", timeout:6000 });
					$('a.tripadvisor_reviews').fancybox({
						maxWidth	: 800,
						maxHeight	: 600,
						fitToView	: false,
						width		: '70%',
						height		: '70%',
						padding		: 0
					});
					
					// Location link
					if($('body').hasClass('home')) {
						$('a.location_link').attr('href', '#location').on('click', function(e) {
							e.preventDefault();
							$('html,body').stop(0,0).animate({
								scrollTop: $('#location').offset().top-$('#header').innerHeight()
							},1000);
						});
						if(window.location.hash!=='') {
							$('html,body').animate({
								scrollTop: $(window.location.hash).offset().top-$('#header').innerHeight()
							},1000);
						}
					}
					
					// Page section (move the title into the slideshow)
					/*if(_is_mobile === false) {
						$('h3.slideshow_title').appendTo($('div.main_slideshow')).css({'height': $('div.main_slideshow').innerHeight()+'px', 'line-height': $('div.main_slideshow').innerHeight()+'px'}).show();
					}*/

					// Gallery popin
					if(_is_mobile === false) {
						$('div.see-gallery a').attr('href', 'javascript:void(0);').on('click', function(e) {
							e.preventDefault();
							var gallery_cat = $(this).data('gallerycat');
							galleryPopin(0, true, gallery_cat);
						});
					}
					
					// Gallery page
					var photogallery_category=location.hash.replace('#___', '');
					var $container = $('#gallery');
					$container.imagesLoaded( function() {
						var _l = $container.find('div.elm').length;
						function appear(i) {
							if((i+1) <= _l) {
								$($container.find('div.elm').get(i)).animate({'opacity':1}, 250, function() { $(this).addClass('set'); appear(i+1); });
							}
						}
						appear(0);
						
						if(_is_mobile === false) {
						
							$('.fancy a').attr('href', 'javascript:void(0);').on('click', function() {
								galleryPopin($(this).data('id'));
								return false;
							});
							var _tags = $('#gallery-tags li');
							_tags.each(function() {
								$(this).on('click', function() {
									_tags.removeClass('active');
									$(this).addClass('active');
									var _tag = $(this).data('tag');
									if(_tag !== undefined) { $container.isotope({filter : '.'+ _tag}); }
									else { $container.isotope({ filter: '*' }); }
								});
							});

							if (photogallery_category != '') {
								$('#gallery-tags li[data-tag='+photogallery_category+']').trigger('click');
							}
							
						} else {
						
							$('#video').prependTo('#gallery');
							$('.fancy.video > a').each(function() {
								var _href = 'https://www.youtube.com/embed/' + YouTubeGetID($(this).attr('href')) + '?showinfo=0&rel=0&modestbranding=1&autoplay=1&wmode=opaque';
								$(this).attr('data-href', _href).attr('href', 'javascript:void(0);');
								$(this).addClass('fancybox.iframe').fancybox({
									fitToView	: true,
									href : _href,
									openEffect	: 'none',
									closeEffect	: 'none',
									padding: 0
								});
							});
							$('.fancy.virtualtour > a').each(function() {
								var _href = $(this).attr('href');
								$(this).attr('data-href', _href).attr('href', 'javascript:void(0);');
								$(this).addClass('fancybox.iframe').fancybox({
									fitToView	: true,
									href : _href,
									openEffect	: 'none',
									closeEffect	: 'none',
									padding: 0
								});
							});
							$('.fancy.image a').each(function() {
								var _href = $(this).attr('href');
								$(this).attr('data-href', _href).attr('href', 'javascript:void(0);');
								$(this).on('click', function() {
									$.fancybox({
										openEffect	: 'elastic',
										closeEffect	: 'elastic',
										href : _href,
										padding: 0
									});
								});
							});
							var _tags = $('#gallery-tags li');
							var _select_photos = $('<select></select>');
							_select_photos.appendTo('#gallery-tags');
							_tags.each(function() {
								var _option = $('<option value="'+$(this).data('tag')+'">'+$(this).text()+'</option>');
								_option.appendTo(_select_photos);
							});
							$('#gallery-tags ul').remove();
							$('#gallery-tags').insertAfter('#header').show();
							_select_photos.on('change', function() {
								var _tag = $(this).val();
								if(_tag !== 'undefined') { $container.isotope({filter : '.'+ _tag}); }
								else { $container.isotope({ filter: '*' }); }
								$('html, body').scrollTop(0);
							});

							if (photogallery_category != '') {
								_select_photos.val(photogallery_category).trigger('change');
							}

						}

						// $('#gallery div.elm').each(function() {
						// 	if($(this).hasClass('video')) {
						// 		var _src = $(this).find('img').attr('src').replace(/hqdefault/g,'maxresdefault');
						// 	} else if($(this).hasClass('fancy')) { 
						// 		var _src = $(this).find('img').attr('src');
						// 	}
						// 	else {
						// 		var _src = $(this).find('a').first().data('href');
						// 	}
						// 	$(this).find('img').attr('src', _src);
						// });
						// $('#video, #video-ctx, #gallery div.video, #gallery .video-ctx, #gallery div.elm').each(function() {
						// 	var _self = $(this);
						// 	$(this).parents().each(function() {
						// 		var _w = $(this).width();
						// 		if(_w !== 0) {
						// 			_self.css({'width': _w, 'height' : _w * 9 /16});
						// 			return false;
						// 		}
						// 	});
							
						// });
						if( _is_mobile){
							$('.w-resp, #gallery div.elm').each(function() {
								var _self = $(this);
								setTimeout( function() { _self.resizeCenter(); }, 250);
							});
							$(window).on('resize', function() {
								$('#video, #video-ctx, #gallery div.video, #gallery .video-ctx, #gallery div.elm').each(function() {
									var _self = $(this);
									$(this).parents().each(function() {
										var _w = $(this).width();
										if(_w !== 0) {
											_self.css({'width': _w, 'height' : _w * 9 /16});
											return false;
										}
									});
									
								});
								$('.w-resp, #gallery div.elm').each(function() {
									var _self = $(this);
									setTimeout( function() { _self.resizeCenter(); }, 250);
								});
							});
						}

						$container.isotope({
							itemSelector : '.fancy',
							layoutMode : 'masonry',
							isOriginLeft : ($('body').hasClass('rtl')) ? false : true,
							masonry : {
								columnWidth: '.elm'
							}
						});
						
					});
					
					// News main page
					var _news_max = $('.news-section ul li').length;
					$('.news-section span.load_more').on('click', function() {
						var _min = $('.news-section ul li:visible').length;
						var _max = _min + 9;
						for(i = _min; i < _max; i++) {
							$($('.news-section ul li').get(i)).removeClass('hidden');
						}
						if(_max >= _news_max) { $(this).remove(); }
					});
					
					// News single page
					$('.slideshow_title > strong').css('margin-top', -$('.slideshow_title > strong').innerHeight() / 2);
					
					// Meeting single page || Restaurant single page || Spa main page
					if($('body').hasClass('single-offers') || $('body').hasClass('page-template-template-meeting') || $('body').hasClass('page-template-template-restaurant') || $('body').hasClass('page-template-template-spa')) {

						function updateForm(_content, _form, _lang, _title) {

							$('input[name="restaurant"]').val(_title);	
							var _hours = $('#form_hours > option:disabled');
							var _minutes = $('#form_minutes > option:disabled');

							$('#form_date,.contact_form_datepicker').datepicker({
								numberOfMonths:2,
								minDate:new Date(),
								onSelect : function(dateText, inst) {
									var _date = new Date();
									
									if( $('body').hasClass('page-template-template-restaurant') && $(this).datepicker('getDate').toDateString() === _date.toDateString() ) {
										$('#form_hours > option').each(function(i) {
											if(typeof(_hours[i]) !== 'undefined') { $(this).prop('disabled', true); }
										});
										$('#form_minutes > option').each(function(i) {
											if(typeof(_minutes[i]) !== 'undefined') { $(this).prop('disabled', false); }
										});
									} else {
										$('#form_hours > option, #form_minutes > option').each(function() {
											$(this).prop('disabled', false);
										});
									}
								}
							});

							if($('#g-recaptcha').length > 0) {
								var _key = $('#g-recaptcha', _content).attr('data-sitekey');
								grecaptcha.render('g-recaptcha', { 'sitekey' : _key });
							}
							
							$('.tableplus-submit').click(function(){
                                $(this).trigger('accor_event.submit_form');
								$.fancybox.close();
								return true;
							});
							
							$('form.form').on('submit', function(e) {
								e.preventDefault();
                                $(this).trigger('accor_event.submit_form');
								var data = $('form.form').serialize() + '&action=hotel_form&form=' + _form + '&lang='+ _lang;
								jQuery.post(ajax_url, data, function(response) {
									$('.fancybox-inner').html(response);
									$.fancybox.update();
									$.fancybox.reposition();
									updateForm(response, _form, _lang, _title);
								});
								return false;
							});
							
						}
						
						$('a[data-form]').on('click', function() {
						    $(this).trigger('accor_event.open_form');
							var _form = $(this).data('form');
							var _title = $(this).data('post');
							var _id = $(this).data('id');
							var data = { 'action': 'hotel_form', 'form': _form, 'title': _title, 'restaurant_post_id': _id, 'lang' : _lang };
							jQuery.get(ajax_url, data, function(response) {
								$.fancybox({
									padding		: 0,
									href		: '',
									content		: response,
									scrolling	: 'no',
									fitToView	: false,
									width		: '70%',
									height		: '70%',
									autoSize	: true,
									helpers		: { overlay : { locked : false } },
									afterShow	: function() { 
										updateForm(this.content, _form, _lang, _title);
										if( typeof(xiti_tracking) !== 'undefined' ) { xiti_tracking(); }
									}
								});
							});
							return false;
						});		
						
						if($(window).scrollTop() > $('.main_slideshow').innerHeight()){
							$('.subnav').addClass('fixed');
						} else {
							$('.subnav').removeClass('fixed');
						}
						$('.subnav ul a').each(function() {
							$(this).on('click', function() {
								$('.subnav li').removeClass('current');
								$(this).parents('li').first().addClass('current');
								var _href = $(this).attr('href');
								$('html,body').addClass('scrolling').stop(0,0).animate({
									scrollTop: $(_href).offset().top-$('#header').innerHeight()-$('.subnav').innerHeight()
								},1000, function() { $(this).removeClass('scrolling'); });
							});
						});
						if(window.location.hash!=='') {
							$('.subnav ul a[href="'+window.location.hash+'"]').parents('li').first().addClass('current');
							$('html,body').animate({
								scrollTop: $(window.location.hash).offset().top-$('#header').innerHeight()-$('.subnav').innerHeight()
							},1000);
						}
					}
					
					// Offers Main Page
					$('a[data-offer]').each(function() {
						$(this).on('click', function() { 
							var _offer = $(this).data('offer').split(':');
							if(_offer[1] !== '') { 
								var _dayIn = _offer[1];
								var _monthIn = _offer[2];
								var _yearIn = _offer[3];
							}
							if(_offer[0] !== '') { 
								var _tk = _offer[0];
								accorBookNow({"preferredCode": _tk, "dayIn": _dayIn, "monthIn": _monthIn, "yearIn": _yearIn});
							} else {
								accorBookNow();
							}
							return false; 
						});
					});
					$('#choose_offers').on('change', function() {
						$('li.offer_detail').removeClass('last').hide();
						var _val = $(this).find('option:selected').data('category');
						if(_val !== 'all') {
							$('li.offer_detail[data-category="'+ _val +'"]').show();
						} else {
							$('li.offer_detail').show();
						}
						$('li.offer_detail:visible').each(function(n) {
							if((n+1) % 3 === 0) { $(this).addClass('last'); }
						});
					});
					
					// Offers single page
					$('div.terms h5').on('click', function() { $(this).next('div').slideDown(); });
					
					// Newsletter page
					$('select[name="brand_news_language"], select[name="news_language"]').on('change', function() {
						var _checkbox = $(this).parents('p.checkbox').first().find('input[type="checkbox"]');
						if($(this).val() !== '') { _checkbox.prop('checked', true); } else { _checkbox.prop('checked', false); }
					});
				});
				/**
				 * END DOCUMENT READY
				 */

				$(window).resize(function() {

					// homepage
					if(_is_mobile === false) {
						$('.main_slideshow').each(function() {
							var _self = $(this);
							var _height = _self.innerWidth() * 25 /100;
							_self.height(_height);
							$('#main_slideshow').height(_height + $('#header').innerHeight());
						});
					}
					
					// Main menu
					$('nav li.has-child').each(function() {
						var _self = $(this);
						if(_self.find('> ul').hasClass('set')) {
							_self.find('> ul').css('left', _self.position().left);
						}
					});
					
					// Equilibrate the left and right columns
					$('.left-column, .right-column').css('height','auto');
					var _left_h = $('.left-column').innerHeight();
					var _right_h = $('.right-column').innerHeight();
					if(_left_h >= _right_h) { $('.right-column').height(_left_h); } else { $('.left-column').height(_right_h); }
					
					// Homepage highlighted pages	
					if(_is_mobile === false) {
						$('#highlighted ul li').each(function() {
							var _height = parseFloat($('#highlighted ul li:first').innerWidth() * 80 / 100);
							$(this).css('height', _height);
							// we want to optimize the google pagespeed score and give the user the joy to enjoy nice images
							$(this).find('img').waypoint(function() {
								var _self = $(this);
								var _src = _self.data('src');
								var _parent = $(this).parents('li.w-resp').first();
								_self.get(0).onload = function() {
									_parent.resizeCenter({onLoad: function() { _self.animate({'opacity' : 1}); } });
								}
								_self.attr('src', _src);
							}, {
								offset: '100%'
							});
						});
					} else {
						$('#highlighted ul li').each(function() {
							var _self = $(this).find('img');
							var _src = _self.data('src');
							_self.attr('src', _src).css({'opacity' : 1});
						});
					}

					//
					$('#rooms ul li').each(function() {
						var _height = parseFloat($('#rooms ul li:first').innerWidth() * 80 / 100);
						$(this).css('height', _height);
					});
					
					// Rooms menu
					if($('#room-nav div.room_slider').length > 0) {
						var _slider_w = $('#room-nav div.room_slider').data('initial-width') + $('.previous_room').innerWidth() + $('.next_room').innerWidth();
						var _slider_diff = $('#room-nav').innerWidth() - _slider_w;
						if(_slider_diff < 0) {
							$('#room-nav div.room_slider').width($('#room-nav div.room_slider').data('initial-width')+_slider_diff);
						} else {
							$('#room-nav div.room_slider').width($('#room-nav div.room_slider').data('initial-width'));
						}
					}
					
					// Page section (adjust the title)
					/*if(_is_mobile === false) {
						$('h3.slideshow_title').css({'height': $('div.main_slideshow').innerHeight()+'px', 'line-height': $('div.main_slideshow').innerHeight()+'px'});
					}*/
					
					// News single page
					$('.slideshow_title > strong').css('margin-top', -$('.slideshow_title > strong').innerHeight() / 2);
					
					// Gallery popin
					if($('#gallery_popin').hasClass('shown')) { makeGalleryScrollable(); }
					
					//

				}).blur(function() {
					
					// pause the main slideshow
					$('.main_slideshow ul.cycle').cycle('pause');
					
				}).focus(function() {
					
					// resume the main slideshow
					$('.main_slideshow ul.cycle').cycle('resume');
					
				}).scroll(function() {
					
					// homepage
					if($('body').hasClass('home')) {
						if($(window).scrollTop() > $('#booking').offset().top + $('#booking').innerHeight() - $('#header').innerHeight()){
							$('#book_button').addClass('shown');
						} else {
							$('#book_button').removeClass('shown');
						}
						$(document).trigger('book_button_alter');
					}
					
					// rooms menu
					if($(window).scrollTop() > $('.main_slideshow').innerHeight()){
						$('#room-nav').addClass('fixed');
					} else {
						$('#room-nav').removeClass('fixed');
					}
					
					// restaurant menu	
					if($(window).scrollTop() > $('.main_slideshow').innerHeight()){
						$('.subnav').addClass('fixed');
					} else {
						$('.subnav').removeClass('fixed');
					}
					if(!$('html,body').hasClass('scrolling')) {
						var _subnav = new Array();
						$('.subnav ul a').each(function() { _subnav.push($(this).attr('href')); });
						$.map(_subnav, function(el) {
							if($(window).scrollTop() >= ($(el).offset().top-$('#header').innerHeight()-$('.subnav').innerHeight())){
								$('.subnav li').removeClass('current');
								$('.subnav ul a[href="'+el+'"]').parents('li').first().addClass('current');
							}
						});
					}
					//
					
				}).load(function() {
					// Bug with defer loading of js files
					//$(window).resize();
					$('.roomtype h4').each(function() {
						var item = $(this);
						if (item.height() > 60) {
							item.addClass('twolines');
						}
					});
				}).keydown(function(e) {
					
					// Gallery popin
					if($('#gallery_popin').hasClass('shown')) {
						switch(e.which) {
							case 37:
								$('.gallery_prev').trigger('click');
							break;
							case 39:
								$('.gallery_next').trigger('click');
							break;
							default: return;
						}
						e.preventDefault();
					}
					
				});

			}
		});	
	}
}, 50);

var galleryPopin = function(id, panel, category) {
	if (typeof category === 'undefined') {
		category = false;
	}
	$.ajax({
		type : "GET",
		data : { 'action' : 'gallery', 'lang' : ((_lang !== undefined) ? _lang : 'en') },
		url: ajax_url,
		error: function() {
			if(window.console && console.log) { console.log( "error while getting the gallery data !" ); }
		},
		success: function(gallery) {
			if( gallery !== 'error' ) {	gallery_html = gallery; }
			else { if(window.console && console.log) { console.log( "error during success while getting the gallery data !" ); } }
		},
		complete: function() {
			if(gallery_html !== undefined) {
				
				$('.main_slideshow ul.cycle').cycle('pause');
				
				var gallery_current = 0;
				
				$('html, body').css('overflow', 'hidden');
				$('#gallery_popin').html(gallery_html);
				
				var _width = $('#gallery_thumbnails_ctx li:visible').length * $('#gallery_thumbnails_ctx li:visible').outerWidth(true);
				var $container = $('#gallery_thumbnails_ctx > ul');
				$container.width(_width);
				$container.isotope({
					itemSelector : '.thumb',
					layoutMode : 'masonry',
					isOriginLeft : ($('body').hasClass('rtl')) ? false : true,
					masonry : {
						columnWidth: '.elm'
					}
				});
				$container.on('arrangeComplete', function( event, filteredItems ) {
					$('#gallery_caption i.gallery_total').text($('#gallery_thumbnails_ctx li[data-type!="video"]:visible').length - $('#gallery_thumbnails_ctx li[data-type="virtual"]:visible').length);
					gallery_current = 0;
					$($('#gallery_thumbnails_ctx li:visible').get(gallery_current)).trigger('click');
					makeGalleryScrollable();
				});
				
				$('#gallery_categories li').each(function() {
					$(this).on('click', function() {
						$('#gallery_categories li').removeClass('active');
						$(this).addClass('active');
						var _tag = $(this).data('tag');
						$container.width(_width);
						if(_tag !== undefined) { $container.isotope({filter : '.'+ _tag}); }
						else { $container.isotope({ filter: '*' }); }
						$('.gallery_info').text($(this).text());
					});
				});
				$('#gallery_thumbnails_ctx li').each(function() {
					$(this).on('click', function() {
						
						var _self = $(this);
						var _caption = _self.data('caption');
						var _category = _self.data('cat');
						gallery_current = $('#gallery_thumbnails_ctx li:visible').index(this);
						
						if(gallery_current <= 0) { $('.gallery_prev').hide(); $('.gallery_next').show(); }
						else if(gallery_current+1 >= $('#gallery_thumbnails_ctx li:visible').length) { $('.gallery_next').hide(); $('.gallery_prev').show(); }
						else { $('.gallery_next, .gallery_prev').show(); }

						if( $('#gallery_thumbnails_ctx li:visible').length <= 1 ){
							$('.gallery_next, .gallery_prev').hide();
						}
						
						$('#gallery_thumbnails_ctx li').removeClass('current');
						_self.addClass('current');
						
						$('#gallery_preview > img.resp, #gallery_preview > iframe').fadeOut(750, function() { $(this).remove(); });
						
						if(_self.data('type') == 'image') {
							var _img = new Image();
							_img.onload = function() {
								var _image = $(_img).addClass('resp');								
								_image.prependTo($('#gallery_preview'));
								$('#gallery_preview').resizeCenter({onLoad: function() { 
									$('#gallery_preview > img.resp').animate({'opacity' : 1});
									$('#gallery_caption').show();
									var _index = $('#gallery_thumbnails_ctx li[data-type!="video"]:visible').not( '[data-type="virtual"]' ).index(_self.get(0))+1;
									$('#gallery_caption i.gallery_current').text(_index);
									$('#gallery_caption strong').text(_caption);
									$('#gallery_caption span').text(_category);
									$('.gallery_info').text(_category);
								}});
								$('#gallery_thumbnails').css({'bottom': '0', 'left': '0'});
							};
							_img.src = $(this).data('big');
						} else if(_self.data('type') == 'virtual') {
							$('#gallery_caption').hide();
							$('#gallery_thumbnails').css({'bottom': '-999999px', 'left': '-999999px'});
							if(!($('#gallery_categories').hasClass('closed'))) { 
								$('#gallery_categories').addClass('closed');
							}
							var _iframe = $('<iframe width="100%" height="100%" src="'+ _self.data('big') +'" style="border:0" frameborder="0" allowfullscreen></iframe>');
							if(_is_mobile === true && $('html').hasClass('portrait')) {
								var _mhv = $('#gallery_preview').innerHeight(), _mwv = $('#gallery_preview').innerWidth();
								_iframe.css({
									'width' : _mhv, 
									'height' : _mwv,
									'left' : -(_mhv - _mwv) / 2,
									'bottom' : (_mhv - _mwv) / 2
								});
							}
							_iframe.prependTo($('#gallery_preview'));
						} else {
							$('#gallery_caption').hide();
							$('#gallery_thumbnails').css({'bottom': '0', 'left': '0'});
							var _video = $('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+ _self.data('big') +'?showinfo=0&rel=0&modestbranding=1&autoplay=1&wmode=opaque" frameborder="0" allowfullscreen></iframe>');
							_video.prependTo($('#gallery_preview'));
						}
						
						var _center = $('#gallery_thumbnails_ctx').innerWidth() / _self.outerWidth(true) / 2;
						$('#gallery_thumbnails_ctx').animate({scrollLeft : _self.position().left - _center*_self.innerWidth() });
					});
				});
				/***/
				$('.gallery_menu').on('click', function() {
					if($('#gallery_categories').hasClass('closed')) { 
						$('#gallery_categories').removeClass('closed'); 
						$('#gallery_preview').removeClass('closed'); 
					} else { 
						$('#gallery_categories').addClass('closed');
						$('#gallery_preview').addClass('closed'); 
					}
				});
				$('.gallery_next').on('click', function() {
					gallery_current = gallery_current + 1;
					$('.gallery_prev, .gallery_next').show();
					$($('#gallery_thumbnails_ctx li:visible').get(gallery_current)).trigger('click');
				});
				$('.gallery_prev').on('click', function() {
					gallery_current = gallery_current - 1;
					$($('#gallery_thumbnails_ctx li:visible').get(gallery_current)).trigger('click');
				});
				$('#gallery_popin span.close').on('click', function() {
					$('#gallery_popin_ctx').fadeOut(750, function() { 
						$('#gallery_popin').children().remove();
						$('#gallery_popin').html('').removeClass('shown'); 
						$('html, body').css('overflow', 'auto');
						$('.main_slideshow ul.cycle').cycle('resume');
					});
				});
				
				if(gallery_current == 0) { $('.gallery_prev').hide(); }
				if(gallery_current+1 >= $('#gallery_thumbnails_ctx li:visible').length) { $('.gallery_next').hide(); }
				makeGalleryScrollable();
				/**/
				if(id === undefined) { id = 0; }
				if(panel !== undefined) { $('.gallery_menu').trigger('click'); }
				
				$('#gallery_caption i.gallery_total').text($('#gallery_thumbnails_ctx li[data-type!="video"]:visible').length - $('#gallery_thumbnails_ctx li[data-type="virtual"]:visible').length);
				$($('#gallery_thumbnails_ctx li:visible').get(id)).trigger('click');
				
				$('#gallery_popin').addClass('shown');

				if (category) {
					$('#gallery_popin li[data-tag='+category+']').trigger('click');
				}

			}
		}
	});

}

var makeGalleryScrollable = function() {
	
	var _width = $('#gallery_thumbnails_ctx li:visible').length * $('#gallery_thumbnails_ctx li:visible').outerWidth(true);
	var $container = $('#gallery_thumbnails_ctx > ul');
	$container.width(_width);
	
	var $scrollable = $('#gallery_thumbnails_ctx'),
		$scrollbar  = $('.gallery_scrollbar_track'),
		_w   = $scrollable.outerWidth(true)-$('.gallery_scrollbar_bar').position().left,
		_sW  = $scrollable[0].scrollWidth,
		_sbW = _w*_w/_sW;
		
	$('.gallery_scrollbar_track').width( _sbW ).draggable({
		axis : 'x',
		containment : '.gallery_scrollbar_bar', 
		drag: function(e, ui) { $scrollable.scrollLeft( _sW/_w*ui.position.left  ); }
	}); 

	$scrollable.on("scroll", function(){ $scrollbar.css({left: $scrollable.scrollLeft()/_w*_sbW }); });
	
};


function slideShow() {
	
	$('.main_slideshow').appendTo($('#main_slideshow'));
	var carouselContent, carouselIndex, carouselLength, firstItem, secondItem, isAnimating, itemWidth, prelastItem, lastItem, transitionTime, initialLength;
	initialLength = $('.main_slideshow > ul > li').length;
	carouselContent = $("#main_slideshow .main_slideshow > ul"), nextItem = $('<span class="main_slideshow_next"></span>'), prevItem = $('<span class="main_slideshow_prev"></span>'),
	carouselIndex = 2;
	isAnimating = false;
	$('#main_slideshow').addClass($('#main_slideshow .main_slideshow').data('type'));
	if(initialLength > 1) {
		nextItem.appendTo('#main_slideshow .main_slideshow');
		prevItem.appendTo('#main_slideshow .main_slideshow');
		carouselLength = carouselContent.children().length;
		firstItem = $(carouselContent.children()[0]);
		secondItem = $(carouselContent.children()[1]);
		prelastItem = $(carouselContent.children()[carouselLength - 2]);
		lastItem = $(carouselContent.children()[carouselLength - 1]);
		firstItem.clone().appendTo(carouselContent);
		secondItem.clone().appendTo(carouselContent);
		lastItem.clone().prependTo(carouselContent);
		prelastItem.clone().prependTo(carouselContent);	
		carouselLength = carouselContent.children().length;
	}
	if( $("html").hasClass("ie8") ) {
		itemWidth = $('#main_slideshow .cycle li').innerWidth();
	} else {
		itemWidth = 100 / carouselLength;
	}
	transitionTime = 1000;
	if( $("html").hasClass("ie8") ) {
		carouselContent.css("width", carouselLength * itemWidth);
		var _container = $('<div class="ctx"></div>');
		_container.prependTo($("#main_slideshow .main_slideshow"));
		carouselContent.appendTo(_container);
		carouselContent.css("left", - itemWidth * carouselIndex);
	} else {
		carouselContent.css("width", carouselLength * 100 + "%");
		carouselContent.transition({x: (2 * -itemWidth) + "%"}, 0);
	}	
	$($('#main_slideshow .cycle li').get(2)).attr('data-current', 'current');
	$.each(carouselContent.children(), function() {
		if( $("html").hasClass("ie8") ) {
			return $(this).css("width", itemWidth + "px"); 
		} else {
			return $(this).css("width", itemWidth + "%"); 
		}
	});
	$('#main_slideshow .cycle li').each(function() { var _self = $(this); $(this).resizeCenter({onLoad: function() { _self.find('img').animate({'opacity' : 1}); } }); });
	prevItem.on("click", function() {
		if (isAnimating) { return; }
		isAnimating = true;
		carouselIndex--;
		$('#main_slideshow .cycle li').attr('data-current', '');
		$($('#main_slideshow .cycle li').get(carouselIndex)).attr('data-current', 'current');	
		if( $("html").hasClass("ie8") ) {
			carouselContent.animate({'left' : carouselIndex * -itemWidth + 'px'}, transitionTime, "easeInOutCirc", function() {
			  isAnimating = false;			  
			  if (carouselIndex === 1) {
				carouselIndex = carouselLength - 3;
				$('#main_slideshow .cycle li').attr('data-current', '');
				$($('#main_slideshow .cycle li').get(carouselIndex)).attr('data-current', 'current');
				carouselContent.css('left', -itemWidth * carouselIndex + "px");
			  }
			});
		} else {
			return carouselContent.transition({
				x: (carouselIndex * -itemWidth) + "%"
			}, transitionTime, "easeInOutCirc", function() {
			  isAnimating = false;			  
			  if (carouselIndex === 1) {
				carouselIndex = carouselLength - 3;
				$('#main_slideshow .cycle li').attr('data-current', '');
				$($('#main_slideshow .cycle li').get(carouselIndex)).attr('data-current', 'current');
				return carouselContent.transition({
				  x: -itemWidth * carouselIndex + "%"
				}, 0);
			  }
			});
		}
	});

	nextItem.on("click", function() {
		if (isAnimating) { return; }
		isAnimating = true;
		carouselIndex++;
		$('#main_slideshow .cycle li').attr('data-current', '');
		$($('#main_slideshow .cycle li').get(carouselIndex)).attr('data-current', 'current');	
		if( $("html").hasClass("ie8") ) {
			carouselContent.animate({'left' : carouselIndex * -itemWidth + 'px'}, transitionTime, "easeInOutCirc", function() {
			  isAnimating = false;			
			  if (carouselIndex === carouselLength - 2) {
				carouselIndex = 2;
				$('#main_slideshow .cycle li').attr('data-current', '');
				$($('#main_slideshow .cycle li').get(carouselIndex)).attr('data-current', 'current');
				carouselContent.css('left', -itemWidth * carouselIndex + "px");
			  }
			});
		} else {
			return carouselContent.transition({
			  x: (carouselIndex * -itemWidth) + "%"
			}, transitionTime, "easeInOutCirc", function() {
			  isAnimating = false;
			  if (carouselIndex === carouselLength - 2) {
				carouselIndex = 2;
				$('#main_slideshow .cycle li').attr('data-current', '');
				$($('#main_slideshow .cycle li').get(carouselIndex)).attr('data-current', 'current');
				return carouselContent.transition({
				  x: -itemWidth * carouselIndex + "%"
				}, 0);
			  }
			});
		}
	});

};


/**
* Get YouTube ID from various YouTube URL
* @author: takien
* @url: http://takien.com
* For PHP YouTube parser, go here http://takien.com/864
*/

function YouTubeGetID(url){
  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) { ID = url[2].split(/[^0-9a-z_\-]/i); ID = ID[0]; }
  else { ID = url; }
  return ID;
}

/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function(){function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,o=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=o,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var o={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",o):e.eventie=o}(this),function(e,t){"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof exports?module.exports=t(e,require("wolfy87-eventemitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(window,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"===d.call(e)}function o(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0,i=e.length;i>n;n++)t.push(e[n]);else t.push(e);return t}function s(e,t,n){if(!(this instanceof s))return new s(e,t);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=o(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),a&&(this.jqDeferred=new a.Deferred);var r=this;setTimeout(function(){r.check()})}function f(e){this.img=e}function c(e){this.src=e,v[e]=this}var a=e.jQuery,u=e.console,h=u!==void 0,d=Object.prototype.toString;s.prototype=new t,s.prototype.options={},s.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);var i=n.nodeType;if(i&&(1===i||9===i||11===i))for(var r=n.querySelectorAll("img"),o=0,s=r.length;s>o;o++){var f=r[o];this.addImage(f)}}},s.prototype.addImage=function(e){var t=new f(e);this.images.push(t)},s.prototype.check=function(){function e(e,r){return t.options.debug&&h&&u.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},s.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify&&t.jqDeferred.notify(t,e)})},s.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},a&&(a.fn.imagesLoaded=function(e,t){var n=new s(this,e,t);return n.jqDeferred.promise(a(this))}),f.prototype=new t,f.prototype.check=function(){var e=v[this.img.src]||new c(this.img.src);if(e.isConfirmed)return this.confirm(e.isLoaded,"cached was confirmed"),void 0;if(this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this;e.on("confirm",function(e,n){return t.confirm(e.isLoaded,n),!0}),e.check()},f.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("confirm",this,t)};var v={};return c.prototype=new t,c.prototype.check=function(){if(!this.isChecked){var e=new Image;n.bind(e,"load",this),n.bind(e,"error",this),e.src=this.src,this.isChecked=!0}},c.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},c.prototype.onload=function(e){this.confirm(!0,"onload"),this.unbindProxyEvents(e)},c.prototype.onerror=function(e){this.confirm(!1,"onerror"),this.unbindProxyEvents(e)},c.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},c.prototype.unbindProxyEvents=function(e){n.unbind(e.target,"load",this),n.unbind(e.target,"error",this)},s});

/**
 * jQuery Horizontal Navigation 1.0
 * https://github.com/sebnitu/horizontalNav
 *
 * By Sebastian Nitu - Copyright 2014 - All rights reserved
 * Author URL: http://sebnitu.com
 */
;(function(e){e.fn.horizontalNav=function(t){"use strict";var n=e.extend({},e.fn.horizontalNav.defaults,t);return this.each(function(){function l(e){return e.innerWidth()-(parseInt(e.css("padding-left"))+parseInt(e.css("padding-right")))}function c(t,n){n=n||100;var r;e(window).resize(function(){clearTimeout(r);r=setTimeout(function(){t()},n)})}function h(){if(r.tableDisplay!=true||e.browser.msie&&parseInt(e.browser.version,10)<=7){s.css({"float":"left"});o.css({"float":"left",width:"auto"});f.css({"padding-left":0,"padding-right":0});var n=l(s),c=s.outerWidth(true),h=c-n,p=l(i),d=p-h-n,v=Math.floor(d/a);o.each(function(t){var n=l(e(this));e(this).css({width:n+v+"px"})});var m=l(u)+(p-h-l(s));if(e.browser.mozilla||e.browser.msie){m=m-1}u.css({width:m+"px"})}else{s.css({display:"table","float":"none",width:"100%"});o.css({display:"table-cell","float":"none"})}t.addClass("horizontalNav-processed").removeClass("horizontalNav-notprocessed")}var t=e(this);var r=e.meta?e.extend({},n,t.data()):n;if(t.is("ul")){var i=t.parent()}else{var i=t}var s=t.is("ul")?t:i.find("> ul"),o=s.find("> li"),u=o.last(),a=o.size(),f=o.find("> a");if(r.minimumItems&&r.minimumItems>a){t.addClass("horizontalNav-notprocessed");return false}if(r.responsive===true){if(r.tableDisplay!=true||e.browser.msie&&parseInt(e.browser.version,10)<=7){c(h,r.responsiveDelay)}}if(e(".clearHorizontalNav").length){i.css({zoom:"1"})}else{i.css({zoom:"1"}).append('<div class="clearHorizontalNav">');e(".clearHorizontalNav").css({display:"block",overflow:"hidden",visibility:"hidden",width:0,height:0,clear:"both"})}h()})};e.fn.horizontalNav.defaults={responsive:true,responsiveDelay:100,tableDisplay:true,minimumItems:0}})(jQuery)

/*!
 * Isotope PACKAGED v2.2.2
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2015 Metafizzy
 */

!function(a){function b(){}function c(a){function c(b){b.prototype.option||(b.prototype.option=function(b){a.isPlainObject(b)&&(this.options=a.extend(!0,this.options,b))})}function e(b,c){a.fn[b]=function(e){if("string"==typeof e){for(var g=d.call(arguments,1),h=0,i=this.length;i>h;h++){var j=this[h],k=a.data(j,b);if(k)if(a.isFunction(k[e])&&"_"!==e.charAt(0)){var l=k[e].apply(k,g);if(void 0!==l)return l}else f("no such method '"+e+"' for "+b+" instance");else f("cannot call methods on "+b+" prior to initialization; attempted to call '"+e+"'")}return this}return this.each(function(){var d=a.data(this,b);d?(d.option(e),d._init()):(d=new c(this,e),a.data(this,b,d))})}}if(a){var f="undefined"==typeof console?b:function(a){console.error(a)};return a.bridget=function(a,b){c(b),e(a,b)},a.bridget}}var d=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],c):c("object"==typeof exports?require("jquery"):a.jQuery)}(window),function(a){function b(b){var c=a.event;return c.target=c.target||c.srcElement||b,c}var c=document.documentElement,d=function(){};c.addEventListener?d=function(a,b,c){a.addEventListener(b,c,!1)}:c.attachEvent&&(d=function(a,c,d){a[c+d]=d.handleEvent?function(){var c=b(a);d.handleEvent.call(d,c)}:function(){var c=b(a);d.call(a,c)},a.attachEvent("on"+c,a[c+d])});var e=function(){};c.removeEventListener?e=function(a,b,c){a.removeEventListener(b,c,!1)}:c.detachEvent&&(e=function(a,b,c){a.detachEvent("on"+b,a[b+c]);try{delete a[b+c]}catch(d){a[b+c]=void 0}});var f={bind:d,unbind:e};"function"==typeof define&&define.amd?define("eventie/eventie",f):"object"==typeof exports?module.exports=f:a.eventie=f}(window),function(){"use strict";function a(){}function b(a,b){for(var c=a.length;c--;)if(a[c].listener===b)return c;return-1}function c(a){return function(){return this[a].apply(this,arguments)}}var d=a.prototype,e=this,f=e.EventEmitter;d.getListeners=function(a){var b,c,d=this._getEvents();if(a instanceof RegExp){b={};for(c in d)d.hasOwnProperty(c)&&a.test(c)&&(b[c]=d[c])}else b=d[a]||(d[a]=[]);return b},d.flattenListeners=function(a){var b,c=[];for(b=0;b<a.length;b+=1)c.push(a[b].listener);return c},d.getListenersAsObject=function(a){var b,c=this.getListeners(a);return c instanceof Array&&(b={},b[a]=c),b||c},d.addListener=function(a,c){var d,e=this.getListenersAsObject(a),f="object"==typeof c;for(d in e)e.hasOwnProperty(d)&&-1===b(e[d],c)&&e[d].push(f?c:{listener:c,once:!1});return this},d.on=c("addListener"),d.addOnceListener=function(a,b){return this.addListener(a,{listener:b,once:!0})},d.once=c("addOnceListener"),d.defineEvent=function(a){return this.getListeners(a),this},d.defineEvents=function(a){for(var b=0;b<a.length;b+=1)this.defineEvent(a[b]);return this},d.removeListener=function(a,c){var d,e,f=this.getListenersAsObject(a);for(e in f)f.hasOwnProperty(e)&&(d=b(f[e],c),-1!==d&&f[e].splice(d,1));return this},d.off=c("removeListener"),d.addListeners=function(a,b){return this.manipulateListeners(!1,a,b)},d.removeListeners=function(a,b){return this.manipulateListeners(!0,a,b)},d.manipulateListeners=function(a,b,c){var d,e,f=a?this.removeListener:this.addListener,g=a?this.removeListeners:this.addListeners;if("object"!=typeof b||b instanceof RegExp)for(d=c.length;d--;)f.call(this,b,c[d]);else for(d in b)b.hasOwnProperty(d)&&(e=b[d])&&("function"==typeof e?f.call(this,d,e):g.call(this,d,e));return this},d.removeEvent=function(a){var b,c=typeof a,d=this._getEvents();if("string"===c)delete d[a];else if(a instanceof RegExp)for(b in d)d.hasOwnProperty(b)&&a.test(b)&&delete d[b];else delete this._events;return this},d.removeAllListeners=c("removeEvent"),d.emitEvent=function(a,b){var c,d,e,f,g=this.getListenersAsObject(a);for(e in g)if(g.hasOwnProperty(e))for(d=g[e].length;d--;)c=g[e][d],c.once===!0&&this.removeListener(a,c.listener),f=c.listener.apply(this,b||[]),f===this._getOnceReturnValue()&&this.removeListener(a,c.listener);return this},d.trigger=c("emitEvent"),d.emit=function(a){var b=Array.prototype.slice.call(arguments,1);return this.emitEvent(a,b)},d.setOnceReturnValue=function(a){return this._onceReturnValue=a,this},d._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},d._getEvents=function(){return this._events||(this._events={})},a.noConflict=function(){return e.EventEmitter=f,a},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return a}):"object"==typeof module&&module.exports?module.exports=a:e.EventEmitter=a}.call(this),function(a){function b(a){if(a){if("string"==typeof d[a])return a;a=a.charAt(0).toUpperCase()+a.slice(1);for(var b,e=0,f=c.length;f>e;e++)if(b=c[e]+a,"string"==typeof d[b])return b}}var c="Webkit Moz ms Ms O".split(" "),d=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return b}):"object"==typeof exports?module.exports=b:a.getStyleProperty=b}(window),function(a,b){function c(a){var b=parseFloat(a),c=-1===a.indexOf("%")&&!isNaN(b);return c&&b}function d(){}function e(){for(var a={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},b=0,c=h.length;c>b;b++){var d=h[b];a[d]=0}return a}function f(b){function d(){if(!m){m=!0;var d=a.getComputedStyle;if(j=function(){var a=d?function(a){return d(a,null)}:function(a){return a.currentStyle};return function(b){var c=a(b);return c||g("Style returned "+c+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),c}}(),k=b("boxSizing")){var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style[k]="border-box";var f=document.body||document.documentElement;f.appendChild(e);var h=j(e);l=200===c(h.width),f.removeChild(e)}}}function f(a){if(d(),"string"==typeof a&&(a=document.querySelector(a)),a&&"object"==typeof a&&a.nodeType){var b=j(a);if("none"===b.display)return e();var f={};f.width=a.offsetWidth,f.height=a.offsetHeight;for(var g=f.isBorderBox=!(!k||!b[k]||"border-box"!==b[k]),m=0,n=h.length;n>m;m++){var o=h[m],p=b[o];p=i(a,p);var q=parseFloat(p);f[o]=isNaN(q)?0:q}var r=f.paddingLeft+f.paddingRight,s=f.paddingTop+f.paddingBottom,t=f.marginLeft+f.marginRight,u=f.marginTop+f.marginBottom,v=f.borderLeftWidth+f.borderRightWidth,w=f.borderTopWidth+f.borderBottomWidth,x=g&&l,y=c(b.width);y!==!1&&(f.width=y+(x?0:r+v));var z=c(b.height);return z!==!1&&(f.height=z+(x?0:s+w)),f.innerWidth=f.width-(r+v),f.innerHeight=f.height-(s+w),f.outerWidth=f.width+t,f.outerHeight=f.height+u,f}}function i(b,c){if(a.getComputedStyle||-1===c.indexOf("%"))return c;var d=b.style,e=d.left,f=b.runtimeStyle,g=f&&f.left;return g&&(f.left=b.currentStyle.left),d.left=c,c=d.pixelLeft,d.left=e,g&&(f.left=g),c}var j,k,l,m=!1;return f}var g="undefined"==typeof console?d:function(a){console.error(a)},h=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],f):"object"==typeof exports?module.exports=f(require("desandro-get-style-property")):a.getSize=f(a.getStyleProperty)}(window),function(a){function b(a){"function"==typeof a&&(b.isReady?a():g.push(a))}function c(a){var c="readystatechange"===a.type&&"complete"!==f.readyState;b.isReady||c||d()}function d(){b.isReady=!0;for(var a=0,c=g.length;c>a;a++){var d=g[a];d()}}function e(e){return"complete"===f.readyState?d():(e.bind(f,"DOMContentLoaded",c),e.bind(f,"readystatechange",c),e.bind(a,"load",c)),b}var f=a.document,g=[];b.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],e):"object"==typeof exports?module.exports=e(require("eventie")):a.docReady=e(a.eventie)}(window),function(a){"use strict";function b(a,b){return a[g](b)}function c(a){if(!a.parentNode){var b=document.createDocumentFragment();b.appendChild(a)}}function d(a,b){c(a);for(var d=a.parentNode.querySelectorAll(b),e=0,f=d.length;f>e;e++)if(d[e]===a)return!0;return!1}function e(a,d){return c(a),b(a,d)}var f,g=function(){if(a.matches)return"matches";if(a.matchesSelector)return"matchesSelector";for(var b=["webkit","moz","ms","o"],c=0,d=b.length;d>c;c++){var e=b[c],f=e+"MatchesSelector";if(a[f])return f}}();if(g){var h=document.createElement("div"),i=b(h,"div");f=i?b:e}else f=d;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return f}):"object"==typeof exports?module.exports=f:window.matchesSelector=f}(Element.prototype),function(a,b){"use strict";"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["doc-ready/doc-ready","matches-selector/matches-selector"],function(c,d){return b(a,c,d)}):"object"==typeof exports?module.exports=b(a,require("doc-ready"),require("desandro-matches-selector")):a.fizzyUIUtils=b(a,a.docReady,a.matchesSelector)}(window,function(a,b,c){var d={};d.extend=function(a,b){for(var c in b)a[c]=b[c];return a},d.modulo=function(a,b){return(a%b+b)%b};var e=Object.prototype.toString;d.isArray=function(a){return"[object Array]"==e.call(a)},d.makeArray=function(a){var b=[];if(d.isArray(a))b=a;else if(a&&"number"==typeof a.length)for(var c=0,e=a.length;e>c;c++)b.push(a[c]);else b.push(a);return b},d.indexOf=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},d.removeFrom=function(a,b){var c=d.indexOf(a,b);-1!=c&&a.splice(c,1)},d.isElement="function"==typeof HTMLElement||"object"==typeof HTMLElement?function(a){return a instanceof HTMLElement}:function(a){return a&&"object"==typeof a&&1==a.nodeType&&"string"==typeof a.nodeName},d.setText=function(){function a(a,c){b=b||(void 0!==document.documentElement.textContent?"textContent":"innerText"),a[b]=c}var b;return a}(),d.getParent=function(a,b){for(;a!=document.body;)if(a=a.parentNode,c(a,b))return a},d.getQueryElement=function(a){return"string"==typeof a?document.querySelector(a):a},d.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},d.filterFindElements=function(a,b){a=d.makeArray(a);for(var e=[],f=0,g=a.length;g>f;f++){var h=a[f];if(d.isElement(h))if(b){c(h,b)&&e.push(h);for(var i=h.querySelectorAll(b),j=0,k=i.length;k>j;j++)e.push(i[j])}else e.push(h)}return e},d.debounceMethod=function(a,b,c){var d=a.prototype[b],e=b+"Timeout";a.prototype[b]=function(){var a=this[e];a&&clearTimeout(a);var b=arguments,f=this;this[e]=setTimeout(function(){d.apply(f,b),delete f[e]},c||100)}},d.toDashed=function(a){return a.replace(/(.)([A-Z])/g,function(a,b,c){return b+"-"+c}).toLowerCase()};var f=a.console;return d.htmlInit=function(c,e){b(function(){for(var b=d.toDashed(e),g=document.querySelectorAll(".js-"+b),h="data-"+b+"-options",i=0,j=g.length;j>i;i++){var k,l=g[i],m=l.getAttribute(h);try{k=m&&JSON.parse(m)}catch(n){f&&f.error("Error parsing "+h+" on "+l.nodeName.toLowerCase()+(l.id?"#"+l.id:"")+": "+n);continue}var o=new c(l,k),p=a.jQuery;p&&p.data(l,e,o)}})},d}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property","fizzy-ui-utils/utils"],function(c,d,e,f){return b(a,c,d,e,f)}):"object"==typeof exports?module.exports=b(a,require("wolfy87-eventemitter"),require("get-size"),require("desandro-get-style-property"),require("fizzy-ui-utils")):(a.Outlayer={},a.Outlayer.Item=b(a,a.EventEmitter,a.getSize,a.getStyleProperty,a.fizzyUIUtils))}(window,function(a,b,c,d,e){"use strict";function f(a){for(var b in a)return!1;return b=null,!0}function g(a,b){a&&(this.element=a,this.layout=b,this.position={x:0,y:0},this._create())}function h(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}var i=a.getComputedStyle,j=i?function(a){return i(a,null)}:function(a){return a.currentStyle},k=d("transition"),l=d("transform"),m=k&&l,n=!!d("perspective"),o={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[k],p=["transform","transition","transitionDuration","transitionProperty"],q=function(){for(var a={},b=0,c=p.length;c>b;b++){var e=p[b],f=d(e);f&&f!==e&&(a[e]=f)}return a}();e.extend(g.prototype,b.prototype),g.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},g.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},g.prototype.getSize=function(){this.size=c(this.element)},g.prototype.css=function(a){var b=this.element.style;for(var c in a){var d=q[c]||c;b[d]=a[c]}},g.prototype.getPosition=function(){var a=j(this.element),b=this.layout.options,c=b.isOriginLeft,d=b.isOriginTop,e=a[c?"left":"right"],f=a[d?"top":"bottom"],g=this.layout.size,h=-1!=e.indexOf("%")?parseFloat(e)/100*g.width:parseInt(e,10),i=-1!=f.indexOf("%")?parseFloat(f)/100*g.height:parseInt(f,10);h=isNaN(h)?0:h,i=isNaN(i)?0:i,h-=c?g.paddingLeft:g.paddingRight,i-=d?g.paddingTop:g.paddingBottom,this.position.x=h,this.position.y=i},g.prototype.layoutPosition=function(){var a=this.layout.size,b=this.layout.options,c={},d=b.isOriginLeft?"paddingLeft":"paddingRight",e=b.isOriginLeft?"left":"right",f=b.isOriginLeft?"right":"left",g=this.position.x+a[d];c[e]=this.getXValue(g),c[f]="";var h=b.isOriginTop?"paddingTop":"paddingBottom",i=b.isOriginTop?"top":"bottom",j=b.isOriginTop?"bottom":"top",k=this.position.y+a[h];c[i]=this.getYValue(k),c[j]="",this.css(c),this.emitEvent("layout",[this])},g.prototype.getXValue=function(a){var b=this.layout.options;return b.percentPosition&&!b.isHorizontal?a/this.layout.size.width*100+"%":a+"px"},g.prototype.getYValue=function(a){var b=this.layout.options;return b.percentPosition&&b.isHorizontal?a/this.layout.size.height*100+"%":a+"px"},g.prototype._transitionTo=function(a,b){this.getPosition();var c=this.position.x,d=this.position.y,e=parseInt(a,10),f=parseInt(b,10),g=e===this.position.x&&f===this.position.y;if(this.setPosition(a,b),g&&!this.isTransitioning)return void this.layoutPosition();var h=a-c,i=b-d,j={};j.transform=this.getTranslate(h,i),this.transition({to:j,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},g.prototype.getTranslate=function(a,b){var c=this.layout.options;return a=c.isOriginLeft?a:-a,b=c.isOriginTop?b:-b,n?"translate3d("+a+"px, "+b+"px, 0)":"translate("+a+"px, "+b+"px)"},g.prototype.goTo=function(a,b){this.setPosition(a,b),this.layoutPosition()},g.prototype.moveTo=m?g.prototype._transitionTo:g.prototype.goTo,g.prototype.setPosition=function(a,b){this.position.x=parseInt(a,10),this.position.y=parseInt(b,10)},g.prototype._nonTransition=function(a){this.css(a.to),a.isCleaning&&this._removeStyles(a.to);for(var b in a.onTransitionEnd)a.onTransitionEnd[b].call(this)},g.prototype._transition=function(a){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(a);var b=this._transn;for(var c in a.onTransitionEnd)b.onEnd[c]=a.onTransitionEnd[c];for(c in a.to)b.ingProperties[c]=!0,a.isCleaning&&(b.clean[c]=!0);if(a.from){this.css(a.from);var d=this.element.offsetHeight;d=null}this.enableTransition(a.to),this.css(a.to),this.isTransitioning=!0};var r="opacity,"+h(q.transform||"transform");g.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:r,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(o,this,!1))},g.prototype.transition=g.prototype[k?"_transition":"_nonTransition"],g.prototype.onwebkitTransitionEnd=function(a){this.ontransitionend(a)},g.prototype.onotransitionend=function(a){this.ontransitionend(a)};var s={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};g.prototype.ontransitionend=function(a){if(a.target===this.element){var b=this._transn,c=s[a.propertyName]||a.propertyName;if(delete b.ingProperties[c],f(b.ingProperties)&&this.disableTransition(),c in b.clean&&(this.element.style[a.propertyName]="",delete b.clean[c]),c in b.onEnd){var d=b.onEnd[c];d.call(this),delete b.onEnd[c]}this.emitEvent("transitionEnd",[this])}},g.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(o,this,!1),this.isTransitioning=!1},g.prototype._removeStyles=function(a){var b={};for(var c in a)b[c]="";this.css(b)};var t={transitionProperty:"",transitionDuration:""};return g.prototype.removeTransitionStyles=function(){this.css(t)},g.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},g.prototype.remove=function(){if(!k||!parseFloat(this.layout.options.transitionDuration))return void this.removeElem();var a=this;this.once("transitionEnd",function(){a.removeElem()}),this.hide()},g.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var a=this.layout.options,b={},c=this.getHideRevealTransitionEndProperty("visibleStyle");b[c]=this.onRevealTransitionEnd,this.transition({from:a.hiddenStyle,to:a.visibleStyle,isCleaning:!0,onTransitionEnd:b})},g.prototype.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},g.prototype.getHideRevealTransitionEndProperty=function(a){var b=this.layout.options[a];if(b.opacity)return"opacity";for(var c in b)return c},g.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var a=this.layout.options,b={},c=this.getHideRevealTransitionEndProperty("hiddenStyle");b[c]=this.onHideTransitionEnd,this.transition({from:a.visibleStyle,to:a.hiddenStyle,isCleaning:!0,onTransitionEnd:b})},g.prototype.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},g.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},g}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","eventEmitter/EventEmitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(c,d,e,f,g){return b(a,c,d,e,f,g)}):"object"==typeof exports?module.exports=b(a,require("eventie"),require("wolfy87-eventemitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):a.Outlayer=b(a,a.eventie,a.EventEmitter,a.getSize,a.fizzyUIUtils,a.Outlayer.Item)}(window,function(a,b,c,d,e,f){"use strict";function g(a,b){var c=e.getQueryElement(a);if(!c)return void(h&&h.error("Bad element for "+this.constructor.namespace+": "+(c||a)));this.element=c,i&&(this.$element=i(this.element)),this.options=e.extend({},this.constructor.defaults),this.option(b);var d=++k;this.element.outlayerGUID=d,l[d]=this,this._create(),this.options.isInitLayout&&this.layout()}var h=a.console,i=a.jQuery,j=function(){},k=0,l={};return g.namespace="outlayer",g.Item=f,g.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},e.extend(g.prototype,c.prototype),g.prototype.option=function(a){e.extend(this.options,a)},g.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),e.extend(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},g.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},g.prototype._itemize=function(a){for(var b=this._filterFindItemElements(a),c=this.constructor.Item,d=[],e=0,f=b.length;f>e;e++){var g=b[e],h=new c(g,this);d.push(h)}return d},g.prototype._filterFindItemElements=function(a){return e.filterFindElements(a,this.options.itemSelector)},g.prototype.getItemElements=function(){for(var a=[],b=0,c=this.items.length;c>b;b++)a.push(this.items[b].element);return a},g.prototype.layout=function(){this._resetLayout(),this._manageStamps();var a=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,a),this._isLayoutInited=!0},g.prototype._init=g.prototype.layout,g.prototype._resetLayout=function(){this.getSize()},g.prototype.getSize=function(){this.size=d(this.element)},g.prototype._getMeasurement=function(a,b){var c,f=this.options[a];f?("string"==typeof f?c=this.element.querySelector(f):e.isElement(f)&&(c=f),this[a]=c?d(c)[b]:f):this[a]=0},g.prototype.layoutItems=function(a,b){a=this._getItemsForLayout(a),this._layoutItems(a,b),this._postLayout()},g.prototype._getItemsForLayout=function(a){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c];e.isIgnored||b.push(e)}return b},g.prototype._layoutItems=function(a,b){if(this._emitCompleteOnItems("layout",a),a&&a.length){for(var c=[],d=0,e=a.length;e>d;d++){var f=a[d],g=this._getItemLayoutPosition(f);g.item=f,g.isInstant=b||f.isLayoutInstant,c.push(g)}this._processLayoutQueue(c)}},g.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},g.prototype._processLayoutQueue=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];this._positionItem(d.item,d.x,d.y,d.isInstant)}},g.prototype._positionItem=function(a,b,c,d){d?a.goTo(b,c):a.moveTo(b,c)},g.prototype._postLayout=function(){this.resizeContainer()},g.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var a=this._getContainerSize();a&&(this._setContainerMeasure(a.width,!0),this._setContainerMeasure(a.height,!1))}},g.prototype._getContainerSize=j,g.prototype._setContainerMeasure=function(a,b){if(void 0!==a){var c=this.size;c.isBorderBox&&(a+=b?c.paddingLeft+c.paddingRight+c.borderLeftWidth+c.borderRightWidth:c.paddingBottom+c.paddingTop+c.borderTopWidth+c.borderBottomWidth),a=Math.max(a,0),this.element.style[b?"width":"height"]=a+"px"}},g.prototype._emitCompleteOnItems=function(a,b){function c(){e.dispatchEvent(a+"Complete",null,[b])}function d(){g++,g===f&&c()}var e=this,f=b.length;if(!b||!f)return void c();for(var g=0,h=0,i=b.length;i>h;h++){var j=b[h];j.once(a,d)}},g.prototype.dispatchEvent=function(a,b,c){var d=b?[b].concat(c):c;if(this.emitEvent(a,d),i)if(this.$element=this.$element||i(this.element),b){var e=i.Event(b);e.type=a,this.$element.trigger(e,c)}else this.$element.trigger(a,c)},g.prototype.ignore=function(a){var b=this.getItem(a);b&&(b.isIgnored=!0)},g.prototype.unignore=function(a){var b=this.getItem(a);b&&delete b.isIgnored},g.prototype.stamp=function(a){if(a=this._find(a)){this.stamps=this.stamps.concat(a);for(var b=0,c=a.length;c>b;b++){var d=a[b];this.ignore(d)}}},g.prototype.unstamp=function(a){if(a=this._find(a))for(var b=0,c=a.length;c>b;b++){var d=a[b];e.removeFrom(this.stamps,d),this.unignore(d)}},g.prototype._find=function(a){return a?("string"==typeof a&&(a=this.element.querySelectorAll(a)),a=e.makeArray(a)):void 0},g.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var a=0,b=this.stamps.length;b>a;a++){var c=this.stamps[a];this._manageStamp(c)}}},g.prototype._getBoundingRect=function(){var a=this.element.getBoundingClientRect(),b=this.size;this._boundingRect={left:a.left+b.paddingLeft+b.borderLeftWidth,top:a.top+b.paddingTop+b.borderTopWidth,right:a.right-(b.paddingRight+b.borderRightWidth),bottom:a.bottom-(b.paddingBottom+b.borderBottomWidth)}},g.prototype._manageStamp=j,g.prototype._getElementOffset=function(a){var b=a.getBoundingClientRect(),c=this._boundingRect,e=d(a),f={left:b.left-c.left-e.marginLeft,top:b.top-c.top-e.marginTop,right:c.right-b.right-e.marginRight,bottom:c.bottom-b.bottom-e.marginBottom};return f},g.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},g.prototype.bindResize=function(){this.isResizeBound||(b.bind(a,"resize",this),this.isResizeBound=!0)},g.prototype.unbindResize=function(){this.isResizeBound&&b.unbind(a,"resize",this),this.isResizeBound=!1},g.prototype.onresize=function(){function a(){b.resize(),delete b.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var b=this;this.resizeTimeout=setTimeout(a,100)},g.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},g.prototype.needsResizeLayout=function(){var a=d(this.element),b=this.size&&a;return b&&a.innerWidth!==this.size.innerWidth},g.prototype.addItems=function(a){var b=this._itemize(a);return b.length&&(this.items=this.items.concat(b)),b},g.prototype.appended=function(a){var b=this.addItems(a);b.length&&(this.layoutItems(b,!0),this.reveal(b))},g.prototype.prepended=function(a){var b=this._itemize(a);if(b.length){var c=this.items.slice(0);this.items=b.concat(c),this._resetLayout(),this._manageStamps(),this.layoutItems(b,!0),this.reveal(b),this.layoutItems(c)}},g.prototype.reveal=function(a){this._emitCompleteOnItems("reveal",a);for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.reveal()}},g.prototype.hide=function(a){this._emitCompleteOnItems("hide",a);for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.hide()}},g.prototype.revealItemElements=function(a){var b=this.getItems(a);this.reveal(b)},g.prototype.hideItemElements=function(a){var b=this.getItems(a);this.hide(b)},g.prototype.getItem=function(a){for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];if(d.element===a)return d}},g.prototype.getItems=function(a){a=e.makeArray(a);for(var b=[],c=0,d=a.length;d>c;c++){var f=a[c],g=this.getItem(f);g&&b.push(g)}return b},g.prototype.remove=function(a){var b=this.getItems(a);if(this._emitCompleteOnItems("remove",b),b&&b.length)for(var c=0,d=b.length;d>c;c++){var f=b[c];f.remove(),e.removeFrom(this.items,f)}},g.prototype.destroy=function(){var a=this.element.style;a.height="",a.position="",a.width="";for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];d.destroy()}this.unbindResize();var e=this.element.outlayerGUID;delete l[e],delete this.element.outlayerGUID,i&&i.removeData(this.element,this.constructor.namespace)},g.data=function(a){a=e.getQueryElement(a);var b=a&&a.outlayerGUID;return b&&l[b]},g.create=function(a,b){function c(){g.apply(this,arguments)}return Object.create?c.prototype=Object.create(g.prototype):e.extend(c.prototype,g.prototype),c.prototype.constructor=c,c.defaults=e.extend({},g.defaults),e.extend(c.defaults,b),c.prototype.settings={},c.namespace=a,c.data=g.data,c.Item=function(){f.apply(this,arguments)},c.Item.prototype=new f,e.htmlInit(c,a),i&&i.bridget&&i.bridget(a,c),c},g.Item=f,g}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("isotope/js/item",["outlayer/outlayer"],b):"object"==typeof exports?module.exports=b(require("outlayer")):(a.Isotope=a.Isotope||{},a.Isotope.Item=b(a.Outlayer))}(window,function(a){"use strict";function b(){a.Item.apply(this,arguments)}b.prototype=new a.Item,b.prototype._create=function(){this.id=this.layout.itemGUID++,a.Item.prototype._create.call(this),this.sortData={}},b.prototype.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var a=this.layout.options.getSortData,b=this.layout._sorters;for(var c in a){var d=b[c];this.sortData[c]=d(this.element,this)}}};var c=b.prototype.destroy;return b.prototype.destroy=function(){c.apply(this,arguments),this.css({display:""})},b}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("isotope/js/layout-mode",["get-size/get-size","outlayer/outlayer"],b):"object"==typeof exports?module.exports=b(require("get-size"),require("outlayer")):(a.Isotope=a.Isotope||{},a.Isotope.LayoutMode=b(a.getSize,a.Outlayer))}(window,function(a,b){"use strict";function c(a){this.isotope=a,a&&(this.options=a.options[this.namespace],this.element=a.element,this.items=a.filteredItems,this.size=a.size)}return function(){function a(a){return function(){return b.prototype[a].apply(this.isotope,arguments)}}for(var d=["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout"],e=0,f=d.length;f>e;e++){var g=d[e];c.prototype[g]=a(g)}}(),c.prototype.needsVerticalResizeLayout=function(){var b=a(this.isotope.element),c=this.isotope.size&&b;return c&&b.innerHeight!=this.isotope.size.innerHeight},c.prototype._getMeasurement=function(){this.isotope._getMeasurement.apply(this,arguments)},c.prototype.getColumnWidth=function(){this.getSegmentSize("column","Width")},c.prototype.getRowHeight=function(){this.getSegmentSize("row","Height")},c.prototype.getSegmentSize=function(a,b){var c=a+b,d="outer"+b;if(this._getMeasurement(c,d),!this[c]){var e=this.getFirstItemSize();this[c]=e&&e[d]||this.isotope.size["inner"+b]}},c.prototype.getFirstItemSize=function(){var b=this.isotope.filteredItems[0];return b&&b.element&&a(b.element)},c.prototype.layout=function(){this.isotope.layout.apply(this.isotope,arguments)},c.prototype.getSize=function(){this.isotope.getSize(),this.size=this.isotope.size},c.modes={},c.create=function(a,b){function d(){c.apply(this,arguments)}return d.prototype=new c,b&&(d.options=b),d.prototype.namespace=a,c.modes[a]=d,d},c}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("masonry/masonry",["outlayer/outlayer","get-size/get-size","fizzy-ui-utils/utils"],b):"object"==typeof exports?module.exports=b(require("outlayer"),require("get-size"),require("fizzy-ui-utils")):a.Masonry=b(a.Outlayer,a.getSize,a.fizzyUIUtils)}(window,function(a,b,c){var d=a.create("masonry");return d.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var a=this.cols;for(this.colYs=[];a--;)this.colYs.push(0);this.maxY=0},d.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var a=this.items[0],c=a&&a.element;this.columnWidth=c&&b(c).outerWidth||this.containerWidth}var d=this.columnWidth+=this.gutter,e=this.containerWidth+this.gutter,f=e/d,g=d-e%d,h=g&&1>g?"round":"floor";f=Math[h](f),this.cols=Math.max(f,1)},d.prototype.getContainerWidth=function(){var a=this.options.isFitWidth?this.element.parentNode:this.element,c=b(a);this.containerWidth=c&&c.innerWidth},d.prototype._getItemLayoutPosition=function(a){a.getSize();var b=a.size.outerWidth%this.columnWidth,d=b&&1>b?"round":"ceil",e=Math[d](a.size.outerWidth/this.columnWidth);e=Math.min(e,this.cols);for(var f=this._getColGroup(e),g=Math.min.apply(Math,f),h=c.indexOf(f,g),i={x:this.columnWidth*h,y:g},j=g+a.size.outerHeight,k=this.cols+1-f.length,l=0;k>l;l++)this.colYs[h+l]=j;return i},d.prototype._getColGroup=function(a){if(2>a)return this.colYs;for(var b=[],c=this.cols+1-a,d=0;c>d;d++){var e=this.colYs.slice(d,d+a);b[d]=Math.max.apply(Math,e)}return b},d.prototype._manageStamp=function(a){var c=b(a),d=this._getElementOffset(a),e=this.options.isOriginLeft?d.left:d.right,f=e+c.outerWidth,g=Math.floor(e/this.columnWidth);g=Math.max(0,g);var h=Math.floor(f/this.columnWidth);h-=f%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var i=(this.options.isOriginTop?d.top:d.bottom)+c.outerHeight,j=g;h>=j;j++)this.colYs[j]=Math.max(i,this.colYs[j])},d.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var a={height:this.maxY};return this.options.isFitWidth&&(a.width=this._getContainerFitWidth()),a},d.prototype._getContainerFitWidth=function(){for(var a=0,b=this.cols;--b&&0===this.colYs[b];)a++;return(this.cols-a)*this.columnWidth-this.gutter},d.prototype.needsResizeLayout=function(){var a=this.containerWidth;return this.getContainerWidth(),a!==this.containerWidth},d}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("isotope/js/layout-modes/masonry",["../layout-mode","masonry/masonry"],b):"object"==typeof exports?module.exports=b(require("../layout-mode"),require("masonry-layout")):b(a.Isotope.LayoutMode,a.Masonry)}(window,function(a,b){"use strict";function c(a,b){for(var c in b)a[c]=b[c];return a}var d=a.create("masonry"),e=d.prototype._getElementOffset,f=d.prototype.layout,g=d.prototype._getMeasurement;
c(d.prototype,b.prototype),d.prototype._getElementOffset=e,d.prototype.layout=f,d.prototype._getMeasurement=g;var h=d.prototype.measureColumns;d.prototype.measureColumns=function(){this.items=this.isotope.filteredItems,h.call(this)};var i=d.prototype._manageStamp;return d.prototype._manageStamp=function(){this.options.isOriginLeft=this.isotope.options.isOriginLeft,this.options.isOriginTop=this.isotope.options.isOriginTop,i.apply(this,arguments)},d}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("isotope/js/layout-modes/fit-rows",["../layout-mode"],b):"object"==typeof exports?module.exports=b(require("../layout-mode")):b(a.Isotope.LayoutMode)}(window,function(a){"use strict";var b=a.create("fitRows");return b.prototype._resetLayout=function(){this.x=0,this.y=0,this.maxY=0,this._getMeasurement("gutter","outerWidth")},b.prototype._getItemLayoutPosition=function(a){a.getSize();var b=a.size.outerWidth+this.gutter,c=this.isotope.size.innerWidth+this.gutter;0!==this.x&&b+this.x>c&&(this.x=0,this.y=this.maxY);var d={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+a.size.outerHeight),this.x+=b,d},b.prototype._getContainerSize=function(){return{height:this.maxY}},b}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("isotope/js/layout-modes/vertical",["../layout-mode"],b):"object"==typeof exports?module.exports=b(require("../layout-mode")):b(a.Isotope.LayoutMode)}(window,function(a){"use strict";var b=a.create("vertical",{horizontalAlignment:0});return b.prototype._resetLayout=function(){this.y=0},b.prototype._getItemLayoutPosition=function(a){a.getSize();var b=(this.isotope.size.innerWidth-a.size.outerWidth)*this.options.horizontalAlignment,c=this.y;return this.y+=a.size.outerHeight,{x:b,y:c}},b.prototype._getContainerSize=function(){return{height:this.y}},b}),function(a,b){"use strict";"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","matches-selector/matches-selector","fizzy-ui-utils/utils","isotope/js/item","isotope/js/layout-mode","isotope/js/layout-modes/masonry","isotope/js/layout-modes/fit-rows","isotope/js/layout-modes/vertical"],function(c,d,e,f,g,h){return b(a,c,d,e,f,g,h)}):"object"==typeof exports?module.exports=b(a,require("outlayer"),require("get-size"),require("desandro-matches-selector"),require("fizzy-ui-utils"),require("./item"),require("./layout-mode"),require("./layout-modes/masonry"),require("./layout-modes/fit-rows"),require("./layout-modes/vertical")):a.Isotope=b(a,a.Outlayer,a.getSize,a.matchesSelector,a.fizzyUIUtils,a.Isotope.Item,a.Isotope.LayoutMode)}(window,function(a,b,c,d,e,f,g){function h(a,b){return function(c,d){for(var e=0,f=a.length;f>e;e++){var g=a[e],h=c.sortData[g],i=d.sortData[g];if(h>i||i>h){var j=void 0!==b[g]?b[g]:b,k=j?1:-1;return(h>i?1:-1)*k}}return 0}}var i=a.jQuery,j=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^\s+|\s+$/g,"")},k=document.documentElement,l=k.textContent?function(a){return a.textContent}:function(a){return a.innerText},m=b.create("isotope",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});m.Item=f,m.LayoutMode=g,m.prototype._create=function(){this.itemGUID=0,this._sorters={},this._getSorters(),b.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"];for(var a in g.modes)this._initLayoutMode(a)},m.prototype.reloadItems=function(){this.itemGUID=0,b.prototype.reloadItems.call(this)},m.prototype._itemize=function(){for(var a=b.prototype._itemize.apply(this,arguments),c=0,d=a.length;d>c;c++){var e=a[c];e.id=this.itemGUID++}return this._updateItemsSortData(a),a},m.prototype._initLayoutMode=function(a){var b=g.modes[a],c=this.options[a]||{};this.options[a]=b.options?e.extend(b.options,c):c,this.modes[a]=new b(this)},m.prototype.layout=function(){return!this._isLayoutInited&&this.options.isInitLayout?void this.arrange():void this._layout()},m.prototype._layout=function(){var a=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,a),this._isLayoutInited=!0},m.prototype.arrange=function(a){function b(){d.reveal(c.needReveal),d.hide(c.needHide)}this.option(a),this._getIsInstant();var c=this._filter(this.items);this.filteredItems=c.matches;var d=this;this._bindArrangeComplete(),this._isInstant?this._noTransition(b):b(),this._sort(),this._layout()},m.prototype._init=m.prototype.arrange,m.prototype._getIsInstant=function(){var a=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;return this._isInstant=a,a},m.prototype._bindArrangeComplete=function(){function a(){b&&c&&d&&e.dispatchEvent("arrangeComplete",null,[e.filteredItems])}var b,c,d,e=this;this.once("layoutComplete",function(){b=!0,a()}),this.once("hideComplete",function(){c=!0,a()}),this.once("revealComplete",function(){d=!0,a()})},m.prototype._filter=function(a){var b=this.options.filter;b=b||"*";for(var c=[],d=[],e=[],f=this._getFilterTest(b),g=0,h=a.length;h>g;g++){var i=a[g];if(!i.isIgnored){var j=f(i);j&&c.push(i),j&&i.isHidden?d.push(i):j||i.isHidden||e.push(i)}}return{matches:c,needReveal:d,needHide:e}},m.prototype._getFilterTest=function(a){return i&&this.options.isJQueryFiltering?function(b){return i(b.element).is(a)}:"function"==typeof a?function(b){return a(b.element)}:function(b){return d(b.element,a)}},m.prototype.updateSortData=function(a){var b;a?(a=e.makeArray(a),b=this.getItems(a)):b=this.items,this._getSorters(),this._updateItemsSortData(b)},m.prototype._getSorters=function(){var a=this.options.getSortData;for(var b in a){var c=a[b];this._sorters[b]=n(c)}},m.prototype._updateItemsSortData=function(a){for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.updateSortData()}};var n=function(){function a(a){if("string"!=typeof a)return a;var c=j(a).split(" "),d=c[0],e=d.match(/^\[(.+)\]$/),f=e&&e[1],g=b(f,d),h=m.sortDataParsers[c[1]];return a=h?function(a){return a&&h(g(a))}:function(a){return a&&g(a)}}function b(a,b){var c;return c=a?function(b){return b.getAttribute(a)}:function(a){var c=a.querySelector(b);return c&&l(c)}}return a}();m.sortDataParsers={parseInt:function(a){return parseInt(a,10)},parseFloat:function(a){return parseFloat(a)}},m.prototype._sort=function(){var a=this.options.sortBy;if(a){var b=[].concat.apply(a,this.sortHistory),c=h(b,this.options.sortAscending);this.filteredItems.sort(c),a!=this.sortHistory[0]&&this.sortHistory.unshift(a)}},m.prototype._mode=function(){var a=this.options.layoutMode,b=this.modes[a];if(!b)throw new Error("No layout mode: "+a);return b.options=this.options[a],b},m.prototype._resetLayout=function(){b.prototype._resetLayout.call(this),this._mode()._resetLayout()},m.prototype._getItemLayoutPosition=function(a){return this._mode()._getItemLayoutPosition(a)},m.prototype._manageStamp=function(a){this._mode()._manageStamp(a)},m.prototype._getContainerSize=function(){return this._mode()._getContainerSize()},m.prototype.needsResizeLayout=function(){return this._mode().needsResizeLayout()},m.prototype.appended=function(a){var b=this.addItems(a);if(b.length){var c=this._filterRevealAdded(b);this.filteredItems=this.filteredItems.concat(c)}},m.prototype.prepended=function(a){var b=this._itemize(a);if(b.length){this._resetLayout(),this._manageStamps();var c=this._filterRevealAdded(b);this.layoutItems(this.filteredItems),this.filteredItems=c.concat(this.filteredItems),this.items=b.concat(this.items)}},m.prototype._filterRevealAdded=function(a){var b=this._filter(a);return this.hide(b.needHide),this.reveal(b.matches),this.layoutItems(b.matches,!0),b.matches},m.prototype.insert=function(a){var b=this.addItems(a);if(b.length){var c,d,e=b.length;for(c=0;e>c;c++)d=b[c],this.element.appendChild(d.element);var f=this._filter(b).matches;for(c=0;e>c;c++)b[c].isLayoutInstant=!0;for(this.arrange(),c=0;e>c;c++)delete b[c].isLayoutInstant;this.reveal(f)}};var o=m.prototype.remove;return m.prototype.remove=function(a){a=e.makeArray(a);var b=this.getItems(a);o.call(this,a);var c=b&&b.length;if(c)for(var d=0;c>d;d++){var f=b[d];e.removeFrom(this.filteredItems,f)}},m.prototype.shuffle=function(){for(var a=0,b=this.items.length;b>a;a++){var c=this.items[a];c.sortData.random=Math.random()}this.options.sortBy="random",this._sort(),this._layout()},m.prototype._noTransition=function(a){var b=this.options.transitionDuration;this.options.transitionDuration=0;var c=a.call(this);return this.options.transitionDuration=b,c},m.prototype.getFilteredItemElements=function(){for(var a=[],b=0,c=this.filteredItems.length;c>b;b++)a.push(this.filteredItems[b].element);return a},m});

/*! jQuery Mobile v1.4.5 | Copyright 2010, 2014 jQuery Foundation, Inc. | jquery.org/license */
/*! ONLY TOUCH EVENTS */
(function(e,t,n){typeof define=="function"&&define.amd?define(["jquery"],function(r){return n(r,e,t),r.mobile}):n(e.jQuery,e,t)})(this,document,function(e,t,n,r){(function(e,t,n,r){function T(e){while(e&&typeof e.originalEvent!="undefined")e=e.originalEvent;return e}function N(t,n){var i=t.type,s,o,a,l,c,h,p,d,v;t=e.Event(t),t.type=n,s=t.originalEvent,o=e.event.props,i.search(/^(mouse|click)/)>-1&&(o=f);if(s)for(p=o.length,l;p;)l=o[--p],t[l]=s[l];i.search(/mouse(down|up)|click/)>-1&&!t.which&&(t.which=1);if(i.search(/^touch/)!==-1){a=T(s),i=a.touches,c=a.changedTouches,h=i&&i.length?i[0]:c&&c.length?c[0]:r;if(h)for(d=0,v=u.length;d<v;d++)l=u[d],t[l]=h[l]}return t}function C(t){var n={},r,s;while(t){r=e.data(t,i);for(s in r)r[s]&&(n[s]=n.hasVirtualBinding=!0);t=t.parentNode}return n}function k(t,n){var r;while(t){r=e.data(t,i);if(r&&(!n||r[n]))return t;t=t.parentNode}return null}function L(){g=!1}function A(){g=!0}function O(){E=0,v.length=0,m=!1,A()}function M(){L()}function _(){D(),c=setTimeout(function(){c=0,O()},e.vmouse.resetTimerDuration)}function D(){c&&(clearTimeout(c),c=0)}function P(t,n,r){var i;if(r&&r[t]||!r&&k(n.target,t))i=N(n,t),e(n.target).trigger(i);return i}function H(t){var n=e.data(t.target,s),r;!m&&(!E||E!==n)&&(r=P("v"+t.type,t),r&&(r.isDefaultPrevented()&&t.preventDefault(),r.isPropagationStopped()&&t.stopPropagation(),r.isImmediatePropagationStopped()&&t.stopImmediatePropagation()))}function B(t){var n=T(t).touches,r,i,o;n&&n.length===1&&(r=t.target,i=C(r),i.hasVirtualBinding&&(E=w++,e.data(r,s,E),D(),M(),d=!1,o=T(t).touches[0],h=o.pageX,p=o.pageY,P("vmouseover",t,i),P("vmousedown",t,i)))}function j(e){if(g)return;d||P("vmousecancel",e,C(e.target)),d=!0,_()}function F(t){if(g)return;var n=T(t).touches[0],r=d,i=e.vmouse.moveDistanceThreshold,s=C(t.target);d=d||Math.abs(n.pageX-h)>i||Math.abs(n.pageY-p)>i,d&&!r&&P("vmousecancel",t,s),P("vmousemove",t,s),_()}function I(e){if(g)return;A();var t=C(e.target),n,r;P("vmouseup",e,t),d||(n=P("vclick",e,t),n&&n.isDefaultPrevented()&&(r=T(e).changedTouches[0],v.push({touchID:E,x:r.clientX,y:r.clientY}),m=!0)),P("vmouseout",e,t),d=!1,_()}function q(t){var n=e.data(t,i),r;if(n)for(r in n)if(n[r])return!0;return!1}function R(){}function U(t){var n=t.substr(1);return{setup:function(){q(this)||e.data(this,i,{});var r=e.data(this,i);r[t]=!0,l[t]=(l[t]||0)+1,l[t]===1&&b.bind(n,H),e(this).bind(n,R),y&&(l.touchstart=(l.touchstart||0)+1,l.touchstart===1&&b.bind("touchstart",B).bind("touchend",I).bind("touchmove",F).bind("scroll",j))},teardown:function(){--l[t],l[t]||b.unbind(n,H),y&&(--l.touchstart,l.touchstart||b.unbind("touchstart",B).unbind("touchmove",F).unbind("touchend",I).unbind("scroll",j));var r=e(this),s=e.data(this,i);s&&(s[t]=!1),r.unbind(n,R),q(this)||r.removeData(i)}}}var i="virtualMouseBindings",s="virtualTouchID",o="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),u="clientX clientY pageX pageY screenX screenY".split(" "),a=e.event.mouseHooks?e.event.mouseHooks.props:[],f=e.event.props.concat(a),l={},c=0,h=0,p=0,d=!1,v=[],m=!1,g=!1,y="addEventListener"in n,b=e(n),w=1,E=0,S,x;e.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(x=0;x<o.length;x++)e.event.special[o[x]]=U(o[x]);y&&n.addEventListener("click",function(t){var n=v.length,r=t.target,i,o,u,a,f,l;if(n){i=t.clientX,o=t.clientY,S=e.vmouse.clickDistanceThreshold,u=r;while(u){for(a=0;a<n;a++){f=v[a],l=0;if(u===r&&Math.abs(f.x-i)<S&&Math.abs(f.y-o)<S||e.data(u,s)===f.touchID){t.preventDefault(),t.stopPropagation();return}}u=u.parentNode}}},!0)})(e,t,n),function(e){e.mobile={}}(e),function(e,t){var r={touch:"ontouchend"in n};e.mobile.support=e.mobile.support||{},e.extend(e.support,r),e.extend(e.mobile.support,r)}(e),function(e,t,r){function l(t,n,i,s){var o=i.type;i.type=n,s?e.event.trigger(i,r,t):e.event.dispatch.call(t,i),i.type=o}var i=e(n),s=e.mobile.support.touch,o="touchmove scroll",u=s?"touchstart":"mousedown",a=s?"touchend":"mouseup",f=s?"touchmove":"mousemove";e.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),function(t,n){e.fn[n]=function(e){return e?this.bind(n,e):this.trigger(n)},e.attrFn&&(e.attrFn[n]=!0)}),e.event.special.scrollstart={enabled:!0,setup:function(){function s(e,n){r=n,l(t,r?"scrollstart":"scrollstop",e)}var t=this,n=e(t),r,i;n.bind(o,function(t){if(!e.event.special.scrollstart.enabled)return;r||s(t,!0),clearTimeout(i),i=setTimeout(function(){s(t,!1)},50)})},teardown:function(){e(this).unbind(o)}},e.event.special.tap={tapholdThreshold:750,emitTapOnTaphold:!0,setup:function(){var t=this,n=e(t),r=!1;n.bind("vmousedown",function(s){function a(){clearTimeout(u)}function f(){a(),n.unbind("vclick",c).unbind("vmouseup",a),i.unbind("vmousecancel",f)}function c(e){f(),!r&&o===e.target?l(t,"tap",e):r&&e.preventDefault()}r=!1;if(s.which&&s.which!==1)return!1;var o=s.target,u;n.bind("vmouseup",a).bind("vclick",c),i.bind("vmousecancel",f),u=setTimeout(function(){e.event.special.tap.emitTapOnTaphold||(r=!0),l(t,"taphold",e.Event("taphold",{target:o}))},e.event.special.tap.tapholdThreshold)})},teardown:function(){e(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup"),i.unbind("vmousecancel")}},e.event.special.swipe={scrollSupressionThreshold:30,durationThreshold:1e3,horizontalDistanceThreshold:30,verticalDistanceThreshold:30,getLocation:function(e){var n=t.pageXOffset,r=t.pageYOffset,i=e.clientX,s=e.clientY;if(e.pageY===0&&Math.floor(s)>Math.floor(e.pageY)||e.pageX===0&&Math.floor(i)>Math.floor(e.pageX))i-=n,s-=r;else if(s<e.pageY-r||i<e.pageX-n)i=e.pageX-n,s=e.pageY-r;return{x:i,y:s}},start:function(t){var n=t.originalEvent.touches?t.originalEvent.touches[0]:t,r=e.event.special.swipe.getLocation(n);return{time:(new Date).getTime(),coords:[r.x,r.y],origin:e(t.target)}},stop:function(t){var n=t.originalEvent.touches?t.originalEvent.touches[0]:t,r=e.event.special.swipe.getLocation(n);return{time:(new Date).getTime(),coords:[r.x,r.y]}},handleSwipe:function(t,n,r,i){if(n.time-t.time<e.event.special.swipe.durationThreshold&&Math.abs(t.coords[0]-n.coords[0])>e.event.special.swipe.horizontalDistanceThreshold&&Math.abs(t.coords[1]-n.coords[1])<e.event.special.swipe.verticalDistanceThreshold){var s=t.coords[0]>n.coords[0]?"swipeleft":"swiperight";return l(r,"swipe",e.Event("swipe",{target:i,swipestart:t,swipestop:n}),!0),l(r,s,e.Event(s,{target:i,swipestart:t,swipestop:n}),!0),!0}return!1},eventInProgress:!1,setup:function(){var t,n=this,r=e(n),s={};t=e.data(this,"mobile-events"),t||(t={length:0},e.data(this,"mobile-events",t)),t.length++,t.swipe=s,s.start=function(t){if(e.event.special.swipe.eventInProgress)return;e.event.special.swipe.eventInProgress=!0;var r,o=e.event.special.swipe.start(t),u=t.target,l=!1;s.move=function(t){if(!o||t.isDefaultPrevented())return;r=e.event.special.swipe.stop(t),l||(l=e.event.special.swipe.handleSwipe(o,r,n,u),l&&(e.event.special.swipe.eventInProgress=!1)),Math.abs(o.coords[0]-r.coords[0])>e.event.special.swipe.scrollSupressionThreshold&&t.preventDefault()},s.stop=function(){l=!0,e.event.special.swipe.eventInProgress=!1,i.off(f,s.move),s.move=null},i.on(f,s.move).one(a,s.stop)},r.on(u,s.start)},teardown:function(){var t,n;t=e.data(this,"mobile-events"),t&&(n=t.swipe,delete t.swipe,t.length--,t.length===0&&e.removeData(this,"mobile-events")),n&&(n.start&&e(this).off(u,n.start),n.move&&i.off(f,n.move),n.stop&&i.off(a,n.stop))}},e.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe.left",swiperight:"swipe.right"},function(t,n){e.event.special[t]={setup:function(){e(this).bind(n,e.noop)},teardown:function(){e(this).unbind(n)}}})}(e,this)});

/**************/

if(document.getElementById('hp_video') !== undefined) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.onload = function() { };
	document.getElementsByTagName("head")[0].appendChild(script);
	script.src = 'https://www.youtube.com/iframe_api';

	var player, player_h, slideshow_orig_h;
	function onYouTubePlayerAPIReady() {
		player = new YT.Player('hp_video', {
			videoId: jQuery('#hp_video').attr('data-videoid'),
			playerVars: {
				controls: 0,
				cc_load_policy: 0,
				enablejsapi: 1,
				fs: 0,
				modestbranding: 1,
				rel: 0,
				showinfo: 0,
				iv_load_policy: 3,
			},
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	}

	function onPlayerReady(event) {
		player.seekTo((typeof(_video_start) !== 'undefined' ? _video_start : 0));
		player.pauseVideo();
		if(typeof(_video_start) !== 'undefined') { player.setVolume(0); }
		slideshow_orig_h = $('#main_slideshow').innerHeight();
		player_h = $('#video-container').innerHeight();
	}

	function stopVideo() {
		$('body').removeClass('playing-video');
		$('#booking, .mute_video, .stop_video').removeAttr('style');
		$('#booking, .main_slideshow').css('opacity',1);
		$('#main_slideshow').height(slideshow_orig_h);
		$('.mute_video').removeClass('mute');
		player.seekTo((typeof(_video_start) !== 'undefined' ? _video_start : 0));
		player.pauseVideo();
		player.setVolume(0);
	}

	function onPlayerStateChange(event) {
		if(event.data === 1) {
			if(typeof(_video_start) !== 'undefined') {
				var i = 0;
				riseVolume = setInterval( function() {
					i++;
					player.setVolume(i);
					if(i >= 100) {clearInterval(riseVolume);}
				}, 100);
			}
			if(typeof(_video_end) !== 'undefined') {
				var checkTime = setInterval( function() {
					if(player.getCurrentTime() >= (_video_end - 12)) {
						clearInterval(checkTime);
						var i = 100;
						if(!$('.mute_video').hasClass('muted')) {
							var lowVolume = setInterval( function() {
								i--;
								player.setVolume(i);
								if(i <= 0) {
									clearInterval(lowVolume);
									setTimeout(function() { stopVideo(); }, 1800);
								}
							}, 100);
						} else {
							setTimeout(function() { stopVideo(); }, 11800);
						}
					}
				}, 1000);
			}
		} else if(event.data === 0) { stopVideo(); }
	}

}


/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */
(function(d){function m(a){if(a in j.style)return a;var b=["Moz","Webkit","O","ms"],c=a.charAt(0).toUpperCase()+a.substr(1);if(a in j.style)return a;for(a=0;a<b.length;++a){var d=b[a]+c;if(d in j.style)return d}}function l(a){"string"===typeof a&&this.parse(a);return this}function q(a,b,c,e){var h=[];d.each(a,function(a){a=d.camelCase(a);a=d.transit.propertyMap[a]||d.cssProps[a]||a;a=a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()});-1===d.inArray(a,h)&&h.push(a)});d.cssEase[c]&&(c=d.cssEase[c]);
var f=""+n(b)+" "+c;0<parseInt(e,10)&&(f+=" "+n(e));var g=[];d.each(h,function(a,b){g.push(b+" "+f)});return g.join(", ")}function f(a,b){b||(d.cssNumber[a]=!0);d.transit.propertyMap[a]=e.transform;d.cssHooks[a]={get:function(b){return d(b).css("transit:transform").get(a)},set:function(b,e){var h=d(b).css("transit:transform");h.setFromString(a,e);d(b).css({"transit:transform":h})}}}function g(a,b){return"string"===typeof a&&!a.match(/^[\-0-9\.]+$/)?a:""+a+b}function n(a){d.fx.speeds[a]&&(a=d.fx.speeds[a]);
return g(a,"ms")}d.transit={version:"0.9.9",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:!0,useTransitionEnd:!1};var j=document.createElement("div"),e={},r=-1<navigator.userAgent.toLowerCase().indexOf("chrome");e.transition=m("transition");e.transitionDelay=m("transitionDelay");e.transform=m("transform");e.transformOrigin=m("transformOrigin");j.style[e.transform]=
"";j.style[e.transform]="rotateY(90deg)";e.transform3d=""!==j.style[e.transform];var p=e.transitionEnd={transition:"transitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"}[e.transition]||null,k;for(k in e)e.hasOwnProperty(k)&&"undefined"===typeof d.support[k]&&(d.support[k]=e[k]);j=null;d.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",
easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",
easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};d.cssHooks["transit:transform"]={get:function(a){return d(a).data("transform")||
new l},set:function(a,b){var c=b;c instanceof l||(c=new l(c));a.style[e.transform]="WebkitTransform"===e.transform&&!r?c.toString(!0):c.toString();d(a).data("transform",c)}};d.cssHooks.transform={set:d.cssHooks["transit:transform"].set};"1.8">d.fn.jquery&&(d.cssHooks.transformOrigin={get:function(a){return a.style[e.transformOrigin]},set:function(a,b){a.style[e.transformOrigin]=b}},d.cssHooks.transition={get:function(a){return a.style[e.transition]},set:function(a,b){a.style[e.transition]=b}});f("scale");
f("translate");f("rotate");f("rotateX");f("rotateY");f("rotate3d");f("perspective");f("skewX");f("skewY");f("x",!0);f("y",!0);l.prototype={setFromString:function(a,b){var c="string"===typeof b?b.split(","):b.constructor===Array?b:[b];c.unshift(a);l.prototype.set.apply(this,c)},set:function(a){var b=Array.prototype.slice.apply(arguments,[1]);this.setter[a]?this.setter[a].apply(this,b):this[a]=b.join(",")},get:function(a){return this.getter[a]?this.getter[a].apply(this):this[a]||0},setter:{rotate:function(a){this.rotate=
g(a,"deg")},rotateX:function(a){this.rotateX=g(a,"deg")},rotateY:function(a){this.rotateY=g(a,"deg")},scale:function(a,b){void 0===b&&(b=a);this.scale=a+","+b},skewX:function(a){this.skewX=g(a,"deg")},skewY:function(a){this.skewY=g(a,"deg")},perspective:function(a){this.perspective=g(a,"px")},x:function(a){this.set("translate",a,null)},y:function(a){this.set("translate",null,a)},translate:function(a,b){void 0===this._translateX&&(this._translateX=0);void 0===this._translateY&&(this._translateY=0);
null!==a&&void 0!==a&&(this._translateX=g(a,"px"));null!==b&&void 0!==b&&(this._translateY=g(b,"px"));this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var a=(this.scale||"1,1").split(",");a[0]&&(a[0]=parseFloat(a[0]));a[1]&&(a[1]=parseFloat(a[1]));return a[0]===a[1]?a[0]:a},rotate3d:function(){for(var a=(this.rotate3d||"0,0,0,0deg").split(","),b=0;3>=b;++b)a[b]&&(a[b]=parseFloat(a[b]));
a[3]&&(a[3]=g(a[3],"deg"));return a}},parse:function(a){var b=this;a.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(a,d,e){b.setFromString(d,e)})},toString:function(a){var b=[],c;for(c in this)if(this.hasOwnProperty(c)&&(e.transform3d||!("rotateX"===c||"rotateY"===c||"perspective"===c||"transformOrigin"===c)))"_"!==c[0]&&(a&&"scale"===c?b.push(c+"3d("+this[c]+",1)"):a&&"translate"===c?b.push(c+"3d("+this[c]+",0)"):b.push(c+"("+this[c]+")"));return b.join(" ")}};d.fn.transition=d.fn.transit=function(a,
b,c,f){var h=this,g=0,j=!0;"function"===typeof b&&(f=b,b=void 0);"function"===typeof c&&(f=c,c=void 0);"undefined"!==typeof a.easing&&(c=a.easing,delete a.easing);"undefined"!==typeof a.duration&&(b=a.duration,delete a.duration);"undefined"!==typeof a.complete&&(f=a.complete,delete a.complete);"undefined"!==typeof a.queue&&(j=a.queue,delete a.queue);"undefined"!==typeof a.delay&&(g=a.delay,delete a.delay);"undefined"===typeof b&&(b=d.fx.speeds._default);"undefined"===typeof c&&(c=d.cssEase._default);
b=n(b);var l=q(a,b,c,g),k=d.transit.enabled&&e.transition?parseInt(b,10)+parseInt(g,10):0;if(0===k)return b=j,c=function(b){h.css(a);f&&f.apply(h);b&&b()},!0===b?h.queue(c):b?h.queue(b,c):c(),h;var m={};b=j;c=function(b){var c=0;"MozTransition"===e.transition&&25>c&&(c=25);window.setTimeout(function(){var c=!1,g=function(){c&&h.unbind(p,g);0<k&&h.each(function(){this.style[e.transition]=m[this]||null});"function"===typeof f&&f.apply(h);"function"===typeof b&&b()};0<k&&p&&d.transit.useTransitionEnd?
(c=!0,h.bind(p,g)):window.setTimeout(g,k);h.each(function(){0<k&&(this.style[e.transition]=l);d(this).css(a)})},c)};!0===b?h.queue(c):b?h.queue(b,c):c();return this};d.transit.getTransitionValue=q})(jQuery);

(function($){
	$(document).ready(function() {
		// Sticky Book button for Restaurant and Special offers
		// Restaurant
		if ($(document.body).hasClass('page-template-template-restaurant')) {
			var bookatable_button = $('#wrapper > .w-container > .right-column a.restaurant_order');
			if (bookatable_button.length > 0) {
				// Desktop
				var newButton = $('<a>', {
					href: '#',
					class: 'btn meeting_order anchors_table_booking_link',
					text: bookatable_button.text()
				});
				newButton.prependTo('#subnav .subnav .w-container');
				newButton.click(function(e) {
					e.preventDefault();
					bookatable_button.trigger('click');
				});

				// Mobile
				var mobileButton = newButton.clone();
				mobileButton.off('click');
				mobileButton.attr('class', 'btn mobile_table_booking_link');
				mobileButton.appendTo('#container');
				$('#book_button').remove();
				mobileButton.click(function(e) {
					e.preventDefault();
					if (bookatable_button.attr('href').match(/^https?:\/\/.+/)) {
						window.open(bookatable_button.attr('href'), '_blank');
					} else {
						$('html,body').stop().animate({
							'scrollTop': $('.popin_form').offset().top - $('#header').height()
						});
					}
				});
			}
		}

		// Offer
		if ($(document.body).hasClass('single-offers')) {
			var has_booking_form = $('.right-column #bookingform').length > 0;
			var custom_button = $('.offer_custom_button a');
			var links_to_restaurant_page = $('.offer_restaurant_button_container').length > 0;
			var has_custom_button_form = custom_button.length > 0 && custom_button.attr('href') == 'javascript:;';
			var has_custom_button_link = custom_button.length > 0 && (!! custom_button.attr('href').match(/^https?:\/\/.+/));
			var is_bookable = ( has_booking_form || links_to_restaurant_page || has_custom_button_form || has_custom_button_link );
			if (is_bookable) {
				var book_offer_text = '';
				if (has_booking_form) {
					book_offer_text = $.trim($('#bookingform > strong:first-child').text());
				} else if (links_to_restaurant_page) {
					book_offer_text = $.trim($('.offer_restaurant_button_container').find('a').eq(0).text());
				} else if (has_custom_button_form || has_custom_button_link) {
					book_offer_text = $.trim(custom_button.text());
				}
				if (book_offer_text == '') {
					book_offer_text = 'Book this offer';
				}
				// Desktop + Mobile (mobile/custom.js moves this to the right place when on mobile)
				var newButton = $('<a>', {
					href: '#',
					id: 'book_button',
					text: book_offer_text
				});
				newButton.insertAfter('#header nav .w-container > ul');
				newButton.click(function() {
					if (has_booking_form) {
						$('html,body').stop().animate({
							'scrollTop': $('#bookingform').offset().top - $('#header').height()
						});
					} else if (links_to_restaurant_page) {
						location.href = $('.offer_restaurant_button_container').find('a').eq(0).attr('href');
					} else if (has_custom_button_form ) {
						if ($('html').hasClass('mobile')) {
							$('html,body').stop().animate({
								'scrollTop': $('.pop_form').offset().top - $('#header').height()
							});
						} else {
							custom_button.trigger('click');
						}
					} else if (has_custom_button_link) {
						window.open(custom_button.attr('href'), '_blank');
					}
				});
			}
		}

		// Flex Header menu
		function resizeNavUl() {
			if ($('html').hasClass('mobile')) {
				return;
			}
			var wContainerWidth = $('#header nav > .w-container').width();
			var ul = $('#header nav > .w-container > ul');
			var bookNow = $('#header nav > .w-container > #book_button');
			var isHome = $(document.body).hasClass('home');
			var bookNowWidth = 0;
			var buttonVisible = !isHome || bookNow.hasClass('shown');
			if (!buttonVisible) {
				bookNowWidth = 0;
			} else {
				bookNowWidth = $('#header nav > .w-container > #book_button').outerWidth(true) || 0;
			}

			ul[buttonVisible ? 'addClass' : 'removeClass']('flex').css('width', wContainerWidth - bookNowWidth - 1);
		}
		resizeNavUl();
		$(window).resize(resizeNavUl);
		$(document).on('book_button_alter', resizeNavUl);
		//meeting table
		if ($('body').hasClass('page-template-template-meeting')) {
			function meetingSelectTable() {
				var wraps = $('.section_meeting_table.table');
				wraps.each(function () {
					var wrap = $(this),
							select = wrap.find('.filter_table'),
							hiddenClass = 'hidden_on_mobile';

					if (select.length > 0 && _is_mobile) {
						select.change(function () {
							var $this = $(this),
									filter = $this.find(':selected').attr('data-filter-value'),
									cell = wrap.find('.element_to_filter');

							cell.addClass(hiddenClass);
							wrap.find(filter).removeClass(hiddenClass);

						})
					}
				})
			}
			meetingSelectTable();
		}
	});
})(jQuery);
