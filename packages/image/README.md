# Image

An intuitive image manipulation package using the blazing fast [sharp](https://github.com/lovell/sharp), so all credits go to that library. All it does is a tiny bit of abstraction, just enough to better integrate it in the framework and [probably] make it easier to use. The rest are direct calls to sharp's functions.

## Usage

Before installing the library, just be aware that it includes [libvips](https://github.com/jcupitt/libvips), a 7MB download that serves as sharp's image manipulation engine.

```
$ npm install --save @sapphirejs/image
```

We'll resize an image, rotate it, apply a grayscale effect, and finally save it somewhere in disk:

```js
const Image = require('@sapphirejs/image')

const image = new Image()
await image.open('path/to/image.jpg', image => {
  image
    .resize(600, 400)
    .rotate(90)
    .grayscale()
    .jpeg('smaller.jpg')
})
```

The fluent interface allows for some very readable actions, but also serves a purpose: encapsulating the image call into a callback that actually returns a Promise. Notice the `await` keyword in front of `image.open()`. You may have also noticed that it isn't called in an `async` function, but we've omitted it for brevity's sake.

Only the functions that actually persist a file to disk will return a Promise: `jpeg()`, `png()`, `webp()` and `save()`. Without one of them at the end of the chain, the library won't complain, but nothing helpful will happen.

In the same way as the previous example, instead of opening an existing image, you can also create a brand new one. The following creates a 100x100px image with a semi-transparent red background.

```js
await image.create({
  with: 100,
  height: 100,
  channels: 4,
  background: { r: 255, g: 0, b: 0, alpha: 128 }
}, image => {
  image
    .png('red.png')
})
```

## Accessing the Sharp Instance

We've created this package with the hopes that it will serve most people's image manipulation needs while building web applications. However, there may be something we haven't abstracted from sharp, so you may need to access the instance directly.

The `open(path)` is equivalent to calling `sharp(path)`. Instead of a string pointing to a system file, it can be also a Buffer.

In the callback, you can access the sharp instance with the `raw` property:

```js
await image.open('path/to/image.jpg', (image) => {
  image
    .raw
    .trim()
    .normalize()
    .jpeg()
    .toFile('export.jpg')
})
```

## Image Composers

We're calling them arbitrarily image composers, but they're nothing but a pattern to reuse functions for typical image operations. Let's say you resize images to fixed dimensions as thumbnails, and you do that in a few parts of your application. Writing the same code over and over wouldn't be that practical, so you need some way to reuse it. While there are plenty of ways, we've been using the following approach:

```js
// helper file
const resizeThumbnail = (output) => {
  return image => {
    image
      .resize(100, 100)
      .enhance()
      .sharpen()
      .jpeg(output)
  }
}
```

That reusable function that itself returns a function, you can reuse anywhere you need to resize an image to 100x100px and also do some contrast enhancing, and sharpening. Now it's as simple as passing it to `image.open()`:

```js
await image.open('path/to/image.jpg', resizeThumbnail('output.jpg'))
```

Such an approach keeps it simple by not abstracting away the library, but also allows plenty of flexibility. Obviously, this will bring you that far, as for bigger or complex applications you may need higher abstractions.

## API

**resize(width, height)**
Resize the image to a new width and height by disallowing enlargement. If one of the parameters is null or undefined, it will be calculated automatically by keeping the aspect ratio.

**widen(width)**
Same as `resize(width)`.

**heighten(height)**
Same as `resize(null, height)`.

**crop(gravity)**
Crop the image to the dimensions set in `resize()`. The gravity may be a `Image.gravity` or `Image.strategy` constant. Defaults to `Image.gravity.center`. Check out [sharp's docs](http://sharp.pixelplumbing.com/en/stable/api-resize/#crop) for a list of gravities and strategies.

**ignoreRatio()**
Ignore aspect ratio on resize.

**enlarge()**
Allow enlargement when the resizing dimensions are bigger than the original image's with or height.

**rotate(angle)**
Rotate the image to a specific angle. If not set, infer the appropriate rotation based on EXIF data, if any. When set, it must be a multiple of 90.

**flip(axis)**
Flip the image on axis. Axis can be either `Image.axis.y` or `Image.axis.x`, set by default to the `y` axis.

**sharpen()**
Sharpen the image with a mild, but fast algorithm.

**blur(amount)**
Blur the image with amount. When the amount is not set, perform a mild, but fast blurring. Otherwise, it expects an amount that ranges from 0 to 100. That is in contrast to the underlying sharp that expects a value between 0.3 and 1000, as a sigma of the Gaussian mask.

**extend(extend)**
Extend the image outside its canvas, as a sort of padding. It expects an object that contains the top, bottom, left and right values: `{ top: 10, bottom: 5, left: 0, right: 25 }`.

**flatten()**
Merge the alpha transparency channel with the provided background, if any.
`image.background({ r: 255, g: 0, b: 0, alpha: 255 }).flatten()`

**gamma(value)**
Apply gamma correction to the image. Value ranges between 1.0 and 3.0.

**negative()**
Convert the image to its negative.

**enhance()**
Applies contrast enhancement.

**background(color)**
Set a background color the image. Especially useful if combined with `flatten()` or `extend()`.
`image.background({ r: 255, g: 0, b: 0, alpha: 255 })`

**grayscale()**
Convert the image to 8-bit, 256 colors grayscale.

**overlay(path, options)**
Add an image as an overlay to the existing one. Especially useful for watermarks. Expects a `path` to the image and an object as options:
`{ gravity: Image.gravity.southeast, top: 5, left: 10, tile: false }`

**metadata()**
Returns information about the image.

**jpeg(path, options)**
Save the processed image to `path` as JPEG. Default options:
`{ quality: 90, progressive: true }`.

**png(path, options)**
Save the processed image to `path` as PNG. Default options:
`{ progressive: true }`.

**webp(path, options)**
Save the processed image to `path` as WebP. Default options:
`{ progressive: true }`.

**save(path)**
Save the processed image to `path` by inferring the format from the file extension. With the format-specific methods above, there's little reason to use this function.
