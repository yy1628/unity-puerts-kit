/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer-from/index.js":
/*!*******************************************!*\
  !*** ./node_modules/buffer-from/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
/* eslint-disable node/no-deprecated-api */

var toString = Object.prototype.toString

var isModern = (
  typeof Buffer !== 'undefined' &&
  typeof Buffer.alloc === 'function' &&
  typeof Buffer.allocUnsafe === 'function' &&
  typeof Buffer.from === 'function'
)

function isArrayBuffer (input) {
  return toString.call(input).slice(8, -1) === 'ArrayBuffer'
}

function fromArrayBuffer (obj, byteOffset, length) {
  byteOffset >>>= 0

  var maxLength = obj.byteLength - byteOffset

  if (maxLength < 0) {
    throw new RangeError("'offset' is out of bounds")
  }

  if (length === undefined) {
    length = maxLength
  } else {
    length >>>= 0

    if (length > maxLength) {
      throw new RangeError("'length' is out of bounds")
    }
  }

  return isModern
    ? Buffer.from(obj.slice(byteOffset, byteOffset + length))
    : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)))
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  return isModern
    ? Buffer.from(string, encoding)
    : new Buffer(string, encoding)
}

function bufferFrom (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value)) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return isModern
    ? Buffer.from(value)
    : new Buffer(value)
}

module.exports = bufferFrom


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
const ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ "./src/UI/Loading.ts":
/*!***************************!*\
  !*** ./src/UI/Loading.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Loading": () => (/* binding */ Loading)
/* harmony export */ });
/* harmony import */ var common_ui_ui_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! common/ui/ui-base */ "./src/common/ui/ui-base.ts");

class Loading extends common_ui_ui_base__WEBPACK_IMPORTED_MODULE_0__.UIBase {
  onOpen(uiType, args) {
    this.scheduleOnce((dt) => {
      console.log(dt);
      console.log(this.load("Textures/loading"));
    }, 1);
  }
  update(dt) {
  }
  lateUpdate(dt) {
  }
}


/***/ }),

/***/ "./src/addons/source-map-support.unity.js":
/*!************************************************!*\
  !*** ./src/addons/source-map-support.unity.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const csharp = __webpack_require__(/*! csharp */ "csharp");
const puerts = __webpack_require__(/*! puerts */ "puerts");
const fs = {
  existsSync(path2) {
    return csharp.System.IO.File.Exists(path2);
  },
  readFileSync(path2) {
    return csharp.System.IO.File.ReadAllText(path2);
  }
};
const path = {
  dirname(path2) {
    return csharp.System.IO.Path.GetDirectoryName(path2).replace(/\\/g, "/");
  },
  resolve(dir, url) {
    while (url.startsWith("../")) {
      dir = csharp.System.IO.Path.GetDirectoryName(dir);
      url = url.substr(3);
    }
    return `${dir}/${url}`.replace(/\\/g, "/");
  }
};
puerts.registerBuildinModule("fs", fs);
puerts.registerBuildinModule("path", path);
(__webpack_require__(/*! source-map-support */ "./node_modules/source-map-support/source-map-support.js").install)();


/***/ }),

/***/ "./src/bootstrap.ts":
/*!**************************!*\
  !*** ./src/bootstrap.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Bootstrap)
/* harmony export */ });
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! common */ "./src/common/index.ts");
/* harmony import */ var define_ui_define__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! define/ui-define */ "./src/define/ui-define.ts");
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};


class Bootstrap {
  start() {
    return __async(this, null, function* () {
      yield this.initFramework();
      yield this.initGame();
      yield this.initEnd();
    });
  }
  initFramework() {
    return __async(this, null, function* () {
      common__WEBPACK_IMPORTED_MODULE_0__.UI.createCanvas();
    });
  }
  initGame() {
    return __async(this, null, function* () {
    });
  }
  initEnd() {
    return __async(this, null, function* () {
      common__WEBPACK_IMPORTED_MODULE_0__.UI.open(define_ui_define__WEBPACK_IMPORTED_MODULE_1__.UIType.Confirm);
      common__WEBPACK_IMPORTED_MODULE_0__.UI.open(define_ui_define__WEBPACK_IMPORTED_MODULE_1__.UIType.Loading);
      common__WEBPACK_IMPORTED_MODULE_0__.UI.open(define_ui_define__WEBPACK_IMPORTED_MODULE_1__.UIType.Confirm);
    });
  }
}


/***/ }),

/***/ "./src/common/event/callbacks-invoker.ts":
/*!***********************************************!*\
  !*** ./src/common/event/callbacks-invoker.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CallbackList": () => (/* binding */ CallbackList),
/* harmony export */   "CallbacksInvoker": () => (/* binding */ CallbacksInvoker)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/js */ "./src/common/utils/js.ts");
/* harmony import */ var _utils_array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/array */ "./src/common/utils/array.ts");
/* harmony import */ var _memop_pool__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../memop/pool */ "./src/common/memop/pool.ts");



function empty() {
}
class CallbackInfo {
  constructor() {
    this.callback = empty;
    this.target = void 0;
    this.once = false;
  }
  set(callback, target, once) {
    this.callback = callback || empty;
    this.target = target;
    this.once = !!once;
  }
  reset() {
    this.target = void 0;
    this.callback = empty;
    this.once = false;
  }
  check() {
    return true;
  }
}
const callbackInfoPool = new _memop_pool__WEBPACK_IMPORTED_MODULE_2__.Pool(() => new CallbackInfo(), 32);
class CallbackList {
  constructor() {
    this.callbackInfos = [];
    this.isInvoking = false;
    this.containCanceled = false;
  }
  removeByCallback(cb) {
    for (let i = 0; i < this.callbackInfos.length; ++i) {
      const info = this.callbackInfos[i];
      if (info && info.callback === cb) {
        info.reset();
        callbackInfoPool.free(info);
        (0,_utils_array__WEBPACK_IMPORTED_MODULE_1__.fastRemoveAt)(this.callbackInfos, i);
        --i;
      }
    }
  }
  removeByTarget(target) {
    for (let i = 0; i < this.callbackInfos.length; ++i) {
      const info = this.callbackInfos[i];
      if (info && info.target === target) {
        info.reset();
        callbackInfoPool.free(info);
        (0,_utils_array__WEBPACK_IMPORTED_MODULE_1__.fastRemoveAt)(this.callbackInfos, i);
        --i;
      }
    }
  }
  cancel(index) {
    const info = this.callbackInfos[index];
    if (info) {
      info.reset();
      if (this.isInvoking) {
        this.callbackInfos[index] = null;
      } else {
        (0,_utils_array__WEBPACK_IMPORTED_MODULE_1__.fastRemoveAt)(this.callbackInfos, index);
      }
      callbackInfoPool.free(info);
    }
    this.containCanceled = true;
  }
  cancelAll() {
    for (let i = 0; i < this.callbackInfos.length; i++) {
      const info = this.callbackInfos[i];
      if (info) {
        info.reset();
        callbackInfoPool.free(info);
        this.callbackInfos[i] = null;
      }
    }
    this.containCanceled = true;
  }
  purgeCanceled() {
    for (let i = this.callbackInfos.length - 1; i >= 0; --i) {
      const info = this.callbackInfos[i];
      if (!info) {
        (0,_utils_array__WEBPACK_IMPORTED_MODULE_1__.fastRemoveAt)(this.callbackInfos, i);
      }
    }
    this.containCanceled = false;
  }
  clear() {
    this.cancelAll();
    this.callbackInfos.length = 0;
    this.isInvoking = false;
    this.containCanceled = false;
  }
}
const MAX_SIZE = 16;
const callbackListPool = new _memop_pool__WEBPACK_IMPORTED_MODULE_2__.Pool(() => new CallbackList(), MAX_SIZE);
class CallbacksInvoker {
  constructor() {
    this._callbackTable = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createMap)(true);
  }
  on(key, callback, target, once) {
    if (!this.hasEventListener(key, callback, target)) {
      let list = this._callbackTable[key];
      if (!list) {
        list = this._callbackTable[key] = callbackListPool.alloc();
      }
      const info = callbackInfoPool.alloc();
      info.set(callback, target, once);
      list.callbackInfos.push(info);
    }
    return callback;
  }
  hasEventListener(key, callback, target) {
    const list = this._callbackTable && this._callbackTable[key];
    if (!list) {
      return false;
    }
    const infos = list.callbackInfos;
    if (!callback) {
      if (list.isInvoking) {
        for (let i = 0; i < infos.length; ++i) {
          if (infos[i]) {
            return true;
          }
        }
        return false;
      } else {
        return infos.length > 0;
      }
    }
    for (let i = 0; i < infos.length; ++i) {
      const info = infos[i];
      if (info && info.check() && info.callback === callback && info.target === target) {
        return true;
      }
    }
    return false;
  }
  removeAll(keyOrTarget) {
    const type = typeof keyOrTarget;
    if (type === "string" || type === "number") {
      const list = this._callbackTable && this._callbackTable[keyOrTarget];
      if (list) {
        if (list.isInvoking) {
          list.cancelAll();
        } else {
          list.clear();
          callbackListPool.free(list);
          delete this._callbackTable[keyOrTarget];
        }
      }
    } else if (keyOrTarget) {
      for (const key in this._callbackTable) {
        const list = this._callbackTable[key];
        if (list.isInvoking) {
          const infos = list.callbackInfos;
          for (let i = 0; i < infos.length; ++i) {
            const info = infos[i];
            if (info && info.target === keyOrTarget) {
              list.cancel(i);
            }
          }
        } else {
          list.removeByTarget(keyOrTarget);
        }
      }
    }
  }
  off(key, callback, target) {
    var _a;
    const list = this._callbackTable && this._callbackTable[key];
    if (list) {
      const infos = list.callbackInfos;
      if (callback) {
        for (let i = 0; i < infos.length; ++i) {
          const info = infos[i];
          if (info && info.callback === callback && info.target === target) {
            list.cancel(i);
            break;
          }
        }
      } else {
        this.removeAll(key);
      }
    }
    (_a = this._offCallback) == null ? void 0 : _a.call(this);
  }
  emit(key, arg0, arg1, arg2, arg3, arg4) {
    const list = this._callbackTable && this._callbackTable[key];
    if (list) {
      const rootInvoker = !list.isInvoking;
      list.isInvoking = true;
      const infos = list.callbackInfos;
      for (let i = 0, len = infos.length; i < len; ++i) {
        const info = infos[i];
        if (info) {
          const callback = info.callback;
          const target = info.target;
          if (info.once) {
            this.off(key, callback, target);
          }
          if (!info.check()) {
            this.off(key, callback, target);
          } else if (target) {
            callback.call(target, arg0, arg1, arg2, arg3, arg4);
          } else {
            callback(arg0, arg1, arg2, arg3, arg4);
          }
        }
      }
      if (rootInvoker) {
        list.isInvoking = false;
        if (list.containCanceled) {
          list.purgeCanceled();
        }
      }
    }
  }
  clear() {
    for (const key in this._callbackTable) {
      const list = this._callbackTable[key];
      if (list) {
        list.clear();
        callbackListPool.free(list);
        delete this._callbackTable[key];
      }
    }
  }
  _registerOffCallback(cb) {
    this._offCallback = cb;
  }
}


/***/ }),

/***/ "./src/common/event/event-target.ts":
/*!******************************************!*\
  !*** ./src/common/event/event-target.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventTarget": () => (/* binding */ EventTarget)
/* harmony export */ });
/* harmony import */ var _eventify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventify */ "./src/common/event/eventify.ts");

class Empty {
}
const EventTarget = (0,_eventify__WEBPACK_IMPORTED_MODULE_0__.Eventify)(Empty);


/***/ }),

/***/ "./src/common/event/eventify.ts":
/*!**************************************!*\
  !*** ./src/common/event/eventify.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Eventify": () => (/* binding */ Eventify)
/* harmony export */ });
/* harmony import */ var _callbacks_invoker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./callbacks-invoker */ "./src/common/event/callbacks-invoker.ts");

function Eventify(base) {
  class Eventified extends base {
    once(type, callback, target) {
      return this.on(type, callback, target, true);
    }
    targetOff(typeOrTarget) {
      this.removeAll(typeOrTarget);
    }
  }
  const callbacksInvokerPrototype = _callbacks_invoker__WEBPACK_IMPORTED_MODULE_0__.CallbacksInvoker.prototype;
  const propertyKeys = Object.getOwnPropertyNames(callbacksInvokerPrototype).concat(
    Object.getOwnPropertySymbols(callbacksInvokerPrototype)
  );
  for (let iPropertyKey = 0; iPropertyKey < propertyKeys.length; ++iPropertyKey) {
    const propertyKey = propertyKeys[iPropertyKey];
    if (!(propertyKey in Eventified.prototype)) {
      const propertyDescriptor = Object.getOwnPropertyDescriptor(callbacksInvokerPrototype, propertyKey);
      if (propertyDescriptor) {
        Object.defineProperty(Eventified.prototype, propertyKey, propertyDescriptor);
      }
    }
  }
  return Eventified;
}


/***/ }),

/***/ "./src/common/event/index.ts":
/*!***********************************!*\
  !*** ./src/common/event/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventTarget": () => (/* reexport safe */ _event_target__WEBPACK_IMPORTED_MODULE_0__.EventTarget),
/* harmony export */   "Eventify": () => (/* reexport safe */ _eventify__WEBPACK_IMPORTED_MODULE_1__.Eventify)
/* harmony export */ });
/* harmony import */ var _event_target__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event-target */ "./src/common/event/event-target.ts");
/* harmony import */ var _eventify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./eventify */ "./src/common/event/eventify.ts");




/***/ }),

/***/ "./src/common/index.ts":
/*!*****************************!*\
  !*** ./src/common/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EVENT": () => (/* binding */ EVENT),
/* harmony export */   "LOCAL": () => (/* binding */ LOCAL),
/* harmony export */   "UI": () => (/* binding */ UI),
/* harmony export */   "director": () => (/* binding */ director),
/* harmony export */   "utils": () => (/* reexport module object */ _utils__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/common/utils/index.ts");
/* harmony import */ var _singleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./singleton */ "./src/common/singleton.ts");
/* harmony import */ var _sys_director__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sys/director */ "./src/common/sys/director.ts");
/* harmony import */ var _ui_ui_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui/ui-manager */ "./src/common/ui/ui-manager.ts");





const director = _sys_director__WEBPACK_IMPORTED_MODULE_2__.Director.inst;
const UI = _ui_ui_manager__WEBPACK_IMPORTED_MODULE_3__.UIManager.inst;
class EventMgr extends (0,_singleton__WEBPACK_IMPORTED_MODULE_1__.Singleton)() {
}
const EVENT = EventMgr.inst;
class LocalMgr extends (0,_singleton__WEBPACK_IMPORTED_MODULE_1__.Singleton)() {
}
const LOCAL = LocalMgr.inst;


/***/ }),

/***/ "./src/common/math/index.ts":
/*!**********************************!*\
  !*** ./src/common/math/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EPSILON": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.EPSILON),
/* harmony export */   "Vec2": () => (/* reexport safe */ _vec2__WEBPACK_IMPORTED_MODULE_0__.Vec2),
/* harmony export */   "Vec3": () => (/* reexport safe */ _vec3__WEBPACK_IMPORTED_MODULE_1__.Vec3),
/* harmony export */   "absMax": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.absMax),
/* harmony export */   "absMaxComponent": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.absMaxComponent),
/* harmony export */   "approx": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.approx),
/* harmony export */   "clamp": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.clamp),
/* harmony export */   "clamp01": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.clamp01),
/* harmony export */   "equals": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.equals),
/* harmony export */   "inverseLerp": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.inverseLerp),
/* harmony export */   "lerp": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.lerp),
/* harmony export */   "nextPow2": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.nextPow2),
/* harmony export */   "pingPong": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.pingPong),
/* harmony export */   "pseudoRandom": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.pseudoRandom),
/* harmony export */   "pseudoRandomRange": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.pseudoRandomRange),
/* harmony export */   "pseudoRandomRangeInt": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.pseudoRandomRangeInt),
/* harmony export */   "random": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.random),
/* harmony export */   "randomRange": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.randomRange),
/* harmony export */   "randomRangeInt": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.randomRangeInt),
/* harmony export */   "repeat": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.repeat),
/* harmony export */   "toDegree": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.toDegree),
/* harmony export */   "toRadian": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.toRadian)
/* harmony export */ });
/* harmony import */ var _vec2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vec2 */ "./src/common/math/vec2.ts");
/* harmony import */ var _vec3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vec3 */ "./src/common/math/vec3.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/common/math/utils.ts");
/* harmony import */ var _type_define__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./type-define */ "./src/common/math/type-define.ts");
/* harmony import */ var _type_define__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_type_define__WEBPACK_IMPORTED_MODULE_3__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _type_define__WEBPACK_IMPORTED_MODULE_3__) if(["default","Vec2","Vec3","EPSILON","absMax","absMaxComponent","approx","clamp","clamp01","equals","inverseLerp","lerp","nextPow2","pingPong","pseudoRandom","pseudoRandomRange","pseudoRandomRangeInt","random","randomRange","randomRangeInt","repeat","toDegree","toRadian"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _type_define__WEBPACK_IMPORTED_MODULE_3__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);






/***/ }),

/***/ "./src/common/math/type-define.ts":
/*!****************************************!*\
  !*** ./src/common/math/type-define.ts ***!
  \****************************************/
/***/ (() => {



/***/ }),

/***/ "./src/common/math/utils.ts":
/*!**********************************!*\
  !*** ./src/common/math/utils.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EPSILON": () => (/* binding */ EPSILON),
/* harmony export */   "absMax": () => (/* binding */ absMax),
/* harmony export */   "absMaxComponent": () => (/* binding */ absMaxComponent),
/* harmony export */   "approx": () => (/* binding */ approx),
/* harmony export */   "clamp": () => (/* binding */ clamp),
/* harmony export */   "clamp01": () => (/* binding */ clamp01),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "inverseLerp": () => (/* binding */ inverseLerp),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "nextPow2": () => (/* binding */ nextPow2),
/* harmony export */   "pingPong": () => (/* binding */ pingPong),
/* harmony export */   "pseudoRandom": () => (/* binding */ pseudoRandom),
/* harmony export */   "pseudoRandomRange": () => (/* binding */ pseudoRandomRange),
/* harmony export */   "pseudoRandomRangeInt": () => (/* binding */ pseudoRandomRangeInt),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "randomRange": () => (/* binding */ randomRange),
/* harmony export */   "randomRangeInt": () => (/* binding */ randomRangeInt),
/* harmony export */   "repeat": () => (/* binding */ repeat),
/* harmony export */   "toDegree": () => (/* binding */ toDegree),
/* harmony export */   "toRadian": () => (/* binding */ toRadian)
/* harmony export */ });
const _d2r = Math.PI / 180;
const _r2d = 180 / Math.PI;
const EPSILON = 1e-6;
function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b));
}
function approx(a, b, maxDiff) {
  maxDiff = maxDiff || EPSILON;
  return Math.abs(a - b) <= maxDiff;
}
function clamp(val, min, max) {
  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }
  return val < min ? min : val > max ? max : val;
}
function clamp01(val) {
  return val < 0 ? 0 : val > 1 ? 1 : val;
}
function lerp(from, to, ratio) {
  return from + (to - from) * ratio;
}
function toRadian(a) {
  return a * _d2r;
}
function toDegree(a) {
  return a * _r2d;
}
const random = Math.random;
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
function randomRangeInt(min, max) {
  return Math.floor(randomRange(min, max));
}
function pseudoRandom(seed) {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function pseudoRandomRange(seed, min, max) {
  return pseudoRandom(seed) * (max - min) + min;
}
function pseudoRandomRangeInt(seed, min, max) {
  return Math.floor(pseudoRandomRange(seed, min, max));
}
function nextPow2(val) {
  --val;
  val |= val >> 1;
  val |= val >> 2;
  val |= val >> 4;
  val |= val >> 8;
  val |= val >> 16;
  ++val;
  return val;
}
function repeat(t, length) {
  return t - Math.floor(t / length) * length;
}
function pingPong(t, length) {
  t = repeat(t, length * 2);
  t = length - Math.abs(t - length);
  return t;
}
function inverseLerp(from, to, value) {
  return (value - from) / (to - from);
}
function absMaxComponent(v) {
  if (Math.abs(v.x) > Math.abs(v.y)) {
    if (Math.abs(v.x) > Math.abs(v.z)) {
      return v.x;
    } else {
      return v.z;
    }
  } else if (Math.abs(v.y) > Math.abs(v.z)) {
    return v.y;
  } else {
    return v.z;
  }
}
function absMax(a, b) {
  if (Math.abs(a) > Math.abs(b)) {
    return a;
  } else {
    return b;
  }
}


/***/ }),

/***/ "./src/common/math/vec2.ts":
/*!*********************************!*\
  !*** ./src/common/math/vec2.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vec2": () => (/* binding */ Vec2)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/common/math/utils.ts");

