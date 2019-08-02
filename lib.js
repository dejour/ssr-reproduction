const webpack = require('webpack');
const config = require('./build/webpac.pack.config');
const koaWebpack = require('koa-webpack');
const MemoryFileSystem = require("memory-fs");
const baseConfig = require('./build/webpack.base.config');
const path = require('path');
const mfs = new MemoryFileSystem();
const fs = require('fs');


const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(baseConfig.output.path, file), 'utf-8')
  } catch (e) {
    console.log(e)
  }
}
async function start() {
  const compiler = webpack(config);
  let bundle, manifest;
  compiler.hooks.done.tap('lib', () => {
    bundle = JSON.parse(readFile(compiler.compilers[0].outputFileSystem, 'vue-ssr-server-bundle.json'))
    manifest = JSON.parse(readFile(compiler.compilers[0].outputFileSystem, 'vue-ssr-client-manifest.json'));
  })
  const middleware = await koaWebpack({
    compiler: compiler,
    devMiddleware: {
      publicPath: '/static/',
    },
  });

  return async function(ctx, next) {
    ctx.bundle = bundle
    ctx.manifest = manifest
    return middleware(ctx, next)
  }
}

module.exports = start