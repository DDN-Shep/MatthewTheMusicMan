'use strict';

let gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    eslint = require('gulp-eslint'),
    foreach = require('gulp-foreach'),
    pug = require('gulp-pug'),
    rename = require('gulp-rename'),
    robots = require('gulp-robots'),
    sass = require('gulp-sass'),
    sitemap = require('gulp-sitemap'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    path = require('path'),
    historyapi = require('connect-history-api-fallback'),
    browserSync = require('browser-sync').create();

let config = {
  pretty: false,
  vendor: {
    scripts: [
      './vendor/jquery/dist/jquery.slim.min.js',
      './vendor/gsap/src/minified/tweenmax.min.js',
      './vendor/system.js/dist/system.js',
      './vendor/system.js/dist/system-polyfills.js',
      './vendor/peppermint/dist/peppermint.min.js',
    ],
    styles: [
      './vendor/font-awesome/css/font-awesome.min.css',
      './vendor/skeleton/css/normalize.css',
      './vendor/skeleton/css/skeleton.css',
      './vendor/peppermint/dist/peppermint.suggested.min.css'
    ]
  }
};

gulp.task('eslint', () => {
  gulp.src('./server/scripts/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('clean', () => {
  gulp.src('./client', { read: false })
      .pipe(clean());
});

gulp.task('images', () => {
  gulp.src('./server/images/favicon.ico')
      .pipe(gulp.dest('./client'));

  gulp.src('./server/images/**')
      .pipe(gulp.dest('./client/img'));
});

gulp.task('vendor', () => {
  gulp.src(config.vendor.scripts)
      .pipe(rename({ dirname: '' }))
      .pipe(foreach(function(stream, file) {
        var name = path.basename(file.path);

        return name.indexOf('.min.js') < 0
          ? stream.pipe(uglify({
                    beautify: config.pretty
                  }))
                  .pipe(rename({
                    suffix: '.min'
                  }))
          : stream;
      }))
      .pipe(gulp.dest('./client/js'));

  gulp.src(config.vendor.styles)
      .pipe(rename({ dirname: '' }))
      .pipe(foreach(function(stream, file) {
        var name = path.basename(file.path);

        return name.indexOf('.min.css') < 0
          ? stream.pipe(cssmin({
                    keepBreaks: config.pretty
                  }))
                  .pipe(rename({
                    suffix: '.min'
                  }))
          : stream;
      }))
      .pipe(gulp.dest('./client/css'));
});

gulp.task('scripts', ['eslint'], () => {
  gulp.src('./server/scripts/**/*.js')
      .pipe(uglify({
        beautify: config.pretty
      }))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest('./client/js'));
});

gulp.task('styles', () => {
  gulp.src('./server/styles/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(prefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(cssmin({
        keepBreaks: config.pretty
      }))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest('./client/css'))
});

gulp.task('views', () => {
  gulp.src('./server/views/layout.pug')
      .pipe(pug({
        pretty: config.pretty
      }))
      .pipe(rename({
        basename: 'index'
      }))
      .pipe(gulp.dest('./client'))

  gulp.src('./server/views/partials/**/*.pug')
      .pipe(pug({
        pretty: config.pretty
      }))
      .pipe(gulp.dest('./client/partials'))
});

gulp.task('sitemap', () => {
  gulp.src('./client/**/*.html', { read: false })
      .pipe(sitemap({
        siteUrl: 'https://the-saleroom.com'
      }))
      .pipe(gulp.dest('./client'));
});

gulp.task('robots', ['sitemap'], () => {
  gulp.src('./client/index.html')
      .pipe(robots({
        useragent: '*',
        allow: ['/'], // TODO
        disallow: ['/'], // TODO
        sitemap: 'https://the-saleroom.com/sitemap.xml'
      }))
      .pipe(gulp.dest('./client'));
});

gulp.task('browser-sync', () => {
  browserSync.init(['./client/**'], {
    server: {
      baseDir: './client',
      middleware: [historyapi()]
    }
  });
});

gulp.task('watch', () => {
  gulp.watch('./server/scripts/**', ['scripts']);
  gulp.watch('./server/styles/**', ['styles']);
  gulp.watch('./server/views/**', ['views']);
});

gulp.task('build', ['images', 'vendor', 'scripts', 'styles', 'views', 'robots']);

gulp.task('default', ['build', 'watch', 'browser-sync']);
