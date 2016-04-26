var gulp = require('gulp');
var through = require('through2');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');

var baseObj = {
  'name': [],
  'size': [],
  'totalSize': '0',
  'percentage': '0'
};

var name;
var obj = {};

// Consts
const PLUGIN_NAME = 'performance-budget';
const jsonFile = './test.json';
const rootPath = __dirname;

function performanceBudget (pbInfo) {
  function createObject () {
    name = Object.keys(pbInfo);

    for (var index = 0; index < name.length; index++) {
      var currentName = name[index];
      obj[currentName] = baseObj;
    };
  };

  function getFolders (dir) {
    return fs.readdirSync(dir).filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
  };

  function getFilePath (filePath) {
    var dir = rootPath + filePath;
    readDirectory(dir);
    var folders = getFolders(dir);

    folders.map(function (folder) {
      var test = path.join(dir, folder);
      readDirectory(test);
    });
  };

  function readDirectory (filePath) {
    fs.readdir(filePath, function (err, fileName) {
      if (err) throw err;

      for (var file in fileName) {
        var isFile = fs.lstatSync(filePath + '/' + fileName[file]).isFile();
        if (isFile) {
          // console.log(filePath + '/' + fileName[file]);
          console.log(fileName[file]);
        };
      };
    });
  };

  function pushToNamesArray () {

  };

  function writeToFile () {
    var arrayToJson = JSON.stringify(obj);
    fs.writeFile(jsonFile, arrayToJson, function (err, data) {
      if (err) throw (err);
    });
  };

  function generate (file, enc, cb) {
    if (file.isStream()) {
      cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return;
    };
    createObject();

    for (var item in pbInfo) {
      getFilePath(pbInfo[item]);
      console.log(pbInfo[item]);
    };

    writeToFile();
    return cb();
  };

  return through.obj(generate);
};

module.exports = performanceBudget;
