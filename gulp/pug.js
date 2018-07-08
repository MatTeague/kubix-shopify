const $ = require('gulp-load-plugins')({
	rename: {
		'gulp-pug-linter': 'pugLint'
	},
	pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import lazypipe from 'lazypipe';
import { getConfigKeys, errorHandler } from './gulp/gulpconfig';

const env = getConfigKeys();

const localConfig = {
  src: './src/**/*.pug',
  base: 'src',
  dest: './dist/snippets'
};

const pugLinting = lazypipe()
.pipe($.pugLint)
.pipe($.pugLint.reporter);

gulp.task('pug', () => {
  return gulp.src(localConfig.src, { base: localConfig.base })
    .pipe($.plumber({ errorHandler }))
    .pipe($.if(env.lint, pugLinting))
    .pipe($.pug({ pretty: true }))
    .pipe(rename(appendLiquidExt))
    .pipe(gulp.dest(localConfig.dest))
    .pipe(theme.stream())
    .pipe(gulp.dest('./' + localConfig.base + '/liquid'))
});