class Vec2 {
  static copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    return out;
  }
  static set(out, x, y) {
    out.x = x;
    out.y = y;
    return out;
  }
  static add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
  }
  static subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
  }
  static multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    return out;
  }
  static divide(out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    return out;
  }
  static ceil(out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    return out;
  }
  static floor(out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    return out;
  }
  static min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
  }
  static max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
  }
  static round(out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    return out;
  }
  static multiplyScalar(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    return out;
  }
  static scaleAndAdd(out, a, b, scale) {
    out.x = a.x + b.x * scale;
    out.y = a.y + b.y * scale;
    return out;
  }
  static distance(a, b) {
    const x = b.x - a.x;
    const y = b.y - a.y;
    return Math.sqrt(x * x + y * y);
  }
  static squaredDistance(a, b) {
    const x = b.x - a.x;
    const y = b.y - a.y;
    return x * x + y * y;
  }
  static len(a) {
    const x = a.x;
    const y = a.y;
    return Math.sqrt(x * x + y * y);
  }
  static lengthSqr(a) {
    const x = a.x;
    const y = a.y;
    return x * x + y * y;
  }
  static negate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    return out;
  }
  static inverse(out, a) {
    out.x = 1 / a.x;
    out.y = 1 / a.y;
    return out;
  }
  static inverseSafe(out, a) {
    const x = a.x;
    const y = a.y;
    if (Math.abs(x) < _utils__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
      out.x = 0;
    } else {
      out.x = 1 / x;
    }
    if (Math.abs(y) < _utils__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
      out.y = 0;
    } else {
      out.y = 1 / y;
    }
    return out;
  }
  static normalize(out, a) {
    const x = a.x;
    const y = a.y;
    let len = x * x + y * y;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = x * len;
      out.y = y * len;
    }
    return out;
  }
  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }
  static cross(a, b) {
    return a.x * b.y - a.y * b.x;
  }
  static lerp(out, a, b, t) {
    const x = a.x;
    const y = a.y;
    out.x = x + t * (b.x - x);
    out.y = y + t * (b.y - y);
    return out;
  }
  static random(out, scale) {
    scale = scale || 1;
    const r = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.random)() * 2 * Math.PI;
    out.x = Math.cos(r) * scale;
    out.y = Math.sin(r) * scale;
    return out;
  }
  static transformMat3(out, a, m) {
    const x = a.x;
    const y = a.y;
    out.x = m.m00 * x + m.m03 * y + m.m06;
    out.y = m.m01 * x + m.m04 * y + m.m07;
    return out;
  }
  static transformMat4(out, a, m) {
    const x = a.x;
    const y = a.y;
    out.x = m.m00 * x + m.m04 * y + m.m12;
    out.y = m.m01 * x + m.m05 * y + m.m13;
    return out;
  }
  static str(a) {
    return `Vec2(${a.x}, ${a.y})`;
  }
  static toArray(out, v, ofs = 0) {
    out[ofs + 0] = v.x;
    out[ofs + 1] = v.y;
    return out;
  }
  static fromArray(out, arr, ofs = 0) {
    out.x = arr[ofs + 0];
    out.y = arr[ofs + 1];
    return out;
  }
  static strictEquals(a, b) {
    return a.x === b.x && a.y === b.y;
  }
  static equals(a, b, epsilon = _utils__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return Math.abs(a.x - b.x) <= epsilon * Math.max(1, Math.abs(a.x), Math.abs(b.x)) && Math.abs(a.y - b.y) <= epsilon * Math.max(1, Math.abs(a.y), Math.abs(b.y));
  }
  static angle(a, b) {
    Vec2.normalize(v2_1, a);
    Vec2.normalize(v2_2, b);
    const cosine = Vec2.dot(v2_1, v2_2);
    if (cosine > 1) {
      return 0;
    }
    if (cosine < -1) {
      return Math.PI;
    }
    return Math.acos(cosine);
  }
  constructor(x, y) {
    if (x instanceof Vec2) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x || 0;
      this.y = y || 0;
    }
  }
}
const v2_1 = new Vec2();
const v2_2 = new Vec2();


/***/ }),

/***/ "./src/common/math/vec3.ts":
/*!*********************************!*\
  !*** ./src/common/math/vec3.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vec3": () => (/* binding */ Vec3)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/common/math/utils.ts");

class Vec3 {
  static zero(out) {
    out.x = 0;
    out.y = 0;
    out.z = 0;
    return out;
  }
  static clone(a) {
    return new Vec3(a.x, a.y, a.z);
  }
  static copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    return out;
  }
  static set(out, x, y, z) {
    out.x = x;
    out.y = y;
    out.z = z;
    return out;
  }
  static add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    return out;
  }
  static subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    return out;
  }
  static multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
  }
  static divide(out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;
    return out;
  }
  static ceil(out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    out.z = Math.ceil(a.z);
    return out;
  }
  static floor(out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    out.z = Math.floor(a.z);
    return out;
  }
  static min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    return out;
  }
  static max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    return out;
  }
  static round(out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    out.z = Math.round(a.z);
    return out;
  }
  static multiplyScalar(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    return out;
  }
  static scaleAndAdd(out, a, b, scale) {
    out.x = a.x + b.x * scale;
    out.y = a.y + b.y * scale;
    out.z = a.z + b.z * scale;
    return out;
  }
  static distance(a, b) {
    const x = b.x - a.x;
    const y = b.y - a.y;
    const z = b.z - a.z;
    return Math.sqrt(x * x + y * y + z * z);
  }
  static squaredDistance(a, b) {
    const x = b.x - a.x;
    const y = b.y - a.y;
    const z = b.z - a.z;
    return x * x + y * y + z * z;
  }
  static len(a) {
    const x = a.x;
    const y = a.y;
    const z = a.z;
    return Math.sqrt(x * x + y * y + z * z);
  }
  static lengthSqr(a) {
    const x = a.x;
    const y = a.y;
    const z = a.z;
    return x * x + y * y + z * z;
  }
  static negate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    return out;
  }
  static invert(out, a) {
    out.x = 1 / a.x;
    out.y = 1 / a.y;
    out.z = 1 / a.z;
    return out;
  }
  static invertSafe(out, a) {
    const x = a.x;
    const y = a.y;
    const z = a.z;
    if (Math.abs(x) < _utils__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
      out.x = 0;
    } else {
      out.x = 1 / x;
    }
    if (Math.abs(y) < _utils__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
      out.y = 0;
    } else {
      out.y = 1 / y;
    }
    if (Math.abs(z) < _utils__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
      out.z = 0;
    } else {
      out.z = 1 / z;
    }
    return out;
  }
  static normalize(out, a) {
    const x = a.x;
    const y = a.y;
    const z = a.z;
    let len = x * x + y * y + z * z;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = x * len;
      out.y = y * len;
      out.z = z * len;
    }
    return out;
  }
  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  static cross(out, a, b) {
    const { x: ax, y: ay, z: az } = a;
    const { x: bx, y: by, z: bz } = b;
    out.x = ay * bz - az * by;
    out.y = az * bx - ax * bz;
    out.z = ax * by - ay * bx;
    return out;
  }
  static lerp(out, a, b, t) {
    out.x = a.x + t * (b.x - a.x);
    out.y = a.y + t * (b.y - a.y);
    out.z = a.z + t * (b.z - a.z);
    return out;
  }
  static random(out, scale) {
    scale = scale || 1;
    const phi = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.random)() * 2 * Math.PI;
    const cosTheta = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.random)() * 2 - 1;
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    out.x = sinTheta * Math.cos(phi) * scale;
    out.y = sinTheta * Math.sin(phi) * scale;
    out.z = cosTheta * scale;
    return out;
  }
  static transformMat4(out, a, m) {
    const x = a.x;
    const y = a.y;
    const z = a.z;
    let rhw = m.m03 * x + m.m07 * y + m.m11 * z + m.m15;
    rhw = rhw ? Math.abs(1 / rhw) : 1;
    out.x = (m.m00 * x + m.m04 * y + m.m08 * z + m.m12) * rhw;
    out.y = (m.m01 * x + m.m05 * y + m.m09 * z + m.m13) * rhw;
    out.z = (m.m02 * x + m.m06 * y + m.m10 * z + m.m14) * rhw;
    return out;
  }
  static transformMat4Normal(out, a, m) {
    const x = a.x;
    const y = a.y;
    const z = a.z;
    let rhw = m.m03 * x + m.m07 * y + m.m11 * z;
    rhw = rhw ? Math.abs(1 / rhw) : 1;
    out.x = (m.m00 * x + m.m04 * y + m.m08 * z) * rhw;
    out.y = (m.m01 * x + m.m05 * y + m.m09 * z) * rhw;
    out.z = (m.m02 * x + m.m06 * y + m.m10 * z) * rhw;
    return out;
  }
  static transformMat3(out, a, m) {
    const x = a.x;
    const y = a.y;
    const z = a.z;
    out.x = x * m.m00 + y * m.m03 + z * m.m06;
    out.y = x * m.m01 + y * m.m04 + z * m.m07;
    out.z = x * m.m02 + y * m.m05 + z * m.m08;
    return out;
  }
  static transformAffine(out, v, m) {
    const x = v.x;
    const y = v.y;
    const z = v.z;
    out.x = m.m00 * x + m.m04 * y + m.m08 * z + m.m12;
    out.y = m.m01 * x + m.m05 * y + m.m09 * z + m.m13;
    out.z = m.m02 * x + m.m06 * y + m.m10 * z + m.m14;
    return out;
  }
  static transformQuat(out, a, q) {
    const ix = q.w * a.x + q.y * a.z - q.z * a.y;
    const iy = q.w * a.y + q.z * a.x - q.x * a.z;
    const iz = q.w * a.z + q.x * a.y - q.y * a.x;
    const iw = -q.x * a.x - q.y * a.y - q.z * a.z;
    out.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
    out.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
    out.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
    return out;
  }
  static transformRTS(out, a, r, t, s) {
    const x = a.x * s.x;
    const y = a.y * s.y;
    const z = a.z * s.z;
    const ix = r.w * x + r.y * z - r.z * y;
    const iy = r.w * y + r.z * x - r.x * z;
    const iz = r.w * z + r.x * y - r.y * x;
    const iw = -r.x * x - r.y * y - r.z * z;
    out.x = ix * r.w + iw * -r.x + iy * -r.z - iz * -r.y + t.x;
    out.y = iy * r.w + iw * -r.y + iz * -r.x - ix * -r.z + t.y;
    out.z = iz * r.w + iw * -r.z + ix * -r.y - iy * -r.x + t.z;
    return out;
  }
  static transformInverseRTS(out, a, r, t, s) {
    const x = a.x - t.x;
    const y = a.y - t.y;
    const z = a.z - t.z;
    const ix = r.w * x - r.y * z + r.z * y;
    const iy = r.w * y - r.z * x + r.x * z;
    const iz = r.w * z - r.x * y + r.y * x;
    const iw = r.x * x + r.y * y + r.z * z;
    out.x = (ix * r.w + iw * r.x + iy * r.z - iz * r.y) / s.x;
    out.y = (iy * r.w + iw * r.y + iz * r.x - ix * r.z) / s.y;
    out.z = (iz * r.w + iw * r.z + ix * r.y - iy * r.x) / s.z;
    return out;
  }
  static rotateX(out, v, o, a) {
    const x = v.x - o.x;
    const y = v.y - o.y;
    const z = v.z - o.z;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const rx = x;
    const ry = y * cos - z * sin;
    const rz = y * sin + z * cos;
    out.x = rx + o.x;
    out.y = ry + o.y;
    out.z = rz + o.z;
    return out;
  }
  static rotateY(out, v, o, a) {
    const x = v.x - o.x;
    const y = v.y - o.y;
    const z = v.z - o.z;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const rx = z * sin + x * cos;
    const ry = y;
    const rz = z * cos - x * sin;
    out.x = rx + o.x;
    out.y = ry + o.y;
    out.z = rz + o.z;
    return out;
  }
  static rotateZ(out, v, o, a) {
    const x = v.x - o.x;
    const y = v.y - o.y;
    const z = v.z - o.z;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const rx = x * cos - y * sin;
    const ry = x * sin + y * cos;
    const rz = z;
    out.x = rx + o.x;
    out.y = ry + o.y;
    out.z = rz + o.z;
    return out;
  }
  static toArray(out, v, ofs = 0) {
    out[ofs + 0] = v.x;
    out[ofs + 1] = v.y;
    out[ofs + 2] = v.z;
    return out;
  }
  static fromArray(out, arr, ofs = 0) {
    out.x = arr[ofs + 0];
    out.y = arr[ofs + 1];
    out.z = arr[ofs + 2];
    return out;
  }
  static strictEquals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  }
  static equals(a, b, epsilon = _utils__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    const { x: a0, y: a1, z: a2 } = a;
    const { x: b0, y: b1, z: b2 } = b;
    return Math.abs(a0 - b0) <= epsilon * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= epsilon * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= epsilon * Math.max(1, Math.abs(a2), Math.abs(b2));
  }
  static angle(a, b) {
    Vec3.normalize(v3_1, a);
    Vec3.normalize(v3_2, b);
    const cosine = Vec3.dot(v3_1, v3_2);
    if (cosine > 1) {
      return 0;
    }
    if (cosine < -1) {
      return Math.PI;
    }
    return Math.acos(cosine);
  }
  static projectOnPlane(out, a, n) {
    return Vec3.subtract(out, a, Vec3.project(out, a, n));
  }
  static project(out, a, b) {
    const sqrLen = Vec3.lengthSqr(b);
    if (sqrLen < 1e-6) {
      return Vec3.set(out, 0, 0, 0);
    } else {
      return Vec3.multiplyScalar(out, b, Vec3.dot(a, b) / sqrLen);
    }
  }
  constructor(x, y, z) {
    if (x instanceof Vec3) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
    }
  }
}
const v3_1 = new Vec3();
const v3_2 = new Vec3();


/***/ }),

/***/ "./src/common/memop/container-manager.ts":
/*!***********************************************!*\
  !*** ./src/common/memop/container-manager.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "containerManager": () => (/* binding */ containerManager)
/* harmony export */ });
/* harmony import */ var _utils_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/array */ "./src/common/utils/array.ts");

class ContainerManager {
  constructor() {
    this._pools = [];
    this._lastShrinkPassed = 0;
    this.shrinkTimeSpan = 5;
  }
  addContainer(pool) {
    if (pool._poolHandle !== -1)
      return;
    pool._poolHandle = this._pools.length;
    this._pools.push(pool);
  }
  removeContainer(pool) {
    if (pool._poolHandle === -1)
      return;
    this._pools[this._pools.length - 1]._poolHandle = pool._poolHandle;
    (0,_utils_array__WEBPACK_IMPORTED_MODULE_0__.fastRemoveAt)(this._pools, pool._poolHandle);
    pool._poolHandle = -1;
  }
  tryShrink() {
    for (let i = 0; i < this._pools.length; i++) {
      this._pools[i].tryShrink();
    }
  }
  update(dt) {
    this._lastShrinkPassed += dt;
    if (this._lastShrinkPassed > this.shrinkTimeSpan) {
      this.tryShrink();
      this._lastShrinkPassed -= this.shrinkTimeSpan;
    }
  }
}
const containerManager = new ContainerManager();


/***/ }),

/***/ "./src/common/memop/pool.ts":
/*!**********************************!*\
  !*** ./src/common/memop/pool.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Pool": () => (/* binding */ Pool)
/* harmony export */ });
/* harmony import */ var _scalable_container__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scalable-container */ "./src/common/memop/scalable-container.ts");

class Pool extends _scalable_container__WEBPACK_IMPORTED_MODULE_0__.ScalableContainer {
  constructor(ctor, elementsPerBatch, dtor) {
    super();
    this._freepool = [];
    this._ctor = ctor;
    this._dtor = dtor || null;
    this._elementsPerBatch = Math.max(elementsPerBatch, 1);
    this._nextAvail = this._elementsPerBatch - 1;
    for (let i = 0; i < this._elementsPerBatch; ++i) {
      this._freepool.push(ctor());
    }
  }
  alloc() {
    if (this._nextAvail < 0) {
      this._freepool.length = this._elementsPerBatch;
      for (let i = 0; i < this._elementsPerBatch; i++) {
        this._freepool[i] = this._ctor();
      }
      this._nextAvail = this._elementsPerBatch - 1;
    }
    return this._freepool[this._nextAvail--];
  }
  free(obj) {
    this._freepool[++this._nextAvail] = obj;
  }
  freeArray(objs) {
    this._freepool.length = this._nextAvail + 1;
    Array.prototype.push.apply(this._freepool, objs);
    this._nextAvail += objs.length;
  }
  tryShrink() {
    if (this._nextAvail >> 1 > this._elementsPerBatch) {
      if (this._dtor) {
        for (let i = this._nextAvail >> 1; i <= this._nextAvail; i++) {
          this._dtor(this._freepool[i]);
        }
      }
      this._freepool.length = this._nextAvail >> 1;
      this._nextAvail = this._freepool.length - 1;
    }
  }
  destroy() {
    const dtor = arguments.length > 0 ? arguments[0] : null;
    const readDtor = dtor || this._dtor;
    if (readDtor) {
      for (let i = 0; i <= this._nextAvail; i++) {
        readDtor(this._freepool[i]);
      }
    }
    this._freepool.length = 0;
    this._nextAvail = -1;
    super.destroy();
  }
}


/***/ }),

/***/ "./src/common/memop/scalable-container.ts":
/*!************************************************!*\
  !*** ./src/common/memop/scalable-container.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ScalableContainer": () => (/* binding */ ScalableContainer)
/* harmony export */ });
/* harmony import */ var _container_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./container-manager */ "./src/common/memop/container-manager.ts");

class ScalableContainer {
  constructor() {
    this._poolHandle = -1;
    _container_manager__WEBPACK_IMPORTED_MODULE_0__.containerManager.addContainer(this);
  }
  destroy() {
    _container_manager__WEBPACK_IMPORTED_MODULE_0__.containerManager.removeContainer(this);
  }
}


/***/ }),

/***/ "./src/common/res/res-keeper.ts":
/*!**************************************!*\
  !*** ./src/common/res/res-keeper.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResKeeper)
/* harmony export */ });
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _res_loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./res-loader */ "./src/common/res/res-loader.ts");


const RefCount = {};
class ResKeeper extends _res_loader__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor() {
    super(...arguments);
    this.autoRes = [];
  }
  load(path, type) {
    let asset = super.load(path, type);
    if (asset != null) {
      this.addRef(asset);
      this.autoRes.push(asset);
    }
    return asset;
  }
  LoadAll(path, type) {
    let assets = super.LoadAll(path, type);
    for (let i = 0; i < assets.Length; i++) {
      let asset = assets.get_Item(i);
      if (asset != null) {
        this.addRef(asset);
        this.autoRes.push(asset);
      }
    }
    return assets;
  }
  loadBundleRes(bundName, path, type) {
    let asset = super.loadBundleRes(bundName, path, type);
    if (asset != null) {
      this.addRef(asset);
      this.autoRes.push(asset);
    }
    return asset;
  }
  releaseAutoRes() {
    for (let index = 0; index < this.autoRes.length; index++) {
      const element = this.autoRes[index];
      this.decRef(element);
    }
    this.autoRes.length = 0;
  }
  autoReleaseRes(asset) {
    this.addRef(asset);
    this.autoRes.push(asset);
  }
  addRef(asset) {
    let id = asset.GetInstanceID();
    if (RefCount[id] == null) {
      RefCount[id] = 0;
    }
    RefCount[id]++;
  }
  decRef(asset) {
    let id = asset.GetInstanceID();
    if (RefCount[id] == null) {
      csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Resources.UnloadAsset(asset);
      return;
    }
    RefCount[id]--;
    if (RefCount[id] <= 0) {
      csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Resources.UnloadAsset(asset);
      delete RefCount[id];
    }
  }
}


/***/ }),

/***/ "./src/common/res/res-loader.ts":
/*!**************************************!*\
  !*** ./src/common/res/res-loader.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResLoader)
/* harmony export */ });
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var puerts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! puerts */ "puerts");
/* harmony import */ var puerts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(puerts__WEBPACK_IMPORTED_MODULE_1__);


class ResLoader {
  load(path, type) {
    if (type) {
      return csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Resources.Load(path, (0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(type));
    } else {
      return csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Resources.Load(path);
    }
  }
  LoadAll(path, type) {
    if (type) {
      return csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Resources.LoadAll(path, (0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(type));
    } else {
      return csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Resources.LoadAll(path);
    }
  }
  loadBundleRes(bundName, path, type) {
    let bundle = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.AssetBundle.LoadFromFile(bundName);
    if (!bundle) {
      return null;
    }
    if (type) {
      return bundle.LoadAsset(path, (0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(type));
    } else {
      return bundle.LoadAsset(path);
    }
  }
}


/***/ }),

/***/ "./src/common/singleton.ts":
/*!*********************************!*\
  !*** ./src/common/singleton.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Singleton": () => (/* binding */ Singleton)
/* harmony export */ });
function Singleton() {
  const _SingletonE = class {
    constructor() {
    }
    static get inst() {
      if (_SingletonE._inst == null) {
        _SingletonE._inst = new this();
      }
      return _SingletonE._inst;
    }
  };
  let SingletonE = _SingletonE;
  SingletonE._inst = null;
  return SingletonE;
}


/***/ }),

/***/ "./src/common/sys/director.ts":
/*!************************************!*\
  !*** ./src/common/sys/director.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Director": () => (/* binding */ Director)
/* harmony export */ });
/* harmony import */ var _ui_ui_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ui/ui-manager */ "./src/common/ui/ui-manager.ts");
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scheduler */ "./src/common/sys/scheduler.ts");
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../event */ "./src/common/event/index.ts");



