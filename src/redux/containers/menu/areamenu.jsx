import React from 'react';
import { switchArea } from '@/redux/actions';
import { connect } from 'react-redux';

class Areamenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      area: '全部',
    };
  }

  areaOnClick(_area) {
    const { dispatch } = this.props;
    dispatch(switchArea(_area));
  }

  areaOn(val) {
    return this.props.area === val ? 'func on' : 'func';
  }

  showAreaBox() {
    return this.props.gametype === 1 ? 'area' : 'area hide';
  }

  render() {
    return (
      <div className={this.showAreaBox()}>
        <div className={this.areaOn('全部')}>
          <div className="w" onClick={() => this.areaOnClick('全部')}>
            全部
          </div>
        </div>
        <div className={this.areaOn('沙田')}>
          <div className="w" onClick={() => this.areaOnClick('沙田')}>
            沙田
          </div>
        </div>
        <div className={this.areaOn('快活谷')}>
          <div
            className="w"
            onClick={() => this.areaOnClick('快活谷')}
            style={{ borderRight: '1px solid #c4c4c4' }}
          >
            快活谷
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  area: state.area,
  gametype: state.gametype,
});

const AreamenuConnect = connect(mapStateToProps)(Areamenu);

export default AreamenuConnect;
