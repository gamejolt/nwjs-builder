
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if (!global._babelPolyfill) require('babel-polyfill');

var _require = require('path');

var resolve = _require.resolve;

var _require2 = require('fs-extra');

var copy = _require2.copy;


var temp = require('temp').track();

var _require3 = require('./nwbuild');

var ParseNwBuilderVersion = _require3.ParseNwBuilderVersion;


var NWD = require('nwjs-download');

var Flow = require('node-async-flow');

var NWB = require('../');

var NwBuilderBuild = function NwBuilderBuild(path, options, callback) {

    var context = {};

    Flow(regeneratorRuntime.mark(function _callee(cb) {
        var err, version, flavor, _ref, _ref2, parts, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, platform, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, target, _err, _platform, arch, binaryDir, buildDir, _target, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        err = void 0, version = void 0, flavor = void 0;
                        _context.next = 3;
                        return ParseNwBuilderVersion(options.version, cb.expect(3));

                    case 3:
                        _ref = _context.sent;
                        _ref2 = _slicedToArray(_ref, 3);
                        err = _ref2[0];
                        version = _ref2[1];
                        flavor = _ref2[2];

                        if (!err) {
                            _context.next = 10;
                            break;
                        }

                        return _context.abrupt('return', callback(err));

                    case 10:

                        this.version = version;
                        this.flavor = flavor;

                        this.targets = [];

                        if (!options.platforms) {
                            _context.next = 59;
                            break;
                        }

                        parts = options.platforms.split(',');
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 18;
                        _iterator = parts[Symbol.iterator]();

                    case 20:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 43;
                            break;
                        }

                        platform = _step.value;
                        _context.t0 = platform;
                        _context.next = _context.t0 === 'win32' ? 25 : _context.t0 === 'win64' ? 27 : _context.t0 === 'linux32' ? 29 : _context.t0 === 'linux64' ? 31 : _context.t0 === 'osx32' ? 33 : _context.t0 === 'osx64' ? 35 : 37;
                        break;

                    case 25:
                        this.targets.push(['win', 'x86']);
                        return _context.abrupt('break', 40);

                    case 27:
                        this.targets.push(['win', 'x64']);
                        return _context.abrupt('break', 40);

                    case 29:
                        this.targets.push(['linux', 'x86']);
                        return _context.abrupt('break', 40);

                    case 31:
                        this.targets.push(['linux', 'x64']);
                        return _context.abrupt('break', 40);

                    case 33:
                        this.targets.push(['osx', 'x86']);
                        return _context.abrupt('break', 40);

                    case 35:
                        this.targets.push(['osx', 'x64']);
                        return _context.abrupt('break', 40);

                    case 37:
                        console.warn('WARN_PLATFORM_UNRECOGNIZED');
                        console.warn('platform:', platform);
                        return _context.abrupt('break', 40);

                    case 40:
                        _iteratorNormalCompletion = true;
                        _context.next = 20;
                        break;

                    case 43:
                        _context.next = 49;
                        break;

                    case 45:
                        _context.prev = 45;
                        _context.t1 = _context['catch'](18);
                        _didIteratorError = true;
                        _iteratorError = _context.t1;

                    case 49:
                        _context.prev = 49;
                        _context.prev = 50;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 52:
                        _context.prev = 52;

                        if (!_didIteratorError) {
                            _context.next = 55;
                            break;
                        }

                        throw _iteratorError;

                    case 55:
                        return _context.finish(52);

                    case 56:
                        return _context.finish(49);

                    case 57:
                        _context.next = 60;
                        break;

                    case 59:

                        this.targets.push([process.platform, process.arch]);

                    case 60:

                        this.path = path ? path : '.';

                        console.log(this);

                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context.prev = 65;
                        _iterator2 = this.targets[Symbol.iterator]();

                    case 67:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context.next = 118;
                            break;
                        }

                        target = _step2.value;
                        _err = void 0, _platform = void 0, arch = void 0, binaryDir = void 0, buildDir = void 0;
                        _target = _slicedToArray(target, 2);
                        _platform = _target[0];
                        arch = _target[1];
                        _context.next = 75;
                        return NWB.DownloadAndExtractBinary({
                            version: this.version,
                            platform: _platform,
                            arch: arch,
                            flavor: this.flavor,
                            mirror: options.mirror
                        }, cb.expect(4));

                    case 75:
                        _ref3 = _context.sent;
                        _ref4 = _slicedToArray(_ref3, 4);
                        _err = _ref4[0];
                        binaryDir = _ref4[3];

                        if (!_err) {
                            _context.next = 81;
                            break;
                        }

                        return _context.abrupt('return', callback(_err));

                    case 81:
                        _context.t2 = NWD.GetPlatform(_platform);
                        _context.next = _context.t2 === 'win32' ? 84 : _context.t2 === 'linux' ? 94 : _context.t2 === 'darwin' ? 104 : 114;
                        break;

                    case 84:
                        _context.next = 86;
                        return NWB.BuildWin32Binary(this.path, binaryDir, this.version, NWD.GetPlatform(_platform), NWD.GetArch(arch), {
                            outputDir: options.outputDir ? options.outputDir : null,
                            outputName: options.outputName ? options.outputName : null,
                            executableName: options.executableName ? options.executableName : null,
                            outputFormat: options.outputFormat ? options.outputFormat : null,
                            includes: options.includes ? options.includes : null,
                            withFFmpeg: options.withFFmpeg ? true : false,
                            sideBySide: options.sideBySide ? true : false,
                            production: options.production ? true : false,
                            winIco: options.winIco ? options.winIco : null
                        }, cb.expect(2));

                    case 86:
                        _ref5 = _context.sent;
                        _ref6 = _slicedToArray(_ref5, 2);
                        _err = _ref6[0];
                        buildDir = _ref6[1];

                        if (!_err) {
                            _context.next = 92;
                            break;
                        }

                        return _context.abrupt('return', callback(_err));

                    case 92:

                        console.log(NWD.GetTarget(_platform, arch) + ' build: ' + resolve(buildDir) + '.');

                        return _context.abrupt('break', 114);

                    case 94:
                        _context.next = 96;
                        return NWB.BuildLinuxBinary(this.path, binaryDir, this.version, NWD.GetPlatform(_platform), NWD.GetArch(arch), {
                            outputDir: options.outputDir ? options.outputDir : null,
                            outputName: options.outputName ? options.outputName : null,
                            executableName: options.executableName ? options.executableName : null,
                            outputFormat: options.outputFormat ? options.outputFormat : null,
                            includes: options.includes ? options.includes : null,
                            withFFmpeg: options.withFFmpeg ? true : false,
                            sideBySide: options.sideBySide ? true : false,
                            production: options.production ? true : false
                        }, cb.expect(2));

                    case 96:
                        _ref7 = _context.sent;
                        _ref8 = _slicedToArray(_ref7, 2);
                        _err = _ref8[0];
                        buildDir = _ref8[1];

                        if (!_err) {
                            _context.next = 102;
                            break;
                        }

                        return _context.abrupt('return', callback(_err));

                    case 102:

                        console.log(NWD.GetTarget(_platform, arch) + ' build: ' + resolve(buildDir) + '.');

                        return _context.abrupt('break', 114);

                    case 104:
                        _context.next = 106;
                        return NWB.BuildDarwinBinary(this.path, binaryDir, this.version, NWD.GetPlatform(_platform), NWD.GetArch(arch), {
                            outputDir: options.outputDir ? options.outputDir : null,
                            outputName: options.outputName ? options.outputName : null,
                            executableName: options.executableName ? options.executableName : null,
                            outputFormat: options.outputFormat ? options.outputFormat : null,
                            includes: options.includes ? options.includes : null,
                            withFFmpeg: options.withFFmpeg ? true : false,
                            sideBySide: options.sideBySide ? true : false,
                            production: options.production ? true : false,
                            macIcns: options.macIcns ? options.macIcns : null
                        }, cb.expect(2));

                    case 106:
                        _ref9 = _context.sent;
                        _ref10 = _slicedToArray(_ref9, 2);
                        _err = _ref10[0];
                        buildDir = _ref10[1];

                        if (!_err) {
                            _context.next = 112;
                            break;
                        }

                        return _context.abrupt('return', callback(_err));

                    case 112:

                        console.log(NWD.GetTarget(_platform, arch) + ' build: ' + resolve(buildDir));

                        return _context.abrupt('break', 114);

                    case 114:

                        console.log();

                    case 115:
                        _iteratorNormalCompletion2 = true;
                        _context.next = 67;
                        break;

                    case 118:
                        _context.next = 124;
                        break;

                    case 120:
                        _context.prev = 120;
                        _context.t3 = _context['catch'](65);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context.t3;

                    case 124:
                        _context.prev = 124;
                        _context.prev = 125;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 127:
                        _context.prev = 127;

                        if (!_didIteratorError2) {
                            _context.next = 130;
                            break;
                        }

                        throw _iteratorError2;

                    case 130:
                        return _context.finish(127);

                    case 131:
                        return _context.finish(124);

                    case 132:

                        callback(null);

                    case 133:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[18, 45, 49, 57], [50,, 52, 56], [65, 120, 124, 132], [125,, 127, 131]]);
    }).bind(context));
};

