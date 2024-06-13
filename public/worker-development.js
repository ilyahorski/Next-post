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

eval(__webpack_require__.ts("self.addEventListener(\"push\", function(event) {\n    let data = {};\n    if (event.data) {\n        data = event.data.json();\n    }\n    // Сохранение chatId в localStorage\n    if (data.chatId) {\n        localStorage.setItem(\"chatId\", data.chatId);\n    }\n    const title = data.title || \"Default title\";\n    const userIcon = data.userIcon;\n    const options = {\n        body: data.body || \"Default body\",\n        icon: userIcon,\n        badge: \"/assets/email.png\",\n        sound: \"/assets/notif.mp3\",\n        tag: \"new-offers\"\n    };\n    event.waitUntil(self.registration.showNotification(title, options));\n});\nself.addEventListener(\"notificationclick\", function(event) {\n    event.notification.close();\n    // Извлечение chatId из localStorage\n    const chatId = localStorage.getItem(\"chatId\");\n    const chatUrl = chatId ? \"\".concat(\"http://localhost:3000\", \"/chat/\").concat(chatId) : \"\".concat(\"http://localhost:3000\", \"/chat\");\n    event.waitUntil(clients.openWindow(chatUrl));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi93b3JrZXIvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUFBLEtBQUtDLGdCQUFnQixDQUFDLFFBQVEsU0FBU0MsS0FBSztJQUMxQyxJQUFJQyxPQUFPLENBQUM7SUFDWixJQUFJRCxNQUFNQyxJQUFJLEVBQUU7UUFDZEEsT0FBT0QsTUFBTUMsSUFBSSxDQUFDQyxJQUFJO0lBQ3hCO0lBRUEsbUNBQW1DO0lBQ25DLElBQUlELEtBQUtFLE1BQU0sRUFBRTtRQUNmQyxhQUFhQyxPQUFPLENBQUMsVUFBVUosS0FBS0UsTUFBTTtJQUM1QztJQUVBLE1BQU1HLFFBQVFMLEtBQUtLLEtBQUssSUFBSTtJQUM1QixNQUFNQyxXQUFXTixLQUFLTSxRQUFRO0lBQzlCLE1BQU1DLFVBQVU7UUFDZEMsTUFBTVIsS0FBS1EsSUFBSSxJQUFJO1FBQ25CQyxNQUFNSDtRQUNOSSxPQUFPO1FBQ1BDLE9BQU87UUFDUEMsS0FBSztJQUNQO0lBRUFiLE1BQU1jLFNBQVMsQ0FDYmhCLEtBQUtpQixZQUFZLENBQUNDLGdCQUFnQixDQUFDVixPQUFPRTtBQUU5QztBQUVBVixLQUFLQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsU0FBU0MsS0FBSztJQUN2REEsTUFBTWlCLFlBQVksQ0FBQ0MsS0FBSztJQUV4QixvQ0FBb0M7SUFDcEMsTUFBTWYsU0FBU0MsYUFBYWUsT0FBTyxDQUFDO0lBQ3BDLE1BQU1DLFVBQVVqQixTQUFTLEdBQTRDQSxPQUF6Q2tCLHVCQUFnQyxFQUFDLFVBQWUsT0FBUGxCLFVBQVcsR0FBb0MsT0FBakNrQix1QkFBZ0MsRUFBQztJQUVwSHJCLE1BQU1jLFNBQVMsQ0FDYlUsUUFBUUMsVUFBVSxDQUFDTDtBQUV2QiIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi93b3JrZXIvaW5kZXguanM/ODA1ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ3B1c2gnLCBmdW5jdGlvbihldmVudCkge1xyXG4gIGxldCBkYXRhID0ge307XHJcbiAgaWYgKGV2ZW50LmRhdGEpIHtcclxuICAgIGRhdGEgPSBldmVudC5kYXRhLmpzb24oKTtcclxuICB9XHJcblxyXG4gIC8vINCh0L7RhdGA0LDQvdC10L3QuNC1IGNoYXRJZCDQsiBsb2NhbFN0b3JhZ2VcclxuICBpZiAoZGF0YS5jaGF0SWQpIHtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjaGF0SWQnLCBkYXRhLmNoYXRJZCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCB0aXRsZSA9IGRhdGEudGl0bGUgfHwgJ0RlZmF1bHQgdGl0bGUnO1xyXG4gIGNvbnN0IHVzZXJJY29uID0gZGF0YS51c2VySWNvbjtcclxuICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgYm9keTogZGF0YS5ib2R5IHx8ICdEZWZhdWx0IGJvZHknLFxyXG4gICAgaWNvbjogdXNlckljb24sXHJcbiAgICBiYWRnZTogJy9hc3NldHMvZW1haWwucG5nJyxcclxuICAgIHNvdW5kOiAnL2Fzc2V0cy9ub3RpZi5tcDMnLFxyXG4gICAgdGFnOiAnbmV3LW9mZmVycycsXHJcbiAgfTtcclxuXHJcbiAgZXZlbnQud2FpdFVudGlsKFxyXG4gICAgc2VsZi5yZWdpc3RyYXRpb24uc2hvd05vdGlmaWNhdGlvbih0aXRsZSwgb3B0aW9ucylcclxuICApO1xyXG59KTtcclxuXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbm90aWZpY2F0aW9uY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gIGV2ZW50Lm5vdGlmaWNhdGlvbi5jbG9zZSgpO1xyXG5cclxuICAvLyDQmNC30LLQu9C10YfQtdC90LjQtSBjaGF0SWQg0LjQtyBsb2NhbFN0b3JhZ2VcclxuICBjb25zdCBjaGF0SWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2hhdElkJyk7XHJcbiAgY29uc3QgY2hhdFVybCA9IGNoYXRJZCA/IGAke3Byb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0JBU0VfVVJMfS9jaGF0LyR7Y2hhdElkfWAgOiBgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19CQVNFX1VSTH0vY2hhdGA7XHJcbiAgXHJcbiAgZXZlbnQud2FpdFVudGlsKFxyXG4gICAgY2xpZW50cy5vcGVuV2luZG93KGNoYXRVcmwpXHJcbiAgKTtcclxufSk7XHJcblxyXG4iXSwibmFtZXMiOlsic2VsZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImRhdGEiLCJqc29uIiwiY2hhdElkIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsInRpdGxlIiwidXNlckljb24iLCJvcHRpb25zIiwiYm9keSIsImljb24iLCJiYWRnZSIsInNvdW5kIiwidGFnIiwid2FpdFVudGlsIiwicmVnaXN0cmF0aW9uIiwic2hvd05vdGlmaWNhdGlvbiIsIm5vdGlmaWNhdGlvbiIsImNsb3NlIiwiZ2V0SXRlbSIsImNoYXRVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfQkFTRV9VUkwiLCJjbGllbnRzIiwib3BlbldpbmRvdyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./worker/index.js\n"));

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