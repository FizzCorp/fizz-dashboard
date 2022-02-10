// imports
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// globals
const BreadCrumbLabel = {
  // route
  keys: 'Keys',
  billing: 'Billing',
  apps: 'Applications',
  analytics: 'Analytics',
  preferences: 'Preferences',
  customerSupport: 'Customer Support',

  // cards
  chat: 'Chat',
  revenue: 'Revenue',
  sessions: 'Sessions',
  sentiment: 'Sentiment',
  activePlayers: 'Active Players',

  // customerSupport tabs
  messages: 'Messages',
  moderation: 'Moderation',

  // analytics tabs
  debug: 'Debug',
  trends: 'Trends',
  triggers: 'Triggers',
  chatSearch: 'Chat Search',
  trendingWords: 'Trending Words'
};

// react class
class BreadCrumbs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breadCrumbs: props.breadCrumbs || []
    };
  }

  render() {
    return (
      <section className='row expanded small-collapse medium-uncollapse bread-crumbs-container align-middle'>
        <div className='small-12 columns'>
          <div className='ui breadcrumb'>
            {
              this.getBreadCrumbs().map((value, index) => {
                return (
                  <span key={index}>
                    {this.renderBreadCrumbNode(value)}
                  </span>
                );
              })
            }
          </div>
        </div>
      </section>
    );
  }

  // render helpers
  renderBreadCrumbNode(value) {
    if (value.seperator) {
      return (<i className='right angle icon divider'></i>);
    }
    if (value.active) {
      return (<div className='active section'>{value.label}</div>);
    }
    return (<Link to={value.link} className='section'>{value.label}</Link>);
  }

  // breadCrumb helpers
  getBreadCrumbs() {
    let path = this.props.location.pathname || '/';
    path = path.split('/');
    const [nothing, dashboard, rootSection, appId, appSection, appSubSection, appSubSection2] = path;

    let currentUrl = `/dashboard/${rootSection}`;
    let breadCrumbs = [{ label: BreadCrumbLabel[rootSection], active: false, link: currentUrl }];

    if (appId) {
      currentUrl += `/${appId}`;
      breadCrumbs = this.getUpdatedBreadCrumbs(currentUrl, this.props.apps[appId].name, breadCrumbs);
    }

    if (appSection) {
      currentUrl += `/${appSection}`;
      breadCrumbs = this.getUpdatedBreadCrumbs(currentUrl, BreadCrumbLabel[appSection], breadCrumbs);
    }

    if (appSubSection) {
      currentUrl += `/${appSubSection}`;
      breadCrumbs = this.getUpdatedBreadCrumbs(currentUrl, BreadCrumbLabel[appSubSection], breadCrumbs);
    }

    if (appSubSection2) {
      currentUrl += `/${appSubSection2}`;
      breadCrumbs = this.getUpdatedBreadCrumbs(currentUrl, BreadCrumbLabel[appSubSection2], breadCrumbs);
    }

    breadCrumbs = breadCrumbs.map((breadCrumbItem) => {
      if (breadCrumbItem.link && breadCrumbItem.link === this.props.location.pathname) {
        return Object.assign(breadCrumbItem, { active: true });
      }
      return breadCrumbItem;
    });

    return breadCrumbs;
  }

  getUpdatedBreadCrumbs(currentUrl, label, breadCrumbs) {
    return [
      ...breadCrumbs,
      { seperator: true },
      { label: label, active: false, link: currentUrl }
    ];
  }
}

// react-redux mapping methods
const mapStateToProps = (state/* , props*/) => {
  return {
    apps: state.domain.apps.byIds
  };
};

const mapDispatchToProps = (/* dispatch, props*/) => {
  return {};
};

// exports
const BreadCrumbsContainer = connect(mapStateToProps, mapDispatchToProps)(BreadCrumbs);
export default withRouter(BreadCrumbsContainer);