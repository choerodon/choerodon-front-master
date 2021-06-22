import axios from 'axios';
import React from 'react';
import { removeAccessToken } from '@/utils/accessToken';
import { authorizeUrl } from '@/utils/authorize';
import {
  prompt,
} from '@/utils';
import { notification } from 'choerodon-ui';
import qs from 'qs';
import BigNumber from 'bignumber.js';
import get from 'lodash/get';
import { authorizeC7n } from "@/utils/authorize";

// eslint-disable-next-line import/no-cycle
import MenuStore from '../../../../stores/c7n/MenuStore';

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|error.permission.accessTokenExpired)/;

const pendingRequest = new Map();

// 是否出现身份认证失效的弹框
let isExistInvalidTokenNotification = false;

function cursiveSetCorrectId(source, correctId, flag) {
  let tempCorrectedId = correctId;
  let tempFlag = flag;
  for (let i = 0; i < source.length; i += 1) {
    if (source[i].code === MenuStore.activeMenu.code) {
      tempCorrectedId = source[i].id;
      tempFlag = 1;
    }
    if (source[i].subMenus && source[i].subMenus.length > 0) {
      tempCorrectedId = cursiveSetCorrectId(
        source[i].subMenus,
        tempCorrectedId,
        tempFlag,
      );
    }
    if (tempFlag === 1) {
      break;
    }
  }
  return tempCorrectedId;
}

function getDataMark(data) {
  if (typeof data === 'string') {
    return JSON.parse(data);
  }
  return data;
}

function handleRequestCancelToken(config) {
  const tempConfig = config;
  // 区别请求的唯一标识，这里用方法名+请求路径
  // 如果一个项目里有多个不同baseURL的请求 + 参数
  const enabledCancelMark = get(config, 'enabledCancelMark');

  if (enabledCancelMark) {
    const tempQueryString = config.paramsSerializer(tempConfig.params);
    const dataMark = JSON.stringify(getDataMark(get(config, 'data')));

    let requestMark = [
      tempConfig.method,
      tempConfig.url,
    ];

    tempQueryString && requestMark.push(tempQueryString);
    dataMark && requestMark.push(dataMark);

    requestMark = requestMark.join('&');

    // 找当前请求的标识是否存在pendingRequest中，即是否重复请求了
    const markIndex = pendingRequest.get(requestMark);
    // 存在，即重复了
    if (markIndex) {
      // 取消上个重复的请求
      markIndex?.cancel && markIndex.cancel({
        config,
      });
      // 删掉在pendingRequest中的请求标识
      pendingRequest.delete(requestMark);
    }
    // （重新）新建针对这次请求的axios的cancelToken标识
    const { CancelToken } = axios;
    const source = CancelToken.source();
    tempConfig.cancelToken = source.token;
    // 设置自定义配置requestMark项，主要用于响应拦截中
    tempConfig.requestMark = requestMark;
    // 记录本次请求的标识
    pendingRequest.set(requestMark, {
      name: requestMark,
      cancel: source.cancel,
      routeChangeCancel: tempConfig.routeChangeCancel, // 可能会有优先级高于默认设置的routeChangeCancel项值
    });
  }

  return tempConfig;
}

function handleResponseCancelToken(config) {
  const mark = config?.config?.requestMark;
  const markIndex = pendingRequest.get(mark);
  // 找到了就删除该标识
  markIndex && pendingRequest.delete(mark);
}

function handelResponseError(error, ...rest) {
  const { response } = error;
  // let errorFormat;
  if (response) {
    const { status } = response;
    switch (status) {
      case 401: {
        if (!isExistInvalidTokenNotification) {
          isExistInvalidTokenNotification = true;
          notification.error({
            message: '未登录或身份认证已失效',
            description:
              // '您未登录或者身份认证已失效 ，请',
            (
              <span>
                您未登录或者身份认证已失效 ，请
                <a onClick={() => {
                  removeAccessToken();
                  authorizeC7n();
                }}>重新登录</a>
              </span>
            ),
            duration: null,
            placement: 'bottomLeft',
            onClose: () => {
              isExistInvalidTokenNotification = false;
            }
          });
        }
        // authorizeUrl();
        break;
      }
      case 403: {
        if (regTokenExpired.test(response.data)) {
          removeAccessToken();
          authorizeUrl();
        }
        break;
      }
      default:
        prompt(response.data, 'error');
        break;
    }
    handleResponseCancelToken(response.config);
    // 设置返回的错误对象格式
    // errorFormat = {
    //   ...error,
    // };
  }
  // 如果是主动取消了请求，做个标识
  if (axios.isCancel(error)) {
    return new Promise(() => {});
  }
  return Promise.reject(error);
}

function handleDefaultTransformParamsSerializer(params) {
  if (params instanceof URLSearchParams) {
    return params.toString();
  }
  const newParams = { ...params };
  for (const key in newParams) {
    if (newParams[key] instanceof BigNumber) {
      newParams[key] = newParams[key].toString();
    }
  }
  return qs.stringify(newParams);
}

export {
  cursiveSetCorrectId,
  handleRequestCancelToken,
  handleResponseCancelToken,
  handelResponseError,
  handleDefaultTransformParamsSerializer,
  pendingRequest,
};
