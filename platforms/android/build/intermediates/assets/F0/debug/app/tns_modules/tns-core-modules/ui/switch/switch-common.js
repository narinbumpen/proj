var view = require("ui/core/view");
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var Switch = (function (_super) {
    __extends(Switch, _super);
    function Switch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Switch.prototype, "checked", {
        get: function () {
            return this._getValue(Switch.checkedProperty);
        },
        set: function (value) {
            this._setValue(Switch.checkedProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    return Switch;
}(view.View));
Switch.checkedProperty = new dependencyObservable.Property("checked", "Switch", new proxy.PropertyMetadata(false));
exports.Switch = Switch;
//# sourceMappingURL=switch-common.js.map