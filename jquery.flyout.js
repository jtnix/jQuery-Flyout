/*
 * jQuery FlyOut
 *
 * version 0.21 (July 21, 2008)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * The flyout() method provides an alternate means of loading and display sub-content
 * with a nifty flyout animation technique.
 * Currently, flyout only supports img sub-content.
 *
 * flyout() takes a single object argument:  $().flyout({param:setting, etc..})
 *
 * Settings:
 *
 *			outSpeed:	speed in milliseconds for the flyout animation - default: 1000
 *
 *			inSpeed:	speed in milliseconds for the flyback animation - default: 500
 *
 *			outEase:	the easing method to use for the flyout animation - default: swing
 *
 *			inEase:		the easing method to use for the flyback animation - default: swing
 *			
 *			loadingSrc: the image file to use while an image is being loaded prior to flyout
 *						default: none
 *						
 *			loader: 	the ID for the created flyout div that contains the sub-content
 *						this is currently only useful for multiple skinnings via CSS
 *						default: 'loader'
 *
 *			loaderZIndex: the CSS z-index for the flyout
 *						default: 500
 *
 *			widthMargin: the left and right margin space for the final flyout
 *						this value is effectively divided between the left and right margin
 *						default: 40
 *			
 *			heightMargin: the top and bottom margin space for the final flyout
 *						this value is effectively divided between the top and bottom margin
 *						default: 40
 *
 * For more details see: http://nixbox.com/demos/jquery.flyout.php
 *
 * @example $('.thumb').flyout();
 * @desc standard flyouts applied to all elements with the 'thumbs' class. 
 * 
 * @example $('.thumb').flyout({loadingSrc:'images/thumb-loading.gif',
								outEase:'easeOutCirc',
								inEase:'easeOutBounce'});
 * @desc flyouts created with different ease in and ease out and a loading animation image is specified
 *
 * @name flyout
 * @type jQuery
 * @param Object options Options which control the flyout animation and content
 * @cat Plugins/Flyout
 * @return jQuery
 * @author Jolyon Terwilliger (jolyon@nixbox.com)
 */


$.fn.extend({flyout : function(options) {
		var shown = false;
		var animating = false;
		var holder;
		var thumb;
		var tloc;
		var th;
		var tw;
		var bigimg = new Image();
		var subType = 'img';
		var offset;
	
		this.click(function() {
			if (animating == true) { return false; }
	
			if (shown) { putAway(this); }
			else { flyOut(this); }
	
			return false;
		});			
		
		var o = jQuery.extend({
			outSpeed : 1000,
			inSpeed : 500,
			outEase : 'swing',
			inEase : 'swing',
			loadingSrc: null,
			loader: 'loader',
			loaderZIndex: 500,
			widthMargin: 40,
			heightMargin: 40,
      offsetX: 0,
      offsetY: 0,
      startHeight: 0,
      startWidth: 0
		}, options);
	
		function flyOut(it) {
			animating = true;
			
			holder = $(it);
			thumb = $('img',it);
			bigimg = new Image(); 
			sL = $(window).scrollLeft();
			sT = $(window).scrollTop();
			tloc = thumb.offset();
      tloc.left = tloc.left + o.offsetX;
      tloc.top = tloc.top + o.offsetY;
			th = (o.startHeight > 0 ? o.startHeight : thumb.height());
			tw = (o.startWidth > 0 ? o.startWidth : thumb.width());
			$('<div></div>').attr('id',o.loader)
							.appendTo('body')
							.css({'position':'absolute',
								'top':tloc.top,
								'left':tloc.left,
								'height':th,
								'width':tw,
								'opacity':.5,
								'display':'block',
								'z-index':o.loaderZIndex});
			if (o.loadingSrc) {
				$('#'+o.loader).append($('<img/>').load(function() {
													$(this)
														.css({'position':'relative',
															 'top':th/2-(this.height/2),
															 'left':tw/2-(this.width/2)})
														.attr('alt','Loading...Please wait');
													})
												.attr('src',o.loadingSrc)
										);
			}
			else {
				$('#'+o.loader).css('background-color','#000')
								.append($('<span></span>').text('loading')
															.css({'position':'relative',
																 'top':'2px',
																 'left':'2px',
																 'color':'#FFF',
																 'font-size':'9px'})
									 	);
			}
			$(bigimg).load(function() {
				imgtag = $('<img/>').attr('src',holder.attr('href')).attr('title',holder.attr('title')+" - Click again to put away.").height(th).width(tw);
	
				max_x = $(window).width()-o.widthMargin;
				max_y = $(window).height()-o.heightMargin;
				
				width = bigimg.width;
				height = bigimg.height;
	
				x_dim = max_x / width;
				y_dim = max_y / height;
	
				if (x_dim <=y_dim) {
					y_dim = x_dim;
				} else {
					x_dim = y_dim;
				}
				
				dw = Math.round(width  * x_dim);
				dh = Math.round(height * y_dim);
				if (dw>width) {dw = width}
				if (dh>height) {dh = height}
				dl = Math.round(($(window).width()/2)-(dw/2)+sL);
				dt = Math.round(($(window).height()/2)-(dh/2)+sT);
	
				$('#'+o.loader).empty().css('opacity',1).append(imgtag).width('auto').height('auto').animate({top:dt, left:dl},{duration:o.outSpeed, queue:false, easing:o.outEase});
				$('#'+o.loader+' '+subType).animate({height:dh, width:dw}, o.outSpeed, o.outEase, function() { 	
																					shown = true;
																					animating=false;
																					$('#'+o.loader+' '+subType).click(function(){putAway(null)})
																				});
			});
			bigimg.src = holder.attr('href');
		}
	
	
		function putAway(next) {
			// not necessary right now, but jic.
			if (animating == true || shown == false) {return false;}
			
			animating = true;
			$('#'+o.loader).animate({top:tloc.top, left:tloc.left},{duration:o.inSpeed, queue:false, easing:o.inEase});
			$('#'+o.loader+' '+subType).animate({height:th, width:tw}, o.inSpeed, o.inEase, function() {
																		 $('#'+o.loader).css('display','none').remove(); 
																		 shown = false;
																		 animating=false;
																		 bigimg=null;			
																		 if (next) {
																			flyOut(next);
																		 }
			});
		}
		
		return this;
		
	}
});
