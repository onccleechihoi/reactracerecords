import axois from 'axios';

// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  prefix, switchGameType, setRaceTime, switchPage,
} from '@/redux/actions';
import _ from 'underscore';

function BriefType0Lists(props) {
  const data = props.data.cache[`${props.data.person}type0`];
  const type = props.data.person;

  const changepage = (name) => {
    props.setName(name);
    const { dispatch } = props.data;
    dispatch(switchPage('detail'));
  };

  if (data && data !== '') {
    const lists = _.map(data, (race, itemno) => {
      const detailobj = {};
      _.each(data.detail, (v) => {
        detailobj[v.raceno] = v.ordere;
      });
      const raceitems = [];
      _.each(race, (d, pos) => {
        if (pos.indexOf('raceno') > -1) {
          let classN = '';
          if (d === 'p' || d === 'P') {
            classN = 'place';
          } else if (d === 'w' || d === 'W') {
            classN = 'win';
          } else if (d === '') {
            if (
              typeof detailobj[pos.indexOf('raceno')] !== 'undefined'
              && detailobj[pos.indexOf('raceno')] === ''
            ) {
              classN = 'notrace';
            } else {
              classN = 'null';
            }
          }
          let c = '';
          if (d === '') {
            c = '';
          } else if (d === 'x') {
            c = 'X';
          } else {
            c = d;
          }

          raceitems.push(
            <div className="num" key={pos}>
              <div className={`core ${classN}`}>{c}</div>
            </div>,
          );
        }
      });
      return (
        <div className="item itemrace" key={itemno}>
          <div className="racename">{race[type]}</div>
          {raceitems}
          <div
            className="racearrow"
            onClick={() => {
              changepage(race[type]);
            }}
          ></div>
        </div>
      );
    });

    return lists;
  }
  return <div className="item itemrace"></div>;
}

function BuildType0Brief(props) {
  const lists = [];
  for (let i = 0; i < props.data.maxRace; i += 1) {
    const num = i + 1;
    lists.push(
      <div className="num" key={i}>
        <div className="core">{num}</div>
      </div>,
    );
  }
  return (
    <div className="livecontent">
      <div className="item title">
        <div className="racename">場次</div>
        {lists}
        <div className="blank"></div>
      </div>
      <BriefType0Lists data={props.data} setName={props.setName}></BriefType0Lists>
    </div>
  );
}
function BuildType0Detail(props) {
  const data = props.data.cache[`${props.data.person}type0`][props.name];
  const html = [];
  html.push(
    <div className="title2" key="title">
      <div className="raceno">場次</div>
      <div className="hnum">馬號</div>
      <div className="hname">馬名</div>
      <div className="name">{typeof data.stable !== 'undefined' ? '練馬師' : '騎師'}</div>
      <div className="winodds">賠率</div>
      <div className="orderE">名次</div>
    </div>,
  );

  const backFunction = () => {
    const { dispatch } = props.data;
    dispatch(switchPage('brief'));
  };

  html.push(
    _.map(data.detail, (race, i) => {
      const style = race.ordere < 4 ? { color: 'red' } : {};
      return (
        <div className="content2" key={i}>
          <div className="raceno">{race.raceno}</div>
          <div className="hnum">{race.hrno}</div>
          <div className="hname">{race.hrname}</div>
          <div className="name">
            {typeof race.stable !== 'undefined' ? race.stable : race.jockey}
          </div>
          <div className="winodds">{race.winodds + (race.withdraw === 'T' ? '*' : '')}</div>
          <div style={style} className="orderE">
            {race.ordere}
          </div>
        </div>
      );
    }),
  );
  return (
    <div>
      <div className="title">
        <div
          style={{ flex: '1 0 auto' }}
          className="backarrow"
          onClick={() => {
            backFunction();
          }}
        >
          <img src="/img/bt_back.png"></img>
        </div>
        <div style={{ flex: '3 0 auto' }}> {props.name}</div>
        <div style={{ flex: '7 0 auto' }}>
          {`(${props.data.liveUpdateTime.substr(4, 2)}月${props.data.liveUpdateTime.substr(
            6,
            2,
          )}日成績)`}
        </div>
      </div>
      <div className="main">{html}</div>
    </div>
  );
}

