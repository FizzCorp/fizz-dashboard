// imports
import { repositories } from './repositories';

// helper methods
const checkAndExecuteCB = (cb, data) => {
  if (cb && typeof cb === 'function') {
    return cb(data);
  }
};

// exports
export const promiseMiddleware = store => next => (action) => {
  const {
    types,
    promise,
    foundInCache,
    afterRequestCb,
    afterSuccessCb,
    afterfailureCb,
    ...rest
  } = action;

  if (!promise) {
    return Promise.resolve(next(action));
  }

  if (foundInCache && typeof foundInCache === 'function') {
    if (foundInCache(store)) {
      return;
    }
  }

  const [REQUEST, SUCCESS, FAILURE] = types;
  next({ ...rest, type: REQUEST });
  checkAndExecuteCB(afterRequestCb);

  return promise(repositories(), store)
    .then((result) => {
      next({ ...rest, result, type: SUCCESS }); checkAndExecuteCB(afterSuccessCb, result);
    },
      (error) => {
        next({ ...rest, error, type: FAILURE }); checkAndExecuteCB(afterfailureCb, error);
      }
    );
};

export const submitPromiseMiddleware = store => next => (action) => {
  const {
    types,
    foundInCache,
    submitPromise,
    afterRequestCb,
    afterSuccessCb,
    afterfailureCb,
    afterSuccessEffectCb,
    afterfailureEffectCb,
    ...rest
  } = action;

  if (!submitPromise) {
    return Promise.resolve(next(action));
  }

  if (foundInCache && typeof foundInCache === 'function') {
    if (foundInCache(store)) {
      return;
    }
  }

  const [REQUEST, SUCCESS_EFFECT, SUCCESS, FAILURE_EFFECT, FAILURE] = types;
  next({ ...rest, type: REQUEST });
  checkAndExecuteCB(afterRequestCb);

  return submitPromise(repositories(), store)
    .then((result) => {
      setTimeout(() => {
        next({ ...rest, result, type: SUCCESS_EFFECT }); checkAndExecuteCB(afterSuccessEffectCb, result);
        setTimeout(() => {
          next({ ...rest, result, type: SUCCESS }); checkAndExecuteCB(afterSuccessCb, result);
        }, 1000);
      }, 0);
    },
      (error) => {
        setTimeout(() => {
          next({ ...rest, error, type: FAILURE_EFFECT }); checkAndExecuteCB(afterfailureEffectCb, error);
          setTimeout(() => {
            next({ ...rest, error, type: FAILURE }); checkAndExecuteCB(afterfailureCb, error);
          }, 1000);
        }, 0);
      }
    );
};