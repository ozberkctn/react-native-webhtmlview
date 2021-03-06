import React, { Component } from "react";
import { WebView } from "react-native";

class WebHtmlView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: props.height || 200
    };
  }

  _handleNavigationStateChange(navState) {
    if (this.state.height !== navState.title) {
      const contentHeight = parseInt(navState.title, 10) || 200;
      this.setState({
        height: Number(contentHeight)
      });
    }
    if (typeof this.props.onNavigationStateChange === "function") {
      this.props.onNavigationStateChange();
    }
  }

  render() {
    let { source, autoHeight, style, innerCSS } = this.props;

    if (!source) {
      return null;
    }

    debugger;

    const injectScript = `
      <script>;
        (function() {
          var wrapper = document.createElement("div");
          wrapper.id = "height-wrapper";
          while (document.body.firstChild) {
            wrapper.appendChild(document.body.firstChild);
          }
          document.body.appendChild(wrapper);
          var i = 0;
          function updateHeight() {
            document.title = wrapper.clientHeight;
            window.location.hash = ++i;
          }
          updateHeight();
          window.addEventListener("load", function() {
            updateHeight();setTimeout(updateHeight, 1000);
          });
          window.addEventListener("resize", updateHeight);
        }());
      </script>
    `;
    const startHtmlDoc = `
      <html><head>
        <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1">
        <style>${innerCSS}</style></head><body>
    `;
    const endHtmlDoc = "</body></html>";

    if (source.html && autoHeight) {
      let finalHtmlDoc =
        startHtmlDoc +
        '<div style="word-break:break-word">' +
        source.html +
        "</div>" +
        injectScript +
        endHtmlDoc;

      source = Object.assign({}, source, {
        html: finalHtmlDoc
      });
    }

    return (
      <WebView
        source={{ html: source.html, baseUrl: "" }}
        style={[style, autoHeight ? { height: this.state.height + 25 } : null]}
        automaticallyAdjustContentInsets={false}
        scrollEnabled={!autoHeight}
        javaScriptEnabled={autoHeight}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onNavigationStateChange={this._handleNavigationStateChange.bind(this)}
      />
    );
  }
}

WebHtmlView.defaultProps = {
  innerCSS: "",
  autoHeight: true
};

export default WebHtmlView;
