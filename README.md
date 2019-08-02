# ssr-reproduction
this is a reproduction repo for https://github.com/webpack/webpack/issues/9514

The setup is similar to my company code. run ``npm install``, then ``node server.js``.

After that, change App.vue, you will enconter error in below:
```
Error: Server-side bundle should have one single entry file. Avoid using CommonsChunkPlugin in the server config
```
In my company code, it doesn't show this error. maybe it's hidden by other config. But if you delete 

```
currentChunk.files.push(filename);
compilation.hooks.chunkAsset.call(currentChunk, filename);

```
from HotModuleReplacementPlugin.js file. It will have normal hmr just like my company code.
