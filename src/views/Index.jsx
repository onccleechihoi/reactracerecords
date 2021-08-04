import React from 'react';
import Content from '@/component/Index';
import Typemenu from '@/redux/containers/menu/typemenu';
import Areamenu from '@/redux/containers/menu/areamenu';
import Gametypemenu from '@/redux/containers/menu/gametypemenu';

export default class Index extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="menu1">
          <Typemenu></Typemenu>
          <Areamenu></Areamenu>
        </div>
        <div className="menu2">
          <Gametypemenu></Gametypemenu>
        </div>
        <Content></Content>
      </div>
    );
  }
}
