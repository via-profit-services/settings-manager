module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 981:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.seed = void 0;
const uuid_1 = __webpack_require__(231);
var Category;
(function (Category) {
    Category["general"] = "general";
    Category["ui"] = "ui";
    Category["contact"] = "contact";
    Category["constraint"] = "constraint";
    Category["currency"] = "currency";
    Category["size"] = "size";
    Category["label"] = "label";
    Category["other"] = "other";
})(Category || (Category = {}));
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex('settings').del()
            .then(() => {
            const settings = [
                {
                    group: 'layout',
                    category: Category.ui,
                    name: 'theme',
                    value: 'light',
                    comment: 'Theme name for specified account',
                },
                {
                    group: 'layout',
                    category: Category.ui,
                    name: 'menu',
                    value: true,
                    comment: 'Display Main Menu for specified account',
                },
                {
                    group: 'layout',
                    category: Category.ui,
                    name: 'fontSize',
                    value: 12,
                    comment: 'Interface font size',
                },
            ];
            return knex('settings').insert(settings.map((settingsField) => (Object.assign(Object.assign({}, settingsField), { id: uuid_1.v4(), value: JSON.stringify(settingsField.value) }))));
        });
    });
}
exports.seed = seed;


/***/ }),

/***/ 231:
/***/ ((module) => {

module.exports = require("uuid");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(981);
/******/ })()
;