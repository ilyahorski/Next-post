/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./worker/index.js":
/*!*************************!*\
  !*** ./worker/index.js ***!
  \*************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval(__webpack_require__.ts("self.addEventListener(\"push\", function(event) {\n    event.preventDefault();\n    let data = {};\n    if (event.data) {\n        data = event.data.json();\n    }\n    if (data.chatId) {\n        const chatDataResponse = new Response(new Blob([\n            JSON.stringify(data)\n        ], {\n            type: \"application/json\"\n        }));\n        event.waitUntil(caches.open(\"chat-data\").then((cache)=>cache.put(\"current-chat-data\", chatDataResponse)));\n    }\n    event.waitUntil(self.clients.matchAll({\n        type: \"window\",\n        includeUncontrolled: true\n    }).then(function(clients1) {\n        let isChatOpen = false;\n        const chatUrl = \"\".concat(\"http://localhost:3000\", \"/chat/\").concat(data.chatId);\n        for (let client of clients1){\n            if (client.url.includes(chatUrl) && \"focus\" in client) {\n                isChatOpen = true;\n                client.focus();\n                break;\n            }\n        }\n        const title = data.title || \"Message from Next Post\";\n        const userIcon = data.userIcon;\n        const type = data.type || \"message\";\n        const notificationTag = \"chat-\".concat(data.chatId, \"-\").concat(data.body);\n        const options = {\n            body: data.body || \"Click to open chat\",\n            icon: userIcon,\n            badge: \"/assets/email.png\",\n            sound: \"/assets/notif.mp3\",\n            tag: notificationTag,\n            renotify: false\n        };\n        if (type === \"call\") {\n            options.actions = [\n                {\n                    action: \"accept\",\n                    type: \"button\",\n                    title: \"Accept Call\",\n                    icon: \"/assets/icons/incoming-call.png\"\n                },\n                {\n                    action: \"reject\",\n                    type: \"button\",\n                    title: \"Reject Call\",\n                    icon: \"/assets/icons/rejected.png\"\n                }\n            ];\n            return self.registration.showNotification(title, options);\n        } else if (!isChatOpen) {\n            return self.registration.getNotifications({\n                tag: notificationTag\n            }).then((existingNotifications)=>{\n                if (existingNotifications.length === 0) {\n                    return self.registration.showNotification(title, options);\n                }\n            });\n        }\n    }));\n});\nself.addEventListener(\"notificationclick\", function(event) {\n    event.preventDefault();\n    event.notification.close();\n    event.waitUntil(caches.open(\"chat-data\").then((cache)=>cache.match(\"current-chat-data\")).then((response)=>{\n        if (response) {\n            return response.json().then((data)=>{\n                const { chatId, type } = data;\n                if (type === \"call\") {\n                    let chatUrl = \"\".concat(\"http://localhost:3000\", \"/chat/\").concat(chatId, \"?source=push\");\n                    if (event.action === \"reject\") {\n                        chatUrl += \"&type=reject\";\n                    }\n                    return clients.openWindow(chatUrl);\n                } else {\n                    const chatUrl = chatId ? \"\".concat(\"http://localhost:3000\", \"/chat/\").concat(chatId) : \"\".concat(\"http://localhost:3000\", \"/chat\");\n                    return clients.openWindow(chatUrl);\n                }\n            });\n        } else {\n            caches.delete(\"action-data\");\n            caches.delete(\"chat-data\");\n            return clients.openWindow(\"\".concat(\"http://localhost:3000\", \"/chat\"));\n        }\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi93b3JrZXIvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUFBLEtBQUtDLGdCQUFnQixDQUFDLFFBQVEsU0FBU0MsS0FBSztJQUMxQ0EsTUFBTUMsY0FBYztJQUNwQixJQUFJQyxPQUFPLENBQUM7SUFDWixJQUFJRixNQUFNRSxJQUFJLEVBQUU7UUFDZEEsT0FBT0YsTUFBTUUsSUFBSSxDQUFDQyxJQUFJO0lBQ3hCO0lBRUEsSUFBSUQsS0FBS0UsTUFBTSxFQUFFO1FBQ2YsTUFBTUMsbUJBQW1CLElBQUlDLFNBQVMsSUFBSUMsS0FBSztZQUFDQyxLQUFLQyxTQUFTLENBQUNQO1NBQU0sRUFBRTtZQUFFUSxNQUFNO1FBQW1CO1FBQ2xHVixNQUFNVyxTQUFTLENBQUNDLE9BQU9DLElBQUksQ0FBQyxhQUFhQyxJQUFJLENBQUNDLENBQUFBLFFBQVNBLE1BQU1DLEdBQUcsQ0FBQyxxQkFBcUJYO0lBQ3hGO0lBRUFMLE1BQU1XLFNBQVMsQ0FDYmIsS0FBS21CLE9BQU8sQ0FBQ0MsUUFBUSxDQUFDO1FBQUVSLE1BQU07UUFBVVMscUJBQXFCO0lBQUssR0FBR0wsSUFBSSxDQUFDLFNBQVNHLFFBQU87UUFDeEYsSUFBSUcsYUFBYTtRQUNqQixNQUFNQyxVQUFVLEdBQTRDbkIsT0FBekNvQix1QkFBZ0MsRUFBQyxVQUFvQixPQUFacEIsS0FBS0UsTUFBTTtRQUV2RSxLQUFLLElBQUlxQixVQUFVUixTQUFTO1lBQzFCLElBQUlRLE9BQU9DLEdBQUcsQ0FBQ0MsUUFBUSxDQUFDTixZQUFZLFdBQVdJLFFBQVE7Z0JBQ3JETCxhQUFhO2dCQUNiSyxPQUFPRyxLQUFLO2dCQUNaO1lBQ0Y7UUFDRjtRQUVBLE1BQU1DLFFBQVEzQixLQUFLMkIsS0FBSyxJQUFJO1FBQzVCLE1BQU1DLFdBQVc1QixLQUFLNEIsUUFBUTtRQUM5QixNQUFNcEIsT0FBT1IsS0FBS1EsSUFBSSxJQUFJO1FBQzFCLE1BQU1xQixrQkFBa0IsUUFBdUI3QixPQUFmQSxLQUFLRSxNQUFNLEVBQUMsS0FBYSxPQUFWRixLQUFLOEIsSUFBSTtRQUV4RCxNQUFNQyxVQUFVO1lBQ2RELE1BQU05QixLQUFLOEIsSUFBSSxJQUFJO1lBQ25CRSxNQUFNSjtZQUNOSyxPQUFPO1lBQ1BDLE9BQU87WUFDUEMsS0FBS047WUFDTE8sVUFBVTtRQUNaO1FBRUEsSUFBSTVCLFNBQVMsUUFBUTtZQUNuQnVCLFFBQVFNLE9BQU8sR0FBRztnQkFDaEI7b0JBQUVDLFFBQVE7b0JBQVU5QixNQUFNO29CQUFVbUIsT0FBTztvQkFBZUssTUFBTTtnQkFBa0M7Z0JBQ2xHO29CQUFFTSxRQUFRO29CQUFVOUIsTUFBTTtvQkFBVW1CLE9BQU87b0JBQWVLLE1BQU07Z0JBQTZCO2FBQzlGO1lBRUQsT0FBT3BDLEtBQUsyQyxZQUFZLENBQUNDLGdCQUFnQixDQUFDYixPQUFPSTtRQUNuRCxPQUFPLElBQUksQ0FBQ2IsWUFBWTtZQUN0QixPQUFPdEIsS0FBSzJDLFlBQVksQ0FBQ0UsZ0JBQWdCLENBQUM7Z0JBQUVOLEtBQUtOO1lBQWdCLEdBQUdqQixJQUFJLENBQUM4QixDQUFBQTtnQkFDdkUsSUFBSUEsc0JBQXNCQyxNQUFNLEtBQUssR0FBRztvQkFDdEMsT0FBTy9DLEtBQUsyQyxZQUFZLENBQUNDLGdCQUFnQixDQUFDYixPQUFPSTtnQkFDbkQ7WUFDRjtRQUNGO0lBQ0Y7QUFFSjtBQUVBbkMsS0FBS0MsZ0JBQWdCLENBQUMscUJBQXFCLFNBQVNDLEtBQUs7SUFDdkRBLE1BQU1DLGNBQWM7SUFDcEJELE1BQU04QyxZQUFZLENBQUNDLEtBQUs7SUFFeEIvQyxNQUFNVyxTQUFTLENBQ2JDLE9BQU9DLElBQUksQ0FBQyxhQUFhQyxJQUFJLENBQUNDLENBQUFBLFFBQVNBLE1BQU1pQyxLQUFLLENBQUMsc0JBQXNCbEMsSUFBSSxDQUFDbUMsQ0FBQUE7UUFDNUUsSUFBSUEsVUFBVTtZQUNaLE9BQU9BLFNBQVM5QyxJQUFJLEdBQUdXLElBQUksQ0FBQ1osQ0FBQUE7Z0JBQzFCLE1BQU0sRUFBRUUsTUFBTSxFQUFFTSxJQUFJLEVBQUUsR0FBR1I7Z0JBRXpCLElBQUlRLFNBQVMsUUFBUTtvQkFDbkIsSUFBSVcsVUFBVSxHQUE0Q2pCLE9BQXpDa0IsdUJBQWdDLEVBQUMsVUFBZSxPQUFQbEIsUUFBTztvQkFFakUsSUFBSUosTUFBTXdDLE1BQU0sS0FBSyxVQUFVO3dCQUM3Qm5CLFdBQVc7b0JBQ2I7b0JBRUEsT0FBT0osUUFBUWlDLFVBQVUsQ0FBQzdCO2dCQUM1QixPQUFPO29CQUNMLE1BQU1BLFVBQVVqQixTQUFTLEdBQTRDQSxPQUF6Q2tCLHVCQUFnQyxFQUFDLFVBQWUsT0FBUGxCLFVBQVcsR0FBb0MsT0FBakNrQix1QkFBZ0MsRUFBQztvQkFDcEgsT0FBT0wsUUFBUWlDLFVBQVUsQ0FBQzdCO2dCQUM1QjtZQUNGO1FBQ0YsT0FBTztZQUNMVCxPQUFPdUMsTUFBTSxDQUFDO1lBQ2R2QyxPQUFPdUMsTUFBTSxDQUFDO1lBQ2QsT0FBT2xDLFFBQVFpQyxVQUFVLENBQUMsR0FBb0MsT0FBakM1Qix1QkFBZ0MsRUFBQztRQUNoRTtJQUNGO0FBRUoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vd29ya2VyL2luZGV4LmpzPzgwNWUiXSwic291cmNlc0NvbnRlbnQiOlsic2VsZi5hZGRFdmVudExpc3RlbmVyKCdwdXNoJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGxldCBkYXRhID0ge307XHJcbiAgaWYgKGV2ZW50LmRhdGEpIHtcclxuICAgIGRhdGEgPSBldmVudC5kYXRhLmpzb24oKTtcclxuICB9XHJcblxyXG4gIGlmIChkYXRhLmNoYXRJZCkge1xyXG4gICAgY29uc3QgY2hhdERhdGFSZXNwb25zZSA9IG5ldyBSZXNwb25zZShuZXcgQmxvYihbSlNPTi5zdHJpbmdpZnkoZGF0YSldLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyB9KSk7XHJcbiAgICBldmVudC53YWl0VW50aWwoY2FjaGVzLm9wZW4oJ2NoYXQtZGF0YScpLnRoZW4oY2FjaGUgPT4gY2FjaGUucHV0KCdjdXJyZW50LWNoYXQtZGF0YScsIGNoYXREYXRhUmVzcG9uc2UpKSk7XHJcbiAgfVxyXG5cclxuICBldmVudC53YWl0VW50aWwoXHJcbiAgICBzZWxmLmNsaWVudHMubWF0Y2hBbGwoeyB0eXBlOiAnd2luZG93JywgaW5jbHVkZVVuY29udHJvbGxlZDogdHJ1ZSB9KS50aGVuKGZ1bmN0aW9uKGNsaWVudHMpIHtcclxuICAgICAgbGV0IGlzQ2hhdE9wZW4gPSBmYWxzZTtcclxuICAgICAgY29uc3QgY2hhdFVybCA9IGAke3Byb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0JBU0VfVVJMfS9jaGF0LyR7ZGF0YS5jaGF0SWR9YDtcclxuXHJcbiAgICAgIGZvciAobGV0IGNsaWVudCBvZiBjbGllbnRzKSB7XHJcbiAgICAgICAgaWYgKGNsaWVudC51cmwuaW5jbHVkZXMoY2hhdFVybCkgJiYgJ2ZvY3VzJyBpbiBjbGllbnQpIHtcclxuICAgICAgICAgIGlzQ2hhdE9wZW4gPSB0cnVlO1xyXG4gICAgICAgICAgY2xpZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHRpdGxlID0gZGF0YS50aXRsZSB8fCAnTWVzc2FnZSBmcm9tIE5leHQgUG9zdCc7XHJcbiAgICAgIGNvbnN0IHVzZXJJY29uID0gZGF0YS51c2VySWNvbjtcclxuICAgICAgY29uc3QgdHlwZSA9IGRhdGEudHlwZSB8fCAnbWVzc2FnZSc7XHJcbiAgICAgIGNvbnN0IG5vdGlmaWNhdGlvblRhZyA9IGBjaGF0LSR7ZGF0YS5jaGF0SWR9LSR7ZGF0YS5ib2R5fWA7XHJcblxyXG4gICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgIGJvZHk6IGRhdGEuYm9keSB8fCAnQ2xpY2sgdG8gb3BlbiBjaGF0JyxcclxuICAgICAgICBpY29uOiB1c2VySWNvbixcclxuICAgICAgICBiYWRnZTogJy9hc3NldHMvZW1haWwucG5nJyxcclxuICAgICAgICBzb3VuZDogJy9hc3NldHMvbm90aWYubXAzJyxcclxuICAgICAgICB0YWc6IG5vdGlmaWNhdGlvblRhZyxcclxuICAgICAgICByZW5vdGlmeTogZmFsc2UsIFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKHR5cGUgPT09ICdjYWxsJykge1xyXG4gICAgICAgIG9wdGlvbnMuYWN0aW9ucyA9IFtcclxuICAgICAgICAgIHsgYWN0aW9uOiAnYWNjZXB0JywgdHlwZTogJ2J1dHRvbicsIHRpdGxlOiAnQWNjZXB0IENhbGwnLCBpY29uOiAnL2Fzc2V0cy9pY29ucy9pbmNvbWluZy1jYWxsLnBuZycgfSxcclxuICAgICAgICAgIHsgYWN0aW9uOiAncmVqZWN0JywgdHlwZTogJ2J1dHRvbicsIHRpdGxlOiAnUmVqZWN0IENhbGwnLCBpY29uOiAnL2Fzc2V0cy9pY29ucy9yZWplY3RlZC5wbmcnIH0sXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGYucmVnaXN0cmF0aW9uLnNob3dOb3RpZmljYXRpb24odGl0bGUsIG9wdGlvbnMpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFpc0NoYXRPcGVuKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGYucmVnaXN0cmF0aW9uLmdldE5vdGlmaWNhdGlvbnMoeyB0YWc6IG5vdGlmaWNhdGlvblRhZyB9KS50aGVuKGV4aXN0aW5nTm90aWZpY2F0aW9ucyA9PiB7XHJcbiAgICAgICAgICBpZiAoZXhpc3RpbmdOb3RpZmljYXRpb25zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5yZWdpc3RyYXRpb24uc2hvd05vdGlmaWNhdGlvbih0aXRsZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgKTtcclxufSk7XHJcblxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ25vdGlmaWNhdGlvbmNsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGV2ZW50Lm5vdGlmaWNhdGlvbi5jbG9zZSgpO1xyXG5cclxuICBldmVudC53YWl0VW50aWwoXHJcbiAgICBjYWNoZXMub3BlbignY2hhdC1kYXRhJykudGhlbihjYWNoZSA9PiBjYWNoZS5tYXRjaCgnY3VycmVudC1jaGF0LWRhdGEnKSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgIGNvbnN0IHsgY2hhdElkLCB0eXBlIH0gPSBkYXRhO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NhbGwnKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGF0VXJsID0gYCR7cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQkFTRV9VUkx9L2NoYXQvJHtjaGF0SWR9P3NvdXJjZT1wdXNoYDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChldmVudC5hY3Rpb24gPT09ICdyZWplY3QnKSB7XHJcbiAgICAgICAgICAgICAgY2hhdFVybCArPSAnJnR5cGU9cmVqZWN0JztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNsaWVudHMub3BlbldpbmRvdyhjaGF0VXJsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXRVcmwgPSBjaGF0SWQgPyBgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19CQVNFX1VSTH0vY2hhdC8ke2NoYXRJZH1gIDogYCR7cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQkFTRV9VUkx9L2NoYXRgO1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpZW50cy5vcGVuV2luZG93KGNoYXRVcmwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhY2hlcy5kZWxldGUoJ2FjdGlvbi1kYXRhJyk7XHJcbiAgICAgICAgY2FjaGVzLmRlbGV0ZSgnY2hhdC1kYXRhJyk7XHJcbiAgICAgICAgcmV0dXJuIGNsaWVudHMub3BlbldpbmRvdyhgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19CQVNFX1VSTH0vY2hhdGApO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOlsic2VsZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiZGF0YSIsImpzb24iLCJjaGF0SWQiLCJjaGF0RGF0YVJlc3BvbnNlIiwiUmVzcG9uc2UiLCJCbG9iIiwiSlNPTiIsInN0cmluZ2lmeSIsInR5cGUiLCJ3YWl0VW50aWwiLCJjYWNoZXMiLCJvcGVuIiwidGhlbiIsImNhY2hlIiwicHV0IiwiY2xpZW50cyIsIm1hdGNoQWxsIiwiaW5jbHVkZVVuY29udHJvbGxlZCIsImlzQ2hhdE9wZW4iLCJjaGF0VXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX0JBU0VfVVJMIiwiY2xpZW50IiwidXJsIiwiaW5jbHVkZXMiLCJmb2N1cyIsInRpdGxlIiwidXNlckljb24iLCJub3RpZmljYXRpb25UYWciLCJib2R5Iiwib3B0aW9ucyIsImljb24iLCJiYWRnZSIsInNvdW5kIiwidGFnIiwicmVub3RpZnkiLCJhY3Rpb25zIiwiYWN0aW9uIiwicmVnaXN0cmF0aW9uIiwic2hvd05vdGlmaWNhdGlvbiIsImdldE5vdGlmaWNhdGlvbnMiLCJleGlzdGluZ05vdGlmaWNhdGlvbnMiLCJsZW5ndGgiLCJub3RpZmljYXRpb24iLCJjbG9zZSIsIm1hdGNoIiwicmVzcG9uc2UiLCJvcGVuV2luZG93IiwiZGVsZXRlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./worker/index.js\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = function() {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: function(script) { return script; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	!function() {
/******/ 		__webpack_require__.ts = function(script) { return __webpack_require__.tt().createScript(script); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	!function() {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push(function(options) {
/******/ 			var originalFactory = options.factory;
/******/ 			options.factory = function(moduleObject, moduleExports, webpackRequire) {
/******/ 				var hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				var cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : function() {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./worker/index.js");
/******/ 	
/******/ })()
;