
'use strict';

if (!global._babelPolyfill) require('babel-polyfill');

var _require = require('path');

var basename = _require.basename;
var join = _require.join;

var _require2 = require('fs');

var exists = _require2.exists;
var mkdir = _require2.mkdir;

var _require3 = require('fs-extra');

var mkdirsSync = _require3.mkdirsSync;
var copy = _require3.copy;

var _require4 = require('child_process');

var spawn = _require4.spawn;


var homedir = require('os-homedir');

var glob = require('glob');

var Flow = require('node-async-flow');

var NWD = require('nwjs-download');

var _require5 = require('./util');

var ExtractZip = _require5.ExtractZip;
var ExtractTarGz = _require5.ExtractTarGz;


var DIR_CACHES = join(homedir(), '.nwjs-builder', 'caches');
mkdirsSync(DIR_CACHES);

// Extracted flag.
var FILENAME_DONE = '.done';

var GetExecutable = function GetExecutable(binaryDir, platform) {

    switch (platform) {
        case 'win32':
        case 'win-ia32':
        case 'win-x64':
            return join(binaryDir, 'nw.exe');
        case 'linux':
        case 'linux-ia32':
        case 'linux-x64':
            return join(binaryDir, 'nw');
        case 'darwin':
        case 'osx-ia32':
        case 'osx-x64':
            return join(binaryDir, 'nwjs.app/Contents/MacOS/nwjs');
        default:
            // FIXME: Application exits sliently.
            //throw new Error('ERROR_WHAT_THE_FUCK');
            return null;
    }
};

var ExtractBinary = function ExtractBinary(path, callback) {

    Flow(regeneratorRuntime.mark(function _callee(cb) {
        var destination, extract, done, doneExists;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        destination = null;
                        extract = null;

                        if (!path.endsWith('.zip')) {
                            _context.next = 7;
                            break;
                        }

                        destination = join(DIR_CACHES, basename(path).slice(0, -4));
                        extract = ExtractZip;
                        _context.next = 13;
                        break;

                    case 7:
                        if (!path.endsWith('.tar.gz')) {
                            _context.next = 12;
                            break;
                        }

                        destination = join(DIR_CACHES, basename(path).slice(0, -7));
                        extract = ExtractTarGz;
                        _context.next = 13;
                        break;

                    case 12:
                        return _context.abrupt('return', callback(new Error('ERROR_EXTENSION_NOT_SUPPORTED')));

                    case 13:
                        done = join(destination, FILENAME_DONE);
                        _context.next = 16;
                        return exists(done, cb.single);

                    case 16:
                        doneExists = _context.sent;

                        if (!doneExists) {
                            _context.next = 21;
                            break;
                        }

                        return _context.abrupt('return', callback(null, true, destination));

                    case 21:
                        return _context.abrupt('return', extract(path, destination, function (err, destination) {

                            if (err) {
                                return callback(err);
                            }

                            mkdir(done, function (err) {

                                if (err) {
                                    return callback(err);
                                }

                                return callback(null, false, destination);
                            });
                        }));

                    case 22:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
};

var DownloadAndExtractBinary = function DownloadAndExtractBinary(_ref, callback) {
    var _ref$version = _ref.version;
    var version = _ref$version === undefined ? null : _ref$version;
    var _ref$platform = _ref.platform;
    var platform = _ref$platform === undefined ? null : _ref$platform;
    var _ref$arch = _ref.arch;
    var arch = _ref$arch === undefined ? null : _ref$arch;
    var _ref$flavor = _ref.flavor;
    var flavor = _ref$flavor === undefined ? null : _ref$flavor;
    var _ref$mirror = _ref.mirror;
    var mirror = _ref$mirror === undefined ? null : _ref$mirror;


    // Download nw.js.

    NWD.DownloadBinary({
        version: version, platform: platform, arch: arch, flavor: flavor, mirror: mirror,
        showProgressbar: true
    }, function (err, fromCache, path) {

        if (err) {
            return callback(err);
        }

        // Extract nw.js.

        ExtractBinary(path, function (err, fromDone, binaryDir) {

            if (err) {
                return callback(err);
            }

            callback(err, fromCache, fromDone, binaryDir);
        });
    });
};

var DownloadAndExtractFFmpeg = function DownloadAndExtractFFmpeg(destination, _ref2, callback) {
    var _ref2$version = _ref2.version;
    var version = _ref2$version === undefined ? null : _ref2$version;
    var _ref2$platform = _ref2.platform;
    var platform = _ref2$platform === undefined ? null : _ref2$platform;
    var _ref2$arch = _ref2.arch;
    var arch = _ref2$arch === undefined ? null : _ref2$arch;


    // Download ffmpeg.

    NWD.DownloadFFmpeg({
        version: version, platform: platform, arch: arch,
        showProgressbar: true
    }, function (err, fromCache, path) {

        if (err) {
            return callback(err);
        }

        // Extract ffmpeg.

        ExtractZip(path, destination, function (err, destination) {

            if (err) {
                return callback(err);
            }

            callback(err, fromCache, destination);
        });
    });
};

var InstallFFmpeg = function InstallFFmpeg(sourceDir, destinationDir, platform, callback) {

    if (platform == 'win32') {

        copy(join(sourceDir, 'ffmpeg.dll'), join(destinationDir, 'ffmpeg.dll'), {
            clobber: true
        }, callback);
    } else if (platform == 'linux') {

        copy(join(sourceDir, 'libffmpeg.so'), join(destinationDir, 'lib', 'libffmpeg.so'), {
            clobber: true
        }, callback);
    } else if (platform == 'darwin') {

        glob(join(destinationDir, 'nwjs.app/**/libffmpeg.dylib'), {}, function (err, files) {

            if (err) {
                return calback(err);
            }

            if (files && files[0]) {

                // Overwrite libffmpeg.dylib.

                copy(join(sourceDir, 'libffmpeg.dylib'), files[0], {
                    clobber: true
                }, callback);
            }
        });
    } else {

        return callback(new Error('ERROR_PLATFORM_NOT_SUPPORTED'));
    }
};

var LaunchExecutable = function LaunchExecutable(executable, args, callback) {

    var cp = spawn(executable, args);

    if (!cp) return callback(new Error('ERROR_LAUNCH_FAILED'));

    cp.stdout.on('data', function (data) {
        return console.log(data.toString());
    });
    cp.stderr.on('data', function (data) {
        return console.error(data.toString());
    });

    cp.on('close', function (code) {
        return callback(null, code);
    });
};

Object.assign(module.exports, {
    util: require('./util'),
    commands: require('./commands'),
    GetExecutable: GetExecutable,
    ExtractBinary: ExtractBinary,
    DownloadAndExtractBinary: DownloadAndExtractBinary,
    DownloadAndExtractFFmpeg: DownloadAndExtractFFmpeg,
    InstallFFmpeg: InstallFFmpeg,
    BuildWin32Binary: require('./build/win32'),
    BuildLinuxBinary: require('./build/linux'),
    BuildDarwinBinary: require('./build/darwin'),
    LaunchExecutable: LaunchExecutable
});