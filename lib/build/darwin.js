
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if (!global._babelPolyfill) require('babel-polyfill');

var _require = require('path');

var dirname = _require.dirname;
var join = _require.join;
var resolve = _require.resolve;

var _require2 = require('fs');

var exists = _require2.exists;
var writeFile = _require2.writeFile;
var readFile = _require2.readFile;
var rename = _require2.rename;

var _require3 = require('fs-extra');

var readJson = _require3.readJson;
var emptyDir = _require3.emptyDir;
var copy = _require3.copy;
var remove = _require3.remove;

var _require4 = require('child_process');

var exec = _require4.exec;

var assert = require('assert');

var format = require('string-template');

var temp = require('temp').track();

var glob = require('glob');

var plist = require('plist');

var Flow = require('node-async-flow');

var NWD = require('nwjs-download');

var NWB = require('../../');

var BuildDarwinBinary = function BuildDarwinBinary(path, binaryDir, version, platform, arch, _ref, callback) {
    var _ref$outputDir = _ref.outputDir;
    var outputDir = _ref$outputDir === undefined ? null : _ref$outputDir;
    var _ref$outputName = _ref.outputName;
    var outputName = _ref$outputName === undefined ? null : _ref$outputName;
    var _ref$executableName = _ref.executableName;
    var executableName = _ref$executableName === undefined ? null : _ref$executableName;
    var _ref$outputFormat = _ref.outputFormat;
    var outputFormat = _ref$outputFormat === undefined ? null : _ref$outputFormat;
    var _ref$includes = _ref.includes;
    var includes = _ref$includes === undefined ? null : _ref$includes;
    var _ref$withFFmpeg = _ref.withFFmpeg;
    var withFFmpeg = _ref$withFFmpeg === undefined ? false : _ref$withFFmpeg;
    var _ref$sideBySide = _ref.sideBySide;
    var sideBySide = _ref$sideBySide === undefined ? false : _ref$sideBySide;
    var _ref$production = _ref.production;
    var production = _ref$production === undefined ? false : _ref$production;
    var _ref$macIcns = _ref.macIcns;
    var macIcns = _ref$macIcns === undefined ? null : _ref$macIcns;


    var context = {};

    Flow(regeneratorRuntime.mark(function _callee2(cb) {
        var _this = this;

        var majorIdx, err, manifest, _ref2, _ref3, _err, _ref4, _ref5, _ret, _err2, tempDir, _ref6, _ref7, _ref8, _ref9, _err3, workingDir, _ref10, _ref11, _err4, stdout, stderr, nodeModules, _ref12, _ref13, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, src, gl, dest, _err5, files, srcDir, destDir, _ref14, _ref15, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, file, _src, _dest, _err6, pl, infoFile, _ref16, _ref17, properties, _err7, _err8, _err9, newName, _err10, zipFile, _ref18, _ref19;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        majorIdx = 0;
                        err = void 0, manifest = void 0;


                        console.log(majorIdx++ + ': Read package.json');

                        _context2.next = 5;
                        return readJson(join(path, 'package.json'), cb.expect(2));

                    case 5:
                        _ref2 = _context2.sent;
                        _ref3 = _slicedToArray(_ref2, 2);
                        err = _ref3[0];
                        manifest = _ref3[1];

                        if (!err) {
                            _context2.next = 11;
                            break;
                        }

                        return _context2.abrupt('return', callback(err));

                    case 11:

                        this.manifest = manifest;
                        this.target = NWD.GetTarget(platform, arch);
                        this.buildName = format(outputName ? outputName : '{name}-{target}', {
                            name: manifest.name,
                            version: manifest.version,
                            platform: platform,
                            arch: arch,
                            target: this.target
                        });
                        this.buildDir = outputDir ? join(outputDir, this.buildName) : join(dirname(path), this.buildName);

                        _err = void 0;


                        console.log(majorIdx++ + ': Prepare build directory at ' + this.buildDir);

                        _context2.next = 19;
                        return emptyDir(this.buildDir, cb.expect(2));

                    case 19:
                        _ref4 = _context2.sent;
                        _ref5 = _slicedToArray(_ref4, 1);
                        _err = _ref5[0];

                        if (!_err) {
                            _context2.next = 24;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err));

                    case 24:
                        return _context2.delegateYield(regeneratorRuntime.mark(function _callee() {
                            var err, REGEX_FILTER_I18N, REGEX_FILTER_DONE;
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            err = void 0;


                                            console.log(majorIdx++ + ': Copy binary from ' + binaryDir);

                                            REGEX_FILTER_I18N = /[\\\/]nwjs\.app[\\\/]Contents[\\\/]Resources[\\\/][a-zA-Z0-9_]+\.lproj/;
                                            REGEX_FILTER_DONE = /[\\\/]\.done/;
                                            _context.next = 6;
                                            return copy(binaryDir, _this.buildDir, {
                                                // Ignore i18n files.
                                                filter: function filter(path) {
                                                    return !REGEX_FILTER_I18N.test(path) && !REGEX_FILTER_DONE.test(path);
                                                }
                                            }, cb.single);

                                        case 6:
                                            err = _context.sent;

                                            if (!err) {
                                                _context.next = 9;
                                                break;
                                            }

                                            return _context.abrupt('return', {
                                                v: callback(err)
                                            });

                                        case 9:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this);
                        })(), 't0', 25);

                    case 25:
                        _ret = _context2.t0;

                        if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
                            _context2.next = 28;
                            break;
                        }

                        return _context2.abrupt('return', _ret.v);

                    case 28:
                        if (!withFFmpeg) {
                            _context2.next = 51;
                            break;
                        }

                        _err2 = void 0, tempDir = void 0;


                        console.log(majorIdx++ + ': Install ffmpeg for nw.js ' + version);

                        // Make a temporary directory.

                        _context2.next = 33;
                        return temp.mkdir(null, cb.expect(2));

                    case 33:
                        _ref6 = _context2.sent;
                        _ref7 = _slicedToArray(_ref6, 2);
                        _err2 = _ref7[0];
                        tempDir = _ref7[1];

                        if (!_err2) {
                            _context2.next = 39;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err2));

                    case 39:
                        _context2.next = 41;
                        return NWB.DownloadAndExtractFFmpeg(tempDir, {
                            version: version, platform: platform, arch: arch
                        }, cb.expect(3));

                    case 41:
                        _ref8 = _context2.sent;
                        _ref9 = _slicedToArray(_ref8, 2);
                        _err2 = _ref9[0];

                        if (!_err2) {
                            _context2.next = 46;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err2));

                    case 46:
                        _context2.next = 48;
                        return NWB.InstallFFmpeg(tempDir, this.buildDir, platform, cb.single);

                    case 48:
                        _err2 = _context2.sent;

                        if (!_err2) {
                            _context2.next = 51;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err2));

                    case 51:
                        _err3 = void 0, workingDir = void 0;


                        console.log(majorIdx++ + ': Make working directory');

                        _context2.next = 55;
                        return temp.mkdir(null, cb.expect(2));

                    case 55:
                        _ref10 = _context2.sent;
                        _ref11 = _slicedToArray(_ref10, 2);
                        _err3 = _ref11[0];
                        workingDir = _ref11[1];

                        if (!_err3) {
                            _context2.next = 61;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err3));

                    case 61:
                        _context2.next = 63;
                        return copy(path, workingDir, cb.single);

                    case 63:
                        _err3 = _context2.sent;

                        if (!_err3) {
                            _context2.next = 66;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err3));

                    case 66:

                        this.workingDir = workingDir;

                        if (!production) {
                            _context2.next = 87;
                            break;
                        }

                        _err4 = void 0, stdout = void 0, stderr = void 0;
                        nodeModules = join(this.workingDir, 'node_modules');


                        console.log(majorIdx++ + ': Remove node_modules at ' + nodeModules);

                        _context2.next = 73;
                        return remove(nodeModules, cb.single);

                    case 73:
                        _err4 = _context2.sent;

                        if (!_err4) {
                            _context2.next = 76;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err4));

                    case 76:

                        console.log(majorIdx++ + ': Execute npm install at ' + this.workingDir);

                        _context2.next = 79;
                        return exec('npm install', {
                            cwd: this.workingDir
                        }, cb.expect(3));

                    case 79:
                        _ref12 = _context2.sent;
                        _ref13 = _slicedToArray(_ref12, 3);
                        _err4 = _ref13[0];
                        stdout = _ref13[1];
                        stderr = _ref13[2];

                        if (!_err4) {
                            _context2.next = 86;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err4));

                    case 86:

                        //console.log(stdout);
                        console.log(stderr);

                    case 87:
                        if (!includes) {
                            _context2.next = 158;
                            break;
                        }

                        console.log(majorIdx++ + ': Copy included files to ' + this.workingDir);

                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context2.prev = 92;
                        _iterator = includes[Symbol.iterator]();

                    case 94:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context2.next = 144;
                            break;
                        }

                        _step$value = _slicedToArray(_step.value, 3);
                        src = _step$value[0];
                        gl = _step$value[1];
                        dest = _step$value[2];
                        _err5 = void 0, files = void 0;
                        srcDir = resolve(src);
                        destDir = resolve(join(this.workingDir, dest));
                        _context2.next = 104;
                        return glob(gl, {
                            cwd: srcDir
                        }, cb.expect(2));

                    case 104:
                        _ref14 = _context2.sent;
                        _ref15 = _slicedToArray(_ref14, 2);
                        _err5 = _ref15[0];
                        files = _ref15[1];

                        if (!_err5) {
                            _context2.next = 110;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err5));

                    case 110:
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context2.prev = 113;
                        _iterator2 = files[Symbol.iterator]();

                    case 115:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context2.next = 127;
                            break;
                        }

                        file = _step2.value;
                        _src = resolve(join(srcDir, file));
                        _dest = resolve(join(destDir, file));
                        _context2.next = 121;
                        return copy(_src, _dest, cb.single);

                    case 121:
                        _err5 = _context2.sent;

                        if (!_err5) {
                            _context2.next = 124;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err5));

                    case 124:
                        _iteratorNormalCompletion2 = true;
                        _context2.next = 115;
                        break;

                    case 127:
                        _context2.next = 133;
                        break;

                    case 129:
                        _context2.prev = 129;
                        _context2.t1 = _context2['catch'](113);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context2.t1;

                    case 133:
                        _context2.prev = 133;
                        _context2.prev = 134;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 136:
                        _context2.prev = 136;

                        if (!_didIteratorError2) {
                            _context2.next = 139;
                            break;
                        }

                        throw _iteratorError2;

                    case 139:
                        return _context2.finish(136);

                    case 140:
                        return _context2.finish(133);

                    case 141:
                        _iteratorNormalCompletion = true;
                        _context2.next = 94;
                        break;

                    case 144:
                        _context2.next = 150;
                        break;

                    case 146:
                        _context2.prev = 146;
                        _context2.t2 = _context2['catch'](92);
                        _didIteratorError = true;
                        _iteratorError = _context2.t2;

                    case 150:
                        _context2.prev = 150;
                        _context2.prev = 151;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 153:
                        _context2.prev = 153;

                        if (!_didIteratorError) {
                            _context2.next = 156;
                            break;
                        }

                        throw _iteratorError;

                    case 156:
                        return _context2.finish(153);

                    case 157:
                        return _context2.finish(150);

                    case 158:
                        _err6 = void 0, pl = void 0;
                        infoFile = join(this.buildDir, 'nwjs.app', 'Contents', 'Info.plist');


                        console.log(majorIdx++ + ': Modify Info.plist at ' + infoFile);

                        _context2.next = 163;
                        return readFile(infoFile, {
                            encoding: 'utf-8'
                        }, function (err, data) {

                            if (err) {
                                return cb.expect(2)(err);
                            }

                            cb.expect(2)(null, plist.parse(data.toString()));
                        });

                    case 163:
                        _ref16 = _context2.sent;
                        _ref17 = _slicedToArray(_ref16, 2);
                        _err6 = _ref17[0];
                        pl = _ref17[1];

                        if (!_err6) {
                            _context2.next = 169;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err6));

                    case 169:

                        assert(this.manifest.name);
                        assert(this.manifest.version);

                        pl['CFBundleDisplayName'] = this.manifest.name;
                        pl['CFBundleName'] = this.manifest.name;
                        pl['CFBundleVersion'] = this.manifest.version;
                        pl['CFBundleShortVersionString'] = this.manifest.version;
                        pl['CFBundleIdentifier'] = 'io.nwjs-builder.' + this.manifest.name.toLowerCase();

                        if (this.manifest.nwjsBuilder) {
                            properties = this.manifest.nwjsBuilder;


                            if (properties.productName) {
                                pl['CFBundleDisplayName'] = properties.productName;
                                pl['CFBundleName'] = properties.productName;
                            }

                            if (properties.productVersion) {
                                pl['CFBundleVersion'] = properties.productVersion;
                                pl['CFBundleShortVersionString'] = properties.productVersion;
                            }

                            if (properties.bundleIdentifier) {
                                pl['CFBundleIdentifier'] = properties.bundleIdentifier;
                            }
                        }

                        _context2.next = 179;
                        return writeFile(infoFile, plist.build(pl), cb.single);

                    case 179:
                        _err6 = _context2.sent;

                        if (!_err6) {
                            _context2.next = 182;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err6));

                    case 182:
                        if (!macIcns) {
                            _context2.next = 203;
                            break;
                        }

                        _err7 = void 0, dest = void 0;


                        console.log(majorIdx++ + ': Copy .icns to ' + this.buildDir);

                        // For nw.js 0.12.x.
                        dest = join(this.buildDir, 'nwjs.app', 'Contents', 'Resources', 'nw.icns');
                        _context2.next = 188;
                        return exists(dest, cb.single);

                    case 188:
                        if (!_context2.sent) {
                            _context2.next = 194;
                            break;
                        }

                        _context2.next = 191;
                        return copy(macIcns, dest, cb.single);

                    case 191:
                        _err7 = _context2.sent;

                        if (!_err7) {
                            _context2.next = 194;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err7));

                    case 194:

                        // For modern nw.js.
                        dest = join(this.buildDir, 'nwjs.app', 'Contents', 'Resources', 'app.icns');
                        _context2.next = 197;
                        return exists(dest, cb.single);

                    case 197:
                        if (!_context2.sent) {
                            _context2.next = 203;
                            break;
                        }

                        _context2.next = 200;
                        return copy(macIcns, dest, cb.single);

                    case 200:
                        _err7 = _context2.sent;

                        if (!_err7) {
                            _context2.next = 203;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err7));

                    case 203:
                        _err8 = void 0;


                        console.log(majorIdx++ + ': Copy application from ' + this.workingDir);

                        _context2.next = 207;
                        return copy(this.workingDir, join(this.buildDir, 'nwjs.app', 'Contents', 'Resources', 'app.nw'), cb.single);

                    case 207:
                        _err8 = _context2.sent;

                        if (!_err8) {
                            _context2.next = 210;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err8));

                    case 210:
                        _err9 = void 0;
                        newName = (executableName ? executableName : this.manifest.name) + '.app';


                        console.log(majorIdx++ + ': Rename application to ' + newName);

                        _context2.next = 215;
                        return rename(join(this.buildDir, 'nwjs.app'), join(this.buildDir, newName), cb.single);

                    case 215:
                        _err9 = _context2.sent;

                        if (!_err9) {
                            _context2.next = 218;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err9));

                    case 218:
                        if (!(outputFormat == 'ZIP')) {
                            _context2.next = 235;
                            break;
                        }

                        _err10 = void 0;
                        zipFile = this.buildDir + '.zip';


                        console.log(majorIdx++ + ': Zip to ' + zipFile);

                        _context2.next = 224;
                        return NWB.util.ZipDirectory(this.buildDir, [], zipFile, cb.expect(2));

                    case 224:
                        _ref18 = _context2.sent;
                        _ref19 = _slicedToArray(_ref18, 1);
                        _err10 = _ref19[0];

                        if (!_err10) {
                            _context2.next = 229;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err10));

                    case 229:

                        console.log(majorIdx++ + ': Clean up ' + this.buildDir);

                        _context2.next = 232;
                        return remove(this.buildDir, cb.single);

                    case 232:
                        _err10 = _context2.sent;

                        if (!_err10) {
                            _context2.next = 235;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err10));

                    case 235:

                        console.log(majorIdx++ + ': Done');

                        callback(null, this.buildDir);

                    case 237:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[92, 146, 150, 158], [113, 129, 133, 141], [134,, 136, 140], [151,, 153, 157]]);
    }).bind(context));
};

module.exports = BuildDarwinBinary;