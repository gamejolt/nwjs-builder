
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if (!global._babelPolyfill) require('babel-polyfill');

var _require = require('path');

var dirname = _require.dirname;
var join = _require.join;
var resolve = _require.resolve;

var _require2 = require('fs');

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

var rcedit = require('rcedit');
var resourceHacker = require('node-resourcehacker');

var Flow = require('node-async-flow');

var NWD = require('nwjs-download');

var NWB = require('../../');

var BuildWin32Binary = function BuildWin32Binary(path, binaryDir, version, platform, arch, _ref, callback) {
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
    var _ref$sideBySideZip = _ref.sideBySideZip;
    var sideBySideZip = _ref$sideBySideZip === undefined ? false : _ref$sideBySideZip;
    var _ref$production = _ref.production;
    var production = _ref$production === undefined ? false : _ref$production;
    var _ref$winIco = _ref.winIco;
    var winIco = _ref$winIco === undefined ? null : _ref$winIco;


    var context = {};

    Flow(regeneratorRuntime.mark(function _callee2(cb) {
        var _this = this;

        var majorIdx, err, manifest, _ref2, _ref3, _err, _ref4, _ref5, _ret, _err2, rcOptions, properties, _err3, tempDir, _ref6, _ref7, _ref8, _ref9, _err4, workingDir, _ref10, _ref11, _err5, stdout, stderr, nodeModules, _ref12, _ref13, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, src, gl, dest, _err6, files, srcDir, destDir, _ref14, _ref15, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, file, _src, _dest, _err7, _err8, nwFile, _ref16, _ref17, _err9, _nwFile, _ref18, _ref19, executable, _err10, newName, _err11, zipFile, _ref20, _ref21;

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
                            var err, REGEX_FILTER_DONE;
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            err = void 0;


                                            console.log(majorIdx++ + ': Copy binary from ' + binaryDir);

                                            REGEX_FILTER_DONE = /[\\\/]\.done/;
                                            _context.next = 5;
                                            return copy(binaryDir, _this.buildDir, {
                                                filter: function filter(path) {
                                                    return !REGEX_FILTER_DONE.test(path);
                                                }
                                            }, cb.single);

                                        case 5:
                                            err = _context.sent;

                                            if (!err) {
                                                _context.next = 8;
                                                break;
                                            }

                                            return _context.abrupt('return', {
                                                v: callback(err)
                                            });

                                        case 8:
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
                        _err2 = void 0;


                        console.log(majorIdx++ + ': Edit Windows executable');

                        rcOptions = {
                            'version-string': {
                                // Comments: undefined,
                                // CompanyName: undefined,
                                // FileDescription: manifest.description,
                                // FileVersion: manifest.version,
                                // InternalName: undefined,
                                // LegalCopyright: undefined,
                                // LegalTrademarks: undefined,
                                // OriginalFilename: undefined,
                                // PrivateBuild: undefined,
                                // ProductName: manifest.name,
                                // ProductVersion: manifest.version,
                                // SpecialBuild: undefined,
                            }
                        };


                        assert(this.manifest.name);
                        assert(this.manifest.version);

                        rcOptions['version-string'].ProductName = this.manifest.name;
                        rcOptions['product-version'] = this.manifest.version;

                        if (this.manifest.description) {
                            rcOptions['version-string'].FileDescription = this.manifest.description;
                        }

                        if (this.manifest.nwjsBuilder) {
                            properties = this.manifest.nwjsBuilder;


                            if (properties.productName) {
                                rcOptions['version-string'].ProductName = properties.productName;
                            }

                            if (properties.productVersion) {
                                rcOptions['product-version'] = properties.productVersion;
                            }

                            if (properties.fileDescription) {
                                rcOptions['version-string'].FileDescription = properties.fileDescription;
                            }

                            if (properties.copyright) {
                                rcOptions['version-string'].LegalCopyright = properties.copyright;
                            }

                            if (properties.internalName) {
                                rcOptions['version-string'].InternalName = properties.internalName;
                            }

                            if (properties.fileVersion) {
                                rcOptions['file-version'] = properties.fileVersion;
                            }

                            if (properties.comments) {
                                rcOptions['version-string'].Comments = properties.comments;
                            }

                            if (properties.companyName) {
                                rcOptions['version-string'].CompanyName = properties.companyName;
                            }

                            if (properties.legalTrademarks) {
                                rcOptions['version-string'].LegalTrademarks = properties.legalTrademarks;
                            }

                            if (properties.originalFilename) {
                                rcOptions['version-string'].OriginalFilename = properties.originalFilename;
                            }

                            if (properties.privateBuild) {
                                rcOptions['version-string'].PrivateBuild = properties.privateBuild;
                            }

                            if (properties.specialBuild) {
                                rcOptions['version-string'].SpecialBuild = properties.specialBuild;
                            }
                        }

                        _context2.next = 39;
                        return rcedit(join(this.buildDir, 'nw.exe'), rcOptions, cb.single);

                    case 39:
                        _err2 = _context2.sent;


                        if (_err2) {
                            console.warn(_err2);
                        }

                        if (!winIco) {
                            _context2.next = 46;
                            break;
                        }

                        _context2.next = 44;
                        return resourceHacker({
                            operation: 'addoverwrite',
                            input: join(this.buildDir, 'nw.exe'),
                            output: join(this.buildDir, 'nw.exe'),
                            resource: winIco,
                            resourceType: 'ICONGROUP',
                            resourceName: 'IDR_MAINFRAME'
                        }, cb.single);

                    case 44:
                        _err2 = _context2.sent;


                        if (_err2) {
                            console.warn(_err2);
                        }

                    case 46:
                        if (!withFFmpeg) {
                            _context2.next = 69;
                            break;
                        }

                        _err3 = void 0, tempDir = void 0;


                        console.log(majorIdx++ + ': Install ffmpeg for nw.js ' + version);

                        // Make a temporary directory.

                        _context2.next = 51;
                        return temp.mkdir(null, cb.expect(2));

                    case 51:
                        _ref6 = _context2.sent;
                        _ref7 = _slicedToArray(_ref6, 2);
                        _err3 = _ref7[0];
                        tempDir = _ref7[1];

                        if (!_err3) {
                            _context2.next = 57;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err3));

                    case 57:
                        _context2.next = 59;
                        return NWB.DownloadAndExtractFFmpeg(tempDir, {
                            version: version, platform: platform, arch: arch
                        }, cb.expect(3));

                    case 59:
                        _ref8 = _context2.sent;
                        _ref9 = _slicedToArray(_ref8, 2);
                        _err3 = _ref9[0];

                        if (!_err3) {
                            _context2.next = 64;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err3));

                    case 64:
                        _context2.next = 66;
                        return NWB.InstallFFmpeg(tempDir, this.buildDir, platform, cb.single);

                    case 66:
                        _err3 = _context2.sent;

                        if (!_err3) {
                            _context2.next = 69;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err3));

                    case 69:
                        _err4 = void 0, workingDir = void 0;


                        console.log(majorIdx++ + ': Make working directory');

                        _context2.next = 73;
                        return temp.mkdir(null, cb.expect(2));

                    case 73:
                        _ref10 = _context2.sent;
                        _ref11 = _slicedToArray(_ref10, 2);
                        _err4 = _ref11[0];
                        workingDir = _ref11[1];

                        if (!_err4) {
                            _context2.next = 79;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err4));

                    case 79:
                        _context2.next = 81;
                        return copy(path, workingDir, cb.single);

                    case 81:
                        _err4 = _context2.sent;

                        if (!_err4) {
                            _context2.next = 84;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err4));

                    case 84:

                        this.workingDir = workingDir;

                        if (!production) {
                            _context2.next = 105;
                            break;
                        }

                        _err5 = void 0, stdout = void 0, stderr = void 0;
                        nodeModules = join(this.workingDir, 'node_modules');


                        console.log(majorIdx++ + ': Remove node_modules at ' + nodeModules);

                        _context2.next = 91;
                        return remove(nodeModules, cb.single);

                    case 91:
                        _err5 = _context2.sent;

                        if (!_err5) {
                            _context2.next = 94;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err5));

                    case 94:

                        console.log(majorIdx++ + ': Execute npm install at ' + this.workingDir);

                        _context2.next = 97;
                        return exec('npm install', {
                            cwd: this.workingDir
                        }, cb.expect(3));

                    case 97:
                        _ref12 = _context2.sent;
                        _ref13 = _slicedToArray(_ref12, 3);
                        _err5 = _ref13[0];
                        stdout = _ref13[1];
                        stderr = _ref13[2];

                        if (!_err5) {
                            _context2.next = 104;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err5));

                    case 104:

                        //console.log(stdout);
                        console.log(stderr);

                    case 105:
                        if (!includes) {
                            _context2.next = 176;
                            break;
                        }

                        console.log(majorIdx++ + ': Copy included files to ' + this.workingDir);

                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context2.prev = 110;
                        _iterator = includes[Symbol.iterator]();

                    case 112:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context2.next = 162;
                            break;
                        }

                        _step$value = _slicedToArray(_step.value, 3);
                        src = _step$value[0];
                        gl = _step$value[1];
                        dest = _step$value[2];
                        _err6 = void 0, files = void 0;
                        srcDir = resolve(src);
                        destDir = resolve(join(this.workingDir, dest));
                        _context2.next = 122;
                        return glob(gl, {
                            cwd: srcDir
                        }, cb.expect(2));

                    case 122:
                        _ref14 = _context2.sent;
                        _ref15 = _slicedToArray(_ref14, 2);
                        _err6 = _ref15[0];
                        files = _ref15[1];

                        if (!_err6) {
                            _context2.next = 128;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err6));

                    case 128:
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context2.prev = 131;
                        _iterator2 = files[Symbol.iterator]();

                    case 133:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context2.next = 145;
                            break;
                        }

                        file = _step2.value;
                        _src = resolve(join(srcDir, file));
                        _dest = resolve(join(destDir, file));
                        _context2.next = 139;
                        return copy(_src, _dest, cb.single);

                    case 139:
                        _err6 = _context2.sent;

                        if (!_err6) {
                            _context2.next = 142;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err6));

                    case 142:
                        _iteratorNormalCompletion2 = true;
                        _context2.next = 133;
                        break;

                    case 145:
                        _context2.next = 151;
                        break;

                    case 147:
                        _context2.prev = 147;
                        _context2.t1 = _context2['catch'](131);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context2.t1;

                    case 151:
                        _context2.prev = 151;
                        _context2.prev = 152;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 154:
                        _context2.prev = 154;

                        if (!_didIteratorError2) {
                            _context2.next = 157;
                            break;
                        }

                        throw _iteratorError2;

                    case 157:
                        return _context2.finish(154);

                    case 158:
                        return _context2.finish(151);

                    case 159:
                        _iteratorNormalCompletion = true;
                        _context2.next = 112;
                        break;

                    case 162:
                        _context2.next = 168;
                        break;

                    case 164:
                        _context2.prev = 164;
                        _context2.t2 = _context2['catch'](110);
                        _didIteratorError = true;
                        _iteratorError = _context2.t2;

                    case 168:
                        _context2.prev = 168;
                        _context2.prev = 169;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 171:
                        _context2.prev = 171;

                        if (!_didIteratorError) {
                            _context2.next = 174;
                            break;
                        }

                        throw _iteratorError;

                    case 174:
                        return _context2.finish(171);

                    case 175:
                        return _context2.finish(168);

                    case 176:
                        if (!sideBySide) {
                            _context2.next = 199;
                            break;
                        }

                        if (sideBySideZip) {
                            _context2.next = 187;
                            break;
                        }

                        _err7 = void 0;


                        console.log(majorIdx++ + ': Copy application from ' + this.workingDir);

                        _context2.next = 182;
                        return copy(this.workingDir, this.buildDir, cb.single);

                    case 182:
                        _err7 = _context2.sent;

                        if (!_err7) {
                            _context2.next = 185;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err7));

                    case 185:
                        _context2.next = 197;
                        break;

                    case 187:
                        _err8 = void 0, nwFile = void 0;


                        console.log(majorIdx++ + ': Compress application (save side-by-side zip to ' + sideBySideZip);

                        _context2.next = 191;
                        return NWB.util.ZipDirectory(this.workingDir, [], sideBySideZip, cb.expect(2));

                    case 191:
                        _ref16 = _context2.sent;
                        _ref17 = _slicedToArray(_ref16, 2);
                        _err8 = _ref17[0];
                        nwFile = _ref17[1];

                        if (!_err8) {
                            _context2.next = 197;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err8));

                    case 197:
                        _context2.next = 216;
                        break;

                    case 199:
                        _err9 = void 0, _nwFile = void 0;


                        console.log(majorIdx++ + ': Compress application');

                        _context2.next = 203;
                        return NWB.util.ZipDirectory(this.workingDir, [], temp.path(), cb.expect(2));

                    case 203:
                        _ref18 = _context2.sent;
                        _ref19 = _slicedToArray(_ref18, 2);
                        _err9 = _ref19[0];
                        _nwFile = _ref19[1];

                        if (!_err9) {
                            _context2.next = 209;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err9));

                    case 209:
                        executable = NWB.GetExecutable(this.buildDir, this.target);


                        console.log(majorIdx++ + ': Combine executable at ' + executable);

                        _context2.next = 213;
                        return NWB.util.CombineExecutable(executable, _nwFile, cb.single);

                    case 213:
                        _err9 = _context2.sent;

                        if (!_err9) {
                            _context2.next = 216;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err9));

                    case 216:
                        _err10 = void 0;
                        newName = (executableName ? executableName : this.manifest.name) + '.exe';


                        console.log(majorIdx++ + ': Rename application to ' + newName);

                        _context2.next = 221;
                        return rename(join(this.buildDir, 'nw.exe'), join(this.buildDir, newName), cb.single);

                    case 221:
                        _err10 = _context2.sent;

                        if (!_err10) {
                            _context2.next = 224;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err10));

                    case 224:
                        if (!(outputFormat == 'ZIP')) {
                            _context2.next = 241;
                            break;
                        }

                        _err11 = void 0;
                        zipFile = this.buildDir + '.zip';


                        console.log(majorIdx++ + ': Zip to ' + zipFile);

                        _context2.next = 230;
                        return NWB.util.ZipDirectory(this.buildDir, [], zipFile, cb.expect(2));

                    case 230:
                        _ref20 = _context2.sent;
                        _ref21 = _slicedToArray(_ref20, 1);
                        _err11 = _ref21[0];

                        if (!_err11) {
                            _context2.next = 235;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err11));

                    case 235:

                        console.log(majorIdx++ + ': Clean up ' + this.buildDir);

                        _context2.next = 238;
                        return remove(this.buildDir, cb.single);

                    case 238:
                        _err11 = _context2.sent;

                        if (!_err11) {
                            _context2.next = 241;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err11));

                    case 241:

                        console.log(majorIdx++ + ': Done');

                        callback(null, this.buildDir);

                    case 243:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[110, 164, 168, 176], [131, 147, 151, 159], [152,, 154, 158], [169,, 171, 175]]);
    }).bind(context));
};

module.exports = BuildWin32Binary;