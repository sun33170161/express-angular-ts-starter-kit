import * as express from 'express';

export default (router: express.Router) => {
  /* GET users listing. */
  router.get('/users', function (req, res, next) {
    res.send('respond with a resource');
  });
}
