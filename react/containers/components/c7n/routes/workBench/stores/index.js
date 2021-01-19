import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { map, get } from 'lodash';
import { DataSet } from 'choerodon-ui/pro/lib';
import useStore from './useStore';
import useCpCacheStore from './useCpCacheStore';
import mappings from './mappings';
import ComponentsDataset from './ComponentsDataset';

const Store = createContext();

export function useWorkBenchStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId } },
    history,
  } = props;

  const workBenchUseStore = useStore(history);
  const cacheStore = useCpCacheStore();

  const selectedProjectId = get(workBenchUseStore.getActiveStarProject, 'id');
  const category = get(workBenchUseStore.getActiveStarProject, 'category');

  const componentsDs = useMemo(() => new DataSet(ComponentsDataset({ workBenchUseStore })), [workBenchUseStore]);

  const value = {
    ...props,
    prefixCls: 'c7n-workbench',
    dragPrefixcls: 'c7ncd-dragCard',
    componentsDs,
    cacheStore,
    workBenchUseStore,
    organizationId,
    selectedProjectId,
    category,
    history,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
