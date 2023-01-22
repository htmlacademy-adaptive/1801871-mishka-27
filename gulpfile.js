import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import squoosh from 'gulp-libsquoosh';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import {deleteAsync} from 'del';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ])
    .pipe(csso())
    )
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Html

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

//js

const js = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'));
}


//Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(gulp.dest('build/img'))
}

//webp

const webpImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh({
    webp: {}
    }))
    .pipe(gulp.dest('build/img'))
}

//svg

 const svgMin = () => {
  return gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
  .pipe(svgmin())
  .pipe(gulp.dest('build/img/svg'));
}

 const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(svgmin())
  .pipe(svgstore({
  inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
  }

// Copy

const copy = (done) => {
  gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
  ], {
  base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
  }


  // Clean

const clean = () => {
  return deleteAsync('build')
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
  }

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}


// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
  styles,
  html,
  js,
  svgMin,
  sprite,
  webpImages
  ),
  );

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
  styles,
  html,
  js,
  svgMin,
  sprite,
  webpImages
  ),
  gulp.series(
  server,
  watcher
  ));
