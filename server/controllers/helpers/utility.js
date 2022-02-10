// exports
module.exports = {
  commonMiddleWares: {
    handleErrorsIfAny(err, req, res, next) {
      console.log('commonMiddleWare Errors: ', err);
      res.send(err);
    }
  }
};