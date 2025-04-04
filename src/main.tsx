import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ProvideAuth } from './hooks/use-auth';
import { I18nProvider } from './i18n/Provider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ProvideAuth>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ProvideAuth>
  </React.StrictMode>
);
