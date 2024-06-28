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

eval(__webpack_require__.ts("self.addEventListener(\"push\", function(event) {\n    let data = {};\n    if (event.data) {\n        data = event.data.json();\n    }\n    if (data.chatId) {\n        const chatDataResponse = new Response(new Blob([\n            JSON.stringify(data)\n        ], {\n            type: \"application/json\"\n        }));\n        event.waitUntil(caches.open(\"chat-data\").then((cache)=>cache.put(\"current-chat-data\", chatDataResponse)));\n    }\n    event.waitUntil(self.clients.matchAll({\n        type: \"window\",\n        includeUncontrolled: true\n    }).then(function(clients1) {\n        let isChatOpen = false;\n        const chatUrl = \"\".concat(\"http://localhost:3000\", \"/chat/\").concat(data.chatId);\n        for (let client of clients1){\n            if (client.url.includes(chatUrl) && \"focus\" in client) {\n                isChatOpen = true;\n                client.focus();\n                break;\n            }\n        }\n        const title = data.title || \"Message from Next Post\";\n        const userIcon = data.userIcon;\n        const type = data.type || \"message\";\n        const options = {\n            body: data.body || \"Click to open chat\",\n            icon: userIcon,\n            badge: \"/assets/email.png\",\n            sound: \"/assets/notif.mp3\",\n            tag: \"renotify\",\n            renotify: true\n        };\n        if (type === \"call\") {\n            options.actions = [\n                {\n                    action: \"accept\",\n                    type: \"button\",\n                    title: \"Accept Call\",\n                    icon: \"/assets/icons/incoming-call.png\"\n                },\n                {\n                    action: \"reject\",\n                    type: \"button\",\n                    title: \"Reject Call\",\n                    icon: \"/assets/icons/rejected.png\"\n                }\n            ];\n            return self.registration.showNotification(title, options);\n        } else if (!isChatOpen) {\n            return self.registration.showNotification(title, options);\n        }\n    }));\n});\nself.addEventListener(\"notificationclick\", function(event) {\n    event.notification.close();\n    event.waitUntil(caches.open(\"chat-data\").then((cache)=>cache.match(\"current-chat-data\")).then((response)=>{\n        if (response) {\n            return response.json().then((data)=>{\n                const { chatId, type } = data;\n                if (type === \"call\") {\n                    let chatUrl = \"\".concat(\"http://localhost:3000\", \"/chat/\").concat(chatId, \"?source=push\");\n                    if (event.action === \"reject\") {\n                        chatUrl += \"&type=reject\";\n                    }\n                    return clients.openWindow(chatUrl);\n                } else {\n                    const chatUrl = chatId ? \"\".concat(\"http://localhost:3000\", \"/chat/\").concat(chatId) : \"\".concat(\"http://localhost:3000\", \"/chat\");\n                    return clients.openWindow(chatUrl);\n                }\n            });\n        } else {\n            caches.delete(\"action-data\");\n            caches.delete(\"chat-data\");\n            return clients.openWindow(\"\".concat(\"http://localhost:3000\", \"/chat\"));\n        }\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VyxHQUFvQyxPQUFqQ2tCLHVCQUFnQyxFQUFDO29CQUNwSCxPQUFPTCxRQUFRNkIsVUFBVSxDQUFDekI7Z0JBQzVCO1lBQ0Y7UUFDRixPQUFPO1lBQ0xULE9BQU9tQyxNQUFNLENBQUM7WUFDZG5DLE9BQU9tQyxNQUFNLENBQUM7WUFDZCxPQUFPOUIsUUFBUTZCLFVBQVUsQ0FBQyxHQUFvQyxPQUFqQ3hCLHVCQUFnQyxFQUFDO1FBQ2hFO0lBQ0Y7QUFFSiIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi93b3JrZXIvaW5kZXguanM/ODA1ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ3B1c2gnLCBmdW5jdGlvbihldmVudCkge1xyXG4gIGxldCBkYXRhID0ge307XHJcbiAgaWYgKGV2ZW50LmRhdGEpIHtcclxuICAgIGRhdGEgPSBldmVudC5kYXRhLmpzb24oKTtcclxuICB9XHJcblxyXG4gIGlmIChkYXRhLmNoYXRJZCkge1xyXG4gICAgY29uc3QgY2hhdERhdGFSZXNwb25zZSA9IG5ldyBSZXNwb25zZShuZXcgQmxvYihbSlNPTi5zdHJpbmdpZnkoZGF0YSldLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyB9KSk7XHJcbiAgICBldmVudC53YWl0VW50aWwoY2FjaGVzLm9wZW4oJ2NoYXQtZGF0YScpLnRoZW4oY2FjaGUgPT4gY2FjaGUucHV0KCdjdXJyZW50LWNoYXQtZGF0YScsIGNoYXREYXRhUmVzcG9uc2UpKSk7XHJcbiAgfVxyXG5cclxuICBldmVudC53YWl0VW50aWwoXHJcbiAgICBzZWxmLmNsaWVudHMubWF0Y2hBbGwoeyB0eXBlOiAnd2luZG93JywgaW5jbHVkZVVuY29udHJvbGxlZDogdHJ1ZSB9KS50aGVuKGZ1bmN0aW9uKGNsaWVudHMpIHtcclxuICAgICAgbGV0IGlzQ2hhdE9wZW4gPSBmYWxzZTtcclxuICAgICAgY29uc3QgY2hhdFVybCA9IGAke3Byb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0JBU0VfVVJMfS9jaGF0LyR7ZGF0YS5jaGF0SWR9YDtcclxuXHJcbiAgICAgIGZvciAobGV0IGNsaWVudCBvZiBjbGllbnRzKSB7XHJcbiAgICAgICAgaWYgKGNsaWVudC51cmwuaW5jbHVkZXMoY2hhdFVybCkgJiYgJ2ZvY3VzJyBpbiBjbGllbnQpIHtcclxuICAgICAgICAgIGlzQ2hhdE9wZW4gPSB0cnVlO1xyXG4gICAgICAgICAgY2xpZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHRpdGxlID0gZGF0YS50aXRsZSB8fCAnTWVzc2FnZSBmcm9tIE5leHQgUG9zdCc7XHJcbiAgICAgIGNvbnN0IHVzZXJJY29uID0gZGF0YS51c2VySWNvbjtcclxuICAgICAgY29uc3QgdHlwZSA9IGRhdGEudHlwZSB8fCAnbWVzc2FnZSc7XHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgYm9keTogZGF0YS5ib2R5IHx8ICdDbGljayB0byBvcGVuIGNoYXQnLFxyXG4gICAgICAgIGljb246IHVzZXJJY29uLFxyXG4gICAgICAgIGJhZGdlOiAnL2Fzc2V0cy9lbWFpbC5wbmcnLFxyXG4gICAgICAgIHNvdW5kOiAnL2Fzc2V0cy9ub3RpZi5tcDMnLFxyXG4gICAgICAgIHRhZzogJ3Jlbm90aWZ5JyxcclxuICAgICAgICByZW5vdGlmeTogdHJ1ZSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmICh0eXBlID09PSAnY2FsbCcpIHtcclxuICAgICAgICBvcHRpb25zLmFjdGlvbnMgPSBbXHJcbiAgICAgICAgICB7IGFjdGlvbjogJ2FjY2VwdCcsIHR5cGU6ICdidXR0b24nLCB0aXRsZTogJ0FjY2VwdCBDYWxsJywgaWNvbjogJy9hc3NldHMvaWNvbnMvaW5jb21pbmctY2FsbC5wbmcnIH0sXHJcbiAgICAgICAgICB7IGFjdGlvbjogJ3JlamVjdCcsIHR5cGU6ICdidXR0b24nLCB0aXRsZTogJ1JlamVjdCBDYWxsJywgaWNvbjogJy9hc3NldHMvaWNvbnMvcmVqZWN0ZWQucG5nJyB9LFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHJldHVybiBzZWxmLnJlZ2lzdHJhdGlvbi5zaG93Tm90aWZpY2F0aW9uKHRpdGxlLCBvcHRpb25zKTtcclxuICAgICAgfSBlbHNlIGlmICghaXNDaGF0T3Blbikge1xyXG4gICAgICAgIHJldHVybiBzZWxmLnJlZ2lzdHJhdGlvbi5zaG93Tm90aWZpY2F0aW9uKHRpdGxlLCBvcHRpb25zKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICApO1xyXG59KTtcclxuXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbm90aWZpY2F0aW9uY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gIGV2ZW50Lm5vdGlmaWNhdGlvbi5jbG9zZSgpO1xyXG5cclxuICBldmVudC53YWl0VW50aWwoXHJcbiAgICBjYWNoZXMub3BlbignY2hhdC1kYXRhJykudGhlbihjYWNoZSA9PiBjYWNoZS5tYXRjaCgnY3VycmVudC1jaGF0LWRhdGEnKSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgIGNvbnN0IHsgY2hhdElkLCB0eXBlIH0gPSBkYXRhO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NhbGwnKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGF0VXJsID0gYCR7cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQkFTRV9VUkx9L2NoYXQvJHtjaGF0SWR9P3NvdXJjZT1wdXNoYDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChldmVudC5hY3Rpb24gPT09ICdyZWplY3QnKSB7XHJcbiAgICAgICAgICAgICAgY2hhdFVybCArPSAnJnR5cGU9cmVqZWN0JztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNsaWVudHMub3BlbldpbmRvdyhjaGF0VXJsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXRVcmwgPSBjaGF0SWQgPyBgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19CQVNFX1VSTH0vY2hhdC8ke2NoYXRJZH1gIDogYCR7cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQkFTRV9VUkx9L2NoYXRgO1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpZW50cy5vcGVuV2luZG93KGNoYXRVcmwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhY2hlcy5kZWxldGUoJ2FjdGlvbi1kYXRhJyk7XHJcbiAgICAgICAgY2FjaGVzLmRlbGV0ZSgnY2hhdC1kYXRhJyk7XHJcbiAgICAgICAgcmV0dXJuIGNsaWVudHMub3BlbldpbmRvdyhgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19CQVNFX1VSTH0vY2hhdGApO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOlsic2VsZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImRhdGEiLCJqc29uIiwiY2hhdElkIiwiY2hhdERhdGFSZXNwb25zZSIsIlJlc3BvbnNlIiwiQmxvYiIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0eXBlIiwid2FpdFVudGlsIiwiY2FjaGVzIiwib3BlbiIsInRoZW4iLCJjYWNoZSIsInB1dCIsImNsaWVudHMiLCJtYXRjaEFsbCIsImluY2x1ZGVVbmNvbnRyb2xsZWQiLCJpc0NoYXRPcGVuIiwiY2hhdFVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19CQVNFX1VSTCIsImNsaWVudCIsInVybCIsImluY2x1ZGVzIiwiZm9jdXMiLCJ0aXRsZSIsInVzZXJJY29uIiwib3B0aW9ucyIsImJvZHkiLCJpY29uIiwiYmFkZ2UiLCJzb3VuZCIsInRhZyIsInJlbm90aWZ5IiwiYWN0aW9ucyIsImFjdGlvbiIsInJlZ2lzdHJhdGlvbiIsInNob3dOb3RpZmljYXRpb24iLCJub3RpZmljYXRpb24iLCJjbG9zZSIsIm1hdGNoIiwicmVzcG9uc2UiLCJvcGVuV2luZG93IiwiZGVsZXRlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./worker/index.js\n"));

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