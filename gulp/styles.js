const $ = require('gulp-load-plugins')({
	rename: {
		'gulp-group-css-media-queries': 'gcmq',
    'gulp-uglifycss': 'minifycss',
    'gulp-sass-lint': 'sassLint'
	},
	pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import lazypipe from 'lazypipe';
import rucksack from 'rucksack-css';
import { getConfigKeys, errorHandler } from './gulp/gulpconfig';

const env = getConfigKeys();

const sourceMappingURLCSSregExp = new RegExp('(.*?[/*]{2,}# sourceMappingURL=)(.*?)([/*]{2})', 'g');
const sourceMappingURLCSSreplace = '{% raw %}$1{% endraw %}$2{% raw %}$3{% endraw %}';

const localConfig = {
  src: ['./src/**/*.scss', './src/**/*.sass', '! ./src/css/custom.css', '! ./src/**/*.min.css'],
  base: 'src',
  dest: './dist/assets',
  browsers: [
		'last 15 versions',
		'>1%',
		'ie >= 11',
		'ie_mob >= 10',
		'firefox >= 30',
		'Firefox ESR',
		'chrome >= 34',
		'safari >= 7',
		'opera >= 23',
		'ios >= 9',
		'android >= 4.4',
		'bb >= 10'
  ],
  convertFrom: 'sass',
  convertTo: 'scss',
  sassLint: '.sass-lint.yml',
  compile: true
};

const prefixer = {
	cascade: false
}

const ruckOptions = {
	fallbacks: true
};

const ifSassLint = [env.lint, localConfig.src];

const sassLinting = lazypipe()
.pipe($.sassLint, { config: localConfig.sassLint })
.pipe($.sassLint.format)
.pipe($.sassLint.failOnError);

gulp.task('styles', () => {
	return gulp.src(localConfig.src, { base: localConfig.base })
  .pipe($.plumber({ errorHandler }))
  .pipe($.if(ifSassLint, sassLinting))
	.pipe($.if(env.sourcemaps, $.sourcemaps.init())) // Start sourcemap.
  .pipe($.if(localConfig.src, $.sass(sassOptions).on('error', $.sass.logError)))
  .pipe($.replace( /({{|}}|{%|%})/g, '/*!$1*/' ) ) // Comment out Liquid tags, so no errors occur on sass compiling.
	.pipe($.postcss([$.autoprefixer(localConfig.browsers, prefixer),rucksack(ruckOptions)]).on('error', handleErrors))
	.pipe($.gcmq())
	.pipe($.csscomb())
	.pipe($.if(env.minify, $.minifycss()))
  .pipe($.if(env.minify, $.rename({ suffix: '.min' })))
  .pipe($.replace( /\/\*!({{|}}|{%|%})\*\//g, '$1' ) ) // Re-enable Liquid tags.
  .pipe($.if(env.sourcemaps, $.sourcemaps.write('.', { sourceMappingURL: makeLiquidSourceMappingURL }))) // Create the sourcemap.
  .pipe($.rename(appendLiquidExt)) // Adds .liquid to the end of the file type.
  .pipe($.if(env.sourcemaps, $.replace(sourceMappingURLCSSregExp, sourceMappingURLCSSreplace)))
  .pipe(gulp.dest(localConfig.dest))
  .pipe(theme.stream())
  .pipe(gulp.dest('./' + localConfig.base + '/css'));
});