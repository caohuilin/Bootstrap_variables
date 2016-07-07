var gulp = require('gulp');
var postcss = require('gulp-postcss');
var less = require('gulp-less');
var autoprefixer = require('autoprefixer');
var serve = require('gulp-serve');
var path = require('gulp-path');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

gulp.task('copy_bootstrap',function(){
    return gulp.src('./bower_components/bootstrap/less/*')
        .pipe(gulp.dest('./dist/btcc_bootstrap'));
});

gulp.task('copy_mixins',function(){
    return gulp.src('./bower_components/bootstrap/less/mixins/*')
        .pipe(gulp.dest('./dist/btcc_bootstrap/mixins'));
});

gulp.task("copy_variables",function(){
    return gulp.src("./src/*")
        .pipe(gulp.dest('./dist/btcc_bootstrap'));
});

gulp.task("less",function(){
    var processors = [
        autoprefixer
    ];
    return gulp.src('./dist/btcc_bootstrap/bootstrap.less')
        .pipe(less())
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean',function(){
   return gulp.src('./dist/btcc_bootstrap',{read:false})
       .pipe(clean());
});

gulp.task('build',function(){
    runSequence('copy_bootstrap','copy_mixins','copy_variables','less','clean');
});

gulp.task('watch',function(){
    gulp.watch('./src/*', ['build']);
});

gulp.task('serve',['build'],function(){
    browserSync.init({
        server:'./',
    });
    gulp.watch('./src/*', ['build']);
});



