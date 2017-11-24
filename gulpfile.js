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
	return gulp.src('src/components/**/*.html')
		.pipe($.angularTemplatecache('templates.run.js', {
			templateHeader: `export const TemplateRun = ['$templateCache', function($templateCache) {`,
			templateFooter: '}];'
		}))
		.pipe(gulp.dest('src/components'))
		.pipe($.notify({
			message: 'Task "template" complete'
		}));
});

gulp.task('js', ['template'], function() {
	return bundle();
});
function rebundle(bundler) {
	return bundler.bundle()
		.on('error', function(err) {
			$.notify.onError({
				title: 'Javascript error!',
				message: err
			})
			this.emit('end');
		})
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
			message: 'Task "js" complete'
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
			gutil.log(`${gutil.colors.cyan('browserify')}:`, 'Rebundling...');
			return rebundle(bundler);
		});
	}
	return rebundle(bundler);
}

gulp.task('scss', function() {
	return gulp.src('src/scss/**/*.scss')
		.pipe($.plumber({
			errorHandler: $.notify.onError({
				title: 'Sass error!',
				message: '<%= error.message %>'
			})
		}))
		.pipe($.sourcemaps.init())
		.pipe($.sass())
		.pipe($.rename('uoit-directory.css'))
		.pipe(gulp.dest('dist'))
		.pipe($.minifyCss())
		.pipe($.rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'))
		.pipe($.sourcemaps.write())
		.pipe($.notify({
			message: 'Task "scss" complete'
		}));
});

gulp.task('html', function() {
	return gulp.src('src/{index.html,mail.php}')
		.pipe(gulp.dest('example'))
		.pipe($.notify({
			message: 'Task "html" complete'
		}));
});

gulp.task('watch', function() {
	gulp.watch('src/**/*.{php,html}', ['html']);
	gulp.watch('src/components/**/*.html', ['js']);
	gulp.watch('src/scss/**/*.scss', ['scss']);
	return bundle(true);
});

gulp.task('clean', function() {
	return del(['dist']);
});

gulp.task('run', ['clean'], function() {
	return gulp.start('html', 'scss', 'js', 'watch');
});

gulp.task('build', ['clean', 'html', 'scss', 'js']);

gulp.task('default', ['run'], function() {
	return gutil.log(`${gutil.colors.cyan('gulp')}:`, 'Watching for changes!');
});