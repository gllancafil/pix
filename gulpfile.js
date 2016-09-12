'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

const templateCache = require('gulp-angular-templatecache')
const minifyHtml = require('gulp-minify-html')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const ngannotate = require('gulp-ng-annotate')
const closure = require('gulp-jsclosure')
const p = require('path')
const useref = require('gulp-useref');

const paths = {
  javascripts: [
    './app/js/app.js',
    './app/js/templates.js',
    './app/js/*.js',
    './app/js/**/*.js'
  ],
  templates: [
    './app/templates/*.html',
    './app/templates/**/*.html'
  ]
}

gulp.task('templates', function() {
  return gulp.src(paths.templates)
   .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(templateCache({
      module: 'myModule.templates',
      standalone: true,
      transformUrl: function(url) {
        return url.replace(p.extname(url), '')
      }
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./src/js'))
})

gulp.task('scripts', ['templates'], function() {
  return gulp.src(paths.javascripts)
    //first, I'm building a clean 'main.js' file
    .pipe(concat('main.js'))
    .pipe(closure({angular: true}))
    .pipe(ngannotate())
    .pipe(gulp.dest('./dist'))
    //then, uglify the `main.js` and rename it to `main.min.js`
    //mangling might cause issues with angular
    .pipe(uglify({mangle: true}))
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('workflow', function () {
  gulp.src('./app/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist/css/'))
});

gulp.task('useref', function () {
  gulp.src('*.html')
      .pipe(useref())
  .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['scripts', 'workflow', 'useref'])

gulp.task('watch', ['default'], function() {
  let js = paths.javascripts.slice()
  js.splice(js.indexOf('./src/js/templates.js'), 1)
  gulp.watch(js, ['scripts'])
  gulp.watch('./app/sass/**/*.scss', ['workflow']);
})
