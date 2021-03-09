import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './Detail.less';
import Part from './Part';
import Fields from './components/fields';
import Description from './components/description';
import Attachment from './components/attachment';

const prefix = 'c7n-backlogApprove-backlogDetail';

const Detail = ({ store }) => {
  useEffect(() => {

  });
  const { backlogNum, summary } = store.demand;

  return (
    <div className={prefix}>
      <div className={`${prefix}-left`}>
        <Part
          title="详情"
          style={{
            height: '100%',
            paddingRight: 0,
          }}
        >
          <div className={`${prefix}-left-detail`}>
            <div className={`${prefix}-left-detail-summary`}>
              <div className={`${prefix}-left-detail-summary-num`}>{backlogNum}</div>
              <span>{summary}</span>
            </div>
            <Fields store={store} />
          </div>
        </Part>
      </div>
      <div className={`${prefix}-right`}>
        <Part
          title="描述"
          style={{
            height: '50%',
          }}
        >
          <Description store={store} />
        </Part>
        <Part
          title="附件"
          style={{
            height: '50%',
          }}
        >
          <Attachment store={store} />
        </Part>
      </div>
    </div>
  );
};

export default observer(Detail);