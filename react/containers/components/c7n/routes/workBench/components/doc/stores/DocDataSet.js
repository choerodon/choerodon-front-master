/* eslint-disable import/no-anonymous-default-export */
export default (({
  organizationId, selectedProjectId, self, docStore, cacheStore, rowNumber,
}) => ({
  autoQuery: false,
  selection: false,
  paging: true,
  dataKey: null,
  pageSize: rowNumber * 2,
  transport: {
    read: ({ dataSet }) => ({
      url: `/knowledge/v1/organizations/${organizationId}/work_space/recent_project_update_list${self ? '/self' : ''}${selectedProjectId ? `?projectId=${selectedProjectId}` : ''}`,
      method: 'get',
      transformResponse: (res) => {
        try {
          const mainData = JSON.parse(res);
          const {
            content,
            ...rest
          } = mainData;
          if (mainData && mainData.failed) {
            return mainData;
          }
          let newData = [...mainData.content];
          if (mainData.number > 0 && dataSet) {
            newData = [...dataSet.toData(), ...mainData.content];
          }
          if (dataSet) {
            // eslint-disable-next-line no-param-reassign
            dataSet.pageSize *= (mainData.number + 1);
          }
          docStore.setListHasMore(
            mainData.totalElements > 0 && (mainData.number + 1) < mainData.totalPages,
          );
          // 这里通过ds，工作台层缓存数据，为了在编辑阶段不重新load数据，isSelf是为了标识当前的tab
          const cacheData = {
            ...rest,
            content: newData,
            isSelf: self,
            selectedProjectId,
            rowNumber,
          };
          cacheStore.setCacheDocData(cacheData);
          return newData;
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  },
  fields: [],
}));