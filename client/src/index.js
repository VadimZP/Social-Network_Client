import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import createBrowserHistory from "history/createBrowserHistory"
import { Provider } from 'react-redux'

import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { saveState } from './redux/localStorage'
import configuredStore from './redux/configuredStore'

const history = createBrowserHistory()
const store = configuredStore()

ReactDOM.render(
  <Provider store={store} history={history}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById('root')
)

store.subscribe(() => saveState(store.getState()))

registerServiceWorker()
