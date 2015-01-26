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
var gCallback = require('gulp-callback');
var templateCache = require('gulp-angular-templatecache');
var gIf = require('gulp-if');
var gFile = require('gulp-file');
var postCSS = require('gulp-postcss');
var jshint = require('gulp-jshint');
var jshintstylish = require('jshint-stylish');
var jimp = require('gulp-jimp');
var mergeStream = require('merge-stream');
var streamQueue = require('streamqueue');
var runSequence = require('run-sequence');
var autoPrefixer = require('autoprefixer-core');
var spawn = require('child_process').spawn;
var async = require('async');
var glob = require('glob');
var del = require('del');
var fs = require('fs');

// Build configuration
var config = require('./config.json');

// --debug build switch
var debug = gutil.env.debug;

// Name of main angular module
var appModule = 'app';

// Javascript glob patterns
var getJSGlobs = function() {
  return [
    'src/lib/ionic/js/ionic.bundle' + (debug?'':'.min') + '.js',
    'src/lib/angular-translate/angular-translate' + (debug?'':'.min') + '.js',
    'src/lib/angular-translate-loader-static-files/angular-translate-loader-static-files' + (debug?'':'.min') + '.js',
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

// CSS glob patterns
var getCSSGlobs = function() {
  return [
    'src/lib/ionic/css/ionic' + (debug?'':'.min') + '.css',
    'src/lib/angular-dropdowns/dist/angular-dropdowns.css',
    'src/lib/gw-mobile-common/**/*.css',
    'src/app/**/*.css',
  ];
};

// Image glob patterns
var imageGlobs = [
  'src/app/**/*.jpg',
  'src/app/**/*.png'
];

// Font glob patterns
var fontGlobs = [
  'src/lib/ionic/fonts/**/ionicons.woff',
  'src/app/fonts/**/notoserif-italic.woff',
  'src/app/fonts/**/notoserif-bolditalic.woff'
];

// Language file glob patterns
var localeGlobs = [
  'src/res/locale/**/*.json'
];

// Partial glob patterns
var partialGlobs = [
  'src/**/lib/gw-mobile-common/**/*.part.html',
  'src/**/app/**/*.part.html'
];

// Javascript lint glob patterns
var jshintGlobs = [
  'src/lib/gw-common/**/*.js',
  'src/lib/gw-mobile-common/**/*.js',
  'src/app/**/*.js'
];

// Delete everything in www (except .gitignore which is keeping www in git)
gulp.task('clean', function(done) {
  del(['www/**/*','!www/.gitignore'], function() {
    del('platforms/android/out/', done);
  });
});

// Wrapper for 'iconic serve'
gulp.task('ionic:serve', function(done) {
  exec('ionic', ['serve'], done);  
});

// Lint javascsript
gulp.task('jshint', function() {
  return gulp.src(jshintGlobs)
    .pipe(jshint({debug:debug}))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gIf(!debug, jshint.reporter("fail")));
});

// Inject js files into www/index.html
gulp.task('process:index', function() {
  return gulp.src('src/index.html')
    .pipe(gIf(!debug, replace('<!-- app:js --><!-- endinject -->','<script src="app.js"></script>')))
    .pipe(gIf(!debug, replace('<!-- style:css --><!-- endinject -->','<link rel="stylesheet" href="app.css">')))
    .pipe(gIf(debug, inject(gulp.src(getJSGlobs(), {base:'src', read: false}), {name: 'app', ignorePath:'src'})))
    .pipe(gIf(debug, inject(gulp.src(getCSSGlobs(), {base:'src', read: false}), {name: 'style', ignorePath:'src'})))
    .pipe(gIf(!debug, minifyHTML({empty:true})))
    .pipe(gulp.dest('www'));
});

// Contatinate and minify all javascript (including html partials) to www/app.js
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

// Generate www/messageimages.json (list of all images that can be sent)
gulp.task('process:messageimages', function() {
  var messageImagePaths = glob.sync('app/messageimage/**/*.jpg', {cwd:'src'});
  // Remove eof image so it won't be picked
  messageImagePaths.splice(messageImagePaths.indexOf('app/messageimage/eof.jpg'), 1);
  return gFile('messageimages.json', JSON.stringify(messageImagePaths), { src: true }).pipe(gulp.dest('www'));
});

// Copy translation files to www/locale
gulp.task('process:locale', function() {
  gulp.src(localeGlobs)
    .pipe(gulp.dest('www/locale'));
});

// Concatinate and minify css files to www
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

// Copy image files to www
gulp.task('process:images', function() {
  return gulp.src(imageGlobs, {base:'src'})
    .pipe(gulp.dest('www'));
});

// Copy font files to www/fonts
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

// Process IOS specific stuff
gulp.task('process:platform:ios', function(done) {
  if(fs.existsSync('platforms/ios')) {
    runSequence(['process:icons:ios', 'process:appname:ios'], done);
  } else {
    console.log("\nIOS PLATFORM NOT ADDED ('ionic platform add ios')\n");
    process.exit(1);
  }
});

// Build InfoPlist.strings file for each language so we can localise the app (bundle display) name
gulp.task('process:appname:ios', function(done) {
  // Build InfoPlist.strings file for each language
  async.each(Object.keys(config.regional), function(language, callback) {
    var regionalName = config.regional[language].appName;
    var content = 'CFBundleDisplayName="' + regionalName + '";CFBundleName="' + regionalName + '";';
    gFile('InfoPlist.strings', content, {src: true})
      .pipe(gulp.dest('platforms/ios/' + language + '.lproj'))
      .pipe(gCallback(callback));
  }, function() {
    // Modify the xcode project to reference the InfoPlist.strings files
  });
}); 

// Transcode required IOS icon resolutions from master icon
gulp.task('process:icons:ios', function(done) {
  var icons = [
    {name: 'icon-40.png', size: 40},
    {name: 'icon-40@2x.png', size: 80},
    {name: 'icon-50.png', size: 50},
    {name: 'icon-50@2x.png', size: 100},
    {name: 'icon-60.png', size: 60},
    {name: 'icon-60@2x.png', size: 120},
    {name: 'icon-60@3x.png', size: 180},
    {name: 'icon-72.png', size: 72},
    {name: 'icon-72@2x.png', size: 144},
    {name: 'icon-76.png', size: 76},
    {name: 'icon-76@2x.png', size: 152},
    {name: 'icon-small.png', size: 29},
    {name: 'icon-small@2x.png', size: 58},
    {name: 'icon.png', size: 57},
    {name: 'icon@2x.png', size: 114}
  ];
  async.eachSeries(icons, function(icon, callback) {
    gulp.src('src/res/icon/icon.png')
      .pipe(jimp({
        resize:{
          width: icon.size,
          height: icon.size
        }
      }))
      .pipe(rename(icon.name))
      .pipe(gulp.dest('platforms/ios/app/Resources/icons'))
      .pipe(gCallback(callback));
  }, done);
});

// Process Android specific stuff
gulp.task('process:platform:android', function(done) {
  if(fs.existsSync('platforms/android')) {
    runSequence('process:icons:android', done);
  } else {
    console.log("\nANDROID PLATFORM NOT ADDED ('ionic platform add android')\n");
    process.exit(1);
  }
});

// Transcode required Android icon resolutions from master icon
gulp.task('process:icons:android', function(done) {
  var icons = [
    {dir: 'drawable', size: 96},
    {dir: 'drawable-ldpi', size: 36},
    {dir: 'drawable-mdpi', size: 48},
    {dir: 'drawable-hdpi', size: 72},
    {dir: 'drawable-xhdpi', size: 96}
  ];
  async.eachSeries(icons, function(icon, callback) {
    gulp.src('src/res/icon/icon.png')
      .pipe(jimp({
        resize:{
          width: icon.size,
          height: icon.size
        }
      }))
      .pipe(gulp.dest('platforms/android/res/' + icon.dir))
      .pipe(gCallback(callback));
  }, done);
});

// Non platform specific build process
gulp.task('build', function(done) {
  runSequence('clean', [
    'process:javascript', 
    'process:styles', 
    'process:fonts', 
    'process:images', 
    'process:messageimages',
    'process:locale'
  ], 'process:index', done);
});

// Build for Android
gulp.task('build:android', function(done) {
  runSequence('build', 'process:platform:android', function() {
    exec('ionic', ['build','android'], done);  
  });
});

// Build for Android and emulate
gulp.task('emulate:android', function(done) {
  runSequence('build', 'process:platform:android', function() {
    exec('ionic', ['emulate','android'], done);  
  });
});

// Build for android and run
gulp.task('run:android', function(done) {
  runSequence('build', 'process:platform:android', function() {
    exec('ionic', ['run','android'], done);  
  });
});

// Build for ios
gulp.task('build:ios', function(done) {
  runSequence('build', 'process:platform:ios', function() {
    exec('ionic', ['build','ios'], done);  
  });
});

// Build for ios and emulate
gulp.task('emulate:ios', function(done) {
  runSequence('build', 'process:platform:ios', function() {
    exec('ionic', ['emulate','ios'], done);  
  });
});

// Build for ios and run
gulp.task('run:ios', function(done) {
  runSequence('build', 'process:platform:ios', function() {
    exec('ionic', ['run','ios'], done);  
  });
});

// Watch for file changes and rebuild
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
    gulp.watch(localeGlobs, function() {
      runSequence('process:locale');
    });
    gulp.watch(fontGlobs, function() {
      runSequence('process:fonts');
    });
  });
});

// Serve app to browser
gulp.task('serve', ['ionic:serve']);

// Build by default
gulp.task('default', ['build']);

// Helper function to spawn a sub process
// TODO: fix on windows
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
