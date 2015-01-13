var gulp = require('gulp'),
	mocha = require('gulp-mocha')

gulp.task('default', function () {
	return gulp.src('spec/**/*-spec*', {
			read: false
		})
		.pipe(mocha({
			reporter: 'dot'
		}))
		.once('end', function () {
			process.exit()
		});
});