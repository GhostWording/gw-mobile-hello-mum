var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var replace = require('gulp-replace');
var templateCache = require('gulp-angular-templatecache');
var gIf = require('gulp-if');
var gFile = require('gulp-file');
var postCSS = require('gulp-postcss');
var jshint = require('gulp-jshint');
var jshintstylish = require('jshint-stylish');
var mergeStream = require('merge-stream');
var streamQueue = require('streamqueue');
var runSequence = require('run-sequence');
var autoPrefixer = require('autoprefixer-core');
var spawn = require('child_process').spawn;
var glob = require('glob');
var del = require('del');

var debug = gutil.env.debug;

var appModule = 'app';

var getJSGlobs = function() {
  return [
    'src/lib/ionic/js/ionic.bundle' + (debug?'':'.min') + '.js',
    'src/lib/angular-translate/angular-translate' + (debug?'':'.min') + '.js',
    'src/lib/angular-cookies/angular-cookies' + (debug?'':'.min') + '.js',
    'src/lib/ngCordova/dist/ng-cordova' + (debug?'':'.min') + '.js',
    'src/lib/angular-dropdowns/dist/angular-dropdowns' + (debug?'':'.min') + '.js',
    'src/lib/gw-common/**/*.js',
    '!src/lib/gw-common/**/*.spec.js',
    'src/lib/gw-mobile-common/**/*.mod.js',
    'src/lib/gw-mobile-common/**/*.js',
    '!src/lib/gw-mobile-common/**/*.spec.js',
    'src/app/**/*.mod.js',
    'src/app/**/*.js'
  ];
};

var getCSSGlobs = function() {
  return [
    'src/lib/ionic/css/ionic' + (debug?'':'.min') + '.css',
    'src/lib/angular-dropdowns/dist/angular-dropdowns.css',
    'src/lib/gw-mobile-common/**/*.css',
    'src/app/**/*.css',
  ];
};

var imageGlobs = [
  'src/app/**/*.jpg',
  'src/app/**/*.png'
];

var fontGlobs = [
  'src/lib/ionic/fonts/**/ionicons.woff',
  'src/app/fonts/**/notoserif-italic.woff',
  'src/app/fonts/**/notoserif-bolditalic.woff'
];

var partialGlobs = [
  'src/**/lib/gw-mobile-common/**/*.part.html',
  'src/**/app/**/*.part.html'
];

var jshintGlobs = [
  'src/lib/gw-common/**/*.js',
  'src/lib/gw-mobile-common/**/*.js',
  'src/app/**/*.js'
];

gulp.task('clean', function(done) {
  del('www', function() {
    del('platforms/android/out/', done);
  });
});

gulp.task('ionic:build:android', function(done) {
  exec('ionic', ['build','android'], done);  
});

gulp.task('ionic:build:ios', function(done) {
  exec('ionic', ['build','ios'], done);  
});

gulp.task('ionic:run:android', function(done) {
  exec('ionic', ['run','android'], done);  
});

gulp.task('ionic:run:ios', function(done) {
  exec('ionic', ['run','ios'], done);  
});

gulp.task('ionic:emulate:android', function(done) {
  exec('ionic', ['emulate','android'], done);  
});

gulp.task('ionic:emulate:ios', function(done) {
  exec('ionic', ['emulate','ios'], done);  
});

gulp.task('ionic:serve', function(done) {
  exec('ionic', ['serve'], done);  
});

gulp.task('jshint', function() {
  return gulp.src(jshintGlobs)
    .pipe(jshint({debug:debug}))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gIf(!debug, jshint.reporter("fail")));
});

gulp.task('process:index', function() {
  return gulp.src('src/index.html')
    .pipe(gIf(!debug, replace('<!-- app:js --><!-- endinject -->','<script src="app.js"></script>')))
    .pipe(gIf(!debug, replace('<!-- style:css --><!-- endinject -->','<link rel="stylesheet" href="app.css">')))
    .pipe(gIf(debug, inject(gulp.src(getJSGlobs(), {base:'src', read: false}), {name: 'app', ignorePath:'src'})))
    .pipe(gIf(debug, inject(gulp.src(getCSSGlobs(), {base:'src', read: false}), {name: 'style', ignorePath:'src'})))
    .pipe(gIf(!debug, minifyHTML({empty:true})))
    .pipe(gulp.dest('www'));
});

