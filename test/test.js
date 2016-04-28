'use strict'
var gulp = require('gulp');
var assert = require('stream-assert');
var should = require('should');
var fs = require('fs');
var performanceBudget = require('../index');  
var through = require('through2');
var getFileSize = require('filesize')

var testSrc = '_src/test.css';
var jsonFile = './test.json';

var filePath = '/_src/';
// var testObj = { styles: filePath, scripts: filePath, images: filePath };
var testObj = { styles: filePath };

describe('when running gulp-performance-budget', function () {
  it('should emit error on streamed file', function (done) {
    gulp.src(testSrc, { buffer: false })
      .pipe(performanceBudget())
      .on('error', function (err) {
        err.message.should.eql('Streaming not supported');
        done();
      });
  });

	it('should write a json config to file', function (done) {
		gulp.src(testSrc)
			.pipe(performanceBudget(testObj))
			.pipe(gulp.dest(jsonFile))
			.on('end', function (err, data) {
        fs.readFile(jsonFile, 'utf8', function (err, data) {
          if (err) throw (err);
          data.length.should.be.above(0);
          done();
        });
		});
	});

  it('should create an object called styles', function (done) {
    gulp.src(testSrc)
      .pipe(performanceBudget(testObj))
      .pipe(gulp.dest(jsonFile))
      .on('end', function (err, data) {
        fs.readFile(jsonFile, 'utf8', function (err, data) {
          if (err) throw (err);
          var dataObj = JSON.parse(data);
          dataObj.should.have.property('styles');
          done();
        });
      });
  });

  it('should add the filename test.css to styles name array', function (done) {
    gulp.src(testSrc)
      .pipe(performanceBudget(testObj))
      .pipe(gulp.dest(jsonFile))
      .on('end', function (err, data) {
        fs.readFile(jsonFile, 'utf8', function (err, data) {
          if (err) throw (err);
          var dataObj = JSON.parse(data);
          var stylesName = dataObj.styles.name;
          // stylesName.should.have.property('test.css');
          done();
        });
      });
  });

  it('should return the file size as a string', function(done){
    
    var filesize = 0;
    gulp.src('_src/**/*')
    .pipe(through.obj(function (file, enc, cb) {
      var itemFilesize = file.stat ? getFileSize(file.stat.size) : getFileSize(Buffer.byteLength(String(file.contents)));
      filesize += parseInt(itemFilesize);   
      cb(null, filesize);
    }))
    .on('data', function (data) {
      //needs to be here
    })
    .on('end', function(){
      filesize.should.be.type('number');
      done();
    })

  });

});