var NwBuilderRun = function NwBuilderRun(args, options, callback) {

    var context = {};

    Flow(regeneratorRuntime.mark(function _callee2(cb) {
        var err, version, flavor, binaryDir, workingDir, code, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _err2, tempDir, _ref17, _ref18, _ref19, _ref20, executable, _ref21, _ref22;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        err = void 0, version = void 0, flavor = void 0, binaryDir = void 0, workingDir = void 0, code = void 0;

                        // Parse platform and arch.

                        this.platform = process.platform;
                        this.arch = process.arch;

                        // Parse version.

                        _context2.next = 5;
                        return ParseNwBuilderVersion(options.version, cb.expect(3));

                    case 5:
                        _ref11 = _context2.sent;
                        _ref12 = _slicedToArray(_ref11, 3);
                        err = _ref12[0];
                        version = _ref12[1];
                        flavor = _ref12[2];

                        if (!err) {
                            _context2.next = 12;
                            break;
                        }

                        return _context2.abrupt('return', callback(err));

                    case 12:

                        this.version = version;
                        this.flavor = flavor;

                        console.log(this);

                        _context2.next = 17;
                        return NWB.DownloadAndExtractBinary({
                            version: this.version,
                            platform: this.platform,
                            arch: this.arch,
                            flavor: this.flavor,
                            mirror: options.mirror
                        }, cb.expect(4));

                    case 17:
                        _ref13 = _context2.sent;
                        _ref14 = _slicedToArray(_ref13, 4);
                        err = _ref14[0];
                        binaryDir = _ref14[3];

                        if (!err) {
                            _context2.next = 23;
                            break;
                        }

                        return _context2.abrupt('return', callback(err));

                    case 23:
                        _context2.next = 25;
                        return temp.mkdir(null, cb.expect(2));

                    case 25:
                        _ref15 = _context2.sent;
                        _ref16 = _slicedToArray(_ref15, 2);
                        err = _ref16[0];
                        workingDir = _ref16[1];

                        if (!err) {
                            _context2.next = 31;
                            break;
                        }

                        return _context2.abrupt('return', callback(err));

                    case 31:

                        console.log('workingDir: ' + workingDir);

                        _context2.next = 34;
                        return copy(binaryDir, workingDir, cb.single);

                    case 34:
                        err = _context2.sent;

                        if (!options.withFFmpeg) {
                            _context2.next = 58;
                            break;
                        }

                        _err2 = void 0, tempDir = void 0;


                        console.log('Install ffmpeg for nw.js ' + version);

                        // Make a temporary directory.

                        _context2.next = 40;
                        return temp.mkdir(null, cb.expect(2));

                    case 40:
                        _ref17 = _context2.sent;
                        _ref18 = _slicedToArray(_ref17, 2);
                        _err2 = _ref18[0];
                        tempDir = _ref18[1];

                        if (!_err2) {
                            _context2.next = 46;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err2));

                    case 46:
                        _context2.next = 48;
                        return NWB.DownloadAndExtractFFmpeg(tempDir, {
                            version: this.version,
                            platform: this.platform,
                            arch: this.arch
                        }, cb.expect(3));

                    case 48:
                        _ref19 = _context2.sent;
                        _ref20 = _slicedToArray(_ref19, 2);
                        _err2 = _ref20[0];

                        if (!_err2) {
                            _context2.next = 53;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err2));

                    case 53:
                        _context2.next = 55;
                        return NWB.InstallFFmpeg(tempDir, workingDir, this.platform, cb.single);

                    case 55:
                        _err2 = _context2.sent;

                        if (!_err2) {
                            _context2.next = 58;
                            break;
                        }

                        return _context2.abrupt('return', callback(_err2));

                    case 58:
                        executable = NWB.GetExecutable(workingDir, this.platform);
                        _context2.next = 61;
                        return NWB.LaunchExecutable(executable, args, cb.expect(2));

                    case 61:
                        _ref21 = _context2.sent;
                        _ref22 = _slicedToArray(_ref21, 2);
                        err = _ref22[0];
                        code = _ref22[1];

                        if (!err) {
                            _context2.next = 67;
                            break;
                        }

                        return _context2.abrupt('return', callback(err));

                    case 67:

                        console.log('nw.js exits with code ' + code + '.');

                        callback(null, code);

                    case 69:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }).bind(context));
};

var nwbuild = function nwbuild(pathOrArgs, options, callback) {

    if (options.include) {

        console.warn('options.include is deprecated, use options.includes instead.');
        options.includes = options.include;
    }

    if (options.withFfmpeg) {

        console.warn('options.withFfmpeg is deprecated, use options.withFFmpeg instead.');
        options.withFFmpeg = options.withFfmpeg;
    }

    if (!callback) {

        callback = function callback(err, code) {

            if (err) {
                console.error(err);
                return;
            }

            if (options.run) {
                process.exit(code);
            } else {
                console.log('All done.');
            }
        };
    }

    if (options.run) {

        NwBuilderRun(pathOrArgs, options, callback);
    } else {

        var path = Array.isArray(pathOrArgs) ? pathOrArgs[0] : pathOrArgs;

        NwBuilderBuild(path, options, callback);
    }
};

Object.assign(module.exports, {
    nwbuild: nwbuild
});