class Director extends _event__WEBPACK_IMPORTED_MODULE_2__.EventTarget {
  constructor() {
    super();
    this._invalid = false;
    this._paused = false;
    this._deltaTime = 0;
    this._totalTime = 0;
    this._frameStartTime = 0;
    this._totalFrames = 0;
    this._scheduler = new _scheduler__WEBPACK_IMPORTED_MODULE_1__.Scheduler();
    this._ui = _ui_ui_manager__WEBPACK_IMPORTED_MODULE_0__.UIManager.inst;
  }
  pause() {
    if (this._paused) {
      return;
    }
    this._paused = true;
  }
  resume() {
    if (!this._paused) {
      return;
    }
    this._paused = false;
  }
  getDeltaTime() {
    return this._deltaTime;
  }
  getTotalTime() {
    return this._totalTime;
  }
  getCurrentTime() {
    return this._frameStartTime;
  }
  getTotalFrames() {
    return this._totalFrames;
  }
  getFrames() {
    return 1 / this._deltaTime;
  }
  isPaused() {
    return this._paused;
  }
  getScheduler() {
    return this._scheduler;
  }
  startAnimation() {
    this._invalid = false;
  }
  stopAnimation() {
    this._invalid = true;
  }
  tick(dt) {
    if (!this._invalid) {
      this._deltaTime = this._frameStartTime;
      this._frameStartTime = dt;
      if (!this._paused) {
        this._ui.update(dt);
        this._scheduler.update(dt);
        this._ui.lateUpdate(dt);
      }
      this._totalTime += dt;
      this._totalFrames++;
    }
  }
}
Director.inst = new Director();


/***/ }),

/***/ "./src/common/sys/scheduler.ts":
/*!*************************************!*\
  !*** ./src/common/sys/scheduler.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scheduler": () => (/* binding */ Scheduler),
/* harmony export */   "scheduler": () => (/* binding */ scheduler)
/* harmony export */ });
/* harmony import */ var common_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! common/utils/js */ "./src/common/utils/js.ts");
/* harmony import */ var _utils_id_generator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/id-generator */ "./src/common/utils/id-generator.ts");
/* harmony import */ var _utils_macro__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/macro */ "./src/common/utils/macro.ts");
/* harmony import */ var _system__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./system */ "./src/common/sys/system.ts");




const MAX_POOL_SIZE = 20;
const idGenerator = new _utils_id_generator__WEBPACK_IMPORTED_MODULE_1__["default"]("Scheduler");
const _ListEntry = class {
  constructor(target, priority, paused, markedForDeletion) {
    this.target = target;
    this.priority = priority;
    this.paused = paused;
    this.markedForDeletion = markedForDeletion;
  }
};
let ListEntry = _ListEntry;
ListEntry.get = (target, priority, paused, markedForDeletion) => {
  let result = _ListEntry._listEntries.pop();
  if (result) {
    result.target = target;
    result.priority = priority;
    result.paused = paused;
    result.markedForDeletion = markedForDeletion;
  } else {
    result = new _ListEntry(target, priority, paused, markedForDeletion);
  }
  return result;
};
ListEntry.put = (entry) => {
  if (_ListEntry._listEntries.length < MAX_POOL_SIZE) {
    entry.target = null;
    _ListEntry._listEntries.push(entry);
  }
};
ListEntry._listEntries = [];
const _HashUpdateEntry = class {
  constructor(list, entry, target, callback) {
    this.list = list;
    this.entry = entry;
    this.target = target;
    this.callback = callback;
  }
};
let HashUpdateEntry = _HashUpdateEntry;
HashUpdateEntry.get = (list, entry, target, callback) => {
  let result = _HashUpdateEntry._hashUpdateEntries.pop();
  if (result) {
    result.list = list;
    result.entry = entry;
    result.target = target;
    result.callback = callback;
  } else {
    result = new _HashUpdateEntry(list, entry, target, callback);
  }
  return result;
};
HashUpdateEntry.put = (entry) => {
  if (_HashUpdateEntry._hashUpdateEntries.length < MAX_POOL_SIZE) {
    entry.list = entry.entry = entry.target = entry.callback = null;
    _HashUpdateEntry._hashUpdateEntries.push(entry);
  }
};
HashUpdateEntry._hashUpdateEntries = [];
const _HashTimerEntry = class {
  constructor(timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused) {
    this.timers = timers;
    this.target = target;
    this.timerIndex = timerIndex;
    this.currentTimer = currentTimer;
    this.currentTimerSalvaged = currentTimerSalvaged;
    this.paused = paused;
  }
};
let HashTimerEntry = _HashTimerEntry;
HashTimerEntry.get = (timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused) => {
  let result = _HashTimerEntry._hashTimerEntries.pop();
  if (result) {
    result.timers = timers;
    result.target = target;
    result.timerIndex = timerIndex;
    result.currentTimer = currentTimer;
    result.currentTimerSalvaged = currentTimerSalvaged;
    result.paused = paused;
  } else {
    result = new _HashTimerEntry(
      timers,
      target,
      timerIndex,
      currentTimer,
      currentTimerSalvaged,
      paused
    );
  }
  return result;
};
HashTimerEntry.put = (entry) => {
  if (_HashTimerEntry._hashTimerEntries.length < MAX_POOL_SIZE) {
    entry.timers = entry.target = entry.currentTimer = null;
    _HashTimerEntry._hashTimerEntries.push(entry);
  }
};
HashTimerEntry._hashTimerEntries = [];
const _CallbackTimer = class {
  constructor() {
    this._lock = false;
    this._scheduler = null;
    this._elapsed = -1;
    this._runForever = false;
    this._useDelay = false;
    this._timesExecuted = 0;
    this._repeat = 0;
    this._delay = 0;
    this._interval = 0;
    this._target = null;
    this._callback = null;
  }
  initWithCallback(scheduler2, callback, target, seconds, repeat, delay) {
    this._lock = false;
    this._scheduler = scheduler2;
    this._target = target;
    this._callback = callback;
    this._elapsed = -1;
    this._interval = seconds;
    this._delay = delay;
    this._useDelay = this._delay > 0;
    this._repeat = repeat;
    this._runForever = this._repeat === _utils_macro__WEBPACK_IMPORTED_MODULE_2__.macro.REPEAT_FOREVER;
    return true;
  }
  getInterval() {
    return this._interval;
  }
  setInterval(interval) {
    this._interval = interval;
  }
  update(dt) {
    if (this._elapsed === -1) {
      this._elapsed = 0;
      this._timesExecuted = 0;
    } else {
      this._elapsed += dt;
      if (this._runForever && !this._useDelay) {
        if (this._elapsed >= this._interval) {
          this.trigger();
          this._elapsed = 0;
        }
      } else {
        if (this._useDelay) {
          if (this._elapsed >= this._delay) {
            this.trigger();
            this._elapsed -= this._delay;
            this._timesExecuted += 1;
            this._useDelay = false;
          }
        } else if (this._elapsed >= this._interval) {
          this.trigger();
          this._elapsed = 0;
          this._timesExecuted += 1;
        }
        if (this._callback && !this._runForever && this._timesExecuted > this._repeat) {
          this.cancel();
        }
      }
    }
  }
  getCallback() {
    return this._callback;
  }
  trigger() {
    if (this._target && this._callback) {
      this._lock = true;
      this._callback.call(this._target, this._elapsed);
      this._lock = false;
    }
  }
  cancel() {
    this._scheduler.unschedule(this._callback, this._target);
  }
};
let CallbackTimer = _CallbackTimer;
CallbackTimer._timers = [];
CallbackTimer.get = () => _CallbackTimer._timers.pop() || new _CallbackTimer();
CallbackTimer.put = (timer) => {
  if (_CallbackTimer._timers.length < MAX_POOL_SIZE && !timer._lock) {
    timer._scheduler = timer._target = timer._callback = null;
    _CallbackTimer._timers.push(timer);
  }
};
class Scheduler extends _system__WEBPACK_IMPORTED_MODULE_3__["default"] {
  constructor() {
    super();
    this._timeScale = 1;
    this._updatesNegList = [];
    this._updates0List = [];
    this._updatesPosList = [];
    this._hashForUpdates = (0,common_utils_js__WEBPACK_IMPORTED_MODULE_0__.createMap)(true);
    this._hashForTimers = (0,common_utils_js__WEBPACK_IMPORTED_MODULE_0__.createMap)(true);
    this._currentTarget = null;
    this._currentTargetSalvaged = false;
    this._updateHashLocked = false;
    this._arrayForTimers = [];
  }
  static enableForTarget(target) {
    let found = false;
    if (target.uuid) {
      found = true;
    } else if (target.id) {
      found = true;
    }
    if (!found) {
      target.id = idGenerator.getNewId();
    }
  }
  setTimeScale(timeScale) {
    this._timeScale = timeScale;
  }
  getTimeScale() {
    return this._timeScale;
  }
  update(dt) {
    this._updateHashLocked = true;
    if (this._timeScale !== 1) {
      dt *= this._timeScale;
    }
    let i;
    let list;
    let len;
    let entry;
    for (i = 0, list = this._updatesNegList, len = list.length; i < len; i++) {
      entry = list[i];
      if (!entry.paused && !entry.markedForDeletion) {
        entry.target.update(dt);
      }
    }
    for (i = 0, list = this._updates0List, len = list.length; i < len; i++) {
      entry = list[i];
      if (!entry.paused && !entry.markedForDeletion) {
        entry.target.update(dt);
      }
    }
    for (i = 0, list = this._updatesPosList, len = list.length; i < len; i++) {
      entry = list[i];
      if (!entry.paused && !entry.markedForDeletion) {
        entry.target.update(dt);
      }
    }
    let elt;
    const arr = this._arrayForTimers;
    for (i = 0; i < arr.length; i++) {
      elt = arr[i];
      this._currentTarget = elt;
      this._currentTargetSalvaged = false;
      if (!elt.paused) {
        for (elt.timerIndex = 0; elt.timerIndex < elt.timers.length; ++elt.timerIndex) {
          elt.currentTimer = elt.timers[elt.timerIndex];
          elt.currentTimerSalvaged = false;
          elt.currentTimer.update(dt);
          elt.currentTimer = null;
        }
      }
      if (this._currentTargetSalvaged && this._currentTarget.timers.length === 0) {
        this._removeHashElement(this._currentTarget);
        --i;
      }
    }
    for (i = 0, list = this._updatesNegList; i < list.length; ) {
      entry = list[i];
      if (entry.markedForDeletion) {
        this._removeUpdateFromHash(entry);
      } else {
        i++;
      }
    }
    for (i = 0, list = this._updates0List; i < list.length; ) {
      entry = list[i];
      if (entry.markedForDeletion) {
        this._removeUpdateFromHash(entry);
      } else {
        i++;
      }
    }
    for (i = 0, list = this._updatesPosList; i < list.length; ) {
      entry = list[i];
      if (entry.markedForDeletion) {
        this._removeUpdateFromHash(entry);
      } else {
        i++;
      }
    }
    this._updateHashLocked = false;
    this._currentTarget = null;
  }
  schedule(callback, target, interval, repeat, delay, paused) {
    if (typeof callback !== "function") {
      const tmp = callback;
      callback = target;
      target = tmp;
    }
    if (arguments.length === 3 || arguments.length === 4 || arguments.length === 5) {
      paused = !!repeat;
      repeat = _utils_macro__WEBPACK_IMPORTED_MODULE_2__.macro.REPEAT_FOREVER;
      delay = 0;
    }
    const targetId = target.uuid || target.id;
    if (!targetId) {
      console.error(1510);
      return;
    }
    let element = this._hashForTimers[targetId];
    if (!element) {
      element = HashTimerEntry.get(null, target, 0, null, null, paused);
      this._arrayForTimers.push(element);
      this._hashForTimers[targetId] = element;
    } else if (element.paused !== paused) {
      console.warn(1511);
    }
    let timer;
    let i;
    if (element.timers == null) {
      element.timers = [];
    } else {
      for (i = 0; i < element.timers.length; ++i) {
        timer = element.timers[i];
        if (timer && callback === timer._callback) {
          console.log(1507, timer.getInterval(), interval);
          timer._interval = interval;
          return;
        }
      }
    }
    timer = CallbackTimer.get();
    timer.initWithCallback(this, callback, target, interval, repeat, delay);
    element.timers.push(timer);
    if (this._currentTarget === element && this._currentTargetSalvaged) {
      this._currentTargetSalvaged = false;
    }
  }
  scheduleUpdate(target, priority, paused) {
    const targetId = target.uuid || target.id;
    if (!targetId) {
      console.error(1510);
      return;
    }
    const hashElement = this._hashForUpdates[targetId];
    if (hashElement && hashElement.entry) {
      if (hashElement.entry.priority !== priority) {
        if (this._updateHashLocked) {
          console.log(1506);
          hashElement.entry.markedForDeletion = false;
          hashElement.entry.paused = paused;
          return;
        } else {
          this.unscheduleUpdate(target);
        }
      } else {
        hashElement.entry.markedForDeletion = false;
        hashElement.entry.paused = paused;
        return;
      }
    }
    const listElement = ListEntry.get(target, priority, paused, false);
    let ppList;
    if (priority === 0) {
      ppList = this._updates0List;
      this._appendIn(ppList, listElement);
    } else {
      ppList = priority < 0 ? this._updatesNegList : this._updatesPosList;
      this._priorityIn(ppList, listElement, priority);
    }
    this._hashForUpdates[targetId] = HashUpdateEntry.get(
      ppList,
      listElement,
      target,
      null
    );
  }
  unschedule(callback, target) {
    if (!target || !callback) {
      return;
    }
    const targetId = target.uuid || target.id;
    if (!targetId) {
      console.error(1510);
      return;
    }
    const element = this._hashForTimers[targetId];
    if (element) {
      const timers = element.timers;
      for (let i = 0, li = timers.length; i < li; i++) {
        const timer = timers[i];
        if (callback === timer._callback) {
          if (timer === element.currentTimer && !element.currentTimerSalvaged) {
            element.currentTimerSalvaged = true;
          }
          timers.splice(i, 1);
          CallbackTimer.put(timer);
          if (element.timerIndex >= i) {
            element.timerIndex--;
          }
          if (timers.length === 0) {
            if (this._currentTarget === element) {
              this._currentTargetSalvaged = true;
            } else {
              this._removeHashElement(element);
            }
          }
          return;
        }
      }
    }
  }
  unscheduleUpdate(target) {
    if (!target) {
      return;
    }
    const targetId = target.uuid || target.id;
    if (!targetId) {
      console.error(1510);
      return;
    }
    const element = this._hashForUpdates[targetId];
    if (element) {
      if (this._updateHashLocked) {
        element.entry.markedForDeletion = true;
      } else {
        this._removeUpdateFromHash(element.entry);
      }
    }
  }
  unscheduleAllForTarget(target) {
    if (!target) {
      return;
    }
    const targetId = target.uuid || target.id;
    if (!targetId) {
      console.error(1510);
      return;
    }
    const element = this._hashForTimers[targetId];
    if (element) {
      const timers = element.timers;
      if (timers.indexOf(element.currentTimer) > -1 && !element.currentTimerSalvaged) {
        element.currentTimerSalvaged = true;
      }
      for (let i = 0, l = timers.length; i < l; i++) {
        CallbackTimer.put(timers[i]);
      }
      timers.length = 0;
      if (this._currentTarget === element) {
        this._currentTargetSalvaged = true;
      } else {
        this._removeHashElement(element);
      }
    }
    this.unscheduleUpdate(target);
  }
  unscheduleAll() {
    this.unscheduleAllWithMinPriority(_system__WEBPACK_IMPORTED_MODULE_3__["default"].Priority.SCHEDULER);
  }
  unscheduleAllWithMinPriority(minPriority) {
    let i;
    let element;
    const arr = this._arrayForTimers;
    for (i = arr.length - 1; i >= 0; i--) {
      element = arr[i];
      this.unscheduleAllForTarget(element.target);
    }
    let entry;
    let temp_length = 0;
    if (minPriority < 0) {
      for (i = 0; i < this._updatesNegList.length; ) {
        temp_length = this._updatesNegList.length;
        entry = this._updatesNegList[i];
        if (entry && entry.priority >= minPriority) {
          this.unscheduleUpdate(entry.target);
        }
        if (temp_length === this._updatesNegList.length) {
          i++;
        }
      }
    }
    if (minPriority <= 0) {
      for (i = 0; i < this._updates0List.length; ) {
        temp_length = this._updates0List.length;
        entry = this._updates0List[i];
        if (entry) {
          this.unscheduleUpdate(entry.target);
        }
        if (temp_length === this._updates0List.length) {
          i++;
        }
      }
    }
    for (i = 0; i < this._updatesPosList.length; ) {
      temp_length = this._updatesPosList.length;
      entry = this._updatesPosList[i];
      if (entry && entry.priority >= minPriority) {
        this.unscheduleUpdate(entry.target);
      }
      if (temp_length === this._updatesPosList.length) {
        i++;
      }
    }
  }
  isScheduled(callback, target) {
    const targetId = target.uuid || target.id;
    if (!targetId) {
      console.error(1510);
      return false;
    }
    const element = this._hashForTimers[targetId];
    if (!element) {
      return false;
    }
    if (element.timers == null) {
      return false;
    } else {
      const timers = element.timers;
      for (let i = 0; i < timers.length; ++i) {
        const timer = timers[i];
        if (callback === timer._callback) {
          return true;
        }
      }
      return false;
    }
  }
  pauseAllTargets() {
    return this.pauseAllTargetsWithMinPriority(_system__WEBPACK_IMPORTED_MODULE_3__["default"].Priority.SCHEDULER);
  }
  pauseAllTargetsWithMinPriority(minPriority) {
    const idsWithSelectors = [];
    let element;
    const locArrayForTimers = this._arrayForTimers;
    let i;
    let li;
    for (i = 0, li = locArrayForTimers.length; i < li; i++) {
      element = locArrayForTimers[i];
      if (element) {
        element.paused = true;
        idsWithSelectors.push(element.target);
      }
    }
    let entry;
    if (minPriority < 0) {
      for (i = 0; i < this._updatesNegList.length; i++) {
        entry = this._updatesNegList[i];
        if (entry) {
          if (entry.priority >= minPriority) {
            entry.paused = true;
            idsWithSelectors.push(entry.target);
          }
        }
      }
    }
    if (minPriority <= 0) {
      for (i = 0; i < this._updates0List.length; i++) {
        entry = this._updates0List[i];
        if (entry) {
          entry.paused = true;
          idsWithSelectors.push(entry.target);
        }
      }
    }
    for (i = 0; i < this._updatesPosList.length; i++) {
      entry = this._updatesPosList[i];
      if (entry) {
        if (entry.priority >= minPriority) {
          entry.paused = true;
          idsWithSelectors.push(entry.target);
        }
      }
    }
    return idsWithSelectors;
  }
  resumeTargets(targetsToResume) {
    if (!targetsToResume) {
      return;
    }
    for (let i = 0; i < targetsToResume.length; i++) {
      this.resumeTarget(targetsToResume[i]);
    }
  }
  pauseTarget(target) {
    const targetId = target.uuid || target.id;
    if (!targetId) {
      console.error(1510);
      return;
    }
    const element = this._hashForTimers[targetId];
    if (element) {
      element.paused = true;
    }
    const elementUpdate = this._hashForUpdates[targetId];
    if (elementUpdate) {
      elementUpdate.entry.paused = true;
    }
  }
  resumeTarget(target) {
    const targetId = target.uuid || target.id;
    if (!targetId) {
      console.error(1510);
      return;
    }
    const element = this._hashForTimers[targetId];
    if (element) {
      element.paused = false;
    }
    const elementUpdate = this._hashForUpdates[targetId];
    if (elementUpdate) {
      elementUpdate.entry.paused = false;
    }
  }
  isTargetPaused(target) {
    const targetId = target.uuid || target.id;
    if (!targetId) {
      console.error(1510);
      return false;
    }
    const element = this._hashForTimers[targetId];
    if (element) {
      return element.paused;
    }
    const elementUpdate = this._hashForUpdates[targetId];
    if (elementUpdate) {
      return elementUpdate.entry.paused;
    }
    return false;
  }
  _removeHashElement(element) {
    const targetId = element.target.uuid || element.target.id;
    delete this._hashForTimers[targetId];
    const arr = this._arrayForTimers;
    for (let i = 0, l = arr.length; i < l; i++) {
      if (arr[i] === element) {
        arr.splice(i, 1);
        break;
      }
    }
    HashTimerEntry.put(element);
  }
  _removeUpdateFromHash(entry) {
    const targetId = entry.target.uuid || entry.target.id;
    const element = this._hashForUpdates[targetId];
    if (element) {
      const list = element.list;
      const listEntry = element.entry;
      for (let i = 0, l = list.length; i < l; i++) {
        if (list[i] === listEntry) {
          list.splice(i, 1);
          break;
        }
      }
      delete this._hashForUpdates[targetId];
      ListEntry.put(listEntry);
      HashUpdateEntry.put(element);
    }
  }
  _priorityIn(ppList, listElement, priority) {
    for (let i = 0; i < ppList.length; i++) {
      if (priority < ppList[i].priority) {
        ppList.splice(i, 0, listElement);
        return;
      }
    }
    ppList.push(listElement);
  }
  _appendIn(ppList, listElement) {
    ppList.push(listElement);
  }
}
Scheduler.ID = "scheduler";
const scheduler = new Scheduler();


/***/ }),

/***/ "./src/common/sys/system.ts":
/*!**********************************!*\
  !*** ./src/common/sys/system.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ System)
/* harmony export */ });
var Priority = /* @__PURE__ */ ((Priority2) => {
  Priority2[Priority2["LOW"] = 0] = "LOW";
  Priority2[Priority2["MEDIUM"] = 100] = "MEDIUM";
  Priority2[Priority2["HIGH"] = 200] = "HIGH";
  Priority2[Priority2["SCHEDULER"] = 2147483648] = "SCHEDULER";
  return Priority2;
})(Priority || {});
class System {
  constructor() {
    this._id = "";
    this._priority = 0;
    this._executeInEditMode = false;
  }
  set priority(value) {
    this._priority = value;
  }
  get priority() {
    return this._priority;
  }
  set id(id) {
    this._id = id;
  }
  get id() {
    return this._id;
  }
  static sortByPriority(a, b) {
    if (a._priority < b._priority) {
      return 1;
    } else if (a._priority > b.priority) {
      return -1;
    } else {
      return 0;
    }
  }
  update(dt) {
  }
  postUpdate(dt) {
  }
}
System.Priority = Priority;


