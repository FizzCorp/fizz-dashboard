// model extension
function extend(App) {
  App.upsert = (condition, values) => App.findOne({ where: condition })
    .then((app) => {
      if (app) { // update
        return app.update(values);
      }
      // insert
      return App.create(values);
    });
};

// exports
module.exports = {
  extend: extend
};