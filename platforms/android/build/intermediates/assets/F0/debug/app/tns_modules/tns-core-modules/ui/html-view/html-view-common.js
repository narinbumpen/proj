var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var view = require("ui/core/view");
var HtmlView = (function (_super) {
    __extends(HtmlView, _super);
    function HtmlView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(HtmlView.prototype, "html", {
        get: function () {
            return this._getValue(HtmlView.htmlProperty);
        },
        set: function (value) {
            this._setValue(HtmlView.htmlProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    return HtmlView;
}(view.View));
HtmlView.htmlProperty = new dependencyObservable.Property("html", "HtmlView", new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.AffectsLayout));
exports.HtmlView = HtmlView;
//# sourceMappingURL=html-view-common.js.map