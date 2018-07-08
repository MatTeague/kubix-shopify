const $ = require('gulp-load-plugins')({
	rename: {
		'gulp-group-css-media-queries': 'gcmq',
    'gulp-uglifycss': 'minifycss',
    'gulp-sass-lint': 'sassLint'
	},
	pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './config/webpack.config.js';
import { getConfigKeys, errorHandler } from './gulp/gulpconfig';

const env = getConfigKeys();

const localConfig = {
  src: './src/**/*.pug',
  base: 'src',
  dest: './dist/snippets'
};

const jsLinting = lazypipe()
.pipe(jshint) // notice the stream function has not been called!
.pipe(jshint.reporter)
.pipe(jshint.reporter, 'default');

gulp.task('js', () => {
	return gulp.src(settings.jsSrc)
	.pipe($.plumber({ errorHandler }))
	.pipe(dev ? $.sourcemaps.init() : '')
	.pipe(webpackStream(webpackConfig), webpack)
	.pipe($.jscs('.jscsrc'))
	.pipe(prod ? $.uglify() : '')
	.pipe(prod ? $.rename({ suffix: '.min' }) : '')
	.pipe(dev ? $.sourcemaps.write('maps') : '')
	.pipe(gulp.dest(paths.siteJsFiles))
	.pipe( theme.stream() );
    .pipe(gulp.dest(paths.assetsDir + 'js/complied/'));
});

gulp.task('legacyJS', () => {
	return gulp.src(paths.legacyJSGlob)
	.pipe($.plumber({ errorHandler: onError }))
	.pipe($.changed(paths.jsLegacyFiles).on('error', handleErrors))
	.pipe($.concat('legacy.js').on('error', handleErrors))
	.pipe($.uglify().on('error', handleErrors))
	.pipe($.rename({ suffix: '.min' }))
	.pipe(gulp.dest(paths.siteJsFiles))
	.pipe(gulp.dest(paths.jsLegacyFiles));
});