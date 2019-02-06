import React, { Component } from "react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore, combineReducers, Unsubscribe } from "redux";
import logger from "redux-logger";

import { Input, inputReducer } from "./Components";
import "./App.scss";

const store = createStore(combineReducers({
  firstInput: inputReducer,
}), applyMiddleware(logger));

class App extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { focused: false, value: "" };
    }

    private subscription: Unsubscribe | undefined;

    componentDidMount() {
        this.subscription = store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        if (this.subscription) {
            this.subscription();
        }
    }

    render() {
      const { firstInput } = store.getState();

      return (
        <div className="App">
          <main>
            <article>
              <h1>Without redux store</h1>
              <div>
                <Input />
                <Input focused={this.state.focused} onFocusChanged={(focused) => this.setState({ focused })}
                      value={this.state.value} onChange={(value) => this.setState({ value })}
                />
              </div>
            </article>
            <Provider store={store}>
            <article>
              <h1>With redux store</h1>
              <div>
                <Input useGlobalStore focused={firstInput.focused} value={firstInput.value} />
              </div>
            </article>
            </Provider>
          </main>
        </div>
      );
    }
}

export default App;
