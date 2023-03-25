const path = require('path');


module.exports = { 
        entry: './index.js',
        resolve: {
            fallback: {
              util: false,
              "path": require.resolve("path-browserify"),
              "url": require.resolve("url/"),
              "buffer": require.resolve("buffer/"),
              "os": require.resolve("os-browserify/browser"),
              assert: require.resolve('assert/'),
              "http": require.resolve("stream-http"),
              "crypto": require.resolve("crypto-browserify"),
              stream: require.resolve('stream-browserify')

            }
          },
        }
        

