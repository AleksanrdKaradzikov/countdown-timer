import React from 'react';
import { Tabs, Icon } from 'antd';
import 'antd/dist/antd.css';
import Timer from './timer';
import Countdown from './countdown';
import '../style/App.css';

const App = () => {
  const { TabPane } = Tabs;
  return (
    <div className="tab-wrapper">
      <Tabs defaultActiveKey="2">
        <TabPane
          tab={
            <span>
              <Icon type="clock-circle" />
              Секундомер
            </span>
          }
          key="1"
        >
          <Timer />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="history" />
              Таймер обратного отсчета
            </span>
          }
          key="2"
        >
          <Countdown />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default App;
