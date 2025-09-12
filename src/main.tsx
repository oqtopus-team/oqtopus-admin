import React from 'react';
import { createRoot } from 'react-dom/client';
import { Flip, ToastContainer } from 'react-toastify';
import App from './App';
import { ProvideAuth } from './hooks/use-auth';
import { I18nProvider } from './i18n/Provider';

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);
root.render(
  <React.StrictMode>
    <ProvideAuth>
      <I18nProvider>
        <App />
        <ToastContainer transition={Flip} />
      </I18nProvider>
    </ProvideAuth>
  </React.StrictMode>
);
