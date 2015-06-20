var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var objects;
(function (objects) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(labelText, x, y, centered) {
            _super.call(this, labelText, config.FONT_SMALL + " " + config.FONT_FAMILY, config.BLACK);
            if (centered) {
                this.regX = this.getMeasuredWidth() * 0.5;
                this.regY = this.getMeasuredHeight() * 0.5;
            }
            this.x = x;
            this.y = y;
        }
        return Label;
    })(createjs.Text);
    objects.Label = Label;
})(objects || (objects = {}));
//# sourceMappingURL=label.js.map