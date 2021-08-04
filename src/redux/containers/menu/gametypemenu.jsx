import React from 'react';
import { switchGameType, switchPage } from '@/redux/actions';
import { connect } from 'react-redux';

class Gametypemenu extends React.Component {
  gameTypeClick(gametype) {
    const { dispatch } = this.props;
    dispatch(switchPage('brief'));
    dispatch(switchGameType(gametype));
  }

  gameTypeOn(val) {
    return this.props.gametype === val ? 'on' : '';
  }

  render() {
    return (
      <div className="game_type">
        <div className={this.gameTypeOn(0)} onClick={() => this.gameTypeClick(0)}>
          今次邊個威
        </div>
        <div className={this.gameTypeOn(1)} onClick={() => this.gameTypeClick(1)}>
          近6次成績
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  gametype: state.gametype,
});

const GametypemenuConnect = connect(mapStateToProps)(Gametypemenu);

export default connect(mapStateToProps)(GametypemenuConnect);
