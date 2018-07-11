'use strict';
//  Summary:
//    Get webpack config for different targets

const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const express = require('express');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    inline: true,
    port: 8080,
    hot: true,
    before: function(app) {
      app.use(
        '/thirty/postmate.js',
        express.static(path.resolve(__dirname, './postmate/postmate.dev.js'))
      );
    }
  },
  devtool: process.env.NODE_ENV == 'cheap-module-inline-source-map',
  mode: process.env.NODE_ENV,
  cache: true,
  context: path.join(__dirname, './'),
  target: 'web',
  performance: {
    hints: false,
    maxEntrypointSize: 250,
    maxAssetSize: 1000
  },
  entry: {
    main: ['./index.jsx']
  },

  output: {
    filename: '[name].js'
  },

  stats: 'errors-only',

  resolve: {
    alias: {
      /*
       styled-components不能同事存在两个实例，可能会导致css错误，
       在vpt-components在使用lerna是在vpt-ide中是软连接，导致使用vpt root上的node_modules
       这里强制指定styled-components的路径
      */
      'styled-components': path.resolve(
        __dirname,
        './node_modules/styled-components/dist/styled-components.es.js'
      )
    },
    extensions: ['.js', '.tsx']
  },
  plugins: _.compact([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'visual prototype tools',
      template: path.join(__dirname, './index.html'),
      excludeChunks: ['main']
    })
  ]),

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|build/,
        loader: 'babel-loader?cacheDirectory=true'
      },
      {
        test: /\.(ttf|eot|svg|woff)$/,
        loader: 'url-loader?limit=1000000' // TODO: it seems only inline base64 font works.
      },
      {
        test: /\.less$/,
        loader:
          'style-loader!css-loader?module&sourceMap!less-loader?{"sourceMap":true,"javascriptEnabled": true}'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.scss$/,
        enforce: 'pre',
        exclude: [/node_modules/],
        use: [
          {
            loader: '@microsoft/loader-load-themed-styles' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: '[name]_[local]_[hash:base64:5]',
              minimize: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [require('autoprefixer')];
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, './'),
        use: [{ loader: 'awesome-typescript-loader' }]
      }
    ]
  }
};
