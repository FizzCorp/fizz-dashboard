// imports
import React from 'react';
import PropTypes from 'prop-types';

// exports
export default class SimpleDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedKey: props.defaultKey };
  }

  // react lifecycle
  componentDidMount() {
    const { name, disabled } = this.props;
    const dropDownName = `.ui.selection.dropdown.dropdown-${name}`;

    const dropDownComponent = $(dropDownName);
    disabled && dropDownComponent.addClass('disabled');

    dropDownComponent.dropdown({
      onChange: (value, text, choice) => {
        this.props.handleOnChange.call(this, value, text, choice);
      }
    });

    $(`${dropDownName} .remove.icon`).on('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      dropDownComponent.dropdown('clear');
    });
  }

  componentWillReceiveProps(newProps) {
    const { name, disabled } = newProps;
    if (disabled === this.props.disabled) {
      return;
    }

    const dropDownName = `.ui.selection.dropdown.dropdown-${name}`;
    if (disabled) {
      $(dropDownName).addClass('disabled');
    }
    else {
      $(dropDownName).removeClass('disabled');
    }
  }

  render() {
    const { hash, name, sortKeys, placeholder, placeholderSelected } = this.props;
    const selectedKey = this.props.selectedKey || this.state.selectedKey;

    const defaultText = (selectedKey && hash[selectedKey]) ? hash[selectedKey].text : null;
    const selectedText = defaultText || placeholder;

    let selectedTextStyle = { color: 'black' };
    if (selectedText === placeholder) {
      if (!placeholderSelected) {
        selectedTextStyle = { color: 'rgba(191, 191, 191, .87)' };
      }
    }

    const hashKeys = hash ? Object.keys(hash) : [];
    sortKeys && hashKeys.sort((a, b) => a - b);
    const dropDownClass = `component ui fluid selection dropdown dropdown-${name}`;
    return (
      <div className={dropDownClass}>
        <input type='hidden' name={name} value={selectedKey || ''} />
        <i className='dropdown icon'></i>
        {this.props.removeable && <i className='remove icon'></i>}
        <div style={selectedTextStyle}>
          {selectedText}
        </div>
        <div className='menu'>
          {
            hashKeys.map((key) => {
              return (<div key={key} className={`item ${key === selectedKey && 'active'}`} data-value={key}>{hash[key].text}</div>);
            })
          }
        </div>
      </div>
    );
  }
}

// component meta
SimpleDropDown.propTypes = {
  defaultKey: PropTypes.string,
  selectedKey: PropTypes.string,
  placeholder: PropTypes.string,

  disabled: PropTypes.bool,
  removeable: PropTypes.bool,
  placeholderSelected: PropTypes.bool,

  handleOnChange: PropTypes.func,

  name: PropTypes.string.isRequired,
  hash: PropTypes.object.isRequired
};

SimpleDropDown.defaultProps = {
  defaultKey: null,
  selectedKey: null,
  placeholder: null,

  sortKeys: false,
  disabled: false,
  removeable: true,
  placeholderSelected: true,

  handleOnChange: function (value/* , text, choice*/) {
    const selectedKey = (value && value.length > 0) ? value : null;
    this.setState({ selectedKey });
  }
};