"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("./bootstrap");
var react_1 = __importDefault(require("react"));
var react_dom_1 = require("react-dom");
var inertia_react_1 = require("@inertiajs/inertia-react");
var progress_1 = require("@inertiajs/progress");
var appName = ((_a = window.document.getElementsByTagName('title')[0]) === null || _a === void 0 ? void 0 : _a.innerText) || 'Laravel';
(0, inertia_react_1.createInertiaApp)({
    title: function (title) { return title + " - " + appName; },
    resolve: function (name) { return require("./pages/" + name); },
    setup: function (_a) {
        var el = _a.el, App = _a.App, props = _a.props;
        return (0, react_dom_1.render)(react_1.default.createElement(App, __assign({}, props)), el);
    },
});
progress_1.InertiaProgress.init({ color: '#7CAA63' });
