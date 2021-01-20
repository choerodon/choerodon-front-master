import React, {
  useReducer,
} from 'react';
import {
  Icon, Tooltip,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { getRandomBackground } from '@/containers/components/c7n/util';
import queryString from 'query-string';
import { merge } from 'lodash';

import './index.less';

function getFirst(str) {
  if (!str) {
    return '';
  }
  const re = /[\u4E00-\u9FA5]/g;
  for (let i = 0, len = str.length; i < len; i += 1) {
    if (re.test(str[i])) {
      return str[i];
    }
  }
  return str[0];
}

const QuestionNode = observer(({
  history, record, organizationId, switchCode, isStar,
}) => {
  const {
    projectVO, typeCode, issueNum, summary, priorityVO: customPriorityVO,
    backlogPriority, statusVO, assigneeId, featureType, backlogNum, statusVO: { code: statusCode },
    assigneeImageUrl, assigneeRealName, assignees, featureTeams, starBeacon, issueId, id,
    projectId: topProjectId, projectName: topProjectName,
  } = record.toData() || {};
  const prefixCls = 'c7ncd-question-issue';

  const priorityVO = customPriorityVO || (backlogPriority && { colour: backlogPriority.color, name: backlogPriority.name });

  function handleClick() {
    const { id: projectId, name: projectName } = projectVO || {};
    const queryData = {
      id: projectId || topProjectId,
      name: projectName || topProjectName,
      organizationId,
      type: 'project',
    };
    if (switchCode === 'myStarBeacon_backlog') {
      const { code } = statusVO;
      let pathSuffix = 'demand';
      if (code === 'backlog_pending_approval' || code === 'backlog_rejected') {
        pathSuffix += '-approve';
        merge(queryData, { paramBacklogStatus: statusCode });
      }
      merge(queryData, { paramBacklogId: id, paramBacklogName: backlogNum });
      history.push({
        pathname: `/agile/${pathSuffix}`,
        search: `?${queryString.stringify(queryData)}`,
        state: {
          backlogId: id,
        },
      });
      return;
    }
    if (switchCode === 'myStarBeacon') {
      if (typeCode !== 'feature') {
        merge(queryData, { paramIssueId: issueId, paramName: issueNum });
        history.push({
          pathname: '/agile/work-list/issue',
          search: `?${queryString.stringify(queryData)}`,
        });
      } else {
        merge(queryData, { paramIssueId: issueId, paramName: issueNum, category: 'PROGRAM' });

        history.push({
          pathname: '/agile/feature',
          search: `?${queryString.stringify(queryData)}`,
        });
      }
      return;
    }
    history.push({
      pathname: '/agile/scrumboard',
      search: `?${queryString.stringify(queryData)}`,
      state: {
        issueId,
      },
    });
  }

  function getIssueType(originTypeCode, isBacklogType = false) {
    let mes = '';
    let icon = '';
    let color = '';
    const newTypeCode = isBacklogType ? 'backlog' : originTypeCode;
    switch (newTypeCode) {
      case 'story':
        mes = '故事';
        icon = 'agile_story';
        color = '#00bfa5';
        break;
      case 'bug':
        mes = '缺陷';
        icon = 'agile_fault';
        color = '#f44336';
        break;
      case 'issue_epic':
        mes = '史诗';
        icon = 'agile_epic';
        color = '#743be7';
        break;
      case 'sub_task':
        mes = '子任务';
        icon = 'agile_subtask';
        color = '#4d90fe';
        break;
      case 'backlog':
        mes = '需求';
        icon = 'highlight';
        color = '#f67f5a';
        break;
      case 'feature': {
        const featureTypeResult = featureType === 'business';
        mes = featureTypeResult ? '特性' : '使能';
        icon = featureTypeResult ? 'characteristic' : 'agile-feature';
        color = featureTypeResult ? '#3D5AFE' : '#FFCA28';
        break;
      }
      default:
        mes = '任务';
        icon = 'agile_task';
        color = '#4d90fe';
    }

    return (
      <Tooltip title={mes} placement="top">
        {typeCode === 'backlog' || featureType === 'business' ? (
          <div style={{
            backgroundColor: color, width: '.16rem', height: '.16rem', flexShrink: 0, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          >
            <Icon
              className={`${prefixCls}-main-icon`}
              type={icon}
              style={{ color: '#fff', fontSize: '12px' }}
            />
          </div>
        ) : (
          <Icon
            className={`${prefixCls}-main-icon`}
            type={icon}
            style={{ color }}
          />
        )}

      </Tooltip>
    );
  }

  function getStatus() {
    const { type, name } = statusVO || {};
    return (
      <span
        className={`${prefixCls}-main-status ${prefixCls}-main-status-${type}`}
      >
        {name}
      </span>
    );
  }
  function getUser(userInfo = {}, hiddenName = false, tooltipText, tooltipTheme = 'dark') {
    const {
      id: userId,
      imageUrl,
      loginName,
      name,
      realName,
    } = userInfo;
    return userId && (
      <Tooltip theme={tooltipTheme} title={<div className={`${prefixCls}-main-user-tooltip`}>{tooltipText || realName}</div>} placement="top">
        <span className={`${prefixCls}-main-user ${hiddenName ? `${prefixCls}-main-user-hover` : ''}`}>
          <div className={`${prefixCls}-main-user-left`} style={{ marginRight: id === 'more' ? 0 : undefined, backgroundImage: imageUrl ? `url('${imageUrl}')` : 'unset' }}>{!imageUrl && (name || getFirst(realName))}</div>
          {!hiddenName && <span className={`${prefixCls}-main-user-right`} style={{ color: id === 'more' ? 'inherit' : undefined }}>{realName}</span>}
        </span>
      </Tooltip>
    );
  }
  function getUsers(userInfos = [{}]) {
    return (
      <div className={`${prefixCls}-main-users`}>
        {userInfos.length > 1 ? userInfos.slice(0, 3).map((user) => getUser(user, true)) : getUser(userInfos[0])}
        {userInfos.length > 3 && getUser({ id: 'more', name: <Icon type="more_horiz" style={{ fontSize: 'inherit', lineHeight: 'inherit' }} /> }, true,
          <div className={`${prefixCls}-main-users-tooltip`}>
            {userInfos.slice(3).map((user) => <div>{getUser(user)}</div>)}
          </div>, 'light')}
      </div>
    );
  }
  function getProject(project = {}, hiddenName = false, tooltipText, tooltipTheme = 'dark') {
    const {
      id: currentProjectId, name, imageUrl, realId, realName,
    } = project;
    return (currentProjectId || realId) && (
      <Tooltip theme={tooltipTheme} title={<div className={`${prefixCls}-main-project-tooltip`}>{tooltipText || name}</div>} placement="top">
        <span className={`${prefixCls}-main-project ${hiddenName ? `${prefixCls}-main-project-hover` : ''}`}>
          <div
            className={`${prefixCls}-main-project-left`}
            style={{
              color: realId ? '#5365EA' : undefined,
              marginRight: currentProjectId === 'more' ? 0 : undefined,
              backgroundColor: realId ? '#F0F5FF' : undefined,
              backgroundImage: imageUrl && currentProjectId ? `url('${imageUrl}')` : getRandomBackground(currentProjectId),
            }}
          >
            {!imageUrl && (realName || String(name).toLocaleUpperCase().substring(0, 1))}

          </div>
          {!hiddenName && <span className={`${prefixCls}-main-project-right`} style={{ color: currentProjectId === 'more' ? 'inherit' : undefined }}>{name}</span>}
        </span>
      </Tooltip>
    );
  }
  function getProjects(projects = []) {
    return projects.length > 0 ? (
      <div className={`${prefixCls}-main-projects`}>
        {projects.length > 1 ? projects.splice(0, 3).map((project) => getProject(project, true)) : getProject(projects[0])}
        {projects.length > 3 && getProject({ realId: 'more', realName: <Icon type="more_horiz" style={{ fontSize: 'inherit', lineHeight: 'inherit' }} /> }, true,
          <div className={`${prefixCls}-main-projects-tooltip`}>
            {projects.slice(3).map((project) => <div>{getProject(project)}</div>)}
          </div>, 'light')}
      </div>
    ) : '';
  }

  return (
    <div
      role="none"
      className={`${prefixCls}`}
      onClick={handleClick}
      key={`${typeCode}-${issueId || id}`}
    >
      <p className={`${prefixCls}-project`}>
        {projectVO ? projectVO.name : topProjectName || ''}
      </p>
      <div className={`${prefixCls}-main`}>
        {getIssueType(typeCode, !!backlogNum)}
        <Tooltip title={issueNum} placement="top">
          <span className={`${prefixCls}-main-issueId`}>{issueNum || backlogNum}</span>
        </Tooltip>
        <Tooltip title={summary} placement="top">
          <span className={`${prefixCls}-main-description`}>{summary}</span>
        </Tooltip>
        {isStar && starBeacon && <Icon className={`${prefixCls}-main-star`} type="stars" />}
        {getStatus(statusVO)}
        {(switchCode === 'reportedBug' || (isStar && typeCode !== 'feature')) && getUsers(assignees || [{ id: assigneeId, imageUrl: assigneeImageUrl, realName: assigneeRealName }])}
        {typeCode === 'feature' && getProjects(featureTeams)}
        {typeCode !== 'feature' && (
          <span
            className={`${prefixCls}-main-priority`}
            style={{
              backgroundColor: `${priorityVO ? priorityVO.colour : '#FFFFFF'}1F`,
              color: priorityVO ? priorityVO.colour : '#FFFFFF',
            }}
          >
              {priorityVO ? priorityVO.name : '无'}
          </span>
        )}
      </div>
    </div>
  );
});

export default QuestionNode;