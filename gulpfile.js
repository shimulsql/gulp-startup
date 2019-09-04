const {dest, src, watch, parallel} = require('gulp'),
uglify = require('gulp-uglify'),
scss = require('gulp-sass'),
bs = require('browser-sync'),
fileinclude = require('gulp-file-include');

// define file paths
const files = {
    htmlpath: 'src/*.html',
    imagepath: 'src/images/**/*',
    scsspath: ['src/scss/style.scss', 'node_modules/bootstrap/scss/bootstrap.scss'],
    csspath:['src/css/*.css'],
    jspath: ['src/js/*.js', 'node_modules/bootstrap/dist/js/bootstrap.js'],
    fontasm: ['src/fonts/font-awesome/**/*']
}

// File watching paths
const wpath = {
    htmlpath: ['src/*.html', 'src/includes/*.html'],
    imagepath: '',
    csspath:['src/css/*.css'],
    scsspath: ['src/scss/**/*.scss', 'node_modules/bootstrap/scss/**/*.scss'],
    jspath: ['src/js/*.js', 'node_modules/bootstrap/dist/js/*.js']
}

// HTML task 
function htmltask(cb){
    src(files.htmlpath)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src'
        }))
        .pipe(dest('dist'))
        .pipe(bs.stream());
    cb();
}


//Image task
function imagetask(cb){
    src(files.imagepath)
        .pipe(dest('dist/images'))
    cb();
}

//CSS task
function csstask(cb){
    src(files.csspath)
        .pipe(dest('dist/css'))
    cb();
}

// SCSS task
function scsstask(cb){
    src(files.scsspath)
        .pipe(scss())
        .pipe(dest('dist/css'))
        .pipe(bs.stream());
    cb();
}

//JS task
function jstask(cb){
    src(files.jspath)
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(bs.stream());
    cb();
}

function browserSync(cb) {

    bs.init({
      // Dev server will run at localhost:8080
      port: 8080,
      server: {
        // I'm using 'dist' as my base directory
        baseDir: 'dist',
      },
    });


    // watching files
    watch(wpath.htmlpath, htmltask);
    watch(wpath.scsspath, scsstask);
    watch(wpath.csspath, csstask);
    watch(files.jspath, jstask);
    cb();
}

function fontawesome(cb){
    src(files.fontasm)
        .pipe(dest('dist/fonts/font-awesome'))
    cb();
}


// exporting tasks and watch it
exports.default = parallel(browserSync, imagetask);
exports.setup = parallel(htmltask,imagetask, csstask, scsstask, jstask, fontawesome);
exports.imageload = parallel(imagetask);





