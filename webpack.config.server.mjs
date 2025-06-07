
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';
import { EsbuildPlugin } from 'esbuild-loader';
import dotenv from 'dotenv';
// import { type Configuration } from 'webpack';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );
dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

const config = {
  entry: {
    server: './src/server/server.ts',
  },
  output: {
    filename: '[name].cjs',
    path: path.resolve( __dirname, './dist/server' ),
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new EsbuildPlugin( {
        target: 'ES2020',
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
    new EsbuildPlugin( {
      define: {
        'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV ),
      }
    } )
  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: {
          target: 'ES2020'
        }
      },
      //      {
      //        test: /\.tsx?$/,
      //        use: 'ts-loader',
      //        exclude: /node_modules/,
      //      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
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