var gulp = require('gulp')
var tiny = require('gulp-tinypng-nokey');

gulp.task('image', function () {
    gulp.src('src/*.{png,jpg,gif,ico}')
        .pipe(tiny())
        .pipe(gulp.dest('dist'));
});