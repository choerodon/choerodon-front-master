import React, { Component } from 'react';
import classNames from 'classnames';
import { Button, Icon } from 'choerodon-ui';
import { Modal } from 'choerodon-ui/pro';
import { inject, observer } from 'mobx-react';
import './style';

const PREFIX_CLS = 'c7n';
const prefixCls = `${PREFIX_CLS}-boot-header-banner`;
const imgPartten = /<img(.*?)>/g;
const htmlTagParttrn = /<[^>]*>/g;
const modalStyle = {
  width: '8rem',
};
const modalKey = Modal.key();

@inject('AppState', 'HeaderStore', 'MenuStore')
@observer
export default class AnnouncementBanner extends Component {
  modal = null;

  componentDidMount() {
    this.props.HeaderStore.axiosGetNewSticky();
  }

  handleClose = () => {
    this.props.HeaderStore.closeAnnouncement();
  };

  closeModal = () => {
    this.modal.close();
  }

  handleInfo = () => {
    const { HeaderStore: { announcement: { content, title } } } = this.props;
    this.modal = Modal.open({
      key: modalKey,
      title,
      closable: true,
      style: modalStyle,
      children: (
        <div className="content c7n-boot-header-inbox-wrap">
          <div
            className="c7n-boot-header-inbox-content"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ),
      footer: <Button onClick={this.closeModal}>返回</Button>,
    });
  };

  render() {
    const { src, children, className, HeaderStore: { announcementClosed, announcement: { content, title } } } = this.props;
    return (
      announcementClosed ? null : (
        <div
          className={classNames(`${prefixCls}`, className)}
        >
          <div className={`${prefixCls}-info`}>
            <Icon type="info" style={{ fontSize: 24, color: '#d50000' }} />
            <span dangerouslySetInnerHTML={{ __html: content && content.replace(imgPartten, '[图片]').replace(htmlTagParttrn, '') }} />
          </div>
          <div className={`${prefixCls}-buttons`}>
            <Button onClick={this.handleClose}>关闭提示</Button>
            <Button type="primary" funcType="raised" onClick={this.handleInfo}>了解详情</Button>
          </div>
        </div>
      )
    );
  }
}
