import todoThings from '../img/todoThings.png';
import todoQuestions from '../img/todoQuestions.svg';
import serviceList from '../img/appServiceLists.png';
import doc from '../img/doc.png';
import quickLink from '../img/quickLink.png';
import env from '../img/envLists.png';
import selfInfo from '../img/selfInfo.svg';

const componentsObj = {
  // 星标项目
  starTarget: {
    layout: {
      x: 0,
      y: 0,
      w: 9,
      h: 2,
      minH: 2,
      minW: 9,
      static: true,
      i: 'starTarget',
    },
    name: 'starTarget',
    type: 'starTarget',
    // groupId:''
  },
  // 用户信息
  selfInfo: {
    layout: {
      x: 9,
      y: 0,
      h: 2,
      w: 3,
      minH: 2,
      minW: 2,
      static: true,
      i: 'selfInfo',
    },
    name: 'selfInfo',
    type: 'selfInfo',
    groupId: 'common',
    title: '个人信息',
    describe: '展示我的用户名、邮箱以及日期',
    img: selfInfo,
  },
  // 待办事项
  todoQustions: {
    layout: {
      x: 0,
      y: 2,
      h: 4,
      w: 5,
      minH: 3,
      minW: 4,
      static: true,
      i: 'todoQustions',
    },
    name: 'todoQustions',
    type: 'todoQustions',
    groupId: 'jobManage',
    title: '待办事项',
    describe: '展示当前迭代我待办的问题项，以便高效完成工作计划。',
    img: todoQuestions,
  },
  // 待审核模块
  todoThings: {
    layout: {
      x: 5,
      y: 2,
      h: 4,
      w: 4,
      minH: 3,
      minW: 4,
      static: true,
      i: 'todoThings',
    },
    name: 'todoThings',
    type: 'todoThings',
    groupId: 'devops',
    title: '待审核',
    describe: '此模块将会显示待我审核的“流水线人工卡点任务”与“代码合并请求”。',
    img: todoThings,
  },

  // 最近使用应用服务
  serviceList: {
    layout: {
      x: 9,
      y: 2,
      h: 5,
      w: 3,
      minH: 2,
      minW: 3,
      static: true,
      i: 'serviceList',
    },
    name: 'serviceList',
    type: 'serviceList',
    groupId: 'devops',
    title: '应用服务（最近使用）',
    describe: '此模块将显示我近7天操作过的应用服务，以便我能从工作台快速进入对应的代码仓库。',
    img: serviceList,
  },
  // 快速链接
  quickLink: {
    layout: {
      x: 0,
      y: 6,
      h: 5,
      w: 4,
      minH: 3,
      minW: 3,
      static: true,
      i: 'quickLink',
    },
    name: 'quickLink',
    type: 'quickLink',
    groupId: 'common',
    title: '快速链接',
    describe: '此模块将显示我所在项目共享的网址链接，同时支持创建个人的网址链接；以便从工作台快速进入目标地址。',
    img: quickLink,
  },
  // 文档
  doc: {
    layout: {
      x: 4,
      y: 6,
      h: 5,
      w: 5,
      minH: 2,
      minW: 4,
      static: true,
      i: 'doc',
    },
    name: 'doc',
    type: 'doc',
    groupId: 'common',
    title: '文档',
    describe: '此模块将显示我所在项目更新的知识库文档动态，同时支持筛选出我操作过的文档。',
    img: doc,
  },

  // 最近使用环境
  envList: {
    layout: {
      x: 9,
      y: 7,
      h: 5,
      w: 3,
      minH: 2,
      minW: 3,
      static: true,
      i: 'envList',
    },
    name: 'envList',
    type: 'envList',
    groupId: 'devops',
    title: '环境（最近使用）',
    describe: '此模块将显示我近7天使用过的环境，以便我能从工作台快速进入对应的环境管理资源。',
    img: env,
  },
};

export default componentsObj;
