var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
var  concat       = require('gulp-concat'); // Подключаем gulp-concat (для конкатенации файлов)
var  rename       = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
var htmlmin = require('html-minifier');




// Basic Gulp task syntax
gulp.task('hello', function() {
  console.log('Hello Zell!');
})

// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  })
})

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder

    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));

})


// Watchers
gulp.task('watch',function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {

  return gulp.src('app/css/style.css')
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {

  return gulp.src('app/js/**/*.+(js)')
    // .pipe(concat('js.js'))
    .pipe(uglify()) 
    .pipe(gulp.dest('dist/js'));
});

gulp.task('html', function() {
  return gulp.src('app/*.+(html)')
  // .pipe(htmlmin())
  // .pipe(rename({suffix: '.min'})) 
    .pipe(gulp.dest('dist'));
});

// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/img'))
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/img', '!dist/img/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync'], 'watch',
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    [ 'useref', 'images', 'fonts', 'scripts', 'html'],
    callback
  )
})