gulp.task('process:javascript', ['jshint'], function() {
  // TODO: temporary while we resolve https://github.com/GhostWording/gw-common/issues/2
  var jsStream = gulp.src(getJSGlobs(), {base:'src'})
    .pipe(replace('var isMobileApp = false;', 'var isMobileApp = true;'));
  // TODO: try and remove this
  var partSrcOpt = {cwd:'.'};
  if(debug) {partSrcOpt.base = 'src';}
  var messageImageStream = gulp.src(partialGlobs, partSrcOpt)
  var partialStream = gulp.src(partialGlobs, partSrcOpt)
    .pipe(gIf(!debug, minifyHTML({empty:true})))
    .pipe(gIf(!debug, templateCache('partials.js', {module:appModule, root:'.'})));
  return streamQueue({objectMode:true}, jsStream, partialStream)
    .pipe(gIf(!debug, concat('app.js')))
    .pipe(gIf(!debug, uglify({mangle:false})))
    .pipe(gulp.dest('www'));
});

gulp.task('process:messageimages', function() {
  var messageImagePaths = glob.sync('app/messageimage/**/*.jpg', {cwd:'src'});
  // Remove eof image so it won't be picked
  messageImagePaths.splice(messageImagePaths.indexOf('app/messageimage/eof.jpg'), 1);
  return gFile('messageimages.json', JSON.stringify(messageImagePaths), { src: true }).pipe(gulp.dest('www'));
});

gulp.task('process:styles', function() {
  // TODO: this is not ideal.. but autoprefixer is throwing out loads of annoying warnings about 3rd party css
  console.warn = null;
  return gulp.src(getCSSGlobs(), {base:'src'})
    // TODO: we could be more browser specific here in device builds
    .pipe(postCSS([autoPrefixer({browsers: ['last 2 version']})]))
    .pipe(gIf(!debug, concat('app.css')))
    .pipe(gIf(!debug, minifyCSS({keepSpecialComments: 0})))
		.pipe(gIf(!debug, replace('../fonts', 'fonts')))
		.pipe(gIf(!debug, replace('./fonts', 'fonts')))
    .pipe(gulp.dest('www'));
});

gulp.task('process:images', function() {
  return gulp.src(imageGlobs, {base:'src'})
    .pipe(gulp.dest('www'));
});

gulp.task('process:fonts', function() {
  if(debug) {
    var options = {base:'src'};
    var dest = 'www';
  } else {
    var dest = 'www/fonts';
  }
  return gulp.src(fontGlobs, options)
    .pipe(gulp.dest(dest));
});

gulp.task('build', function(done) {
  runSequence('clean', ['process:javascript', 'process:styles', 'process:fonts', 'process:images', 'process:messageimages'], 'process:index', done);
});

gulp.task('build:android', function(done) {
  runSequence('build', 'ionic:build:android', done);
});

gulp.task('build:ios', function(done) {
  runSequence('build', 'ionic:build:ios', done);
});

gulp.task('emulate:android', function(done) {
  runSequence('build', 'ionic:emulate:android', done);
});

gulp.task('emulate:ios', function(done) {
  runSequence('build', 'ionic:emulate:ios', done);
});

gulp.task('run:android', function(done) {
  runSequence('build', 'ionic:run:android', done);
});

gulp.task('run:ios', function(done) {
  runSequence('build', 'ionic:run:ios', done);
});

gulp.task('watch', function(done) {
  runSequence('build', function() {
    gulp.watch('src/index.html', function() {
      runSequence('process:index');
    });
    gulp.watch(getCSSGlobs(), function() {
      runSequence('process:styles');
    });
    gulp.watch(getJSGlobs(), function() {
      runSequence('process:javascript', 'process:index');
    });
    gulp.watch(partialGlobs, function() {
      runSequence('process:javascript', 'process:index');
    });
    gulp.watch(imageGlobs, function() {
      runSequence('process:images');
    });
    gulp.watch(fontGlobs, function() {
      runSequence('process:fonts');
    });
  });
});

gulp.task('serve', ['ionic:serve']);

gulp.task('git:check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('default', ['sass']);

function exec(command, params, done) {
  var child = spawn(command, params, {cwd: process.cwd()});
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function (data) {
    console.log(data);
  });
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function (data) {
    console.log(data);
  });
  child.on('close', function(code) {
    done();
  });
}
