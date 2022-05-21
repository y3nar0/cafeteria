const { src, dest, watch, series, parallel } = require('gulp')

// CSS y SASS
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps') // podemos ver la linea de codigo original de sass
// const cssnano = require('cssnano') - mimifica el codigo de css

// Imagenes
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const avif = require('gulp-avif')

function css( done ) {
    // compilar sass
    // pasos: 1. Identificar archivo, 2. Compilarlo, 3. Guardar el .css
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        //.pipe( sass({outputStyle: 'compressed'}) ) // version minificada de css
        // .pipe( sass({outputStyle: 'expanded'}) ) // version extendida de css
        // .pipe( postcss([autoprefixer(), cssnano()]) ) // crea codigo que no esta soportado por otros navegadores
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css') )

    done()
}

function imagenes() {
    return src('src/img/**/*')
        .pipe( imagemin({optimizationLevel: 3}) )
        .pipe(dest('build/img'))
}

function versionWebp() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe(dest('build/img'))
}

function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe(dest('build/img'))
}

function dev() {
    // (prestar atencion a los cambios, funcion a ejecutar)
    // watch('src/scss/app.scss', css)
    watch('src/scss/**/*.scss', css)
    watch('src/img/**/*', imagenes)
}

// function tareaDefault() {
//     console.log('Tarea por default')
// }

exports.css = css
exports.dev = dev
exports.imagenes = imagenes
exports.versionWebp = versionWebp
exports.versionAvif = versionAvif
// exports.default = tareaDefault
// exports.default = series( imagenes, versionWebp, versionAvif, css, dev ) // funcion watch al final
exports.default = series( imagenes, versionWebp, versionAvif, css, dev ) // funcion watch al final

// series - Se inicia una tarea, y hasta que finaliza, inicia la siguiente tarea
// parallel - "Todas inician al mismo tiempo"