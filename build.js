const path = require('path')
const Metalsmith = require('metalsmith')
const filter = require('metalsmith-filter')
const ignore = require('metalsmith-ignore')
const moveUp = require('metalsmith-move-up')
const pug = require('metalsmith-pug')
const stylus = require('metalsmith-stylus')
const watch = require('metalsmith-watch')
const minimist = require('minimist')
const nib = require('nib')
const rupture = require('rupture')
const superstatic = require('superstatic').server

const argv = minimist(process.argv.slice(2))

new Metalsmith(__dirname)
  .use(filter([
    'assets/**',
    'styles/app.styl',
    'views/**'
  ]))
  .use(ignore([
    '**/_*'
  ]))
  .use(moveUp([
    'assets/**',
    'styles/**',
    'views/**'
  ]))
  .use(pug({
    compress: true,
    basedir: path.resolve(__dirname, 'src'),
    locals: require('./data.json')
  }))
  .use(stylus({
    compress: true,
    use: [nib(), rupture()]
  }))
  .use(argv.watch && watch())
  .source('src')
  .destination('dist')
  .build(err => err && console.error(err))

if (argv.watch) {
  superstatic({
    port: 8080,
    config: {
      public: 'dist',
      cleanUrls: true
    }
  }).listen(err =>
      console.log(err || 'Server running at http://localhost:8080'))
}
