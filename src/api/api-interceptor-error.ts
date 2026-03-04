export const setupInterceptors = () => {
  globalAxios.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.message || i18next.t('errors.api.unknown_error');
      toast(message, errorToastConfig);
      return Promise.reject(error);
    }
  );
};