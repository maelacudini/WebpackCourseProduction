
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { EsbuildPlugin } from 'esbuild-loader';
import dotenv from 'dotenv';
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';
import { glob } from 'glob';
// import { type Configuration } from 'webpack';
// import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );
dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

const config = {
  entry: {
    client: './src/client/client.ts',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve( __dirname, './dist/client' ),
    clean: true,
  },
  /*devServer: {
    static: {
      directory: path.resolve( __dirname, './' ),
    },
    hot: true,
    open: true,
    port: 3000,
    client: {
      overlay: true,
    },
  },*/
  optimization: {
    minimize: true,
    minimizer: [
      // `...`,
      // new CssMinimizerPlugin(),
      new EsbuildPlugin( {
        target: 'ES2020',
        css: true,
      } )
    ],
    splitChunks: isDev ? false : {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin( {
      filename: '[name].[contenthash].css'
    } ),
    new HtmlWebpackPlugin( {
      filename: 'home.html',
      template: 'src/client/views/templates/template.html',
      title: 'Optimize Webpack for Production',
      chunks: [ 'client' ]
    } ),
    new EsbuildPlugin( {
      define: {
        'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV ),
      }
    } ),
    new PurgeCSSPlugin( {
      paths: glob.sync( `${path.join( __dirname, '../src/client/style' )}/**/*`, { nodir: true } ),
    } ),
  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: {
          target: 'ES2020'
        },
        exclude: /node_modules/
      },
      //      {
      //        test: /\.tsx?$/,
      //        use: 'ts-loader',
      //        exclude: /node_modules/,
      //      },
      {
        test: /\.css$/i,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: 'esbuild-loader',
            options: {
              minify: true
            }
          }
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  mode: isDev ? 'development' : 'production',
  watch: isDev,
  target: 'web',
  devtool: isDev ? 'eval-source-map' : 'source-map',
};

export default config;