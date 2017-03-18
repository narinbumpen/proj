var textBase = require("ui/text-base");
var editableTextBase = require("ui/editable-text-base");
global.moduleMerge(textBase, exports);
var TextView = (function (_super) {
    __extends(TextView, _super);
    function TextView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TextView;
}(editableTextBase.EditableTextBase));
exports.TextView = TextView;
//# sourceMappingURL=text-view-common.js.map