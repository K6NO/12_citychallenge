const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    del = require('del'),
    useref = require('gulp-useref'),
    iff = require('gulp-if'),
    babel = require('gulp-babel'),
    sequence = require('run-sequence'),
    eslint = require('gulp-eslint'),
    ngAnnotate = require('gulp-ng-annotate');

var options = {
    dist : 'dist'
};

// As a developer, I should be able to run the gulp scripts command at the command line to concatenate,
// minify, and copy all of the project’s JavaScript files into an all.min.js file that is then copied to the dist/scripts folder.

// As a developer, when I run the gulp scripts or gulp styles commands at the command line, source maps are generated
// for the JavaScript...
gulp.task('scripts', ['lint'], () => {
    return gulp.src(
        ['./public/scripts/app.module.js',
        './public/scripts/app.config.js',
        './public/scripts/modules/navbar.module.js',
        './public/scripts/services/*.js',
        './public/scripts/directives/*.js',
        './public/scripts/controllers/*.js']
    )
        .pipe(ngAnnotate())
        .pipe(babel({presets: ['es2015']}))
        .pipe(maps.init())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.dist + '/scripts'))
});

// As a developer, when I run the gulp scripts command at the command line, all of my project’s JavaScript files will be
// linted using ESLint and if there’s an error, the error will output to the console and the build process will be halted.
gulp.task('lint', () => {
    return gulp.src('./public/scripts/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
});

// As a developer, I should be able to run the gulp clean command at the command line to delete
// all of the files and folders in the dist folder.
gulp.task('clean', () => {
    del('dist');
});

// As a developer, I should be able to run the gulp images command at the command line to optimize the size of the project’s
// JPEG and PNG files, and then copy those optimized images to the dist/content folder.
gulp.task('images', () => {
    return gulp.src('./public/assets/img/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest(options.dist + '/assets/img'))
});

// Copy factory .css and .js files to dist folder when gulp build runs
gulp.task('styles', () => {
    gulp.src('./public/assets/css/*.css')
        .pipe(maps.init())
        .pipe(autoprefixer())
        .pipe(concat('all.min.css'))
        .pipe(csso())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.dist + '/assets/css'))
});

gulp.task('copyJS', () => {
    gulp.src('./public/assets/js/*.*')
        .pipe(gulp.dest(options.dist + '/assets/js'))
});

gulp.task('copyTemplates', () => {
    gulp.src('./public/templates/*.*')
        .pipe(gulp.dest(options.dist + '/templates'))
});

gulp.task('html', () => {
    gulp.src('public/index.html')
        .pipe(useref('index.html'))
        //.pipe(iff('*.js', babel({presets: ['es2015']})).pipe(uglify()))
        //.pipe(iff('*.css', csso()))
        .pipe(gulp.dest(options.dist));
});

// As a developer, I should be able to run the gulp build command at the command line to run the clean,
// scripts, styles, and images tasks with confidence that the clean task completes before the other commands.
gulp.task('build', ['clean'], () => {
    return sequence('html', 'scripts', 'styles', 'copyJS', 'copyTemplates', 'images')
});

// As a developer, I should be able to run the gulp command at the command line to run the “build” task.
gulp.task('default', ['build'], () => {
    console.log('Gulp...gulp...gulp');
});