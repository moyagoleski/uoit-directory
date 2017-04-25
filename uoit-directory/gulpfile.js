/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp'),
		gutil = require('gulp-util');
		sass = require('gulp-sass');
		jshint = require('gulp-jshint');
		sourcemaps = require('gulp-sourcemaps');
		uglify = require('gulp-uglify');
		concat = require('gulp-concat');

gulp.task('default', ['watch']);
// create a default task and just log a message
gulp.task('default', ['build-css'], function() {
	return gutil.log('Gulp is running!');
});

gulp.task('build-css', function() {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('assets/css/'));
});

/* updated watch task to include sass */

gulp.task('watch', function() {
	gulp.watch('src/scss/**/*.scss', ['build-css']);
});