function BriefTypeItems(name, data, props) {
  const itemHtml = (d) => {
    const html = _.map(d, (v, i) => {
      const h = [];
      if (!(v.remark.indexOf('W') > -1 || v.remark.indexOf('P') > -1)) {
        if (v.remark.length <= 2) {
          h.push(
            <div className="box blackOn" key="title1">
              <div style={{ lineHeight: '9vw' }}>{v.remark}</div>
            </div>,
          );
        } else {
          h.push(
            <div className="box blackOn" key={i}>
              <div style={{ lineHeight: '5vw' }}>{v.remark.substr(0, 2)}</div>
              <div style={{ lineHeight: '4vw' }}>{v.remark.substr(2, 2)}</div>
            </div>,
          );
        }
      } else {
        const upb = v.remark.substr(0, 2);
        const dwb = v.remark.substr(2, 2);
        const win = parseInt(v.remark.substr(0, 1), 10) > 0;
        h.push(
          <div key={`color${i}`} className={`box + ${win ? 'redOn' : 'grayOn'}`}>
            <div>{upb}</div>
            <div>{dwb}</div>
          </div>,
        );
      }
      return h;
    });
    return html;
  };
  const toInnerPage = (namee) => {
    props.setName(namee);
    const { dispatch } = props.data;
    dispatch(switchPage('detail1'));
  };

  return (
    <div className="briefdata" key={name}>
      <div className="name">
        <div>{name}</div>
        <div className="orangeColor">{data.totwin}W</div>
      </div>
      <div className="main">{itemHtml(data.detail)}</div>
      <div
        className="racearrow"
        style={{ flex: '2 0 auto' }}
        rel={name}
        onClick={() => {
          toInnerPage(name);
        }}
      ></div>
    </div>
  );
}

function BuildType1Brief(props) {
  if (typeof props.data.cache[`${props.data.person}type1`] === 'undefined') return null;
  const data = props.data.cache[`${props.data.person}type1`][props.data.area];
  const html = [];
  html.push(
    <div className="descriptiontitle" key="destitle">
      <div>近6次成績( 左為最近 )</div>
    </div>,
  );

  _.each(data, (v, i) => {
    html.push(BriefTypeItems(i, v, props));
  });
  return html;
}

