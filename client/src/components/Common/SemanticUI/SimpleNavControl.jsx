// imports
import React from 'react';
import PropTypes from 'prop-types';

// exports
export default class SimpleNavControl extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  render() {
    return (
      <div className='ui right floated pagination menu' style={{ width: 'auto' }}>
        {
          this.renderNavButton(false)
        }
        {
          this.renderNavButton(true)
        }
      </div>
    );
  }

  // render helpers
  renderNavButton(isNext) {
    const { disableNext, disablePrevious } = this.props;
    const disabled = isNext ? disableNext : disablePrevious;

    const direction = isNext ? 'right' : 'left';
    const disabledClass = disabled ? ' disabled' : '';

    return (
      <a
        className={`icon item${disabledClass}`}
        onClick={!disabledClass ? this.handleNavigation(isNext) : undefined}
      >
        <i className={`${direction} chevron icon`}></i>
      </a>
    );
  }

  // helper methods - page actions
  handleNavigation(isNext) {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (isNext) {
        this.props.handleNext();
      }
      else {
        this.props.handlePrevious();
      }
    };
  }
}

// component meta
SimpleNavControl.propTypes = {
  handleNext: PropTypes.func,
  handlePrevious: PropTypes.func,

  disableNext: PropTypes.bool.isRequired,
  disablePrevious: PropTypes.bool.isRequired
};

SimpleNavControl.defaultProps = {
  handleNext: () => { },
  handlePrevious: () => { }
};