/***/ }),

/***/ "./src/common/ui/ui-base.ts":
/*!**********************************!*\
  !*** ./src/common/ui/ui-base.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UIBase": () => (/* binding */ UIBase)
/* harmony export */ });
/* harmony import */ var define_ui_define__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! define/ui-define */ "./src/define/ui-define.ts");
/* harmony import */ var _ui_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui-manager */ "./src/common/ui/ui-manager.ts");
/* harmony import */ var _ui_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui-component */ "./src/common/ui/ui-component.ts");



class UIBase extends _ui_component__WEBPACK_IMPORTED_MODULE_2__.UIComponent {
  constructor() {
    super(...arguments);
    this.showType = define_ui_define__WEBPACK_IMPORTED_MODULE_0__.UIShowTypes.UIAddition;
    this.quickClose = true;
    this.maskOpacity = 255;
    this._para = null;
    this.isPlayOpenAni = false;
    this.panel = null;
    this.gameObject = null;
  }
  close() {
    _ui_manager__WEBPACK_IMPORTED_MODULE_1__.UIManager.inst.close(this.uiType);
  }
  init(uiType, args) {
    this._para = Object.assign({}, args);
    this.uiType = uiType;
  }
  onOpen(uiType, args) {
  }
  onOpenAniOver() {
  }
  onClose() {
  }
  onTop(preID, ...args) {
  }
}


/***/ }),

/***/ "./src/common/ui/ui-component.ts":
/*!***************************************!*\
  !*** ./src/common/ui/ui-component.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UIComponent": () => (/* binding */ UIComponent)
/* harmony export */ });
/* harmony import */ var common_res_res_keeper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! common/res/res-keeper */ "./src/common/res/res-keeper.ts");
/* harmony import */ var _sys_director__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sys/director */ "./src/common/sys/director.ts");
/* harmony import */ var _sys_scheduler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../sys/scheduler */ "./src/common/sys/scheduler.ts");
/* harmony import */ var _utils_macro__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/macro */ "./src/common/utils/macro.ts");




class UIComponent extends common_res_res_keeper__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super();
    this.id = null;
    this._scheduler = null;
    this._scheduler = _sys_director__WEBPACK_IMPORTED_MODULE_1__.Director.inst.getScheduler();
    _sys_scheduler__WEBPACK_IMPORTED_MODULE_2__.Scheduler.enableForTarget(this);
  }
  schedule(callback, interval = 0, repeat = _utils_macro__WEBPACK_IMPORTED_MODULE_3__.macro.REPEAT_FOREVER, delay = 0) {
    interval = interval || 0;
    repeat = Number.isNaN(repeat) ? _utils_macro__WEBPACK_IMPORTED_MODULE_3__.macro.REPEAT_FOREVER : repeat;
    delay = delay || 0;
    const scheduler = this._scheduler;
    const paused = scheduler.isTargetPaused(this);
    scheduler.schedule(callback, this, interval, repeat, delay, paused);
  }
  scheduleOnce(callback, delay = 0) {
    this.schedule(callback, 0, 0, delay);
  }
  unschedule(callback_fn) {
    if (!callback_fn) {
      return;
    }
    this._scheduler.unschedule(callback_fn, this);
  }
  unscheduleAllCallbacks() {
    this._scheduler.unscheduleAllForTarget(this);
  }
  destroy() {
    this.releaseAutoRes();
  }
}


/***/ }),

/***/ "./src/common/ui/ui-manager.ts":
/*!*************************************!*\
  !*** ./src/common/ui/ui-manager.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UIManager": () => (/* binding */ UIManager),
/* harmony export */   "eOrientation": () => (/* binding */ eOrientation)
/* harmony export */ });
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var puerts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! puerts */ "puerts");
/* harmony import */ var puerts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(puerts__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _define_ui_define__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../define/ui-define */ "./src/define/ui-define.ts");
/* harmony import */ var _singleton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../singleton */ "./src/common/singleton.ts");




var eOrientation = /* @__PURE__ */ ((eOrientation2) => {
  eOrientation2[eOrientation2["Landscape"] = 0] = "Landscape";
  eOrientation2[eOrientation2["Portrait"] = 1] = "Portrait";
  return eOrientation2;
})(eOrientation || {});
class UIManager extends (0,_singleton__WEBPACK_IMPORTED_MODULE_3__.Singleton)() {
  constructor() {
    super(...arguments);
    this.canvas = null;
    this.camera = null;
    this.guiLayer = null;
    this.tipLayer = null;
    this.topLayer = null;
    this.eventSystem = null;
    this._uiWaitNode = null;
    this.BackGroundUI = 0;
    this.isClosing = false;
    this.isOpening = false;
    this.UICache = {};
    this.FairyGUIPackage = {};
    this.UIStack = [];
    this.UIOpenQueue = [];
    this.UICloseQueue = [];
    this._packageRefCount = {};
  }
  open(uiType, uiArgs, progressCallback, completeCallback) {
    let uiInfo = {
      uiType,
      uiArgs,
      uiView: null
    };
    if (this.isOpening || this.isClosing) {
      console.log(
        `open <${_define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType[uiType]}> ui action push into a queue!`
      );
      this.UIOpenQueue.push(uiInfo);
      return;
    }
    let uiIndex = this.getUIIndex(uiType);
    if (-1 != uiIndex) {
      this.closeToUI(uiType, uiArgs);
      return;
    }
    uiInfo.zOrder = this.UIStack.length + 1;
    this.UIStack.push(uiInfo);
    this.isOpening = true;
    this.showUIWaitAnim();
    let dataInfo = _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIDataInfo.getUIData(uiType);
    let uiView = new dataInfo.uiBase();
    let panel = this.createFGUI(uiType, uiInfo.zOrder);
    uiView.panel = panel;
    uiView.gameObject = panel.gameObject;
    uiView.init(uiType, uiArgs);
    this.hideUIWaitAnim();
    if (uiInfo.isClose || null == uiView) {
      console.log(
        `getOrCreateUI ${uiType} faile! close state : ${uiInfo.isClose} , uiView : ${uiView}`,
        "%s"
      );
      this.isOpening = false;
      completeCallback && completeCallback(null);
      return;
    }
    if (dataInfo.preventTouch) {
      uiInfo.preventNode = this.createBack(uiInfo.zOrder);
    }
    this.onUIOpen(uiType, uiView, uiInfo, uiArgs);
    this.isOpening = false;
    this.autoExecNextUI();
    completeCallback && completeCallback(uiView);
  }
  close(uiType, playCloseAni = true) {
    console.log(`close ui <${_define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType[uiType]}>`);
    let uiCount = this.UIStack.length;
    let uiInfo;
    let uiCloseInfo = {
      uiType,
      playAnim: playCloseAni
    };
    if (!(uiType > _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType.$Start && uiType < _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType.$End)) {
      console.error("unknown ui type to close!", "%s");
      return;
    }
    if (!this.isUIOpen(uiType)) {
      console.log(`<${_define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType[uiType]}> not has open`);
      return;
    }
    if (uiCount < 1 || this.isOpening || this.isClosing) {
      console.log(
        `<${_define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType[uiType]}> can not be close in this period of time`
      );
      this.UICloseQueue.push(uiCloseInfo);
      return;
    }
    for (let index = this.UIStack.length - 1; index >= 0; index--) {
      let ui = this.UIStack[index];
      if (ui.uiType === uiType) {
        uiInfo = ui;
        this.UIStack.splice(index, 1);
        break;
      }
    }
    if (uiInfo === void 0) {
      return;
    }
    this.isClosing = true;
    let uiId = uiInfo.uiType;
    let uiView = uiInfo.uiView;
    uiInfo.isClose = true;
    if (uiInfo.preventNode) {
      csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Object.Destroy(uiInfo.preventNode);
      uiInfo.preventNode = null;
    }
    if (null == uiView) {
      this.isClosing = false;
      return;
    }
    this.updateUI();
    this.onUIClose(uiId, uiView, uiInfo);
  }
  onUIOpen(uiType, uiView, uiInfo, uiArgs) {
    if (null == uiView) {
      return;
    }
    uiInfo.uiView = uiView;
    uiView.gameObject.SetActive(true);
    uiView.gameObject.transform.SetSiblingIndex(
      uiInfo.zOrder || this.UIStack.length
    );
    if (uiInfo.preventNode) {
      uiInfo.preventNode.ui.alpha = 255 / uiView.maskOpacity;
    }
    if (uiView.quickClose) {
      uiView.panel.ui.onClick.Add((context) => {
        let obj = csharp__WEBPACK_IMPORTED_MODULE_0__.FairyGUI.GRoot.inst.touchTarget;
        if (obj.name == "") {
          console.log(`touch close <${_define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType[uiType]}>`);
          this.close(uiType);
        }
      });
    }
    this.add2Layer(uiView.gameObject);
    this.updateUI();
    let fromUIID = 0;
    if (this.UIStack.length > 1) {
      fromUIID = this.UIStack[this.UIStack.length - 2].uiType;
    }
    if (this.uiOpenBeforeDelegate) {
      this.uiOpenBeforeDelegate(uiType, fromUIID);
    }
    uiView.onOpen(fromUIID, uiArgs);
    let onAniOverFunc = () => {
      uiView.isPlayOpenAni = false;
      uiView.onOpenAniOver();
      if (this.uiOpenDelegate) {
        this.uiOpenDelegate(uiType, fromUIID);
      }
    };
    onAniOverFunc();
  }
  onUIClose(uiType, uiView, uiInfo) {
    let preUIInfo = this.UIStack[this.UIStack.length - 2];
    let onAniOverFunc = () => {
      if (preUIInfo && preUIInfo.uiView && this.isTopUI(preUIInfo.uiType)) {
        preUIInfo.uiView.gameObject.SetActive(true);
        preUIInfo.uiView.onTop(uiType, uiView.onClose());
      } else {
        uiView.onClose();
      }
      if (this.uiCloseDelegate) {
        this.uiCloseDelegate(uiType);
      }
      let dataInfo = _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIDataInfo.getUIData(uiType);
      if (dataInfo.cache) {
        this.UICache[uiType] = uiView;
        uiView.gameObject.transform.parent = null;
        console.log(`uiView removeFromParent ${uiInfo.uiType}`);
      } else {
        uiView.destroy();
        uiInfo.uiView = null;
        console.log(`uiView destroy <${_define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType[uiInfo.uiType]}>`);
        this.destroyFGUI(uiType, uiView);
      }
      this.isClosing = false;
      this.autoExecNextUI();
    };
    onAniOverFunc();
  }
  createFGUI(uiType, zOrder) {
    let dataInfo = _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIDataInfo.getUIData(uiType);
    if (!this.FairyGUIPackage[dataInfo.packagePath]) {
      this.FairyGUIPackage[dataInfo.packagePath] = 0;
      csharp__WEBPACK_IMPORTED_MODULE_0__.FairyGUI.UIPackage.AddPackage(dataInfo.packagePath);
    }
    this.FairyGUIPackage[dataInfo.packagePath]++;
    let panel = new csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.GameObject().AddComponent(
      (0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.FairyGUI.UIPanel)
    );
    panel.gameObject.layer = 5;
    panel.packageName = dataInfo.packageName;
    panel.componentName = dataInfo.componentName;
    panel.fitScreen = csharp__WEBPACK_IMPORTED_MODULE_0__.FairyGUI.FitScreen.FitSize;
    panel.SetSortingOrder(zOrder, true);
    panel.CreateUI();
    let uiNode = panel.gameObject;
    uiNode.name = _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType[uiType];
    return panel;
  }
  destroyFGUI(uiType, uiView) {
    let dataInfo = _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIDataInfo.getUIData(uiType);
    csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Object.Destroy(uiView.gameObject);
    this.FairyGUIPackage[dataInfo.packagePath]--;
    if (!this.FairyGUIPackage[dataInfo.packagePath]) {
      csharp__WEBPACK_IMPORTED_MODULE_0__.FairyGUI.UIPackage.RemovePackage(dataInfo.packagePath);
    }
  }
  closeToUI(uiType, uiArgs, bOpenSelf = true) {
    let idx = this.getUIIndex(uiType);
    if (-1 == idx) {
      return;
    }
    idx = bOpenSelf ? idx : idx + 1;
    for (let i = this.UIStack.length - 1; i >= idx; --i) {
      let uiInfo = this.UIStack.pop();
      let uiType2 = uiInfo.uiType;
      let uiView = uiInfo.uiView;
      uiInfo.isClose = true;
      if (uiInfo.preventNode) {
        csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Object.Destroy(uiInfo.preventNode);
        uiInfo.preventNode = null;
      }
      if (this.uiCloseDelegate) {
        this.uiCloseDelegate(uiType2);
      }
      if (uiView) {
        uiView.onClose();
        let dataInfo = _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIDataInfo.getUIData(uiType2);
        if (dataInfo.cache) {
          this.UICache[uiType2] = uiView;
          uiView.gameObject.transform.parent = null;
        } else {
          csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Object.Destroy(uiView.gameObject);
        }
      }
    }
    this.updateUI();
    this.UIOpenQueue = [];
    bOpenSelf && this.open(uiType, uiArgs);
  }
  closeAll(excludeUI = _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType.Loading) {
    let len = this.UIStack.length;
    for (let i = len - 1; i >= 0; --i) {
      let uiInfo = this.UIStack[i];
      if (uiInfo.uiType == excludeUI) {
        continue;
      }
      this.close(uiInfo.uiType, false);
    }
    this.UIOpenQueue = [];
    this.isOpening = false;
    this.isClosing = false;
  }
  clearCache() {
    for (const key in this.UICache) {
      let ui = this.UICache[key];
    }
    this.UICache = {};
  }
  isTopUI(uiType) {
    if (this.UIStack.length == 0) {
      return false;
    }
    return this.UIStack[this.UIStack.length - 1].uiType == uiType;
  }
  getUI(uiType) {
    for (let index = 0; index < this.UIStack.length; index++) {
      const element = this.UIStack[index];
      if (uiType == element.uiType) {
        return element.uiView;
      }
    }
    return null;
  }
  isUIOpen(uiType) {
    return this.getUI(uiType) != null;
  }
  getTopUI() {
    if (this.UIStack.length > 0) {
      return this.UIStack[this.UIStack.length - 1].uiView;
    }
    return null;
  }
  centerToUI(gameObject) {
    let canvas = this.canvas.transform;
    let rectTransform = gameObject.transform;
    if (rectTransform == null) {
      return;
    }
    rectTransform.anchoredPosition = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Vector2.zero;
    rectTransform.SetSizeWithCurrentAnchors(
      csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.RectTransform.Axis.Horizontal,
      canvas.rect.width
    );
    rectTransform.SetSizeWithCurrentAnchors(
      csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.RectTransform.Axis.Vertical,
      canvas.rect.height
    );
  }
  createCanvas() {
    this.canvas = new csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.GameObject().AddComponent(
      (0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Canvas)
    );
    this.canvas.gameObject.AddComponent(
      (0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.UI.GraphicRaycaster)
    );
    this.canvas.gameObject.name = "Canvas";
    this.canvas.renderMode = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.RenderMode.ScreenSpaceOverlay;
    this.camera = new csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.GameObject().AddComponent(
      (0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Camera)
    );
    this.camera.gameObject.name = "Camera";
    this.camera.backgroundColor = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Color.black;
    this.camera.clearFlags = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.CameraClearFlags.SolidColor;
    this.camera.orthographic = true;
    this.camera.transform.parent = this.canvas.transform;
    this.guiLayer = new csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.GameObject();
    this.guiLayer.name = "GuiLayer";
    this.guiLayer.transform.parent = this.canvas.transform;
    this.guiLayer.AddComponent((0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.RectTransform));
    this.centerToUI(this.guiLayer);
    this.tipLayer = new csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.GameObject();
    this.tipLayer.name = "TipLayer";
    this.tipLayer.transform.parent = this.canvas.transform;
    this.tipLayer.AddComponent((0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.RectTransform));
    this.centerToUI(this.tipLayer);
    this.topLayer = new csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.GameObject();
    this.topLayer.name = "TopLayer";
    this.topLayer.transform.parent = this.canvas.transform;
    this.topLayer.AddComponent((0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.RectTransform));
    this.centerToUI(this.topLayer);
    this.eventSystem = new csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.GameObject().AddComponent(
      (0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.EventSystems.EventSystem)
    );
    this.eventSystem.gameObject.AddComponent(
      (0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.EventSystems.StandaloneInputModule)
    );
    this.eventSystem.gameObject.name = "EventSystem";
    this._uiWaitNode = this.createFGUI(_define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType.UIWait, 9999).gameObject;
    this._uiWaitNode.transform.parent = this.canvas.transform;
    this._uiWaitNode.SetActive(false);
    let uiContentScaler = this.canvas.gameObject.AddComponent(
      (0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.FairyGUI.UIContentScaler)
    );
    uiContentScaler.scaleMode = csharp__WEBPACK_IMPORTED_MODULE_0__.FairyGUI.UIContentScaler.ScaleMode.ScaleWithScreenSize;
    uiContentScaler.designResolutionX = 750;
    uiContentScaler.designResolutionY = 1334;
    uiContentScaler.ApplyChange();
  }
  createBack(zOrder) {
    let back = this.createFGUI(_define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIType.UIBack, zOrder);
    back.transform.parent = this.guiLayer.transform;
    back.gameObject.SetActive(true);
    return back;
  }
  getLayer(nLayerType) {
    let layer = null;
    switch (nLayerType) {
      case _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.LayerType.GUI:
        layer = this.guiLayer;
        break;
      case _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.LayerType.Tip:
        layer = this.tipLayer;
        break;
      case _define_ui_define__WEBPACK_IMPORTED_MODULE_2__.LayerType.Top:
        layer = this.topLayer;
        break;
      default:
        console.error("Unkonw layer type!", "%s");
        break;
    }
    return layer;
  }
  add2Layer(node) {
    if (!node) {
      console.error("node is not valid!", "%s");
      return;
    }
    let layer = this.guiLayer;
    if (!layer) {
      console.error("add to layer is not found!", "%s");
      return;
    }
    node.transform.parent = layer.transform;
  }
  getOpenUICount() {
    return this.UIStack.length;
  }
  replace(uiType, uiArgs) {
    this.close(this.UIStack[this.UIStack.length - 1].uiType);
    this.open(uiType, uiArgs);
  }
  getUIIndex(uiType) {
    for (let index = 0; index < this.UIStack.length; index++) {
      const element = this.UIStack[index];
      if (uiType == element.uiType) {
        return index;
      }
    }
    return -1;
  }
  showUIWaitAnim(showMask = true, maxWaitTime = 15) {
    this._uiWaitNode && this._uiWaitNode.SetActive(true);
  }
  autoExecNextUI() {
    if (this.UIOpenQueue.length > 0) {
      let uiQueueInfo = this.UIOpenQueue[0];
      this.UIOpenQueue.splice(0, 1);
      this.open(uiQueueInfo.uiType, uiQueueInfo.uiArgs);
      return;
    }
    if (this.UICloseQueue.length > 0) {
      let uiQueueInfo = this.UICloseQueue[0];
      this.UICloseQueue.splice(0, 1);
      this.close(uiQueueInfo.uiType, uiQueueInfo.playAnim);
    }
  }
  updateUI() {
    let hideIndex = 0;
    let showIndex = this.UIStack.length - 1;
    for (; showIndex >= 0; --showIndex) {
      let mode = this.UIStack[showIndex].uiView.showType;
      this.UIStack[showIndex].uiView.gameObject.SetActive(true);
      if (_define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIShowTypes.UIFullScreen == mode) {
        break;
      } else if (_define_ui_define__WEBPACK_IMPORTED_MODULE_2__.UIShowTypes.UISingle == mode) {
        for (let i = 0; i < this.BackGroundUI; ++i) {
          if (this.UIStack[i]) {
            this.UIStack[i].uiView.gameObject.SetActive(true);
          }
        }
        hideIndex = this.BackGroundUI;
        break;
      }
    }
    for (let hide = hideIndex; hide < showIndex; ++hide) {
      this.UIStack[hide].uiView.gameObject.SetActive(false);
    }
  }
  hideUIWaitAnim() {
    this._uiWaitNode && this._uiWaitNode.SetActive(false);
  }
  getOpenQueueCount() {
    return this.UIOpenQueue.length;
  }
  update(dt) {
    for (let i = 0; i < this.UIStack.length; ++i) {
      this.UIStack[i].uiView.update(dt);
    }
  }
  lateUpdate(dt) {
    for (let i = 0; i < this.UIStack.length; ++i) {
      this.UIStack[i].uiView.lateUpdate(dt);
    }
  }
}


/***/ }),

/***/ "./src/common/utils/array.ts":
/*!***********************************!*\
  !*** ./src/common/utils/array.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "appendObjectsAt": () => (/* binding */ appendObjectsAt),
