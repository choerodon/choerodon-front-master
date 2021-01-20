import sprintNotDone from '../img/1.png';
import sprintCount from '../img/2.png';
import burnDownChart from '../img/3.png';
import defectTreatment from '../img/4.png';
import defectChart from '../img/5.png';
import appService from '../img/6.png';
import env from '../img/7.png';
import pipelineChart from '../img/8.png';
import commitChart from '../img/9.png';
import deployChart from '../img/10.png';
import onlineMember from '../img/11.png';

const componentsObj = {
  // 冲刺未完成统计
  sprintNotDone: {
    layout: {
      h: 2,
      i: 'sprintNotDone',
      minH: 2,
      minW: 4,
      w: 4,
      x: 8,
      y: 0,
    },
    name: 'sprintNotDone',
    type: 'sprintNotDone',
    groupId: 'jobManage',
    title: '冲刺未完成统计',
    describe: '此模块统计当前迭代未完成的工作项数量、故事点数量、工时数量，以及当前迭代剩余天数。',
    img: sprintNotDone,
  },
  // 迭代问题统计
  sprintCount: {
    layout: {
      x: 8,
      y: 2,
      h: 2,
      w: 4,
      minH: 2,
      minW: 4,
      i: 'sprintCount',
    },
    name: 'sprintCount',
    type: 'sprintCount',
    groupId: 'jobManage',
    title: '迭代问题统计',
    describe:
      '此模块展示当前迭代各个工作项在不同状态下的数量。',
    img: sprintCount,
  },
  // 燃尽图
  burnDownChart: {
    layout: {
      x: 0,
      y: 1,
      h: 4,
      w: 6,
      minH: 3,
      minW: 4,
      i: 'burnDownChart',
    },
    name: 'burnDownChart',
    type: 'burnDownChart',
    groupId: 'jobManage',
    title: '燃尽图',
    describe:
      '此模块以故事点、预估工时、问题计数三种维度，显示当前迭代下问题项的燃尽情况，以预估当前迭达是否能按期完成。',
    img: burnDownChart,
  },
  // 缺陷提出与解决
  defectTreatment: {
    layout: {
      h: 4,
      i: 'defectTreatment',
      minH: 3,
      minW: 4,
      w: 6,
      x: 0,
      y: 5,
    },
    name: 'defectTreatment',
    type: 'defectTreatment',
    groupId: 'jobManage',
    title: '缺陷提出与解决',
    describe: '此模块显示当前迭代团队成员提出和解决缺陷的数量。',
    img: defectTreatment,
  },
  // 缺陷累计趋势图
  defectChart: {
    layout: {
      h: 4,
      i: 'defectChart',
      minH: 3,
      minW: 4,
      w: 5,
      x: 0,
      y: 9,
    },
    name: 'defectChart',
    type: 'defectChart',
    groupId: 'jobManage',
    title: '缺陷累计趋势图',
    describe:
      '此模块显示当前迭代时间范围内，每天缺陷提出和解决的变化趋势。',
    img: defectChart,
  },
  // 应用服务
  appService: {
    layout: {
      h: 1,
      i: 'appService',
      minH: 1,
      minW: 3,
      w: 3,
      x: 0,
      y: 0,
    },
    name: 'appService',
    type: 'appService',
    groupId: 'devops',
    title: '应用服务',
    describe:
      '此模块显示了本项目下应用服务的状态与数量。',
    img: appService,
  },
  // 环境
  env: {
    layout: {
      h: 1,
      i: 'env',
      minH: 1,
      minW: 3,
      w: 3,
      x: 3,
      y: 0,
    },
    name: 'env',
    type: 'env',
    groupId: 'devops',
    title: '环境',
    describe:
      '此模块显示了本项目下环境的状态与数量。',
    img: env,
  },

  // 流水线触发次数
  pipelineChart: {
    layout: {
      h: 4,
      i: 'pipelineChart',
      minH: 3,
      minW: 4,
      w: 5,
      x: 7,
      y: 13,
    },
    name: 'pipelineChart',
    type: 'pipelineChart',
    groupId: 'devops',
    title: '流水线触发次数',
    describe:
      '此模块显示该项目下当前迭代应用流水线每天的触发情况以及总的触发次数。',
    img: pipelineChart,
  },
  // 迭代代码提交次数
  commitChart: {
    layout: {
      h: 4,
      i: 'commitChart',
      minH: 4,
      minW: 4,
      w: 5,
      x: 0,
      y: 9,
    },
    name: 'commitChart',
    type: 'commitChart',
    groupId: 'devops',
    title: '迭代代码提交次数',
    describe:
      '此模块显示该项目下当前迭代每天的代码提交情况以及总的提交次数。',
    img: commitChart,
  },
  // 迭代部署次数
  deployChart: {
    layout: {
      h: 4,
      i: 'deployChart',
      minH: 4,
      minW: 4,
      w: 5,
      x: 7,
      y: 9,
    },
    name: 'deployChart',
    type: 'deployChart',
    groupId: 'devops',
    title: '迭代部署次数',
    describe:
      '此模块显示该项目下当前迭代每天的部署情况以及总的部署次数。',
    img: deployChart,
  },

  // 在线成员
  onlineMember: {
    layout: {
      x: 8,
      y: 4,
      h: 5,
      w: 4,
      minH: 2,
      minW: 4,
      i: 'onlineMember',
    },
    name: 'onlineMember',
    type: 'onlineMember',
    groupId: 'common',
    title: '在线成员',
    describe:
      '此模块显示该项目下所有在线的团队成员。',
    img: onlineMember,
  },
};

export default componentsObj;