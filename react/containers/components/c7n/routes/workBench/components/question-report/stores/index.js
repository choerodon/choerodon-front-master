import React, {
  createContext, useContext, useMemo, useEffect, useState,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { get } from 'lodash';
import { useWorkBenchStore } from '../../../stores';
import QuestionDataSet from './QuestionDataSet';
import useStore from './useStore';

const Store = createContext();

export function useTodoQuestionStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId } },
  } = props;

  const {
    workBenchUseStore,
    selectedProjectId,
    cacheStore,
  } = useWorkBenchStore();

  const {
    reportQuestions,
  } = cacheStore;

  const questionStore = useStore();

  const questionDs = useMemo(() => {
    questionStore.init();
    return new DataSet(QuestionDataSet({
      organizationId, questionStore, selectedProjectId, cacheStore,
    }));
  }, [cacheStore, organizationId, questionStore, selectedProjectId]);

  useEffect(() => {
    const mainData = reportQuestions;
    const tempArr = get(mainData, 'content');
    const currentId = get(mainData, 'selectedProjectId');
    if (selectedProjectId !== currentId) {
      questionStore.setPage(0);
      questionStore.setTotalCount(0);
      questionDs.query();
      return;
    }
    if (tempArr) {
      questionDs.loadData(tempArr);
      questionStore.setHasMore(
        mainData.totalElements > 0 && (mainData.number + 1) < mainData.totalPages,
      );
      questionStore.setTotalCount(mainData.totalElements);
    } else {
      questionDs.query();
    }
  }, [questionDs, questionStore, reportQuestions, selectedProjectId]);

  const value = {
    ...props,
    prefixCls: 'c7ncd-workbench-question-todo',
    questionDs,
    organizationId,
    workBenchUseStore,
    questionStore,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
