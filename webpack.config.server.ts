
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';
import { EsbuildPlugin } from 'esbuild-loader';
import dotenv from 'dotenv';
import { type Configuration } from 'webpack';
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );
dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

const config: Configuration = {
  entry: {
    server: ['webpack-hot-middleware/server', './src/server/server.ts'],
  },
  output: {
    filename: '[name].cjs',
    path: path.resolve( __dirname, './dist/server' ),
    clean: true,
  },
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new EsbuildPlugin( {
        target: 'ES2020',
      } )
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
    new EsbuildPlugin( {
      define: {
        'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV ),
      }
    } ),
    new BundleAnalyzerPlugin.BundleAnalyzerPlugin(),
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
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js', '.json' ],
  },
  mode: isDev ? 'development' : 'production',
  watch: isDev,
  externalsPresets: { node: true },
  target: 'node',
  // REMOVE SOURCE MAP IN PROD IF YOU DON'T FEEL LIKE EXPOSING CLEAR CODE
  devtool: isDev ? 'eval-source-map' : false,
  externals: [ nodeExternals() ],
};

export default config;