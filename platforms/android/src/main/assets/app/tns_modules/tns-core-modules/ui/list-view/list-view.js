var observable = require("data/observable");
var common = require("./list-view-common");
var stackLayout = require("ui/layouts/stack-layout");
var proxy_view_container_1 = require("ui/proxy-view-container");
var layoutBase = require("ui/layouts/layout-base");
var style_1 = require("ui/styling/style");
var color;
function ensureColor() {
    if (!color) {
        color = require("color");
    }
}
var ITEMLOADING = common.ListView.itemLoadingEvent;
var LOADMOREITEMS = common.ListView.loadMoreItemsEvent;
var ITEMTAP = common.ListView.itemTapEvent;
global.moduleMerge(common, exports);
function onSeparatorColorPropertyChanged(data) {
    var listView = data.object;
    if (!listView.android) {
        return;
    }
    ensureColor();
    if (data.newValue instanceof color.Color) {
        listView.android.setDivider(new android.graphics.drawable.ColorDrawable(data.newValue.android));
        listView.android.setDividerHeight(1);
    }
}
common.ListView.separatorColorProperty.metadata.onSetNativeValue = onSeparatorColorPropertyChanged;
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._androidViewId = -1;
        _this._realizedItems = new Map();
        _this._realizedTemplates = new Map();
        return _this;
    }
    ListView.prototype._createUI = function () {
        this._android = new android.widget.ListView(this._context);
        this._android.setDescendantFocusability(android.view.ViewGroup.FOCUS_AFTER_DESCENDANTS);
        this._android.setCacheColorHint(android.graphics.Color.TRANSPARENT);
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        this._android.setId(this._androidViewId);
        ensureListViewAdapterClass();
        this.android.setAdapter(new ListViewAdapterClass(this));
        var that = new WeakRef(this);
        this.android.setOnItemClickListener(new android.widget.AdapterView.OnItemClickListener({
            onItemClick: function (parent, convertView, index, id) {
                var owner = that.get();
                if (owner) {
                    var view = owner._realizedTemplates.get(owner._getItemTemplate(index).key).get(convertView);
                    owner.notify({ eventName: ITEMTAP, object: owner, index: index, view: view });
                }
            }
        }));
    };
    Object.defineProperty(ListView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.refresh = function () {
        if (!this._android || !this._android.getAdapter()) {
            return;
        }
        this._realizedItems.forEach(function (view, nativeView, map) {
            if (!(view.bindingContext instanceof observable.Observable)) {
                view.bindingContext = null;
            }
        });
        this.android.getAdapter().notifyDataSetChanged();
    };
    ListView.prototype.scrollToIndex = function (index) {
        if (this._android) {
            this._android.setSelection(index);
        }
    };
    ListView.prototype._onDetached = function (force) {
        _super.prototype._onDetached.call(this, force);
        this.clearRealizedCells();
    };
    Object.defineProperty(ListView.prototype, "_childrenCount", {
        get: function () {
            return this._realizedItems.size;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype._eachChildView = function (callback) {
        this._realizedItems.forEach(function (view, nativeView, map) {
            if (view.parent instanceof ListView) {
                callback(view);
            }
            else {
                if (view.parent) {
                    callback(view.parent);
                }
            }
        });
    };
    ListView.prototype._dumpRealizedTemplates = function () {
        console.log("Realized Templates:");
        this._realizedTemplates.forEach(function (value, index, map) {
            console.log("\t" + index + ":");
            value.forEach(function (value, index, map) {
                console.log("\t\t" + index.hashCode() + ": " + value);
            });
        });
        console.log("Realized Items Size: " + this._realizedItems.size);
    };
    ListView.prototype.clearRealizedCells = function () {
        var _this = this;
        this._realizedItems.forEach(function (view, nativeView, map) {
            if (view.parent) {
                if (!(view.parent instanceof ListView)) {
                    _this._removeView(view.parent);
                }
                view.parent._removeView(view);
            }
        });
        this._realizedItems.clear();
        this._realizedTemplates.clear();
    };
    ListView.prototype._onItemTemplatesPropertyChanged = function (data) {
        this._itemTemplatesInternal = new Array(this._defaultTemplate);
        if (data.newValue) {
            this._itemTemplatesInternal = this._itemTemplatesInternal.concat(data.newValue);
        }
        if (this.android) {
            ensureListViewAdapterClass();
            this.android.setAdapter(new ListViewAdapterClass(this));
        }
        this.refresh();
    };
    return ListView;
}(common.ListView));
exports.ListView = ListView;
var ListViewAdapterClass;
function ensureListViewAdapterClass() {
    if (ListViewAdapterClass) {
        return;
    }
    var ListViewAdapter = (function (_super) {
        __extends(ListViewAdapter, _super);
        function ListViewAdapter(listView) {
            var _this = _super.call(this) || this;
            _this._listView = listView;
            return global.__native(_this);
        }
        ListViewAdapter.prototype.getCount = function () {
            return this._listView && this._listView.items && this._listView.items.length ? this._listView.items.length : 0;
        };
        ListViewAdapter.prototype.getItem = function (i) {
            if (this._listView && this._listView.items && i < this._listView.items.length) {
                return this._listView.items.getItem ? this._listView.items.getItem(i) : this._listView.items[i];
            }
            return null;
        };
        ListViewAdapter.prototype.getItemId = function (i) {
            return long(i);
        };
        ListViewAdapter.prototype.hasStableIds = function () {
            return true;
        };
        ListViewAdapter.prototype.getViewTypeCount = function () {
            return this._listView._itemTemplatesInternal.length;
        };
        ListViewAdapter.prototype.getItemViewType = function (index) {
            var template = this._listView._getItemTemplate(index);
            var itemViewType = this._listView._itemTemplatesInternal.indexOf(template);
            return itemViewType;
        };
        ListViewAdapter.prototype.getView = function (index, convertView, parent) {
            if (!this._listView) {
                return null;
            }
            var totalItemCount = this._listView.items ? this._listView.items.length : 0;
            if (index === (totalItemCount - 1)) {
                this._listView.notify({ eventName: LOADMOREITEMS, object: this._listView });
            }
            var template = this._listView._getItemTemplate(index);
            var view;
            if (convertView) {
                view = this._listView._realizedTemplates.get(template.key).get(convertView);
                if (!view) {
                    throw new Error("There is no entry with key '" + convertView + "' in the realized views cache for template with key'" + template.key + "'.");
                }
            }
            else {
                view = template.createView();
            }
            var args = {
                eventName: ITEMLOADING, object: this._listView, index: index, view: view,
                android: parent,
                ios: undefined
            };
            this._listView.notify(args);
            if (!args.view) {
                args.view = this._listView._getDefaultItemContent(index);
            }
            if (args.view) {
                if (this._listView.rowHeight > -1) {
                    args.view.height = this._listView.rowHeight;
                }
                else {
                    args.view.height = Number.NaN;
                }
                this._listView._prepareItem(args.view, index);
                if (!args.view.parent) {
                    if (args.view instanceof layoutBase.LayoutBase &&
                        !(args.view instanceof proxy_view_container_1.ProxyViewContainer)) {
                        this._listView._addView(args.view);
                        convertView = args.view.android;
                    }
                    else {
                        var sp = new stackLayout.StackLayout();
                        sp.addChild(args.view);
                        this._listView._addView(sp);
                        convertView = sp.android;
                    }
                }
                var realizedItemsForTemplateKey = this._listView._realizedTemplates.get(template.key);
                if (!realizedItemsForTemplateKey) {
                    realizedItemsForTemplateKey = new Map();
                    this._listView._realizedTemplates.set(template.key, realizedItemsForTemplateKey);
                }
                realizedItemsForTemplateKey.set(convertView, args.view);
                this._listView._realizedItems.set(convertView, args.view);
            }
            return convertView;
        };
        return ListViewAdapter;
    }(android.widget.BaseAdapter));
    ListViewAdapterClass = ListViewAdapter;
}
var ListViewStyler = (function () {
    function ListViewStyler() {
    }
    ListViewStyler.getSeparatorColorProperty = function (view) {
        var listView = view._nativeView;
        return listView.getDivider();
    };
    ListViewStyler.setSeparatorColorProperty = function (view, newValue) {
        var listView = view._nativeView;
        if (newValue instanceof android.graphics.drawable.Drawable) {
            listView.setDivider(newValue);
        }
        else {
            listView.setDivider(new android.graphics.drawable.ColorDrawable(newValue));
        }
        listView.setDividerHeight(1);
    };
    ListViewStyler.resetSeparatorColorProperty = function (view, nativeValue) {
        var listView = view._nativeView;
        if (nativeValue instanceof android.graphics.drawable.Drawable) {
            listView.setDivider(nativeValue);
        }
        else {
            listView.setDivider(new android.graphics.drawable.ColorDrawable(nativeValue));
        }
    };
    ListViewStyler.registerHandlers = function () {
        style_1.registerHandler(style_1.separatorColorProperty, new style_1.StylePropertyChangedHandler(ListViewStyler.setSeparatorColorProperty, ListViewStyler.resetSeparatorColorProperty, ListViewStyler.getSeparatorColorProperty), "ListView");
    };
    return ListViewStyler;
}());
exports.ListViewStyler = ListViewStyler;
ListViewStyler.registerHandlers();
//# sourceMappingURL=list-view.js.map