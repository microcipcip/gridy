'use strict';

//===============================================================/
//  =initialization
//===============================================================/

// include plugins
var gulp = require('gulp'),
  argv = require('yargs').argv,
  concat = require('gulp-concat'),
  changed = require('gulp-changed'),
  cssBase64 = require('gulp-css-base64'),
  cssImgSize = require("gulp-css-image-dimensions"),
  del = require('del'),
  es6Promise = require('es6-promise'), // required for autoprefixer
  gulpif = require('gulp-if'),
  gutil = require('gulp-util'), // this is used by 'del'
  header = require('gulp-header'),
  jeditor = require('gulp-json-editor'),
  jshint = require('gulp-jshint'),
  minifyCSS = require('gulp-clean-css'),
  prefix = require('gulp-autoprefixer'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  sass = require('gulp-sass'),
  stylish = require('jshint-stylish-ex'),
  uglify = require('gulp-uglify');

// set project details here
var project = {
    shortname: "Gridy", // do not add spaces or special chars (used on json)
    name: "Gridy",
    descr: "A Flexbox Gridy System",
    version: "0.9.1",
    url: "https://microcipcip.github.io/gridy/",
    author: "http://www.jertix.org"
  },
  projectInfo = '/*!' + ' \n' +
    '   *Name:          <%= pkg.name %>' + ' \n' +
    '   *Description:   <%= pkg.descr %>' + ' \n' +
    '   *Version:       <%= pkg.version %>' + ' \n' +
    '   *Website:       <%= pkg.url %>' + ' \n' +
    '*/' + ' \n';

// set variables for local/deployment/live
var isDev = argv.type === 'dev',
  isDeployment = argv.type === 'depl',
  isLive = argv.type === 'live';

// configure the path of each task
var gridPath = {
    src: 'src/',
    dist: 'dist/',
    distFiles: [ 'dist/**/*' ],
    root: ''
  },
  docsPath = {
    src: 'docs/src/',
    dist: 'docs/dist/',
    distFiles: [ 'docs/dist/**/*' ],
    root: ''
  },
  imgExt = '.{jpeg,jpg,png,gif,svg,cur,ico}',
  fontExt = '.{eot,ttf,otf,woff,woff2,svg}',
  audioExt = '.{wav,mp3}',
  path = {
    src: {
      gridscss: gridPath.src + '',
      gridscssFiles: gridPath.src + '**/*.scss',
      gridcss: gridPath.src + '',
      gridcssFiles: gridPath.src + '**/*.css',
      scss: docsPath.src + 'scss/',
      scssFiles: docsPath.src + 'scss/**/*.scss',
      css: docsPath.src + 'css/',
      cssFiles: docsPath.src + 'css/**/*.css',
      font: docsPath.src + 'fonts/',
      fontFiles: docsPath.src + 'fonts/**/*' + fontExt,
      js: docsPath.src + 'js/',
      jsFiles: docsPath.src + 'js/**/*.js',
      img: docsPath.src + 'img/',
      imgFiles: docsPath.src + 'img/**/*' + imgExt
    },
    dist: {
      gridscss: gridPath.dist + '',
      gridscssFiles: gridPath.dist + '**/*.scss',
      gridcss: gridPath.dist + '',
      gridcssFiles: gridPath.dist + '**/*.css',
      css: docsPath.dist + 'css/',
      cssFiles: docsPath.dist + 'css/**/*.css',
      font: docsPath.dist + 'fonts/',
      fontFiles: docsPath.dist + 'fonts/**/*' + fontExt,
      js: docsPath.dist + 'js/',
      jsFiles: docsPath.dist + 'js/**/*.js',
      img: docsPath.dist + 'img/',
      imgFiles: docsPath.dist + 'img/**/*' + imgExt
    },
    imgPath: '../img',
    json: 'package.json'
  };



//===============================================================/
//  =tasks
//===============================================================/

// clean
gulp.task('clean', function (cb) {
  del(gridPath.distFiles, cb);
  del(docsPath.distFiles, cb);
});

// sass and css grid
gulp.task('cssGrid', function () {
  gulp.src(path.src.gridscssFiles)
    .pipe(plumber())
    .pipe(sass({
      sourceComments: null,
      precision: 7
    }))
    .pipe(prefix({
      browsers: [ 'last 2 versions', '> 1%' ],
      cascade: false
    }))
    .pipe(header(projectInfo, { pkg: project }))
    .pipe(gulp.dest('dist'))
    .pipe(minifyCSS())
    .pipe(rename('gridy.min.css'))
    .pipe(gulp.dest(gridPath.dist));
});

// sass and css
gulp.task('css', function () {
  gulp.src(path.src.scssFiles)
    .pipe(plumber())
    // compile sass, combine media queries, autoprefix and minify
    .pipe(sass({ sourceComments: null }))
    .pipe(prefix({
      browsers: [ 'last 2 versions', '> 1%' ],
      cascade: false
    }))
    .pipe(cssImgSize(path.imgPath))
    .pipe(gulpif(!isDev, cssBase64({
      baseDir: path.imgPath,
      maxWeightResource: 10000,
      extensionsAllowed: [ '.gif', '.jpg', '.png' ]
    })))
    .pipe(gulpif(!isDev, minifyCSS()))
    .pipe(header(projectInfo, { pkg: project }))
    .pipe(gulp.dest(path.dist.css));
});

// scripts
gulp.task('js', function () {
  // detect errors in custom.js
  gulp.src(path.src.js + 'custom.js')
    .pipe(plumber())
    .pipe(gulpif(isDev, jshint()))
    .pipe(gulpif(isDev, jshint.reporter(stylish)))
  // concatenate and minify files
  gulp.src([
    path.src.js + 'plugins/*.js',
    path.src.js + 'custom.js'
  ])
    .pipe(plumber())
    .pipe(changed(path.dist.js))
    .pipe(concat('./scripts.js'))
    .pipe(gulpif(!isDev, uglify({ preserveComments: 'some' })))
    .pipe(header(projectInfo, { pkg: project }))
    .pipe(gulp.dest(path.dist.js));
  // move vendors and polyfill files in the dist folder
  gulp.src([
    path.src.js + 'vendor/*.js',
    path.src.js + 'polyfill/*.js'
  ])
    .pipe(plumber())
    .pipe(changed(path.dist.js))
    .pipe(gulp.dest(path.dist.js));
});

// fonts
gulp.task('font', function () {
  gulp.src(path.src.fontFiles)
    .pipe(plumber())
    .pipe(changed(path.dist.font))
    .pipe(gulp.dest(path.dist.font));
});

// imgs
gulp.task('img', function () {
  gulp.src([ path.src.imgFiles, '!' + path.src.img + 'test/**/*' + imgExt ]) // exclude test path
    .pipe(plumber())
    .pipe(changed(path.dist.img))
    .pipe(gulp.dest(path.dist.img));
});

// json package editor
gulp.task('json', function () {
  gulp.src(path.json)
    .pipe(plumber())
    .pipe(jeditor({
      'version': project.version, // make sure this is a supported npm version
      'name': project.shortname,
      'description': project.descr,
      'author': project.author
    }))
    .pipe(gulp.dest('./'));
});

// watch files
gulp.task('watch', function () {
  gulp.watch(path.src.gridscssFiles, [ 'cssGrid' ]);
  gulp.watch(path.src.scssFiles, [ 'css' ]);
  gulp.watch(path.src.jsFiles, [ 'js' ]);
  gulp.watch(path.src.fontFiles, [ 'font' ]);
  gulp.watch(path.src.imgFiles, [ 'img' ]);
});

// default task
gulp.task('default', [ 'cssGrid', 'css', 'js', 'font', 'img', 'json', 'watch' ]);
