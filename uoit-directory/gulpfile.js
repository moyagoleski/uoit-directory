/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	sassLint = require('gulp-sass-lint'),
	notify = require('gulp-notify');


gulp.task('scss', function() {
	return gulp.src('src/scss/**/*.scss')
	 .pipe(sassLint({
      options: {
        formatter: 'stylish',
        'merge-default-rules': false
      },
      rules: {
        'no-ids': 1,
        'no-mergeable-selectors': 0
      },
      configFile: 'config/.sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())

		.pipe(sass())
		.on('error', function(err) {
			console.error('Error!', err.message);
		})
		.pipe(gulp.dest('./src/css'))
		.pipe(sourcemaps.init())
		.pipe(autoprefixer('last 2 version'))
		.pipe(minifycss())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist/css'))

		.pipe(sourcemaps.write('./'))
		.pipe(notify({
			message: 'Styles task complete'
		}));
});

gulp.task('copyHtml', function() {
	// copy any html files in source/ to public/
	return gulp.src('src/*.html')
		.pipe(gulp.dest('dist'))
		.pipe(notify({
			message: 'html task complete'
		}));
});


gulp.task('js', function() {
	return gulp.src('src/js/**/*.js')
		// .pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(notify({
			message: 'Scripts task complete'
		}));
});

gulp.task('watch', function() {
	gulp.watch('src/**/*.html', ['copyHtml']);
	gulp.watch('src/scss/**/*.scss', ['scss']);
	gulp.watch('src/js/**/*.js', ['js']);
	// Watch any files in dist/, reload on change

});


gulp.task('default', ['watch']);

gulp.task('default', ['copyHtml', 'scss', 'js'], function() {
	return gutil.log('Gulp is running!');
});
