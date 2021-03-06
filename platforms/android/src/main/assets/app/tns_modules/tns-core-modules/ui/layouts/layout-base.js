var common = require("./layout-base-common");
var LayoutBase = (function (_super) {
    __extends(LayoutBase, _super);
    function LayoutBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LayoutBase.prototype._onClipToBoundsChanged = function (oldValue, newValue) {
        console.warn("clipToBounds with value false is not supported on Android. You can use this.android.getParent().setClipChildren(false) as an alternative");
    };
    return LayoutBase;
}(common.LayoutBase));
exports.LayoutBase = LayoutBase;
//# sourceMappingURL=layout-base.js.map