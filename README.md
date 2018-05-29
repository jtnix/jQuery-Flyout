# jQuery Flyout

jQuery.flyout provides an alternate means of loading and display sub-content with a nifty flyout animation technique.

**Note:** jQuery.flyout currently only supports `img` tag sub-content.

Please see: https://nixbox.com/projects/jquery-image-flyout/ for demos, tutorials and usage info.

## jQuery Flyout Features

### Preloading

jQuery Flyout uses dynamic image preloading Javascript to load the image in the background without leaving the page. Just apply the Flyout plugin to whatever container of linked images on your page and jQuery flyout will do the rest. You can also specify loading text or a loading animation while the image is loading.

### Easing Animations

All the native [jQuery](https://jquery.com/download/#Download_jQuery) and [Easing Library](https://github.com/gdsmith/jquery.easing) easing animations are supported, you can even apply a different animation and speed for both the flyout and flyback animations.

### Calculated, Custom and Fullsize Viewing

jQuery Flyout automatically sizes your image to maximum size of the image or constrains the image to the size of the viewport, unless you use options like `heightMargin` and `widthMargin`, which adds extra margin limitations from the viewport, or use `fullSizeImage` which expands the image to fullsize despite the size of the viewport.

### Fade in and out support

Using the new `outOpacity` and `inOpacity`, you can create subtle fading effects to display your images

### Other features

* use the `loaderOpacity` option to set the opacity of the preloader element.
* use the `startOffset`, `startHeight` and `startWidth` settings to customize the starting location of the Flyout image to a different location on the page. This can be useful if your trigger link does not contain a thumbnail image and other effects.
* proper positioning for large loader borders.
* supports jQuery `noConflict` mode.
* accurately calculates destination size including borders.

The latest version 1.3 of jQuery Flyout has been tested successfully with jQuery versions 3.3.1, 2.2.4 and 1.12.4 and should work with jQuery version 1.7 or greater.

## jQuery Flyout Usage and Options

### outSpeed (integer) - default: 1000

Speed of the flyout animation in milliseconds.

### inSpeed (integer) - default: 400

Speed of the flyback animation in milliseconds.

### outEase (string) - default: swing

Easing method for the flyout animation.

### inEase (string) - default: swing

Easing method for the flyback animation.

### loadingSrc (string) - default: '' (empty string)

Path to the image file to use while target image is being preloaded.

### loadingText (string) - default: 'Loading...'

The text to display when preloading an image when loadingSrc is not present.

### loader (string) - default: 'loader'

The ID assigned to the created flyout `div` element that contains the target content.

### loaderZIndex (integer) - default: 500

The CSS z-index for the created flyout `div` element (see `loader` option above.)

### loaderOpacity (float) - default: 0.5     _version 1.2_

The starting CSS opacity to use for the created flyout `div` element (see `loader` option above.)

### closeTip (string) - default: ' - Click here to close'

The hint text to append to the final target image `alt` and `title` tags.

### widthMargin (integer) - default: 40

The left and right margin space to restrict the final flyout target image within the current viewport. This value is effectively divided between the left and right margin, i.e. `20px` on the left and `20px` on the right. Overridden by `destElement` option.

### heightMargin (integer) - default: 40

The top and bottom margin space to restrict the final flyout target image within the current viewport. This value is effectively divided between the left and right margin, i.e. `20px` on the top and `20px` on the bottom. Overridden by `destElement` option.

### destElement (string) - default: '' (empty string)

The destination element to fly the target image to on the same page; uses full CSS notation, e.g. `div#container`. Using this overrides `heightMargin`, `widthMargin` and `fullSizeImage` options.

### destPadding (integer) - default: 10

The destination element to fly the target image to on the same page; uses full CSS notation, e.g. `div#container`. Using this overrides `heightMargin`, `widthMargin` and `fullSizeImage` options.

### startOffsetX (integer) - default: 0

Horizontal offset in px to start the flyout animation at.

### startOffsetY (integer) - default: 0

Vertical offset in px to start the flyout animation at.

### startHeight (integer) - default: 0

Overrides starting height of flyout animation in px; uses thumb image height by default.

### startWidth (integer) - default: 0

Overrides starting width of flyout animation in px; uses thumb image height by default.

### flyOutStart (string) - default: '' (none)

Callback function to run at start of flyout animation.

### flyOutFinish (string) - default: '' (none)

Callback function to run at end of flyout animation.

### putAwayStart (string) - default: '' (none)

Callback function to run at start of flyback animation.

### putAwayFinish (string) - default: '' (none)

Callback function to run at end of flyback animation.

### inOpacity (float) - default: 1.0     _version 1.2_

CSS opacity for the target flyout image and loader at start of the animation.

### outOpacity (float) - default: 1.0     _version 1.2_

CSS opacity for the target flyout image and loader at end of the animation.

### useNative (boolean) - default: false     _version 1.3_

When true, Flyout uses `window.innerHeight` and `innerWidth` to determine viewport size. This is overridden to `true` if `document.doctype` is null.

### displayType (string) - default: false     _version 1.3_

Determines default sizing of shown image. A `displayType` of `default` respects margin settings, `full` uses the target image dimensions, `fit` expands image to max width or height of viewport depending on image, `fill` expands image to max width or height of image to fill the viewport entirely.

## jQuery Flyout Tips

* **jQuery Flyout only works with image links:** Preferably links containing thumbnail image tags. This is a simple plugin right now, and works best on a set of linked thumbnail images. You can somewhat override this behavior using the `startOffset`, `startHeight` and `startWidth` options on just links.
* **You can use CSS to style the loader:** Using CSS and CSS3 styling you can adjust the appearance of the loader container; [see example 3](examples.php#example3).
* **Loader element positioning:** Flyout compensates for the Loader element border and padding as well as the sub image tag border and padding to try and wrap the loader tightly around the thumbnail image. If you want some padding, adjust padding of the loader element; image padding, margins and borders are ignored.
* **Offset location can be tricky:** If you are using padding or border on the parent `body` element, or are inside a container with globally redefined margin, padding or border set (like a `div` when divs are globally defined to have margins), the Flyout offset will be off respectively. Unfortunately there is no easy way for Flyout to figure this out for all browsers, so if you are powerless to fix the CSS of your page, you can use the `startOffsetX` and `startOffsetY` to compensate.

## jQuery Flyout Release History

* version 0.21 (July 21, 2008)

* version 0.22 (July 22, 2008)

  * notes: minor reordering to loadingSrc logic.

* version 0.23 (August 15, 2008)

  * added: config options for loadingText and closeTip to facilitate locale. Thanks Tony for the nudge.

* version 0.24 (Oct 2, 2008)

  * added: customize start location and size of flyout, if different from thumb link. Thanks to Jake Kronika for this patch.

* version 1.0 (Oct 11, 2008)
  * added: support for final flyout location via destElement and destPadding: define a fixed container anywhere in the document and the pic will fly to that location, regardless of viewport position.
  * fixed: clicking on open source link no longer reopens same image.
  * added: 4 callbacks for start and finish of flyOut and putAway animations.
  * fixed: putAway function to put back to correct location, in case thumb has moved (page or div scroll, etc)
* version 1.1 (Nov 16, 2008)

  * fixed: Opera 9.5+ doesn't report window.height() correctly - patched with code from jquery Bug 3117: http://dev.jquery.com/ticket/3117 note: once this is patched in jQuery core, or fixed in Opera this may eventually be removed.
  * added: when flyOut image is completed, a customizable class (default to 'shown') is appended to the thumb image container so an external event can trigger the click to close any open elements. See demo page for example.

* version 1.2 (Feb 13, 2011)

  * added: inOpacity, outOpacity, loaderOpacity and fullSizeImage
  * fixed: fixed start and animation positioning if loader has border
  * fixed: blank space at bottom of image by adding line-height:0px to flyout
  * added: full closure to plugin to allow cross-library compatitibility
  * fixed: various issues discovered with jsLint
  * removed: Opera hack, problem was fixed in version 10 of Opera

* version 1.3 (May 29th, 2018)

  * added: useNative flag to switch up method for determining actual viewport dimensions
  * added: displayType parameter to allow changing how large an image will flyout to, along with double-mouse click support for alternate flyout sizing.
  * added: README.md with release info and usage instructions
  * enhanced: new minified version using latest version of google closure compiler
  * updated: website support links and info
  * updated: changed `load` jQuery method to `on("load")` for modern jQuery compatibility. Now requires jQuery 1.7 or later.

  (c) Copyright 2008, 2010, 2018 - Jolyon Terwilliger, Nixbox Consulting
