var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var textBase = require("ui/text-base");
var editableTextBase = require("ui/editable-text-base");
exports.secureProperty = new dependencyObservable.Property("secure", "TextField", new proxy.PropertyMetadata(false));
global.moduleMerge(textBase, exports);
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TextField.prototype, "secure", {
        get: function () {
            return this._getValue(exports.secureProperty);
        },
        set: function (value) {
            this._setValue(exports.secureProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    return TextField;
}(editableTextBase.EditableTextBase));
TextField.returnPressEvent = "returnPress";
exports.TextField = TextField;
//# sourceMappingURL=text-field-common.js.map