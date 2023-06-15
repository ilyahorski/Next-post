'use client';

import '@/styles/globals.css';
import Nav from '@/components/Nav';
import Provider from './provider';
import JavascriptTimeAgo from 'javascript-time-ago';
import Loading from '@/app/loading';
import { useEffect, useState } from 'react';
import { supportedLocales } from '@/utils/constants/supportedLocales';

JavascriptTimeAgo.addDefaultLocale(supportedLocales.en);

const RootLayout = ({ children }) => {
  const [localeLoaded, setLocaleLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userLocale = navigator.language.split('-')[0];
      setLocaleLoaded(true);
      if (userLocale in supportedLocales) {
        JavascriptTimeAgo.addLocale(supportedLocales[userLocale]);
      }
    }
  }, []);

  return (
    <html lang='en'>
    <body>
    <Provider>
      <div className='main main_gradient'>
      </div>
      <main className='app'>
        <Nav />
        {!localeLoaded ? <Loading /> : children}
      </main>
    </Provider>
    </body>
    </html>
  );
};

export default RootLayout;
