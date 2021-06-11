import React, {
  useEffect, useContext, useState, useRef, useCallback,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router';
import {
  Menu, Dropdown, Icon, Tooltip, Button as ProButton, Select, TextField,
} from 'choerodon-ui/pro';

import { EXTERNAL_LINK, SAAS_FEEDBACK } from '@/utils/constants';
import classNames from 'classnames';
import { mount } from '@choerodon/inject';
// import ThemeContext from '@hzero-front-ui/cfg/lib/utils/ThemeContext';
import { axios } from '@/index';

import './style';
import HeaderStore from '@/containers/stores/c7n/HeaderStore';
import MenuStore from '@/containers/stores/c7n/MenuStore';
import findFirstLeafMenu from '@/containers/components/util/findFirstLeafMenu';
import { historyPushMenu } from '@/utils';
import queryString from 'query-string';
import getSearchString from '@/containers/components/c7n/util/gotoSome';
import { useDebounce } from 'ahooks';
import OrgSelect from './OrgSelect';
import HeaderSetting from './HeaderSetting';
import SkinPeeler from './SkinPeeler';
import Inbox from './Inbox';
import User from './User';
import Logo from './Logo';

const prefixCls = 'c7n-boot-header';

const { Option, OptGroup } = Select;

export default withRouter(inject('AppState', 'HeaderStore', 'MenuStore')(observer((props) => {
  // const [starProject, setStarProject] = useState([]);
  // const [recentUse, setRecentUse] = useState([]);
  // const [dropDownPro, setDropDownPro] = useState(undefined);

  const Ref = useRef();

  const [projectFilter, setProjectFilter] = useState('');
  const [isOrgSaasAuth, setSaasAuth] = useState(false);
  const debouncedFilter = useDebounce(projectFilter, { wait: 500 });

  function handleClickProject(data) {
    const {
      id, name, organizationId, category,
    } = data;
    const { HeaderStore, MenuStore } = props;
    const type = 'project';
    HeaderStore.setRecentItem(data);
    MenuStore.loadMenuData({ type, id }, false).then((menus) => {
      let route = '';
      let path;
      let domain;
      if (menus.length) {
        const { route: menuRoute, domain: menuDomain } = findFirstLeafMenu(menus[0]);
        route = menuRoute;
        domain = menuDomain;
      }
      // if (route) {
      path = `${route}?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;
      if (String(organizationId)) {
        path += `&organizationId=${organizationId}`;
      }
      // }
      if (path) {
        historyPushMenu(history, path, domain);
      }
    });
  }

  function getAuth() {
    const {
      AppState: { currentMenuType: { organizationId } },
    } = props;
    return axios.get(`iam/choerodon/v1/register_saas/check_is_owner?tenantId=${organizationId}`);
  }

  const checkAuthOfSaas = useCallback(async () => {
    if (SAAS_FEEDBACK) {
      try {
        const res = await getAuth();
        setSaasAuth(!!res);
      } catch (error) {
        setSaasAuth(false);
      }
    }
  }, [props.AppState.currentMenuType.organizationId]);

  useEffect(() => {
    checkAuthOfSaas();
  }, [checkAuthOfSaas]);

  useEffect(() => {
    const { AppState, HeaderStore, MenuStore } = props;
    // MenuStore.loadMenuData({ type: 'site' }, false);
    HeaderStore.axiosGetOrgAndPro(AppState.getUserId);
    AppState.getProjects();
  }, []);

  useEffect(() => {
    const { AppState } = props;
    AppState.setCurrentDropDown(AppState.getStarProject, AppState.getRecentUse);
  }, [props.location]);

  useEffect(() => {
    const { getUserId } = props.AppState;
    if (!props.location.pathname.includes('unauthorized')) {
      sessionStorage.setItem('historyPath', props.location.pathname + props.location.search);
    }
  }, [props.location.pathname, props.location.search]);

  function handleGuideClick() {
    const { AppState } = props;
    AppState.setGuideExpanded(!AppState.getGuideExpanded);
  }

  const menuItems = () => {
    const { AppState } = props;
    const [url, text, icon] = EXTERNAL_LINK?.split(',') || [];
    const itemsGroup = [];
    const docItem = (
      <Menu.Item>
        <div
          role="none"
          onClick={() => {
            window.open(AppState.getDocUrl || url);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Icon type="collections_bookmark-o" />
          <span>
            {text}
          </span>
        </div>
      </Menu.Item>
    );
    if (EXTERNAL_LINK) {
      itemsGroup.push(docItem);
    }
    const saasFeedbackBtn = mount('base-pro:saasFeebackBtn');
    if (SAAS_FEEDBACK && saasFeedbackBtn && isOrgSaasAuth) {
      const saasFeedbackItem = (
        <Menu.Item>
          {mount('base-pro:saasFeebackBtn')}
        </Menu.Item>
      );
      itemsGroup.push(saasFeedbackItem);
    }
    return (
      <Menu>
        {
          itemsGroup
        }
      </Menu>
    );
  };

  const renderExternalLink = () => {
    if ((EXTERNAL_LINK && typeof EXTERNAL_LINK === 'string') || (SAAS_FEEDBACK)) {
      const saasFeedbackBtn = mount('base-pro:saasFeebackBtn');
      const hasSaasFeedback = SAAS_FEEDBACK && saasFeedbackBtn && isOrgSaasAuth;
      const { AppState } = props;
      const [url, text, icon] = EXTERNAL_LINK?.split(',') || [];
      return (
        <li style={{ width: 'auto' }} className={`${prefixCls}-right-li`}>
          <Dropdown
            {
              ...!hasSaasFeedback ? {
                hidden: true,
              } : {}
            }
            overlay={menuItems()}
            trigger={['click']}
            placement="bottomCenter"
          >
            <ProButton
              onClick={() => {
                if (!hasSaasFeedback) {
                  window.open(AppState.getDocUrl || url);
                }
              }}
              funcType="flat"
              className="theme4-external"
              icon="help_outline"
              shape="circle"
              style={{ margin: '0 20px' }}
            />
          </Dropdown>
        </li>
      );
    }
    return <span style={{ margin: '0 0 0 20px' }} />;
  };

  const {
    AppState: { getUserInfo: { image_url: imgUrl } }, MenuStore: { getSiteMenuData }, history, location: { pathname },
  } = props;

  const handleClickPopContent = (value) => {
    setProjectFilter('');
    const { AppState } = props;
    if (value.includes('star')) {
      const starItem = AppState.getStarProject.find((i) => String(i.id) === String(value.split('_')[1]));
      AppState.setDropDownPro(`项目: ${starItem.name}`);
      handleClickProject(starItem);
      Ref.current.setPopup(false);
      Ref.current.text = `项目: ${starItem.name}`;
    } else {
      const recentItem = AppState.getRecentUse.find((i) => String(i.id) === String(value.split('_')[1]));
      AppState.setDropDownPro(`项目: ${recentItem.name}`);
      handleClickProject(recentItem);
      Ref.current.setPopup(false);
      Ref.current.text = `项目: ${recentItem.name}`;
    }
  };

  const handleGoAllProject = (r) => {
    async function goto(obj) {
      const queryObj = queryString.parse(history.location.search);
      const search = await getSearchString('organization', 'id', queryObj.organizationId);
      MenuStore.setActiveMenu(null);
      history.push(`${obj.activePath}${search}`);
      r.current.setPopup(false);
    }
    const data = {
      title: '项目', icon: 'project_line', activePath: '/projects', style: { marginLeft: 3 },
    };
    goto(data);
  };

  const renderProjectSelect = () => {
    const { AppState } = props;
    const starProject = AppState.getStarProject;
    const recentUse = AppState.getRecentUse;
    return (
      <Select
        valueChangeAction="input"
        clearButton={false}
        ref={Ref}
        searchable
        value={AppState.getDropDownPro}
        onInput={(e) => {
          setProjectFilter(e.target.value);
        }}
        onBlur={() => {
          setProjectFilter('');
        }}
        placeholder="请选择项目"
        popupContent={(props) => {
          const filterStarProject = starProject.filter((i) => i.name.includes(debouncedFilter));
          const filterRecentUser = recentUse.filter((i) => i.name.includes(debouncedFilter));
          return (
            <div className="c7ncd-dropDownPro-popContent">
              {/* <TextField */}
              {/*  placeholder="请搜索" */}
              {/*  suffix={<Icon type="search" />} */}
              {/*  className="c7ncd-dropDownPro-popContent-search" */}
              {/* /> */}
              <p className="c7ncd-dropDownPro-popContent-label">星标项目</p>
              {
                filterStarProject && filterStarProject.length > 0 ? filterStarProject.map((i) => (
                  <p onClick={() => handleClickPopContent(`star_${i.id}`, Ref)} className="c7ncd-dropDownPro-popContent-option">{i.name}</p>
                )) : (
                  <p className="c7ncd-dropDownPro-popContent-noOption">暂无星标项目</p>
                )
              }
              <p className="c7ncd-dropDownPro-popContent-label">最近使用</p>
              {
                filterRecentUser && filterRecentUser.length > 0 ? filterRecentUser.map((i) => (
                  <p onClick={() => handleClickPopContent(`recent_${i.id}`, Ref)} className="c7ncd-dropDownPro-popContent-option">{i.name}</p>
                )) : (
                  <p className="c7ncd-dropDownPro-popContent-noOption">暂无最近使用项目</p>
                )
              }
              <p onClick={() => handleGoAllProject(Ref)} className="c7ncd-dropDownPro-popContent-allPro">
                <div>
                  <Icon type="multistage_combo_box" />
                  <span>查看所有项目</span>
                </div>
                <Icon type="navigate_next" />
              </p>
            </div>
          );
        }}
        className="c7ncd-dropDownPro"
      />
    );
  };

  const shouldHiddenHead = () => {
    const defaultBlackList = ['/iam/enterprise'];
    if (defaultBlackList.some((pname) => pathname.startsWith(pname))) {
      return true;
    }
    return false;
  };

  if (shouldHiddenHead()) {
    return null;
  }
  return (
    <div
      className={classNames({
        [`${prefixCls}-wrap`]: true,
        [`${prefixCls}-wrap-theme4`]: true,
      })}
    >
      <div className={`${prefixCls}-left`}>
        <Logo history={history} />
      </div>
      {
        renderProjectSelect()
      }
      <ul className={`${prefixCls}-center`}>
        <li style={{ display: 'flex' }}>
          <HeaderSetting />
          {mount('base-pro:saasUpgrade')}
        </li>
      </ul>
      <ul className={`${prefixCls}-right`}>
        <OrgSelect />
        {/* <li style={{ width: 'auto' }} className={`${prefixCls}-right-li`}> */}
        {/*  <SkinPeeler /> */}
        {/* </li> */}
        {renderExternalLink()}
        <li style={{ width: 'auto' }} className={`${prefixCls}-right-li`}>
          <Inbox />
        </li>
        <li style={{ marginLeft: 20 }} className={`${prefixCls}-right-li`}>
          <User imgUrl={imgUrl} />
        </li>
      </ul>
    </div>
  );
})));
