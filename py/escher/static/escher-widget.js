var It = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Tt(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function _n(t) {
  if (Object.prototype.hasOwnProperty.call(t, "__esModule")) return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(n, r, i.get ? i : {
      enumerable: !0,
      get: function() {
        return t[r];
      }
    });
  }), n;
}
var Zr, Ss;
function sl() {
  if (Ss) return Zr;
  Ss = 1;
  function t(i) {
    var s = "    ";
    if (isNaN(parseInt(i)))
      s = i;
    else
      switch (i) {
        case 1:
          s = " ";
          break;
        case 2:
          s = "  ";
          break;
        case 3:
          s = "   ";
          break;
        case 4:
          s = "    ";
          break;
        case 5:
          s = "     ";
          break;
        case 6:
          s = "      ";
          break;
        case 7:
          s = "       ";
          break;
        case 8:
          s = "        ";
          break;
        case 9:
          s = "         ";
          break;
        case 10:
          s = "          ";
          break;
        case 11:
          s = "           ";
          break;
        case 12:
          s = "            ";
          break;
      }
    for (var a = [`
`], l = 0; l < 100; l++)
      a.push(a[l] + s);
    return a;
  }
  function e() {
    this.step = "    ", this.shift = t(this.step);
  }
  e.prototype.xml = function(i, s) {
    var a = i.replace(/>\s{0,}</g, "><").replace(/</g, "~::~<").replace(/\s*xmlns\:/g, "~::~xmlns:").replace(/\s*xmlns\=/g, "~::~xmlns=").split("~::~"), l = a.length, u = !1, f = 0, p = "", g = 0, _ = s ? t(s) : this.shift;
    for (g = 0; g < l; g++)
      a[g].search(/<!/) > -1 ? (p += _[f] + a[g], u = !0, (a[g].search(/-->/) > -1 || a[g].search(/\]>/) > -1 || a[g].search(/!DOCTYPE/) > -1) && (u = !1)) : a[g].search(/-->/) > -1 || a[g].search(/\]>/) > -1 ? (p += a[g], u = !1) : /^<\w/.exec(a[g - 1]) && /^<\/\w/.exec(a[g]) && /^<[\w:\-\.\,]+/.exec(a[g - 1]) == /^<\/[\w:\-\.\,]+/.exec(a[g])[0].replace("/", "") ? (p += a[g], u || f--) : a[g].search(/<\w/) > -1 && a[g].search(/<\//) == -1 && a[g].search(/\/>/) == -1 ? p = u ? p += a[g] : p += _[f++] + a[g] : a[g].search(/<\w/) > -1 && a[g].search(/<\//) > -1 ? p = u ? p += a[g] : p += _[f] + a[g] : a[g].search(/<\//) > -1 ? p = u ? p += a[g] : p += _[--f] + a[g] : a[g].search(/\/>/) > -1 ? p = u ? p += a[g] : p += _[f] + a[g] : a[g].search(/<\?/) > -1 || a[g].search(/xmlns\:/) > -1 || a[g].search(/xmlns\=/) > -1 ? p += _[f] + a[g] : p += a[g];
    return p[0] == `
` ? p.slice(1) : p;
  }, e.prototype.json = function(i, a) {
    var a = a || this.step;
    return typeof JSON > "u" ? i : typeof i == "string" ? JSON.stringify(JSON.parse(i), null, a) : typeof i == "object" ? JSON.stringify(i, null, a) : i;
  }, e.prototype.css = function(i, s) {
    var a = i.replace(/\s{1,}/g, " ").replace(/\{/g, "{~::~").replace(/\}/g, "~::~}~::~").replace(/\;/g, ";~::~").replace(/\/\*/g, "~::~/*").replace(/\*\//g, "*/~::~").replace(/~::~\s{0,}~::~/g, "~::~").split("~::~"), l = a.length, u = 0, f = "", p = 0, g = s ? t(s) : this.shift;
    for (p = 0; p < l; p++)
      /\{/.exec(a[p]) ? f += g[u++] + a[p] : /\}/.exec(a[p]) ? f += g[--u] + a[p] : (/\*\\/.exec(a[p]), f += g[u] + a[p]);
    return f.replace(/^\n{1,}/, "");
  };
  function n(i, s) {
    return s - (i.replace(/\(/g, "").length - i.replace(/\)/g, "").length);
  }
  function r(i, s) {
    return i.replace(/\s{1,}/g, " ").replace(/ AND /ig, "~::~" + s + s + "AND ").replace(/ BETWEEN /ig, "~::~" + s + "BETWEEN ").replace(/ CASE /ig, "~::~" + s + "CASE ").replace(/ ELSE /ig, "~::~" + s + "ELSE ").replace(/ END /ig, "~::~" + s + "END ").replace(/ FROM /ig, "~::~FROM ").replace(/ GROUP\s{1,}BY/ig, "~::~GROUP BY ").replace(/ HAVING /ig, "~::~HAVING ").replace(/ IN /ig, " IN ").replace(/ JOIN /ig, "~::~JOIN ").replace(/ CROSS~::~{1,}JOIN /ig, "~::~CROSS JOIN ").replace(/ INNER~::~{1,}JOIN /ig, "~::~INNER JOIN ").replace(/ LEFT~::~{1,}JOIN /ig, "~::~LEFT JOIN ").replace(/ RIGHT~::~{1,}JOIN /ig, "~::~RIGHT JOIN ").replace(/ ON /ig, "~::~" + s + "ON ").replace(/ OR /ig, "~::~" + s + s + "OR ").replace(/ ORDER\s{1,}BY/ig, "~::~ORDER BY ").replace(/ OVER /ig, "~::~" + s + "OVER ").replace(/\(\s{0,}SELECT /ig, "~::~(SELECT ").replace(/\)\s{0,}SELECT /ig, ")~::~SELECT ").replace(/ THEN /ig, " THEN~::~" + s).replace(/ UNION /ig, "~::~UNION~::~").replace(/ USING /ig, "~::~USING ").replace(/ WHEN /ig, "~::~" + s + "WHEN ").replace(/ WHERE /ig, "~::~WHERE ").replace(/ WITH /ig, "~::~WITH ").replace(/ ALL /ig, " ALL ").replace(/ AS /ig, " AS ").replace(/ ASC /ig, " ASC ").replace(/ DESC /ig, " DESC ").replace(/ DISTINCT /ig, " DISTINCT ").replace(/ EXISTS /ig, " EXISTS ").replace(/ NOT /ig, " NOT ").replace(/ NULL /ig, " NULL ").replace(/ LIKE /ig, " LIKE ").replace(/\s{0,}SELECT /ig, "SELECT ").replace(/\s{0,}UPDATE /ig, "UPDATE ").replace(/ SET /ig, " SET ").replace(/~::~{1,}/g, "~::~").split("~::~");
  }
  return e.prototype.sql = function(i, s) {
    var a = i.replace(/\s{1,}/g, " ").replace(/\'/ig, "~::~'").split("~::~"), l = a.length, u = [], f = 0, p = this.step, g = 0, _ = "", m = 0, T = s ? t(s) : this.shift;
    for (m = 0; m < l; m++)
      m % 2 ? u = u.concat(a[m]) : u = u.concat(r(a[m], p));
    for (l = u.length, m = 0; m < l; m++)
      g = n(u[m], g), /\s{0,}\s{0,}SELECT\s{0,}/.exec(u[m]) && (u[m] = u[m].replace(/\,/g, `,
` + p + p)), /\s{0,}\s{0,}SET\s{0,}/.exec(u[m]) && (u[m] = u[m].replace(/\,/g, `,
` + p + p)), /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(u[m]) ? (f++, _ += T[f] + u[m]) : /\'/.exec(u[m]) ? (g < 1 && f && f--, _ += u[m]) : (_ += T[f] + u[m], g < 1 && f && f--);
    return _ = _.replace(/^\n{1,}/, "").replace(/\n{1,}/g, `
`), _;
  }, e.prototype.xmlmin = function(i, s) {
    var a = s ? i : i.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g, "").replace(/[ \r\n\t]{1,}xmlns/g, " xmlns");
    return a.replace(/>\s{0,}</g, "><");
  }, e.prototype.jsonmin = function(i) {
    return typeof JSON > "u" ? i : JSON.stringify(JSON.parse(i), null, 0);
  }, e.prototype.cssmin = function(i, s) {
    var a = s ? i : i.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, "");
    return a.replace(/\s{1,}/g, " ").replace(/\{\s{1,}/g, "{").replace(/\}\s{1,}/g, "}").replace(/\;\s{1,}/g, ";").replace(/\/\*\s{1,}/g, "/*").replace(/\*\/\s{1,}/g, "*/");
  }, e.prototype.sqlmin = function(i) {
    return i.replace(/\s{1,}/g, " ").replace(/\s{1,}\(/, "(").replace(/\s{1,}\)/, ")");
  }, Zr = new e(), Zr;
}
var Kn = { exports: {} }, ks;
function Oa() {
  return ks || (ks = 1, (function(t, e) {
    (function() {
      var n = typeof self == "object" && self.self === self && self || typeof It == "object" && It.global === It && It || this || {}, r = n._, i = Array.prototype, s = Object.prototype, a = typeof Symbol < "u" ? Symbol.prototype : null, l = i.push, u = i.slice, f = s.toString, p = s.hasOwnProperty, g = Array.isArray, _ = Object.keys, m = Object.create, T = function() {
      }, c = function(h) {
        if (h instanceof c) return h;
        if (!(this instanceof c)) return new c(h);
        this._wrapped = h;
      };
      e.nodeType ? n._ = c : (!t.nodeType && t.exports && (e = t.exports = c), e._ = c), c.VERSION = "1.9.1";
      var w = function(h, v, A) {
        if (v === void 0) return h;
        switch (A ?? 3) {
          case 1:
            return function(N) {
              return h.call(v, N);
            };
          // The 2-argument case is omitted because we’re not using it.
          case 3:
            return function(N, R, F) {
              return h.call(v, N, R, F);
            };
          case 4:
            return function(N, R, F, Y) {
              return h.call(v, N, R, F, Y);
            };
        }
        return function() {
          return h.apply(v, arguments);
        };
      }, z, P = function(h, v, A) {
        return c.iteratee !== z ? c.iteratee(h, v) : h == null ? c.identity : c.isFunction(h) ? w(h, v, A) : c.isObject(h) && !c.isArray(h) ? c.matcher(h) : c.property(h);
      };
      c.iteratee = z = function(h, v) {
        return P(h, v, 1 / 0);
      };
      var b = function(h, v) {
        return v = v == null ? h.length - 1 : +v, function() {
          for (var A = Math.max(arguments.length - v, 0), N = Array(A), R = 0; R < A; R++)
            N[R] = arguments[R + v];
          switch (v) {
            case 0:
              return h.call(this, N);
            case 1:
              return h.call(this, arguments[0], N);
            case 2:
              return h.call(this, arguments[0], arguments[1], N);
          }
          var F = Array(v + 1);
          for (R = 0; R < v; R++)
            F[R] = arguments[R];
          return F[v] = N, h.apply(this, F);
        };
      }, x = function(h) {
        if (!c.isObject(h)) return {};
        if (m) return m(h);
        T.prototype = h;
        var v = new T();
        return T.prototype = null, v;
      }, C = function(h) {
        return function(v) {
          return v == null ? void 0 : v[h];
        };
      }, E = function(h, v) {
        return h != null && p.call(h, v);
      }, M = function(h, v) {
        for (var A = v.length, N = 0; N < A; N++) {
          if (h == null) return;
          h = h[v[N]];
        }
        return A ? h : void 0;
      }, D = Math.pow(2, 53) - 1, $ = C("length"), G = function(h) {
        var v = $(h);
        return typeof v == "number" && v >= 0 && v <= D;
      };
      c.each = c.forEach = function(h, v, A) {
        v = w(v, A);
        var N, R;
        if (G(h))
          for (N = 0, R = h.length; N < R; N++)
            v(h[N], N, h);
        else {
          var F = c.keys(h);
          for (N = 0, R = F.length; N < R; N++)
            v(h[F[N]], F[N], h);
        }
        return h;
      }, c.map = c.collect = function(h, v, A) {
        v = P(v, A);
        for (var N = !G(h) && c.keys(h), R = (N || h).length, F = Array(R), Y = 0; Y < R; Y++) {
          var ue = N ? N[Y] : Y;
          F[Y] = v(h[ue], ue, h);
        }
        return F;
      };
      var U = function(h) {
        var v = function(A, N, R, F) {
          var Y = !G(A) && c.keys(A), ue = (Y || A).length, ye = h > 0 ? 0 : ue - 1;
          for (F || (R = A[Y ? Y[ye] : ye], ye += h); ye >= 0 && ye < ue; ye += h) {
            var O = Y ? Y[ye] : ye;
            R = N(R, A[O], O, A);
          }
          return R;
        };
        return function(A, N, R, F) {
          var Y = arguments.length >= 3;
          return v(A, w(N, F, 4), R, Y);
        };
      };
      c.reduce = c.foldl = c.inject = U(1), c.reduceRight = c.foldr = U(-1), c.find = c.detect = function(h, v, A) {
        var N = G(h) ? c.findIndex : c.findKey, R = N(h, v, A);
        if (R !== void 0 && R !== -1) return h[R];
      }, c.filter = c.select = function(h, v, A) {
        var N = [];
        return v = P(v, A), c.each(h, function(R, F, Y) {
          v(R, F, Y) && N.push(R);
        }), N;
      }, c.reject = function(h, v, A) {
        return c.filter(h, c.negate(P(v)), A);
      }, c.every = c.all = function(h, v, A) {
        v = P(v, A);
        for (var N = !G(h) && c.keys(h), R = (N || h).length, F = 0; F < R; F++) {
          var Y = N ? N[F] : F;
          if (!v(h[Y], Y, h)) return !1;
        }
        return !0;
      }, c.some = c.any = function(h, v, A) {
        v = P(v, A);
        for (var N = !G(h) && c.keys(h), R = (N || h).length, F = 0; F < R; F++) {
          var Y = N ? N[F] : F;
          if (v(h[Y], Y, h)) return !0;
        }
        return !1;
      }, c.contains = c.includes = c.include = function(h, v, A, N) {
        return G(h) || (h = c.values(h)), (typeof A != "number" || N) && (A = 0), c.indexOf(h, v, A) >= 0;
      }, c.invoke = b(function(h, v, A) {
        var N, R;
        return c.isFunction(v) ? R = v : c.isArray(v) && (N = v.slice(0, -1), v = v[v.length - 1]), c.map(h, function(F) {
          var Y = R;
          if (!Y) {
            if (N && N.length && (F = M(F, N)), F == null) return;
            Y = F[v];
          }
          return Y == null ? Y : Y.apply(F, A);
        });
      }), c.pluck = function(h, v) {
        return c.map(h, c.property(v));
      }, c.where = function(h, v) {
        return c.filter(h, c.matcher(v));
      }, c.findWhere = function(h, v) {
        return c.find(h, c.matcher(v));
      }, c.max = function(h, v, A) {
        var N = -1 / 0, R = -1 / 0, F, Y;
        if (v == null || typeof v == "number" && typeof h[0] != "object" && h != null) {
          h = G(h) ? h : c.values(h);
          for (var ue = 0, ye = h.length; ue < ye; ue++)
            F = h[ue], F != null && F > N && (N = F);
        } else
          v = P(v, A), c.each(h, function(O, B, X) {
            Y = v(O, B, X), (Y > R || Y === -1 / 0 && N === -1 / 0) && (N = O, R = Y);
          });
        return N;
      }, c.min = function(h, v, A) {
        var N = 1 / 0, R = 1 / 0, F, Y;
        if (v == null || typeof v == "number" && typeof h[0] != "object" && h != null) {
          h = G(h) ? h : c.values(h);
          for (var ue = 0, ye = h.length; ue < ye; ue++)
            F = h[ue], F != null && F < N && (N = F);
        } else
          v = P(v, A), c.each(h, function(O, B, X) {
            Y = v(O, B, X), (Y < R || Y === 1 / 0 && N === 1 / 0) && (N = O, R = Y);
          });
        return N;
      }, c.shuffle = function(h) {
        return c.sample(h, 1 / 0);
      }, c.sample = function(h, v, A) {
        if (v == null || A)
          return G(h) || (h = c.values(h)), h[c.random(h.length - 1)];
        var N = G(h) ? c.clone(h) : c.values(h), R = $(N);
        v = Math.max(Math.min(v, R), 0);
        for (var F = R - 1, Y = 0; Y < v; Y++) {
          var ue = c.random(Y, F), ye = N[Y];
          N[Y] = N[ue], N[ue] = ye;
        }
        return N.slice(0, v);
      }, c.sortBy = function(h, v, A) {
        var N = 0;
        return v = P(v, A), c.pluck(c.map(h, function(R, F, Y) {
          return {
            value: R,
            index: N++,
            criteria: v(R, F, Y)
          };
        }).sort(function(R, F) {
          var Y = R.criteria, ue = F.criteria;
          if (Y !== ue) {
            if (Y > ue || Y === void 0) return 1;
            if (Y < ue || ue === void 0) return -1;
          }
          return R.index - F.index;
        }), "value");
      };
      var ae = function(h, v) {
        return function(A, N, R) {
          var F = v ? [[], []] : {};
          return N = P(N, R), c.each(A, function(Y, ue) {
            var ye = N(Y, ue, A);
            h(F, Y, ye);
          }), F;
        };
      };
      c.groupBy = ae(function(h, v, A) {
        E(h, A) ? h[A].push(v) : h[A] = [v];
      }), c.indexBy = ae(function(h, v, A) {
        h[A] = v;
      }), c.countBy = ae(function(h, v, A) {
        E(h, A) ? h[A]++ : h[A] = 1;
      });
      var I = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
      c.toArray = function(h) {
        return h ? c.isArray(h) ? u.call(h) : c.isString(h) ? h.match(I) : G(h) ? c.map(h, c.identity) : c.values(h) : [];
      }, c.size = function(h) {
        return h == null ? 0 : G(h) ? h.length : c.keys(h).length;
      }, c.partition = ae(function(h, v, A) {
        h[A ? 0 : 1].push(v);
      }, !0), c.first = c.head = c.take = function(h, v, A) {
        return h == null || h.length < 1 ? v == null ? void 0 : [] : v == null || A ? h[0] : c.initial(h, h.length - v);
      }, c.initial = function(h, v, A) {
        return u.call(h, 0, Math.max(0, h.length - (v == null || A ? 1 : v)));
      }, c.last = function(h, v, A) {
        return h == null || h.length < 1 ? v == null ? void 0 : [] : v == null || A ? h[h.length - 1] : c.rest(h, Math.max(0, h.length - v));
      }, c.rest = c.tail = c.drop = function(h, v, A) {
        return u.call(h, v == null || A ? 1 : v);
      }, c.compact = function(h) {
        return c.filter(h, Boolean);
      };
      var V = function(h, v, A, N) {
        N = N || [];
        for (var R = N.length, F = 0, Y = $(h); F < Y; F++) {
          var ue = h[F];
          if (G(ue) && (c.isArray(ue) || c.isArguments(ue)))
            if (v)
              for (var ye = 0, O = ue.length; ye < O; ) N[R++] = ue[ye++];
            else
              V(ue, v, A, N), R = N.length;
          else A || (N[R++] = ue);
        }
        return N;
      };
      c.flatten = function(h, v) {
        return V(h, v, !1);
      }, c.without = b(function(h, v) {
        return c.difference(h, v);
      }), c.uniq = c.unique = function(h, v, A, N) {
        c.isBoolean(v) || (N = A, A = v, v = !1), A != null && (A = P(A, N));
        for (var R = [], F = [], Y = 0, ue = $(h); Y < ue; Y++) {
          var ye = h[Y], O = A ? A(ye, Y, h) : ye;
          v && !A ? ((!Y || F !== O) && R.push(ye), F = O) : A ? c.contains(F, O) || (F.push(O), R.push(ye)) : c.contains(R, ye) || R.push(ye);
        }
        return R;
      }, c.union = b(function(h) {
        return c.uniq(V(h, !0, !0));
      }), c.intersection = function(h) {
        for (var v = [], A = arguments.length, N = 0, R = $(h); N < R; N++) {
          var F = h[N];
          if (!c.contains(v, F)) {
            var Y;
            for (Y = 1; Y < A && c.contains(arguments[Y], F); Y++)
              ;
            Y === A && v.push(F);
          }
        }
        return v;
      }, c.difference = b(function(h, v) {
        return v = V(v, !0, !0), c.filter(h, function(A) {
          return !c.contains(v, A);
        });
      }), c.unzip = function(h) {
        for (var v = h && c.max(h, $).length || 0, A = Array(v), N = 0; N < v; N++)
          A[N] = c.pluck(h, N);
        return A;
      }, c.zip = b(c.unzip), c.object = function(h, v) {
        for (var A = {}, N = 0, R = $(h); N < R; N++)
          v ? A[h[N]] = v[N] : A[h[N][0]] = h[N][1];
        return A;
      };
      var te = function(h) {
        return function(v, A, N) {
          A = P(A, N);
          for (var R = $(v), F = h > 0 ? 0 : R - 1; F >= 0 && F < R; F += h)
            if (A(v[F], F, v)) return F;
          return -1;
        };
      };
      c.findIndex = te(1), c.findLastIndex = te(-1), c.sortedIndex = function(h, v, A, N) {
        A = P(A, N, 1);
        for (var R = A(v), F = 0, Y = $(h); F < Y; ) {
          var ue = Math.floor((F + Y) / 2);
          A(h[ue]) < R ? F = ue + 1 : Y = ue;
        }
        return F;
      };
      var ne = function(h, v, A) {
        return function(N, R, F) {
          var Y = 0, ue = $(N);
          if (typeof F == "number")
            h > 0 ? Y = F >= 0 ? F : Math.max(F + ue, Y) : ue = F >= 0 ? Math.min(F + 1, ue) : F + ue + 1;
          else if (A && F && ue)
            return F = A(N, R), N[F] === R ? F : -1;
          if (R !== R)
            return F = v(u.call(N, Y, ue), c.isNaN), F >= 0 ? F + Y : -1;
          for (F = h > 0 ? Y : ue - 1; F >= 0 && F < ue; F += h)
            if (N[F] === R) return F;
          return -1;
        };
      };
      c.indexOf = ne(1, c.findIndex, c.sortedIndex), c.lastIndexOf = ne(-1, c.findLastIndex), c.range = function(h, v, A) {
        v == null && (v = h || 0, h = 0), A || (A = v < h ? -1 : 1);
        for (var N = Math.max(Math.ceil((v - h) / A), 0), R = Array(N), F = 0; F < N; F++, h += A)
          R[F] = h;
        return R;
      }, c.chunk = function(h, v) {
        if (v == null || v < 1) return [];
        for (var A = [], N = 0, R = h.length; N < R; )
          A.push(u.call(h, N, N += v));
        return A;
      };
      var J = function(h, v, A, N, R) {
        if (!(N instanceof v)) return h.apply(A, R);
        var F = x(h.prototype), Y = h.apply(F, R);
        return c.isObject(Y) ? Y : F;
      };
      c.bind = b(function(h, v, A) {
        if (!c.isFunction(h)) throw new TypeError("Bind must be called on a function");
        var N = b(function(R) {
          return J(h, N, v, this, A.concat(R));
        });
        return N;
      }), c.partial = b(function(h, v) {
        var A = c.partial.placeholder, N = function() {
          for (var R = 0, F = v.length, Y = Array(F), ue = 0; ue < F; ue++)
            Y[ue] = v[ue] === A ? arguments[R++] : v[ue];
          for (; R < arguments.length; ) Y.push(arguments[R++]);
          return J(h, N, this, this, Y);
        };
        return N;
      }), c.partial.placeholder = c, c.bindAll = b(function(h, v) {
        v = V(v, !1, !1);
        var A = v.length;
        if (A < 1) throw new Error("bindAll must be passed function names");
        for (; A--; ) {
          var N = v[A];
          h[N] = c.bind(h[N], h);
        }
      }), c.memoize = function(h, v) {
        var A = function(N) {
          var R = A.cache, F = "" + (v ? v.apply(this, arguments) : N);
          return E(R, F) || (R[F] = h.apply(this, arguments)), R[F];
        };
        return A.cache = {}, A;
      }, c.delay = b(function(h, v, A) {
        return setTimeout(function() {
          return h.apply(null, A);
        }, v);
      }), c.defer = c.partial(c.delay, c, 1), c.throttle = function(h, v, A) {
        var N, R, F, Y, ue = 0;
        A || (A = {});
        var ye = function() {
          ue = A.leading === !1 ? 0 : c.now(), N = null, Y = h.apply(R, F), N || (R = F = null);
        }, O = function() {
          var B = c.now();
          !ue && A.leading === !1 && (ue = B);
          var X = v - (B - ue);
          return R = this, F = arguments, X <= 0 || X > v ? (N && (clearTimeout(N), N = null), ue = B, Y = h.apply(R, F), N || (R = F = null)) : !N && A.trailing !== !1 && (N = setTimeout(ye, X)), Y;
        };
        return O.cancel = function() {
          clearTimeout(N), ue = 0, N = R = F = null;
        }, O;
      }, c.debounce = function(h, v, A) {
        var N, R, F = function(ue, ye) {
          N = null, ye && (R = h.apply(ue, ye));
        }, Y = b(function(ue) {
          if (N && clearTimeout(N), A) {
            var ye = !N;
            N = setTimeout(F, v), ye && (R = h.apply(this, ue));
          } else
            N = c.delay(F, v, this, ue);
          return R;
        });
        return Y.cancel = function() {
          clearTimeout(N), N = null;
        }, Y;
      }, c.wrap = function(h, v) {
        return c.partial(v, h);
      }, c.negate = function(h) {
        return function() {
          return !h.apply(this, arguments);
        };
      }, c.compose = function() {
        var h = arguments, v = h.length - 1;
        return function() {
          for (var A = v, N = h[v].apply(this, arguments); A--; ) N = h[A].call(this, N);
          return N;
        };
      }, c.after = function(h, v) {
        return function() {
          if (--h < 1)
            return v.apply(this, arguments);
        };
      }, c.before = function(h, v) {
        var A;
        return function() {
          return --h > 0 && (A = v.apply(this, arguments)), h <= 1 && (v = null), A;
        };
      }, c.once = c.partial(c.before, 2), c.restArguments = b;
      var he = !{ toString: null }.propertyIsEnumerable("toString"), me = [
        "valueOf",
        "isPrototypeOf",
        "toString",
        "propertyIsEnumerable",
        "hasOwnProperty",
        "toLocaleString"
      ], ge = function(h, v) {
        var A = me.length, N = h.constructor, R = c.isFunction(N) && N.prototype || s, F = "constructor";
        for (E(h, F) && !c.contains(v, F) && v.push(F); A--; )
          F = me[A], F in h && h[F] !== R[F] && !c.contains(v, F) && v.push(F);
      };
      c.keys = function(h) {
        if (!c.isObject(h)) return [];
        if (_) return _(h);
        var v = [];
        for (var A in h) E(h, A) && v.push(A);
        return he && ge(h, v), v;
      }, c.allKeys = function(h) {
        if (!c.isObject(h)) return [];
        var v = [];
        for (var A in h) v.push(A);
        return he && ge(h, v), v;
      }, c.values = function(h) {
        for (var v = c.keys(h), A = v.length, N = Array(A), R = 0; R < A; R++)
          N[R] = h[v[R]];
        return N;
      }, c.mapObject = function(h, v, A) {
        v = P(v, A);
        for (var N = c.keys(h), R = N.length, F = {}, Y = 0; Y < R; Y++) {
          var ue = N[Y];
          F[ue] = v(h[ue], ue, h);
        }
        return F;
      }, c.pairs = function(h) {
        for (var v = c.keys(h), A = v.length, N = Array(A), R = 0; R < A; R++)
          N[R] = [v[R], h[v[R]]];
        return N;
      }, c.invert = function(h) {
        for (var v = {}, A = c.keys(h), N = 0, R = A.length; N < R; N++)
          v[h[A[N]]] = A[N];
        return v;
      }, c.functions = c.methods = function(h) {
        var v = [];
        for (var A in h)
          c.isFunction(h[A]) && v.push(A);
        return v.sort();
      };
      var re = function(h, v) {
        return function(A) {
          var N = arguments.length;
          if (v && (A = Object(A)), N < 2 || A == null) return A;
          for (var R = 1; R < N; R++)
            for (var F = arguments[R], Y = h(F), ue = Y.length, ye = 0; ye < ue; ye++) {
              var O = Y[ye];
              (!v || A[O] === void 0) && (A[O] = F[O]);
            }
          return A;
        };
      };
      c.extend = re(c.allKeys), c.extendOwn = c.assign = re(c.keys), c.findKey = function(h, v, A) {
        v = P(v, A);
        for (var N = c.keys(h), R, F = 0, Y = N.length; F < Y; F++)
          if (R = N[F], v(h[R], R, h)) return R;
      };
      var oe = function(h, v, A) {
        return v in A;
      };
      c.pick = b(function(h, v) {
        var A = {}, N = v[0];
        if (h == null) return A;
        c.isFunction(N) ? (v.length > 1 && (N = w(N, v[1])), v = c.allKeys(h)) : (N = oe, v = V(v, !1, !1), h = Object(h));
        for (var R = 0, F = v.length; R < F; R++) {
          var Y = v[R], ue = h[Y];
          N(ue, Y, h) && (A[Y] = ue);
        }
        return A;
      }), c.omit = b(function(h, v) {
        var A = v[0], N;
        return c.isFunction(A) ? (A = c.negate(A), v.length > 1 && (N = v[1])) : (v = c.map(V(v, !1, !1), String), A = function(R, F) {
          return !c.contains(v, F);
        }), c.pick(h, A, N);
      }), c.defaults = re(c.allKeys, !0), c.create = function(h, v) {
        var A = x(h);
        return v && c.extendOwn(A, v), A;
      }, c.clone = function(h) {
        return c.isObject(h) ? c.isArray(h) ? h.slice() : c.extend({}, h) : h;
      }, c.tap = function(h, v) {
        return v(h), h;
      }, c.isMatch = function(h, v) {
        var A = c.keys(v), N = A.length;
        if (h == null) return !N;
        for (var R = Object(h), F = 0; F < N; F++) {
          var Y = A[F];
          if (v[Y] !== R[Y] || !(Y in R)) return !1;
        }
        return !0;
      };
      var le, fe;
      le = function(h, v, A, N) {
        if (h === v) return h !== 0 || 1 / h === 1 / v;
        if (h == null || v == null) return !1;
        if (h !== h) return v !== v;
        var R = typeof h;
        return R !== "function" && R !== "object" && typeof v != "object" ? !1 : fe(h, v, A, N);
      }, fe = function(h, v, A, N) {
        h instanceof c && (h = h._wrapped), v instanceof c && (v = v._wrapped);
        var R = f.call(h);
        if (R !== f.call(v)) return !1;
        switch (R) {
          // Strings, numbers, regular expressions, dates, and booleans are compared by value.
          case "[object RegExp]":
          // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
          case "[object String]":
            return "" + h == "" + v;
          case "[object Number]":
            return +h != +h ? +v != +v : +h == 0 ? 1 / +h === 1 / v : +h == +v;
          case "[object Date]":
          case "[object Boolean]":
            return +h == +v;
          case "[object Symbol]":
            return a.valueOf.call(h) === a.valueOf.call(v);
        }
        var F = R === "[object Array]";
        if (!F) {
          if (typeof h != "object" || typeof v != "object") return !1;
          var Y = h.constructor, ue = v.constructor;
          if (Y !== ue && !(c.isFunction(Y) && Y instanceof Y && c.isFunction(ue) && ue instanceof ue) && "constructor" in h && "constructor" in v)
            return !1;
        }
        A = A || [], N = N || [];
        for (var ye = A.length; ye--; )
          if (A[ye] === h) return N[ye] === v;
        if (A.push(h), N.push(v), F) {
          if (ye = h.length, ye !== v.length) return !1;
          for (; ye--; )
            if (!le(h[ye], v[ye], A, N)) return !1;
        } else {
          var O = c.keys(h), B;
          if (ye = O.length, c.keys(v).length !== ye) return !1;
          for (; ye--; )
            if (B = O[ye], !(E(v, B) && le(h[B], v[B], A, N))) return !1;
        }
        return A.pop(), N.pop(), !0;
      }, c.isEqual = function(h, v) {
        return le(h, v);
      }, c.isEmpty = function(h) {
        return h == null ? !0 : G(h) && (c.isArray(h) || c.isString(h) || c.isArguments(h)) ? h.length === 0 : c.keys(h).length === 0;
      }, c.isElement = function(h) {
        return !!(h && h.nodeType === 1);
      }, c.isArray = g || function(h) {
        return f.call(h) === "[object Array]";
      }, c.isObject = function(h) {
        var v = typeof h;
        return v === "function" || v === "object" && !!h;
      }, c.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error", "Symbol", "Map", "WeakMap", "Set", "WeakSet"], function(h) {
        c["is" + h] = function(v) {
          return f.call(v) === "[object " + h + "]";
        };
      }), c.isArguments(arguments) || (c.isArguments = function(h) {
        return E(h, "callee");
      });
      var be = n.document && n.document.childNodes;
      typeof /./ != "function" && typeof Int8Array != "object" && typeof be != "function" && (c.isFunction = function(h) {
        return typeof h == "function" || !1;
      }), c.isFinite = function(h) {
        return !c.isSymbol(h) && isFinite(h) && !isNaN(parseFloat(h));
      }, c.isNaN = function(h) {
        return c.isNumber(h) && isNaN(h);
      }, c.isBoolean = function(h) {
        return h === !0 || h === !1 || f.call(h) === "[object Boolean]";
      }, c.isNull = function(h) {
        return h === null;
      }, c.isUndefined = function(h) {
        return h === void 0;
      }, c.has = function(h, v) {
        if (!c.isArray(v))
          return E(h, v);
        for (var A = v.length, N = 0; N < A; N++) {
          var R = v[N];
          if (h == null || !p.call(h, R))
            return !1;
          h = h[R];
        }
        return !!A;
      }, c.noConflict = function() {
        return n._ = r, this;
      }, c.identity = function(h) {
        return h;
      }, c.constant = function(h) {
        return function() {
          return h;
        };
      }, c.noop = function() {
      }, c.property = function(h) {
        return c.isArray(h) ? function(v) {
          return M(v, h);
        } : C(h);
      }, c.propertyOf = function(h) {
        return h == null ? function() {
        } : function(v) {
          return c.isArray(v) ? M(h, v) : h[v];
        };
      }, c.matcher = c.matches = function(h) {
        return h = c.extendOwn({}, h), function(v) {
          return c.isMatch(v, h);
        };
      }, c.times = function(h, v, A) {
        var N = Array(Math.max(0, h));
        v = w(v, A, 1);
        for (var R = 0; R < h; R++) N[R] = v(R);
        return N;
      }, c.random = function(h, v) {
        return v == null && (v = h, h = 0), h + Math.floor(Math.random() * (v - h + 1));
      }, c.now = Date.now || function() {
        return (/* @__PURE__ */ new Date()).getTime();
      };
      var K = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      }, H = c.invert(K), Z = function(h) {
        var v = function(F) {
          return h[F];
        }, A = "(?:" + c.keys(h).join("|") + ")", N = RegExp(A), R = RegExp(A, "g");
        return function(F) {
          return F = F == null ? "" : "" + F, N.test(F) ? F.replace(R, v) : F;
        };
      };
      c.escape = Z(K), c.unescape = Z(H), c.result = function(h, v, A) {
        c.isArray(v) || (v = [v]);
        var N = v.length;
        if (!N)
          return c.isFunction(A) ? A.call(h) : A;
        for (var R = 0; R < N; R++) {
          var F = h == null ? void 0 : h[v[R]];
          F === void 0 && (F = A, R = N), h = c.isFunction(F) ? F.call(h) : F;
        }
        return h;
      };
      var Q = 0;
      c.uniqueId = function(h) {
        var v = ++Q + "";
        return h ? h + v : v;
      }, c.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
      };
      var W = /(.)^/, Me = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
      }, _e = /\\|'|\r|\n|\u2028|\u2029/g, ke = function(h) {
        return "\\" + Me[h];
      };
      c.template = function(h, v, A) {
        !v && A && (v = A), v = c.defaults({}, v, c.templateSettings);
        var N = RegExp([
          (v.escape || W).source,
          (v.interpolate || W).source,
          (v.evaluate || W).source
        ].join("|") + "|$", "g"), R = 0, F = "__p+='";
        h.replace(N, function(O, B, X, ee, pe) {
          return F += h.slice(R, pe).replace(_e, ke), R = pe + O.length, B ? F += `'+
((__t=(` + B + `))==null?'':_.escape(__t))+
'` : X ? F += `'+
((__t=(` + X + `))==null?'':__t)+
'` : ee && (F += `';
` + ee + `
__p+='`), O;
        }), F += `';
`, v.variable || (F = `with(obj||{}){
` + F + `}
`), F = `var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
` + F + `return __p;
`;
        var Y;
        try {
          Y = new Function(v.variable || "obj", "_", F);
        } catch (O) {
          throw O.source = F, O;
        }
        var ue = function(O) {
          return Y.call(this, O, c);
        }, ye = v.variable || "obj";
        return ue.source = "function(" + ye + `){
` + F + "}", ue;
      }, c.chain = function(h) {
        var v = c(h);
        return v._chain = !0, v;
      };
      var Ce = function(h, v) {
        return h._chain ? c(v).chain() : v;
      };
      c.mixin = function(h) {
        return c.each(c.functions(h), function(v) {
          var A = c[v] = h[v];
          c.prototype[v] = function() {
            var N = [this._wrapped];
            return l.apply(N, arguments), Ce(this, A.apply(c, N));
          };
        }), c;
      }, c.mixin(c), c.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(h) {
        var v = i[h];
        c.prototype[h] = function() {
          var A = this._wrapped;
          return v.apply(A, arguments), (h === "shift" || h === "splice") && A.length === 0 && delete A[0], Ce(this, A);
        };
      }), c.each(["concat", "join", "slice"], function(h) {
        var v = i[h];
        c.prototype[h] = function() {
          return Ce(this, v.apply(this._wrapped, arguments));
        };
      }), c.prototype.value = function() {
        return this._wrapped;
      }, c.prototype.valueOf = c.prototype.toJSON = c.prototype.value, c.prototype.toString = function() {
        return String(this._wrapped);
      };
    })();
  })(Kn, Kn.exports)), Kn.exports;
}
var at = "$";
function dr() {
}
dr.prototype = Hi.prototype = {
  constructor: dr,
  has: function(t) {
    return at + t in this;
  },
  get: function(t) {
    return this[at + t];
  },
  set: function(t, e) {
    return this[at + t] = e, this;
  },
  remove: function(t) {
    var e = at + t;
    return e in this && delete this[e];
  },
  clear: function() {
    for (var t in this) t[0] === at && delete this[t];
  },
  keys: function() {
    var t = [];
    for (var e in this) e[0] === at && t.push(e.slice(1));
    return t;
  },
  values: function() {
    var t = [];
    for (var e in this) e[0] === at && t.push(this[e]);
    return t;
  },
  entries: function() {
    var t = [];
    for (var e in this) e[0] === at && t.push({ key: e.slice(1), value: this[e] });
    return t;
  },
  size: function() {
    var t = 0;
    for (var e in this) e[0] === at && ++t;
    return t;
  },
  empty: function() {
    for (var t in this) if (t[0] === at) return !1;
    return !0;
  },
  each: function(t) {
    for (var e in this) e[0] === at && t(this[e], e.slice(1), this);
  }
};
function Hi(t, e) {
  var n = new dr();
  if (t instanceof dr) t.each(function(l, u) {
    n.set(u, l);
  });
  else if (Array.isArray(t)) {
    var r = -1, i = t.length, s;
    if (e == null) for (; ++r < i; ) n.set(r, t[r]);
    else for (; ++r < i; ) n.set(e(s = t[r], r, t), s);
  } else if (t) for (var a in t) n.set(a, t[a]);
  return n;
}
function Cs() {
}
var At = Hi.prototype;
Cs.prototype = {
  constructor: Cs,
  has: At.has,
  add: function(t) {
    return t += "", this[at + t] = t, this;
  },
  remove: At.remove,
  clear: At.clear,
  values: At.keys,
  size: At.size,
  empty: At.empty,
  each: At.each
};
var al = { value: function() {
} };
function mn() {
  for (var t = 0, e = arguments.length, n = {}, r; t < e; ++t) {
    if (!(r = arguments[t] + "") || r in n) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new sr(n);
}
function sr(t) {
  this._ = t;
}
function ol(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var r = "", i = n.indexOf(".");
    if (i >= 0 && (r = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
sr.prototype = mn.prototype = {
  constructor: sr,
  on: function(t, e) {
    var n = this._, r = ol(t + "", n), i, s = -1, a = r.length;
    if (arguments.length < 2) {
      for (; ++s < a; ) if ((i = (t = r[s]).type) && (i = ll(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++s < a; )
      if (i = (t = r[s]).type) n[i] = Es(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = Es(n[i], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new sr(t);
  },
  call: function(t, e) {
    if ((i = arguments.length - 2) > 0) for (var n = new Array(i), r = 0, i, s; r < i; ++r) n[r] = arguments[r + 2];
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (s = this._[t], r = 0, i = s.length; r < i; ++r) s[r].value.apply(e, n);
  },
  apply: function(t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (var r = this._[t], i = 0, s = r.length; i < s; ++i) r[i].value.apply(e, n);
  }
};
function ll(t, e) {
  for (var n = 0, r = t.length, i; n < r; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function Es(t, e, n) {
  for (var r = 0, i = t.length; r < i; ++r)
    if (t[r].name === e) {
      t[r] = al, t = t.slice(0, r).concat(t.slice(r + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
function Yi(t, e) {
  var n, r = mn("beforesend", "progress", "load", "error"), i, s = Hi(), a = new XMLHttpRequest(), l = null, u = null, f, p, g = 0;
  typeof XDomainRequest < "u" && !("withCredentials" in a) && /^(http(s)?:)?\/\//.test(t) && (a = new XDomainRequest()), "onload" in a ? a.onload = a.onerror = a.ontimeout = _ : a.onreadystatechange = function(m) {
    a.readyState > 3 && _(m);
  };
  function _(m) {
    var T = a.status, c;
    if (!T && cl(a) || T >= 200 && T < 300 || T === 304) {
      if (f)
        try {
          c = f.call(n, a);
        } catch (w) {
          r.call("error", n, w);
          return;
        }
      else
        c = a;
      r.call("load", n, c);
    } else
      r.call("error", n, m);
  }
  if (a.onprogress = function(m) {
    r.call("progress", n, m);
  }, n = {
    header: function(m, T) {
      return m = (m + "").toLowerCase(), arguments.length < 2 ? s.get(m) : (T == null ? s.remove(m) : s.set(m, T + ""), n);
    },
    // If mimeType is non-null and no Accept header is set, a default is used.
    mimeType: function(m) {
      return arguments.length ? (i = m == null ? null : m + "", n) : i;
    },
    // Specifies what type the response value should take;
    // for instance, arraybuffer, blob, document, or text.
    responseType: function(m) {
      return arguments.length ? (p = m, n) : p;
    },
    timeout: function(m) {
      return arguments.length ? (g = +m, n) : g;
    },
    user: function(m) {
      return arguments.length < 1 ? l : (l = m == null ? null : m + "", n);
    },
    password: function(m) {
      return arguments.length < 1 ? u : (u = m == null ? null : m + "", n);
    },
    // Specify how to convert the response content to a specific type;
    // changes the callback value on "load" events.
    response: function(m) {
      return f = m, n;
    },
    // Alias for send("GET", …).
    get: function(m, T) {
      return n.send("GET", m, T);
    },
    // Alias for send("POST", …).
    post: function(m, T) {
      return n.send("POST", m, T);
    },
    // If callback is non-null, it will be used for error and load events.
    send: function(m, T, c) {
      return a.open(m, t, !0, l, u), i != null && !s.has("accept") && s.set("accept", i + ",*/*"), a.setRequestHeader && s.each(function(w, z) {
        a.setRequestHeader(z, w);
      }), i != null && a.overrideMimeType && a.overrideMimeType(i), p != null && (a.responseType = p), g > 0 && (a.timeout = g), c == null && typeof T == "function" && (c = T, T = null), c != null && c.length === 1 && (c = ul(c)), c != null && n.on("error", c).on("load", function(w) {
        c(null, w);
      }), r.call("beforesend", n, a), a.send(T ?? null), n;
    },
    abort: function() {
      return a.abort(), n;
    },
    on: function() {
      var m = r.on.apply(r, arguments);
      return m === r ? n : m;
    }
  }, e != null) {
    if (typeof e != "function") throw new Error("invalid callback: " + e);
    return n.get(e);
  }
  return n;
}
function ul(t) {
  return function(e, n) {
    t(e == null ? n : null);
  };
}
function cl(t) {
  var e = t.responseType;
  return e && e !== "text" ? t.response : t.responseText;
}
function zr(t, e) {
  return function(n, r) {
    var i = Yi(n).mimeType(t).response(e);
    if (r != null) {
      if (typeof r != "function") throw new Error("invalid callback: " + r);
      return i.get(r);
    }
    return i;
  };
}
const hl = zr("text/html", function(t) {
  return document.createRange().createContextualFragment(t.responseText);
}), fl = zr("application/json", function(t) {
  return JSON.parse(t.responseText);
}), dl = zr("text/plain", function(t) {
  return t.responseText;
}), pl = zr("application/xml", function(t) {
  var e = t.responseXML;
  if (!e) throw new Error("parse error");
  return e;
});
var Ts = {}, Jr = {}, Qr = 34, Sn = 10, jr = 13;
function La(t) {
  return new Function("d", "return {" + t.map(function(e, n) {
    return JSON.stringify(e) + ": d[" + n + "]";
  }).join(",") + "}");
}
function gl(t, e) {
  var n = La(t);
  return function(r, i) {
    return e(n(r), i, t);
  };
}
function zs(t) {
  var e = /* @__PURE__ */ Object.create(null), n = [];
  return t.forEach(function(r) {
    for (var i in r)
      i in e || n.push(e[i] = i);
  }), n;
}
function tt(t, e) {
  var n = t + "", r = n.length;
  return r < e ? new Array(e - r + 1).join(0) + n : n;
}
function _l(t) {
  return t < 0 ? "-" + tt(-t, 6) : t > 9999 ? "+" + tt(t, 6) : tt(t, 4);
}
function ml(t) {
  var e = t.getUTCHours(), n = t.getUTCMinutes(), r = t.getUTCSeconds(), i = t.getUTCMilliseconds();
  return isNaN(t) ? "Invalid Date" : _l(t.getUTCFullYear()) + "-" + tt(t.getUTCMonth() + 1, 2) + "-" + tt(t.getUTCDate(), 2) + (i ? "T" + tt(e, 2) + ":" + tt(n, 2) + ":" + tt(r, 2) + "." + tt(i, 3) + "Z" : r ? "T" + tt(e, 2) + ":" + tt(n, 2) + ":" + tt(r, 2) + "Z" : n || e ? "T" + tt(e, 2) + ":" + tt(n, 2) + "Z" : "");
}
function Gi(t) {
  var e = new RegExp('["' + t + `
\r]`), n = t.charCodeAt(0);
  function r(g, _) {
    var m, T, c = i(g, function(w, z) {
      if (m) return m(w, z - 1);
      T = w, m = _ ? gl(w, _) : La(w);
    });
    return c.columns = T || [], c;
  }
  function i(g, _) {
    var m = [], T = g.length, c = 0, w = 0, z, P = T <= 0, b = !1;
    g.charCodeAt(T - 1) === Sn && --T, g.charCodeAt(T - 1) === jr && --T;
    function x() {
      if (P) return Jr;
      if (b) return b = !1, Ts;
      var E, M = c, D;
      if (g.charCodeAt(M) === Qr) {
        for (; c++ < T && g.charCodeAt(c) !== Qr || g.charCodeAt(++c) === Qr; ) ;
        return (E = c) >= T ? P = !0 : (D = g.charCodeAt(c++)) === Sn ? b = !0 : D === jr && (b = !0, g.charCodeAt(c) === Sn && ++c), g.slice(M + 1, E - 1).replace(/""/g, '"');
      }
      for (; c < T; ) {
        if ((D = g.charCodeAt(E = c++)) === Sn) b = !0;
        else if (D === jr)
          b = !0, g.charCodeAt(c) === Sn && ++c;
        else if (D !== n) continue;
        return g.slice(M, E);
      }
      return P = !0, g.slice(M, T);
    }
    for (; (z = x()) !== Jr; ) {
      for (var C = []; z !== Ts && z !== Jr; ) C.push(z), z = x();
      _ && (C = _(C, w++)) == null || m.push(C);
    }
    return m;
  }
  function s(g, _) {
    return g.map(function(m) {
      return _.map(function(T) {
        return p(m[T]);
      }).join(t);
    });
  }
  function a(g, _) {
    return _ == null && (_ = zs(g)), [_.map(p).join(t)].concat(s(g, _)).join(`
`);
  }
  function l(g, _) {
    return _ == null && (_ = zs(g)), s(g, _).join(`
`);
  }
  function u(g) {
    return g.map(f).join(`
`);
  }
  function f(g) {
    return g.map(p).join(t);
  }
  function p(g) {
    return g == null ? "" : g instanceof Date ? ml(g) : e.test(g += "") ? '"' + g.replace(/"/g, '""') + '"' : g;
  }
  return {
    parse: r,
    parseRows: i,
    format: a,
    formatBody: l,
    formatRows: u
  };
}
var qn = Gi(","), Pa = qn.parse, bl = qn.parseRows, vl = qn.format, yl = qn.formatBody, wl = qn.formatRows, Vn = Gi("	"), Fa = Vn.parse, xl = Vn.parseRows, Ml = Vn.format, Sl = Vn.formatBody, kl = Vn.formatRows;
function Cl(t) {
  for (var e in t) {
    var n = t[e].trim(), r;
    if (!n) n = null;
    else if (n === "true") n = !0;
    else if (n === "false") n = !1;
    else if (n === "NaN") n = NaN;
    else if (!isNaN(r = +n)) n = r;
    else if (/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/.test(n)) n = new Date(n);
    else continue;
    t[e] = n;
  }
  return t;
}
const El = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  autoType: Cl,
  csvFormat: vl,
  csvFormatBody: yl,
  csvFormatRows: wl,
  csvParse: Pa,
  csvParseRows: bl,
  dsvFormat: Gi,
  tsvFormat: Ml,
  tsvFormatBody: Sl,
  tsvFormatRows: kl,
  tsvParse: Fa,
  tsvParseRows: xl
}, Symbol.toStringTag, { value: "Module" }));
function Ba(t, e) {
  return function(n, r, i) {
    arguments.length < 3 && (i = r, r = null);
    var s = Yi(n).mimeType(t);
    return s.row = function(a) {
      return arguments.length ? s.response(Tl(e, r = a)) : r;
    }, s.row(r), i ? s.get(i) : s;
  };
}
function Tl(t, e) {
  return function(n) {
    return t(n.responseText, e);
  };
}
const zl = Ba("text/csv", Pa), Nl = Ba("text/tab-separated-values", Fa), Dl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  csv: zl,
  html: hl,
  json: fl,
  request: Yi,
  text: dl,
  tsv: Nl,
  xml: pl
}, Symbol.toStringTag, { value: "Module" })), Ns = /* @__PURE__ */ _n(Dl), Al = /* @__PURE__ */ _n(El);
var ki = "http://www.w3.org/1999/xhtml";
const Ci = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: ki,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Hn(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Ci.hasOwnProperty(e) ? { space: Ci[e], local: t } : t;
}
function Il(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === ki && e.documentElement.namespaceURI === ki ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Ol(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Nr(t) {
  var e = Hn(t);
  return (e.local ? Ol : Il)(e);
}
function Ll() {
}
function Dr(t) {
  return t == null ? Ll : function() {
    return this.querySelector(t);
  };
}
function Pl(t) {
  typeof t != "function" && (t = Dr(t));
  for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
    for (var s = e[i], a = s.length, l = r[i] = new Array(a), u, f, p = 0; p < a; ++p)
      (u = s[p]) && (f = t.call(u, u.__data__, p, s)) && ("__data__" in u && (f.__data__ = u.__data__), l[p] = f);
  return new Qe(r, this._parents);
}
function Fl() {
  return [];
}
function Xi(t) {
  return t == null ? Fl : function() {
    return this.querySelectorAll(t);
  };
}
function Bl(t) {
  typeof t != "function" && (t = Xi(t));
  for (var e = this._groups, n = e.length, r = [], i = [], s = 0; s < n; ++s)
    for (var a = e[s], l = a.length, u, f = 0; f < l; ++f)
      (u = a[f]) && (r.push(t.call(u, u.__data__, f, a)), i.push(u));
  return new Qe(r, i);
}
function Ki(t) {
  return function() {
    return this.matches(t);
  };
}
function Rl(t) {
  typeof t != "function" && (t = Ki(t));
  for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
    for (var s = e[i], a = s.length, l = r[i] = [], u, f = 0; f < a; ++f)
      (u = s[f]) && t.call(u, u.__data__, f, s) && l.push(u);
  return new Qe(r, this._parents);
}
function Ra(t) {
  return new Array(t.length);
}
function Ul() {
  return new Qe(this._enter || this._groups.map(Ra), this._parents);
}
function pr(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
pr.prototype = {
  constructor: pr,
  appendChild: function(t) {
    return this._parent.insertBefore(t, this._next);
  },
  insertBefore: function(t, e) {
    return this._parent.insertBefore(t, e);
  },
  querySelector: function(t) {
    return this._parent.querySelector(t);
  },
  querySelectorAll: function(t) {
    return this._parent.querySelectorAll(t);
  }
};
function $l(t) {
  return function() {
    return t;
  };
}
var Ds = "$";
function Wl(t, e, n, r, i, s) {
  for (var a = 0, l, u = e.length, f = s.length; a < f; ++a)
    (l = e[a]) ? (l.__data__ = s[a], r[a] = l) : n[a] = new pr(t, s[a]);
  for (; a < u; ++a)
    (l = e[a]) && (i[a] = l);
}
function ql(t, e, n, r, i, s, a) {
  var l, u, f = {}, p = e.length, g = s.length, _ = new Array(p), m;
  for (l = 0; l < p; ++l)
    (u = e[l]) && (_[l] = m = Ds + a.call(u, u.__data__, l, e), m in f ? i[l] = u : f[m] = u);
  for (l = 0; l < g; ++l)
    m = Ds + a.call(t, s[l], l, s), (u = f[m]) ? (r[l] = u, u.__data__ = s[l], f[m] = null) : n[l] = new pr(t, s[l]);
  for (l = 0; l < p; ++l)
    (u = e[l]) && f[_[l]] === u && (i[l] = u);
}
function Vl(t, e) {
  if (!t)
    return m = new Array(this.size()), f = -1, this.each(function(E) {
      m[++f] = E;
    }), m;
  var n = e ? ql : Wl, r = this._parents, i = this._groups;
  typeof t != "function" && (t = $l(t));
  for (var s = i.length, a = new Array(s), l = new Array(s), u = new Array(s), f = 0; f < s; ++f) {
    var p = r[f], g = i[f], _ = g.length, m = t.call(p, p && p.__data__, f, r), T = m.length, c = l[f] = new Array(T), w = a[f] = new Array(T), z = u[f] = new Array(_);
    n(p, g, c, w, z, m, e);
    for (var P = 0, b = 0, x, C; P < T; ++P)
      if (x = c[P]) {
        for (P >= b && (b = P + 1); !(C = w[b]) && ++b < T; ) ;
        x._next = C || null;
      }
  }
  return a = new Qe(a, r), a._enter = l, a._exit = u, a;
}
function Hl() {
  return new Qe(this._exit || this._groups.map(Ra), this._parents);
}
function Yl(t, e, n) {
  var r = this.enter(), i = this, s = this.exit();
  return r = typeof t == "function" ? t(r) : r.append(t + ""), e != null && (i = e(i)), n == null ? s.remove() : n(s), r && i ? r.merge(i).order() : i;
}
function Gl(t) {
  for (var e = this._groups, n = t._groups, r = e.length, i = n.length, s = Math.min(r, i), a = new Array(r), l = 0; l < s; ++l)
    for (var u = e[l], f = n[l], p = u.length, g = a[l] = new Array(p), _, m = 0; m < p; ++m)
      (_ = u[m] || f[m]) && (g[m] = _);
  for (; l < r; ++l)
    a[l] = e[l];
  return new Qe(a, this._parents);
}
function Xl() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var r = t[e], i = r.length - 1, s = r[i], a; --i >= 0; )
      (a = r[i]) && (s && a.compareDocumentPosition(s) ^ 4 && s.parentNode.insertBefore(a, s), s = a);
  return this;
}
function Kl(t) {
  t || (t = Zl);
  function e(g, _) {
    return g && _ ? t(g.__data__, _.__data__) : !g - !_;
  }
  for (var n = this._groups, r = n.length, i = new Array(r), s = 0; s < r; ++s) {
    for (var a = n[s], l = a.length, u = i[s] = new Array(l), f, p = 0; p < l; ++p)
      (f = a[p]) && (u[p] = f);
    u.sort(e);
  }
  return new Qe(i, this._parents).order();
}
function Zl(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Jl() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function Ql() {
  var t = new Array(this.size()), e = -1;
  return this.each(function() {
    t[++e] = this;
  }), t;
}
function jl() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var r = t[e], i = 0, s = r.length; i < s; ++i) {
      var a = r[i];
      if (a) return a;
    }
  return null;
}
function eu() {
  var t = 0;
  return this.each(function() {
    ++t;
  }), t;
}
function tu() {
  return !this.node();
}
function nu(t) {
  for (var e = this._groups, n = 0, r = e.length; n < r; ++n)
    for (var i = e[n], s = 0, a = i.length, l; s < a; ++s)
      (l = i[s]) && t.call(l, l.__data__, s, i);
  return this;
}
function ru(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function iu(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function su(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function au(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function ou(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function lu(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function uu(t, e) {
  var n = Hn(t);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((e == null ? n.local ? iu : ru : typeof e == "function" ? n.local ? lu : ou : n.local ? au : su)(n, e));
}
function Zi(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function cu(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function hu(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function fu(t, e, n) {
  return function() {
    var r = e.apply(this, arguments);
    r == null ? this.style.removeProperty(t) : this.style.setProperty(t, r, n);
  };
}
function du(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? cu : typeof e == "function" ? fu : hu)(t, e, n ?? "")) : Lt(this.node(), t);
}
function Lt(t, e) {
  return t.style.getPropertyValue(e) || Zi(t).getComputedStyle(t, null).getPropertyValue(e);
}
function pu(t) {
  return function() {
    delete this[t];
  };
}
function gu(t, e) {
  return function() {
    this[t] = e;
  };
}
function _u(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function mu(t, e) {
  return arguments.length > 1 ? this.each((e == null ? pu : typeof e == "function" ? _u : gu)(t, e)) : this.node()[t];
}
function Ua(t) {
  return t.trim().split(/^|\s+/);
}
function Ji(t) {
  return t.classList || new $a(t);
}
function $a(t) {
  this._node = t, this._names = Ua(t.getAttribute("class") || "");
}
$a.prototype = {
  add: function(t) {
    var e = this._names.indexOf(t);
    e < 0 && (this._names.push(t), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(t) {
    var e = this._names.indexOf(t);
    e >= 0 && (this._names.splice(e, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(t) {
    return this._names.indexOf(t) >= 0;
  }
};
function Wa(t, e) {
  for (var n = Ji(t), r = -1, i = e.length; ++r < i; ) n.add(e[r]);
}
function qa(t, e) {
  for (var n = Ji(t), r = -1, i = e.length; ++r < i; ) n.remove(e[r]);
}
function bu(t) {
  return function() {
    Wa(this, t);
  };
}
function vu(t) {
  return function() {
    qa(this, t);
  };
}
function yu(t, e) {
  return function() {
    (e.apply(this, arguments) ? Wa : qa)(this, t);
  };
}
function wu(t, e) {
  var n = Ua(t + "");
  if (arguments.length < 2) {
    for (var r = Ji(this.node()), i = -1, s = n.length; ++i < s; ) if (!r.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? yu : e ? bu : vu)(n, e));
}
function xu() {
  this.textContent = "";
}
function Mu(t) {
  return function() {
    this.textContent = t;
  };
}
function Su(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function ku(t) {
  return arguments.length ? this.each(t == null ? xu : (typeof t == "function" ? Su : Mu)(t)) : this.node().textContent;
}
function Cu() {
  this.innerHTML = "";
}
function Eu(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Tu(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function zu(t) {
  return arguments.length ? this.each(t == null ? Cu : (typeof t == "function" ? Tu : Eu)(t)) : this.node().innerHTML;
}
function Nu() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Du() {
  return this.each(Nu);
}
function Au() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Iu() {
  return this.each(Au);
}
function Ou(t) {
  var e = typeof t == "function" ? t : Nr(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Lu() {
  return null;
}
function Pu(t, e) {
  var n = typeof t == "function" ? t : Nr(t), r = e == null ? Lu : typeof e == "function" ? e : Dr(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function Fu() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Bu() {
  return this.each(Fu);
}
function Ru() {
  return this.parentNode.insertBefore(this.cloneNode(!1), this.nextSibling);
}
function Uu() {
  return this.parentNode.insertBefore(this.cloneNode(!0), this.nextSibling);
}
function $u(t) {
  return this.select(t ? Uu : Ru);
}
function Wu(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
var Va = {}, ie = null;
if (typeof document < "u") {
  var qu = document.documentElement;
  "onmouseenter" in qu || (Va = { mouseenter: "mouseover", mouseleave: "mouseout" });
}
function Vu(t, e, n) {
  return t = Ha(t, e, n), function(r) {
    var i = r.relatedTarget;
    (!i || i !== this && !(i.compareDocumentPosition(this) & 8)) && t.call(this, r);
  };
}
function Ha(t, e, n) {
  return function(r) {
    var i = ie;
    ie = r;
    try {
      t.call(this, this.__data__, e, n);
    } finally {
      ie = i;
    }
  };
}
function Hu(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", r = e.indexOf(".");
    return r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), { type: e, name: n };
  });
}
function Yu(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, r = -1, i = e.length, s; n < i; ++n)
        s = e[n], (!t.type || s.type === t.type) && s.name === t.name ? this.removeEventListener(s.type, s.listener, s.capture) : e[++r] = s;
      ++r ? e.length = r : delete this.__on;
    }
  };
}
function Gu(t, e, n) {
  var r = Va.hasOwnProperty(t.type) ? Vu : Ha;
  return function(i, s, a) {
    var l = this.__on, u, f = r(e, s, a);
    if (l) {
      for (var p = 0, g = l.length; p < g; ++p)
        if ((u = l[p]).type === t.type && u.name === t.name) {
          this.removeEventListener(u.type, u.listener, u.capture), this.addEventListener(u.type, u.listener = f, u.capture = n), u.value = e;
          return;
        }
    }
    this.addEventListener(t.type, f, n), u = { type: t.type, name: t.name, value: e, listener: f, capture: n }, l ? l.push(u) : this.__on = [u];
  };
}
function Xu(t, e, n) {
  var r = Hu(t + ""), i, s = r.length, a;
  if (arguments.length < 2) {
    var l = this.node().__on;
    if (l) {
      for (var u = 0, f = l.length, p; u < f; ++u)
        for (i = 0, p = l[u]; i < s; ++i)
          if ((a = r[i]).type === p.type && a.name === p.name)
            return p.value;
    }
    return;
  }
  for (l = e ? Gu : Yu, n == null && (n = !1), i = 0; i < s; ++i) this.each(l(r[i], e, n));
  return this;
}
function Bn(t, e, n, r) {
  var i = ie;
  t.sourceEvent = ie, ie = t;
  try {
    return e.apply(n, r);
  } finally {
    ie = i;
  }
}
function Ya(t, e, n) {
  var r = Zi(t), i = r.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function Ku(t, e) {
  return function() {
    return Ya(this, t, e);
  };
}
function Zu(t, e) {
  return function() {
    return Ya(this, t, e.apply(this, arguments));
  };
}
function Ju(t, e) {
  return this.each((typeof e == "function" ? Zu : Ku)(t, e));
}
var Qi = [null];
function Qe(t, e) {
  this._groups = t, this._parents = e;
}
function qt() {
  return new Qe([[document.documentElement]], Qi);
}
Qe.prototype = qt.prototype = {
  constructor: Qe,
  select: Pl,
  selectAll: Bl,
  filter: Rl,
  data: Vl,
  enter: Ul,
  exit: Hl,
  join: Yl,
  merge: Gl,
  order: Xl,
  sort: Kl,
  call: Jl,
  nodes: Ql,
  node: jl,
  size: eu,
  empty: tu,
  each: nu,
  attr: uu,
  style: du,
  property: mu,
  classed: wu,
  text: ku,
  html: zu,
  raise: Du,
  lower: Iu,
  append: Ou,
  insert: Pu,
  remove: Bu,
  clone: $u,
  datum: Wu,
  on: Xu,
  dispatch: Ju
};
function Pe(t) {
  return typeof t == "string" ? new Qe([[document.querySelector(t)]], [document.documentElement]) : new Qe([[t]], Qi);
}
function Qu(t) {
  return Pe(Nr(t).call(document.documentElement));
}
var ju = 0;
function Ga() {
  return new Ei();
}
function Ei() {
  this._ = "@" + (++ju).toString(36);
}
Ei.prototype = Ga.prototype = {
  constructor: Ei,
  get: function(t) {
    for (var e = this._; !(e in t); ) if (!(t = t.parentNode)) return;
    return t[e];
  },
  set: function(t, e) {
    return t[this._] = e;
  },
  remove: function(t) {
    return this._ in t && delete t[this._];
  },
  toString: function() {
    return this._;
  }
};
function ji() {
  for (var t = ie, e; e = t.sourceEvent; ) t = e;
  return t;
}
function Ar(t, e) {
  var n = t.ownerSVGElement || t;
  if (n.createSVGPoint) {
    var r = n.createSVGPoint();
    return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
  }
  var i = t.getBoundingClientRect();
  return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
}
function st(t) {
  var e = ji();
  return e.changedTouches && (e = e.changedTouches[0]), Ar(t, e);
}
function ec(t) {
  return typeof t == "string" ? new Qe([document.querySelectorAll(t)], [document.documentElement]) : new Qe([t ?? []], Qi);
}
function gr(t, e, n) {
  arguments.length < 3 && (n = e, e = ji().changedTouches);
  for (var r = 0, i = e ? e.length : 0, s; r < i; ++r)
    if ((s = e[r]).identifier === n)
      return Ar(t, s);
  return null;
}
function tc(t, e) {
  e == null && (e = ji().touches);
  for (var n = 0, r = e ? e.length : 0, i = new Array(r); n < r; ++n)
    i[n] = Ar(t, e[n]);
  return i;
}
const nc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientPoint: Ar,
  create: Qu,
  creator: Nr,
  customEvent: Bn,
  get event() {
    return ie;
  },
  local: Ga,
  matcher: Ki,
  mouse: st,
  namespace: Hn,
  namespaces: Ci,
  select: Pe,
  selectAll: ec,
  selection: qt,
  selector: Dr,
  selectorAll: Xi,
  style: Lt,
  touch: gr,
  touches: tc,
  window: Zi
}, Symbol.toStringTag, { value: "Module" })), rc = /* @__PURE__ */ _n(nc);
var ar = { exports: {} }, ic = ar.exports, As;
function sc() {
  return As || (As = 1, (function(t) {
    /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
    var e = e || (function(n) {
      if (!(typeof n > "u" || typeof navigator < "u" && /MSIE [1-9]\./.test(navigator.userAgent))) {
        var r = n.document, i = function() {
          return n.URL || n.webkitURL || n;
        }, s = r.createElementNS("http://www.w3.org/1999/xhtml", "a"), a = "download" in s, l = function(b) {
          var x = new MouseEvent("click");
          b.dispatchEvent(x);
        }, u = /constructor/i.test(n.HTMLElement) || n.safari, f = /CriOS\/[\d]+/.test(navigator.userAgent), p = function(b) {
          (n.setImmediate || n.setTimeout)(function() {
            throw b;
          }, 0);
        }, g = "application/octet-stream", _ = 1e3 * 40, m = function(b) {
          var x = function() {
            typeof b == "string" ? i().revokeObjectURL(b) : b.remove();
          };
          setTimeout(x, _);
        }, T = function(b, x, C) {
          x = [].concat(x);
          for (var E = x.length; E--; ) {
            var M = b["on" + x[E]];
            if (typeof M == "function")
              try {
                M.call(b, C || b);
              } catch (D) {
                p(D);
              }
          }
        }, c = function(b) {
          return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(b.type) ? new Blob(["\uFEFF", b], { type: b.type }) : b;
        }, w = function(b, x, C) {
          C || (b = c(b));
          var E = this, M = b.type, D = M === g, $, G = function() {
            T(E, "writestart progress write writeend".split(" "));
          }, U = function() {
            if ((f || D && u) && n.FileReader) {
              var ae = new FileReader();
              ae.onloadend = function() {
                var V = f ? ae.result : ae.result.replace(/^data:[^;]*;/, "data:attachment/file;"), te = n.open(V, "_blank");
                te || (n.location.href = V), V = void 0, E.readyState = E.DONE, G();
              }, ae.readAsDataURL(b), E.readyState = E.INIT;
              return;
            }
            if ($ || ($ = i().createObjectURL(b)), D)
              n.location.href = $;
            else {
              var I = n.open($, "_blank");
              I || (n.location.href = $);
            }
            E.readyState = E.DONE, G(), m($);
          };
          if (E.readyState = E.INIT, a) {
            $ = i().createObjectURL(b), setTimeout(function() {
              s.href = $, s.download = x, l(s), G(), m($), E.readyState = E.DONE;
            });
            return;
          }
          U();
        }, z = w.prototype, P = function(b, x, C) {
          return new w(b, x || b.name || "download", C);
        };
        return typeof navigator < "u" && navigator.msSaveOrOpenBlob ? function(b, x, C) {
          return x = x || b.name || "download", C || (b = c(b)), navigator.msSaveOrOpenBlob(b, x);
        } : (z.abort = function() {
        }, z.readyState = z.INIT = 0, z.WRITING = 1, z.DONE = 2, z.error = z.onwritestart = z.onprogress = z.onwrite = z.onabort = z.onerror = z.onwriteend = null, P);
      }
    })(
      typeof self < "u" && self || typeof window < "u" && window || ic.content
    );
    t.exports && (t.exports.saveAs = e);
  })(ar)), ar.exports;
}
var ei, Is;
function Ir() {
  if (Is) return ei;
  Is = 1;
  var t = sl(), e = Oa(), n = Ns.json, r = Ns.text, i = Al.csvParseRows, s = rc.selection;
  try {
    var a = sc().saveAs;
  } catch {
    console.warn("Not a browser, so FileSaver.js not available.");
  }
  ei = {
    set_options: u,
    remove_child_nodes: f,
    load_css: p,
    load_files: m,
    load_the_file: _,
    make_class: T,
    class_with_optional_new: c,
    setup_defs: w,
    draw_an_object: z,
    draw_a_nested_object: P,
    make_array: b,
    make_array_ref: x,
    compare_arrays: C,
    arrayToObject: E,
    clone: M,
    extend: D,
    uniqueConcat: $,
    unique_strings_array: G,
    debounce: U,
    object_slice_for_ids: ae,
    object_slice_for_ids_ref: I,
    c_plus_c: V,
    c_minus_c: te,
    c_times_scalar: ne,
    download_json: J,
    load_json: he,
    load_json_or_csv: me,
    downloadSvg: ge,
    downloadPng: re,
    rotate_coords_recursive: oe,
    rotate_coords: le,
    get_angle: fe,
    to_degrees: be,
    angleNorm: K,
    to_radians: H,
    to_radians_norm: Z,
    angle_for_event: Q,
    distance: W,
    check_undefined: Me,
    compartmentalize: _e,
    decompartmentalize: ke,
    mean: Ce,
    median: h,
    quartiles: v,
    random_characters: A,
    generate_map_id: N,
    check_for_parent_tag: R,
    name_to_url: F,
    get_document: Y,
    get_window: ue,
    d3_transform_catch: ye
    // check_browser: check_browser
  };
  function l() {
    try {
      var O = !!new Blob();
    } catch {
      alert("Blob not supported");
    }
  }
  function u(O, B, X) {
    if (O == null)
      return B;
    var ee = {};
    for (var pe in B) {
      var Ee = pe in O && O[pe] !== null && O[pe] !== void 0, Te = Ee ? O[pe] : B[pe];
      X && pe in X && (Te = parseFloat(Te), isNaN(Te) && (Ee ? (console.warn("Bad float for option " + pe), Te = parseFloat(B[pe]), isNaN(Te) && (console.warn("Bad float for default " + pe), Te = null)) : (console.warn("Bad float for default " + pe), Te = null))), ee[pe] = Te;
    }
    return ee;
  }
  function f(O) {
    for (var B = O.node(); B.hasChildNodes(); )
      B.removeChild(B.lastChild);
  }
  function p(O, B) {
    var X = "";
    return O && r(O, function(ee, pe) {
      ee && console.warn(ee), X = pe, B(X);
    }), !1;
  }
  function g(O, B) {
    return O.indexOf(B, O.length - B.length) !== -1;
  }
  function _(O, B, X, ee) {
    if (ee) {
      B && console.warn("File " + B + " overridden by value."), X.call(O, null, ee);
      return;
    }
    if (!B) {
      X.call(O, "No filename", null);
      return;
    }
    g(B, "json") ? n(B, function(pe, Ee) {
      X.call(O, pe, Ee);
    }) : g(B, "css") ? r(B, function(pe, Ee) {
      X.call(O, pe, Ee);
    }) : X.call(O, "Unrecognized file type", null);
  }
  function m(O, B, X) {
    B.length === 0 && X.call(O);
    for (var ee = -1, pe = B.length; ++ee < B.length; )
      _(
        O,
        B[ee].file,
        (function(Ee, Te) {
          this.call(O, Ee, Te), --pe || X.call(O);
        }).bind(B[ee].callback),
        B[ee].value
      );
  }
  function T() {
    var O, B = function(X) {
      if (this instanceof B)
        typeof this.init == "function" && this.init.apply(this, O ? X : arguments);
      else {
        O = !0;
        var ee = new B(arguments);
        return O = !1, ee;
      }
    };
    return B;
  }
  function c(O) {
    return new Proxy(O, {
      apply(B, X, ee) {
        return new B(...ee);
      }
    });
  }
  function w(O, B) {
    O.select("defs").remove();
    var X = O.append("defs"), ee = X.node();
    return ee.parentNode.insertBefore(ee, ee.parentNode.firstChild), X.append("style").attr("type", "text/css").text(B), X;
  }
  function z(O, B, X, ee, pe, Ee, Te, Le) {
    var We = {};
    for (var Ue in ee)
      ee[Ue] === void 0 ? console.warn("Undefined value for id " + Ue + " in object. Ignoring.") : We[Ue] = ee[Ue];
    var He = O.select(B).selectAll(X).data(
      x(We, pe),
      function(St) {
        return St[pe];
      }
    ), Dt = Ee ? Ee(He.enter()).merge(He) : He;
    Te && Dt.call(Te), Le && He.exit().call(Le);
  }
  function P(O, B, X, ee, pe, Ee, Te) {
    var Le = O.selectAll(B).data(
      function(Ue) {
        return x(Ue[X], ee);
      },
      function(Ue) {
        return Ue[ee];
      }
    ), We = pe ? pe(Le.enter()).merge(Le) : Le;
    Ee && We.call(Ee), Te && Le.exit().call(Te);
  }
  function b(O, B) {
    var X = [];
    for (var ee in O) {
      var pe = M(O[ee]);
      pe[B] = ee, X.push(pe);
    }
    return X;
  }
  function x(O, B) {
    var X = [];
    for (var ee in O) {
      var pe = O[ee];
      pe[B] = ee, X.push(pe);
    }
    return X;
  }
  function C(O, B) {
    if (!O || !B || O.length != B.length) return !1;
    for (var X = 0, ee = O.length; X < ee; X++)
      if (O[X] != B[X])
        return !1;
    return !0;
  }
  function E(O) {
    const B = {};
    for (let Le = 0, We = O.length; Le < We; Le++) {
      const Ue = O[Le], He = Object.keys(Ue);
      for (var X = 0, ee = He.length; X < ee; X++) {
        var pe = He[X];
        if (pe in B)
          B[pe][Le] = Ue[pe];
        else {
          for (var Ee = [], Te = 0; Te < We; Te++)
            Ee[Te] = null;
          Ee[Le] = Ue[pe], B[pe] = Ee;
        }
      }
    }
    return B;
  }
  function M(O) {
    return e.isArray(O) ? e.map(O, function(B) {
      return M(B);
    }) : e.isObject(O) ? e.mapObject(O, function(B, X) {
      return M(B);
    }) : O;
  }
  function D(O, B, X) {
    X === void 0 && (X = !1);
    for (var ee in B)
      if (!(ee in O) || X)
        O[ee] = B[ee];
      else
        throw new Error("Attribute " + ee + " already in object.");
  }
  function $(O) {
    const B = [];
    return O.forEach((X) => {
      X.forEach((ee) => {
        B.indexOf(ee) < 0 && B.push(ee);
      });
    }), B;
  }
  function G(O) {
    for (var B = [], X = 0, ee = O.length; X < ee; X++)
      B.indexOf(O[X]) === -1 && B.push(O[X]);
    return B;
  }
  function U(O, B, X) {
    var ee;
    return function() {
      var pe = this, Ee = arguments, Te = function() {
        ee = null, X || O.apply(pe, Ee);
      }, Le = X && !ee;
      clearTimeout(ee), ee = setTimeout(Te, B), Le && O.apply(pe, Ee);
    };
  }
  function ae(O, B) {
    for (var X = {}, ee = -1; ++ee < B.length; )
      X[B[ee]] = M(O[B[ee]]);
    return B.length !== Object.keys(X).length && console.warn("did not find correct reaction subset"), X;
  }
  function I(O, B) {
    for (var X = {}, ee = -1; ++ee < B.length; )
      X[B[ee]] = O[B[ee]];
    return B.length !== Object.keys(X).length && console.warn("did not find correct reaction subset"), X;
  }
  function V(O, B) {
    return O === null || B === null || O === void 0 || B === void 0 ? null : {
      x: O.x + B.x,
      y: O.y + B.y
    };
  }
  function te(O, B) {
    return O === null || B === null || O === void 0 || B === void 0 ? null : {
      x: O.x - B.x,
      y: O.y - B.y
    };
  }
  function ne(O, B) {
    return {
      x: O.x * B,
      y: O.y * B
    };
  }
  function J(O, B) {
    l();
    var X = JSON.stringify(O), ee = new Blob([X], { type: "application/json" });
    a(ee, B + ".json");
  }
  function he(O, B, X, ee) {
    window.File && window.FileReader && window.FileList && window.Blob || B("The File APIs are not fully supported in this browser.", null);
    var pe = new window.FileReader();
    if (pe.onload = function(Ee) {
      var Te = Ee.target.result, Le;
      try {
        Le = JSON.parse(Te);
      } catch (We) {
        B(We, null);
        return;
      }
      B(null, Le);
    }, X != null)
      try {
        X();
      } catch (Ee) {
        console.warn(Ee);
      }
    pe.onabort = function(Ee) {
      try {
        ee();
      } catch (Te) {
        console.warn(Te);
      }
    }, pe.onerror = function(Ee) {
      try {
        ee();
      } catch (Te) {
        console.warn(Te);
      }
    }, pe.readAsText(O);
  }
  function me(O, B, X, ee, pe, Ee) {
    var Te = function(We) {
      var Ue = We.target.result, He, Dt;
      try {
        He = JSON.parse(Ue);
      } catch (St) {
        Dt = "JSON error: " + St;
        try {
          He = B(i(Ue));
        } catch (Vr) {
          X(Dt + `
CSV error: ` + Vr, null);
          return;
        }
      }
      X(null, He);
    };
    if (Ee != null)
      return console.warn("Debugging load_json_or_csv"), Te(Ee);
    window.File && window.FileReader && window.FileList && window.Blob || X("The File APIs are not fully supported in this browser.", null);
    var Le = new window.FileReader();
    if (ee != null)
      try {
        ee();
      } catch (We) {
        console.warn(We);
      }
    Le.onabort = function(We) {
      try {
        pe();
      } catch (Ue) {
        console.warn(Ue);
      }
    }, Le.onerror = function(We) {
      try {
        pe();
      } catch (Ue) {
        console.warn(Ue);
      }
    }, Le.onload = Te, Le.readAsText(O);
  }
  function ge(O, B, X) {
    l();
    var ee = new XMLSerializer().serializeToString(B.node());
    X && (ee = t.xml(ee)), ee = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
` + ee;
    var pe = new Blob([ee], { type: "image/svg+xml" });
    a(pe, O + ".svg");
  }
  function re(O, B) {
    l();
    var X = new XMLSerializer().serializeToString(B.node());
    X = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
` + X;
    var ee = document.createElement("canvas"), pe = ee.getContext("2d"), Ee = B.node().getBBox(), Te = Ee.width + Ee.x, Le = Ee.height + Ee.y;
    Te < 1e4 && Le < 1e4 ? (ee.width = Te, ee.height = Le) : ee.width > ee.height ? (ee.width = 1e4, ee.height = 1e4 * (Le / Te)) : (ee.width = 1e4 * (Te / Le), ee.height = 1e4);
    var We = new Image();
    We.src = "data:image/svg+xml;base64," + btoa(X), We.onload = function() {
      pe.fillStyle = "#FFF", pe.fillRect(0, 0, ee.width, ee.height), pe.drawImage(We, 0, 0, ee.width, ee.height), ee.toBlob(function(Ue) {
        a(Ue, O + ".png");
      });
    };
  }
  function oe(O, B, X) {
    return O.map(function(ee) {
      return le(ee, B, X);
    });
  }
  function le(O, B, X) {
    var ee = Math.cos(-B) * (O.x - X.x) + Math.sin(-B) * (O.y - X.y) + X.x - O.x, pe = -Math.sin(-B) * (O.x - X.x) + Math.cos(-B) * (O.y - X.y) + X.y - O.y;
    return { x: ee, y: pe };
  }
  function fe(O) {
    var B = O[1].x - O[0].x, X = O[1].y - O[0].y;
    return B === 0 && X >= 0 ? Math.PI / 2 : B === 0 && X < 0 ? 3 * Math.PI / 2 : B >= 0 && X >= 0 ? Math.atan(X / B) : B >= 0 ? Math.atan(X / B) + 2 * Math.PI : Math.atan(X / B) + Math.PI;
  }
  function be(O) {
    return O * 180 / Math.PI;
  }
  function K(O) {
    return O < -Math.PI ? O + Math.floor((O - Math.PI) / (-2 * Math.PI)) * 2 * Math.PI : O > Math.PI ? O - Math.floor((O + Math.PI) / (2 * Math.PI)) * 2 * Math.PI : O;
  }
  function H(O) {
    return Math.PI / 180 * O;
  }
  function Z(O) {
    var B = H(O);
    return K(B);
  }
  function Q(O, B, X) {
    var ee = Math.atan2(B.x - X.x, X.y - B.y), pe = Math.atan2(
      B.x - X.x + O.x,
      X.y - B.y - O.y
    ), Ee = pe - ee;
    return Ee;
  }
  function W(O, B) {
    return Math.sqrt(Math.pow(B.y - O.y, 2) + Math.pow(B.x - O.x, 2));
  }
  function Me(O, B) {
    B.forEach(function(X, ee) {
      O[ee] === void 0 && console.error(`Argument is undefined: ${B[ee]}`);
    });
  }
  function _e(O, B) {
    return `${O}_${B}`;
  }
  function ke(O) {
    var B = /(.*)_([a-z0-9]{1,2})$/, X = B.exec(O);
    return X !== null ? X.slice(1, 3) : [O, null];
  }
  function Ce(O) {
    var B = O.reduce(function(ee, pe) {
      return ee + pe;
    }), X = B / O.length;
    return X;
  }
  function h(O) {
    O.sort(function(X, ee) {
      return X - ee;
    });
    var B = Math.floor(O.length / 2);
    return O.length % 2 == 1 ? O[B] : (O[B - 1] + O[B]) / 2;
  }
  function v(O) {
    O.sort(function(X, ee) {
      return X - ee;
    });
    var B = Math.floor(O.length / 2);
    return O.length === 1 ? [
      O[0],
      O[0],
      O[0]
    ] : O.length % 2 === 1 ? [
      h(O.slice(0, B)),
      O[B],
      h(O.slice(B + 1))
    ] : [
      h(O.slice(0, B)),
      (O[B - 1] + O[B]) / 2,
      h(O.slice(B))
    ];
  }
  function A(O) {
    for (var B = "", X = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", ee = 0; ee < O; ee++)
      B += X.charAt(Math.floor(Math.random() * X.length));
    return B;
  }
  function N() {
    return A(12);
  }
  function R(O, B) {
    for (O instanceof s && (O = O.node()); O.parentNode !== null; )
      if (O = O.parentNode, O.tagName !== void 0 && O.tagName.toLowerCase() === B.toLowerCase())
        return !0;
    return !1;
  }
  function F(O, B) {
    return B != null && (B = B.replace(/^\/|\/$/g, ""), O = [B, O].join("/")), O.replace(/^\/|\/$/g, "") + ".json";
  }
  function Y(O) {
    return O.ownerDocument;
  }
  function ue(O) {
    return Y(O).defaultView;
  }
  function ye(O) {
    if (O.indexOf("skew") !== -1 || O.indexOf("matrix") !== -1)
      throw new Error("d3_transform_catch does not work with skew or matrix");
    var B = /translate\s*\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/.exec(O), X = e.isNull(B), ee = X ? 0 : Number(B[1]), pe = X ? 0 : Number(B[2]), Ee = /rotate\s*\(\s*([0-9.-]+)\s*\)/.exec(O), Te = e.isNull(Ee), Le = Te ? 0 : Number(Ee[1]), We = /scale\s*\(\s*([0-9.-]+)\s*\)/.exec(O), Ue = e.isNull(We), He = Ue ? 0 : Number(We[1]);
    return { translate: [ee, pe], rotate: Le, scale: He };
  }
  return ei;
}
var se = Ir();
const Be = /* @__PURE__ */ Tt(se);
var ti, Os;
function ac() {
  if (Os) return ti;
  Os = 1;
  var t = Ir(), e = t.make_class();
  e.prototype = {
    init: n,
    is_visible: r,
    place: i,
    hide: s
  }, ti = e;
  function n(a, l, u = { x: 0, y: 0 }, f = !0) {
    this.div = a, this.map = l, this.displacement = u, this.shouldReposition = f, this.visible = !0, this.hide();
  }
  function r() {
    return this.visible;
  }
  function i(a) {
    this.div.style("display", null);
    var l = this.map.zoomContainer.windowTranslate, u = this.map.zoomContainer.windowScale, f = this.map.get_size();
    if (this.shouldReposition) {
      var p = Math.max(
        20,
        Math.min(
          f.width - 270,
          u * a.x + l.x - this.displacement.x
        )
      ), g = Math.max(
        20,
        Math.min(
          f.height - 40,
          u * a.y + l.y - this.displacement.y
        )
      );
      this.div.style("position", "absolute").style("display", "block").style("left", `${p}px`).style("top", `${g}px`);
    } else
      this.div.style("position", "absolute").style("display", "block").style("left", `${u * a.x + l.x - this.displacement.x}px`).style("top", `${u * a.y + l.y - this.displacement.y}px`);
    this.visible = !0;
  }
  function s() {
    this.visible && (this.div.style("display", "none"), this.visible = !1);
  }
  return ti;
}
var oc = ac();
const es = /* @__PURE__ */ Tt(oc);
/**
 * @license
 *
 * complete.ly 1.0.0
 * MIT Licensing
 * Copyright (c) 2013 Lorenzo Puccetti
 *
 * This Software shall be used for doing good things, not bad things.
 *
 *
 * Modified by Zachary King (c) 2014.
 *
 **/
function lc(t, e) {
  const n = se.get_document(t), r = se.get_window(t);
  e = e || {}, e.fontSize = e.fontSize || "13px", e.fontFamily = e.fontFamily || "sans-serif", e.promptInnerHTML = e.promptInnerHTML || "", e.color = e.color || "#333", e.hintColor = e.hintColor || "#aaa", e.backgroundColor = e.backgroundColor || "#fff", e.dropDownBorderColor = e.dropDownBorderColor || "#aaa", e.dropDownZIndex = e.dropDownZIndex || "100", e.dropDownOnHoverBackgroundColor = e.dropDownOnHoverBackgroundColor || "#ddd";
  var i = n.createElement("input");
  i.type = "text", i.spellcheck = !1, i.style.fontSize = e.fontSize, i.style.fontFamily = e.fontFamily, i.style.color = e.color, i.style.backgroundColor = e.backgroundColor, i.style.width = "100%", i.style.outline = "0", i.style.border = "0", i.style.margin = "0", i.style.padding = "0";
  var s = i.cloneNode();
  s.disabled = "", s.style.position = "absolute", s.style.top = "0", s.style.left = "0", s.style.borderColor = "transparent", s.style.boxShadow = "none", s.style.color = e.hintColor, i.style.backgroundColor = "transparent", i.style.verticalAlign = "top", i.style.position = "relative";
  var a = n.createElement("div");
  a.style.position = "relative", a.style.outline = "0", a.style.border = "0", a.style.margin = "0", a.style.padding = "0";
  var l = n.createElement("div");
  if (l.style.position = "absolute", l.style.outline = "0", l.style.margin = "0", l.style.padding = "0", l.style.border = "0", l.style.fontSize = e.fontSize, l.style.fontFamily = e.fontFamily, l.style.color = e.color, l.style.backgroundColor = e.backgroundColor, l.style.top = "0", l.style.left = "0", l.style.overflow = "hidden", l.innerHTML = e.promptInnerHTML, l.style.background = "transparent", n.body === void 0)
    throw "thisDocument.body is undefined. The library was wired up incorrectly.";
  n.body.appendChild(l);
  var u = l.getBoundingClientRect().right;
  a.appendChild(l), l.style.visibility = "visible", l.style.left = "-" + u + "px", a.style.marginLeft = u + "px", a.appendChild(s), a.appendChild(i);
  var f = n.createElement("div");
  f.style.position = "absolute", f.style.visibility = "hidden", f.style.outline = "0", f.style.margin = "0", f.style.padding = "0", f.style.textAlign = "left", f.style.fontSize = e.fontSize, f.style.fontFamily = e.fontFamily, f.style.backgroundColor = e.backgroundColor, f.style.zIndex = e.dropDownZIndex, f.style.cursor = "default", f.style.borderStyle = "solid", f.style.borderWidth = "1px", f.style.borderColor = e.dropDownBorderColor, f.style.overflowX = "hidden", f.style.whiteSpace = "pre", f.style.overflowY = "scroll";
  var p = function(b) {
    var x = [], C = 0, E = -1, M = null, D = function() {
      this.style.outline = "1px solid #ddd";
    }, $ = function() {
      this.style.outline = "0";
    }, G = function(ae) {
      ae.preventDefault(), U.onmouseselection(this.id);
    }, U = {
      hide: function() {
        b.style.visibility = "hidden";
      },
      refresh: function(ae, I) {
        b.style.visibility = "hidden", C = 0, b.innerHTML = "";
        var V = r.innerHeight || n.documentElement.clientHeight, te = b.parentNode.getBoundingClientRect(), ne = te.top - 6, J = V - te.bottom - 6;
        x = [];
        for (var he = 0; he < I.length; he++) {
          var me = I[he].matches.filter(function(oe) {
            return oe.toLowerCase().indexOf(ae.toLowerCase()) == 0;
          });
          if (me.length != 0) {
            var ge = n.createElement("div");
            if (ge.style.color = e.color, ge.onmouseover = D, ge.onmouseout = $, ge.onmousedown = function(oe) {
              oe.preventDefault();
            }, ge.ondblclick = G, ge.__hint = me[0], ge.id = I[he].id, ge.innerHTML = I[he].html, x.push(ge), b.appendChild(ge), x.length >= c.display_limit) {
              var re = n.createElement("div");
              re.innerHTML = " " + (I.length - x.length) + " more", x.push(re), b.appendChild(re);
              break;
            }
          }
        }
        x.length !== 0 && (U.highlight(0), ne > J * 3 ? (b.style.maxHeight = ne + "px", b.style.top = "", b.style.bottom = "100%") : (b.style.top = "100%", b.style.bottom = "", b.style.maxHeight = J + "px"), b.style.visibility = "visible");
      },
      highlight: function(ae) {
        E != -1 && x[E] && (x[E].style.backgroundColor = e.backgroundColor), x[ae].style.backgroundColor = e.dropDownOnHoverBackgroundColor, E = ae, M = x[ae];
      },
      // moves the selection either up or down (unless it's not
      // possible) step is either +1 or -1.
      move: function(ae) {
        return b.style.visibility === "hidden" ? "" : (C + ae === -1 || C + ae === x.length || (C += ae, U.highlight(C)), x[C].__hint);
      },
      onmouseselection: function() {
      },
      get_current_row: function() {
        return M;
      }
    };
    return U;
  }, g = p(f);
  g.onmouseselection = function(b) {
    c.onEnter(b), c.input.focus();
  }, a.appendChild(f), t.appendChild(a);
  var _, m;
  function T(b) {
    return _ === void 0 && (_ = n.createElement("span"), _.style.visibility = "hidden", _.style.position = "fixed", _.style.outline = "0", _.style.margin = "0", _.style.padding = "0", _.style.border = "0", _.style.left = "0", _.style.whiteSpace = "pre", _.style.fontSize = e.fontSize, _.style.fontFamily = e.fontFamily, _.style.fontWeight = "normal", n.body.appendChild(_)), _.innerHTML = String(b).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), _.getBoundingClientRect().right;
  }
  var c = {
    get_hint: function(b) {
      return b;
    },
    display_limit: 1e3,
    onArrowDown: function() {
    },
    // defaults to no action.
    onArrowUp: function() {
    },
    // defaults to no action.
    onEnter: function() {
    },
    // defaults to no action.
    onTab: function() {
    },
    // defaults to no action.
    onChange: function() {
      c.repaint();
    },
    // defaults to repainting.
    startFrom: 0,
    options: [],
    // Only to allow easy access to the HTML elements to the final user
    // (possibly for minor customizations)
    wrapper: a,
    input: i,
    hint: s,
    dropDown: f,
    prompt: l,
    setText: function(b) {
      s.value = b, i.value = b;
    },
    getText: function() {
      return i.value;
    },
    hideDropDown: function() {
      g.hide();
    },
    repaint: function() {
      var b = i.value, x = c.startFrom, C = c.options, E = C.length, M = b.substring(x);
      m = b.substring(0, x), s.value = "";
      for (var D = 0; D < E; D++) {
        var $ = C[D].matches.filter(function(G) {
          return G.toLowerCase().indexOf(M.toLowerCase()) == 0;
        });
        if ($.length != 0) {
          s.value = c.get_hint($[0]);
          break;
        }
      }
      f.style.left = T(m) + "px", g.refresh(M, c.options);
    }
  }, w, z = function(b, x) {
    w = b.value;
    var C = function() {
      var E = b.value;
      w !== E && (w = E, x(E));
    };
    b.addEventListener("input", C, !1), b.addEventListener("keyup", C, !1), b.addEventListener("change", C, !1);
  };
  z(i, function(b) {
    c.onChange(b), c.repaint();
  });
  var P = function(b) {
    b = b || r.event;
    var x = b.keyCode;
    if (x != 33 && x != 34) {
      if (x == 39 || x == 35 || x == 9) {
        if (x == 9 && (b.preventDefault(), b.stopPropagation(), s.value.length == 0 && c.onTab()), s.value.length > 0) {
          i.value = s.value;
          var C = w != i.value;
          w = i.value, C && c.onChange(i.value);
        }
        return;
      }
      if (x == 13) {
        var E = g.get_current_row().id;
        c.onEnter(E);
        return;
      }
      if (x == 40) {
        var M = g.move(1);
        M == "" && c.onArrowDown(), s.value = c.get_hint(M);
        return;
      }
      if (x == 38) {
        var M = g.move(-1);
        M == "" && c.onArrowUp(), s.value = c.get_hint(M), b.preventDefault(), b.stopPropagation();
        return;
      }
      s.value = "";
    }
  };
  return i.addEventListener("keydown", P, !1), c;
}
function ni() {
  ie.stopImmediatePropagation();
}
function sn() {
  ie.preventDefault(), ie.stopImmediatePropagation();
}
function ts(t) {
  var e = t.document.documentElement, n = Pe(t).on("dragstart.drag", sn, !0);
  "onselectstart" in e ? n.on("selectstart.drag", sn, !0) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function ns(t, e) {
  var n = t.document.documentElement, r = Pe(t).on("dragstart.drag", null);
  e && (r.on("click.drag", sn, !0), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
function Zn(t) {
  return function() {
    return t;
  };
}
function Ti(t, e, n, r, i, s, a, l, u, f) {
  this.target = t, this.type = e, this.subject = n, this.identifier = r, this.active = i, this.x = s, this.y = a, this.dx = l, this.dy = u, this._ = f;
}
Ti.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function uc() {
  return !ie.button;
}
function cc() {
  return this.parentNode;
}
function hc(t) {
  return t ?? { x: ie.x, y: ie.y };
}
function fc() {
  return "ontouchstart" in this;
}
function ut() {
  var t = uc, e = cc, n = hc, r = fc, i = {}, s = mn("start", "drag", "end"), a = 0, l, u, f, p, g = 0;
  function _(x) {
    x.on("mousedown.drag", m).filter(r).on("touchstart.drag", w).on("touchmove.drag", z).on("touchend.drag touchcancel.drag", P).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function m() {
    if (!(p || !t.apply(this, arguments))) {
      var x = b("mouse", e.apply(this, arguments), st, this, arguments);
      x && (Pe(ie.view).on("mousemove.drag", T, !0).on("mouseup.drag", c, !0), ts(ie.view), ni(), f = !1, l = ie.clientX, u = ie.clientY, x("start"));
    }
  }
  function T() {
    if (sn(), !f) {
      var x = ie.clientX - l, C = ie.clientY - u;
      f = x * x + C * C > g;
    }
    i.mouse("drag");
  }
  function c() {
    Pe(ie.view).on("mousemove.drag mouseup.drag", null), ns(ie.view, f), sn(), i.mouse("end");
  }
  function w() {
    if (t.apply(this, arguments)) {
      var x = ie.changedTouches, C = e.apply(this, arguments), E = x.length, M, D;
      for (M = 0; M < E; ++M)
        (D = b(x[M].identifier, C, gr, this, arguments)) && (ni(), D("start"));
    }
  }
  function z() {
    var x = ie.changedTouches, C = x.length, E, M;
    for (E = 0; E < C; ++E)
      (M = i[x[E].identifier]) && (sn(), M("drag"));
  }
  function P() {
    var x = ie.changedTouches, C = x.length, E, M;
    for (p && clearTimeout(p), p = setTimeout(function() {
      p = null;
    }, 500), E = 0; E < C; ++E)
      (M = i[x[E].identifier]) && (ni(), M("end"));
  }
  function b(x, C, E, M, D) {
    var $ = E(C, x), G, U, ae, I = s.copy();
    if (Bn(new Ti(_, "beforestart", G, x, a, $[0], $[1], 0, 0, I), function() {
      return (ie.subject = G = n.apply(M, D)) == null ? !1 : (U = G.x - $[0] || 0, ae = G.y - $[1] || 0, !0);
    }))
      return function V(te) {
        var ne = $, J;
        switch (te) {
          case "start":
            i[x] = V, J = a++;
            break;
          case "end":
            delete i[x], --a;
          // nobreak
          case "drag":
            $ = E(C, x), J = a;
            break;
        }
        Bn(new Ti(_, te, G, x, J, $[0] + U, $[1] + ae, $[0] - ne[0], $[1] - ne[1], I), I.apply, I, [te, M, D]);
      };
  }
  return _.filter = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : Zn(!!x), _) : t;
  }, _.container = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : Zn(x), _) : e;
  }, _.subject = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : Zn(x), _) : n;
  }, _.touchable = function(x) {
    return arguments.length ? (r = typeof x == "function" ? x : Zn(!!x), _) : r;
  }, _.on = function() {
    var x = s.on.apply(s, arguments);
    return x === s ? _ : x;
  }, _.clickDistance = function(x) {
    return arguments.length ? (g = (x = +x) * x, _) : Math.sqrt(g);
  }, _;
}
class dc {
  constructor(e) {
    this.arrowContainer = e.append("g").attr("id", "direction-arrow-container").attr("transform", "translate(0,0)rotate(0)"), this.arrow = this.arrowContainer.append("path").classed("direction-arrow", !0).attr("d", "M0 -5 L0 5 L20 5 L20 10 L30 0 L20 -10 L20 -5 Z").style("visibility", "hidden").attr("transform", "translate(30,0)scale(2.5)"), this.sel = e, this.center = { x: 0, y: 0 }, this._setupDrag(), this.dragging = !1, this.isVisible = !1, this.show();
  }
  /**
   * Move the arrow to coords.
   */
  setLocation(e) {
    this.center = e;
    var n = se.d3_transform_catch(this.arrowContainer.attr("transform"));
    this.arrowContainer.attr(
      "transform",
      "translate(" + e.x + "," + e.y + ")rotate(" + n.rotate + ")"
    );
  }
  /**
   * Rotate the arrow to rotation.
   */
  setRotation(e) {
    var n = se.d3_transform_catch(this.arrowContainer.attr("transform"));
    this.arrowContainer.attr(
      "transform",
      "translate(" + n.translate + ")rotate(" + e + ")"
    );
  }
  /**
   * Displace the arrow rotation by a set amount.
   */
  displaceRotation(e) {
    var n = se.d3_transform_catch(this.arrowContainer.attr("transform"));
    this.arrowContainer.attr(
      "transform",
      "translate(" + n.translate + ")rotate(" + (n.rotate + e) + ")"
    );
  }
  /**
   * Returns the arrow rotation.
   */
  getRotation() {
    return se.d3_transform_catch(this.arrowContainer.attr("transform")).rotate;
  }
  toggle(e) {
    e === void 0 ? this.isVisible = !this.isVisible : this.isVisible = e, this.arrow.style("visibility", this.isVisible ? "visible" : "hidden");
  }
  show() {
    this.toggle(!0);
  }
  hide() {
    this.toggle(!1);
  }
  right() {
    this.setRotation(0);
  }
  down() {
    this.setRotation(90);
  }
  left() {
    this.setRotation(180);
  }
  up() {
    this.setRotation(270);
  }
  _setupDrag() {
    var e = ut().on("start", (n) => {
      ie.sourceEvent.stopPropagation(), this.dragging = !0;
    }).on("drag", (n) => {
      const r = {
        x: ie.dx,
        y: ie.dy
      }, i = {
        x: st(this.sel.node())[0],
        y: st(this.sel.node())[1]
      }, s = se.angle_for_event(
        r,
        i,
        this.center
      );
      this.displaceRotation(se.to_degrees(s));
    }).on("end", (n) => {
      setTimeout(() => {
        this.dragging = !1;
      }, 200);
    });
    this.arrowContainer.call(e);
  }
}
var pc = Oa();
const ce = /* @__PURE__ */ Tt(pc);
function _r(t, e) {
  if ((n = (t = e ? t.toExponential(e - 1) : t.toExponential()).indexOf("e")) < 0) return null;
  var n, r = t.slice(0, n);
  return [
    r.length > 1 ? r[0] + r.slice(2) : r,
    +t.slice(n + 1)
  ];
}
function cn(t) {
  return t = _r(Math.abs(t)), t ? t[1] : NaN;
}
function gc(t, e) {
  return function(n, r) {
    for (var i = n.length, s = [], a = 0, l = t[0], u = 0; i > 0 && l > 0 && (u + l + 1 > r && (l = Math.max(1, r - u)), s.push(n.substring(i -= l, i + l)), !((u += l + 1) > r)); )
      l = t[a = (a + 1) % t.length];
    return s.reverse().join(e);
  };
}
function _c(t) {
  return function(e) {
    return e.replace(/[0-9]/g, function(n) {
      return t[+n];
    });
  };
}
var mc = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Rn(t) {
  return new rs(t);
}
Rn.prototype = rs.prototype;
function rs(t) {
  if (!(e = mc.exec(t))) throw new Error("invalid format: " + t);
  var e;
  this.fill = e[1] || " ", this.align = e[2] || ">", this.sign = e[3] || "-", this.symbol = e[4] || "", this.zero = !!e[5], this.width = e[6] && +e[6], this.comma = !!e[7], this.precision = e[8] && +e[8].slice(1), this.trim = !!e[9], this.type = e[10] || "";
}
rs.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width == null ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function bc(t) {
  e: for (var e = t.length, n = 1, r = -1, i; n < e; ++n)
    switch (t[n]) {
      case ".":
        r = i = n;
        break;
      case "0":
        r === 0 && (r = n), i = n;
        break;
      default:
        if (r > 0) {
          if (!+t[n]) break e;
          r = 0;
        }
        break;
    }
  return r > 0 ? t.slice(0, r) + t.slice(i + 1) : t;
}
var Xa;
function vc(t, e) {
  var n = _r(t, e);
  if (!n) return t + "";
  var r = n[0], i = n[1], s = i - (Xa = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, a = r.length;
  return s === a ? r : s > a ? r + new Array(s - a + 1).join("0") : s > 0 ? r.slice(0, s) + "." + r.slice(s) : "0." + new Array(1 - s).join("0") + _r(t, Math.max(0, e + s - 1))[0];
}
function Ls(t, e) {
  var n = _r(t, e);
  if (!n) return t + "";
  var r = n[0], i = n[1];
  return i < 0 ? "0." + new Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + new Array(i - r.length + 2).join("0");
}
const Ps = {
  "%": function(t, e) {
    return (t * 100).toFixed(e);
  },
  b: function(t) {
    return Math.round(t).toString(2);
  },
  c: function(t) {
    return t + "";
  },
  d: function(t) {
    return Math.round(t).toString(10);
  },
  e: function(t, e) {
    return t.toExponential(e);
  },
  f: function(t, e) {
    return t.toFixed(e);
  },
  g: function(t, e) {
    return t.toPrecision(e);
  },
  o: function(t) {
    return Math.round(t).toString(8);
  },
  p: function(t, e) {
    return Ls(t * 100, e);
  },
  r: Ls,
  s: vc,
  X: function(t) {
    return Math.round(t).toString(16).toUpperCase();
  },
  x: function(t) {
    return Math.round(t).toString(16);
  }
};
function Fs(t) {
  return t;
}
var Bs = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function Ka(t) {
  var e = t.grouping && t.thousands ? gc(t.grouping, t.thousands) : Fs, n = t.currency, r = t.decimal, i = t.numerals ? _c(t.numerals) : Fs, s = t.percent || "%";
  function a(u) {
    u = Rn(u);
    var f = u.fill, p = u.align, g = u.sign, _ = u.symbol, m = u.zero, T = u.width, c = u.comma, w = u.precision, z = u.trim, P = u.type;
    P === "n" ? (c = !0, P = "g") : Ps[P] || (w == null && (w = 12), z = !0, P = "g"), (m || f === "0" && p === "=") && (m = !0, f = "0", p = "=");
    var b = _ === "$" ? n[0] : _ === "#" && /[boxX]/.test(P) ? "0" + P.toLowerCase() : "", x = _ === "$" ? n[1] : /[%p]/.test(P) ? s : "", C = Ps[P], E = /[defgprs%]/.test(P);
    w = w == null ? 6 : /[gprs]/.test(P) ? Math.max(1, Math.min(21, w)) : Math.max(0, Math.min(20, w));
    function M(D) {
      var $ = b, G = x, U, ae, I;
      if (P === "c")
        G = C(D) + G, D = "";
      else {
        D = +D;
        var V = D < 0;
        if (D = C(Math.abs(D), w), z && (D = bc(D)), V && +D == 0 && (V = !1), $ = (V ? g === "(" ? g : "-" : g === "-" || g === "(" ? "" : g) + $, G = (P === "s" ? Bs[8 + Xa / 3] : "") + G + (V && g === "(" ? ")" : ""), E) {
          for (U = -1, ae = D.length; ++U < ae; )
            if (I = D.charCodeAt(U), 48 > I || I > 57) {
              G = (I === 46 ? r + D.slice(U + 1) : D.slice(U)) + G, D = D.slice(0, U);
              break;
            }
        }
      }
      c && !m && (D = e(D, 1 / 0));
      var te = $.length + D.length + G.length, ne = te < T ? new Array(T - te + 1).join(f) : "";
      switch (c && m && (D = e(ne + D, ne.length ? T - G.length : 1 / 0), ne = ""), p) {
        case "<":
          D = $ + D + G + ne;
          break;
        case "=":
          D = $ + ne + D + G;
          break;
        case "^":
          D = ne.slice(0, te = ne.length >> 1) + $ + D + G + ne.slice(te);
          break;
        default:
          D = ne + $ + D + G;
          break;
      }
      return i(D);
    }
    return M.toString = function() {
      return u + "";
    }, M;
  }
  function l(u, f) {
    var p = a((u = Rn(u), u.type = "f", u)), g = Math.max(-8, Math.min(8, Math.floor(cn(f) / 3))) * 3, _ = Math.pow(10, -g), m = Bs[8 + g / 3];
    return function(T) {
      return p(_ * T) + m;
    };
  }
  return {
    format: a,
    formatPrefix: l
  };
}
var Jn, hn, is;
Za({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function Za(t) {
  return Jn = Ka(t), hn = Jn.format, is = Jn.formatPrefix, Jn;
}
function Ja(t) {
  return Math.max(0, -cn(Math.abs(t)));
}
function Qa(t, e) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(cn(e) / 3))) * 3 - cn(Math.abs(t)));
}
function ja(t, e) {
  return t = Math.abs(t), e = Math.abs(e) - t, Math.max(0, cn(e) - cn(t)) + 1;
}
const yc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get format() {
    return hn;
  },
  formatDefaultLocale: Za,
  formatLocale: Ka,
  get formatPrefix() {
    return is;
  },
  formatSpecifier: Rn,
  precisionFixed: Ja,
  precisionPrefix: Qa,
  precisionRound: ja
}, Symbol.toStringTag, { value: "Module" })), zi = (t) => t, wc = /([.*+?^=!:${}()|[\]/\\])/g, xc = /\n\s*\n/g, Mc = /\n\s*(\)*)\s*$/, Sc = /([() ])(?:and|or)([)( ])/ig, kc = /[()]/g, Cc = /\(\s*(\S+)\s*\)/g, Ec = /\s+or\s+/i, Tc = /\s+and\s+/i, zc = /(^|\()(\s*-?[0-9.]+\s+(?:or\s+-?[0-9.]+\s*)+)(\)|$)/ig, Nc = /(^|\(|or\s)(\s*-?[0-9.]+\s+(?:and\s+-?[0-9.]+\s*)+)(\sor|\)|$)/ig;
function mr(t) {
  const e = Number(t);
  return isNaN(e) || parseFloat(t) !== e ? null : e;
}
function Dc(t, e) {
  const n = {};
  let r = [null];
  for (let i in t) {
    r = t[i].map(() => null);
    break;
  }
  for (let i in e) {
    const s = e[i], a = s.bigg_id, l = {};
    s.genes.forEach((u) => {
      ["bigg_id", "name"].forEach(function(f) {
        const p = t[u[f]] || se.clone(r), g = l[u.bigg_id];
        if (g === void 0)
          l[u.bigg_id] = p;
        else
          for (let _ = 0; _ < p.length; _++) {
            const m = p[_];
            m !== null && (g[_] = m);
          }
      });
    }), n[a] = l;
  }
  return n;
}
function Rs(t) {
  return isFinite(t) ? t : null;
}
function Ac(t, e) {
  return e ? Math.abs(t) : t;
}
function Ic(t, e, n) {
  return n ? Math.abs(e - t) : e - t;
}
function Oc(t, e, n) {
  if (t === 0 || e === 0) return null;
  var r = e >= t ? e / t : -t / e;
  return n ? Math.abs(r) : r;
}
function Lc(t, e, n) {
  if (t === 0 || e / t < 0) return null;
  var r = Math.log(e / t) / Math.log(2);
  return n ? Math.abs(r) : r;
}
function en(t, e, n) {
  if (!t) return null;
  if (["reaction_data", "metabolite_data", "gene_data"].indexOf(e) === -1)
    throw new Error("Invalid name argument: " + e);
  t instanceof Array || (t = [t]);
  var r = function() {
    return t === null || t.length === 1 || t.length === 2 ? null : console.warn("Bad data style: " + e);
  };
  if (r(), t = se.arrayToObject(t), e === "gene_data") {
    if (n === void 0)
      throw new Error("Must pass all_reactions argument for gene_data");
    t = Dc(t, n);
  }
  return t;
}
function Yn(t, e, n) {
  if (t === null) return null;
  const r = e.indexOf("abs") !== -1;
  if (t.length === 1) {
    var i = mr(t[0]);
    return i === null ? null : Ac(i, r);
  } else if (t.length === 2) {
    var s = t.map(mr);
    if (s[0] === null || s[1] === null) return null;
    if (n === "diff")
      return Ic(s[0], s[1], r);
    if (n === "fold")
      return Rs(Oc(s[0], s[1], r));
    if (n === "log2_fold")
      return Rs(Lc(s[0], s[1], r));
  } else
    throw new Error("Data array must be of length 1 or 2");
  throw new Error("Bad data compare_style: " + n);
}
function ss(t) {
  return t === null || t[0] === null ? !1 : t[0] < 0;
}
function eo(t, e, n, r, i, s) {
  var a = t, l = e === null, u = {};
  n.forEach(function(g) {
    var _ = g.bigg_id;
    if (!(_ in u))
      if (u[_] = !0, l)
        a = nn(a, _, _ + `
`);
      else {
        if (!(_ in e))
          return;
        var m = e[_], T = Yn(m, r, s), c = T === null ? zi : hn(".3g");
        if (m.length === 1)
          a = nn(
            a,
            _,
            _ + " (" + p(m[0], c) + `)
`
          );
        else if (m.length === 2) {
          var w, z = ce.any(m, function(P) {
            return mr(P) !== null;
          });
          z ? w = _ + " (" + p(m[0], c) + ", " + p(m[1], c) + ": " + p(T, c) + `)
` : w = _ + " (" + p(m[0], c) + ", " + p(m[1], c) + `)
`, a = nn(a, _, w);
        }
      }
  }), a = a.replace(xc, `
`).replace(Mc, "$1");
  var f = a.split(`
`).map(function(g) {
    for (var _ = 0, m = n.length; _ < m; _++) {
      var T = n[_];
      if (g.indexOf(T.bigg_id) !== -1)
        return i === "name" && (g = nn(g, T.bigg_id, T.name)), { bigg_id: T.bigg_id, name: T.name, text: g };
    }
    return { bigg_id: null, name: null, text: g };
  });
  return f;
  function p(g, _) {
    return g === null ? "nd" : _(g);
  }
}
function Or(t, e) {
  if (t === null)
    return i(null);
  if (t.length === 1) {
    var n = e === null ? zi : hn(".3g");
    return i(t[0], n);
  }
  if (t.length === 2) {
    var n = e === null ? zi : hn(".3g"), r = i(t[0], n);
    return r += ", " + i(t[1], n), r += ": " + i(e, n), r;
  }
  return "";
  function i(s, a) {
    return s === null ? "(nd)" : a(s);
  }
}
function to(t) {
  var e = t[0].length, n = [];
  if (e < 2 || e > 3)
    throw new Error("CSV file must have 2 or 3 columns");
  for (var r = 1; r < e; r++)
    n[r - 1] = {};
  return t.slice(1).forEach(function(i) {
    for (var s = 1, a = i.length; s < a; s++)
      n[s - 1][i[0]] = i[s];
  }), n;
}
function Pc(t) {
  var e = t.replace(Sc, "$1$2").replace(kc, "").split(" ").filter(function(n) {
    return n != "";
  });
  return se.unique_strings_array(e);
}
function no(t, e, n) {
  var r = [null], i = 1;
  for (var s in e) {
    r = e[s].map(function() {
      return null;
    }), i = r.length;
    break;
  }
  if (t == "") return se.clone(r);
  for (var a = [], l = 0; l < i; l++) {
    var u = t, f = !0;
    for (var s in e) {
      var p = mr(e[s][l]);
      p === null ? p = 0 : f = !1, u = nn(u, s, p);
    }
    if (f) {
      a.push(null);
      continue;
    }
    for (; ; ) {
      var g = u;
      if (g = g.replace(Cc, " $1 "), g = g.replace(zc, function(m, T, c, w) {
        var z = c.split(Ec).map(parseFloat), P = z.reduce(function(b, x) {
          return b + x;
        });
        return T + P + w;
      }), g = g.replace(Nc, function(m, T, c, w) {
        var z = c.split(Tc).map(parseFloat), P = n == "min" ? Math.min.apply(null, z) : z.reduce(function(b, x) {
          return b + x;
        }) / z.length;
        return T + P + w;
      }), g == u)
        break;
      u = g;
    }
    var _ = Number(u);
    isNaN(_) ? (console.warn("Could not evaluate " + t), a.push(null)) : a.push(_);
  }
  return a;
}
function nn(t, e, n) {
  var r = "(^|[\\s\\(\\)])", i = "([\\s\\(\\)]|$)", s = r + a(e) + i;
  return t.replace(new RegExp(s, "g"), "$1" + n + "$2");
  function a(l) {
    return l.replace(wc, "\\$1");
  }
}
function ro(t, e, n, r, i) {
  ce.isUndefined(i) && (i = Object.keys(t));
  var s, a, l;
  return e === null ? (i.map(function(u) {
    s = t[u], s.data = null, s.data_string = "";
    for (a in s.segments)
      l = s.segments[a], l.data = null;
    s.gene_string = null;
  }), !1) : (i.map(function(u) {
    s = t[u];
    var f = e[s.bigg_id] || e[s.name] || null, p = Yn(f, n, r), g = ss(f), _ = Or(f, p);
    s.data = p, s.data_string = _, s.reverse_flux = g, s.gene_string = null;
    for (a in s.segments)
      l = s.segments[a], l.data = s.data, l.reverse_flux = s.reverse_flux;
  }), !0);
}
function io(t, e, n, r, i) {
  return ce.isUndefined(i) && (i = Object.keys(t)), e === null ? (i.map((s) => {
    t[s].data = null, t[s].data_string = "";
  }), !1) : (i.map((s) => {
    var a = t[s];
    const l = e[a.bigg_id] || e[a.name] || null, u = Yn(l, n, r), f = Or(l, u);
    a.data = u, a.data_string = f;
  }), !0);
}
function so(t, e, n, r, i, s, a) {
  if (ce.isUndefined(a) && (a = Object.keys(t)), e === null)
    return a.map(function(p) {
      var g = t[p];
      g.data = null, g.data_string = "", g.reverse_flux = !1;
      for (var _ in g.segments) {
        var m = g.segments[_];
        m.data = null;
      }
      g.gene_string = null;
    }), !1;
  var l = [null];
  for (var u in e) {
    for (var f in e[u]) {
      l = e[u][f].map(function() {
        return null;
      });
      break;
    }
    break;
  }
  return a.map(function(p) {
    var g = t[p], _ = g.gene_reaction_rule, m, T, c = e[g.bigg_id];
    ce.isUndefined(c) ? (T = {}, m = se.clone(l)) : (T = c, m = no(
      _,
      T,
      s
    ));
    var w = Yn(m, n, i), z = ss(m), P = Or(m, w);
    g.data = w, g.data_string = P, g.reverse_flux = z;
    for (var b in g.segments) {
      var x = g.segments[b];
      x.data = g.data, x.reverse_flux = g.reverse_flux;
    }
    g.gene_string = eo(
      _,
      T,
      g.genes,
      n,
      r,
      i
    );
  }), !0;
}
const Fc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  apply_gene_data_to_reactions: so,
  apply_metabolite_data_to_nodes: io,
  apply_reaction_data_to_reactions: ro,
  csv_converter: to,
  evaluate_gene_reaction_rule: no,
  floatForData: Yn,
  gene_string_for_data: eo,
  genes_for_gene_reaction_rule: Pc,
  importAndCheck: en,
  replace_gene_in_rule: nn,
  reverse_flux_for_data: ss,
  text_for_data: Or
}, Symbol.toStringTag, { value: "Module" })), ao = /* @__PURE__ */ _n(Fc);
var ri, Us;
function Bc() {
  if (Us) return ri;
  Us = 1;
  var t = Ir(), e = ao, n = t.make_class();
  n.from_cobra_json = i, n.build_reaction_string = r, n.prototype = {
    init: s,
    apply_reaction_data: a,
    apply_metabolite_data: l,
    apply_gene_data: u
  }, ri = n;
  function r(f, p) {
    var g = function(z) {
      return z == 1 ? "" : String(z) + " ";
    }, _ = [], m = [];
    for (var T in f) {
      var c = f[T];
      c > 0 ? m.push(g(c) + T) : _.push(g(Math.abs(c)) + T);
    }
    var w = _.join(" + ");
    return p ? w += " ↔ " : w += " → ", w += m.join(" + "), w;
  }
  function i(f) {
    if (!(f.reactions && f.metabolites))
      throw new Error("Bad model data.");
    for (var p = {}, g = 0, _ = f.genes.length; g < _; g++) {
      var m = f.genes[g], T = m.id;
      p[T] = m;
    }
    var c = new n();
    c.reactions = {};
    for (var g = 0, _ = f.reactions.length; g < _; g++) {
      var m = f.reactions[g], T = m.id, w = t.clone(m);
      if (delete w.id, w.bigg_id = T, w.data_string = "", w.genes = [], w.reversibility = w.lower_bound < 0 && w.upper_bound > 0, w.upper_bound <= 0 && w.lower_bound < 0)
        for (var z in w.metabolites)
          w.metabolites[z] = -w.metabolites[z];
      if (delete w.lower_bound, delete w.upper_bound, "gene_reaction_rule" in w) {
        var P = e.genes_for_gene_reaction_rule(w.gene_reaction_rule);
        P.forEach(function(D) {
          if (D in p) {
            var $ = t.clone(p[D]);
            $.bigg_id = $.id, delete $.id, w.genes.push($);
          } else
            console.warn("Could not find gene for gene_id " + D);
        });
      }
      c.reactions[T] = w;
    }
    c.metabolites = {};
    for (var g = 0, _ = f.metabolites.length; g < _; g++) {
      var m = f.metabolites[g], T = m.id, b = t.clone(m);
      delete b.id, b.bigg_id = T, c.metabolites[T] = b;
    }
    return c;
  }
  function s() {
    this.reactions = {}, this.metabolites = {};
  }
  function a(f, p, g) {
    e.apply_reaction_data_to_reactions(
      this.reactions,
      f,
      p,
      g
    );
  }
  function l(f, p, g) {
    e.apply_metabolite_data_to_nodes(
      this.metabolites,
      f,
      p,
      g
    );
  }
  function u(f, p, g, _, m) {
    e.apply_gene_data_to_reactions(
      this.reactions,
      f,
      p,
      g,
      _,
      m
    );
  }
  return ri;
}
var Rc = Bc();
const oo = /* @__PURE__ */ Tt(Rc);
class Uc {
  constructor(e, n, r, i) {
    const s = e.append("div").attr("id", "rxn-input");
    this.placed_div = es(s, n, { x: 240, y: 0 }), this.placed_div.hide(), this.completely = lc(s.node(), { backgroundColor: "#eee" }), s.append("button").attr("class", "button input-close-button").text("×").on("mousedown", () => this.hideDropdown()), this.map = n;
    const a = 90;
    this.direction_arrow = new dc(n.sel), this.direction_arrow.setRotation(a), this.setUpMapCallbacks(n), this.zoomContainer = r, this.setUpZoomCallbacks(r), this.settings = i, this.toggle(!1), this.target_coords = null;
  }
  setUpMapCallbacks(e) {
    e.callback_manager.set("select_metabolite_with_id.input", (n, r) => {
      this.is_active && this.reload(n, r, !1) && this.showDropdown(r), this.hideTarget();
    }), e.callback_manager.set("select_selectable.input", (n, r, i) => {
      this.hideTarget(), n === 1 && this.is_active && i ? this.reload(r, i, !1) && this.showDropdown(i) : this.toggle(!1);
    }), e.callback_manager.set("deselect_nodes", () => {
      this.direction_arrow.hide(), this.hideDropdown();
    }), e.callback_manager.set("before_svg_export", () => {
      this.direction_arrow.hide(), this.hideTarget();
    });
  }
  setUpZoomCallbacks(e) {
  }
  is_visible() {
    return this.placed_div.is_visible();
  }
  toggle(e) {
    if (e === void 0 ? this.is_active = !this.is_active : this.is_active = e, this.is_active) {
      this.toggleStartReactionListener(!0);
      let n = !0;
      ce.isNull(this.target_coords) ? n = this.reloadAtSelected() : this.placed_div.place(this.target_coords), n && (this.showDropdown(), this.map.set_status("Click on the canvas or an existing metabolite")), this.direction_arrow.show();
    } else
      this.toggleStartReactionListener(!1), this.hideDropdown(), this.map.set_status(null), this.direction_arrow.hide();
  }
  showDropdown(e) {
    this.clear_escape = this.map.key_manager.addEscapeListener(() => this.hideDropdown(), !0), this.completely.input.blur(), this.completely.repaint(), this.completely.setText(""), this.completely.input.focus();
  }
  hideDropdown() {
    this.clear_escape && this.clear_escape(), this.clear_escape = null, this.placed_div.hide(), this.completely.input.blur(), this.completely.hideDropDown();
  }
  place(e) {
    this.placed_div.place(e), this.direction_arrow.setLocation(e), this.direction_arrow.show();
  }
  /**
   * Reload data for autocomplete box and redraw box at the first selected node.
   * @return {Boolean} Returns true if a model is present and a node is selected.
   */
  reloadAtSelected() {
    this.map.deselect_text_labels();
    var e = this.map.select_single_node();
    if (e === null) return !1;
    var n = { x: e.x, y: e.y };
    return this.reload(e, n, !1);
  }
  alreadyDrawn(e, n) {
    for (let r in n)
      if (n[r].bigg_id === e)
        return !0;
    return !1;
  }
  /**
   * Reload data for autocomplete box and redraw box at the new coordinates.
   * @param {} selectedNode -
   * @param {} coords -
   * @param {Boolean} startingFromScratch -
   * @return {Boolean} Returns true if a model is present.
   */
  reload(e, n, r) {
    if (!r && !e) {
      console.error("No selected node and not starting from scratch");
      return;
    }
    if (this.place(n), this.map.cobra_model === null)
      return this.completely.setText("Cannot add: No model."), !1;
    const i = this.settings.get("identifiers_on_map") === "name", s = this.settings.get("allow_building_duplicate_reactions"), a = [], l = this.map.cobra_model.reactions, u = this.map.cobra_model.metabolites, f = this.map.reactions, p = this.map.has_data_on_reactions, g = e ? i ? e.name : e.bigg_id : "", _ = (z, P) => z.replace(new RegExp("(^| )(" + P.join("|") + ")($| )", "g"), "$1<b>$2</b>$3"), m = {};
    for (let z in l) {
      const P = l[z], b = P.name, x = i ? b : z;
      if (!(!s && this.alreadyDrawn(z, f))) {
        for (let C in P.metabolites)
          if (r || C === e.bigg_id) {
            if (z in m) continue;
            let E = {};
            const M = [];
            let D;
            if (i)
              for (D in P.metabolites) {
                var T = u[D].name;
                E[T] = P.metabolites[D], M.push(T);
              }
            else {
              E = Be.clone(P.metabolites);
              for (D in P.metabolites)
                M.push(D);
            }
            const $ = ce.flatten(
              P.genes.map((ae) => [ae.name, ae.biggId])
            ), G = oo.build_reaction_string(
              E,
              P.reversibility,
              P.lower_bound,
              P.upper_bound
            ), U = [x].concat(M).concat($).filter((ae) => ae);
            p ? a.push({
              reaction_data: P.data,
              html: "<b>" + x + "</b>: " + P.data_string,
              matches: U,
              id: z
            }) : a.push({
              html: "<b>" + x + "</b>	" + _(G, [g]),
              matches: U,
              id: z
            }), m[z] = !0;
          }
      }
    }
    const c = p ? (z, P) => Math.abs(z.reaction_data) > Math.abs(P.reaction_data) ? -1 : 1 : (z, P) => z.html.toLowerCase() < P.html.toLowerCase() ? -1 : 1;
    this.completely.options = a.sort(c), this.completely.setText("");
    const w = (z) => {
      if (z !== null)
        if (r)
          this.map.new_reaction_from_scratch(
            z,
            n,
            this.direction_arrow.getRotation()
          );
        else {
          if (!(e.node_id in this.map.nodes)) {
            console.error("Selected node no longer exists"), this.hideDropdown();
            return;
          }
          this.map.new_reaction_for_metabolite(
            z,
            e.node_id,
            this.direction_arrow.getRotation()
          );
        }
    };
    return this.completely.onEnter = function(z) {
      this.setText(""), this.onChange(""), w(z);
    }, !0;
  }
  /**
   * Toggle listening for a click to place a new reaction on the canvas.
   */
  toggleStartReactionListener(e) {
    if (e === void 0)
      this.start_reaction_listener = !this.start_reaction_listener;
    else {
      if (this.start_reaction_listener === e)
        return;
      this.start_reaction_listener = e;
    }
    if (this.start_reaction_listener) {
      const n = this.map.sel.node();
      this.map.sel.on("click.start_reaction", () => {
        if (this.direction_arrow.dragging) return;
        var r = {
          x: st(n)[0],
          y: st(n)[1]
        };
        this.map.deselect_nodes(), this.map.deselect_text_labels(), this.reload(null, r, !0) && this.showDropdown(r), this.showTarget(this.map, r);
      }), this.map.sel.style("cursor", "pointer");
    } else
      this.map.sel.on("click.start_reaction", null), this.map.sel.style("cursor", null), this.hideTarget();
  }
  hideTarget() {
    this.target_coords && this.map.sel.selectAll(".start-reaction-target").remove(), this.target_coords = null;
  }
  showTarget(e, n) {
    var r = e.sel.selectAll(".start-reaction-target").data([12, 5]);
    r.enter().append("circle").classed("start-reaction-target", !0).attr("r", function(i) {
      return i;
    }).style("stroke-width", 4).merge(r).style("visibility", "visible").attr("transform", "translate(" + n.x + "," + n.y + ")"), this.target_coords = n;
  }
}
class bn {
  /**
   * As in d3 callbacks, you can namespace your callbacks after a period:
   * select_metabolite.direction_arrow, select_metabolite.input. Both are called
   * by select_metabolite.
  */
  set(e, n) {
    this.callbacks === void 0 && (this.callbacks = {}), this.callbacks[e] === void 0 && (this.callbacks[e] = []), this.callbacks[e].push(n);
  }
  /** Remove a callback by name */
  remove(e) {
    this.callbacks === void 0 || Object.keys(this.callbacks).length === 0 ? console.warn("No callbacks to remove") : delete this.callbacks[e];
  }
  /**
   * Run all callbacks that match the portion of name before the period ('.').
   * @param {String} name - The callback name, which can include a tag after a
   * '.' to specificy a particular callback.
   * @param {Any} thisArg = null - The object assigned to `this` in the
   * callback.
  */
  run(e, n = null, ...r) {
    if (this.callbacks !== void 0)
      for (let i in this.callbacks)
        i.split(".")[0] === e && this.callbacks[i].forEach((a) => {
          a.apply(n, r);
        });
  }
}
const $c = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: bn
}, Symbol.toStringTag, { value: "Module" }));
function vn(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function Gn(t, e) {
  var n = Object.create(t.prototype);
  for (var r in e) n[r] = e[r];
  return n;
}
function zt() {
}
var Pt = 0.7, fn = 1 / Pt, an = "\\s*([+-]?\\d+)\\s*", Un = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*", pt = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Wc = /^#([0-9a-f]{3})$/, qc = /^#([0-9a-f]{6})$/, Vc = new RegExp("^rgb\\(" + [an, an, an] + "\\)$"), Hc = new RegExp("^rgb\\(" + [pt, pt, pt] + "\\)$"), Yc = new RegExp("^rgba\\(" + [an, an, an, Un] + "\\)$"), Gc = new RegExp("^rgba\\(" + [pt, pt, pt, Un] + "\\)$"), Xc = new RegExp("^hsl\\(" + [Un, pt, pt] + "\\)$"), Kc = new RegExp("^hsla\\(" + [Un, pt, pt, Un] + "\\)$"), $s = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
vn(zt, Ft, {
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: function() {
    return this.rgb().hex();
  },
  toString: function() {
    return this.rgb() + "";
  }
});
function Ft(t) {
  var e;
  return t = (t + "").trim().toLowerCase(), (e = Wc.exec(t)) ? (e = parseInt(e[1], 16), new Ke(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1)) : (e = qc.exec(t)) ? Ws(parseInt(e[1], 16)) : (e = Vc.exec(t)) ? new Ke(e[1], e[2], e[3], 1) : (e = Hc.exec(t)) ? new Ke(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = Yc.exec(t)) ? qs(e[1], e[2], e[3], e[4]) : (e = Gc.exec(t)) ? qs(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = Xc.exec(t)) ? Vs(e[1], e[2] / 100, e[3] / 100, 1) : (e = Kc.exec(t)) ? Vs(e[1], e[2] / 100, e[3] / 100, e[4]) : $s.hasOwnProperty(t) ? Ws($s[t]) : t === "transparent" ? new Ke(NaN, NaN, NaN, 0) : null;
}
function Ws(t) {
  return new Ke(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function qs(t, e, n, r) {
  return r <= 0 && (t = e = n = NaN), new Ke(t, e, n, r);
}
function as(t) {
  return t instanceof zt || (t = Ft(t)), t ? (t = t.rgb(), new Ke(t.r, t.g, t.b, t.opacity)) : new Ke();
}
function Ni(t, e, n, r) {
  return arguments.length === 1 ? as(t) : new Ke(t, e, n, r ?? 1);
}
function Ke(t, e, n, r) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +r;
}
vn(Ke, Ni, Gn(zt, {
  brighter: function(t) {
    return t = t == null ? fn : Math.pow(fn, t), new Ke(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker: function(t) {
    return t = t == null ? Pt : Math.pow(Pt, t), new Ke(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: function() {
    return "#" + ii(this.r) + ii(this.g) + ii(this.b);
  },
  toString: function() {
    var t = this.opacity;
    return t = isNaN(t) ? 1 : Math.max(0, Math.min(1, t)), (t === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (t === 1 ? ")" : ", " + t + ")");
  }
}));
function ii(t) {
  return t = Math.max(0, Math.min(255, Math.round(t) || 0)), (t < 16 ? "0" : "") + t.toString(16);
}
function Vs(t, e, n, r) {
  return r <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new dt(t, e, n, r);
}
function Zc(t) {
  if (t instanceof dt) return new dt(t.h, t.s, t.l, t.opacity);
  if (t instanceof zt || (t = Ft(t)), !t) return new dt();
  if (t instanceof dt) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, r = t.b / 255, i = Math.min(e, n, r), s = Math.max(e, n, r), a = NaN, l = s - i, u = (s + i) / 2;
  return l ? (e === s ? a = (n - r) / l + (n < r) * 6 : n === s ? a = (r - e) / l + 2 : a = (e - n) / l + 4, l /= u < 0.5 ? s + i : 2 - s - i, a *= 60) : l = u > 0 && u < 1 ? 0 : a, new dt(a, l, u, t.opacity);
}
function Jc(t, e, n, r) {
  return arguments.length === 1 ? Zc(t) : new dt(t, e, n, r ?? 1);
}
function dt(t, e, n, r) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +r;
}
vn(dt, Jc, Gn(zt, {
  brighter: function(t) {
    return t = t == null ? fn : Math.pow(fn, t), new dt(this.h, this.s, this.l * t, this.opacity);
  },
  darker: function(t) {
    return t = t == null ? Pt : Math.pow(Pt, t), new dt(this.h, this.s, this.l * t, this.opacity);
  },
  rgb: function() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - r;
    return new Ke(
      si(t >= 240 ? t - 240 : t + 120, i, r),
      si(t, i, r),
      si(t < 120 ? t + 240 : t - 120, i, r),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  }
}));
function si(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
var lo = Math.PI / 180, uo = 180 / Math.PI, br = 18, co = 0.96422, ho = 1, fo = 0.82521, po = 4 / 29, on = 6 / 29, go = 3 * on * on, Qc = on * on * on;
function _o(t) {
  if (t instanceof gt) return new gt(t.l, t.a, t.b, t.opacity);
  if (t instanceof yt) return mo(t);
  t instanceof Ke || (t = as(t));
  var e = ui(t.r), n = ui(t.g), r = ui(t.b), i = ai((0.2225045 * e + 0.7168786 * n + 0.0606169 * r) / ho), s, a;
  return e === n && n === r ? s = a = i : (s = ai((0.4360747 * e + 0.3850649 * n + 0.1430804 * r) / co), a = ai((0.0139322 * e + 0.0971045 * n + 0.7141733 * r) / fo)), new gt(116 * i - 16, 500 * (s - i), 200 * (i - a), t.opacity);
}
function jc(t, e, n, r) {
  return arguments.length === 1 ? _o(t) : new gt(t, e, n, r ?? 1);
}
function gt(t, e, n, r) {
  this.l = +t, this.a = +e, this.b = +n, this.opacity = +r;
}
vn(gt, jc, Gn(zt, {
  brighter: function(t) {
    return new gt(this.l + br * (t ?? 1), this.a, this.b, this.opacity);
  },
  darker: function(t) {
    return new gt(this.l - br * (t ?? 1), this.a, this.b, this.opacity);
  },
  rgb: function() {
    var t = (this.l + 16) / 116, e = isNaN(this.a) ? t : t + this.a / 500, n = isNaN(this.b) ? t : t - this.b / 200;
    return e = co * oi(e), t = ho * oi(t), n = fo * oi(n), new Ke(
      li(3.1338561 * e - 1.6168667 * t - 0.4906146 * n),
      li(-0.9787684 * e + 1.9161415 * t + 0.033454 * n),
      li(0.0719453 * e - 0.2289914 * t + 1.4052427 * n),
      this.opacity
    );
  }
}));
function ai(t) {
  return t > Qc ? Math.pow(t, 1 / 3) : t / go + po;
}
function oi(t) {
  return t > on ? t * t * t : go * (t - po);
}
function li(t) {
  return 255 * (t <= 31308e-7 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055);
}
function ui(t) {
  return (t /= 255) <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
}
function eh(t) {
  if (t instanceof yt) return new yt(t.h, t.c, t.l, t.opacity);
  if (t instanceof gt || (t = _o(t)), t.a === 0 && t.b === 0) return new yt(NaN, 0 < t.l && t.l < 100 ? 0 : NaN, t.l, t.opacity);
  var e = Math.atan2(t.b, t.a) * uo;
  return new yt(e < 0 ? e + 360 : e, Math.sqrt(t.a * t.a + t.b * t.b), t.l, t.opacity);
}
function th(t, e, n, r) {
  return arguments.length === 1 ? eh(t) : new yt(t, e, n, r ?? 1);
}
function yt(t, e, n, r) {
  this.h = +t, this.c = +e, this.l = +n, this.opacity = +r;
}
function mo(t) {
  if (isNaN(t.h)) return new gt(t.l, 0, 0, t.opacity);
  var e = t.h * lo;
  return new gt(t.l, Math.cos(e) * t.c, Math.sin(e) * t.c, t.opacity);
}
vn(yt, th, Gn(zt, {
  brighter: function(t) {
    return new yt(this.h, this.c, this.l + br * (t ?? 1), this.opacity);
  },
  darker: function(t) {
    return new yt(this.h, this.c, this.l - br * (t ?? 1), this.opacity);
  },
  rgb: function() {
    return mo(this).rgb();
  }
}));
var bo = -0.14861, os = 1.78277, ls = -0.29227, Lr = -0.90649, $n = 1.97294, Hs = $n * Lr, Ys = $n * os, Gs = os * ls - Lr * bo;
function nh(t) {
  if (t instanceof Ot) return new Ot(t.h, t.s, t.l, t.opacity);
  t instanceof Ke || (t = as(t));
  var e = t.r / 255, n = t.g / 255, r = t.b / 255, i = (Gs * r + Hs * e - Ys * n) / (Gs + Hs - Ys), s = r - i, a = ($n * (n - i) - ls * s) / Lr, l = Math.sqrt(a * a + s * s) / ($n * i * (1 - i)), u = l ? Math.atan2(a, s) * uo - 120 : NaN;
  return new Ot(u < 0 ? u + 360 : u, l, i, t.opacity);
}
function _t(t, e, n, r) {
  return arguments.length === 1 ? nh(t) : new Ot(t, e, n, r ?? 1);
}
function Ot(t, e, n, r) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +r;
}
vn(Ot, _t, Gn(zt, {
  brighter: function(t) {
    return t = t == null ? fn : Math.pow(fn, t), new Ot(this.h, this.s, this.l * t, this.opacity);
  },
  darker: function(t) {
    return t = t == null ? Pt : Math.pow(Pt, t), new Ot(this.h, this.s, this.l * t, this.opacity);
  },
  rgb: function() {
    var t = isNaN(this.h) ? 0 : (this.h + 120) * lo, e = +this.l, n = isNaN(this.s) ? 0 : this.s * e * (1 - e), r = Math.cos(t), i = Math.sin(t);
    return new Ke(
      255 * (e + n * (bo * r + os * i)),
      255 * (e + n * (ls * r + Lr * i)),
      255 * (e + n * ($n * r)),
      this.opacity
    );
  }
}));
function Pr(t) {
  return function() {
    return t;
  };
}
function vo(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function rh(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(r) {
    return Math.pow(t + r * e, n);
  };
}
function ih(t, e) {
  var n = e - t;
  return n ? vo(t, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : Pr(isNaN(t) ? e : t);
}
function sh(t) {
  return (t = +t) == 1 ? ln : function(e, n) {
    return n - e ? rh(e, n, t) : Pr(isNaN(e) ? n : e);
  };
}
function ln(t, e) {
  var n = e - t;
  return n ? vo(t, n) : Pr(isNaN(t) ? e : t);
}
const vr = (function t(e) {
  var n = sh(e);
  function r(i, s) {
    var a = n((i = Ni(i)).r, (s = Ni(s)).r), l = n(i.g, s.g), u = n(i.b, s.b), f = ln(i.opacity, s.opacity);
    return function(p) {
      return i.r = a(p), i.g = l(p), i.b = u(p), i.opacity = f(p), i + "";
    };
  }
  return r.gamma = t, r;
})(1);
function ah(t, e) {
  var n = e ? e.length : 0, r = t ? Math.min(n, t.length) : 0, i = new Array(r), s = new Array(n), a;
  for (a = 0; a < r; ++a) i[a] = Fr(t[a], e[a]);
  for (; a < n; ++a) s[a] = e[a];
  return function(l) {
    for (a = 0; a < r; ++a) s[a] = i[a](l);
    return s;
  };
}
function oh(t, e) {
  var n = /* @__PURE__ */ new Date();
  return t = +t, e -= t, function(r) {
    return n.setTime(t + e * r), n;
  };
}
function lt(t, e) {
  return t = +t, e -= t, function(n) {
    return t + e * n;
  };
}
function lh(t, e) {
  var n = {}, r = {}, i;
  (t === null || typeof t != "object") && (t = {}), (e === null || typeof e != "object") && (e = {});
  for (i in e)
    i in t ? n[i] = Fr(t[i], e[i]) : r[i] = e[i];
  return function(s) {
    for (i in n) r[i] = n[i](s);
    return r;
  };
}
var Di = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, ci = new RegExp(Di.source, "g");
function uh(t) {
  return function() {
    return t;
  };
}
function ch(t) {
  return function(e) {
    return t(e) + "";
  };
}
function yo(t, e) {
  var n = Di.lastIndex = ci.lastIndex = 0, r, i, s, a = -1, l = [], u = [];
  for (t = t + "", e = e + ""; (r = Di.exec(t)) && (i = ci.exec(e)); )
    (s = i.index) > n && (s = e.slice(n, s), l[a] ? l[a] += s : l[++a] = s), (r = r[0]) === (i = i[0]) ? l[a] ? l[a] += i : l[++a] = i : (l[++a] = null, u.push({ i: a, x: lt(r, i) })), n = ci.lastIndex;
  return n < e.length && (s = e.slice(n), l[a] ? l[a] += s : l[++a] = s), l.length < 2 ? u[0] ? ch(u[0].x) : uh(e) : (e = u.length, function(f) {
    for (var p = 0, g; p < e; ++p) l[(g = u[p]).i] = g.x(f);
    return l.join("");
  });
}
function Fr(t, e) {
  var n = typeof e, r;
  return e == null || n === "boolean" ? Pr(e) : (n === "number" ? lt : n === "string" ? (r = Ft(e)) ? (e = r, vr) : yo : e instanceof Ft ? vr : e instanceof Date ? oh : Array.isArray(e) ? ah : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? lh : lt)(t, e);
}
function hh(t, e) {
  return t = +t, e -= t, function(n) {
    return Math.round(t + e * n);
  };
}
var Xs = 180 / Math.PI, Ai = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function wo(t, e, n, r, i, s) {
  var a, l, u;
  return (a = Math.sqrt(t * t + e * e)) && (t /= a, e /= a), (u = t * n + e * r) && (n -= t * u, r -= e * u), (l = Math.sqrt(n * n + r * r)) && (n /= l, r /= l, u /= l), t * r < e * n && (t = -t, e = -e, u = -u, a = -a), {
    translateX: i,
    translateY: s,
    rotate: Math.atan2(e, t) * Xs,
    skewX: Math.atan(u) * Xs,
    scaleX: a,
    scaleY: l
  };
}
var kn, hi, Ks, Qn;
function fh(t) {
  return t === "none" ? Ai : (kn || (kn = document.createElement("DIV"), hi = document.documentElement, Ks = document.defaultView), kn.style.transform = t, t = Ks.getComputedStyle(hi.appendChild(kn), null).getPropertyValue("transform"), hi.removeChild(kn), t = t.slice(7, -1).split(","), wo(+t[0], +t[1], +t[2], +t[3], +t[4], +t[5]));
}
function dh(t) {
  return t == null || (Qn || (Qn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Qn.setAttribute("transform", t), !(t = Qn.transform.baseVal.consolidate())) ? Ai : (t = t.matrix, wo(t.a, t.b, t.c, t.d, t.e, t.f));
}
function xo(t, e, n, r) {
  function i(f) {
    return f.length ? f.pop() + " " : "";
  }
  function s(f, p, g, _, m, T) {
    if (f !== g || p !== _) {
      var c = m.push("translate(", null, e, null, n);
      T.push({ i: c - 4, x: lt(f, g) }, { i: c - 2, x: lt(p, _) });
    } else (g || _) && m.push("translate(" + g + e + _ + n);
  }
  function a(f, p, g, _) {
    f !== p ? (f - p > 180 ? p += 360 : p - f > 180 && (f += 360), _.push({ i: g.push(i(g) + "rotate(", null, r) - 2, x: lt(f, p) })) : p && g.push(i(g) + "rotate(" + p + r);
  }
  function l(f, p, g, _) {
    f !== p ? _.push({ i: g.push(i(g) + "skewX(", null, r) - 2, x: lt(f, p) }) : p && g.push(i(g) + "skewX(" + p + r);
  }
  function u(f, p, g, _, m, T) {
    if (f !== g || p !== _) {
      var c = m.push(i(m) + "scale(", null, ",", null, ")");
      T.push({ i: c - 4, x: lt(f, g) }, { i: c - 2, x: lt(p, _) });
    } else (g !== 1 || _ !== 1) && m.push(i(m) + "scale(" + g + "," + _ + ")");
  }
  return function(f, p) {
    var g = [], _ = [];
    return f = t(f), p = t(p), s(f.translateX, f.translateY, p.translateX, p.translateY, g, _), a(f.rotate, p.rotate, g, _), l(f.skewX, p.skewX, g, _), u(f.scaleX, f.scaleY, p.scaleX, p.scaleY, g, _), f = p = null, function(m) {
      for (var T = -1, c = _.length, w; ++T < c; ) g[(w = _[T]).i] = w.x(m);
      return g.join("");
    };
  };
}
var ph = xo(fh, "px, ", "px)", "deg)"), gh = xo(dh, ", ", ")", ")"), Cn = Math.SQRT2, fi = 2, Zs = 4, _h = 1e-12;
function Js(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function mh(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function bh(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
function vh(t, e) {
  var n = t[0], r = t[1], i = t[2], s = e[0], a = e[1], l = e[2], u = s - n, f = a - r, p = u * u + f * f, g, _;
  if (p < _h)
    _ = Math.log(l / i) / Cn, g = function(P) {
      return [
        n + P * u,
        r + P * f,
        i * Math.exp(Cn * P * _)
      ];
    };
  else {
    var m = Math.sqrt(p), T = (l * l - i * i + Zs * p) / (2 * i * fi * m), c = (l * l - i * i - Zs * p) / (2 * l * fi * m), w = Math.log(Math.sqrt(T * T + 1) - T), z = Math.log(Math.sqrt(c * c + 1) - c);
    _ = (z - w) / Cn, g = function(P) {
      var b = P * _, x = Js(w), C = i / (fi * m) * (x * bh(Cn * b + w) - mh(w));
      return [
        n + C * u,
        r + C * f,
        i * x / Js(Cn * b + w)
      ];
    };
  }
  return g.duration = _ * 1e3, g;
}
function Mo(t) {
  return (function e(n) {
    n = +n;
    function r(i, s) {
      var a = t((i = _t(i)).h, (s = _t(s)).h), l = ln(i.s, s.s), u = ln(i.l, s.l), f = ln(i.opacity, s.opacity);
      return function(p) {
        return i.h = a(p), i.s = l(p), i.l = u(Math.pow(p, n)), i.opacity = f(p), i + "";
      };
    }
    return r.gamma = e, r;
  })(1);
}
Mo(ih);
var us = Mo(ln), dn = 0, On = 0, En = 0, So = 1e3, yr, Ln, wr = 0, Bt = 0, Br = 0, Wn = typeof performance == "object" && performance.now ? performance : Date, ko = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function Rr() {
  return Bt || (ko(yh), Bt = Wn.now() + Br);
}
function yh() {
  Bt = 0;
}
function xr() {
  this._call = this._time = this._next = null;
}
xr.prototype = Co.prototype = {
  constructor: xr,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Rr() : +n) + (e == null ? 0 : +e), !this._next && Ln !== this && (Ln ? Ln._next = this : yr = this, Ln = this), this._call = t, this._time = n, Ii();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Ii());
  }
};
function Co(t, e, n) {
  var r = new xr();
  return r.restart(t, e, n), r;
}
function wh() {
  Rr(), ++dn;
  for (var t = yr, e; t; )
    (e = Bt - t._time) >= 0 && t._call.call(null, e), t = t._next;
  --dn;
}
function Qs() {
  Bt = (wr = Wn.now()) + Br, dn = On = 0;
  try {
    wh();
  } finally {
    dn = 0, Mh(), Bt = 0;
  }
}
function xh() {
  var t = Wn.now(), e = t - wr;
  e > So && (Br -= e, wr = t);
}
function Mh() {
  for (var t, e = yr, n, r = 1 / 0; e; )
    e._call ? (r > e._time && (r = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : yr = n);
  Ln = t, Ii(r);
}
function Ii(t) {
  if (!dn) {
    On && (On = clearTimeout(On));
    var e = t - Bt;
    e > 24 ? (t < 1 / 0 && (On = setTimeout(Qs, t - Wn.now() - Br)), En && (En = clearInterval(En))) : (En || (wr = Wn.now(), En = setInterval(xh, So)), dn = 1, ko(Qs));
  }
}
function js(t, e, n) {
  var r = new xr();
  return e = e == null ? 0 : +e, r.restart(function(i) {
    r.stop(), t(i + e);
  }, e, n), r;
}
var Sh = mn("start", "end", "cancel", "interrupt"), kh = [], Eo = 0, ea = 1, Oi = 2, or = 3, ta = 4, Li = 5, lr = 6;
function Ur(t, e, n, r, i, s) {
  var a = t.__transition;
  if (!a) t.__transition = {};
  else if (n in a) return;
  Ch(t, n, {
    name: e,
    index: r,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Sh,
    tween: kh,
    time: s.time,
    delay: s.delay,
    duration: s.duration,
    ease: s.ease,
    timer: null,
    state: Eo
  });
}
function cs(t, e) {
  var n = ct(t, e);
  if (n.state > Eo) throw new Error("too late; already scheduled");
  return n;
}
function Mt(t, e) {
  var n = ct(t, e);
  if (n.state > or) throw new Error("too late; already running");
  return n;
}
function ct(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function Ch(t, e, n) {
  var r = t.__transition, i;
  r[e] = n, n.timer = Co(s, 0, n.time);
  function s(f) {
    n.state = ea, n.timer.restart(a, n.delay, n.time), n.delay <= f && a(f - n.delay);
  }
  function a(f) {
    var p, g, _, m;
    if (n.state !== ea) return u();
    for (p in r)
      if (m = r[p], m.name === n.name) {
        if (m.state === or) return js(a);
        m.state === ta ? (m.state = lr, m.timer.stop(), m.on.call("interrupt", t, t.__data__, m.index, m.group), delete r[p]) : +p < e && (m.state = lr, m.timer.stop(), m.on.call("cancel", t, t.__data__, m.index, m.group), delete r[p]);
      }
    if (js(function() {
      n.state === or && (n.state = ta, n.timer.restart(l, n.delay, n.time), l(f));
    }), n.state = Oi, n.on.call("start", t, t.__data__, n.index, n.group), n.state === Oi) {
      for (n.state = or, i = new Array(_ = n.tween.length), p = 0, g = -1; p < _; ++p)
        (m = n.tween[p].value.call(t, t.__data__, n.index, n.group)) && (i[++g] = m);
      i.length = g + 1;
    }
  }
  function l(f) {
    for (var p = f < n.duration ? n.ease.call(null, f / n.duration) : (n.timer.restart(u), n.state = Li, 1), g = -1, _ = i.length; ++g < _; )
      i[g].call(t, p);
    n.state === Li && (n.on.call("end", t, t.__data__, n.index, n.group), u());
  }
  function u() {
    n.state = lr, n.timer.stop(), delete r[e];
    for (var f in r) return;
    delete t.__transition;
  }
}
function un(t, e) {
  var n = t.__transition, r, i, s = !0, a;
  if (n) {
    e = e == null ? null : e + "";
    for (a in n) {
      if ((r = n[a]).name !== e) {
        s = !1;
        continue;
      }
      i = r.state > Oi && r.state < Li, r.state = lr, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", t, t.__data__, r.index, r.group), delete n[a];
    }
    s && delete t.__transition;
  }
}
function Eh(t) {
  return this.each(function() {
    un(this, t);
  });
}
function Th(t, e) {
  var n, r;
  return function() {
    var i = Mt(this, t), s = i.tween;
    if (s !== n) {
      r = n = s;
      for (var a = 0, l = r.length; a < l; ++a)
        if (r[a].name === e) {
          r = r.slice(), r.splice(a, 1);
          break;
        }
    }
    i.tween = r;
  };
}
function zh(t, e, n) {
  var r, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var s = Mt(this, t), a = s.tween;
    if (a !== r) {
      i = (r = a).slice();
      for (var l = { name: e, value: n }, u = 0, f = i.length; u < f; ++u)
        if (i[u].name === e) {
          i[u] = l;
          break;
        }
      u === f && i.push(l);
    }
    s.tween = i;
  };
}
function Nh(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var r = ct(this.node(), n).tween, i = 0, s = r.length, a; i < s; ++i)
      if ((a = r[i]).name === t)
        return a.value;
    return null;
  }
  return this.each((e == null ? Th : zh)(n, t, e));
}
function hs(t, e, n) {
  var r = t._id;
  return t.each(function() {
    var i = Mt(this, r);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return ct(i, r).value[e];
  };
}
function To(t, e) {
  var n;
  return (typeof e == "number" ? lt : e instanceof Ft ? vr : (n = Ft(e)) ? (e = n, vr) : yo)(t, e);
}
function Dh(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function Ah(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Ih(t, e, n) {
  var r, i = n + "", s;
  return function() {
    var a = this.getAttribute(t);
    return a === i ? null : a === r ? s : s = e(r = a, n);
  };
}
function Oh(t, e, n) {
  var r, i = n + "", s;
  return function() {
    var a = this.getAttributeNS(t.space, t.local);
    return a === i ? null : a === r ? s : s = e(r = a, n);
  };
}
function Lh(t, e, n) {
  var r, i, s;
  return function() {
    var a, l = n(this), u;
    return l == null ? void this.removeAttribute(t) : (a = this.getAttribute(t), u = l + "", a === u ? null : a === r && u === i ? s : (i = u, s = e(r = a, l)));
  };
}
function Ph(t, e, n) {
  var r, i, s;
  return function() {
    var a, l = n(this), u;
    return l == null ? void this.removeAttributeNS(t.space, t.local) : (a = this.getAttributeNS(t.space, t.local), u = l + "", a === u ? null : a === r && u === i ? s : (i = u, s = e(r = a, l)));
  };
}
function Fh(t, e) {
  var n = Hn(t), r = n === "transform" ? gh : To;
  return this.attrTween(t, typeof e == "function" ? (n.local ? Ph : Lh)(n, r, hs(this, "attr." + t, e)) : e == null ? (n.local ? Ah : Dh)(n) : (n.local ? Oh : Ih)(n, r, e));
}
function Bh(t, e) {
  return function(n) {
    this.setAttribute(t, e(n));
  };
}
function Rh(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e(n));
  };
}
function Uh(t, e) {
  var n, r;
  function i() {
    var s = e.apply(this, arguments);
    return s !== r && (n = (r = s) && Rh(t, s)), n;
  }
  return i._value = e, i;
}
function $h(t, e) {
  var n, r;
  function i() {
    var s = e.apply(this, arguments);
    return s !== r && (n = (r = s) && Bh(t, s)), n;
  }
  return i._value = e, i;
}
function Wh(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var r = Hn(t);
  return this.tween(n, (r.local ? Uh : $h)(r, e));
}
function qh(t, e) {
  return function() {
    cs(this, t).delay = +e.apply(this, arguments);
  };
}
function Vh(t, e) {
  return e = +e, function() {
    cs(this, t).delay = e;
  };
}
function Hh(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? qh : Vh)(e, t)) : ct(this.node(), e).delay;
}
function Yh(t, e) {
  return function() {
    Mt(this, t).duration = +e.apply(this, arguments);
  };
}
function Gh(t, e) {
  return e = +e, function() {
    Mt(this, t).duration = e;
  };
}
function Xh(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? Yh : Gh)(e, t)) : ct(this.node(), e).duration;
}
function Kh(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    Mt(this, t).ease = e;
  };
}
function Zh(t) {
  var e = this._id;
  return arguments.length ? this.each(Kh(e, t)) : ct(this.node(), e).ease;
}
function Jh(t) {
  typeof t != "function" && (t = Ki(t));
  for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
    for (var s = e[i], a = s.length, l = r[i] = [], u, f = 0; f < a; ++f)
      (u = s[f]) && t.call(u, u.__data__, f, s) && l.push(u);
  return new xt(r, this._parents, this._name, this._id);
}
function Qh(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, r = e.length, i = n.length, s = Math.min(r, i), a = new Array(r), l = 0; l < s; ++l)
    for (var u = e[l], f = n[l], p = u.length, g = a[l] = new Array(p), _, m = 0; m < p; ++m)
      (_ = u[m] || f[m]) && (g[m] = _);
  for (; l < r; ++l)
    a[l] = e[l];
  return new xt(a, this._parents, this._name, this._id);
}
function jh(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function ef(t, e, n) {
  var r, i, s = jh(e) ? cs : Mt;
  return function() {
    var a = s(this, t), l = a.on;
    l !== r && (i = (r = l).copy()).on(e, n), a.on = i;
  };
}
function tf(t, e) {
  var n = this._id;
  return arguments.length < 2 ? ct(this.node(), n).on.on(t) : this.each(ef(n, t, e));
}
function nf(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function rf() {
  return this.on("end.remove", nf(this._id));
}
function sf(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Dr(t));
  for (var r = this._groups, i = r.length, s = new Array(i), a = 0; a < i; ++a)
    for (var l = r[a], u = l.length, f = s[a] = new Array(u), p, g, _ = 0; _ < u; ++_)
      (p = l[_]) && (g = t.call(p, p.__data__, _, l)) && ("__data__" in p && (g.__data__ = p.__data__), f[_] = g, Ur(f[_], e, n, _, f, ct(p, n)));
  return new xt(s, this._parents, e, n);
}
function af(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Xi(t));
  for (var r = this._groups, i = r.length, s = [], a = [], l = 0; l < i; ++l)
    for (var u = r[l], f = u.length, p, g = 0; g < f; ++g)
      if (p = u[g]) {
        for (var _ = t.call(p, p.__data__, g, u), m, T = ct(p, n), c = 0, w = _.length; c < w; ++c)
          (m = _[c]) && Ur(m, e, n, c, _, T);
        s.push(_), a.push(p);
      }
  return new xt(s, a, e, n);
}
var of = qt.prototype.constructor;
function lf() {
  return new of(this._groups, this._parents);
}
function uf(t, e) {
  var n, r, i;
  return function() {
    var s = Lt(this, t), a = (this.style.removeProperty(t), Lt(this, t));
    return s === a ? null : s === n && a === r ? i : i = e(n = s, r = a);
  };
}
function zo(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function cf(t, e, n) {
  var r, i = n + "", s;
  return function() {
    var a = Lt(this, t);
    return a === i ? null : a === r ? s : s = e(r = a, n);
  };
}
function hf(t, e, n) {
  var r, i, s;
  return function() {
    var a = Lt(this, t), l = n(this), u = l + "";
    return l == null && (u = l = (this.style.removeProperty(t), Lt(this, t))), a === u ? null : a === r && u === i ? s : (i = u, s = e(r = a, l));
  };
}
function ff(t, e) {
  var n, r, i, s = "style." + e, a = "end." + s, l;
  return function() {
    var u = Mt(this, t), f = u.on, p = u.value[s] == null ? l || (l = zo(e)) : void 0;
    (f !== n || i !== p) && (r = (n = f).copy()).on(a, i = p), u.on = r;
  };
}
function df(t, e, n) {
  var r = (t += "") == "transform" ? ph : To;
  return e == null ? this.styleTween(t, uf(t, r)).on("end.style." + t, zo(t)) : typeof e == "function" ? this.styleTween(t, hf(t, r, hs(this, "style." + t, e))).each(ff(this._id, t)) : this.styleTween(t, cf(t, r, e), n).on("end.style." + t, null);
}
function pf(t, e, n) {
  return function(r) {
    this.style.setProperty(t, e(r), n);
  };
}
function gf(t, e, n) {
  var r, i;
  function s() {
    var a = e.apply(this, arguments);
    return a !== i && (r = (i = a) && pf(t, a, n)), r;
  }
  return s._value = e, s;
}
function _f(t, e, n) {
  var r = "style." + (t += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (e == null) return this.tween(r, null);
  if (typeof e != "function") throw new Error();
  return this.tween(r, gf(t, e, n ?? ""));
}
function mf(t) {
  return function() {
    this.textContent = t;
  };
}
function bf(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function vf(t) {
  return this.tween("text", typeof t == "function" ? bf(hs(this, "text", t)) : mf(t == null ? "" : t + ""));
}
function yf() {
  for (var t = this._name, e = this._id, n = No(), r = this._groups, i = r.length, s = 0; s < i; ++s)
    for (var a = r[s], l = a.length, u, f = 0; f < l; ++f)
      if (u = a[f]) {
        var p = ct(u, e);
        Ur(u, t, n, f, a, {
          time: p.time + p.delay + p.duration,
          delay: 0,
          duration: p.duration,
          ease: p.ease
        });
      }
  return new xt(r, this._parents, t, n);
}
function wf() {
  var t, e, n = this, r = n._id, i = n.size();
  return new Promise(function(s, a) {
    var l = { value: a }, u = { value: function() {
      --i === 0 && s();
    } };
    n.each(function() {
      var f = Mt(this, r), p = f.on;
      p !== t && (e = (t = p).copy(), e._.cancel.push(l), e._.interrupt.push(l), e._.end.push(u)), f.on = e;
    });
  });
}
var xf = 0;
function xt(t, e, n, r) {
  this._groups = t, this._parents = e, this._name = n, this._id = r;
}
function No() {
  return ++xf;
}
var Gt = qt.prototype;
xt.prototype = {
  constructor: xt,
  select: sf,
  selectAll: af,
  filter: Jh,
  merge: Qh,
  selection: lf,
  transition: yf,
  call: Gt.call,
  nodes: Gt.nodes,
  node: Gt.node,
  size: Gt.size,
  empty: Gt.empty,
  each: Gt.each,
  on: tf,
  attr: Fh,
  attrTween: Wh,
  style: df,
  styleTween: _f,
  text: vf,
  remove: rf,
  tween: Nh,
  delay: Hh,
  duration: Xh,
  ease: Zh,
  end: wf
};
function Mf(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var fs = 3;
(function t(e) {
  e = +e;
  function n(r) {
    return Math.pow(r, e);
  }
  return n.exponent = t, n;
})(fs);
(function t(e) {
  e = +e;
  function n(r) {
    return 1 - Math.pow(1 - r, e);
  }
  return n.exponent = t, n;
})(fs);
(function t(e) {
  e = +e;
  function n(r) {
    return ((r *= 2) <= 1 ? Math.pow(r, e) : 2 - Math.pow(2 - r, e)) / 2;
  }
  return n.exponent = t, n;
})(fs);
var ds = 1.70158;
(function t(e) {
  e = +e;
  function n(r) {
    return r * r * ((e + 1) * r - e);
  }
  return n.overshoot = t, n;
})(ds);
(function t(e) {
  e = +e;
  function n(r) {
    return --r * r * ((e + 1) * r + e) + 1;
  }
  return n.overshoot = t, n;
})(ds);
(function t(e) {
  e = +e;
  function n(r) {
    return ((r *= 2) < 1 ? r * r * ((e + 1) * r - e) : (r -= 2) * r * ((e + 1) * r + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(ds);
var pn = 2 * Math.PI, ps = 1, gs = 0.3;
(function t(e, n) {
  var r = Math.asin(1 / (e = Math.max(1, e))) * (n /= pn);
  function i(s) {
    return e * Math.pow(2, 10 * --s) * Math.sin((r - s) / n);
  }
  return i.amplitude = function(s) {
    return t(s, n * pn);
  }, i.period = function(s) {
    return t(e, s);
  }, i;
})(ps, gs);
(function t(e, n) {
  var r = Math.asin(1 / (e = Math.max(1, e))) * (n /= pn);
  function i(s) {
    return 1 - e * Math.pow(2, -10 * (s = +s)) * Math.sin((s + r) / n);
  }
  return i.amplitude = function(s) {
    return t(s, n * pn);
  }, i.period = function(s) {
    return t(e, s);
  }, i;
})(ps, gs);
(function t(e, n) {
  var r = Math.asin(1 / (e = Math.max(1, e))) * (n /= pn);
  function i(s) {
    return ((s = s * 2 - 1) < 0 ? e * Math.pow(2, 10 * s) * Math.sin((r - s) / n) : 2 - e * Math.pow(2, -10 * s) * Math.sin((r + s) / n)) / 2;
  }
  return i.amplitude = function(s) {
    return t(s, n * pn);
  }, i.period = function(s) {
    return t(e, s);
  }, i;
})(ps, gs);
var Pi = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Mf
};
function Sf(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      return Pi.time = Rr(), Pi;
  return n;
}
function kf(t) {
  var e, n;
  t instanceof xt ? (e = t._id, t = t._name) : (e = No(), (n = Pi).time = Rr(), t = t == null ? null : t + "");
  for (var r = this._groups, i = r.length, s = 0; s < i; ++s)
    for (var a = r[s], l = a.length, u, f = 0; f < l; ++f)
      (u = a[f]) && Ur(u, t, e, f, a, n || Sf(u, e));
  return new xt(r, this._parents, t, e);
}
qt.prototype.interrupt = Eh;
qt.prototype.transition = kf;
function jn(t) {
  return function() {
    return t;
  };
}
function Cf(t, e, n) {
  this.target = t, this.type = e, this.transform = n;
}
function wt(t, e, n) {
  this.k = t, this.x = e, this.y = n;
}
wt.prototype = {
  constructor: wt,
  scale: function(t) {
    return t === 1 ? this : new wt(this.k * t, this.x, this.y);
  },
  translate: function(t, e) {
    return t === 0 & e === 0 ? this : new wt(this.k, this.x + this.k * t, this.y + this.k * e);
  },
  apply: function(t) {
    return [t[0] * this.k + this.x, t[1] * this.k + this.y];
  },
  applyX: function(t) {
    return t * this.k + this.x;
  },
  applyY: function(t) {
    return t * this.k + this.y;
  },
  invert: function(t) {
    return [(t[0] - this.x) / this.k, (t[1] - this.y) / this.k];
  },
  invertX: function(t) {
    return (t - this.x) / this.k;
  },
  invertY: function(t) {
    return (t - this.y) / this.k;
  },
  rescaleX: function(t) {
    return t.copy().domain(t.range().map(this.invertX, this).map(t.invert, t));
  },
  rescaleY: function(t) {
    return t.copy().domain(t.range().map(this.invertY, this).map(t.invert, t));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var _s = new wt(1, 0, 0);
wt.prototype;
function di() {
  ie.stopImmediatePropagation();
}
function Tn() {
  ie.preventDefault(), ie.stopImmediatePropagation();
}
function Ef() {
  return !ie.button;
}
function Tf() {
  var t = this, e, n;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, e = t.width.baseVal.value, n = t.height.baseVal.value) : (e = t.clientWidth, n = t.clientHeight), [[0, 0], [e, n]];
}
function na() {
  return this.__zoom || _s;
}
function zf() {
  return -ie.deltaY * (ie.deltaMode ? 120 : 1) / 500;
}
function Nf() {
  return "ontouchstart" in this;
}
function Df(t, e, n) {
  var r = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], s = t.invertY(e[0][1]) - n[0][1], a = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i),
    a > s ? (s + a) / 2 : Math.min(0, s) || Math.max(0, a)
  );
}
function Af() {
  var t = Ef, e = Tf, n = Df, r = zf, i = Nf, s = [0, 1 / 0], a = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, u = vh, f = [], p = mn("start", "zoom", "end"), g, _, m = 500, T = 150, c = 0;
  function w(I) {
    I.property("__zoom", na).on("wheel.zoom", M).on("mousedown.zoom", D).on("dblclick.zoom", $).filter(i).on("touchstart.zoom", G).on("touchmove.zoom", U).on("touchend.zoom touchcancel.zoom", ae).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  w.transform = function(I, V) {
    var te = I.selection ? I.selection() : I;
    te.property("__zoom", na), I !== te ? x(I, V) : te.interrupt().each(function() {
      C(this, arguments).start().zoom(null, typeof V == "function" ? V.apply(this, arguments) : V).end();
    });
  }, w.scaleBy = function(I, V) {
    w.scaleTo(I, function() {
      var te = this.__zoom.k, ne = typeof V == "function" ? V.apply(this, arguments) : V;
      return te * ne;
    });
  }, w.scaleTo = function(I, V) {
    w.transform(I, function() {
      var te = e.apply(this, arguments), ne = this.__zoom, J = b(te), he = ne.invert(J), me = typeof V == "function" ? V.apply(this, arguments) : V;
      return n(P(z(ne, me), J, he), te, a);
    });
  }, w.translateBy = function(I, V, te) {
    w.transform(I, function() {
      return n(this.__zoom.translate(
        typeof V == "function" ? V.apply(this, arguments) : V,
        typeof te == "function" ? te.apply(this, arguments) : te
      ), e.apply(this, arguments), a);
    });
  }, w.translateTo = function(I, V, te) {
    w.transform(I, function() {
      var ne = e.apply(this, arguments), J = this.__zoom, he = b(ne);
      return n(_s.translate(he[0], he[1]).scale(J.k).translate(
        typeof V == "function" ? -V.apply(this, arguments) : -V,
        typeof te == "function" ? -te.apply(this, arguments) : -te
      ), ne, a);
    });
  };
  function z(I, V) {
    return V = Math.max(s[0], Math.min(s[1], V)), V === I.k ? I : new wt(V, I.x, I.y);
  }
  function P(I, V, te) {
    var ne = V[0] - te[0] * I.k, J = V[1] - te[1] * I.k;
    return ne === I.x && J === I.y ? I : new wt(I.k, ne, J);
  }
  function b(I) {
    return [(+I[0][0] + +I[1][0]) / 2, (+I[0][1] + +I[1][1]) / 2];
  }
  function x(I, V, te) {
    I.on("start.zoom", function() {
      C(this, arguments).start();
    }).on("interrupt.zoom end.zoom", function() {
      C(this, arguments).end();
    }).tween("zoom", function() {
      var ne = this, J = arguments, he = C(ne, J), me = e.apply(ne, J), ge = te || b(me), re = Math.max(me[1][0] - me[0][0], me[1][1] - me[0][1]), oe = ne.__zoom, le = typeof V == "function" ? V.apply(ne, J) : V, fe = u(oe.invert(ge).concat(re / oe.k), le.invert(ge).concat(re / le.k));
      return function(be) {
        if (be === 1) be = le;
        else {
          var K = fe(be), H = re / K[2];
          be = new wt(H, ge[0] - K[0] * H, ge[1] - K[1] * H);
        }
        he.zoom(null, be);
      };
    });
  }
  function C(I, V) {
    for (var te = 0, ne = f.length, J; te < ne; ++te)
      if ((J = f[te]).that === I)
        return J;
    return new E(I, V);
  }
  function E(I, V) {
    this.that = I, this.args = V, this.index = -1, this.active = 0, this.extent = e.apply(I, V);
  }
  E.prototype = {
    start: function() {
      return ++this.active === 1 && (this.index = f.push(this) - 1, this.emit("start")), this;
    },
    zoom: function(I, V) {
      return this.mouse && I !== "mouse" && (this.mouse[1] = V.invert(this.mouse[0])), this.touch0 && I !== "touch" && (this.touch0[1] = V.invert(this.touch0[0])), this.touch1 && I !== "touch" && (this.touch1[1] = V.invert(this.touch1[0])), this.that.__zoom = V, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (f.splice(this.index, 1), this.index = -1, this.emit("end")), this;
    },
    emit: function(I) {
      Bn(new Cf(w, I, this.that.__zoom), p.apply, p, [I, this.that, this.args]);
    }
  };
  function M() {
    if (!t.apply(this, arguments)) return;
    var I = C(this, arguments), V = this.__zoom, te = Math.max(s[0], Math.min(s[1], V.k * Math.pow(2, r.apply(this, arguments)))), ne = st(this);
    if (I.wheel)
      (I.mouse[0][0] !== ne[0] || I.mouse[0][1] !== ne[1]) && (I.mouse[1] = V.invert(I.mouse[0] = ne)), clearTimeout(I.wheel);
    else {
      if (V.k === te) return;
      I.mouse = [ne, V.invert(ne)], un(this), I.start();
    }
    Tn(), I.wheel = setTimeout(J, T), I.zoom("mouse", n(P(z(V, te), I.mouse[0], I.mouse[1]), I.extent, a));
    function J() {
      I.wheel = null, I.end();
    }
  }
  function D() {
    if (_ || !t.apply(this, arguments)) return;
    var I = C(this, arguments), V = Pe(ie.view).on("mousemove.zoom", he, !0).on("mouseup.zoom", me, !0), te = st(this), ne = ie.clientX, J = ie.clientY;
    ts(ie.view), di(), I.mouse = [te, this.__zoom.invert(te)], un(this), I.start();
    function he() {
      if (Tn(), !I.moved) {
        var ge = ie.clientX - ne, re = ie.clientY - J;
        I.moved = ge * ge + re * re > c;
      }
      I.zoom("mouse", n(P(I.that.__zoom, I.mouse[0] = st(I.that), I.mouse[1]), I.extent, a));
    }
    function me() {
      V.on("mousemove.zoom mouseup.zoom", null), ns(ie.view, I.moved), Tn(), I.end();
    }
  }
  function $() {
    if (t.apply(this, arguments)) {
      var I = this.__zoom, V = st(this), te = I.invert(V), ne = I.k * (ie.shiftKey ? 0.5 : 2), J = n(P(z(I, ne), V, te), e.apply(this, arguments), a);
      Tn(), l > 0 ? Pe(this).transition().duration(l).call(x, J, V) : Pe(this).call(w.transform, J);
    }
  }
  function G() {
    if (t.apply(this, arguments)) {
      var I = C(this, arguments), V = ie.changedTouches, te, ne = V.length, J, he, me;
      for (di(), J = 0; J < ne; ++J)
        he = V[J], me = gr(this, V, he.identifier), me = [me, this.__zoom.invert(me), he.identifier], I.touch0 ? I.touch1 || (I.touch1 = me) : (I.touch0 = me, te = !0);
      if (g && (g = clearTimeout(g), !I.touch1)) {
        I.end(), me = Pe(this).on("dblclick.zoom"), me && me.apply(this, arguments);
        return;
      }
      te && (g = setTimeout(function() {
        g = null;
      }, m), un(this), I.start());
    }
  }
  function U() {
    var I = C(this, arguments), V = ie.changedTouches, te = V.length, ne, J, he, me;
    for (Tn(), g && (g = clearTimeout(g)), ne = 0; ne < te; ++ne)
      J = V[ne], he = gr(this, V, J.identifier), I.touch0 && I.touch0[2] === J.identifier ? I.touch0[0] = he : I.touch1 && I.touch1[2] === J.identifier && (I.touch1[0] = he);
    if (J = I.that.__zoom, I.touch1) {
      var ge = I.touch0[0], re = I.touch0[1], oe = I.touch1[0], le = I.touch1[1], fe = (fe = oe[0] - ge[0]) * fe + (fe = oe[1] - ge[1]) * fe, be = (be = le[0] - re[0]) * be + (be = le[1] - re[1]) * be;
      J = z(J, Math.sqrt(fe / be)), he = [(ge[0] + oe[0]) / 2, (ge[1] + oe[1]) / 2], me = [(re[0] + le[0]) / 2, (re[1] + le[1]) / 2];
    } else if (I.touch0) he = I.touch0[0], me = I.touch0[1];
    else return;
    I.zoom("touch", n(P(J, he, me), I.extent, a));
  }
  function ae() {
    var I = C(this, arguments), V = ie.changedTouches, te = V.length, ne, J;
    for (di(), _ && clearTimeout(_), _ = setTimeout(function() {
      _ = null;
    }, m), ne = 0; ne < te; ++ne)
      J = V[ne], I.touch0 && I.touch0[2] === J.identifier ? delete I.touch0 : I.touch1 && I.touch1[2] === J.identifier && delete I.touch1;
    I.touch1 && !I.touch0 && (I.touch0 = I.touch1, delete I.touch1), I.touch0 ? I.touch0[1] = this.__zoom.invert(I.touch0[0]) : I.end();
  }
  return w.wheelDelta = function(I) {
    return arguments.length ? (r = typeof I == "function" ? I : jn(+I), w) : r;
  }, w.filter = function(I) {
    return arguments.length ? (t = typeof I == "function" ? I : jn(!!I), w) : t;
  }, w.touchable = function(I) {
    return arguments.length ? (i = typeof I == "function" ? I : jn(!!I), w) : i;
  }, w.extent = function(I) {
    return arguments.length ? (e = typeof I == "function" ? I : jn([[+I[0][0], +I[0][1]], [+I[1][0], +I[1][1]]]), w) : e;
  }, w.scaleExtent = function(I) {
    return arguments.length ? (s[0] = +I[0], s[1] = +I[1], w) : [s[0], s[1]];
  }, w.translateExtent = function(I) {
    return arguments.length ? (a[0][0] = +I[0][0], a[1][0] = +I[1][0], a[0][1] = +I[0][1], a[1][1] = +I[1][1], w) : [[a[0][0], a[0][1]], [a[1][0], a[1][1]]];
  }, w.constrain = function(I) {
    return arguments.length ? (n = I, w) : n;
  }, w.duration = function(I) {
    return arguments.length ? (l = +I, w) : l;
  }, w.interpolate = function(I) {
    return arguments.length ? (u = I, w) : u;
  }, w.on = function() {
    var I = p.on.apply(p, arguments);
    return I === p ? w : I;
  }, w.clickDistance = function(I) {
    return arguments.length ? (c = (I = +I) * I, w) : Math.sqrt(c);
  }, w;
}
class If {
  /**
   * Make a container that will manage panning and zooming. Creates a new SVG
   * element, with a parent div for CSS3 3D transforms.
   * @param {D3 Selection} selection - A d3 selection of a HTML node to put the
   * zoom container in. Should have a defined width and height.
   * @param {String} scroll_behavior - Either 'zoom' or 'pan'.
   * @param {Boolean} use3dTransform - If true, then use CSS3 3D transform to
   * speed up pan and zoom.
   */
  constructor(e, n, r) {
    e.classed("escher-container", !0), navigator && navigator.userAgent && navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Mozilla") === -1 && e.on("touchstart touchmove", function() {
      ie.stopPropagation();
    });
    const i = e.append("div").attr("class", "escher-zoom-container"), s = i.append("div").attr("class", "escher-3d-transform-container"), a = s.append("svg").attr("class", "escher-svg").attr("xmlns", "http://www.w3.org/2000/svg");
    a.select(".zoom-g").remove();
    const l = a.append("g").attr("class", "zoom-g");
    this.selection = e, this.container = i, this.css3TransformContainer = s, this.svg = a, this.zoomedSel = l, this.windowTranslate = { x: 0, y: 0 }, this.windowScale = 1, this._scrollBehavior = n, this._use3dTransform = r, this._panDragOn = !0, this._zoomBehavior = null, this._zoomTimeout = null, this._svgScale = this.windowScale, this._svgTranslate = this.windowTranslate, this._3dTransform = null, this._requestedFrame = !1, this.callbackManager = new bn(), this._updateScroll();
  }
  /**
   * Set up pan or zoom on scroll.
   * @param {String} scroll_behavior - 'none', 'pan' or 'zoom'.
   */
  setScrollBehavior(e) {
    this._scrollBehavior = e, this._updateScroll();
  }
  /**
   * Set the option use3dTransform
   */
  setUse3dTransform(e) {
    this._use3dTransform = e;
  }
  /**
   * Toggle the zoom drag and the cursor UI for it.
   */
  togglePanDrag(e) {
    ce.isUndefined(e) ? this._panDragOn = !this._panDragOn : this._panDragOn = e, this._panDragOn ? this.zoomedSel.style("cursor", "grab") : this.zoomedSel.style("cursor") === "grab" && this.zoomedSel.style("cursor", null), this._updateScroll();
  }
  /**
   * Update the pan and zoom behaviors. The behaviors are applied to the
   * css3TransformContainer node.
   */
  _updateScroll() {
    if (!ce.contains(["zoom", "pan", "none"], this._scrollBehavior))
      throw Error("Bad value for scroll_behavior: " + this._scrollBehavior);
    if (this.container.on("mousewheel.zoom", null).on("DOMMouseScroll.zoom", null).on("wheel.zoom", null).on("dblclick.zoom", null).on("mousewheel.escher", null).on("DOMMouseScroll.escher", null).on("wheel.escher", null).on("mousedown.zoom", null).on("touchstart.zoom", null).on("touchmove.zoom", null).on("touchend.zoom", null), this._zoomBehavior = Af().on("start", () => {
      ie.sourceEvent !== null && (ie.sourceEvent.stopPropagation(), ie.sourceEvent.preventDefault());
    }).on("zoom", () => {
      this._goToCallback(ie.transform.k, {
        x: ie.transform.x,
        y: ie.transform.y
      });
    }), this.container.call(this._zoomBehavior), this.container.on("dblclick.zoom", null), this._panDragOn || this.container.on("mousedown.zoom", null).on("touchstart.zoom", null).on("touchmove.zoom", null).on("touchend.zoom", null), this._scrollBehavior !== "zoom" && this.container.on("mousewheel.zoom", null).on("DOMMouseScroll.zoom", null).on("wheel.zoom", null), this._scrollBehavior === "pan") {
      const e = () => {
        const n = ie, r = 0.5;
        n.stopPropagation(), n.preventDefault(), n.returnValue = !1;
        const i = (a, l) => (ce.isUndefined(a) ? l : -a / 1.5) * r, s = {
          x: this.windowTranslate.x - i(n.wheelDeltaX, n.deltaX),
          y: this.windowTranslate.y - i(n.wheelDeltaY, n.deltaY)
        };
        this.goTo(this.windowScale, s);
      };
      this.container.on("mousewheel.escher", e), this.container.on("DOMMouseScroll.escher", e), this.container.on("wheel.escher", e);
    }
    this.goTo(this.windowScale, this.windowTranslate);
  }
  // ------------------------------------------------------------
  // Functions to scale and translate
  // ------------------------------------------------------------
  /**
   * Zoom the container to a specified location.
   * @param {Number} scale - The scale, between 0 and 1.
   * @param {Object} translate - The location, of the form {x: 2.0, y: 3.0}.
   */
  goTo(e, n) {
    if (!e) {
      console.error("Bad scale value");
      return;
    }
    if (!n || !("x" in n) || !("y" in n) || ce.isNaN(n.x) || ce.isNaN(n.y)) {
      console.error("Bad translate value");
      return;
    }
    const r = _s.translate(n.x, n.y).scale(e);
    this.container.call(this._zoomBehavior.transform, r);
  }
  /**
   * Execute the zoom called by the d3 zoom behavior.
   * @param {Number} scale - The scale, between 0 and 1
   * @param {Object} translate - The location, of the form { x: 2.0, y: 3.0 }
   */
  _goToCallback(e, n) {
    this.windowScale !== e && (this.windowScale = e, this.callbackManager.run("zoom_change")), this.windowTranslate = n, this._use3dTransform ? (ce.isNull(this._zoomTimeout) || clearTimeout(this._zoomTimeout), this._goTo3d(e, n, this._svgScale, this._svgTranslate), this._zoomTimeout = ce.delay(() => {
      this._requestedFrame = !1, this._goToSvg(e, n);
    }, 100)) : this._goToSvg(e, n), this.callbackManager.run("go_to");
  }
  _goTo3dFrame() {
    this._requestedFrame || (this._requestedFrame = !0, window.requestAnimationFrame(() => {
      this._requestedFrame = !1;
      const e = this._3dTransform;
      e ? (this.css3TransformContainer.style("transform", e), this.css3TransformContainer.style("-webkit-transform", e), this.css3TransformContainer.style("transform-origin", "0 0"), this.css3TransformContainer.style("-webkit-transform-origin", "0 0")) : console.warn("No _3dTransform defined");
    }));
  }
  /**
   * Zoom & pan the CSS 3D transform container
   */
  _goTo3d(e, n, r, i) {
    const s = e / r, a = Be.c_minus_c(
      n,
      Be.c_times_scalar(i, s)
    ), l = "translate(" + a.x + "px," + a.y + "px) scale(" + s + ")";
    this._3dTransform = l, this._goTo3dFrame();
  }
  _clear3d() {
    this._3dTransform && (this._3dTransform = null, this.css3TransformContainer.style("transform", null), this.css3TransformContainer.style("-webkit-transform", null), this.css3TransformContainer.style("transform-origin", null), this.css3TransformContainer.style("-webkit-transform-origin", null));
  }
  _goToSvgFrame(e = null) {
    (!this._requestedFrame || e) && (this._requestedFrame = !0, window.requestAnimationFrame(() => {
      this._requestedFrame = !1, this._clear3d();
      const n = this._svgScale, r = this._svgTranslate;
      this.zoomedSel.attr(
        "transform",
        "translate(" + r.x + "," + r.y + ") scale(" + n + ")"
      ), e && e();
    }));
  }
  /**
   * Zoom & pan the svg element. Also runs the svg_start and svg_finish callbacks.
   * @param {Number} scale - The scale, between 0 and 1.
   * @param {Object} translate - The location, of the form {x: 2.0, y: 3.0}.
   * @param {Function} callback - (optional) A callback to run after scaling.
   */
  _goToSvg(e, n, r = null) {
    this._svgScale = e, this._svgTranslate = n, this._goToSvgFrame(r);
  }
  /**
   * Zoom by a specified multiplier.
   * @param {Number} amount - A multiplier for the zoom. Greater than 1 zooms in
   * and less than 1 zooms out.
   */
  zoomBy(e) {
    var n = this.get_size(), r = {
      x: n.width / 2 - ((n.width / 2 - this.windowTranslate.x) * e + this.windowTranslate.x),
      y: n.height / 2 - ((n.height / 2 - this.windowTranslate.y) * e + this.windowTranslate.y)
    };
    this.goTo(
      this.windowScale * e,
      Be.c_plus_c(this.windowTranslate, r)
    );
  }
  /**
   * Zoom in by the default amount with the default options.
   */
  zoom_in() {
    this.zoomBy(1.5);
  }
  /**
   * Zoom out by the default amount with the default options.
   */
  zoom_out() {
    this.zoomBy(0.667);
  }
  /**
   * Return the size of the zoom container as coordinates. Throws an error if
   * width or height is not defined.
   * @returns {Object} The size coordinates, e.g. { x: 2, y: 3 }.
   */
  get_size() {
    const { width: e, height: n } = this.selection.node().getBoundingClientRect();
    return { width: e, height: n };
  }
  /**
   * Shift window if new reaction will draw off the screen.
   */
  translateOffScreen(e) {
    var n = 120, r = this.get_size(), i = {
      x: {
        min: -this.windowTranslate.x / this.windowScale + n / this.windowScale,
        max: -this.windowTranslate.x / this.windowScale + (r.width - n) / this.windowScale
      },
      y: {
        min: -this.windowTranslate.y / this.windowScale + n / this.windowScale,
        max: -this.windowTranslate.y / this.windowScale + (r.height - n) / this.windowScale
      }
    };
    e.x < i.x.min ? (this.windowTranslate.x = this.windowTranslate.x - (e.x - i.x.min) * this.windowScale, this.goTo(this.windowScale, this.windowTranslate)) : e.x > i.x.max && (this.windowTranslate.x = this.windowTranslate.x - (e.x - i.x.max) * this.windowScale, this.goTo(this.windowScale, this.windowTranslate)), e.y < i.y.min ? (this.windowTranslate.y = this.windowTranslate.y - (e.y - i.y.min) * this.windowScale, this.goTo(this.windowScale, this.windowTranslate)) : e.y > i.y.max && (this.windowTranslate.y = this.windowTranslate.y - (e.y - i.y.max) * this.windowScale, this.goTo(this.windowScale, this.windowTranslate));
  }
}
const Of = /* @__PURE__ */ _n($c), Lf = /* @__PURE__ */ _n(yc);
var pi, ra;
function Pf() {
  if (ra) return pi;
  ra = 1;
  var t = Ir(), e = ao, n = Of.default, r = Lf.format, i = t.make_class();
  i.prototype = {
    init: s,
    create_reaction: u,
    update_reaction: f,
    create_bezier: T,
    update_bezier: c,
    create_node: w,
    update_node: z,
    create_text_label: P,
    update_text_label: b,
    create_membrane: a,
    update_membrane: l,
    create_reaction_label: p,
    update_reaction_label: g,
    create_segment: _,
    update_segment: m
  }, pi = i;
  function s(C, E, M) {
    this.behavior = C, this.settings = E, this.map = M, this.callback_manager = new n();
  }
  function a(C) {
    var E = C.append("rect").attr("class", "membrane");
    return this.callback_manager.run("create_membrane", this, C), E;
  }
  function l(C) {
    C.attr("width", function(E) {
      return E.width;
    }).attr("height", function(E) {
      return E.height;
    }).attr("transform", function(E) {
      return "translate(" + E.x + "," + E.y + ")";
    }).style("stroke-width", function(E) {
      return 10;
    }).attr("rx", function(E) {
      return 20;
    }).attr("ry", function(E) {
      return 20;
    }), this.callback_manager.run("update_membrane", this, C);
  }
  function u(C) {
    var E = C.append("g").attr("id", function(M) {
      return "r" + M.reaction_id;
    }).attr("class", "reaction");
    return this.create_reaction_label(E), this.callback_manager.run("create_reaction", this, C), E;
  }
  function f(C, E, M, D, $, G) {
    C.select(".reaction-label-group").call((function(U) {
      return this.update_reaction_label(U, G);
    }).bind(this)), t.draw_a_nested_object(
      C,
      ".segment-group",
      "segments",
      "segment_id",
      this.create_segment.bind(this),
      (function(U) {
        return this.update_segment(
          U,
          E,
          M,
          D,
          $,
          G
        );
      }).bind(this),
      function(U) {
        U.remove();
      }
    ), this.callback_manager.run("update_reaction", this, C);
  }
  function p(C, E) {
    var M = C.append("g").attr("class", "reaction-label-group");
    return M.append("text").attr("class", "reaction-label label"), M.append("g").attr("class", "all-genes-label-group"), this.callback_manager.run("create_reaction_label", this, C), M;
  }
  function g(C, E) {
    r(".4g");
    const M = this.settings.get("identifiers_on_map"), D = this.settings.get("reaction_styles"), $ = this.settings.get("show_gene_reaction_rules"), G = this.settings.get("hide_all_labels"), U = this.settings.get("gene_font_size"), ae = this.behavior.reactionLabelMouseover, I = this.behavior.reactionLabelMouseout, V = this.behavior.reactionLabelTouch, te = this.behavior.geneLabelMouseover, ne = this.behavior.geneLabelMouseout, J = this.behavior.geneLabelTouch;
    C.attr("transform", function(le) {
      return "translate(" + le.label_x + "," + le.label_y + ")";
    }).call(this.behavior.turnOffDrag).call(this.behavior.reactionLabelDrag);
    var he = C.select(".reaction-label").attr("visibility", G ? "hidden" : "visible");
    G || he.text(function(le) {
      var fe = le[M];
      return E && D.indexOf("text") !== -1 && (fe += " " + le.data_string), fe;
    }).on("mouseover", ae).on("mouseout", I).on("touchend", V);
    var me = function(le, fe) {
      return le + U * 1.5 * (fe + 1);
    }, ge = C.select(".all-genes-label-group").selectAll(".gene-label-group").data(function(le) {
      var fe = "gene_string" in le && le.gene_string !== null && $ && !G && D.indexOf("text") !== -1, be = "gene_reaction_rule" in le && le.gene_reaction_rule !== null && $ && !G;
      if (fe)
        return console.warn("Showing gene_string. See TODO in source."), le.gene_string;
      if (be) {
        var K = e.gene_string_for_data(
          le.gene_reaction_rule,
          null,
          le.genes,
          null,
          M,
          null
        );
        return K.forEach(function(H, Z) {
          H.label_x = le.label_x, H.label_y = me(le.label_y, Z);
        }), K;
      } else
        return [];
    }), re = ge.enter().append("g").attr("class", "gene-label-group");
    re.append("text").attr("class", "gene-label").style("font-size", U + "px");
    var oe = re.merge(ge);
    oe.attr("transform", function(le, fe) {
      return "translate(0, " + me(0, fe) + ")";
    }), oe.select("text").text((le) => le.text).on("mouseover", te).on("mouseout", ne).on("touchend", J), ge.exit().remove(), this.callback_manager.run("update_reaction_label", this, C);
  }
  function _(C) {
    var E = C.append("g").attr("class", "segment-group").attr("id", function(M) {
      return "s" + M.segment_id;
    });
    return E.append("path").attr("class", "segment"), E.append("g").attr("class", "arrowheads"), E.append("g").attr("class", "stoichiometry-labels"), this.callback_manager.run("create_segment", this, C), E;
  }
  function m(C, E, M, D, $, G) {
    const U = this.settings.get("reaction_styles"), ae = G && U.indexOf("size") !== -1, I = G && U.indexOf("color") !== -1, V = this.settings.get("reaction_no_data_size"), te = this.settings.get("reaction_no_data_color"), ne = this.settings.get("highlight_missing"), J = this.settings.get("hide_secondary_metabolites"), he = this.settings.get("primary_metabolite_radius"), me = this.settings.get("secondary_metabolite_radius"), ge = this.behavior.reactionObjectMouseover, re = this.behavior.reactionObjectMouseout, oe = function(K, H) {
      let Z = 20, Q = 13;
      return H && (Q = K === null ? V : E.reaction_size(K), isNaN(Q) && (Q = V), Z = Q * 2), { width: Z, height: Q };
    }, le = function(K, H, Z, Q) {
      var W = H || Z > 0 ? K.height : 0, Me = Q ? he : me;
      return Me + W + 10;
    };
    C.selectAll(".segment").datum(function() {
      return Object.assign({}, this.parentNode.__data__, this.parentNode.parentNode.__data__);
    }).style("visibility", function(K) {
      var H = D[K.from_node_id], Z = D[K.to_node_id];
      return J && (Z.node_type === "metabolite" && !Z.node_is_primary || H.node_type === "metabolite" && !H.node_is_primary) ? "hidden" : null;
    }).attr("d", function(K) {
      if (K.from_node_id === null || K.to_node_id === null)
        return null;
      var H = D[K.from_node_id], Z = D[K.to_node_id], Q = K.b1, W = K.b2;
      if (H.node_type === "metabolite") {
        var Me = oe(K.data, ae), _e = le(
          Me,
          K.reversibility,
          K.from_node_coefficient,
          H.node_is_primary
        ), ke = Q === null ? Z : Q;
        H = x(_e, H, ke, "start");
      }
      if (Z.node_type == "metabolite") {
        var Me = oe(K.data, ae), _e = le(
          Me,
          K.reversibility,
          K.to_node_coefficient,
          Z.node_is_primary
        ), ke = W === null ? H : W;
        Z = x(_e, ke, Z, "end");
      }
      var Ce = "M" + H.x + "," + H.y + " ";
      return Q !== null && W !== null && (Ce += "C" + Q.x + "," + Q.y + " " + W.x + "," + W.y + " "), Ce += Z.x + "," + Z.y, Ce;
    }).style("stroke", function(K) {
      var H = this.parentNode.parentNode.__data__.bigg_id, Z = ne && M !== null && !(H in M.reactions);
      if (Z)
        return "red";
      if (I) {
        var Q = K.data;
        return Q === null ? te : E.reaction_color(Q);
      }
      return null;
    }).style("stroke-width", function(K) {
      if (ae) {
        var H = K.data;
        return H === null ? V : E.reaction_size(H);
      } else
        return null;
    }).attr("pointer-events", "visibleStroke").on("mouseover", ge).on("mouseout", re);
    var fe = C.select(".arrowheads").selectAll(".arrowhead").data(function(K) {
      var H = [], Z = D[K.from_node_id], Q = K.b1, W = D[K.to_node_id], Me = K.b2;
      if (J && (W.node_type === "metabolite" && !W.node_is_primary || Z.node_type === "metabolite" && !Z.node_is_primary))
        return H;
      if (Z.node_type === "metabolite" && (K.reversibility || K.from_node_coefficient > 0)) {
        var _e = oe(K.data, ae), ke = le(
          _e,
          K.reversibility,
          K.from_node_coefficient,
          Z.node_is_primary
        ), Ce = Q === null ? W : Q, h = t.to_degrees(t.get_angle([Z, Ce])) + 90, v = x(ke, Z, Ce, "start");
        H.push({
          data: K.data,
          x: v.x,
          y: v.y,
          size: _e,
          rotation: h,
          show_arrowhead_flux: K.from_node_coefficient < 0 === K.reverse_flux || K.data === 0
        });
      }
      if (W.node_type === "metabolite" && (K.reversibility || K.to_node_coefficient > 0)) {
        var _e = oe(K.data, ae), ke = le(
          _e,
          K.reversibility,
          K.to_node_coefficient,
          W.node_is_primary
        ), Ce = Me === null ? Z : Me, h = t.to_degrees(t.get_angle([W, Ce])) + 90, v = x(ke, Ce, W, "end");
        H.push({
          data: K.data,
          x: v.x,
          y: v.y,
          size: _e,
          rotation: h,
          show_arrowhead_flux: K.to_node_coefficient < 0 === K.reverse_flux || K.data === 0
        });
      }
      if (K.unconnected_segment_with_arrow) {
        var _e = oe(K.data, ae), Ce = W, h = t.to_degrees(t.get_angle([Z, Ce])) + 90;
        H.push({
          data: K.data,
          x: Z.x,
          y: Z.y,
          size: _e,
          rotation: h,
          show_arrowhead_flux: K.to_node_coefficient < 0 === K.reverse_flux || K.data === 0
        });
      }
      return H;
    });
    fe.enter().append("path").classed("arrowhead", !0).merge(fe).attr("d", function(K) {
      return "M" + [-K.size.width / 2, 0] + " L" + [0, K.size.height] + " L" + [K.size.width / 2, 0] + " Z";
    }).attr("transform", function(K) {
      return "translate(" + K.x + "," + K.y + ")rotate(" + K.rotation + ")";
    }).style("fill", function(K) {
      if (I)
        if (K.show_arrowhead_flux) {
          var H = K.data;
          return H === null ? te : E.reaction_color(H);
        } else
          return "#FFFFFF";
      return null;
    }).style("stroke", function(K) {
      if (I) {
        var H = K.data;
        return H === null ? te : E.reaction_color(H);
      }
      return null;
    }), fe.exit().remove();
    var be = C.select(".stoichiometry-labels").selectAll(".stoichiometry-label").data(function(K) {
      var H = [], Z = D[K.from_node_id], Q = K.b1, W = D[K.to_node_id], Me = K.b2, _e = 1.5;
      if (J && (W.node_type == "metabolite" && !W.node_is_primary || Z.node_type == "metabolite" && !Z.node_is_primary))
        return H;
      if (Z.node_type === "metabolite" && Math.abs(K.from_node_coefficient) != 1) {
        var ke = oe(K.data, ae), Ce = _e * le(ke, !1, 0, W.node_is_primary), h = Q === null ? W : Q;
        h = t.c_plus_c(h, t.rotate_coords(h, 0.5, Z));
        var v = x(Ce, Z, h, "start");
        v = t.c_plus_c(v, { x: 0, y: 7 }), H.push({
          coefficient: Math.abs(K.from_node_coefficient),
          x: v.x,
          y: v.y,
          data: K.data
        });
      }
      if (W.node_type === "metabolite" && Math.abs(K.to_node_coefficient) !== 1) {
        var ke = oe(K.data, ae), Ce = _e * le(ke, !1, 0, W.node_is_primary), h = Me === null ? Z : Me;
        h = t.c_plus_c(
          h,
          t.rotate_coords(h, 0.5, W)
        );
        var v = x(Ce, h, W, "end");
        v = t.c_plus_c(v, { x: 0, y: 7 }), H.push({
          coefficient: Math.abs(K.to_node_coefficient),
          x: v.x,
          y: v.y,
          data: K.data
        });
      }
      return H;
    });
    be.enter().append("text").attr("class", "stoichiometry-label").attr("text-anchor", "middle").merge(be).attr("transform", function(K) {
      return "translate(" + K.x + "," + K.y + ")";
    }).text(function(K) {
      return K.coefficient;
    }).style("fill", function(K) {
      if (I) {
        var H = K.data;
        return H === null ? te : E.reaction_color(H);
      }
      return null;
    }), be.exit().remove(), this.callback_manager.run("update_segment", this, C);
  }
  function T(C) {
    var E = C.append("g").attr("id", function(M) {
      return M.bezier_id;
    }).attr("class", function(M) {
      return "bezier";
    });
    return E.append("path").attr("class", "connect-line"), E.append("circle").attr("class", function(M) {
      return "bezier-circle " + M.bezier;
    }).style("stroke-width", String(1) + "px").attr("r", String(7) + "px"), this.callback_manager.run("create_bezier", this, C), E;
  }
  function c(C, E, M, D, $, G, U) {
    var ae = this.settings.get("hide_secondary_metabolites");
    if (E)
      C.attr("visibility", "visible");
    else {
      C.attr("visibility", "hidden");
      return;
    }
    C.style("visibility", function(I) {
      var V = U[I.reaction_id].segments[I.segment_id], te = G[V.from_node_id], ne = G[V.to_node_id];
      return ae && (ne.node_type === "metabolite" && !ne.node_is_primary || te.node_type === "metabolite" && !te.node_is_primary) ? "hidden" : null;
    }), C.select(".bezier-circle").call(this.behavior.turnOffDrag).call(M).on("mouseover", D).on("mouseout", $).attr("transform", function(I) {
      return I.x === null || I.y === null ? "" : "translate(" + I.x + "," + I.y + ")";
    }), C.select(".connect-line").attr("d", function(I) {
      var V = U[I.reaction_id].segments[I.segment_id], te = I.bezier === "b1" ? G[V.from_node_id] : G[V.to_node_id];
      return I.x === null || I.y === null || te.x === null || te.y === null ? "" : "M" + I.x + ", " + I.y + " " + te.x + "," + te.y;
    }), this.callback_manager.run("update_bezier", this, C);
  }
  function w(C, E, M) {
    var D = C.append("g").attr("class", "node").attr("id", function(G) {
      return "n" + G.node_id;
    });
    D.append("circle").attr("class", function(G) {
      var U = "node-circle";
      return G.node_type !== null && (U += " " + G.node_type + "-circle"), U;
    });
    var $ = D.filter(function(G) {
      return G.node_type === "metabolite";
    });
    return $.append("text").attr("class", "node-label label"), this.callback_manager.run("create_node", this, C), D;
  }
  function z(C, E, M, D, $, G, U, ae, I) {
    var V = this.settings.get("hide_secondary_metabolites"), te = this.settings.get("primary_metabolite_radius"), ne = this.settings.get("secondary_metabolite_radius"), J = this.settings.get("marker_radius"), he = this.settings.get("hide_all_labels"), me = this.settings.get("identifiers_on_map"), ge = this.settings.get("metabolite_styles"), re = {
      color: this.settings.get("metabolite_no_data_color"),
      size: this.settings.get("metabolite_no_data_size")
    }, oe = this.behavior.nodeLabelMouseover, le = this.behavior.nodeLabelMouseout, fe = this.behavior.nodeLabelTouch, be = this.behavior.nodeObjectMouseover, K = this.behavior.nodeObjectMouseout;
    C.select(".node-circle").attr("transform", function(Q) {
      return "translate(" + Q.x + "," + Q.y + ")";
    }).style("visibility", function(Q) {
      return Z(Q, V) ? "hidden" : null;
    }).attr("r", function(Q) {
      if (Q.node_type === "metabolite") {
        var W = M && ge.indexOf("size") !== -1;
        if (W) {
          var Me = Q.data;
          return Me === null ? re.size : E.metabolite_size(Me);
        } else
          return Q.node_is_primary ? te : ne;
      }
      return J;
    }).style("fill", function(Q) {
      if (Q.node_type === "metabolite") {
        var W = M && ge.indexOf("color") !== -1;
        if (W) {
          var Me = Q.data;
          return Me === null ? re.color : E.metabolite_color(Me);
        } else
          return null;
      }
      return null;
    }).attr("data-bigg-id", function(Q) {
      return Q.bigg_id !== void 0 ? Q.bigg_id : null;
    }).call(this.behavior.turnOffDrag).call(ae).on("mousedown", D).on("click", $).on("mouseover", be).on("mouseout", K);
    var H = C.select(".node-label").attr("visibility", he ? "hidden" : "visible");
    he || H.style("visibility", function(Q) {
      return Z(Q, V) ? "hidden" : null;
    }).attr("transform", function(Q) {
      return "translate(" + Q.label_x + "," + Q.label_y + ")";
    }).text(function(Q) {
      var W = Q[me];
      return M && ge.indexOf("text") !== -1 && (W += " " + Q.data_string), W;
    }).call(this.behavior.turnOffDrag).call(I).on("mouseover", oe).on("mouseout", le).on("touchend", fe), this.callback_manager.run("update_node", this, C);
    function Z(Q, W) {
      return Q.node_type === "metabolite" && W && !Q.node_is_primary;
    }
  }
  function P(C) {
    var E = C.append("g").attr("id", function(M) {
      return "l" + M.text_label_id;
    }).attr("class", "text-label");
    return E.append("text").attr("class", "label"), this.callback_manager.run("create_text_label", this, C), E;
  }
  function b(C) {
    const E = this.behavior.textLabelMousedown, M = this.behavior.textLabelClick, D = this.behavior.turnOffDrag, $ = this.behavior.selectableDrag;
    C.select(".label").text(function(G) {
      return G.text;
    }).attr("transform", function(G) {
      return "translate(" + G.x + "," + G.y + ")";
    }).on("mousedown", E).on("click", M).call(D).call($), this.callback_manager.run("update_text_label", this, C);
  }
  function x(C, E, M, D) {
    const $ = C, G = t.distance(E, M);
    if (!$ || !G)
      return console.warn("No space for displacement"), { x: E.x, y: E.y };
    if (D === "start")
      return {
        x: E.x + $ * (M.x - E.x) / G,
        y: E.y + $ * (M.y - E.y) / G
      };
    if (D === "end")
      return {
        x: M.x - $ * (M.x - E.x) / G,
        y: M.y - $ * (M.y - E.y) / G
      };
    console.error("bad displace value: " + D);
  }
  return pi;
}
var Ff = Pf();
const Bf = /* @__PURE__ */ Tt(Ff);
function Rf(t) {
  if (Math.abs(t) > Math.PI)
    throw new Error("Angle must be between -PI and PI");
  return Math.abs(t) < Math.PI / 7 || Math.abs(t - Math.PI) < Math.PI / 7 ? { x: -50, y: -40 } : t > 0 ? {
    x: 15 * (1 - Math.abs(t - Math.PI / 2) / (Math.PI / 2)),
    y: 10 + (t - Math.PI / 2) * 50
  } : {
    x: 15 * (1 - Math.abs(t + Math.PI / 2) / (Math.PI / 2)),
    y: 10 - (Math.abs(t) - Math.PI / 2) * 50
  };
}
function Do(t, e, n, r, i, s) {
  const a = se.angleNorm(t), l = i.length * 18, u = e - (e > s) - n / 2 >= -1;
  return Math.abs(a) < Math.PI / 7 ? r || u ? { x: -l * 0.3, y: 40 } : { x: -l * 0.3, y: -20 } : Math.abs(a - Math.PI) < Math.PI / 7 ? r || !u ? { x: -l * 0.3, y: 40 } : { x: -l * 0.3, y: -20 } : r ? {
    x: 25 - 38 * Math.abs(Math.abs(a) - Math.PI / 2),
    y: (Math.abs(a) - Math.PI / 2) * ((a > 0) * 2 - 1) * 50
  } : a < 0 && u || a > 0 && !u ? { x: 15, y: 0 } : { x: -l * 0.5, y: 30 };
}
function Uf(t, e, n, r, i, s, a, l) {
  const u = se.to_radians_norm(l), f = String(++s.reactions), p = { x: i.x, y: i.y }, g = 350, _ = [
    p,
    se.c_plus_c(p, { x: g, y: 0 })
  ], m = {
    x: (_[0].x + _[1].x) / 2,
    y: (_[0].y + _[1].y) / 2
  }, T = Rf(u), c = 20, w = {
    name: e.name,
    bigg_id: e.bigg_id,
    reversibility: e.reversibility,
    gene_reaction_rule: e.gene_reaction_rule,
    genes: se.clone(e.genes),
    metabolites: se.clone(e.metabolites)
  };
  se.extend(w, {
    label_x: m.x + T.x,
    label_y: m.y + T.y,
    segments: {}
  });
  const z = [], P = [];
  let b = 0, x = 0, C = !1;
  for (let J in w.metabolites) {
    const he = n[J], me = w.metabolites[J], ge = he.formula, re = {
      coefficient: me,
      bigg_id: J,
      name: he.name
    };
    if (me < 0) {
      re.index = b;
      const oe = /C([0-9]+)/.exec(ge);
      i.bigg_id === re.bigg_id ? z.push([re.index, 1 / 0]) : oe && a.indexOf(se.decompartmentalize(re.bigg_id)[0]) === -1 && z.push([re.index, parseInt(oe[1])]), b++;
    } else {
      re.index = x;
      const oe = /C([0-9]+)/.exec(ge);
      i.bigg_id === re.bigg_id ? (P.push([re.index, 1 / 0]), C = !0) : oe && a.indexOf(se.decompartmentalize(re.bigg_id)[0]) === -1 && P.push([re.index, parseInt(oe[1])]), x++;
    }
    w.metabolites[J] = re;
  }
  const E = (J, he) => he[1] > J[1] ? he : J, M = z.reduce(E, [0, 0])[0], D = P.reduce(E, [0, 0])[0];
  for (let J in w.metabolites) {
    const he = w.metabolites[J];
    he.coefficient < 0 ? (he.is_primary = he.index === M, he.count = b) : (he.is_primary = he.index === D, he.count = x);
  }
  const $ = {}, G = [
    {
      node_type: "anchor_reactants",
      dis: { x: c * (C ? 1 : -1), y: 0 }
    },
    { node_type: "center", dis: { x: 0, y: 0 } },
    {
      node_type: "anchor_products",
      dis: { x: c * (C ? -1 : 1), y: 0 }
    }
  ], U = {};
  G.map((J) => {
    const he = String(++s.nodes), me = J.node_type === "center" ? "midmarker" : "multimarker";
    $[he] = {
      node_type: me,
      x: m.x + J.dis.x,
      y: m.y + J.dis.y,
      connected_segments: [],
      name: null,
      bigg_id: null,
      label_x: null,
      label_y: null,
      node_is_primary: null,
      data: null
    }, U[J.node_type] = he;
  }), [
    [U.anchor_reactants, U.center, "reactants"],
    [U.anchor_products, U.center, "products"]
  ].map((J) => {
    const he = J[0], me = J[1], ge = String(++s.segments), re = b === 0 && J[2] === "reactants" && w.reversibility || x === 0 && J[2] === "products";
    w.segments[ge] = {
      b1: null,
      b2: null,
      from_node_id: he,
      to_node_id: me,
      from_node_coefficient: null,
      to_node_coefficient: null,
      reversibility: w.reversibility,
      data: w.data,
      reverse_flux: w.reverse_flux,
      unconnected_segment_with_arrow: re
    }, $[he].connected_segments.push({
      segment_id: ge,
      reaction_id: f
    }), $[me].connected_segments.push({
      segment_id: ge,
      reaction_id: f
    });
  });
  const I = $;
  for (let J in w.metabolites) {
    const he = w.metabolites[J];
    let me, ge;
    he.coefficient < 0 ? (me = M, ge = U.anchor_reactants) : (me = D, ge = U.anchor_products);
    const re = $f(
      he,
      me,
      _,
      m,
      g,
      C
    );
    if (i.bigg_id === he.bigg_id) {
      const oe = String(++s.segments);
      w.segments[oe] = {
        b1: re.b1,
        b2: re.b2,
        from_node_id: ge,
        to_node_id: r,
        from_node_coefficient: null,
        to_node_coefficient: he.coefficient,
        reversibility: w.reversibility
      }, i.connected_segments.push({
        segment_id: oe,
        reaction_id: f
      }), I[ge].connected_segments.push({
        segment_id: oe,
        reaction_id: f
      });
    } else {
      const oe = String(++s.segments), le = String(++s.nodes);
      w.segments[oe] = {
        b1: re.b1,
        b2: re.b2,
        from_node_id: ge,
        to_node_id: le,
        from_node_coefficient: null,
        to_node_coefficient: he.coefficient,
        reversibility: w.reversibility
      };
      const fe = Do(
        u,
        he.index,
        he.count,
        he.is_primary,
        he.bigg_id,
        me
      );
      I[le] = {
        connected_segments: [{
          segment_id: oe,
          reaction_id: f
        }],
        x: re.circle.x,
        y: re.circle.y,
        node_is_primary: he.is_primary,
        label_x: re.circle.x + fe.x,
        label_y: re.circle.y + fe.y,
        name: he.name,
        bigg_id: he.bigg_id,
        node_type: "metabolite"
      }, I[ge].connected_segments.push({
        segment_id: oe,
        reaction_id: f
      });
    }
  }
  const V = [];
  for (let J in w.metabolites)
    V.push({
      bigg_id: J,
      coefficient: w.metabolites[J].coefficient
    });
  w.metabolites = V;
  const te = {};
  te[f] = w;
  const ne = Oo(te);
  return I[r] = i, Fi(I, te, ne, u, p), {
    new_reactions: te,
    new_beziers: ne,
    new_nodes: I
  };
}
function Fi(t, e, n, r, i) {
  const s = (u) => u === null ? null : se.rotate_coords(u, r, i), a = [];
  let l = [];
  for (let u in t) {
    const f = t[u], p = s({ x: f.x, y: f.y }), g = Ao(f, e, p);
    f.connected_segments.map((_) => {
      const m = e[_.reaction_id];
      if (m === void 0) return;
      const T = _.segment_id, c = m.segments[T];
      if (c.to_node_id === u && c.b2) {
        const w = s(c.b2), z = Et(T, "b2");
        c.b2 = se.c_plus_c(c.b2, w), n[z].x = c.b2.x, n[z].y = c.b2.y;
      } else if (c.from_node_id === u && c.b1) {
        const w = s(c.b1), z = Et(T, "b1");
        c.b1 = se.c_plus_c(c.b1, w), n[z].x = c.b1.x, n[z].y = c.b1.y;
      }
    }), l = se.uniqueConcat([l, g.reaction_ids]), a.push(u);
  }
  return {
    node_ids: a,
    reaction_ids: l
  };
}
function tn(t, e, n, r, i) {
  const s = Ao(t, n, i);
  return t.connected_segments.map((a) => {
    const l = n[a.reaction_id];
    if (ce.isUndefined(l)) return;
    const u = a.segment_id, f = l.segments[u];
    [["b1", "from_node_id"], ["b2", "to_node_id"]].forEach((g) => {
      const _ = g[0], m = g[1];
      if (f[m] === e && f[_]) {
        f[_] = se.c_plus_c(f[_], i);
        const T = r[Et(u, _)];
        T.x = f[_].x, T.y = f[_].y;
      }
    }), s.reaction_ids.indexOf(a.reaction_id) < 0 && s.reaction_ids.push(a.reaction_id);
  }), s;
}
function Ao(t, e, n) {
  t.x = t.x + n.x, t.y = t.y + n.y, t.label_x = t.label_x + n.x, t.label_y = t.label_y + n.y;
  const r = [];
  return t.connected_segments.map((i) => {
    const s = e[i.reaction_id];
    r.indexOf(i.reaction_id) < 0 && (r.push(i.reaction_id), t.node_type === "midmarker" && (s.label_x = s.label_x + n.x, s.label_y = s.label_y + n.y));
  }), { reaction_ids: r };
}
function er(t, e, n) {
  const r = Math.floor(n / 2);
  return t * (e - r + (e >= r));
}
function tr(t, e, n, r) {
  const i = Math.floor(r / 2);
  return e + Math.abs(n - i + (n >= i)) * t;
}
function $f(t, e, n, r, i, s) {
  const a = n[0];
  n = [
    se.c_minus_c(n[0], a),
    se.c_minus_c(n[1], a)
  ], r = se.c_minus_c(r, a);
  const l = 80, u = 0.4, f = 0.25, p = l * 0.3, g = 50, _ = 20, m = t.count - 1;
  let T, c;
  t.is_primary ? T = 20 : (T = 10, t.index > e ? c = t.index - 1 : c = t.index);
  const w = i - T, z = [{ x: T, y: 0 }, { x: w, y: 0 }];
  let P, b, x, C;
  return t.coefficient < 0 !== s && t.is_primary ? (P = {
    x: z[0].x,
    y: z[0].y
  }, x = {
    x: r.x * (1 - u) + z[0].x * u,
    y: r.y * (1 - u) + z[0].y * u
  }, C = {
    x: r.x * f + P.x * (1 - f),
    y: r.y * f + P.y * (1 - f)
  }, b = {
    x: n[0].x,
    y: n[0].y
  }) : t.coefficient < 0 !== s ? (P = {
    x: z[0].x + tr(
      _,
      g,
      c,
      m
    ),
    y: z[0].y + er(p, c, m)
  }, x = {
    x: r.x * (1 - u) + z[0].x * u,
    y: r.y * (1 - u) + z[0].y * u
  }, C = {
    x: r.x * f + P.x * (1 - f),
    y: r.y * f + P.y * (1 - f)
  }, b = {
    x: n[0].x + tr(_, g, c, m),
    y: n[0].y + er(l, c, m)
  }) : t.coefficient > 0 !== s && t.is_primary ? (P = {
    x: z[1].x,
    y: z[1].y
  }, x = {
    x: r.x * (1 - u) + z[1].x * u,
    y: r.y * (1 - u) + z[1].y * u
  }, C = {
    x: r.x * f + P.x * (1 - f),
    y: r.y * f + P.y * (1 - f)
  }, b = {
    x: n[1].x,
    y: n[1].y
  }) : t.coefficient > 0 !== s && (P = {
    x: z[1].x - tr(_, g, c, m),
    y: z[1].y + er(p, c, m)
  }, x = {
    x: r.x * (1 - u) + z[1].x * u,
    y: r.y * (1 - u) + z[1].y * u
  }, C = {
    x: r.x * f + P.x * (1 - f),
    y: r.y * f + P.y * (1 - f)
  }, b = {
    x: n[1].x - tr(_, g, c, m),
    y: n[1].y + er(l, c, m)
  }), {
    b1: se.c_plus_c(a, x),
    b2: se.c_plus_c(a, C),
    circle: se.c_plus_c(a, b)
  };
}
function Wf(t, e, n) {
  const r = String(++t.text_labels), i = { text: e, x: n.x, y: n.y };
  return { id: r, label: i };
}
function Et(t, e) {
  return t + "_" + e;
}
function qf(t) {
  const e = [];
  for (let n in t) {
    const r = t[n];
    for (let i in r.segments) {
      const s = r.segments[i];
      ["b1", "b2"].forEach(function(l) {
        s[l] !== null && e.push(Et(i, l));
      });
    }
  }
  return e;
}
function Io(t, e) {
  const n = {};
  for (let r in t) {
    const i = t[r];
    ["b1", "b2"].forEach(function(s) {
      const a = i[s];
      if (a !== null) {
        const l = Et(r, s);
        n[l] = {
          bezier: s,
          x: a.x,
          y: a.y,
          reaction_id: e,
          segment_id: r
        };
      }
    });
  }
  return n;
}
function Oo(t) {
  const e = {};
  for (let n in t) {
    const r = t[n], i = Io(r.segments, n);
    se.extend(e, i);
  }
  return e;
}
const it = Pe, bt = st;
class Vf {
  constructor(e, n) {
    this.map = e, this.undoStack = n, this.emptyBehavior = () => {
    }, this.rotationModeEnabled = !1, this.rotationDrag = ut(), this.selectableMousedown = null, this.textLabelMousedown = null, this.textLabelClick = null, this.selectableDrag = this.emptyBehavior, this.nodeLabelMouseover = null, this.nodeLabelTouch = null, this.nodeLabelMouseout = null, this.reactionLabelMouseover = null, this.reactionLabelTouch = null, this.reactionLabelMouseout = null, this.geneLabelMouseover = null, this.geneLabelTouch = null, this.geneLabelMouseout = null, this.nodeObjectMouseover = null, this.nodeObjectMouseout = null, this.reactionObjectMouseover = null, this.reactionObjectMouseout = null, this.bezierDrag = this.emptyBehavior, this.bezierMouseover = null, this.bezierMouseout = null, this.reactionLabelDrag = this.emptyBehavior, this.nodeLabelDrag = this.emptyBehavior, this.dragging = !1;
  }
  averageLocation(e) {
    const n = [], r = [];
    for (const i in e) {
      const s = e[i];
      s.x !== void 0 && n.push(s.x), s.y !== void 0 && r.push(s.y);
    }
    return {
      x: Be.mean(n),
      y: Be.mean(r)
    };
  }
  showCenter() {
    const e = this.map.sel.selectAll("#rotation-center").data([0]), n = e.enter().append("g").attr("id", "rotation-center");
    n.append("path").attr("d", "M-32 0 L32 0").attr("class", "rotation-center-line"), n.append("path").attr("d", "M0 -32 L0 32").attr("class", "rotation-center-line");
    const r = n.merge(e);
    r.attr(
      "transform",
      "translate(" + this.center.x + "," + this.center.y + ")"
    ).attr("visibility", "visible").on("mouseover", function() {
      const i = parseFloat(r.selectAll("path").style("stroke-width"));
      r.selectAll("path").style("stroke-width", i * 2 + "px");
    }).on("mouseout", function() {
      r.selectAll("path").style("stroke-width", null);
    }).call(ut().on("drag", () => {
      const i = Be.d3_transform_catch(r.attr("transform")), s = [
        ie.dx + i.translate[0],
        ie.dy + i.translate[1]
      ];
      r.attr("transform", "translate(" + s + ")"), this.center = { x: s[0], y: s[1] };
    }));
  }
  hideCenter() {
    this.map.sel.select("#rotation-center").attr("visibility", "hidden");
  }
  /**
   * Listen for rotation, and rotate selected nodes.
   */
  toggleRotationMode(e) {
    e === void 0 ? this.rotationModeEnabled = !this.rotationModeEnabled : this.rotationModeEnabled = e;
    const n = this.map.sel.selectAll(".node-circle"), r = this.map.sel.selectAll("#canvas");
    if (this.rotationModeEnabled) {
      const i = this.map.getSelectedNodes();
      if (Object.keys(i).length === 0) {
        console.warn("No selected nodes");
        return;
      }
      this.center = this.averageLocation(i), this.showCenter();
      const s = this.map, a = Object.keys(i), l = this.map.reactions, u = this.map.nodes, f = this.map.beziers, p = (w) => {
        ie.sourceEvent.stopPropagation();
      }, g = (w, z, P, b) => {
        const x = Fi(
          i,
          l,
          f,
          z,
          b
        );
        s.draw_these_nodes(x.node_ids), s.draw_these_reactions(x.reaction_ids);
      }, _ = (w) => {
      }, m = (w, z, P) => {
        const b = {};
        a.forEach(function(C) {
          b[C] = u[C];
        });
        const x = Fi(
          b,
          l,
          f,
          -z,
          P
        );
        s.draw_these_nodes(x.node_ids), s.draw_these_reactions(x.reaction_ids);
      }, T = (w, z, P) => {
        const b = {};
        a.forEach((C) => {
          b[C] = u[C];
        });
        const x = (void 0)(
          b,
          l,
          f,
          z,
          P
        );
        s.draw_these_nodes(x.node_ids), s.draw_these_reactions(x.reaction_ids);
      }, c = () => this.center;
      this.rotationDrag = this.getGenericAngularDrag(
        p,
        g,
        _,
        m,
        T,
        c,
        this.map.sel
      ), r.call(this.rotationDrag), this.selectableDrag = this.rotationDrag;
    } else
      this.hideCenter(), n.on("mousedown.center", null), r.on("mousedown.center", null), r.on("mousedown.drag", null), r.on("touchstart.drag", null), this.rotationDrag = null, this.selectableDrag = null;
  }
  /**
   * With no argument, toggle the node click on or off. Pass in a boolean argument
   * to set the on/off state.
   */
  toggleSelectableClick(e) {
    if (e === void 0 && (e = this.selectableMousedown === null), e) {
      const n = this.map;
      this.selectableMousedown = (r) => {
        ie.stopPropagation();
      }, this.selectableClick = function(r) {
        ie.stopPropagation(), !ie.defaultPrevented && n.select_selectable(this, r, ie.shiftKey);
      }, this.nodeMouseover = function(r) {
        it(this).style("stroke-width", null);
        const i = parseFloat(it(this).style("stroke-width"));
        it(this.parentNode).classed("selected") || it(this).style("stroke-width", i * 3 + "px");
      }, this.nodeMouseout = function(r) {
        it(this).style("stroke-width", null);
      };
    } else
      this.selectableMousedown = null, this.selectableClick = null, this.nodeMouseover = null, this.nodeMouseout = null, this.map.sel.select("#nodes").selectAll(".node-circle").style("stroke-width", null);
  }
  /**
   * With no argument, toggle the text edit on mousedown on/off. Pass in a boolean
   * argument to set the on/off state. The backup state is equal to
   * selectableMousedown.
   */
  toggleTextLabelEdit(e) {
    if (e === void 0 && (e = this.textEditMousedown == null), e) {
      const n = this.map;
      this.textLabelMousedown = function() {
        if (ie.defaultPrevented)
          return;
        const r = Be.d3_transform_catch(it(this).attr("transform")).translate, i = { x: r[0], y: r[1] };
        n.callback_manager.run("edit_text_label", null, it(this), i), ie.stopPropagation();
      }, this.textLabelClick = null, this.map.sel.select("#text-labels").selectAll(".label").style("cursor", "text"), this.map.sel.on("mousedown.new_text_label", (function(r) {
        ie.preventDefault();
        const i = {
          x: bt(r)[0],
          y: bt(r)[1]
        };
        this.map.callback_manager.run("new_text_label", null, i);
      }).bind(this, this.map.sel.node()));
    } else
      this.textLabelMousedown = this.selectableMousedown, this.textLabelClick = this.selectableClick, this.map.sel.select("#text-labels").selectAll(".label").style("cursor", null), this.map.sel.on("mousedown.new_text_label", null), this.map.callback_manager.run("hide_text_label_editor");
  }
  /**
   * With no argument, toggle the node drag & bezier drag on or off. Pass in a
   * boolean argument to set the on/off state.
   */
  toggleSelectableDrag(e) {
    e === void 0 && (e = this.selectableDrag === this.emptyBehavior), e ? (this.selectableDrag = this.getSelectableDrag(this.map, this.undoStack), this.bezierDrag = this.getBezierDrag(this.map, this.undoStack)) : (this.selectableDrag = this.emptyBehavior, this.bezierDrag = this.emptyBehavior);
  }
  /**
   * With no argument, toggle the label drag on or off. Pass in a boolean argument
   * to set the on/off state.
   * @param {Boolean} onOff - The new on/off state.
   */
  toggleLabelDrag(e) {
    e === void 0 && (e = this.labelDrag === this.emptyBehavior), e ? (this.reactionLabelDrag = this.getReactionLabelDrag(this.map), this.nodeLabelDrag = this.getNodeLabelDrag(this.map)) : (this.reactionLabelDrag = this.emptyBehavior, this.nodeLabelDrag = this.emptyBehavior);
  }
  /**
   * With no argument, toggle the tooltips on mouseover labels.
   * @param {Boolean} onOff - The new on/off state.
   */
  toggleLabelMouseover(e) {
    if (e === void 0 && (e = this.nodeLabelMouseover === null), e) {
      const n = (i) => (s) => {
        this.dragging || this.map.callback_manager.run("show_tooltip", null, i, s);
      }, r = () => {
        this.map.callback_manager.run("delay_hide_tooltip");
      };
      this.nodeLabelMouseover = n("node_label"), this.nodeLabelTouch = n("node_label"), this.nodeLabelMouseout = r, this.reactionLabelMouseover = n("reaction_label"), this.reactionLabelTouch = n("reaction_label"), this.reactionLabelMouseout = r, this.geneLabelMouseover = n("gene_label"), this.geneLabelTouch = n("gene_label"), this.geneLabelMouseout = r;
    } else
      this.nodeLabelMouseover = null, this.nodeLabelTouch = null, this.nodeLabelMouseout = null, this.reactionLabelMouseover = null, this.reactionLabelTouch = null, this.reactionLabelMouseout = null, this.geneLabelMouseover = null, this.geneLabelTouch = null, this.geneLabelMouseout = null;
  }
  /**
   * With no argument, toggle the tooltips on mouseover of nodes or arrows.
   * @param {Boolean} onOff - The new on/off state.
   */
  toggleObjectMouseover(e) {
    if (e === void 0 && (e = this.nodeObjectMouseover === null), e) {
      const n = (i) => {
        const s = this;
        return function(a) {
          if (!s.dragging)
            if (i === "reaction_object") {
              const l = bt(this), u = Object.assign(
                {},
                a,
                { xPos: l[0], yPos: l[1] }
              );
              s.map.callback_manager.run("show_tooltip", null, i, u);
            } else
              s.map.callback_manager.run("show_tooltip", null, i, a);
        };
      }, r = () => {
        this.map.callback_manager.run("delay_hide_tooltip");
      };
      this.nodeObjectMouseover = n("node_object"), this.nodeObjectMouseout = r, this.reactionObjectMouseover = n("reaction_object"), this.reactionObjectMouseout = r;
    } else
      this.nodeObjectMouseover = null, this.nodeObjectMouseout = null, this.reactionObjectMouseover = null, this.reactionObjectMouseout = null;
  }
  /**
   * With no argument, toggle the tooltips upon touching of nodes or arrows.
   * @param {Boolean} onOff - The new on/off state. If this argument is not provided, then toggle the state.
   */
  toggleObjectTouch(e) {
    e === void 0 && (e = this.labelTouch === null), e ? this.objectTouch = (n, r) => {
      this.dragging || this.map.callback_manager.run("show_tooltip", null, n, r);
    } : this.objectTouch = null;
  }
  /**
   * With no argument, toggle the bezier drag on or off. Pass in a boolean
   * argument to set the on/off state.
   */
  toggleBezierDrag(e) {
    e === void 0 && (e = this.bezierDrag === this.emptyBehavior), e ? (this.bezierDrag = this.getBezierDrag(this.map), this.bezierMouseover = function(n) {
      it(this).style("stroke-width", "3px");
    }, this.bezierMouseout = function(n) {
      it(this).style("stroke-width", "1px");
    }) : (this.bezierDrag = this.emptyBehavior, this.bezierMouseover = null, this.bezierMouseout = null);
  }
  turnOffDrag(e) {
    e.on("mousedown.drag", null), e.on("touchstart.drag", null);
  }
  combineNodesAndDraw(e, n) {
    const r = this.map, i = r.nodes[n], s = r.nodes[e], a = [];
    return i.connected_segments.forEach((l) => {
      let u = null;
      try {
        if (u = r.reactions[l.reaction_id].segments[l.segment_id], u === void 0) throw new Error("undefined segment");
      } catch {
        console.warn("Could not find connected segment " + l.segment_id);
        return;
      }
      if (u.from_node_id === n) u.from_node_id = e;
      else if (u.to_node_id === n) u.to_node_id = e;
      else {
        console.error("Segment does not connect to dragged node");
        return;
      }
      s.connected_segments.push(l), a.push(Be.clone(l));
    }), r.delete_node_data([n]), r.sel.selectAll(".node-to-combine").classed("node-to-combine", !1), r.draw_everything(), a;
  }
  /**
   * Drag the selected nodes and text labels.
   * @param {} map -
   * @param {} undo_stack -
   */
  getSelectableDrag(e, n) {
    const r = ut();
    let i = null, s = null, a = null, l = null, u = null, f = null, p = null;
    const g = (T, c) => {
      const w = e.text_labels[T];
      w.x = w.x + c.x, w.y = w.y + c.y;
    }, _ = (T) => {
      this.dragging = T;
    };
    r.on("start", function(T) {
      if (_(!0), ie.sourceEvent.stopPropagation(), s = { x: 0, y: 0 }, it(this).attr("class").indexOf("label") === -1) {
        const c = this.parentNode.__data__, w = c.bigg_id, z = this.parentNode;
        i = setTimeout(() => {
          z.parentNode.insertBefore(z, z.parentNode.firstChild);
        }, 200), f = w, p = c.node_id;
      }
    }), r.on("drag", function(T) {
      it(this.parentNode).classed("selected") || e.select_selectable(this, T);
      const c = {};
      it(this).attr("class").indexOf("label") === -1 ? (c.type = "node", c.id = this.parentNode.__data__.node_id) : (c.type = "label", c.id = this.__data__.text_label_id);
      const w = e.get_selected_node_ids(), z = e.get_selected_text_label_ids();
      a = [], u = [], c.type === "node" && w.indexOf(c.id) === -1 ? a.push(c.id) : c.type === "label" && z.indexOf(c.id) === -1 ? u.push(c.id) : (a = w, u = z), l = [];
      const P = {
        x: ie.dx,
        y: ie.dy
      };
      if (s = Be.c_plus_c(s, P), a.forEach((b) => {
        const x = e.nodes[b], C = tn(
          x,
          b,
          e.reactions,
          e.beziers,
          P
        );
        l = Be.uniqueConcat([l, C.reaction_ids]);
      }), u.forEach((b) => {
        g(b, P);
      }), e.draw_these_nodes(a), e.draw_these_reactions(l), e.draw_these_text_labels(u), c.type === "node" && f) {
        const b = ie.sourceEvent;
        this.style.pointerEvents = "none";
        const x = document.elementFromPoint(b.clientX, b.clientY);
        if (this.style.pointerEvents = "", e.sel.selectAll(".node-to-combine").classed("node-to-combine", !1), x && x.classList.contains("metabolite-circle")) {
          const C = x.getAttribute("data-bigg-id"), E = x.parentNode.__data__ && x.parentNode.__data__.node_id;
          C === f && E !== p && it(x).classed("node-to-combine", !0);
        }
      }
    });
    const m = this.combineNodesAndDraw.bind(this);
    return r.on("end", function() {
      if (_(!1), a === null) {
        s = null, a = null, u = null, l = null, i = null, f = null, p = null;
        return;
      }
      const T = [];
      if (e.sel.selectAll(".node-to-combine").each((c) => {
        T.push(c.node_id);
      }), T.length === 1) {
        const c = T[0], w = this.parentNode.__data__.node_id, z = Be.clone(e.nodes[w]), P = m(
          c,
          w
        ), b = Be.clone(s);
        n.push(() => {
          e.nodes[w] = z;
          const x = e.nodes[c], C = [];
          P.forEach((E) => {
            const M = e.reactions[E.reaction_id].segments[E.segment_id];
            M.from_node_id === c ? M.from_node_id = w : M.to_node_id === c ? M.to_node_id = w : console.error("Segment does not connect to fixed node"), x.connected_segments = x.connected_segments.filter((D) => !(D.reaction_id === E.reaction_id && D.segment_id === E.segment_id)), C.indexOf(E.reaction_id) === -1 && C.push(E.reaction_id);
          }), tn(
            z,
            w,
            e.reactions,
            e.beziers,
            Be.c_times_scalar(b, -1)
          ), e.draw_these_nodes([w]), e.draw_these_reactions(C);
        }, () => {
          tn(
            z,
            w,
            e.reactions,
            e.beziers,
            Be.c_times_scalar(b, 1)
          ), m(c, w);
        });
      } else {
        const c = Be.clone(s), w = Be.clone(a), z = Be.clone(u), P = Be.clone(l);
        n.push(() => {
          w.forEach((b) => {
            const x = e.nodes[b];
            tn(
              x,
              b,
              e.reactions,
              e.beziers,
              Be.c_times_scalar(c, -1)
            );
          }), z.forEach((b) => {
            g(
              b,
              Be.c_times_scalar(c, -1)
            );
          }), e.draw_these_nodes(w), e.draw_these_reactions(P), e.draw_these_text_labels(z);
        }, () => {
          w.forEach((b) => {
            const x = e.nodes[b];
            tn(
              x,
              b,
              e.reactions,
              e.beziers,
              c
            );
          }), z.forEach((b) => {
            g(b, c);
          }), e.draw_these_nodes(w), e.draw_these_reactions(P), e.draw_these_text_labels(z);
        });
      }
      clearTimeout(i), s = null, a = null, u = null, l = null, i = null, f = null, p = null;
    }), r;
  }
  getBezierDrag(e) {
    const n = (u, f, p, g, _) => {
      const m = e.reactions[u].segments[f];
      m[p] = Be.c_plus_c(m[p], _), e.beziers[g].x = m[p].x, e.beziers[g].y = m[p].y;
    }, r = (u) => {
      u.dragging = !0;
    }, i = (u, f, p) => {
      n(
        u.reaction_id,
        u.segment_id,
        u.bezier,
        u.bezier_id,
        f
      ), e.draw_these_reactions([u.reaction_id], !1), e.draw_these_beziers([u.bezier_id]);
    }, s = (u) => {
      u.dragging = !1;
    }, a = (u, f) => {
      n(
        u.reaction_id,
        u.segment_id,
        u.bezier,
        u.bezier_id,
        Be.c_times_scalar(f, -1)
      ), e.draw_these_reactions([u.reaction_id], !1), e.draw_these_beziers([u.bezier_id]);
    }, l = (u, f) => {
      n(
        u.reaction_id,
        u.segment_id,
        u.bezier,
        u.bezier_id,
        f
      ), e.draw_these_reactions([u.reaction_id], !1), e.draw_these_beziers([u.bezier_id]);
    };
    return this.getGenericDrag(
      r,
      i,
      s,
      a,
      l,
      this.map.sel
    );
  }
  getReactionLabelDrag(e) {
    const n = (u, f) => {
      const p = e.reactions[u];
      p.label_x = p.label_x + f.x, p.label_y = p.label_y + f.y;
    }, r = (u) => {
      e.callback_manager.run("hide_tooltip");
    }, i = (u, f, p) => {
      n(u.reaction_id, f), e.draw_these_reactions([u.reaction_id]);
    }, s = () => {
    }, a = (u, f) => {
      n(u.reaction_id, Be.c_times_scalar(f, -1)), e.draw_these_reactions([u.reaction_id]);
    }, l = (u, f) => {
      n(u.reaction_id, f), e.draw_these_reactions([u.reaction_id]);
    };
    return this.getGenericDrag(
      r,
      i,
      s,
      a,
      l,
      this.map.sel
    );
  }
  getNodeLabelDrag(e) {
    const n = (u, f) => {
      const p = e.nodes[u];
      p.label_x = p.label_x + f.x, p.label_y = p.label_y + f.y;
    }, r = (u) => {
      e.callback_manager.run("hide_tooltip");
    }, i = (u, f, p) => {
      n(u.node_id, f), e.draw_these_nodes([u.node_id]);
    }, s = () => {
    }, a = (u, f) => {
      n(u.node_id, Be.c_times_scalar(f, -1)), e.draw_these_nodes([u.node_id]);
    }, l = (u, f) => {
      n(u.node_id, f), e.draw_these_nodes([u.node_id]);
    };
    return this.getGenericDrag(
      r,
      i,
      s,
      a,
      l,
      this.map.sel
    );
  }
  /**
   * Make a generic drag behavior, with undo/redo.
   *
   * startFn: function (d) Called at drag start.
   *
   * dragFn: function (d, displacement, totalDisplacement) Called during drag.
   *
   * endFn
   *
   * undoFn
   *
   * redoFn
   *
   * relativeToSelection: a d3 selection that the locations are calculated
   * against.
   *
   */
  getGenericDrag(e, n, r, i, s, a) {
    const l = ut(), u = this.undoStack, f = a.node();
    let p;
    return l.on("start", (g) => {
      this.dragging = !0, ie.sourceEvent.stopPropagation(), p = { x: 0, y: 0 }, e(g);
    }), l.on("drag", (g) => {
      const _ = {
        x: ie.dx,
        y: ie.dy
      }, m = {
        x: bt(f)[0],
        y: bt(f)[1]
      };
      p = Be.c_plus_c(p, _), n(g, _, p, m);
    }), l.on("end", (g) => {
      this.dragging = !1;
      const _ = Be.clone(g), m = Be.clone(p), T = {
        x: bt(f)[0],
        y: bt(f)[1]
      };
      u.push(function() {
        i(_, m, T);
      }, function() {
        s(_, m, T);
      }), r(g);
    }), l;
  }
  /** Make a generic drag behavior, with undo/redo. Supplies angles in place of
   * displacements.
   *
   * startFn: function (d) Called at drag start.
   *
   * dragFn: function (d, displacement, totalDisplacement) Called during drag.
   *
   * endFn:
   *
   * undoFn:
   *
   * redoFn:
   *
   * getCenter:
   *
   * relativeToSelection: a d3 selection that the locations are calculated
   * against.
   *
   */
  getGenericAngularDrag(e, n, r, i, s, a, l) {
    const u = ut(), f = this.undoStack, p = l.node();
    let g;
    return u.on("start", (_) => {
      this.dragging = !0, ie.sourceEvent.stopPropagation(), g = 0, e(_);
    }), u.on("drag", (_) => {
      const m = {
        x: ie.dx,
        y: ie.dy
      }, T = {
        x: bt(p)[0],
        y: bt(p)[1]
      }, c = a(), w = Be.angle_for_event(m, T, c);
      g = g + w, n(_, w, g, c);
    }), u.on("end", (_) => {
      this.dragging = !1;
      const m = Be.clone(_), T = g, c = Be.clone(a());
      f.push(
        () => i(m, T, c),
        () => s(m, T, c)
      ), r(_);
    }), u;
  }
}
const rn = {
  GaBuGeRd: [
    { type: "min", color: "#c8c8c8", size: 12 },
    { type: "value", value: 0.01, color: "#9696ff", size: 16 },
    { type: "value", value: 20, color: "#209123", size: 20 },
    { type: "max", color: "#ff0000", size: 25 }
  ],
  GaBuRd: [
    { type: "min", color: "#c8c8c8", size: 12 },
    { type: "median", color: "#9696ff", size: 20 },
    { type: "max", color: "#ff0000", size: 25 }
  ],
  RdYlBu: [
    { type: "min", color: "#d7191c", size: 12 },
    { type: "median", color: "#ffffbf", size: 20 },
    { type: "max", color: "#2c7bb6", size: 25 }
  ],
  GeGaRd: [
    { type: "min", color: "#209123", size: 25 },
    { type: "value", value: 0, color: "#c8c8c8", size: 12 },
    { type: "max", color: "#ff0000", size: 25 }
  ],
  WhYlRd: [
    { type: "min", color: "#fffaf0", size: 20 },
    { type: "median", color: "#f1c470", size: 30 },
    { type: "max", color: "#800000", size: 40 }
  ]
};
function Lo(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Hf(t) {
  return t.length === 1 && (t = Yf(t)), {
    left: function(e, n, r, i) {
      for (r == null && (r = 0), i == null && (i = e.length); r < i; ) {
        var s = r + i >>> 1;
        t(e[s], n) < 0 ? r = s + 1 : i = s;
      }
      return r;
    },
    right: function(e, n, r, i) {
      for (r == null && (r = 0), i == null && (i = e.length); r < i; ) {
        var s = r + i >>> 1;
        t(e[s], n) > 0 ? i = s : r = s + 1;
      }
      return r;
    }
  };
}
function Yf(t) {
  return function(e, n) {
    return Lo(t(e), n);
  };
}
var Gf = Hf(Lo), Xf = Gf.right, Bi = Math.sqrt(50), Ri = Math.sqrt(10), Ui = Math.sqrt(2);
function Kf(t, e, n) {
  var r, i = -1, s, a, l;
  if (e = +e, t = +t, n = +n, t === e && n > 0) return [t];
  if ((r = e < t) && (s = t, t = e, e = s), (l = ur(t, e, n)) === 0 || !isFinite(l)) return [];
  if (l > 0)
    for (t = Math.ceil(t / l), e = Math.floor(e / l), a = new Array(s = Math.ceil(e - t + 1)); ++i < s; ) a[i] = (t + i) * l;
  else
    for (t = Math.floor(t * l), e = Math.ceil(e * l), a = new Array(s = Math.ceil(t - e + 1)); ++i < s; ) a[i] = (t - i) / l;
  return r && a.reverse(), a;
}
function ur(t, e, n) {
  var r = (e - t) / Math.max(0, n), i = Math.floor(Math.log(r) / Math.LN10), s = r / Math.pow(10, i);
  return i >= 0 ? (s >= Bi ? 10 : s >= Ri ? 5 : s >= Ui ? 2 : 1) * Math.pow(10, i) : -Math.pow(10, -i) / (s >= Bi ? 10 : s >= Ri ? 5 : s >= Ui ? 2 : 1);
}
function Zf(t, e, n) {
  var r = Math.abs(e - t) / Math.max(0, n), i = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)), s = r / i;
  return s >= Bi ? i *= 10 : s >= Ri ? i *= 5 : s >= Ui && (i *= 2), e < t ? -i : i;
}
var Po = Array.prototype, Jf = Po.map, ia = Po.slice;
function Qf(t) {
  return function() {
    return t;
  };
}
function jf(t) {
  return +t;
}
var sa = [0, 1];
function Fo(t, e) {
  return (e -= t = +t) ? function(n) {
    return (n - t) / e;
  } : Qf(e);
}
function ed(t) {
  return function(e, n) {
    var r = t(e = +e, n = +n);
    return function(i) {
      return i <= e ? 0 : i >= n ? 1 : r(i);
    };
  };
}
function td(t) {
  return function(e, n) {
    var r = t(e = +e, n = +n);
    return function(i) {
      return i <= 0 ? e : i >= 1 ? n : r(i);
    };
  };
}
function nd(t, e, n, r) {
  var i = t[0], s = t[1], a = e[0], l = e[1];
  return s < i ? (i = n(s, i), a = r(l, a)) : (i = n(i, s), a = r(a, l)), function(u) {
    return a(i(u));
  };
}
function rd(t, e, n, r) {
  var i = Math.min(t.length, e.length) - 1, s = new Array(i), a = new Array(i), l = -1;
  for (t[i] < t[0] && (t = t.slice().reverse(), e = e.slice().reverse()); ++l < i; )
    s[l] = n(t[l], t[l + 1]), a[l] = r(e[l], e[l + 1]);
  return function(u) {
    var f = Xf(t, u, 1, i) - 1;
    return a[f](s[f](u));
  };
}
function id(t, e) {
  return e.domain(t.domain()).range(t.range()).interpolate(t.interpolate()).clamp(t.clamp());
}
function sd(t, e) {
  var n = sa, r = sa, i = Fr, s = !1, a, l, u;
  function f() {
    return a = Math.min(n.length, r.length) > 2 ? rd : nd, l = u = null, p;
  }
  function p(g) {
    return (l || (l = a(n, r, s ? ed(t) : t, i)))(+g);
  }
  return p.invert = function(g) {
    return (u || (u = a(r, n, Fo, s ? td(e) : e)))(+g);
  }, p.domain = function(g) {
    return arguments.length ? (n = Jf.call(g, jf), f()) : n.slice();
  }, p.range = function(g) {
    return arguments.length ? (r = ia.call(g), f()) : r.slice();
  }, p.rangeRound = function(g) {
    return r = ia.call(g), i = hh, f();
  }, p.clamp = function(g) {
    return arguments.length ? (s = !!g, f()) : s;
  }, p.interpolate = function(g) {
    return arguments.length ? (i = g, f()) : i;
  }, f();
}
function ad(t, e, n) {
  var r = t[0], i = t[t.length - 1], s = Zf(r, i, e ?? 10), a;
  switch (n = Rn(n ?? ",f"), n.type) {
    case "s": {
      var l = Math.max(Math.abs(r), Math.abs(i));
      return n.precision == null && !isNaN(a = Qa(s, l)) && (n.precision = a), is(n, l);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(a = ja(s, Math.max(Math.abs(r), Math.abs(i)))) && (n.precision = a - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(a = Ja(s)) && (n.precision = a - (n.type === "%") * 2);
      break;
    }
  }
  return hn(n);
}
function od(t) {
  var e = t.domain;
  return t.ticks = function(n) {
    var r = e();
    return Kf(r[0], r[r.length - 1], n ?? 10);
  }, t.tickFormat = function(n, r) {
    return ad(e(), n, r);
  }, t.nice = function(n) {
    n == null && (n = 10);
    var r = e(), i = 0, s = r.length - 1, a = r[i], l = r[s], u;
    return l < a && (u = a, a = l, l = u, u = i, i = s, s = u), u = ur(a, l, n), u > 0 ? (a = Math.floor(a / u) * u, l = Math.ceil(l / u) * u, u = ur(a, l, n)) : u < 0 && (a = Math.ceil(a * u) / u, l = Math.floor(l * u) / u, u = ur(a, l, n)), u > 0 ? (r[i] = Math.floor(a / u) * u, r[s] = Math.ceil(l / u) * u, e(r)) : u < 0 && (r[i] = Math.ceil(a * u) / u, r[s] = Math.floor(l * u) / u, e(r)), t;
  }, t;
}
function ft() {
  var t = sd(Fo, lt);
  return t.copy = function() {
    return id(t, ft());
  }, od(t);
}
var gi = /* @__PURE__ */ new Date(), _i = /* @__PURE__ */ new Date();
function Ge(t, e, n, r) {
  function i(s) {
    return t(s = /* @__PURE__ */ new Date(+s)), s;
  }
  return i.floor = i, i.ceil = function(s) {
    return t(s = new Date(s - 1)), e(s, 1), t(s), s;
  }, i.round = function(s) {
    var a = i(s), l = i.ceil(s);
    return s - a < l - s ? a : l;
  }, i.offset = function(s, a) {
    return e(s = /* @__PURE__ */ new Date(+s), a == null ? 1 : Math.floor(a)), s;
  }, i.range = function(s, a, l) {
    var u = [], f;
    if (s = i.ceil(s), l = l == null ? 1 : Math.floor(l), !(s < a) || !(l > 0)) return u;
    do
      u.push(f = /* @__PURE__ */ new Date(+s)), e(s, l), t(s);
    while (f < s && s < a);
    return u;
  }, i.filter = function(s) {
    return Ge(function(a) {
      if (a >= a) for (; t(a), !s(a); ) a.setTime(a - 1);
    }, function(a, l) {
      if (a >= a)
        if (l < 0) for (; ++l <= 0; )
          for (; e(a, -1), !s(a); )
            ;
        else for (; --l >= 0; )
          for (; e(a, 1), !s(a); )
            ;
    });
  }, n && (i.count = function(s, a) {
    return gi.setTime(+s), _i.setTime(+a), t(gi), t(_i), Math.floor(n(gi, _i));
  }, i.every = function(s) {
    return s = Math.floor(s), !isFinite(s) || !(s > 0) ? null : s > 1 ? i.filter(r ? function(a) {
      return r(a) % s === 0;
    } : function(a) {
      return i.count(0, a) % s === 0;
    }) : i;
  }), i;
}
var $i = Ge(function() {
}, function(t, e) {
  t.setTime(+t + e);
}, function(t, e) {
  return e - t;
});
$i.every = function(t) {
  return t = Math.floor(t), !isFinite(t) || !(t > 0) ? null : t > 1 ? Ge(function(e) {
    e.setTime(Math.floor(e / t) * t);
  }, function(e, n) {
    e.setTime(+e + n * t);
  }, function(e, n) {
    return (n - e) / t;
  }) : $i;
};
$i.range;
var Mr = 1e3, Rt = 6e4, Sr = 36e5, Bo = 864e5, Ro = 6048e5, ld = Ge(function(t) {
  t.setTime(t - t.getMilliseconds());
}, function(t, e) {
  t.setTime(+t + e * Mr);
}, function(t, e) {
  return (e - t) / Mr;
}, function(t) {
  return t.getUTCSeconds();
});
ld.range;
var ud = Ge(function(t) {
  t.setTime(t - t.getMilliseconds() - t.getSeconds() * Mr);
}, function(t, e) {
  t.setTime(+t + e * Rt);
}, function(t, e) {
  return (e - t) / Rt;
}, function(t) {
  return t.getMinutes();
});
ud.range;
var cd = Ge(function(t) {
  t.setTime(t - t.getMilliseconds() - t.getSeconds() * Mr - t.getMinutes() * Rt);
}, function(t, e) {
  t.setTime(+t + e * Sr);
}, function(t, e) {
  return (e - t) / Sr;
}, function(t) {
  return t.getHours();
});
cd.range;
var ms = Ge(function(t) {
  t.setHours(0, 0, 0, 0);
}, function(t, e) {
  t.setDate(t.getDate() + e);
}, function(t, e) {
  return (e - t - (e.getTimezoneOffset() - t.getTimezoneOffset()) * Rt) / Bo;
}, function(t) {
  return t.getDate() - 1;
});
ms.range;
function Vt(t) {
  return Ge(function(e) {
    e.setDate(e.getDate() - (e.getDay() + 7 - t) % 7), e.setHours(0, 0, 0, 0);
  }, function(e, n) {
    e.setDate(e.getDate() + n * 7);
  }, function(e, n) {
    return (n - e - (n.getTimezoneOffset() - e.getTimezoneOffset()) * Rt) / Ro;
  });
}
var Uo = Vt(0), kr = Vt(1), hd = Vt(2), fd = Vt(3), cr = Vt(4), dd = Vt(5), pd = Vt(6);
Uo.range;
kr.range;
hd.range;
fd.range;
cr.range;
dd.range;
pd.range;
var gd = Ge(function(t) {
  t.setDate(1), t.setHours(0, 0, 0, 0);
}, function(t, e) {
  t.setMonth(t.getMonth() + e);
}, function(t, e) {
  return e.getMonth() - t.getMonth() + (e.getFullYear() - t.getFullYear()) * 12;
}, function(t) {
  return t.getMonth();
});
gd.range;
var Ut = Ge(function(t) {
  t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, function(t, e) {
  t.setFullYear(t.getFullYear() + e);
}, function(t, e) {
  return e.getFullYear() - t.getFullYear();
}, function(t) {
  return t.getFullYear();
});
Ut.every = function(t) {
  return !isFinite(t = Math.floor(t)) || !(t > 0) ? null : Ge(function(e) {
    e.setFullYear(Math.floor(e.getFullYear() / t) * t), e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
  }, function(e, n) {
    e.setFullYear(e.getFullYear() + n * t);
  });
};
Ut.range;
var _d = Ge(function(t) {
  t.setUTCSeconds(0, 0);
}, function(t, e) {
  t.setTime(+t + e * Rt);
}, function(t, e) {
  return (e - t) / Rt;
}, function(t) {
  return t.getUTCMinutes();
});
_d.range;
var md = Ge(function(t) {
  t.setUTCMinutes(0, 0, 0);
}, function(t, e) {
  t.setTime(+t + e * Sr);
}, function(t, e) {
  return (e - t) / Sr;
}, function(t) {
  return t.getUTCHours();
});
md.range;
var bs = Ge(function(t) {
  t.setUTCHours(0, 0, 0, 0);
}, function(t, e) {
  t.setUTCDate(t.getUTCDate() + e);
}, function(t, e) {
  return (e - t) / Bo;
}, function(t) {
  return t.getUTCDate() - 1;
});
bs.range;
function Ht(t) {
  return Ge(function(e) {
    e.setUTCDate(e.getUTCDate() - (e.getUTCDay() + 7 - t) % 7), e.setUTCHours(0, 0, 0, 0);
  }, function(e, n) {
    e.setUTCDate(e.getUTCDate() + n * 7);
  }, function(e, n) {
    return (n - e) / Ro;
  });
}
var $o = Ht(0), Cr = Ht(1), bd = Ht(2), vd = Ht(3), hr = Ht(4), yd = Ht(5), wd = Ht(6);
$o.range;
Cr.range;
bd.range;
vd.range;
hr.range;
yd.range;
wd.range;
var xd = Ge(function(t) {
  t.setUTCDate(1), t.setUTCHours(0, 0, 0, 0);
}, function(t, e) {
  t.setUTCMonth(t.getUTCMonth() + e);
}, function(t, e) {
  return e.getUTCMonth() - t.getUTCMonth() + (e.getUTCFullYear() - t.getUTCFullYear()) * 12;
}, function(t) {
  return t.getUTCMonth();
});
xd.range;
var $t = Ge(function(t) {
  t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, function(t, e) {
  t.setUTCFullYear(t.getUTCFullYear() + e);
}, function(t, e) {
  return e.getUTCFullYear() - t.getUTCFullYear();
}, function(t) {
  return t.getUTCFullYear();
});
$t.every = function(t) {
  return !isFinite(t = Math.floor(t)) || !(t > 0) ? null : Ge(function(e) {
    e.setUTCFullYear(Math.floor(e.getUTCFullYear() / t) * t), e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
  }, function(e, n) {
    e.setUTCFullYear(e.getUTCFullYear() + n * t);
  });
};
$t.range;
function Md(t) {
  if (0 <= t.y && t.y < 100) {
    var e = new Date(-1, t.m, t.d, t.H, t.M, t.S, t.L);
    return e.setFullYear(t.y), e;
  }
  return new Date(t.y, t.m, t.d, t.H, t.M, t.S, t.L);
}
function nr(t) {
  if (0 <= t.y && t.y < 100) {
    var e = new Date(Date.UTC(-1, t.m, t.d, t.H, t.M, t.S, t.L));
    return e.setUTCFullYear(t.y), e;
  }
  return new Date(Date.UTC(t.y, t.m, t.d, t.H, t.M, t.S, t.L));
}
function zn(t) {
  return { y: t, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0 };
}
function Sd(t) {
  var e = t.dateTime, n = t.date, r = t.time, i = t.periods, s = t.days, a = t.shortDays, l = t.months, u = t.shortMonths, f = Nn(i), p = Dn(i), g = Nn(s), _ = Dn(s), m = Nn(a), T = Dn(a), c = Nn(l), w = Dn(l), z = Nn(u), P = Dn(u), b = {
    a: J,
    A: he,
    b: me,
    B: ge,
    c: null,
    d: ua,
    e: ua,
    f: Xd,
    H: Hd,
    I: Yd,
    j: Gd,
    L: Wo,
    m: Kd,
    M: Zd,
    p: re,
    Q: fa,
    s: da,
    S: Jd,
    u: Qd,
    U: jd,
    V: ep,
    w: tp,
    W: np,
    x: null,
    X: null,
    y: rp,
    Y: ip,
    Z: sp,
    "%": ha
  }, x = {
    a: oe,
    A: le,
    b: fe,
    B: be,
    c: null,
    d: ca,
    e: ca,
    f: up,
    H: ap,
    I: op,
    j: lp,
    L: qo,
    m: cp,
    M: hp,
    p: K,
    Q: fa,
    s: da,
    S: fp,
    u: dp,
    U: pp,
    V: gp,
    w: _p,
    W: mp,
    x: null,
    X: null,
    y: bp,
    Y: vp,
    Z: yp,
    "%": ha
  }, C = {
    a: G,
    A: U,
    b: ae,
    B: I,
    c: V,
    d: oa,
    e: oa,
    f: $d,
    H: la,
    I: la,
    j: Fd,
    L: Ud,
    m: Pd,
    M: Bd,
    p: $,
    Q: qd,
    s: Vd,
    S: Rd,
    u: zd,
    U: Nd,
    V: Dd,
    w: Td,
    W: Ad,
    x: te,
    X: ne,
    y: Od,
    Y: Id,
    Z: Ld,
    "%": Wd
  };
  b.x = E(n, b), b.X = E(r, b), b.c = E(e, b), x.x = E(n, x), x.X = E(r, x), x.c = E(e, x);
  function E(H, Z) {
    return function(Q) {
      var W = [], Me = -1, _e = 0, ke = H.length, Ce, h, v;
      for (Q instanceof Date || (Q = /* @__PURE__ */ new Date(+Q)); ++Me < ke; )
        H.charCodeAt(Me) === 37 && (W.push(H.slice(_e, Me)), (h = aa[Ce = H.charAt(++Me)]) != null ? Ce = H.charAt(++Me) : h = Ce === "e" ? " " : "0", (v = Z[Ce]) && (Ce = v(Q, h)), W.push(Ce), _e = Me + 1);
      return W.push(H.slice(_e, Me)), W.join("");
    };
  }
  function M(H, Z) {
    return function(Q) {
      var W = zn(1900), Me = D(W, H, Q += "", 0), _e, ke;
      if (Me != Q.length) return null;
      if ("Q" in W) return new Date(W.Q);
      if ("p" in W && (W.H = W.H % 12 + W.p * 12), "V" in W) {
        if (W.V < 1 || W.V > 53) return null;
        "w" in W || (W.w = 1), "Z" in W ? (_e = nr(zn(W.y)), ke = _e.getUTCDay(), _e = ke > 4 || ke === 0 ? Cr.ceil(_e) : Cr(_e), _e = bs.offset(_e, (W.V - 1) * 7), W.y = _e.getUTCFullYear(), W.m = _e.getUTCMonth(), W.d = _e.getUTCDate() + (W.w + 6) % 7) : (_e = Z(zn(W.y)), ke = _e.getDay(), _e = ke > 4 || ke === 0 ? kr.ceil(_e) : kr(_e), _e = ms.offset(_e, (W.V - 1) * 7), W.y = _e.getFullYear(), W.m = _e.getMonth(), W.d = _e.getDate() + (W.w + 6) % 7);
      } else ("W" in W || "U" in W) && ("w" in W || (W.w = "u" in W ? W.u % 7 : "W" in W ? 1 : 0), ke = "Z" in W ? nr(zn(W.y)).getUTCDay() : Z(zn(W.y)).getDay(), W.m = 0, W.d = "W" in W ? (W.w + 6) % 7 + W.W * 7 - (ke + 5) % 7 : W.w + W.U * 7 - (ke + 6) % 7);
      return "Z" in W ? (W.H += W.Z / 100 | 0, W.M += W.Z % 100, nr(W)) : Z(W);
    };
  }
  function D(H, Z, Q, W) {
    for (var Me = 0, _e = Z.length, ke = Q.length, Ce, h; Me < _e; ) {
      if (W >= ke) return -1;
      if (Ce = Z.charCodeAt(Me++), Ce === 37) {
        if (Ce = Z.charAt(Me++), h = C[Ce in aa ? Z.charAt(Me++) : Ce], !h || (W = h(H, Q, W)) < 0) return -1;
      } else if (Ce != Q.charCodeAt(W++))
        return -1;
    }
    return W;
  }
  function $(H, Z, Q) {
    var W = f.exec(Z.slice(Q));
    return W ? (H.p = p[W[0].toLowerCase()], Q + W[0].length) : -1;
  }
  function G(H, Z, Q) {
    var W = m.exec(Z.slice(Q));
    return W ? (H.w = T[W[0].toLowerCase()], Q + W[0].length) : -1;
  }
  function U(H, Z, Q) {
    var W = g.exec(Z.slice(Q));
    return W ? (H.w = _[W[0].toLowerCase()], Q + W[0].length) : -1;
  }
  function ae(H, Z, Q) {
    var W = z.exec(Z.slice(Q));
    return W ? (H.m = P[W[0].toLowerCase()], Q + W[0].length) : -1;
  }
  function I(H, Z, Q) {
    var W = c.exec(Z.slice(Q));
    return W ? (H.m = w[W[0].toLowerCase()], Q + W[0].length) : -1;
  }
  function V(H, Z, Q) {
    return D(H, e, Z, Q);
  }
  function te(H, Z, Q) {
    return D(H, n, Z, Q);
  }
  function ne(H, Z, Q) {
    return D(H, r, Z, Q);
  }
  function J(H) {
    return a[H.getDay()];
  }
  function he(H) {
    return s[H.getDay()];
  }
  function me(H) {
    return u[H.getMonth()];
  }
  function ge(H) {
    return l[H.getMonth()];
  }
  function re(H) {
    return i[+(H.getHours() >= 12)];
  }
  function oe(H) {
    return a[H.getUTCDay()];
  }
  function le(H) {
    return s[H.getUTCDay()];
  }
  function fe(H) {
    return u[H.getUTCMonth()];
  }
  function be(H) {
    return l[H.getUTCMonth()];
  }
  function K(H) {
    return i[+(H.getUTCHours() >= 12)];
  }
  return {
    format: function(H) {
      var Z = E(H += "", b);
      return Z.toString = function() {
        return H;
      }, Z;
    },
    parse: function(H) {
      var Z = M(H += "", Md);
      return Z.toString = function() {
        return H;
      }, Z;
    },
    utcFormat: function(H) {
      var Z = E(H += "", x);
      return Z.toString = function() {
        return H;
      }, Z;
    },
    utcParse: function(H) {
      var Z = M(H, nr);
      return Z.toString = function() {
        return H;
      }, Z;
    }
  };
}
var aa = { "-": "", _: " ", 0: "0" }, Ze = /^\s*\d+/, kd = /^%/, Cd = /[\\^$*+?|[\]().{}]/g;
function Re(t, e, n) {
  var r = t < 0 ? "-" : "", i = (r ? -t : t) + "", s = i.length;
  return r + (s < n ? new Array(n - s + 1).join(e) + i : i);
}
function Ed(t) {
  return t.replace(Cd, "\\$&");
}
function Nn(t) {
  return new RegExp("^(?:" + t.map(Ed).join("|") + ")", "i");
}
function Dn(t) {
  for (var e = {}, n = -1, r = t.length; ++n < r; ) e[t[n].toLowerCase()] = n;
  return e;
}
function Td(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 1));
  return r ? (t.w = +r[0], n + r[0].length) : -1;
}
function zd(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 1));
  return r ? (t.u = +r[0], n + r[0].length) : -1;
}
function Nd(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 2));
  return r ? (t.U = +r[0], n + r[0].length) : -1;
}
function Dd(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 2));
  return r ? (t.V = +r[0], n + r[0].length) : -1;
}
function Ad(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 2));
  return r ? (t.W = +r[0], n + r[0].length) : -1;
}
function Id(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 4));
  return r ? (t.y = +r[0], n + r[0].length) : -1;
}
function Od(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 2));
  return r ? (t.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function Ld(t, e, n) {
  var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(e.slice(n, n + 6));
  return r ? (t.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function Pd(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 2));
  return r ? (t.m = r[0] - 1, n + r[0].length) : -1;
}
function oa(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 2));
  return r ? (t.d = +r[0], n + r[0].length) : -1;
}
function Fd(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 3));
  return r ? (t.m = 0, t.d = +r[0], n + r[0].length) : -1;
}
function la(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 2));
  return r ? (t.H = +r[0], n + r[0].length) : -1;
}
function Bd(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 2));
  return r ? (t.M = +r[0], n + r[0].length) : -1;
}
function Rd(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 2));
  return r ? (t.S = +r[0], n + r[0].length) : -1;
}
function Ud(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 3));
  return r ? (t.L = +r[0], n + r[0].length) : -1;
}
function $d(t, e, n) {
  var r = Ze.exec(e.slice(n, n + 6));
  return r ? (t.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function Wd(t, e, n) {
  var r = kd.exec(e.slice(n, n + 1));
  return r ? n + r[0].length : -1;
}
function qd(t, e, n) {
  var r = Ze.exec(e.slice(n));
  return r ? (t.Q = +r[0], n + r[0].length) : -1;
}
function Vd(t, e, n) {
  var r = Ze.exec(e.slice(n));
  return r ? (t.Q = +r[0] * 1e3, n + r[0].length) : -1;
}
function ua(t, e) {
  return Re(t.getDate(), e, 2);
}
function Hd(t, e) {
  return Re(t.getHours(), e, 2);
}
function Yd(t, e) {
  return Re(t.getHours() % 12 || 12, e, 2);
}
function Gd(t, e) {
  return Re(1 + ms.count(Ut(t), t), e, 3);
}
function Wo(t, e) {
  return Re(t.getMilliseconds(), e, 3);
}
function Xd(t, e) {
  return Wo(t, e) + "000";
}
function Kd(t, e) {
  return Re(t.getMonth() + 1, e, 2);
}
function Zd(t, e) {
  return Re(t.getMinutes(), e, 2);
}
function Jd(t, e) {
  return Re(t.getSeconds(), e, 2);
}
function Qd(t) {
  var e = t.getDay();
  return e === 0 ? 7 : e;
}
function jd(t, e) {
  return Re(Uo.count(Ut(t), t), e, 2);
}
function ep(t, e) {
  var n = t.getDay();
  return t = n >= 4 || n === 0 ? cr(t) : cr.ceil(t), Re(cr.count(Ut(t), t) + (Ut(t).getDay() === 4), e, 2);
}
function tp(t) {
  return t.getDay();
}
function np(t, e) {
  return Re(kr.count(Ut(t), t), e, 2);
}
function rp(t, e) {
  return Re(t.getFullYear() % 100, e, 2);
}
function ip(t, e) {
  return Re(t.getFullYear() % 1e4, e, 4);
}
function sp(t) {
  var e = t.getTimezoneOffset();
  return (e > 0 ? "-" : (e *= -1, "+")) + Re(e / 60 | 0, "0", 2) + Re(e % 60, "0", 2);
}
function ca(t, e) {
  return Re(t.getUTCDate(), e, 2);
}
function ap(t, e) {
  return Re(t.getUTCHours(), e, 2);
}
function op(t, e) {
  return Re(t.getUTCHours() % 12 || 12, e, 2);
}
function lp(t, e) {
  return Re(1 + bs.count($t(t), t), e, 3);
}
function qo(t, e) {
  return Re(t.getUTCMilliseconds(), e, 3);
}
function up(t, e) {
  return qo(t, e) + "000";
}
function cp(t, e) {
  return Re(t.getUTCMonth() + 1, e, 2);
}
function hp(t, e) {
  return Re(t.getUTCMinutes(), e, 2);
}
function fp(t, e) {
  return Re(t.getUTCSeconds(), e, 2);
}
function dp(t) {
  var e = t.getUTCDay();
  return e === 0 ? 7 : e;
}
function pp(t, e) {
  return Re($o.count($t(t), t), e, 2);
}
function gp(t, e) {
  var n = t.getUTCDay();
  return t = n >= 4 || n === 0 ? hr(t) : hr.ceil(t), Re(hr.count($t(t), t) + ($t(t).getUTCDay() === 4), e, 2);
}
function _p(t) {
  return t.getUTCDay();
}
function mp(t, e) {
  return Re(Cr.count($t(t), t), e, 2);
}
function bp(t, e) {
  return Re(t.getUTCFullYear() % 100, e, 2);
}
function vp(t, e) {
  return Re(t.getUTCFullYear() % 1e4, e, 4);
}
function yp() {
  return "+0000";
}
function ha() {
  return "%";
}
function fa(t) {
  return +t;
}
function da(t) {
  return Math.floor(+t / 1e3);
}
var Xt, Vo, Ho;
wp({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function wp(t) {
  return Xt = Sd(t), Xt.format, Xt.parse, Vo = Xt.utcFormat, Ho = Xt.utcParse, Xt;
}
var Yo = "%Y-%m-%dT%H:%M:%S.%LZ";
function xp(t) {
  return t.toISOString();
}
Date.prototype.toISOString || Vo(Yo);
function Mp(t) {
  var e = new Date(t);
  return isNaN(e) ? null : e;
}
+/* @__PURE__ */ new Date("2000-01-01T00:00:00.000Z") || Ho(Yo);
function Nt(t) {
  return t.match(/.{6}/g).map(function(e) {
    return "#" + e;
  });
}
Nt("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");
Nt("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");
Nt("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");
Nt("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");
us(_t(300, 0.5, 0), _t(-240, 0.5, 1));
us(_t(-100, 0.75, 0.35), _t(80, 1.5, 0.8));
us(_t(260, 0.75, 0.35), _t(80, 1.5, 0.8));
_t();
function $r(t) {
  var e = t.length;
  return function(n) {
    return t[Math.max(0, Math.min(e - 1, Math.floor(n * e)))];
  };
}
$r(Nt("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));
$r(Nt("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));
$r(Nt("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
$r(Nt("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));
class Sp {
  constructor() {
    this.x = ft(), this.y = ft(), this.x_size = ft(), this.y_size = ft(), this.size = ft(), this.reaction_color = ft().clamp(!0), this.reaction_size = ft().clamp(!0), this.metabolite_color = ft().clamp(!0), this.metabolite_size = ft().clamp(!0);
  }
  connectToSettings(e, n, r) {
    ["reaction", "metabolite"].forEach((s) => {
      const a = `${s}_scale`, l = `${s}_scale_preset`, u = e.get(l), f = e.get(a);
      u && f && f !== rn[u] ? (console.warn(`Both ${a} and ${l} are defined. Ignoring ${l}. Set ${l} to "false" to hide this warning.`), e.set(l, null)) : u ? e.set(a, rn[u]) : f || console.error(`Must provide a ${a} or ${l}`), e.get(a) && e.get(a).length < 2 ? console.error(`Bad value for option ${a}. Scales must have at least 2 points.`) : this.setScale(s, a, r), e.streams[a].onValue((p) => {
        p && p !== rn[e.get(l)] && e.set(l, null), this.setScale(s, p, r);
      }), e.streams[l].onValue((p) => {
        p && e.set(a, rn[p]);
      }), n.callback_manager.set(`calc_data_stats__${s}`, (p) => {
        p && this.setScale(s, e.get(`${s}_scale`), r);
      });
    });
  }
  sortScale(e, n) {
    var r = e.map((i) => {
      let s;
      if (i.type in n)
        s = n[i.type];
      else if (i.type === "value")
        s = i.value;
      else
        throw new Error("Bad domain type " + i.type);
      return { v: s, color: i.color, size: i.size };
    }).sort((i, s) => i.v - s.v);
    return {
      domain: r.map((i) => i.v),
      color_range: r.map((i) => i.color),
      size_range: r.map((i) => i.size)
    };
  }
  setScale(e, n, r) {
    e === "reaction" ? this.setReactionScale(n, r) : this.setMetaboliteScale(n, r);
  }
  setReactionScale(e, n) {
    const r = n().reaction;
    if (r !== null) {
      const i = this.sortScale(e, r);
      this.reaction_color.domain(i.domain), this.reaction_size.domain(i.domain), this.reaction_color.range(i.color_range), this.reaction_size.range(i.size_range);
    }
  }
  setMetaboliteScale(e, n) {
    const r = n().metabolite;
    if (r !== null) {
      const i = this.sortScale(e, r);
      this.metabolite_color.domain(i.domain), this.metabolite_size.domain(i.domain), this.metabolite_color.range(i.color_range), this.metabolite_size.range(i.size_range);
    }
  }
}
function mi(t, e) {
  return t + 1 > e - 1 ? 0 : t + 1;
}
function kp(t, e) {
  return t - 1 < 0 ? e - 1 : t - 1;
}
class Cp {
  constructor() {
    this.stack = Array(40), this.current = -1, this.oldest = -1, this.newest = -1, this.endOfStack = !0, this.topOfStack = !0;
  }
  push(e, n) {
    return this.current = mi(this.current, this.stack.length), this.endOfStack ? this.oldest = this.current : this.oldest === this.current && (this.oldest = mi(this.oldest, this.stack.length)), this.stack[this.current] = { undo: e, redo: n }, this.newest = this.current, this.topOfStack = !0, this.endOfStack = !1, { do: () => n() };
  }
  undo() {
    if (this.endOfStack) return console.warn("End of stack.");
    this.stack[this.current].undo(), this.current === this.oldest ? this.endOfStack = !0 : this.current = kp(this.current, this.stack.length), this.topOfStack = !1;
  }
  redo() {
    if (this.topOfStack) return console.warn("Top of stack.");
    this.endOfStack || (this.current = mi(this.current, this.stack.length)), this.stack[this.current].redo(), this.current === this.newest && (this.topOfStack = !0), this.endOfStack = !1;
  }
}
var bi = { exports: {} }, pa;
function Ep() {
  return pa || (pa = 1, (function(t) {
    (function(e, n, r) {
      if (!e)
        return;
      for (var i = {
        8: "backspace",
        9: "tab",
        13: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        20: "capslock",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "ins",
        46: "del",
        91: "meta",
        93: "meta",
        224: "meta"
      }, s = {
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'"
      }, a = {
        "~": "`",
        "!": "1",
        "@": "2",
        "#": "3",
        $: "4",
        "%": "5",
        "^": "6",
        "&": "7",
        "*": "8",
        "(": "9",
        ")": "0",
        _: "-",
        "+": "=",
        ":": ";",
        '"': "'",
        "<": ",",
        ">": ".",
        "?": "/",
        "|": "\\"
      }, l = {
        option: "alt",
        command: "meta",
        return: "enter",
        escape: "esc",
        plus: "+",
        mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
      }, u, f = 1; f < 20; ++f)
        i[111 + f] = "f" + f;
      for (f = 0; f <= 9; ++f)
        i[f + 96] = f.toString();
      function p(M, D, $) {
        if (M.addEventListener) {
          M.addEventListener(D, $, !1);
          return;
        }
        M.attachEvent("on" + D, $);
      }
      function g(M) {
        if (M.type == "keypress") {
          var D = String.fromCharCode(M.which);
          return M.shiftKey || (D = D.toLowerCase()), D;
        }
        return i[M.which] ? i[M.which] : s[M.which] ? s[M.which] : String.fromCharCode(M.which).toLowerCase();
      }
      function _(M, D) {
        return M.sort().join(",") === D.sort().join(",");
      }
      function m(M) {
        var D = [];
        return M.shiftKey && D.push("shift"), M.altKey && D.push("alt"), M.ctrlKey && D.push("ctrl"), M.metaKey && D.push("meta"), D;
      }
      function T(M) {
        if (M.preventDefault) {
          M.preventDefault();
          return;
        }
        M.returnValue = !1;
      }
      function c(M) {
        if (M.stopPropagation) {
          M.stopPropagation();
          return;
        }
        M.cancelBubble = !0;
      }
      function w(M) {
        return M == "shift" || M == "ctrl" || M == "alt" || M == "meta";
      }
      function z() {
        if (!u) {
          u = {};
          for (var M in i)
            M > 95 && M < 112 || i.hasOwnProperty(M) && (u[i[M]] = M);
        }
        return u;
      }
      function P(M, D, $) {
        return $ || ($ = z()[M] ? "keydown" : "keypress"), $ == "keypress" && D.length && ($ = "keydown"), $;
      }
      function b(M) {
        return M === "+" ? ["+"] : (M = M.replace(/\+{2}/g, "+plus"), M.split("+"));
      }
      function x(M, D) {
        var $, G, U, ae = [];
        for ($ = b(M), U = 0; U < $.length; ++U)
          G = $[U], l[G] && (G = l[G]), D && D != "keypress" && a[G] && (G = a[G], ae.push("shift")), w(G) && ae.push(G);
        return D = P(G, ae, D), {
          key: G,
          modifiers: ae,
          action: D
        };
      }
      function C(M, D) {
        return M === null || M === n ? !1 : M === D ? !0 : C(M.parentNode, D);
      }
      function E(M) {
        var D = this;
        if (M = M || n, !(D instanceof E))
          return new E(M);
        D.target = M, D._callbacks = {}, D._directMap = {};
        var $ = {}, G, U = !1, ae = !1, I = !1;
        function V(re) {
          re = re || {};
          var oe = !1, le;
          for (le in $) {
            if (re[le]) {
              oe = !0;
              continue;
            }
            $[le] = 0;
          }
          oe || (I = !1);
        }
        function te(re, oe, le, fe, be, K) {
          var H, Z, Q = [], W = le.type;
          if (!D._callbacks[re])
            return [];
          for (W == "keyup" && w(re) && (oe = [re]), H = 0; H < D._callbacks[re].length; ++H)
            if (Z = D._callbacks[re][H], !(!fe && Z.seq && $[Z.seq] != Z.level) && W == Z.action && (W == "keypress" && !le.metaKey && !le.ctrlKey || _(oe, Z.modifiers))) {
              var Me = !fe && Z.combo == be, _e = fe && Z.seq == fe && Z.level == K;
              (Me || _e) && D._callbacks[re].splice(H, 1), Q.push(Z);
            }
          return Q;
        }
        function ne(re, oe, le, fe) {
          D.stopCallback(oe, oe.target || oe.srcElement, le, fe) || re(oe, le) === !1 && (T(oe), c(oe));
        }
        D._handleKey = function(re, oe, le) {
          var fe = te(re, oe, le), be, K = {}, H = 0, Z = !1;
          for (be = 0; be < fe.length; ++be)
            fe[be].seq && (H = Math.max(H, fe[be].level));
          for (be = 0; be < fe.length; ++be) {
            if (fe[be].seq) {
              if (fe[be].level != H)
                continue;
              Z = !0, K[fe[be].seq] = 1, ne(fe[be].callback, le, fe[be].combo, fe[be].seq);
              continue;
            }
            Z || ne(fe[be].callback, le, fe[be].combo);
          }
          var Q = le.type == "keypress" && ae;
          le.type == I && !w(re) && !Q && V(K), ae = Z && le.type == "keydown";
        };
        function J(re) {
          typeof re.which != "number" && (re.which = re.keyCode);
          var oe = g(re);
          if (oe) {
            if (re.type == "keyup" && U === oe) {
              U = !1;
              return;
            }
            D.handleKey(oe, m(re), re);
          }
        }
        function he() {
          clearTimeout(G), G = setTimeout(V, 1e3);
        }
        function me(re, oe, le, fe) {
          $[re] = 0;
          function be(W) {
            return function() {
              I = W, ++$[re], he();
            };
          }
          function K(W) {
            ne(le, W, re), fe !== "keyup" && (U = g(W)), setTimeout(V, 10);
          }
          for (var H = 0; H < oe.length; ++H) {
            var Z = H + 1 === oe.length, Q = Z ? K : be(fe || x(oe[H + 1]).action);
            ge(oe[H], Q, fe, re, H);
          }
        }
        function ge(re, oe, le, fe, be) {
          D._directMap[re + ":" + le] = oe, re = re.replace(/\s+/g, " ");
          var K = re.split(" "), H;
          if (K.length > 1) {
            me(re, K, oe, le);
            return;
          }
          H = x(re, le), D._callbacks[H.key] = D._callbacks[H.key] || [], te(H.key, H.modifiers, { type: H.action }, fe, re, be), D._callbacks[H.key][fe ? "unshift" : "push"]({
            callback: oe,
            modifiers: H.modifiers,
            action: H.action,
            seq: fe,
            level: be,
            combo: re
          });
        }
        D._bindMultiple = function(re, oe, le) {
          for (var fe = 0; fe < re.length; ++fe)
            ge(re[fe], oe, le);
        }, p(M, "keypress", J), p(M, "keydown", J), p(M, "keyup", J);
      }
      E.prototype.bind = function(M, D, $) {
        var G = this;
        return M = M instanceof Array ? M : [M], G._bindMultiple.call(G, M, D, $), G;
      }, E.prototype.unbind = function(M, D) {
        var $ = this;
        return $.bind.call($, M, function() {
        }, D);
      }, E.prototype.trigger = function(M, D) {
        var $ = this;
        return $._directMap[M + ":" + D] && $._directMap[M + ":" + D]({}, M), $;
      }, E.prototype.reset = function() {
        var M = this;
        return M._callbacks = {}, M._directMap = {}, M;
      }, E.prototype.stopCallback = function(M, D) {
        var $ = this;
        if ((" " + D.className + " ").indexOf(" mousetrap ") > -1 || C(D, $.target))
          return !1;
        if ("composedPath" in M && typeof M.composedPath == "function") {
          var G = M.composedPath()[0];
          G !== M.target && (D = G);
        }
        return D.tagName == "INPUT" || D.tagName == "SELECT" || D.tagName == "TEXTAREA" || D.isContentEditable;
      }, E.prototype.handleKey = function() {
        var M = this;
        return M._handleKey.apply(M, arguments);
      }, E.addKeycodes = function(M) {
        for (var D in M)
          M.hasOwnProperty(D) && (i[D] = M[D]);
        u = null;
      }, E.init = function() {
        var M = E(n);
        for (var D in M)
          D.charAt(0) !== "_" && (E[D] = /* @__PURE__ */ (function($) {
            return function() {
              return M[$].apply(M, arguments);
            };
          })(D));
      }, E.init(), e.Mousetrap = E, t.exports && (t.exports = E);
    })(typeof window < "u" ? window : null, typeof window < "u" ? document : null);
  })(bi)), bi.exports;
}
var Tp = Ep();
const ga = /* @__PURE__ */ Tt(Tp);
function _a(t, e) {
  if (!e) return t;
  const n = ce.isArray(t) ? t : [t], r = n.reduce((i, s) => {
    var a = s.replace("ctrl+", "meta+");
    return a !== s && i.push(a), i;
  }, n.slice());
  return r.length === n.length ? t : r;
}
class zp {
  constructor(e = {}, n = [], r = null, i = !1, s = null) {
    this.assignedKeys = e, this.inputList = n, this.mousetrap = r ? new ga(r) : new ga(), this.ctrlEqualsCmd = i, this.mousetrap.stopCallback = () => !1, this.escapeQueue = [], this.removeEscapeListener = null, this.settings = s, this.enabled = !0, this.update();
  }
  /**
   * Updated key bindings if attributes have changed.
   */
  update() {
    if (this.mousetrap.reset(), !!this.enabled)
      for (let e in this.assignedKeys) {
        const n = this.assignedKeys[e];
        if (!n.key) continue;
        const r = _a(n.key, this.ctrlEqualsCmd);
        n.inputList = this.inputList, this.mousetrap.bind(r, (i) => {
          if (n.requires && !this.settings.get(n.requires))
            return;
          let s = !1;
          if (n.ignoreWithInput)
            for (var a = 0, l = n.inputList.length; a < l; a++) {
              const u = n.inputList[a], f = ce.isFunction(u) ? u() : u;
              if (f !== null && f.is_visible()) {
                s = !0;
                break;
              }
            }
          s || (n.fn ? n.fn.call(n.target) : console.warn("No function for key: " + n.key), i.preventDefault());
        }, "keydown");
      }
  }
  /**
   * Turn the key manager on or off.
   */
  toggle(e) {
    ce.isUndefined(e) && (e = !this.enabled), this.enabled = e, this.update();
  }
  /**
   * Call the callback when the enter key is pressed, then unregisters the
   * listener.
   */
  addEnterListener(e, n) {
    return this.addKeyListener("enter", e, n);
  }
  /**
   * If the list is empty, drop the listener. could get called after the
   * listener is already removed
   */
  _tryDropEscapeListener() {
    this.escapeQueue.length === 0 && this.removeEscapeListener && (this.removeEscapeListener(), this.removeEscapeListener = null);
  }
  /**
   * Call the callback when the escape key is pressed, then unregisters the
   * listener.
   *
   * Unlike the other listeners, addEscapeListener keeps a queue of listeners
   * that are called in order then popped off the list.
   *
   * Escape listeners also only work one time.
   */
  addEscapeListener(e) {
    return this.removeEscapeListener === null && (this.removeEscapeListener = this.addKeyListener("escape", () => {
      this.escapeQueue.length > 0 && this.escapeQueue.pop()(), this._tryDropEscapeListener();
    })), this.escapeQueue.push(e), () => {
      const n = this.escapeQueue.indexOf(e);
      n > -1 && this.escapeQueue.splice(n, 1), this._tryDropEscapeListener();
    };
  }
  /**
   * Call the callback when the key is pressed, then unregisters the listener.
   * Returns a function that will unbind the event.
   * @param callback: The callback function with no arguments.
   * @param key_name: A key name, or list of key names, as defined by the
   *                  mousetrap library: https://craig.is/killing/mice
   * @param one_time: If True, then cancel the listener after the first execution.
   */
  addKeyListener(e, n, r = !1) {
    const i = this.mousetrap.unbind.bind(this.mousetrap, e);
    return this.mousetrap.bind(_a(e, this.ctrlEqualsCmd), (s) => {
      s.preventDefault(), n(), r && i();
    }), i;
  }
}
class Np {
  constructor(e, n) {
    this.selection = e, this.x = n.x, this.y = n.y, this.width = n.width, this.height = n.height, this.resizeEnabled = !0, this.callbackManager = new bn(), this.setup();
  }
  /**
   * Turn the resize on or off
   */
  toggleResize(e) {
    ce.isUndefined(e) && (e = !this.resizeEnabled), e ? this.selection.selectAll(".drag-rect").style("pointer-events", "auto") : this.selection.selectAll(".drag-rect").style("pointer-events", "none");
  }
  setup() {
    const r = this.selection.append("g").classed("canvas-group", !0).data([{ x: this.x, y: this.y }]), i = () => {
      ie.sourceEvent.stopPropagation();
    }, s = (w, z, P) => {
      const x = se.d3_transform_catch(P).translate;
      return w !== null && (x[0] = w), z !== null && (x[1] = z), "translate(" + x + ")";
    }, a = r.append("rect").attr("id", "mouse-node").attr("width", this.width * 10).attr("height", this.height * 10).attr("transform", "translate(" + [this.x - this.width * 10 / 2, this.y - this.height * 10 / 2] + ")").attr("pointer-events", "all");
    this.mouseNode = a;
    const l = r.append("rect").attr("id", "canvas").attr("width", this.width).attr("height", this.height).attr("transform", "translate(" + [this.x, this.y] + ")"), u = ut().on("start", i).on("drag", (w) => {
      const z = w.x;
      w.x = Math.min(w.x + this.width - 100 / 2, ie.x), this.x = w.x, this.width = this.width + (z - w.x), f.attr("transform", (P) => s(P.x - 100 / 2, null, f.attr("transform"))), a.attr("transform", (P) => s(P.x, null, a.attr("transform"))).attr("width", this.width * 10), l.attr("transform", (P) => s(P.x, null, l.attr("transform"))).attr("width", this.width), m.attr("transform", (P) => s(P.x + 100 / 2, null, m.attr("transform"))).attr("width", this.width - 100), c.attr("transform", (P) => s(P.x + 100 / 2, null, c.attr("transform"))).attr("width", this.width - 100), this.callbackManager.run("resize");
    }), f = r.append("rect").classed("drag-rect", !0).attr("transform", (w) => "translate(" + [w.x - 100 / 2, w.y + 100 / 2] + ")").attr("height", this.height - 100).attr("id", "dragleft").attr("width", 100).attr("cursor", "ew-resize").classed("resize-rect", !0).call(u), p = ut().on("start", i).on("drag", (w) => {
      ie.sourceEvent.stopPropagation();
      const z = Math.max(
        w.x + 100 / 2,
        w.x + this.width + ie.dx
      );
      this.width = z - w.x, g.attr(
        "transform",
        (P) => s(z - 100 / 2, null, g.attr("transform"))
      ), a.attr("width", this.width * 10), l.attr("width", this.width), m.attr("width", this.width - 100), c.attr("width", this.width - 100), this.callbackManager.run("resize");
    }), g = r.append("rect").classed("drag-rect", !0).attr("transform", (w) => "translate(" + [w.x + this.width - 100 / 2, w.y + 100 / 2] + ")").attr("id", "dragright").attr("height", this.height - 100).attr("width", 100).attr("cursor", "ew-resize").classed("resize-rect", !0).call(p), _ = ut().on("start", i).on("drag", (w) => {
      ie.sourceEvent.stopPropagation();
      const z = w.y;
      w.y = Math.min(w.y + this.height - 100 / 2, ie.y), this.y = w.y, this.height = this.height + (z - w.y), m.attr("transform", (P) => s(null, P.y - 100 / 2, m.attr("transform"))), a.attr("transform", (P) => s(null, P.y, a.attr("transform"))).attr("width", this.height * 10), l.attr("transform", (P) => s(null, P.y, l.attr("transform"))).attr("height", this.height), f.attr("transform", (P) => s(null, P.y + 100 / 2, f.attr("transform"))).attr("height", this.height - 100), g.attr("transform", (P) => s(null, P.y + 100 / 2, g.attr("transform"))).attr("height", this.height - 100), this.callbackManager.run("resize");
    }), m = r.append("rect").classed("drag-rect", !0).attr("transform", (w) => "translate(" + [w.x + 100 / 2, w.y - 100 / 2] + ")").attr("height", 100).attr("width", this.width - 100).attr("cursor", "ns-resize").classed("resize-rect", !0).call(_), T = ut().on("start", i).on("drag", (w) => {
      ie.sourceEvent.stopPropagation();
      const z = Math.max(
        w.y + 100 / 2,
        w.y + this.height + ie.dy
      );
      this.height = z - w.y, c.attr("transform", (P) => s(
        null,
        z - 100 / 2,
        c.attr("transform")
      )), a.attr("height", this.height * 10), l.attr("height", this.height), f.attr("height", this.height - 100), g.attr("height", this.height - 100), this.callbackManager.run("resize");
    }), c = r.append("rect").classed("drag-rect", !0).attr("transform", (w) => "translate(" + [w.x + 100 / 2, w.y + this.height - 100 / 2] + ")").attr("height", 100).attr("width", this.width - 100).attr("cursor", "ns-resize").classed("resize-rect", !0).call(T);
  }
  sizeAndLocation() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}
class Dp {
  constructor() {
    this.index = {};
  }
  /**
   * Insert a record into the index.
   * @param id - A unique string id.
   * @param record - Records have the form: { 'name': '', 'data': {} }
   * Search is performed on substrings of the name.
   * @param overwrite - (Default false) For faster performance, make overwrite true,
   * and records will be inserted without checking for an existing record.
   * @param check_record - (Default false) For faster performance, make
   * check_record * false. If true, records will be checked to make sure they
   * have name and * data attributes.
   */
  insert(e, n, r, i) {
    if (!r && e in this.index)
      throw new Error("id is already in the index");
    if (i && !("name" in n && "data" in n))
      throw new Error("malformed record");
    this.index[e] = n;
  }
  /**
   * Remove the matching record. Returns true is a record is found, or false if
   * no match is found.
   */
  remove(e) {
    return e in this.index ? (delete this.index[e], !0) : !1;
  }
  /**
   * Find a record that matches the substring. Returns an array of data from
   * matching records.
   */
  find(e) {
    const n = RegExp(e, "i"), r = [];
    for (let i in this.index) {
      const s = this.index[i];
      n.exec(s.name) && r.push(s.data);
    }
    return r;
  }
}
var fr = { exports: {} }, Ap = fr.exports, ma;
function Ip() {
  return ma || (ma = 1, (function(t) {
    (function() {
      var e = Array.prototype.slice, n = {
        toString: function() {
          return "Bacon";
        }
      };
      n.version = "0.7.95";
      var r = (typeof It < "u" && It !== null ? It : this).Error, i = function() {
      }, s = function(o, d) {
        return o;
      }, a = function(o) {
        return o.slice(0);
      }, l = function(o, d) {
        if (!d)
          throw new r(o);
      }, u = function(o) {
        if (o != null && o._isObservable && !(o != null && o._isProperty))
          throw new r("Observable is not a Property : " + o);
      }, f = function(o) {
        if (!(o != null && o._isEventStream))
          throw new r("not an EventStream : " + o);
      }, p = function(o) {
        if (!(o != null && o._isObservable))
          throw new r("not an Observable : " + o);
      }, g = function(o) {
        return l("not a function : " + o, b.isFunction(o));
      }, _ = Array.isArray || function(o) {
        return o instanceof Array;
      }, m = function(o) {
        return o && o._isObservable;
      }, T = function(o) {
        if (!_(o))
          throw new r("not an array : " + o);
      }, c = function(o) {
        return l("no arguments supported", o.length === 0);
      }, w = function(o) {
        for (var d = arguments.length, y = 1; 1 < d ? y < d : y > d; 1 < d ? y++ : y--)
          for (var S in arguments[y])
            o[S] = arguments[y][S];
        return o;
      }, z = function(o, d) {
        var y = {}.hasOwnProperty, S = function() {
        };
        S.prototype = d.prototype, o.prototype = new S();
        for (var L in d)
          y.call(d, L) && (o[L] = d[L]);
        return o;
      }, P = function(o) {
        return typeof Symbol < "u" && Symbol[o] ? Symbol[o] : typeof Symbol < "u" && typeof Symbol.for == "function" ? Symbol[o] = Symbol.for(o) : "@@" + o;
      }, b = {
        indexOf: (function() {
          return Array.prototype.indexOf ? function(o, d) {
            return o.indexOf(d);
          } : function(o, d) {
            for (var y = 0, S; y < o.length; y++)
              if (S = o[y], d === S)
                return y;
            return -1;
          };
        })(),
        indexWhere: function(o, d) {
          for (var y = 0, S; y < o.length; y++)
            if (S = o[y], d(S))
              return y;
          return -1;
        },
        head: function(o) {
          return o[0];
        },
        always: function(o) {
          return function() {
            return o;
          };
        },
        negate: function(o) {
          return function(d) {
            return !o(d);
          };
        },
        empty: function(o) {
          return o.length === 0;
        },
        tail: function(o) {
          return o.slice(1, o.length);
        },
        filter: function(o, d) {
          for (var y = [], S = 0, L; S < d.length; S++)
            L = d[S], o(L) && y.push(L);
          return y;
        },
        map: function(o, d) {
          return (function() {
            for (var y = [], S = 0, L; S < d.length; S++)
              L = d[S], y.push(o(L));
            return y;
          })();
        },
        each: function(o, d) {
          for (var y in o)
            if (Object.prototype.hasOwnProperty.call(o, y)) {
              var S = o[y];
              d(y, S);
            }
        },
        toArray: function(o) {
          return _(o) ? o : [o];
        },
        contains: function(o, d) {
          return b.indexOf(o, d) !== -1;
        },
        id: function(o) {
          return o;
        },
        last: function(o) {
          return o[o.length - 1];
        },
        all: function(o) {
          for (var d = arguments.length <= 1 || arguments[1] === void 0 ? b.id : arguments[1], y = 0, S; y < o.length; y++)
            if (S = o[y], !d(S))
              return !1;
          return !0;
        },
        any: function(o) {
          for (var d = arguments.length <= 1 || arguments[1] === void 0 ? b.id : arguments[1], y = 0, S; y < o.length; y++)
            if (S = o[y], d(S))
              return !0;
          return !1;
        },
        without: function(o, d) {
          return b.filter(function(y) {
            return y !== o;
          }, d);
        },
        remove: function(o, d) {
          var y = b.indexOf(d, o);
          if (y >= 0)
            return d.splice(y, 1);
        },
        fold: function(o, d, y) {
          for (var S = 0, L; S < o.length; S++)
            L = o[S], d = y(d, L);
          return d;
        },
        flatMap: function(o, d) {
          return b.fold(d, [], function(y, S) {
            return y.concat(o(S));
          });
        },
        cached: function(o) {
          var d = be;
          return function() {
            return typeof d < "u" && d !== null && d._isNone && (d = o(), o = void 0), d;
          };
        },
        bind: function(o, d) {
          return function() {
            return o.apply(d, arguments);
          };
        },
        isFunction: function(o) {
          return typeof o == "function";
        },
        toString: function(o) {
          var d, y, S, L = {}.hasOwnProperty;
          try {
            return x++, o == null ? "undefined" : b.isFunction(o) ? "function" : _(o) ? x > 5 ? "[..]" : "[" + b.map(b.toString, o).toString() + "]" : (o != null ? o.toString : void 0) != null && o.toString !== Object.prototype.toString ? o.toString() : typeof o == "object" ? x > 5 ? "{..}" : (d = (function() {
              var q = [];
              for (y in o)
                L.call(o, y) && (S = (function() {
                  var j;
                  try {
                    return o[y];
                  } catch (de) {
                    return de;
                  }
                })(), q.push(b.toString(y) + ":" + b.toString(S)));
              return q;
            })(), "{" + d + "}") : o;
          } finally {
            x--;
          }
        }
      }, x = 0;
      n._ = b;
      var C = n.UpdateBarrier = /* @__PURE__ */ (function() {
        var o, d = [], y = {}, S = [], L = 0, q = {};
        function j(Se) {
          Se <= L || (S[Se - 1] || (S[Se - 1] = [[], 0]), L = Se);
        }
        var de = function(Se, Ie) {
          if (o || S.length) {
            j(1);
            for (var Fe = 0; Fe < L - 1 && !ve(Se, S[Fe][0]); )
              Fe++;
            var Ve = S[Fe][0];
            Ve.push([Se, Ie]), o || we();
          } else
            return Ie();
        };
        function ve(Se, Ie) {
          for (var Fe = 0; Fe < Ie.length; Fe++)
            if (Ie[Fe][0].id == Se.id) return !0;
          return !1;
        }
        function we() {
          var Se = L;
          if (Se)
            for (; L >= Se; ) {
              var Ie = S[L - 1];
              if (!Ie) throw new _e("Unexpected stack top: " + Ie);
              var Fe = Ie[0], Ve = Ie[1];
              if (Ve < Fe.length) {
                var Je = Fe[Ve];
                Je[0];
                var ht = Je[1];
                Ie[1]++, j(L + 1);
                var mt = !1;
                try {
                  for (ht(), mt = !0; L > Se && S[L - 1][0].length == 0; )
                    L--;
                } finally {
                  mt || (S = [], L = 0);
                }
              } else {
                Ie[0] = [], Ie[1] = 0;
                break;
              }
            }
        }
        var ze = function(Se, Ie) {
          if (o) {
            var Fe = y[Se.id];
            return typeof Fe < "u" && Fe !== null ? Fe.push(Ie) : (Fe = y[Se.id] = [Ie], d.push(Se));
          } else
            return Ie();
        }, Ae = function() {
          for (; d.length > 0; )
            Ne(0, !0);
          q = {};
        }, Ne = function(Se, Ie) {
          var Fe = d[Se], Ve = Fe.id, Je = y[Ve];
          d.splice(Se, 1), delete y[Ve], Ie && d.length > 0 && qe(Fe);
          for (var ht = 0, mt; ht < Je.length; ht++)
            mt = Je[ht], mt();
        }, qe = function(Se) {
          if (!q[Se.id]) {
            for (var Ie = Se.internalDeps(), Fe = 0, Ve; Fe < Ie.length; Fe++)
              if (Ve = Ie[Fe], qe(Ve), y[Ve.id]) {
                var Je = b.indexOf(d, Ve);
                Ne(Je, !1);
              }
            q[Se.id] = !0;
          }
        }, xe = function(Se, Ie, Fe, Ve) {
          if (o)
            return Fe.apply(Ie, Ve);
          o = Se;
          try {
            var Je = Fe.apply(Ie, Ve);
            Ae();
          } finally {
            o = void 0, we();
          }
          return Je;
        }, De = function() {
          return o ? o.id : void 0;
        }, $e = function(Se, Ie) {
          var Fe = !1, Ve = !1, Je = function() {
            return Ve = !0, Ve;
          }, ht = function() {
            return Fe = !0, Je();
          };
          return Je = Se.dispatcher.subscribe(function(mt) {
            return de(Se, function() {
              if (!Fe) {
                var Gr = Ie(mt);
                if (Gr === n.noMore)
                  return ht();
              }
            });
          }), Ve && Je(), ht;
        }, Xe = function() {
          return d.length > 0;
        };
        return { whenDoneWith: ze, hasWaiters: Xe, inTransaction: xe, currentEventId: De, wrappedSubscribe: $e, afterTransaction: de };
      })();
      function E(o, d) {
        var y = arguments.length <= 2 || arguments[2] === void 0 ? !1 : arguments[2];
        this.obs = o, this.sync = d, this.lazy = y, this.queue = [];
      }
      w(E.prototype, {
        _isSource: !0,
        subscribe: function(o) {
          return this.obs.dispatcher.subscribe(o);
        },
        toString: function() {
          return this.obs.toString();
        },
        markEnded: function() {
          return this.ended = !0, !0;
        },
        consume: function() {
          return this.lazy ? { value: b.always(this.queue[0]) } : this.queue[0];
        },
        push: function(o) {
          return this.queue = [o], [o];
        },
        mayHave: function() {
          return !0;
        },
        hasAtLeast: function() {
          return this.queue.length;
        },
        flatten: !0
      });
      function M() {
        E.apply(this, arguments);
      }
      z(M, E), w(M.prototype, {
        consume: function() {
          return this.queue.shift();
        },
        push: function(o) {
          return this.queue.push(o);
        },
        mayHave: function(o) {
          return !this.ended || this.queue.length >= o;
        },
        hasAtLeast: function(o) {
          return this.queue.length >= o;
        },
        flatten: !1
      });
      function D(o) {
        E.call(this, o, !0);
      }
      z(D, E), w(D.prototype, {
        consume: function() {
          var o = this.queue;
          return this.queue = [], {
            value: function() {
              return o;
            }
          };
        },
        push: function(o) {
          return this.queue.push(o.value());
        },
        hasAtLeast: function() {
          return !0;
        }
      }), E.isTrigger = function(o) {
        return o != null && o._isSource ? o.sync : o != null ? o._isEventStream : void 0;
      }, E.fromObservable = function(o) {
        return o != null && o._isSource ? o : o != null && o._isProperty ? new E(o, !1) : new M(o, !0);
      };
      function $(o, d, y) {
        this.context = o, this.method = d, this.args = y;
      }
      w($.prototype, {
        _isDesc: !0,
        deps: function() {
          return this.cached || (this.cached = ae([this.context].concat(this.args))), this.cached;
        },
        toString: function() {
          return b.toString(this.context) + "." + b.toString(this.method) + "(" + b.map(b.toString, this.args) + ")";
        }
      });
      var G = function(o, d) {
        var y = o || d;
        if (y && y._isDesc)
          return o || d;
        for (var S = arguments.length, L = Array(S > 2 ? S - 2 : 0), q = 2; q < S; q++)
          L[q - 2] = arguments[q];
        return new $(o, d, L);
      }, U = function(o, d) {
        return d.desc = o, d;
      }, ae = function(o) {
        return _(o) ? b.flatMap(ae, o) : m(o) ? [o] : typeof o < "u" && o !== null && o._isSource ? [o.obs] : [];
      };
      n.Desc = $, n.Desc.empty = new n.Desc("", "", []);
      var I = function(o) {
        return function(d) {
          for (var y = arguments.length, S = Array(y > 1 ? y - 1 : 0), L = 1; L < y; L++)
            S[L - 1] = arguments[L];
          if (typeof d == "object" && S.length) {
            var q = d, j = S[0];
            d = function() {
              return q[j].apply(q, arguments);
            }, S = S.slice(1);
          }
          return o.apply(void 0, [d].concat(S));
        };
      }, V = function(o) {
        return o = Array.prototype.slice.call(o), me.apply(void 0, o);
      }, te = function(o, d) {
        return function() {
          for (var y = arguments.length, S = Array(y), L = 0; L < y; L++)
            S[L] = arguments[L];
          return o.apply(void 0, d.concat(S));
        };
      }, ne = function(o) {
        return function(d) {
          return function(y) {
            if (typeof y < "u" && y !== null) {
              var S = y[d];
              return b.isFunction(S) ? S.apply(y, o) : S;
            } else
              return;
          };
        };
      }, J = function(o, d) {
        var y = o.slice(1).split("."), S = b.map(ne(d), y);
        return function(L) {
          for (var q = 0, j; q < S.length; q++)
            j = S[q], L = j(L);
          return L;
        };
      }, he = function(o) {
        return typeof o == "string" && o.length > 1 && o.charAt(0) === ".";
      }, me = I(function(o) {
        for (var d = arguments.length, y = Array(d > 1 ? d - 1 : 0), S = 1; S < d; S++)
          y[S - 1] = arguments[S];
        return b.isFunction(o) ? y.length ? te(o, y) : o : he(o) ? J(o, y) : b.always(o);
      }), ge = function(o, d) {
        return me.apply(void 0, [o].concat(d));
      }, re = function(o, d, y, S) {
        if (typeof d < "u" && d !== null && d._isProperty) {
          var L = d.sampledBy(o, function(q, j) {
            return [q, j];
          });
          return S.call(L, function(q) {
            var j = q[0];
            return q[1], j;
          }).map(function(q) {
            q[0];
            var j = q[1];
            return j;
          });
        } else
          return d = ge(d, y), S.call(o, d);
      }, oe = function(o) {
        if (b.isFunction(o))
          return o;
        if (he(o)) {
          var d = le(o);
          return function(y, S) {
            return y[d](S);
          };
        } else
          throw new r("not a function or a field key: " + o);
      }, le = function(o) {
        return o.slice(1);
      };
      function fe(o) {
        this.value = o;
      }
      w(fe.prototype, {
        _isSome: !0,
        getOrElse: function() {
          return this.value;
        },
        get: function() {
          return this.value;
        },
        filter: function(o) {
          return o(this.value) ? new fe(this.value) : be;
        },
        map: function(o) {
          return new fe(o(this.value));
        },
        forEach: function(o) {
          return o(this.value);
        },
        isDefined: !0,
        toArray: function() {
          return [this.value];
        },
        inspect: function() {
          return "Some(" + this.value + ")";
        },
        toString: function() {
          return this.inspect();
        }
      });
      var be = {
        _isNone: !0,
        getOrElse: function(o) {
          return o;
        },
        filter: function() {
          return be;
        },
        map: function() {
          return be;
        },
        forEach: function() {
        },
        isDefined: !1,
        toArray: function() {
          return [];
        },
        inspect: function() {
          return "None";
        },
        toString: function() {
          return this.inspect();
        }
      }, K = function(o) {
        return typeof o < "u" && o !== null && o._isSome || typeof o < "u" && o !== null && o._isNone ? o : new fe(o);
      };
      n.noMore = "<no-more>", n.more = "<more>";
      var H = 0;
      function Z() {
        this.id = ++H;
      }
      Z.prototype._isEvent = !0, Z.prototype.isEvent = function() {
        return !0;
      }, Z.prototype.isEnd = function() {
        return !1;
      }, Z.prototype.isInitial = function() {
        return !1;
      }, Z.prototype.isNext = function() {
        return !1;
      }, Z.prototype.isError = function() {
        return !1;
      }, Z.prototype.hasValue = function() {
        return !1;
      }, Z.prototype.filter = function() {
        return !0;
      }, Z.prototype.inspect = function() {
        return this.toString();
      }, Z.prototype.log = function() {
        return this.toString();
      };
      function Q(o, d) {
        if (!(this instanceof Q))
          return new Q(o, d);
        Z.call(this), !d && b.isFunction(o) || o != null && o._isNext ? (this.valueF = o, this.valueInternal = void 0) : (this.valueF = void 0, this.valueInternal = o);
      }
      z(Q, Z), Q.prototype.isNext = function() {
        return !0;
      }, Q.prototype.hasValue = function() {
        return !0;
      }, Q.prototype.value = function() {
        var o;
        return (o = this.valueF) != null && o._isNext ? (this.valueInternal = this.valueF.value(), this.valueF = void 0) : this.valueF && (this.valueInternal = this.valueF(), this.valueF = void 0), this.valueInternal;
      }, Q.prototype.fmap = function(o) {
        var d, y;
        return this.valueInternal ? (y = this.valueInternal, this.apply(function() {
          return o(y);
        })) : (d = this, this.apply(function() {
          return o(d.value());
        }));
      }, Q.prototype.apply = function(o) {
        return new Q(o);
      }, Q.prototype.filter = function(o) {
        return o(this.value());
      }, Q.prototype.toString = function() {
        return b.toString(this.value());
      }, Q.prototype.log = function() {
        return this.value();
      }, Q.prototype._isNext = !0;
      function W(o, d) {
        if (!(this instanceof W))
          return new W(o, d);
        Q.call(this, o, d);
      }
      z(W, Q), W.prototype._isInitial = !0, W.prototype.isInitial = function() {
        return !0;
      }, W.prototype.isNext = function() {
        return !1;
      }, W.prototype.apply = function(o) {
        return new W(o);
      }, W.prototype.toNext = function() {
        return new Q(this);
      };
      function Me() {
        if (!(this instanceof Me))
          return new Me();
        Z.call(this);
      }
      z(Me, Z), Me.prototype.isEnd = function() {
        return !0;
      }, Me.prototype.fmap = function() {
        return this;
      }, Me.prototype.apply = function() {
        return this;
      }, Me.prototype.toString = function() {
        return "<end>";
      };
      function _e(o) {
        if (!(this instanceof _e))
          return new _e(o);
        this.error = o, Z.call(this);
      }
      z(_e, Z), _e.prototype.isError = function() {
        return !0;
      }, _e.prototype.fmap = function() {
        return this;
      }, _e.prototype.apply = function() {
        return this;
      }, _e.prototype.toString = function() {
        return "<error> " + b.toString(this.error);
      }, n.Event = Z, n.Initial = W, n.Next = Q, n.End = Me, n.Error = _e;
      var ke = function(o) {
        return new W(o, !0);
      }, Ce = function(o) {
        return new Q(o, !0);
      }, h = function() {
        return new Me();
      }, v = function(o) {
        return o && o._isEvent ? o : Ce(o);
      }, A = 0, Yt = function() {
      };
      function N(o) {
        this.desc = o, this.id = ++A, this.initialDesc = this.desc;
      }
      w(N.prototype, {
        _isObservable: !0,
        subscribe: function(o) {
          return C.wrappedSubscribe(this, o);
        },
        subscribeInternal: function(o) {
          return this.dispatcher.subscribe(o);
        },
        onValue: function() {
          var o = V(arguments);
          return this.subscribe(function(d) {
            if (d.hasValue())
              return o(d.value());
          });
        },
        onValues: function(o) {
          return this.onValue(function(d) {
            return o.apply(void 0, d);
          });
        },
        onError: function() {
          var o = V(arguments);
          return this.subscribe(function(d) {
            if (d.isError())
              return o(d.error);
          });
        },
        onEnd: function() {
          var o = V(arguments);
          return this.subscribe(function(d) {
            if (d.isEnd())
              return o();
          });
        },
        name: function(o) {
          return this._name = o, this;
        },
        withDescription: function() {
          return this.desc = G.apply(void 0, arguments), this;
        },
        toString: function() {
          return this._name ? this._name : this.desc.toString();
        },
        deps: function() {
          return this.desc.deps();
        },
        internalDeps: function() {
          return this.initialDesc.deps();
        }
      }), N.prototype.assign = N.prototype.onValue, N.prototype.forEach = N.prototype.onValue, N.prototype.inspect = N.prototype.toString, n.Observable = N;
      function R() {
        var o = arguments.length <= 0 || arguments[0] === void 0 ? [] : arguments[0];
        this.unsubscribe = b.bind(this.unsubscribe, this), this.unsubscribed = !1, this.subscriptions = [], this.starting = [];
        for (var d = 0, y; d < o.length; d++)
          y = o[d], this.add(y);
      }
      w(R.prototype, {
        add: function(o) {
          var d = this;
          if (!this.unsubscribed) {
            var y = !1, S = i;
            this.starting.push(o);
            var L = function() {
              if (!d.unsubscribed)
                return y = !0, d.remove(S), b.remove(o, d.starting);
            };
            return S = o(this.unsubscribe, L), this.unsubscribed || y ? S() : this.subscriptions.push(S), b.remove(o, this.starting), S;
          }
        },
        remove: function(o) {
          if (!this.unsubscribed && b.remove(o, this.subscriptions) !== void 0)
            return o();
        },
        unsubscribe: function() {
          if (!this.unsubscribed) {
            this.unsubscribed = !0;
            for (var o = this.subscriptions, d = 0; d < o.length; d++)
              o[d]();
            return this.subscriptions = [], this.starting = [], [];
          }
        },
        count: function() {
          return this.unsubscribed ? 0 : this.subscriptions.length + this.starting.length;
        },
        empty: function() {
          return this.count() === 0;
        }
      }), n.CompositeUnsubscribe = R;
      function F(o, d) {
        this._subscribe = o, this._handleEvent = d, this.subscribe = b.bind(this.subscribe, this), this.handleEvent = b.bind(this.handleEvent, this), this.pushing = !1, this.ended = !1, this.prevError = void 0, this.unsubSrc = void 0, this.subscriptions = [], this.queue = [];
      }
      F.prototype.hasSubscribers = function() {
        return this.subscriptions.length > 0;
      }, F.prototype.removeSub = function(o) {
        return this.subscriptions = b.without(o, this.subscriptions), this.subscriptions;
      }, F.prototype.push = function(o) {
        return o.isEnd() && (this.ended = !0), C.inTransaction(o, this, this.pushIt, [o]);
      }, F.prototype.pushToSubscriptions = function(o) {
        try {
          for (var d = this.subscriptions, y = d.length, S = 0; S < y; S++) {
            var L = d[S], q = L.sink(o);
            (q === n.noMore || o.isEnd()) && this.removeSub(L);
          }
          return !0;
        } catch (j) {
          throw this.pushing = !1, this.queue = [], j;
        }
      }, F.prototype.pushIt = function(o) {
        if (this.pushing)
          return this.queue.push(o), n.more;
        if (o === this.prevError)
          return;
        for (o.isError() && (this.prevError = o), this.pushing = !0, this.pushToSubscriptions(o), this.pushing = !1; this.queue.length; )
          o = this.queue.shift(), this.push(o);
        return this.hasSubscribers() ? n.more : (this.unsubscribeFromSource(), n.noMore);
      }, F.prototype.handleEvent = function(o) {
        return this._handleEvent ? this._handleEvent(o) : this.push(o);
      }, F.prototype.unsubscribeFromSource = function() {
        this.unsubSrc && this.unsubSrc(), this.unsubSrc = void 0;
      }, F.prototype.subscribe = function(o) {
        var d;
        return this.ended ? (o(h()), i) : (g(o), d = {
          sink: o
        }, this.subscriptions.push(d), this.subscriptions.length === 1 && (this.unsubSrc = this._subscribe(this.handleEvent), g(this.unsubSrc)), /* @__PURE__ */ (function(y) {
          return function() {
            if (y.removeSub(d), !y.hasSubscribers())
              return y.unsubscribeFromSource();
          };
        })(this));
      }, n.Dispatcher = F;
      function Y(o, d, y) {
        if (!(this instanceof Y))
          return new Y(o, d, y);
        b.isFunction(o) && (y = d, d = o, o = $.empty), N.call(this, o), g(d), this.dispatcher = new F(d, y), Yt(this);
      }
      z(Y, N), w(Y.prototype, {
        _isEventStream: !0,
        toProperty: function(o) {
          var d = arguments.length === 0 ? be : K(function() {
            return o;
          }), y = this.dispatcher, S = new n.Desc(this, "toProperty", [o]);
          return new B(S, function(L) {
            var q = !1, j = !1, de = i, ve = n.more, we = function() {
              if (!q)
                return d.forEach(function(ze) {
                  if (q = !0, ve = L(new W(ze)), ve === n.noMore)
                    return de(), de = i, i;
                });
            };
            return de = y.subscribe(function(ze) {
              if (ze.hasValue())
                return ze.isInitial() && !j ? (d = new fe(function() {
                  return ze.value();
                }), n.more) : (ze.isInitial() || we(), q = !0, d = new fe(ze), L(ze));
              if (ze.isEnd() && (ve = we()), ve !== n.noMore)
                return L(ze);
            }), j = !0, we(), de;
          });
        },
        toEventStream: function() {
          return this;
        },
        withHandler: function(o) {
          return new Y(new n.Desc(this, "withHandler", [o]), this.dispatcher.subscribe, o);
        }
      }), n.EventStream = Y, n.never = function() {
        return new Y(G(n, "never"), function(o) {
          return o(h()), i;
        });
      }, n.when = function() {
        if (arguments.length === 0)
          return n.never();
        var o = arguments.length, d = "when: expecting arguments in the form (Observable+,function)+";
        l(d, o % 2 === 0);
        for (var y = [], S = [], L = 0, q = []; L < o; ) {
          q[L] = arguments[L], q[L + 1] = arguments[L + 1];
          for (var j = b.toArray(arguments[L]), de = ye(arguments[L + 1]), ve = { f: de, ixs: [] }, we = !1, ze = 0, Ae; ze < j.length; ze++) {
            Ae = j[ze];
            var Ne = b.indexOf(y, Ae);
            we || (we = E.isTrigger(Ae)), Ne < 0 && (y.push(Ae), Ne = y.length - 1);
            for (var qe = 0, xe; qe < ve.ixs.length; qe++)
              xe = ve.ixs[qe], xe.index === Ne && xe.count++;
            ve.ixs.push({ index: Ne, count: 1 });
          }
          l("At least one EventStream required", we || !j.length), j.length > 0 && S.push(ve), L = L + 2;
        }
        if (!y.length)
          return n.never();
        y = b.map(E.fromObservable, y);
        var De = b.any(y, function(Se) {
          return Se.flatten;
        }) && ue(b.map(function(Se) {
          return Se.obs;
        }, y)), $e = new n.Desc(n, "when", q), Xe = new Y($e, function(Se) {
          var Ie = [], Fe = !1, Ve = function(Ye) {
            for (var et = 0, nt; et < Ye.ixs.length; et++)
              if (nt = Ye.ixs[et], !y[nt.index].hasAtLeast(nt.count))
                return !1;
            return !0;
          }, Je = function(Ye) {
            return !Ye.sync || Ye.ended;
          }, ht = function(Ye) {
            for (var et = 0, nt; et < Ye.ixs.length; et++)
              if (nt = Ye.ixs[et], !y[nt.index].mayHave(nt.count))
                return !0;
          }, mt = function(Ye) {
            return !Ye.source.flatten;
          }, Gr = function(Ye) {
            return function(et) {
              var nt = function() {
                return C.whenDoneWith(Xe, ws);
              }, ys = function() {
                if (Ie.length > 0) {
                  for (var rt = n.more, Xn = Ie.pop(), Xr = 0, yn; Xr < S.length; Xr++)
                    if (yn = S[Xr], Ve(yn)) {
                      var xs = (function() {
                        for (var wn = [], xn = 0, Mn; xn < yn.ixs.length; xn++)
                          Mn = yn.ixs[xn], wn.push(y[Mn.index].consume());
                        return wn;
                      })();
                      return rt = Se(Xn.e.apply(function() {
                        var wn, xn = (function() {
                          for (var Mn = [], Kr = 0, Ms; Kr < xs.length; Kr++)
                            Ms = xs[Kr], Mn.push(Ms.value());
                          return Mn;
                        })();
                        return (wn = yn).f.apply(wn, xn);
                      })), Ie.length && (Ie = b.filter(mt, Ie)), rt === n.noMore ? rt : ys();
                    }
                } else
                  return n.more;
              }, ws = function() {
                var rt = ys();
                return Fe && (b.all(y, Je) || b.all(S, ht)) && (rt = n.noMore, Se(h())), rt === n.noMore && et(), rt;
              };
              return Ye.subscribe(function(rt) {
                if (rt.isEnd())
                  Fe = !0, Ye.markEnded(), nt();
                else if (rt.isError())
                  var Xn = Se(rt);
                else
                  Ye.push(rt), Ye.sync && (Ie.push({ source: Ye, e: rt }), De || C.hasWaiters() ? nt() : ws());
                return Xn === n.noMore && et(), Xn || n.more;
              });
            };
          };
          return new n.CompositeUnsubscribe((function() {
            for (var Ye = [], et = 0, nt; et < y.length; et++)
              nt = y[et], Ye.push(Gr(nt));
            return Ye;
          })()).unsubscribe;
        });
        return Xe;
      };
      var ue = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? [] : arguments[1], y = function(S) {
          if (b.contains(d, S))
            return !0;
          var L = S.internalDeps();
          return L.length ? (d.push(S), b.any(L, y)) : (d.push(S), !1);
        };
        return b.any(o, y);
      }, ye = function(o) {
        return b.isFunction(o) ? o : b.always(o);
      };
      n.groupSimultaneous = function() {
        for (var o = arguments.length, d = Array(o), y = 0; y < o; y++)
          d[y] = arguments[y];
        d.length === 1 && _(d[0]) && (d = d[0]);
        var S = (function() {
          for (var L = [], q = 0, j; q < d.length; q++)
            j = d[q], L.push(new D(j));
          return L;
        })();
        return U(new n.Desc(n, "groupSimultaneous", d), n.when(S, function() {
          for (var L = arguments.length, q = Array(L), j = 0; j < L; j++)
            q[j] = arguments[j];
          return q;
        }));
      };
      function O(o, d, y) {
        F.call(this, d, y), this.property = o, this.subscribe = b.bind(this.subscribe, this), this.current = be, this.currentValueRootId = void 0, this.propertyEnded = !1;
      }
      z(O, F), w(O.prototype, {
        push: function(o) {
          return o.isEnd() && (this.propertyEnded = !0), o.hasValue() && (this.current = new fe(o), this.currentValueRootId = C.currentEventId()), F.prototype.push.call(this, o);
        },
        maybeSubSource: function(o, d) {
          return d === n.noMore ? i : this.propertyEnded ? (o(h()), i) : F.prototype.subscribe.call(this, o);
        },
        subscribe: function(o) {
          var d = this, y = n.more;
          if (this.current.isDefined && (this.hasSubscribers() || this.propertyEnded)) {
            var S = C.currentEventId(), L = this.currentValueRootId;
            return !this.propertyEnded && L && S && S !== L ? (C.whenDoneWith(this.property, function() {
              if (d.currentValueRootId === L)
                return o(ke(d.current.get().value()));
            }), this.maybeSubSource(o, y)) : (C.inTransaction(void 0, this, function() {
              return y = o(ke(this.current.get().value())), y;
            }, []), this.maybeSubSource(o, y));
          } else
            return this.maybeSubSource(o, y);
        }
      });
      function B(o, d, y) {
        N.call(this, o), g(d), this.dispatcher = new O(this, d, y), Yt(this);
      }
      z(B, N), w(B.prototype, {
        _isProperty: !0,
        changes: function() {
          var o = this;
          return new Y(new n.Desc(this, "changes", []), function(d) {
            return o.dispatcher.subscribe(function(y) {
              if (!y.isInitial())
                return d(y);
            });
          });
        },
        withHandler: function(o) {
          return new B(new n.Desc(this, "withHandler", [o]), this.dispatcher.subscribe, o);
        },
        toProperty: function() {
          return c(arguments), this;
        },
        toEventStream: function() {
          var o = this;
          return new Y(new n.Desc(this, "toEventStream", []), function(d) {
            return o.dispatcher.subscribe(function(y) {
              return y.isInitial() && (y = y.toNext()), d(y);
            });
          });
        }
      }), n.Property = B, n.constant = function(o) {
        return new B(new n.Desc(n, "constant", [o]), function(d) {
          return d(ke(o)), d(h()), i;
        });
      }, n.fromBinder = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? b.id : arguments[1], y = new n.Desc(n, "fromBinder", [o, d]);
        return new Y(y, function(S) {
          var L = !1, q = !1, j = function() {
            if (!L)
              return typeof de < "u" && de !== null ? (de(), L = !0) : q = !0;
          }, de = o(function() {
            for (var ve, we = arguments.length, ze = Array(we), Ae = 0; Ae < we; Ae++)
              ze[Ae] = arguments[Ae];
            var Ne = d.apply(this, ze);
            _(Ne) && ((ve = b.last(Ne)) != null && ve._isEvent) || (Ne = [Ne]);
            for (var qe = n.more, xe = 0, De; xe < Ne.length; xe++)
              if (De = Ne[xe], qe = S(De = v(De)), qe === n.noMore || De.isEnd())
                return j(), qe;
            return qe;
          });
          return q && j(), j;
        });
      }, n.Observable.prototype.map = function(o) {
        for (var d = arguments.length, y = Array(d > 1 ? d - 1 : 0), S = 1; S < d; S++)
          y[S - 1] = arguments[S];
        return re(this, o, y, function(L) {
          return U(new n.Desc(this, "map", [L]), this.withHandler(function(q) {
            return this.push(q.fmap(L));
          }));
        });
      };
      var X = function(o) {
        return _(o[0]) ? o[0] : Array.prototype.slice.call(o);
      }, ee = function(o) {
        return b.isFunction(o[0]) ? [X(Array.prototype.slice.call(o, 1)), o[0]] : [X(Array.prototype.slice.call(o, 0, o.length - 1)), b.last(o)];
      };
      n.combineAsArray = function() {
        var o = X(arguments);
        if (o.length) {
          for (var d = [], y = 0; y < o.length; y++) {
            var S = m(o[y]) ? o[y] : n.constant(o[y]);
            d.push(new E(S, !0));
          }
          return U(new n.Desc(n, "combineAsArray", o), n.when(d, function() {
            for (var L = arguments.length, q = Array(L), j = 0; j < L; j++)
              q[j] = arguments[j];
            return q;
          }).toProperty());
        } else
          return n.constant([]);
      }, n.onValues = function() {
        return n.combineAsArray(Array.prototype.slice.call(arguments, 0, arguments.length - 1)).onValues(arguments[arguments.length - 1]);
      }, n.combineWith = function() {
        var o = ee(arguments), d = o[0], y = o[1], S = new n.Desc(n, "combineWith", [y].concat(d));
        return U(S, n.combineAsArray(d).map(function(L) {
          return y.apply(void 0, L);
        }));
      }, n.Observable.prototype.combine = function(o, d) {
        var y = oe(d), S = new n.Desc(this, "combine", [o, d]);
        return U(S, n.combineAsArray(this, o).map(function(L) {
          return y(L[0], L[1]);
        }));
      }, n.Observable.prototype.withStateMachine = function(o, d) {
        var y = o, S = new n.Desc(this, "withStateMachine", [o, d]);
        return U(S, this.withHandler(function(L) {
          var q = d(y, L), j = q[0], de = q[1];
          y = j;
          for (var ve = n.more, we = 0, ze; we < de.length; we++)
            if (ze = de[we], ve = this.push(ze), ve === n.noMore)
              return ve;
          return ve;
        }));
      };
      var pe = function(o, d) {
        return o === d;
      }, Ee = function(o) {
        return typeof o < "u" && o !== null ? o._isNone : !1;
      };
      n.Observable.prototype.skipDuplicates = function() {
        var o = arguments.length <= 0 || arguments[0] === void 0 ? pe : arguments[0], d = new n.Desc(this, "skipDuplicates", []);
        return U(d, this.withStateMachine(be, function(y, S) {
          return S.hasValue() ? S.isInitial() || Ee(y) || !o(y.get(), S.value()) ? [new fe(S.value()), [S]] : [y, []] : [y, [S]];
        }));
      }, n.Observable.prototype.awaiting = function(o) {
        var d = new n.Desc(this, "awaiting", [o]);
        return U(d, n.groupSimultaneous(this, o).map(function(y) {
          return y[1].length === 0;
        }).toProperty(!1).skipDuplicates());
      }, n.Observable.prototype.not = function() {
        return U(new n.Desc(this, "not", []), this.map(function(o) {
          return !o;
        }));
      }, n.Property.prototype.and = function(o) {
        return U(new n.Desc(this, "and", [o]), this.combine(o, function(d, y) {
          return d && y;
        }));
      }, n.Property.prototype.or = function(o) {
        return U(new n.Desc(this, "or", [o]), this.combine(o, function(d, y) {
          return d || y;
        }));
      }, n.scheduler = {
        setTimeout: function(o, d) {
          return setTimeout(o, d);
        },
        setInterval: function(o, d) {
          return setInterval(o, d);
        },
        clearInterval: function(o) {
          return clearInterval(o);
        },
        clearTimeout: function(o) {
          return clearTimeout(o);
        },
        now: function() {
          return (/* @__PURE__ */ new Date()).getTime();
        }
      }, n.EventStream.prototype.bufferWithTime = function(o) {
        return U(new n.Desc(this, "bufferWithTime", [o]), this.bufferWithTimeOrCount(o, Number.MAX_VALUE));
      }, n.EventStream.prototype.bufferWithCount = function(o) {
        return U(new n.Desc(this, "bufferWithCount", [o]), this.bufferWithTimeOrCount(void 0, o));
      }, n.EventStream.prototype.bufferWithTimeOrCount = function(o, d) {
        var y = function(L) {
          if (L.values.length === d)
            return L.flush();
          if (o !== void 0)
            return L.schedule();
        }, S = new n.Desc(this, "bufferWithTimeOrCount", [o, d]);
        return U(S, this.buffer(o, y, y));
      }, n.EventStream.prototype.buffer = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? i : arguments[1], y = arguments.length <= 2 || arguments[2] === void 0 ? i : arguments[2], S = {
          scheduled: null,
          end: void 0,
          values: [],
          flush: function() {
            if (this.scheduled && (n.scheduler.clearTimeout(this.scheduled), this.scheduled = null), this.values.length > 0) {
              var j = this.values;
              this.values = [];
              var de = this.push(Ce(j));
              if (this.end != null)
                return this.push(this.end);
              if (de !== n.noMore)
                return y(this);
            } else if (this.end != null)
              return this.push(this.end);
          },
          schedule: function() {
            var j = this;
            if (!this.scheduled)
              return this.scheduled = o(function() {
                return j.flush();
              });
          }
        }, L = n.more;
        if (!b.isFunction(o)) {
          var q = o;
          o = function(j) {
            return n.scheduler.setTimeout(j, q);
          };
        }
        return U(new n.Desc(this, "buffer", []), this.withHandler(function(j) {
          var de = this;
          return S.push = function(ve) {
            return de.push(ve);
          }, j.isError() ? L = this.push(j) : j.isEnd() ? (S.end = j, S.scheduled || S.flush()) : (S.values.push(j.value()), d(S)), L;
        }));
      }, n.Observable.prototype.filter = function(o) {
        u(o);
        for (var d = arguments.length, y = Array(d > 1 ? d - 1 : 0), S = 1; S < d; S++)
          y[S - 1] = arguments[S];
        return re(this, o, y, function(L) {
          return U(new n.Desc(this, "filter", [L]), this.withHandler(function(q) {
            return q.filter(L) ? this.push(q) : n.more;
          }));
        });
      }, n.once = function(o) {
        return new Y(new $(n, "once", [o]), function(d) {
          return d(v(o)), d(h()), i;
        });
      }, n.EventStream.prototype.concat = function(o) {
        var d = this;
        return new Y(new n.Desc(d, "concat", [o]), function(y) {
          var S = i, L = d.dispatcher.subscribe(function(q) {
            return q.isEnd() ? (S = o.toEventStream().dispatcher.subscribe(y), S) : y(q);
          });
          return function() {
            return L(), S();
          };
        });
      }, n.Property.prototype.concat = function(o) {
        return Te(this, this.changes().concat(o));
      }, n.concatAll = function() {
        var o = X(arguments);
        return o.length ? U(new n.Desc(n, "concatAll", o), b.fold(b.tail(o), b.head(o).toEventStream(), function(d, y) {
          return d.concat(y);
        })) : n.never();
      };
      var Te = function(o, d) {
        var y = new Y(G(o, "justInitValue"), function(S) {
          var L = void 0, q = o.dispatcher.subscribe(function(j) {
            return j.isEnd() || (L = j), n.noMore;
          });
          return C.whenDoneWith(y, function() {
            return typeof L < "u" && L !== null && S(L), S(h());
          }), q;
        });
        return y.concat(d).toProperty();
      };
      n.Observable.prototype.flatMap = function() {
        return Ue(this, Le(arguments));
      }, n.Observable.prototype.flatMapFirst = function() {
        return Ue(this, Le(arguments), !0);
      };
      var Le = function(o) {
        return o.length === 1 && m(o[0]) ? b.always(o[0]) : V(o);
      }, We = function(o) {
        return m(o) ? o : n.once(o);
      }, Ue = function(o, d, y, S) {
        var L = [o], q = [], j = new n.Desc(o, "flatMap" + (y ? "First" : ""), [d]), de = new Y(j, function(ve) {
          var we = new R(), ze = [], Ae = function(xe) {
            var De = We(d(xe.value()));
            return q.push(De), we.add(function($e, Xe) {
              return De.dispatcher.subscribe(function(Se) {
                if (Se.isEnd())
                  return b.remove(De, q), Ne(), qe(Xe), n.noMore;
                typeof Se < "u" && Se !== null && Se._isInitial && (Se = Se.toNext());
                var Ie = ve(Se);
                return Ie === n.noMore && $e(), Ie;
              });
            });
          }, Ne = function() {
            var xe = ze.shift();
            if (xe)
              return Ae(xe);
          }, qe = function(xe) {
            if (xe(), we.empty())
              return ve(h());
          };
          return we.add(function(xe, De) {
            return o.dispatcher.subscribe(function($e) {
              return $e.isEnd() ? qe(De) : $e.isError() ? ve($e) : y && we.count() > 1 ? n.more : we.unsubscribed ? n.noMore : S && we.count() > S ? ze.push($e) : Ae($e);
            });
          }), we.unsubscribe;
        });
        return de.internalDeps = function() {
          return q.length ? L.concat(q) : L;
        }, de;
      };
      n.Observable.prototype.flatMapWithConcurrencyLimit = function(o) {
        for (var d = arguments.length, y = Array(d > 1 ? d - 1 : 0), S = 1; S < d; S++)
          y[S - 1] = arguments[S];
        var L = new n.Desc(this, "flatMapWithConcurrencyLimit", [o].concat(y));
        return U(L, Ue(this, Le(y), !1, o));
      }, n.Observable.prototype.flatMapConcat = function() {
        var o = new n.Desc(this, "flatMapConcat", Array.prototype.slice.call(arguments, 0));
        return U(o, this.flatMapWithConcurrencyLimit.apply(this, [1].concat(e.call(arguments))));
      }, n.later = function(o, d) {
        return U(new n.Desc(n, "later", [o, d]), n.fromBinder(function(y) {
          var S = function() {
            return y([d, h()]);
          }, L = n.scheduler.setTimeout(S, o);
          return function() {
            return n.scheduler.clearTimeout(L);
          };
        }));
      }, n.Observable.prototype.bufferingThrottle = function(o) {
        var d = new n.Desc(this, "bufferingThrottle", [o]);
        return U(d, this.flatMapConcat(function(y) {
          return n.once(y).concat(n.later(o).filter(!1));
        }));
      }, n.Property.prototype.bufferingThrottle = function() {
        return n.Observable.prototype.bufferingThrottle.apply(this, arguments).toProperty();
      };
      function He() {
        if (!(this instanceof He))
          return new He();
        this.unsubAll = b.bind(this.unsubAll, this), this.subscribeAll = b.bind(this.subscribeAll, this), this.guardedSink = b.bind(this.guardedSink, this), this.sink = void 0, this.subscriptions = [], this.ended = !1, Y.call(this, new n.Desc(n, "Bus", []), this.subscribeAll);
      }
      z(He, Y), w(He.prototype, {
        unsubAll: function() {
          for (var o = this.subscriptions, d = 0, y; d < o.length; d++)
            y = o[d], typeof y.unsub == "function" && y.unsub();
        },
        subscribeAll: function(o) {
          if (this.ended)
            o(h());
          else {
            this.sink = o;
            for (var d = a(this.subscriptions), y = 0, S; y < d.length; y++)
              S = d[y], this.subscribeInput(S);
          }
          return this.unsubAll;
        },
        guardedSink: function(o) {
          var d = this;
          return function(y) {
            return y.isEnd() ? (d.unsubscribeInput(o), n.noMore) : d.sink(y);
          };
        },
        subscribeInput: function(o) {
          return o.unsub = o.input.dispatcher.subscribe(this.guardedSink(o.input)), o.unsub;
        },
        unsubscribeInput: function(o) {
          for (var d = this.subscriptions, y = 0, S; y < d.length; y++)
            if (S = d[y], S.input === o) {
              typeof S.unsub == "function" && S.unsub(), this.subscriptions.splice(y, 1);
              return;
            }
        },
        plug: function(o) {
          var d = this;
          if (p(o), !this.ended) {
            var y = { input: o };
            return this.subscriptions.push(y), typeof this.sink < "u" && this.subscribeInput(y), function() {
              return d.unsubscribeInput(o);
            };
          }
        },
        end: function() {
          if (this.ended = !0, this.unsubAll(), typeof this.sink == "function")
            return this.sink(h());
        },
        push: function(o) {
          if (!this.ended && typeof this.sink == "function") {
            var d = !this.pushing;
            if (!d) {
              this.pushQueue || (this.pushQueue = []), this.pushQueue.push(o);
              return;
            }
            this.pushing = !0;
            try {
              return this.sink(Ce(o));
            } finally {
              if (d && this.pushQueue) {
                for (var y = 0; y < this.pushQueue.length; ) {
                  var o = this.pushQueue[y];
                  this.sink(Ce(o)), y++;
                }
                this.pushQueue = null;
              }
              this.pushing = !1;
            }
          }
        },
        error: function(o) {
          if (typeof this.sink == "function")
            return this.sink(new _e(o));
        }
      }), n.Bus = He;
      var Dt = function(o, d) {
        return I(function(y) {
          for (var S = te(d, [function(de, ve) {
            return y.apply(void 0, de.concat([ve]));
          }]), L = arguments.length, q = Array(L > 1 ? L - 1 : 0), j = 1; j < L; j++)
            q[j - 1] = arguments[j];
          return U(new n.Desc(n, o, [y].concat(q)), n.combineAsArray(q).flatMap(S));
        });
      };
      n.fromCallback = Dt("fromCallback", function(o) {
        for (var d = arguments.length, y = Array(d > 1 ? d - 1 : 0), S = 1; S < d; S++)
          y[S - 1] = arguments[S];
        return n.fromBinder(function(L) {
          return ge(o, y)(L), i;
        }, function(L) {
          return [L, h()];
        });
      }), n.fromNodeCallback = Dt("fromNodeCallback", function(o) {
        for (var d = arguments.length, y = Array(d > 1 ? d - 1 : 0), S = 1; S < d; S++)
          y[S - 1] = arguments[S];
        return n.fromBinder(function(L) {
          return ge(o, y)(L), i;
        }, function(L, q) {
          return L ? [new _e(L), h()] : [q, h()];
        });
      }), n.combineTemplate = function(o) {
        function d(xe) {
          return xe[xe.length - 1];
        }
        function y(xe, De, $e) {
          return d(xe)[De] = $e, $e;
        }
        function S(xe, De) {
          return function($e, Xe) {
            y($e, xe, Xe[De]);
          };
        }
        function L(xe, De) {
          return function($e) {
            y($e, xe, De);
          };
        }
        function q(xe) {
          return _(xe) ? [] : {};
        }
        function j(xe, De) {
          return function($e) {
            var Xe = q(De);
            y($e, xe, Xe), $e.push(Xe);
          };
        }
        function de(xe) {
          if (m(xe))
            return !0;
          if (xe && (xe.constructor == Object || xe.constructor == Array)) {
            for (var De in xe)
              if (Object.prototype.hasOwnProperty.call(xe, De)) {
                var $e = xe[De];
                if (de($e)) return !0;
              }
          }
        }
        function ve(xe, De) {
          if (m(De))
            Ne.push(De), Ae.push(S(xe, Ne.length - 1));
          else if (de(De)) {
            var $e = function(Xe) {
              Xe.pop();
            };
            Ae.push(j(xe, De)), ze(De), Ae.push($e);
          } else
            Ae.push(L(xe, De));
        }
        function we(xe) {
          for (var De = q(o), $e = [De], Xe = 0, Se; Xe < Ae.length; Xe++)
            Se = Ae[Xe], Se($e, xe);
          return De;
        }
        function ze(xe) {
          b.each(xe, ve);
        }
        var Ae = [], Ne = [], qe = de(o) ? (ze(o), n.combineAsArray(Ne).map(we)) : n.constant(o);
        return U(new n.Desc(n, "combineTemplate", [o]), qe);
      }, n.Observable.prototype.mapEnd = function() {
        var o = V(arguments);
        return U(new n.Desc(this, "mapEnd", [o]), this.withHandler(function(d) {
          return d.isEnd() ? (this.push(Ce(o(d))), this.push(h()), n.noMore) : this.push(d);
        }));
      }, n.Observable.prototype.skipErrors = function() {
        return U(new n.Desc(this, "skipErrors", []), this.withHandler(function(o) {
          return o.isError() ? n.more : this.push(o);
        }));
      }, n.EventStream.prototype.takeUntil = function(o) {
        var d = {};
        return U(new n.Desc(this, "takeUntil", [o]), n.groupSimultaneous(this.mapEnd(d), o.skipErrors()).withHandler(function(y) {
          if (y.hasValue()) {
            var S = y.value(), L = S[0], q = S[1];
            if (q.length)
              return this.push(h());
            for (var j = n.more, de = 0, ve; de < L.length; de++)
              ve = L[de], ve === d ? j = this.push(h()) : j = this.push(Ce(ve));
            return j;
          } else
            return this.push(y);
        }));
      }, n.Property.prototype.takeUntil = function(o) {
        var d = this.changes().takeUntil(o);
        return U(new n.Desc(this, "takeUntil", [o]), Te(this, d));
      }, n.Observable.prototype.flatMapLatest = function() {
        var o = Le(arguments), d = this.toEventStream();
        return U(new n.Desc(this, "flatMapLatest", [o]), d.flatMap(function(y) {
          return We(o(y)).takeUntil(d);
        }));
      }, n.Property.prototype.delayChanges = function(o, d) {
        return U(o, Te(this, d(this.changes())));
      }, n.EventStream.prototype.delayChanges = function(o, d) {
        return U(o, d(this));
      }, n.Observable.prototype.delay = function(o) {
        return this.delayChanges(new n.Desc(this, "delay", [o]), function(d) {
          return d.flatMap(function(y) {
            return n.later(o, y);
          });
        });
      }, n.Observable.prototype.debounce = function(o) {
        return this.delayChanges(new n.Desc(this, "debounce", [o]), function(d) {
          return d.flatMapLatest(function(y) {
            return n.later(o, y);
          });
        });
      }, n.Observable.prototype.debounceImmediate = function(o) {
        return this.delayChanges(new n.Desc(this, "debounceImmediate", [o]), function(d) {
          return d.flatMapFirst(function(y) {
            return n.once(y).concat(n.later(o).filter(!1));
          });
        });
      }, n.Observable.prototype.decode = function(o) {
        return U(new n.Desc(this, "decode", [o]), this.combine(n.combineTemplate(o), function(d, y) {
          return y[d];
        }));
      }, n.Observable.prototype.scan = function(o, d) {
        var y = this, S;
        d = oe(d);
        var L = K(o), q = !1, j = function(de) {
          var ve = !1, we = i, ze = n.more, Ae = function() {
            if (!ve)
              return L.forEach(function(Ne) {
                if (ve = q = !0, ze = de(new W(function() {
                  return Ne;
                })), ze === n.noMore)
                  return we(), we = i, we;
              });
          };
          return we = y.dispatcher.subscribe(function(Ne) {
            if (Ne.hasValue()) {
              if (q && Ne.isInitial())
                return n.more;
              Ne.isInitial() || Ae(), ve = q = !0;
              var qe = L.getOrElse(void 0), xe = d(qe, Ne.value());
              return L = new fe(xe), de(Ne.apply(function() {
                return xe;
              }));
            } else if (Ne.isEnd() && (ze = Ae()), ze !== n.noMore)
              return de(Ne);
          }), C.whenDoneWith(S, Ae), we;
        };
        return S = new B(new n.Desc(this, "scan", [o, d]), j), S;
      }, n.Observable.prototype.diff = function(o, d) {
        return d = oe(d), U(new n.Desc(this, "diff", [o, d]), this.scan([o], function(y, S) {
          return [S, d(y[0], S)];
        }).filter(function(y) {
          return y.length === 2;
        }).map(function(y) {
          return y[1];
        }));
      }, n.Observable.prototype.doAction = function() {
        var o = V(arguments);
        return U(new n.Desc(this, "doAction", [o]), this.withHandler(function(d) {
          return d.hasValue() && o(d.value()), this.push(d);
        }));
      }, n.Observable.prototype.doEnd = function() {
        var o = V(arguments);
        return U(new n.Desc(this, "doEnd", [o]), this.withHandler(function(d) {
          return d.isEnd() && o(), this.push(d);
        }));
      }, n.Observable.prototype.doError = function() {
        var o = V(arguments);
        return U(new n.Desc(this, "doError", [o]), this.withHandler(function(d) {
          return d.isError() && o(d.error), this.push(d);
        }));
      }, n.Observable.prototype.doLog = function() {
        for (var o = arguments.length, d = Array(o), y = 0; y < o; y++)
          d[y] = arguments[y];
        return U(new n.Desc(this, "doLog", d), this.withHandler(function(S) {
          return typeof console < "u" && console !== null && typeof console.log == "function" && console.log.apply(console, d.concat([S.log()])), this.push(S);
        }));
      }, n.Observable.prototype.endOnError = function(o) {
        typeof o < "u" && o !== null || (o = !0);
        for (var d = arguments.length, y = Array(d > 1 ? d - 1 : 0), S = 1; S < d; S++)
          y[S - 1] = arguments[S];
        return re(this, o, y, function(L) {
          return U(new n.Desc(this, "endOnError", []), this.withHandler(function(q) {
            return q.isError() && L(q.error) ? (this.push(q), this.push(h())) : this.push(q);
          }));
        });
      }, N.prototype.errors = function() {
        return U(new n.Desc(this, "errors", []), this.filter(function() {
          return !1;
        }));
      }, n.Observable.prototype.take = function(o) {
        return o <= 0 ? n.never() : U(new n.Desc(this, "take", [o]), this.withHandler(function(d) {
          return d.hasValue() ? (o--, o > 0 ? this.push(d) : (o === 0 && this.push(d), this.push(h()), n.noMore)) : this.push(d);
        }));
      }, n.Observable.prototype.first = function() {
        return U(new n.Desc(this, "first", []), this.take(1));
      }, n.Observable.prototype.mapError = function() {
        var o = V(arguments);
        return U(new n.Desc(this, "mapError", [o]), this.withHandler(function(d) {
          return d.isError() ? this.push(Ce(o(d.error))) : this.push(d);
        }));
      }, n.Observable.prototype.flatMapError = function(o) {
        var d = new n.Desc(this, "flatMapError", [o]);
        return U(d, this.mapError(function(y) {
          return new _e(y);
        }).flatMap(function(y) {
          return y instanceof _e ? o(y.error) : n.once(y);
        }));
      }, n.EventStream.prototype.flatScan = function(o, d) {
        var y = o;
        return this.flatMapConcat(function(S) {
          return We(d(y, S)).doAction(function(L) {
            return y = L;
          });
        }).toProperty(o);
      }, n.EventStream.prototype.sampledBy = function(o, d) {
        return U(new n.Desc(this, "sampledBy", [o, d]), this.toProperty().sampledBy(o, d));
      }, n.Property.prototype.sampledBy = function(o, d) {
        var y = !1;
        typeof d < "u" && d !== null ? d = oe(d) : (y = !0, d = function(de) {
          return de.value();
        });
        var S = new E(this, !1, y), L = new E(o, !0, y), q = n.when([S, L], d), j = o._isProperty ? q.toProperty() : q;
        return U(new n.Desc(this, "sampledBy", [o, d]), j);
      }, n.Property.prototype.sample = function(o) {
        return U(new n.Desc(this, "sample", [o]), this.sampledBy(n.interval(o, {})));
      }, n.Observable.prototype.map = function(o) {
        if (o && o._isProperty)
          return o.sampledBy(this, s);
        for (var d = arguments.length, y = Array(d > 1 ? d - 1 : 0), S = 1; S < d; S++)
          y[S - 1] = arguments[S];
        return re(this, o, y, function(L) {
          return U(new n.Desc(this, "map", [L]), this.withHandler(function(q) {
            return this.push(q.fmap(L));
          }));
        });
      }, n.Observable.prototype.fold = function(o, d) {
        return U(new n.Desc(this, "fold", [o, d]), this.scan(o, d).sampledBy(this.filter(!1).mapEnd().toProperty()));
      }, N.prototype.reduce = N.prototype.fold;
      var St = [["addEventListener", "removeEventListener"], ["addListener", "removeListener"], ["on", "off"], ["bind", "unbind"]], Vr = function(o) {
        for (var d, y = 0; y < St.length; y++) {
          d = St[y];
          var S = [o[d[0]], o[d[1]]];
          if (S[0] && S[1])
            return S;
        }
        for (var L = 0; L < St.length; L++) {
          d = St[L];
          var q = o[d[0]];
          if (q)
            return [q, function() {
            }];
        }
        throw new _e("No suitable event methods in " + o);
      };
      n.fromEventTarget = function(o, d, y) {
        var S = Vr(o), L = S[0], q = S[1], j = new n.Desc(n, "fromEvent", [o, d]);
        return U(j, n.fromBinder(function(de) {
          return L.call(o, d, de), function() {
            return q.call(o, d, de);
          };
        }, y));
      }, n.fromEvent = n.fromEventTarget, n.fromPoll = function(o, d) {
        var y = new n.Desc(n, "fromPoll", [o, d]);
        return U(y, n.fromBinder(function(S) {
          var L = n.scheduler.setInterval(S, o);
          return function() {
            return n.scheduler.clearInterval(L);
          };
        }, d));
      };
      function il(o) {
        return [o, h()];
      }
      n.fromPromise = function(o, d) {
        var y = arguments.length <= 2 || arguments[2] === void 0 ? il : arguments[2];
        return U(new n.Desc(n, "fromPromise", [o]), n.fromBinder(function(S) {
          var L = o.then(S, function(q) {
            return S(new _e(q));
          });
          return L && typeof L.done == "function" && L.done(), d ? function() {
            if (typeof o.abort == "function")
              return o.abort();
          } : function() {
          };
        }, y));
      }, n.Observable.prototype.groupBy = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? n._.id : arguments[1], y = {}, S = this;
        return S.filter(function(L) {
          return !y[o(L)];
        }).map(function(L) {
          var q = o(L), j = S.filter(function(we) {
            return o(we) === q;
          }), de = n.once(L).concat(j), ve = d(de, L).withHandler(function(we) {
            if (this.push(we), we.isEnd())
              return delete y[q];
          });
          return y[q] = ve, ve;
        });
      }, n.fromArray = function(o) {
        if (T(o), o.length) {
          var d = 0, y = new Y(new n.Desc(n, "fromArray", [o]), function(S) {
            var L = !1, q = n.more, j = !1, de = !1;
            function ve() {
              if (de = !0, !j) {
                for (j = !0; de; )
                  if (de = !1, q !== n.noMore && !L) {
                    var we = o[d++];
                    q = S(v(we)), q !== n.noMore && (d === o.length ? S(h()) : C.afterTransaction(y, ve));
                  }
                return j = !1, j;
              }
            }
            return ve(), function() {
              return L = !0, L;
            };
          });
          return y;
        } else
          return U(new n.Desc(n, "fromArray", o), n.never());
      }, n.EventStream.prototype.holdWhen = function(o) {
        var d = !1, y = [], S = this, L = !1;
        return new Y(new n.Desc(this, "holdWhen", [o]), function(q) {
          var j = new R(), de = !1, ve = function(we) {
            if (typeof we == "function" && we(), j.empty() && de)
              return q(h());
          };
          return j.add(function(we, ze) {
            return o.subscribeInternal(function(Ae) {
              if (Ae.hasValue()) {
                if (d = Ae.value(), !d) {
                  var Ne = y;
                  return y = [], (function() {
                    for (var qe = [], xe = 0, De; xe < Ne.length; xe++)
                      De = Ne[xe], qe.push(q(Ce(De)));
                    return L && (qe.push(q(h())), ze()), qe;
                  })();
                }
              } else return Ae.isEnd() ? ve(ze) : q(Ae);
            });
          }), j.add(function(we, ze) {
            return S.subscribeInternal(function(Ae) {
              return d && Ae.hasValue() ? y.push(Ae.value()) : Ae.isEnd() && y.length ? (L = !0, ve(ze)) : q(Ae);
            });
          }), de = !0, ve(), j.unsubscribe;
        });
      }, n.interval = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1];
        return U(new n.Desc(n, "interval", [o, d]), n.fromPoll(o, function() {
          return Ce(d);
        }));
      }, n.$ = {}, n.$.asEventStream = function(o, d, y) {
        var S = this;
        return b.isFunction(d) && (y = d, d = void 0), U(new n.Desc(this.selector || this, "asEventStream", [o]), n.fromBinder(function(L) {
          return S.on(o, d, L), function() {
            return S.off(o, d, L);
          };
        }, y));
      }, typeof jQuery < "u" && jQuery && (jQuery.fn.asEventStream = n.$.asEventStream), typeof Zepto < "u" && Zepto && (Zepto.fn.asEventStream = n.$.asEventStream), n.Observable.prototype.last = function() {
        var o;
        return U(new n.Desc(this, "last", []), this.withHandler(function(d) {
          if (d.isEnd())
            return o && this.push(o), this.push(h()), n.noMore;
          o = d;
        }));
      }, n.Observable.prototype.log = function() {
        for (var o = arguments.length, d = Array(o), y = 0; y < o; y++)
          d[y] = arguments[y];
        return this.subscribe(function(S) {
          typeof console < "u" && typeof console.log == "function" && console.log.apply(console, d.concat([S.log()]));
        }), this;
      }, n.EventStream.prototype.merge = function(o) {
        f(o);
        var d = this;
        return U(new n.Desc(d, "merge", [o]), n.mergeAll(this, o));
      }, n.mergeAll = function() {
        var o = X(arguments);
        return o.length ? new Y(new n.Desc(n, "mergeAll", o), function(d) {
          var y = 0, S = function(q) {
            return function(j) {
              return q.dispatcher.subscribe(function(de) {
                if (de.isEnd())
                  return y++, y === o.length ? d(h()) : n.more;
                var ve = d(de);
                return ve === n.noMore && j(), ve;
              });
            };
          }, L = b.map(S, o);
          return new n.CompositeUnsubscribe(L).unsubscribe;
        }) : n.never();
      }, n.repeatedly = function(o, d) {
        var y = 0;
        return U(new n.Desc(n, "repeatedly", [o, d]), n.fromPoll(o, function() {
          return d[y++ % d.length];
        }));
      }, n.repeat = function(o) {
        var d = 0;
        return n.fromBinder(function(y) {
          var S = !1, L = n.more, q = function() {
          };
          function j(ve) {
            return ve.isEnd() ? S ? de() : S = !0 : L = y(ve);
          }
          function de() {
            var ve;
            for (S = !0; S && L !== n.noMore; )
              ve = o(d++), S = !1, ve ? q = ve.subscribeInternal(j) : y(h());
            return S = !0;
          }
          return de(), function() {
            return q();
          };
        });
      }, n.retry = function(o) {
        if (!b.isFunction(o.source))
          throw new r("'source' option has to be a function");
        var d = o.source, y = o.retries || 0, S = 0, L = o.delay || function() {
          return 0;
        }, q = o.isRetryable || function() {
          return !0;
        }, j = !1, de = null;
        return U(new n.Desc(n, "retry", [o]), n.repeat(function(ve) {
          function we() {
            return d(ve).endOnError().withHandler(function(Ne) {
              if (Ne.isError()) {
                if (de = Ne, !(q(de.error) && (y === 0 || S < y)))
                  return j = !0, this.push(Ne);
              } else
                return Ne.hasValue() && (de = null, j = !0), this.push(Ne);
            });
          }
          if (j)
            return null;
          if (de) {
            var ze = {
              error: de.error,
              retriesDone: S
            }, Ae = n.later(L(ze)).filter(!1);
            return S++, Ae.concat(n.once().flatMap(we));
          } else
            return we();
        }));
      }, n.sequentially = function(o, d) {
        var y = 0;
        return U(new n.Desc(n, "sequentially", [o, d]), n.fromPoll(o, function() {
          var S = d[y++];
          return y < d.length ? S : y === d.length ? [S, h()] : h();
        }));
      }, n.Observable.prototype.skip = function(o) {
        return U(new n.Desc(this, "skip", [o]), this.withHandler(function(d) {
          return d.hasValue() ? o > 0 ? (o--, n.more) : this.push(d) : this.push(d);
        }));
      }, n.EventStream.prototype.skipUntil = function(o) {
        var d = o.take(1).map(!0).toProperty(!1);
        return U(new n.Desc(this, "skipUntil", [o]), this.filter(d));
      }, n.EventStream.prototype.skipWhile = function(o) {
        u(o);
        for (var d = !1, y = arguments.length, S = Array(y > 1 ? y - 1 : 0), L = 1; L < y; L++)
          S[L - 1] = arguments[L];
        return re(this, o, S, function(q) {
          return U(new n.Desc(this, "skipWhile", [q]), this.withHandler(function(j) {
            return d || !j.hasValue() || !q(j.value()) ? (j.hasValue() && (d = !0), this.push(j)) : n.more;
          }));
        });
      }, n.Observable.prototype.slidingWindow = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? 0 : arguments[1];
        return U(new n.Desc(this, "slidingWindow", [o, d]), this.scan([], function(y, S) {
          return y.concat([S]).slice(-o);
        }).filter(function(y) {
          return y.length >= d;
        }));
      };
      var Hr = [], Yt = function(o) {
        if (Hr.length && !Yt.running)
          try {
            Yt.running = !0, Hr.forEach(function(d) {
              d(o);
            });
          } finally {
            delete Yt.running;
          }
      };
      n.spy = function(o) {
        return Hr.push(o);
      }, n.Property.prototype.startWith = function(o) {
        return U(new n.Desc(this, "startWith", [o]), this.scan(o, function(d, y) {
          return y;
        }));
      }, n.EventStream.prototype.startWith = function(o) {
        return U(new n.Desc(this, "startWith", [o]), n.once(o).concat(this));
      }, n.Observable.prototype.takeWhile = function(o) {
        u(o);
        for (var d = arguments.length, y = Array(d > 1 ? d - 1 : 0), S = 1; S < d; S++)
          y[S - 1] = arguments[S];
        return re(this, o, y, function(L) {
          return U(new n.Desc(this, "takeWhile", [L]), this.withHandler(function(q) {
            return q.filter(L) ? this.push(q) : (this.push(h()), n.noMore);
          }));
        });
      }, n.Observable.prototype.throttle = function(o) {
        return this.delayChanges(new n.Desc(this, "throttle", [o]), function(d) {
          return d.bufferWithTime(o).map(function(y) {
            return y[y.length - 1];
          });
        });
      }, N.prototype.firstToPromise = function(o) {
        var d = this;
        if (typeof o != "function")
          if (typeof Promise == "function")
            o = Promise;
          else
            throw new r("There isn't default Promise, use shim or parameter");
        return new o(function(y, S) {
          return d.subscribe(function(L) {
            return L.hasValue() && y(L.value()), L.isError() && S(L.error), n.noMore;
          });
        });
      }, N.prototype.toPromise = function(o) {
        return this.last().firstToPromise(o);
      }, n.try = function(o) {
        return function(d) {
          try {
            return n.once(o(d));
          } catch (y) {
            return new n.Error(y);
          }
        };
      }, n.update = function(o) {
        function d(j) {
          return function() {
            for (var de = arguments.length, ve = Array(de), we = 0; we < de; we++)
              ve[we] = arguments[we];
            return function(ze) {
              return j.apply(void 0, [ze].concat(ve));
            };
          };
        }
        for (var y = arguments.length, S = Array(y > 1 ? y - 1 : 0), L = 1; L < y; L++)
          S[L - 1] = arguments[L];
        for (var q = S.length - 1; q > 0; )
          S[q] instanceof Function || (S[q] = b.always(S[q])), S[q] = d(S[q]), q = q - 2;
        return U(new n.Desc(n, "update", [o].concat(S)), n.when.apply(n, S).scan(o, function(j, de) {
          return de(j);
        }));
      }, n.zipAsArray = function() {
        for (var o = arguments.length, d = Array(o), y = 0; y < o; y++)
          d[y] = arguments[y];
        var S = X(d);
        return U(new n.Desc(n, "zipAsArray", S), n.zipWith(S, function() {
          for (var L = arguments.length, q = Array(L), j = 0; j < L; j++)
            q[j] = arguments[j];
          return q;
        }));
      }, n.zipWith = function() {
        for (var o = arguments.length, d = Array(o), y = 0; y < o; y++)
          d[y] = arguments[y];
        var S = ee(d), L = S[0], q = S[1];
        return L = b.map(function(j) {
          return j.toEventStream();
        }, L), U(new n.Desc(n, "zipWith", [q].concat(L)), n.when(L, q));
      }, n.Observable.prototype.zip = function(o, d) {
        return U(new n.Desc(this, "zip", [o]), n.zipWith([this, o], d || Array));
      };
      function Yr(o) {
        this.observable = o;
      }
      Yr.prototype.subscribe = function(o, d, y) {
        var S = typeof o == "function" ? { next: o, error: d, complete: y } : o, L = {
          closed: !1,
          unsubscribe: function() {
            L.closed = !0, q();
          }
        }, q = this.observable.subscribe(function(j) {
          j.isError() ? (S.error && S.error(j.error), L.unsubscribe()) : j.isEnd() ? (L.closed = !0, S.complete && S.complete()) : S.next && S.next(j.value());
        });
        return L;
      }, Yr.prototype[P("observable")] = function() {
        return this;
      }, n.Observable.prototype.toESObservable = function() {
        return new Yr(this);
      }, n.Observable.prototype[P("observable")] = n.Observable.prototype.toESObservable, n.fromESObservable = function(o) {
        var d;
        o[P("observable")] ? d = o[P("observable")]() : d = o;
        var y = new n.Desc(n, "fromESObservable", [d]);
        return new n.EventStream(y, function(S) {
          var L = d.subscribe({
            error: function() {
              S(new n.Error()), S(new n.End());
            },
            next: function(q) {
              S(new n.Next(q, !0));
            },
            complete: function() {
              S(new n.End());
            }
          });
          return L.unsubscribe ? function() {
            L.unsubscribe();
          } : L;
        });
      }, t !== null && t.exports != null ? (t.exports = n, n.Bacon = n) : this.Bacon = n;
    }).call(Ap);
  })(fr)), fr.exports;
}
var Op = Ip();
const Wi = /* @__PURE__ */ Tt(Op);
function ba(t) {
  return function(e) {
    return t.apply(null, e);
  };
}
let va = class Go {
  constructor(e, n, r, i, s, a, l, u, f, p, g) {
    if (l === null) {
      var _ = i.get_size();
      l = {
        x: -_.width,
        y: -_.height,
        width: _.width * 3,
        height: _.height * 3
      };
    }
    ce.isUndefined(f) || f === null || f === "" ? f = "new_map" : f = String(f), ce.isUndefined(p) || p === null || p === "" ? p = se.generate_map_id() : p = String(p), ce.isUndefined(g) || g === null ? g = "" : g = String(g), this.callback_manager = new bn(), this.svg = e, this.defs = se.setup_defs(e, n), this.canvas = new Np(r, l), this.setup_containers(r), this.sel = r, this.zoomContainer = i, this.settings = s, this.cobra_model = a, this.largest_ids = {
      reactions: -1,
      nodes: -1,
      segments: -1,
      text_labels: -1
    }, this.undo_stack = new Cp(), this.behavior = new Vf(this, this.undo_stack), this.draw = new Bf(this.behavior, this.settings, this), this.key_manager = new zp(), this.key_manager.settings = s, this.key_manager.ctrlEqualsCmd = !0, this.enable_search = u, this.search_index = new Dp(), this.map_name = f, this.map_id = p, this.map_description = g, this.beziers_enabled = !1, this.has_data_on_reactions = !1, this.has_data_on_nodes = !1, this.imported_reaction_data = null, this.imported_metabolite_data = null, this.imported_gene_data = null, this.nodes = {}, this.reactions = {}, this.beziers = {}, this.text_labels = {}, this.apply_reaction_data_to_map(null), this.apply_metabolite_data_to_map(null), this.apply_gene_data_to_map(null), this.scale = new Sp(), this.scale.connectToSettings(this.settings, this, this.get_data_statistics.bind(this)), this.rotation_on = !1;
  }
  /**
   * Load a json map and add necessary fields for rendering.
   */
  static from_data(e, n, r, i, s, a, l, u) {
    var f = e[1].canvas, p = e[0].map_name, g = e[0].map_id, _ = e[0].map_description.replace(/(\nLast Modified.*)+$/g, "") + `
Last Modified ` + Date(Date.now()).toString(), m = new Go(
      n,
      r,
      i,
      s,
      a,
      l,
      f,
      u,
      p,
      g,
      _
    );
    m.reactions = e[1].reactions, m.nodes = e[1].nodes, m.text_labels = e[1].text_labels;
    for (var T in m.nodes) {
      var c = m.nodes[T];
      if (c.connected_segments = [], u) {
        if (c.node_type !== "metabolite") continue;
        m.search_index.insert("n" + T, {
          name: c.bigg_id,
          data: {
            type: "metabolite",
            node_id: T
          }
        }), m.search_index.insert("n_name" + T, {
          name: c.name,
          data: {
            type: "metabolite",
            node_id: T
          }
        });
      }
    }
    for (var w in m.reactions) {
      var z = m.reactions[w];
      if (u) {
        m.search_index.insert(
          "r" + w,
          {
            name: z.bigg_id,
            data: {
              type: "reaction",
              reaction_id: w
            }
          }
        ), m.search_index.insert(
          "r_name" + w,
          {
            name: z.name,
            data: {
              type: "reaction",
              reaction_id: w
            }
          }
        );
        for (var P in z.genes) {
          var b = z.genes[P];
          m.search_index.insert(
            "r" + w + "_g" + P,
            {
              name: b.bigg_id,
              data: {
                type: "reaction",
                reaction_id: w
              }
            }
          ), m.search_index.insert(
            "r" + w + "_g_name" + P,
            {
              name: b.name,
              data: {
                type: "reaction",
                reaction_id: w
              }
            }
          );
        }
      }
      var x = [];
      for (var C in z.segments) {
        var E = z.segments[C];
        if (E.reversibility = z.reversibility, !(E.from_node_id in m.nodes) || !(E.to_node_id in m.nodes)) {
          console.warn("Bad node references in segment " + C + ". Deleting segment."), x.push(C);
          continue;
        }
        const te = m.nodes[E.from_node_id], ne = m.nodes[E.to_node_id];
        z.metabolites.forEach(function(J) {
          J.bigg_id === te.bigg_id ? E.from_node_coefficient = J.coefficient : J.bigg_id === ne.bigg_id && (E.to_node_coefficient = J.coefficient);
        }), [te, ne].forEach(function(J) {
          J.connected_segments.push({
            segment_id: C,
            reaction_id: w
          });
        });
        var M = m.nodes[E.from_node_id], D = m.nodes[E.to_node_id];
        if (M.node_type == "metabolite" || D.node_type == "metabolite") {
          var $ = se.c_plus_c(M, se.c_times_scalar(se.c_minus_c(D, M), 0.5));
          E.b1 === null && (E.b1 = $), E.b2 === null && (E.b2 = $);
        }
      }
      x.forEach(function(te) {
        delete z.segments[te];
      });
    }
    if (u)
      for (var G in m.text_labels) {
        var U = m.text_labels[G];
        m.search_index.insert("l" + G, {
          name: U.text,
          data: {
            type: "text_label",
            text_label_id: G
          }
        });
      }
    m.beziers = Oo(m.reactions), m.largest_ids.reactions = V(m.reactions), m.largest_ids.nodes = V(m.nodes), m.largest_ids.text_labels = V(m.text_labels);
    var ae = 0;
    for (var I in m.reactions)
      ae = V(
        m.reactions[I].segments,
        ae
      );
    return m.largest_ids.segments = ae, m.apply_reaction_data_to_map(null), m.apply_metabolite_data_to_map(null), m.apply_gene_data_to_map(null), m;
    function V(te, ne) {
      return ce.isUndefined(ne) && (ne = 0), ce.isUndefined(te) ? ne : Math.max.apply(null, Object.keys(te).map(function(J) {
        return parseInt(J);
      }).concat([ne]));
    }
  }
  // ---------------------------------------------------------------------
  // more setup
  // ---------------------------------------------------------------------
  setup_containers(e) {
    e.append("g").attr("id", "reactions"), e.append("g").attr("id", "nodes"), e.append("g").attr("id", "beziers"), e.append("g").attr("id", "text-labels");
  }
  reset_containers() {
    this.sel.select("#reactions").selectAll(".reaction").remove(), this.sel.select("#nodes").selectAll(".node").remove(), this.sel.select("#beziers").selectAll(".bezier").remove(), this.sel.select("#text-labels").selectAll(".text-label").remove();
  }
  // -------------------------------------------------------------------------
  // Appearance
  // -------------------------------------------------------------------------
  /** Set the status of the map, with an optional expiration
        time. Rendering the status is taken care of by the Builder.
  
        Arguments
        ---------
  
        status: The status string.
  
        time: An optional time, in ms, after which the status is set to ''.
  
    */
  set_status(e, n) {
    this.callback_manager.run("set_status", null, e), clearTimeout(this._status_timer), this._status_timer = null, n !== void 0 && (this._status_timer = setTimeout((function() {
      this.callback_manager.run("set_status", null, "");
    }).bind(this), n));
  }
  /**
   * Clear the map data
   */
  clearMapData() {
    this.reactions = {}, this.beziers = {}, this.nodes = {}, this.text_labels = {}, this.map_name = "new_map", this.map_id = se.generate_map_id(), this.map_description = "";
  }
  has_cobra_model() {
    return this.cobra_model !== null;
  }
  /**
   * Draw the all reactions, nodes, & text labels.
   */
  draw_everything() {
    this.draw_all_reactions(!0, !0), this.draw_all_nodes(!0), this.draw_all_text_labels();
  }
  /** Draw all reactions, and clear deleted reactions.
  
        Arguments
        ---------
  
        draw_beziers: (Boolean, default True) Whether to also draw the bezier
        control points.
  
        clear_deleted: (Optional, Default: true) Boolean, if true, then also
        clear deleted nodes.
  
    */
  draw_all_reactions(e, n) {
    ce.isUndefined(e) && (e = !0), ce.isUndefined(n) && (n = !0);
    var r = [];
    for (var i in this.reactions)
      r.push(i);
    this.draw_these_reactions(r, !1), e && this.beziers_enabled && this.draw_all_beziers(), n && this.clear_deleted_reactions(e);
  }
  /**
   * Draw specific reactions. Does nothing with exit selection. Use
   * clear_deleted_reactions to remove reactions from the DOM.
   * reactions_ids: An array of reaction_ids to update.
   * draw_beziers: (Boolean, default True) Whether to also draw the bezier control
   * points.
   */
  draw_these_reactions(e, n) {
    ce.isUndefined(n) && (n = !0);
    var r = se.object_slice_for_ids_ref(
      this.reactions,
      e
    ), i = (function(a) {
      return this.draw.update_reaction(
        a,
        this.scale,
        this.cobra_model,
        this.nodes,
        this.defs,
        this.has_data_on_reactions
      );
    }).bind(this);
    if (se.draw_an_object(
      this.sel,
      "#reactions",
      ".reaction",
      r,
      "reaction_id",
      this.draw.create_reaction.bind(this.draw),
      i
    ), n) {
      var s = qf(r);
      this.draw_these_beziers(s);
    }
  }
  /**
   * Remove any reactions that are not in *this.reactions*.
   * draw_beziers: (Boolean, default True) Whether to also clear deleted bezier
   * control points.
   */
  clear_deleted_reactions(e) {
    ce.isUndefined(e) && (e = !0), se.draw_an_object(
      this.sel,
      "#reactions",
      ".reaction",
      this.reactions,
      "reaction_id",
      null,
      function(n) {
        se.draw_a_nested_object(
          n,
          ".segment-group",
          "segments",
          "segment_id",
          null,
          null,
          function(r) {
            r.remove();
          }
        );
      },
      function(n) {
        n.remove();
      }
    ), e === !0 && this.clear_deleted_beziers();
  }
  /**
   * Draw all nodes, and clear deleted nodes.
   * @param clear_deleted: (Optional, Default: true) Boolean, if true, then also
   * @param clear deleted nodes.
   */
  draw_all_nodes(e) {
    e === void 0 && (e = !0);
    var n = [];
    for (var r in this.nodes)
      n.push(r);
    this.draw_these_nodes(n), e && this.clear_deleted_nodes();
  }
  /** Draw specific nodes.
  
        Does nothing with exit selection. Use clear_deleted_nodes to remove
        nodes from the DOM.
  
        Arguments
        ---------
  
        nodes_ids: An array of node_ids to update.
  
    */
  draw_these_nodes(e) {
    var n = se.object_slice_for_ids_ref(this.nodes, e), r = (function(s) {
      return this.draw.create_node(
        s,
        this.nodes,
        this.reactions
      );
    }).bind(this), i = (function(s) {
      return this.draw.update_node(
        s,
        this.scale,
        this.has_data_on_nodes,
        this.behavior.selectableMousedown,
        this.behavior.selectableClick,
        this.behavior.nodeMouseover,
        this.behavior.nodeMouseout,
        this.behavior.selectableDrag,
        this.behavior.nodeLabelDrag
      );
    }).bind(this);
    se.draw_an_object(
      this.sel,
      "#nodes",
      ".node",
      n,
      "node_id",
      r,
      i
    );
  }
  /**
   * Remove any nodes that are not in *this.nodes*.
   */
  clear_deleted_nodes() {
    se.draw_an_object(
      this.sel,
      "#nodes",
      ".node",
      this.nodes,
      "node_id",
      null,
      null,
      function(e) {
        e.remove();
      }
    );
  }
  /**
   * Draw all text_labels.
   */
  draw_all_text_labels() {
    this.draw_these_text_labels(Object.keys(this.text_labels)), this.clear_deleted_text_labels();
  }
  /**
   * Draw specific text_labels. Does nothing with exit selection. Use
   * clear_deleted_text_labels to remove text_labels from the DOM.
   * @param {Array} text_labels_ids - An array of text_label_ids to update.
   */
  draw_these_text_labels(e) {
    var n = se.object_slice_for_ids_ref(this.text_labels, e);
    se.draw_an_object(
      this.sel,
      "#text-labels",
      ".text-label",
      n,
      "text_label_id",
      this.draw.create_text_label.bind(this.draw),
      this.draw.update_text_label.bind(this.draw)
    );
  }
  /**
   * Remove any text_labels that are not in *this.text_labels*.
   */
  clear_deleted_text_labels() {
    se.draw_an_object(
      this.sel,
      "#text-labels",
      ".text-label",
      this.text_labels,
      "text_label_id",
      null,
      null,
      function(e) {
        e.remove();
      }
    );
  }
  /**
   * Draw all beziers, and clear deleted reactions.
   */
  draw_all_beziers() {
    var e = [];
    for (var n in this.beziers)
      e.push(n);
    this.draw_these_beziers(e), this.clear_deleted_beziers();
  }
  draw_these_beziers(e) {
    var n = se.object_slice_for_ids_ref(this.beziers, e), r = (function(i) {
      return this.draw.update_bezier(
        i,
        this.beziers_enabled,
        this.behavior.bezierDrag,
        this.behavior.bezierMouseover,
        this.behavior.bezierMouseout,
        this.nodes,
        this.reactions
      );
    }).bind(this);
    se.draw_an_object(
      this.sel,
      "#beziers",
      ".bezier",
      n,
      "bezier_id",
      this.draw.create_bezier.bind(this.draw),
      r
    );
  }
  clear_deleted_beziers() {
    se.draw_an_object(
      this.sel,
      "#beziers",
      ".bezier",
      this.beziers,
      "bezier_id",
      null,
      null,
      function(e) {
        e.remove();
      }
    );
  }
  show_beziers() {
    this.toggle_beziers(!0);
  }
  hide_beziers() {
    this.toggle_beziers(!1);
  }
  toggle_beziers(e) {
    ce.isUndefined(e) ? this.beziers_enabled = !this.beziers_enabled : this.beziers_enabled = e, this.draw_all_beziers(), this.callback_manager.run("toggle_beziers", null, this.beziers_enabled);
  }
  /**
   * Returns True if the scale has changed.
   * @param {Array} keys - (Optional) The keys in reactions to apply data to.
   */
  apply_reaction_data_to_map(e, n) {
    const r = this.settings.get("reaction_styles"), i = this.settings.get("reaction_compare_style"), s = ro(
      this.reactions,
      e,
      r,
      i,
      n
    );
    return this.has_data_on_reactions = s, this.imported_reaction_data = s ? e : null, this.calc_data_stats("reaction");
  }
  /**
   * Returns True if the scale has changed.
   * @param {Array} keys - (Optional) The keys in nodes to apply data to.
   */
  apply_metabolite_data_to_map(e, n) {
    const r = this.settings.get("metabolite_styles"), i = this.settings.get("metabolite_compare_style"), s = io(
      this.nodes,
      e,
      r,
      i,
      n
    );
    return this.has_data_on_nodes = s, this.imported_metabolite_data = s ? e : null, this.calc_data_stats("metabolite");
  }
  /**
   * Returns True if the scale has changed.
   * gene_data_obj: The gene data object, with the following style:
   * { reaction_id: { rule: 'rule_string', genes: { gene_id: value } } }
   * @param {Array} keys - (Optional) The keys in reactions to apply data to.
   */
  apply_gene_data_to_map(e, n) {
    var r = this.settings.get("reaction_styles"), i = this.settings.get("reaction_compare_style"), s = this.settings.get("identifiers_on_map"), a = this.settings.get("and_method_in_gene_reaction_rule"), l = so(
      this.reactions,
      e,
      r,
      s,
      i,
      a,
      n
    );
    return this.has_data_on_reactions = l, this.imported_gene_data = l ? e : null, this.calc_data_stats("reaction");
  }
  // ------------------------------------------------
  // Data domains
  // ------------------------------------------------
  get_data_statistics() {
    return this.data_statistics;
  }
  /**
   * Returns True if the stats have changed.
   * @param {String} type - Either 'metabolite' or 'reaction'
   */
  calc_data_stats(e) {
    if (["reaction", "metabolite"].indexOf(e) === -1)
      throw new Error("Bad type " + e);
    "data_statistics" in this ? e in this.data_statistics || (this.data_statistics[e] = null) : (this.data_statistics = {}, this.data_statistics[e] = null);
    const n = [];
    if (e === "metabolite")
      for (let p in this.nodes) {
        var r = this.nodes[p];
        ce.isUndefined(r.data) ? console.error("metabolite missing ") : r.data !== null && n.push(r.data);
      }
    else if (e == "reaction")
      for (let p in this.reactions) {
        var i = this.reactions[p];
        ce.isUndefined(i.data) ? console.error("reaction data missing ") : i.data !== null && n.push(i.data);
      }
    if (n.length === 0) {
      const p = this.data_statistics[e] === null;
      return this.data_statistics[e] = null, e === "reaction" ? this.callback_manager.run("calc_data_stats__reaction", null, !p) : this.callback_manager.run("calc_data_stats__metabolite", null, !p), !p;
    }
    this.data_statistics[e] === null && (this.data_statistics[e] = {});
    let s = !0;
    var a = se.quartiles(n), l = [
      ["min", ba(Math.min)],
      ["max", ba(Math.max)],
      ["mean", se.mean],
      ["Q1", function() {
        return a[0];
      }],
      ["median", function() {
        return a[1];
      }],
      ["Q3", function() {
        return a[2];
      }]
    ];
    if (l.forEach((function(p) {
      var g, _ = p[0];
      if (n.length === 0)
        g = null;
      else {
        var m = p[1];
        g = m(n);
      }
      g != this.data_statistics[e][_] && (s = !1), this.data_statistics[e][_] = g;
    }).bind(this)), this.data_statistics[e].min === this.data_statistics[e].max && this.data_statistics[e].min !== null) {
      var u = this.data_statistics[e].min, f = this.data_statistics[e].max;
      this.data_statistics[e].min = u - 1 - Math.abs(u) * 0.1, this.data_statistics[e].max = f + 1 + Math.abs(f) * 0.1;
    }
    return e === "reaction" ? this.callback_manager.run("calc_data_stats__reaction", null, !s) : this.callback_manager.run("calc_data_stats__metabolite", null, !s), !s;
  }
  // ---------------------------------------------------------------------
  // Node interaction
  // ---------------------------------------------------------------------
  get_coords_for_node(e) {
    var n = this.nodes[e], r = { x: n.x, y: n.y };
    return r;
  }
  get_selected_node_ids() {
    var e = [];
    return this.sel.select("#nodes").selectAll(".selected").each(function(n) {
      e.push(n.node_id);
    }), e;
  }
  getSelectedNodes() {
    var e = {};
    return this.sel.select("#nodes").selectAll(".selected").each((function(n) {
      e[n.node_id] = this.nodes[n.node_id];
    }).bind(this)), e;
  }
  get_selected_text_label_ids() {
    var e = [];
    return this.sel.select("#text-labels").selectAll(".selected").each(function(n) {
      e.push(n.text_label_id);
    }), e;
  }
  get_selected_text_labels() {
    var e = {};
    return this.sel.select("#text-labels").selectAll(".selected").each((function(n) {
      e[n.text_label_id] = this.text_labels[n.text_label_id];
    }).bind(this)), e;
  }
  select_all() {
    this.sel.selectAll("#nodes,#text-labels").selectAll(".node,.text-label").classed("selected", !0);
  }
  select_none() {
    this.sel.selectAll(".selected").classed("selected", !1);
  }
  invert_selection() {
    var e = this.sel.selectAll("#nodes,#text-labels").selectAll(".node,.text-label");
    e.classed("selected", function() {
      return !Pe(this).classed("selected");
    });
  }
  select_metabolite_with_id(e) {
    this.deselect_text_labels();
    var n = this.sel.select("#nodes").selectAll(".node"), r, i;
    n.classed("selected", function(s) {
      var a = String(s.node_id) == String(e);
      return a && (i = s, r = { x: s.x, y: s.y }), a;
    }), this.sel.selectAll(".start-reaction-target").style("visibility", "hidden"), this.callback_manager.run("select_metabolite_with_id", null, i, r);
  }
  select_selectable(e, n, r) {
    r = ce.isUndefined(r) ? !1 : r;
    var i = this.sel.selectAll("#nodes,#text-labels").selectAll(".node,.text-label"), s;
    Pe(e).attr("class").indexOf("text-label") == -1 ? s = e.parentNode : s = e, r ? Pe(s).classed("selected", !Pe(s).classed("selected")) : (i.classed("selected", !1), Pe(s).classed("selected", !0));
    var a = this.sel.select("#nodes").selectAll(".selected"), l = 0, u, f;
    a.each(function(p) {
      f = p, u = { x: p.x, y: p.y }, l++;
    }), this.callback_manager.run("select_selectable", null, l, f, u);
  }
  /**
   * Unselect all but one selected node, and return the node. If no nodes are
   * selected, return null.
   */
  select_single_node() {
    var e = null, n = this.sel.select("#nodes").selectAll(".selected");
    return n.classed("selected", function(r, i) {
      return i === 0 ? (e = r, !0) : !1;
    }), e;
  }
  deselect_nodes() {
    var e = this.sel.select("#nodes").selectAll(".node");
    e.classed("selected", !1), this.callback_manager.run("deselect_nodes");
  }
  select_text_label(e, n) {
    this.deselect_nodes();
    var r = this.sel.select("#text-labels").selectAll(".text-label");
    r.classed("selected", function(s) {
      return n === s;
    });
    var i = this.sel.select("#text-labels").selectAll(".selected");
    i.each(function(s) {
      s.x, s.y;
    }), this.callback_manager.run("select_text_label");
  }
  deselect_text_labels() {
    var e = this.sel.select("#text-labels").selectAll(".text-label");
    e.classed("selected", !1);
  }
  /**
   * Align selected nodes and/or reactions vertically. Undoable.
   */
  align_vertical() {
    return this._align(!1);
  }
  /**
   * Align selected nodes and/or reactions horizontally. Undoable
   */
  align_horizontal() {
    return this._align(!0);
  }
  /**
   * Generic function for aligning nodes.
   * @param {Boolean} isHorizontal - If true, align horizontal; else vertical.
   */
  _align(e) {
    const n = this.getSelectedNodes(), r = ce.pick(
      n,
      (_) => _.node_type !== "metabolite" || _.node_is_primary
    ), i = Object.keys(r).length > 0, s = i ? r : n, a = Object.keys(s), l = a.reduce((_, m) => _ + (e ? s[m].y : s[m].x), 0) / a.length, u = ce.pairs(s).map(([_, m]) => ({
      nodeId: _,
      displacement: e ? { x: 0, y: l - m.y } : { x: l - m.x, y: 0 }
    })), f = [], p = {};
    i && ce.mapObject(s, (_, m) => {
      _.connected_segments.map((T) => {
        const c = T.segment_id, w = T.reaction_id, z = this.reactions[w].segments[c], P = z.to_node_id === _.node_id, b = P ? z.from_node_id : z.to_node_id, x = this.nodes[b], C = P ? "b2" : "b1";
        if (x.node_id in n && z[C]) {
          const E = Et(c, C);
          if (f.push({
            reactionId: w,
            segmentId: c,
            bez: C,
            bezierId: E,
            displacement: e ? { x: 0, y: _.y - z[C].y } : { x: _.x - z[C].x, y: 0 }
          }), x.node_type === "metabolite" && !x.node_is_primary && !(b in p)) {
            const M = x.connected_segments.filter((D) => {
              const $ = this.reactions[w].segments[c];
              return $.to_node_id === x.node_id ? $.from_node_id in n : $.to_node_id in n;
            });
            x.connected_segments.length <= M.length && (u.push({
              nodeId: b,
              displacement: e ? { x: 0, y: l - _.y } : { x: l - _.x, y: 0 }
            }), p[b] = !0);
          }
        }
      });
    });
    const g = (_, m) => {
      let T = [];
      _.map((c) => {
        const w = this.nodes[c.nodeId], z = tn(
          w,
          c.nodeId,
          this.reactions,
          this.beziers,
          c.displacement
        );
        T = se.uniqueConcat([T, z.reaction_ids]);
      }), m.map((c) => {
        const w = this.reactions[c.reactionId].segments[c.segmentId];
        w[c.bez] = se.c_plus_c(w[c.bez], c.displacement), this.beziers[c.bezierId].x = w[c.bez].x, this.beziers[c.bezierId].y = w[c.bez].y;
      }), this.draw_these_nodes(_.map((c) => c.nodeId)), this.draw_these_reactions(T, !0);
    };
    this.undo_stack.push(
      // undo
      () => {
        const _ = (m) => m.map((T) => ({
          ...T,
          displacement: { x: -T.displacement.x, y: -T.displacement.y }
        }));
        g(_(u), _(f));
      },
      // redo
      () => {
        g(u, f);
      }
    ).do(), this.set_status(i ? "Aligned reactions" : "Aligned nodes", 3e3);
  }
  // ---------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------
  /**
   * Delete the selected nodes and associated segments and reactions, and selected
   * labels. Undoable.
   */
  delete_selected() {
    var e = this.getSelectedNodes(), n = this.get_selected_text_labels();
    (Object.keys(e).length >= 1 || Object.keys(n).length >= 1) && this.delete_selectable(e, n, !0);
  }
  /**
   * Delete the nodes and associated segments and reactions. Undoable.
   * selected_nodes: An object that is a subset of map.nodes.
   * selected_text_labels: An object that is a subset of map.text_labels.
   * should_draw: A boolean argument to determine whether to draw the changes to
   * the map.
   */
  delete_selectable(e, n, r) {
    var i = this.segments_and_reactions_for_nodes(e), s = i.segment_objs_w_segments, a = i.reactions, l = se.clone(e), u = se.clone(s), f = se.clone(a), p = se.clone(n), g = (function(_, m, T, c) {
      this.delete_node_data(Object.keys(e)), this.delete_segment_data(T), this.delete_reaction_data(Object.keys(m)), this.delete_text_label_data(Object.keys(c));
      var w = !1, z = !1;
      this.has_data_on_reactions && (w = this.calc_data_stats("reaction")), this.has_data_on_nodes && (z = this.calc_data_stats("metabolite")), r && (w ? this.draw_all_reactions(!0, !0) : this.clear_deleted_reactions(), z ? this.draw_all_nodes(!0) : this.clear_deleted_nodes(), this.clear_deleted_text_labels());
    }).bind(this);
    g(
      e,
      a,
      s,
      n
    ), this.undo_stack.push((function() {
      this.extend_nodes(l), this.extend_reactions(f);
      var _ = Object.keys(f);
      for (var m in u) {
        var T = u[m], c = T.segment;
        this.reactions[T.reaction_id].segments[T.segment_id] = c;
        var w = [c.from_node_id, c.to_node_id];
        w.forEach((function(x) {
          if (!(x in l)) {
            var C = this.nodes[x];
            C.connected_segments.push({
              reaction_id: T.reaction_id,
              segment_id: T.segment_id
            });
          }
        }).bind(this));
        var z = T.segment_id, P = T.reaction_id, b = {};
        b[z] = T.segment, se.extend(this.beziers, Io(b, P)), _.indexOf(T.reaction_id) === -1 && _.push(T.reaction_id);
      }
      if (this.has_data_on_reactions ? this.calc_data_stats("reaction") ? this.draw_all_reactions(!0, !1) : this.draw_these_reactions(_) : r && this.draw_these_reactions(_), this.has_data_on_nodes) {
        const x = this.calc_data_stats("metabolite");
        r && (x ? this.draw_all_nodes(!1) : this.draw_these_nodes(Object.keys(l)));
      } else
        r && this.draw_these_nodes(Object.keys(l));
      se.extend(this.text_labels, p), r && this.draw_these_text_labels(Object.keys(p)), n = se.clone(p), e = se.clone(l), s = se.clone(u), a = se.clone(f);
    }).bind(this), (function() {
      g(
        e,
        a,
        s,
        n
      );
    }).bind(this));
  }
  /**
   * Delete nodes, and remove from search index.
   */
  delete_node_data(e) {
    e.forEach((n) => {
      this.enable_search && this.nodes[n].node_type === "metabolite" && (this.search_index.remove("n" + n) && this.search_index.remove("n_name" + n) || console.warn("Could not find deleted metabolite in search index")), delete this.nodes[n];
    });
  }
  /**
   * Delete segments, update connected_segments in nodes, and delete bezier
   * points.
   * @param {Object} segment_objs - Object with values like
   *                                { reaction_id: '123', segment_id: '456' }
   */
  delete_segment_data(e) {
    for (var n in e) {
      var r = e[n], i = this.reactions[r.reaction_id];
      if (!(r.segment_id in i.segments)) return;
      var s = i.segments[r.segment_id];
      [s.from_node_id, s.to_node_id].forEach((function(a) {
        if (a in this.nodes) {
          var l = this.nodes[a];
          l.connected_segments = l.connected_segments.filter(function(u) {
            return u.segment_id != r.segment_id;
          });
        }
      }).bind(this)), ["b1", "b2"].forEach((function(a) {
        var l = Et(r.segment_id, a);
        delete this.beziers[l];
      }).bind(this)), delete i.segments[r.segment_id];
    }
  }
  /**
   * Delete reactions, segments, and beziers, and remove reaction from search
   * index.
   */
  delete_reaction_data(e) {
    e.forEach((function(n) {
      var r = this.reactions[n];
      for (var i in r.segments)
        ["b1", "b2"].forEach((function(l) {
          var u = Et(i, l);
          delete this.beziers[u];
        }).bind(this));
      delete this.reactions[n];
      var s = this.search_index.remove("r" + n) && this.search_index.remove("r_name" + n);
      s || console.warn("Could not find deleted reaction " + n + " in search index");
      for (var a in r.genes) {
        var s = this.search_index.remove("r" + n + "_g" + a) && this.search_index.remove("r" + n + "_g_name" + a);
        s || console.warn("Could not find deleted gene " + a + " in search index");
      }
    }).bind(this));
  }
  /**
   * Delete text labels for an array of IDs
   */
  delete_text_label_data(e) {
    e.forEach((function(n) {
      delete this.text_labels[n];
      var r = this.search_index.remove("l" + n);
      r || console.warn("Could not find deleted text label in search index");
    }).bind(this));
  }
  // ---------------------------------------------------------------------
  // Building
  // ---------------------------------------------------------------------
  _extend_and_draw_metabolite(e, n) {
    this.extend_nodes(e);
    const r = [n];
    if (this.has_data_on_nodes) {
      if (this.imported_metabolite_data === null)
        throw new Error("imported_metabolite_data should not be null");
      var i = this.apply_metabolite_data_to_map(
        this.imported_metabolite_data,
        r
      );
      i ? this.draw_all_nodes(!1) : this.draw_these_nodes(r);
    } else
      this.draw_these_nodes(r);
  }
  /**
   * Draw a reaction on a blank canvas.
   * @param {String} starting_reaction - bigg_id for a reaction to draw.
   * @param {Coords} coords - coordinates to start drawing
   */
  new_reaction_from_scratch(e, n, r) {
    if (!this.cobra_model) {
      console.error("No CobraModel. Cannot build new reaction");
      return;
    }
    var i = se.clone(this.cobra_model.reactions[e]);
    if (ce.size(i.metabolites) === 0)
      throw Error("No metabolites in reaction " + i.bigg_id);
    const s = ce.map(
      i.metabolites,
      (w, z) => [w, z]
    ).filter((w) => w[0] < 0).map((w) => w[1]), a = s.length > 0 ? s[0] : Object.keys(i.metabolites)[0], l = this.cobra_model.metabolites[a], u = String(++this.largest_ids.nodes), f = Do(
      se.to_radians(r),
      0,
      1,
      !0,
      a,
      !0
    );
    var p = {
      connected_segments: [],
      x: n.x,
      y: n.y,
      node_is_primary: !0,
      label_x: n.x + f.x,
      label_y: n.y + f.y,
      name: l.name,
      bigg_id: a,
      node_type: "metabolite"
    }, g = {};
    g[u] = p, this._extend_and_draw_metabolite(g, u);
    var _ = se.clone(g), m = this.new_reaction_for_metabolite(
      e,
      u,
      r,
      !1
    ), T = m.redo, c = m.undo;
    this.undo_stack.push(() => {
      c(), this.delete_node_data(Object.keys(g)), g = se.clone(_), this.clear_deleted_nodes(), this.deselect_nodes();
    }, () => {
      this._extend_and_draw_metabolite(g, u), T();
    });
  }
  /**
   * Add new nodes to data and search index.
   */
  extend_nodes(e) {
    if (this.enable_search)
      for (var n in e) {
        var r = e[n];
        r.node_type == "metabolite" && (this.search_index.insert(
          "n" + n,
          {
            name: r.bigg_id,
            data: {
              type: "metabolite",
              node_id: n
            }
          }
        ), this.search_index.insert(
          "n_name" + n,
          {
            name: r.name,
            data: {
              type: "metabolite",
              node_id: n
            }
          }
        ));
      }
    se.extend(this.nodes, e);
  }
  /**
   * Add new reactions to data and search index.
   */
  extend_reactions(e) {
    if (this.enable_search)
      for (var n in e) {
        var r = e[n];
        this.search_index.insert("r" + n, {
          name: r.bigg_id,
          data: {
            type: "reaction",
            reaction_id: n
          }
        }), this.search_index.insert("r_name" + n, {
          name: r.name,
          data: {
            type: "reaction",
            reaction_id: n
          }
        });
        for (var i in r.genes) {
          var s = r.genes[i];
          this.search_index.insert(
            "r" + n + "_g" + i,
            {
              name: s.bigg_id,
              data: {
                type: "reaction",
                reaction_id: n
              }
            }
          ), this.search_index.insert(
            "r" + n + "_g_name" + i,
            {
              name: s.name,
              data: {
                type: "reaction",
                reaction_id: n
              }
            }
          );
        }
      }
    se.extend(this.reactions, e);
  }
  _extend_and_draw_reaction(e, n, r, i) {
    this.extend_reactions(n), se.extend(this.beziers, r), this.delete_node_data([i]), this.extend_nodes(e);
    var s = Object.keys(n);
    if (this.has_data_on_reactions) {
      var a = !1;
      if (this.imported_reaction_data)
        a = this.apply_reaction_data_to_map(
          this.imported_reaction_data,
          s
        );
      else if (this.imported_gene_data)
        a = this.apply_gene_data_to_map(this.imported_gene_data, s);
      else
        throw new Error("imported_gene_data or imported_reaction_data should not be null");
      a ? this.draw_all_reactions(!0, !1) : this.draw_these_reactions(s);
    } else
      this.draw_these_reactions(s);
    var l = Object.keys(e);
    if (this.has_data_on_nodes) {
      if (this.imported_metabolite_data === null)
        throw new Error("imported_metabolite_data should not be null");
      var a = this.apply_metabolite_data_to_map(
        this.imported_metabolite_data,
        l
      );
      a ? this.draw_all_nodes(!1) : this.draw_these_nodes(l);
    } else
      this.draw_these_nodes(l);
    for (var u in e) {
      var f = e[u];
      if (f.node_is_primary && u != i) {
        this.select_metabolite_with_id(u);
        var p = { x: f.x, y: f.y };
        this.zoomContainer && this.zoomContainer.translateOffScreen(p);
      }
    }
  }
  /**
   * Build a new reaction starting with selected_met. Undoable.
   * @param {String} reaction_bigg_id - The BiGG ID of the reaction to draw.
   * @param {String} selected_node_id - The ID of the node to begin drawing with.
   * @param {Number} direction - The direction to draw in.
   * @param {Boolean} [apply_undo_redo=true] - If true, then add to the undo
   * stack. Otherwise, just return the undo and redo functions.
   * @return An object of undo and redo functions:
   *   { undo: undo_function, redo: redo_function }
   */
  new_reaction_for_metabolite(e, n, r, i) {
    i === void 0 && (i = !0);
    var s = this.nodes[n], a = this.cobra_model.reactions[e], l = Uf(
      e,
      a,
      this.cobra_model.metabolites,
      n,
      se.clone(s),
      this.largest_ids,
      this.settings.get("cofactors"),
      r
    ), u = l.new_nodes, f = l.new_reactions, p = l.new_beziers;
    this._extend_and_draw_reaction(
      u,
      f,
      p,
      n
    );
    var g = se.clone(u), _ = se.clone(f), m = se.clone(p), T = () => {
      if (delete u[n], this.delete_node_data(Object.keys(u)), this.delete_reaction_data(Object.keys(f)), this.select_metabolite_with_id(n), u = se.clone(g), f = se.clone(_), p = se.clone(m), this.has_data_on_reactions) {
        var w = this.calc_data_stats("reaction");
        w ? this.draw_all_reactions(!0, !0) : this.clear_deleted_reactions(!0);
      } else
        this.clear_deleted_reactions(!0);
      this.has_data_on_nodes ? this.calc_data_stats("metabolite") ? this.draw_all_nodes(!0) : this.clear_deleted_nodes() : this.clear_deleted_nodes();
    };
    const c = () => {
      this._extend_and_draw_reaction(
        u,
        f,
        p,
        n
      );
    };
    return i && this.undo_stack.push(T, c), { undo: T, redo: c };
  }
  cycle_primary_node() {
    var e = this.getSelectedNodes();
    if (!ce.isEmpty(e)) {
      var n = Object.keys(e)[0];
      e[n];
      var r = this.reactions, i = this.nodes, s = [], a;
      if (i[n].connected_segments.forEach(function(E) {
        a = [E.reaction_id];
        var M;
        try {
          if (M = r[E.reaction_id].segments[E.segment_id], M === void 0) throw new Error("undefined segment");
        } catch {
          console.warn("Could not find connected segment " + E.segment_id);
          return;
        }
        s.push(M.from_node_id == n ? M.to_node_id : M.from_node_id);
      }), s.length != 1) {
        console.error("Only connected nodes with a single reaction can be selected");
        return;
      }
      var l = s[0], u = [n];
      i[l].connected_segments.forEach(function(E) {
        var M;
        try {
          if (M = r[E.reaction_id].segments[E.segment_id], M === void 0) throw new Error("undefined segment");
        } catch {
          console.warn("Could not find connected segment " + E.segment_id);
          return;
        }
        var D = M.from_node_id == l ? M.to_node_id : M.from_node_id, $ = i[D];
        $.node_type == "metabolite" && D != n && u.push(String(D));
      });
      for (var f = 0; f < u.length; f++)
        if (i[u[f]].connected_segments.length > 1) {
          console.error("Only connected nodes with a single reaction can be selected");
          return;
        }
      for (var p in e)
        if (p != n && u.indexOf(p) == -1) {
          console.warn("Selected nodes are not on the same reaction");
          return;
        }
      var g = [], x = u.length - 1, _ = i[u[x]], m = _.node_is_primary, T = {
        x: _.x,
        y: _.y,
        label_x: _.label_x,
        label_y: _.label_y
      };
      _.connected_segments.length > 1 && console.warn("Too many connected segments for node " + _.node_id);
      var c = _.connected_segments[0], w;
      try {
        if (w = r[c.reaction_id].segments[c.segment_id], w === void 0) throw new Error("undefined segment");
      } catch {
        console.error("Could not find connected segment " + c.segment_id);
        return;
      }
      var z = { b1: w.b1, b2: w.b2 }, P;
      u.forEach(function(E) {
        var M = i[E], D = M.node_is_primary, $ = {
          x: M.x,
          y: M.y,
          label_x: M.label_x,
          label_y: M.label_y
        }, G = M.connected_segments[0], U = r[G.reaction_id].segments[G.segment_id], ae = { b1: U.b1, b2: U.b2 };
        M.node_is_primary = m, M.x = T.x, M.y = T.y, M.label_x = T.label_x, M.label_y = T.label_y, U.b1 = z.b1, U.b2 = z.b2, m = D, T = $, z = ae, M.node_is_primary && (P = E), g.push(E);
      });
      var b = i[l].connected_segments, x = b.length - 1, C = [b[x]];
      b.forEach(function(E, M) {
        x != M && C.push(E);
      }), i[l].connected_segments = C, this.draw_these_nodes(g), this.draw_these_reactions(a), this.select_metabolite_with_id(P);
    }
  }
  /**
   * Toggle the primary/secondary status of each selected node. Undoable.
   */
  toggle_selected_node_primary() {
    const e = this.get_selected_node_ids(), n = (function(r) {
      const i = {}, s = this.settings.get("hide_secondary_metabolites");
      if (r.forEach((function(p) {
        if (!(p in this.nodes)) {
          console.warn("Could not find node: " + p);
          return;
        }
        const g = this.nodes[p];
        g.node_type == "metabolite" && (g.node_is_primary = !g.node_is_primary, i[p] = g);
      }).bind(this)), this.draw_these_nodes(Object.keys(i)), s) {
        var a = this.segments_and_reactions_for_nodes(i), l = {};
        for (var u in a.segment_objs_w_segments) {
          var f = a.segment_objs_w_segments[u].reaction_id;
          l[f] = !0;
        }
        this.draw_these_reactions(Object.keys(l));
      }
    }).bind(this);
    n(e), this.undo_stack.push(function() {
      n(e);
    }, function() {
      n(e);
    });
  }
  segments_and_reactions_for_nodes(e) {
    var n = {}, r = {}, i = {}, s = this.reactions;
    for (var a in e) {
      var l = e[a];
      l.connected_segments.forEach(function(m) {
        var T;
        try {
          if (T = s[m.reaction_id].segments[m.segment_id], T === void 0) throw new Error("undefined segment");
        } catch {
          console.warn("Could not find connected segments for node");
          return;
        }
        var c = se.clone(m);
        c.segment = se.clone(T), n[m.segment_id] = c, m.reaction_id in i || (i[m.reaction_id] = []), i[m.reaction_id].push(m.segment_id);
      });
    }
    for (var u in i) {
      var f = s[u], p = i[u], g = !0;
      for (var _ in f.segments)
        p.indexOf(_) == -1 && (g = !1);
      g && (r[u] = f);
    }
    return { segment_objs_w_segments: n, reactions: r };
  }
  add_label_to_search_index(e, n) {
    this.search_index.insert("l" + e, {
      name: n,
      data: { type: "text_label", text_label_id: e }
    });
  }
  new_text_label(e, n) {
    var r = Wf(this.largest_ids, n, e);
    return this.text_labels[r.id] = r.label, this.draw_these_text_labels([r.id]), n !== "" && this.add_label_to_search_index(r.id, n), r.id;
  }
  /**
   * Edit a text label. Undoable.
   * @param {} text_label_id -
   * @param {String} new_value -
   * @param {Boolean} should_draw -
   * @param {Boolean} [is_new=false] - If true, then the text label is all new, so
   * delete it on undo and create it again on redo.
   */
  edit_text_label(e, n, r, i) {
    if (ce.isUndefined(i) && (i = !1), n === "")
      throw new Error("Should not be called for empty string");
    var s = (function(l, u) {
      var f = this.text_labels[e];
      f.text = l, u && this.draw_these_text_labels([e]);
      var p = "l" + e, g = this.search_index.remove(p);
      !i && !g && console.warn("Could not find modified text label in search index"), this.search_index.insert(p, {
        name: l,
        data: { type: "text_label", text_label_id: e }
      });
    }).bind(this), a = se.clone(this.text_labels[e]);
    s(n, r), this.undo_stack.push((function() {
      i ? (this.delete_text_label_data([e]), this.clear_deleted_text_labels()) : s(a.text, !0);
    }).bind(this), (function() {
      i ? (this.text_labels[e] = se.clone(a), this.text_labels[e].text = n, this.draw_these_text_labels([e]), this.add_label_to_search_index(e, n)) : s(n, !0);
    }).bind(this));
  }
  // -------------------------------------------------------------------------
  // Zoom
  // -------------------------------------------------------------------------
  /**
   * Zoom to fit all the nodes. Returns error if one is raised.
   * @param {} margin - optional argument to set the margins as a fraction of
   * height.
   */
  zoom_extent_nodes(e) {
    this._zoom_extent(e, "nodes");
  }
  /**
   * Zoom to fit the canvas. Returns error if one is raised.
   * @param {} margin - optional argument to set the margins as a fraction of
   * height.
   */
  zoom_extent_canvas(e) {
    this._zoom_extent(e, "canvas");
  }
  /**
   * Zoom to fit the canvas or all the nodes. Returns error if one is raised.
   * @param {} margin - optional argument to set the margins.
   * @param {} mode - Values are 'nodes', 'canvas'.
   */
  _zoom_extent(e, n) {
    ce.isUndefined(e) && (e = n === "nodes" ? 0.2 : 0), ce.isUndefined(n) && (n = "canvas");
    var r, i, s = this.get_size();
    if (e = e * s.height, n === "nodes") {
      var a = { x: null, y: null }, l = { x: null, y: null };
      for (var u in this.nodes) {
        var f = this.nodes[u];
        a.x === null && (a.x = f.x), a.y === null && (a.y = f.y), l.x === null && (l.x = f.x), l.y === null && (l.y = f.y), a.x = Math.min(a.x, f.x), a.y = Math.min(a.y, f.y), l.x = Math.max(l.x, f.x), l.y = Math.max(l.y, f.y);
      }
      r = Math.min(
        (s.width - e * 2) / (l.x - a.x),
        (s.height - e * 2) / (l.y - a.y)
      ), i = {
        x: -(a.x * r) + e + (s.width - e * 2 - (l.x - a.x) * r) / 2,
        y: -(a.y * r) + e + (s.height - e * 2 - (l.y - a.y) * r) / 2
      };
    } else if (n == "canvas")
      r = Math.min(
        (s.width - e * 2) / this.canvas.width,
        (s.height - e * 2) / this.canvas.height
      ), i = {
        x: -(this.canvas.x * r) + e + (s.width - e * 2 - this.canvas.width * r) / 2,
        y: -(this.canvas.y * r) + e + (s.height - e * 2 - this.canvas.height * r) / 2
      };
    else
      return console.error("Did not recognize mode");
    return this.zoomContainer.goTo(r, i), null;
  }
  get_size() {
    return this.zoomContainer.get_size();
  }
  zoom_to_reaction(e) {
    var n = this.reactions[e], r = 0.5, i = this.get_size(), s = {
      x: -n.label_x * r + i.width / 2,
      y: -n.label_y * r + i.height / 2
    };
    this.zoomContainer.goTo(r, s);
  }
  zoom_to_node(e) {
    var n = this.nodes[e], r = 0.5, i = this.get_size(), s = {
      x: -n.label_x * r + i.width / 2,
      y: -n.label_y * r + i.height / 2
    };
    this.zoomContainer.goTo(r, s);
  }
  zoom_to_text_label(e) {
    var n = this.text_labels[e], r = 0.5, i = this.get_size(), s = {
      x: -n.x * r + i.width / 2,
      y: -n.y * r + i.height / 2
    };
    this.zoomContainer.goTo(r, s);
  }
  highlight_reaction(e) {
    this.highlight(this.sel.selectAll("#r" + e).selectAll("text"));
  }
  highlight_node(e) {
    this.highlight(this.sel.selectAll("#n" + e).selectAll("text"));
  }
  highlight_text_label(e) {
    this.highlight(this.sel.selectAll("#l" + e).selectAll("text"));
  }
  highlight(e) {
    this.sel.selectAll(".highlight").classed("highlight", !1), e !== null && e.classed("highlight", !0);
  }
  // -------------------------------------------------------------------------
  // IO
  // -------------------------------------------------------------------------
  save() {
    se.download_json(this.map_for_export(), this.map_name);
  }
  map_for_export() {
    var e = [
      {
        map_name: this.map_name,
        map_id: this.map_id,
        map_description: this.map_description,
        homepage: "https://escher.github.io",
        schema: "https://escher.github.io/escher/jsonschema/1-0-0#"
      },
      {
        reactions: se.clone(this.reactions),
        nodes: se.clone(this.nodes),
        text_labels: se.clone(this.text_labels),
        canvas: this.canvas.sizeAndLocation()
      }
    ];
    for (var n in e[1].reactions) {
      var r = e[1].reactions[n], i = {}, w = [
        "name",
        "bigg_id",
        "reversibility",
        "label_x",
        "label_y",
        "gene_reaction_rule",
        "genes",
        "metabolites"
      ];
      w.forEach(function(P) {
        i[P] = r[P];
      }), i.segments = {};
      for (var s in r.segments) {
        var a = r.segments[s], l = {}, w = ["from_node_id", "to_node_id", "b1", "b2"];
        w.forEach(function(b) {
          l[b] = a[b];
        }), i.segments[s] = l;
      }
      e[1].reactions[n] = i;
    }
    for (var u in e[1].nodes) {
      var f = e[1].nodes[u], p = {}, w;
      f.node_type === "metabolite" ? w = [
        "node_type",
        "x",
        "y",
        "bigg_id",
        "name",
        "label_x",
        "label_y",
        "node_is_primary"
      ] : w = ["node_type", "x", "y"], w.forEach(function(P) {
        p[P] = f[P];
      }), e[1].nodes[u] = p;
    }
    for (var g in e[1].text_labels) {
      var _ = e[1].text_labels[g], m = {}, w = ["x", "y", "text"];
      w.forEach(function(P) {
        m[P] = _[P];
      }), e[1].text_labels[g] = m;
    }
    var T = e[1].canvas, c = {}, w = ["x", "y", "width", "height"];
    return w.forEach(function(z) {
      c[z] = T[z];
    }), e[1].canvas = c, e;
  }
  /**
   * Rescale the canvas and save as svg/png.
   */
  saveMap(e, n, r) {
    this.callback_manager.run(e);
    const i = this.zoomContainer.windowScale, s = this.zoomContainer.windowTranslate, a = this.canvas.sizeAndLocation(), l = {
      w: this.canvas.mouseNode.attr("width"),
      h: this.canvas.mouseNode.attr("height"),
      transform: this.canvas.mouseNode.attr("transform")
    };
    this.zoomContainer._goToSvg(
      1,
      { x: -a.x, y: -a.y },
      () => {
        this.svg.attr("width", a.width), this.svg.attr("height", a.height), this.canvas.mouseNode.attr("width", "0px"), this.canvas.mouseNode.attr("height", "0px"), this.canvas.mouseNode.attr("transform", null);
        var u = this.sel.selectAll(".multimarker-circle,.midmarker-circle,#canvas,.bezier,#rotation-center,.direction-arrow,.start-reaction-target").style("visibility", "hidden");
        r === "svg" ? se.downloadSvg("saved_map", this.svg, !0) : r === "png" && se.downloadPng("saved_map", this.svg), this.zoomContainer._goToSvg(i, s, () => {
          this.svg.attr("width", null), this.svg.attr("height", null), this.canvas.mouseNode.attr("width", l.w), this.canvas.mouseNode.attr("height", l.h), this.canvas.mouseNode.attr("transform", l.transform), u.style("visibility", null), this.callback_manager.run(n);
        });
      }
    );
  }
  save_svg() {
    this.saveMap("before_svg_export", "after_svg_export", "svg");
  }
  save_png() {
    this.saveMap("before_png_export", "after_png_export", "png");
  }
  /**
   * Assign the descriptive names and gene_reaction_rules from the model to the
   * map. If no map is loaded, then throw an Error. If some reactions are not in
   * the model, then warn in the status.
   */
  convert_map() {
    if (this.callback_manager.run("before_convert_map"), !this.has_cobra_model())
      throw Error("No COBRA model loaded.");
    var e = this.cobra_model;
    const n = {}, r = ["name", "gene_reaction_rule", "genes"], i = {}, s = ["name"];
    let a = !1;
    for (var l in this.reactions) {
      var u = this.reactions[l];
      a = !1;
      for (var f in e.reactions) {
        const P = e.reactions[f];
        if (P.bigg_id == u.bigg_id) {
          r.forEach((C) => {
            u[C] = P[C];
          });
          let b = !0, x = null;
          for (let C in P.metabolites) {
            const E = P.metabolites[C], M = ce.find(u.metabolites, ($) => $.bigg_id === C);
            if (M === void 0) {
              b = !1;
              break;
            }
            const D = M.coefficient;
            if (x === null && (x = E > 0 != D > 0), x === !0 && E > 0 == D > 0 || x === !1 && E > 0 != D > 0) {
              b = !1;
              break;
            }
          }
          if (x && b) {
            u.metabolites.forEach((C) => {
              C.coefficient = -C.coefficient;
            });
            for (var p in u.segments) {
              const C = u.segments[p];
              C.reversibility = u.reversibility;
              const E = this.nodes[C.from_node_id], M = this.nodes[C.to_node_id];
              u.metabolites.forEach((D) => {
                D.bigg_id === E.bigg_id ? C.from_node_coefficient = D.coefficient : D.bigg_id === M.bigg_id && (C.to_node_coefficient = D.coefficient);
              });
            }
          }
          if (!b) {
            console.warn(`Metabolites for ${P.bigg_id} are different in model and map. Could
 not check and fix direction.`);
            break;
          }
          a = !0;
        }
      }
      a || (n[l] = !0);
    }
    for (var g in this.nodes) {
      var _ = this.nodes[g];
      if (_.node_type == "metabolite") {
        a = !1;
        for (var m in e.metabolites) {
          var T = e.metabolites[m];
          T.bigg_id == _.bigg_id && (s.forEach(function(P) {
            _[P] = T[P];
          }), a = !0);
        }
        a || (i[g] = !0);
      }
    }
    var c = Object.keys(n).length, w = Object.keys(i).length, z = 1e4;
    c === 0 && w === 0 ? this.set_status("Successfully converted attributes.", z) : w === 0 ? (this.set_status("Converted attributes, but count not find " + c + " reactions in the model.", z), this.settings.set("highlight_missing", !0)) : c === 0 ? (this.set_status("Converted attributes, but count not find " + w + " metabolites in the model.", z), this.settings.set("highlight_missing", !0)) : (this.set_status(
      "Converted attributes, but count not find " + c + " reactions and " + w + " metabolites in the model.",
      z
    ), this.settings.set("highlight_missing", !0)), this.draw_everything(), this.callback_manager.run("after_convert_map");
  }
};
function ya(t) {
  return function() {
    return t;
  };
}
function Lp(t, e, n) {
  this.target = t, this.type = e, this.selection = n;
}
function wa() {
  ie.stopImmediatePropagation();
}
function rr() {
  ie.preventDefault(), ie.stopImmediatePropagation();
}
var xa = {}, vi = { name: "space" }, Kt = { name: "handle" }, Zt = { name: "center" }, yi = {}, wi = {}, Pp = {
  name: "xy",
  handles: ["n", "e", "s", "w", "nw", "ne", "se", "sw"].map(qi),
  input: function(t) {
    return t;
  },
  output: function(t) {
    return t;
  }
}, vt = {
  overlay: "crosshair",
  selection: "move",
  n: "ns-resize",
  e: "ew-resize",
  s: "ns-resize",
  w: "ew-resize",
  nw: "nwse-resize",
  ne: "nesw-resize",
  se: "nwse-resize",
  sw: "nesw-resize"
}, Ma = {
  e: "w",
  w: "e",
  nw: "ne",
  ne: "nw",
  se: "sw",
  sw: "se"
}, Sa = {
  n: "s",
  s: "n",
  nw: "sw",
  ne: "se",
  se: "ne",
  sw: "nw"
}, Fp = {
  overlay: 1,
  selection: 1,
  n: null,
  e: 1,
  s: null,
  w: -1,
  nw: -1,
  ne: 1,
  se: 1,
  sw: -1
}, Bp = {
  overlay: 1,
  selection: 1,
  n: -1,
  e: null,
  s: 1,
  w: null,
  nw: -1,
  ne: -1,
  se: 1,
  sw: 1
};
function qi(t) {
  return { type: t };
}
function Rp() {
  return !ie.button;
}
function Up() {
  var t = this.ownerSVGElement || this;
  return [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]];
}
function xi(t) {
  for (; !t.__brush; ) if (!(t = t.parentNode)) return;
  return t.__brush;
}
function Mi(t) {
  return t[0][0] === t[1][0] || t[0][1] === t[1][1];
}
function ka(t) {
  var e = t.__brush;
  return e ? e.dim.output(e.selection) : null;
}
function $p() {
  return Wp(Pp);
}
function Wp(t) {
  var e = Up, n = Rp, r = mn(a, "start", "brush", "end"), i = 6, s;
  function a(_) {
    var m = _.property("__brush", g).selectAll(".overlay").data([qi("overlay")]);
    m.enter().append("rect").attr("class", "overlay").attr("pointer-events", "all").attr("cursor", vt.overlay).merge(m).each(function() {
      var c = xi(this).extent;
      Pe(this).attr("x", c[0][0]).attr("y", c[0][1]).attr("width", c[1][0] - c[0][0]).attr("height", c[1][1] - c[0][1]);
    }), _.selectAll(".selection").data([qi("selection")]).enter().append("rect").attr("class", "selection").attr("cursor", vt.selection).attr("fill", "#777").attr("fill-opacity", 0.3).attr("stroke", "#fff").attr("shape-rendering", "crispEdges");
    var T = _.selectAll(".handle").data(t.handles, function(c) {
      return c.type;
    });
    T.exit().remove(), T.enter().append("rect").attr("class", function(c) {
      return "handle handle--" + c.type;
    }).attr("cursor", function(c) {
      return vt[c.type];
    }), _.each(l).attr("fill", "none").attr("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush touchstart.brush", p);
  }
  a.move = function(_, m) {
    _.selection ? _.on("start.brush", function() {
      u(this, arguments).beforestart().start();
    }).on("interrupt.brush end.brush", function() {
      u(this, arguments).end();
    }).tween("brush", function() {
      var T = this, c = T.__brush, w = u(T, arguments), z = c.selection, P = t.input(typeof m == "function" ? m.apply(this, arguments) : m, c.extent), b = Fr(z, P);
      function x(C) {
        c.selection = C === 1 && Mi(P) ? null : b(C), l.call(T), w.brush();
      }
      return z && P ? x : x(1);
    }) : _.each(function() {
      var T = this, c = arguments, w = T.__brush, z = t.input(typeof m == "function" ? m.apply(T, c) : m, w.extent), P = u(T, c).beforestart();
      un(T), w.selection = z == null || Mi(z) ? null : z, l.call(T), P.start().brush().end();
    });
  };
  function l() {
    var _ = Pe(this), m = xi(this).selection;
    m ? (_.selectAll(".selection").style("display", null).attr("x", m[0][0]).attr("y", m[0][1]).attr("width", m[1][0] - m[0][0]).attr("height", m[1][1] - m[0][1]), _.selectAll(".handle").style("display", null).attr("x", function(T) {
      return T.type[T.type.length - 1] === "e" ? m[1][0] - i / 2 : m[0][0] - i / 2;
    }).attr("y", function(T) {
      return T.type[0] === "s" ? m[1][1] - i / 2 : m[0][1] - i / 2;
    }).attr("width", function(T) {
      return T.type === "n" || T.type === "s" ? m[1][0] - m[0][0] + i : i;
    }).attr("height", function(T) {
      return T.type === "e" || T.type === "w" ? m[1][1] - m[0][1] + i : i;
    })) : _.selectAll(".selection,.handle").style("display", "none").attr("x", null).attr("y", null).attr("width", null).attr("height", null);
  }
  function u(_, m) {
    return _.__brush.emitter || new f(_, m);
  }
  function f(_, m) {
    this.that = _, this.args = m, this.state = _.__brush, this.active = 0;
  }
  f.prototype = {
    beforestart: function() {
      return ++this.active === 1 && (this.state.emitter = this, this.starting = !0), this;
    },
    start: function() {
      return this.starting && (this.starting = !1, this.emit("start")), this;
    },
    brush: function() {
      return this.emit("brush"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.state.emitter, this.emit("end")), this;
    },
    emit: function(_) {
      Bn(new Lp(a, _, t.output(this.state.selection)), r.apply, r, [_, this.that, this.args]);
    }
  };
  function p() {
    if (ie.touches) {
      if (ie.changedTouches.length < ie.touches.length) return rr();
    } else if (s) return;
    if (!n.apply(this, arguments)) return;
    var _ = this, m = ie.target.__data__.type, T = (ie.metaKey ? m = "overlay" : m) === "selection" ? xa : ie.altKey ? Zt : Kt, c = t === wi ? null : Fp[m], w = t === yi ? null : Bp[m], z = xi(_), P = z.extent, b = z.selection, x = P[0][0], C, E, M = P[0][1], D, $, G = P[1][0], U, ae, I = P[1][1], V, te, ne, J, he, me = !1, ge, re, oe = st(_), le = oe, fe = u(_, arguments).beforestart();
    m === "overlay" ? z.selection = b = [
      [C = t === wi ? x : oe[0], D = t === yi ? M : oe[1]],
      [U = t === wi ? G : C, V = t === yi ? I : D]
    ] : (C = b[0][0], D = b[0][1], U = b[1][0], V = b[1][1]), E = C, $ = D, ae = U, te = V;
    var be = Pe(_).attr("pointer-events", "none"), K = be.selectAll(".overlay").attr("cursor", vt[m]);
    if (ie.touches)
      be.on("touchmove.brush", Z, !0).on("touchend.brush touchcancel.brush", W, !0);
    else {
      var H = Pe(ie.view).on("keydown.brush", Me, !0).on("keyup.brush", _e, !0).on("mousemove.brush", Z, !0).on("mouseup.brush", W, !0);
      ts(ie.view);
    }
    wa(), un(_), l.call(_), fe.start();
    function Z() {
      var ke = st(_);
      me && !ge && !re && (Math.abs(ke[0] - le[0]) > Math.abs(ke[1] - le[1]) ? re = !0 : ge = !0), le = ke, he = !0, rr(), Q();
    }
    function Q() {
      var ke;
      switch (ne = le[0] - oe[0], J = le[1] - oe[1], T) {
        case vi:
        case xa: {
          c && (ne = Math.max(x - C, Math.min(G - U, ne)), E = C + ne, ae = U + ne), w && (J = Math.max(M - D, Math.min(I - V, J)), $ = D + J, te = V + J);
          break;
        }
        case Kt: {
          c < 0 ? (ne = Math.max(x - C, Math.min(G - C, ne)), E = C + ne, ae = U) : c > 0 && (ne = Math.max(x - U, Math.min(G - U, ne)), E = C, ae = U + ne), w < 0 ? (J = Math.max(M - D, Math.min(I - D, J)), $ = D + J, te = V) : w > 0 && (J = Math.max(M - V, Math.min(I - V, J)), $ = D, te = V + J);
          break;
        }
        case Zt: {
          c && (E = Math.max(x, Math.min(G, C - ne * c)), ae = Math.max(x, Math.min(G, U + ne * c))), w && ($ = Math.max(M, Math.min(I, D - J * w)), te = Math.max(M, Math.min(I, V + J * w)));
          break;
        }
      }
      ae < E && (c *= -1, ke = C, C = U, U = ke, ke = E, E = ae, ae = ke, m in Ma && K.attr("cursor", vt[m = Ma[m]])), te < $ && (w *= -1, ke = D, D = V, V = ke, ke = $, $ = te, te = ke, m in Sa && K.attr("cursor", vt[m = Sa[m]])), z.selection && (b = z.selection), ge && (E = b[0][0], ae = b[1][0]), re && ($ = b[0][1], te = b[1][1]), (b[0][0] !== E || b[0][1] !== $ || b[1][0] !== ae || b[1][1] !== te) && (z.selection = [[E, $], [ae, te]], l.call(_), fe.brush());
    }
    function W() {
      if (wa(), ie.touches) {
        if (ie.touches.length) return;
        s && clearTimeout(s), s = setTimeout(function() {
          s = null;
        }, 500), be.on("touchmove.brush touchend.brush touchcancel.brush", null);
      } else
        ns(ie.view, he), H.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
      be.attr("pointer-events", "all"), K.attr("cursor", vt.overlay), z.selection && (b = z.selection), Mi(b) && (z.selection = null, l.call(_)), fe.end();
    }
    function Me() {
      switch (ie.keyCode) {
        case 16: {
          me = c && w;
          break;
        }
        case 18: {
          T === Kt && (c && (U = ae - ne * c, C = E + ne * c), w && (V = te - J * w, D = $ + J * w), T = Zt, Q());
          break;
        }
        case 32: {
          (T === Kt || T === Zt) && (c < 0 ? U = ae - ne : c > 0 && (C = E - ne), w < 0 ? V = te - J : w > 0 && (D = $ - J), T = vi, K.attr("cursor", vt.selection), Q());
          break;
        }
        default:
          return;
      }
      rr();
    }
    function _e() {
      switch (ie.keyCode) {
        case 16: {
          me && (ge = re = me = !1, Q());
          break;
        }
        case 18: {
          T === Zt && (c < 0 ? U = ae : c > 0 && (C = E), w < 0 ? V = te : w > 0 && (D = $), T = Kt, Q());
          break;
        }
        case 32: {
          T === vi && (ie.altKey ? (c && (U = ae - ne * c, C = E + ne * c), w && (V = te - J * w, D = $ + J * w), T = Zt) : (c < 0 ? U = ae : c > 0 && (C = E), w < 0 ? V = te : w > 0 && (D = $), T = Kt), K.attr("cursor", vt[m]), Q());
          break;
        }
        default:
          return;
      }
      rr();
    }
  }
  function g() {
    var _ = this.__brush || { selection: null };
    return _.extent = e.apply(this, arguments), _.dim = t, _;
  }
  return a.extent = function(_) {
    return arguments.length ? (e = typeof _ == "function" ? _ : ya([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), a) : e;
  }, a.filter = function(_) {
    return arguments.length ? (n = typeof _ == "function" ? _ : ya(!!_), a) : n;
  }, a.handleSize = function(_) {
    return arguments.length ? (i = +_, a) : i;
  }, a.on = function() {
    var _ = r.on.apply(r, arguments);
    return _ === r ? a : _;
  }, a;
}
class qp {
  constructor(e, n, r, i) {
    this.brushSel = e.append("g").attr("id", "brush-container");
    const s = this.brushSel.node(), a = e.select(i).node().nextSibling;
    s !== a && s.parentNode.insertBefore(s, a), this.enabled = n, this.map = r;
  }
  /**
   * Returns a boolean for the on/off status of the brush
   * @return {Boolean}
   */
  brushIsEnabled() {
    return this.map.sel.select(".brush").empty();
  }
  /**
   * Turn the brush on or off
   * @param {Boolean} on_off
   */
  toggle(e) {
    e === void 0 && (e = !this.enabled), e ? this.setupSelectionBrush() : this.brushSel.selectAll("*").remove();
  }
  /**
   * Turn off the mouse crosshair
   */
  turnOffCrosshair(e) {
    e.selectAll("rect").attr("cursor", null);
  }
  setupSelectionBrush() {
    const e = this.map, n = this.brushSel, r = e.sel.selectAll("#nodes,#text-labels"), i = e.canvas.sizeAndLocation(), s = i.width, a = i.height, l = i.x, u = i.y, f = this.turnOffCrosshair.bind(this);
    n.selectAll("*").remove();
    let p = !1;
    var g = $p().extent([[l, u], [l + s, u + a]]).on("start", () => {
      this.turnOffCrosshair(n), e.settings.get("hide_secondary_metabolites") && (e.settings.set("hide_secondary_metabolites", !1), e.draw_everything(), e.set_status("Showing secondary metabolites. You can hide them again in Settings.", 2e3));
    }).on("brush", function() {
      const _ = ie.sourceEvent.shiftKey, m = ka(this);
      if (m !== null) {
        var T = _ ? r.selectAll(".node:not(.selected),.text-label:not(.selected)") : r.selectAll(".node,.text-label");
        T.classed("selected", (c) => {
          const w = c.x, z = c.y;
          return m[0][0] <= w && w < m[1][0] && m[0][1] <= z && z < m[1][1];
        });
      }
    }).on("end", function() {
      f(n);
      var _ = ka(this);
      _ === null ? p ? p = !1 : e.select_none() : (p = !0, n.call(g.move, null));
    });
    n.call(g), f(n);
  }
}
function Vp(t, e) {
  const n = {
    savedValue: null,
    currentValue: null,
    lastStatus: null
  };
  return Wi.combineAsArray(t, e.toProperty(null)).scan(n, ({ savedValue: i, currentValue: s, lastStatus: a }, [l, u]) => {
    const f = a !== u;
    return f && u === "hold" ? {
      savedValue: s,
      currentValue: s,
      lastStatus: u
    } : !f && u === "hold" ? {
      savedValue: i,
      currentValue: l,
      lastStatus: u
    } : f && u === "abandon" ? {
      savedValue: null,
      currentValue: i,
      lastStatus: u
    } : f && u === "accept" ? {
      savedValue: null,
      currentValue: s,
      lastStatus: u
    } : {
      savedValue: null,
      currentValue: l,
      lastStatus: u
    };
  }).skip(1).map(({ currentValue: i }) => i).skipDuplicates().toEventStream();
}
class Hp {
  constructor(e, n) {
    this._options = e, this.statusBus = new Wi.Bus(), [this.busses, this.streams, this.acceptedStreams] = ce.chain(e).mapObject((r, i) => {
      const s = ce.contains(n, i), { bus: a, stream: l, acceptedStream: u } = this.createSetting(i, r, s);
      return [a, l, u];
    }).pairs().map(([r, [i, s, a]]) => [
      [r, i],
      [r, s],
      [r, a]
    ]).unzip().map((r) => ce.object(r)).value();
  }
  /**
   * Set up a new bus and stream for a conditional setting (i.e. one that can be
   * canceled in the settings menu.
   */
  createSetting(e, n, r) {
    const i = new Wi.Bus(), s = r ? Vp(i, this.statusBus) : i.toEventStream(), a = s.sampledBy(
      this.statusBus.filter((l) => l === "accept" || l === "abandon")
    ).merge(
      // Then merge with all the other changes
      s.filter(
        this.statusBus.map((l) => l === "accept").toProperty(!0)
      )
    );
    return s.onValue((l) => {
      this._options[e] = l;
    }), i.push(n), { bus: i, stream: s, acceptedStream: a };
  }
  /**
   * Deprecated. Use `set` instead.
   */
  set_conditional(e, n) {
    return console.warn("set_conditional is deprecated. Use Settings.set() instead"), this.set(e, n);
  }
  /**
   * Set the option. This should always be used instead of setting options
   * directly. To set options that respect the Settings menu Accept/Abandon, use
   * setConditional().
   * @param {String} name - The option name
   * @param {Any} value - The new value
   * can check whether the change was made internally to avoid loops.
   */
  set(e, n) {
    if (!(e in this.busses))
      throw new Error(`Invalid setting name ${e}`);
    this.busses[e].push(n);
  }
  /**
   * Deprecated. Use `get` intead.
   */
  get_option(e) {
    return console.warn("get_option is deprecated. Use Settings.get() instead"), this.get(e);
  }
  /**
   * Get an option
   */
  get(e) {
    return this._options[e];
  }
  holdChanges() {
    this.statusBus.push("hold");
  }
  abandonChanges() {
    this.statusBus.push("abandon");
  }
  acceptChanges() {
    this.statusBus.push("accept");
  }
}
class Yp {
  constructor(e, n, r) {
    const i = e.append("div").attr("id", "text-edit-input");
    this.placedDiv = es(i, n), this.placedDiv.hide(), this.input = i.append("input"), this.map = n, this.setUpMapCallbacks(n), this.zoomContainer = r, this.setUpZoomCallbacks(r), this.isNew = !1;
  }
  setUpMapCallbacks(e) {
    e.callback_manager.set("edit_text_label.text_edit_input", (n, r) => {
      this.show(n, r);
    }), e.callback_manager.set("new_text_label.text_edit_input", (n) => {
      this.activeTarget !== null && this._acceptChanges(this.activeTarget.target), this.hide(), this._addAndEdit(n);
    }), e.callback_manager.set("hide_text_label_editor.text_edit_input", () => {
      this.hide();
    });
  }
  setUpZoomCallbacks(e) {
    e.callbackManager.set("zoom.text_edit_input", () => {
      this.activeTarget && this._acceptChanges(this.activeTarget.target), this.is_visible() && this.hide();
    }), e.callbackManager.set("go_to.text_edit_input", () => {
      this.activeTarget && this._acceptChanges(this.activeTarget.target), this.is_visible() && this.hide();
    });
  }
  is_visible() {
    return this.placedDiv.is_visible();
  }
  show(e, n) {
    this.activeTarget && this._acceptChanges(this.activeTarget.target), this.activeTarget = { target: e, coords: n }, e.each((r) => {
      this.input.node().value = r.text;
    }), this.placedDiv.place(n), this.input.node().focus(), this.clearEscape = this.map.key_manager.addEscapeListener(() => {
      this._acceptChanges(e), this.hide();
    }, !0), this.clearEnter = this.map.key_manager.addEnterListener(() => {
      this._acceptChanges(e), this.hide();
    }, !0);
  }
  hide() {
    this.isNew = !1, this.placedDiv.hide(), this.input.attr("value", ""), this.activeTarget = null, this.clearEscape && this.clearEscape(), this.clearEscape = null, this.clearEnter && this.clearEnter(), this.clearEnter = null;
  }
  _acceptChanges(e) {
    const n = this.input.node().value;
    if (n === "")
      e.each((r) => {
        const i = {};
        i[r.text_label_id] = this.map.text_labels[r.text_label_id], this.map.delete_selectable({}, i, !0);
      });
    else {
      const r = [];
      e.each((i) => {
        this.map.edit_text_label(i.text_label_id, n, !0, this.isNew), r.push(i.text_label_id);
      });
    }
  }
  _addAndEdit(e) {
    this.isNew = !0;
    const n = this.map.new_text_label(e, ""), r = this.map.sel.select("#text-labels").selectAll(".text-label").filter((i) => i.text_label_id === n);
    r.select("text").classed("edit-text-cursor", !0), this.show(r, e);
  }
}
var Gp = function() {
}, ot = {}, Jt = [], Ca = [];
function k(t, e) {
  var n = Ca, r, i, s, a;
  for (a = arguments.length; a-- > 2; )
    Jt.push(arguments[a]);
  for (e && e.children != null && (Jt.length || Jt.push(e.children), delete e.children); Jt.length; )
    if ((i = Jt.pop()) && i.pop !== void 0)
      for (a = i.length; a--; )
        Jt.push(i[a]);
    else
      typeof i == "boolean" && (i = null), (s = typeof t != "function") && (i == null ? i = "" : typeof i == "number" ? i = String(i) : typeof i != "string" && (s = !1)), s && r ? n[n.length - 1] += i : n === Ca ? n = [i] : n.push(i), r = s;
  var l = new Gp();
  return l.nodeName = t, l.children = n, l.attributes = e ?? void 0, l.key = e == null ? void 0 : e.key, ot.vnode !== void 0 && ot.vnode(l), l;
}
function Ct(t, e) {
  for (var n in e)
    t[n] = e[n];
  return t;
}
function gn(t, e) {
  t != null && (typeof t == "function" ? t(e) : t.current = e);
}
var Xp = typeof Promise == "function" ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout, Kp = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i, Xo = [];
function Ko(t) {
  !t._dirty && (t._dirty = !0) && Xo.push(t) == 1 && (ot.debounceRendering || Xp)(Zp);
}
function Zp() {
  for (var t; t = Xo.pop(); )
    t._dirty && Wr(t);
}
function Jp(t, e, n) {
  return typeof e == "string" || typeof e == "number" ? t.splitText !== void 0 : typeof e.nodeName == "string" ? !t._componentConstructor && Zo(t, e.nodeName) : n || t._componentConstructor === e.nodeName;
}
function Zo(t, e) {
  return t.normalizedNodeName === e || t.nodeName.toLowerCase() === e.toLowerCase();
}
function Jo(t) {
  var e = Ct({}, t.attributes);
  e.children = t.children;
  var n = t.nodeName.defaultProps;
  if (n !== void 0)
    for (var r in n)
      e[r] === void 0 && (e[r] = n[r]);
  return e;
}
function Qp(t, e) {
  var n = e ? document.createElementNS("http://www.w3.org/2000/svg", t) : document.createElement(t);
  return n.normalizedNodeName = t, n;
}
function vs(t) {
  var e = t.parentNode;
  e && e.removeChild(t);
}
function Ea(t, e, n, r, i) {
  if (e === "className" && (e = "class"), e !== "key") if (e === "ref")
    gn(n, null), gn(r, t);
  else if (e === "class" && !i)
    t.className = r || "";
  else if (e === "style") {
    if ((!r || typeof r == "string" || typeof n == "string") && (t.style.cssText = r || ""), r && typeof r == "object") {
      if (typeof n != "string")
        for (var s in n)
          s in r || (t.style[s] = "");
      for (var s in r)
        t.style[s] = typeof r[s] == "number" && Kp.test(s) === !1 ? r[s] + "px" : r[s];
    }
  } else if (e === "dangerouslySetInnerHTML")
    r && (t.innerHTML = r.__html || "");
  else if (e[0] == "o" && e[1] == "n") {
    var a = e !== (e = e.replace(/Capture$/, ""));
    e = e.toLowerCase().substring(2), r ? n || t.addEventListener(e, Ta, a) : t.removeEventListener(e, Ta, a), (t._listeners || (t._listeners = {}))[e] = r;
  } else if (e !== "list" && e !== "type" && !i && e in t) {
    try {
      t[e] = r ?? "";
    } catch {
    }
    (r == null || r === !1) && e != "spellcheck" && t.removeAttribute(e);
  } else {
    var l = i && e !== (e = e.replace(/^xlink:?/, ""));
    r == null || r === !1 ? l ? t.removeAttributeNS("http://www.w3.org/1999/xlink", e.toLowerCase()) : t.removeAttribute(e) : typeof r != "function" && (l ? t.setAttributeNS("http://www.w3.org/1999/xlink", e.toLowerCase(), r) : t.setAttribute(e, r));
  }
}
function Ta(t) {
  return this._listeners[t.type](ot.event && ot.event(t) || t);
}
var Qo = [], Vi = 0, kt = !1, Er = !1;
function jo() {
  for (var t; t = Qo.shift(); )
    ot.afterMount && ot.afterMount(t), t.componentDidMount && t.componentDidMount();
}
function el(t, e, n, r, i, s) {
  Vi++ || (kt = i != null && i.ownerSVGElement !== void 0, Er = t != null && !("__preactattr_" in t));
  var a = tl(t, e, n, r, s);
  return i && a.parentNode !== i && i.appendChild(a), --Vi || (Er = !1, s || jo()), a;
}
function tl(t, e, n, r, i) {
  var s = t, a = kt;
  if ((e == null || typeof e == "boolean") && (e = ""), typeof e == "string" || typeof e == "number")
    return t && t.splitText !== void 0 && t.parentNode && (!t._component || i) ? t.nodeValue != e && (t.nodeValue = e) : (s = document.createTextNode(e), t && (t.parentNode && t.parentNode.replaceChild(s, t), Wt(t, !0))), s.__preactattr_ = !0, s;
  var l = e.nodeName;
  if (typeof l == "function")
    return ng(t, e, n, r);
  if (kt = l === "svg" ? !0 : l === "foreignObject" ? !1 : kt, l = String(l), (!t || !Zo(t, l)) && (s = Qp(l, kt), t)) {
    for (; t.firstChild; )
      s.appendChild(t.firstChild);
    t.parentNode && t.parentNode.replaceChild(s, t), Wt(t, !0);
  }
  var u = s.firstChild, f = s.__preactattr_, p = e.children;
  if (f == null) {
    f = s.__preactattr_ = {};
    for (var g = s.attributes, _ = g.length; _--; )
      f[g[_].name] = g[_].value;
  }
  return !Er && p && p.length === 1 && typeof p[0] == "string" && u != null && u.splitText !== void 0 && u.nextSibling == null ? u.nodeValue != p[0] && (u.nodeValue = p[0]) : (p && p.length || u != null) && jp(s, p, n, r, Er || f.dangerouslySetInnerHTML != null), eg(s, e.attributes, f), kt = a, s;
}
function jp(t, e, n, r, i) {
  var s = t.childNodes, a = [], l = {}, u = 0, f = 0, p = s.length, g = 0, _ = e ? e.length : 0, m, T, c, w, z;
  if (p !== 0)
    for (var P = 0; P < p; P++) {
      var b = s[P], x = b.__preactattr_, C = _ && x ? b._component ? b._component.__key : x.key : null;
      C != null ? (u++, l[C] = b) : (x || (b.splitText !== void 0 ? !i || b.nodeValue.trim() : i)) && (a[g++] = b);
    }
  if (_ !== 0)
    for (var P = 0; P < _; P++) {
      w = e[P], z = null;
      var C = w.key;
      if (C != null)
        u && l[C] !== void 0 && (z = l[C], l[C] = void 0, u--);
      else if (f < g) {
        for (m = f; m < g; m++)
          if (a[m] !== void 0 && Jp(T = a[m], w, i)) {
            z = T, a[m] = void 0, m === g - 1 && g--, m === f && f++;
            break;
          }
      }
      z = tl(z, w, n, r), c = s[P], z && z !== t && z !== c && (c == null ? t.appendChild(z) : z === c.nextSibling ? vs(c) : t.insertBefore(z, c));
    }
  if (u)
    for (var P in l)
      l[P] !== void 0 && Wt(l[P], !1);
  for (; f <= g; )
    (z = a[g--]) !== void 0 && Wt(z, !1);
}
function Wt(t, e) {
  var n = t._component;
  n ? qr(n) : (t.__preactattr_ != null && gn(t.__preactattr_.ref, null), (e === !1 || t.__preactattr_ == null) && vs(t), nl(t));
}
function nl(t) {
  for (t = t.lastChild; t; ) {
    var e = t.previousSibling;
    Wt(t, !0), t = e;
  }
}
function eg(t, e, n) {
  var r;
  for (r in n)
    !(e && e[r] != null) && n[r] != null && Ea(t, r, n[r], n[r] = void 0, kt);
  for (r in e)
    r !== "children" && r !== "innerHTML" && (!(r in n) || e[r] !== (r === "value" || r === "checked" ? t[r] : n[r])) && Ea(t, r, n[r], n[r] = e[r], kt);
}
var Pn = [];
function rl(t, e, n) {
  var r, i = Pn.length;
  for (t.prototype && t.prototype.render ? (r = new t(e, n), je.call(r, e, n)) : (r = new je(e, n), r.constructor = t, r.render = tg); i--; )
    if (Pn[i].constructor === t)
      return r.nextBase = Pn[i].nextBase, Pn.splice(i, 1), r;
  return r;
}
function tg(t, e, n) {
  return this.constructor(t, n);
}
function Tr(t, e, n, r, i) {
  t._disable || (t._disable = !0, t.__ref = e.ref, t.__key = e.key, delete e.ref, delete e.key, typeof t.constructor.getDerivedStateFromProps > "u" && (!t.base || i ? t.componentWillMount && t.componentWillMount() : t.componentWillReceiveProps && t.componentWillReceiveProps(e, r)), r && r !== t.context && (t.prevContext || (t.prevContext = t.context), t.context = r), t.prevProps || (t.prevProps = t.props), t.props = e, t._disable = !1, n !== 0 && (n === 1 || ot.syncComponentUpdates !== !1 || !t.base ? Wr(t, 1, i) : Ko(t)), gn(t.__ref, t));
}
function Wr(t, e, n, r) {
  if (!t._disable) {
    var i = t.props, s = t.state, a = t.context, l = t.prevProps || i, u = t.prevState || s, f = t.prevContext || a, p = t.base, g = t.nextBase, _ = p || g, m = t._component, T = !1, c = f, w, z, P;
    if (t.constructor.getDerivedStateFromProps && (s = Ct(Ct({}, s), t.constructor.getDerivedStateFromProps(i, s)), t.state = s), p && (t.props = l, t.state = u, t.context = f, e !== 2 && t.shouldComponentUpdate && t.shouldComponentUpdate(i, s, a) === !1 ? T = !0 : t.componentWillUpdate && t.componentWillUpdate(i, s, a), t.props = i, t.state = s, t.context = a), t.prevProps = t.prevState = t.prevContext = t.nextBase = null, t._dirty = !1, !T) {
      w = t.render(i, s, a), t.getChildContext && (a = Ct(Ct({}, a), t.getChildContext())), p && t.getSnapshotBeforeUpdate && (c = t.getSnapshotBeforeUpdate(l, u));
      var b = w && w.nodeName, x, C;
      if (typeof b == "function") {
        var E = Jo(w);
        z = m, z && z.constructor === b && E.key == z.__key ? Tr(z, E, 1, a, !1) : (x = z, t._component = z = rl(b, E, a), z.nextBase = z.nextBase || g, z._parentComponent = t, Tr(z, E, 0, a, !1), Wr(z, 1, n, !0)), C = z.base;
      } else
        P = _, x = m, x && (P = t._component = null), (_ || e === 1) && (P && (P._component = null), C = el(P, w, a, n || !p, _ && _.parentNode, !0));
      if (_ && C !== _ && z !== m) {
        var M = _.parentNode;
        M && C !== M && (M.replaceChild(C, _), x || (_._component = null, Wt(_, !1)));
      }
      if (x && qr(x), t.base = C, C && !r) {
        for (var D = t, $ = t; $ = $._parentComponent; )
          (D = $).base = C;
        C._component = D, C._componentConstructor = D.constructor;
      }
    }
    for (!p || n ? Qo.push(t) : T || (t.componentDidUpdate && t.componentDidUpdate(l, u, c), ot.afterUpdate && ot.afterUpdate(t)); t._renderCallbacks.length; )
      t._renderCallbacks.pop().call(t);
    !Vi && !r && jo();
  }
}
function ng(t, e, n, r) {
  for (var i = t && t._component, s = i, a = t, l = i && t._componentConstructor === e.nodeName, u = l, f = Jo(e); i && !u && (i = i._parentComponent); )
    u = i.constructor === e.nodeName;
  return i && u && (!r || i._component) ? (Tr(i, f, 3, n, r), t = i.base) : (s && !l && (qr(s), t = a = null), i = rl(e.nodeName, f, n), t && !i.nextBase && (i.nextBase = t, a = null), Tr(i, f, 1, n, r), t = i.base, a && t !== a && (a._component = null, Wt(a, !1))), t;
}
function qr(t) {
  ot.beforeUnmount && ot.beforeUnmount(t);
  var e = t.base;
  t._disable = !0, t.componentWillUnmount && t.componentWillUnmount(), t.base = null;
  var n = t._component;
  n ? qr(n) : e && (e.__preactattr_ != null && gn(e.__preactattr_.ref, null), t.nextBase = e, vs(e), Pn.push(t), nl(e)), gn(t.__ref, null);
}
function je(t, e) {
  this._dirty = !0, this.context = e, this.props = t, this.state = this.state || {}, this._renderCallbacks = [];
}
Ct(je.prototype, {
  setState: function(e, n) {
    this.prevState || (this.prevState = this.state), this.state = Ct(Ct({}, this.state), typeof e == "function" ? e(this.state, this.props) : e), n && this._renderCallbacks.push(n), Ko(this);
  },
  forceUpdate: function(e) {
    e && this._renderCallbacks.push(e), Wr(this, 2);
  },
  render: function() {
  }
});
function rg(t, e, n) {
  return el(n, t, {}, !1, e, !1);
}
class ig extends je {
  constructor(e) {
    super(e), this.state = {};
  }
  componentDidMount() {
    this.props.connectSetStateFn((e) => this.setState(e));
  }
  is_visible() {
    return this.state.display;
  }
  render() {
    return this.state.display ? /* @__PURE__ */ k(
      this.props.component,
      {
        setDisplay: (e) => this.setState({ display: e }),
        ref: this.props.refPassthrough,
        ...this.state
      }
    ) : null;
  }
}
function Fn(t, e, n, r, i = null) {
  rg(
    /* @__PURE__ */ k(
      ig,
      {
        component: t,
        connectSetStateFn: n,
        ref: e,
        refPassthrough: i
      }
    ),
    r,
    // If there is already a div, re-render it. Otherwise make a new one
    r.children.length > 0 ? r.firstChild : void 0
  );
}
class za extends je {
  constructor(e) {
    super(e), this.setWrapperRef = this.setWrapperRef.bind(this), this.handleClickOutside = this.handleClickOutside.bind(this), this.state = {
      visible: !1
    };
  }
  componentDidMount() {
    document.addEventListener("mouseup", this.handleClickOutside);
  }
  // Reference for hiding the menu when a mouse event happens outside
  setWrapperRef(e) {
    this.wrapperRef = e;
  }
  handleClickOutside(e) {
    this.wrapperRef && !this.wrapperRef.contains(e.target) && this.setState({ visible: !1 });
  }
  render() {
    return /* @__PURE__ */ k("div", { className: "selector" }, /* @__PURE__ */ k(
      "div",
      {
        className: [
          "selectorTitle",
          this.props.disabled ? "disabled" : ""
        ].join(" "),
        ref: this.setWrapperRef,
        onClick: () => {
          this.props.disabled || this.setState({ visible: !this.state.visible });
        }
      },
      "Preset Scale Selections",
      /* @__PURE__ */ k("i", { className: "icon-sort-down" })
    ), /* @__PURE__ */ k(
      "div",
      {
        className: "selectorMenu",
        style: this.state.visible ? { display: "block" } : { display: "none" }
      },
      this.props.children.map((e) => e)
    ));
  }
}
class ir extends je {
  setUpDrag() {
    if (Pe(this.base).select(".pickerBox").on("mousedown.drag", null), !this.props.disabled) {
      const e = ut().on("start", () => {
        this.props.focus && this.props.focus();
      }).on("drag", () => {
        this.props.type !== "value" && this.props.onChange && this.props.onChange("type", "value");
        const n = this.props.value + ie.dx / this.props.trackWidth * (this.props.max - this.props.min), r = Math.max(
          this.props.min,
          Math.min(
            this.props.max,
            n
          )
        );
        this.props.onChange("value", r);
      }).container(() => this.base.parentNode.parentNode);
      Pe(this.base).select(".pickerBox").call(e);
    }
  }
  componentDidUpdate() {
    this.setUpDrag();
  }
  componentDidMount() {
    this.setUpDrag();
  }
  render() {
    return /* @__PURE__ */ k(
      "div",
      {
        className: "picker",
        style: {
          left: `${this.props.location * this.props.trackWidth}px`,
          zIndex: this.props.zIndex
        }
      },
      this.props.showTrash && /* @__PURE__ */ k("div", { className: "trashDiv" }, /* @__PURE__ */ k(
        "i",
        {
          className: "icon-trash-empty",
          "aria-hidden": "true",
          onClick: () => {
            this.props.remove && this.props.remove();
          }
        }
      )),
      /* @__PURE__ */ k(
        "div",
        {
          className: "pickerBox",
          onClick: () => {
            this.props.focus && this.props.focus();
          }
        }
      ),
      /* @__PURE__ */ k(
        "div",
        {
          className: [
            "pickerOptions",
            this.props.location > 0.8 ? "rightOptions" : ""
          ].join(" ")
        },
        /* @__PURE__ */ k(
          "input",
          {
            type: "text",
            className: "option",
            value: this.props.disabled ? "" : this.props.type === "value" ? parseFloat(this.props.value.toFixed(2)) : `${this.props.type} (${parseFloat(this.props.value.toFixed(2))})`,
            disabled: this.props.disabled,
            onInput: (e) => {
              const n = parseFloat(e.target.value);
              isNaN(n) || this.props.onChange("value", n);
            },
            onFocus: (e) => {
              e.target.select(), this.props.focus && this.props.focus();
            }
          }
        ),
        /* @__PURE__ */ k(
          "select",
          {
            className: "typePicker",
            value: this.props.type,
            onChange: (e) => {
              this.props.onChange && this.props.onChange("type", e.target.value);
            },
            disabled: this.props.disabled,
            onFocus: (e) => {
              this.props.focus && this.props.focus();
            }
          },
          /* @__PURE__ */ k("option", { value: "value" }, "Value"),
          /* @__PURE__ */ k("option", { value: "min" }, "Min"),
          /* @__PURE__ */ k("option", { value: "mean" }, "Mean"),
          /* @__PURE__ */ k("option", { value: "Q1" }, "Q1"),
          /* @__PURE__ */ k("option", { value: "median" }, "Median"),
          /* @__PURE__ */ k("option", { value: "Q3" }, "Q3"),
          /* @__PURE__ */ k("option", { value: "max" }, "Max")
        ),
        /* @__PURE__ */ k("div", { className: "colorOptions" }, /* @__PURE__ */ k(
          "input",
          {
            type: "text",
            className: "colorText",
            onInput: (e) => {
              this.props.onChange && this.props.onChange("color", e.target.value);
            },
            onFocus: (e) => {
              e.target.select(), this.props.focus && this.props.focus();
            },
            value: this.props.color || "",
            disabled: this.props.disabled
          }
        ), /* @__PURE__ */ k(
          "input",
          {
            type: "color",
            className: "colorWheel",
            onInput: (e) => {
              this.props.onChange && this.props.onChange("color", e.target.value);
            },
            onFocus: (e) => {
              e.target.select(), this.props.focus && this.props.focus();
            },
            value: this.props.color || "",
            disabled: this.props.disabled
          }
        )),
        /* @__PURE__ */ k(
          "input",
          {
            type: "text",
            className: "option",
            onInput: (e) => {
              this.props.onChange && this.props.onChange("size", parseInt(e.target.value));
            },
            onFocus: (e) => {
              e.target.select(), this.props.focus && this.props.focus();
            },
            value: this.props.size,
            disabled: this.props.disabled
          }
        )
      )
    );
  }
}
var An = { exports: {} }, Si, Na;
function sg() {
  if (Na) return Si;
  Na = 1;
  var t = function(e, n, r, i, s, a, l, u) {
    if (process.env.NODE_ENV !== "production" && n === void 0)
      throw new Error("invariant requires an error message argument");
    if (!e) {
      var f;
      if (n === void 0)
        f = new Error(
          "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
        );
      else {
        var p = [r, i, s, a, l, u], g = 0;
        f = new Error(
          n.replace(/%s/g, function() {
            return p[g++];
          })
        ), f.name = "Invariant Violation";
      }
      throw f.framesToPop = 1, f;
    }
  };
  return Si = t, Si;
}
var Da;
function ag() {
  if (Da) return An.exports;
  Da = 1;
  var t = sg(), e = Object.prototype.hasOwnProperty, n = Array.prototype.splice, r = Object.prototype.toString, i = function(b) {
    return r.call(b).slice(8, -1);
  }, s = Object.assign || /* istanbul ignore next */
  function(x, C) {
    return a(C).forEach(function(E) {
      e.call(C, E) && (x[E] = C[E]);
    }), x;
  }, a = typeof Object.getOwnPropertySymbols == "function" ? function(b) {
    return Object.keys(b).concat(Object.getOwnPropertySymbols(b));
  } : (
    /* istanbul ignore next */
    function(b) {
      return Object.keys(b);
    }
  );
  function l(b) {
    if (Array.isArray(b))
      return s(b.constructor(b.length), b);
    if (i(b) === "Map")
      return new Map(b);
    if (i(b) === "Set")
      return new Set(b);
    if (b && typeof b == "object") {
      var x = Object.getPrototypeOf(b);
      return s(Object.create(x), b);
    } else
      return b;
  }
  function u() {
    var b = s({}, f);
    return x.extend = function(C, E) {
      b[C] = E;
    }, x.isEquals = function(C, E) {
      return C === E;
    }, x;
    function x(C, E) {
      typeof E == "function" && (E = { $apply: E }), Array.isArray(C) && Array.isArray(E) || t(
        !Array.isArray(E),
        "update(): You provided an invalid spec to update(). The spec may not contain an array except as the value of $set, $push, $unshift, $splice or any custom command allowing an array value."
      ), t(
        typeof E == "object" && E !== null,
        "update(): You provided an invalid spec to update(). The spec and every included key path must be plain objects containing one of the following commands: %s.",
        Object.keys(b).join(", ")
      );
      var M = C;
      return a(E).forEach(function(D) {
        if (e.call(b, D)) {
          var $ = C === M;
          M = b[D](E[D], M, E, C), $ && x.isEquals(M, C) && (M = C);
        } else {
          var G = i(C) === "Map" ? x(C.get(D), E[D]) : x(C[D], E[D]), U = i(M) === "Map" ? M.get(D) : M[D];
          (!x.isEquals(G, U) || typeof G > "u" && !e.call(C, D)) && (M === C && (M = l(C)), i(M) === "Map" ? M.set(D, G) : M[D] = G);
        }
      }), M;
    }
  }
  var f = {
    $push: function(b, x, C) {
      return g(x, C, "$push"), b.length ? x.concat(b) : x;
    },
    $unshift: function(b, x, C) {
      return g(x, C, "$unshift"), b.length ? b.concat(x) : x;
    },
    $splice: function(b, x, C, E) {
      return m(x, C), b.forEach(function(M) {
        T(M), x === E && M.length && (x = l(E)), n.apply(x, M);
      }), x;
    },
    $set: function(b, x, C) {
      return w(C), b;
    },
    $toggle: function(b, x) {
      _(b, "$toggle");
      var C = b.length ? l(x) : x;
      return b.forEach(function(E) {
        C[E] = !x[E];
      }), C;
    },
    $unset: function(b, x, C, E) {
      return _(b, "$unset"), b.forEach(function(M) {
        Object.hasOwnProperty.call(x, M) && (x === E && (x = l(E)), delete x[M]);
      }), x;
    },
    $add: function(b, x, C, E) {
      return P(x, "$add"), _(b, "$add"), i(x) === "Map" ? b.forEach(function(M) {
        var D = M[0], $ = M[1];
        x === E && x.get(D) !== $ && (x = l(E)), x.set(D, $);
      }) : b.forEach(function(M) {
        x === E && !x.has(M) && (x = l(E)), x.add(M);
      }), x;
    },
    $remove: function(b, x, C, E) {
      return P(x, "$remove"), _(b, "$remove"), b.forEach(function(M) {
        x === E && x.has(M) && (x = l(E)), x.delete(M);
      }), x;
    },
    $merge: function(b, x, C, E) {
      return z(x, b), a(b).forEach(function(M) {
        b[M] !== x[M] && (x === E && (x = l(E)), x[M] = b[M]);
      }), x;
    },
    $apply: function(b, x) {
      return c(b), b(x);
    }
  }, p = u();
  An.exports = p, An.exports.default = p, An.exports.newContext = u;
  function g(b, x, C) {
    t(
      Array.isArray(b),
      "update(): expected target of %s to be an array; got %s.",
      C,
      b
    ), _(x[C], C);
  }
  function _(b, x) {
    t(
      Array.isArray(b),
      "update(): expected spec of %s to be an array; got %s. Did you forget to wrap your parameter in an array?",
      x,
      b
    );
  }
  function m(b, x) {
    t(
      Array.isArray(b),
      "Expected $splice target to be an array; got %s",
      b
    ), T(x.$splice);
  }
  function T(b) {
    t(
      Array.isArray(b),
      "update(): expected spec of $splice to be an array of arrays; got %s. Did you forget to wrap your parameters in an array?",
      b
    );
  }
  function c(b) {
    t(
      typeof b == "function",
      "update(): expected spec of $apply to be a function; got %s.",
      b
    );
  }
  function w(b) {
    t(
      Object.keys(b).length === 1,
      "Cannot have more than one key in an object with $set"
    );
  }
  function z(b, x) {
    t(
      x && typeof x == "object",
      "update(): $merge expects a spec of type 'object'; got %s",
      x
    ), t(
      b && typeof b == "object",
      "update(): $merge expects a target of type 'object'; got %s",
      b
    );
  }
  function P(b, x) {
    var C = i(b);
    t(
      C === "Map" || C === "Set",
      "update(): %s expects a target of type Set or Map; got %s",
      x,
      C
    );
  }
  return An.exports;
}
var og = ag();
const Qt = /* @__PURE__ */ Tt(og), jt = 400;
class Aa extends je {
  /**
   * Sorts the color scale for makeGradient
   */
  sortScale() {
    return ce.sortBy(this.props.scale, (n) => n.type === "value" ? n.value : this.props.stats[n.type]);
  }
  /**
   * Places the pickers as a percentage of the max
   */
  placePickers() {
    const e = this.props.stats, [n, r] = this.props.scale.reduce(
      ([s, a], l) => l.type === "value" ? [Math.min(l.value, s), Math.max(l.value, a)] : [s, a],
      [e.min, e.max]
    );
    return { pickerLocations: this.props.scale.map((s) => ((s.type === "value" ? s.value : e[s.type]) - n) / (r - n)), absoluteMax: r, absoluteMin: n };
  }
  /**
   * Function enabling modification of any color scale attribute
   * @param {number} index - index of the scale object to be modified
   * @param {string} parameter - the parameter to be replaced
   * @param {(number|string)} value - the new value of the parameter
   */
  scaleChange(e, n, r) {
    let i = null;
    n === "type" && r !== "value" ? (i = Qt(this.props.scale, {
      [e]: {
        [n]: { $set: r },
        $unset: ["value"]
      }
    }), this.props.onChange(i)) : n === "value" && this.props.scale[e].type !== "value" ? (i = Qt(this.props.scale, {
      [e]: {
        [n]: { $set: r },
        type: { $set: "value" }
      }
    }), this.props.onChange(i)) : r === "value" ? (i = Qt(this.props.scale, {
      [e]: {
        [n]: { $set: r },
        $merge: { value: this.props.stats[this.props.scale[e].type] }
      }
    }), this.props.onChange(i)) : (!isNaN(parseFloat(r)) || r[0] === "#" && n === "color") && (i = Qt(this.props.scale, {
      [e]: {
        [n]: { $set: r }
      }
    }), this.props.onChange(i));
  }
  addColorStop(e) {
    const n = Qt(this.props.scale, {
      $push: [{
        type: "value",
        value: e.layerX / e.target.clientWidth * this.props.stats.max + (1 - e.layerX / e.target.clientWidth) * this.props.stats.min,
        color: "#9696ff",
        size: 20
      }]
    });
    this.props.onChange(n);
  }
  /**
   * Sorts and then returns a string that can be fed into the HTML linear-gradient style
   */
  makeGradient(e, n) {
    const r = this.sortScale();
    return (r.length < 2 ? [{ type: "min", color: "#f1ecfa" }, { type: "max", color: "#f1ecfa" }] : r).map((s) => {
      const a = s.type === "value" ? s.value : this.props.stats[s.type];
      return ` ${s.color} ${(a - e) / (n - e) * 100}%`;
    }).toString();
  }
  removeColorStop(e) {
    const n = Qt(this.props.scale, { $splice: [[[e], 1]] });
    this.props.onChange(n);
  }
  render() {
    if (!this.props.stats)
      return /* @__PURE__ */ k("div", { className: "scaleEditor" }, /* @__PURE__ */ k("div", null, /* @__PURE__ */ k(
        "div",
        {
          className: "scaleTrack disabled",
          style: { width: jt }
        },
        this.props.type,
        " data not loaded",
        /* @__PURE__ */ k(ir, { location: 0, trackWidth: jt, disabled: !0 }),
        /* @__PURE__ */ k(ir, { location: 1, trackWidth: jt, disabled: !0 })
      )), /* @__PURE__ */ k("div", { className: "scaleLabels" }, /* @__PURE__ */ k("label", null, "Value:"), /* @__PURE__ */ k("label", null, "Color:"), /* @__PURE__ */ k("label", null, "Size:")), /* @__PURE__ */ k("div", { className: "noDataStyle" }, /* @__PURE__ */ k("label", { className: "styleHeader" }, "Styles for reactions with no data"), /* @__PURE__ */ k("br", null), /* @__PURE__ */ k("label", null, "Color:"), /* @__PURE__ */ k("input", { type: "text", className: "colorInput", disabled: !0 }), /* @__PURE__ */ k("input", { type: "color", className: "colorWheel", disabled: !0 }), /* @__PURE__ */ k("label", null, "Size:"), /* @__PURE__ */ k("input", { type: "text", className: "sizeInput", disabled: !0 })));
    const {
      pickerLocations: e,
      absoluteMax: n,
      absoluteMin: r
    } = this.placePickers(), i = this.props.scale.map((s, a) => {
      if (s.type !== "value")
        return /* @__PURE__ */ k(
          ir,
          {
            trackWidth: jt,
            type: s.type,
            location: e[a],
            onChange: (l, u) => this.scaleChange(a, l, u),
            focus: () => this.setState({ focusedPicker: a }),
            remove: () => this.removeColorStop(a),
            min: r,
            max: n,
            value: this.props.stats[s.type],
            color: s.color,
            size: s.size,
            zIndex: this.state.focusedPicker === a ? "2" : "0",
            showTrash: this.props.scale.length >= 3
          }
        );
      if (s.value != null)
        return /* @__PURE__ */ k(
          ir,
          {
            trackWidth: jt,
            type: s.type,
            location: e[a],
            onChange: (l, u) => this.scaleChange(a, l, u),
            focus: () => this.setState({ focusedPicker: a }),
            remove: () => this.removeColorStop(a),
            min: r,
            max: n,
            value: s.value,
            color: s.color,
            size: s.size,
            zIndex: this.state.focusedPicker === a ? "2" : "0",
            showTrash: this.props.scale.length >= 3
          }
        );
    });
    return /* @__PURE__ */ k("div", { className: "scaleEditor" }, /* @__PURE__ */ k("div", null, /* @__PURE__ */ k("i", { className: "settingsTip" }, "To add a color stop to the scale, click the gradient"), /* @__PURE__ */ k(
      "div",
      {
        className: "scaleTrack",
        style: { width: jt }
      },
      /* @__PURE__ */ k(
        "div",
        {
          className: "gradient",
          onClick: (s) => this.addColorStop(s),
          style: {
            background: `linear-gradient(to right,${this.makeGradient(r, n)})`
          }
        }
      ),
      i
    )), /* @__PURE__ */ k("div", { className: "scaleLabels" }, /* @__PURE__ */ k("label", null, "Value:"), /* @__PURE__ */ k("label", null, "Color:"), /* @__PURE__ */ k("label", null, "Size:")), /* @__PURE__ */ k("div", { className: "noDataStyle" }, /* @__PURE__ */ k("label", { className: "styleHeader" }, "Styles for reactions with no data"), /* @__PURE__ */ k("br", null), /* @__PURE__ */ k("label", null, "Color:"), /* @__PURE__ */ k(
      "input",
      {
        type: "text",
        className: "colorInput",
        value: this.props.noDataColor,
        onInput: (s) => this.props.onNoDataColorChange(s.target.value)
      }
    ), /* @__PURE__ */ k(
      "input",
      {
        type: "color",
        className: "colorWheel",
        value: this.props.noDataColor,
        onInput: (s) => this.props.onNoDataColorChange(s.target.value)
      }
    ), /* @__PURE__ */ k("label", null, "Size:"), /* @__PURE__ */ k(
      "input",
      {
        type: "text",
        className: "sizeInput",
        value: this.props.noDataSize,
        onInput: (s) => this.props.onNoDataSizeChange(parseFloat(s.target.value))
      }
    )));
  }
}
class Ia extends je {
  constructor(e) {
    super(e);
    const n = [];
    if (e.scale)
      for (let r = 0; r < e.scale.length; r++)
        n.push(e.scale[r].color);
    this.state = {
      colors: n
    };
  }
  render() {
    return /* @__PURE__ */ k("div", { className: "scaleSelection", onClick: () => this.props.onClick() }, /* @__PURE__ */ k("div", null, this.props.name), /* @__PURE__ */ k("div", { className: "scaleColors" }, this.state.colors.map((e) => /* @__PURE__ */ k("i", { className: "icon-blank", style: { color: e } }))));
  }
}
class lg extends je {
  componentWillMount() {
    this.props.settings.holdChanges(), this.setState({
      clearEscape: this.props.map.key_manager.addEscapeListener(
        () => this.abandonChanges(),
        !0
      ),
      clearEnter: this.props.map.key_manager.addKeyListener(
        ["enter"],
        () => this.saveChanges(),
        !0
      )
    });
  }
  componentWillUnmount() {
    this.state.clearEscape(), this.state.clearEnter();
  }
  abandonChanges() {
    this.props.settings.abandonChanges(), this.props.setDisplay(!1);
  }
  saveChanges() {
    this.props.settings.acceptChanges(), this.props.setDisplay(!1);
  }
  /**
   * Function to toggle one option in the reaction or metabolite styling.
   * @param {String} value - the style option to be added or removed
   * @param {String} type - reaction_style or metabolite_style
   */
  handleStyle(e, n) {
    const r = this.props.settings.get(n), i = r.indexOf(e);
    i === -1 ? this.props.settings.set(n, [...r, e]) : this.props.settings.set(n, [
      ...r.slice(0, i),
      ...r.slice(i + 1)
    ]);
  }
  render() {
    const e = this.props.settings, n = e.get("enable_tooltips") || [], r = this.props.map.get_data_statistics();
    return /* @__PURE__ */ k("div", { className: "settingsBackground" }, /* @__PURE__ */ k("div", { className: "settingsBoxContainer" }, /* @__PURE__ */ k("button", { className: "discardChanges btn", onClick: () => this.abandonChanges() }, /* @__PURE__ */ k("i", { className: "icon-cancel", "aria-hidden": "true" })), /* @__PURE__ */ k("button", { className: "saveChanges btn", onClick: () => this.saveChanges() }, /* @__PURE__ */ k("i", { className: "icon-ok", "aria-hidden": "true" })), /* @__PURE__ */ k("div", { className: "settingsBox" }, /* @__PURE__ */ k("div", { className: "settingsTip" }, /* @__PURE__ */ k("i", null, "Tip: Hover over an option to see more details about it.")), /* @__PURE__ */ k("hr", null), /* @__PURE__ */ k("div", { className: "title" }, "View and build options"), /* @__PURE__ */ k("div", { className: "settingsContainer" }, /* @__PURE__ */ k("table", { className: "radioSelection" }, /* @__PURE__ */ k("tr", { title: "The identifiers that are show in the reaction, gene, and metabolite labels on the map." }, /* @__PURE__ */ k("td", { className: "optionLabel" }, "Identifiers:"), /* @__PURE__ */ k("td", { className: "singleLine" }, /* @__PURE__ */ k("label", { className: "optionGroup" }, /* @__PURE__ */ k(
      "input",
      {
        type: "radio",
        name: "identifiers",
        onClick: () => {
          e.set("identifiers_on_map", "bigg_id");
        },
        checked: e.get("identifiers_on_map") === "bigg_id"
      }
    ), "ID's"), /* @__PURE__ */ k("label", { className: "optionGroup" }, /* @__PURE__ */ k(
      "input",
      {
        type: "radio",
        name: "identifiers",
        onClick: () => {
          e.set("identifiers_on_map", "name");
        },
        checked: e.get("identifiers_on_map") === "name"
      }
    ), "Descriptive names")))), /* @__PURE__ */ k("label", { title: "If checked, then the scroll wheel and trackpad will control zoom rather than pan." }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        onClick: () => {
          e.get("scroll_behavior") === "zoom" ? e.set("scroll_behavior", "pan") : e.set("scroll_behavior", "zoom");
        },
        checked: e.get("scroll_behavior") === "zoom"
      }
    ), "Scroll to zoom (instead of scroll to pan)"), /* @__PURE__ */ k("label", { title: "If checked, then only the primary metabolites will be displayed." }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        onClick: () => e.set(
          "hide_secondary_metabolites",
          !e.get("hide_secondary_metabolites")
        ),
        checked: e.get("hide_secondary_metabolites")
      }
    ), "Hide secondary metabolites"), /* @__PURE__ */ k(
      "label",
      {
        title: "If checked, then gene reaction rules will be displayed below each reaction label. (Gene reaction rules are always shown when gene data is loaded.)"
      },
      /* @__PURE__ */ k(
        "input",
        {
          type: "checkbox",
          onClick: () => e.set(
            "show_gene_reaction_rules",
            !e.get("show_gene_reaction_rules")
          ),
          checked: e.get("show_gene_reaction_rules")
        }
      ),
      "Show gene reaction rules"
    ), /* @__PURE__ */ k("label", { title: "If checked, hide all reaction, gene, and metabolite labels" }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        onClick: () => e.set(
          "hide_all_labels",
          !e.get("hide_all_labels")
        ),
        checked: e.get("hide_all_labels")
      }
    ), "Hide reaction, gene, and metabolite labels"), /* @__PURE__ */ k("label", { title: "If checked, then allow duplicate reactions during model building." }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        onClick: () => e.set(
          "allow_building_duplicate_reactions",
          !e.get("allow_building_duplicate_reactions")
        ),
        checked: e.get("allow_building_duplicate_reactions")
      }
    ), "Allow duplicate reactions"), /* @__PURE__ */ k("label", { title: "If checked, then highlight in red all the reactions on the map that are not present in the loaded model." }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        onClick: () => {
          e.set(
            "highlight_missing",
            !e.get("highlight_missing")
          );
        },
        checked: e.get("highlight_missing")
      }
    ), "Highlight reactions not in model"), /* @__PURE__ */ k("label", { title: "If true, then use CSS3 3D transforms to speed up panning and zooming." }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        onClick: () => {
          e.set(
            "use_3d_transform",
            !e.get("use_3d_transform")
          );
        },
        checked: e.get("use_3d_transform")
      }
    ), "Use 3D transform for responsive panning and zooming"), /* @__PURE__ */ k("table", { style: { marginTop: "5px" } }, /* @__PURE__ */ k("tr", { title: "Determines over which elements tooltips will display for reactions, metabolites, and genes" }, /* @__PURE__ */ k("td", null, "Show tooltips over:"), /* @__PURE__ */ k("td", { className: "singleLine" }, /* @__PURE__ */ k("label", { className: "tooltipOption", title: "If checked, tooltips will display over the gene, reaction, and metabolite labels" }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        onClick: () => {
          const i = "label", s = ce.contains(n, i) ? ce.filter(n, (a) => a !== i) : [...n, i];
          e.set("enable_tooltips", s);
        },
        checked: ce.contains(n, "label")
      }
    ), "Labels"), /* @__PURE__ */ k("label", { className: "tooltipOption", title: "If checked, tooltips will display over the reaction line segments and metabolite circles" }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        onClick: () => {
          const i = "object", s = ce.contains(n, i) ? ce.filter(n, (a) => a !== i) : [...n, i];
          e.set("enable_tooltips", s);
        },
        checked: ce.contains(n, "object")
      }
    ), "Objects"))))), /* @__PURE__ */ k("div", { className: "settingsTip", style: { marginTop: "16px" } }, /* @__PURE__ */ k("i", null, "Tip: To increase map performance, turn off text boxes (i.e. labels and gene reaction rules).")), /* @__PURE__ */ k("hr", null), /* @__PURE__ */ k("div", { className: "scaleTitle" }, /* @__PURE__ */ k("div", { className: "title" }, "Reactions"), /* @__PURE__ */ k(za, { disabled: r.reaction === null }, Object.values(ce.mapObject(rn, (i, s) => /* @__PURE__ */ k(
      Ia,
      {
        name: s,
        scale: i,
        onClick: () => {
          e.set("reaction_scale_preset", s);
        }
      }
    ))))), /* @__PURE__ */ k(
      Aa,
      {
        scale: e.get("reaction_scale"),
        settings: e,
        type: "Reaction",
        stats: r.reaction,
        noDataColor: e.get("reaction_no_data_color"),
        noDataSize: e.get("reaction_no_data_size"),
        onChange: (i) => {
          e.set("reaction_scale", i);
        },
        onNoDataColorChange: (i) => {
          e.set("reaction_no_data_color", i);
        },
        onNoDataSizeChange: (i) => {
          e.set("reaction_no_data_size", i);
        },
        abs: e.get("reaction_styles").indexOf("abs") > -1
      }
    ), /* @__PURE__ */ k("div", { className: "subheading" }, "Reaction or Gene data"), /* @__PURE__ */ k("table", { className: "radioSelection" }, /* @__PURE__ */ k("tr", null, /* @__PURE__ */ k(
      "td",
      {
        className: "optionLabel",
        title: "Options for reactions data"
      },
      "Options:"
    ), /* @__PURE__ */ k("td", null, /* @__PURE__ */ k(
      "label",
      {
        className: "optionGroup",
        title: "If checked, use the absolute value when calculating colors and sizes of reactions on the map"
      },
      /* @__PURE__ */ k(
        "input",
        {
          type: "checkbox",
          name: "reactionStyle",
          onClick: () => this.handleStyle("abs", "reaction_styles"),
          checked: ce.contains(e.get("reaction_styles"), "abs"),
          disabled: r.reaction === null
        }
      ),
      "Absolute value"
    ), /* @__PURE__ */ k(
      "label",
      {
        className: "optionGroup",
        title: "If checked, then size the thickness of reaction lines according to the value of the reaction data"
      },
      /* @__PURE__ */ k(
        "input",
        {
          type: "checkbox",
          name: "reactionStyle",
          onClick: () => this.handleStyle("size", "reaction_styles"),
          checked: ce.contains(e.get("reaction_styles"), "size"),
          disabled: r.reaction === null
        }
      ),
      "Size"
    ), /* @__PURE__ */ k("label", { className: "optionGroup", title: "If checked, then color the reaction lines according to the value of the reaction data" }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        name: "reactionStyle",
        onClick: () => this.handleStyle("color", "reaction_styles"),
        checked: ce.contains(e.get("reaction_styles"), "color"),
        disabled: r.reaction === null
      }
    ), "Color"), /* @__PURE__ */ k("br", null), /* @__PURE__ */ k("label", { className: "optionGroup", title: "If checked, then show data values in the reaction labels" }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        name: "reactionStyle",
        onClick: () => this.handleStyle("text", "reaction_styles"),
        checked: ce.contains(e.get("reaction_styles"), "text"),
        disabled: r.reaction === null
      }
    ), "Text (Show data in label)"))), /* @__PURE__ */ k("tr", { title: "The function that will be used to compare datasets, when paired data is loaded" }, /* @__PURE__ */ k("td", { className: "optionLabel" }, "Comparison:"), /* @__PURE__ */ k("td", null, /* @__PURE__ */ k("label", { className: "optionGroup" }, /* @__PURE__ */ k(
      "input",
      {
        type: "radio",
        name: "reactionCompare",
        onClick: () => e.set("reaction_compare_style", "fold"),
        checked: e.get("reaction_compare_style") === "fold",
        disabled: r.reaction === null
      }
    ), "Fold Change"), /* @__PURE__ */ k("label", { className: "optionGroup" }, /* @__PURE__ */ k(
      "input",
      {
        type: "radio",
        name: "reactionCompare",
        onClick: () => e.set("reaction_compare_style", "log2_fold"),
        checked: e.get("reaction_compare_style") === "log2_fold",
        disabled: r.reaction === null
      }
    ), "Log2 (Fold Change)"), /* @__PURE__ */ k("label", { className: "optionGroup" }, /* @__PURE__ */ k(
      "input",
      {
        type: "radio",
        name: "reactionCompare",
        onClick: () => e.set("reaction_compare_style", "diff"),
        checked: e.get("reaction_compare_style") === "diff",
        disabled: r.reaction === null
      }
    ), "Difference")))), /* @__PURE__ */ k("table", { className: "radioSelection" }, /* @__PURE__ */ k(
      "tr",
      {
        title: "The function that will be used to evaluate AND connections in gene reaction rules (AND connections generally connect components of an enzyme complex)"
      },
      /* @__PURE__ */ k("td", { className: "optionLabelWide" }, "Method for evaluating AND:"),
      /* @__PURE__ */ k("td", null, /* @__PURE__ */ k("label", { className: "optionGroup" }, /* @__PURE__ */ k(
        "input",
        {
          type: "radio",
          name: "andMethod",
          onClick: () => e.set("and_method_in_gene_reaction_rule", "mean"),
          checked: e.get("and_method_in_gene_reaction_rule") === "mean",
          disabled: r.reaction === null
        }
      ), "Mean"), /* @__PURE__ */ k("label", { className: "optionGroup" }, /* @__PURE__ */ k(
        "input",
        {
          type: "radio",
          name: "andMethod",
          onClick: () => e.set("and_method_in_gene_reaction_rule", "min"),
          checked: e.get("and_method_in_gene_reaction_rule") === "min",
          disabled: r.reaction === null
        }
      ), "Min"))
    )), /* @__PURE__ */ k("hr", null), /* @__PURE__ */ k("div", { className: "scaleTitle" }, /* @__PURE__ */ k("div", { className: "title" }, "Metabolites"), /* @__PURE__ */ k(za, { disabled: r.metabolite === null }, Object.values(ce.mapObject(rn, (i, s) => /* @__PURE__ */ k(
      Ia,
      {
        name: s,
        scale: i,
        onClick: () => e.set("metabolite_scale", i)
      }
    ))))), /* @__PURE__ */ k(
      Aa,
      {
        scale: e.get("metabolite_scale"),
        settings: e,
        type: "Metabolite",
        stats: r.metabolite,
        noDataColor: e.get("metabolite_no_data_color"),
        noDataSize: e.get("metabolite_no_data_size"),
        onChange: (i) => {
          e.set("metabolite_scale", i);
        },
        onNoDataColorChange: (i) => {
          e.set("metabolite_no_data_color", i);
        },
        onNoDataSizeChange: (i) => {
          e.set("metabolite_no_data_size", i);
        },
        abs: ce.contains(e.get("metabolite_styles"), "abs")
      }
    ), /* @__PURE__ */ k("div", { className: "subheading" }, "Metabolite data"), /* @__PURE__ */ k("table", { className: "radioSelection" }, /* @__PURE__ */ k("tr", null, /* @__PURE__ */ k(
      "td",
      {
        className: "optionLabel",
        title: "Options for metabolite data"
      },
      "Options:"
    ), /* @__PURE__ */ k("td", null, /* @__PURE__ */ k(
      "label",
      {
        className: "optionGroup",
        title: "If checked, use the absolute value when calculating colors and sizes of metabolites on the map"
      },
      /* @__PURE__ */ k(
        "input",
        {
          type: "checkbox",
          name: "metaboliteStyle",
          onClick: () => this.handleStyle("abs", "metabolite_styles"),
          checked: ce.contains(e.get("metabolite_styles"), "abs"),
          disabled: r.metabolite === null
        }
      ),
      "Absolute value"
    ), /* @__PURE__ */ k(
      "label",
      {
        className: "optionGroup",
        title: "If checked, then size the thickness of reaction lines according to the value of the metabolite data"
      },
      /* @__PURE__ */ k(
        "input",
        {
          type: "checkbox",
          name: "metaboliteStyle",
          onClick: () => this.handleStyle("size", "metabolite_styles"),
          checked: ce.contains(e.get("metabolite_styles"), "size"),
          disabled: r.metabolite === null
        }
      ),
      "Size"
    ), /* @__PURE__ */ k("label", { className: "optionGroup", title: "If checked, then color the reaction lines according to the value of the metabolite data" }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        name: "metaboliteStyle",
        onClick: () => this.handleStyle("color", "metabolite_styles"),
        checked: ce.contains(e.get("metabolite_styles"), "color"),
        disabled: r.metabolite === null
      }
    ), "Color"), /* @__PURE__ */ k("br", null), /* @__PURE__ */ k("label", { className: "optionGroup", title: "If checked, then show data values in the metabolite labels" }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        name: "metaboliteStyle",
        onClick: () => this.handleStyle("text", "metabolite_styles"),
        checked: ce.contains(e.get("metabolite_styles"), "text"),
        disabled: r.metabolite === null
      }
    ), "Text (Show data in label)"))), /* @__PURE__ */ k("tr", { title: "The function that will be used to compare datasets, when paired data is loaded" }, /* @__PURE__ */ k("td", { className: "optionLabel" }, "Comparison:"), /* @__PURE__ */ k("td", null, /* @__PURE__ */ k("label", { className: "optionGroup" }, /* @__PURE__ */ k(
      "input",
      {
        type: "radio",
        name: "metaboliteCompare",
        onClick: () => e.set("metabolite_compare_style", "fold"),
        checked: e.get("metabolite_compare_style") === "fold",
        disabled: r.metabolite === null
      }
    ), "Fold Change"), /* @__PURE__ */ k("label", { className: "optionGroup" }, /* @__PURE__ */ k(
      "input",
      {
        type: "radio",
        name: "metaboliteCompare",
        onClick: () => e.set("metabolite_compare_style", "log2_fold"),
        checked: e.get("metabolite_compare_style") === "log2_fold",
        disabled: r.metabolite === null
      }
    ), "Log2 (Fold Change)"), /* @__PURE__ */ k("label", { className: "optionGroup" }, /* @__PURE__ */ k(
      "input",
      {
        type: "radio",
        name: "metaboliteCompare",
        onClick: () => e.set("metabolite_compare_style", "diff"),
        checked: e.get("metabolite_compare_style") === "diff",
        disabled: r.metabolite === null
      }
    ), "Difference")))))));
  }
}
class In extends je {
  constructor(e) {
    super(e), this.state = {
      visible: null
    }, this.setWrapperRef = this.setWrapperRef.bind(this), this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  componentWillMount() {
    this.setState({
      visible: !1
    });
  }
  componentDidMount() {
    document.addEventListener("mouseup", this.handleClickOutside);
  }
  componentWillReceiveProps(e) {
    this.setState({ visible: e.visible });
  }
  setWrapperRef(e) {
    this.wrapperRef = e;
  }
  handleClickOutside(e) {
    this.wrapperRef && !this.wrapperRef.contains(e.target) && this.setState({ visible: !1 });
  }
  render() {
    return /* @__PURE__ */ k(
      "li",
      {
        className: "dropdown",
        style: this.props.disabledEditing ? { display: "none" } : { display: "block" }
      },
      /* @__PURE__ */ k(
        "div",
        {
          className: "dropdownButton",
          tabindex: "0",
          ref: this.setWrapperRef,
          onClick: () => this.setState({ visible: !this.state.visible })
        },
        this.props.name,
        " ",
        /* @__PURE__ */ k("i", { className: "icon-sort-down" })
      ),
      /* @__PURE__ */ k(
        "ul",
        {
          className: "menu",
          style: this.state.visible ? { display: "block" } : { display: "none" },
          id: this.props.rightMenu === "true" ? "rightMenu" : ""
        },
        this.props.children.map((e) => e && e.attributes.name === "divider" ? /* @__PURE__ */ k(
          "li",
          {
            style: {
              height: "1px",
              backgroundColor: "#e5e5e5",
              padding: "0",
              margin: "8px 0"
            }
          }
        ) : e)
      )
    );
  }
}
class Oe extends je {
  constructor(e) {
    super(e), this.assignKeyForInput = this.assignKeyForInput.bind(this);
  }
  handleFileInput(e) {
    const n = e.files[0], r = new window.FileReader();
    r.onload = () => {
      Be.load_json_or_csv(n, to, (i, s) => this.props.onClick(s));
    }, n !== void 0 && r.readAsText(n), e.value = null;
  }
  assignKeyForInput(e) {
    this.props.assignKey && this.props.assignKey(() => e.click());
  }
  render() {
    const e = ce.contains(this.props.disabledButtons, this.props.name.replace(/ \(.*\)$/, ""));
    return this.props.type === "load" ? /* @__PURE__ */ k(
      "label",
      {
        className: "menuButton",
        tabindex: e ? "-1" : "0",
        id: e ? "disabled" : ""
      },
      /* @__PURE__ */ k(
        "input",
        {
          type: "file",
          onChange: (n) => this.handleFileInput(n.target),
          disabled: e,
          ref: this.assignKeyForInput
        }
      ),
      this.props.name
    ) : this.props.checkMark ? /* @__PURE__ */ k(
      "li",
      {
        className: "menuButton",
        tabindex: e ? "-1" : "0",
        onClick: this.props.onClick,
        id: e ? "disabled" : ""
      },
      /* @__PURE__ */ k("i", { className: "icon-ok", "aria-hidden": "true" }, " "),
      this.props.name
    ) : /* @__PURE__ */ k(
      "li",
      {
        className: "menuButton",
        tabindex: e ? "-1" : "0",
        onClick: e ? null : this.props.onClick,
        id: e ? "disabled" : ""
      },
      this.props.name
    );
  }
}
class ug extends je {
  componentWillMount() {
    this.props.sel.selectAll(".escher-zoom-container").on("touchend.menuBar", () => this.setState({ dropdownVisible: !1 })).on("click.menuBar", () => this.setState({ dropdownVisible: !1 }));
  }
  componentWillUnmount() {
    this.props.sel.selectAll(".escher-zoom-container").on("touchend.menuBar", null).on("click.menuBar", null);
  }
  render() {
    const e = this.props.settings.get("enable_keys"), n = this.props.settings.get("disabled_buttons"), r = this.props.map.beziers_enabled, i = this.props.settings.get("full_screen_button");
    return /* @__PURE__ */ k("ul", { className: "menu-bar" }, /* @__PURE__ */ k(In, { name: "Map", dropdownVisible: this.props.dropdownVisible }, /* @__PURE__ */ k(
      Oe,
      {
        name: "Save map JSON" + (e ? " (Ctrl+S)" : ""),
        onClick: () => this.props.saveMap(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: "Load map JSON" + (e ? " (Ctrl+O)" : ""),
        onClick: (s) => this.props.loadMap(s),
        assignKey: this.props.assignKeyLoadMap,
        type: "load",
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: "Export as SVG" + (e ? " (Ctrl+Shift+S)" : ""),
        onClick: () => this.props.save_svg(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: "Export as PNG" + (e ? " (Ctrl+Shift+P)" : ""),
        onClick: () => this.props.save_png(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: "Clear map",
        onClick: () => this.props.clear_map(),
        disabledButtons: n
      }
    )), /* @__PURE__ */ k(In, { name: "Model", dropdownVisible: this.props.dropdownVisible }, /* @__PURE__ */ k(
      Oe,
      {
        name: "Load COBRA model JSON" + (e ? " (Ctrl+M)" : ""),
        onClick: (s) => this.props.loadModel(s),
        assignKey: this.props.assignKeyLoadModel,
        type: "load",
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: "Update names and gene reaction rules using model",
        onClick: () => this.props.updateRules(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: "Clear model",
        onClick: () => this.props.clearModel(),
        disabledButtons: n
      }
    )), /* @__PURE__ */ k(In, { name: "Data", dropdownVisible: this.props.dropdownVisible }, /* @__PURE__ */ k(
      Oe,
      {
        name: "Load reaction data",
        onClick: (s) => this.props.setReactionData(s),
        type: "load",
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: "Clear reaction data",
        onClick: () => this.props.clearReactionData(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k("li", { name: "divider" }), /* @__PURE__ */ k(
      Oe,
      {
        name: "Load gene data",
        onClick: (s) => this.props.setGeneData(s),
        type: "load",
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: "Clear gene data",
        onClick: () => this.props.clearGeneData(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k("li", { name: "divider" }), /* @__PURE__ */ k(
      Oe,
      {
        name: "Load metabolite data",
        onClick: (s) => this.props.setMetaboliteData(s),
        type: "load",
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: "Clear metabolite data",
        onClick: () => this.props.clearMetaboliteData(),
        disabledButtons: n
      }
    )), /* @__PURE__ */ k(
      In,
      {
        name: "Edit",
        rightMenu: "true",
        dropdownVisible: this.props.dropdownVisible,
        disabledEditing: !this.props.settings.get("enable_editing")
      },
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Pan mode" + (e ? " (Z)" : ""),
          checkMark: this.props.mode === "zoom",
          onClick: () => this.props.setMode("zoom"),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Select mode" + (e ? " (V)" : ""),
          checkMark: this.props.mode === "brush",
          onClick: () => this.props.setMode("brush"),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Add reaction mode" + (e ? " (N)" : ""),
          checkMark: this.props.mode === "build",
          onClick: () => this.props.setMode("build"),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Rotate mode" + (e ? " (R)" : ""),
          checkMark: this.props.mode === "rotate",
          onClick: () => this.props.setMode("rotate"),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Text mode" + (e ? " (T)" : ""),
          checkMark: this.props.mode === "text",
          onClick: () => this.props.setMode("text"),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k("li", { name: "divider" }),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Delete" + (e ? " (Del)" : ""),
          onClick: () => this.props.deleteSelected(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Undo" + (e ? " (Ctrl+Z)" : ""),
          onClick: () => this.props.undo(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Redo" + (e ? " (Ctrl+Shift+Z)" : ""),
          onClick: () => this.props.redo(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k("li", { name: "divider" }),
      /* @__PURE__ */ k(
        Oe,
        {
          name: `Align vertical${e ? " (Alt+L)" : ""}`,
          onClick: this.props.align_vertical,
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Oe,
        {
          name: `Align horizontal${e ? " (Shift+Alt+L)" : ""}`,
          onClick: this.props.align_horizontal,
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Toggle primary/secondary" + (e ? " (P)" : ""),
          onClick: () => this.props.togglePrimary(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Rotate reactant locations" + (e ? " (C)" : ""),
          onClick: () => this.props.cyclePrimary(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k("li", { name: "divider" }),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Select all" + (e ? " (Ctrl+A)" : ""),
          onClick: () => this.props.selectAll(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Select none" + (e ? " (Ctrl+Shift+A)" : ""),
          onClick: () => this.props.selectNone(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Oe,
        {
          name: "Invert selection",
          onClick: () => this.props.invertSelection(),
          disabledButtons: n
        }
      )
    ), /* @__PURE__ */ k(In, { name: "View", rightMenu: "true", dropdownVisible: this.props.dropdownVisible }, /* @__PURE__ */ k(
      Oe,
      {
        name: `Zoom in${e ? " (+)" : ""}`,
        onClick: () => this.props.zoom_in(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: `Zoom out${e ? " (-)" : ""}`,
        onClick: () => this.props.zoom_out(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: `Zoom to nodes${e ? " (0)" : ""}`,
        onClick: () => this.props.zoomExtentNodes(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: `Zoom to canvas${e ? " (1)" : ""}`,
        onClick: () => this.props.zoomExtentCanvas(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: `Find${e ? " (F)" : ""}`,
        onClick: () => this.props.search(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Oe,
      {
        name: `${r ? "Hide" : "Show"} control points${e ? " (B)" : ""}`,
        onClick: () => this.props.toggleBeziers(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k("li", { name: "divider" }), i && /* @__PURE__ */ k(
      Oe,
      {
        name: "Full screen",
        onClick: () => this.props.full_screen(),
        checkMark: this.props.isFullScreen,
        disabledButtons: n
      }
    ), i && /* @__PURE__ */ k("li", { name: "divider" }), /* @__PURE__ */ k(
      Oe,
      {
        name: `Settings${e ? " (,)" : ""}`,
        onClick: () => this.props.renderSettingsMenu(),
        disabledButtons: n,
        type: "settings"
      }
    )), /* @__PURE__ */ k("a", { className: "helpButton", target: "#", href: "https://escher.readthedocs.org" }, "?"));
  }
}
class cg extends je {
  constructor(e) {
    super(e), this.state = {
      current: 0,
      searchItem: e.searchItem,
      counter: ""
    };
  }
  componentWillMount() {
    this.setState({
      clearEscape: this.props.map.key_manager.addEscapeListener(
        () => this.close(),
        !0
      ),
      clearNext: this.props.map.key_manager.addKeyListener(
        ["enter", "ctrl+g"],
        () => this.next(),
        !1
      ),
      clearPrevious: this.props.map.key_manager.addKeyListener(
        ["shift+enter", "shift+ctrl+g"],
        () => this.previous(),
        !1
      )
    });
  }
  componentDidMount() {
    this.inputRef.focus();
  }
  componentWillUnmount() {
    this.state.clearEscape(), this.state.clearNext(), this.state.clearPrevious(), this.props.map.highlight(null);
  }
  /**
   * Updates map focus and search bar counter when new search term is entered.
   * @param {string} value - Search term
   */
  handleInput(e) {
    const n = this.dropDuplicates(this.props.map.search_index.find(e));
    let r = "";
    if (n === null || !e)
      this.props.map.highlight(null);
    else if (n.length === 0)
      r = "0 / 0", this.props.map.highlight(null);
    else {
      this.state.current >= n.length && this.setState({
        current: 0
      }), r = `${this.state.current + 1}/${n.length}`;
      const i = n[this.state.current];
      if (i.type === "reaction")
        this.props.map.zoom_to_reaction(i.reaction_id), this.props.map.highlight_reaction(i.reaction_id);
      else if (i.type === "metabolite")
        this.props.map.zoom_to_node(i.node_id), this.props.map.highlight_node(i.node_id);
      else if (i.type === "text_label")
        this.props.map.zoom_to_text_label(i.text_label_id), this.props.map.highlight_text_label(i.text_label_id);
      else
        throw new Error("Bad search index data type: " + i.type);
    }
    this.setState({
      searchItem: e,
      current: 0,
      counter: r,
      results: n
    });
  }
  dropDuplicates(e) {
    const n = {
      metabolite: {
        type: "m",
        key: "node_id"
      },
      reaction: {
        type: "r",
        key: "reaction_id"
      },
      text_label: {
        type: "t",
        key: "text_label_id"
      }
    };
    return ce.uniq(e, (r) => {
      const { type: i, key: s } = n[r.type];
      return `${i}${r[s]}`;
    });
  }
  next() {
    this.state.results && this.state.results.length > 0 && this.update((this.state.current + 1) % this.state.results.length);
  }
  previous() {
    this.state.results && this.state.results.length > 0 && this.update(
      (this.state.current + this.state.results.length - 1) % this.state.results.length
    );
  }
  /**
   * Updates the map focus and search bar counter for when buttons are clicked.
   * @param {number} current - index of current search result
   */
  update(e) {
    this.setState({
      current: e,
      counter: `${e + 1}/${this.state.results.length}`
    });
    var n = this.state.results[e];
    if (n.type === "reaction")
      this.props.map.zoom_to_reaction(n.reaction_id), this.props.map.highlight_reaction(n.reaction_id);
    else if (n.type === "metabolite")
      this.props.map.zoom_to_node(n.node_id), this.props.map.highlight_node(n.node_id);
    else if (n.type === "text_label")
      this.props.map.zoom_to_text_label(n.text_label_id), this.props.map.highlight_text_label(n.text_label_id);
    else
      throw new Error("Bad search index data type: " + n.type);
  }
  close() {
    this.props.setDisplay(!1);
  }
  render() {
    return /* @__PURE__ */ k("div", { className: "search-container" }, /* @__PURE__ */ k(
      "input",
      {
        className: "search-field",
        value: this.state.searchItem,
        onInput: (e) => this.handleInput(e.target.value),
        ref: (e) => {
          this.inputRef = e;
        }
      }
    ), /* @__PURE__ */ k("button", { className: "search-bar-button left btn", onClick: () => this.previous() }, /* @__PURE__ */ k("i", { className: "icon-left-open" })), /* @__PURE__ */ k("button", { className: "search-bar-button right btn", onClick: () => this.next() }, /* @__PURE__ */ k("i", { className: "icon-right-open" })), /* @__PURE__ */ k("div", { className: "search-counter" }, this.state.counter), /* @__PURE__ */ k("button", { className: "search-bar-button btn", onClick: () => this.close() }, /* @__PURE__ */ k("i", { className: "icon-cancel" })));
  }
}
class hg extends je {
  render() {
    const e = this.props.settings.get("menu"), n = this.props.settings.get("enable_keys"), r = this.props.settings.get("enable_editing");
    return /* @__PURE__ */ k("ul", { className: "button-panel" }, /* @__PURE__ */ k("li", null, /* @__PURE__ */ k(
      "button",
      {
        className: "button btn",
        onClick: () => this.props.zoomContainer.zoom_in(),
        title: `Zoom in${n ? " (+)" : ""}`
      },
      /* @__PURE__ */ k("i", { className: "icon-zoom-in" })
    )), /* @__PURE__ */ k("li", null, /* @__PURE__ */ k(
      "button",
      {
        className: "button btn",
        onClick: () => this.props.zoomContainer.zoom_out(),
        title: `Zoom out${n ? " (-)" : ""}`
      },
      /* @__PURE__ */ k("i", { className: "icon-zoom-out" })
    )), /* @__PURE__ */ k("li", null, /* @__PURE__ */ k(
      "button",
      {
        className: "button btn",
        onClick: () => this.props.map.zoom_extent_canvas(),
        title: `Zoom to canvas${n ? " (1)" : ""}`
      },
      /* @__PURE__ */ k("i", { className: "icon-resize-full" })
    )), /* @__PURE__ */ k("li", { style: { display: this.props.settings.get("full_screen_button") !== !1 ? "block" : "none" } }, /* @__PURE__ */ k(
      "button",
      {
        className: `button btn ${this.props.isFullScreen ? "active-button" : ""}`,
        onClick: () => this.props.full_screen(),
        title: "Toggle full screen"
      },
      /* @__PURE__ */ k("i", { className: "icon-resize-full-alt" })
    )), /* @__PURE__ */ k(
      "li",
      {
        className: "grouping",
        style: { display: e === "all" && r ? "block" : "none" }
      },
      /* @__PURE__ */ k(
        "button",
        {
          className: "buttonGroup btn",
          title: `Pan mode${n ? " (Z)" : ""}`,
          for: "zoom",
          id: this.props.mode === "zoom" ? "currentMode" : null,
          onClick: () => this.props.setMode("zoom")
        },
        /* @__PURE__ */ k("i", { className: "icon-move" })
      ),
      /* @__PURE__ */ k(
        "button",
        {
          className: "buttonGroup btn",
          title: `Select mode${n ? " (V)" : ""}`,
          for: "brush",
          id: this.props.mode === "brush" ? "currentMode" : null,
          onClick: () => this.props.setMode("brush")
        },
        /* @__PURE__ */ k("i", { className: "icon-mouse-pointer" })
      ),
      /* @__PURE__ */ k(
        "button",
        {
          className: "buttonGroup btn",
          title: `Add reaction mode${n ? " (N)" : ""}`,
          for: "build",
          onClick: () => this.props.setMode("build"),
          id: this.props.mode === "build" ? "currentMode" : null
        },
        /* @__PURE__ */ k("i", { className: "icon-wrench" })
      ),
      /* @__PURE__ */ k(
        "button",
        {
          className: "buttonGroup btn",
          title: `Rotate mode${n ? " (R)" : ""}`,
          for: "rotate",
          id: this.props.mode === "rotate" ? "currentMode" : null,
          onClick: () => this.props.setMode("rotate")
        },
        /* @__PURE__ */ k("i", { className: "icon-cw" })
      ),
      /* @__PURE__ */ k(
        "button",
        {
          className: "buttonGroup btn",
          title: `Text mode${n ? " (T)" : ""}`,
          for: "text",
          id: this.props.mode === "text" ? "currentMode" : null,
          onClick: () => this.props.setMode("text")
        },
        /* @__PURE__ */ k("i", { className: "icon-font" })
      )
    ), /* @__PURE__ */ k(
      "li",
      {
        className: "grouping",
        style: { display: this.props.mode === "build" && e === "all" && r ? "block" : "none" }
      },
      /* @__PURE__ */ k(
        "button",
        {
          className: "buttonGroup btn",
          title: `Direction arrow${n ? " (←)" : ""}`,
          onClick: () => this.props.buildInput.direction_arrow.left()
        },
        /* @__PURE__ */ k("i", { className: "icon-left-big" })
      ),
      /* @__PURE__ */ k(
        "button",
        {
          className: "buttonGroup btn",
          title: `Direction arrow${n ? " (→)" : ""}`,
          onClick: () => this.props.buildInput.direction_arrow.right()
        },
        /* @__PURE__ */ k("i", { className: "icon-right-big" })
      ),
      /* @__PURE__ */ k(
        "button",
        {
          className: "buttonGroup btn",
          title: `Direction arrow${n ? " (↑)" : ""}`,
          onClick: () => this.props.buildInput.direction_arrow.up()
        },
        /* @__PURE__ */ k("i", { className: "icon-up-big" })
      ),
      /* @__PURE__ */ k(
        "button",
        {
          className: "buttonGroup btn",
          title: `Direction arrow${n ? " (↓)" : ""}`,
          onClick: () => this.props.buildInput.direction_arrow.down()
        },
        /* @__PURE__ */ k("i", { className: "icon-down-big" })
      )
    ));
  }
}
class fg {
  constructor(e, n, r, i, s) {
    this.div = e.append("div").attr("id", "tooltip-container"), this.tooltipRef = null, this.zoomContainer = r, this.setUpZoomCallbacks(r), this.callbackManager = new bn(), this.div.on("mouseover", this.cancelHideTooltip.bind(this)), this.div.on("mouseleave", this.hide.bind(this)), this.map = i, this.setUpMapCallbacks(i), this.settings = s, this.delay_hide_timeout = null, this.currentTooltip = null, Fn(
      n,
      null,
      (a) => this.callbackManager.set("pass_props", a),
      this.div.node(),
      (a) => {
        this.tooltipRef = a;
      }
    ), this.passProps({
      display: !1,
      disableTooltips: () => this.disableTooltips()
    });
  }
  /**
   * Disable tooltips in the settings
   */
  disableTooltips() {
    this.settings.set("enable_tooltips", !1), this.map.draw_everything(), this.hide(), this.map.set_status(`Tooltips disabled. You can enable them again in the
                         settings menu.`, 3e3);
  }
  /**
    * Function to pass props for the tooltips. Run without an argument to
    * rerender the component
    * @param {Object} props - Props that the tooltip will use
    */
  passProps(e = {}) {
    this.callbackManager.run("pass_props", null, e);
  }
  /**
   * Sets up the appropriate callbacks to show the input
   * @param {object} map - map object
   */
  setUpMapCallbacks(e) {
    this.placedDiv = es(this.div, e, void 0, !1), e.callback_manager.set("show_tooltip.tooltip_container", (n, r) => {
      this.show(n, r);
    }), e.callback_manager.set("hide_tooltip.tooltip_container", () => this.hide()), e.callback_manager.set("delay_hide_tooltip.tooltip_container", () => this.delayHide()), e.sel.selectAll(".canvas-group").on("touchend", () => this.hide());
  }
  setUpZoomCallbacks(e) {
    e.callbackManager.set("zoom.tooltip_container", (function() {
      this.is_visible() && this.hide();
    }).bind(this)), e.callbackManager.set("go_to.tooltip_container", (function() {
      this.is_visible() && this.hide();
    }).bind(this));
  }
  /**
   * Return visibility of tooltip container.
   * @return {Boolean} Whether tooltip is visible.
   */
  is_visible() {
    return this.placedDiv.is_visible();
  }
  /**
   * Show and place the input.
   * @param {string} type - 'reaction_label', 'node_label', or 'gene_label'
   * @param {Object} d - D3 data for DOM element
   */
  show(e, n) {
    if (this.cancelHideTooltip(), ce.contains(["reaction_label", "node_label", "gene_label", "reaction_object", "node_object"], e)) {
      const r = this.tooltipRef !== null && this.tooltipRef.get_size ? this.tooltipRef.get_size() : { width: 270, height: 100 };
      this.currentTooltip = { type: e, id: n[e.replace("_label", "_id").replace("_object", "_id")] };
      const i = this.zoomContainer.windowTranslate, s = this.zoomContainer.windowScale, a = this.map !== null ? this.map.get_size() : { width: 1e3, height: 1e3 }, l = { x: 0, y: 0 }, u = e === "reaction_object" ? n.xPos : n.label_x, f = e === "reaction_object" ? n.yPos : n.label_y, p = s * u + i.x + r.width, g = s * f + i.y + r.height;
      a.width < 500 ? (p > a.width && (l.x = -(p - a.width) / s), g > a.height - 74 && (l.y = -(g - a.height + 77) / s)) : (s * u + i.x + 0.5 * r.width > a.width ? l.x = -r.width / s : p > a.width && (l.x = -(p - a.width) / s), s * f + i.y + 0.5 * r.height > a.height - 45 ? l.y = -r.height / s : g > a.height - 45 && (l.y = -(g - a.height + 47) / s));
      const _ = { x: u + l.x, y: f + 10 + l.y };
      this.placedDiv.place(_), this.passProps({
        display: !0,
        biggId: n.bigg_id,
        name: n.name,
        loc: _,
        data: n.data_string,
        type: e.replace("_label", "").replace("node", "metabolite").replace("_object", "")
      });
    } else
      throw new Error("Tooltip not supported for object type " + e);
  }
  /**
   * Hide the input.
   */
  hide() {
    this.placedDiv.hide(), this.currentTooltip = null;
  }
  /**
   * Hide the input after a short delay, so that mousing onto the tooltip does not
   * cause it to hide.
   */
  delayHide() {
    this.delayHideTimeout = setTimeout(() => this.hide(), 100);
  }
  cancelHideTooltip() {
    this.delayHideTimeout !== null && clearTimeout(this.delayHideTimeout);
  }
}
class dg extends je {
  constructor() {
    super(), this.openBigg = this.openBigg.bind(this);
  }
  decompartmentalizeCheck(e, n) {
    return n === "metabolite" ? se.decompartmentalize(e)[0] : e;
  }
  openBigg() {
    const e = this.props.type, n = this.props.biggId, r = "http://bigg.ucsd.edu/", i = e === "gene" ? `${r}search?query=${n}` : `${r}universal/${e}s/${this.decompartmentalizeCheck(n, e)}`;
    window.open(i);
  }
  capitalizeFirstLetter(e) {
    return typeof e == "string" ? e.charAt(0).toUpperCase() + e.slice(1) : console.warn("capitalizeFirstLetter was passed something other than a string");
  }
  render() {
    const n = `Open ${this.decompartmentalizeCheck(this.props.biggId, this.props.type)} in BiGG Models.`;
    return /* @__PURE__ */ k("div", { className: "default-tooltip" }, /* @__PURE__ */ k("div", { className: "id" }, this.props.biggId), /* @__PURE__ */ k("div", { className: "name" }, "name: ", this.props.name), /* @__PURE__ */ k("div", { className: "data" }, "data: ", this.props.data && this.props.data !== "(nd)" ? this.props.data : "no data"), /* @__PURE__ */ k("button", { onClick: this.openBigg }, n), /* @__PURE__ */ k("div", { className: "top-right" }, /* @__PURE__ */ k("div", { className: "type-label" }, this.capitalizeFirstLetter(this.props.type)), /* @__PURE__ */ k("a", { onClick: this.props.disableTooltips }, "Disable Tooltips")));
  }
}
const pg = `svg.escher-svg #mouse-node {
  fill: none;
}
svg.escher-svg #canvas {
  stroke: #ccc;
  stroke-width: 7px;
  fill: white;
}
svg.escher-svg .resize-rect {
  fill: black;
  opacity: 0;
  stroke: none;
}
svg.escher-svg .label {
  font-family: sans-serif;
  font-style: italic;
  font-weight: bold;
  font-size: 8px;
  fill: black;
  stroke: none;
  text-rendering: optimizelegibility;
  cursor: default;
}
svg.escher-svg .reaction-label {
  font-size: 30px;
  fill: rgb(32, 32, 120);
  text-rendering: optimizelegibility;
}
svg.escher-svg .node-label {
  font-size: 20px;
}
svg.escher-svg .gene-label {
  font-size: 18px;
  fill: rgb(32, 32, 120);
  text-rendering: optimizelegibility;
  cursor: default;
}
svg.escher-svg .text-label .label {
  font-size: 50px;
}
svg.escher-svg .text-label-input {
  font-size: 50px;
}
svg.escher-svg .node-circle {
  stroke-width: 2px;
}
svg.escher-svg .midmarker-circle, svg.escher-svg .multimarker-circle {
  fill: white;
  fill-opacity: 0.2;
  stroke: rgb(50, 50, 50);
}
svg.escher-svg g.selected .node-circle{
  stroke-width: 6px;
  stroke: rgb(20, 113, 199);
}
svg.escher-svg g.selected .label {
  fill: rgb(20, 113, 199);
}
svg.escher-svg .metabolite-circle {
  stroke: rgb(162, 69, 16);
  fill: rgb(224, 134, 91);
}
svg.escher-svg g.selected .metabolite-circle {
  stroke: rgb(5, 2, 0);
}
svg.escher-svg .segment {
  stroke: #334E75;
  stroke-width: 10px;
  fill: none;
}
svg.escher-svg .arrowhead {
  fill: #334E75;
}
svg.escher-svg .stoichiometry-label-rect {
  fill: white;
  opacity: 0.5;
}
svg.escher-svg .stoichiometry-label {
  fill: #334E75;
  font-size: 17px;
}
svg.escher-svg .membrane {
  fill: none;
  stroke: rgb(255, 187, 0);
}
svg.escher-svg .brush .extent {
  fill-opacity: 0.1;
  fill: black;
  stroke: #fff;
  shape-rendering: crispEdges;
}
svg.escher-svg #brush-container .background {
  fill: none;
}
svg.escher-svg .bezier-circle {
  fill: rgb(255,255,255);
}
svg.escher-svg .bezier-circle.b1 {
  stroke: red;
}
svg.escher-svg .bezier-circle.b2 {
  stroke: blue;
}
svg.escher-svg .connect-line{
  stroke: rgb(200,200,200);
}
svg.escher-svg .direction-arrow {
  cursor: default;
  stroke: black;
  stroke-width: 1px;
  fill: white;
  opacity: 0.3;
}
svg.escher-svg .start-reaction-target {
  stroke: rgb(100,100,100);
  fill: none;
  opacity: 0.5;
}
svg.escher-svg .rotation-center-line {
  stroke: red;
  stroke-width: 5px;
}
svg.escher-svg .highlight {
  fill: #D97000;
  text-decoration: underline;
}
svg.escher-svg .node-to-combine {
  stroke-width: 12px !important;
}
`;
class gg {
  constructor(e, n, r, i, s) {
    i ? i instanceof qt || ("node" in i ? i = Pe(i.node()) : i = Pe(i)) : i = Pe("body").append("div"), s || (s = {}), r || (r = pg), this.map_data = e, this.model_data = n, this.embeddedCss = r, this.selection = i, this.menu_div = null, this.button_div = null, this.search_bar_div = null, this.searchBarRef = null, this.semanticOptions = null, this.mode = "zoom", this.selection.datum(this), this.selection.__builder__ = this, this.has_custom_reaction_styles = !!s.reaction_styles;
    const a = se.set_options(s, {
      // view options
      menu: "all",
      scroll_behavior: "pan",
      use_3d_transform: !1,
      enable_editing: !0,
      enable_keys: !0,
      enable_search: !0,
      fill_screen: !1,
      zoom_to_element: null,
      full_screen_button: !1,
      ignore_bootstrap: !1,
      disabled_buttons: null,
      semantic_zoom: null,
      // map, model, and styles
      starting_reaction: null,
      never_ask_before_quit: !1,
      unique_map_id: null,
      // deprecated
      primary_metabolite_radius: 20,
      secondary_metabolite_radius: 10,
      marker_radius: 5,
      gene_font_size: 18,
      hide_secondary_metabolites: !1,
      show_gene_reaction_rules: !1,
      hide_all_labels: !1,
      canvas_size_and_loc: null,
      // applied data
      // reaction
      reaction_data: null,
      reaction_styles: ["color", "size", "text"],
      reaction_compare_style: "log2_fold",
      reaction_scale: null,
      reaction_scale_preset: "GaBuGeRd",
      reaction_no_data_color: "#dcdcdc",
      reaction_no_data_size: 8,
      // gene
      gene_data: null,
      and_method_in_gene_reaction_rule: "mean",
      // metabolite
      metabolite_data: null,
      metabolite_styles: ["color", "size", "text"],
      metabolite_compare_style: "log2_fold",
      metabolite_scale: null,
      metabolite_scale_preset: "WhYlRd",
      metabolite_no_data_color: "#ffffff",
      metabolite_no_data_size: 10,
      // View and build options
      identifiers_on_map: "bigg_id",
      highlight_missing: !1,
      allow_building_duplicate_reactions: !1,
      cofactors: [
        "atp",
        "adp",
        "nad",
        "nadh",
        "nadp",
        "nadph",
        "gtp",
        "gdp",
        "h",
        "coa",
        "ump",
        "h2o",
        "ppi"
      ],
      // Extensions
      tooltip_component: dg,
      enable_tooltips: ["label"],
      enable_keys_with_tooltip: !0,
      // Callbacks
      first_load_callback: null
    }, {
      primary_metabolite_radius: !0,
      secondary_metabolite_radius: !0,
      marker_radius: !0,
      gene_font_size: !0,
      reaction_no_data_size: !0,
      metabolite_no_data_size: !0
    });
    if (se.check_for_parent_tag(this.selection, "svg"))
      throw new Error("Builder cannot be placed within an svg node because UI elements are html-based.");
    var l = [
      "identifiers_on_map",
      "scroll_behavior",
      "hide_secondary_metabolites",
      "show_gene_reaction_rules",
      "hide_all_labels",
      "allow_building_duplicate_reactions",
      "highlight_missing",
      "enable_tooltips",
      "reaction_scale_preset",
      "reaction_no_data_color",
      "reaction_no_data_size",
      "reaction_scale",
      "reaction_styles",
      "reaction_compare_style",
      "and_method_in_gene_reaction_rule",
      "metabolite_scale_preset",
      "metabolite_scale",
      "metabolite_styles",
      "metabolite_compare_style",
      "metabolite_no_data_color",
      "metabolite_no_data_size"
    ];
    this.settings = new Hp(a, l), this.settings.get("fill_screen") && this.settings.get("full_screen_button") && (this.settings.set("full_screen_button", !1), console.warn("The option full_screen_button has no effect when fill_screen is true")), this.isFullScreen = !1, this.settings.get("fill_screen") && (Pe("html").classed("fill-screen", !0), Pe("body").classed("fill-screen", !0), this.selection.classed("fill-screen-div", !0), this.isFullScreen = !0), this.savedFullScreenSettings = null, this.savedFullScreenParent = null, this.clearFullScreenEscape = null, this.callback_manager = new bn();
    const u = this.settings.get("first_load_callback");
    u !== null && this.callback_manager.set("first_load", () => {
      u(this);
    }), this.zoom_container = new If(
      this.selection,
      this.settings.get("scroll_behavior"),
      this.settings.get("use_3d_transform")
    ), this.zoom_container.callbackManager.set("zoom_change", () => {
      if (this.settings.get("semantic_zoom")) {
        const p = this.zoom_container.windowScale, g = this.settings.get("semantic_zoom").sort((_, m) => _.zoomLevel - m.zoomLevel).find((_) => _.zoomLevel > p);
        if (g) {
          let _ = !1;
          ce.mapObject(g.options, (m, T) => {
            this.settings.get(T) !== m && (this.settings.set(T, m), _ = !0);
          }), _ && this._updateData(!1, !0);
        }
      }
    }), this.settings.streams.use_3d_transform.onValue((p) => {
      this.zoom_container.setUse3dTransform(p);
    }), this.settings.streams.scroll_behavior.onValue((p) => {
      this.zoom_container.setScrollBehavior(p);
    }), this.settings.streams.enable_tooltips.onValue((p) => {
      this._updateTooltipSetting(p);
    }), this.mapToolsContainer = this.selection.append("div").attr("class", "map-tools-container"), this._createStatus(this.selection), this.load_model(this.model_data, !1);
    var f = this.selection.append("div").attr("class", "search-menu-container").append("div").attr("class", "search-menu-container-inline");
    this.menu_div = f.append("div"), this.search_bar_div = f.append("div"), this.button_div = this.selection.append("div"), ce.delay(() => {
      this.load_map(this.map_data, !1);
      const p = this._reactionCheckAddAbs();
      this._updateData(!0, !0), this.settings.statusBus.onValue((g) => {
        if (g === "accept") {
          if (this._updateData(!0, !0, ["reaction", "metabolite"], !1), this.zoom_container !== null) {
            const _ = this.settings.get("scroll_behavior");
            this.zoom_container.setScrollBehavior(_);
          }
          this.map !== null && (this.map.draw_all_nodes(!1), this.map.draw_all_reactions(!0, !1), this.map.select_none());
        }
      }), p !== null && setTimeout(p, 500), ce.defer(() => this.callback_manager.run("first_load", this));
    }, 50);
  }
  // builder.options is deprecated
  get options() {
    throw new Error("builder.options is deprecated. Use builder.settings.get() and builder.settings.set() instead.");
  }
  set options(e) {
    throw new Error("builder.options is deprecated. Use builder.settings.get() and builder.settings.set() instead.");
  }
  /**
   * For documentation of this function, see docs/javascript_api.rst.
   */
  load_model(e, n = !0) {
    ce.isNull(e) ? this.cobra_model = null : this.cobra_model = oo.from_cobra_json(e), this.map && (this.map.cobra_model = this.cobra_model, n && this._updateData(!0, !1), this.settings.get("highlight_missing") && this.map.draw_all_reactions(!1, !1)), this.callback_manager.run("load_model", null, e, n);
  }
  /**
   * For documentation of this function, see docs/javascript_api.rst
   */
  load_map(e, n = !0) {
    const r = {};
    if (this.settings.get("semantic_zoom")) {
      for (let u of this.settings.get("semantic_zoom"))
        Object.keys(u.options).map((f) => {
          r[f] === void 0 && (r[f] = this.settings.get(f));
        });
      this.semanticOptions = Object.assign({}, r);
    }
    se.remove_child_nodes(this.zoom_container.zoomedSel), se.remove_child_nodes(this.mapToolsContainer);
    const i = this.zoom_container.zoomedSel, s = this.zoom_container.svg;
    this.map && this.map.key_manager.toggle(!1), e !== null ? this.map = va.from_data(
      e,
      s,
      this.embeddedCss,
      i,
      this.zoom_container,
      this.settings,
      this.cobra_model,
      this.settings.get("enable_search")
    ) : this.map = new va(
      s,
      this.embeddedCss,
      i,
      this.zoom_container,
      this.settings,
      this.cobra_model,
      this.settings.get("canvas_size_and_loc"),
      this.settings.get("enable_search")
    ), this._setupStatus(this.map), this.map.set_status("Loading map ..."), this._updateTooltipSetting(this.settings.get("enable_tooltips")), n && this._updateData(!1, !0), this.build_input = new Uc(
      this.mapToolsContainer,
      this.map,
      this.zoom_container,
      this.settings
    ), this.text_edit_input = new Yp(
      this.mapToolsContainer,
      this.map,
      this.zoom_container
    ), this.brush = new qp(i, !1, this.map, ".canvas-group"), this.map.canvas.callbackManager.set("resize", () => {
      this.mode === "brush" && this.brush.toggle(!0);
    }), this.setUpSettingsMenu(this.mapToolsContainer), this.setUpButtonPanel(this.mapToolsContainer);
    const a = this.mapToolsContainer.append("div").attr("class", "search-menu-container").append("div").attr("class", "search-menu-container-inline");
    this.setUpMenuBar(a), this.setUpSearchBar(a), this.tooltip_container = new fg(
      this.mapToolsContainer,
      this.settings.get("tooltip_component"),
      this.zoom_container,
      this.map,
      this.settings
    ), this.map.key_manager.assignedKeys = this.getKeys(), this.map.key_manager.inputList = [
      this.build_input,
      this.searchBarRef,
      () => this.settingsMenuRef,
      this.text_edit_input
    ], this.settings.get("enable_keys_with_tooltip") || this.map.key_manager.inputList.push(this.tooltip_container), this.map.key_manager.update(), this.map.key_manager.toggle(this.settings.get("enable_keys")), this.settings.streams.enable_keys.onValue((u) => {
      this.map.key_manager.toggle(u);
    });
    const l = this.settings.get("disabled_buttons") || [];
    if (this.settings.get("reaction_data") || l.push("Clear reaction data"), this.settings.get("gene_data") || l.push("Clear gene data"), this.settings.get("metabolite_data") || l.push("Clear metabolite data"), this.settings.get("enable_search") || l.push("Find"), this.settings.get("enable_editing") || l.push("Show control points"), this.settings.set("disabled_buttons", l), this.settings.get("zoom_to_element")) {
      const u = this.settings.get("zoom_to_element").type, f = this.settings.get("zoom_to_element").id;
      if (ce.isUndefined(u) || ["reaction", "node"].indexOf(u) === -1)
        throw new Error('zoom_to_element type must be "reaction" or "node"');
      if (ce.isUndefined(f))
        throw new Error("zoom_to_element must include id");
      u === "reaction" ? this.map.zoom_to_reaction(f) : u === "node" && this.map.zoom_to_node(f);
    } else if (e)
      this.map.zoom_extent_canvas();
    else if (this.settings.get("starting_reaction") && this.cobra_model !== null) {
      const u = this.zoom_container.get_size(), f = { x: u.width / 2, y: u.height / 4 };
      this.map.new_reaction_from_scratch(
        this.settings.get("starting_reaction"),
        f,
        90
      ), this.map.zoom_extent_nodes();
    } else
      this.map.zoom_extent_canvas();
    this.settings.get("enable_editing") ? this.zoom_mode() : this.view_mode(), this.settings.streams.enable_editing.onValue((u) => {
      u ? this.zoom_mode() : this.view_mode();
    }), this.settings.get("enable_editing") && this._setupConfirmBeforeExit(), this.map.draw_everything(), this.map.set_status(""), this.callback_manager.run("load_map", null, e, n);
  }
  /**
   * Function to pass props for the settings menu. Run without an argument to
   * rerender the component
   * @param {Object} props - Props that the settings menu will use
   */
  passPropsSettingsMenu(e = {}) {
    this.map.callback_manager.run("pass_props_settings_menu", null, e);
  }
  /**
   * Initialize the settings menu
   */
  setUpSettingsMenu(e) {
    this.settingsMenuRef = null, Fn(
      lg,
      (n) => {
        this.settingsMenuRef = n;
      },
      (n) => this.map.callback_manager.set("pass_props_settings_menu", n),
      e.append("div").node()
    ), this.passPropsSettingsMenu({
      display: !1,
      settings: this.settings,
      map: this.map
    }), ce.mapObject(this.settings.streams, (n, r) => {
      n.onValue((i) => {
        this.passPropsSettingsMenu();
      });
    }), this.settings.streams.reaction_styles.map((n) => ce.contains(n, "abs")).skipDuplicates().onValue(() => this._updateData(!1, !0)), this.settings.streams.metabolite_styles.map((n) => ce.contains(n, "abs")).skipDuplicates().onValue(() => this._updateData(!1, !0));
  }
  /**
   * Function to pass props for the menu bar
   * @param {Object} props - Props that the menu bar will use
   */
  passPropsMenuBar(e = {}) {
    this.map.callback_manager.run("pass_props_menu_bar", null, e);
  }
  /**
   * Initialize the menu bar
   * @param {D3 Selection} sel - The d3 selection to render in.
   */
  setUpMenuBar(e) {
    this.menuBarRef = null, Fn(
      ug,
      (n) => {
        this.menuBarRef = n;
      },
      (n) => this.map.callback_manager.set("pass_props_menu_bar", n),
      e.append("div").node()
    ), this.passPropsMenuBar({
      display: this.settings.get("menu") === "all",
      settings: this.settings,
      sel: this.selection,
      mode: this.mode,
      map: this.map,
      saveMap: () => {
        this.semanticOptions && (Object.entries(this.semanticOptions).map(([n, r]) => {
          this.settings.set(n, r);
        }), this._updateData()), this.map.save();
      },
      loadMap: (n) => this.load_map(n),
      assignKeyLoadMap: (n) => {
        this.map.key_manager.assignedKeys.load_map.fn = n;
      },
      save_svg: () => this.map.save_svg(),
      save_png: () => this.map.save_png(),
      clear_map: () => {
        this.clear_map();
      },
      loadModel: (n) => this.load_model(n, !0),
      assignKeyLoadModel: (n) => {
        this.map.key_manager.assignedKeys.load_model.fn = n;
      },
      clearModel: () => {
        this.load_model(null), this.callback_manager.run("clear_model");
      },
      updateRules: () => this.map.convert_map(),
      setReactionData: (n) => this.set_reaction_data(n),
      clearReactionData: () => this.set_reaction_data(null),
      setGeneData: (n) => this.set_gene_data(n),
      clearGeneData: () => this.set_gene_data(null, !0),
      setMetaboliteData: (n) => this.set_metabolite_data(n),
      clearMetaboliteData: (n) => this.set_metabolite_data(null),
      setMode: (n) => this._setMode(n),
      deleteSelected: () => this.map.delete_selected(),
      undo: () => this.map.undo_stack.undo(),
      redo: () => this.map.undo_stack.redo(),
      align_vertical: () => this.map.align_vertical(),
      align_horizontal: () => this.map.align_horizontal(),
      togglePrimary: () => this.map.toggle_selected_node_primary(),
      cyclePrimary: () => this.map.cycle_primary_node(),
      selectAll: () => this.map.select_all(),
      selectNone: () => this.map.select_none(),
      invertSelection: () => this.map.invert_selection(),
      zoom_in: () => this.zoom_container.zoom_in(),
      zoom_out: () => this.zoom_container.zoom_out(),
      zoomExtentNodes: () => this.map.zoom_extent_nodes(),
      zoomExtentCanvas: () => this.map.zoom_extent_canvas(),
      full_screen: () => this.full_screen(),
      search: () => this.passPropsSearchBar({ display: !0 }),
      toggleBeziers: () => this.map.toggle_beziers(),
      renderSettingsMenu: () => this.passPropsSettingsMenu({ display: !0 })
    }), this.map.callback_manager.set("toggle_beziers", () => {
      this.passPropsMenuBar();
    }), this.settings.streams.disabled_buttons.onValue((n) => {
      this.passPropsMenuBar();
    }), this.callback_manager.set("set_mode", (n) => {
      this.passPropsMenuBar({ mode: n });
    }), this.settings.streams.menu.onValue((n) => {
      this.passPropsMenuBar({ display: n === "all" });
    }), this.settings.streams.full_screen_button.onValue((n) => {
      this.passPropsMenuBar();
    });
  }
  /**
   * Function to pass props for the search bar
   * @param {Object} props - Props that the search bar will use
   */
  passPropsSearchBar(e = {}) {
    this.map.callback_manager.run("pass_props_search_bar", null, e);
  }
  /**
   * Initialize the search bar
   * @param {D3 Selection} sel - The d3 selection to render in.
   */
  setUpSearchBar(e) {
    this.searchBarRef = null, Fn(
      cg,
      (n) => {
        this.searchBarRef = n;
      },
      (n) => this.map.callback_manager.set("pass_props_search_bar", n),
      e.append("div").node()
    ), this.passPropsSearchBar({
      display: !1,
      searchIndex: this.map.search_index,
      map: this.map
    });
  }
  /**
   * Function to pass props for the button panel
   * @param {Object} props - Props that the tooltip will use
   */
  passPropsButtonPanel(e = {}) {
    this.map.callback_manager.run("pass_props_button_panel", null, e);
  }
  /**
   * Initialize the button panel
   */
  setUpButtonPanel(e) {
    Fn(
      hg,
      null,
      (n) => this.map.callback_manager.set("pass_props_button_panel", n),
      e.append("div").node()
    ), this.passPropsButtonPanel({
      display: ce.contains(["all", "zoom"], this.settings.get("menu")),
      mode: this.mode,
      settings: this.settings,
      setMode: (n) => this._setMode(n),
      zoomContainer: this.zoom_container,
      map: this.map,
      buildInput: this.build_input,
      full_screen: () => this.full_screen()
    }), this.callback_manager.set("set_mode", (n) => {
      this.passPropsButtonPanel({ mode: n });
    }), this.settings.streams.full_screen_button.onValue((n) => {
      this.passPropsButtonPanel();
    });
  }
  /**
   * Set the mode
   */
  _setMode(e) {
    this.mode = e, this.build_input.toggle(e === "build"), this.build_input.direction_arrow.toggle(e === "build"), this.brush.toggle(e === "brush"), this.zoom_container.togglePanDrag(e === "zoom" || e === "view"), this.map.canvas.toggleResize(e !== "view"), e === "rotate" ? (this.map.behavior.toggleSelectableDrag(!1), this.map.behavior.toggleRotationMode(!0)) : (this.map.behavior.toggleRotationMode(e === "rotate"), this.map.behavior.toggleSelectableDrag(e === "brush")), this.map.behavior.toggleSelectableClick(e === "build" || e === "brush"), this.map.behavior.toggleLabelDrag(e === "brush"), this.map.behavior.toggleTextLabelEdit(e === "text"), this.map.behavior.toggleBezierDrag(e === "brush"), (e === "view" || e === "text") && this.map.select_none(), e === "rotate" && this.map.deselect_text_labels(), this.map.draw_everything(), this.callback_manager.run("set_mode", null, e);
  }
  /** For documentation of this function, see docs/javascript_api.rst. */
  view_mode() {
    this.callback_manager.run("view_mode"), this._setMode("view");
  }
  /** For documentation of this function, see docs/javascript_api.rst. */
  build_mode() {
    this.callback_manager.run("build_mode"), this._setMode("build");
  }
  /** For documentation of this function, see docs/javascript_api.rst. */
  brush_mode() {
    this.callback_manager.run("brush_mode"), this._setMode("brush");
  }
  /** For documentation of this function, see docs/javascript_api.rst. */
  zoom_mode() {
    this.callback_manager.run("zoom_mode"), this._setMode("zoom");
  }
  /** For documentation of this function, see docs/javascript_api.rst. */
  rotate_mode() {
    this.callback_manager.run("rotate_mode"), this._setMode("rotate");
  }
  /** For documentation of this function, see docs/javascript_api.rst. */
  text_mode() {
    this.callback_manager.run("text_mode"), this._setMode("text");
  }
  _reactionCheckAddAbs() {
    const e = this.settings.get("reaction_styles");
    return this.settings.get("reaction_data") && !this.has_custom_reaction_styles && !ce.contains(e, "abs") ? (this.settings.set("reaction_styles", e.concat("abs")), () => {
      this.map.set_status("Visualizing absolute value of reaction data. Change this option in Settings.", 5e3);
    }) : null;
  }
  /**
   * For documentation of this function, see docs/javascript_api.rst.
   */
  set_reaction_data(e) {
    this.settings.set("reaction_data", e), e && (this.settings._options.gene_data = null);
    var n = this._reactionCheckAddAbs();
    this._updateData(!0, !0, ["reaction"]), n ? n() : this.map.set_status("");
    const r = this.settings.get("disabled_buttons") || [], i = "Clear reaction data", s = "Clear gene data", a = r.indexOf(i);
    e && a !== -1 ? (r.splice(a, 1), r.indexOf(s) === -1 && r.push(s), this.settings.set("disabled_buttons", r)) : !e && a === -1 && (r.push(i), this.settings.set("disabled_buttons", r));
  }
  /**
   * For documentation of this function, see docs/javascript_api.rst.
   */
  set_gene_data(e, n = !1) {
    this.settings.set("gene_data", e), n && this.settings.set("show_gene_reaction_rules", !1), e && (this.settings._options.reaction_data = null, this.settings.set("show_gene_reaction_rules", !0)), this._updateData(!0, !0, ["reaction"]), this.map.set_status("");
    const r = this.settings.get("disabled_buttons") || [], i = r.indexOf("Clear gene data");
    i > -1 && e ? (r.splice(i, 1), r.indexOf("Clear reaction data") === -1 && r.push("Clear reaction data"), this.settings.set("disabled_buttons", r)) : i === -1 && !e && (r.push("Clear gene data"), this.settings.set("disabled_buttons", r));
  }
  /**
   * For documentation of this function, see docs/javascript_api.rst.
   */
  set_metabolite_data(e) {
    this.settings.set("metabolite_data", e), this._updateData(!0, !0, ["metabolite"]), this.map.set_status("");
    const n = this.settings.get("disabled_buttons") || [], r = "Clear metabolite data", i = n.indexOf(r);
    i > -1 && e ? (n.splice(i, 1), this.settings.set("disabled_buttons", n)) : i === -1 && !e && (n.push(r), this.settings.set("disabled_buttons", n));
  }
  _makeGeneDataObject(e, n, r) {
    const i = {};
    return n !== null && se.extend(i, n.reactions), r !== null && se.extend(i, r.reactions, !0), en(e, "gene_data", i);
  }
  /**
   * Clear the map
   */
  clear_map() {
    this.callback_manager.run("clear_map"), this.map.clearMapData(), this._updateData(!0, !0, ["reaction", "metabolite"], !1), this.map.draw_everything();
  }
  /**
   * Set data and settings for the model.
   * update_model: (Boolean) Update data for the model.
   * update_map: (Boolean) Update data for the map.
   * kind: (Optional, Default: all) An array defining which data is being updated
   * that can include any of: ['reaction', 'metabolite'].
   * should_draw: (Optional, Default: true) Whether to redraw the update sections
   * of the map.
   */
  _updateData(e = !1, n = !1, r = ["reaction", "metabolite"], i = !0) {
    const s = ce.contains(r, "reaction"), a = ce.contains(r, "metabolite");
    let l, u, f;
    a && n && this.map !== null && (l = en(
      this.settings.get("metabolite_data"),
      "metabolite_data"
    ), this.map.apply_metabolite_data_to_map(l), i && this.map.draw_all_nodes(!1)), s && (this.settings.get("reaction_data") && n && this.map !== null ? (u = en(
      this.settings.get("reaction_data"),
      "reaction_data"
    ), this.map.apply_reaction_data_to_map(u), i && this.map.draw_all_reactions(!1, !1)) : this.settings.get("gene_data") && n && this.map !== null ? (f = this._makeGeneDataObject(
      this.settings.get("gene_data"),
      this.cobra_model,
      this.map
    ), this.map.apply_gene_data_to_map(f), i && this.map.draw_all_reactions(!1, !1)) : n && this.map !== null && (this.map.apply_reaction_data_to_map(null), i && this.map.draw_all_reactions(!1, !1))), this.update_model_timer && clearTimeout(this.update_model_timer);
    const p = 5;
    this.update_model_timer = setTimeout(() => {
      a && e && this.cobra_model !== null && (l || (l = en(
        this.settings.get("metabolite_data"),
        "metabolite_data"
      )), this.cobra_model.apply_metabolite_data(
        l,
        this.settings.get("metabolite_styles"),
        this.settings.get("metabolite_compare_style")
      )), s && (this.settings.get("reaction_data") && e && this.cobra_model !== null ? (u || (u = en(
        this.settings.get("reaction_data"),
        "reaction_data"
      )), this.cobra_model.apply_reaction_data(
        u,
        this.settings.get("reaction_styles"),
        this.settings.get("reaction_compare_style")
      )) : this.settings.get("gene_data") && e && this.cobra_model !== null ? (f || (f = this._makeGeneDataObject(
        this.settings.get("gene_data"),
        this.cobra_model,
        this.map
      )), this.cobra_model.apply_gene_data(
        f,
        this.settings.get("reaction_styles"),
        this.settings.get("identifiers_on_map"),
        this.settings.get("reaction_compare_style"),
        this.settings.get("and_method_in_gene_reaction_rule")
      )) : e && this.cobra_model !== null && this.cobra_model.apply_reaction_data(
        null,
        this.settings.get("reaction_styles"),
        this.settings.get("reaction_compare_style")
      )), this.callback_manager.run(
        "update_data",
        null,
        e,
        n,
        r,
        i
      );
    }, p);
  }
  _createStatus(e) {
    this.status_bar = e.append("div").attr("id", "status");
  }
  _setupStatus(e) {
    e.callback_manager.set("set_status", (n) => this.status_bar.html(n));
  }
  _updateTooltipSetting(e) {
    this.map.behavior.toggleLabelMouseover(e && e.includes("label")), this.map.behavior.toggleObjectMouseover(e && e.includes("object"));
  }
  /**
   * Define keyboard shortcuts
   */
  getKeys() {
    const e = this.map, n = this.zoom_container;
    return {
      save: {
        key: "ctrl+s",
        target: e,
        fn: e.save
      },
      save_svg: {
        key: "ctrl+shift+s",
        target: e,
        fn: e.save_svg
      },
      save_png: {
        key: "ctrl+shift+p",
        target: e,
        fn: e.save_png
      },
      load_map: {
        key: "ctrl+o",
        fn: null
        // defined by button
      },
      convert_map: {
        target: e,
        fn: e.convert_map
      },
      load_model: {
        key: "ctrl+m",
        fn: null
        // defined by button
      },
      zoom_in_ctrl: {
        key: "ctrl+=",
        target: n,
        fn: n.zoom_in
      },
      zoom_in: {
        key: "=",
        target: n,
        fn: n.zoom_in,
        ignoreWithInput: !0
      },
      zoom_out_ctrl: {
        key: "ctrl+-",
        target: n,
        fn: n.zoom_out
      },
      zoom_out: {
        key: "-",
        target: n,
        fn: n.zoom_out,
        ignoreWithInput: !0
      },
      extent_nodes_ctrl: {
        key: "ctrl+0",
        target: e,
        fn: e.zoom_extent_nodes
      },
      extent_nodes: {
        key: "0",
        target: e,
        fn: e.zoom_extent_nodes,
        ignoreWithInput: !0
      },
      extent_canvas_ctrl: {
        key: "ctrl+1",
        target: e,
        fn: e.zoom_extent_canvas
      },
      extent_canvas: {
        key: "1",
        target: e,
        fn: e.zoom_extent_canvas,
        ignoreWithInput: !0
      },
      view_mode: {
        target: this,
        fn: this.view_mode,
        ignoreWithInput: !0
      },
      show_settings_ctrl: {
        key: "ctrl+,",
        fn: () => this.passPropsSettingsMenu({ display: !0 })
      },
      show_settings: {
        key: ",",
        fn: () => this.passPropsSettingsMenu({ display: !0 }),
        ignoreWithInput: !0
      },
      build_mode: {
        key: "n",
        target: this,
        fn: this.build_mode,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      zoom_mode: {
        key: "z",
        target: this,
        fn: this.zoom_mode,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      brush_mode: {
        key: "v",
        target: this,
        fn: this.brush_mode,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      rotate_mode: {
        key: "r",
        target: this,
        fn: this.rotate_mode,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      text_mode: {
        key: "t",
        target: this,
        fn: this.text_mode,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      toggle_beziers: {
        key: "b",
        target: e,
        fn: e.toggle_beziers,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      delete_ctrl: {
        key: "ctrl+backspace",
        target: e,
        fn: e.delete_selected,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      delete: {
        key: "backspace",
        target: e,
        fn: e.delete_selected,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      delete_del: {
        key: "del",
        target: e,
        fn: e.delete_selected,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      align_vertical: {
        key: "alt+l",
        target: e,
        fn: e.align_vertical
      },
      align_horizontal: {
        key: "shift+alt+l",
        target: e,
        fn: e.align_horizontal
      },
      toggle_primary: {
        key: "p",
        target: e,
        fn: e.toggle_selected_node_primary,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      cycle_primary: {
        key: "c",
        target: e,
        fn: e.cycle_primary_node,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      direction_arrow_right: {
        key: "right",
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.right,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      direction_arrow_down: {
        key: "down",
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.down,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      direction_arrow_left: {
        key: "left",
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.left,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      direction_arrow_up: {
        key: "up",
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.up,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      undo: {
        key: "ctrl+z",
        target: e.undo_stack,
        fn: e.undo_stack.undo,
        requires: "enable_editing"
      },
      redo: {
        key: "ctrl+shift+z",
        target: e.undo_stack,
        fn: e.undo_stack.redo,
        requires: "enable_editing"
      },
      select_all: {
        key: "ctrl+a",
        target: e,
        fn: e.select_all,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      select_none: {
        key: "ctrl+shift+a",
        target: e,
        fn: e.select_none,
        ignoreWithInput: !0,
        requires: "enable_editing"
      },
      invert_selection: {
        target: e,
        fn: e.invert_selection,
        requires: "enable_editing"
      },
      search_ctrl: {
        key: "ctrl+f",
        fn: () => this.passPropsSearchBar({ display: !0 }),
        requires: "enable_search"
      },
      search: {
        key: "f",
        fn: () => this.passPropsSearchBar({ display: !0 }),
        ignoreWithInput: !0,
        requires: "enable_search"
      }
    };
  }
  /**
   * Ask if the user wants to exit the page (to avoid unplanned refresh).
   */
  _setupConfirmBeforeExit() {
    window.onbeforeunload = (e) => this.settings.get("never_ask_before_quit") ? null : "You will lose any unsaved changes.";
  }
  /**
   * Toggle full screen mode.
   */
  full_screen() {
    const e = [
      "menu",
      "scroll_behavior",
      "enable_editing",
      "enable_keys",
      "enable_tooltips"
    ];
    if (this.isFullScreen) {
      if (Pe("html").classed("fill-screen", !1), Pe("body").classed("fill-screen", !1), this.selection.classed("fill-screen-div", !1), this.isFullScreen = !1, this.clearFullScreenEscape && (this.clearFullScreenEscape(), this.clearFullScreenEscape = null), this.savedFullScreenParent) {
        const n = this.savedFullScreenParent.node();
        n.insertBefore(this.selection.remove().node(), n.firstChild), this.savedFullScreenParent = null;
      }
      this.savedFullScreenSettings !== null && ce.mapObject(this.savedFullScreenSettings, (n, r) => {
        this.settings.set(r, n);
      }), this.savedFullScreenSettings = null;
    } else {
      const n = this.settings.get("full_screen_button");
      ce.isObject(n) && (this.savedFullScreenSettings = ce.chain(n).pairs().map(([i, s]) => {
        if (ce.contains(e, i)) {
          const a = this.settings.get(i);
          return this.settings.set(i, s), [i, a];
        } else
          return console.warn(`${i} not recognized as an option for full_screen_button`), [null, null];
      }).filter(([i, s]) => i).object().value()), Pe("html").classed("fill-screen", !0), Pe("body").classed("fill-screen", !0), this.selection.classed("fill-screen-div", !0), this.isFullScreen = !0, this.savedFullScreenParent = Pe(this.selection.node().parentNode);
      const r = Pe("body").node();
      r.insertBefore(this.selection.remove().node(), r.firstChild), this.clearFullScreenEscape = this.map.key_manager.addEscapeListener(
        () => this.full_screen()
      );
    }
    this.map.zoom_extent_canvas(), this.passPropsButtonPanel({ isFullScreen: this.isFullScreen }), this.passPropsMenuBar({ isFullScreen: this.isFullScreen });
  }
}
const _g = se.class_with_optional_new(gg);
function mg({ model: t, el: e }) {
  const n = Pe(e).append("div");
  n.style("height", t.get("height") + "px");
  const r = (l) => l && l !== "null" ? JSON.parse(l) : null, i = t.get("_options_json"), s = i ? JSON.parse(i) : {}, a = new _g(
    r(t.get("map_json")),
    null,
    // model_json never crosses the bridge
    null,
    // embedded_css: Builder handles its own CSS via ?raw
    n,
    {
      ...s,
      reaction_data: r(t.get("reaction_data")),
      metabolite_data: r(t.get("metabolite_data")),
      gene_data: r(t.get("gene_data")),
      first_load_callback: (l) => {
        l.map.callback_manager.set("select_selectable", (u, f) => {
          f && f.node_type === "metabolite" && f.bigg_id && (t.set("selected_metabolite", f.bigg_id), t.save_changes());
        }), l.map.callback_manager.set("show_tooltip.escher_widget", (u, f) => {
          (u === "reaction_object" || u === "reaction_label") && f && f.bigg_id && (t.set("selected_reaction", f.bigg_id), t.save_changes());
        });
      }
    }
  );
  t.on("change:height", () => {
    n.style("height", t.get("height") + "px");
  }), t.on("change:map_json", () => {
    a.load_map(r(t.get("map_json")));
  }), t.on("change:reaction_data", () => {
    a.set_reaction_data(r(t.get("reaction_data")));
  }), t.on("change:metabolite_data", () => {
    a.set_metabolite_data(r(t.get("metabolite_data")));
  }), t.on("change:gene_data", () => {
    a.set_gene_data(r(t.get("gene_data")));
  });
}
export {
  mg as render
};
//# sourceMappingURL=escher-widget.js.map
