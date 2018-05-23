var s, beast = {

	config: {
		currSection: 'info'
	},

	init: function() {
		s = this.config
		var that = this

		if(!Modernizr.touch){ that.loadFirst() }
		that.superSlideStuff()
		if(!Modernizr.touch){ that.mouseSlide.init() }
		that.nav()
		that.posterReveal()
		that.vimeo()
		that.contact()
		that.goFullscreen()
		if(Modernizr.touch){ that.mobile.init() }

		$("a[href^='http://']").attr("target","_blank");
		
	},

	loadFirst: function(){
		$('.slides-container>li:first-child').imagesLoaded(function(){
			var that = $(this)
			$('.logo').removeClass('pulse')
			$('.cover').fadeOut('slow').remove()
		})
		$('.slides-container').imagesLoaded(function(){
			beast.loadSlideshows()
		})
	},

	superSlideStuff: function(){
		$('#slides').superslides({
			slide_easing: 'easeInOutCubic',
			slide_speed: Modernizr.touch ? 300 : 800,
			pagination: true,
			hashchange: true,
			texthash: true,
			scrollable: true
		});

		$('#slides').on('animated.slides', function(){
			if(Modernizr.touch){
				$('.project-nav, .titles').show()
				$('.project-drawer').hide()
				$('.infoClose').removeClass('infoClose').html('i').css('font-size',18)
			}
			$('.reveal').fadeIn((Modernizr.touch ? 600 : 800))
		}).on('begintransition.slides', function(){
			$('.reveal').fadeOut((Modernizr.touch ? 50 : 300))
			s.currSection = 'info'
		})

		$('.fader').hide()
	},

	loadSlideshows: function(){
		$('.alt-backgrounds').each(function(){
			var $that = $(this)

			$('<img/>').attr('src', $that.data('left')).one('load', function() {
				$that.append('<div style="background-image: url('+$that.data('left')+');" class="fader" id="fader-left"></div>')
			}).each(function() {
  				if(this.complete) $(this).load()
			})

			$('<img/>').attr('src', $that.data('right')).one('load', function() {
				$that.append('<div style="background-image: url('+$that.data('right')+');" class="fader" id="fader-right"></div>')
			}).each(function() {
  				if(this.complete) $(this).load()
			})
		})
	},

	mouseSlide: {
		opts: {
			pos: null,
			winW: $(window).width()
		},

		init: function(){
			var that = this
			that.opts.winW = $(window).width()

			that.moveMouse()
			that.winResize()
			
		},

		winResize: function(){
			var that = this

			$(window).on('resize', that.throttle(function() {
				that.opts.winW = $(window).width()
			}, 250));
		},

		moveMouse: function(){
			var that = this

			$('.slides-container>li').each(function(){
				$(this).on('mousemove', that.throttle(function(e) {
					if(e.pageX <= that.opts.winW/3){
						if(that.opts.pos != 'left'){
							that.opts.pos = 'left'
							$(this).find('#fader-left').fadeIn(1000)
							$(this).find('#fader-right').fadeOut(1000)
						}
				  	} else if(e.pageX >= (that.opts.winW/3)*2) {
				  		if(that.opts.pos != 'right'){
							that.opts.pos = 'right'
							$(this).find('#fader-right').fadeIn(1000)
							$(this).find('#fader-left').fadeOut(1000)
						}
				  	} else {
				  		that.opts.pos = null
				  		$(this).find('.fader').fadeOut(1000)
				  	}
				}, 200));
			});
		},

		throttle: function(fn, threshhold, scope) {
			threshhold || (threshhold = 250);
			var last,
				deferTimer;
			return function () {
			    var context = scope || this;

			    var now = +new Date,
			        args = arguments;
			    if (last && now < last + threshhold) {
					clearTimeout(deferTimer);
			    	deferTimer = setTimeout(function () {
			        	last = now;
			        	fn.apply(context, args);
			    	}, threshhold);
			    } else {
			    	last = now;
			    	fn.apply(context, args);
			    }
			};
		}
	},

	nav: function(){
		var navW = $('nav.slides-pagination a').size()
		navW = (navW*39)+((navW-1)*25)
		$('nav.slides-pagination').css({'margin-left':-navW/2})

		var book_icon = new Image();
		book_icon.onload = function() {
			$('nav.slides-pagination').css('visibility', 'visible');
		}
		book_icon.src = './_img/book_icon.png';
	},

	posterReveal: function(){
		if(!Modernizr.touch) {
			$('.reveal').each(function(){
				var $that = $(this)
				$(this).hover(function(){
					$(this).stop().animate({'margin-top':-($that.find('.titles').height()-50)},500)
					$(this).find('.project-nav').stop().animate({'height':130},500, function(){
						$that.find('.'+s.currSection).show()
						$that.find('.subLink[rel="'+s.currSection+'"]').addClass('active')
						$that.find('.project-drawer').stop().fadeIn(500)	
					})
					$(this).parents('.content').siblings('.fade').addClass('focus')
				}, function(){
					$(this).find('.project-drawer').stop().fadeOut(500, function(){
						$that.find('.subLink').removeClass('active')
						$that.find('.project-drawer>div').hide()
						$(this).parents('.reveal').stop().animate({'margin-top':20},500)
						$that.find('.project-nav').stop().animate({'height':64},500)
					})
					$(this).parents('.content').siblings('.fade').removeClass('focus')
				})
			})
		} 

		$('.subLink').each(function(){
			$(this).click(function(){
				if(s.currSection != $(this).attr('rel')){
					s.currSection = $(this).attr('rel')
					$(this).siblings('.subLink').removeClass('active')
					$(this).addClass('active')
					var $that = $(this).parents('.project-nav').siblings('.project-drawer')
					$that.stop().fadeOut(250, function(){
						$(this).children().hide()
						$(this).children('.'+s.currSection).show()
						$(this).fadeIn()
					})
				}
				
			})
		})

	},

	vimeo: function(){
		$('.play').each(function(){
			$(this).click(function(){
				var vimeoID = $(this).attr('rel')
				if(Modernizr.touch && $(window).width()<700) {
					window.location = 'http://player.vimeo.com/video/'+vimeoID	
					
				} else {
					$('.logo').addClass('rotate')
					$('.vimeo').html('<div class="close"></div><iframe style="visibility:hidden;" onload="this.style.visibility = \'visible\'; $(\'.logo\').fadeTo(200,0);" src="http://player.vimeo.com/video/'+vimeoID+'?autoplay=1" width="960" height="541" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>').fadeIn(function(){
						$('.vimeo iframe').show()
						$('.close').click(function(){ $('.vimeo').fadeOut().empty(); $('.logo').removeClass('rotate').fadeTo(200,1) })
					})
				}
			})
		})
	},

	contact: function(){
		$('header').hover(function(){
			$('.black-overlay').addClass('peek')
		}, function(){
			$('.black-overlay').removeClass('peek')
		})

		$('header').click(function(){
			$('.black-overlay').addClass('cover')
			$('nav.slides-navigation').addClass('visuallyhidden')
			$('header').addClass('hidden')
			$('.black-overlay .close').fadeIn()
		})

		$('.black-overlay .close').click(function(){
			$('.black-overlay').removeClass('cover')
			$('header').removeClass('hidden')
			$('.black-overlay .close').fadeOut()
			if($(window).width()<=480) $('nav.slides-navigation').removeClass('visuallyhidden')
		})

		$('.aboutLink').each(function(){
			$(this).click(function(){
				var section = $(this).attr('rel')
				$(this).siblings('.aboutLink').removeClass('active')
				$(this).addClass('active')
				var $that = $(this).parents('.about-header').siblings('.about-text')
				$that.stop().fadeOut(250, function(){
					$(this).children().hide()
					$(this).children('.'+section).show()
					$(this).fadeIn()
				})

				
			})
		})

	},

	goFullscreen: function(){
		$('.fs').click(function(){
			BigScreen.toggle()
		})
	},

	mobile: {

		init: function(){	

			if($(window).width()<=480) $('nav.slides-navigation').removeClass('visuallyhidden')
			setTimeout(function(){
				$('.logo').removeClass('pulse')
				$('.cover').fadeOut('slow').remove()
			},1000)

			$('.alt-backgrounds').remove()

			$('body').on('movestart', function(e) {
				if ((e.distX > e.distY && e.distX < -e.distY) ||
					(e.distX < e.distY && e.distX > -e.distY)) {
						e.preventDefault();
				}
			}).on('swipeleft', function(e) {
				$('.next').click()
			}).on('swiperight', function(e) {
				$('.prev').click()
			})

			$('.infoBtn').each(function(){
				$(this).click(function(){
					if(!$(this).hasClass('infoClose')){
						$(this).addClass('infoClose')
						$(this).siblings('.project-nav, .titles').hide()
						$('header').hide()
						$('nav.slides-navigation').addClass('visuallyhidden')
						$(this).siblings('.project-drawer').fadeIn()
						$(this).parents('li').find('.main').fadeTo(200,0.6)
					} else {
						$(this).removeClass('infoClose')
						$(this).siblings('.project-drawer').hide()
						$(this).siblings('.project-nav, .titles').fadeIn()
						$('header').fadeIn()
						if($(window).width()<=480) $('nav.slides-navigation').removeClass('visuallyhidden')
						$(this).parents('li').find('.main').fadeTo(200,1)
					}
				})
			})

		},


	}

};