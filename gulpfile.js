var gulp = require('gulp'),
	gutil = require('gulp-util'),
	$ = require('gulp-load-plugins')(),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	babel = require('babelify');

function bundle(watch) {
	var bundler = watchify(browserify('./src/directory.js', {
		debug: true
	}).transform(babel, {
		presets: ['es2015']
	}));

	function rebundle() {
		bundler.bundle()
			.on('error', function(err) { console.error(err); this.emit('end'); })
			.pipe(source('build.js'))
			.pipe(buffer())
			.pipe($.sourcemaps.init({ loadMaps: true }))
			.pipe($.ngAnnotate())
			.pipe(gulp.dest('./dist/js'))
			.pipe($.uglify())
			.pipe($.rename({
				suffix: '.min'
			}))
			.pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/js'))
			.pipe($.notify({
				message: 'Scripts task complete'
			}));
	}

	if (watch) {
		bundler.on('update', function() {
			console.log('-> bundling...');
			rebundle();
		});
	}

	rebundle();
}

function watchBundle() {
	return bundle(true);
};

gulp.task('js-task', ['template-task'], function() {
	return bundle();
});

gulp.task('scss-task', function() {
	return gulp.src('src/scss/**/*.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass())
		.on('error', function(err) {
			console.error('Error!', err.message);
		})
		.pipe($.minifyCss())
		.pipe($.rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe($.sourcemaps.write())
		.pipe($.notify({
			message: 'Styles task complete'
		}));
});

gulp.task('html-task', function() {
	return gulp.src('src/**/*.html')
		.pipe(gulp.dest('dist'))
		.pipe($.notify({
			message: 'html task complete'
		}));
});

gulp.task('template-task', function() {
	return gulp.src('src/template/**/*.html')
		.pipe($.angularTemplatecache('templates.run.js', {
			templateHeader: `export const TemplateRun = ['$templateCache', function($templateCache) {`,
			templateFooter: '}];'
		}))
		.pipe(gulp.dest('src/components'));
});

gulp.task('watch', function() {
	gulp.watch('src/**/*.html', ['html-task']);
	gulp.watch('src/template/**/*.html', ['template-task']);
	gulp.watch('src/scss/**/*.scss', ['scss-task']);
	return watchBundle();
});

gulp.task('default', ['html-task', 'scss-task', 'js-task', 'watch'], function() {
	return gutil.log('Gulp is running!');
});