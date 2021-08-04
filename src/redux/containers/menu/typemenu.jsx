import React from 'react';
import { connect } from 'react-redux';
import { switchPerson, switchPage } from '@/redux/actions';
import btnJockey from '@/assets/img/bt_jockey.png';
import btnStable from '@/assets/img/bt_stable.png';

class Typemenu extends React.Component {
  personOnClick(person) {
    const { dispatch } = this.props;
    dispatch(switchPage('brief'));
    dispatch(switchPerson(person));
  }

  btn() {
    return this.props.person === 'jockey' ? btnJockey : btnStable;
  }

  render() {
    return (
      <div className="type">
        <div className="typejockey func" onClick={() => this.personOnClick('jockey')}></div>
        <img
          className="background func"
          onClick={() => this.personOnClick('stable')}
          src={this.btn()}
        ></img>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  person: state.person,
  page: state.page,
});

const TypemenuConnect = connect(mapStateToProps)(Typemenu);

export default TypemenuConnect;