/* harmony export */   "contains": () => (/* binding */ contains),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "fastRemove": () => (/* binding */ fastRemove),
/* harmony export */   "fastRemoveAt": () => (/* binding */ fastRemoveAt),
/* harmony export */   "remove": () => (/* binding */ remove),
/* harmony export */   "removeArray": () => (/* binding */ removeArray),
/* harmony export */   "removeAt": () => (/* binding */ removeAt),
/* harmony export */   "removeIf": () => (/* binding */ removeIf),
/* harmony export */   "verifyType": () => (/* binding */ verifyType)
/* harmony export */ });
function removeAt(array, index) {
  array.splice(index, 1);
}
function fastRemoveAt(array, index) {
  const length = array.length;
  if (index < 0 || index >= length) {
    return;
  }
  array[index] = array[length - 1];
  array.length = length - 1;
}
function remove(array, value) {
  const index = array.indexOf(value);
  if (index >= 0) {
    removeAt(array, index);
    return true;
  } else {
    return false;
  }
}
function fastRemove(array, value) {
  const index = array.indexOf(value);
  if (index >= 0) {
    array[index] = array[array.length - 1];
    --array.length;
  }
}
function removeIf(array, predicate) {
  const index = array.findIndex(predicate);
  if (index >= 0) {
    const value = array[index];
    removeAt(array, index);
    return value;
  }
}
function verifyType(array, type) {
  if (array && array.length > 0) {
    for (const item of array) {
      if (!(item instanceof type)) {
        return false;
      }
    }
  }
  return true;
}
function removeArray(array, removals) {
  for (let i = 0, l = removals.length; i < l; i++) {
    remove(array, removals[i]);
  }
}
function appendObjectsAt(array, objects, index) {
  array.splice.apply(array, [index, 0, ...objects]);
  return array;
}
function contains(array, value) {
  return array.indexOf(value) >= 0;
}
function copy(array) {
  const len = array.length;
  const cloned = new Array(len);
  for (let i = 0; i < len; i += 1) {
    cloned[i] = array[i];
  }
  return cloned;
}


/***/ }),

/***/ "./src/common/utils/id-generator.ts":
/*!******************************************!*\
  !*** ./src/common/utils/id-generator.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IDGenerator)
/* harmony export */ });
const NonUuidMark = ".";
const _IDGenerator = class {
  constructor(category) {
    this.id = 0 | Math.random() * 998;
    this.prefix = category ? category + NonUuidMark : "";
  }
  getNewId() {
    return this.prefix + ++this.id;
  }
};
let IDGenerator = _IDGenerator;
IDGenerator.global = new _IDGenerator("global");



/***/ }),

/***/ "./src/common/utils/index.ts":
/*!***********************************!*\
  !*** ./src/common/utils/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NumToChinaBigNum": () => (/* reexport safe */ _word__WEBPACK_IMPORTED_MODULE_6__.NumToChinaBigNum),
/* harmony export */   "_getClassById": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__._getClassById),
/* harmony export */   "_getClassId": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__._getClassId),
/* harmony export */   "_idToClass": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__._idToClass),
/* harmony export */   "_nameToClass": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__._nameToClass),
/* harmony export */   "_setClassId": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__._setClassId),
/* harmony export */   "addon": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.addon),
/* harmony export */   "appendObjectsAt": () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_0__.appendObjectsAt),
/* harmony export */   "arab2char": () => (/* reexport safe */ _word__WEBPACK_IMPORTED_MODULE_6__.arab2char),
/* harmony export */   "clear": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.clear),
/* harmony export */   "contains": () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_0__.contains),
/* harmony export */   "copy": () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_0__.copy),
/* harmony export */   "createMap": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.createMap),
/* harmony export */   "extend": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.extend),
/* harmony export */   "fastRemove": () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_0__.fastRemove),
/* harmony export */   "fastRemoveAt": () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_0__.fastRemoveAt),
/* harmony export */   "fisherYatesShuffle": () => (/* reexport safe */ _random__WEBPACK_IMPORTED_MODULE_4__.fisherYatesShuffle),
/* harmony export */   "formatCNY": () => (/* reexport safe */ _word__WEBPACK_IMPORTED_MODULE_6__.formatCNY),
/* harmony export */   "formatDate": () => (/* reexport safe */ _time__WEBPACK_IMPORTED_MODULE_5__.formatDate),
/* harmony export */   "formatHour": () => (/* reexport safe */ _time__WEBPACK_IMPORTED_MODULE_5__.formatHour),
/* harmony export */   "formatMinute": () => (/* reexport safe */ _time__WEBPACK_IMPORTED_MODULE_5__.formatMinute),
/* harmony export */   "formatSecond": () => (/* reexport safe */ _time__WEBPACK_IMPORTED_MODULE_5__.formatSecond),
/* harmony export */   "formatStr": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.formatStr),
/* harmony export */   "get": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.get),
/* harmony export */   "getClassByName": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.getClassByName),
/* harmony export */   "getClassName": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.getClassName),
/* harmony export */   "getPropertyDescriptor": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.getPropertyDescriptor),
/* harmony export */   "getSuper": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.getSuper),
/* harmony export */   "getUrlParams": () => (/* binding */ getUrlParams),
/* harmony export */   "getset": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.getset),
/* harmony export */   "isChildClassOf": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.isChildClassOf),
/* harmony export */   "isEmptyObject": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.isEmptyObject),
/* harmony export */   "isNumber": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.isNumber),
/* harmony export */   "isString": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.isString),
/* harmony export */   "limitWorldNum": () => (/* reexport safe */ _word__WEBPACK_IMPORTED_MODULE_6__.limitWorldNum),
/* harmony export */   "macro": () => (/* reexport safe */ _macro__WEBPACK_IMPORTED_MODULE_2__.macro),
/* harmony export */   "mixin": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.mixin),
/* harmony export */   "obsolete": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.obsolete),
/* harmony export */   "obsoletes": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.obsoletes),
/* harmony export */   "randToArray": () => (/* reexport safe */ _random__WEBPACK_IMPORTED_MODULE_4__.randToArray),
/* harmony export */   "randWeightIndex": () => (/* reexport safe */ _random__WEBPACK_IMPORTED_MODULE_4__.randWeightIndex),
/* harmony export */   "randomSome": () => (/* reexport safe */ _random__WEBPACK_IMPORTED_MODULE_4__.randomSome),
/* harmony export */   "remove": () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_0__.remove),
/* harmony export */   "removeArray": () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_0__.removeArray),
/* harmony export */   "removeAt": () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_0__.removeAt),
/* harmony export */   "removeIf": () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_0__.removeIf),
/* harmony export */   "set": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.set),
/* harmony export */   "setClassAlias": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.setClassAlias),
/* harmony export */   "setClassName": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.setClassName),
/* harmony export */   "shiftArguments": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.shiftArguments),
/* harmony export */   "unregisterClass": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.unregisterClass),
/* harmony export */   "value": () => (/* reexport safe */ _js__WEBPACK_IMPORTED_MODULE_1__.value),
/* harmony export */   "verifyType": () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_0__.verifyType)
/* harmony export */ });
/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./array */ "./src/common/utils/array.ts");
/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js */ "./src/common/utils/js.ts");
/* harmony import */ var _macro__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./macro */ "./src/common/utils/macro.ts");
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../math */ "./src/common/math/index.ts");
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _math__WEBPACK_IMPORTED_MODULE_3__) if(["default","getUrlParams","appendObjectsAt","contains","copy","fastRemove","fastRemoveAt","remove","removeArray","removeAt","removeIf","verifyType","_getClassById","_getClassId","_idToClass","_nameToClass","_setClassId","addon","clear","createMap","extend","formatStr","get","getClassByName","getClassName","getPropertyDescriptor","getSuper","getset","isChildClassOf","isEmptyObject","isNumber","isString","mixin","obsolete","obsoletes","set","setClassAlias","setClassName","shiftArguments","unregisterClass","value","macro"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _math__WEBPACK_IMPORTED_MODULE_3__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _random__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./random */ "./src/common/utils/random.ts");
/* harmony import */ var _time__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./time */ "./src/common/utils/time.ts");
/* harmony import */ var _word__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./word */ "./src/common/utils/word.ts");







function getUrlParams(url, name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"), r = url.match(reg);
  if (r != null)
    return decodeURIComponent(r[2]);
  return null;
}


/***/ }),

/***/ "./src/common/utils/js.ts":
/*!********************************!*\
  !*** ./src/common/utils/js.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_getClassById": () => (/* binding */ _getClassById),
/* harmony export */   "_getClassId": () => (/* binding */ _getClassId),
/* harmony export */   "_idToClass": () => (/* binding */ _idToClass),
/* harmony export */   "_nameToClass": () => (/* binding */ _nameToClass),
/* harmony export */   "_setClassId": () => (/* binding */ _setClassId),
/* harmony export */   "addon": () => (/* binding */ addon),
/* harmony export */   "clear": () => (/* binding */ clear),
/* harmony export */   "createMap": () => (/* binding */ createMap),
/* harmony export */   "extend": () => (/* binding */ extend),
/* harmony export */   "formatStr": () => (/* binding */ formatStr),
/* harmony export */   "get": () => (/* binding */ get),
/* harmony export */   "getClassByName": () => (/* binding */ getClassByName),
/* harmony export */   "getClassName": () => (/* binding */ getClassName),
/* harmony export */   "getPropertyDescriptor": () => (/* binding */ getPropertyDescriptor),
/* harmony export */   "getSuper": () => (/* binding */ getSuper),
/* harmony export */   "getset": () => (/* binding */ getset),
/* harmony export */   "isChildClassOf": () => (/* binding */ isChildClassOf),
/* harmony export */   "isEmptyObject": () => (/* binding */ isEmptyObject),
/* harmony export */   "isNumber": () => (/* binding */ isNumber),
/* harmony export */   "isString": () => (/* binding */ isString),
/* harmony export */   "mixin": () => (/* binding */ mixin),
/* harmony export */   "obsolete": () => (/* binding */ obsolete),
/* harmony export */   "obsoletes": () => (/* binding */ obsoletes),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "setClassAlias": () => (/* binding */ setClassAlias),
/* harmony export */   "setClassName": () => (/* binding */ setClassName),
/* harmony export */   "shiftArguments": () => (/* binding */ shiftArguments),
/* harmony export */   "unregisterClass": () => (/* binding */ unregisterClass),
/* harmony export */   "value": () => (/* binding */ value)
/* harmony export */ });
/* harmony import */ var _id_generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./id-generator */ "./src/common/utils/id-generator.ts");

const tempCIDGenerator = new _id_generator__WEBPACK_IMPORTED_MODULE_0__["default"]("TmpCId.");
const aliasesTag = typeof Symbol === "undefined" ? "__aliases__" : Symbol("[[Aliases]]");
const classNameTag = "__classname__";
const classIdTag = "__cid__";
function isNumber(object) {
  return typeof object === "number" || object instanceof Number;
}
function isString(object) {
  return typeof object === "string" || object instanceof String;
}
function isEmptyObject(obj) {
  for (const key in obj) {
    return false;
  }
  return true;
}
const value = (() => {
  const descriptor = {
    value: void 0,
    enumerable: false,
    writable: false,
    configurable: true
  };
  return (object, propertyName, value_, writable, enumerable) => {
    descriptor.value = value_;
    descriptor.writable = writable;
    descriptor.enumerable = enumerable;
    Object.defineProperty(object, propertyName, descriptor);
    descriptor.value = void 0;
  };
})();
const getset = (() => {
  const descriptor = {
    get: void 0,
    set: void 0,
    enumerable: false
  };
  return (object, propertyName, getter, setter, enumerable = false, configurable = false) => {
    if (typeof setter === "boolean") {
      enumerable = setter;
      setter = void 0;
    }
    descriptor.get = getter;
    descriptor.set = setter;
    descriptor.enumerable = enumerable;
    descriptor.configurable = configurable;
    Object.defineProperty(object, propertyName, descriptor);
    descriptor.get = void 0;
    descriptor.set = void 0;
  };
})();
const get = (() => {
  const descriptor = {
    get: void 0,
    enumerable: false,
    configurable: false
  };
  return (object, propertyName, getter, enumerable, configurable) => {
    descriptor.get = getter;
    descriptor.enumerable = enumerable;
    descriptor.configurable = configurable;
    Object.defineProperty(object, propertyName, descriptor);
    descriptor.get = void 0;
  };
})();
const set = (() => {
  const descriptor = {
    set: void 0,
    enumerable: false,
    configurable: false
  };
  return (object, propertyName, setter, enumerable, configurable) => {
    descriptor.set = setter;
    descriptor.enumerable = enumerable;
    descriptor.configurable = configurable;
    Object.defineProperty(object, propertyName, descriptor);
    descriptor.set = void 0;
  };
})();
function createMap(forceDictMode) {
  const map = /* @__PURE__ */ Object.create(null);
  if (forceDictMode) {
    const INVALID_IDENTIFIER_1 = ".";
    const INVALID_IDENTIFIER_2 = "/";
    map[INVALID_IDENTIFIER_1] = 1;
    map[INVALID_IDENTIFIER_2] = 1;
    delete map[INVALID_IDENTIFIER_1];
    delete map[INVALID_IDENTIFIER_2];
  }
  return map;
}
function getClassName(objOrCtor) {
  if (typeof objOrCtor === "function") {
    const prototype = objOrCtor.prototype;
    if (prototype && prototype.hasOwnProperty(classNameTag) && prototype[classNameTag]) {
      return prototype[classNameTag];
    }
    let retval = "";
    if (objOrCtor.name) {
      retval = objOrCtor.name;
    }
    if (objOrCtor.toString) {
      let arr;
      const str = objOrCtor.toString();
      if (str.charAt(0) === "[") {
        arr = /\[\w+\s*(\w+)\]/.exec(str);
      } else {
        arr = /function\s*(\w+)/.exec(str);
      }
      if (arr && arr.length === 2) {
        retval = arr[1];
      }
    }
    return retval !== "Object" ? retval : "";
  } else if (objOrCtor && objOrCtor.constructor) {
    return getClassName(objOrCtor.constructor);
  }
  return "";
}
function obsolete(object, obsoleted, newExpr, writable) {
  const extractPropName = /([^.]+)$/;
  const oldProp = extractPropName.exec(obsoleted)[0];
  const newProp = extractPropName.exec(newExpr)[0];
  function getter() {
    return this[newProp];
  }
  function setter(value_) {
    this[newProp] = value_;
  }
  if (writable) {
    getset(object, oldProp, getter, setter);
  } else {
    get(object, oldProp, getter);
  }
}
function obsoletes(obj, objName, props, writable) {
  for (const obsoleted in props) {
    const newName = props[obsoleted];
    obsolete(obj, `${objName}.${obsoleted}`, newName, writable);
  }
}
const REGEXP_NUM_OR_STR = /(%d)|(%s)/;
const REGEXP_STR = /%s/;
function formatStr(msg, ...subst) {
  if (arguments.length === 0) {
    return "";
  }
  if (subst.length === 0) {
    return `${msg}`;
  }
  const hasSubstitution = typeof msg === "string" && REGEXP_NUM_OR_STR.test(msg);
  if (hasSubstitution) {
    for (const arg of subst) {
      const regExpToTest = typeof arg === "number" ? REGEXP_NUM_OR_STR : REGEXP_STR;
      if (regExpToTest.test(msg)) {
        const notReplaceFunction = `${arg}`;
        msg = msg.replace(regExpToTest, notReplaceFunction);
      } else {
        msg += ` ${arg}`;
      }
    }
  } else {
    for (const arg of subst) {
      msg += ` ${arg}`;
    }
  }
  return msg;
}
function shiftArguments() {
  const len = arguments.length - 1;
  const args = new Array(len);
  for (let i = 0; i < len; ++i) {
    args[i] = arguments[i + 1];
  }
  return args;
}
function getPropertyDescriptor(object, propertyName) {
  while (object) {
    const pd = Object.getOwnPropertyDescriptor(object, propertyName);
    if (pd) {
      return pd;
    }
    object = Object.getPrototypeOf(object);
  }
  return null;
}
function _copyprop(name, source, target) {
  const pd = getPropertyDescriptor(source, name);
  if (pd) {
    Object.defineProperty(target, name, pd);
  }
}
function addon(object, ...sources) {
  object = object || {};
  for (const source of sources) {
    if (source) {
      if (typeof source !== "object") {
        continue;
      }
      for (const name in source) {
        if (!(name in object)) {
          _copyprop(name, source, object);
        }
      }
    }
  }
  return object;
}
function mixin(object, ...sources) {
  object = object || {};
  for (const source of sources) {
    if (source) {
      if (typeof source !== "object") {
        continue;
      }
      for (const name in source) {
        _copyprop(name, source, object);
      }
    }
  }
  return object;
}
function extend(cls, base) {
  for (const p in base) {
    if (base.hasOwnProperty(p)) {
      cls[p] = base[p];
    }
  }
  cls.prototype = Object.create(base.prototype, {
    constructor: {
      value: cls,
      writable: true,
      configurable: true
    }
  });
  return cls;
}
function getSuper(constructor) {
  const proto = constructor.prototype;
  const dunderProto = proto && Object.getPrototypeOf(proto);
  return dunderProto && dunderProto.constructor;
}
function isChildClassOf(subclass, superclass) {
  if (subclass && superclass) {
    if (typeof subclass !== "function") {
      return false;
    }
    if (typeof superclass !== "function") {
      return false;
    }
    if (subclass === superclass) {
      return true;
    }
    for (; ; ) {
      subclass = getSuper(subclass);
      if (!subclass) {
        return false;
      }
      if (subclass === superclass) {
        return true;
      }
    }
  }
  return false;
}
function clear(object) {
  for (const key of Object.keys(object)) {
    delete object[key];
  }
}
function isTempClassId(id) {
  return typeof id !== "string" || id.startsWith(tempCIDGenerator.prefix);
}
const _idToClass = createMap(true);
const _nameToClass = createMap(true);
function setup(tag, table) {
  return function(id, constructor) {
    if (constructor.prototype.hasOwnProperty(tag)) {
      delete table[constructor.prototype[tag]];
    }
    value(constructor.prototype, tag, id);
    if (id) {
      const registered = table[id];
      if (registered && registered !== constructor) {
      } else {
        table[id] = constructor;
      }
    }
  };
}
const _setClassId = setup("__cid__", _idToClass);
const doSetClassName = setup("__classname__", _nameToClass);
function setClassName(className, constructor) {
  doSetClassName(className, constructor);
  if (!constructor.prototype.hasOwnProperty(classIdTag)) {
    const id = className || tempCIDGenerator.getNewId();
    if (id) {
      _setClassId(id, constructor);
    }
  }
}
function setClassAlias(target, alias) {
  const nameRegistry = _nameToClass[alias];
  const idRegistry = _idToClass[alias];
  let ok = true;
  if (nameRegistry && nameRegistry !== target) {
    ok = false;
  }
  if (idRegistry && idRegistry !== target) {
    ok = false;
  }
  if (ok) {
    let classAliases = target[aliasesTag];
    if (!classAliases) {
      classAliases = [];
      target[aliasesTag] = classAliases;
    }
    classAliases.push(alias);
    _nameToClass[alias] = target;
    _idToClass[alias] = target;
  }
}
function unregisterClass(...constructors) {
  for (const constructor of constructors) {
    const p = constructor.prototype;
    const classId = p[classIdTag];
    if (classId) {
      delete _idToClass[classId];
    }
    const classname = p[classNameTag];
    if (classname) {
      delete _nameToClass[classname];
    }
    const aliases = p[aliasesTag];
    if (aliases) {
      for (let iAlias = 0; iAlias < aliases.length; ++iAlias) {
        const alias = aliases[iAlias];
        delete _nameToClass[alias];
        delete _idToClass[alias];
      }
    }
  }
}
function _getClassById(classId) {
  return _idToClass[classId];
}
function getClassByName(classname) {
  return _nameToClass[classname];
}
function _getClassId(obj, allowTempId) {
  allowTempId = typeof allowTempId !== "undefined" ? allowTempId : true;
  let res;
  if (typeof obj === "function" && obj.prototype.hasOwnProperty(classIdTag)) {
    res = obj.prototype[classIdTag];
    if (!allowTempId && isTempClassId(res)) {
      return "";
    }
    return res;
  }
  if (obj && obj.constructor) {
    const prototype = obj.constructor.prototype;
    if (prototype && prototype.hasOwnProperty(classIdTag)) {
      res = obj[classIdTag];
      if (!allowTempId && isTempClassId(res)) {
        return "";
      }
      return res;
    }
  }
  return "";
}


/***/ }),

/***/ "./src/common/utils/macro.ts":
/*!***********************************!*\
  !*** ./src/common/utils/macro.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "macro": () => (/* binding */ macro)
/* harmony export */ });
const SUPPORT_TEXTURE_FORMATS = [".astc", ".pkm", ".pvr", ".webp", ".jpg", ".jpeg", ".bmp", ".png"];
const KEY = {
  none: 0,
  back: 6,
  menu: 18,
  backspace: 8,
  tab: 9,
  enter: 13,
  shift: 16,
  ctrl: 17,
  alt: 18,
  pause: 19,
  capslock: 20,
  escape: 27,
  space: 32,
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  select: 41,
  insert: 45,
  Delete: 46,
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,
  num0: 96,
  num1: 97,
  num2: 98,
  num3: 99,
  num4: 100,
  num5: 101,
  num6: 102,
  num7: 103,
  num8: 104,
  num9: 105,
  "*": 106,
  "+": 107,
  "-": 109,
  numdel: 110,
  "/": 111,
  f1: 112,
  f2: 113,
  f3: 114,
  f4: 115,
  f5: 116,
  f6: 117,
  f7: 118,
  f8: 119,
  f9: 120,
  f10: 121,
  f11: 122,
  f12: 123,
  numlock: 144,
  scrolllock: 145,
  ";": 186,
  semicolon: 186,
  equal: 187,
  "=": 187,
  ",": 188,
  comma: 188,
  dash: 189,
  ".": 190,
  period: 190,
  forwardslash: 191,
  grave: 192,
  "[": 219,
  openbracket: 219,
  backslash: 220,
  "]": 221,
  closebracket: 221,
  quote: 222,
  dpadLeft: 1e3,
  dpadRight: 1001,
  dpadUp: 1003,
  dpadDown: 1004,
  dpadCenter: 1005
};
const macro = {
  SUPPORT_TEXTURE_FORMATS,
  KEY,
  RAD: Math.PI / 180,
  DEG: 180 / Math.PI,
  REPEAT_FOREVER: Number.MAX_VALUE - 1,
  FLT_EPSILON: 1192092896e-16,
  ORIENTATION_PORTRAIT: 1,
  ORIENTATION_LANDSCAPE: 2,
  ORIENTATION_AUTO: 3,
  ENABLE_TILEDMAP_CULLING: true,
  TOUCH_TIMEOUT: 5e3,
  ENABLE_TRANSPARENT_CANVAS: false,
  ENABLE_WEBGL_ANTIALIAS: true,
  ENABLE_ANTIALIAS_FXAA: false,
  ENABLE_BLOOM: false,
  CLEANUP_IMAGE_CACHE: false,
  ENABLE_MULTI_TOUCH: true,
  MAX_LABEL_CANVAS_POOL_SIZE: 20,
  ENABLE_WEBGL_HIGHP_STRUCT_VALUES: false,
  BATCHER2D_MEM_INCREMENT: 144
};



