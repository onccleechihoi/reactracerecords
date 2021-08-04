import axois from 'axios';
import _ from 'underscore';

export const prefix = '';
export const GET_LIVE_DATA_REQUEST = 'GET_LIVE_DATA_REQUEST';
export const GET_DATA_REQUEST = 'GET_DATA_REQUEST';
export const SWITCH_TYPE = 'SWITCH_TYPE';
export const SWITCH_GMAE_TYPE = 'SWITCH_GMAE_TYPE';
export const SWITCH_AREA = 'SWITCH_AREA';
export const LOAD_SUCCESS = 'LOAD_SUCCESS';
export const LOAD_FAILURE = 'LOAD_FAILURE';
export const SET_REACETIME = 'SET_REACETIME';
export const SWITCH_PAGE = 'SWITCH_PAGE';
export const LOAD_LIVE_DATA = 'LOAD_LIVE_DATA';
export const LOAD_DATA = 'LOAD_DATA';

export function switchArea(area) {
  return {
    type: SWITCH_AREA,
    area,
  };
}
export function switchPerson(person) {
  return {
    type: SWITCH_TYPE,
    person,
  };
}

export function switchGameType(gametype) {
  return {
    type: SWITCH_GMAE_TYPE,
    gametype,
  };
}
export function setRaceTime(racetime) {
  return {
    type: SET_REACETIME,
    racetime,
  };
}

export function switchPage(page) {
  return {
    type: SWITCH_PAGE,
    page,
  };
}

export function callAPIMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    const {
      types, callAPI, shouldCallAPI = () => true, payload = {},
    } = action;

    if (!types) {
      // 普通的 action：把它傳遞下去
      return next(action);
    }

    if (
      !Array.isArray(types)
      || types.length !== 2
      || !types.every((type) => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.');
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.');
    }

    if (!shouldCallAPI(getState())) {
      return false;
    }

    const [successType, failureType] = types;

    return callAPI(getState()).then(
      (response) => dispatch({
        ...payload,
        response,
        type: successType,
      }),
      (error) => dispatch({
        ...payload,
        error,
        type: failureType,
      }),
    );
  };
}

export function LoadRaceTime() {
  return {
    types: ['LOAD_RACETIME', 'LOAD_FAILURE'],
    shouldCallAPI: () => true,
    callAPI: () => axois.get(`${prefix}/public/result_head.js`),
    payload: { text: 'timestamp loaded' },
  };
}

export function loadLiveData(person) {
  return {
    types: ['LOAD_LIVE_DATA', 'LOAD_FAILURE'],
    shouldCallAPI: (state) => typeof state.cache[`${person}type0`] === 'undefined',
    callAPI: (state) => axois.get(
      `${prefix}/public/${state.racetime}/${person === 'jockey' ? 'jock' : 'stab'}_live_${
        state.racetime
      }.js`,
    ),
    payload: { person },
  };
}

export function loadData(person) {
  return {
    types: ['LOAD_DATA', 'LOAD_FAILURE'],
    shouldCallAPI: (state) => typeof state.cache[`${person}type1`] === 'undefined',
    callAPI: () => axois.get(`${prefix}/public/WinPla${person === 'jockey' ? 'Jockey' : 'Stable'}.js`),
    payload: { person },
  };
}

export function getDataFeedMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    const { type } = action;
    const { gametype, person } = getState();
    if (_.contains([SWITCH_TYPE, SWITCH_GMAE_TYPE], type)) {
      if ((type === SWITCH_GMAE_TYPE ? action.gametype : gametype) === 0) {
        dispatch(loadLiveData(type === SWITCH_TYPE ? action.person : person));
      } else {
        dispatch(loadData(type === SWITCH_TYPE ? action.person : person));
      }
    }
    return next(action);
  };
}
