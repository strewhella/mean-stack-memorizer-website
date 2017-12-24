/**
 * Created by Simon on 1/02/2015.
 */
var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || 8080;
var minifyCss = require('gulp-minify-css');
var browserSync = require('browser-sync');

var serverJs = [
    './server/**/*.js'
];

var appJs = [
    './public/app/**/*.js'
];

var appCss = [
    './public/css/*.css'
];

var buildFolder = './build/';

gulp.task('lint', function(){
    return gulp.src(serverJs.concat(appJs))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {verbose: true}));
});

gulp.task('lint-watcher', function(){
    gulp.watch(serverJs.concat(appJs), ['lint']);
});

gulp.task('css', function(){
    return gulp.src(appCss)
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(minifyCss())
        .pipe(gulp.dest(buildFolder));
});

gulp.task('css-watcher', function(){
    gulp.watch(appCss, ['css']);
});

var ignoreAngularApps = ['!./public/app/app.js', '!./public/app/artificialselection/artificialselection.js'];
var appInject = appJs.concat(appCss).concat(ignoreAngularApps);

gulp.task('index', function(){
    return gulp.src('./public/index.html')
        .pipe(wiredep())
        .pipe($.inject(gulp.src(appInject), {
            ignorePath: 'public',
            addRootSlash: false
        }))
        .pipe(gulp.dest('./public/'));
});

gulp.task('index-watcher', function(){
    gulp.watch(appJs.concat(appCss), ['index']);
});

gulp.task('server', function() {
    var isDev = true;

    var options = {
        script: './server/server.js',
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: ['./server/']
    };

    return $.nodemon(options)
        .on('restart', function(ev){
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
        })
        .on('start', function(){
            startBrowserSync();
            log('*** nodemon started');
        })
        .on('crash', function(){
            log('*** nodemon crash: script crashed');
        })
        .on('exit', function(){
            log('*** nodemon exited');
        });
});



gulp.task('watchers', ['lint-watcher', 'css-watcher', 'index-watcher', 'server']);

function log(msg){
    $.util.log($.util.colors.blue(msg));
    $.util.beep();
}

function startBrowserSync(){
    if (browserSync.active){
        return;
    }

    log('Starting browser-sync on port ' + port);

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: ['./public/**/*.*', '!./public/**/*.scss'],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 1000
    };

    browserSync(options);
}

gulp.task('default', ['watchers']);