function BuildType1Detail2(props) {
  if (typeof props.data.cache[`${props.data.person}type1`] === 'undefined') return null;
  const data = props.data.cache[`${props.data.person}type1`][props.data.area][props.name];
  const html = [];
  const backFunction = () => {
    const { dispatch } = props.data;
    dispatch(switchPage('detail1'));
  };
  html.push(
    <div className="title2" key="title1">
      <div className="raceno">場次</div>
      <div className="hname">馬名</div>
      <div className="name">{props.data.person === 'jockey' ? '練馬師' : '騎師'}</div>
      <div className="winodds">賠率</div>
      <div className="orderE">名次</div>
    </div>,
  );
  html.push(
    _.map(data.detail[props.raceno].record, (v, i) => {
      const no = i * 1 + 1;
      const style = v.orderE < 4 ? { color: 'red' } : {};
      return (
        <div className="content2" key={i}>
          <div className="raceno">{no}</div>
          <div className="hname">{v.hrname}</div>
          <div className="name">{v.name}</div>
          <div className="winodds">{v.winodds + (v.isfavor === 'T' ? '*' : '')}</div>
          <div style={style} className="orderE">
            {v.orderE}
          </div>
        </div>
      );
    }),
  );

  const titledata = typeof data.detail[props.raceno].racedate !== 'undefined'
    ? data.detail[props.raceno].racedate.split('/')
    : '';

  return (
    <div>
      <div className="title">
        <div
          style={{ flex: '1 0 auto' }}
          className="backarrow"
          onClick={() => {
            backFunction();
          }}
        >
          <img src="img/bt_back.png"></img>
        </div>
        <div style={{ flex: '4 0 auto' }}>
          {typeof titledata !== 'undefined'
            ? `${titledata[2]}/${titledata[1]}/${titledata[0]}`
            : ''}
        </div>
        <div style={{ flex: '2 0 auto' }}>{data.detail[props.raceno].category}</div>
      </div>
      <div className="main">{html}</div>
      <div style={{ paddingLeft: '5%', paddingTop: '1%' }}>*為大熱門</div>
    </div>
  );
}
function BuildType1Detail1(props) {
  if (typeof props.data.cache[`${props.data.person}type1`] === 'undefined') return null;
  const data = props.data.cache[`${props.data.person}type1`][props.data.area][props.name];
  const html = [];
  const backFunction = () => {
    const { dispatch } = props.data;
    dispatch(switchPage('brief'));
  };
  const changepage = (name, raceno) => {
    props.setRaceNo(raceno);
    props.setName(name);
    const { dispatch } = props.data;
    dispatch(switchPage('detail2'));
  };

  html.push(
    _.map(data.detail, (v, i) => {
      const date = typeof v.racedate !== 'undefined' ? v.racedate.split('/') : '';

      return (
        <div className="content" rel={i}>
          <div className="date">{date === '' ? '' : `${date[2]}/${date[1]}/${date[0]}`}</div>
          <div className="racearea">
            <span>{v.location}</span>
            <img src={v.period === '夜' ? 'img/icon_night.png' : 'img/icon_day.png'}></img>
          </div>
          <div className="place">{v.category}</div>
          <div className="remark">{v.remark}</div>
          <div
            className="racearrow"
            style={{ flex: '1 0 auto' }}
            onClick={() => {
              changepage(props.name, i);
            }}
          ></div>
        </div>
      );
    }),
  );

  return (
    <div>
      <div className="title">
        <div
          style={{ flex: '1 0 auto' }}
          className="backarrow"
          onClick={() => {
            backFunction();
          }}
        >
          <img src="img/bt_back.png"></img>
        </div>
        <div style={{ flex: '2.5 0 auto' }}>{props.name}</div>
        <div style={{ flex: '3 0 auto' }} className="orangeColor">
          {data.totwin}W
        </div>
      </div>
      <div className="main">{html}</div>
    </div>
  );
}

class Index extends Component {
  constructor(props) {
    super(props);
    // 請不要這樣做！
    this.state = { name: '', raceno: 1 };
  }

  setName(name) {
    this.setState({ name });
  }

  setRaceNo(no) {
    this.setState({ raceno: no });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    axois.get(`${prefix}/public/result_head.js`).then((response) => {
      dispatch(setRaceTime(response.data[0].racedate));
      dispatch(switchGameType(0));
    });
  }

  pagesetting() {
    return this.props.page.indexOf('detail') > -1 ? 'detailpage' : 'briefpage';
  }

  render() {
    const pagefound = (props, name, setName, setRaceNo, raceno) => {
      if (props.gametype === 0) {
        if (props.page === 'brief') return <BuildType0Brief setName={setName} data={props}></BuildType0Brief>;
        return <BuildType0Detail data={props} name={name}></BuildType0Detail>;
      }
      if (props.page === 'brief') {
        return <BuildType1Brief setName={setName} data={props}></BuildType1Brief>;
      }
      if (props.page === 'detail1') {
        return (
          <BuildType1Detail1
            setName={setName}
            setRaceNo={setRaceNo}
            data={props}
            name={name}
          ></BuildType1Detail1>
        );
      }
      if (props.page === 'detail2') return <BuildType1Detail2 data={props} raceno={raceno} name={name}></BuildType1Detail2>;

      return null;
    };

    return (
      <div className={`container ${this.pagesetting()}`}>
        {pagefound(
          this.props,
          this.state.name,
          this.setName.bind(this),
          this.setRaceNo.bind(this),
          this.state.raceno,
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cache: state.cache,
  person: state.person,
  area: state.area,
  gametype: state.gametype,
  loaded: state.loaded,
  page: state.page,
  maxRace: state.maxRace,
  liveUpdateTime: state.liveUpdateTime,
});

/*
 <h1>Index world {this.props.loaded ? 'Loaded' : 'Not Loaded'} </h1>
        <div>{this.props.cache[`${this.props.person}type${this.props.gametype}`]}</div>
*/

export default connect(mapStateToProps)(Index);
