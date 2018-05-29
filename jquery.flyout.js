/*
 * JQuery FlyOut
 * author: Jolyon Terwilliger - Nixbox Web Consulting
 * website: https://nixbox.com/projects/jquery-image-flyout/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   https://www.opensource.org/licenses/mit-license.php
 *   https://www.gnu.org/licenses/gpl.html
 *
 * Usage information and release history moved to README.md
 * For more details see: https://github.com/jtnix/jQuery-Flyout
 */

(function($) {
  jQuery.fn.extend({
    flyout: function(options) {
      var o = jQuery.extend(
        {
          outSpeed: 1000,
          inSpeed: 500,
          outEase: "swing",
          inEase: "swing",
          loadingSrc: null,
          loader: "loader",
          loaderZIndex: 500,
          loaderOpacity: 0.5,
          widthMargin: 40,
          heightMargin: 40,
          loadingText: "Loading...",
          closeTip: " - Click here to close",
          destPadding: 20,
          startOffsetX: 0,
          startOffsetY: 0,
          startHeight: 0,
          startWidth: 0,
          flyOutStart: function() {},
          flyOutFinish: function() {},
          putAwayStart: function() {},
          putAwayFinish: function() {},
          shownClass: "shown",
          inOpacity: 1.0,
          outOpacity: 1.0,
          useNative: false,
          dblClickSpeed: 0,
          displayType: "default",
          debug: false
        },
        options
      );

      var shown = false;
      var animating = false;
      var bigimg = new Image();
      var subType = "img";
      var $holder,
        $thumb,
        $loader,
        tloc,
        th,
        tw,
        adjustTop,
        adjustLeft,
        clickTimer;
      var clicks = 0;

      this.click(function(e) {
        if (animating === true) {
          return false;
        }

        clicks++;
        var self = this;
        if (clicks === 1) {
          clickTimer = setTimeout(function() {
            if (shown) {
              putAway(self);
            } else {
              flyOut(self, false);
            }
            clicks = 0;
          }, o.dblClickSpeed);
        } else {
          clearTimeout(clickTimer);
          if (shown) {
            putAway(self);
          } else {
            flyOut(self, true);
          }
          clicks = 0;
        }
        return false;
      }).dblclick(function(e) {
        e.preventDefault();
      });

      // parseInt for easy mathing
      function getInt(arg) {
        var myint = parseInt(arg, 10);
        return isNaN(myint) ? 0 : myint;
      }

      function flyOut(it, altClick) {
        var displayType = o.displayType;
        if (altClick) {
          if ((o.displayType = "fit")) {
            displayType = "fill";
          }
        }
        animating = true;
        $holder = $(it);
        $thumb = $("img", it);
        bigimg = new Image();
        var sL = $(window).scrollLeft();
        var sT = $(window).scrollTop();
        if (o.debug) console.log("scroll LeftTop", sL, sT);
        tloc = $thumb.offset();
        tloc.left += o.startOffsetX;
        tloc.top += o.startOffsetY;
        th = o.startHeight > 0 ? o.startHeight : $thumb.height();
        tw = o.startWidth > 0 ? o.startWidth : $thumb.width();

        $loader = $("<div></div>")
          .attr("id", o.loader)
          .appendTo("body")
          .css({
            position: "absolute",
            top: -9999,
            left: -9999,
            height: th,
            width: tw,
            opacity: o.loaderOpacity,
            display: "block",
            "z-index": o.loaderZIndex,
            "line-height": "0px"
          });

        adjustTop =
          getInt($loader.css("borderTopWidth")) +
          getInt($loader.css("paddingTop")) -
          getInt($thumb.css("borderTopWidth")) -
          getInt($thumb.css("paddingTop"));
        adjustLeft =
          getInt($loader.css("borderLeftWidth")) +
          getInt($loader.css("paddingLeft")) -
          getInt($thumb.css("borderLeftWidth")) -
          getInt($thumb.css("paddingLeft"));

        $loader.css({
          top: tloc.top - adjustTop,
          left: tloc.left - adjustLeft
        });

        if (o.loadingSrc) {
          $("#" + o.loader).append(
            $("<img/>")
              .on("load", function() {
                $(this)
                  .css({
                    position: "relative",
                    top: th / 2 - this.height / 2,
                    left: tw / 2 - this.width / 2
                  })
                  .attr("alt", o.loadingText);
              })
              .attr("src", o.loadingSrc)
          );
        } else {
          $("#" + o.loader)
            .css("background-color", "#000")
            .append(
              $("<span></span>")
                .text(o.loadingText)
                .css({
                  position: "relative",
                  top: "2px",
                  left: "2px",
                  color: "#FFF",
                  "font-size": "9px"
                })
            );
        }

        $(bigimg).on("load", function() {
          var imgtag = $("<img/>")
            .attr("src", $holder.attr("href"))
            .attr("title", $thumb.attr("title") + o.closeTip)
            .attr("alt", $thumb.attr("alt") + o.closeTip)
            .height(th)
            .width(tw);

          o.flyOutStart.call(it);

          var max_x, max_y, $dest, vh, vw;

          if (o.useNative || !document.doctype) {
            if (o.debug) console.log("using native window inner dims");
            vh = window.innerHeight;
            vw = window.innerWidth;
          } else {
            vh = $(window).height();
            vw = $(window).width();
          }
          if (o.debug) console.log("viewport WidthHeight", vw, vh);

          if (o.destElement) {
            $dest = $(o.destElement);
            max_x = $dest.innerWidth() - o.destPadding * 2;
            max_y = $dest.innerHeight() - o.destPadding * 2;
          } else {
            max_x = vw - o.widthMargin;
            max_y = vh - o.heightMargin;
          }

          var width = bigimg.width,
            height = bigimg.height;

          var wf = vw / width,
            hf = vh / height;

          if (o.debug) console.log("flyout WidthHeight factors", wf, hf);
          var dl, dt, dw, dh;

          if (displayType == "full") {
            (dw = width), (dh = height);
          } else if (displayType == "fit") {
            if (wf < hf) {
              (dw = width * wf), (dh = height * wf);
            } else {
              (dw = width * hf), (dh = height * hf);
            }
          } else if (displayType == "fill") {
            if (wf > hf) {
              (dw = width * wf), (dh = height * wf);
            } else {
              (dw = width * hf), (dh = height * hf);
            }
          } else {
            var x_dim = max_x / width,
              y_dim = max_y / height;
            if (x_dim <= y_dim) {
              y_dim = x_dim;
            } else {
              x_dim = y_dim;
            }
            (dw = Math.round(width * x_dim)), (dh = Math.round(height * y_dim));
            if (dw > width) {
              dw = width;
            }
            if (dh > height) {
              dh = height;
            }
          }

          if (o.debug) console.log("flyout WidthHeight", dw, dh);

          if (o.destElement) {
            var dPos = $dest.offset();
            dl = Math.round($dest.outerWidth() / 2 - dw / 2 + dPos.left);
            dt = Math.round($dest.outerHeight() / 2 - dh / 2 + dPos.top);
          } else {
            dl = Math.round(vw / 2 - dw / 2 + sL);
            dt = Math.round(vh / 2 - dh / 2 + sT);
          }
          if (o.debug) console.log("flyout LeftTop", dl, dt);

          $("#" + o.loader)
            .empty()
            .css({
              opacity: o.inOpacity,
              top: tloc.top - adjustTop,
              left: tloc.left - adjustLeft
            })
            .append(imgtag)
            .width("auto")
            .height("auto")
            .animate(
              { top: dt, left: dl, opacity: o.outOpacity },
              { duration: o.outSpeed, queue: false, easing: o.outEase }
            );
          $("#" + o.loader + " " + subType).animate(
            { height: dh, width: dw, opacity: o.outOpacity },
            o.outSpeed,
            o.outEase,
            function() {
              o.flyOutFinish.call(it);
              shown = it;
              $holder.addClass(o.shownClass);
              animating = false;
              $("#" + o.loader + " " + subType).click(function() {
                putAway(null);
              });
            }
          );
        });
        bigimg.src = $holder.attr("href");
      }

      function putAway(next) {
        if (animating === true || shown === false) {
          return false;
        }
        o.putAwayStart.call(shown);

        animating = true;

        // check $thumb loc again, in case it moved...
        tloc = $thumb.offset();
        tloc.left += o.startOffsetX - adjustLeft;
        tloc.top += o.startOffsetY - adjustTop;

        $("#" + o.loader).animate(
          { top: tloc.top, left: tloc.left, opacity: o.inOpacity },
          { duration: o.inSpeed, queue: false, easing: o.inEase }
        );
        $("#" + o.loader + " " + subType).animate(
          { height: th, width: tw, opacity: o.inOpacity },
          o.inSpeed,
          o.inEase,
          function() {
            $("#" + o.loader)
              .css("display", "none")
              .remove();
            o.putAwayFinish.call(shown);
            animating = false;
            bigimg = null;
            if (next && next !== shown) {
              shown = false;
              flyOut(next);
            }
            shown = false;
            $holder.removeClass(o.shownClass);
          }
        );
      }

      return this; // never break the chain
    }
  });
})(jQuery);
