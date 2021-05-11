import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import useStore, { MainStoreProps } from './useStore';

interface ContextProps {
  intlPrefix: string,
  prefixCls: string
  intl: { formatMessage(arg0: object, arg1?: object): string },
  mainStore: MainStoreProps
}

const Store = createContext({} as ContextProps);

export function useSaaSFeedbackStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props: any) => {
  const {
    children,
    intl: { formatMessage },
  } = props;

  const mainStore = useStore();

  const value = {
    ...props,
    prefixCls: 'c7ncd-saas-feedback',
    mainStore,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
