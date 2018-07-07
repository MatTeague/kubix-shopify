/*
 * gulpfile.js
 *
 * Spilt into multiple files for each task for easier management and configuration. Files within the gulp folder will automiatcially be added below.
 *
 */

var gulp = require( 'gulp' );
var dest = './dist/';
var src = './src/';
var plumber = require('gulp-plumber');

import config from './comfig/config.json'; 
import requireDir from 'require-dir';

requireDir('./gulp/', { recurse: true });
