import {
  SWITCH_TYPE,
  SWITCH_AREA,
  SWITCH_GMAE_TYPE,
  LOAD_SUCCESS,
  LOAD_FAILURE,
  LOAD_LIVE_DATA,
  SET_REACETIME,
  SWITCH_PAGE,
  LOAD_DATA,
} from '@/redux/actions';
import _ from 'underscore';

function reLiveDataMaxRace(data) {
  let maxRace = 8;
  _.each(data[0], (v, i) => {
    if (i.indexOf('raceno') > -1) {
      maxRace = i.replace('raceno', '');
    }
  });
  return maxRace;
}

function reLiveData(data, type) {
  const ob = {};
  _.each(data, (v) => {
    ob[v[type]] = v;
  });

  return ob;
}

function reformData(data, type) {
  const ob = {};
  _.each(data, (v) => {
    ob[v.venue] = v[type];
  });

  _.each(ob, (v, i) => {
    const ob2 = {};
    _.each(v, (v2) => {
      ob2[v2[type === 'jockey' ? 'jockname' : 'stabname']] = {};
      ob2[v2[type === 'jockey' ? 'jockname' : 'stabname']].detail = v2.detail;
      ob2[v2[type === 'jockey' ? 'jockname' : 'stabname']].totwin = v2.totwin;
    });
    ob[i] = ob2;
  });
  return ob;
}

const initState = {
  person: 'jockey',
  area: '全部',
  gametype: 0,
  page: 'brief',
  cache: {},
  loaded: false,
  racetime: false,
  maxRace: 8,
  liveUpdateTime: false,
};

export default function dataFunc(state = initState, action) {
  switch (action.type) {
    case SWITCH_TYPE:
      return { ...state, person: action.person };
    case SWITCH_AREA:
      return { ...state, area: action.area };
    case SWITCH_GMAE_TYPE:
      return { ...state, gametype: action.gametype };
    case SWITCH_PAGE:
      return { ...state, page: action.page };
    case LOAD_SUCCESS:
      return { ...state, loaded: true };
    case LOAD_FAILURE:
      return { ...state, loaded: false };
    case SET_REACETIME:
      return { ...state, racetime: action.racetime, loaded: true };
    case LOAD_LIVE_DATA:
      return {
        ...state,
        cache: {
          ...state.cache,
          [`${action.person}type0`]: reLiveData(action.response.data.content, action.person),
        },
        liveUpdateTime: action.response.data.racedate,
        loaded: true,
        maxRace: reLiveDataMaxRace(action.response.data.content),
      };
    case LOAD_DATA:
      return {
        ...state,
        cache: {
          ...state.cache,
          [`${action.person}type1`]: reformData(action.response.data[0].content, action.person),
        },
        loaded: true,
      };
    default:
      return state;
  }
}
