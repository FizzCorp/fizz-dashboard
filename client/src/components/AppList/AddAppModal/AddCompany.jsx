// imports
import React from 'react';
import PropTypes from 'prop-types';
import StatefulButton from '../../Common/SemanticUI/StatefulButton.jsx';

// globals
const selectorId = '.ui.form.add-company';
const checkboxFields = {
  features: [
    'VIP Support chat',
    'Segmented Broadcasting',
    'Real-Time Translations',
    'Troop Request/Donation System',
    'Chat Analytics (search chat, trending words, sentiment)'
  ],
  platforms: [
    'Unity',
    'Unreal',
    'Cocos2dx',
    'Native iOS/Android',
    'JavaScript',
    'Web'
  ]
};

// exports - react class
export default class AddCompany extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      features: {},
      platforms: {},
      otherFeature: '',
      otherPlatform: ''
    };
  }

  // react lifecycle
  componentDidMount() {
    this.init();
  }

  render() {
    return (
      <div style={{ backgroundColor: '#fff' }}>
        <h3 className='ui center aligned icon grey header' style={{ fontWeight: 400 }}>
          <i className='road blue icon'></i>
          {'Welcome to dashboard'}
        </h3>
        <form className='ui form add-company' onSubmit={this.handleSubmit}>
          <div className='field'>
            <label>{'Organization name'}</label>
            <input type='text' name='companyName' placeholder='' />
          </div>
          <div className='row'>
            <div className='small-12 medium-6 column'>
              <h4 className='ui horizontal divider header' style={{ fontWeight: 400 }}>
                <i className='dolly grey icon'></i>
                {'Feature Wishlist'}
              </h4>
              <br />
              {this.renderFeatureCheckboxField(0)}
              {this.renderFeatureCheckboxField(1)}
              {this.renderFeatureCheckboxField(2)}
              {this.renderFeatureCheckboxField(4)}
              {this.renderFeatureCheckboxField(3)}
              <br />
            </div>
            <div className='small-12 medium-6 column'>
              <h4 className='ui horizontal divider header' style={{ fontWeight: 400 }}>
                <i className='clipboard list grey icon'></i>
                {'Target Platforms'}
              </h4>
              <br />
              {this.renderPlatformCheckboxField(0)}
              {this.renderPlatformCheckboxField(1)}
              {this.renderPlatformCheckboxField(2)}
              {this.renderPlatformCheckboxField(3)}
              {this.renderPlatformCheckboxField(4)}
              {this.renderPlatformCheckboxField(5)}
              <br />
            </div>
          </div>
          <div className='row'>
            <div className='small-12 medium-6 column'>
              <div className='field'>
                <label style={{ fontWeight: 400 }}>{'Other'}</label>
                <input type='text' onChange={event => this.setState({ otherFeature: event.target.value })} value={this.state.otherFeature} />
              </div>
            </div>
            <div className='small-12 medium-6 column'>
              <div className='field'>
                <label style={{ fontWeight: 400 }}>{'Other'}</label>
                <input type='text' onChange={event => this.setState({ otherPlatform: event.target.value })} value={this.state.otherPlatform} />
              </div>
            </div>
          </div>
          <br />
          <StatefulButton
            defaultText='Next'
            class='right floated'
            style={{ marginRight: '10px' }}
          />
        </form>
      </div>
    );
  }

  // render helpers
  renderCheckboxField = (params) => {
    const { key, index } = params;
    const text = checkboxFields[key][index];

    return (
      <div className='field'>
        <div className='ui checkbox'>
          <input type='checkbox' id={`${key}-${index}`} checked={!!this.state[key][text]} onChange={this.checkboxClicked({ text, key })} />
          <label htmlFor={`${key}-${index}`} style={{ width: 'max-content' }} style={{ cursor: 'pointer' }}>
            {text}
          </label>
        </div>
      </div>
    );
  }

  renderFeatureCheckboxField = (index) => {
    return this.renderCheckboxField({ index, key: 'features' });
  }

  renderPlatformCheckboxField = (index) => {
    return this.renderCheckboxField({ index, key: 'platforms' });
  }

  // form handlers
  init() {
    this.getForm().form({
      inline: true,
      fields: {
        companyName: {
          optional: false,
          rules: [{ type: 'empty' }]
        }
      }
    })// stop refresh on enter press
      .submit(() => false);
  }

  getForm() {
    return $(selectorId);
  }

  // event handlers
  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.getForm().form('is valid')) {
      return;
    }

    const features = Object.keys(this.state.features);
    const platforms = Object.keys(this.state.platforms);
    const { otherFeature, otherPlatform } = this.state;
    const companyName = $(`${selectorId} input[name=companyName]`).val();

    if (otherFeature.length > 1) {
      features.push(otherFeature);
    }
    if (otherPlatform.length > 1) {
      platforms.push(otherPlatform);
    }

    const data = {
      name: companyName,
      features: features,
      platforms: platforms
    };

    this.props.setCompanyData(data, () => {
      this.props.nextStep();
    });
  }

  checkboxClicked = ({ text, key }) => {
    return (/* event*/) => {
      let item = JSON.parse(JSON.stringify(this.state[key]));
      if (item[text]) {
        delete item[text];
      }
      else {
        item[text] = true;
      }
      this.setState({
        [key]: item
      });
    };
  }
}

// component meta
AddCompany.propTypes = {
  setCompanyData: PropTypes.func.isRequired
};

AddCompany.defaultProps = {};