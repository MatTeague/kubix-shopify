import pug from 'gulp-pug';
import pugLint from 'gulp-pug-linter';
import preprocess from 'gulp-preprocess';
import del from 'del';
import if from 'gulp-if';
import { errorHandler, getSecretKeys } from '../config';

const localConfig = {
  src: './src/**/*.pug',
  base: 'src',
  dest: './dist/'
};

gulp.task('pug', ['clean:html'], () => {
  return gulp.src(localConfig.src, { base: localConfig.base })
    .pipe(plumber({ errorHandler }))
    .pipe(pugLint())
    .pipe(pugLint.reporter())
    .pipe(pug({ pretty: true }))
    .pipe(preprocess({ context: getSecretKeys() }))
  .pipe(gulp.dest(localConfig.dest));
});
