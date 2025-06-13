import React from 'react';
import ReactDOM from 'react-dom/client';
import { Flip, ToastContainer } from 'react-toastify';
import App from './App';
import { ProvideAuth } from './hooks/use-auth';
import { I18nProvider } from './i18n/Provider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ProvideAuth>
      <I18nProvider>
        <App />
        <ToastContainer transition={Flip} />
      </I18nProvider>
    </ProvideAuth>
  </React.StrictMode>
);
