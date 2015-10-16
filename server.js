import express from 'express';
import jsonServer from 'json-server';
import logger from 'morgan';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack.config.dev';

const app = express();
const compiler = webpack(config);
const dbRouter = jsonServer.router('db.json');
const port = process.env.PORT || '8080';
const nodeEnv = process.env.NODE_ENV || 'development';

// Configure the logger
app.use(logger('dev', {
  skip: req => {
    return process.env.NODE_ENV === 'test' || req.path === '/favicon.ico';
  }
}));

// === Configure Webpack middleware ===
if (nodeEnv === 'development') {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(webpackHotMiddleware(compiler));
}

// Serve static files and index.html
app.use('/assets/css', express.static('css'));
if (nodeEnv === 'production') {
  app.use('/assets/js', express.static('assets/js'));
}

// Host the json server under /api
app.use('/api', dbRouter);

// Serve index.html from all URL's, allowing use of React Router.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, 'localhost', err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Server listening at http://localhost:${port} in ${nodeEnv} mode.`);
});