/***/ }),

/***/ "./src/common/utils/random.ts":
/*!************************************!*\
  !*** ./src/common/utils/random.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fisherYatesShuffle": () => (/* binding */ fisherYatesShuffle),
/* harmony export */   "randToArray": () => (/* binding */ randToArray),
/* harmony export */   "randWeightIndex": () => (/* binding */ randWeightIndex),
/* harmony export */   "randomSome": () => (/* binding */ randomSome)
/* harmony export */ });
function fisherYatesShuffle(array) {
  let count = array.length;
  while (count) {
    let index = Math.floor(Math.random() * count--);
    let temp = array[count];
    array[count] = array[index];
    array[index] = temp;
  }
  return array;
}
function randToArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function randomSome(array, count) {
  let shuffled = array.slice(0), i = array.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
function randWeightIndex(weightArr) {
  weightArr = this.overAddArr(weightArr);
  let totalWeight = weightArr[weightArr.length - 1];
  let random = Math.random() * totalWeight;
  let arrIndex = this.getRandomIndex(random, weightArr);
  return arrIndex;
}


/***/ }),

/***/ "./src/common/utils/time.ts":
/*!**********************************!*\
  !*** ./src/common/utils/time.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "formatDate": () => (/* binding */ formatDate),
/* harmony export */   "formatHour": () => (/* binding */ formatHour),
/* harmony export */   "formatMinute": () => (/* binding */ formatMinute),
/* harmony export */   "formatSecond": () => (/* binding */ formatSecond)
/* harmony export */ });
function formatDate(time, fmt) {
  const date = new Date(time);
  const opt = {
    "y+": date.getFullYear().toString(),
    "M+": (date.getMonth() + 1).toString(),
    "d+": date.getDate().toString(),
    "h+": date.getHours().toString(),
    "m+": date.getMinutes().toString(),
    "s+": date.getSeconds().toString(),
    "S+": date.getMilliseconds().toString()
  };
  for (const k in opt) {
    const ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      if (/(y+)/.test(k)) {
        fmt = fmt.replace(ret[1], opt[k].substring(4 - ret[1].length));
      } else {
        fmt = fmt.replace(
          ret[1],
          ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
        );
      }
    }
  }
  return fmt;
}
function prefixInteger(num, length) {
  return (Array(length).join("0") + num).slice(-length);
}
function formatHour(time) {
  if (time <= 0) {
    return "00:00";
  } else {
    let hour = Math.floor(time / (60 * 60));
    let minute = Math.floor(time / 60) % 60;
    let minutestr = prefixInteger(minute, 2);
    return `${hour}:${minutestr}`;
  }
}
function formatMinute(time) {
  if (time <= 0) {
    return "00:00";
  } else {
    let minute = Math.floor(time / 60) % 60;
    let second = time % 60;
    let secondstr = prefixInteger(second, 2);
    return `${minute}:${secondstr}`;
  }
}
function formatSecond(time) {
  if (time <= 0) {
    return "00";
  } else {
    let second = time % 60;
    return `${second}`;
  }
}


/***/ }),

/***/ "./src/common/utils/word.ts":
/*!**********************************!*\
  !*** ./src/common/utils/word.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NumToChinaBigNum": () => (/* binding */ NumToChinaBigNum),
/* harmony export */   "arab2char": () => (/* binding */ arab2char),
/* harmony export */   "formatCNY": () => (/* binding */ formatCNY),
/* harmony export */   "limitWorldNum": () => (/* binding */ limitWorldNum)
/* harmony export */ });
function formatCNY(num, digits) {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  let numStr = "";
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  if (num >= 1e9) {
    numStr = "999.9M";
  } else {
    numStr = (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
  }
  if (numStr.length > 5) {
    numStr = numStr.slice(0, 5) + si[i].symbol;
  }
  return numStr;
}
function arab2char(num) {
  let changeNum = [
    "\u96F6",
    "\u4E00",
    "\u4E8C",
    "\u4E09",
    "\u56DB",
    "\u4E94",
    "\u516D",
    "\u4E03",
    "\u516B",
    "\u4E5D"
  ];
  let unit = ["", "\u5341", "\u767E", "\u5343", "\u4E07"];
  let getWan = (temp) => {
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
      let a = Number(strArr[i]);
      let b = Number(strArr[i - 1]);
      newNum = (i == 0 && a == 0 ? "" : i > 0 && a == 0 && b == 0 ? "" : changeNum[strArr[i]] + (a == 0 ? unit[0] : unit[i])) + newNum;
    }
    return newNum;
  };
  let overWan = Math.floor(num / 1e4);
  let noWan = num % 1e4;
  let noWanStr = "";
  if (noWan.toString().length < 4) {
    noWanStr = "0" + noWan;
  }
  return overWan ? getWan(overWan) + "\u4E07" + getWan(noWanStr) : getWan(num);
}
function NumToChinaBigNum(num) {
  let bigNum = [
    "\u96F6",
    "\u4E00",
    "\u4E8C",
    "\u4E09",
    "\u56DB",
    "\u4E94",
    "\u516D",
    "\u4E03",
    "\u516B",
    "\u4E5D",
    "\u5341"
  ];
  if (num < 0 || num > 10) {
    return "";
  }
  return bigNum[num];
}
function limitWorldNum(world, len = 6) {
  if (world.length > len) {
    world = world.slice(0, len);
    world += "...";
  }
  return world;
}


/***/ }),

/***/ "./src/define/ui-define.ts":
/*!*********************************!*\
  !*** ./src/define/ui-define.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LayerType": () => (/* binding */ LayerType),
/* harmony export */   "UIDataInfo": () => (/* binding */ UIDataInfo),
/* harmony export */   "UIShowTypes": () => (/* binding */ UIShowTypes),
/* harmony export */   "UIType": () => (/* binding */ UIType)
/* harmony export */ });
/* harmony import */ var common_ui_ui_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! common/ui/ui-base */ "./src/common/ui/ui-base.ts");
/* harmony import */ var _UI_Loading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../UI/Loading */ "./src/UI/Loading.ts");


var LayerType = /* @__PURE__ */ ((LayerType2) => {
  LayerType2[LayerType2["GUI"] = 0] = "GUI";
  LayerType2[LayerType2["Tip"] = 1] = "Tip";
  LayerType2[LayerType2["Top"] = 2] = "Top";
  return LayerType2;
})(LayerType || {});
var UIShowTypes = /* @__PURE__ */ ((UIShowTypes2) => {
  UIShowTypes2[UIShowTypes2["UIFullScreen"] = 0] = "UIFullScreen";
  UIShowTypes2[UIShowTypes2["UIAddition"] = 1] = "UIAddition";
  UIShowTypes2[UIShowTypes2["UISingle"] = 2] = "UISingle";
  return UIShowTypes2;
})(UIShowTypes || {});
var UIType = /* @__PURE__ */ ((UIType2) => {
  UIType2[UIType2["$Start"] = 0] = "$Start";
  UIType2[UIType2["UIBack"] = 1] = "UIBack";
  UIType2[UIType2["UIWait"] = 2] = "UIWait";
  UIType2[UIType2["Logo"] = 3] = "Logo";
  UIType2[UIType2["Loading"] = 4] = "Loading";
  UIType2[UIType2["MainUI"] = 5] = "MainUI";
  UIType2[UIType2["Confirm"] = 6] = "Confirm";
  UIType2[UIType2["Test"] = 7] = "Test";
  UIType2[UIType2["TestAccountLogin"] = 8] = "TestAccountLogin";
  UIType2[UIType2["GameStart"] = 9] = "GameStart";
  UIType2[UIType2["GameReady"] = 10] = "GameReady";
  UIType2[UIType2["GameOver"] = 11] = "GameOver";
  UIType2[UIType2["$End"] = 12] = "$End";
  return UIType2;
})(UIType || {});
const _UIDataInfo = class {
  constructor(uiType, uiPath, uiBase = common_ui_ui_base__WEBPACK_IMPORTED_MODULE_0__.UIBase, preventTouch = true, cache = false) {
    this.preventTouch = true;
    this.cache = false;
    this.uiType = uiType;
    this.uiPath = uiPath.split("/");
    this.uiBase = uiBase;
    this.preventTouch = preventTouch;
    this.cache = cache;
  }
  get packagePath() {
    let len = this.uiPath.length;
    let packagePath = "";
    for (let i = 0; i < len - 2; i++) {
      packagePath += this.uiPath[i] + "/";
    }
    return packagePath + this.packageName;
  }
  get packageName() {
    let len = this.uiPath.length;
    return this.uiPath[len - 2];
  }
  get componentName() {
    let len = this.uiPath.length;
    return this.uiPath[len - 1];
  }
  static getUIData(uiType) {
    for (let i = 0; i < this._uiDataList.length; ++i) {
      if (this._uiDataList[i].uiType == uiType) {
        return this._uiDataList[i];
      }
    }
    return null;
  }
};
let UIDataInfo = _UIDataInfo;
UIDataInfo._uiDataList = [
  new _UIDataInfo(1 /* UIBack */, "UI/Common/UIBack"),
  new _UIDataInfo(2 /* UIWait */, "UI/Common/UIWait"),
  new _UIDataInfo(6 /* Confirm */, "UI/Bag/Main", _UI_Loading__WEBPACK_IMPORTED_MODULE_1__.Loading),
  new _UIDataInfo(4 /* Loading */, "UI/Bag/BagWin", _UI_Loading__WEBPACK_IMPORTED_MODULE_1__.Loading)
];


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/source-map-support/source-map-support.js":
/*!***************************************************************!*\
  !*** ./node_modules/source-map-support/source-map-support.js ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var SourceMapConsumer = (__webpack_require__(/*! source-map */ "./node_modules/source-map/source-map.js").SourceMapConsumer);
var path = __webpack_require__(/*! path */ "path");

var fs;
try {
  fs = __webpack_require__(/*! fs */ "fs");
  if (!fs.existsSync || !fs.readFileSync) {
    // fs doesn't have all methods we need
    fs = null;
  }
} catch (err) {
  /* nop */
}

var bufferFrom = __webpack_require__(/*! buffer-from */ "./node_modules/buffer-from/index.js");

/**
 * Requires a module which is protected against bundler minification.
 *
 * @param {NodeModule} mod
 * @param {string} request
 */
function dynamicRequire(mod, request) {
  return mod.require(request);
}

// Only install once if called multiple times
var errorFormatterInstalled = false;
var uncaughtShimInstalled = false;

// If true, the caches are reset before a stack trace formatting operation
var emptyCacheBetweenOperations = false;

// Supports {browser, node, auto}
var environment = "auto";

// Maps a file path to a string containing the file contents
var fileContentsCache = {};

// Maps a file path to a source map for that file
var sourceMapCache = {};

// Regex for detecting source maps
var reSourceMap = /^data:application\/json[^,]+base64,/;

// Priority list of retrieve handlers
var retrieveFileHandlers = [];
var retrieveMapHandlers = [];

function isInBrowser() {
  if (environment === "browser")
    return true;
  if (environment === "node")
    return false;
  return ((typeof window !== 'undefined') && (typeof XMLHttpRequest === 'function') && !(window.require && window.module && window.process && window.process.type === "renderer"));
}

function hasGlobalProcessEventEmitter() {
  return ((typeof process === 'object') && (process !== null) && (typeof process.on === 'function'));
}

function globalProcessVersion() {
  if ((typeof process === 'object') && (process !== null)) {
    return process.version;
  } else {
    return '';
  }
}

function globalProcessStderr() {
  if ((typeof process === 'object') && (process !== null)) {
    return process.stderr;
  }
}

function globalProcessExit(code) {
  if ((typeof process === 'object') && (process !== null) && (typeof process.exit === 'function')) {
    return process.exit(code);
  }
}

function handlerExec(list) {
  return function(arg) {
    for (var i = 0; i < list.length; i++) {
      var ret = list[i](arg);
      if (ret) {
        return ret;
      }
    }
    return null;
  };
}

var retrieveFile = handlerExec(retrieveFileHandlers);

retrieveFileHandlers.push(function(path) {
  // Trim the path to make sure there is no extra whitespace.
  path = path.trim();
  if (/^file:/.test(path)) {
    // existsSync/readFileSync can't handle file protocol, but once stripped, it works
    path = path.replace(/file:\/\/\/(\w:)?/, function(protocol, drive) {
      return drive ?
        '' : // file:///C:/dir/file -> C:/dir/file
        '/'; // file:///root-dir/file -> /root-dir/file
    });
  }
  if (path in fileContentsCache) {
    return fileContentsCache[path];
  }

  var contents = '';
  try {
    if (!fs) {
      // Use SJAX if we are in the browser
      var xhr = new XMLHttpRequest();
      xhr.open('GET', path, /** async */ false);
      xhr.send(null);
      if (xhr.readyState === 4 && xhr.status === 200) {
        contents = xhr.responseText;
      }
    } else if (fs.existsSync(path)) {
      // Otherwise, use the filesystem
      contents = fs.readFileSync(path, 'utf8');
    }
  } catch (er) {
    /* ignore any errors */
  }

  return fileContentsCache[path] = contents;
});

// Support URLs relative to a directory, but be careful about a protocol prefix
// in case we are in the browser (i.e. directories may start with "http://" or "file:///")
function supportRelativeURL(file, url) {
  if (!file) return url;
  var dir = path.dirname(file);
  var match = /^\w+:\/\/[^\/]*/.exec(dir);
  var protocol = match ? match[0] : '';
  var startPath = dir.slice(protocol.length);
  if (protocol && /^\/\w\:/.test(startPath)) {
    // handle file:///C:/ paths
    protocol += '/';
    return protocol + path.resolve(dir.slice(protocol.length), url).replace(/\\/g, '/');
  }
  return protocol + path.resolve(dir.slice(protocol.length), url);
}

function retrieveSourceMapURL(source) {
  var fileData;

  if (isInBrowser()) {
     try {
       var xhr = new XMLHttpRequest();
       xhr.open('GET', source, false);
       xhr.send(null);
       fileData = xhr.readyState === 4 ? xhr.responseText : null;

       // Support providing a sourceMappingURL via the SourceMap header
       var sourceMapHeader = xhr.getResponseHeader("SourceMap") ||
                             xhr.getResponseHeader("X-SourceMap");
       if (sourceMapHeader) {
         return sourceMapHeader;
       }
     } catch (e) {
     }
  }

  // Get the URL of the source map
  fileData = retrieveFile(source);
  var re = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/mg;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  var lastMatch, match;
  while (match = re.exec(fileData)) lastMatch = match;
  if (!lastMatch) return null;
  return lastMatch[1];
};

// Can be overridden by the retrieveSourceMap option to install. Takes a
// generated source filename; returns a {map, optional url} object, or null if
// there is no source map.  The map field may be either a string or the parsed
// JSON object (ie, it must be a valid argument to the SourceMapConsumer
// constructor).
var retrieveSourceMap = handlerExec(retrieveMapHandlers);
retrieveMapHandlers.push(function(source) {
  var sourceMappingURL = retrieveSourceMapURL(source);
  if (!sourceMappingURL) return null;

  // Read the contents of the source map
  var sourceMapData;
  if (reSourceMap.test(sourceMappingURL)) {
    // Support source map URL as a data url
    var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(',') + 1);
    sourceMapData = bufferFrom(rawData, "base64").toString();
    sourceMappingURL = source;
  } else {
    // Support source map URLs relative to the source URL
    sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
    sourceMapData = retrieveFile(sourceMappingURL);
  }

  if (!sourceMapData) {
    return null;
  }

  return {
    url: sourceMappingURL,
    map: sourceMapData
  };
});

function mapSourcePosition(position) {
  var sourceMap = sourceMapCache[position.source];
  if (!sourceMap) {
    // Call the (overrideable) retrieveSourceMap function to get the source map.
    var urlAndMap = retrieveSourceMap(position.source);
    if (urlAndMap) {
      sourceMap = sourceMapCache[position.source] = {
        url: urlAndMap.url,
        map: new SourceMapConsumer(urlAndMap.map)
      };

      // Load all sources stored inline with the source map into the file cache
      // to pretend like they are already loaded. They may not exist on disk.
      if (sourceMap.map.sourcesContent) {
        sourceMap.map.sources.forEach(function(source, i) {
          var contents = sourceMap.map.sourcesContent[i];
          if (contents) {
            var url = supportRelativeURL(sourceMap.url, source);
            fileContentsCache[url] = contents;
          }
        });
      }
    } else {
      sourceMap = sourceMapCache[position.source] = {
        url: null,
        map: null
      };
    }
  }

  // Resolve the source URL relative to the URL of the source map
  if (sourceMap && sourceMap.map && typeof sourceMap.map.originalPositionFor === 'function') {
    var originalPosition = sourceMap.map.originalPositionFor(position);

    // Only return the original position if a matching line was found. If no
    // matching line is found then we return position instead, which will cause
    // the stack trace to print the path and line for the compiled file. It is
    // better to give a precise location in the compiled file than a vague
    // location in the original file.
    if (originalPosition.source !== null) {
      originalPosition.source = supportRelativeURL(
        sourceMap.url, originalPosition.source);
      return originalPosition;
    }
  }

  return position;
}

// Parses code generated by FormatEvalOrigin(), a function inside V8:
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js
function mapEvalOrigin(origin) {
  // Most eval() calls are in this format
  var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
  if (match) {
    var position = mapSourcePosition({
      source: match[2],
      line: +match[3],
      column: match[4] - 1
    });
    return 'eval at ' + match[1] + ' (' + position.source + ':' +
      position.line + ':' + (position.column + 1) + ')';
  }

  // Parse nested eval() calls using recursion
  match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
  if (match) {
    return 'eval at ' + match[1] + ' (' + mapEvalOrigin(match[2]) + ')';
  }

  // Make sure we still return useful information if we didn't find anything
  return origin;
}

// This is copied almost verbatim from the V8 source code at
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js. The
// implementation of wrapCallSite() used to just forward to the actual source
// code of CallSite.prototype.toString but unfortunately a new release of V8
// did something to the prototype chain and broke the shim. The only fix I
// could find was copy/paste.
function CallSiteToString() {
  var fileName;
  var fileLocation = "";
  if (this.isNative()) {
    fileLocation = "native";
  } else {
    fileName = this.getScriptNameOrSourceURL();
    if (!fileName && this.isEval()) {
      fileLocation = this.getEvalOrigin();
      fileLocation += ", ";  // Expecting source position to follow.
    }

    if (fileName) {
      fileLocation += fileName;
    } else {
      // Source code does not originate from a file and is not native, but we
      // can still get the source position inside the source string, e.g. in
      // an eval string.
      fileLocation += "<anonymous>";
    }
    var lineNumber = this.getLineNumber();
    if (lineNumber != null) {
      fileLocation += ":" + lineNumber;
      var columnNumber = this.getColumnNumber();
      if (columnNumber) {
        fileLocation += ":" + columnNumber;
      }
    }
  }

  var line = "";
  var functionName = this.getFunctionName();
  var addSuffix = true;
  var isConstructor = this.isConstructor();
  var isMethodCall = !(this.isToplevel() || isConstructor);
  if (isMethodCall) {
    var typeName = this.getTypeName();
    // Fixes shim to be backward compatable with Node v0 to v4
    if (typeName === "[object Object]") {
      typeName = "null";
    }
    var methodName = this.getMethodName();
    if (functionName) {
      if (typeName && functionName.indexOf(typeName) != 0) {
        line += typeName + ".";
      }
      line += functionName;
      if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
        line += " [as " + methodName + "]";
      }
    } else {
      line += typeName + "." + (methodName || "<anonymous>");
    }
  } else if (isConstructor) {
    line += "new " + (functionName || "<anonymous>");
  } else if (functionName) {
    line += functionName;
  } else {
    line += fileLocation;
    addSuffix = false;
  }
  if (addSuffix) {
    line += " (" + fileLocation + ")";
  }
  return line;
}

function cloneCallSite(frame) {
  var object = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
    object[name] = /^(?:is|get)/.test(name) ? function() { return frame[name].call(frame); } : frame[name];
  });
  object.toString = CallSiteToString;
  return object;
}

