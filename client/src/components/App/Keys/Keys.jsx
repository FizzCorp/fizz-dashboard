// imports
import React from "react";
import { connect } from "react-redux";
import TabHeader from "../TabHeader.jsx";

// react class
class Keys extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    $(".keys .help.icon").popup({
      on: "hover",
      addTouchEvents: true,
    });

    $(".keys .paste.icon").popup({
      on: "click",
      onShow: function ($module, a) {
        new Clipboard(".keys .paste.icon.visible");
      },
    });
  }

  renderIntegrationSteps = () => {
    return (
      <div>
        <br/>
        <h2 className="ui blue header">Chat Integration</h2>
        <p style={{marginTop: 10}}>
          Now that you have created the App, here are simple steps to start development:
        </p>
        <ol style={{color: "#32325d"}}>
          <li>
            Download the latest Fizz SDK release from{" "}
            <a href="https://github.com/FizzCorp/Fizz-Unity-UI/releases">
              Github
            </a>
          </li>
          <li>Copy the keys listed above</li>
          <li>
            Follow the{" "}
            <a href="https://github.com/FizzCorp/Fizz-Unity-UI#instructions">
              instructions
            </a>{" "}
            and you are good to go! &nbsp;
          </li>
        </ol>
        <p>If you have any questions, please contact our support team at <a mailto="devsupport@fizz.io">devsupport@fizz.io</a>&mdash;we're a bunch of helpful folks!</p>
      </div>
    );
  };

  render() {
    return (
      <div>
        <TabHeader sectionHeading={`App Info`} />
        <h2 className="ui blue header">{this.props.app.name}</h2>
        <div className="keys">
          <table className="ui celled table">
            <thead></thead>
            <tbody>
              <tr>
                <td className="collapsing">
                  <div className="ui ribbon blue label"> {"App ID"} </div>
                  <div className="float-right hide-for-c-medium keys-icons">
                    {this.renderPasteIcon("#appId")}
                    {this.renderHelpIcon(
                      "Used to uniquely identify a Fizz application. Required by the Fizz API."
                    )}
                  </div>
                </td>
                <td id="appId"> {this.props.app.id} </td>
                <td className="collapsing center aligned">
                  {this.renderPasteIcon("#appId", "show-for-c-medium")}
                </td>
                <td className="collapsing center aligned">
                  {this.renderHelpIcon(
                    "Used to uniquely identify a Fizz application. Required by the Fizz API.",
                    "show-for-c-medium"
                  )}
                </td>
              </tr>
              <tr>
                <td className="collapsing">
                  <div className="ui ribbon blue label"> {"App Secret"} </div>
                  <div className="float-right hide-for-c-medium keys-icons">
                    {this.renderPasteIcon("#serverSecret")}
                    {this.renderHelpIcon(
                      "Used to uniquely identify a Fizz application. Required by the Fizz API."
                    )}
                  </div>
                </td>
                <td id="serverSecret"> {this.props.app.clientSecret} </td>
                <td className="collapsing center aligned">
                  {this.renderPasteIcon("#serverSecret", "show-for-c-medium")}
                </td>
                <td className="collapsing center aligned">
                  {this.renderHelpIcon(
                    "Used to authenticate a Fizz application. Required by the Fizz API.",
                    "show-for-c-medium"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {this.renderIntegrationSteps()}
        </div>
      </div>
    );
  }

  // render helpers
  renderHelpIcon(content, classes) {
    return (
      <i
        className={"grey help circle icon " + classes}
        data-content={content}
      />
    );
  }

  renderPasteIcon(target, classes) {
    return (
      <i
        className={"grey paste icon " + classes}
        data-content="Copied to Clipboard"
        data-position="top center"
        data-clipboard-target={target}
      />
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  return {
    app: state.domain.apps.byIds[currentAppId],
  };
};

const mapDispatchToProps = (/* dispatch, props*/) => {
  return {};
};

// exports
const KeysContainer = connect(mapStateToProps, mapDispatchToProps)(Keys);
export default KeysContainer;
