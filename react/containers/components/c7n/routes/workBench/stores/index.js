import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import useStore from './useStore';

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

  useEffect(() => {
    const project = workBenchUseStore.getActiveStarProject;
    if (project && project.id) {
    } else {
    }
  }, [workBenchUseStore.getActiveStarProject, organizationId]);

  const value = {
    ...props,
    workBenchUseStore,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
