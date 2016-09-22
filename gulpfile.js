/* jshint node: true */
"use strict";


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
    viewsFolder: ["src/views/"],
};


gulp.task("clean-dist", function () {
    return del([
        // Here we use a globbing pattern to match everything inside
        // the `dist` folder.
        "dist/**/*",
    ]);
});


gulp.task("copy-html", function () {
    return gulp.src(paths.viewsFolder + "*.html")
        .pipe(gulp.dest("dist"));
});


gulp.task("copy-css", function () {
    return gulp.src(paths.viewsFolder + "css/*.css")
        .pipe(gulp.dest("dist"));
});


gulp.task("copy-manifest", function () {
    return gulp.src("manifest.json")
        .pipe(gulp.dest("dist"));
});


gulp.task("copy-icon", function () {
    return gulp.src("icon.png")
        .pipe(gulp.dest("dist"));
});


function compileTypeScriptFiles(entries, bundleName) {
    return browserify({
        basedir: '.',
        debug: true,
        entries: entries,
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .on("error", function (error) { console.error(error.toString()); })
        .pipe(source(bundleName));
}


function uglifyJavaScriptFiles(stream) {
    return stream.pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"));
}


gulp.task("compile-content-script", function () {
    var stream = compileTypeScriptFiles(["src/content.ts"],
        "content_bundle.js");
    return uglifyJavaScriptFiles(stream);
});


gulp.task("compile-popup-script", function () {
    var stream = compileTypeScriptFiles(["src/popup.ts"], "bundle.js");
    return uglifyJavaScriptFiles(stream);
});


gulp.task("default", [
    "clean-dist", "copy-manifest", "copy-icon", "copy-html", "copy-css",
    "compile-popup-script", "compile-content-script"
]);
