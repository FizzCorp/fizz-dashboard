// imports
import React from 'react';
import PropTypes from 'prop-types';
import constants from '../../../constants';

// globals
const STATES = constants.STATES;
const widthStyle = { minWidth: '90px' };
const disabledStyle = { pointerEvents: 'none' };

// exports
export default class StatefulButton extends React.Component {
  render() {
    if (this.props.disabled) {
      return this.disabled();
    }

    switch (this.props.currentState) {
      case STATES.INVALID:
      case STATES.UPDATED:
      case STATES.UNCHANGED: return this.enabled();
      case STATES.UPDATE_FAIL: return this.error();
      case STATES.UPDATE_SUCCESS: return this.success();
      case STATES.UPDATE_IN_PROGRESS: return this.loading();
    }

    return (<span></span>);
  }

  // render helpers
  disabled = () => {
    const { color, theme, defaultText } = this.props;
    const className = `ui ${theme} ${color} disabled button ${this.props.class}`;

    return this.renderButton({ className, text: defaultText });
  }

  enabled = () => {
    const { color, theme, defaultText } = this.props;
    const className = `ui ${theme} ${color} button ${this.props.class}`;

    return this.renderButton({ className, text: defaultText });
  }

  loading = () => {
    const { color, theme, defaultText } = this.props;
    const className = `ui ${theme} ${color} disabled loading button ${this.props.class}`;

    return this.renderButton({ className, text: defaultText });
  }

  success = () => {
    const { defaultText, successText } = this.props;
    const className = `ui green button ${this.props.class}`;

    return this.renderButton({ className, text: successText || defaultText }, disabledStyle);
  }

  error = () => {
    const { defaultText, errorText } = this.props;
    const className = `ui red button ${this.props.class}`;

    return this.renderButton({ className, text: errorText || defaultText }, disabledStyle);
  }

  renderButton = (params, styleP = {}) => {
    const { text, className } = params;
    const { id, icon, style, onClick } = this.props;

    const btnType = onClick ? 'button' : 'submit';
    const btnStyle = { ...widthStyle, ...styleP, ...style };

    return (
      <button id={id} type={btnType} onClick={onClick} style={btnStyle} className={className}>
        {icon && <i className={`${icon} icon`}></i>}
        {text}
      </button>
    );
  }
}

// component meta
StatefulButton.propTypes = {
  onClick: PropTypes.func,
  style: PropTypes.object,
  disabled: PropTypes.bool,

  id: PropTypes.string,
  icon: PropTypes.string,
  theme: PropTypes.string,
  class: PropTypes.string,
  color: PropTypes.string,
  errorText: PropTypes.string,
  successText: PropTypes.string,
  defaultText: PropTypes.string,
  currentState: PropTypes.string
};

StatefulButton.defaultProps = {
  icon: null,
  onClick: null,
  errorText: null,
  successText: null,

  class: '',
  color: 'blue',
  theme: 'basic',
  defaultText: '',

  id: undefined,
  disabled: false,
  style: widthStyle,
  currentState: STATES.UNCHANGED
};