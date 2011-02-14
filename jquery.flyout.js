/*
 * JQuery FlyOut
 * author: Jolyon Terwilliger - Nixbox Web Consulting
 * website: http://nixbox.com/projects/jquery-image-flyout/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * version 0.21 (July 21, 2008)
 * version 0.22 (July 22, 2008) 
	notes: minor reordering to loadingSrc logic.
 * version 0.23 (August 15, 2008)
 	added: config options for loadingText and closeTip to facilitate locale.
			Thanks Tony for the nudge.
 * version 0.24 (Oct 2, 2008) 
 	added: customize start location and size of flyout, if different 
			from thumb link. Thanks to Jake Kronika for this patch.
 * version 1.0 (Oct 11, 2008) 
 	added: support for final flyout location via destElement and destPadding: 
			define a fixed container anywhere in the document and the pic will 
			fly to that location, regardless of viewport position. 
 	fixed: clicking on open source link no longer reopens same image. 
	added: 4 callbacks for start and finish of flyOut and putAway animations. 
	fixed: putAway function to put back to correct location, in case 
			thumb has moved (page or div scroll, etc)
 * version 1.1 (Nov 16, 2008)
 	fixed: Opera 9.5+ doesn't report window.height() correctly - patched with code
			from jquery Bug 3117:  http://dev.jquery.com/ticket/3117
			note: once this is patched in jQuery core, or fixed in Opera
			this may eventually be removed.
	added: when flyOut image is completed, a customizable class 
			(default to 'shown') is appended to the thumb image container
			so an external event can trigger the click to close any open
			elements. See demo page for example.
 * version 1.2 (Feb 13, 2011)
    added: inOpacity, outOpacity, loaderOpacity and fullSizeImage
	fixed: fixed start and animation positioning if loader has border
			fixed blank space at bottom of image by adding line-height:0px to flyout
			added full closure to plugin to allow cross-library compatitibility
			ran through jsLint and fixed various issues
			removed Opera hack, problem was fixed in version 10 of Opera
 */

/**
 * @author Jolyon Terwilliger (jolyon@nixbox.com)
 *
 * JQuery.flyout() method provides an alternate means of loading and displaying linked
 * images using JQuery animation and easing.
 *
 * flyout() takes a single object argument:  $('.thumbs a').flyout({param:setting, etc..})
 *
 * Settings:
 *
 * @param {integer} outSpeed Speed in milliseconds for the flyout animation - default: 1000
 *
 * @param {integer} inSpeed Speed in milliseconds for the flyback animation - default: 500
 *
 * @param {string} outEase The easing method to use for the flyout animation - default: swing
 *
 * @param {string} inEase The easing method to use for the flyback animation - default: swing
 *			
 * @param {string} loadingSrc The image file to use while an image is being loaded prior to flyout
 *						default: none
 *						
 * @param {string} loader The ID for the created flyout div that contains the sub-content
 *						this is currently only useful for multiple skinnings via CSS
 *						default: 'loader'
 *
 * @param {integer} loaderZIndex The CSS z-index for the flyout
 *						default: 500
 *
 * @param {float} loaderOpacity Set the starting opacity for the loader
 *						default: 0.5 (50% opacity)
 *
 * @param {integer} widthMargin The left and right margin space for the final flyout
 *						this value is effectively divided between the left and right margin
 *						default: 40
 *			
 * @param {integer} heightMargin The top and bottom margin space for the final flyout
 *						this value is effectively divided between the top and bottom margin
 *						default: 40
 *
 * @param {string} loadingText Text shown when image is loading
 *
 * @param {string} closeTip Tip text for image alt/title tags
 *
 * @param {string} destElement The destination container - overrides height and widthMargins
 *						specified in CSS notation - e.g. "#picContainer"
 *						also overrides fullSizeImage option
 *						default: none
 *
 * @param {integer} destPadding Number of pixels to pad when flying out to destElement
 *						default: 10
 *
 * @param {integer} startOffsetX Horizontal offset added to thumb left value for start of flyout animation
 *						Hint: can be negative.
 *						default: 0
 *
 * @param {integer} startOffsetY Vertical offset added to thumb top value for start of flyout animation.
 *						default: 0
 *
 * @param {integer} startHeight Overrides starting height of flyout animation.
 *						default: 0  (uses thumb image height by default)
 *
 * @param {integer} startWidth Overrides starting width of flyout animation.
 *						default: 0  (uses thumb image width by default)
 *
 * @param {string} flyOutStart Function to run at start of flyout animation.
 *						default: none
 *
 * @param {string} flyOutFinish Function to run at finish of flyout animation.
 *						default: none
 *
 * @param {string} putAwayStart Function to run at start of putaway animation.
 *						default: none
 *
 * @param {string} putAwayFinish Function to run at finish of putaway animation.
 *						default: none
 *
 * @param {float} inOpacity Opacity for image flyout at start of flyout animation.
 *						default: 1.0
 *
 * @param {float} outOpacity Opacity for image flyout at end of flyout animation.
 *						default: 1.0
 *
 * @param {boolean} fullSizeImage Enlarges image to full size, even if it extends beyond
 *						boundary of the window when true. Overridden by destElement option.
 *						default: false
 *
 * Example: $('.thumbs a').flyout();
 * standard flyouts applied to all a > img elements with the 'thumbs' class. 
 * 
 * Example: $('.thumbs a').flyout({loadingSrc:'images/thumb-loading.gif',
 *								outEase:'easeOutCirc',
 *								inEase:'easeOutBounce'});
 * Creates flyouts  with different ease in and ease out and a loading animation image is specified
 *
 * For more details see: http://nixbox.com/projects/jquery-image-flyout/
 */