function wrapCallSite(frame, state) {
  // provides interface backward compatibility
  if (state === undefined) {
    state = { nextPosition: null, curPosition: null }
  }
  if(frame.isNative()) {
    state.curPosition = null;
    return frame;
  }

  // Most call sites will return the source file from getFileName(), but code
  // passed to eval() ending in "//# sourceURL=..." will return the source file
  // from getScriptNameOrSourceURL() instead
  var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
  if (source) {
    var line = frame.getLineNumber();
    var column = frame.getColumnNumber() - 1;

    // Fix position in Node where some (internal) code is prepended.
    // See https://github.com/evanw/node-source-map-support/issues/36
    // Header removed in node at ^10.16 || >=11.11.0
    // v11 is not an LTS candidate, we can just test the one version with it.
    // Test node versions for: 10.16-19, 10.20+, 12-19, 20-99, 100+, or 11.11
    var noHeader = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/;
    var headerLength = noHeader.test(globalProcessVersion()) ? 0 : 62;
    if (line === 1 && column > headerLength && !isInBrowser() && !frame.isEval()) {
      column -= headerLength;
    }

    var position = mapSourcePosition({
      source: source,
      line: line,
      column: column
    });
    state.curPosition = position;
    frame = cloneCallSite(frame);
    var originalFunctionName = frame.getFunctionName;
    frame.getFunctionName = function() {
      if (state.nextPosition == null) {
        return originalFunctionName();
      }
      return state.nextPosition.name || originalFunctionName();
    };
    frame.getFileName = function() { return position.source; };
    frame.getLineNumber = function() { return position.line; };
    frame.getColumnNumber = function() { return position.column + 1; };
    frame.getScriptNameOrSourceURL = function() { return position.source; };
    return frame;
  }

  // Code called using eval() needs special handling
  var origin = frame.isEval() && frame.getEvalOrigin();
  if (origin) {
    origin = mapEvalOrigin(origin);
    frame = cloneCallSite(frame);
    frame.getEvalOrigin = function() { return origin; };
    return frame;
  }

  // If we get here then we were unable to change the source position
  return frame;
}

// This function is part of the V8 stack trace API, for more info see:
// https://v8.dev/docs/stack-trace-api
function prepareStackTrace(error, stack) {
  if (emptyCacheBetweenOperations) {
    fileContentsCache = {};
    sourceMapCache = {};
  }

  var name = error.name || 'Error';
  var message = error.message || '';
  var errorString = name + ": " + message;

  var state = { nextPosition: null, curPosition: null };
  var processedStack = [];
  for (var i = stack.length - 1; i >= 0; i--) {
    processedStack.push('\n    at ' + wrapCallSite(stack[i], state));
    state.nextPosition = state.curPosition;
  }
  state.curPosition = state.nextPosition = null;
  return errorString + processedStack.reverse().join('');
}

// Generate position and snippet of original source with pointer
function getErrorSource(error) {
  var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
  if (match) {
    var source = match[1];
    var line = +match[2];
    var column = +match[3];

    // Support the inline sourceContents inside the source map
    var contents = fileContentsCache[source];

    // Support files on disk
    if (!contents && fs && fs.existsSync(source)) {
      try {
        contents = fs.readFileSync(source, 'utf8');
      } catch (er) {
        contents = '';
      }
    }

    // Format the line from the original source code like node does
    if (contents) {
      var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
      if (code) {
        return source + ':' + line + '\n' + code + '\n' +
          new Array(column).join(' ') + '^';
      }
    }
  }
  return null;
}

function printErrorAndExit (error) {
  var source = getErrorSource(error);

  // Ensure error is printed synchronously and not truncated
  var stderr = globalProcessStderr();
  if (stderr && stderr._handle && stderr._handle.setBlocking) {
    stderr._handle.setBlocking(true);
  }

  if (source) {
    console.error();
    console.error(source);
  }

  console.error(error.stack);
  globalProcessExit(1);
}

function shimEmitUncaughtException () {
  var origEmit = process.emit;

  process.emit = function (type) {
    if (type === 'uncaughtException') {
      var hasStack = (arguments[1] && arguments[1].stack);
      var hasListeners = (this.listeners(type).length > 0);

      if (hasStack && !hasListeners) {
        return printErrorAndExit(arguments[1]);
      }
    }

    return origEmit.apply(this, arguments);
  };
}

var originalRetrieveFileHandlers = retrieveFileHandlers.slice(0);
var originalRetrieveMapHandlers = retrieveMapHandlers.slice(0);

exports.wrapCallSite = wrapCallSite;
exports.getErrorSource = getErrorSource;
exports.mapSourcePosition = mapSourcePosition;
exports.retrieveSourceMap = retrieveSourceMap;

exports.install = function(options) {
  options = options || {};

  if (options.environment) {
    environment = options.environment;
    if (["node", "browser", "auto"].indexOf(environment) === -1) {
      throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}")
    }
  }

  // Allow sources to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveFile) {
    if (options.overrideRetrieveFile) {
      retrieveFileHandlers.length = 0;
    }

    retrieveFileHandlers.unshift(options.retrieveFile);
  }

  // Allow source maps to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveSourceMap) {
    if (options.overrideRetrieveSourceMap) {
      retrieveMapHandlers.length = 0;
    }

    retrieveMapHandlers.unshift(options.retrieveSourceMap);
  }

  // Support runtime transpilers that include inline source maps
  if (options.hookRequire && !isInBrowser()) {
    // Use dynamicRequire to avoid including in browser bundles
    var Module = dynamicRequire(module, 'module');
    var $compile = Module.prototype._compile;

    if (!$compile.__sourceMapSupport) {
      Module.prototype._compile = function(content, filename) {
        fileContentsCache[filename] = content;
        sourceMapCache[filename] = undefined;
        return $compile.call(this, content, filename);
      };

      Module.prototype._compile.__sourceMapSupport = true;
    }
  }

  // Configure options
  if (!emptyCacheBetweenOperations) {
    emptyCacheBetweenOperations = 'emptyCacheBetweenOperations' in options ?
      options.emptyCacheBetweenOperations : false;
  }

  // Install the error reformatter
  if (!errorFormatterInstalled) {
    errorFormatterInstalled = true;
    Error.prepareStackTrace = prepareStackTrace;
  }

  if (!uncaughtShimInstalled) {
    var installHandler = 'handleUncaughtExceptions' in options ?
      options.handleUncaughtExceptions : true;

    // Do not override 'uncaughtException' with our own handler in Node.js
    // Worker threads. Workers pass the error to the main thread as an event,
    // rather than printing something to stderr and exiting.
    try {
      // We need to use `dynamicRequire` because `require` on it's own will be optimized by WebPack/Browserify.
      var worker_threads = dynamicRequire(module, 'worker_threads');
      if (worker_threads.isMainThread === false) {
        installHandler = false;
      }
    } catch(e) {}

    // Provide the option to not install the uncaught exception handler. This is
    // to support other uncaught exception handlers (in test frameworks, for
    // example). If this handler is not installed and there are no other uncaught
    // exception handlers, uncaught exceptions will be caught by node's built-in
    // exception handler and the process will still be terminated. However, the
    // generated JavaScript code will be shown above the stack trace instead of
    // the original source code.
    if (installHandler && hasGlobalProcessEventEmitter()) {
      uncaughtShimInstalled = true;
      shimEmitUncaughtException();
    }
  }
};

exports.resetRetrieveHandlers = function() {
  retrieveFileHandlers.length = 0;
  retrieveMapHandlers.length = 0;

  retrieveFileHandlers = originalRetrieveFileHandlers.slice(0);
  retrieveMapHandlers = originalRetrieveMapHandlers.slice(0);

  retrieveSourceMap = handlerExec(retrieveMapHandlers);
  retrieveFile = handlerExec(retrieveFileHandlers);
}


/***/ }),

/***/ "./node_modules/source-map/lib/array-set.js":
/*!**************************************************!*\
  !*** ./node_modules/source-map/lib/array-set.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(/*! ./util */ "./node_modules/source-map/lib/util.js");
var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;


/***/ }),

/***/ "./node_modules/source-map/lib/base64-vlq.js":
/*!***************************************************!*\
  !*** ./node_modules/source-map/lib/base64-vlq.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = __webpack_require__(/*! ./base64 */ "./node_modules/source-map/lib/base64.js");

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};


/***/ }),

/***/ "./node_modules/source-map/lib/base64.js":
/*!***********************************************!*\
  !*** ./node_modules/source-map/lib/base64.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};


/***/ }),

/***/ "./node_modules/source-map/lib/binary-search.js":
/*!******************************************************!*\
  !*** ./node_modules/source-map/lib/binary-search.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};


/***/ }),

/***/ "./node_modules/source-map/lib/mapping-list.js":
/*!*****************************************************!*\
  !*** ./node_modules/source-map/lib/mapping-list.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(/*! ./util */ "./node_modules/source-map/lib/util.js");

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;


/***/ }),

/***/ "./node_modules/source-map/lib/quick-sort.js":
/*!***************************************************!*\
  !*** ./node_modules/source-map/lib/quick-sort.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};


/***/ }),

/***/ "./node_modules/source-map/lib/source-map-consumer.js":
/*!************************************************************!*\
  !*** ./node_modules/source-map/lib/source-map-consumer.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(/*! ./util */ "./node_modules/source-map/lib/util.js");
var binarySearch = __webpack_require__(/*! ./binary-search */ "./node_modules/source-map/lib/binary-search.js");
var ArraySet = (__webpack_require__(/*! ./array-set */ "./node_modules/source-map/lib/array-set.js").ArraySet);
var base64VLQ = __webpack_require__(/*! ./base64-vlq */ "./node_modules/source-map/lib/base64-vlq.js");
var quickSort = (__webpack_require__(/*! ./quick-sort */ "./node_modules/source-map/lib/quick-sort.js").quickSort);

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),

/***/ "./node_modules/source-map/lib/source-map-generator.js":
/*!*************************************************************!*\
  !*** ./node_modules/source-map/lib/source-map-generator.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = __webpack_require__(/*! ./base64-vlq */ "./node_modules/source-map/lib/base64-vlq.js");
var util = __webpack_require__(/*! ./util */ "./node_modules/source-map/lib/util.js");
var ArraySet = (__webpack_require__(/*! ./array-set */ "./node_modules/source-map/lib/array-set.js").ArraySet);
var MappingList = (__webpack_require__(/*! ./mapping-list */ "./node_modules/source-map/lib/mapping-list.js").MappingList);

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }

      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }

      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
        throw new Error(
            'original.line and original.column are not numbers -- you probably meant to omit ' +
            'the original mapping entirely and only map the generated position. If so, pass ' +
            'null for the original mapping instead of an object with empty or null values.'
        );
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;


/***/ }),

/***/ "./node_modules/source-map/lib/source-node.js":
/*!****************************************************!*\
  !*** ./node_modules/source-map/lib/source-node.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = (__webpack_require__(/*! ./source-map-generator */ "./node_modules/source-map/lib/source-map-generator.js").SourceMapGenerator);
var util = __webpack_require__(/*! ./util */ "./node_modules/source-map/lib/util.js");

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex] || '';
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || '';
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;


/***/ }),

/***/ "./node_modules/source-map/lib/util.js":
/*!*********************************************!*\
  !*** ./node_modules/source-map/lib/util.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;


/***/ }),

/***/ "./node_modules/source-map/source-map.js":
/*!***********************************************!*\
  !*** ./node_modules/source-map/source-map.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = __webpack_require__(/*! ./lib/source-map-generator */ "./node_modules/source-map/lib/source-map-generator.js").SourceMapGenerator;
exports.SourceMapConsumer = __webpack_require__(/*! ./lib/source-map-consumer */ "./node_modules/source-map/lib/source-map-consumer.js").SourceMapConsumer;
exports.SourceNode = __webpack_require__(/*! ./lib/source-node */ "./node_modules/source-map/lib/source-node.js").SourceNode;


/***/ }),

/***/ "csharp":
/*!*************************!*\
  !*** external "csharp" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("csharp");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "puerts":
/*!*************************!*\
  !*** external "puerts" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("puerts");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ main)
/* harmony export */ });
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bootstrap */ "./src/bootstrap.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "./src/common/index.ts");


