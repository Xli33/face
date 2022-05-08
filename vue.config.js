const { NODE_ENV, VUE_APP_PACKENV } = process.env;
const isBuild = NODE_ENV !== "development";

console.log(NODE_ENV, VUE_APP_PACKENV);

module.exports = {
  chainWebpack: config => {
    /*  config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: "chunk-vendors",
          minChunks: 1,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "initial"
        },
        default: {
          name: "chunk-common",
          minChunks: 1,
          // test: /[\\/]src/, ///[\\/]src[\\/](assets|components|utils|App.vue|server[\\/]modules[\\/]base.js|server[\\/]config.js)/
          priority: -20,
          chunks: "all",
          reuseExistingChunk: true
          // minSize: 10000
        }
      }
    }); */
    // 生产环境去除 console.log
    process.env.PACKENV === "formal" &&
      config.optimization.minimizer("terser").tap(args => {
        args[0].terserOptions.compress.pure_funcs = ["console.log"];
        return args;
      });
    isBuild &&
      config.plugin("html").tap(options => {
        options[0].minify.minifyJS = true;
        return options;
      });
  },
  configureWebpack: {
    externals: {
      vue: "Vue",
      "vue-router": "VueRouter"
    },
    devtool: !isBuild && "eval-source-map" // 替换默认的sourcemap配置，同名文件也能方便调试
  },
  publicPath: isBuild ? "./" : "/",
  lintOnSave: false,
  filenameHashing: true,
  devServer: {
    host: "0.0.0.0",
    port: 8000,
    // open: true,
    // contentBase: "./dist",
    https: true,
    proxy: { 
      "/api": {
        target: "http://xxx",  
        changeOrigin: true,   
        secure: false
        /*pathRewrite: {  
            '^/api': '/api'   //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉  
        }*/
      }
    }
    /* https: { 使用指定证书
       key: fs.readFileSync('/path/to/server.key'),
       cert: fs.readFileSync('/path/to/server.crt'),
       ca: fs.readFileSync('/path/to/ca.pem'),
     }, */
  }
};
