var common = require("./text-base-common");
var types = require("utils/types");
var TextBase = (function (_super) {
    __extends(TextBase, _super);
    function TextBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextBase.prototype._onTextPropertyChanged = function (data) {
        if (this.android) {
            var newValue = types.toUIString(data.newValue);
            this.android.setText(newValue);
        }
    };
    TextBase.prototype._setFormattedTextPropertyToNative = function (value) {
        var newText = value ? value._formattedText : null;
        if (this.android) {
            this.android.setText(newText);
        }
    };
    return TextBase;
}(common.TextBase));
exports.TextBase = TextBase;
//# sourceMappingURL=text-base.js.map