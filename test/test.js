'use strict'
var gulp = require('gulp');
var assert = require('stream-assert');
var should = require('should');
var fs = require('fs');
var performanceBudget = require('../index');  
var through = require('through2');

var testSrc = '_src/**/*';
var testCSSSrc = '_src/test.css';
var testJSSrc = '_src/test.js';
var jsonFile = './testing.json';

var filePath = '/_src/';

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
			.pipe(performanceBudget(jsonFile))
			.pipe(gulp.dest(jsonFile))
			.on('end', function (err, data) {
       var _self = this;
        fs.readFile(jsonFile, 'utf8', function (err, data) {
          if (err) throw (err);
          data.length.should.be.above(0);
          done();
        });
		});
	});

  it('should create an object containing a property css', function (done) {
    gulp.src(testCSSSrc)
      .pipe(performanceBudget())
      .pipe(gulp.dest(jsonFile))
      .on('end', function (err, data) {
        fs.readFile(jsonFile, 'utf8', function (err, data) {
          if (err) throw (err);
          var dataObj = JSON.parse(data);
          dataObj.should.have.property('css');
          done();
        });
      });
  });

  it('should return a css value greater than zero', function(done){
    var ext = 'css';
     gulp.src(testJSSrc)
      .pipe(performanceBudget())
      .pipe(gulp.dest(jsonFile))
      .on('end', function (err, data) {
        fs.readFile(jsonFile, 'utf8', function (err, data) {
          if (err) throw (err);
          var dataObj = JSON.parse(data);
          var cssVal = 0;
          if(dataObj.hasOwnProperty(ext)){
            cssVal = parseInt(dataObj[ext]);
          }
          cssVal.should.be.greaterThan(0);
          done();
        });
      });
  });

});
