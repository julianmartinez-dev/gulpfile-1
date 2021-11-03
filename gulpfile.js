/* -------INSTALAR DEPENDENCIAS CON NPM---------------

1- sass - npm i --save-dev gulp-sass
2- plumber - npm i --save-dev gulp-plumber
3- cache - npm i --save-dev gulp-cache
4- webp - npm i --save-dev gulp-webp
5- imagemin - npm i --save-dev gulp-imagemin@7.1.0 VERSION 7.1.0
6- avif - npm i --save-dev gulp-avif
---------DEPENDENCIAS PARA OPTIMIZAR CSS TERMINADO--------

cssnano, autoprefixer, postcss, gulp-postcss, gulp-sourcemaps

------------------------------------------------------*/

//------------DEPENDENCIAS DE GULP---------------//
const { src, dest, watch, parallel } = require('gulp');

//-----------DEPENDENCIAS DE CSS-----------------//
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano'); //comprime codigo css
const postcss = require('postcss');
const sourcemaps = require('gulp-sourcemaps'); //descomprime en otro archivo la hoja css

//-----------DEPENDENCIAS DE IMAGEN-------------//
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//-----------DEPENDENCIAS DE JAVASCRIPT-------------//
const terser = require('gulp-terser-js');


//--------COMPILAMOS CODIGO SCSS A CSS------------/
function css(done){
    src('src/scss/**/*.scss')//IDENTIFICAR EL ARCHJIVO .SCSS A COMPILAR
        .pipe(sourcemaps.init())
        .pipe( plumber() )
        .pipe( sass() )//COMPILARLO
        .pipe( postcss([ autoprefixer(),cssnano() ]) ) //minificamos el codigo
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css') )//ALMACENARLO
    
    done();
}

//----------TRANSFORMAMOS IMAGENES A WEBP-----------/
function versionWebp( done ){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img') );

    done();
}

//----------OPTIMIZAMOS IMAGENES PNG O JPG-----------/
function imagenes( done ){
    const opciones ={
        optimizationLevel: 3
    }

    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin(opciones) ) )
        .pipe( dest('build/img') );

    done();
}

//----------TRANSFORMAMOS IMAGENES A AVIF-----------/
function versionAvif(done) {

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('build/img') );

    done();
}

//----------ENVIAMOS SCRIPTS A BUILD-----------/
function javascript( done ){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe( terser() ) //minifica el codigo js
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/js') );

    done();
}

//------COMPILAMOS PERMANENTEMENTE EL CODIGO SCSS-------/
function dev(done){
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);

    done();
}


//--------------EJECUTAMOS EN TERMINAL---------------/
/*
gulp css
gulp imagenes
gulp dev
...
---------------------------------------------------*/

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev );