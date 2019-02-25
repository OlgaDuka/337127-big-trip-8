/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/event.js":
/*!**********************!*\
  !*** ./src/event.js ***!
  \**********************/
/*! exports provided: boardEvents, renderEvents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "boardEvents", function() { return boardEvents; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderEvents", function() { return renderEvents; });
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/index.js */ "./src/utils/index.js");


const boardEvents = document.querySelector(`.trip-day__items`);

const getHtmlEvent = () => {
  return `<article class="trip-point">
            <i class="trip-icon">🚕</i>
            <h3 class="trip-point__title">Taxi to Airport</h3>
            <p class="trip-point__schedule">
              <span class="trip-point__timetable">10:00&nbsp;&mdash; 11:00</span>
              <span class="trip-point__duration">1h 30m</span>
            </p>
            <p class="trip-point__price">&euro;&nbsp;${Object(_utils_index_js__WEBPACK_IMPORTED_MODULE_0__["getRandomInRange"])(_utils_index_js__WEBPACK_IMPORTED_MODULE_0__["Price"].MIN_PRICE_EVENT, _utils_index_js__WEBPACK_IMPORTED_MODULE_0__["Price"].MAX_PRICE_EVENT)}</p>
            <ul class="trip-point__offers">
              <li>
                <button class="trip-point__offer">Order UBER +&euro;&nbsp;${Object(_utils_index_js__WEBPACK_IMPORTED_MODULE_0__["getRandomInRange"])(_utils_index_js__WEBPACK_IMPORTED_MODULE_0__["Price"].MIN_PRICE_SERVICE, _utils_index_js__WEBPACK_IMPORTED_MODULE_0__["Price"].MAX_PRICE_SERVICE)}</button>
              </li>
              <li>
                <button class="trip-point__offer">Upgrade to business +&euro;&nbsp;${Object(_utils_index_js__WEBPACK_IMPORTED_MODULE_0__["getRandomInRange"])(_utils_index_js__WEBPACK_IMPORTED_MODULE_0__["Price"].MIN_PRICE_SERVICE, _utils_index_js__WEBPACK_IMPORTED_MODULE_0__["Price"].MAX_PRICE_SERVICE)}</button>
              </li>
            </ul>
          </article>`;
};

const renderEvents = (num) => {
  for (let i = 0; i < num; i += 1) {
    boardEvents.insertAdjacentHTML(`beforeend`, getHtmlEvent());
  }
};


/***/ }),

/***/ "./src/filter.js":
/*!***********************!*\
  !*** ./src/filter.js ***!
  \***********************/
/*! exports provided: formFilter, renderFilters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formFilter", function() { return formFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderFilters", function() { return renderFilters; });
const formFilter = document.querySelector(`.trip-filter`);

const getHtmlFilter = (nameFilter) => {
  return `<input type="radio" id="filter-${nameFilter}" name="filter" value="${nameFilter}" checked>
          <label class="trip-filter__item" for="filter-${nameFilter}">${nameFilter}</label>`;
};

const renderFilters = (arrFilters) => {
  arrFilters.forEach(function (element) {
    formFilter.insertAdjacentHTML(`beforeend`, getHtmlFilter(element));
  });
};


/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/index.js */ "./src/utils/index.js");
/* harmony import */ var _event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event.js */ "./src/event.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filter.js */ "./src/filter.js");





const toggleFilter = (event) => {
  _filter_js__WEBPACK_IMPORTED_MODULE_2__["formFilter"].querySelector(`input:checked`).checked = false;
  event.target.checked = true;
};

Object(_filter_js__WEBPACK_IMPORTED_MODULE_2__["renderFilters"])(_utils_index_js__WEBPACK_IMPORTED_MODULE_0__["NAME_EVENTS"]);
Object(_event_js__WEBPACK_IMPORTED_MODULE_1__["renderEvents"])(_utils_index_js__WEBPACK_IMPORTED_MODULE_0__["NumConst"].START_EVENTS);

_filter_js__WEBPACK_IMPORTED_MODULE_2__["formFilter"].onclick = (event) => {
  if (event.target.className === `trip-filter__item` && !event.target.previousElementSibling.disabled) {
    toggleFilter(event);
    _event_js__WEBPACK_IMPORTED_MODULE_1__["boardEvents"].innerHTML = ``;
    Object(_event_js__WEBPACK_IMPORTED_MODULE_1__["renderEvents"])(Object(_utils_index_js__WEBPACK_IMPORTED_MODULE_0__["getRandomInRange"])(0, _utils_index_js__WEBPACK_IMPORTED_MODULE_0__["NumConst"].MAX_EVENT_IN_FILTER));
  }
};


/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/*! exports provided: NumConst, Price, NAME_EVENTS, getRandomInRange */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NumConst", function() { return NumConst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Price", function() { return Price; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NAME_EVENTS", function() { return NAME_EVENTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRandomInRange", function() { return getRandomInRange; });
const NumConst = {
  MAX_EVENT_IN_FILTER: 10,
  START_EVENTS: 7
};

const Price = {
  MIN_PRICE_EVENT: 20,
  MAX_PRICE_EVENT: 100,
  MIN_PRICE_SERVICE: 10,
  MAX_PRICE_SERVICE: 200
};

const NAME_EVENTS = [`everything`, `future`, `past`];

const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map