import React from "react";
import ReactTimeAgo from "react-time-ago";
import JavascriptTimeAgo from "javascript-time-ago";
import { supportedLocales, localeToFullLocale } from "~/utils/constants/supportedLocales";

// Глобальное добавление всех локалей
Object.values(supportedLocales).forEach((locale) => {
  JavascriptTimeAgo.addLocale(locale);
});

// Добавление локали по умолчанию
JavascriptTimeAgo.addDefaultLocale(supportedLocales["en"]);

const ReactTimeAgoWrapper = ({
  date,
  locale = navigator.language.split("-")[0] in supportedLocales
    ? localeToFullLocale[navigator.language.split("-")[0]]
    : "en-GB",
  timeStyle = "round",
}) => {
  return (
    <ReactTimeAgo
      date={new Date(date).getTime()}
      locale={locale || "en-GB"}
      timeStyle={timeStyle}
    />
  );
};

export default ReactTimeAgoWrapper;
