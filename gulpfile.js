var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var watch = require('gulp-watch');
var autoprefixer = require('autoprefixer');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var htmlReplace = require('gulp-html-replace');
var runSequence = require('run-sequence');

gulp.task('clean', function () {
    del.sync(["dist", "app", './src/my_bootstrap'])
});

gulp.task('browser_sync', function () {
    browserSync({
        server: {
            baseDir: './app',
            index: 'index.html',
        }
    })
});

gulp.task('watch', function () {
    watch('src/*.less', function () {
        gulp.watch('copy_theme', 'less');
    });
});

gulp.task('copy_bootstrap', function () {
    return gulp.src(['./node_modules/bootstrap/less/**/*'], {base:'./node_modules/bootstrap/less'})
        .pipe(gulp.dest('./src/my_bootstrap/'));
});

gulp.task('copy_theme', function () {
    return gulp.src(['./src/theme.less', './src/variables.less'], {base:'./src'})
        .pipe(gulp.dest('./src/my_bootstrap/'));
});

gulp.task("less", function() {
    var processors = [
        autoprefixer
    ];
    return gulp.src(['./src/my_bootstrap/bootstrap.less', './src/my_bootstrap/theme.less'])
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss(processors))
        .pipe(gulp.dest('./app/css/'));
});

gulp.task('copy', function () {
    return gulp.src(['./src/fonts/**/*', './src/index.html'], {base:'./src'})
        .pipe(gulp.dest('./app/'));
});

gulp.task('build_copy', function () {
    return gulp.src('./app/fonts/**/*', {base:'./app'})
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build_minify_css', function () {
    return gulp.src('app/css/*.css')
        .pipe(concat('vendor.css'))
        .pipe(minifyCss())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('build_html_replace', function() {
    gulp.src('app/*.html')
        .pipe(htmlReplace({
            'css': './css/vendor.min.css',
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('dev', function () {
    runSequence('clean', 'copy_bootstrap', 'copy_theme', ['copy', 'less'], ['browser_sync', 'watch']);
});


gulp.task('build', function () {
    runSequence('clean', 'copy_bootstrap', 'copy_theme', ['copy', 'less'],['build_copy', 'build_minify_css', 'build_html_replace']);
});