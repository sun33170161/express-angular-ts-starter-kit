import * as express from 'express';

export default (router: express.Router) => {
  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
  });
}
