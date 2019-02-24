import "./App.scss";

import React, { Component } from "react";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore, Unsubscribe } from "redux";
import logger from "redux-logger";

import { Input, inputReducer } from "./components";

const store = createStore(combineReducers({
  firstInput: inputReducer,
}), applyMiddleware(logger));

class App extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { focused: false, value: "", focused2: false, value2: "123" };
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
                      value={this.state.value} onValueChanged={(value) => this.setState({ value })}
                />
              </div>
              <div>
                <Input />
                <Input focused={this.state.focused2} onFocusChanged={(focused) => this.setState({ focused2: focused })}
                      value={this.state.value2} onValueChanged={(value) => this.setState({ value2: value })}
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
