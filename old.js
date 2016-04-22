// var baseObj = {
//   'name': [],
//   'size': [],
//   'totalSize': '0',
//   'percentage': '0'
// }

// var obj = {}

var fs = require('fs')

var budget = 1200
var rootPath = __dirname
var files = {
  styles: { name: 'styles', path: '/../public/_client/styles/' },
  fonts: { name: 'fonts', path: '/../public/_client/fonts/' },
  images: { name: 'images', path: '/../public/_client/images/' }
}

var obj = {
  styles: {
    'name': [],
    'size': [],
    'totalSize': '0',
    'percentage': '0'
  },
  fonts: {
    'name': [],
    'size': [],
    'totalSize': '0',
    'percentage': '0'
  },
  images: {
    'name': [],
    'size': [],
    'totalSize': '0',
    'percentage': '0'
  }
}

module.exports = function (gulp, runSeq, jsonFile) {
  'use strict'

  function createObj () {
    for (var item in files) {
      var name = files[item].name
      obj[name] = baseObj
    }
    console.log(obj)
  }

  function readDirectory (filePath, fileType) {
    fs.readdir(rootPath + filePath, function (err, fileName) {
      if (err) throw err
      readFileNames(filePath, fileName, fileType)
    })
  }

  function readFileNames (filePath, fileName, fileType) {
    for (var index = 0; index < fileName.length; index++) {
      if (fileName[index] === undefined) return
      pushToObj(fileType, 'name', fileName[index])
      getFileSize(filePath, fileName[index], fileType)
    }
  }

  function getFileSize (filePath, fileName, fileType, isLastItem) {
    var stats = fs.statSync(rootPath + filePath + fileName)
    var fileSize = (stats['size']) / 1000
    pushToObj(fileType, 'size', fileSize)
  }

  function pushToObj (fileType, property, data) {
    obj[fileType][property].push(data)
  }

  function getTotalSize (array, fileType) {
    var total = 0
    for (var index = 0; index < array.length; index++) {
      total += array[index]
    }
    obj[fileType].totalSize = Math.round(total)
  }

  var fileTypes = ['styles', 'fonts', 'images']

  function getPercentage () {
    for (var index = 0; index < fileTypes.length; index++) {
      var item = fileTypes[index]
      var percentage = (obj[item].totalSize / budget) * 100
      obj[item].percentage = percentage
    }
  }

  function writeToFile () {
    var arrayToJson = JSON.stringify(obj)

    fs.writeFile(jsonFile, arrayToJson, function (err) {
      if (err) throw err
      console.log('Written to file')
    })
  }

  gulp.task('budget:create', function () {
    // createObj()
  })

  gulp.task('budget:getData', function () {
    setTimeout(function () {
      for (var item in files) {
        readDirectory(files[item].path, files[item].name)
      }
    }, 10)
  })

  gulp.task('budget:getTotal', function () {
    setTimeout(function () {
      for (var item in files) {
        getTotalSize(obj[item].size, files[item].name)
      }
      getPercentage()
    }, 10)
  })

  gulp.task('budget:write', function () {
    setTimeout(function () {
      writeToFile()
    }, 10)
  })

  gulp.task('budget', function (cb) {
    runSeq(['budget:create'], ['budget:getData'], ['budget:getTotal'], ['budget:write'], cb)
  })
}
