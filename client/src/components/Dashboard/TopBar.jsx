// imports
import React from 'react';
import { Link } from 'react-router-dom';

import TopBarSubMenu from './TopBarSubMenu.jsx';
import FizzLogo from './Assets/fizzLogoWhite.svg';

// exports
export default class TopBar extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    $('.top-bar .ui.dropdown').dropdown({});
  }

  componentWillUnmount() {
    $('.top-bar .ui.dropdown').dropdown({});
  }

  render() {
    return (
      <div className='expanded row column top-bar large-collapse medium-collapse'>
        <div className='row expanded align-middle'>
          <div className='small-3 columns'>
            <Link to='/dashboard'>
              <img src={FizzLogo} className='dashboard-logo-image' />
            </Link>
          </div>
          <div className='small-9 columns'>
            <ul className='dropdown menu'>
              <li className='show-for-c-medium'>
                <Link to='/dashboard'>{'Dashboard'}</Link>
              </li>
              <li>
                <TopBarSubMenu />
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}