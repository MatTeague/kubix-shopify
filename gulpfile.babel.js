/*
 * gulpfile.js
 *
 * Spilt into multiple files for each task for easier management and configuration. Files within the gulp folder will automiatcially be added below.
 *
 */

var gulp = require( 'gulp' );
var dest = './dist/';
var src = './src/';
var shopifytheme = require('gulp-shopify-theme').create();

import config from './comfig/config.json'; 
import requireDir from 'require-dir';

function handleErrors() {
	const args = Array.prototype.slice.call(arguments);

	// Send error to notification center with gulp-notify
	notify.onError({
		title: "Compile Error",
		message: "<%= error %>"
	}).apply(this, args);

	// Keep gulp from hanging on this task
	this.emit('end');
}

function makeLiquidSourceMappingURL (file) {
    return '{{"' + file.relative + '.map" | asset_url }}';
}

function appendLiquidExt (path) {
    if (path.extname === '.map') return;
    if (path.extname === '.css') {
        path.extname = '.scss';
    }
    if (path.extname === 'html') return;
    path.basename += path.extname;
    path.extname = '.liquid';
}

function flatten (path) {
    if (path.dirname !== '.') {
        path.basename = path.dirname.replace('/', '_') + '_' + path.basename;
    }
}

gulp.task('shopify-theme-init', () => {
    theme.init(config);
});

gulp.task('purge', [ 'theme' ], (done) => {
    theme.purge();
    done();
});

requireDir('./gulp/', { recurse: true });
