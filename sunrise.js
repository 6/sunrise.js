(function(global) {
  var REGEX_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      REGEX_RGB = /rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/;

  var Sunrise = function(color1, color2, options) {
    options = options || {};
    this.color1 = parseColorString(color1);
    this.color2 = parseColorString(color2);
    this.scaleFunction = options.scaleFunction || function(n) { return n; };
  };

  Sunrise.prototype.scale = function(position) {
    var color = new Color();
    position = this.scaleFunction(position);
    ["r", "g", "b"].forEach(function(channel) {
      color[channel] = this.color1[channel] + ((this.color2[channel] - this.color1[channel]) * position);
    }, this);
    return color;
  };

  Sunrise.prototype.generate = function(n) {
    var colors = [];
    for(var i = 0; i < n; i ++) {
      var position = i / (n - 1);
      colors.push(this.scale(position));
    }
    return {
      colors: colors,
      format: function(format) {
        return colors.map(function(color) {
          return color.format(format);
        });
      }
    };
  };

  var Color = function(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  };

  Color.prototype.format = function(format) {
    switch(format) {
      case 'hex':
        return rgb2hex(this.r, this.g, this.b);
      case 'rgb':
        return "rgb(" + [this.r, this.g, this.b].map(Math.round).join(", ") + ")";
      default:
        throw new Error("Unrecognized color format: " + format);
    }
  };

  var parseColorString = function(str) {
    if(str.match(REGEX_HEX)) {
      var rgb = hex2rgb(str);
      return new Color(rgb[0], rgb[1], rgb[2]);
    }
    else if(str.match(REGEX_RGB)) {
      var rgb = str.match(REGEX_RGB).slice(1, 4);
      return new Color(+rgb[0], +rgb[1], +rgb[2]);
    }
    throw new Error("Unrecognized color: " + str);
  };

  var rgb2hex = function(r, g, b) {
    var u = r << 16 | g << 8 | b;
    var str = "000000" + u.toString(16);
    str = str.substr(str.length - 6);
    return "#" + str;
  };

  var hex2rgb = function(hex) {
    if (hex.length == 4 || hex.length == 7) // remove "#"
      hex = hex.substr(1);
    if (hex.length == 3) { // convert "f60" shorthand to "ff6600"
      hex = hex.split("");
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var u = parseInt(hex, 16);
    var r = u >> 16,
        g = u >> 8 & 0xFF,
        b = u & 0xFF;
    return [r, g, b];
  };

  var sunrise = function(color1, color2, options) {
    return new Sunrise(color1, color2, options);
  };

  if (typeof module !== 'undefined' && module.exports)
    module.exports = sunrise;
  else
    global.sunrise = sunrise;
})(this);
