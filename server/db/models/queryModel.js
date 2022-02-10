// model extension
function extend(Query) {
  Query.deleteQuery = function (queryId) {
    return Query
      .findByPk(queryId)
      .then((query) => {
        if (!query) {
          return Promise.reject('Query Not Found');
        }
        return Query
          .destroy({ where: { id: queryId } })
          .then(deletedRows => Promise.resolve(query));
      })
      .catch(error => Promise.reject(error));
  };
  Query.getAllForAppIdWithType = function (appId, type) {
    const queryOptions = {
      where: { app_id: appId, type: type },
      order: [['title', 'ASC']]
    };
    return Query.findAll(queryOptions);
  };
};

// exports
module.exports = {
  extend: extend
};