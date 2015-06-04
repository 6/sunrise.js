var sunrise = require("../sunrise");

describe("sunrise", function() {
  describe("#format", function() {
    it("returns colors in hex format", function() {
      expect(sunrise("#ff0000", "#abc").generate(3).format("hex")).toEqual([
        "#ff0000",
        "#d45d66",
        "#aabbcc"
      ]);
    });

    it("returns colors in RGB format", function() {
      expect(sunrise("rgb(140, 223, 82)", "rgb(18, 74, 94)").generate(4).format("rgb")).toEqual([
        'rgb(140, 223, 82)',
        'rgb(99, 173, 86)',
        'rgb(59, 124, 90)',
        'rgb(18, 74, 94)'
      ]);
    });

    describe("with an invalid format", function() {
      it("throws an error", function() {
        expect(function() { sunrise("#123", "#234").generate(5).format('invalid') }).toThrowError("Unrecognized color format: invalid");
      });
    });
  });

  describe("#generate", function() {
    it("generates the correct number of colors", function() {
      expect(sunrise("#123", "#234").generate(100).format('hex').length).toEqual(100);
    });
  });

  describe("#scale", function() {
    it("returns the color at the given position", function() {
      var gradient = sunrise("#000", "#fff");
      expect(gradient.scale(0).format('hex')).toEqual("#000000");
      expect(gradient.scale(1).format('hex')).toEqual("#ffffff");
      expect(gradient.scale(0.5).format('rgb')).toEqual("rgb(128, 128, 128)");
      expect(gradient.scale(0.25).format('rgb')).toEqual("rgb(64, 64, 64)");
    });
  });

  describe("color string parsing", function() {
    describe("with invalid color formats", function() {
      it("throws an error", function() {
        expect(function() { sunrise("#zzz", "#000") }).toThrowError("Unrecognized color: #zzz");
        expect(function() { sunrise("rgb(100,100)", "#000") }).toThrowError("Unrecognized color: rgb(100,100)");
      });
    });
  });
});
