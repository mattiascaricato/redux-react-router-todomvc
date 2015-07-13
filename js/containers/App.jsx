import React, { Component } from 'react';
import { createRedux } from 'redux';
import { Provider } from 'redux/react';

import TodoRoot from '../components/TodoRoot';
import * as stores from '../stores/';

export default class App extends Component {
  render() {
    const redux = createRedux(stores);

    return (
      <Provider redux={redux}>
        {() => <TodoRoot />}
      </Provider>
    );
  }
}