const express = require('express');
const compression = require('compression');

const app = express();
const path = require('path');

// import { renderToString } from 'react-dom/server';

/*
function handleRender(req, res) {
  // 建立一個新的 Redux store 實體
  const store = createStore(counterApp)

  // 把 component Render 成字串
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )

  // 從我們的 Redux store 取得初始的 state
  const initialState = store.getState()

  // 把 render 完的頁面送回客戶端
  res.send(renderFullPage(html, preloadedState))
}
*/

// app.use(handleRender);

app.use(compression());
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

app.listen(3000);
console.log('Listening on port 3000');
