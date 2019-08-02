const Koa = require('koa')
const mid = require('./lib.js');
const fs = require('fs')
const path = require('path')

const { createBundleRenderer } = require('vue-server-renderer')

const app = new Koa();


const templatePath = path.resolve('./src/index.template.html')
const template = fs.readFileSync(templatePath, 'utf-8')

mid().then((e) => {
  app.use(e);
  app.use(async function(ctx) {
    const renderer = createBundleRenderer(ctx.bundle, {
      template : template,
      clientManifest: ctx.manifest
    })

    const context = {
      title: 'Vue HN 2.0', // default title
      url: 'he'
    }

    renderer.renderToString(context, (err, html) => {
      if (err) {
        return ctx.body = err.message;
      }
      ctx.body = html;
    })
  });
  app.listen(3000)
})

