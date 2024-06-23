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

eval(__webpack_require__.ts("self.addEventListener(\"push\", function(event) {\n    let data = {};\n    if (event.data) {\n        data = event.data.json();\n    }\n    if (data.chatId) {\n        const chatDataResponse = new Response(new Blob([\n            JSON.stringify(data)\n        ], {\n            type: \"application/json\"\n        }));\n        event.waitUntil(caches.open(\"chat-data\").then((cache)=>cache.put(\"current-chat-data\", chatDataResponse)));\n    }\n    event.waitUntil(self.clients.matchAll({\n        type: \"window\",\n        includeUncontrolled: true\n    }).then(function(clients1) {\n        let isChatOpen = false;\n        const chatUrl = \"\".concat(\"http://localhost:3000\", \"/chat/\").concat(data.chatId);\n        for (let client of clients1){\n            if (client.url.includes(chatUrl) && \"focus\" in client) {\n                isChatOpen = true;\n                client.focus();\n                break;\n            }\n        }\n        if (!isChatOpen) {\n            const title = data.title || \"Message from Next Post\";\n            const userIcon = data.userIcon;\n            const type = data.type || \"message\";\n            const options = {\n                body: data.body || \"Click to open chat\",\n                icon: userIcon,\n                badge: \"/assets/email.png\",\n                sound: \"/assets/notif.mp3\",\n                tag: \"renotify\",\n                renotify: true\n            };\n            if (type === \"call\") {\n                options.actions = [\n                    {\n                        action: \"accept\",\n                        type: \"button\",\n                        title: \"Accept Call\",\n                        icon: \"/assets/icons/incoming-call.png\"\n                    },\n                    {\n                        action: \"reject\",\n                        type: \"button\",\n                        title: \"Reject Call\",\n                        icon: \"/assets/icons/rejected.png\"\n                    }\n                ];\n            }\n            return self.registration.showNotification(title, options);\n        }\n    }));\n});\nself.addEventListener(\"notificationclick\", function(event) {\n    event.notification.close();\n    event.waitUntil(caches.open(\"chat-data\").then((cache)=>cache.match(\"current-chat-data\")).then((response)=>{\n        if (response) {\n            return response.json().then((data)=>{\n                const { chatId, type } = data;\n                if (type === \"call\") {\n                    let chatUrl = \"\".concat(\"http://localhost:3000\", \"/chat/\").concat(chatId, \"?source=push\");\n                    const action = event.action === \"accept\" ? \"acceptCall\" : \"rejectCall\";\n                    if (event.action === \"reject\") {\n                        chatUrl += \"&type=reject\";\n                    }\n                    const actionData = {\n                        action: action,\n                        chatId: chatId\n                    };\n                    const actionDataResponse = new Response(new Blob([\n                        JSON.stringify(actionData)\n                    ], {\n                        type: \"application/json\"\n                    }));\n                    caches.open(\"action-data\").then((cache)=>cache.put(\"current-action-data\", actionDataResponse));\n                    return clients.openWindow(chatUrl);\n                } else {\n                    const chatUrl = chatId ? \"\".concat(\"http://localhost:3000\", \"/chat/\").concat(chatId, \"?source=push\") : \"\".concat(\"http://localhost:3000\", \"/chat\");\n                    return clients.openWindow(chatUrl);\n                }\n            });\n        } else {\n            return clients.openWindow(\"\".concat(\"http://localhost:3000\", \"/chat\"));\n        }\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFLQyxTQUFTLENBQUNxQztxQkFBWSxFQUFFO3dCQUFFcEMsTUFBTTtvQkFBbUI7b0JBQzFHRSxPQUFPQyxJQUFJLENBQUMsZUFBZUMsSUFBSSxDQUFDQyxDQUFBQSxRQUFTQSxNQUFNQyxHQUFHLENBQUMsdUJBQXVCK0I7b0JBRTFFLE9BQU85QixRQUFRK0IsVUFBVSxDQUFDM0I7Z0JBQzVCLE9BQU87b0JBQ0wsTUFBTUEsVUFBVWpCLFNBQVMsR0FBNENBLE9BQXpDa0IsdUJBQWdDLEVBQUMsVUFBZSxPQUFQbEIsUUFBTyxrQkFBZ0IsR0FBb0MsT0FBakNrQix1QkFBZ0MsRUFBQztvQkFDaEksT0FBT0wsUUFBUStCLFVBQVUsQ0FBQzNCO2dCQUM1QjtZQUNGO1FBQ0YsT0FBTztZQUNMLE9BQU9KLFFBQVErQixVQUFVLENBQUMsR0FBb0MsT0FBakMxQix1QkFBZ0MsRUFBQztRQUNoRTtJQUNGO0FBRUoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vd29ya2VyL2luZGV4LmpzPzgwNWUiXSwic291cmNlc0NvbnRlbnQiOlsic2VsZi5hZGRFdmVudExpc3RlbmVyKCdwdXNoJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICBsZXQgZGF0YSA9IHt9O1xyXG4gIGlmIChldmVudC5kYXRhKSB7XHJcbiAgICBkYXRhID0gZXZlbnQuZGF0YS5qc29uKCk7XHJcbiAgfVxyXG5cclxuICBpZiAoZGF0YS5jaGF0SWQpIHtcclxuICAgIGNvbnN0IGNoYXREYXRhUmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobmV3IEJsb2IoW0pTT04uc3RyaW5naWZ5KGRhdGEpXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vanNvbicgfSkpO1xyXG4gICAgZXZlbnQud2FpdFVudGlsKGNhY2hlcy5vcGVuKCdjaGF0LWRhdGEnKS50aGVuKGNhY2hlID0+IGNhY2hlLnB1dCgnY3VycmVudC1jaGF0LWRhdGEnLCBjaGF0RGF0YVJlc3BvbnNlKSkpO1xyXG4gIH1cclxuXHJcbiAgZXZlbnQud2FpdFVudGlsKFxyXG4gICAgc2VsZi5jbGllbnRzLm1hdGNoQWxsKHsgdHlwZTogJ3dpbmRvdycsIGluY2x1ZGVVbmNvbnRyb2xsZWQ6IHRydWUgfSkudGhlbihmdW5jdGlvbihjbGllbnRzKSB7XHJcbiAgICAgIGxldCBpc0NoYXRPcGVuID0gZmFsc2U7XHJcbiAgICAgIGNvbnN0IGNoYXRVcmwgPSBgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19CQVNFX1VSTH0vY2hhdC8ke2RhdGEuY2hhdElkfWA7XHJcblxyXG4gICAgICBmb3IgKGxldCBjbGllbnQgb2YgY2xpZW50cykge1xyXG4gICAgICAgIGlmIChjbGllbnQudXJsLmluY2x1ZGVzKGNoYXRVcmwpICYmICdmb2N1cycgaW4gY2xpZW50KSB7XHJcbiAgICAgICAgICBpc0NoYXRPcGVuID0gdHJ1ZTtcclxuICAgICAgICAgIGNsaWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWlzQ2hhdE9wZW4pIHtcclxuICAgICAgICBjb25zdCB0aXRsZSA9IGRhdGEudGl0bGUgfHwgJ01lc3NhZ2UgZnJvbSBOZXh0IFBvc3QnO1xyXG4gICAgICAgIGNvbnN0IHVzZXJJY29uID0gZGF0YS51c2VySWNvbjtcclxuICAgICAgICBjb25zdCB0eXBlID0gZGF0YS50eXBlIHx8ICdtZXNzYWdlJztcclxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgYm9keTogZGF0YS5ib2R5IHx8ICdDbGljayB0byBvcGVuIGNoYXQnLFxyXG4gICAgICAgICAgaWNvbjogdXNlckljb24sXHJcbiAgICAgICAgICBiYWRnZTogJy9hc3NldHMvZW1haWwucG5nJyxcclxuICAgICAgICAgIHNvdW5kOiAnL2Fzc2V0cy9ub3RpZi5tcDMnLFxyXG4gICAgICAgICAgdGFnOiAncmVub3RpZnknLFxyXG4gICAgICAgICAgcmVub3RpZnk6IHRydWUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdjYWxsJykge1xyXG4gICAgICAgICAgb3B0aW9ucy5hY3Rpb25zID0gW1xyXG4gICAgICAgICAgICB7IGFjdGlvbjogJ2FjY2VwdCcsIHR5cGU6ICdidXR0b24nLCB0aXRsZTogJ0FjY2VwdCBDYWxsJywgaWNvbjogJy9hc3NldHMvaWNvbnMvaW5jb21pbmctY2FsbC5wbmcnIH0sXHJcbiAgICAgICAgICAgIHsgYWN0aW9uOiAncmVqZWN0JywgdHlwZTogJ2J1dHRvbicsIHRpdGxlOiAnUmVqZWN0IENhbGwnLCBpY29uOiAnL2Fzc2V0cy9pY29ucy9yZWplY3RlZC5wbmcnIH0sXHJcbiAgICAgICAgICBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGYucmVnaXN0cmF0aW9uLnNob3dOb3RpZmljYXRpb24odGl0bGUsIG9wdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICk7XHJcbn0pO1xyXG5cclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdub3RpZmljYXRpb25jbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgZXZlbnQubm90aWZpY2F0aW9uLmNsb3NlKCk7XHJcblxyXG4gIGV2ZW50LndhaXRVbnRpbChcclxuICAgIGNhY2hlcy5vcGVuKCdjaGF0LWRhdGEnKS50aGVuKGNhY2hlID0+IGNhY2hlLm1hdGNoKCdjdXJyZW50LWNoYXQtZGF0YScpKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgaWYgKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgY29uc3QgeyBjaGF0SWQsIHR5cGUgfSA9IGRhdGE7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmICh0eXBlID09PSAnY2FsbCcpIHtcclxuICAgICAgICAgICAgbGV0IGNoYXRVcmwgPSBgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19CQVNFX1VSTH0vY2hhdC8ke2NoYXRJZH0/c291cmNlPXB1c2hgO1xyXG4gICAgICAgICAgICBjb25zdCBhY3Rpb24gPSBldmVudC5hY3Rpb24gPT09ICdhY2NlcHQnID8gJ2FjY2VwdENhbGwnIDogJ3JlamVjdENhbGwnO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmFjdGlvbiA9PT0gJ3JlamVjdCcpIHtcclxuICAgICAgICAgICAgICBjaGF0VXJsICs9ICcmdHlwZT1yZWplY3QnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhY3Rpb25EYXRhID0geyBhY3Rpb246IGFjdGlvbiwgY2hhdElkOiBjaGF0SWQgfTtcclxuICAgICAgICAgICAgY29uc3QgYWN0aW9uRGF0YVJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG5ldyBCbG9iKFtKU09OLnN0cmluZ2lmeShhY3Rpb25EYXRhKV0sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nIH0pKTtcclxuICAgICAgICAgICAgY2FjaGVzLm9wZW4oJ2FjdGlvbi1kYXRhJykudGhlbihjYWNoZSA9PiBjYWNoZS5wdXQoJ2N1cnJlbnQtYWN0aW9uLWRhdGEnLCBhY3Rpb25EYXRhUmVzcG9uc2UpKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjbGllbnRzLm9wZW5XaW5kb3coY2hhdFVybCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBjaGF0VXJsID0gY2hhdElkID8gYCR7cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQkFTRV9VUkx9L2NoYXQvJHtjaGF0SWR9P3NvdXJjZT1wdXNoYCA6IGAke3Byb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0JBU0VfVVJMfS9jaGF0YDtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWVudHMub3BlbldpbmRvdyhjaGF0VXJsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gY2xpZW50cy5vcGVuV2luZG93KGAke3Byb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0JBU0VfVVJMfS9jaGF0YCk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgKTtcclxufSk7XHJcblxyXG4iXSwibmFtZXMiOlsic2VsZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImRhdGEiLCJqc29uIiwiY2hhdElkIiwiY2hhdERhdGFSZXNwb25zZSIsIlJlc3BvbnNlIiwiQmxvYiIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0eXBlIiwid2FpdFVudGlsIiwiY2FjaGVzIiwib3BlbiIsInRoZW4iLCJjYWNoZSIsInB1dCIsImNsaWVudHMiLCJtYXRjaEFsbCIsImluY2x1ZGVVbmNvbnRyb2xsZWQiLCJpc0NoYXRPcGVuIiwiY2hhdFVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19CQVNFX1VSTCIsImNsaWVudCIsInVybCIsImluY2x1ZGVzIiwiZm9jdXMiLCJ0aXRsZSIsInVzZXJJY29uIiwib3B0aW9ucyIsImJvZHkiLCJpY29uIiwiYmFkZ2UiLCJzb3VuZCIsInRhZyIsInJlbm90aWZ5IiwiYWN0aW9ucyIsImFjdGlvbiIsInJlZ2lzdHJhdGlvbiIsInNob3dOb3RpZmljYXRpb24iLCJub3RpZmljYXRpb24iLCJjbG9zZSIsIm1hdGNoIiwicmVzcG9uc2UiLCJhY3Rpb25EYXRhIiwiYWN0aW9uRGF0YVJlc3BvbnNlIiwib3BlbldpbmRvdyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./worker/index.js\n"));

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