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
var jsonFileCSS = './cssFiles.json';
var jsonFileJS = './JSFiles.json';
var jsonFileAll = './allFiles.json';


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
			.pipe(performanceBudget(jsonFileAll))
			.pipe(gulp.dest('dest'))
			.on('end', function (err, data) {
       var _self = this;
        fs.readFile(jsonFileAll, 'utf8', function (err, data) {
          if (err) throw (err);
          data.length.should.be.above(0);
          done();
        });
		});
	});

  it('should create an object containing a property css', function (done) {
    gulp.src(testCSSSrc)
      .pipe(performanceBudget(jsonFileCSS))
      .pipe(gulp.dest('dest'))
      .on('end', function (err, data) {
        fs.readFile(jsonFileCSS, 'utf8', function (err, data) {
          if (err) throw (err);
          var dataObj = JSON.parse(data);
          dataObj.should.have.property('css');
          done();
        });
      });
  });

  it('should return a css value greater than zero', function(done){
    var ext = 'css';
     gulp.src(testCSSSrc)
      .pipe(performanceBudget(jsonFileCSS))
      .pipe(gulp.dest('dest'))
      .on('end', function (err, data) {
        fs.readFile(jsonFileCSS, 'utf8', function (err, data) {
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