if (true) {
  __webpack_require__(/*! addons/source-map-support.unity.js */ "./src/addons/source-map-support.unity.js");
  console.STACK_REMAP = (path) => {
    let r = path.replace("Assets/StreamingAssets/scripts/webpack:///", "");
    r = r.replace("webpack-internal:///./", "");
    return r;
  };
}
function main(lancher) {
  return new JavaScriptApplication(lancher);
}
class JavaScriptApplication {
  constructor(launcher) {
    this.launcher = launcher;
    JavaScriptApplication.$inst = this;
    launcher.JS_fixedUpdate = this.fixedUpdate.bind(this);
    launcher.JS_update = this.update.bind(this);
    launcher.JS_lateUpdate = this.lateUpdate.bind(this);
    launcher.JS_finalize = this.finalize.bind(this);
    this.initialize();
  }
  static get inst() {
    return this.$inst;
  }
  initialize() {
    console.log(`\u5DF2\u542F\u52A8 JavaScript \u865A\u62DF\u673A`);
    new bootstrap__WEBPACK_IMPORTED_MODULE_0__["default"]().start();
  }
  fixedUpdate(delta) {
  }
  update(delta) {
    WebAPI.tick();
    common__WEBPACK_IMPORTED_MODULE_1__.director.tick(delta);
  }
  lateUpdate(delta) {
  }
  finalize() {
    WebAPI.finalize();
    console.log(`\u5173\u95ED JavaScript \u865A\u62DF\u673A`);
  }
}

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSx3Q0FBd0MsU0FBUztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxpQkFBaUI7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsRUFBRTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixlQUFlO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLHlCQUF5QixRQUFRO0FBQ2pDO0FBQ0Esc0JBQXNCLGVBQWU7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FB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LE1BQU07QUFBQSxFQVNOLE1BQU07QUFBQSxFQU9OLE1BQU07QUFBQSxFQU9OLFdBQVc7QUFBQSxFQU9YLEtBQUs7QUFBQSxFQU9MLE9BQU87QUFBQSxFQVFQLE9BQU87QUFBQSxFQVFQLE1BQU07QUFBQSxFQVFOLEtBQUs7QUFBQSxFQU9MLE9BQU87QUFBQSxFQU9QLFVBQVU7QUFBQSxFQU9WLFFBQVE7QUFBQSxFQU9SLE9BQU87QUFBQSxFQU9QLFFBQVE7QUFBQSxFQU9SLFVBQVU7QUFBQSxFQU9WLEtBQUs7QUFBQSxFQU9MLE1BQU07QUFBQSxFQU9OLE1BQU07QUFBQSxFQU9OLElBQUk7QUFBQSxFQU9KLE9BQU87QUFBQSxFQU9QLE1BQU07QUFBQSxFQVFOLFFBQVE7QUFBQSxFQU9SLFFBQVE7QUFBQSxFQU9SLFFBQVE7QUFBQSxFQVFSLEdBQUc7QUFBQSxFQVFILEdBQUc7QUFBQSxFQVFILEdBQUc7QUFBQSxFQVFILEdBQUc7QUFBQSxFQVFILEdBQUc7QUFBQSxFQVFILEdBQUc7QUFBQSxFQVFILEdBQUc7QUFBQSxFQVFILEdBQUc7QUFBQSxFQVFILEdBQUc7QUFBQSxFQVFILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILEdBQUc7QUFBQSxFQU9ILE1BQU07QUFBQSxFQU9OLE1BQU07QUFBQSxFQU9OLE1BQU07QUFBQSxFQU9OLE1BQU07QUFBQSxFQU9OLE1BQU07QUFBQSxFQU9OLE1BQU07QUFBQSxFQU9OLE1BQU07QUFBQSxFQU9OLE1BQU07QUFBQSxFQU9OLE1BQU07QUFBQSxFQU9OLE1BQU07QUFBQSxFQVFOLEtBQUs7QUFBQSxFQVFMLEtBQUs7QUFBQSxFQVFMLEtBQUs7QUFBQSxFQU9MLFFBQVE7QUFBQSxFQVFSLEtBQUs7QUFBQSxFQU9MLElBQUk7QUFBQSxFQU9KLElBQUk7QUFBQSxFQU9KLElBQUk7QUFBQSxFQU9KLElBQUk7QUFBQSxFQU9KLElBQUk7QUFBQSxFQU9KLElBQUk7QUFBQSxFQU9KLElBQUk7QUFBQSxFQU9KLElBQUk7QUFBQSxFQU9KLElBQUk7QUFBQSxFQU9KLEtBQUs7QUFBQSxFQU9MLEtBQUs7QUFBQSxFQU9MLEtBQUs7QUFBQSxFQU9MLFNBQVM7QUFBQSxFQU9ULFlBQVk7QUFBQSxFQVFaLEtBQUs7QUFBQSxFQU9MLFdBQVc7QUFBQSxFQU9YLE9BQU87QUFBQSxFQVFQLEtBQUs7QUFBQSxFQVFMLEtBQUs7QUFBQSxFQU9MLE9BQU87QUFBQSxFQU9QLE1BQU07QUFBQSxFQVFOLEtBQUs7QUFBQSxFQU9MLFFBQVE7QUFBQSxFQU9SLGNBQWM7QUFBQSxFQU9kLE9BQU87QUFBQSxFQVFQLEtBQUs7QUFBQSxFQU9MLGFBQWE7QUFBQSxFQU9iLFdBQVc7QUFBQSxFQVFYLEtBQUs7QUFBQSxFQU9MLGNBQWM7QUFBQSxFQU9kLE9BQU87QUFBQSxFQVVQLFVBQVU7QUFBQSxFQVFWLFdBQVc7QUFBQSxFQVFYLFFBQVE7QUFBQSxFQVFSLFVBQVU7QUFBQSxFQVFWLFlBQVk7QUFDaEI7QUE2T0EsTUFBTSxRQUFlO0FBQUEsRUFDakI7QUFBQSxFQUNBO0FBQUEsRUFDQSxLQUFLLEtBQUssS0FBSztBQUFBLEVBQ2YsS0FBSyxNQUFNLEtBQUs7QUFBQSxFQUNoQixnQkFBaUIsT0FBTyxZQUFZO0FBQUEsRUFDcEMsYUFBYTtBQUFBLEVBQ2Isc0JBQXNCO0FBQUEsRUFDdEIsdUJBQXVCO0FBQUEsRUFDdkIsa0JBQWtCO0FBQUEsRUFDbEIseUJBQXlCO0FBQUEsRUFDekIsZUFBZTtBQUFBLEVBQ2YsMkJBQTJCO0FBQUEsRUFDM0Isd0JBQXdCO0FBQUEsRUFDeEIsdUJBQXVCO0FBQUEsRUFDdkIsY0FBYztBQUFBLEVBQ2QscUJBQXFCO0FBQUEsRUFDckIsb0JBQW9CO0FBQUEsRUFDcEIsNEJBQTRCO0FBQUEsRUFDNUIsa0NBQWtDO0FBQUEsRUFDbEMseUJBQXlCO0FBQzdCO0FBRWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOWpDVCxTQUFTLG1CQUFtQixPQUFxQjtBQUN4RCxNQUFJLFFBQVEsTUFBTTtBQUNsQixTQUFPLE9BQU87QUFDYixRQUFJLFFBQVEsS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLE9BQU87QUFDOUMsUUFBSSxPQUFPLE1BQU07QUFDakIsVUFBTSxTQUFTLE1BQU07QUFDckIsVUFBTSxTQUFTO0FBQUEsRUFDaEI7QUFDQSxTQUFPO0FBQ1I7QUFNTyxTQUFTLFlBQWUsT0FBZTtBQUM3QyxTQUFPLE1BQU0sS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLE1BQU0sTUFBTTtBQUNyRDtBQVFPLFNBQVMsV0FBYyxPQUFZLE9BQWU7QUFDeEQsTUFBSSxXQUFXLE1BQU0sTUFBTSxDQUFDLEdBQzNCLElBQUksTUFBTSxRQUNWLE1BQU0sSUFBSSxPQUNWLE1BQ0E7QUFDRCxTQUFPLE1BQU0sS0FBSztBQUNqQixZQUFRLEtBQUssT0FBTyxJQUFJLEtBQUssS0FBSyxPQUFPLENBQUM7QUFDMUMsV0FBTyxTQUFTO0FBQ2hCLGFBQVMsU0FBUyxTQUFTO0FBQzNCLGFBQVMsS0FBSztBQUFBLEVBQ2Y7QUFDQSxTQUFPLFNBQVMsTUFBTSxHQUFHO0FBQzFCO0FBT08sU0FBUyxnQkFBZ0IsV0FBNkI7QUFDNUQsY0FBWSxLQUFLLFdBQVcsU0FBUztBQUNyQyxNQUFJLGNBQXNCLFVBQVUsVUFBVSxTQUFTO0FBQ3ZELE1BQUksU0FBaUIsS0FBSyxPQUFPLElBQUk7QUFDckMsTUFBSSxXQUFtQixLQUFLLGVBQWUsUUFBUSxTQUFTO0FBQzVELFNBQU87QUFDUjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pEUSxTQUFTLFdBQVcsTUFBcUIsS0FBYTtBQUM3RCxRQUFNLE9BQU8sSUFBSSxLQUFLLElBQUk7QUFDMUIsUUFBTSxNQUFpQztBQUFBLElBQ3RDLE1BQU0sS0FBSyxZQUFZLEVBQUUsU0FBUztBQUFBLElBQ2xDLE9BQU8sS0FBSyxTQUFTLElBQUksR0FBRyxTQUFTO0FBQUEsSUFDckMsTUFBTSxLQUFLLFFBQVEsRUFBRSxTQUFTO0FBQUEsSUFDOUIsTUFBTSxLQUFLLFNBQVMsRUFBRSxTQUFTO0FBQUEsSUFDL0IsTUFBTSxLQUFLLFdBQVcsRUFBRSxTQUFTO0FBQUEsSUFDakMsTUFBTSxLQUFLLFdBQVcsRUFBRSxTQUFTO0FBQUEsSUFDakMsTUFBTSxLQUFLLGdCQUFnQixFQUFFLFNBQVM7QUFBQSxFQUN2QztBQUNBLGFBQVcsS0FBSyxLQUFLO0FBQ3BCLFVBQU0sTUFBTSxJQUFJLE9BQU8sTUFBTSxJQUFJLEdBQUcsRUFBRSxLQUFLLEdBQUc7QUFDOUMsUUFBSSxLQUFLO0FBQ1IsVUFBSSxPQUFPLEtBQUssQ0FBQyxHQUFHO0FBQ25CLGNBQU0sSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLEdBQUcsVUFBVSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUM7QUFBQSxNQUM5RCxPQUFPO0FBQ04sY0FBTSxJQUFJO0FBQUEsVUFDVCxJQUFJO0FBQUEsVUFDSixJQUFJLEdBQUcsV0FBVyxJQUNmLElBQUksS0FDSixJQUFJLEdBQUcsU0FBUyxJQUFJLEdBQUcsUUFBUSxHQUFHO0FBQUEsUUFDdEM7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDQSxTQUFPO0FBQ1I7QUFFQSxTQUFTLGNBQWMsS0FBYSxRQUF3QjtBQUMzRCxVQUFRLE1BQU0sTUFBTSxFQUFFLEtBQUssR0FBRyxJQUFJLEtBQUssTUFBTSxDQUFDLE1BQU07QUFDckQ7QUFNTyxTQUFTLFdBQVcsTUFBc0I7QUFDaEQsTUFBSSxRQUFRLEdBQUc7QUFDZCxXQUFPO0FBQUEsRUFDUixPQUFPO0FBQ04sUUFBSSxPQUFlLEtBQUssTUFBTSxRQUFRLEtBQUssR0FBRztBQUU5QyxRQUFJLFNBQWlCLEtBQUssTUFBTSxPQUFPLEVBQUUsSUFBSTtBQUM3QyxRQUFJLFlBQW9CLGNBQWMsUUFBUSxDQUFDO0FBQy9DLFdBQU8sR0FBRyxRQUFRO0FBQUEsRUFDbkI7QUFDRDtBQU1PLFNBQVMsYUFBYSxNQUFzQjtBQUNsRCxNQUFJLFFBQVEsR0FBRztBQUNkLFdBQU87QUFBQSxFQUNSLE9BQU87QUFDTixRQUFJLFNBQWlCLEtBQUssTUFBTSxPQUFPLEVBQUUsSUFBSTtBQUU3QyxRQUFJLFNBQWlCLE9BQU87QUFDNUIsUUFBSSxZQUFvQixjQUFjLFFBQVEsQ0FBQztBQUMvQyxXQUFPLEdBQUcsVUFBVTtBQUFBLEVBQ3JCO0FBQ0Q7QUFNTyxTQUFTLGFBQWEsTUFBc0I7QUFDbEQsTUFBSSxRQUFRLEdBQUc7QUFDZCxXQUFPO0FBQUEsRUFDUixPQUFPO0FBQ04sUUFBSSxTQUFpQixPQUFPO0FBQzVCLFdBQU8sR0FBRztBQUFBLEVBQ1g7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZFTyxTQUFTLFVBQVUsS0FBYSxRQUFnQjtBQUN0RCxRQUFNLEtBQUs7QUFBQSxJQUNWLEVBQUUsT0FBTyxHQUFHLFFBQVEsR0FBRztBQUFBLElBQ3ZCLEVBQUUsT0FBTyxLQUFLLFFBQVEsSUFBSTtBQUFBLElBQzFCLEVBQUUsT0FBTyxLQUFLLFFBQVEsSUFBSTtBQUFBLEVBTzNCO0FBQ0EsUUFBTSxLQUFLO0FBQ1gsTUFBSTtBQUNKLE1BQUksU0FBUztBQUNiLE9BQUssSUFBSSxHQUFHLFNBQVMsR0FBRyxJQUFJLEdBQUcsS0FBSztBQUNuQyxRQUFJLE9BQU8sR0FBRyxHQUFHLE9BQU87QUFDdkI7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNBLE1BQUksT0FBTyxLQUFLO0FBQ2YsYUFBUztBQUFBLEVBQ1YsT0FBTztBQUNOLGNBQ0UsTUFBTSxHQUFHLEdBQUcsT0FBTyxRQUFRLE1BQU0sRUFBRSxRQUFRLElBQUksSUFBSSxJQUNwRCxHQUFHLEdBQUc7QUFBQSxFQUNSO0FBQ0EsTUFBSSxPQUFPLFNBQVMsR0FBRztBQUN0QixhQUFTLE9BQU8sTUFBTSxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUc7QUFBQSxFQUNyQztBQUNBLFNBQU87QUFDUjtBQVdPLFNBQVMsVUFBVSxLQUFxQjtBQUM5QyxNQUFJLFlBQVk7QUFBQSxJQUNmO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUNBLE1BQUksT0FBTyxDQUFDLElBQUksVUFBSyxVQUFLLFVBQUssUUFBRztBQUNsQyxNQUFJLFNBQVMsQ0FBQyxTQUEwQjtBQUN2QyxRQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUUsTUFBTSxFQUFFLEVBQUUsUUFBUTtBQUMvQyxRQUFJLFNBQVM7QUFDYixhQUFTLElBQUksR0FBRyxJQUFJLE9BQU8sUUFBUSxLQUFLO0FBQ3ZDLFVBQUksSUFBSSxPQUFPLE9BQU8sRUFBRTtBQUN4QixVQUFJLElBQUksT0FBTyxPQUFPLElBQUksRUFBRTtBQUM1QixnQkFDRSxLQUFLLEtBQUssS0FBSyxJQUNiLEtBQ0EsSUFBSSxLQUFLLEtBQUssS0FBSyxLQUFLLElBQ3hCLEtBQ0EsVUFBVSxPQUFPLE9BQU8sS0FBSyxJQUFJLEtBQUssS0FBSyxLQUFLLE9BQ25EO0FBQUEsSUFDRjtBQUNBLFdBQU87QUFBQSxFQUNSO0FBQ0EsTUFBSSxVQUFVLEtBQUssTUFBTSxNQUFNLEdBQUs7QUFDcEMsTUFBSSxRQUFRLE1BQU07QUFDbEIsTUFBSSxXQUFtQjtBQUN2QixNQUFJLE1BQU0sU0FBUyxFQUFFLFNBQVMsR0FBRztBQUNoQyxlQUFXLE1BQU07QUFBQSxFQUNsQjtBQUNBLFNBQU8sVUFBVSxPQUFPLE9BQU8sSUFBSSxXQUFNLE9BQU8sUUFBUSxJQUFJLE9BQU8sR0FBRztBQUN2RTtBQUVPLFNBQVMsaUJBQWlCLEtBQWE7QUFDN0MsTUFBSSxTQUFTO0FBQUEsSUFDWjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQ0EsTUFBSSxNQUFNLEtBQUssTUFBTSxJQUFJO0FBQ3hCLFdBQU87QUFBQSxFQUNSO0FBRUEsU0FBTyxPQUFPO0FBQ2Y7QUFHTyxTQUFTLGNBQWMsT0FBZSxNQUFNLEdBQUc7QUFDckQsTUFBSSxNQUFNLFNBQVMsS0FBSztBQUN2QixZQUFRLE1BQU0sTUFBTSxHQUFHLEdBQUc7QUFDMUIsYUFBUztBQUFBLEVBQ1Y7QUFDQSxTQUFPO0FBQ1I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pIMkM7QUFDSDtBQUtqQyxJQUFLLFlBQUwsa0JBQUtDLGVBQUw7QUFJTixFQUFBQSxzQkFBQTtBQUtBLEVBQUFBLHNCQUFBO0FBS0EsRUFBQUEsc0JBQUE7QUFkVyxTQUFBQTtBQUFBO0FBa0JMLElBQUssY0FBTCxrQkFBS0MsaUJBQUw7QUFDTixFQUFBQSwwQkFBQTtBQUNBLEVBQUFBLDBCQUFBO0FBQ0EsRUFBQUEsMEJBQUE7QUFIVyxTQUFBQTtBQUFBO0FBU0wsSUFBSyxTQUFMLGtCQUFLQyxZQUFMO0FBQ04sRUFBQUEsZ0JBQUE7QUFDQSxFQUFBQSxnQkFBQTtBQUNBLEVBQUFBLGdCQUFBO0FBRUEsRUFBQUEsZ0JBQUE7QUFFQSxFQUFBQSxnQkFBQTtBQUVBLEVBQUFBLGdCQUFBO0FBRUEsRUFBQUEsZ0JBQUE7QUFFQSxFQUFBQSxnQkFBQTtBQUdBLEVBQUFBLGdCQUFBO0FBR0EsRUFBQUEsZ0JBQUE7QUFFQSxFQUFBQSxnQkFBQTtBQUVBLEVBQUFBLGdCQUFBO0FBRUEsRUFBQUEsZ0JBQUE7QUF6QlcsU0FBQUE7QUFBQTtBQTRCTCxNQUFNLGNBQU4sTUFBaUI7QUFBQSxFQXNCdkIsWUFDQyxRQUNBLFFBQ0EsU0FBd0IscURBQU0sRUFDOUIsZUFBd0IsTUFDeEIsUUFBaUIsT0FDaEI7QUFYRixTQUFPLGVBQXdCO0FBRy9CLFNBQU8sUUFBaUI7QUFTdkIsU0FBSyxTQUFTO0FBQ2QsU0FBSyxTQUFTLE9BQU8sTUFBTSxHQUFHO0FBQzlCLFNBQUssU0FBUztBQUNkLFNBQUssZUFBZTtBQUNwQixTQUFLLFFBQVE7QUFBQSxFQUNkO0FBQUEsRUFLQSxJQUFXLGNBQXNCO0FBQ2hDLFFBQUksTUFBTSxLQUFLLE9BQU87QUFDdEIsUUFBSSxjQUFjO0FBQ2xCLGFBQVMsSUFBSSxHQUFHLElBQUksTUFBTSxHQUFHLEtBQUs7QUFDakMscUJBQWUsS0FBSyxPQUFPLEtBQUs7QUFBQSxJQUNqQztBQUNBLFdBQU8sY0FBYyxLQUFLO0FBQUEsRUFDM0I7QUFBQSxFQUtBLElBQVcsY0FBc0I7QUFDaEMsUUFBSSxNQUFNLEtBQUssT0FBTztBQUN0QixXQUFPLEtBQUssT0FBTyxNQUFNO0FBQUEsRUFDMUI7QUFBQSxFQUtBLElBQVcsZ0JBQXdCO0FBQ2xDLFFBQUksTUFBTSxLQUFLLE9BQU87QUFDdEIsV0FBTyxLQUFLLE9BQU8sTUFBTTtBQUFBLEVBQzFCO0FBQUEsRUFNQSxPQUFjLFVBQVUsUUFBNEI7QUFDbkQsYUFBUyxJQUFJLEdBQUcsSUFBSSxLQUFLLFlBQVksUUFBUSxFQUFFLEdBQUc7QUFDakQsVUFBSSxLQUFLLFlBQVksR0FBRyxVQUFVLFFBQVE7QUFDekMsZUFBTyxLQUFLLFlBQVk7QUFBQSxNQUN6QjtBQUFBLElBQ0Q7QUFDQSxXQUFPO0FBQUEsRUFDUjtBQVlEO0FBdkZPLElBQU0sYUFBTjtBQUFNLFdBOEVHLGNBQWlDO0FBQUEsRUFDL0MsSUFBSSxZQUFXLGdCQUFlLGtCQUFrQjtBQUFBLEVBQ2hELElBQUksWUFBVyxnQkFBZSxrQkFBa0I7QUFBQSxFQUdoRCxJQUFJLFlBQVcsaUJBQWdCLGVBQWUsZ0RBQU87QUFBQSxFQUNyRCxJQUFJLFlBQVcsaUJBQWdCLGlCQUFpQixnREFBTztBQUN4RDs7Ozs7Ozs7Ozs7QUMxSkQ7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFdBQVc7O0FBRXBCO0FBQ0E7QUFDQTtBQUNBLFNBQVMsV0FBVzs7QUFFcEI7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUyxXQUFXOztBQUVwQjtBQUNBO0FBQ0EsU0FBUyxVQUFVOztBQUVuQjtBQUNBOzs7Ozs7Ozs7Ozs7QUNwRkEsd0JBQXdCLG9HQUF1QztBQUMvRCxXQUFXLG1CQUFPLENBQUMsa0JBQU07O0FBRXpCO0FBQ0E7QUFDQSxPQUFPLG1CQUFPLENBQUMsY0FBSTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBLGlCQUFpQixtQkFBTyxDQUFDLHdEQUFhOztBQUV0QztBQUNBO0FBQ0E7QUFDQSxXQUFXLFlBQVk7QUFDdkIsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGFBQWE7QUFDYjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QixXQUFXLG1CQUFtQjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRCxrQ0FBa0M7QUFDN0YsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELEdBQUcsc0JBQXNCLEdBQUc7QUFDdkY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDLHVDQUF1QztBQUN2Qyx5Q0FBeUM7QUFDekMsa0RBQWtEO0FBQ2xEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCO0FBQ2hCO0FBQ0EsaUNBQWlDLFFBQVE7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQixzQkFBc0I7QUFDdEIseUJBQXlCO0FBQ3pCLHlCQUF5Qjs7QUFFekIsZUFBZTtBQUNmOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJGQUEyRixvQkFBb0I7QUFDL0c7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QjtBQUM3QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ2huQkEsaUJBQWlCLG9CQUFvQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsbUJBQU8sQ0FBQyxxREFBUTtBQUMzQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsU0FBUztBQUNoRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQjs7Ozs7Ozs7Ozs7QUN4SGhCLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RCxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHlEQUFVOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDM0lBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxxQkFBcUI7QUFDckIscUJBQXFCOztBQUVyQixxQkFBcUI7QUFDckIscUJBQXFCOztBQUVyQixxQkFBcUI7QUFDckIscUJBQXFCOztBQUVyQixxQkFBcUI7QUFDckIscUJBQXFCOztBQUVyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNsRUEsaUJBQWlCLG9CQUFvQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QjtBQUM1Qix5QkFBeUI7O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDOUdBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLG1CQUFPLENBQUMscURBQVE7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1COzs7Ozs7Ozs7OztBQzlFbkIsaUJBQWlCLG9CQUFvQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7Ozs7Ozs7Ozs7QUNqSEEsaUJBQWlCLG9CQUFvQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsbUJBQU8sQ0FBQyxxREFBUTtBQUMzQixtQkFBbUIsbUJBQU8sQ0FBQyx1RUFBaUI7QUFDNUMsZUFBZSwrRkFBK0I7QUFDOUMsZ0JBQWdCLG1CQUFPLENBQUMsaUVBQWM7QUFDdEMsZ0JBQWdCLGtHQUFpQzs7QUFFakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25COztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVg7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHlCQUF5Qjs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxrQ0FBa0M7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsdURBQXVELFlBQVk7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixjQUFjO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isd0NBQXdDO0FBQ2hFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELG9CQUFvQjtBQUNwRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhCQUE4Qjs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixNQUFNO0FBQ25DO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiwyQkFBMkI7QUFDL0Msc0JBQXNCLCtDQUErQztBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMkJBQTJCO0FBQy9DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDJCQUEyQjtBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMkJBQTJCO0FBQy9DO0FBQ0E7QUFDQSxzQkFBc0IsNEJBQTRCO0FBQ2xEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGdDQUFnQzs7Ozs7Ozs7Ozs7QUN4bkNoQyxpQkFBaUIsb0JBQW9CO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLG1CQUFPLENBQUMsaUVBQWM7QUFDdEMsV0FBVyxtQkFBTyxDQUFDLHFEQUFRO0FBQzNCLGVBQWUsK0ZBQStCO0FBQzlDLGtCQUFrQix3R0FBcUM7O0FBRXZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMkMsU0FBUztBQUNwRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCOzs7Ozs7Ozs7OztBQ3hhMUIsaUJBQWlCLG9CQUFvQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHlCQUF5QiwrSEFBb0Q7QUFDN0UsV0FBVyxtQkFBTyxDQUFDLHFEQUFROztBQUUzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsUUFBUTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsU0FBUztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsV0FBVztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFNBQVM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQ0FBMEMsU0FBUztBQUNuRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLGNBQWM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxXQUFXO0FBQ1g7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHOztBQUVILFdBQVc7QUFDWDs7QUFFQSxrQkFBa0I7Ozs7Ozs7Ozs7O0FDNVpsQixpQkFBaUIsb0JBQW9CO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCOztBQUVoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1COztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTs7QUFFWixrQkFBa0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjs7QUFFaEI7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNEJBQTRCLFFBQVE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0NBQWtDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQ0FBMkM7O0FBRTNDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkOztBQUVBO0FBQ0EsZUFBZTtBQUNmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkNBQTJDOztBQUUzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3Qjs7Ozs7Ozs7Ozs7QUN2ZXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4SkFBcUY7QUFDckYsMEpBQWtGO0FBQ2xGLDRIQUE0RDs7Ozs7Ozs7Ozs7O0FDUDVEOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDS2tDO0FBQ087QUFFekMsSUFBSSxJQUFXLEVBQUU7QUFDaEIscUJBQU8sQ0FBQyxvRkFBb0M7QUFDNUMsVUFBUSxjQUFjLENBQUMsU0FBUztBQUMvQixRQUFJLElBQUksS0FBSyxRQUFRLDhDQUE4QyxFQUFFO0FBQ3JFLFFBQUksRUFBRSxRQUFRLDBCQUEwQixFQUFFO0FBQzFDLFdBQU87QUFBQSxFQUNSO0FBQ0Q7QUFTZSxTQUFTLEtBQUssU0FBMEI7QUFDdEQsU0FBTyxJQUFJLHNCQUFzQixPQUFPO0FBQ3pDO0FBRUEsTUFBTSxzQkFBc0I7QUFBQSxFQUszQixZQUFxQixVQUEyQjtBQUEzQjtBQUNwQiwwQkFBc0IsUUFBUTtBQUM5QixhQUFTLGlCQUFpQixLQUFLLFlBQVksS0FBSyxJQUFJO0FBQ3BELGFBQVMsWUFBWSxLQUFLLE9BQU8sS0FBSyxJQUFJO0FBQzFDLGFBQVMsZ0JBQWdCLEtBQUssV0FBVyxLQUFLLElBQUk7QUFDbEQsYUFBUyxjQUFjLEtBQUssU0FBUyxLQUFLLElBQUk7QUFDOUMsU0FBSyxXQUFXO0FBQUEsRUFDakI7QUFBQSxFQVZBLFdBQWtCLE9BQThCO0FBQy9DLFdBQU8sS0FBSztBQUFBLEVBQ2I7QUFBQSxFQVVRLGFBQWE7QUFDcEIsWUFBUSxJQUFJLGtEQUFvQjtBQUNoQyxRQUFJLGlEQUFTLENBQUMsRUFBRSxNQUFNO0FBQUEsRUFDdkI7QUFBQSxFQUVRLFlBQVksT0FBZTtBQUFBLEVBQUM7QUFBQSxFQUU1QixPQUFPLE9BQWU7QUFDN0IsV0FBTyxLQUFLO0FBQ1oscURBQWEsQ0FBQyxLQUFLO0FBQUEsRUFDcEI7QUFBQSxFQUVRLFdBQVcsT0FBZTtBQUFBLEVBQUM7QUFBQSxFQUUzQixXQUFXO0FBQ2xCLFdBQU8sU0FBUztBQUNoQixZQUFRLElBQUksNENBQW1CO0FBQUEsRUFDaEM7QUFDRCIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2J1ZmZlci1mcm9tL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1VJL0xvYWRpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy9zb3VyY2UtbWFwLXN1cHBvcnQudW5pdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Jvb3RzdHJhcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2V2ZW50L2NhbGxiYWNrcy1pbnZva2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vZXZlbnQvZXZlbnQtdGFyZ2V0LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vZXZlbnQvZXZlbnRpZnkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9ldmVudC9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vbWF0aC9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL21hdGgvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9tYXRoL3ZlYzIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9tYXRoL3ZlYzMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9tZW1vcC9jb250YWluZXItbWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL21lbW9wL3Bvb2wudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9tZW1vcC9zY2FsYWJsZS1jb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9yZXMvcmVzLWtlZXBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3Jlcy9yZXMtbG9hZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vc2luZ2xldG9uLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vc3lzL2RpcmVjdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vc3lzL3NjaGVkdWxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3N5cy9zeXN0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi91aS91aS1iYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vdWkvdWktY29tcG9uZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vdWkvdWktbWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3V0aWxzL2FycmF5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vdXRpbHMvaWQtZ2VuZXJhdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vdXRpbHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi91dGlscy9qcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3V0aWxzL21hY3JvLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vdXRpbHMvcmFuZG9tLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vdXRpbHMvdGltZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3V0aWxzL3dvcmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlZmluZS91aS1kZWZpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAtc3VwcG9ydC9zb3VyY2UtbWFwLXN1cHBvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2FycmF5LXNldC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvYmFzZTY0LXZscS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvYmFzZTY0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9iaW5hcnktc2VhcmNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9tYXBwaW5nLWxpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL3F1aWNrLXNvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL3NvdXJjZS1tYXAtY29uc3VtZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL3NvdXJjZS1tYXAtZ2VuZXJhdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9zb3VyY2Utbm9kZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc291cmNlLW1hcC9zb3VyY2UtbWFwLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBjb21tb25qcyBcImNzaGFycFwiIiwid2VicGFjazovLy9leHRlcm5hbCBjb21tb25qcyBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIGNvbW1vbmpzIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBjb21tb25qcyBcInB1ZXJ0c1wiIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL25vZGUgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6WyJwYXRoIiwic2NoZWR1bGVyIiwiUHJpb3JpdHkiLCJlT3JpZW50YXRpb24iLCJ1aVR5cGUiLCJMYXllclR5cGUiLCJVSVNob3dUeXBlcyIsIlVJVHlwZSJdLCJzb3VyY2VSb290IjoiIn0=