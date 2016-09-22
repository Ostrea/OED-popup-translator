"use strict"


var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var del = require('del');
var ts = require("gulp-typescript");


var paths = {
    views: ["src/views/*.html"],
    manifest: ["manifest.json"]
};


gulp.task("clean-dist", function () {
    return del([
        // Here we use a globbing pattern to match everything inside
        // the `dist` folder.
        "dist/**/*",
    ]);
});


gulp.task("copy-html", function () {
    return gulp.src(paths.views)
        .pipe(gulp.dest("dist"));
});


gulp.task("copy-manifest", function () {
    return gulp.src(paths.manifest)
        .pipe(gulp.dest("dist"));
});


gulp.task("copy-icon", function () {
    return gulp.src("icon.png")
        .pipe(gulp.dest("dist"));
});


gulp.task("compile-content-script", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ["src/content.ts"],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .on("error", function (error) { console.error(error.toString()); })
        .pipe(source("content_bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"));
});


gulp.task("default",
    ["clean-dist", "copy-manifest", "copy-icon", "compile-content-script",
        "copy-html"],
    function () {
        return browserify({
            basedir: '.',
            debug: true,
            entries: ["src/popup.ts"],
            cache: {},
            packageCache: {}
        })
            .plugin(tsify)
            .bundle()
            .on("error", function (error) { console.error(error.toString()); })
            .pipe(source("bundle.js"))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest("dist"));
    });
