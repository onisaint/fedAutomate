/** Author: MKDS<Madhu kumar D S> on 20/7/2017**/
"use strict";

var gulp = require('gulp'),
    path = require('path'),
    data = require('gulp-data'),
    pug = require('gulp-pug'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    ts = require('gulp-typescript'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync');

/*
 * Directories here
 */
var paths = {
    public: './dest/',
    sass: './src/styles/',
    css: './dest/'
};

/**
 * task runner for typescript
 */
gulp.task('ts', function () {
    return gulp.src('./src/script/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'build.js'
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.public));
});


gulp.task('pug', function () {
    return gulp.src('./src/views/*.pug')
        .pipe(pug())
        .on('error', function (err) {
            process.stderr.write(err.message + '\n');
            this.emit('end');
        })
        .pipe(gulp.dest(paths.public));
});

/**
 * copy assets to the public
 */
gulp.task('assets', function () {
    return gulp.src('./assets/**/*')
        .pipe(gulp.dest(paths.public))
});

/**
 * Recompile .pug files and live reload the browser
 */
gulp.task('rebuild', ['assets' ,'ts', 'pug'], function () {
    browserSync.reload();
});

/**
 * Wait for pug and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['ts', 'assets', 'sass', 'pug'], function () {
    browserSync({
        server: {
            baseDir: paths.public
        },
        notify: false
    });
});

gulp.task('sass', function () {
    return gulp.src(paths.sass + '*.sass')
        .pipe(sass({
            includePaths: [paths.sass],
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/**
 * Watch scss files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 * on or if of any sub module in it //**
 */
gulp.task('watch', function () {
    gulp.watch(paths.sass + '**/*.sass', ['sass']);
    gulp.watch('./src/views/**/*.pug', ['rebuild']);
    gulp.watch('./src/script/**/*.ts', ['rebuild']);
    gulp.watch('./assets/**/*', ['rebuild']);
});

gulp.task('build', ['sass', 'pug']);

gulp.task('default', ['browser-sync', 'watch']);