
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { EsbuildPlugin } from 'esbuild-loader';
import dotenv from 'dotenv';
import { type Configuration } from 'webpack';
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';
import { glob } from 'glob';
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );
dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

const config: Configuration = {
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
    usedExports: true,
    minimize: true,
    minimizer: [
      new EsbuildPlugin( {
        target: 'ES2020',
        css: true,
      } ),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: {
                // https://sharp.pixelplumbing.com/api-output#jpeg
                quality: 80,
              },
              webp: {
                // https://sharp.pixelplumbing.com/api-output#webp
                lossless: true,
              },
              avif: {
                // https://sharp.pixelplumbing.com/api-output#avif
                lossless: true,
              },

              // png by default sets the quality to 100%, which is same as lossless
              // https://sharp.pixelplumbing.com/api-output#png
              png: {},

              // gif does not support lossless compression at all
              // https://sharp.pixelplumbing.com/api-output#gif
              gif: {},
            },
          },
        },
        generator: [
          {
            // type: "asset",
            preset: "webp",
            filename: 'public/[name].webp',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 80,
                },
              },
            },
          },
        ],
      }),
    ],
    splitChunks: isDev ? false : {
      chunks: 'all',
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
      paths: glob.sync(`${path.join(__dirname, '../src/client')}/**/*.{ts,tsx,js,jsx,html,ejs}`, {
        nodir: true
      }),
      safelist: ['body', 'main'],
      blocklist: [],
    } ),
    new BundleAnalyzerPlugin.BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      // Pick one of the following loaders, not both:

      // Esbuild (Faster, simpler, but less flexible for advanced features)
      {
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: {
          target: 'ES2020'
        }
      },

      // Babel (Recommended for broader compatibility and advanced features)
      /*{
        test: /\.(?:js|ts|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              '@babel/preset-typescript'
            ],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }*/
     
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
      {
        test: /\.(jpe?g|png)$/i,
        type: "asset",
        generator: {
          filename: 'public/[name][ext][query]',
        }
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  mode: isDev ? 'development' : 'production',
  watch: isDev,
  target: 'web',
  devtool: isDev ? 'eval-source-map' : false,
};

export default config;