//console.log('Image Flyout');
(function($) {
	jQuery.fn.extend({flyout : function(options) {
	
		var shown=false;
		var animating=false;
		var bigimg = new Image();
		var subType = 'img';
		var $holder, $thumb, $loader, tloc, th, tw, adjustTop, adjustLeft;
		
		this.click(function() {
			if (animating === true) { return false; }
	
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
			loaderOpacity: 0.5,
			widthMargin: 40,
			heightMargin: 40,
			loadingText : "Loading...",
			closeTip : " - Click here to close",
			destPadding: 20,
			startOffsetX: 0,
			startOffsetY: 0,
			startHeight: 0,
			startWidth: 0,
			flyOutStart: function() {},
			flyOutFinish: function() {},
			putAwayStart: function() {},
			putAwayFinish: function() {},
			shownClass: 'shown',
			inOpacity: 1.0,
			outOpacity: 1.0,
			fullSizeImage: false
		}, options);
	
		// parseInt for easy mathing
		function getInt(arg) {
			var myint = parseInt(arg,10);
			return (isNaN(myint)? 0: myint);
		}

		function flyOut(it) {
			animating = true;
			
			$holder = $(it);
			$thumb = $('img',it);
			bigimg = new Image(); 
			var sL = $(window).scrollLeft();
			var sT = $(window).scrollTop();
			tloc = $thumb.offset();
			tloc.left += o.startOffsetX;
			tloc.top += o.startOffsetY;
			th = (o.startHeight > 0 ? o.startHeight : $thumb.height());
			tw = (o.startWidth > 0 ? o.startWidth : $thumb.width());
			
			$loader = $('<div></div>').attr('id',o.loader)
							.appendTo('body')
							.css({'position':'absolute',
								'top':-9999,
								'left':-9999,
								'height':th,
								'width':tw,
								'opacity':o.loaderOpacity,
								'display':'block',
								'z-index':o.loaderZIndex,
								'line-height':'0px'});

			adjustTop = getInt($loader.css('borderTopWidth'))+getInt($loader.css('paddingTop'))-getInt($thumb.css('borderTopWidth'))-getInt($thumb.css('paddingTop'));
			adjustLeft = getInt($loader.css('borderLeftWidth'))+getInt($loader.css('paddingLeft'))-getInt($thumb.css('borderLeftWidth'))-getInt($thumb.css('paddingLeft'));
			
			$loader.css({ 'top':tloc.top-adjustTop, 'left':tloc.left-adjustLeft});

			if (o.loadingSrc) {
				$('#'+o.loader).append($('<img/>')
								.load(function() {
										$(this)
											.css({'position':'relative',
												 'top':th/2-(this.height/2),
												 'left':tw/2-(this.width/2)})
											.attr('alt',o.loadingText);
										})
									.attr('src',o.loadingSrc)
								);
			}
			else {
				$('#'+o.loader).css('background-color','#000')
								.append($('<span></span>')
										  	.text(o.loadingText)
											.css({'position':'relative',
												 'top':'2px',
												 'left':'2px',
												 'color':'#FFF',
												 'font-size':'9px'})
									 	);
			}

			$(bigimg).load(function() {
				var imgtag = $('<img/>').attr('src',$holder.attr('href')).attr('title',$thumb.attr('title')+o.closeTip).attr('alt',$thumb.attr('alt')+o.closeTip).height(th).width(tw);

				o.flyOutStart.call(it);

				var max_x, max_y, $dest;

				if (o.destElement) {
					$dest = $(o.destElement);
					max_x = $dest.innerWidth() - (o.destPadding*2);
					max_y = $dest.innerHeight() - (o.destPadding*2);
				}
				else {
					max_x = $(window).width()-o.widthMargin;
					max_y = $(window).height()-o.heightMargin;
/*					if ($.browser.opera) {
						var wh = document.getElementsByTagName('html')[0].clientHeight;
					}
					else {
						var wh = $(window).height();
					}
					max_y = wh-o.heightMargin;
*/
				}

				var width = bigimg.width, height = bigimg.height;
	
				var x_dim = max_x / width, y_dim = max_y / height;
	
				if (x_dim <=y_dim) {y_dim = x_dim;} 
				else {x_dim = y_dim;}
				
				var dl, dt, dw, dh;

				if (o.fullSizeImage) {
					dw = width;
					dh = height;
				}
				else {
					dw = Math.round(width  * x_dim), dh = Math.round(height * y_dim);
					if (dw>width) {dw = width;}
					if (dh>height) {dh = height;}
				}

				if (o.destElement) {
					var dPos = $dest.offset();
					dl = Math.round(($dest.outerWidth()/2)-(dw/2)+dPos.left);
					dt = Math.round(($dest.outerHeight()/2)-(dh/2)+dPos.top);
				}
				else {
					dl = Math.round(($(window).width()/2)-(dw/2)+sL);
					dt = Math.round(($(window).height()/2)-(dh/2)+sT);
/*					if ($.browser.opera) 
						var wh = document.getElementsByTagName('html')[0].clientHeight;
					else 
						var wh = $(window).height();
					dt = Math.round((wh/2)-(dh/2)+sT);
*/
				}
				
				$('#'+o.loader).empty().css({'opacity':o.inOpacity,'top':tloc.top-adjustTop, 'left':tloc.left-adjustLeft}).append(imgtag).width('auto').height('auto').animate({top:dt, left:dl, opacity:o.outOpacity},{duration:o.outSpeed, queue:false, easing:o.outEase});
				$('#'+o.loader+' '+subType).animate({height:dh, width:dw, opacity:o.outOpacity}, o.outSpeed, o.outEase,
				function() {
					o.flyOutFinish.call(it);
					shown = it;
					$holder.addClass(o.shownClass);
					animating=false;
					$('#'+o.loader+' '+subType).click(function(){putAway(null);});
				});
			});
			bigimg.src = $holder.attr('href');
		}
	
	
		function putAway(next) {
			if (animating === true || shown === false) {return false;}
			o.putAwayStart.call(shown);
			
			animating = true;
			
			// check $thumb loc again, in case it moved...
			tloc = $thumb.offset();
			tloc.left += o.startOffsetX-adjustLeft;
			tloc.top += o.startOffsetY-adjustTop;

			$('#'+o.loader).animate({top:tloc.top, left:tloc.left, opacity:o.inOpacity},{duration:o.inSpeed, queue:false, easing:o.inEase});
			$('#'+o.loader+' '+subType).animate({height:th, width:tw, opacity:o.inOpacity}, 
				o.inSpeed, o.inEase, 
				function() {
					$('#'+o.loader).css('display','none').remove(); 
					o.putAwayFinish.call(shown);
					animating=false;
					bigimg=null;			
					if (next && next !== shown) {
						shown = false;
						flyOut(next);
					}
					shown = false;
					$holder.removeClass(o.shownClass);
				});
		}
		
		return this;	// never break the chain
		
	}
});

})(jQuery);
