// imports
import React from 'react';
import PropTypes from 'prop-types';

// exports
export default class YesNoAlert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '',
      title: '',
      message: ''
    };
  }

  // react lifecycle
  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    return (
      <div className={`ui basic modal ${this.props.id}`}>
        <div className='ui icon header'>
          <i className={`${this.state.icon} icon`}></i>
          {this.state.title}
        </div>
        <div className='content'>
          <p>{this.state.message}</p>
        </div>
        <div className='actions'>
          <div className='ui red basic cancel inverted button'>
            <i className='remove icon'></i>
            {'No'}
          </div>
          <div className='ui green ok inverted button'>
            <i className='checkmark icon'></i>
            {'Yes'}
          </div>
        </div>
      </div>
    );
  }

  // modal helpers - general
  getModal() {
    return $(`.ui.basic.modal.${this.props.id}`);
  }

  // modal helpers - show / hide
  remove() {
    this.getModal()
      .modal()
      .remove();
  }

  show(alertJson) {
    const icon = alertJson.icon || '';
    const title = alertJson.title || '';
    const message = alertJson.message || '';
    const onApprove = (alertJson.onApprove && typeof alertJson.onApprove === 'function') ? alertJson.onApprove : () => { };

    if (icon.length > 0 && title.length > 0) {
      this.setState({
        icon: icon,
        title: title,
        message: message
      });

      this.getModal().modal({
        onApprove: onApprove
      }).modal('show');
    }
  }
}

// component meta
YesNoAlert.propTypes = {
  onRef: PropTypes.func,
  id: PropTypes.string.isRequired
};

YesNoAlert.defaultProps = {
  onRef: (/* ref*/) => { }
};