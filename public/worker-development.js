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

eval(__webpack_require__.ts("self.addEventListener(\"push\", function(event) {\n    let data = {};\n    if (event.data) {\n        data = event.data.json();\n    }\n    if (data.chatId) {\n        const chatIdData = new Response(new Blob([\n            data.chatId\n        ], {\n            type: \"text/plain\"\n        }));\n        event.waitUntil(caches.open(\"chat-ids\").then((cache)=>cache.put(\"current-chat-id\", chatIdData)));\n    }\n    const title = data.title || \"New message from Next Post\";\n    const userIcon = data.userIcon;\n    const options = {\n        body: data.body || \"Click to open chat\",\n        icon: userIcon,\n        badge: \"/assets/email.png\",\n        sound: \"/assets/notif.mp3\",\n        tag: \"renotify\",\n        renotify: true\n    };\n    event.waitUntil(self.registration.showNotification(title, options));\n});\nself.addEventListener(\"notificationclick\", function(event) {\n    event.notification.close();\n    event.waitUntil(caches.open(\"chat-ids\").then((cache)=>cache.match(\"current-chat-id\")).then((response)=>{\n        if (response) {\n            return response.text().then((chatId)=>{\n                const chatUrl = chatId ? \"\".concat(\"https://next-post-two.vercel.app\", \"/chat/\").concat(chatId) : \"\".concat(\"https://next-post-two.vercel.app\", \"/chat\");\n                return clients.openWindow(chatUrl);\n            });\n        } else {\n            return clients.openWindow(\"\".concat(\"https://next-post-two.vercel.app\", \"/chat\"));\n        }\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi93b3JrZXIvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUFBLEtBQUtDLGdCQUFnQixDQUFDLFFBQVEsU0FBU0MsS0FBSztJQUMxQyxJQUFJQyxPQUFPLENBQUM7SUFDWixJQUFJRCxNQUFNQyxJQUFJLEVBQUU7UUFDZEEsT0FBT0QsTUFBTUMsSUFBSSxDQUFDQyxJQUFJO0lBQ3hCO0lBRUEsSUFBSUQsS0FBS0UsTUFBTSxFQUFFO1FBQ2YsTUFBTUMsYUFBYSxJQUFJQyxTQUFTLElBQUlDLEtBQUs7WUFBQ0wsS0FBS0UsTUFBTTtTQUFDLEVBQUU7WUFBRUksTUFBTTtRQUFhO1FBQzdFUCxNQUFNUSxTQUFTLENBQUNDLE9BQU9DLElBQUksQ0FBQyxZQUFZQyxJQUFJLENBQUNDLENBQUFBLFFBQVNBLE1BQU1DLEdBQUcsQ0FBQyxtQkFBbUJUO0lBQ3JGO0lBRUEsTUFBTVUsUUFBUWIsS0FBS2EsS0FBSyxJQUFJO0lBQzVCLE1BQU1DLFdBQVdkLEtBQUtjLFFBQVE7SUFDOUIsTUFBTUMsVUFBVTtRQUNkQyxNQUFNaEIsS0FBS2dCLElBQUksSUFBSTtRQUNuQkMsTUFBTUg7UUFDTkksT0FBTztRQUNQQyxPQUFPO1FBQ1BDLEtBQUs7UUFDTEMsVUFBVTtJQUNaO0lBRUF0QixNQUFNUSxTQUFTLENBQ2JWLEtBQUt5QixZQUFZLENBQUNDLGdCQUFnQixDQUFDVixPQUFPRTtBQUU5QztBQUVBbEIsS0FBS0MsZ0JBQWdCLENBQUMscUJBQXFCLFNBQVNDLEtBQUs7SUFDdkRBLE1BQU15QixZQUFZLENBQUNDLEtBQUs7SUFFeEIxQixNQUFNUSxTQUFTLENBQ2JDLE9BQU9DLElBQUksQ0FBQyxZQUFZQyxJQUFJLENBQUNDLENBQUFBLFFBQVNBLE1BQU1lLEtBQUssQ0FBQyxvQkFBb0JoQixJQUFJLENBQUNpQixDQUFBQTtRQUN6RSxJQUFJQSxVQUFVO1lBQ1osT0FBT0EsU0FBU0MsSUFBSSxHQUFHbEIsSUFBSSxDQUFDUixDQUFBQTtnQkFDMUIsTUFBTTJCLFVBQVUzQixTQUFTLEdBQTRDQSxPQUF6QzRCLGtDQUFnQyxFQUFDLFVBQWUsT0FBUDVCLFVBQVcsR0FBb0MsT0FBakM0QixrQ0FBZ0MsRUFBQztnQkFDcEgsT0FBT0csUUFBUUMsVUFBVSxDQUFDTDtZQUM1QjtRQUNGLE9BQU87WUFDTCxPQUFPSSxRQUFRQyxVQUFVLENBQUMsR0FBb0MsT0FBakNKLGtDQUFnQyxFQUFDO1FBQ2hFO0lBQ0Y7QUFFSiIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi93b3JrZXIvaW5kZXguanM/ODA1ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ3B1c2gnLCBmdW5jdGlvbihldmVudCkge1xyXG4gIGxldCBkYXRhID0ge307XHJcbiAgaWYgKGV2ZW50LmRhdGEpIHtcclxuICAgIGRhdGEgPSBldmVudC5kYXRhLmpzb24oKTtcclxuICB9XHJcblxyXG4gIGlmIChkYXRhLmNoYXRJZCkge1xyXG4gICAgY29uc3QgY2hhdElkRGF0YSA9IG5ldyBSZXNwb25zZShuZXcgQmxvYihbZGF0YS5jaGF0SWRdLCB7IHR5cGU6ICd0ZXh0L3BsYWluJyB9KSk7XHJcbiAgICBldmVudC53YWl0VW50aWwoY2FjaGVzLm9wZW4oJ2NoYXQtaWRzJykudGhlbihjYWNoZSA9PiBjYWNoZS5wdXQoJ2N1cnJlbnQtY2hhdC1pZCcsIGNoYXRJZERhdGEpKSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCB0aXRsZSA9IGRhdGEudGl0bGUgfHwgJ05ldyBtZXNzYWdlIGZyb20gTmV4dCBQb3N0JztcclxuICBjb25zdCB1c2VySWNvbiA9IGRhdGEudXNlckljb247XHJcbiAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgIGJvZHk6IGRhdGEuYm9keSB8fCAnQ2xpY2sgdG8gb3BlbiBjaGF0JyxcclxuICAgIGljb246IHVzZXJJY29uLFxyXG4gICAgYmFkZ2U6ICcvYXNzZXRzL2VtYWlsLnBuZycsXHJcbiAgICBzb3VuZDogJy9hc3NldHMvbm90aWYubXAzJyxcclxuICAgIHRhZzogJ3Jlbm90aWZ5JyxcclxuICAgIHJlbm90aWZ5OiB0cnVlLFxyXG4gIH07XHJcblxyXG4gIGV2ZW50LndhaXRVbnRpbChcclxuICAgIHNlbGYucmVnaXN0cmF0aW9uLnNob3dOb3RpZmljYXRpb24odGl0bGUsIG9wdGlvbnMpXHJcbiAgKTtcclxufSk7XHJcblxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ25vdGlmaWNhdGlvbmNsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICBldmVudC5ub3RpZmljYXRpb24uY2xvc2UoKTtcclxuXHJcbiAgZXZlbnQud2FpdFVudGlsKFxyXG4gICAgY2FjaGVzLm9wZW4oJ2NoYXQtaWRzJykudGhlbihjYWNoZSA9PiBjYWNoZS5tYXRjaCgnY3VycmVudC1jaGF0LWlkJykpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICBpZiAocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4oY2hhdElkID0+IHtcclxuICAgICAgICAgIGNvbnN0IGNoYXRVcmwgPSBjaGF0SWQgPyBgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19CQVNFX1VSTH0vY2hhdC8ke2NoYXRJZH1gIDogYCR7cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQkFTRV9VUkx9L2NoYXRgO1xyXG4gICAgICAgICAgcmV0dXJuIGNsaWVudHMub3BlbldpbmRvdyhjaGF0VXJsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gY2xpZW50cy5vcGVuV2luZG93KGAke3Byb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0JBU0VfVVJMfS9jaGF0YCk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgKTtcclxufSk7XHJcblxyXG4iXSwibmFtZXMiOlsic2VsZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImRhdGEiLCJqc29uIiwiY2hhdElkIiwiY2hhdElkRGF0YSIsIlJlc3BvbnNlIiwiQmxvYiIsInR5cGUiLCJ3YWl0VW50aWwiLCJjYWNoZXMiLCJvcGVuIiwidGhlbiIsImNhY2hlIiwicHV0IiwidGl0bGUiLCJ1c2VySWNvbiIsIm9wdGlvbnMiLCJib2R5IiwiaWNvbiIsImJhZGdlIiwic291bmQiLCJ0YWciLCJyZW5vdGlmeSIsInJlZ2lzdHJhdGlvbiIsInNob3dOb3RpZmljYXRpb24iLCJub3RpZmljYXRpb24iLCJjbG9zZSIsIm1hdGNoIiwicmVzcG9uc2UiLCJ0ZXh0IiwiY2hhdFVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19CQVNFX1VSTCIsImNsaWVudHMiLCJvcGVuV2luZG93Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./worker/index.js\n"));

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