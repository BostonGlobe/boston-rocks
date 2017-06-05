const gulp = require('gulp')
const browserSync = require('browser-sync')

// browser-sync task for starting the server.
gulp.task('browser-sync', () => {
	browserSync({
		proxy: 'http://localhost:5000',
		notify: false,
		ghostMode: false
	})
})

gulp.task('browser-sync-reload', () => browserSync.reload())
