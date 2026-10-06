"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/qrcode-generator/qrcode.js
  var require_qrcode = __commonJS({
    "node_modules/qrcode-generator/qrcode.js"(exports, module) {
      var qrcode2 = (function() {
        var qrcode3 = function(typeNumber, errorCorrectionLevel) {
          var PAD0 = 236;
          var PAD1 = 17;
          var _typeNumber = typeNumber;
          var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
          var _modules = null;
          var _moduleCount = 0;
          var _dataCache = null;
          var _dataList = [];
          var _this = {};
          var makeImpl = function(test, maskPattern) {
            _moduleCount = _typeNumber * 4 + 17;
            _modules = (function(moduleCount) {
              var modules = new Array(moduleCount);
              for (var row = 0; row < moduleCount; row += 1) {
                modules[row] = new Array(moduleCount);
                for (var col = 0; col < moduleCount; col += 1) {
                  modules[row][col] = null;
                }
              }
              return modules;
            })(_moduleCount);
            setupPositionProbePattern(0, 0);
            setupPositionProbePattern(_moduleCount - 7, 0);
            setupPositionProbePattern(0, _moduleCount - 7);
            setupPositionAdjustPattern();
            setupTimingPattern();
            setupTypeInfo(test, maskPattern);
            if (_typeNumber >= 7) {
              setupTypeNumber(test);
            }
            if (_dataCache == null) {
              _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
            }
            mapData(_dataCache, maskPattern);
          };
          var setupPositionProbePattern = function(row, col) {
            for (var r = -1; r <= 7; r += 1) {
              if (row + r <= -1 || _moduleCount <= row + r) continue;
              for (var c = -1; c <= 7; c += 1) {
                if (col + c <= -1 || _moduleCount <= col + c) continue;
                if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
                  _modules[row + r][col + c] = true;
                } else {
                  _modules[row + r][col + c] = false;
                }
              }
            }
          };
          var getBestMaskPattern = function() {
            var minLostPoint = 0;
            var pattern = 0;
            for (var i = 0; i < 8; i += 1) {
              makeImpl(true, i);
              var lostPoint = QRUtil.getLostPoint(_this);
              if (i == 0 || minLostPoint > lostPoint) {
                minLostPoint = lostPoint;
                pattern = i;
              }
            }
            return pattern;
          };
          var setupTimingPattern = function() {
            for (var r = 8; r < _moduleCount - 8; r += 1) {
              if (_modules[r][6] != null) {
                continue;
              }
              _modules[r][6] = r % 2 == 0;
            }
            for (var c = 8; c < _moduleCount - 8; c += 1) {
              if (_modules[6][c] != null) {
                continue;
              }
              _modules[6][c] = c % 2 == 0;
            }
          };
          var setupPositionAdjustPattern = function() {
            var pos = QRUtil.getPatternPosition(_typeNumber);
            for (var i = 0; i < pos.length; i += 1) {
              for (var j = 0; j < pos.length; j += 1) {
                var row = pos[i];
                var col = pos[j];
                if (_modules[row][col] != null) {
                  continue;
                }
                for (var r = -2; r <= 2; r += 1) {
                  for (var c = -2; c <= 2; c += 1) {
                    if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
                      _modules[row + r][col + c] = true;
                    } else {
                      _modules[row + r][col + c] = false;
                    }
                  }
                }
              }
            }
          };
          var setupTypeNumber = function(test) {
            var bits = QRUtil.getBCHTypeNumber(_typeNumber);
            for (var i = 0; i < 18; i += 1) {
              var mod = !test && (bits >> i & 1) == 1;
              _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
            }
            for (var i = 0; i < 18; i += 1) {
              var mod = !test && (bits >> i & 1) == 1;
              _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
            }
          };
          var setupTypeInfo = function(test, maskPattern) {
            var data = _errorCorrectionLevel << 3 | maskPattern;
            var bits = QRUtil.getBCHTypeInfo(data);
            for (var i = 0; i < 15; i += 1) {
              var mod = !test && (bits >> i & 1) == 1;
              if (i < 6) {
                _modules[i][8] = mod;
              } else if (i < 8) {
                _modules[i + 1][8] = mod;
              } else {
                _modules[_moduleCount - 15 + i][8] = mod;
              }
            }
            for (var i = 0; i < 15; i += 1) {
              var mod = !test && (bits >> i & 1) == 1;
              if (i < 8) {
                _modules[8][_moduleCount - i - 1] = mod;
              } else if (i < 9) {
                _modules[8][15 - i - 1 + 1] = mod;
              } else {
                _modules[8][15 - i - 1] = mod;
              }
            }
            _modules[_moduleCount - 8][8] = !test;
          };
          var mapData = function(data, maskPattern) {
            var inc = -1;
            var row = _moduleCount - 1;
            var bitIndex = 7;
            var byteIndex = 0;
            var maskFunc = QRUtil.getMaskFunction(maskPattern);
            for (var col = _moduleCount - 1; col > 0; col -= 2) {
              if (col == 6) col -= 1;
              while (true) {
                for (var c = 0; c < 2; c += 1) {
                  if (_modules[row][col - c] == null) {
                    var dark = false;
                    if (byteIndex < data.length) {
                      dark = (data[byteIndex] >>> bitIndex & 1) == 1;
                    }
                    var mask = maskFunc(row, col - c);
                    if (mask) {
                      dark = !dark;
                    }
                    _modules[row][col - c] = dark;
                    bitIndex -= 1;
                    if (bitIndex == -1) {
                      byteIndex += 1;
                      bitIndex = 7;
                    }
                  }
                }
                row += inc;
                if (row < 0 || _moduleCount <= row) {
                  row -= inc;
                  inc = -inc;
                  break;
                }
              }
            }
          };
          var createBytes = function(buffer, rsBlocks) {
            var offset = 0;
            var maxDcCount = 0;
            var maxEcCount = 0;
            var dcdata = new Array(rsBlocks.length);
            var ecdata = new Array(rsBlocks.length);
            for (var r = 0; r < rsBlocks.length; r += 1) {
              var dcCount = rsBlocks[r].dataCount;
              var ecCount = rsBlocks[r].totalCount - dcCount;
              maxDcCount = Math.max(maxDcCount, dcCount);
              maxEcCount = Math.max(maxEcCount, ecCount);
              dcdata[r] = new Array(dcCount);
              for (var i = 0; i < dcdata[r].length; i += 1) {
                dcdata[r][i] = 255 & buffer.getBuffer()[i + offset];
              }
              offset += dcCount;
              var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
              var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
              var modPoly = rawPoly.mod(rsPoly);
              ecdata[r] = new Array(rsPoly.getLength() - 1);
              for (var i = 0; i < ecdata[r].length; i += 1) {
                var modIndex = i + modPoly.getLength() - ecdata[r].length;
                ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
              }
            }
            var totalCodeCount = 0;
            for (var i = 0; i < rsBlocks.length; i += 1) {
              totalCodeCount += rsBlocks[i].totalCount;
            }
            var data = new Array(totalCodeCount);
            var index = 0;
            for (var i = 0; i < maxDcCount; i += 1) {
              for (var r = 0; r < rsBlocks.length; r += 1) {
                if (i < dcdata[r].length) {
                  data[index] = dcdata[r][i];
                  index += 1;
                }
              }
            }
            for (var i = 0; i < maxEcCount; i += 1) {
              for (var r = 0; r < rsBlocks.length; r += 1) {
                if (i < ecdata[r].length) {
                  data[index] = ecdata[r][i];
                  index += 1;
                }
              }
            }
            return data;
          };
          var createData = function(typeNumber2, errorCorrectionLevel2, dataList) {
            var rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectionLevel2);
            var buffer = qrBitBuffer();
            for (var i = 0; i < dataList.length; i += 1) {
              var data = dataList[i];
              buffer.put(data.getMode(), 4);
              buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
              data.write(buffer);
            }
            var totalDataCount = 0;
            for (var i = 0; i < rsBlocks.length; i += 1) {
              totalDataCount += rsBlocks[i].dataCount;
            }
            if (buffer.getLengthInBits() > totalDataCount * 8) {
              throw "code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")";
            }
            if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
              buffer.put(0, 4);
            }
            while (buffer.getLengthInBits() % 8 != 0) {
              buffer.putBit(false);
            }
            while (true) {
              if (buffer.getLengthInBits() >= totalDataCount * 8) {
                break;
              }
              buffer.put(PAD0, 8);
              if (buffer.getLengthInBits() >= totalDataCount * 8) {
                break;
              }
              buffer.put(PAD1, 8);
            }
            return createBytes(buffer, rsBlocks);
          };
          _this.addData = function(data, mode) {
            mode = mode || "Byte";
            var newData = null;
            switch (mode) {
              case "Numeric":
                newData = qrNumber(data);
                break;
              case "Alphanumeric":
                newData = qrAlphaNum(data);
                break;
              case "Byte":
                newData = qr8BitByte(data);
                break;
              case "Kanji":
                newData = qrKanji(data);
                break;
              default:
                throw "mode:" + mode;
            }
            _dataList.push(newData);
            _dataCache = null;
          };
          _this.isDark = function(row, col) {
            if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
              throw row + "," + col;
            }
            return _modules[row][col];
          };
          _this.getModuleCount = function() {
            return _moduleCount;
          };
          _this.make = function() {
            if (_typeNumber < 1) {
              var typeNumber2 = 1;
              for (; typeNumber2 < 40; typeNumber2++) {
                var rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, _errorCorrectionLevel);
                var buffer = qrBitBuffer();
                for (var i = 0; i < _dataList.length; i++) {
                  var data = _dataList[i];
                  buffer.put(data.getMode(), 4);
                  buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
                  data.write(buffer);
                }
                var totalDataCount = 0;
                for (var i = 0; i < rsBlocks.length; i++) {
                  totalDataCount += rsBlocks[i].dataCount;
                }
                if (buffer.getLengthInBits() <= totalDataCount * 8) {
                  break;
                }
              }
              _typeNumber = typeNumber2;
            }
            makeImpl(false, getBestMaskPattern());
          };
          _this.createTableTag = function(cellSize, margin) {
            cellSize = cellSize || 2;
            margin = typeof margin == "undefined" ? cellSize * 4 : margin;
            var qrHtml = "";
            qrHtml += '<table style="';
            qrHtml += " border-width: 0px; border-style: none;";
            qrHtml += " border-collapse: collapse;";
            qrHtml += " padding: 0px; margin: " + margin + "px;";
            qrHtml += '">';
            qrHtml += "<tbody>";
            for (var r = 0; r < _this.getModuleCount(); r += 1) {
              qrHtml += "<tr>";
              for (var c = 0; c < _this.getModuleCount(); c += 1) {
                qrHtml += '<td style="';
                qrHtml += " border-width: 0px; border-style: none;";
                qrHtml += " border-collapse: collapse;";
                qrHtml += " padding: 0px; margin: 0px;";
                qrHtml += " width: " + cellSize + "px;";
                qrHtml += " height: " + cellSize + "px;";
                qrHtml += " background-color: ";
                qrHtml += _this.isDark(r, c) ? "#000000" : "#ffffff";
                qrHtml += ";";
                qrHtml += '"/>';
              }
              qrHtml += "</tr>";
            }
            qrHtml += "</tbody>";
            qrHtml += "</table>";
            return qrHtml;
          };
          _this.createSvgTag = function(cellSize, margin, alt, title) {
            var opts2 = {};
            if (typeof arguments[0] == "object") {
              opts2 = arguments[0];
              cellSize = opts2.cellSize;
              margin = opts2.margin;
              alt = opts2.alt;
              title = opts2.title;
            }
            cellSize = cellSize || 2;
            margin = typeof margin == "undefined" ? cellSize * 4 : margin;
            alt = typeof alt === "string" ? { text: alt } : alt || {};
            alt.text = alt.text || null;
            alt.id = alt.text ? alt.id || "qrcode-description" : null;
            title = typeof title === "string" ? { text: title } : title || {};
            title.text = title.text || null;
            title.id = title.text ? title.id || "qrcode-title" : null;
            var size = _this.getModuleCount() * cellSize + margin * 2;
            var c, mc, r, mr, qrSvg2 = "", rect;
            rect = "l" + cellSize + ",0 0," + cellSize + " -" + cellSize + ",0 0,-" + cellSize + "z ";
            qrSvg2 += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
            qrSvg2 += !opts2.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : "";
            qrSvg2 += ' viewBox="0 0 ' + size + " " + size + '" ';
            qrSvg2 += ' preserveAspectRatio="xMinYMin meet"';
            qrSvg2 += title.text || alt.text ? ' role="img" aria-labelledby="' + escapeXml([title.id, alt.id].join(" ").trim()) + '"' : "";
            qrSvg2 += ">";
            qrSvg2 += title.text ? '<title id="' + escapeXml(title.id) + '">' + escapeXml(title.text) + "</title>" : "";
            qrSvg2 += alt.text ? '<description id="' + escapeXml(alt.id) + '">' + escapeXml(alt.text) + "</description>" : "";
            qrSvg2 += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
            qrSvg2 += '<path d="';
            for (r = 0; r < _this.getModuleCount(); r += 1) {
              mr = r * cellSize + margin;
              for (c = 0; c < _this.getModuleCount(); c += 1) {
                if (_this.isDark(r, c)) {
                  mc = c * cellSize + margin;
                  qrSvg2 += "M" + mc + "," + mr + rect;
                }
              }
            }
            qrSvg2 += '" stroke="transparent" fill="black"/>';
            qrSvg2 += "</svg>";
            return qrSvg2;
          };
          _this.createDataURL = function(cellSize, margin) {
            cellSize = cellSize || 2;
            margin = typeof margin == "undefined" ? cellSize * 4 : margin;
            var size = _this.getModuleCount() * cellSize + margin * 2;
            var min = margin;
            var max = size - margin;
            return createDataURL(size, size, function(x, y) {
              if (min <= x && x < max && min <= y && y < max) {
                var c = Math.floor((x - min) / cellSize);
                var r = Math.floor((y - min) / cellSize);
                return _this.isDark(r, c) ? 0 : 1;
              } else {
                return 1;
              }
            });
          };
          _this.createImgTag = function(cellSize, margin, alt) {
            cellSize = cellSize || 2;
            margin = typeof margin == "undefined" ? cellSize * 4 : margin;
            var size = _this.getModuleCount() * cellSize + margin * 2;
            var img = "";
            img += "<img";
            img += ' src="';
            img += _this.createDataURL(cellSize, margin);
            img += '"';
            img += ' width="';
            img += size;
            img += '"';
            img += ' height="';
            img += size;
            img += '"';
            if (alt) {
              img += ' alt="';
              img += escapeXml(alt);
              img += '"';
            }
            img += "/>";
            return img;
          };
          var escapeXml = function(s) {
            var escaped = "";
            for (var i = 0; i < s.length; i += 1) {
              var c = s.charAt(i);
              switch (c) {
                case "<":
                  escaped += "&lt;";
                  break;
                case ">":
                  escaped += "&gt;";
                  break;
                case "&":
                  escaped += "&amp;";
                  break;
                case '"':
                  escaped += "&quot;";
                  break;
                default:
                  escaped += c;
                  break;
              }
            }
            return escaped;
          };
          var _createHalfASCII = function(margin) {
            var cellSize = 1;
            margin = typeof margin == "undefined" ? cellSize * 2 : margin;
            var size = _this.getModuleCount() * cellSize + margin * 2;
            var min = margin;
            var max = size - margin;
            var y, x, r1, r2, p;
            var blocks = {
              "\u2588\u2588": "\u2588",
              "\u2588 ": "\u2580",
              " \u2588": "\u2584",
              "  ": " "
            };
            var blocksLastLineNoMargin = {
              "\u2588\u2588": "\u2580",
              "\u2588 ": "\u2580",
              " \u2588": " ",
              "  ": " "
            };
            var ascii = "";
            for (y = 0; y < size; y += 2) {
              r1 = Math.floor((y - min) / cellSize);
              r2 = Math.floor((y + 1 - min) / cellSize);
              for (x = 0; x < size; x += 1) {
                p = "\u2588";
                if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
                  p = " ";
                }
                if (min <= x && x < max && min <= y + 1 && y + 1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
                  p += " ";
                } else {
                  p += "\u2588";
                }
                ascii += margin < 1 && y + 1 >= max ? blocksLastLineNoMargin[p] : blocks[p];
              }
              ascii += "\n";
            }
            if (size % 2 && margin > 0) {
              return ascii.substring(0, ascii.length - size - 1) + Array(size + 1).join("\u2580");
            }
            return ascii.substring(0, ascii.length - 1);
          };
          _this.createASCII = function(cellSize, margin) {
            cellSize = cellSize || 1;
            if (cellSize < 2) {
              return _createHalfASCII(margin);
            }
            cellSize -= 1;
            margin = typeof margin == "undefined" ? cellSize * 2 : margin;
            var size = _this.getModuleCount() * cellSize + margin * 2;
            var min = margin;
            var max = size - margin;
            var y, x, r, p;
            var white = Array(cellSize + 1).join("\u2588\u2588");
            var black = Array(cellSize + 1).join("  ");
            var ascii = "";
            var line = "";
            for (y = 0; y < size; y += 1) {
              r = Math.floor((y - min) / cellSize);
              line = "";
              for (x = 0; x < size; x += 1) {
                p = 1;
                if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
                  p = 0;
                }
                line += p ? white : black;
              }
              for (r = 0; r < cellSize; r += 1) {
                ascii += line + "\n";
              }
            }
            return ascii.substring(0, ascii.length - 1);
          };
          _this.renderTo2dContext = function(context, cellSize) {
            cellSize = cellSize || 2;
            var length = _this.getModuleCount();
            for (var row = 0; row < length; row++) {
              for (var col = 0; col < length; col++) {
                context.fillStyle = _this.isDark(row, col) ? "black" : "white";
                context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
              }
            }
          };
          return _this;
        };
        qrcode3.stringToBytesFuncs = {
          "default": function(s) {
            var bytes = [];
            for (var i = 0; i < s.length; i += 1) {
              var c = s.charCodeAt(i);
              bytes.push(c & 255);
            }
            return bytes;
          }
        };
        qrcode3.stringToBytes = qrcode3.stringToBytesFuncs["default"];
        qrcode3.createStringToBytes = function(unicodeData, numChars) {
          var unicodeMap = (function() {
            var bin = base64DecodeInputStream(unicodeData);
            var read = function() {
              var b = bin.read();
              if (b == -1) throw "eof";
              return b;
            };
            var count = 0;
            var unicodeMap2 = {};
            while (true) {
              var b0 = bin.read();
              if (b0 == -1) break;
              var b1 = read();
              var b2 = read();
              var b3 = read();
              var k = String.fromCharCode(b0 << 8 | b1);
              var v = b2 << 8 | b3;
              unicodeMap2[k] = v;
              count += 1;
            }
            if (count != numChars) {
              throw count + " != " + numChars;
            }
            return unicodeMap2;
          })();
          var unknownChar = "?".charCodeAt(0);
          return function(s) {
            var bytes = [];
            for (var i = 0; i < s.length; i += 1) {
              var c = s.charCodeAt(i);
              if (c < 128) {
                bytes.push(c);
              } else {
                var b = unicodeMap[s.charAt(i)];
                if (typeof b == "number") {
                  if ((b & 255) == b) {
                    bytes.push(b);
                  } else {
                    bytes.push(b >>> 8);
                    bytes.push(b & 255);
                  }
                } else {
                  bytes.push(unknownChar);
                }
              }
            }
            return bytes;
          };
        };
        var QRMode = {
          MODE_NUMBER: 1 << 0,
          MODE_ALPHA_NUM: 1 << 1,
          MODE_8BIT_BYTE: 1 << 2,
          MODE_KANJI: 1 << 3
        };
        var QRErrorCorrectionLevel = {
          L: 1,
          M: 0,
          Q: 3,
          H: 2
        };
        var QRMaskPattern = {
          PATTERN000: 0,
          PATTERN001: 1,
          PATTERN010: 2,
          PATTERN011: 3,
          PATTERN100: 4,
          PATTERN101: 5,
          PATTERN110: 6,
          PATTERN111: 7
        };
        var QRUtil = (function() {
          var PATTERN_POSITION_TABLE = [
            [],
            [6, 18],
            [6, 22],
            [6, 26],
            [6, 30],
            [6, 34],
            [6, 22, 38],
            [6, 24, 42],
            [6, 26, 46],
            [6, 28, 50],
            [6, 30, 54],
            [6, 32, 58],
            [6, 34, 62],
            [6, 26, 46, 66],
            [6, 26, 48, 70],
            [6, 26, 50, 74],
            [6, 30, 54, 78],
            [6, 30, 56, 82],
            [6, 30, 58, 86],
            [6, 34, 62, 90],
            [6, 28, 50, 72, 94],
            [6, 26, 50, 74, 98],
            [6, 30, 54, 78, 102],
            [6, 28, 54, 80, 106],
            [6, 32, 58, 84, 110],
            [6, 30, 58, 86, 114],
            [6, 34, 62, 90, 118],
            [6, 26, 50, 74, 98, 122],
            [6, 30, 54, 78, 102, 126],
            [6, 26, 52, 78, 104, 130],
            [6, 30, 56, 82, 108, 134],
            [6, 34, 60, 86, 112, 138],
            [6, 30, 58, 86, 114, 142],
            [6, 34, 62, 90, 118, 146],
            [6, 30, 54, 78, 102, 126, 150],
            [6, 24, 50, 76, 102, 128, 154],
            [6, 28, 54, 80, 106, 132, 158],
            [6, 32, 58, 84, 110, 136, 162],
            [6, 26, 54, 82, 110, 138, 166],
            [6, 30, 58, 86, 114, 142, 170]
          ];
          var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
          var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
          var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
          var _this = {};
          var getBCHDigit = function(data) {
            var digit = 0;
            while (data != 0) {
              digit += 1;
              data >>>= 1;
            }
            return digit;
          };
          _this.getBCHTypeInfo = function(data) {
            var d = data << 10;
            while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
              d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
            }
            return (data << 10 | d) ^ G15_MASK;
          };
          _this.getBCHTypeNumber = function(data) {
            var d = data << 12;
            while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
              d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
            }
            return data << 12 | d;
          };
          _this.getPatternPosition = function(typeNumber) {
            return PATTERN_POSITION_TABLE[typeNumber - 1];
          };
          _this.getMaskFunction = function(maskPattern) {
            switch (maskPattern) {
              case QRMaskPattern.PATTERN000:
                return function(i, j) {
                  return (i + j) % 2 == 0;
                };
              case QRMaskPattern.PATTERN001:
                return function(i, j) {
                  return i % 2 == 0;
                };
              case QRMaskPattern.PATTERN010:
                return function(i, j) {
                  return j % 3 == 0;
                };
              case QRMaskPattern.PATTERN011:
                return function(i, j) {
                  return (i + j) % 3 == 0;
                };
              case QRMaskPattern.PATTERN100:
                return function(i, j) {
                  return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
                };
              case QRMaskPattern.PATTERN101:
                return function(i, j) {
                  return i * j % 2 + i * j % 3 == 0;
                };
              case QRMaskPattern.PATTERN110:
                return function(i, j) {
                  return (i * j % 2 + i * j % 3) % 2 == 0;
                };
              case QRMaskPattern.PATTERN111:
                return function(i, j) {
                  return (i * j % 3 + (i + j) % 2) % 2 == 0;
                };
              default:
                throw "bad maskPattern:" + maskPattern;
            }
          };
          _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
            var a = qrPolynomial([1], 0);
            for (var i = 0; i < errorCorrectLength; i += 1) {
              a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
            }
            return a;
          };
          _this.getLengthInBits = function(mode, type) {
            if (1 <= type && type < 10) {
              switch (mode) {
                case QRMode.MODE_NUMBER:
                  return 10;
                case QRMode.MODE_ALPHA_NUM:
                  return 9;
                case QRMode.MODE_8BIT_BYTE:
                  return 8;
                case QRMode.MODE_KANJI:
                  return 8;
                default:
                  throw "mode:" + mode;
              }
            } else if (type < 27) {
              switch (mode) {
                case QRMode.MODE_NUMBER:
                  return 12;
                case QRMode.MODE_ALPHA_NUM:
                  return 11;
                case QRMode.MODE_8BIT_BYTE:
                  return 16;
                case QRMode.MODE_KANJI:
                  return 10;
                default:
                  throw "mode:" + mode;
              }
            } else if (type < 41) {
              switch (mode) {
                case QRMode.MODE_NUMBER:
                  return 14;
                case QRMode.MODE_ALPHA_NUM:
                  return 13;
                case QRMode.MODE_8BIT_BYTE:
                  return 16;
                case QRMode.MODE_KANJI:
                  return 12;
                default:
                  throw "mode:" + mode;
              }
            } else {
              throw "type:" + type;
            }
          };
          _this.getLostPoint = function(qrcode4) {
            var moduleCount = qrcode4.getModuleCount();
            var lostPoint = 0;
            for (var row = 0; row < moduleCount; row += 1) {
              for (var col = 0; col < moduleCount; col += 1) {
                var sameCount = 0;
                var dark = qrcode4.isDark(row, col);
                for (var r = -1; r <= 1; r += 1) {
                  if (row + r < 0 || moduleCount <= row + r) {
                    continue;
                  }
                  for (var c = -1; c <= 1; c += 1) {
                    if (col + c < 0 || moduleCount <= col + c) {
                      continue;
                    }
                    if (r == 0 && c == 0) {
                      continue;
                    }
                    if (dark == qrcode4.isDark(row + r, col + c)) {
                      sameCount += 1;
                    }
                  }
                }
                if (sameCount > 5) {
                  lostPoint += 3 + sameCount - 5;
                }
              }
            }
            ;
            for (var row = 0; row < moduleCount - 1; row += 1) {
              for (var col = 0; col < moduleCount - 1; col += 1) {
                var count = 0;
                if (qrcode4.isDark(row, col)) count += 1;
                if (qrcode4.isDark(row + 1, col)) count += 1;
                if (qrcode4.isDark(row, col + 1)) count += 1;
                if (qrcode4.isDark(row + 1, col + 1)) count += 1;
                if (count == 0 || count == 4) {
                  lostPoint += 3;
                }
              }
            }
            for (var row = 0; row < moduleCount; row += 1) {
              for (var col = 0; col < moduleCount - 6; col += 1) {
                if (qrcode4.isDark(row, col) && !qrcode4.isDark(row, col + 1) && qrcode4.isDark(row, col + 2) && qrcode4.isDark(row, col + 3) && qrcode4.isDark(row, col + 4) && !qrcode4.isDark(row, col + 5) && qrcode4.isDark(row, col + 6)) {
                  lostPoint += 40;
                }
              }
            }
            for (var col = 0; col < moduleCount; col += 1) {
              for (var row = 0; row < moduleCount - 6; row += 1) {
                if (qrcode4.isDark(row, col) && !qrcode4.isDark(row + 1, col) && qrcode4.isDark(row + 2, col) && qrcode4.isDark(row + 3, col) && qrcode4.isDark(row + 4, col) && !qrcode4.isDark(row + 5, col) && qrcode4.isDark(row + 6, col)) {
                  lostPoint += 40;
                }
              }
            }
            var darkCount = 0;
            for (var col = 0; col < moduleCount; col += 1) {
              for (var row = 0; row < moduleCount; row += 1) {
                if (qrcode4.isDark(row, col)) {
                  darkCount += 1;
                }
              }
            }
            var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
            lostPoint += ratio * 10;
            return lostPoint;
          };
          return _this;
        })();
        var QRMath = (function() {
          var EXP_TABLE = new Array(256);
          var LOG_TABLE = new Array(256);
          for (var i = 0; i < 8; i += 1) {
            EXP_TABLE[i] = 1 << i;
          }
          for (var i = 8; i < 256; i += 1) {
            EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
          }
          for (var i = 0; i < 255; i += 1) {
            LOG_TABLE[EXP_TABLE[i]] = i;
          }
          var _this = {};
          _this.glog = function(n) {
            if (n < 1) {
              throw "glog(" + n + ")";
            }
            return LOG_TABLE[n];
          };
          _this.gexp = function(n) {
            while (n < 0) {
              n += 255;
            }
            while (n >= 256) {
              n -= 255;
            }
            return EXP_TABLE[n];
          };
          return _this;
        })();
        function qrPolynomial(num, shift) {
          if (typeof num.length == "undefined") {
            throw num.length + "/" + shift;
          }
          var _num = (function() {
            var offset = 0;
            while (offset < num.length && num[offset] == 0) {
              offset += 1;
            }
            var _num2 = new Array(num.length - offset + shift);
            for (var i = 0; i < num.length - offset; i += 1) {
              _num2[i] = num[i + offset];
            }
            return _num2;
          })();
          var _this = {};
          _this.getAt = function(index) {
            return _num[index];
          };
          _this.getLength = function() {
            return _num.length;
          };
          _this.multiply = function(e) {
            var num2 = new Array(_this.getLength() + e.getLength() - 1);
            for (var i = 0; i < _this.getLength(); i += 1) {
              for (var j = 0; j < e.getLength(); j += 1) {
                num2[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
              }
            }
            return qrPolynomial(num2, 0);
          };
          _this.mod = function(e) {
            if (_this.getLength() - e.getLength() < 0) {
              return _this;
            }
            var ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));
            var num2 = new Array(_this.getLength());
            for (var i = 0; i < _this.getLength(); i += 1) {
              num2[i] = _this.getAt(i);
            }
            for (var i = 0; i < e.getLength(); i += 1) {
              num2[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
            }
            return qrPolynomial(num2, 0).mod(e);
          };
          return _this;
        }
        ;
        var QRRSBlock = (function() {
          var RS_BLOCK_TABLE = [
            // L
            // M
            // Q
            // H
            // 1
            [1, 26, 19],
            [1, 26, 16],
            [1, 26, 13],
            [1, 26, 9],
            // 2
            [1, 44, 34],
            [1, 44, 28],
            [1, 44, 22],
            [1, 44, 16],
            // 3
            [1, 70, 55],
            [1, 70, 44],
            [2, 35, 17],
            [2, 35, 13],
            // 4
            [1, 100, 80],
            [2, 50, 32],
            [2, 50, 24],
            [4, 25, 9],
            // 5
            [1, 134, 108],
            [2, 67, 43],
            [2, 33, 15, 2, 34, 16],
            [2, 33, 11, 2, 34, 12],
            // 6
            [2, 86, 68],
            [4, 43, 27],
            [4, 43, 19],
            [4, 43, 15],
            // 7
            [2, 98, 78],
            [4, 49, 31],
            [2, 32, 14, 4, 33, 15],
            [4, 39, 13, 1, 40, 14],
            // 8
            [2, 121, 97],
            [2, 60, 38, 2, 61, 39],
            [4, 40, 18, 2, 41, 19],
            [4, 40, 14, 2, 41, 15],
            // 9
            [2, 146, 116],
            [3, 58, 36, 2, 59, 37],
            [4, 36, 16, 4, 37, 17],
            [4, 36, 12, 4, 37, 13],
            // 10
            [2, 86, 68, 2, 87, 69],
            [4, 69, 43, 1, 70, 44],
            [6, 43, 19, 2, 44, 20],
            [6, 43, 15, 2, 44, 16],
            // 11
            [4, 101, 81],
            [1, 80, 50, 4, 81, 51],
            [4, 50, 22, 4, 51, 23],
            [3, 36, 12, 8, 37, 13],
            // 12
            [2, 116, 92, 2, 117, 93],
            [6, 58, 36, 2, 59, 37],
            [4, 46, 20, 6, 47, 21],
            [7, 42, 14, 4, 43, 15],
            // 13
            [4, 133, 107],
            [8, 59, 37, 1, 60, 38],
            [8, 44, 20, 4, 45, 21],
            [12, 33, 11, 4, 34, 12],
            // 14
            [3, 145, 115, 1, 146, 116],
            [4, 64, 40, 5, 65, 41],
            [11, 36, 16, 5, 37, 17],
            [11, 36, 12, 5, 37, 13],
            // 15
            [5, 109, 87, 1, 110, 88],
            [5, 65, 41, 5, 66, 42],
            [5, 54, 24, 7, 55, 25],
            [11, 36, 12, 7, 37, 13],
            // 16
            [5, 122, 98, 1, 123, 99],
            [7, 73, 45, 3, 74, 46],
            [15, 43, 19, 2, 44, 20],
            [3, 45, 15, 13, 46, 16],
            // 17
            [1, 135, 107, 5, 136, 108],
            [10, 74, 46, 1, 75, 47],
            [1, 50, 22, 15, 51, 23],
            [2, 42, 14, 17, 43, 15],
            // 18
            [5, 150, 120, 1, 151, 121],
            [9, 69, 43, 4, 70, 44],
            [17, 50, 22, 1, 51, 23],
            [2, 42, 14, 19, 43, 15],
            // 19
            [3, 141, 113, 4, 142, 114],
            [3, 70, 44, 11, 71, 45],
            [17, 47, 21, 4, 48, 22],
            [9, 39, 13, 16, 40, 14],
            // 20
            [3, 135, 107, 5, 136, 108],
            [3, 67, 41, 13, 68, 42],
            [15, 54, 24, 5, 55, 25],
            [15, 43, 15, 10, 44, 16],
            // 21
            [4, 144, 116, 4, 145, 117],
            [17, 68, 42],
            [17, 50, 22, 6, 51, 23],
            [19, 46, 16, 6, 47, 17],
            // 22
            [2, 139, 111, 7, 140, 112],
            [17, 74, 46],
            [7, 54, 24, 16, 55, 25],
            [34, 37, 13],
            // 23
            [4, 151, 121, 5, 152, 122],
            [4, 75, 47, 14, 76, 48],
            [11, 54, 24, 14, 55, 25],
            [16, 45, 15, 14, 46, 16],
            // 24
            [6, 147, 117, 4, 148, 118],
            [6, 73, 45, 14, 74, 46],
            [11, 54, 24, 16, 55, 25],
            [30, 46, 16, 2, 47, 17],
            // 25
            [8, 132, 106, 4, 133, 107],
            [8, 75, 47, 13, 76, 48],
            [7, 54, 24, 22, 55, 25],
            [22, 45, 15, 13, 46, 16],
            // 26
            [10, 142, 114, 2, 143, 115],
            [19, 74, 46, 4, 75, 47],
            [28, 50, 22, 6, 51, 23],
            [33, 46, 16, 4, 47, 17],
            // 27
            [8, 152, 122, 4, 153, 123],
            [22, 73, 45, 3, 74, 46],
            [8, 53, 23, 26, 54, 24],
            [12, 45, 15, 28, 46, 16],
            // 28
            [3, 147, 117, 10, 148, 118],
            [3, 73, 45, 23, 74, 46],
            [4, 54, 24, 31, 55, 25],
            [11, 45, 15, 31, 46, 16],
            // 29
            [7, 146, 116, 7, 147, 117],
            [21, 73, 45, 7, 74, 46],
            [1, 53, 23, 37, 54, 24],
            [19, 45, 15, 26, 46, 16],
            // 30
            [5, 145, 115, 10, 146, 116],
            [19, 75, 47, 10, 76, 48],
            [15, 54, 24, 25, 55, 25],
            [23, 45, 15, 25, 46, 16],
            // 31
            [13, 145, 115, 3, 146, 116],
            [2, 74, 46, 29, 75, 47],
            [42, 54, 24, 1, 55, 25],
            [23, 45, 15, 28, 46, 16],
            // 32
            [17, 145, 115],
            [10, 74, 46, 23, 75, 47],
            [10, 54, 24, 35, 55, 25],
            [19, 45, 15, 35, 46, 16],
            // 33
            [17, 145, 115, 1, 146, 116],
            [14, 74, 46, 21, 75, 47],
            [29, 54, 24, 19, 55, 25],
            [11, 45, 15, 46, 46, 16],
            // 34
            [13, 145, 115, 6, 146, 116],
            [14, 74, 46, 23, 75, 47],
            [44, 54, 24, 7, 55, 25],
            [59, 46, 16, 1, 47, 17],
            // 35
            [12, 151, 121, 7, 152, 122],
            [12, 75, 47, 26, 76, 48],
            [39, 54, 24, 14, 55, 25],
            [22, 45, 15, 41, 46, 16],
            // 36
            [6, 151, 121, 14, 152, 122],
            [6, 75, 47, 34, 76, 48],
            [46, 54, 24, 10, 55, 25],
            [2, 45, 15, 64, 46, 16],
            // 37
            [17, 152, 122, 4, 153, 123],
            [29, 74, 46, 14, 75, 47],
            [49, 54, 24, 10, 55, 25],
            [24, 45, 15, 46, 46, 16],
            // 38
            [4, 152, 122, 18, 153, 123],
            [13, 74, 46, 32, 75, 47],
            [48, 54, 24, 14, 55, 25],
            [42, 45, 15, 32, 46, 16],
            // 39
            [20, 147, 117, 4, 148, 118],
            [40, 75, 47, 7, 76, 48],
            [43, 54, 24, 22, 55, 25],
            [10, 45, 15, 67, 46, 16],
            // 40
            [19, 148, 118, 6, 149, 119],
            [18, 75, 47, 31, 76, 48],
            [34, 54, 24, 34, 55, 25],
            [20, 45, 15, 61, 46, 16]
          ];
          var qrRSBlock = function(totalCount, dataCount) {
            var _this2 = {};
            _this2.totalCount = totalCount;
            _this2.dataCount = dataCount;
            return _this2;
          };
          var _this = {};
          var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
            switch (errorCorrectionLevel) {
              case QRErrorCorrectionLevel.L:
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
              case QRErrorCorrectionLevel.M:
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
              case QRErrorCorrectionLevel.Q:
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
              case QRErrorCorrectionLevel.H:
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
              default:
                return void 0;
            }
          };
          _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
            var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
            if (typeof rsBlock == "undefined") {
              throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
            }
            var length = rsBlock.length / 3;
            var list = [];
            for (var i = 0; i < length; i += 1) {
              var count = rsBlock[i * 3 + 0];
              var totalCount = rsBlock[i * 3 + 1];
              var dataCount = rsBlock[i * 3 + 2];
              for (var j = 0; j < count; j += 1) {
                list.push(qrRSBlock(totalCount, dataCount));
              }
            }
            return list;
          };
          return _this;
        })();
        var qrBitBuffer = function() {
          var _buffer = [];
          var _length = 0;
          var _this = {};
          _this.getBuffer = function() {
            return _buffer;
          };
          _this.getAt = function(index) {
            var bufIndex = Math.floor(index / 8);
            return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
          };
          _this.put = function(num, length) {
            for (var i = 0; i < length; i += 1) {
              _this.putBit((num >>> length - i - 1 & 1) == 1);
            }
          };
          _this.getLengthInBits = function() {
            return _length;
          };
          _this.putBit = function(bit) {
            var bufIndex = Math.floor(_length / 8);
            if (_buffer.length <= bufIndex) {
              _buffer.push(0);
            }
            if (bit) {
              _buffer[bufIndex] |= 128 >>> _length % 8;
            }
            _length += 1;
          };
          return _this;
        };
        var qrNumber = function(data) {
          var _mode = QRMode.MODE_NUMBER;
          var _data = data;
          var _this = {};
          _this.getMode = function() {
            return _mode;
          };
          _this.getLength = function(buffer) {
            return _data.length;
          };
          _this.write = function(buffer) {
            var data2 = _data;
            var i = 0;
            while (i + 2 < data2.length) {
              buffer.put(strToNum(data2.substring(i, i + 3)), 10);
              i += 3;
            }
            if (i < data2.length) {
              if (data2.length - i == 1) {
                buffer.put(strToNum(data2.substring(i, i + 1)), 4);
              } else if (data2.length - i == 2) {
                buffer.put(strToNum(data2.substring(i, i + 2)), 7);
              }
            }
          };
          var strToNum = function(s) {
            var num = 0;
            for (var i = 0; i < s.length; i += 1) {
              num = num * 10 + chatToNum(s.charAt(i));
            }
            return num;
          };
          var chatToNum = function(c) {
            if ("0" <= c && c <= "9") {
              return c.charCodeAt(0) - "0".charCodeAt(0);
            }
            throw "illegal char :" + c;
          };
          return _this;
        };
        var qrAlphaNum = function(data) {
          var _mode = QRMode.MODE_ALPHA_NUM;
          var _data = data;
          var _this = {};
          _this.getMode = function() {
            return _mode;
          };
          _this.getLength = function(buffer) {
            return _data.length;
          };
          _this.write = function(buffer) {
            var s = _data;
            var i = 0;
            while (i + 1 < s.length) {
              buffer.put(
                getCode(s.charAt(i)) * 45 + getCode(s.charAt(i + 1)),
                11
              );
              i += 2;
            }
            if (i < s.length) {
              buffer.put(getCode(s.charAt(i)), 6);
            }
          };
          var getCode = function(c) {
            if ("0" <= c && c <= "9") {
              return c.charCodeAt(0) - "0".charCodeAt(0);
            } else if ("A" <= c && c <= "Z") {
              return c.charCodeAt(0) - "A".charCodeAt(0) + 10;
            } else {
              switch (c) {
                case " ":
                  return 36;
                case "$":
                  return 37;
                case "%":
                  return 38;
                case "*":
                  return 39;
                case "+":
                  return 40;
                case "-":
                  return 41;
                case ".":
                  return 42;
                case "/":
                  return 43;
                case ":":
                  return 44;
                default:
                  throw "illegal char :" + c;
              }
            }
          };
          return _this;
        };
        var qr8BitByte = function(data) {
          var _mode = QRMode.MODE_8BIT_BYTE;
          var _data = data;
          var _bytes = qrcode3.stringToBytes(data);
          var _this = {};
          _this.getMode = function() {
            return _mode;
          };
          _this.getLength = function(buffer) {
            return _bytes.length;
          };
          _this.write = function(buffer) {
            for (var i = 0; i < _bytes.length; i += 1) {
              buffer.put(_bytes[i], 8);
            }
          };
          return _this;
        };
        var qrKanji = function(data) {
          var _mode = QRMode.MODE_KANJI;
          var _data = data;
          var stringToBytes = qrcode3.stringToBytesFuncs["SJIS"];
          if (!stringToBytes) {
            throw "sjis not supported.";
          }
          !(function(c, code) {
            var test = stringToBytes(c);
            if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
              throw "sjis not supported.";
            }
          })("\u53CB", 38726);
          var _bytes = stringToBytes(data);
          var _this = {};
          _this.getMode = function() {
            return _mode;
          };
          _this.getLength = function(buffer) {
            return ~~(_bytes.length / 2);
          };
          _this.write = function(buffer) {
            var data2 = _bytes;
            var i = 0;
            while (i + 1 < data2.length) {
              var c = (255 & data2[i]) << 8 | 255 & data2[i + 1];
              if (33088 <= c && c <= 40956) {
                c -= 33088;
              } else if (57408 <= c && c <= 60351) {
                c -= 49472;
              } else {
                throw "illegal char at " + (i + 1) + "/" + c;
              }
              c = (c >>> 8 & 255) * 192 + (c & 255);
              buffer.put(c, 13);
              i += 2;
            }
            if (i < data2.length) {
              throw "illegal char at " + (i + 1);
            }
          };
          return _this;
        };
        var byteArrayOutputStream = function() {
          var _bytes = [];
          var _this = {};
          _this.writeByte = function(b) {
            _bytes.push(b & 255);
          };
          _this.writeShort = function(i) {
            _this.writeByte(i);
            _this.writeByte(i >>> 8);
          };
          _this.writeBytes = function(b, off, len) {
            off = off || 0;
            len = len || b.length;
            for (var i = 0; i < len; i += 1) {
              _this.writeByte(b[i + off]);
            }
          };
          _this.writeString = function(s) {
            for (var i = 0; i < s.length; i += 1) {
              _this.writeByte(s.charCodeAt(i));
            }
          };
          _this.toByteArray = function() {
            return _bytes;
          };
          _this.toString = function() {
            var s = "";
            s += "[";
            for (var i = 0; i < _bytes.length; i += 1) {
              if (i > 0) {
                s += ",";
              }
              s += _bytes[i];
            }
            s += "]";
            return s;
          };
          return _this;
        };
        var base64EncodeOutputStream = function() {
          var _buffer = 0;
          var _buflen = 0;
          var _length = 0;
          var _base64 = "";
          var _this = {};
          var writeEncoded = function(b) {
            _base64 += String.fromCharCode(encode(b & 63));
          };
          var encode = function(n) {
            if (n < 0) {
            } else if (n < 26) {
              return 65 + n;
            } else if (n < 52) {
              return 97 + (n - 26);
            } else if (n < 62) {
              return 48 + (n - 52);
            } else if (n == 62) {
              return 43;
            } else if (n == 63) {
              return 47;
            }
            throw "n:" + n;
          };
          _this.writeByte = function(n) {
            _buffer = _buffer << 8 | n & 255;
            _buflen += 8;
            _length += 1;
            while (_buflen >= 6) {
              writeEncoded(_buffer >>> _buflen - 6);
              _buflen -= 6;
            }
          };
          _this.flush = function() {
            if (_buflen > 0) {
              writeEncoded(_buffer << 6 - _buflen);
              _buffer = 0;
              _buflen = 0;
            }
            if (_length % 3 != 0) {
              var padlen = 3 - _length % 3;
              for (var i = 0; i < padlen; i += 1) {
                _base64 += "=";
              }
            }
          };
          _this.toString = function() {
            return _base64;
          };
          return _this;
        };
        var base64DecodeInputStream = function(str) {
          var _str = str;
          var _pos = 0;
          var _buffer = 0;
          var _buflen = 0;
          var _this = {};
          _this.read = function() {
            while (_buflen < 8) {
              if (_pos >= _str.length) {
                if (_buflen == 0) {
                  return -1;
                }
                throw "unexpected end of file./" + _buflen;
              }
              var c = _str.charAt(_pos);
              _pos += 1;
              if (c == "=") {
                _buflen = 0;
                return -1;
              } else if (c.match(/^\s$/)) {
                continue;
              }
              _buffer = _buffer << 6 | decode(c.charCodeAt(0));
              _buflen += 6;
            }
            var n = _buffer >>> _buflen - 8 & 255;
            _buflen -= 8;
            return n;
          };
          var decode = function(c) {
            if (65 <= c && c <= 90) {
              return c - 65;
            } else if (97 <= c && c <= 122) {
              return c - 97 + 26;
            } else if (48 <= c && c <= 57) {
              return c - 48 + 52;
            } else if (c == 43) {
              return 62;
            } else if (c == 47) {
              return 63;
            } else {
              throw "c:" + c;
            }
          };
          return _this;
        };
        var gifImage = function(width, height) {
          var _width = width;
          var _height = height;
          var _data = new Array(width * height);
          var _this = {};
          _this.setPixel = function(x, y, pixel) {
            _data[y * _width + x] = pixel;
          };
          _this.write = function(out) {
            out.writeString("GIF87a");
            out.writeShort(_width);
            out.writeShort(_height);
            out.writeByte(128);
            out.writeByte(0);
            out.writeByte(0);
            out.writeByte(0);
            out.writeByte(0);
            out.writeByte(0);
            out.writeByte(255);
            out.writeByte(255);
            out.writeByte(255);
            out.writeString(",");
            out.writeShort(0);
            out.writeShort(0);
            out.writeShort(_width);
            out.writeShort(_height);
            out.writeByte(0);
            var lzwMinCodeSize = 2;
            var raster = getLZWRaster(lzwMinCodeSize);
            out.writeByte(lzwMinCodeSize);
            var offset = 0;
            while (raster.length - offset > 255) {
              out.writeByte(255);
              out.writeBytes(raster, offset, 255);
              offset += 255;
            }
            out.writeByte(raster.length - offset);
            out.writeBytes(raster, offset, raster.length - offset);
            out.writeByte(0);
            out.writeString(";");
          };
          var bitOutputStream = function(out) {
            var _out = out;
            var _bitLength = 0;
            var _bitBuffer = 0;
            var _this2 = {};
            _this2.write = function(data, length) {
              if (data >>> length != 0) {
                throw "length over";
              }
              while (_bitLength + length >= 8) {
                _out.writeByte(255 & (data << _bitLength | _bitBuffer));
                length -= 8 - _bitLength;
                data >>>= 8 - _bitLength;
                _bitBuffer = 0;
                _bitLength = 0;
              }
              _bitBuffer = data << _bitLength | _bitBuffer;
              _bitLength = _bitLength + length;
            };
            _this2.flush = function() {
              if (_bitLength > 0) {
                _out.writeByte(_bitBuffer);
              }
            };
            return _this2;
          };
          var getLZWRaster = function(lzwMinCodeSize) {
            var clearCode = 1 << lzwMinCodeSize;
            var endCode = (1 << lzwMinCodeSize) + 1;
            var bitLength = lzwMinCodeSize + 1;
            var table = lzwTable();
            for (var i = 0; i < clearCode; i += 1) {
              table.add(String.fromCharCode(i));
            }
            table.add(String.fromCharCode(clearCode));
            table.add(String.fromCharCode(endCode));
            var byteOut = byteArrayOutputStream();
            var bitOut = bitOutputStream(byteOut);
            bitOut.write(clearCode, bitLength);
            var dataIndex = 0;
            var s = String.fromCharCode(_data[dataIndex]);
            dataIndex += 1;
            while (dataIndex < _data.length) {
              var c = String.fromCharCode(_data[dataIndex]);
              dataIndex += 1;
              if (table.contains(s + c)) {
                s = s + c;
              } else {
                bitOut.write(table.indexOf(s), bitLength);
                if (table.size() < 4095) {
                  if (table.size() == 1 << bitLength) {
                    bitLength += 1;
                  }
                  table.add(s + c);
                }
                s = c;
              }
            }
            bitOut.write(table.indexOf(s), bitLength);
            bitOut.write(endCode, bitLength);
            bitOut.flush();
            return byteOut.toByteArray();
          };
          var lzwTable = function() {
            var _map = {};
            var _size = 0;
            var _this2 = {};
            _this2.add = function(key) {
              if (_this2.contains(key)) {
                throw "dup key:" + key;
              }
              _map[key] = _size;
              _size += 1;
            };
            _this2.size = function() {
              return _size;
            };
            _this2.indexOf = function(key) {
              return _map[key];
            };
            _this2.contains = function(key) {
              return typeof _map[key] != "undefined";
            };
            return _this2;
          };
          return _this;
        };
        var createDataURL = function(width, height, getPixel) {
          var gif = gifImage(width, height);
          for (var y = 0; y < height; y += 1) {
            for (var x = 0; x < width; x += 1) {
              gif.setPixel(x, y, getPixel(x, y));
            }
          }
          var b = byteArrayOutputStream();
          gif.write(b);
          var base64 = base64EncodeOutputStream();
          var bytes = b.toByteArray();
          for (var i = 0; i < bytes.length; i += 1) {
            base64.writeByte(bytes[i]);
          }
          base64.flush();
          return "data:image/gif;base64," + base64;
        };
        return qrcode3;
      })();
      !(function() {
        qrcode2.stringToBytesFuncs["UTF-8"] = function(s) {
          function toUTF8Array(str) {
            var utf8 = [];
            for (var i = 0; i < str.length; i++) {
              var charcode = str.charCodeAt(i);
              if (charcode < 128) utf8.push(charcode);
              else if (charcode < 2048) {
                utf8.push(
                  192 | charcode >> 6,
                  128 | charcode & 63
                );
              } else if (charcode < 55296 || charcode >= 57344) {
                utf8.push(
                  224 | charcode >> 12,
                  128 | charcode >> 6 & 63,
                  128 | charcode & 63
                );
              } else {
                i++;
                charcode = 65536 + ((charcode & 1023) << 10 | str.charCodeAt(i) & 1023);
                utf8.push(
                  240 | charcode >> 18,
                  128 | charcode >> 12 & 63,
                  128 | charcode >> 6 & 63,
                  128 | charcode & 63
                );
              }
            }
            return utf8;
          }
          return toUTF8Array(s);
        };
      })();
      (function(factory) {
        if (typeof define === "function" && define.amd) {
          define([], factory);
        } else if (typeof exports === "object") {
          module.exports = factory();
        }
      })(function() {
        return qrcode2;
      });
    }
  });

  // src/assets/logo-new.png
  var logo_new_default = "./assets/logo-new.png";

  // src/geo.ts
  var RAW = {
    "Colombia": "Amazonas: Leticia, Puerto Nari\xF1o | Antioquia: Medell\xEDn, Envigado, Bello, Itag\xFC\xED, Sabaneta, Rionegro, Apartad\xF3, Turbo | Arauca: Arauca, Saravena, Tame | Atl\xE1ntico: Barranquilla, Soledad, Malambo, Puerto Colombia | Bol\xEDvar: Cartagena, Magangu\xE9, Turbaco, Mompox | Boyac\xE1: Tunja, Duitama, Sogamoso, Paipa, Villa de Leyva | Caldas: Manizales, La Dorada, Chinchin\xE1 | Caquet\xE1: Florencia, San Vicente del Cagu\xE1n | Casanare: Yopal, Aguazul | Cauca: Popay\xE1n, Santander de Quilichao | Cesar: Valledupar, Aguachica | Choc\xF3: Quibd\xF3, Istmina | C\xF3rdoba: Monter\xEDa, Sahag\xFAn, Lorica | Cundinamarca: Bogot\xE1, Soacha, Zipaquir\xE1, Ch\xEDa, Fusagasug\xE1, Girardot, Facatativ\xE1 | Guain\xEDa: In\xEDrida | Guaviare: San Jos\xE9 del Guaviare | Huila: Neiva, Pitalito, Garz\xF3n | La Guajira: Riohacha, Maicao, Uribia | Magdalena: Santa Marta, Ci\xE9naga | Meta: Villavicencio, Acac\xEDas | Nari\xF1o: Pasto, Tumaco, Ipiales | Norte de Santander: C\xFAcuta, Oca\xF1a, Pamplona | Putumayo: Mocoa, Puerto As\xEDs | Quind\xEDo: Armenia, Calarc\xE1, Salento | Risaralda: Pereira, Dosquebradas | San Andr\xE9s y Providencia: San Andr\xE9s, Providencia | Santander: Bucaramanga, Floridablanca, Gir\xF3n, Piedecuesta, San Gil | Sucre: Sincelejo, Corozal | Tolima: Ibagu\xE9, Espinal, Honda | Valle del Cauca: Cali, Palmira, Buenaventura, Tulu\xE1, Buga, Cartago, Yumbo | Vaup\xE9s: Mit\xFA | Vichada: Puerto Carre\xF1o",
    "Argentina": "Buenos Aires (CABA): Buenos Aires | C\xF3rdoba: C\xF3rdoba | Mendoza: Mendoza | Santa Fe: Rosario, Santa Fe",
    "Chile": "Biob\xEDo: Concepci\xF3n | Regi\xF3n Metropolitana: Santiago | Valpara\xEDso: Valpara\xEDso, Vi\xF1a del Mar",
    "Ecuador": "Azuay: Cuenca | Guayas: Guayaquil | Pichincha: Quito",
    "Espa\xF1a": "Andaluc\xEDa: Sevilla, M\xE1laga | Catalu\xF1a: Barcelona | Comunidad de Madrid: Madrid | Comunidad Valenciana: Valencia",
    "Estados Unidos": "California: Los \xC1ngeles, San Francisco | Florida: Miami, Orlando | Nueva York: Nueva York | Texas: Austin, Houston",
    "M\xE9xico": "Ciudad de M\xE9xico: Ciudad de M\xE9xico | Jalisco: Guadalajara, Zapopan | Nuevo Le\xF3n: Monterrey, San Pedro Garza Garc\xEDa | Quintana Roo: Canc\xFAn, Playa del Carmen",
    "Panam\xE1": "Chiriqu\xED: David | Panam\xE1: Ciudad de Panam\xE1",
    "Per\xFA": "Arequipa: Arequipa | Cusco: Cusco | Lima: Lima, Miraflores"
  };
  var GEO = {};
  for (const [country, deps] of Object.entries(RAW)) {
    GEO[country] = {};
    for (const d of deps.split("|")) {
      const [name, list] = d.split(":");
      GEO[country][name.trim()] = list.split(",").map((c) => c.trim());
    }
  }
  var COUNTRIES = Object.keys(GEO);
  var departments = (country) => Object.keys(GEO[country] ?? {});
  var cities = (country, dept) => GEO[country]?.[dept] ?? [];
  function locate(city) {
    for (const country of COUNTRIES) for (const [department, list] of Object.entries(GEO[country])) if (list.includes(city)) return { country, department };
    return null;
  }
  var allCities = () => Array.from(new Set(COUNTRIES.flatMap((c) => Object.values(GEO[c]).flat()))).sort((a, b) => a.localeCompare(b, "es"));

  // src/db.ts
  function loadEvents() {
    try {
      const data = localStorage.getItem("sixevent_events");
      if (data) return JSON.parse(data).map(normalize);
    } catch (e) {
    }
    return initialEvents.map(normalize);
  }
  var DESC = {
    "1": "Encuentro regional que re\xFAne a CEOs, inversionistas y l\xEDderes de m\xE1s de 15 pa\xEDses para discutir expansi\xF3n de mercados, alianzas estrat\xE9gicas y el futuro de la econom\xEDa latinoamericana. Incluye ruedas de negocios y cena de networking.",
    "2": "Dos jornadas de paneles y demostraciones sobre inteligencia artificial, computaci\xF3n en la nube y transformaci\xF3n digital, con startups invitadas y espacio para conectar con aceleradoras y fondos de capital de riesgo.",
    "3": "Especialistas en tesorer\xEDa, fusiones y gesti\xF3n de riesgos presentan casos reales de empresas colombianas. Las sesiones t\xE9cnicas abordan valoraci\xF3n, financiaci\xF3n y cumplimiento normativo para directores financieros.",
    "4": "Magistrados, abogados y acad\xE9micos analizan las reformas m\xE1s recientes en derecho societario, contrataci\xF3n y arbitraje comercial, con sesiones de preguntas y casos pr\xE1cticos.",
    "5": "Feria con m\xE1s de cien expositores de maquinaria, materiales y software de ingenier\xEDa. Habr\xE1 demostraciones en vivo, charlas sobre obra sostenible y encuentros con constructoras y proveedores.",
    "6": "Noche de reconocimiento a las empresas con mayor impacto social y ambiental del a\xF1o. Incluye cena de gala, presentaci\xF3n de los proyectos ganadores y una subasta ben\xE9fica.",
    "7": "Seminario pr\xE1ctico para profesionales que quieren aplicar IA en sus equipos: modelos de lenguaje, automatizaci\xF3n de procesos, \xE9tica y gobernanza de datos, con talleres guiados.",
    "8": "Estudiantes y j\xF3venes emprendedores muestran sus proyectos ante mentores e inversionistas. Hay pitches de tres minutos, stands de incubadoras y premios para las mejores ideas.",
    "9": "Taller intensivo de un d\xEDa sobre comunicaci\xF3n, toma de decisiones y gesti\xF3n de equipos de alto desempe\xF1o, con ejercicios en grupos peque\xF1os y retroalimentaci\xF3n personalizada.",
    "10": "Expertos en posicionamiento, anal\xEDtica y publicidad en redes comparten estrategias para crecer en entornos digitales. Incluye talleres de contenido, comercio electr\xF3nico y marca personal.",
    "11": "Espacio para mujeres directivas y emprendedoras: conversatorios sobre liderazgo, equidad salarial y acceso a financiaci\xF3n, con mentor\xEDas abiertas y una red de contactos.",
    "12": "Empresas, gobierno y organizaciones debaten metas de descarbonizaci\xF3n, econom\xEDa circular y reportes ESG, con casos de \xE9xito y mesas de trabajo sobre financiaci\xF3n verde.",
    "13": "Desarrolladores y empresarios exploran contratos inteligentes, tokenizaci\xF3n y finanzas descentralizadas, con demostraciones t\xE9cnicas y un panel sobre regulaci\xF3n en Am\xE9rica Latina.",
    "14": "Muestra de obras de artistas colombianos y latinoamericanos en distintos formatos, con visitas guiadas, charlas con los creadores y un espacio dedicado a coleccionistas.",
    "15": "Ceremonia que premia a los proyectos, empresas y talentos m\xE1s innovadores del a\xF1o en software, hardware y emprendimiento, con c\xF3ctel, presentaciones y m\xFAsica en vivo.",
    "16": "Psic\xF3logos y l\xEDderes de talento humano presentan estrategias para prevenir el agotamiento, mejorar el clima laboral y construir programas de bienestar que funcionen."
  };
  function normalize(e) {
    let r = e;
    if (r.department === "Bogot\xE1 D.C.") r = { ...r, department: "Cundinamarca" };
    if (!r.country || !r.department) {
      const g = locate(r.city);
      r = { ...r, country: r.country ?? g?.country ?? "Colombia", department: r.department ?? g?.department ?? "" };
    }
    if (!r.description) r = { ...r, description: DESC[r.id] ?? `${r.title} es un evento de ${r.category.toLowerCase()} que se realizar\xE1 en ${r.city}. Re\xFAne a profesionales y organizaciones del sector para compartir experiencias, conocimiento y oportunidades de negocio.` };
    return r;
  }
  function placeLabel(e, full = false) {
    return [e.city, e.department, full ? e.country : ""].filter(Boolean).join(", ");
  }
  function saveEvents(events) {
    localStorage.setItem("sixevent_events", JSON.stringify(events));
  }
  var mockCategories = (price, cap) => [
    { name: "VIP Ejecutivo", price: Math.round(price * 2.03), capacity: Math.round(cap * 0.1), available: Math.round(cap * 0.1) },
    { name: "General", price, capacity: Math.round(cap * 0.6), available: Math.round(cap * 0.6) },
    { name: "Estudiante Afiliado", price: Math.round(price * 0.28), capacity: Math.round(cap * 0.3), available: Math.round(cap * 0.3) }
  ];
  var initialEvents = [
    { id: 1, title: "Cumbre Empresarial Latinoam\xE9rica 2026", category: "Conferencia", city: "Medell\xEDn", date: "2026-10-15", price: 32e4, img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", startTime: "09:00", endTime: "18:30", venue: "Centro de Convenciones Medell\xEDn", capacity: 500, availableTickets: 48, agenda: "09:00 - Registro\n10:00 - Conferencia inaugural", ticketCategories: mockCategories(32e4, 500) },
    { id: 2, title: "Foro Internacional de Innovaci\xF3n y Tecnolog\xEDa", category: "Foro", city: "Bogot\xE1", date: "2026-10-22", price: 18e4, img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=380&fit=crop&auto=format", rating: 4.7, createdBy: "system", startTime: "08:30", endTime: "17:00", venue: "Hotel Tequendama", capacity: 300, availableTickets: 120, agenda: "08:30 - Registro\n09:30 - Panel", ticketCategories: mockCategories(18e4, 300) },
    { id: 3, title: "Congreso Nacional de Finanzas Corporativas", category: "Congreso", city: "Cali", date: "2026-11-03", price: 25e4, img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=380&fit=crop&auto=format", rating: 4.8, createdBy: "system", startTime: "10:00", endTime: "18:00", venue: "Palacio de Exposiciones", capacity: 200, availableTickets: 30, agenda: "10:00 - Inicio\n12:00 - Almuerzo", ticketCategories: mockCategories(25e4, 200) },
    { id: 4, title: "Simposio de Derecho Corporativo 2026", category: "Simposio", city: "Bogot\xE1", date: "2026-11-10", price: 9e4, img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=380&fit=crop&auto=format", rating: 4.6, createdBy: "system", startTime: "09:00", endTime: "16:00", venue: "U. de los Andes", capacity: 400, availableTickets: 200, agenda: "09:00 - Apertura\n15:00 - Cierre", ticketCategories: mockCategories(9e4, 400) },
    { id: 5, title: "Expo Construcci\xF3n e Infraestructura 2026", category: "Exposici\xF3n", city: "Bogot\xE1", date: "2026-11-18", price: 6e4, img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=380&fit=crop&auto=format", rating: 4.5, createdBy: "system", startTime: "08:00", endTime: "19:00", venue: "Corferias", capacity: 2e3, availableTickets: 800, agenda: "08:00 - Apertura stands", ticketCategories: mockCategories(6e4, 2e3) },
    { id: 6, title: "Gala Anual de Responsabilidad Social Empresarial", category: "Gala", city: "Bogot\xE1", date: "2026-11-25", price: 45e4, img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", startTime: "19:00", endTime: "23:30", venue: "Club El Nogal", capacity: 150, availableTickets: 15, agenda: "19:00 - C\xF3ctel\n20:30 - Premiaci\xF3n", ticketCategories: mockCategories(45e4, 150) },
    { id: 7, title: "Seminario de Inteligencia Artificial", category: "Seminario", city: "Medell\xEDn", date: "2026-12-05", price: 12e4, img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=380&fit=crop&auto=format", rating: 4.8, createdBy: "system", capacity: 500, availableTickets: 500, startTime: "09:00", endTime: "17:00", venue: "Ruta N", agenda: "09:00 - Registro", ticketCategories: mockCategories(12e4, 500) },
    { id: 8, title: "Feria de Emprendimiento Universitario", category: "Feria", city: "Cali", date: "2026-12-12", price: 45e3, img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=380&fit=crop&auto=format", rating: 4.4, createdBy: "system", capacity: 1e3, availableTickets: 1e3, startTime: "10:00", endTime: "18:00", venue: "Centro de Eventos Valle del Pac\xEDfico", agenda: "10:00 - Apertura", ticketCategories: mockCategories(45e3, 1e3) },
    { id: 9, title: "Taller de Liderazgo Ejecutivo", category: "Taller", city: "Bogot\xE1", date: "2026-12-15", price: 21e4, img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", capacity: 100, availableTickets: 100, startTime: "08:00", endTime: "12:00", venue: "Hotel W", agenda: "08:00 - Desayuno", ticketCategories: mockCategories(21e4, 100) },
    { id: 10, title: "Congreso de Marketing Digital", category: "Congreso", city: "Barranquilla", date: "2027-01-20", price: 15e4, img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=380&fit=crop&auto=format", rating: 4.7, createdBy: "system", capacity: 300, availableTickets: 300, startTime: "09:00", endTime: "18:00", venue: "Puerta de Oro", agenda: "09:00 - Registro", ticketCategories: mockCategories(15e4, 300) },
    { id: 11, title: "Encuentro de Mujeres L\xEDderes", category: "Encuentro", city: "Cartagena", date: "2027-02-10", price: 13e4, img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", capacity: 250, availableTickets: 250, startTime: "14:00", endTime: "20:00", venue: "Centro de Convenciones", agenda: "14:00 - Registro", ticketCategories: mockCategories(13e4, 250) },
    { id: 12, title: "Foro de Sostenibilidad Ambiental", category: "Foro", city: "Bogot\xE1", date: "2027-02-18", price: 8e4, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=380&fit=crop&auto=format", rating: 4.6, createdBy: "system", capacity: 400, availableTickets: 400, startTime: "08:00", endTime: "14:00", venue: "Auditorio Principal", agenda: "08:00 - Registro", ticketCategories: mockCategories(8e4, 400) },
    { id: 13, title: "Conferencia de Blockchain y Web3", category: "Conferencia", city: "Medell\xEDn", date: "2027-03-05", price: 195e3, img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=380&fit=crop&auto=format", rating: 4.8, createdBy: "system", capacity: 350, availableTickets: 350, startTime: "09:00", endTime: "18:00", venue: "Plaza Mayor", agenda: "09:00 - Registro", ticketCategories: mockCategories(195e3, 350) },
    { id: 14, title: "Exposici\xF3n de Arte Contempor\xE1neo", category: "Exposici\xF3n", city: "Bogot\xE1", date: "2027-03-15", price: 35e3, img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&h=380&fit=crop&auto=format", rating: 4.5, createdBy: "system", capacity: 1500, availableTickets: 1500, startTime: "10:00", endTime: "20:00", venue: "Museo de Arte Moderno", agenda: "10:00 - Apertura", ticketCategories: mockCategories(35e3, 1500) },
    { id: 15, title: "Gala de Premios Tecnol\xF3gicos", category: "Gala", city: "Cali", date: "2027-03-25", price: 3e5, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", capacity: 200, availableTickets: 200, startTime: "19:00", endTime: "00:00", venue: "Centro de Eventos Valle del Pac\xEDfico", agenda: "19:00 - Alfombra roja", ticketCategories: mockCategories(3e5, 200) },
    { id: 16, title: "Simposio de Salud Mental en el Trabajo", category: "Simposio", city: "Medell\xEDn", date: "2027-04-10", price: 75e3, img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=380&fit=crop&auto=format", rating: 4.7, createdBy: "system", capacity: 300, availableTickets: 300, startTime: "08:00", endTime: "16:00", venue: "Auditorio Ruta N", agenda: "08:00 - Registro", ticketCategories: mockCategories(75e3, 300) }
  ];
  var eventsDB = loadEvents();
  var nextId = eventsDB.length > 0 ? Math.max(...eventsDB.map((e) => e.id)) + 1 : 17;
  function getEvents() {
    return [...eventsDB];
  }
  function addEvent(event) {
    const newEvent = {
      ...event,
      id: nextId++,
      rating: 5
    };
    eventsDB = [newEvent, ...eventsDB];
    saveEvents(eventsDB);
    return newEvent;
  }
  function updateEvent(id, patch) {
    eventsDB = eventsDB.map((e) => e.id === id ? { ...e, ...patch, id } : e);
    saveEvents(eventsDB);
  }
  function deleteEvent(id) {
    eventsDB = eventsDB.filter((e) => e.id !== id);
    saveEvents(eventsDB);
  }
  function consumeTickets(id, qty, category) {
    const e = eventsDB.find((x) => x.id === id);
    if (!e || e.availableTickets === void 0) return;
    e.availableTickets = Math.max(0, e.availableTickets - qty);
    const c = e.ticketCategories?.find((x) => x.name === category);
    if (c && c.available !== void 0) c.available = Math.max(0, c.available - qty);
    saveEvents(eventsDB);
  }
  function formatDateString(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  // src/auth.ts
  var ADMIN_CREDENTIALS = { username: "admin78", password: "op98rtUcev" };
  var ADMIN_CODES = {
    "007": "Samuel Garcia Vinasco",
    "008": "Maria Paula Gamboa Rengifo",
    "009": "Juan Jose Ariza Londo\xF1o",
    "010": "Alejandro Garcia Reyes"
  };
  var AGENT_CODES = {
    "Uceva": "900",
    "SENA": "567"
  };
  function loadUsers() {
    try {
      const data = localStorage.getItem("sixevent_users");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }
  function saveUsers(users) {
    localStorage.setItem("sixevent_users", JSON.stringify(users));
  }
  var usersDB = loadUsers();
  var currentUser = null;
  try {
    const session = localStorage.getItem("sixevent_session");
    if (session) {
      const sessionUser = JSON.parse(session);
      const u = usersDB.find((u2) => u2.id === sessionUser.id);
      if (u) currentUser = u;
      else currentUser = sessionUser;
    }
  } catch (e) {
  }
  function saveSession(user) {
    if (user) {
      localStorage.setItem("sixevent_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("sixevent_session");
    }
  }
  function registerUser(user) {
    user.points = 0;
    user.lifetimePoints = 0;
    user.coupons = [];
    user.reservations = [];
    user.favorites = [];
    usersDB.push(user);
    saveUsers(usersDB);
  }
  function loginUser(emailOrUser, pass) {
    const u = usersDB.find((u2) => (u2.email === emailOrUser || u2.username === emailOrUser) && u2.password === pass);
    if (u) {
      currentUser = u;
      saveSession(u);
      return u;
    }
    return null;
  }
  function setAdminSession(code) {
    const name = ADMIN_CODES[code];
    if (!name) return null;
    const id = "admin-" + code;
    let adminUser = usersDB.find((u) => u.id === id);
    if (!adminUser) {
      adminUser = { id, name, email: "admin@sixevent.co", username: "admin78", role: "admin", points: 0, reservations: [], favorites: [] };
      usersDB.push(adminUser);
      saveUsers(usersDB);
    }
    currentUser = adminUser;
    saveSession(adminUser);
    return adminUser;
  }
  function getCurrentUser() {
    return currentUser;
  }
  function logout() {
    currentUser = null;
    saveSession(null);
  }
  function getUsers() {
    return [...usersDB];
  }
  function updateUser(updatedData) {
    if (!currentUser) return false;
    try {
      const index = usersDB.findIndex((u) => u.id === currentUser.id);
      if (index !== -1) {
        usersDB[index] = { ...usersDB[index], ...updatedData };
        currentUser = usersDB[index];
      } else {
        currentUser = { ...currentUser, ...updatedData };
        usersDB.push(currentUser);
      }
      saveUsers(usersDB);
      saveSession(currentUser);
      return true;
    } catch {
      return false;
    }
  }

  // src/login.ts
  var esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var eye = "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z";
  var eyeOff = "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22";
  var svg = (d) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  function renderLogin(root, startMode, onBack, onSuccess) {
    const s = {
      mode: startMode,
      role: "cliente",
      email: "",
      name: "",
      username: "",
      password: "",
      empresa: "Uceva",
      cc: "",
      phone: "",
      city: "",
      show: false,
      remember: false,
      loading: false,
      modal: null,
      code: "",
      codeErr: "",
      errs: {},
      pending: null
    };
    function validate() {
      const e = {};
      const reg = s.mode === "register";
      if (reg && s.role === "agente" && s.name.trim().length < 2) e.name = "Ingresa tu nombre completo.";
      if (s.mode === "login" && !s.email.trim()) e.email = "Ingresa tu correo o usuario.";
      if (s.mode !== "login" && !s.email.includes("@")) e.email = "Ingresa un correo v\xE1lido.";
      if (reg && s.role === "cliente" && s.username.trim().length < 3) e.username = "Nombre de usuario debe tener m\xEDnimo 3 caracteres.";
      if (reg && s.role === "agente" && s.cc.trim().length < 6) e.cc = "Ingresa una c\xE9dula v\xE1lida.";
      if (reg) {
        if (s.phone.replace(/\D/g, "").length < 10) e.phone = "Ingresa un celular v\xE1lido (m\xEDnimo 10 d\xEDgitos).";
        if (s.city.trim().length < 2) e.city = "Ingresa tu ciudad.";
      }
      if (s.mode !== "forgot" && s.password.length < 6) e.password = "La contrase\xF1a debe tener al menos 6 caracteres.";
      return e;
    }
    const input = (id, label, type, ph) => `<div class="fg"><label for="${id}">${label}</label><input id="${id}" type="${type}" placeholder="${ph}" value="${esc(s[id])}" class="${s.errs[id] ? "err" : ""}">${s.errs[id] ? `<small class="errtxt">${s.errs[id]}</small>` : ""}</div>`;
    const cityInput = () => `<div class="fg"><label for="city">Ciudad</label><input id="city" type="text" list="cities-list" placeholder="Ej: Bogot\xE1" value="${esc(s.city)}" class="${s.errs.city ? "err" : ""}" autocomplete="off"><datalist id="cities-list">${allCities().map((c) => `<option value="${esc(c)}">`).join("")}</datalist>${s.errs.city ? `<small class="errtxt">${s.errs.city}</small>` : ""}</div>`;
    function form() {
      const reg = s.mode === "register", cli = s.role === "cliente";
      const titles = { login: ["Iniciar sesi\xF3n", "Ingresa tus credenciales para continuar."], forgot: ["Recuperar contrase\xF1a", "Ingresa tu correo para recibir un c\xF3digo de recuperaci\xF3n."], register: ["Crear cuenta", "Reg\xEDstrate en la plataforma."] }[s.mode];
      return `<h2>${titles[0]}</h2><p class="sub">${titles[1]}</p>
    <form id="auth-form" novalidate>
      ${reg ? `<div class="fg"><label>Rol</label><div class="roles">${["cliente", "agente"].map((r) => `<button type="button" data-role="${r}" class="${s.role === r ? "is-on" : ""}">${r}</button>`).join("")}</div></div>` : ""}
      ${reg && !cli ? input("name", "Nombre completo", "text", "Tu nombre") : ""}
      ${reg && cli ? input("username", "Nombre de usuario", "text", "Ej. jperez99") : ""}
      ${input("email", s.mode === "login" ? "Correo o usuario" : "Correo electr\xF3nico", "text", "correo@empresa.com")}
      ${reg ? input("phone", "Celular", "tel", "3001234567") + cityInput() : ""}
      ${reg && !cli ? `<div class="fg"><label for="empresa">Empresa</label><select id="empresa">${Object.keys(AGENT_CODES).map((e) => `<option${e === s.empresa ? " selected" : ""}>${e}</option>`).join("")}</select></div>${input("cc", "C\xE9dula", "text", "N\xFAmero de c\xE9dula")}` : ""}
      ${s.mode !== "forgot" ? `<div class="fg"><label for="password">Contrase\xF1a</label><div class="pw"><input id="password" type="${s.show ? "text" : "password"}" placeholder="M\xEDnimo 6 caracteres" value="${esc(s.password)}" class="${s.errs.password ? "err" : ""}"><button type="button" id="toggle-pw" aria-label="Mostrar contrase\xF1a">${svg(s.show ? eyeOff : eye)}</button></div>${s.errs.password ? `<small class="errtxt">${s.errs.password}</small>` : ""}</div>` : ""}
      ${s.mode === "login" ? `<div class="row"><label class="chk"><input type="checkbox" id="remember"${s.remember ? " checked" : ""}> Recordarme</label><button type="button" class="lnk" data-mode="forgot">\xBFOlvidaste tu contrase\xF1a?</button></div>` : ""}
      <button class="btn btn--navy full" type="submit"${s.loading ? " disabled" : ""}>${s.loading ? "Procesando\u2026" : s.mode === "login" ? "Entrar" : s.mode === "forgot" ? "Enviar c\xF3digo" : "Crear cuenta"}</button>
    </form>
    <p class="switch">${s.mode === "login" ? `\xBFNo tienes cuenta? <button class="lnk" data-mode="register">Reg\xEDstrate</button>` : `<button class="lnk" data-mode="login">Volver a iniciar sesi\xF3n</button>`}</p>`;
    }
    function modal() {
      if (!s.modal) return "";
      const admin = s.modal === "admin";
      return `<div class="modal"><div class="modal__box"><h3>${admin ? "Acceso de administrador" : "Verificaci\xF3n de agente"}</h3>
      <p class="sub">Ingresa tu c\xF3digo de acceso${admin ? "" : ` de ${esc(s.pending?.empresa ?? "tu empresa")}`}.</p>
      <input id="code" type="password" placeholder="C\xF3digo" value="${esc(s.code)}" class="${s.codeErr ? "err" : ""}">${s.codeErr ? `<small class="errtxt">${s.codeErr}</small>` : ""}
      <div class="row" style="margin-top:16px"><button class="btn btn--ghost2" id="m-cancel">Cancelar</button><button class="btn btn--navy" id="m-ok">Confirmar</button></div></div></div>`;
    }
    function draw() {
      root.innerHTML = `<div class="auth"><div class="auth__l"><button class="back" id="back">\u2190 Volver al inicio</button>
      <img src="${logo_new_default}" alt="6ixEvent logo" height="64" style="mix-blend-mode:multiply"><h1>Bienvenido a SIX EVENT</h1>
      <p>La plataforma corporativa de gesti\xF3n de eventos y venta de boletas m\xE1s confiable de Colombia.</p>
      <div class="badges">${["1.8M+ boletas vendidas", "4.200+ eventos", "38 ciudades"].map((b) => `<span>${b}</span>`).join("")}</div></div>
      <div class="auth__r"><div class="auth__box">${form()}</div></div></div>${modal()}`;
    }
    function submit() {
      s.errs = validate();
      if (Object.keys(s.errs).length) return draw();
      if (s.mode === "login" && s.email === ADMIN_CREDENTIALS.username && s.password === ADMIN_CREDENTIALS.password) {
        s.modal = "admin";
        s.code = "";
        return draw();
      }
      s.loading = true;
      draw();
      setTimeout(() => {
        s.loading = false;
        if (s.mode === "forgot") {
          alert("\xA1C\xF3digo enviado al correo! (PR\xD3XIMAMENTE)");
          s.mode = "login";
          return draw();
        }
        if (s.mode === "register") {
          registerUser({
            id: Date.now().toString(),
            name: s.role === "cliente" ? s.username.trim() : s.name.trim(),
            email: s.email,
            username: s.username,
            password: s.password,
            role: s.role,
            empresa: s.role === "agente" ? s.empresa : void 0,
            cc: s.role === "agente" ? s.cc : void 0,
            phone: s.phone.trim(),
            city: s.city.trim()
          });
        }
        const u = loginUser(s.email, s.password);
        if (!u) {
          s.errs = { password: "Credenciales incorrectas o cuenta no registrada." };
          return draw();
        }
        if (u.role === "agente") {
          s.pending = u;
          s.modal = "agent";
          s.code = "";
          return draw();
        }
        onSuccess();
      }, 800);
    }
    function confirmCode() {
      if (s.modal === "admin") {
        if (setAdminSession(s.code)) return onSuccess();
        s.codeErr = "C\xF3digo de acceso inv\xE1lido.";
      } else {
        const need = s.pending?.empresa ? AGENT_CODES[s.pending.empresa] : void 0;
        if (need && s.code === need) return onSuccess();
        s.codeErr = "C\xF3digo de acceso inv\xE1lido para tu empresa.";
      }
      draw();
    }
    root.onclick = (e) => {
      const t = e.target;
      const mode = t.closest("[data-mode]")?.dataset.mode;
      const role = t.closest("[data-role]")?.dataset.role;
      if (t.closest("#back")) return onBack();
      if (mode) {
        s.mode = mode;
        s.errs = {};
        return draw();
      }
      if (role) {
        s.role = role;
        s.errs = {};
        return draw();
      }
      if (t.closest("#toggle-pw")) {
        s.show = !s.show;
        return draw();
      }
      if (t.closest("#m-cancel")) {
        logout();
        s.modal = null;
        s.codeErr = "";
        return draw();
      }
      if (t.closest("#m-ok")) return confirmCode();
    };
    root.oninput = (e) => {
      const t = e.target;
      if (t.id === "code") s.code = t.value;
      else if (t.id === "remember") s.remember = t.checked;
      else if (t.id in s) s[t.id] = t.value;
    };
    root.onsubmit = (e) => {
      e.preventDefault();
      submit();
    };
    root.onkeydown = (e) => {
      if (e.key === "Enter" && e.target.id === "code") confirmCode();
    };
    draw();
  }

  // src/screens.ts
  var esc2 = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var cop = (n) => "$ " + n.toLocaleString("es-CO");
  var P = {
    arrow: "M19 12H5M12 19l-7-7 7-7",
    loc: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z",
    cal: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
    share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
    heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    check: "M20 6L9 17l-5-5",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    minus: "M5 12h14",
    plus: "M12 5v14M5 12h14"
  };
  var svg2 = (d, s = 14, fill = "none") => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  var topbar = (left, right) => `<header class="top"><div class="container top__in">${left}<img src="${logo_new_default}" alt="6ixEvent logo" height="36" style="mix-blend-mode:screen">${right}</div></header>`;
  function renderEventDetail(root, e, onBack, onCheckout, onLogin) {
    const venue = e.venue || "Por definir", t1 = e.startTime || "09:00", t2 = e.endTime || "18:00";
    const cap = e.capacity || 500, av = e.availableTickets ?? 500;
    const cats = e.ticketCategories || [{ name: "General", price: e.price, available: av }];
    const pct = cap > 0 ? Math.min(100, av / cap * 100) : 0;
    const agenda = (e.agenda || "09:00 - Inicio del evento").split("\n").filter(Boolean);
    const saved = () => !!getCurrentUser()?.favorites?.includes(e.id);
    let toast = false;
    function draw() {
      const rows = [["Teatro / Auditorio", venue], ["Ciudad", `${placeLabel(e, true)}`], ["Hora de inicio", t1], ["Hora de fin", t2], ["Capacidad total", `${cap.toLocaleString()} personas`], ["Disponibilidad", `${av} entradas restantes`]];
      root.innerHTML = `<div class="toast${toast ? " is-on" : ""}">${svg2(P.check)} Enlace copiado al portapapeles</div>
    ${topbar(
        `<button class="tbtn" id="d-back">${svg2(P.arrow)} Volver</button>`,
        `<span class="tgrp"><button class="tbtn tbtn--o" id="d-share">${svg2(toast ? P.check : P.share)} ${toast ? "Copiado" : "Compartir"}</button><button class="tbtn tbtn--o${saved() ? " is-on" : ""}" id="d-save">${svg2(P.heart, 14, saved() ? "currentColor" : "none")} ${saved() ? "Guardado" : "Guardar"}</button></span>`
      )}
    <div class="dhero"><img src="${esc2(e.img.replace("w=600&h=380", "w=1400&h=500"))}" alt="${esc2(e.title)}"><div class="dhero__shade"></div><span class="badge badge--c">${esc2(e.category)}</span></div>
    <div class="container dgrid"><div>
      <h1 class="dtitle">${esc2(e.title)}</h1>
      <div class="dmeta">${[[P.loc, venue], [P.loc, `${placeLabel(e, true)}`], [P.cal, formatDateString(e.date)], [P.clock, `${t1} \u2014 ${t2}`]].map(([i, t]) => `<span>${svg2(i, 15)}${esc2(t)}</span>`).join("")}</div>
      <section class="dsec"><h2>Descripci\xF3n del evento</h2>${(e.description || "").split("\n").map((p) => `<p>${esc2(p)}</p>`).join("")}</section>
      <section class="dsec"><h2>Recinto</h2><div class="vgrid">${rows.map(([l, v]) => `<div><small>${l}</small><b>${esc2(v)}</b></div>`).join("")}</div></section>
      <section class="dsec"><h2>Agenda del d\xEDa</h2><ol class="agenda">${agenda.map((l) => {
        const [h, ...r] = l.split(" - ");
        return `<li><b>${esc2(h)}</b><span>${esc2(r.join(" - ") || h)}</span></li>`;
      }).join("")}</ol></section>
      <section class="dsec"><h2>Categor\xEDas de entrada</h2>${cats.map((c) => `<div class="catrow"><span>${esc2(c.name)}</span><span>${c.available !== void 0 ? `${c.available} disp.` : ""}</span><b>${cop(c.price)}</b></div>`).join("")}</section>
    </div><aside class="dside"><small>Precio desde</small><div class="dprice">${cop(Math.min(...cats.map((c) => c.price)))}</div>
      <div class="bar"><i style="width:${pct}%"></i></div><p class="dav">${av} de ${cap} entradas disponibles</p>
      <button class="btn btn--navy full" id="d-res"${av === 0 ? " disabled" : ""}>${av === 0 ? "Agotado" : "Reservar entradas"}</button>
      <p class="dnote">${svg2(P.shield, 13)} Pago 100% seguro</p></aside></div>`;
    }
    root.onclick = (ev) => {
      const t = ev.target;
      if (t.closest("#d-back")) return onBack();
      if (t.closest("#d-res")) return getCurrentUser() ? onCheckout() : onLogin();
      if (t.closest("#d-save")) {
        const u = getCurrentUser();
        if (!u) return onLogin();
        const f = u.favorites ?? [];
        updateUser({ favorites: f.includes(e.id) ? f.filter((i) => i !== e.id) : [...f, e.id] });
        return draw();
      }
      if (t.closest("#d-share")) {
        const url = location.href;
        (async () => {
          try {
            navigator.share ? await navigator.share({ title: e.title, text: `Mira este evento: ${e.title}`, url }) : await navigator.clipboard.writeText(url);
          } catch {
          }
          toast = true;
          draw();
          setTimeout(() => {
            toast = false;
            draw();
          }, 2500);
        })();
      }
    };
    root.oninput = null;
    root.onsubmit = null;
    draw();
  }
  var FEE = 0.04;
  var BANKS = ["Bancolombia", "Banco de Bogot\xE1", "Davivienda", "BBVA Colombia", "Banco Popular", "Banco de Occidente", "Colpatria"];
  function renderCheckout(root, e, onBack, onConfirm) {
    const cats = e.ticketCategories || [{ name: "General", price: e.price }];
    const s = {
      qty: 1,
      cat: cats.find((c) => c.name === "General")?.name ?? cats[0].name,
      notes: "",
      coupon: "",
      pay: "card",
      busy: false,
      bank: "",
      docType: "CC",
      docNumber: "",
      cardNum: "",
      cardName: "",
      exp: "",
      cvv: ""
    };
    const unit = () => cats.find((c) => c.name === s.cat)?.price ?? e.price;
    const coupons = () => (getCurrentUser()?.coupons ?? []).filter((c) => !c.used);
    const cp = () => coupons().find((c) => c.code === s.coupon);
    const sub = () => unit() * s.qty, disc = () => Math.round(sub() * (cp()?.percent ?? 0) / 100), fee = () => Math.round((sub() - disc()) * FEE), total = () => sub() - disc() + fee();
    const inp = (id, label, ph, attrs = "") => `<div class="fg"><label for="${id}">${label}</label><input id="${id}" value="${esc2(String(s[id]))}" placeholder="${ph}" required ${attrs}></div>`;
    function draw() {
      const steps = ["Selecci\xF3n", "Reserva", "Pago", "Confirmaci\xF3n"];
      root.innerHTML = `${topbar(`<button class="tbtn" id="c-back">${svg2(P.arrow)} Volver al evento</button>`, `<span class="tbtn">${svg2(P.shield)} Pago seguro</span>`)}
    <div class="steps container">${steps.map((l, i) => `<span class="${i === 1 ? "is-cur" : i < 1 ? "is-done" : ""}"><i>${i < 1 ? svg2(P.check, 12) : i + 1}</i>${l}</span>`).join("")}</div>
    <div class="container cgrid"><form id="c-form">
      <section class="cbox"><h2>Datos de la reserva</h2>
        <label class="lbl">Categor\xEDa de entrada</label><div class="opts">${cats.map((c) => `<button type="button" data-cat="${esc2(c.name)}" class="opt${c.name === s.cat ? " is-on" : ""}"><b>${esc2(c.name)}</b><span>${cop(c.price)}</span></button>`).join("")}</div>
        <label class="lbl">Cantidad de entradas</label><div class="qty"><button type="button" data-q="-1" aria-label="Menos">${svg2(P.minus, 16)}</button><b>${s.qty}</b><button type="button" data-q="1" aria-label="M\xE1s">${svg2(P.plus, 16)}</button></div>
        <small class="hint">M\xE1ximo 10 entradas por transacci\xF3n.</small>
        ${coupons().length ? `<div class="fg"><label for="coupon">Cup\xF3n de descuento</label><select id="coupon"><option value="">Sin cup\xF3n</option>${coupons().map((c) => `<option value="${c.code}"${c.code === s.coupon ? " selected" : ""}>${esc2(c.label)} \xB7 ${c.code}</option>`).join("")}</select></div>` : ""}
        <div class="fg"><label for="notes">Observaciones (opcional)</label><textarea id="notes" rows="3" placeholder="Requisitos especiales de accesibilidad, necesidades diet\xE9ticas, etc.">${esc2(s.notes)}</textarea></div></section>
      <section class="cbox"><h2>M\xE9todo de pago</h2>
        <div class="opts"><button type="button" data-pay="card" class="opt${s.pay === "card" ? " is-on" : ""}"><b>Tarjeta de cr\xE9dito/d\xE9bito</b></button><button type="button" data-pay="pse" class="opt${s.pay === "pse" ? " is-on" : ""}"><b>PSE / Transferencia</b></button></div>
        ${s.pay === "card" ? inp("cardNum", "N\xFAmero de tarjeta", "0000 0000 0000 0000", 'inputmode="numeric" pattern="[0-9 ]{13,19}" autocomplete="cc-number"') + inp("cardName", "Nombre en la tarjeta", "Como aparece en la tarjeta", 'autocomplete="cc-name"') + `<div class="two">${inp("exp", "Vencimiento", "MM/AA", 'pattern="(0[1-9]|1[0-2])\\/\\d{2}" maxlength="5"')}${inp("cvv", "CVV", "123", 'inputmode="numeric" pattern="[0-9]{3,4}" maxlength="4"')}</div>` : `<div class="fg"><label for="bank">Banco</label><select id="bank" required><option value="">Selecciona tu banco</option>${BANKS.map((b) => `<option${b === s.bank ? " selected" : ""}>${b}</option>`).join("")}</select></div>
             <div class="two"><div class="fg"><label for="docType">Tipo de documento</label><select id="docType">${["CC", "CE", "NIT", "Pasaporte"].map((d) => `<option${d === s.docType ? " selected" : ""}>${d}</option>`).join("")}</select></div>${inp("docNumber", "N\xFAmero", "Documento", 'inputmode="numeric"')}</div>`}
      </section>
      <button class="btn btn--navy full" type="submit"${s.busy ? " disabled" : ""}>${s.busy ? "Procesando pago\u2026" : `Pagar ${cop(total())}`}</button></form>
      <aside class="dside"><h3>Resumen</h3><p class="sumt">${esc2(e.title)}</p><p class="meta">${svg2(P.cal)} ${formatDateString(e.date)}</p><p class="meta">${svg2(P.loc)} ${esc2(e.city)}</p><hr>
        <div class="sumr"><span>${s.qty} \xD7 ${esc2(s.cat)}</span><b>${cop(sub())}</b></div>${disc() ? `<div class="sumr"><span>Cup\xF3n ${cp().percent}%</span><b>\u2212 ${cop(disc())}</b></div>` : ""}<div class="sumr"><span>Cargo por servicio (4%)</span><b>${cop(fee())}</b></div>
        <div class="sumr sumr--t"><span>Total</span><b>${cop(total())}</b></div></aside></div>`;
    }
    root.onclick = (ev) => {
      const t = ev.target, el = (k) => t.closest(`[${k}]`);
      if (t.closest("#c-back")) return onBack();
      if (el("data-cat")) {
        s.cat = el("data-cat").dataset.cat;
        draw();
      } else if (el("data-q")) {
        s.qty = Math.min(10, Math.max(1, s.qty + Number(el("data-q").dataset.q)));
        draw();
      } else if (el("data-pay")) {
        s.pay = el("data-pay").dataset.pay;
        draw();
      }
    };
    root.oninput = (ev) => {
      const t = ev.target;
      if (t.id in s) s[t.id] = t.value;
      if (t.id === "coupon") draw();
    };
    root.onsubmit = (ev) => {
      ev.preventDefault();
      s.busy = true;
      draw();
      setTimeout(() => {
        const u = getCurrentUser();
        if (u) {
          const res = { id: `RES-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(1e3 + Math.random() * 9e3)}`, eventId: e.id, event: e.title, date: formatDateString(e.date), tickets: s.qty, total: total(), status: "confirmed", category: s.cat, venue: e.city, createdAt: (/* @__PURE__ */ new Date()).toISOString(), discount: disc() };
          const earned = Math.round(total() / 1e3);
          updateUser({
            reservations: [res, ...u.reservations || []],
            points: (u.points || 0) + earned,
            lifetimePoints: (u.lifetimePoints ?? u.points ?? 0) + earned,
            coupons: (u.coupons || []).map((c) => c.code === s.coupon ? { ...c, used: true } : c)
          });
          consumeTickets(e.id, s.qty, s.cat);
        }
        onConfirm();
      }, 1600);
    };
    draw();
  }

  // src/points.ts
  var TIERS = [
    { name: "Bronce", min: 0, color: "#B87333", fg: "#fff" },
    { name: "Plata", min: 5e3, color: "#C0C6CE", fg: "#1E3A5F" },
    { name: "Oro", min: 25e3, color: "#E0B22E", fg: "#1E3A5F" },
    { name: "Platino", min: 1e5, color: "#8FB3DE", fg: "#1E3A5F" },
    { name: "Diamante", min: 5e5, color: "#4FB6E8", fg: "#fff" },
    { name: "Plus", min: 2e6, color: "#1E3A5F", fg: "#F7ECC7" }
  ];
  var REWARDS = [
    { id: "d10", label: "Cup\xF3n del 10% de descuento", percent: 10, cost: 200 },
    { id: "d25", label: "Cup\xF3n del 25% de descuento", percent: 25, cost: 600 },
    { id: "d50", label: "Cup\xF3n del 50% de descuento", percent: 50, cost: 1500 }
  ];
  function tierInfo(lifetime) {
    let i = 0;
    TIERS.forEach((t, k) => {
      if (lifetime >= t.min) i = k;
    });
    const tier = TIERS[i], next = TIERS[i + 1] ?? null;
    return { tier, next, toNext: next ? next.min - lifetime : 0, pct: next ? Math.min(100, (lifetime - tier.min) / (next.min - tier.min) * 100) : 100 };
  }

  // src/ticket.ts
  var import_qrcode_generator = __toESM(require_qrcode(), 1);
  var W = 1400;
  var H = 560;
  var SX = 1010;
  var NAVY = "#1E3A5F";
  var BLUE = "#3B6EA5";
  var CREAM = "#F7ECC7";
  var FONT = "'Work Sans', ui-sans-serif, system-ui, sans-serif";
  function qrSvg(text) {
    const q = (0, import_qrcode_generator.default)(0, "M");
    q.addData(text);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  }
  function hex(c, x, y, r) {
    c.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 3 * i - Math.PI / 2;
      c[i ? "lineTo" : "moveTo"](x + r * Math.cos(a), y + r * Math.sin(a));
    }
    c.closePath();
  }
  function wrap(c, text, maxW, maxLines) {
    const lines = [];
    let cur = "";
    for (const w of text.split(" ")) {
      if (c.measureText((cur + " " + w).trim()).width > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else cur = (cur + " " + w).trim();
    }
    if (cur) lines.push(cur);
    if (lines.length > maxLines) {
      lines.length = maxLines;
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\s?\S*$/, "") + "\u2026";
    }
    return lines;
  }
  function paintTicket(c, r, holder) {
    const sp = (v) => {
      try {
        c.letterSpacing = v;
      } catch {
      }
    };
    c.clearRect(0, 0, W, H);
    c.save();
    c.beginPath();
    c.roundRect(0, 0, W, H, 28);
    c.clip();
    const g = c.createLinearGradient(0, 0, SX, H);
    g.addColorStop(0, NAVY);
    g.addColorStop(1, BLUE);
    c.fillStyle = g;
    c.fillRect(0, 0, SX, H);
    c.fillStyle = CREAM;
    c.fillRect(SX, 0, W - SX, H);
    c.strokeStyle = "rgba(247,236,199,0.07)";
    c.lineWidth = 3;
    for (const [x2, y, s] of [[820, 90, 120], [930, 270, 90], [760, 430, 150], [980, 500, 60]]) {
      hex(c, x2, y, s);
      c.stroke();
    }
    c.restore();
    c.save();
    c.globalCompositeOperation = "destination-out";
    for (const y of [0, H]) {
      c.beginPath();
      c.arc(SX, y, 26, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
    c.save();
    c.setLineDash([10, 10]);
    c.strokeStyle = "rgba(30,58,95,0.35)";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(SX, 40);
    c.lineTo(SX, H - 40);
    c.stroke();
    c.restore();
    c.strokeStyle = CREAM;
    c.lineWidth = 4;
    hex(c, 92, 90, 38);
    c.stroke();
    c.fillStyle = CREAM;
    c.textBaseline = "middle";
    c.textAlign = "center";
    c.font = `700 40px ${FONT}`;
    c.fillText("6", 92, 92);
    c.textAlign = "left";
    c.font = `700 34px ${FONT}`;
    sp("6px");
    c.fillText("SIX EVENT", 150, 90);
    c.textAlign = "right";
    c.font = `600 17px ${FONT}`;
    c.fillStyle = "rgba(247,236,199,0.75)";
    sp("4px");
    c.fillText("BOLETA DE ENTRADA", SX - 60, 90);
    sp("0px");
    c.fillStyle = "rgba(247,236,199,0.25)";
    c.fillRect(60, 144, SX - 120, 2);
    c.textAlign = "left";
    c.font = `700 17px ${FONT}`;
    sp("2px");
    const cat = r.category.toUpperCase(), cw = c.measureText(cat).width + 36;
    c.fillStyle = CREAM;
    c.beginPath();
    c.roundRect(60, 172, cw, 38, 19);
    c.fill();
    c.fillStyle = NAVY;
    c.fillText(cat, 78, 192);
    sp("0px");
    c.fillStyle = "#fff";
    c.font = `700 52px ${FONT}`;
    wrap(c, r.event, SX - 130, 2).forEach((l, i2) => c.fillText(l, 60, 262 + i2 * 62));
    const cols = [["FECHA", r.date, 60], ["CIUDAD", r.venue, 330], ["ENTRADAS", String(r.tickets), 580], ["TOTAL PAGADO", "$ " + r.total.toLocaleString("es-CO"), 740]];
    for (const [l, v, x2] of cols) {
      c.fillStyle = "rgba(247,236,199,0.6)";
      c.font = `600 14px ${FONT}`;
      sp("2px");
      c.fillText(l, x2, 392);
      sp("0px");
      c.fillStyle = "#fff";
      c.font = `700 26px ${FONT}`;
      c.fillText(v, x2, 428);
    }
    c.fillStyle = "rgba(247,236,199,0.6)";
    c.font = `600 14px ${FONT}`;
    sp("2px");
    c.fillText("TITULAR", 60, 492);
    sp("0px");
    c.fillStyle = "#fff";
    c.font = `600 24px ${FONT}`;
    c.fillText(holder.length > 34 ? holder.slice(0, 33) + "\u2026" : holder, 60, 520);
    c.textAlign = "right";
    c.fillStyle = CREAM;
    c.font = `600 20px ${FONT}`;
    c.fillText("N.\xBA " + r.id, SX - 60, 520);
    const cx = (SX + W) / 2;
    c.textAlign = "center";
    c.fillStyle = NAVY;
    c.font = `600 15px ${FONT}`;
    sp("4px");
    c.fillText("ADMITE", cx, 110);
    sp("0px");
    c.font = `700 150px ${FONT}`;
    c.fillText(String(r.tickets), cx, 225);
    c.font = `600 17px ${FONT}`;
    sp("3px");
    c.fillText(r.tickets === 1 ? "PERSONA" : "PERSONAS", cx, 300);
    sp("0px");
    let x = SX + 55, i = 0;
    c.fillStyle = NAVY;
    while (x < W - 55) {
      const w = 2 + (r.id.charCodeAt(i % r.id.length) + i * 7) % 5;
      if (i % 2 === 0) c.fillRect(x, 340, w, 96);
      x += w + 2;
      i++;
    }
    c.font = `500 15px ui-monospace, Consolas, monospace`;
    sp("2px");
    c.fillText(r.id, cx, 462);
    sp("0px");
    c.fillStyle = "rgba(30,58,95,0.65)";
    c.font = `500 14px ${FONT}`;
    c.fillText("Presenta el QR de tu perfil", cx, 506);
    c.fillText("junto a esta boleta", cx, 526);
  }
  async function downloadTicket(r, holder) {
    try {
      await Promise.all([document.fonts.load(`700 40px 'Work Sans'`), document.fonts.load(`600 20px 'Work Sans'`)]);
    } catch {
    }
    const cv = document.createElement("canvas");
    cv.width = W * 2;
    cv.height = H * 2;
    const c = cv.getContext("2d");
    c.scale(2, 2);
    paintTicket(c, r, holder);
    cv.toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b), a = document.createElement("a");
      a.href = url;
      a.download = `boleta_${r.id}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1e3);
    }, "image/png");
  }

  // src/profile.ts
  var esc3 = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var cop2 = (n) => "$ " + n.toLocaleString("es-CO");
  var I = {
    ticket: "M2 9a2 2 0 0 1 0-4V3h20v2a2 2 0 0 1 0 4v2a2 2 0 0 1 0 4v2H2v-2a2 2 0 0 1 0-4V9zM12 3v18",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    dl: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    x: "M18 6 6 18M6 6l12 12",
    chev: "M9 18l6-6-6-6",
    check: "M20 6L9 17l-5-5",
    arrow: "M19 12H5M12 19l-7-7 7-7",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    eyeOff: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"
  };
  var svg3 = (d, s = 16, f = "none") => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${f}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  var STATUS = { confirmed: ["Confirmada", "ok"], reserved: ["Reservada", "warn"], cancelled: ["Cancelada", "bad"] };
  var pill = (st) => {
    const [l, c] = STATUS[st] ?? STATUS.confirmed;
    return `<span class="pill pill--${c}">${l}</span>`;
  };
  var TABS = [["reservas", "Mis Reservas", I.ticket], ["puntos", "Mis Puntos", I.star], ["perfil", "Mi Perfil", I.user]];
  function download(name, text, type = "text/plain;charset=utf-8;") {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }
  function renderProfile(root, onBack) {
    if (!getCurrentUser()) return onBack();
    const s = {
      tab: "reservas",
      sel: null,
      editing: false,
      draft: { nombre: "", correo: "", telefono: "", ciudad: "", empresa: "", cargo: "" },
      saved: false,
      saveErr: "",
      pw: false,
      fa: false,
      faOn: true,
      show: false,
      cur: "",
      nxt: "",
      conf: "",
      pwMsg: "",
      pwOk: false,
      faOk: false
    };
    const info = () => {
      const u = getCurrentUser();
      return {
        nombre: u.name,
        correo: u.email,
        telefono: u.phone || "",
        ciudad: u.city || "",
        empresa: u.empresa || "",
        cargo: u.position || (u.role === "admin" ? "Administrador" : u.role === "agente" ? "Agente de Ventas" : "Cliente")
      };
    };
    function tabReservas(list) {
      const stat = [["Total reservas", String(list.length), "historial completo"], ["Confirmadas", String(list.filter((r) => r.status === "confirmed").length), "acceso garantizado"], ["Gasto total", cop2(list.reduce((a, r) => a + r.total, 0)), "en eventos 2026"]];
      return `<div class="stats3">${stat.map(([l, v, sb]) => `<div class="pcard"><small>${l}</small><b>${v}</b><span>${sb}</span></div>`).join("")}</div>
    <div class="pcard"><div class="phead"><h2>Historial de reservas</h2><button class="pbtn" data-csv>${svg3(I.dl, 14)} Exportar CSV</button></div>
    <div class="tscroll"><table><thead><tr>${["ID", "Evento", "Fecha", "Entradas", "Total", "Estado", ""].map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>
    ${list.length ? list.map((r, i) => `<tr><td>${esc3(r.id)}</td><td><b>${esc3(r.event)}</b></td><td>${esc3(r.date)}</td><td>${r.tickets}</td><td>${cop2(r.total)}</td><td>${pill(r.status)}</td><td><button class="lnk" data-res="${i}">Ver ${svg3(I.chev, 13)}</button></td></tr>`).join("") : `<tr><td colspan="7" class="empty2">No hay reservas registradas.</td></tr>`}</tbody></table></div></div>`;
    }
    function tabPuntos(list, pts) {
      const u = getCurrentUser(), life = u.lifetimePoints ?? u.points ?? 0, ti = tierInfo(life), coupons = u.coupons ?? [];
      const rules = [["1 punto por cada", "$1.000 COP", "pagados en cada compra"], ["Tu nivel depende de", "puntos acumulados", "canjear NO te baja de nivel"], ["Cupones", "se usan en el checkout", "un cup\xF3n por compra"]];
      return `<div class="pcard pts"><div><small>Puntos disponibles</small><div class="big">${pts.toLocaleString()} <span>pts</span></div>
      <p>Nivel actual: <b>${ti.tier.name}</b>${ti.next ? ` \xB7 Pr\xF3ximo: ${ti.next.name}` : " \xB7 Nivel m\xE1ximo"}</p>
      <div class="prog"><span>${ti.next ? `Progreso hacia ${ti.next.name}` : "Has llegado al tope"}</span><span>${life.toLocaleString()}${ti.next ? ` / ${ti.next.min.toLocaleString()}` : ""} pts acumulados</span></div><div class="bar"><i style="width:${ti.pct}%"></i></div></div>
      <div class="medal" style="background:${ti.tier.color};color:${ti.tier.fg}">${svg3(I.star, 44, "currentColor")}<b>Nivel ${ti.tier.name}</b></div></div>
    <div class="stats3">${rules.map(([l, v, sb]) => `<div class="pcard"><small>${l}</small><b>${v}</b><span>${sb}</span></div>`).join("")}</div>
    <div class="pcard"><h2>Canjear puntos</h2><div class="rewards">${REWARDS.map((r) => `<div class="reward"><b>${r.label}</b><small>${r.cost.toLocaleString()} pts</small><button class="pbtn pbtn--p" data-redeem="${r.id}"${pts < r.cost ? " disabled" : ""}>${pts < r.cost ? `Te faltan ${(r.cost - pts).toLocaleString()}` : "Canjear"}</button></div>`).join("")}</div>
      ${coupons.length ? `<h4 class="subh">Mis cupones</h4>${coupons.map((c) => `<div class="mov"><span class="ico">%</span><div><b>${esc3(c.label)}</b><small>C\xF3digo ${esc3(c.code)} \xB7 canjeado el ${esc3(c.date)}</small></div><span class="pill pill--${c.used ? "bad" : "ok"}">${c.used ? "Usado" : "Disponible"}</span></div>`).join("")}` : ""}</div>
    <div class="pcard"><h2>Niveles</h2>${TIERS.map((t) => `<div class="tier${t.name === ti.tier.name ? " is-cur" : ""}"><span class="dot" style="background:${t.color}"></span><b>${t.name}</b><span>${t.min.toLocaleString()} pts acumulados</span><small>\u2248 $ ${(t.min * 1e3).toLocaleString("es-CO")} en compras</small></div>`).join("")}</div>
    <div class="pcard"><div class="phead"><h2>Historial de movimientos</h2></div>${list.length || coupons.length ? [
        ...list.map((r) => `<div class="mov"><span class="ico">${svg3(I.star)}</span><div><b>Compra: ${esc3(r.event)}</b><small>${esc3(r.date)}</small></div><strong>+${Math.round(r.total / 1e3).toLocaleString()} pts</strong></div>`),
        ...coupons.map((c) => `<div class="mov"><span class="ico">%</span><div><b>Canje: ${esc3(c.label)}</b><small>${esc3(c.date)}</small></div><strong style="color:#B91C1C">\u2212${c.cost.toLocaleString()} pts</strong></div>`)
      ].join("") : `<div class="empty2">No hay movimientos registrados.</div>`}</div>`;
    }
    function pwForm() {
      const f = (id, l, v) => `<div class="fg"><label for="${id}">${l}</label><div class="pw"><input id="${id}" type="${s.show ? "text" : "password"}" value="${esc3(v)}"><button type="button" data-show aria-label="Mostrar">${svg3(s.show ? I.eyeOff : I.eye, 15)}</button></div></div>`;
      const mismatch = s.nxt && s.conf && s.nxt !== s.conf ? "Las contrase\xF1as no coinciden." : "";
      return `<div class="sub2"><h4>Cambiar contrase\xF1a</h4>${f("cur", "Contrase\xF1a actual", s.cur)}${f("nxt", "Nueva contrase\xF1a", s.nxt)}${f("conf", "Confirmar nueva", s.conf)}
      ${mismatch || s.pwMsg ? `<p class="errtxt">${mismatch || s.pwMsg}</p>` : ""}${s.pwOk ? `<p class="oktxt">${svg3(I.check, 13)} Contrase\xF1a actualizada.</p>` : ""}
      <div class="row2"><button class="btn btn--navy" data-pwsave${mismatch ? " disabled" : ""}>Guardar</button><button class="btn btn--ghost2" data-pw>Cancelar</button></div></div>`;
    }
    function tabPerfil() {
      const p = info(), u = getCurrentUser();
      const L = { nombre: "Nombre completo", correo: "Correo electr\xF3nico", telefono: "Tel\xE9fono", ciudad: "Ciudad", empresa: "Empresa", cargo: "Cargo" };
      return `<div class="pgrid"><div>
      <div class="pcard"><div class="phead"><h2>Informaci\xF3n personal</h2>${s.editing ? `<span class="row2"><button class="pbtn pbtn--p" data-save>${svg3(I.check, 13)} Guardar</button><button class="pbtn" data-cancel>Cancelar</button></span>` : `<button class="pbtn" data-edit>${svg3(I.edit, 13)} Editar</button>`}</div>
        <div class="two">${Object.keys(L).map((k) => `<div><small>${L[k]}</small>${s.editing && (k !== "empresa" || u.role !== "agente") ? `<input class="pin" data-d="${k}" value="${esc3(s.draft[k])}">` : `<div class="val">${esc3(p[k] || "\u2014")}</div>`}</div>`).join("")}</div>
        ${s.saveErr ? `<p class="errtxt" style="margin-top:12px">${s.saveErr}</p>` : ""}${s.editing && u.role === "agente" ? `<p class="hint">La empresa de un agente no se puede cambiar porque depende de su c\xF3digo de acceso.</p>` : ""}</div>
      <div class="pcard"><h2>Seguridad</h2>
        <div class="srow"><div><b>${svg3(I.lock, 15)} Contrase\xF1a</b><small>Protege tu cuenta</small></div><button class="pbtn" data-pw>${s.pw ? "Cancelar" : "Cambiar"}</button></div>${s.pw ? pwForm() : ""}<hr>
        <div class="srow"><div><b>${svg3(I.shield, 15)} Autenticaci\xF3n de dos factores <span class="pill pill--${s.faOn ? "ok" : "bad"}">${s.faOn ? "Activa" : "Inactiva"}</span></b><small>${s.faOn ? "C\xF3digo por SMS en cada inicio de sesi\xF3n" : "Sin verificaci\xF3n adicional"}</small></div><button class="pbtn" data-fa>${s.fa ? "Cancelar" : "Cambiar"}</button></div>
        ${s.fa ? `<div class="sub2"><h4>${s.faOn ? "Desactivar" : "Activar"} autenticaci\xF3n de dos factores</h4><p>${s.faOn ? "Al desactivar 2FA tu cuenta quedar\xE1 protegida \xFAnicamente por contrase\xF1a. \xBFConfirmas?" : "Recibir\xE1s un c\xF3digo por SMS cada vez que inicies sesi\xF3n. \xBFDeseas activarlo?"}</p>${s.faOk ? `<p class="oktxt">${svg3(I.check, 13)} Listo.</p>` : ""}<div class="row2"><button class="btn btn--navy" data-faok>${s.faOn ? "Desactivar" : "Activar"}</button><button class="btn btn--ghost2" data-fa>Cancelar</button></div></div>` : ""}</div></div>
      <div class="pcard qr"><small>Credencial de acceso</small><h3>ID: ${esc3(u.id)}</h3><div class="qrbox" role="img" aria-label="QR de acceso">${qrSvg("SIXEVENT:" + u.id)}</div><p>Presenta este c\xF3digo QR desde tu celular para agilizar tu registro en los recintos.</p></div></div>`;
    }
    function modal() {
      const r = s.sel;
      if (!r) return "";
      return `<div class="modal" data-close><div class="modal__box wide"><div class="phead"><div><small>Detalle de reserva</small><b>${esc3(r.id)}</b></div><button class="lnk" data-close aria-label="Cerrar">${svg3(I.x, 18)}</button></div>
      <div class="phead"><h3>${esc3(r.event)}</h3>${pill(r.status)}</div>
      <div class="two">${[["Fecha", r.date], ["Categor\xEDa", r.category], ["Entradas", `${r.tickets} entrada${r.tickets > 1 ? "s" : ""}`], ["Recinto", r.venue]].map(([l, v]) => `<div><small>${l}</small><div class="val">${esc3(v)}</div></div>`).join("")}</div>
      <div class="sumr sumr--t"><span>Total pagado</span><b>${cop2(r.total)}</b></div>
      <div class="row2" style="margin-top:16px"><button class="btn btn--navy" style="flex:1" data-dl>${svg3(I.dl, 15)} Descargar boleta</button><button class="btn btn--ghost2" style="flex:1" data-close>Cerrar</button></div></div></div>`;
    }
    function draw() {
      const u = getCurrentUser();
      if (!u) return onBack();
      const list = u.reservations || [], pts = u.points || 0, ti = tierInfo(u.lifetimePoints ?? u.points ?? 0), pct = ti.pct;
      const title = TABS.find((t) => t[0] === s.tab)[1];
      root.innerHTML = `${modal()}<div class="prof"><aside class="pside"><img src="${logo_new_default}" alt="6ixEvent logo" height="40" style="mix-blend-mode:screen">
      <div class="who"><span class="avatar big-av">${esc3(u.name.slice(0, 2).toUpperCase())}</span><div><b>${esc3(u.name.split(" ").slice(0, 2).join(" "))}</b><small>${esc3(info().cargo)} \xB7 Nivel ${ti.tier.name}</small></div></div>
      <nav>${TABS.map(([k, l, ic2]) => `<button class="${s.tab === k ? "is-on" : ""}" data-tab="${k}">${svg3(ic2)} ${l}</button>`).join("")}<button data-logout>${svg3(I.logout)} Cerrar sesi\xF3n</button></nav>
      <div class="ptsbox"><small>Puntos acumulados</small><b>${pts.toLocaleString()}</b><div class="bar bar--l"><i style="width:${pct}%"></i></div><small>${ti.next ? `${ti.toNext.toLocaleString()} pts para ${ti.next.name}` : "Nivel m\xE1ximo"}</small></div>
      <button class="tbtn" data-back>${svg3(I.arrow, 13)} Volver al inicio</button></aside>
      <main class="pmain"><div class="phead"><h1>${title}</h1>${s.saved ? `<span class="oktxt">${svg3(I.check, 14)} Perfil actualizado</span>` : ""}</div>
      ${s.tab === "reservas" ? tabReservas(list) : s.tab === "puntos" ? tabPuntos(list, pts) : tabPerfil()}</main></div>`;
    }
    root.onclick = (e) => {
      const t = e.target, has = (k) => t.closest(`[${k}]`);
      const u = getCurrentUser(), list = u?.reservations || [];
      const tab = has("data-tab"), res = has("data-res");
      if (has("data-back")) return onBack();
      const rd = has("data-redeem");
      if (rd) {
        const r = REWARDS.find((x) => x.id === rd.dataset.redeem);
        if (r && (u.points || 0) >= r.cost) updateUser({ points: (u.points || 0) - r.cost, coupons: [{ code: "SIX-" + Math.random().toString(36).slice(2, 8).toUpperCase(), label: r.label, percent: r.percent, cost: r.cost, date: (/* @__PURE__ */ new Date()).toLocaleDateString("es-CO"), used: false }, ...u.coupons || []] });
        return draw();
      }
      if (has("data-logout")) {
        logout();
        return onBack();
      }
      if (tab) {
        s.tab = tab.dataset.tab;
        return draw();
      }
      if (res) {
        s.sel = list[Number(res.dataset.res)];
        return draw();
      }
      if (has("data-dl") && s.sel) return void downloadTicket(s.sel, u.name);
      if (has("data-close")) {
        if (t.closest(".modal__box") && !t.closest("button")) return;
        s.sel = null;
        return draw();
      }
      if (has("data-csv")) {
        const rows = list.map((r) => [r.id, `"${r.event}"`, r.date, r.tickets, r.total, (STATUS[r.status] ?? STATUS.confirmed)[0]]);
        return download("reservas_sixevent.csv", "\uFEFF" + [["ID", "Evento", "Fecha", "Entradas", "Total (COP)", "Estado"], ...rows].map((r) => r.join(",")).join("\n"), "text/csv;charset=utf-8;");
      }
      if (has("data-edit")) {
        s.draft = { ...info() };
        s.saveErr = "";
        s.editing = true;
        return draw();
      }
      if (has("data-cancel")) {
        s.editing = false;
        s.saveErr = "";
        return draw();
      }
      if (has("data-save")) {
        const d = s.draft, email = d.correo.trim();
        if (!email.includes("@")) {
          s.saveErr = "Ingresa un correo v\xE1lido.";
          return draw();
        }
        if (getUsers().some((x) => x.id !== u.id && x.email.toLowerCase() === email.toLowerCase())) {
          s.saveErr = "Ese correo ya est\xE1 registrado.";
          return draw();
        }
        const ok = updateUser({
          name: d.nombre.trim() || u.name,
          email,
          phone: d.telefono.trim(),
          city: d.ciudad.trim(),
          position: d.cargo.trim() || void 0,
          ...u.role === "agente" ? {} : { empresa: d.empresa.trim() || void 0 }
        });
        if (!ok) {
          s.saveErr = "El navegador no permiti\xF3 guardar los datos (almacenamiento bloqueado).";
          return draw();
        }
        s.saveErr = "";
        s.editing = false;
        s.saved = true;
        draw();
        setTimeout(() => {
          s.saved = false;
          draw();
        }, 2500);
        return;
      }
      if (has("data-pw")) {
        s.pw = !s.pw;
        s.fa = false;
        s.cur = s.nxt = s.conf = s.pwMsg = "";
        s.pwOk = false;
        return draw();
      }
      if (has("data-fa")) {
        s.fa = !s.fa;
        s.pw = false;
        s.faOk = false;
        return draw();
      }
      if (has("data-show")) {
        s.show = !s.show;
        return draw();
      }
      if (has("data-faok")) {
        s.faOk = true;
        draw();
        setTimeout(() => {
          s.faOn = !s.faOn;
          s.fa = false;
          s.faOk = false;
          draw();
        }, 900);
        return;
      }
      if (has("data-pwsave")) {
        if (!s.cur || !s.nxt || s.nxt !== s.conf) return;
        if (s.nxt.length < 6) {
          s.pwMsg = "La contrase\xF1a debe tener al menos 6 caracteres.";
          return draw();
        }
        if (u.password && s.cur !== u.password) {
          s.pwMsg = "La contrase\xF1a actual es incorrecta.";
          return draw();
        }
        updateUser({ password: s.nxt });
        s.pwMsg = "";
        s.pwOk = true;
        draw();
        setTimeout(() => {
          s.pw = false;
          s.pwOk = false;
          s.cur = s.nxt = s.conf = "";
          draw();
        }, 1200);
      }
    };
    root.oninput = (e) => {
      const t = e.target;
      if (t.dataset.d) s.draft[t.dataset.d] = t.value;
      else if (t.id === "cur" || t.id === "nxt" || t.id === "conf") {
        s[t.id] = t.value;
        if (t.id !== "cur") {
          const w = root.querySelector(".sub2 .errtxt");
          if (!w && s.nxt && s.conf && s.nxt !== s.conf) draw();
        }
      }
    };
    root.onsubmit = null;
    draw();
  }

  // src/dashboard.ts
  var esc4 = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var cop3 = (n) => "$ " + Math.round(n).toLocaleString("es-CO");
  var short = (n) => n >= 1e9 ? (n / 1e9).toFixed(1) + " mil M" : n >= 1e6 ? (n / 1e6).toFixed(1) + " M" : n >= 1e3 ? Math.round(n / 1e3) + " mil" : String(Math.round(n));
  var PALETTE = ["#1E3A5F", "#3B6EA5", "#D9C17A", "#8FB3DE", "#5C7FA3", "#B8A25A", "#C9D6E8"];
  function stats(e) {
    const cap = e.capacity ?? 0, sold = Math.max(0, cap - (e.availableTickets ?? cap));
    const cats = (e.ticketCategories ?? []).map((c) => ({ n: Math.max(0, (c.capacity ?? 0) - (c.available ?? c.capacity ?? 0)), price: c.price }));
    const catSold = cats.reduce((a, c) => a + c.n, 0);
    const revenue = Math.max(0, sold - catSold) * e.price + cats.reduce((a, c) => a + c.n * c.price, 0);
    return { cap, sold, revenue, occ: cap ? sold / cap * 100 : 0 };
  }
  function renderDashboard(root, onBack) {
    const u = getCurrentUser();
    if (!u || u.role === "cliente") return onBack();
    const users = getUsers();
    const company = (e) => e.company ?? users.find((x) => x.id === e.createdBy)?.empresa;
    const events = getEvents().filter((e) => u.role === "admin" || e.createdBy === u.id || !!u.empresa && company(e) === u.empresa);
    const rows = events.map((e) => ({ e, ...stats(e) }));
    const total = rows.reduce((a, r) => a + r.revenue, 0), sold = rows.reduce((a, r) => a + r.sold, 0), cap = rows.reduce((a, r) => a + r.cap, 0);
    const group = (key) => {
      const m = /* @__PURE__ */ new Map();
      rows.forEach((r) => m.set(key(r.e), (m.get(key(r.e)) ?? 0) + r.revenue));
      return [...m.entries()].sort((a, b) => b[1] - a[1]);
    };
    const byCat = group((e) => e.category), byCity = group((e) => e.city).slice(0, 6);
    const top = [...rows].sort((a, b) => b.revenue - a.revenue).slice(0, 8), maxRev = Math.max(1, ...top.map((r) => r.revenue)), maxCity = Math.max(1, ...byCity.map((c) => c[1]));
    const C = 2 * Math.PI * 70;
    let acc = 0;
    const donut = byCat.map(([, v], i) => {
      const len = total ? v / total * C : 0;
      const s = `<circle r="70" cx="90" cy="90" fill="none" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="32" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-acc}" transform="rotate(-90 90 90)"/>`;
      acc += len;
      return s;
    }).join("");
    const scope = u.role === "admin" ? "Todas las ventas de la plataforma" : `Eventos creados por ${esc4(u.empresa || u.name)}`;
    root.innerHTML = `<div class="dash"><header class="top"><div class="container top__in"><button class="tbtn" data-back>\u2190 Volver al inicio</button><img src="${logo_new_default}" alt="6ixEvent logo" height="36" style="mix-blend-mode:screen"></div></header>
  <div class="container dash__in"><div class="phead"><div><span class="eyebrow" style="color:var(--navy-l)">${u.role === "admin" ? "Administrador" : "Agente"}</span><h1>Panel de ventas</h1><p class="sub" style="margin:0">${scope}</p></div></div>
  ${rows.length ? `
  <div class="stats3 kpis">${[["Ingresos estimados", cop3(total), "boletas vendidas \xD7 precio"], ["Boletas vendidas", sold.toLocaleString(), `de ${cap.toLocaleString()} disponibles`], ["Ocupaci\xF3n promedio", (cap ? sold / cap * 100 : 0).toFixed(1) + "%", "vendidas / capacidad"], ["Eventos", String(events.length), `${rows.filter((r) => r.sold > 0).length} con ventas`]].map(([l, v, s]) => `<div class="pcard kpi"><small>${l}</small><b>${v}</b><span>${s}</span></div>`).join("")}</div>
  <div class="dgrid2"><div class="pcard"><h2>Ingresos por evento</h2>${top.map((r) => `<div class="hb"><span title="${esc4(r.e.title)}">${esc4(r.e.title)}</span><div><i style="width:${r.revenue / maxRev * 100}%"></i></div><b>${short(r.revenue)}</b></div>`).join("")}</div>
  <div class="pcard"><h2>Ventas por categor\xEDa</h2><div class="donut"><svg viewBox="0 0 180 180" role="img" aria-label="Ventas por categor\xEDa">${donut}<text x="90" y="86" text-anchor="middle" font-size="11" fill="#6B7280">Total</text><text x="90" y="104" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F">${short(total)}</text></svg>
    <ul>${byCat.map(([n, v], i) => `<li><i style="background:${PALETTE[i % PALETTE.length]}"></i>${esc4(n)}<b>${total ? Math.round(v / total * 100) : 0}%</b></li>`).join("")}</ul></div></div></div>
  <div class="pcard"><h2>Ventas por ciudad</h2><div class="vb">${byCity.map(([n, v]) => `<div><b>${short(v)}</b><i style="height:${Math.max(4, v / maxCity * 150)}px"></i><span>${esc4(n)}</span></div>`).join("")}</div></div>
  <div class="pcard"><h2>Detalle por evento</h2><div class="tscroll"><table><thead><tr>${["Evento", "Fecha", "Vendidas", "Ocupaci\xF3n", "Ingresos"].map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>
  ${[...rows].sort((a, b) => b.revenue - a.revenue).map((r) => `<tr><td><b>${esc4(r.e.title)}</b></td><td>${formatDateString(r.e.date)}</td><td>${r.sold.toLocaleString()} / ${r.cap.toLocaleString()}</td><td><div class="occ"><i style="width:${r.occ}%"></i></div> ${r.occ.toFixed(0)}%</td><td>${cop3(r.revenue)}</td></tr>`).join("")}</tbody></table></div></div>` : `<div class="pcard empty2">Todav\xEDa no hay eventos para mostrar. ${u.role === "agente" ? "Crea tu primer evento desde la p\xE1gina de inicio y sus ventas aparecer\xE1n aqu\xED." : ""}</div>`}</div></div>`;
    root.onclick = (e) => {
      if (e.target.closest("[data-back]")) onBack();
    };
    root.oninput = null;
    root.onsubmit = null;
  }

  // src/pages.ts
  var esc5 = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var svg4 = (d, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  var ARROW = "M19 12H5M12 19l-7-7 7-7";
  var CHECK = "M20 6L9 17l-5-5";
  var backBtn = (t = "\u2190 Volver") => `<button class="lnk back2" data-back>${t}</button>`;
  var CATS = ["Conferencia", "Congreso", "Exposici\xF3n", "Foro", "Gala", "Seminario", "Feria", "Taller"];
  var opts = (a, sel = "") => a.map((o) => `<option${o === sel ? " selected" : ""}>${esc5(o)}</option>`).join("");
  var withCur = (list, cur) => cur && !list.includes(cur) ? [...list, cur] : list;
  var catRow = (name = "", price = "", rm = true) => `<div class="catf"><input type="text" name="cn" placeholder="Nombre (Ej: VIP)" required value="${esc5(name)}"><input type="number" name="cp" min="0" placeholder="Valor (COP)" required value="${price}"><button type="button" class="pbtn" data-rm${rm ? "" : " disabled"}>\u2715</button></div>`;
  var renderCreateEvent = (root, onDone) => eventForm(root, onDone);
  var renderEditEvent = (root, ev, onDone) => eventForm(root, onDone, ev);
  function eventForm(root, onDone, ed) {
    const u = getCurrentUser();
    if (!u || u.role === "cliente" || ed && u.role !== "admin" && ed.createdBy !== u.id) return onDone();
    const country = ed?.country || "Colombia";
    const dept = ed?.department || (country === "Colombia" ? "Cundinamarca" : departments(country)[0]);
    const category = ed?.category;
    const rows = ed?.ticketCategories?.length ? ed.ticketCategories : [{ name: "General", price: "" }];
    root.innerHTML = `<div class="page"><div class="wrap">${backBtn()}<h1>${ed ? "Editar evento" : "Crear nuevo evento"}</h1>
  <p class="sub">${ed ? "Modifica los datos del evento y guarda los cambios." : "Ingresa los detalles completos del evento a publicar."}</p>
  <form id="ce" class="cform">
    <div class="fg"><label>T\xEDtulo del evento</label><input name="title" required value="${esc5(ed?.title)}"></div>
    <div class="fg"><label>Descripci\xF3n del evento</label><textarea name="description" rows="4" required placeholder="Cuenta de qu\xE9 trata el evento, qui\xE9n asiste y qu\xE9 se va a vivir.">${esc5(ed?.description)}</textarea></div>
    <div class="fg"><label>Categor\xEDa</label><select name="category">${opts(withCur(CATS, category), category)}</select></div>
    <div class="three">
      <div class="fg"><label>Pa\xEDs</label><select name="country">${opts(COUNTRIES, country)}</select></div>
      <div class="fg"><label>Departamento / Estado</label><select name="department">${opts(withCur(departments(country), dept), dept)}</select></div>
      <div class="fg"><label>Ciudad</label><select name="city">${opts(withCur(cities(country, dept), ed?.city), ed?.city)}</select></div></div>
    <div class="three"><div class="fg"><label>Fecha</label><input type="date" name="date" required value="${esc5(ed?.date)}"></div><div class="fg"><label>Hora inicio</label><input type="time" name="start" value="${esc5(ed?.startTime ?? "09:00")}" required></div><div class="fg"><label>Hora cierre</label><input type="time" name="end" value="${esc5(ed?.endTime ?? "18:00")}" required></div></div>
    <div class="two"><div class="fg"><label>Lugar / Recinto</label><input name="venue" placeholder="Ej: Corferias" required value="${esc5(ed?.venue)}"></div><div class="fg"><label>Capacidad total</label><input type="number" name="cap" min="1" placeholder="Ej: 500" required value="${esc5(ed?.capacity)}"></div></div>
    <div class="fg"><label>Agenda del d\xEDa</label><textarea name="agenda" rows="4" required placeholder="09:00 - Registro&#10;10:00 - Bienvenida">${esc5(ed?.agenda ?? "09:00 - Registro y apertura")}</textarea></div>
    <div class="fg"><div class="phead" style="margin-bottom:8px"><label style="margin:0">Categor\xEDas de entrada</label><button type="button" class="lnk" data-add>+ A\xF1adir categor\xEDa</button></div><div id="cats">${rows.map((r) => catRow(r.name, r.price, rows.length > 1)).join("")}</div></div>
    <div class="fg"><label>URL de la imagen</label><input type="url" name="img" required value="${esc5(ed?.img ?? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=380&fit=crop&auto=format")}"></div>
    <button class="btn btn--navy full" type="submit">${ed ? "Guardar cambios" : "Crear Evento"}</button></form></div></div>`;
    const cats = () => root.querySelector("#cats");
    const sel = (n) => root.querySelector(`select[name=${n}]`);
    const fill = (el, list) => {
      el.innerHTML = opts(list);
    };
    const sync = () => {
      const b = cats().querySelectorAll("[data-rm]");
      b.forEach((x) => x.disabled = b.length === 1);
    };
    root.onclick = (e) => {
      const t = e.target;
      if (t.closest("[data-back]")) return onDone();
      if (t.closest("[data-add]")) {
        cats().insertAdjacentHTML("beforeend", catRow());
        sync();
      }
      const rm = t.closest("[data-rm]");
      if (rm && cats().children.length > 1) {
        rm.closest(".catf").remove();
        sync();
      }
    };
    root.oninput = root.onchange = (e) => {
      const t = e.target;
      if (t.name === "country") {
        fill(sel("department"), departments(t.value));
        fill(sel("city"), cities(t.value, sel("department").value));
      }
      if (t.name === "department") fill(sel("city"), cities(sel("country").value, t.value));
    };
    root.onsubmit = (e) => {
      e.preventDefault();
      const f = new FormData(e.target), g = (k) => String(f.get(k) ?? "").trim();
      const names = f.getAll("cn").map(String), prices = f.getAll("cp").map(Number);
      const cap = parseInt(g("cap")), per = Math.floor(cap / names.length);
      const ticketCategories = names.map((n, i) => {
        const name = n.trim(), old = ed?.ticketCategories?.find((c) => c.name === name);
        const sold = old && old.capacity !== void 0 && old.available !== void 0 ? old.capacity - old.available : 0;
        return { name, price: prices[i], capacity: per, available: Math.max(0, per - sold) };
      }).filter((c) => c.name && c.price >= 0);
      const fields = {
        title: g("title"),
        description: g("description"),
        category: g("category"),
        country: g("country"),
        department: g("department"),
        city: g("city"),
        date: g("date"),
        price: (ticketCategories.find((c) => c.name.toLowerCase() === "general") ?? ticketCategories[0]).price,
        startTime: g("start"),
        endTime: g("end"),
        venue: g("venue"),
        agenda: f.get("agenda"),
        ticketCategories,
        img: g("img")
      };
      if (ed) {
        const sold = Math.max(0, (ed.capacity ?? 0) - (ed.availableTickets ?? ed.capacity ?? 0));
        updateEvent(ed.id, { ...fields, capacity: cap, availableTickets: Math.max(0, cap - sold) });
      } else addEvent({ ...fields, capacity: cap, availableTickets: cap, createdBy: u.id, company: u.role === "agente" ? u.empresa : void 0 });
      onDone();
    };
  }
  var IC = {
    search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    ticket: "M2 9a2 2 0 0 1 0-4V3h20v2a2 2 0 0 1 0 4v2a2 2 0 0 1 0 4v2H2v-2a2 2 0 0 1 0-4V9zM12 3v18",
    card: "M1 4h22v16H1zM1 10h22",
    dl: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.84 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
  };
  var STEPS = [
    [IC.search, "Explora los eventos", "Navega por nuestro cat\xE1logo de congresos, conferencias, simposios y galas. Filtra por ciudad, fecha o categor\xEDa para encontrar el evento que m\xE1s te convenga.", ["Usa la barra de b\xFAsqueda para buscar por nombre o ponente", "Filtra por ciudad y fecha desde el panel principal", "Haz clic en cualquier tarjeta para ver el detalle completo"]],
    [IC.user, "Crea tu cuenta o inicia sesi\xF3n", "Para reservar una entrada debes tener cuenta en SIX EVENT. El registro es gratuito y toma menos de 2 minutos. Solo necesitas tu documento de identidad y correo electr\xF3nico.", ["Puedes registrarte como cliente, agente o administrador", "Agentes requieren una clave de acceso especial", "Tu cuenta permite rastrear todas tus reservas"]],
    [IC.ticket, "Selecciona tus entradas", "Elige la categor\xEDa de entrada que mejor se adapte a tus necesidades (VIP Ejecutivo, General, Estudiante Afiliado). Indica la cantidad y revisa la disponibilidad en tiempo real.", ["M\xE1ximo 10 entradas por transacci\xF3n", "Verifica la disponibilidad antes de pagar", "Acumulas puntos con cada compra"]],
    [IC.card, "Realiza el pago", "Acepta tarjetas Visa, Mastercard, d\xE9bito y PSE. Todas las transacciones est\xE1n cifradas con tecnolog\xEDa SSL. El cargo por servicio es del 4% sobre el subtotal.", ["Pago 100% seguro con certificaci\xF3n PCI-DSS", "Opci\xF3n de pago con PSE para transferencia bancaria", "Factura electr\xF3nica enviada al correo registrado"]],
    [IC.dl, "Descarga tus boletas", "Recibir\xE1s las boletas en tu correo electr\xF3nico inmediatamente despu\xE9s del pago. Tambi\xE9n puedes descargarlas desde tu perfil en 'Mis Reservas' en cualquier momento.", ["Boleta en formato PDF con c\xF3digo QR \xFAnico", "V\xE1lida solo con documento de identidad del titular", "Descarga disponible hasta 30 d\xEDas despu\xE9s del evento"]],
    [IC.star, "Acumula y canjea puntos", "Por cada $1.000 COP en compras ganas 1 punto SIX EVENT. Canj\xE9alos por cupones de descuento en futuras reservas. Tu nivel depende de los puntos acumulados en total, no del saldo disponible.", ["Niveles: Bronce, Plata, Oro, Platino, Diamante y Plus", "Cada nivel exige muchos m\xE1s puntos que el anterior", "Canjea tus puntos por cupones de descuento del 10%, 25% o 50%"]]
  ];
  var RULES = [
    [IC.shield, "Identidad verificada", "Toda compra requiere documento de identidad v\xE1lido. El ingreso al evento se verifica con documento original."],
    [IC.alert, "Una compra a la vez", "Para garantizar disponibilidad, el sistema reserva temporalmente las entradas durante el proceso de pago (15 minutos)."],
    [CHECK, "Confirmaci\xF3n inmediata", "Una vez aprobado el pago, recibir\xE1s la confirmaci\xF3n y tus boletas en menos de 2 minutos en tu correo."],
    [IC.phone, "Soporte antes del evento", "Nuestro equipo est\xE1 disponible de lunes a s\xE1bado de 8 a.m. a 8 p.m. para resolver dudas sobre tu reserva."]
  ];
  var FAQS = [
    ["\xBFPuedo transferir mis entradas a otra persona?", "Las entradas son personales e intransferibles. Est\xE1n vinculadas al documento de identidad registrado en la compra y se validar\xE1n con documento al ingreso."],
    ["\xBFQu\xE9 pasa si el evento se cancela?", "Si el organizador cancela el evento, recibir\xE1s el reembolso total en 5 a 10 d\xEDas h\xE1biles. SIX EVENT no cobra comisi\xF3n por reembolsos por cancelaci\xF3n."],
    ["\xBFCu\xE1nto tiempo antes del evento puedo solicitar un reembolso?", "Puedes solicitar reembolso hasta 48 horas antes del evento con deducci\xF3n del 10% por gastos administrativos. Pasada esa fecha, no se procesar\xE1n reembolsos."],
    ["\xBFC\xF3mo verifico la autenticidad de mi boleta?", "Cada boleta lleva un c\xF3digo QR \xFAnico que se escanea en la puerta del evento. Nuestros organizadores disponen de lectores certificados que verifican la validez en tiempo real."],
    ["\xBFPuedo comprar entradas sin registrarme?", "No. Para proteger la seguridad de las transacciones y garantizar la identidad de los asistentes, es obligatorio tener cuenta en SIX EVENT para realizar compras."],
    ["\xBFC\xF3mo me convierto en organizador?", "Si eres agente autorizado (c\xF3digo de acceso 007\u2013010) o administrador, puedes crear y gestionar eventos desde el panel correspondiente."]
  ];
  function renderHowItWorks(root, onBack) {
    root.innerHTML = `<div class="how"><header class="top"><div class="container top__in"><button class="tbtn" data-back>${svg4(ARROW, 14)} Volver al inicio</button><img src="${logo_new_default}" alt="6ixEvent logo" height="36" style="mix-blend-mode:screen"></div></header>
  <section class="how__hero"><span class="eyebrow">Gu\xEDa de uso</span><h1>\xBFC\xF3mo funciona SIX EVENT?</h1><p>Todo lo que necesitas saber para encontrar, comprar y disfrutar eventos corporativos en Colombia con total seguridad.</p></section>
  <section class="container steps2">${STEPS.map(([ic2, t, d, tips], i) => `<article class="step"><div class="step__n"><span>${svg4(ic2, 22)}</span><b>0${i + 1}</b></div><div><h3>${t}</h3><p>${d}</p><ul>${tips.map((x) => `<li>${svg4(CHECK, 12)}${x}</li>`).join("")}</ul></div></article>`).join("")}</section>
  <section class="how__rules"><div class="container"><h2>Normas de uso</h2><p class="sub">Reglas que garantizan una experiencia segura y justa para todos.</p><div class="rules">${RULES.map(([ic2, t, d]) => `<div class="rule"><span>${svg4(ic2, 24)}</span><h3>${t}</h3><p>${d}</p></div>`).join("")}</div></div></section>
  <section class="container faq"><h2>Preguntas frecuentes</h2><p class="sub">Todo lo que necesitas saber antes de tu primera compra.</p>${FAQS.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>
  <section class="how__cta"><h2>\xBFListo para tu pr\xF3ximo evento?</h2><p>Explora el cat\xE1logo y reserva tus entradas con total confianza.</p><button class="btn btn--cream" data-back>Explorar eventos</button></section></div>`;
    root.onclick = (e) => {
      if (e.target.closest("[data-back]")) onBack();
    };
    root.oninput = null;
    root.onsubmit = null;
  }
  var ABOUT = { h: "Nuestra Historia", p: ["SIX EVENT nace con la misi\xF3n de revolucionar la gesti\xF3n y asistencia a eventos corporativos en Colombia. Hemos transformado la forma en que los profesionales descubren oportunidades de networking, capacitaci\xF3n y negocios.", "M\xE1s de 4.200 eventos gestionados nos respaldan como la plataforma l\xEDder y m\xE1s confiable para congresos, foros y ferias en todo el pa\xEDs."] };
  var TERMS = { h: "T\xE9rminos del Servicio", p: ["Al acceder y utilizar SIX EVENT, aceptas estar sujeto a los siguientes t\xE9rminos: la plataforma act\xFAa como intermediario tecnol\xF3gico para la venta de boletas. El organizador del evento es el \xFAnico responsable de la ejecuci\xF3n del mismo.", "Nos reservamos el derecho de suspender cuentas por comportamientos fraudulentos o reventa no autorizada."] };
  var DOCS = {
    "Precios": {
      h: "Nuestros Planes y Tarifas",
      p: ["Para organizadores de eventos, ofrecemos estructuras de precios escalables y transparentes. Para los asistentes, el precio final depende del evento, a\xF1adiendo un 4% de cargo por servicio sobre el valor de la boleta para garantizar transacciones seguras."],
      ul: ["<strong>Cuenta Cliente:</strong> Gratuita. Paga solo por las boletas que reservas.", "<strong>Cuenta Agente:</strong> Planes por comisi\xF3n desde 3.5% por boleta vendida + $500 COP fijos.", "<strong>Cuenta Admin/Enterprise:</strong> Contacta a nuestro equipo para despliegues a gran escala."]
    },
    "Empresa": ABOUT,
    "Acerca de nosotros": ABOUT,
    "Legal": TERMS,
    "T\xE9rminos y condiciones": TERMS,
    "Prensa": { h: "Sala de Prensa", p: ["Encuentra aqu\xED nuestros \xFAltimos comunicados, kit de marca y menciones en medios.", "Para consultas de medios, entrevistas o solicitudes de assets corporativos, escr\xEDbenos directamente a <strong>prensa@sixevent.co</strong>."] },
    "Alianzas": { h: "Programa de Partners", p: ["Construimos relaciones s\xF3lidas con recintos, hoteles, gremios y agencias de producci\xF3n. Ser un aliado de SIX EVENT significa potenciar tu alcance y brindar beneficios exclusivos a tus clientes."], cta: "Contactar equipo de Alianzas" },
    "Trabaja con nosotros": { h: "\xDAnete al equipo", p: ["Buscamos talento apasionado por la tecnolog\xEDa y la experiencia del usuario. Somos un equipo \xE1gil, innovador y orientado a resultados.", "Actualmente tenemos vacantes en: <strong>Ingenier\xEDa, Ventas Corporativas y Soporte B2B</strong>. Env\xEDa tu CV a <em>talento@sixevent.co</em>."] },
    "Pol\xEDtica de privacidad": { h: "Protecci\xF3n de Datos (Ley 1581 de 2012)", p: ["En SIX EVENT garantizamos la confidencialidad, libertad y seguridad de tus datos personales. La informaci\xF3n recolectada se usa exclusivamente para la gesti\xF3n de reservas, validaci\xF3n de identidad y env\xEDo de notificaciones importantes sobre tus eventos.", "No comercializamos tu informaci\xF3n con terceros no involucrados en la prestaci\xF3n del servicio."] },
    "Pol\xEDtica de reembolsos": {
      h: "Devoluciones y Cancelaciones",
      p: ["Los reembolsos est\xE1n sujetos a las pol\xEDticas espec\xEDficas de cada organizador. Por norma general:"],
      ul: ["Si un evento es cancelado, se reembolsar\xE1 el 100% del valor de la boleta (excluyendo el fee de servicio tecnol\xF3gico).", "Tienes derecho al retracto dentro de los primeros 5 d\xEDas h\xE1biles tras la compra, siempre que no falten menos de 48h para el evento."]
    },
    "Cookies": { h: "Uso de Cookies", p: ["Nuestra plataforma utiliza cookies t\xE9cnicas estrictamente necesarias para mantener tu sesi\xF3n activa y proteger tus reservas (como el token de carrito). Tambi\xE9n usamos cookies anal\xEDticas (anonimizadas) para entender c\xF3mo interact\xFAas con la web y mejorar la experiencia.", "Puedes gestionar tus preferencias desde la configuraci\xF3n de tu navegador."] }
  };
  function renderStatic(root, title, onBack) {
    const d = DOCS[title] ?? { h: "Informaci\xF3n no disponible", p: [`El contenido solicitado para "${esc5(title)}" est\xE1 siendo actualizado. Disculpa las molestias.`] };
    root.innerHTML = `<div class="page"><div class="wrap">${backBtn(`${svg4(ARROW)} Volver`)}<h1>${esc5(title)}</h1><div class="doc"><h3>${d.h}</h3>${(d.p ?? []).map((x) => `<p>${x}</p>`).join("")}
    ${d.ul ? `<ul>${d.ul.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}${d.cta ? `<a class="btn btn--navy" href="mailto:contacto@sixevent.co">${d.cta}</a>` : ""}</div></div></div>`;
    root.onclick = (e) => {
      if (e.target.closest("[data-back]")) onBack();
    };
    root.oninput = null;
    root.onsubmit = null;
  }

  // src/main.ts
  var esc6 = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var cop4 = (n) => "$ " + n.toLocaleString("es-CO");
  var $ = (sel) => document.querySelector(sel);
  var app = $("#app");
  var current = null;
  var ic = {
    search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
    calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    heart: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.84 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
    youtube: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.18 1 12 1 12s0 3.82.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.82 23 12 23 12s0-3.82-.46-5.58zM9.5 15.5v-7l6.5 3.5-6.5 3.5z",
    twitter: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"
  };
  var icon = (d, size = 16, fill = "none") => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  var ALL = "Todas las ciudades";
  var cityList = () => [ALL, ...Array.from(new Set(state.all.map((e) => e.city))).sort((a, b) => a.localeCompare(b, "es"))];
  var DATES = ["Cualquier fecha", "Esta semana", "Este mes", "Personalizado..."];
  var TAGS = ["Conferencias", "Congresos", "Exposiciones", "Galas", "Foros"];
  var PAGE_SIZE = 6;
  var state = {
    all: getEvents(),
    filtered: getEvents(),
    visible: PAGE_SIZE,
    category: null,
    q: "",
    city: ALL,
    date: DATES[0],
    start: "",
    end: ""
  };
  function navbar() {
    const u = getCurrentUser();
    const right = u ? `<button class="user-chip" data-go="profile"><span class="avatar">${esc6(u.name.charAt(0).toUpperCase())}</span><span class="hide-sm">${esc6(u.name.split(" ")[0])}</span></button>` : `<button class="link" data-go="login">Entrar</button><button class="btn btn--cream" data-go="register">Registro</button>`;
    return `<header class="nav"><div class="container nav__in">
    <a href="#" data-go="home"><img src="${logo_new_default}" alt="6ix Event logo" height="40"></a>
    <nav class="nav__links"><a class="hide-sm" href="#eventos">Eventos</a>
      <button class="link hide-sm" data-go="how">C\xF3mo funciona</button>${u && u.role !== "cliente" ? `<button class="link" data-go="dashboard">Panel</button>` : ""}${right}</nav></div></header>`;
  }
  var select = (id, ico, opts2, val, cls = "") => `<div class="field ${cls}">${icon(ico)}<select id="${id}" aria-label="${id}">${opts2.map((o) => `<option${o === val ? " selected" : ""}>${esc6(o)}</option>`).join("")}</select></div>`;
  function hero() {
    const stats2 = [["1.8M+", "Boletas vendidas"], ["4.200+", "Eventos gestionados"], ["620", "Organizadores activos"], ["38", "Ciudades en Colombia"]];
    return `<section><div class="hero__img">
    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=500&fit=crop&auto=format" alt="Auditorio corporativo">
    <div class="hero__shade"></div>
    <div class="hero__txt"><h1>Encuentra tu pr\xF3ximo evento</h1>
      <p>Congresos, conferencias y foros empresariales en toda Colombia. Boletas seguras en minutos.</p>
      <div class="stats">${stats2.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("")}</div></div></div>
    <div class="container searchbox"><div class="search">
      <div class="field">${icon(ic.search)}<input id="q" type="text" placeholder="Nombre del evento o ponente\u2026" value="${esc6(state.q)}"></div>
      ${select("city", ic.location, cityList(), state.city, "sm")}
      <div class="field sm" style="flex:0 0 200px">${icon(ic.calendar)}<select id="date" aria-label="Fecha">${DATES.map((o) => `<option${o === state.date ? " selected" : ""}>${o}</option>`).join("")}</select>
        <div class="range${state.date === DATES[3] ? " is-open" : ""}" id="range"><input type="date" id="start" value="${state.start}"><input type="date" id="end" value="${state.end}"></div></div>
      <button class="btn btn--navy" id="btn-search">${icon(ic.search, 15)} Buscar eventos</button></div>
      <div class="chips" id="chips"></div></div></section>`;
  }
  function card(e) {
    const u = getCurrentUser();
    const fav = !!u?.favorites?.includes(e.id);
    const canDel = u?.role === "admin" || u?.role === "agente" && e.createdBy === u.id;
    return `<div class="card-wrap">
    ${canDel ? `<button class="card__edit" data-editev="${e.id}" title="Editar evento" aria-label="Editar evento">\u270E</button><button class="card__del" data-del="${e.id}" title="Eliminar evento" aria-label="Eliminar evento">\u2715</button>` : ""}
    <article class="card" tabindex="0" role="button" data-event="${e.id}" aria-label="Ver detalles de ${esc6(e.title)}">
      <div class="card__img"><img src="${esc6(e.img)}" alt="${esc6(e.title)}" loading="lazy"><span class="badge">${esc6(e.category)}</span>
        <div class="card__tr"><button class="fav${fav ? " is-on" : ""}" data-fav="${e.id}" aria-pressed="${fav}" aria-label="${fav ? "Quitar de favoritos" : "Agregar a favoritos"}">${icon(ic.heart, 16, fav ? "currentColor" : "none")}</button>
        <span class="rating">${icon(ic.star, 12)}${e.rating}</span></div></div>
      <div class="card__body"><h3>${esc6(e.title)}</h3>
        <p class="meta">${icon(ic.location, 14)}${esc6(placeLabel(e))}</p><p class="meta">${icon(ic.calendar, 14)}${formatDateString(e.date)}</p><hr>
        <div class="price"><small>Precio desde</small><strong>${cop4(e.price)}</strong></div></div></article></div>`;
  }
  function eventsSection() {
    return `<section id="eventos"><div class="container"><div class="eyebrow">Pr\xF3ximas fechas</div><h2>Eventos destacados</h2>
    <div id="grid-root"></div><div class="more" id="more"></div></div></section>`;
  }
  function footer() {
    const cols = [
      ["Plataforma", ["Buscar eventos", "Mis boletas", "Crear evento", "Precios"]],
      ["Empresa", ["Acerca de nosotros", "Prensa", "Alianzas", "Trabaja con nosotros"]],
      ["Legal", ["T\xE9rminos y condiciones", "Pol\xEDtica de privacidad", "Pol\xEDtica de reembolsos", "Cookies"]]
    ];
    const social = [["YouTube", ic.youtube, "https://www.youtube.com/@orslokXX"], ["Twitter/X", ic.twitter, "https://x.com/orslok"], ["Instagram", ic.instagram, "https://www.instagram.com/orslokx/"]];
    return `<footer class="footer"><div class="container footer__in"><div class="footer__cols">
    <div><img src="${logo_new_default}" alt="6ixEvent logo" height="40" style="mix-blend-mode:screen">
      <p>Plataforma l\xEDder de venta de boletas y gesti\xF3n de eventos corporativos en Colombia.</p>
      <a href="tel:+5716074400">${icon(ic.phone, 14)} +57 601 744 0000</a><a href="mailto:contacto@sixevent.co">${icon(ic.mail, 14)} contacto@sixevent.co</a></div>
    ${cols.map(([t, ls]) => `<div><h4>${t}</h4><ul>${ls.map((l) => `<li><button data-footer="${l}">${l}</button></li>`).join("")}</ul></div>`).join("")}</div>
    <div class="footer__bar"><span>\xA9 2026 SIX EVENT S.A.S. \xB7 NIT 900.123.456-7 \xB7 Bogot\xE1, Colombia</span>
      <div class="footer__right">${social.map(([l, d, u]) => `<a href="${u}" target="_blank" rel="noopener noreferrer" aria-label="${l}">${icon(d, 15)}</a>`).join("")}
      ${["Visa", "Mastercard", "PSE", "Nequi"].map((p) => `<span class="pay">${p}</span>`).join("")}</div></div></div></footer>`;
  }
  function paintChips() {
    $("#chips").innerHTML = `<span>Categor\xEDas Populares:</span>` + TAGS.map((t) => {
      const on = state.category === t.slice(0, -1);
      return `<button class="chip${on ? " is-on" : ""}" data-cat="${t.slice(0, -1)}">${t}</button>`;
    }).join("");
  }
  function paintGrid() {
    const list = state.filtered.slice(0, state.visible);
    $("#grid-root").innerHTML = state.filtered.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<div class="empty">No se encontraron eventos con los filtros seleccionados.</div>`;
    const u = getCurrentUser();
    const canCreate = u?.role === "admin" || u?.role === "agente";
    $("#more").innerHTML = (state.visible < state.filtered.length ? `<button class="btn btn--ghost" id="btn-more">Ver m\xE1s eventos</button>` : "") + (canCreate ? `<button class="btn btn--cream" data-go="create-event">Crear nuevo evento</button>` : "");
  }
  function render(page, title) {
    window.scrollTo({ top: 0 });
    if (page === "home") return renderHome();
    if (page === "login" || page === "register") {
      app.innerHTML = `<main id="auth-root" style="flex:1"></main>${footer()}`;
      return renderLogin($("#auth-root"), page, () => go("home"), () => go("home"));
    }
    if (page === "how" || page === "create-event" || page === "edit-event" || page === "static") {
      app.innerHTML = `<main id="pg-root" style="flex:1"></main>${footer()}`;
      const root = $("#pg-root");
      if (page === "how") return renderHowItWorks(root, () => go("home"));
      if (page === "static") return renderStatic(root, title ?? "", () => go("home"));
      const done = () => {
        state.all = state.filtered = getEvents();
        state.category = null;
        state.visible = PAGE_SIZE;
        go("home");
      };
      if (page === "edit-event") return current ? renderEditEvent(root, current, done) : go("home");
      return renderCreateEvent(root, done);
    }
    if (page === "dashboard") {
      app.innerHTML = `<main id="dash-root" style="flex:1"></main>${footer()}`;
      return renderDashboard($("#dash-root"), () => go("home"));
    }
    if (page === "profile") {
      app.innerHTML = `<main id="prof-root" style="flex:1"></main>${footer()}`;
      return renderProfile($("#prof-root"), () => go("home"));
    }
    if ((page === "event" || page === "checkout") && current) {
      app.innerHTML = `<main id="scr" style="flex:1;background:linear-gradient(135deg,#1E3A5F,#3B6EA5)"></main>${footer()}`;
      const root = $("#scr");
      return page === "event" ? renderEventDetail(root, current, () => go("home"), () => go("checkout"), () => go("login")) : renderCheckout(root, current, () => go("event"), () => go("profile"));
    }
    const name = title ?? { login: "Iniciar sesi\xF3n", register: "Registro", how: "C\xF3mo funciona", profile: "Mi perfil", event: "Detalle del evento", checkout: "Pago", "create-event": "Crear evento", static: "Informaci\xF3n" }[page];
    app.innerHTML = `${navbar()}<main><section class="placeholder"><h1>${esc6(name)}</h1><p>Esta pantalla est\xE1 pendiente de migrar.</p><button class="btn btn--cream" data-go="home">Volver al inicio</button></section></main>${footer()}`;
  }
  var HASH = { home: "#/", login: "#/login", register: "#/registro", how: "#/como-funciona", profile: "#/perfil", "create-event": "#/crear-evento", dashboard: "#/panel" };
  function hashFor(page, title) {
    if (page === "event") return `#/evento/${current?.id}`;
    if (page === "edit-event") return `#/editar-evento/${current?.id}`;
    if (page === "checkout") return `#/checkout/${current?.id}`;
    if (page === "static") return `#/info/${encodeURIComponent(title ?? "")}`;
    return HASH[page] ?? "#/";
  }
  function go(page, title) {
    const h = hashFor(page, title);
    if (location.hash === h || h === "#/" && !location.hash) render(page, title);
    else location.hash = h;
  }
  function route() {
    const [a = "", b = ""] = location.hash.replace(/^#\/?/, "").split("/");
    const u = getCurrentUser();
    const ev = state.all.find((e) => String(e.id) === b) ?? null;
    switch (a) {
      case "login":
        return render("login");
      case "registro":
        return render("register");
      case "como-funciona":
        return render("how");
      case "info":
        return render("static", decodeURIComponent(b));
      case "perfil":
        return u ? render("profile") : go("login");
      case "crear-evento":
        return u ? render("create-event") : go("login");
      case "panel":
        return u && u.role !== "cliente" ? render("dashboard") : go("home");
      case "editar-evento":
        current = ev;
        return u && ev ? render("edit-event") : go(u ? "home" : "login");
      case "evento":
        current = ev;
        return ev ? render("event") : go("home");
      case "checkout":
        current = ev;
        return !ev ? go("home") : u ? render("checkout") : go("login");
      default:
        return render("home");
    }
  }
  function renderHome() {
    app.innerHTML = `${navbar()}<main>${hero()}${eventsSection()}</main>${footer()}`;
    paintChips();
    paintGrid();
  }
  function applyFilters() {
    const q = state.q.trim().toLowerCase();
    const today = /* @__PURE__ */ new Date();
    state.category = null;
    state.visible = PAGE_SIZE;
    state.filtered = state.all.filter((e) => {
      const d = new Date(e.date);
      let okDate = true;
      if (state.date === "Esta semana") okDate = d >= today && d.getTime() <= today.getTime() + 7 * 864e5;
      else if (state.date === "Este mes") okDate = d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      else if (state.date === DATES[3] && state.start && state.end) okDate = d >= new Date(state.start) && d <= new Date(state.end);
      return (!q || e.title.toLowerCase().includes(q)) && (state.city === ALL || e.city === state.city) && okDate;
    });
    paintChips();
    paintGrid();
    $("#eventos")?.scrollIntoView({ behavior: "smooth" });
  }
  document.addEventListener("click", (ev) => {
    const t = ev.target;
    const fav = t.closest("#grid-root [data-fav]");
    if (fav) {
      const u = getCurrentUser();
      if (!u) return go("login");
      const id = Number(fav.dataset.fav), favs = u.favorites ?? [];
      updateUser({ favorites: favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id] });
      return paintGrid();
    }
    const del = t.closest("#grid-root [data-del]");
    if (del) {
      if (confirm("\xBFEst\xE1s seguro de eliminar este evento?")) {
        deleteEvent(Number(del.dataset.del));
        state.all = state.filtered = getEvents();
        paintGrid();
      }
      return;
    }
    const cat = t.closest("#chips [data-cat]");
    if (cat) {
      const c = cat.dataset.cat;
      state.category = state.category === c ? null : c;
      state.visible = PAGE_SIZE;
      state.filtered = state.category ? state.all.filter((e) => e.category.startsWith(state.category)) : state.all;
      paintChips();
      return paintGrid();
    }
    const edit = t.closest("#grid-root [data-editev]");
    if (edit) {
      current = state.all.find((e) => e.id === Number(edit.dataset.editev)) ?? null;
      return go("edit-event");
    }
    const card2 = t.closest("#grid-root [data-event]");
    if (card2) {
      current = state.all.find((e) => e.id === Number(card2.dataset.event)) ?? null;
      return go("event");
    }
    const nav = t.closest("[data-go]");
    if (nav) {
      ev.preventDefault();
      return go(nav.dataset.go);
    }
    const foot = t.closest("[data-footer]")?.dataset.footer;
    if (foot) {
      const u = getCurrentUser();
      if (foot === "Buscar eventos") {
        go("home");
        return void setTimeout(() => $("#eventos")?.scrollIntoView({ behavior: "smooth" }), 60);
      }
      if (foot === "Mis boletas") return go(u ? "profile" : "login");
      if (foot === "Crear evento") {
        if (!u) return go("login");
        return u.role === "cliente" ? alert("Necesitas permisos de administrador o agente para crear un evento.") : go("create-event");
      }
      return go("static", foot);
    }
    if (t.closest("#btn-search")) return applyFilters();
    if (t.closest("#btn-more")) {
      state.visible += PAGE_SIZE;
      paintGrid();
    }
  });
  document.addEventListener("input", (ev) => {
    const t = ev.target;
    const map = {
      q: () => state.q = t.value,
      city: () => state.city = t.value,
      start: () => state.start = t.value,
      end: () => state.end = t.value,
      date: () => {
        state.date = t.value;
        $("#range")?.classList.toggle("is-open", t.value === DATES[3]);
      }
    };
    map[t.id]?.();
  });
  document.addEventListener("keydown", (ev) => {
    const t = ev.target;
    if (t.id === "q" && ev.key === "Enter") applyFilters();
    if (t.matches?.("[data-event]") && t === ev.currentTarget || t.matches?.("[data-event]") && (ev.key === "Enter" || ev.key === " ")) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        t.click();
      }
    }
  });
  function cookieBanner() {
    if (localStorage.getItem("sixevent_cookies")) return;
    const box = $("#cookie");
    const cats = [["Esenciales", "Necesarias para el funcionamiento del sitio. No se pueden desactivar."], ["Anal\xEDticas", "Nos ayudan a entender c\xF3mo interact\xFAas con la plataforma."], ["Marketing", "Permiten mostrar anuncios relevantes seg\xFAn tu actividad."]];
    box.innerHTML = `<div class="cookie"><div class="cookie__in"><div class="cookie__txt">
    <h3>Usamos cookies en SIX EVENT <span>GDPR</span></h3>
    <p>Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tr\xE1fico y personalizar contenido y publicidad. Al continuar navegando, aceptas nuestra <a href="#">Pol\xEDtica de cookies</a> y nuestra <a href="#">Pol\xEDtica de privacidad</a>.</p>
    <div class="cookie__cats" id="cookie-cats">${cats.map(([n, d]) => `<div><b>${n}</b>${d}</div>`).join("")}</div></div>
    <div class="cookie__act"><button class="btn btn--ghost" id="ck-cfg">Configurar</button>
    <button class="btn btn--navy" data-ck>\u2713 Aceptar todas</button><button class="btn btn--cream" data-ck>Aceptar selecci\xF3n</button></div></div></div>`;
    box.addEventListener("click", (ev) => {
      const t = ev.target;
      if (t.id === "ck-cfg") {
        const o = $("#cookie-cats").classList.toggle("is-open");
        t.textContent = o ? "Ocultar" : "Configurar";
      }
      if (t.hasAttribute("data-ck")) {
        localStorage.setItem("sixevent_cookies", "1");
        box.innerHTML = "";
      }
    });
  }
  window.addEventListener("hashchange", route);
  route();
  cookieBanner();
})();
