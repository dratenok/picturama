import express from 'express';
import webpack from 'webpack';
import path from 'path';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import bodyParser from 'body-parser';
import config from '../../webpack.config';
import runIO from './io';

const compiler = webpack(config);
const app = express();

export const users = [];
const colors = ['#DC1010', '#005DC7', '#00C7B3', '#00C70D', '#EFFF07', '#F807FF', 'FF7307', '#07924C'];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve hot-reloading bundle to client if Dev
if (process.env.NODE_ENV !== 'production') {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true, publicPath: '/',
  }));
  app.use(webpackHotMiddleware(compiler));
}

app.post('/login', (req, res) => {
  const { login } = req.body;
  const onExist = users.find(user => user.login === login);
  if (!onExist) {
    const idColor = users.length;
    users.push({
      login,
      color: colors[idColor],
    });
    res.send({
      login,
      color: colors[idColor],
    });
  } else {
    res.status(206).send(onExist);
  }
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/client', 'index.html'));
});

const server = app.listen(3000, () => console.log('Picturama listening on port 3000!'));
runIO(server);
