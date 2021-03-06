define(function() {

    /// Constructor:
    function Guid() {
        Object.defineProperties(this, {
            bytes: {
                value: (function rec(acc, i) {
                    return (0 > i || i > 31) ?
                        acc :
                        rec(acc.concat((Math.random() * 16 | 0)), i + 1);
                })([], 0)
            }
        });
    }

    /// `Static` formats:
    Guid.formats = [
        "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN",
        "NNNNNNNN-NNNN-NNNN-NNNN-NNNNNNNNNNNN",
        "{NNNNNNNN-NNNN-NNNN-NNNN-NNNNNNNNNNNN}",
        "(NNNNNNNN-NNNN-NNNN-NNNN-NNNNNNNNNNNN)",
        "{0xNNNNNNNN,0xNNNN,0xNNNN,{0xNN,0xNN,0xNN,0xNN,0xNN,0xNN,0xNN,0xNN}}"
    ];

    Guid.empty = (function(){
        var g = new Guid();
        for(var i = 0, max = g.bytes.length; i < max; i++) {
            g.bytes.pop();
        }
        g.bytes.push.apply(
            g.bytes,
            Guid.formats[0]
                .split("")
                .map(function (n) { return 0; }));
        return g;
    })();

    /// `Static` default format:
    Guid.defaultFormat = Guid.formats[1];

    Guid.prototype.toString = function Guid_toString(format) {
        var self = this;

        if (format === void 0 || format === null) {
            format = Guid.defaultFormat;
        } else {
            format = Guid.formats[format] || Guid.defaultFormat;
        }

        return (function() {
            var bs = self.bytes.slice(),
                maxi = format.length,
                result = [], i;

            if (format.split("N").length !== 33) {
                throw new Error("There has to be exactly 32 `N` in the format string.");
            }

            for (i = 0; i < maxi; i++) {
                if (format[i] === "N") {
                    result.push(bs.shift().toString(16));
                } else {
                    result.push(format[i]);
                }
            }

            return result.join("");
        })();
    };

    Guid.prototype.valueOf = function Guid_valueOf() {
        return this.toString(0);
    };

    Guid.prototype.equals = function Guid_equals(other) {
        return this.valueOf() === other.valueOf();
    };

    return Guid;
});
