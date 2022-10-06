import React, {Component} from 'react';
import {Dimensions, Platform} from 'react-native';
import {WebView} from 'react-native-webview';

const injectedScript = function () {
  const height = Math.max(
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.body.clientHeight,
    document.body.scrollHeight
  );
  window.ReactNativeWebView.postMessage(height);
};

export default class MyWebView extends Component {
  state = {
    webViewHeight: Number,
  };


  constructor(props) {
    super(props);
    this.state = {
      webViewHeight: this.props.defaultHeight,
    };

    this._onMessage = this._onMessage.bind(this);
  }

  _onMessage(e) {
    const {onMessage} = this.props;
    this.setState({
      webViewHeight: parseInt(e.nativeEvent.data),
    });
    onMessage(e);
  }

  stopLoading() {
    this.webview.stopLoading();
  }

  reload() {
    this.webview.reload();
  }

  render() {
    const _w = this.props.width || Dimensions.get('window').width - 50;
    const _h = this.props.autoHeight
      ? this.state.webViewHeight
      : this.props.defaultHeight;
    const androidScript =
      "window.postMessage = String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');" +
      '(' +
      String(injectedScript) +
      ')();';
    const iosScript =
      '(' +
      String(injectedScript) +
      ')();' +
      "window.postMessage = String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');";
    return (
      <WebView
        ref={ref => {
          this.webview = ref;
        }}
        injectedJavaScript={Platform.OS === 'ios' ? iosScript : androidScript}
        scrollEnabled={this.props.scrollEnabled || false}
        javaScriptEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets
        scalesPageToFit={false}
        {...this.props}
        onMessage={this._onMessage}
        style={[{width: _w}, this.props.style, {height: _h}]}
      />
    );
  }
}
