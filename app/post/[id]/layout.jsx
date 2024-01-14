'use client';

import Provider from '~/app/provider';
import {useEffect, useState} from "react";
import {supportedLocales} from "~/utils/constants/supportedLocales";
import JavascriptTimeAgo from "javascript-time-ago";
import Loading from "~/utils/loading";

JavascriptTimeAgo.addLocale(supportedLocales.en);

const ProfileLayout = ({ children }) => {
  const [localeLoaded, setLocaleLoaded] = useState(false);

  useEffect(() => {
    const userLocale = navigator.language.split('-')[0];
    setLocaleLoaded(true);
    if (userLocale in supportedLocales) {
      JavascriptTimeAgo.addLocale(supportedLocales[userLocale]);
    }
  }, []);
  return <Provider>{!localeLoaded ? <Loading /> : children}</Provider>;
};

export default ProfileLayout;