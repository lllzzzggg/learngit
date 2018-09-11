var gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect');

// 定义less任务
gulp.task('less', function () {
    gulp.src(['src/less/*.less','!src/less/extend/{reset,test}.less'])
        .pipe(less())
        .pipe(gulp.dest('src/css'))
        .pipe(livereload());
});

// 定义sass任务
gulp.task('sass', function () {
  gulp.src(['src/sass/*.scss','!src/less/extend/{reset,test}.scss'])
      .pipe(sass())
      .pipe(gulp.dest('src/css'))
      .pipe(livereload());
});

// 定义stylus任务
gulp.task('stylus', function () {
  gulp.src(['src/stylus/*.styl','!src/less/extend/{reset,test}.styl'])
      .pipe(stylus())
      .pipe(gulp.dest('src/css'))
      .pipe(livereload());
});

// 定义html任务
gulp.task('html', function() {
    gulp.src('.')
        .pipe(livereload());
});

// 使用connect启动一个web服务器
gulp.task('webserver', function() {
  connect.server({
    livereload:true,
    port:9090
  });
});

// 定义看守任务
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/**/*.less', ['less']);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/**/*.styl', ['stylus']);
});

//运行Gulp时，默认的Task
gulp.task('default',['watch', 'webserver']);