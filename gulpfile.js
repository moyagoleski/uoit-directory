var gulp = require('gulp'),
	gutil = require('gulp-util'),
	$ = require('gulp-load-plugins')(),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	babel = require('babelify'),
	del = require('del');

gulp.task('template', function() {
	return gulp.src('src/template/**/*.html')
		.pipe($.angularTemplatecache('templates.run.js', {
			templateHeader: `export const TemplateRun = ['$templateCache', function($templateCache) {`,
			templateFooter: '}];'
		}))
		.pipe(gulp.dest('src/components'));
});

gulp.task('js', ['template'], function() {
	return bundle();
});
function rebundle(bundler) {
	return bundler.bundle()
		.on('error', function(err) { console.error(err); this.emit('end'); })
		.pipe(source('build.js'))
		.pipe(buffer())
		.pipe($.sourcemaps.init({ loadMaps: true }))
		.pipe($.ngAnnotate())
		.pipe($.rename('uoit-directory.js'))
		.pipe(gulp.dest('dist'))
		.pipe($.uglify())
		.pipe($.rename({
			suffix: '.min'
		}))
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest('dist'))
		.pipe($.notify({
			message: 'Scripts task complete'
		}));
}
function bundle(watch) {
	var bundler = watchify(browserify('./src/directory.js', {
		debug: true
	}).transform(babel, {
		presets: ['es2015']
	}));
	if (watch) {
		bundler.on('update', function() {
			console.log('-> bundling...');
			return rebundle(bundler);
		});
	}
	return rebundle(bundler);
}

gulp.task('scss', function() {
	return gulp.src('src/scss/**/*.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass())
		.on('error', function(err) {
			console.error('Error!', err.message);
		})
		.pipe($.rename('uoit-directory.css'))
		.pipe(gulp.dest('dist'))
		.pipe($.minifyCss())
		.pipe($.rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'))
		.pipe($.sourcemaps.write())
		.pipe($.notify({
			message: 'Styles task complete'
		}));
});

gulp.task('html', function() {
	return gulp.src('src/index.html')
		.pipe(gulp.dest('example'))
		.pipe($.notify({
			message: 'html task complete'
		}));
});

gulp.task('watch', function() {
	gulp.watch('src/**/*.html', ['html']);
	gulp.watch('src/template/**/*.html', ['template', 'js']);
	gulp.watch('src/scss/**/*.scss', ['scss']);
	return bundle(true);
});

gulp.task('clean', function() {
	return del(['dist']);
});

gulp.task('run', ['clean'], function() {
	return gulp.start('html', 'scss', 'js', 'watch');
});

gulp.task('default', ['run'], function() {
	return gutil.log('Gulp is running!');
});