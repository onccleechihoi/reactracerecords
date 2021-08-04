/**
  在 action 被 dispatch 之後，Log 所有的 action 和 state。
 */
const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd(action.type);
  return result;
};

/**
 * 在 state 被更新且 listener 被通知之後傳送當機回報。
 */
const crashReporter = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState(),
      },
    });
    throw err;
  }
};

/**
 * 用 { meta: { delay: N } } 來排程 actions 讓它延遲 N 毫秒。
 * 在這個案例中，讓 `dispatch` 回傳一個 function 來取消 timeout。
 */
const timeoutScheduler = (store) => (next) => (action) => {
  if (!action.meta || !action.meta.delay) {
    return next(action);
  }

  const timeoutId = setTimeout(() => next(action), action.meta.delay);

  return function cancel() {
    clearTimeout(timeoutId);
  };
};

/**
 * 用 { meta: { raf: true } } 來排程 action，
 * 讓它在 rAF 迴圈中被 dispatch。在這個案例中，
 * 讓 `dispatch` 回傳一個 function 來從佇列中移除這個 action。
 */
const rafScheduler = (store) => (next) => {
  let queuedActions = [];
  let frame = null;

  function loop() {
    frame = null;
    try {
      if (queuedActions.length) {
        next(queuedActions.shift());
      }
    } finally {
      maybeRaf();
    }
  }

  function maybeRaf() {
    if (queuedActions.length && !frame) {
      frame = requestAnimationFrame(loop);
    }
  }

  return (action) => {
    if (!action.meta || !action.meta.raf) {
      return next(action);
    }

    queuedActions.push(action);
    maybeRaf();

    return function cancel() {
      queuedActions = queuedActions.filter((a) => a !== action);
    };
  };
};

/**
 * 讓你除了 action 以外還可以 dispatch promise。
 * 如果這個 promise 被 resolve，它的結果將會作為 action 被 dispatch。
 * 這個 promise 會被 `dispatch` 回傳，所以呼叫者可以處理 rejection。
 */
const vanillaPromise = (store) => (next) => (action) => {
  if (typeof action.then !== 'function') {
    return next(action);
  }

  return Promise.resolve(action).then(store.dispatch);
};

/**
 * 讓你可以 dispatch 有 { promise } 屬性的特殊 actions。
 *
 * 這個 middleware 將會在一開始的時候 dispatch 一個 action，
 * 並在這個 `promise` resolves 的時候 dispatch 一個成功 (或失敗) 的 action。
 *
 * 為了方便，`dispatch` 將會回傳 promise 讓呼叫者可以等待。
 */
const readyStatePromise = (store) => (next) => (action) => {
  if (!action.promise) {
    return next(action);
  }

  function makeAction(ready, data) {
    const newAction = { ...action, ready, ...data };
    delete newAction.promise;
    return newAction;
  }

  next(makeAction(false));
  return action.promise.then(
    (result) => next(makeAction(true, { result })),
    (error) => next(makeAction(true, { error })),
  );
};

/**
 * 讓你可以 dispatch 一個 function 來取代 action。
 * 這個 function 將會接收 `dispatch` 和 `getState` 作為參數。
 *
 * 對提早退出 (依照 `getState()` 的狀況)，
 * 以及非同步控制流程 (它可以 `dispatch()` 一些別的東西) 很有用。
 *
 * `dispatch` 將會回傳被 dispatch 的 function 的回傳值。
 */
const thunk = (store) => (next) => (action) => (typeof action === 'function' ? action(store.dispatch, store.getState) : next(action));

// 你可以使用全部！(這不意味你應該這樣做。)
const todoApp = combineReducers(reducers);
const store = createStore(
  todoApp,
  applyMiddleware(
    rafScheduler,
    timeoutScheduler,
    thunk,
    vanillaPromise,
    readyStatePromise,
    logger,
    crashReporter,
  ),
);
