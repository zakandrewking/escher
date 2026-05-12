var kt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ln(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Xr, ys;
function wl() {
  if (ys) return Xr;
  ys = 1;
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
    var a = i.replace(/>\s{0,}</g, "><").replace(/</g, "~::~<").replace(/\s*xmlns\:/g, "~::~xmlns:").replace(/\s*xmlns\=/g, "~::~xmlns=").split("~::~"), l = a.length, u = !1, h = 0, p = "", m = 0, g = s ? t(s) : this.shift;
    for (m = 0; m < l; m++)
      a[m].search(/<!/) > -1 ? (p += g[h] + a[m], u = !0, (a[m].search(/-->/) > -1 || a[m].search(/\]>/) > -1 || a[m].search(/!DOCTYPE/) > -1) && (u = !1)) : a[m].search(/-->/) > -1 || a[m].search(/\]>/) > -1 ? (p += a[m], u = !1) : /^<\w/.exec(a[m - 1]) && /^<\/\w/.exec(a[m]) && /^<[\w:\-\.\,]+/.exec(a[m - 1]) == /^<\/[\w:\-\.\,]+/.exec(a[m])[0].replace("/", "") ? (p += a[m], u || h--) : a[m].search(/<\w/) > -1 && a[m].search(/<\//) == -1 && a[m].search(/\/>/) == -1 ? p = u ? p += a[m] : p += g[h++] + a[m] : a[m].search(/<\w/) > -1 && a[m].search(/<\//) > -1 ? p = u ? p += a[m] : p += g[h] + a[m] : a[m].search(/<\//) > -1 ? p = u ? p += a[m] : p += g[--h] + a[m] : a[m].search(/\/>/) > -1 ? p = u ? p += a[m] : p += g[h] + a[m] : a[m].search(/<\?/) > -1 || a[m].search(/xmlns\:/) > -1 || a[m].search(/xmlns\=/) > -1 ? p += g[h] + a[m] : p += a[m];
    return p[0] == `
` ? p.slice(1) : p;
  }, e.prototype.json = function(i, a) {
    var a = a || this.step;
    return typeof JSON > "u" ? i : typeof i == "string" ? JSON.stringify(JSON.parse(i), null, a) : typeof i == "object" ? JSON.stringify(i, null, a) : i;
  }, e.prototype.css = function(i, s) {
    var a = i.replace(/\s{1,}/g, " ").replace(/\{/g, "{~::~").replace(/\}/g, "~::~}~::~").replace(/\;/g, ";~::~").replace(/\/\*/g, "~::~/*").replace(/\*\//g, "*/~::~").replace(/~::~\s{0,}~::~/g, "~::~").split("~::~"), l = a.length, u = 0, h = "", p = 0, m = s ? t(s) : this.shift;
    for (p = 0; p < l; p++)
      /\{/.exec(a[p]) ? h += m[u++] + a[p] : /\}/.exec(a[p]) ? h += m[--u] + a[p] : (/\*\\/.exec(a[p]), h += m[u] + a[p]);
    return h.replace(/^\n{1,}/, "");
  };
  function n(i, s) {
    return s - (i.replace(/\(/g, "").length - i.replace(/\)/g, "").length);
  }
  function r(i, s) {
    return i.replace(/\s{1,}/g, " ").replace(/ AND /ig, "~::~" + s + s + "AND ").replace(/ BETWEEN /ig, "~::~" + s + "BETWEEN ").replace(/ CASE /ig, "~::~" + s + "CASE ").replace(/ ELSE /ig, "~::~" + s + "ELSE ").replace(/ END /ig, "~::~" + s + "END ").replace(/ FROM /ig, "~::~FROM ").replace(/ GROUP\s{1,}BY/ig, "~::~GROUP BY ").replace(/ HAVING /ig, "~::~HAVING ").replace(/ IN /ig, " IN ").replace(/ JOIN /ig, "~::~JOIN ").replace(/ CROSS~::~{1,}JOIN /ig, "~::~CROSS JOIN ").replace(/ INNER~::~{1,}JOIN /ig, "~::~INNER JOIN ").replace(/ LEFT~::~{1,}JOIN /ig, "~::~LEFT JOIN ").replace(/ RIGHT~::~{1,}JOIN /ig, "~::~RIGHT JOIN ").replace(/ ON /ig, "~::~" + s + "ON ").replace(/ OR /ig, "~::~" + s + s + "OR ").replace(/ ORDER\s{1,}BY/ig, "~::~ORDER BY ").replace(/ OVER /ig, "~::~" + s + "OVER ").replace(/\(\s{0,}SELECT /ig, "~::~(SELECT ").replace(/\)\s{0,}SELECT /ig, ")~::~SELECT ").replace(/ THEN /ig, " THEN~::~" + s).replace(/ UNION /ig, "~::~UNION~::~").replace(/ USING /ig, "~::~USING ").replace(/ WHEN /ig, "~::~" + s + "WHEN ").replace(/ WHERE /ig, "~::~WHERE ").replace(/ WITH /ig, "~::~WITH ").replace(/ ALL /ig, " ALL ").replace(/ AS /ig, " AS ").replace(/ ASC /ig, " ASC ").replace(/ DESC /ig, " DESC ").replace(/ DISTINCT /ig, " DISTINCT ").replace(/ EXISTS /ig, " EXISTS ").replace(/ NOT /ig, " NOT ").replace(/ NULL /ig, " NULL ").replace(/ LIKE /ig, " LIKE ").replace(/\s{0,}SELECT /ig, "SELECT ").replace(/\s{0,}UPDATE /ig, "UPDATE ").replace(/ SET /ig, " SET ").replace(/~::~{1,}/g, "~::~").split("~::~");
  }
  return e.prototype.sql = function(i, s) {
    var a = i.replace(/\s{1,}/g, " ").replace(/\'/ig, "~::~'").split("~::~"), l = a.length, u = [], h = 0, p = this.step, m = 0, g = "", _ = 0, E = s ? t(s) : this.shift;
    for (_ = 0; _ < l; _++)
      _ % 2 ? u = u.concat(a[_]) : u = u.concat(r(a[_], p));
    for (l = u.length, _ = 0; _ < l; _++)
      m = n(u[_], m), /\s{0,}\s{0,}SELECT\s{0,}/.exec(u[_]) && (u[_] = u[_].replace(/\,/g, `,
` + p + p)), /\s{0,}\s{0,}SET\s{0,}/.exec(u[_]) && (u[_] = u[_].replace(/\,/g, `,
` + p + p)), /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(u[_]) ? (h++, g += E[h] + u[_]) : /\'/.exec(u[_]) ? (m < 1 && h && h--, g += u[_]) : (g += E[h] + u[_], m < 1 && h && h--);
    return g = g.replace(/^\n{1,}/, "").replace(/\n{1,}/g, `
`), g;
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
  }, Xr = new e(), Xr;
}
var xl = wl();
const Sl = /* @__PURE__ */ ln(xl);
var Yn = { exports: {} }, ws;
function Ml() {
  return ws || (ws = 1, (function(t, e) {
    (function() {
      var n = typeof self == "object" && self.self === self && self || typeof kt == "object" && kt.global === kt && kt || this || {}, r = n._, i = Array.prototype, s = Object.prototype, a = typeof Symbol < "u" ? Symbol.prototype : null, l = i.push, u = i.slice, h = s.toString, p = s.hasOwnProperty, m = Array.isArray, g = Object.keys, _ = Object.create, E = function() {
      }, c = function(f) {
        if (f instanceof c) return f;
        if (!(this instanceof c)) return new c(f);
        this._wrapped = f;
      };
      e.nodeType ? n._ = c : (!t.nodeType && t.exports && (e = t.exports = c), e._ = c), c.VERSION = "1.9.1";
      var w = function(f, y, I) {
        if (y === void 0) return f;
        switch (I ?? 3) {
          case 1:
            return function(D) {
              return f.call(y, D);
            };
          // The 2-argument case is omitted because we’re not using it.
          case 3:
            return function(D, P, F) {
              return f.call(y, D, P, F);
            };
          case 4:
            return function(D, P, F, $) {
              return f.call(y, D, P, F, $);
            };
        }
        return function() {
          return f.apply(y, arguments);
        };
      }, T, A = function(f, y, I) {
        return c.iteratee !== T ? c.iteratee(f, y) : f == null ? c.identity : c.isFunction(f) ? w(f, y, I) : c.isObject(f) && !c.isArray(f) ? c.matcher(f) : c.property(f);
      };
      c.iteratee = T = function(f, y) {
        return A(f, y, 1 / 0);
      };
      var b = function(f, y) {
        return y = y == null ? f.length - 1 : +y, function() {
          for (var I = Math.max(arguments.length - y, 0), D = Array(I), P = 0; P < I; P++)
            D[P] = arguments[P + y];
          switch (y) {
            case 0:
              return f.call(this, D);
            case 1:
              return f.call(this, arguments[0], D);
            case 2:
              return f.call(this, arguments[0], arguments[1], D);
          }
          var F = Array(y + 1);
          for (P = 0; P < y; P++)
            F[P] = arguments[P];
          return F[y] = D, f.apply(this, F);
        };
      }, S = function(f) {
        if (!c.isObject(f)) return {};
        if (_) return _(f);
        E.prototype = f;
        var y = new E();
        return E.prototype = null, y;
      }, x = function(f) {
        return function(y) {
          return y == null ? void 0 : y[f];
        };
      }, z = function(f, y) {
        return f != null && p.call(f, y);
      }, C = function(f, y) {
        for (var I = y.length, D = 0; D < I; D++) {
          if (f == null) return;
          f = f[y[D]];
        }
        return I ? f : void 0;
      }, N = Math.pow(2, 53) - 1, B = x("length"), V = function(f) {
        var y = B(f);
        return typeof y == "number" && y >= 0 && y <= N;
      };
      c.each = c.forEach = function(f, y, I) {
        y = w(y, I);
        var D, P;
        if (V(f))
          for (D = 0, P = f.length; D < P; D++)
            y(f[D], D, f);
        else {
          var F = c.keys(f);
          for (D = 0, P = F.length; D < P; D++)
            y(f[F[D]], F[D], f);
        }
        return f;
      }, c.map = c.collect = function(f, y, I) {
        y = A(y, I);
        for (var D = !V(f) && c.keys(f), P = (D || f).length, F = Array(P), $ = 0; $ < P; $++) {
          var ee = D ? D[$] : $;
          F[$] = y(f[ee], ee, f);
        }
        return F;
      };
      var R = function(f) {
        var y = function(I, D, P, F) {
          var $ = !V(I) && c.keys(I), ee = ($ || I).length, fe = f > 0 ? 0 : ee - 1;
          for (F || (P = I[$ ? $[fe] : fe], fe += f); fe >= 0 && fe < ee; fe += f) {
            var we = $ ? $[fe] : fe;
            P = D(P, I[we], we, I);
          }
          return P;
        };
        return function(I, D, P, F) {
          var $ = arguments.length >= 3;
          return y(I, w(D, F, 4), P, $);
        };
      };
      c.reduce = c.foldl = c.inject = R(1), c.reduceRight = c.foldr = R(-1), c.find = c.detect = function(f, y, I) {
        var D = V(f) ? c.findIndex : c.findKey, P = D(f, y, I);
        if (P !== void 0 && P !== -1) return f[P];
      }, c.filter = c.select = function(f, y, I) {
        var D = [];
        return y = A(y, I), c.each(f, function(P, F, $) {
          y(P, F, $) && D.push(P);
        }), D;
      }, c.reject = function(f, y, I) {
        return c.filter(f, c.negate(A(y)), I);
      }, c.every = c.all = function(f, y, I) {
        y = A(y, I);
        for (var D = !V(f) && c.keys(f), P = (D || f).length, F = 0; F < P; F++) {
          var $ = D ? D[F] : F;
          if (!y(f[$], $, f)) return !1;
        }
        return !0;
      }, c.some = c.any = function(f, y, I) {
        y = A(y, I);
        for (var D = !V(f) && c.keys(f), P = (D || f).length, F = 0; F < P; F++) {
          var $ = D ? D[F] : F;
          if (y(f[$], $, f)) return !0;
        }
        return !1;
      }, c.contains = c.includes = c.include = function(f, y, I, D) {
        return V(f) || (f = c.values(f)), (typeof I != "number" || D) && (I = 0), c.indexOf(f, y, I) >= 0;
      }, c.invoke = b(function(f, y, I) {
        var D, P;
        return c.isFunction(y) ? P = y : c.isArray(y) && (D = y.slice(0, -1), y = y[y.length - 1]), c.map(f, function(F) {
          var $ = P;
          if (!$) {
            if (D && D.length && (F = C(F, D)), F == null) return;
            $ = F[y];
          }
          return $ == null ? $ : $.apply(F, I);
        });
      }), c.pluck = function(f, y) {
        return c.map(f, c.property(y));
      }, c.where = function(f, y) {
        return c.filter(f, c.matcher(y));
      }, c.findWhere = function(f, y) {
        return c.find(f, c.matcher(y));
      }, c.max = function(f, y, I) {
        var D = -1 / 0, P = -1 / 0, F, $;
        if (y == null || typeof y == "number" && typeof f[0] != "object" && f != null) {
          f = V(f) ? f : c.values(f);
          for (var ee = 0, fe = f.length; ee < fe; ee++)
            F = f[ee], F != null && F > D && (D = F);
        } else
          y = A(y, I), c.each(f, function(we, Oe, Re) {
            $ = y(we, Oe, Re), ($ > P || $ === -1 / 0 && D === -1 / 0) && (D = we, P = $);
          });
        return D;
      }, c.min = function(f, y, I) {
        var D = 1 / 0, P = 1 / 0, F, $;
        if (y == null || typeof y == "number" && typeof f[0] != "object" && f != null) {
          f = V(f) ? f : c.values(f);
          for (var ee = 0, fe = f.length; ee < fe; ee++)
            F = f[ee], F != null && F < D && (D = F);
        } else
          y = A(y, I), c.each(f, function(we, Oe, Re) {
            $ = y(we, Oe, Re), ($ < P || $ === 1 / 0 && D === 1 / 0) && (D = we, P = $);
          });
        return D;
      }, c.shuffle = function(f) {
        return c.sample(f, 1 / 0);
      }, c.sample = function(f, y, I) {
        if (y == null || I)
          return V(f) || (f = c.values(f)), f[c.random(f.length - 1)];
        var D = V(f) ? c.clone(f) : c.values(f), P = B(D);
        y = Math.max(Math.min(y, P), 0);
        for (var F = P - 1, $ = 0; $ < y; $++) {
          var ee = c.random($, F), fe = D[$];
          D[$] = D[ee], D[ee] = fe;
        }
        return D.slice(0, y);
      }, c.sortBy = function(f, y, I) {
        var D = 0;
        return y = A(y, I), c.pluck(c.map(f, function(P, F, $) {
          return {
            value: P,
            index: D++,
            criteria: y(P, F, $)
          };
        }).sort(function(P, F) {
          var $ = P.criteria, ee = F.criteria;
          if ($ !== ee) {
            if ($ > ee || $ === void 0) return 1;
            if ($ < ee || ee === void 0) return -1;
          }
          return P.index - F.index;
        }), "value");
      };
      var j = function(f, y) {
        return function(I, D, P) {
          var F = y ? [[], []] : {};
          return D = A(D, P), c.each(I, function($, ee) {
            var fe = D($, ee, I);
            f(F, $, fe);
          }), F;
        };
      };
      c.groupBy = j(function(f, y, I) {
        z(f, I) ? f[I].push(y) : f[I] = [y];
      }), c.indexBy = j(function(f, y, I) {
        f[I] = y;
      }), c.countBy = j(function(f, y, I) {
        z(f, I) ? f[I]++ : f[I] = 1;
      });
      var O = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
      c.toArray = function(f) {
        return f ? c.isArray(f) ? u.call(f) : c.isString(f) ? f.match(O) : V(f) ? c.map(f, c.identity) : c.values(f) : [];
      }, c.size = function(f) {
        return f == null ? 0 : V(f) ? f.length : c.keys(f).length;
      }, c.partition = j(function(f, y, I) {
        f[I ? 0 : 1].push(y);
      }, !0), c.first = c.head = c.take = function(f, y, I) {
        return f == null || f.length < 1 ? y == null ? void 0 : [] : y == null || I ? f[0] : c.initial(f, f.length - y);
      }, c.initial = function(f, y, I) {
        return u.call(f, 0, Math.max(0, f.length - (y == null || I ? 1 : y)));
      }, c.last = function(f, y, I) {
        return f == null || f.length < 1 ? y == null ? void 0 : [] : y == null || I ? f[f.length - 1] : c.rest(f, Math.max(0, f.length - y));
      }, c.rest = c.tail = c.drop = function(f, y, I) {
        return u.call(f, y == null || I ? 1 : y);
      }, c.compact = function(f) {
        return c.filter(f, Boolean);
      };
      var W = function(f, y, I, D) {
        D = D || [];
        for (var P = D.length, F = 0, $ = B(f); F < $; F++) {
          var ee = f[F];
          if (V(ee) && (c.isArray(ee) || c.isArguments(ee)))
            if (y)
              for (var fe = 0, we = ee.length; fe < we; ) D[P++] = ee[fe++];
            else
              W(ee, y, I, D), P = D.length;
          else I || (D[P++] = ee);
        }
        return D;
      };
      c.flatten = function(f, y) {
        return W(f, y, !1);
      }, c.without = b(function(f, y) {
        return c.difference(f, y);
      }), c.uniq = c.unique = function(f, y, I, D) {
        c.isBoolean(y) || (D = I, I = y, y = !1), I != null && (I = A(I, D));
        for (var P = [], F = [], $ = 0, ee = B(f); $ < ee; $++) {
          var fe = f[$], we = I ? I(fe, $, f) : fe;
          y && !I ? ((!$ || F !== we) && P.push(fe), F = we) : I ? c.contains(F, we) || (F.push(we), P.push(fe)) : c.contains(P, fe) || P.push(fe);
        }
        return P;
      }, c.union = b(function(f) {
        return c.uniq(W(f, !0, !0));
      }), c.intersection = function(f) {
        for (var y = [], I = arguments.length, D = 0, P = B(f); D < P; D++) {
          var F = f[D];
          if (!c.contains(y, F)) {
            var $;
            for ($ = 1; $ < I && c.contains(arguments[$], F); $++)
              ;
            $ === I && y.push(F);
          }
        }
        return y;
      }, c.difference = b(function(f, y) {
        return y = W(y, !0, !0), c.filter(f, function(I) {
          return !c.contains(y, I);
        });
      }), c.unzip = function(f) {
        for (var y = f && c.max(f, B).length || 0, I = Array(y), D = 0; D < y; D++)
          I[D] = c.pluck(f, D);
        return I;
      }, c.zip = b(c.unzip), c.object = function(f, y) {
        for (var I = {}, D = 0, P = B(f); D < P; D++)
          y ? I[f[D]] = y[D] : I[f[D][0]] = f[D][1];
        return I;
      };
      var Y = function(f) {
        return function(y, I, D) {
          I = A(I, D);
          for (var P = B(y), F = f > 0 ? 0 : P - 1; F >= 0 && F < P; F += f)
            if (I(y[F], F, y)) return F;
          return -1;
        };
      };
      c.findIndex = Y(1), c.findLastIndex = Y(-1), c.sortedIndex = function(f, y, I, D) {
        I = A(I, D, 1);
        for (var P = I(y), F = 0, $ = B(f); F < $; ) {
          var ee = Math.floor((F + $) / 2);
          I(f[ee]) < P ? F = ee + 1 : $ = ee;
        }
        return F;
      };
      var Z = function(f, y, I) {
        return function(D, P, F) {
          var $ = 0, ee = B(D);
          if (typeof F == "number")
            f > 0 ? $ = F >= 0 ? F : Math.max(F + ee, $) : ee = F >= 0 ? Math.min(F + 1, ee) : F + ee + 1;
          else if (I && F && ee)
            return F = I(D, P), D[F] === P ? F : -1;
          if (P !== P)
            return F = y(u.call(D, $, ee), c.isNaN), F >= 0 ? F + $ : -1;
          for (F = f > 0 ? $ : ee - 1; F >= 0 && F < ee; F += f)
            if (D[F] === P) return F;
          return -1;
        };
      };
      c.indexOf = Z(1, c.findIndex, c.sortedIndex), c.lastIndexOf = Z(-1, c.findLastIndex), c.range = function(f, y, I) {
        y == null && (y = f || 0, f = 0), I || (I = y < f ? -1 : 1);
        for (var D = Math.max(Math.ceil((y - f) / I), 0), P = Array(D), F = 0; F < D; F++, f += I)
          P[F] = f;
        return P;
      }, c.chunk = function(f, y) {
        if (y == null || y < 1) return [];
        for (var I = [], D = 0, P = f.length; D < P; )
          I.push(u.call(f, D, D += y));
        return I;
      };
      var H = function(f, y, I, D, P) {
        if (!(D instanceof y)) return f.apply(I, P);
        var F = S(f.prototype), $ = f.apply(F, P);
        return c.isObject($) ? $ : F;
      };
      c.bind = b(function(f, y, I) {
        if (!c.isFunction(f)) throw new TypeError("Bind must be called on a function");
        var D = b(function(P) {
          return H(f, D, y, this, I.concat(P));
        });
        return D;
      }), c.partial = b(function(f, y) {
        var I = c.partial.placeholder, D = function() {
          for (var P = 0, F = y.length, $ = Array(F), ee = 0; ee < F; ee++)
            $[ee] = y[ee] === I ? arguments[P++] : y[ee];
          for (; P < arguments.length; ) $.push(arguments[P++]);
          return H(f, D, this, this, $);
        };
        return D;
      }), c.partial.placeholder = c, c.bindAll = b(function(f, y) {
        y = W(y, !1, !1);
        var I = y.length;
        if (I < 1) throw new Error("bindAll must be passed function names");
        for (; I--; ) {
          var D = y[I];
          f[D] = c.bind(f[D], f);
        }
      }), c.memoize = function(f, y) {
        var I = function(D) {
          var P = I.cache, F = "" + (y ? y.apply(this, arguments) : D);
          return z(P, F) || (P[F] = f.apply(this, arguments)), P[F];
        };
        return I.cache = {}, I;
      }, c.delay = b(function(f, y, I) {
        return setTimeout(function() {
          return f.apply(null, I);
        }, y);
      }), c.defer = c.partial(c.delay, c, 1), c.throttle = function(f, y, I) {
        var D, P, F, $, ee = 0;
        I || (I = {});
        var fe = function() {
          ee = I.leading === !1 ? 0 : c.now(), D = null, $ = f.apply(P, F), D || (P = F = null);
        }, we = function() {
          var Oe = c.now();
          !ee && I.leading === !1 && (ee = Oe);
          var Re = y - (Oe - ee);
          return P = this, F = arguments, Re <= 0 || Re > y ? (D && (clearTimeout(D), D = null), ee = Oe, $ = f.apply(P, F), D || (P = F = null)) : !D && I.trailing !== !1 && (D = setTimeout(fe, Re)), $;
        };
        return we.cancel = function() {
          clearTimeout(D), ee = 0, D = P = F = null;
        }, we;
      }, c.debounce = function(f, y, I) {
        var D, P, F = function(ee, fe) {
          D = null, fe && (P = f.apply(ee, fe));
        }, $ = b(function(ee) {
          if (D && clearTimeout(D), I) {
            var fe = !D;
            D = setTimeout(F, y), fe && (P = f.apply(this, ee));
          } else
            D = c.delay(F, y, this, ee);
          return P;
        });
        return $.cancel = function() {
          clearTimeout(D), D = null;
        }, $;
      }, c.wrap = function(f, y) {
        return c.partial(y, f);
      }, c.negate = function(f) {
        return function() {
          return !f.apply(this, arguments);
        };
      }, c.compose = function() {
        var f = arguments, y = f.length - 1;
        return function() {
          for (var I = y, D = f[y].apply(this, arguments); I--; ) D = f[I].call(this, D);
          return D;
        };
      }, c.after = function(f, y) {
        return function() {
          if (--f < 1)
            return y.apply(this, arguments);
        };
      }, c.before = function(f, y) {
        var I;
        return function() {
          return --f > 0 && (I = y.apply(this, arguments)), f <= 1 && (y = null), I;
        };
      }, c.once = c.partial(c.before, 2), c.restArguments = b;
      var ne = !{ toString: null }.propertyIsEnumerable("toString"), he = [
        "valueOf",
        "isPrototypeOf",
        "toString",
        "propertyIsEnumerable",
        "hasOwnProperty",
        "toLocaleString"
      ], ue = function(f, y) {
        var I = he.length, D = f.constructor, P = c.isFunction(D) && D.prototype || s, F = "constructor";
        for (z(f, F) && !c.contains(y, F) && y.push(F); I--; )
          F = he[I], F in f && f[F] !== P[F] && !c.contains(y, F) && y.push(F);
      };
      c.keys = function(f) {
        if (!c.isObject(f)) return [];
        if (g) return g(f);
        var y = [];
        for (var I in f) z(f, I) && y.push(I);
        return ne && ue(f, y), y;
      }, c.allKeys = function(f) {
        if (!c.isObject(f)) return [];
        var y = [];
        for (var I in f) y.push(I);
        return ne && ue(f, y), y;
      }, c.values = function(f) {
        for (var y = c.keys(f), I = y.length, D = Array(I), P = 0; P < I; P++)
          D[P] = f[y[P]];
        return D;
      }, c.mapObject = function(f, y, I) {
        y = A(y, I);
        for (var D = c.keys(f), P = D.length, F = {}, $ = 0; $ < P; $++) {
          var ee = D[$];
          F[ee] = y(f[ee], ee, f);
        }
        return F;
      }, c.pairs = function(f) {
        for (var y = c.keys(f), I = y.length, D = Array(I), P = 0; P < I; P++)
          D[P] = [y[P], f[y[P]]];
        return D;
      }, c.invert = function(f) {
        for (var y = {}, I = c.keys(f), D = 0, P = I.length; D < P; D++)
          y[f[I[D]]] = I[D];
        return y;
      }, c.functions = c.methods = function(f) {
        var y = [];
        for (var I in f)
          c.isFunction(f[I]) && y.push(I);
        return y.sort();
      };
      var J = function(f, y) {
        return function(I) {
          var D = arguments.length;
          if (y && (I = Object(I)), D < 2 || I == null) return I;
          for (var P = 1; P < D; P++)
            for (var F = arguments[P], $ = f(F), ee = $.length, fe = 0; fe < ee; fe++) {
              var we = $[fe];
              (!y || I[we] === void 0) && (I[we] = F[we]);
            }
          return I;
        };
      };
      c.extend = J(c.allKeys), c.extendOwn = c.assign = J(c.keys), c.findKey = function(f, y, I) {
        y = A(y, I);
        for (var D = c.keys(f), P, F = 0, $ = D.length; F < $; F++)
          if (P = D[F], y(f[P], P, f)) return P;
      };
      var re = function(f, y, I) {
        return y in I;
      };
      c.pick = b(function(f, y) {
        var I = {}, D = y[0];
        if (f == null) return I;
        c.isFunction(D) ? (y.length > 1 && (D = w(D, y[1])), y = c.allKeys(f)) : (D = re, y = W(y, !1, !1), f = Object(f));
        for (var P = 0, F = y.length; P < F; P++) {
          var $ = y[P], ee = f[$];
          D(ee, $, f) && (I[$] = ee);
        }
        return I;
      }), c.omit = b(function(f, y) {
        var I = y[0], D;
        return c.isFunction(I) ? (I = c.negate(I), y.length > 1 && (D = y[1])) : (y = c.map(W(y, !1, !1), String), I = function(P, F) {
          return !c.contains(y, F);
        }), c.pick(f, I, D);
      }), c.defaults = J(c.allKeys, !0), c.create = function(f, y) {
        var I = S(f);
        return y && c.extendOwn(I, y), I;
      }, c.clone = function(f) {
        return c.isObject(f) ? c.isArray(f) ? f.slice() : c.extend({}, f) : f;
      }, c.tap = function(f, y) {
        return y(f), f;
      }, c.isMatch = function(f, y) {
        var I = c.keys(y), D = I.length;
        if (f == null) return !D;
        for (var P = Object(f), F = 0; F < D; F++) {
          var $ = I[F];
          if (y[$] !== P[$] || !($ in P)) return !1;
        }
        return !0;
      };
      var le, ae;
      le = function(f, y, I, D) {
        if (f === y) return f !== 0 || 1 / f === 1 / y;
        if (f == null || y == null) return !1;
        if (f !== f) return y !== y;
        var P = typeof f;
        return P !== "function" && P !== "object" && typeof y != "object" ? !1 : ae(f, y, I, D);
      }, ae = function(f, y, I, D) {
        f instanceof c && (f = f._wrapped), y instanceof c && (y = y._wrapped);
        var P = h.call(f);
        if (P !== h.call(y)) return !1;
        switch (P) {
          // Strings, numbers, regular expressions, dates, and booleans are compared by value.
          case "[object RegExp]":
          // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
          case "[object String]":
            return "" + f == "" + y;
          case "[object Number]":
            return +f != +f ? +y != +y : +f == 0 ? 1 / +f === 1 / y : +f == +y;
          case "[object Date]":
          case "[object Boolean]":
            return +f == +y;
          case "[object Symbol]":
            return a.valueOf.call(f) === a.valueOf.call(y);
        }
        var F = P === "[object Array]";
        if (!F) {
          if (typeof f != "object" || typeof y != "object") return !1;
          var $ = f.constructor, ee = y.constructor;
          if ($ !== ee && !(c.isFunction($) && $ instanceof $ && c.isFunction(ee) && ee instanceof ee) && "constructor" in f && "constructor" in y)
            return !1;
        }
        I = I || [], D = D || [];
        for (var fe = I.length; fe--; )
          if (I[fe] === f) return D[fe] === y;
        if (I.push(f), D.push(y), F) {
          if (fe = f.length, fe !== y.length) return !1;
          for (; fe--; )
            if (!le(f[fe], y[fe], I, D)) return !1;
        } else {
          var we = c.keys(f), Oe;
          if (fe = we.length, c.keys(y).length !== fe) return !1;
          for (; fe--; )
            if (Oe = we[fe], !(z(y, Oe) && le(f[Oe], y[Oe], I, D))) return !1;
        }
        return I.pop(), D.pop(), !0;
      }, c.isEqual = function(f, y) {
        return le(f, y);
      }, c.isEmpty = function(f) {
        return f == null ? !0 : V(f) && (c.isArray(f) || c.isString(f) || c.isArguments(f)) ? f.length === 0 : c.keys(f).length === 0;
      }, c.isElement = function(f) {
        return !!(f && f.nodeType === 1);
      }, c.isArray = m || function(f) {
        return h.call(f) === "[object Array]";
      }, c.isObject = function(f) {
        var y = typeof f;
        return y === "function" || y === "object" && !!f;
      }, c.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error", "Symbol", "Map", "WeakMap", "Set", "WeakSet"], function(f) {
        c["is" + f] = function(y) {
          return h.call(y) === "[object " + f + "]";
        };
      }), c.isArguments(arguments) || (c.isArguments = function(f) {
        return z(f, "callee");
      });
      var ce = n.document && n.document.childNodes;
      typeof /./ != "function" && typeof Int8Array != "object" && typeof ce != "function" && (c.isFunction = function(f) {
        return typeof f == "function" || !1;
      }), c.isFinite = function(f) {
        return !c.isSymbol(f) && isFinite(f) && !isNaN(parseFloat(f));
      }, c.isNaN = function(f) {
        return c.isNumber(f) && isNaN(f);
      }, c.isBoolean = function(f) {
        return f === !0 || f === !1 || h.call(f) === "[object Boolean]";
      }, c.isNull = function(f) {
        return f === null;
      }, c.isUndefined = function(f) {
        return f === void 0;
      }, c.has = function(f, y) {
        if (!c.isArray(y))
          return z(f, y);
        for (var I = y.length, D = 0; D < I; D++) {
          var P = y[D];
          if (f == null || !p.call(f, P))
            return !1;
          f = f[P];
        }
        return !!I;
      }, c.noConflict = function() {
        return n._ = r, this;
      }, c.identity = function(f) {
        return f;
      }, c.constant = function(f) {
        return function() {
          return f;
        };
      }, c.noop = function() {
      }, c.property = function(f) {
        return c.isArray(f) ? function(y) {
          return C(y, f);
        } : x(f);
      }, c.propertyOf = function(f) {
        return f == null ? function() {
        } : function(y) {
          return c.isArray(y) ? C(f, y) : f[y];
        };
      }, c.matcher = c.matches = function(f) {
        return f = c.extendOwn({}, f), function(y) {
          return c.isMatch(y, f);
        };
      }, c.times = function(f, y, I) {
        var D = Array(Math.max(0, f));
        y = w(y, I, 1);
        for (var P = 0; P < f; P++) D[P] = y(P);
        return D;
      }, c.random = function(f, y) {
        return y == null && (y = f, f = 0), f + Math.floor(Math.random() * (y - f + 1));
      }, c.now = Date.now || function() {
        return (/* @__PURE__ */ new Date()).getTime();
      };
      var Ne = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      }, K = c.invert(Ne), te = function(f) {
        var y = function(F) {
          return f[F];
        }, I = "(?:" + c.keys(f).join("|") + ")", D = RegExp(I), P = RegExp(I, "g");
        return function(F) {
          return F = F == null ? "" : "" + F, D.test(F) ? F.replace(P, y) : F;
        };
      };
      c.escape = te(Ne), c.unescape = te(K), c.result = function(f, y, I) {
        c.isArray(y) || (y = [y]);
        var D = y.length;
        if (!D)
          return c.isFunction(I) ? I.call(f) : I;
        for (var P = 0; P < D; P++) {
          var F = f == null ? void 0 : f[y[P]];
          F === void 0 && (F = I, P = D), f = c.isFunction(F) ? F.call(f) : F;
        }
        return f;
      };
      var se = 0;
      c.uniqueId = function(f) {
        var y = ++se + "";
        return f ? f + y : y;
      }, c.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
      };
      var G = /(.)^/, Te = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
      }, _e = /\\|'|\r|\n|\u2028|\u2029/g, Ce = function(f) {
        return "\\" + Te[f];
      };
      c.template = function(f, y, I) {
        !y && I && (y = I), y = c.defaults({}, y, c.templateSettings);
        var D = RegExp([
          (y.escape || G).source,
          (y.interpolate || G).source,
          (y.evaluate || G).source
        ].join("|") + "|$", "g"), P = 0, F = "__p+='";
        f.replace(D, function(we, Oe, Re, dn, $n) {
          return F += f.slice(P, $n).replace(_e, Ce), P = $n + we.length, Oe ? F += `'+
((__t=(` + Oe + `))==null?'':_.escape(__t))+
'` : Re ? F += `'+
((__t=(` + Re + `))==null?'':__t)+
'` : dn && (F += `';
` + dn + `
__p+='`), we;
        }), F += `';
`, y.variable || (F = `with(obj||{}){
` + F + `}
`), F = `var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
` + F + `return __p;
`;
        var $;
        try {
          $ = new Function(y.variable || "obj", "_", F);
        } catch (we) {
          throw we.source = F, we;
        }
        var ee = function(we) {
          return $.call(this, we, c);
        }, fe = y.variable || "obj";
        return ee.source = "function(" + fe + `){
` + F + "}", ee;
      }, c.chain = function(f) {
        var y = c(f);
        return y._chain = !0, y;
      };
      var Ae = function(f, y) {
        return f._chain ? c(y).chain() : y;
      };
      c.mixin = function(f) {
        return c.each(c.functions(f), function(y) {
          var I = c[y] = f[y];
          c.prototype[y] = function() {
            var D = [this._wrapped];
            return l.apply(D, arguments), Ae(this, I.apply(c, D));
          };
        }), c;
      }, c.mixin(c), c.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(f) {
        var y = i[f];
        c.prototype[f] = function() {
          var I = this._wrapped;
          return y.apply(I, arguments), (f === "shift" || f === "splice") && I.length === 0 && delete I[0], Ae(this, I);
        };
      }), c.each(["concat", "join", "slice"], function(f) {
        var y = i[f];
        c.prototype[f] = function() {
          return Ae(this, y.apply(this._wrapped, arguments));
        };
      }), c.prototype.value = function() {
        return this._wrapped;
      }, c.prototype.valueOf = c.prototype.toJSON = c.prototype.value, c.prototype.toString = function() {
        return String(this._wrapped);
      };
    })();
  })(Yn, Yn.exports)), Yn.exports;
}
var kl = Ml();
const Q = /* @__PURE__ */ ln(kl);
var Je = "$";
function cr() {
}
cr.prototype = Ui.prototype = {
  constructor: cr,
  has: function(t) {
    return Je + t in this;
  },
  get: function(t) {
    return this[Je + t];
  },
  set: function(t, e) {
    return this[Je + t] = e, this;
  },
  remove: function(t) {
    var e = Je + t;
    return e in this && delete this[e];
  },
  clear: function() {
    for (var t in this) t[0] === Je && delete this[t];
  },
  keys: function() {
    var t = [];
    for (var e in this) e[0] === Je && t.push(e.slice(1));
    return t;
  },
  values: function() {
    var t = [];
    for (var e in this) e[0] === Je && t.push(this[e]);
    return t;
  },
  entries: function() {
    var t = [];
    for (var e in this) e[0] === Je && t.push({ key: e.slice(1), value: this[e] });
    return t;
  },
  size: function() {
    var t = 0;
    for (var e in this) e[0] === Je && ++t;
    return t;
  },
  empty: function() {
    for (var t in this) if (t[0] === Je) return !1;
    return !0;
  },
  each: function(t) {
    for (var e in this) e[0] === Je && t(this[e], e.slice(1), this);
  }
};
function Ui(t, e) {
  var n = new cr();
  if (t instanceof cr) t.each(function(l, u) {
    n.set(u, l);
  });
  else if (Array.isArray(t)) {
    var r = -1, i = t.length, s;
    if (e == null) for (; ++r < i; ) n.set(r, t[r]);
    else for (; ++r < i; ) n.set(e(s = t[r], r, t), s);
  } else if (t) for (var a in t) n.set(a, t[a]);
  return n;
}
function xs() {
}
var Mt = Ui.prototype;
xs.prototype = {
  constructor: xs,
  has: Mt.has,
  add: function(t) {
    return t += "", this[Je + t] = t, this;
  },
  remove: Mt.remove,
  clear: Mt.clear,
  values: Mt.keys,
  size: Mt.size,
  empty: Mt.empty,
  each: Mt.each
};
var Cl = { value: function() {
} };
function un() {
  for (var t = 0, e = arguments.length, n = {}, r; t < e; ++t) {
    if (!(r = arguments[t] + "") || r in n) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new nr(n);
}
function nr(t) {
  this._ = t;
}
function El(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var r = "", i = n.indexOf(".");
    if (i >= 0 && (r = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
nr.prototype = un.prototype = {
  constructor: nr,
  on: function(t, e) {
    var n = this._, r = El(t + "", n), i, s = -1, a = r.length;
    if (arguments.length < 2) {
      for (; ++s < a; ) if ((i = (t = r[s]).type) && (i = zl(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++s < a; )
      if (i = (t = r[s]).type) n[i] = Ss(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = Ss(n[i], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new nr(t);
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
function zl(t, e) {
  for (var n = 0, r = t.length, i; n < r; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function Ss(t, e, n) {
  for (var r = 0, i = t.length; r < i; ++r)
    if (t[r].name === e) {
      t[r] = Cl, t = t.slice(0, r).concat(t.slice(r + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
function Tl(t, e) {
  var n, r = un("beforesend", "progress", "load", "error"), i, s = Ui(), a = new XMLHttpRequest(), l = null, u = null, h, p, m = 0;
  typeof XDomainRequest < "u" && !("withCredentials" in a) && /^(http(s)?:)?\/\//.test(t) && (a = new XDomainRequest()), "onload" in a ? a.onload = a.onerror = a.ontimeout = g : a.onreadystatechange = function(_) {
    a.readyState > 3 && g(_);
  };
  function g(_) {
    var E = a.status, c;
    if (!E && Dl(a) || E >= 200 && E < 300 || E === 304) {
      if (h)
        try {
          c = h.call(n, a);
        } catch (w) {
          r.call("error", n, w);
          return;
        }
      else
        c = a;
      r.call("load", n, c);
    } else
      r.call("error", n, _);
  }
  return a.onprogress = function(_) {
    r.call("progress", n, _);
  }, n = {
    header: function(_, E) {
      return _ = (_ + "").toLowerCase(), arguments.length < 2 ? s.get(_) : (E == null ? s.remove(_) : s.set(_, E + ""), n);
    },
    // If mimeType is non-null and no Accept header is set, a default is used.
    mimeType: function(_) {
      return arguments.length ? (i = _ == null ? null : _ + "", n) : i;
    },
    // Specifies what type the response value should take;
    // for instance, arraybuffer, blob, document, or text.
    responseType: function(_) {
      return arguments.length ? (p = _, n) : p;
    },
    timeout: function(_) {
      return arguments.length ? (m = +_, n) : m;
    },
    user: function(_) {
      return arguments.length < 1 ? l : (l = _ == null ? null : _ + "", n);
    },
    password: function(_) {
      return arguments.length < 1 ? u : (u = _ == null ? null : _ + "", n);
    },
    // Specify how to convert the response content to a specific type;
    // changes the callback value on "load" events.
    response: function(_) {
      return h = _, n;
    },
    // Alias for send("GET", …).
    get: function(_, E) {
      return n.send("GET", _, E);
    },
    // Alias for send("POST", …).
    post: function(_, E) {
      return n.send("POST", _, E);
    },
    // If callback is non-null, it will be used for error and load events.
    send: function(_, E, c) {
      return a.open(_, t, !0, l, u), i != null && !s.has("accept") && s.set("accept", i + ",*/*"), a.setRequestHeader && s.each(function(w, T) {
        a.setRequestHeader(T, w);
      }), i != null && a.overrideMimeType && a.overrideMimeType(i), p != null && (a.responseType = p), m > 0 && (a.timeout = m), c == null && typeof E == "function" && (c = E, E = null), c != null && c.length === 1 && (c = Nl(c)), c != null && n.on("error", c).on("load", function(w) {
        c(null, w);
      }), r.call("beforesend", n, a), a.send(E ?? null), n;
    },
    abort: function() {
      return a.abort(), n;
    },
    on: function() {
      var _ = r.on.apply(r, arguments);
      return _ === r ? n : _;
    }
  }, n;
}
function Nl(t) {
  return function(e, n) {
    t(e == null ? n : null);
  };
}
function Dl(t) {
  var e = t.responseType;
  return e && e !== "text" ? t.response : t.responseText;
}
function Ta(t, e) {
  return function(n, r) {
    var i = Tl(n).mimeType(t).response(e);
    if (r != null) {
      if (typeof r != "function") throw new Error("invalid callback: " + r);
      return i.get(r);
    }
    return i;
  };
}
const Al = Ta("application/json", function(t) {
  return JSON.parse(t.responseText);
}), Na = Ta("text/plain", function(t) {
  return t.responseText;
});
var Ms = {}, Kr = {}, Zr = 34, vn = 10, Jr = 13;
function Da(t) {
  return new Function("d", "return {" + t.map(function(e, n) {
    return JSON.stringify(e) + ": d[" + n + "]";
  }).join(",") + "}");
}
function Il(t, e) {
  var n = Da(t);
  return function(r, i) {
    return e(n(r), i, t);
  };
}
function ks(t) {
  var e = /* @__PURE__ */ Object.create(null), n = [];
  return t.forEach(function(r) {
    for (var i in r)
      i in e || n.push(e[i] = i);
  }), n;
}
function Ye(t, e) {
  var n = t + "", r = n.length;
  return r < e ? new Array(e - r + 1).join(0) + n : n;
}
function Ol(t) {
  return t < 0 ? "-" + Ye(-t, 6) : t > 9999 ? "+" + Ye(t, 6) : Ye(t, 4);
}
function Ll(t) {
  var e = t.getUTCHours(), n = t.getUTCMinutes(), r = t.getUTCSeconds(), i = t.getUTCMilliseconds();
  return isNaN(t) ? "Invalid Date" : Ol(t.getUTCFullYear()) + "-" + Ye(t.getUTCMonth() + 1, 2) + "-" + Ye(t.getUTCDate(), 2) + (i ? "T" + Ye(e, 2) + ":" + Ye(n, 2) + ":" + Ye(r, 2) + "." + Ye(i, 3) + "Z" : r ? "T" + Ye(e, 2) + ":" + Ye(n, 2) + ":" + Ye(r, 2) + "Z" : n || e ? "T" + Ye(e, 2) + ":" + Ye(n, 2) + "Z" : "");
}
function Aa(t) {
  var e = new RegExp('["' + t + `
\r]`), n = t.charCodeAt(0);
  function r(m, g) {
    var _, E, c = i(m, function(w, T) {
      if (_) return _(w, T - 1);
      E = w, _ = g ? Il(w, g) : Da(w);
    });
    return c.columns = E || [], c;
  }
  function i(m, g) {
    var _ = [], E = m.length, c = 0, w = 0, T, A = E <= 0, b = !1;
    m.charCodeAt(E - 1) === vn && --E, m.charCodeAt(E - 1) === Jr && --E;
    function S() {
      if (A) return Kr;
      if (b) return b = !1, Ms;
      var z, C = c, N;
      if (m.charCodeAt(C) === Zr) {
        for (; c++ < E && m.charCodeAt(c) !== Zr || m.charCodeAt(++c) === Zr; ) ;
        return (z = c) >= E ? A = !0 : (N = m.charCodeAt(c++)) === vn ? b = !0 : N === Jr && (b = !0, m.charCodeAt(c) === vn && ++c), m.slice(C + 1, z - 1).replace(/""/g, '"');
      }
      for (; c < E; ) {
        if ((N = m.charCodeAt(z = c++)) === vn) b = !0;
        else if (N === Jr)
          b = !0, m.charCodeAt(c) === vn && ++c;
        else if (N !== n) continue;
        return m.slice(C, z);
      }
      return A = !0, m.slice(C, E);
    }
    for (; (T = S()) !== Kr; ) {
      for (var x = []; T !== Ms && T !== Kr; ) x.push(T), T = S();
      g && (x = g(x, w++)) == null || _.push(x);
    }
    return _;
  }
  function s(m, g) {
    return m.map(function(_) {
      return g.map(function(E) {
        return p(_[E]);
      }).join(t);
    });
  }
  function a(m, g) {
    return g == null && (g = ks(m)), [g.map(p).join(t)].concat(s(m, g)).join(`
`);
  }
  function l(m, g) {
    return g == null && (g = ks(m)), s(m, g).join(`
`);
  }
  function u(m) {
    return m.map(h).join(`
`);
  }
  function h(m) {
    return m.map(p).join(t);
  }
  function p(m) {
    return m == null ? "" : m instanceof Date ? Ll(m) : e.test(m += "") ? '"' + m.replace(/"/g, '""') + '"' : m;
  }
  return {
    parse: r,
    parseRows: i,
    format: a,
    formatBody: l,
    formatRows: u
  };
}
var Fl = Aa(","), Pl = Fl.parseRows;
Aa("	");
var vi = "http://www.w3.org/1999/xhtml";
const Cs = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: vi,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function zr(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Cs.hasOwnProperty(e) ? { space: Cs[e], local: t } : t;
}
function Bl(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === vi && e.documentElement.namespaceURI === vi ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Rl(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Ia(t) {
  var e = zr(t);
  return (e.local ? Rl : Bl)(e);
}
function Ul() {
}
function Wi(t) {
  return t == null ? Ul : function() {
    return this.querySelector(t);
  };
}
function Wl(t) {
  typeof t != "function" && (t = Wi(t));
  for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
    for (var s = e[i], a = s.length, l = r[i] = new Array(a), u, h, p = 0; p < a; ++p)
      (u = s[p]) && (h = t.call(u, u.__data__, p, s)) && ("__data__" in u && (h.__data__ = u.__data__), l[p] = h);
  return new Ze(r, this._parents);
}
function $l() {
  return [];
}
function Oa(t) {
  return t == null ? $l : function() {
    return this.querySelectorAll(t);
  };
}
function ql(t) {
  typeof t != "function" && (t = Oa(t));
  for (var e = this._groups, n = e.length, r = [], i = [], s = 0; s < n; ++s)
    for (var a = e[s], l = a.length, u, h = 0; h < l; ++h)
      (u = a[h]) && (r.push(t.call(u, u.__data__, h, a)), i.push(u));
  return new Ze(r, i);
}
function La(t) {
  return function() {
    return this.matches(t);
  };
}
function Vl(t) {
  typeof t != "function" && (t = La(t));
  for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
    for (var s = e[i], a = s.length, l = r[i] = [], u, h = 0; h < a; ++h)
      (u = s[h]) && t.call(u, u.__data__, h, s) && l.push(u);
  return new Ze(r, this._parents);
}
function Fa(t) {
  return new Array(t.length);
}
function Hl() {
  return new Ze(this._enter || this._groups.map(Fa), this._parents);
}
function hr(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
hr.prototype = {
  constructor: hr,
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
function Yl(t) {
  return function() {
    return t;
  };
}
var Es = "$";
function Gl(t, e, n, r, i, s) {
  for (var a = 0, l, u = e.length, h = s.length; a < h; ++a)
    (l = e[a]) ? (l.__data__ = s[a], r[a] = l) : n[a] = new hr(t, s[a]);
  for (; a < u; ++a)
    (l = e[a]) && (i[a] = l);
}
function Xl(t, e, n, r, i, s, a) {
  var l, u, h = {}, p = e.length, m = s.length, g = new Array(p), _;
  for (l = 0; l < p; ++l)
    (u = e[l]) && (g[l] = _ = Es + a.call(u, u.__data__, l, e), _ in h ? i[l] = u : h[_] = u);
  for (l = 0; l < m; ++l)
    _ = Es + a.call(t, s[l], l, s), (u = h[_]) ? (r[l] = u, u.__data__ = s[l], h[_] = null) : n[l] = new hr(t, s[l]);
  for (l = 0; l < p; ++l)
    (u = e[l]) && h[g[l]] === u && (i[l] = u);
}
function Kl(t, e) {
  if (!t)
    return _ = new Array(this.size()), h = -1, this.each(function(z) {
      _[++h] = z;
    }), _;
  var n = e ? Xl : Gl, r = this._parents, i = this._groups;
  typeof t != "function" && (t = Yl(t));
  for (var s = i.length, a = new Array(s), l = new Array(s), u = new Array(s), h = 0; h < s; ++h) {
    var p = r[h], m = i[h], g = m.length, _ = t.call(p, p && p.__data__, h, r), E = _.length, c = l[h] = new Array(E), w = a[h] = new Array(E), T = u[h] = new Array(g);
    n(p, m, c, w, T, _, e);
    for (var A = 0, b = 0, S, x; A < E; ++A)
      if (S = c[A]) {
        for (A >= b && (b = A + 1); !(x = w[b]) && ++b < E; ) ;
        S._next = x || null;
      }
  }
  return a = new Ze(a, r), a._enter = l, a._exit = u, a;
}
function Zl() {
  return new Ze(this._exit || this._groups.map(Fa), this._parents);
}
function Jl(t, e, n) {
  var r = this.enter(), i = this, s = this.exit();
  return r = typeof t == "function" ? t(r) : r.append(t + ""), e != null && (i = e(i)), n == null ? s.remove() : n(s), r && i ? r.merge(i).order() : i;
}
function Ql(t) {
  for (var e = this._groups, n = t._groups, r = e.length, i = n.length, s = Math.min(r, i), a = new Array(r), l = 0; l < s; ++l)
    for (var u = e[l], h = n[l], p = u.length, m = a[l] = new Array(p), g, _ = 0; _ < p; ++_)
      (g = u[_] || h[_]) && (m[_] = g);
  for (; l < r; ++l)
    a[l] = e[l];
  return new Ze(a, this._parents);
}
function jl() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var r = t[e], i = r.length - 1, s = r[i], a; --i >= 0; )
      (a = r[i]) && (s && a.compareDocumentPosition(s) ^ 4 && s.parentNode.insertBefore(a, s), s = a);
  return this;
}
function eu(t) {
  t || (t = tu);
  function e(m, g) {
    return m && g ? t(m.__data__, g.__data__) : !m - !g;
  }
  for (var n = this._groups, r = n.length, i = new Array(r), s = 0; s < r; ++s) {
    for (var a = n[s], l = a.length, u = i[s] = new Array(l), h, p = 0; p < l; ++p)
      (h = a[p]) && (u[p] = h);
    u.sort(e);
  }
  return new Ze(i, this._parents).order();
}
function tu(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function nu() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function ru() {
  var t = new Array(this.size()), e = -1;
  return this.each(function() {
    t[++e] = this;
  }), t;
}
function iu() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var r = t[e], i = 0, s = r.length; i < s; ++i) {
      var a = r[i];
      if (a) return a;
    }
  return null;
}
function su() {
  var t = 0;
  return this.each(function() {
    ++t;
  }), t;
}
function au() {
  return !this.node();
}
function ou(t) {
  for (var e = this._groups, n = 0, r = e.length; n < r; ++n)
    for (var i = e[n], s = 0, a = i.length, l; s < a; ++s)
      (l = i[s]) && t.call(l, l.__data__, s, i);
  return this;
}
function lu(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function uu(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function cu(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function hu(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function fu(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function du(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function pu(t, e) {
  var n = zr(t);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((e == null ? n.local ? uu : lu : typeof e == "function" ? n.local ? du : fu : n.local ? hu : cu)(n, e));
}
function Pa(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function gu(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function _u(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function mu(t, e, n) {
  return function() {
    var r = e.apply(this, arguments);
    r == null ? this.style.removeProperty(t) : this.style.setProperty(t, r, n);
  };
}
function bu(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? gu : typeof e == "function" ? mu : _u)(t, e, n ?? "")) : en(this.node(), t);
}
function en(t, e) {
  return t.style.getPropertyValue(e) || Pa(t).getComputedStyle(t, null).getPropertyValue(e);
}
function vu(t) {
  return function() {
    delete this[t];
  };
}
function yu(t, e) {
  return function() {
    this[t] = e;
  };
}
function wu(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function xu(t, e) {
  return arguments.length > 1 ? this.each((e == null ? vu : typeof e == "function" ? wu : yu)(t, e)) : this.node()[t];
}
function Ba(t) {
  return t.trim().split(/^|\s+/);
}
function $i(t) {
  return t.classList || new Ra(t);
}
function Ra(t) {
  this._node = t, this._names = Ba(t.getAttribute("class") || "");
}
Ra.prototype = {
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
function Ua(t, e) {
  for (var n = $i(t), r = -1, i = e.length; ++r < i; ) n.add(e[r]);
}
function Wa(t, e) {
  for (var n = $i(t), r = -1, i = e.length; ++r < i; ) n.remove(e[r]);
}
function Su(t) {
  return function() {
    Ua(this, t);
  };
}
function Mu(t) {
  return function() {
    Wa(this, t);
  };
}
function ku(t, e) {
  return function() {
    (e.apply(this, arguments) ? Ua : Wa)(this, t);
  };
}
function Cu(t, e) {
  var n = Ba(t + "");
  if (arguments.length < 2) {
    for (var r = $i(this.node()), i = -1, s = n.length; ++i < s; ) if (!r.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? ku : e ? Su : Mu)(n, e));
}
function Eu() {
  this.textContent = "";
}
function zu(t) {
  return function() {
    this.textContent = t;
  };
}
function Tu(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Nu(t) {
  return arguments.length ? this.each(t == null ? Eu : (typeof t == "function" ? Tu : zu)(t)) : this.node().textContent;
}
function Du() {
  this.innerHTML = "";
}
function Au(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Iu(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function Ou(t) {
  return arguments.length ? this.each(t == null ? Du : (typeof t == "function" ? Iu : Au)(t)) : this.node().innerHTML;
}
function Lu() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Fu() {
  return this.each(Lu);
}
function Pu() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Bu() {
  return this.each(Pu);
}
function Ru(t) {
  var e = typeof t == "function" ? t : Ia(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Uu() {
  return null;
}
function Wu(t, e) {
  var n = typeof t == "function" ? t : Ia(t), r = e == null ? Uu : typeof e == "function" ? e : Wi(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function $u() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function qu() {
  return this.each($u);
}
function Vu() {
  return this.parentNode.insertBefore(this.cloneNode(!1), this.nextSibling);
}
function Hu() {
  return this.parentNode.insertBefore(this.cloneNode(!0), this.nextSibling);
}
function Yu(t) {
  return this.select(t ? Hu : Vu);
}
function Gu(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
var $a = {}, X = null;
if (typeof document < "u") {
  var Xu = document.documentElement;
  "onmouseenter" in Xu || ($a = { mouseenter: "mouseover", mouseleave: "mouseout" });
}
function Ku(t, e, n) {
  return t = qa(t, e, n), function(r) {
    var i = r.relatedTarget;
    (!i || i !== this && !(i.compareDocumentPosition(this) & 8)) && t.call(this, r);
  };
}
function qa(t, e, n) {
  return function(r) {
    var i = X;
    X = r;
    try {
      t.call(this, this.__data__, e, n);
    } finally {
      X = i;
    }
  };
}
function Zu(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", r = e.indexOf(".");
    return r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), { type: e, name: n };
  });
}
function Ju(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, r = -1, i = e.length, s; n < i; ++n)
        s = e[n], (!t.type || s.type === t.type) && s.name === t.name ? this.removeEventListener(s.type, s.listener, s.capture) : e[++r] = s;
      ++r ? e.length = r : delete this.__on;
    }
  };
}
function Qu(t, e, n) {
  var r = $a.hasOwnProperty(t.type) ? Ku : qa;
  return function(i, s, a) {
    var l = this.__on, u, h = r(e, s, a);
    if (l) {
      for (var p = 0, m = l.length; p < m; ++p)
        if ((u = l[p]).type === t.type && u.name === t.name) {
          this.removeEventListener(u.type, u.listener, u.capture), this.addEventListener(u.type, u.listener = h, u.capture = n), u.value = e;
          return;
        }
    }
    this.addEventListener(t.type, h, n), u = { type: t.type, name: t.name, value: e, listener: h, capture: n }, l ? l.push(u) : this.__on = [u];
  };
}
function ju(t, e, n) {
  var r = Zu(t + ""), i, s = r.length, a;
  if (arguments.length < 2) {
    var l = this.node().__on;
    if (l) {
      for (var u = 0, h = l.length, p; u < h; ++u)
        for (i = 0, p = l[u]; i < s; ++i)
          if ((a = r[i]).type === p.type && a.name === p.name)
            return p.value;
    }
    return;
  }
  for (l = e ? Qu : Ju, n == null && (n = !1), i = 0; i < s; ++i) this.each(l(r[i], e, n));
  return this;
}
function fr(t, e, n, r) {
  var i = X;
  t.sourceEvent = X, X = t;
  try {
    return e.apply(n, r);
  } finally {
    X = i;
  }
}
function Va(t, e, n) {
  var r = Pa(t), i = r.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function ec(t, e) {
  return function() {
    return Va(this, t, e);
  };
}
function tc(t, e) {
  return function() {
    return Va(this, t, e.apply(this, arguments));
  };
}
function nc(t, e) {
  return this.each((typeof e == "function" ? tc : ec)(t, e));
}
var Ha = [null];
function Ze(t, e) {
  this._groups = t, this._parents = e;
}
function Ot() {
  return new Ze([[document.documentElement]], Ha);
}
Ze.prototype = Ot.prototype = {
  constructor: Ze,
  select: Wl,
  selectAll: ql,
  filter: Vl,
  data: Kl,
  enter: Hl,
  exit: Zl,
  join: Jl,
  merge: Ql,
  order: jl,
  sort: eu,
  call: nu,
  nodes: ru,
  node: iu,
  size: su,
  empty: au,
  each: ou,
  attr: pu,
  style: bu,
  property: xu,
  classed: Cu,
  text: Nu,
  html: Ou,
  raise: Fu,
  lower: Bu,
  append: Ru,
  insert: Wu,
  remove: qu,
  clone: Yu,
  datum: Gu,
  on: ju,
  dispatch: nc
};
function ze(t) {
  return typeof t == "string" ? new Ze([[document.querySelector(t)]], [document.documentElement]) : new Ze([[t]], Ha);
}
var rc = 0;
function zs() {
  this._ = "@" + (++rc).toString(36);
}
zs.prototype = {
  constructor: zs,
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
function Ya() {
  for (var t = X, e; e = t.sourceEvent; ) t = e;
  return t;
}
function Ga(t, e) {
  var n = t.ownerSVGElement || t;
  if (n.createSVGPoint) {
    var r = n.createSVGPoint();
    return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
  }
  var i = t.getBoundingClientRect();
  return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
}
function Qe(t) {
  var e = Ya();
  return e.changedTouches && (e = e.changedTouches[0]), Ga(t, e);
}
function yi(t, e, n) {
  arguments.length < 3 && (n = e, e = Ya().changedTouches);
  for (var r = 0, i = e ? e.length : 0, s; r < i; ++r)
    if ((s = e[r]).identifier === n)
      return Ga(t, s);
  return null;
}
var rr = { exports: {} }, ic = rr.exports, Ts;
function sc() {
  return Ts || (Ts = 1, (function(t) {
    /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
    var e = e || (function(n) {
      if (!(typeof n > "u" || typeof navigator < "u" && /MSIE [1-9]\./.test(navigator.userAgent))) {
        var r = n.document, i = function() {
          return n.URL || n.webkitURL || n;
        }, s = r.createElementNS("http://www.w3.org/1999/xhtml", "a"), a = "download" in s, l = function(b) {
          var S = new MouseEvent("click");
          b.dispatchEvent(S);
        }, u = /constructor/i.test(n.HTMLElement) || n.safari, h = /CriOS\/[\d]+/.test(navigator.userAgent), p = function(b) {
          (n.setImmediate || n.setTimeout)(function() {
            throw b;
          }, 0);
        }, m = "application/octet-stream", g = 1e3 * 40, _ = function(b) {
          var S = function() {
            typeof b == "string" ? i().revokeObjectURL(b) : b.remove();
          };
          setTimeout(S, g);
        }, E = function(b, S, x) {
          S = [].concat(S);
          for (var z = S.length; z--; ) {
            var C = b["on" + S[z]];
            if (typeof C == "function")
              try {
                C.call(b, x || b);
              } catch (N) {
                p(N);
              }
          }
        }, c = function(b) {
          return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(b.type) ? new Blob(["\uFEFF", b], { type: b.type }) : b;
        }, w = function(b, S, x) {
          x || (b = c(b));
          var z = this, C = b.type, N = C === m, B, V = function() {
            E(z, "writestart progress write writeend".split(" "));
          }, R = function() {
            if ((h || N && u) && n.FileReader) {
              var j = new FileReader();
              j.onloadend = function() {
                var W = h ? j.result : j.result.replace(/^data:[^;]*;/, "data:attachment/file;"), Y = n.open(W, "_blank");
                Y || (n.location.href = W), W = void 0, z.readyState = z.DONE, V();
              }, j.readAsDataURL(b), z.readyState = z.INIT;
              return;
            }
            if (B || (B = i().createObjectURL(b)), N)
              n.location.href = B;
            else {
              var O = n.open(B, "_blank");
              O || (n.location.href = B);
            }
            z.readyState = z.DONE, V(), _(B);
          };
          if (z.readyState = z.INIT, a) {
            B = i().createObjectURL(b), setTimeout(function() {
              s.href = B, s.download = S, l(s), V(), _(B), z.readyState = z.DONE;
            });
            return;
          }
          R();
        }, T = w.prototype, A = function(b, S, x) {
          return new w(b, S || b.name || "download", x);
        };
        return typeof navigator < "u" && navigator.msSaveOrOpenBlob ? function(b, S, x) {
          return S = S || b.name || "download", x || (b = c(b)), navigator.msSaveOrOpenBlob(b, S);
        } : (T.abort = function() {
        }, T.readyState = T.INIT = 0, T.WRITING = 1, T.DONE = 2, T.error = T.onwritestart = T.onprogress = T.onwrite = T.onabort = T.onerror = T.onwriteend = null, A);
      }
    })(
      typeof self < "u" && self || typeof window < "u" && window || ic.content
    );
    t.exports && (t.exports.saveAs = e);
  })(rr)), rr.exports;
}
var ac = sc();
const Ns = /* @__PURE__ */ ln(ac), qi = Ns.saveAs || Ns, ge = {
  set_options: Xa,
  remove_child_nodes: wi,
  load_css: oc,
  load_files: lc,
  load_the_file: Ka,
  make_class: uc,
  class_with_optional_new: Za,
  setup_defs: Ja,
  draw_an_object: pt,
  draw_a_nested_object: Qa,
  make_array: cc,
  make_array_ref: Hi,
  compare_arrays: hc,
  arrayToObject: ja,
  clone: ke,
  extend: st,
  uniqueConcat: Yi,
  unique_strings_array: eo,
  debounce: fc,
  object_slice_for_ids: dc,
  object_slice_for_ids_ref: Nn,
  c_plus_c: ot,
  c_minus_c: Pn,
  c_times_scalar: to,
  download_json: no,
  load_json: pc,
  load_json_or_csv: gc,
  downloadSvg: ro,
  downloadPng: io,
  rotate_coords_recursive: _c,
  rotate_coords: Gi,
  get_angle: mc,
  to_degrees: so,
  angleNorm: Xi,
  to_radians: Ki,
  to_radians_norm: ao,
  angle_for_event: oo,
  distance: bc,
  check_undefined: vc,
  compartmentalize: yc,
  decompartmentalize: dr,
  mean: lo,
  median: Dn,
  quartiles: uo,
  random_characters: co,
  generate_map_id: xi,
  check_for_parent_tag: ho,
  name_to_url: wc,
  get_document: Zi,
  get_window: fo,
  d3_transform_catch: Gt
  // check_browser: check_browser
};
function Vi() {
  try {
    var t = !!new Blob();
  } catch {
    alert("Blob not supported");
  }
}
function Xa(t, e, n) {
  if (t == null)
    return e;
  var r = {};
  for (var i in e) {
    var s = i in t && t[i] !== null && t[i] !== void 0, a = s ? t[i] : e[i];
    n && i in n && (a = parseFloat(a), isNaN(a) && (s ? (console.warn("Bad float for option " + i), a = parseFloat(e[i]), isNaN(a) && (console.warn("Bad float for default " + i), a = null)) : (console.warn("Bad float for default " + i), a = null))), r[i] = a;
  }
  return r;
}
function wi(t) {
  for (var e = t.node(); e.hasChildNodes(); )
    e.removeChild(e.lastChild);
}
function oc(t, e) {
  var n = "";
  return t && Na(t, function(r, i) {
    r && console.warn(r), n = i, e(n);
  }), !1;
}
function Ds(t, e) {
  return t.indexOf(e, t.length - e.length) !== -1;
}
function Ka(t, e, n, r) {
  if (r) {
    e && console.warn("File " + e + " overridden by value."), n.call(t, null, r);
    return;
  }
  if (!e) {
    n.call(t, "No filename", null);
    return;
  }
  Ds(e, "json") ? Al(e, function(i, s) {
    n.call(t, i, s);
  }) : Ds(e, "css") ? Na(e, function(i, s) {
    n.call(t, i, s);
  }) : n.call(t, "Unrecognized file type", null);
}
function lc(t, e, n) {
  e.length === 0 && n.call(t);
  for (var r = -1, i = e.length; ++r < e.length; )
    Ka(
      t,
      e[r].file,
      (function(s, a) {
        this.call(t, s, a), --i || n.call(t);
      }).bind(e[r].callback),
      e[r].value
    );
}
function uc() {
  var t, e = function(n) {
    if (this instanceof e)
      typeof this.init == "function" && this.init.apply(this, t ? n : arguments);
    else {
      t = !0;
      var r = new e(arguments);
      return t = !1, r;
    }
  };
  return e;
}
function Za(t) {
  return new Proxy(t, {
    apply(e, n, r) {
      return new e(...r);
    }
  });
}
function Ja(t, e) {
  t.select("defs").remove();
  var n = t.append("defs"), r = n.node();
  return r.parentNode.insertBefore(r, r.parentNode.firstChild), n.append("style").attr("type", "text/css").text(e), n;
}
function pt(t, e, n, r, i, s, a, l) {
  var u = {};
  for (var h in r)
    r[h] === void 0 ? console.warn("Undefined value for id " + h + " in object. Ignoring.") : u[h] = r[h];
  var p = t.select(e).selectAll(n).data(
    Hi(u, i),
    function(g) {
      return g[i];
    }
  ), m = s ? s(p.enter()).merge(p) : p;
  a && m.call(a), l && p.exit().call(l);
}
function Qa(t, e, n, r, i, s, a) {
  var l = t.selectAll(e).data(
    function(h) {
      return Hi(h[n], r);
    },
    function(h) {
      return h[r];
    }
  ), u = i ? i(l.enter()).merge(l) : l;
  s && u.call(s), a && l.exit().call(a);
}
function cc(t, e) {
  var n = [];
  for (var r in t) {
    var i = ke(t[r]);
    i[e] = r, n.push(i);
  }
  return n;
}
function Hi(t, e) {
  var n = [];
  for (var r in t) {
    var i = t[r];
    i[e] = r, n.push(i);
  }
  return n;
}
function hc(t, e) {
  if (!t || !e || t.length != e.length) return !1;
  for (var n = 0, r = t.length; n < r; n++)
    if (t[n] != e[n])
      return !1;
  return !0;
}
function ja(t) {
  const e = {};
  for (let l = 0, u = t.length; l < u; l++) {
    const h = t[l], p = Object.keys(h);
    for (var n = 0, r = p.length; n < r; n++) {
      var i = p[n];
      if (i in e)
        e[i][l] = h[i];
      else {
        for (var s = [], a = 0; a < u; a++)
          s[a] = null;
        s[l] = h[i], e[i] = s;
      }
    }
  }
  return e;
}
function ke(t) {
  return Q.isArray(t) ? Q.map(t, function(e) {
    return ke(e);
  }) : Q.isObject(t) ? Q.mapObject(t, function(e, n) {
    return ke(e);
  }) : t;
}
function st(t, e, n) {
  n === void 0 && (n = !1);
  for (var r in e)
    if (!(r in t) || n)
      t[r] = e[r];
    else
      throw new Error("Attribute " + r + " already in object.");
}
function Yi(t) {
  const e = [];
  return t.forEach((n) => {
    n.forEach((r) => {
      e.indexOf(r) < 0 && e.push(r);
    });
  }), e;
}
function eo(t) {
  for (var e = [], n = 0, r = t.length; n < r; n++)
    e.indexOf(t[n]) === -1 && e.push(t[n]);
  return e;
}
function fc(t, e, n) {
  var r;
  return function() {
    var i = this, s = arguments, a = function() {
      r = null, n || t.apply(i, s);
    }, l = n && !r;
    clearTimeout(r), r = setTimeout(a, e), l && t.apply(i, s);
  };
}
function dc(t, e) {
  for (var n = {}, r = -1; ++r < e.length; )
    n[e[r]] = ke(t[e[r]]);
  return e.length !== Object.keys(n).length && console.warn("did not find correct reaction subset"), n;
}
function Nn(t, e) {
  for (var n = {}, r = -1; ++r < e.length; )
    n[e[r]] = t[e[r]];
  return e.length !== Object.keys(n).length && console.warn("did not find correct reaction subset"), n;
}
function ot(t, e) {
  return t === null || e === null || t === void 0 || e === void 0 ? null : {
    x: t.x + e.x,
    y: t.y + e.y
  };
}
function Pn(t, e) {
  return t === null || e === null || t === void 0 || e === void 0 ? null : {
    x: t.x - e.x,
    y: t.y - e.y
  };
}
function to(t, e) {
  return {
    x: t.x * e,
    y: t.y * e
  };
}
function no(t, e) {
  Vi();
  var n = JSON.stringify(t), r = new Blob([n], { type: "application/json" });
  qi(r, e + ".json");
}
function pc(t, e, n, r) {
  window.File && window.FileReader && window.FileList && window.Blob || e("The File APIs are not fully supported in this browser.", null);
  var i = new window.FileReader();
  if (i.onload = function(s) {
    var a = s.target.result, l;
    try {
      l = JSON.parse(a);
    } catch (u) {
      e(u, null);
      return;
    }
    e(null, l);
  }, n != null)
    try {
      n();
    } catch (s) {
      console.warn(s);
    }
  i.onabort = function(s) {
    try {
      r();
    } catch (a) {
      console.warn(a);
    }
  }, i.onerror = function(s) {
    try {
      r();
    } catch (a) {
      console.warn(a);
    }
  }, i.readAsText(t);
}
function gc(t, e, n, r, i, s) {
  var a = function(u) {
    var h = u.target.result, p, m;
    try {
      p = JSON.parse(h);
    } catch (g) {
      m = "JSON error: " + g;
      try {
        p = e(Pl(h));
      } catch (_) {
        n(m + `
CSV error: ` + _, null);
        return;
      }
    }
    n(null, p);
  };
  if (s != null)
    return console.warn("Debugging load_json_or_csv"), a(s);
  window.File && window.FileReader && window.FileList && window.Blob || n("The File APIs are not fully supported in this browser.", null);
  var l = new window.FileReader();
  if (r != null)
    try {
      r();
    } catch (u) {
      console.warn(u);
    }
  l.onabort = function(u) {
    try {
      i();
    } catch (h) {
      console.warn(h);
    }
  }, l.onerror = function(u) {
    try {
      i();
    } catch (h) {
      console.warn(h);
    }
  }, l.onload = a, l.readAsText(t);
}
function ro(t, e, n) {
  Vi();
  var r = new XMLSerializer().serializeToString(e.node());
  n && (r = Sl.xml(r)), r = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
` + r;
  var i = new Blob([r], { type: "image/svg+xml" });
  qi(i, t + ".svg");
}
function io(t, e) {
  Vi();
  var n = new XMLSerializer().serializeToString(e.node());
  n = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
` + n;
  var r = document.createElement("canvas"), i = r.getContext("2d"), s = e.node().getBBox(), a = s.width + s.x, l = s.height + s.y;
  a < 1e4 && l < 1e4 ? (r.width = a, r.height = l) : r.width > r.height ? (r.width = 1e4, r.height = 1e4 * (l / a)) : (r.width = 1e4 * (a / l), r.height = 1e4);
  var u = new Image();
  u.src = "data:image/svg+xml;base64," + btoa(n), u.onload = function() {
    i.fillStyle = "#FFF", i.fillRect(0, 0, r.width, r.height), i.drawImage(u, 0, 0, r.width, r.height), r.toBlob(function(h) {
      qi(h, t + ".png");
    });
  };
}
function _c(t, e, n) {
  return t.map(function(r) {
    return Gi(r, e, n);
  });
}
function Gi(t, e, n) {
  var r = Math.cos(-e) * (t.x - n.x) + Math.sin(-e) * (t.y - n.y) + n.x - t.x, i = -Math.sin(-e) * (t.x - n.x) + Math.cos(-e) * (t.y - n.y) + n.y - t.y;
  return { x: r, y: i };
}
function mc(t) {
  var e = t[1].x - t[0].x, n = t[1].y - t[0].y;
  return e === 0 && n >= 0 ? Math.PI / 2 : e === 0 && n < 0 ? 3 * Math.PI / 2 : e >= 0 && n >= 0 ? Math.atan(n / e) : e >= 0 ? Math.atan(n / e) + 2 * Math.PI : Math.atan(n / e) + Math.PI;
}
function so(t) {
  return t * 180 / Math.PI;
}
function Xi(t) {
  return t < -Math.PI ? t + Math.floor((t - Math.PI) / (-2 * Math.PI)) * 2 * Math.PI : t > Math.PI ? t - Math.floor((t + Math.PI) / (2 * Math.PI)) * 2 * Math.PI : t;
}
function Ki(t) {
  return Math.PI / 180 * t;
}
function ao(t) {
  var e = Ki(t);
  return Xi(e);
}
function oo(t, e, n) {
  var r = Math.atan2(e.x - n.x, n.y - e.y), i = Math.atan2(
    e.x - n.x + t.x,
    n.y - e.y - t.y
  ), s = i - r;
  return s;
}
function bc(t, e) {
  return Math.sqrt(Math.pow(e.y - t.y, 2) + Math.pow(e.x - t.x, 2));
}
function vc(t, e) {
  e.forEach(function(n, r) {
    t[r] === void 0 && console.error(`Argument is undefined: ${e[r]}`);
  });
}
function yc(t, e) {
  return `${t}_${e}`;
}
function dr(t) {
  var e = /(.*)_([a-z0-9]{1,2})$/, n = e.exec(t);
  return n !== null ? n.slice(1, 3) : [t, null];
}
function lo(t) {
  var e = t.reduce(function(r, i) {
    return r + i;
  }), n = e / t.length;
  return n;
}
function Dn(t) {
  t.sort(function(n, r) {
    return n - r;
  });
  var e = Math.floor(t.length / 2);
  return t.length % 2 == 1 ? t[e] : (t[e - 1] + t[e]) / 2;
}
function uo(t) {
  t.sort(function(n, r) {
    return n - r;
  });
  var e = Math.floor(t.length / 2);
  return t.length === 1 ? [
    t[0],
    t[0],
    t[0]
  ] : t.length % 2 === 1 ? [
    Dn(t.slice(0, e)),
    t[e],
    Dn(t.slice(e + 1))
  ] : [
    Dn(t.slice(0, e)),
    (t[e - 1] + t[e]) / 2,
    Dn(t.slice(e))
  ];
}
function co(t) {
  for (var e = "", n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", r = 0; r < t; r++)
    e += n.charAt(Math.floor(Math.random() * n.length));
  return e;
}
function xi() {
  return co(12);
}
function ho(t, e) {
  for (t instanceof Ot && (t = t.node()); t.parentNode !== null; )
    if (t = t.parentNode, t.tagName !== void 0 && t.tagName.toLowerCase() === e.toLowerCase())
      return !0;
  return !1;
}
function wc(t, e) {
  return e != null && (e = e.replace(/^\/|\/$/g, ""), t = [e, t].join("/")), t.replace(/^\/|\/$/g, "") + ".json";
}
function Zi(t) {
  return t.ownerDocument;
}
function fo(t) {
  return Zi(t).defaultView;
}
function Gt(t) {
  if (t.indexOf("skew") !== -1 || t.indexOf("matrix") !== -1)
    throw new Error("d3_transform_catch does not work with skew or matrix");
  var e = /translate\s*\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/.exec(t), n = Q.isNull(e), r = n ? 0 : Number(e[1]), i = n ? 0 : Number(e[2]), s = /rotate\s*\(\s*([0-9.-]+)\s*\)/.exec(t), a = Q.isNull(s), l = a ? 0 : Number(s[1]), u = /scale\s*\(\s*([0-9.-]+)\s*\)/.exec(t), h = Q.isNull(u), p = h ? 0 : Number(u[1]);
  return { translate: [r, i], rotate: l, scale: p };
}
var Tr = ge.make_class();
Tr.prototype = {
  init: xc,
  is_visible: Sc,
  place: Mc,
  hide: kc
};
function xc(t, e, n = { x: 0, y: 0 }, r = !0) {
  this.div = t, this.map = e, this.displacement = n, this.shouldReposition = r, this.visible = !0, this.hide();
}
function Sc() {
  return this.visible;
}
function Mc(t) {
  this.div.style("display", null);
  var e = this.map.zoomContainer.windowTranslate, n = this.map.zoomContainer.windowScale, r = this.map.get_size();
  if (this.shouldReposition) {
    var i = Math.max(
      20,
      Math.min(
        r.width - 270,
        n * t.x + e.x - this.displacement.x
      )
    ), s = Math.max(
      20,
      Math.min(
        r.height - 40,
        n * t.y + e.y - this.displacement.y
      )
    );
    this.div.style("position", "absolute").style("display", "block").style("left", `${i}px`).style("top", `${s}px`);
  } else
    this.div.style("position", "absolute").style("display", "block").style("left", `${n * t.x + e.x - this.displacement.x}px`).style("top", `${n * t.y + e.y - this.displacement.y}px`);
  this.visible = !0;
}
function kc() {
  this.visible && (this.div.style("display", "none"), this.visible = !1);
}
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
function Cc(t, e) {
  const n = Zi(t), r = fo(t);
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
  var h = n.createElement("div");
  h.style.position = "absolute", h.style.visibility = "hidden", h.style.outline = "0", h.style.margin = "0", h.style.padding = "0", h.style.textAlign = "left", h.style.fontSize = e.fontSize, h.style.fontFamily = e.fontFamily, h.style.backgroundColor = e.backgroundColor, h.style.zIndex = e.dropDownZIndex, h.style.cursor = "default", h.style.borderStyle = "solid", h.style.borderWidth = "1px", h.style.borderColor = e.dropDownBorderColor, h.style.overflowX = "hidden", h.style.whiteSpace = "pre", h.style.overflowY = "scroll";
  var p = function(b) {
    var S = [], x = 0, z = -1, C = null, N = function() {
      this.style.outline = "1px solid #ddd";
    }, B = function() {
      this.style.outline = "0";
    }, V = function(j) {
      j.preventDefault(), R.onmouseselection(this.id);
    }, R = {
      hide: function() {
        b.style.visibility = "hidden";
      },
      refresh: function(j, O) {
        b.style.visibility = "hidden", x = 0, b.innerHTML = "";
        var W = r.innerHeight || n.documentElement.clientHeight, Y = b.parentNode.getBoundingClientRect(), Z = Y.top - 6, H = W - Y.bottom - 6;
        S = [];
        for (var ne = 0; ne < O.length; ne++) {
          var he = O[ne].matches.filter(function(re) {
            return re.toLowerCase().indexOf(j.toLowerCase()) == 0;
          });
          if (he.length != 0) {
            var ue = n.createElement("div");
            if (ue.style.color = e.color, ue.onmouseover = N, ue.onmouseout = B, ue.onmousedown = function(re) {
              re.preventDefault();
            }, ue.ondblclick = V, ue.__hint = he[0], ue.id = O[ne].id, ue.innerHTML = O[ne].html, S.push(ue), b.appendChild(ue), S.length >= c.display_limit) {
              var J = n.createElement("div");
              J.innerHTML = " " + (O.length - S.length) + " more", S.push(J), b.appendChild(J);
              break;
            }
          }
        }
        S.length !== 0 && (R.highlight(0), Z > H * 3 ? (b.style.maxHeight = Z + "px", b.style.top = "", b.style.bottom = "100%") : (b.style.top = "100%", b.style.bottom = "", b.style.maxHeight = H + "px"), b.style.visibility = "visible");
      },
      highlight: function(j) {
        z != -1 && S[z] && (S[z].style.backgroundColor = e.backgroundColor), S[j].style.backgroundColor = e.dropDownOnHoverBackgroundColor, z = j, C = S[j];
      },
      // moves the selection either up or down (unless it's not
      // possible) step is either +1 or -1.
      move: function(j) {
        return b.style.visibility === "hidden" ? "" : (x + j === -1 || x + j === S.length || (x += j, R.highlight(x)), S[x].__hint);
      },
      onmouseselection: function() {
      },
      get_current_row: function() {
        return C;
      }
    };
    return R;
  }, m = p(h);
  m.onmouseselection = function(b) {
    c.onEnter(b), c.input.focus();
  }, a.appendChild(h), t.appendChild(a);
  var g, _;
  function E(b) {
    return g === void 0 && (g = n.createElement("span"), g.style.visibility = "hidden", g.style.position = "fixed", g.style.outline = "0", g.style.margin = "0", g.style.padding = "0", g.style.border = "0", g.style.left = "0", g.style.whiteSpace = "pre", g.style.fontSize = e.fontSize, g.style.fontFamily = e.fontFamily, g.style.fontWeight = "normal", n.body.appendChild(g)), g.innerHTML = String(b).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), g.getBoundingClientRect().right;
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
    dropDown: h,
    prompt: l,
    setText: function(b) {
      s.value = b, i.value = b;
    },
    getText: function() {
      return i.value;
    },
    hideDropDown: function() {
      m.hide();
    },
    repaint: function() {
      var b = i.value, S = c.startFrom, x = c.options, z = x.length, C = b.substring(S);
      _ = b.substring(0, S), s.value = "";
      for (var N = 0; N < z; N++) {
        var B = x[N].matches.filter(function(V) {
          return V.toLowerCase().indexOf(C.toLowerCase()) == 0;
        });
        if (B.length != 0) {
          s.value = c.get_hint(B[0]);
          break;
        }
      }
      h.style.left = E(_) + "px", m.refresh(C, c.options);
    }
  }, w, T = function(b, S) {
    w = b.value;
    var x = function() {
      var z = b.value;
      w !== z && (w = z, S(z));
    };
    b.addEventListener("input", x, !1), b.addEventListener("keyup", x, !1), b.addEventListener("change", x, !1);
  };
  T(i, function(b) {
    c.onChange(b), c.repaint();
  });
  var A = function(b) {
    b = b || r.event;
    var S = b.keyCode;
    if (S != 33 && S != 34) {
      if (S == 39 || S == 35 || S == 9) {
        if (S == 9 && (b.preventDefault(), b.stopPropagation(), s.value.length == 0 && c.onTab()), s.value.length > 0) {
          i.value = s.value;
          var x = w != i.value;
          w = i.value, x && c.onChange(i.value);
        }
        return;
      }
      if (S == 13) {
        var z = m.get_current_row().id;
        c.onEnter(z);
        return;
      }
      if (S == 40) {
        var C = m.move(1);
        C == "" && c.onArrowDown(), s.value = c.get_hint(C);
        return;
      }
      if (S == 38) {
        var C = m.move(-1);
        C == "" && c.onArrowUp(), s.value = c.get_hint(C), b.preventDefault(), b.stopPropagation();
        return;
      }
      s.value = "";
    }
  };
  return i.addEventListener("keydown", A, !1), c;
}
function Qr() {
  X.stopImmediatePropagation();
}
function Kt() {
  X.preventDefault(), X.stopImmediatePropagation();
}
function Ji(t) {
  var e = t.document.documentElement, n = ze(t).on("dragstart.drag", Kt, !0);
  "onselectstart" in e ? n.on("selectstart.drag", Kt, !0) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function Qi(t, e) {
  var n = t.document.documentElement, r = ze(t).on("dragstart.drag", null);
  e && (r.on("click.drag", Kt, !0), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
function Gn(t) {
  return function() {
    return t;
  };
}
function Si(t, e, n, r, i, s, a, l, u, h) {
  this.target = t, this.type = e, this.subject = n, this.identifier = r, this.active = i, this.x = s, this.y = a, this.dx = l, this.dy = u, this._ = h;
}
Si.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function Ec() {
  return !X.button;
}
function zc() {
  return this.parentNode;
}
function Tc(t) {
  return t ?? { x: X.x, y: X.y };
}
function Nc() {
  return "ontouchstart" in this;
}
function tt() {
  var t = Ec, e = zc, n = Tc, r = Nc, i = {}, s = un("start", "drag", "end"), a = 0, l, u, h, p, m = 0;
  function g(S) {
    S.on("mousedown.drag", _).filter(r).on("touchstart.drag", w).on("touchmove.drag", T).on("touchend.drag touchcancel.drag", A).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function _() {
    if (!(p || !t.apply(this, arguments))) {
      var S = b("mouse", e.apply(this, arguments), Qe, this, arguments);
      S && (ze(X.view).on("mousemove.drag", E, !0).on("mouseup.drag", c, !0), Ji(X.view), Qr(), h = !1, l = X.clientX, u = X.clientY, S("start"));
    }
  }
  function E() {
    if (Kt(), !h) {
      var S = X.clientX - l, x = X.clientY - u;
      h = S * S + x * x > m;
    }
    i.mouse("drag");
  }
  function c() {
    ze(X.view).on("mousemove.drag mouseup.drag", null), Qi(X.view, h), Kt(), i.mouse("end");
  }
  function w() {
    if (t.apply(this, arguments)) {
      var S = X.changedTouches, x = e.apply(this, arguments), z = S.length, C, N;
      for (C = 0; C < z; ++C)
        (N = b(S[C].identifier, x, yi, this, arguments)) && (Qr(), N("start"));
    }
  }
  function T() {
    var S = X.changedTouches, x = S.length, z, C;
    for (z = 0; z < x; ++z)
      (C = i[S[z].identifier]) && (Kt(), C("drag"));
  }
  function A() {
    var S = X.changedTouches, x = S.length, z, C;
    for (p && clearTimeout(p), p = setTimeout(function() {
      p = null;
    }, 500), z = 0; z < x; ++z)
      (C = i[S[z].identifier]) && (Qr(), C("end"));
  }
  function b(S, x, z, C, N) {
    var B = z(x, S), V, R, j, O = s.copy();
    if (fr(new Si(g, "beforestart", V, S, a, B[0], B[1], 0, 0, O), function() {
      return (X.subject = V = n.apply(C, N)) == null ? !1 : (R = V.x - B[0] || 0, j = V.y - B[1] || 0, !0);
    }))
      return function W(Y) {
        var Z = B, H;
        switch (Y) {
          case "start":
            i[S] = W, H = a++;
            break;
          case "end":
            delete i[S], --a;
          // nobreak
          case "drag":
            B = z(x, S), H = a;
            break;
        }
        fr(new Si(g, Y, V, S, H, B[0] + R, B[1] + j, B[0] - Z[0], B[1] - Z[1], O), O.apply, O, [Y, C, N]);
      };
  }
  return g.filter = function(S) {
    return arguments.length ? (t = typeof S == "function" ? S : Gn(!!S), g) : t;
  }, g.container = function(S) {
    return arguments.length ? (e = typeof S == "function" ? S : Gn(S), g) : e;
  }, g.subject = function(S) {
    return arguments.length ? (n = typeof S == "function" ? S : Gn(S), g) : n;
  }, g.touchable = function(S) {
    return arguments.length ? (r = typeof S == "function" ? S : Gn(!!S), g) : r;
  }, g.on = function() {
    var S = s.on.apply(s, arguments);
    return S === s ? g : S;
  }, g.clickDistance = function(S) {
    return arguments.length ? (m = (S = +S) * S, g) : Math.sqrt(m);
  }, g;
}
class Dc {
  constructor(e) {
    this.arrowContainer = e.append("g").attr("id", "direction-arrow-container").attr("transform", "translate(0,0)rotate(0)"), this.arrow = this.arrowContainer.append("path").classed("direction-arrow", !0).attr("d", "M0 -5 L0 5 L20 5 L20 10 L30 0 L20 -10 L20 -5 Z").style("visibility", "hidden").attr("transform", "translate(30,0)scale(2.5)"), this.sel = e, this.center = { x: 0, y: 0 }, this._setupDrag(), this.dragging = !1, this.isVisible = !1, this.show();
  }
  /**
   * Move the arrow to coords.
   */
  setLocation(e) {
    this.center = e;
    var n = Gt(this.arrowContainer.attr("transform"));
    this.arrowContainer.attr(
      "transform",
      "translate(" + e.x + "," + e.y + ")rotate(" + n.rotate + ")"
    );
  }
  /**
   * Rotate the arrow to rotation.
   */
  setRotation(e) {
    var n = Gt(this.arrowContainer.attr("transform"));
    this.arrowContainer.attr(
      "transform",
      "translate(" + n.translate + ")rotate(" + e + ")"
    );
  }
  /**
   * Displace the arrow rotation by a set amount.
   */
  displaceRotation(e) {
    var n = Gt(this.arrowContainer.attr("transform"));
    this.arrowContainer.attr(
      "transform",
      "translate(" + n.translate + ")rotate(" + (n.rotate + e) + ")"
    );
  }
  /**
   * Returns the arrow rotation.
   */
  getRotation() {
    return Gt(this.arrowContainer.attr("transform")).rotate;
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
    var e = tt().on("start", (n) => {
      X.sourceEvent.stopPropagation(), this.dragging = !0;
    }).on("drag", (n) => {
      const r = {
        x: X.dx,
        y: X.dy
      }, i = {
        x: Qe(this.sel.node())[0],
        y: Qe(this.sel.node())[1]
      }, s = oo(
        r,
        i,
        this.center
      );
      this.displaceRotation(so(s));
    }).on("end", (n) => {
      setTimeout(() => {
        this.dragging = !1;
      }, 200);
    });
    this.arrowContainer.call(e);
  }
}
function pr(t, e) {
  if ((n = (t = e ? t.toExponential(e - 1) : t.toExponential()).indexOf("e")) < 0) return null;
  var n, r = t.slice(0, n);
  return [
    r.length > 1 ? r[0] + r.slice(2) : r,
    +t.slice(n + 1)
  ];
}
function tn(t) {
  return t = pr(Math.abs(t)), t ? t[1] : NaN;
}
function Ac(t, e) {
  return function(n, r) {
    for (var i = n.length, s = [], a = 0, l = t[0], u = 0; i > 0 && l > 0 && (u + l + 1 > r && (l = Math.max(1, r - u)), s.push(n.substring(i -= l, i + l)), !((u += l + 1) > r)); )
      l = t[a = (a + 1) % t.length];
    return s.reverse().join(e);
  };
}
function Ic(t) {
  return function(e) {
    return e.replace(/[0-9]/g, function(n) {
      return t[+n];
    });
  };
}
var Oc = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function gr(t) {
  return new ji(t);
}
gr.prototype = ji.prototype;
function ji(t) {
  if (!(e = Oc.exec(t))) throw new Error("invalid format: " + t);
  var e;
  this.fill = e[1] || " ", this.align = e[2] || ">", this.sign = e[3] || "-", this.symbol = e[4] || "", this.zero = !!e[5], this.width = e[6] && +e[6], this.comma = !!e[7], this.precision = e[8] && +e[8].slice(1), this.trim = !!e[9], this.type = e[10] || "";
}
ji.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width == null ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function Lc(t) {
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
var po;
function Fc(t, e) {
  var n = pr(t, e);
  if (!n) return t + "";
  var r = n[0], i = n[1], s = i - (po = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, a = r.length;
  return s === a ? r : s > a ? r + new Array(s - a + 1).join("0") : s > 0 ? r.slice(0, s) + "." + r.slice(s) : "0." + new Array(1 - s).join("0") + pr(t, Math.max(0, e + s - 1))[0];
}
function As(t, e) {
  var n = pr(t, e);
  if (!n) return t + "";
  var r = n[0], i = n[1];
  return i < 0 ? "0." + new Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + new Array(i - r.length + 2).join("0");
}
const Is = {
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
    return As(t * 100, e);
  },
  r: As,
  s: Fc,
  X: function(t) {
    return Math.round(t).toString(16).toUpperCase();
  },
  x: function(t) {
    return Math.round(t).toString(16);
  }
};
function Os(t) {
  return t;
}
var Ls = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function Pc(t) {
  var e = t.grouping && t.thousands ? Ac(t.grouping, t.thousands) : Os, n = t.currency, r = t.decimal, i = t.numerals ? Ic(t.numerals) : Os, s = t.percent || "%";
  function a(u) {
    u = gr(u);
    var h = u.fill, p = u.align, m = u.sign, g = u.symbol, _ = u.zero, E = u.width, c = u.comma, w = u.precision, T = u.trim, A = u.type;
    A === "n" ? (c = !0, A = "g") : Is[A] || (w == null && (w = 12), T = !0, A = "g"), (_ || h === "0" && p === "=") && (_ = !0, h = "0", p = "=");
    var b = g === "$" ? n[0] : g === "#" && /[boxX]/.test(A) ? "0" + A.toLowerCase() : "", S = g === "$" ? n[1] : /[%p]/.test(A) ? s : "", x = Is[A], z = /[defgprs%]/.test(A);
    w = w == null ? 6 : /[gprs]/.test(A) ? Math.max(1, Math.min(21, w)) : Math.max(0, Math.min(20, w));
    function C(N) {
      var B = b, V = S, R, j, O;
      if (A === "c")
        V = x(N) + V, N = "";
      else {
        N = +N;
        var W = N < 0;
        if (N = x(Math.abs(N), w), T && (N = Lc(N)), W && +N == 0 && (W = !1), B = (W ? m === "(" ? m : "-" : m === "-" || m === "(" ? "" : m) + B, V = (A === "s" ? Ls[8 + po / 3] : "") + V + (W && m === "(" ? ")" : ""), z) {
          for (R = -1, j = N.length; ++R < j; )
            if (O = N.charCodeAt(R), 48 > O || O > 57) {
              V = (O === 46 ? r + N.slice(R + 1) : N.slice(R)) + V, N = N.slice(0, R);
              break;
            }
        }
      }
      c && !_ && (N = e(N, 1 / 0));
      var Y = B.length + N.length + V.length, Z = Y < E ? new Array(E - Y + 1).join(h) : "";
      switch (c && _ && (N = e(Z + N, Z.length ? E - V.length : 1 / 0), Z = ""), p) {
        case "<":
          N = B + N + V + Z;
          break;
        case "=":
          N = B + Z + N + V;
          break;
        case "^":
          N = Z.slice(0, Y = Z.length >> 1) + B + N + V + Z.slice(Y);
          break;
        default:
          N = Z + B + N + V;
          break;
      }
      return i(N);
    }
    return C.toString = function() {
      return u + "";
    }, C;
  }
  function l(u, h) {
    var p = a((u = gr(u), u.type = "f", u)), m = Math.max(-8, Math.min(8, Math.floor(tn(h) / 3))) * 3, g = Math.pow(10, -m), _ = Ls[8 + m / 3];
    return function(E) {
      return p(g * E) + _;
    };
  }
  return {
    format: a,
    formatPrefix: l
  };
}
var Xn, nn, go;
Bc({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function Bc(t) {
  return Xn = Pc(t), nn = Xn.format, go = Xn.formatPrefix, Xn;
}
function Rc(t) {
  return Math.max(0, -tn(Math.abs(t)));
}
function Uc(t, e) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(tn(e) / 3))) * 3 - tn(Math.abs(t)));
}
function Wc(t, e) {
  return t = Math.abs(t), e = Math.abs(e) - t, Math.max(0, tn(e) - tn(t)) + 1;
}
const Mi = (t) => t, $c = /([.*+?^=!:${}()|[\]/\\])/g, qc = /\n\s*\n/g, Vc = /\n\s*(\)*)\s*$/, Hc = /([() ])(?:and|or)([)( ])/ig, Yc = /[()]/g, Gc = /\(\s*(\S+)\s*\)/g, Xc = /\s+or\s+/i, Kc = /\s+and\s+/i, Zc = /(^|\()(\s*-?[0-9.]+\s+(?:or\s+-?[0-9.]+\s*)+)(\)|$)/ig, Jc = /(^|\(|or\s)(\s*-?[0-9.]+\s+(?:and\s+-?[0-9.]+\s*)+)(\sor|\)|$)/ig;
function _r(t) {
  const e = Number(t);
  return isNaN(e) || parseFloat(t) !== e ? null : e;
}
function Qc(t, e) {
  const n = {};
  let r = [null];
  for (let i in t) {
    r = t[i].map(() => null);
    break;
  }
  for (let i in e) {
    const s = e[i], a = s.bigg_id, l = {};
    s.genes.forEach((u) => {
      ["bigg_id", "name"].forEach(function(h) {
        const p = t[u[h]] || ke(r), m = l[u.bigg_id];
        if (m === void 0)
          l[u.bigg_id] = p;
        else
          for (let g = 0; g < p.length; g++) {
            const _ = p[g];
            _ !== null && (m[g] = _);
          }
      });
    }), n[a] = l;
  }
  return n;
}
function Fs(t) {
  return isFinite(t) ? t : null;
}
function jc(t, e) {
  return e ? Math.abs(t) : t;
}
function eh(t, e, n) {
  return n ? Math.abs(e - t) : e - t;
}
function th(t, e, n) {
  if (t === 0 || e === 0) return null;
  var r = e >= t ? e / t : -t / e;
  return n ? Math.abs(r) : r;
}
function nh(t, e, n) {
  if (t === 0 || e / t < 0) return null;
  var r = Math.log(e / t) / Math.log(2);
  return n ? Math.abs(r) : r;
}
function yn(t, e, n) {
  if (!t) return null;
  if (["reaction_data", "metabolite_data", "gene_data"].indexOf(e) === -1)
    throw new Error("Invalid name argument: " + e);
  t instanceof Array || (t = [t]);
  var r = function() {
    return t === null || t.length === 1 || t.length === 2 ? null : console.warn("Bad data style: " + e);
  };
  if (r(), t = ja(t), e === "gene_data") {
    if (n === void 0)
      throw new Error("Must pass all_reactions argument for gene_data");
    t = Qc(t, n);
  }
  return t;
}
function Nr(t, e, n) {
  if (t === null) return null;
  const r = e.indexOf("abs") !== -1;
  if (t.length === 1) {
    var i = _r(t[0]);
    return i === null ? null : jc(i, r);
  } else if (t.length === 2) {
    var s = t.map(_r);
    if (s[0] === null || s[1] === null) return null;
    if (n === "diff")
      return eh(s[0], s[1], r);
    if (n === "fold")
      return Fs(th(s[0], s[1], r));
    if (n === "log2_fold")
      return Fs(nh(s[0], s[1], r));
  } else
    throw new Error("Data array must be of length 1 or 2");
  throw new Error("Bad data compare_style: " + n);
}
function _o(t) {
  return t === null || t[0] === null ? !1 : t[0] < 0;
}
function mo(t, e, n, r, i, s) {
  var a = t, l = e === null, u = {};
  n.forEach(function(m) {
    var g = m.bigg_id;
    if (!(g in u))
      if (u[g] = !0, l)
        a = An(a, g, g + `
`);
      else {
        if (!(g in e))
          return;
        var _ = e[g], E = Nr(_, r, s), c = E === null ? Mi : nn(".3g");
        if (_.length === 1)
          a = An(
            a,
            g,
            g + " (" + p(_[0], c) + `)
`
          );
        else if (_.length === 2) {
          var w, T = Q.any(_, function(A) {
            return _r(A) !== null;
          });
          T ? w = g + " (" + p(_[0], c) + ", " + p(_[1], c) + ": " + p(E, c) + `)
` : w = g + " (" + p(_[0], c) + ", " + p(_[1], c) + `)
`, a = An(a, g, w);
        }
      }
  }), a = a.replace(qc, `
`).replace(Vc, "$1");
  var h = a.split(`
`).map(function(m) {
    for (var g = 0, _ = n.length; g < _; g++) {
      var E = n[g];
      if (m.indexOf(E.bigg_id) !== -1)
        return i === "name" && (m = An(m, E.bigg_id, E.name)), { bigg_id: E.bigg_id, name: E.name, text: m };
    }
    return { bigg_id: null, name: null, text: m };
  });
  return h;
  function p(m, g) {
    return m === null ? "nd" : g(m);
  }
}
function es(t, e) {
  if (t === null)
    return i(null);
  if (t.length === 1) {
    var n = e === null ? Mi : nn(".3g");
    return i(t[0], n);
  }
  if (t.length === 2) {
    var n = e === null ? Mi : nn(".3g"), r = i(t[0], n);
    return r += ", " + i(t[1], n), r += ": " + i(e, n), r;
  }
  return "";
  function i(s, a) {
    return s === null ? "(nd)" : a(s);
  }
}
function rh(t) {
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
function ih(t) {
  var e = t.replace(Hc, "$1$2").replace(Yc, "").split(" ").filter(function(n) {
    return n != "";
  });
  return eo(e);
}
function sh(t, e, n) {
  var r = [null], i = 1;
  for (var s in e) {
    r = e[s].map(function() {
      return null;
    }), i = r.length;
    break;
  }
  if (t == "") return ke(r);
  for (var a = [], l = 0; l < i; l++) {
    var u = t, h = !0;
    for (var s in e) {
      var p = _r(e[s][l]);
      p === null ? p = 0 : h = !1, u = An(u, s, p);
    }
    if (h) {
      a.push(null);
      continue;
    }
    for (; ; ) {
      var m = u;
      if (m = m.replace(Gc, " $1 "), m = m.replace(Zc, function(_, E, c, w) {
        var T = c.split(Xc).map(parseFloat), A = T.reduce(function(b, S) {
          return b + S;
        });
        return E + A + w;
      }), m = m.replace(Jc, function(_, E, c, w) {
        var T = c.split(Kc).map(parseFloat), A = n == "min" ? Math.min.apply(null, T) : T.reduce(function(b, S) {
          return b + S;
        }) / T.length;
        return E + A + w;
      }), m == u)
        break;
      u = m;
    }
    var g = Number(u);
    isNaN(g) ? (console.warn("Could not evaluate " + t), a.push(null)) : a.push(g);
  }
  return a;
}
function An(t, e, n) {
  var r = "(^|[\\s\\(\\)])", i = "([\\s\\(\\)]|$)", s = r + a(e) + i;
  return t.replace(new RegExp(s, "g"), "$1" + n + "$2");
  function a(l) {
    return l.replace($c, "\\$1");
  }
}
function bo(t, e, n, r, i) {
  Q.isUndefined(i) && (i = Object.keys(t));
  var s, a, l;
  return e === null ? (i.map(function(u) {
    s = t[u], s.data = null, s.data_string = "";
    for (a in s.segments)
      l = s.segments[a], l.data = null;
    s.gene_string = null;
  }), !1) : (i.map(function(u) {
    s = t[u];
    var h = e[s.bigg_id] || e[s.name] || null, p = Nr(h, n, r), m = _o(h), g = es(h, p);
    s.data = p, s.data_string = g, s.reverse_flux = m, s.gene_string = null;
    for (a in s.segments)
      l = s.segments[a], l.data = s.data, l.reverse_flux = s.reverse_flux;
  }), !0);
}
function vo(t, e, n, r, i) {
  return Q.isUndefined(i) && (i = Object.keys(t)), e === null ? (i.map((s) => {
    t[s].data = null, t[s].data_string = "";
  }), !1) : (i.map((s) => {
    var a = t[s];
    const l = e[a.bigg_id] || e[a.name] || null, u = Nr(l, n, r), h = es(l, u);
    a.data = u, a.data_string = h;
  }), !0);
}
function yo(t, e, n, r, i, s, a) {
  if (Q.isUndefined(a) && (a = Object.keys(t)), e === null)
    return a.map(function(p) {
      var m = t[p];
      m.data = null, m.data_string = "", m.reverse_flux = !1;
      for (var g in m.segments) {
        var _ = m.segments[g];
        _.data = null;
      }
      m.gene_string = null;
    }), !1;
  var l = [null];
  for (var u in e) {
    for (var h in e[u]) {
      l = e[u][h].map(function() {
        return null;
      });
      break;
    }
    break;
  }
  return a.map(function(p) {
    var m = t[p], g = m.gene_reaction_rule, _, E, c = e[m.bigg_id];
    Q.isUndefined(c) ? (E = {}, _ = ke(l)) : (E = c, _ = sh(
      g,
      E,
      s
    ));
    var w = Nr(_, n, i), T = _o(_), A = es(_, w);
    m.data = w, m.data_string = A, m.reverse_flux = T;
    for (var b in m.segments) {
      var S = m.segments[b];
      S.data = m.data, S.reverse_flux = m.reverse_flux;
    }
    m.gene_string = mo(
      g,
      E,
      m.genes,
      n,
      r,
      i
    );
  }), !0;
}
var cn = ge.make_class();
cn.from_cobra_json = oh;
cn.build_reaction_string = ah;
cn.prototype = {
  init: lh,
  apply_reaction_data: uh,
  apply_metabolite_data: ch,
  apply_gene_data: hh
};
function ah(t, e) {
  var n = function(u) {
    return u == 1 ? "" : String(u) + " ";
  }, r = [], i = [];
  for (var s in t) {
    var a = t[s];
    a > 0 ? i.push(n(a) + s) : r.push(n(Math.abs(a)) + s);
  }
  var l = r.join(" + ");
  return e ? l += " ↔ " : l += " → ", l += i.join(" + "), l;
}
function oh(t) {
  if (!(t.reactions && t.metabolites))
    throw new Error("Bad model data.");
  for (var e = {}, n = 0, r = t.genes.length; n < r; n++) {
    var i = t.genes[n], s = i.id;
    e[s] = i;
  }
  var a = new cn();
  a.reactions = {};
  for (var n = 0, r = t.reactions.length; n < r; n++) {
    var i = t.reactions[n], s = i.id, l = ge.clone(i);
    if (delete l.id, l.bigg_id = s, l.data_string = "", l.genes = [], l.reversibility = l.lower_bound < 0 && l.upper_bound > 0, l.upper_bound <= 0 && l.lower_bound < 0)
      for (var u in l.metabolites)
        l.metabolites[u] = -l.metabolites[u];
    if (delete l.lower_bound, delete l.upper_bound, "gene_reaction_rule" in l) {
      var h = ih(l.gene_reaction_rule);
      h.forEach(function(c) {
        if (c in e) {
          var w = ge.clone(e[c]);
          w.bigg_id = w.id, delete w.id, l.genes.push(w);
        } else
          console.warn("Could not find gene for gene_id " + c);
      });
    }
    a.reactions[s] = l;
  }
  a.metabolites = {};
  for (var n = 0, r = t.metabolites.length; n < r; n++) {
    var i = t.metabolites[n], s = i.id, p = ge.clone(i);
    delete p.id, p.bigg_id = s, a.metabolites[s] = p;
  }
  return a;
}
function lh() {
  this.reactions = {}, this.metabolites = {};
}
function uh(t, e, n) {
  bo(
    this.reactions,
    t,
    e,
    n
  );
}
function ch(t, e, n) {
  vo(
    this.metabolites,
    t,
    e,
    n
  );
}
function hh(t, e, n, r, i) {
  yo(
    this.reactions,
    t,
    e,
    n,
    r,
    i
  );
}
class fh {
  constructor(e, n, r, i) {
    const s = e.append("div").attr("id", "rxn-input");
    this.placed_div = Tr(s, n, { x: 240, y: 0 }), this.placed_div.hide(), this.completely = Cc(s.node(), { backgroundColor: "#eee" }), s.append("button").attr("class", "button input-close-button").text("×").on("mousedown", () => this.hideDropdown()), this.map = n;
    const a = 90;
    this.direction_arrow = new Dc(n.sel), this.direction_arrow.setRotation(a), this.setUpMapCallbacks(n), this.zoomContainer = r, this.setUpZoomCallbacks(r), this.settings = i, this.toggle(!1), this.target_coords = null;
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
      Q.isNull(this.target_coords) ? n = this.reloadAtSelected() : this.placed_div.place(this.target_coords), n && (this.showDropdown(), this.map.set_status("Click on the canvas or an existing metabolite")), this.direction_arrow.show();
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
    const i = this.settings.get("identifiers_on_map") === "name", s = this.settings.get("allow_building_duplicate_reactions"), a = [], l = this.map.cobra_model.reactions, u = this.map.cobra_model.metabolites, h = this.map.reactions, p = this.map.has_data_on_reactions, m = e ? i ? e.name : e.bigg_id : "", g = (T, A) => T.replace(new RegExp("(^| )(" + A.join("|") + ")($| )", "g"), "$1<b>$2</b>$3"), _ = {};
    for (let T in l) {
      const A = l[T], b = A.name, S = i ? b : T;
      if (!(!s && this.alreadyDrawn(T, h))) {
        for (let x in A.metabolites)
          if (r || x === e.bigg_id) {
            if (T in _) continue;
            let z = {};
            const C = [];
            let N;
            if (i)
              for (N in A.metabolites) {
                var E = u[N].name;
                z[E] = A.metabolites[N], C.push(E);
              }
            else {
              z = ge.clone(A.metabolites);
              for (N in A.metabolites)
                C.push(N);
            }
            const B = Q.flatten(
              A.genes.map((j) => [j.name, j.biggId])
            ), V = cn.build_reaction_string(
              z,
              A.reversibility,
              A.lower_bound,
              A.upper_bound
            ), R = [S].concat(C).concat(B).filter((j) => j);
            p ? a.push({
              reaction_data: A.data,
              html: "<b>" + S + "</b>: " + A.data_string,
              matches: R,
              id: T
            }) : a.push({
              html: "<b>" + S + "</b>	" + g(V, [m]),
              matches: R,
              id: T
            }), _[T] = !0;
          }
      }
    }
    const c = p ? (T, A) => Math.abs(T.reaction_data) > Math.abs(A.reaction_data) ? -1 : 1 : (T, A) => T.html.toLowerCase() < A.html.toLowerCase() ? -1 : 1;
    this.completely.options = a.sort(c), this.completely.setText("");
    const w = (T) => {
      if (T !== null)
        if (r)
          this.map.new_reaction_from_scratch(
            T,
            n,
            this.direction_arrow.getRotation()
          );
        else {
          if (!(e.node_id in this.map.nodes)) {
            console.error("Selected node no longer exists"), this.hideDropdown();
            return;
          }
          this.map.new_reaction_for_metabolite(
            T,
            e.node_id,
            this.direction_arrow.getRotation()
          );
        }
    };
    return this.completely.onEnter = function(T) {
      this.setText(""), this.onChange(""), w(T);
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
          x: Qe(n)[0],
          y: Qe(n)[1]
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
class hn {
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
function fn(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function Wn(t, e) {
  var n = Object.create(t.prototype);
  for (var r in e) n[r] = e[r];
  return n;
}
function xt() {
}
var Et = 0.7, rn = 1 / Et, Zt = "\\s*([+-]?\\d+)\\s*", Bn = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*", lt = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*", dh = /^#([0-9a-f]{3})$/, ph = /^#([0-9a-f]{6})$/, gh = new RegExp("^rgb\\(" + [Zt, Zt, Zt] + "\\)$"), _h = new RegExp("^rgb\\(" + [lt, lt, lt] + "\\)$"), mh = new RegExp("^rgba\\(" + [Zt, Zt, Zt, Bn] + "\\)$"), bh = new RegExp("^rgba\\(" + [lt, lt, lt, Bn] + "\\)$"), vh = new RegExp("^hsl\\(" + [Bn, lt, lt] + "\\)$"), yh = new RegExp("^hsla\\(" + [Bn, lt, lt, Bn] + "\\)$"), Ps = {
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
fn(xt, zt, {
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
function zt(t) {
  var e;
  return t = (t + "").trim().toLowerCase(), (e = dh.exec(t)) ? (e = parseInt(e[1], 16), new We(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1)) : (e = ph.exec(t)) ? Bs(parseInt(e[1], 16)) : (e = gh.exec(t)) ? new We(e[1], e[2], e[3], 1) : (e = _h.exec(t)) ? new We(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = mh.exec(t)) ? Rs(e[1], e[2], e[3], e[4]) : (e = bh.exec(t)) ? Rs(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = vh.exec(t)) ? Us(e[1], e[2] / 100, e[3] / 100, 1) : (e = yh.exec(t)) ? Us(e[1], e[2] / 100, e[3] / 100, e[4]) : Ps.hasOwnProperty(t) ? Bs(Ps[t]) : t === "transparent" ? new We(NaN, NaN, NaN, 0) : null;
}
function Bs(t) {
  return new We(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function Rs(t, e, n, r) {
  return r <= 0 && (t = e = n = NaN), new We(t, e, n, r);
}
function ts(t) {
  return t instanceof xt || (t = zt(t)), t ? (t = t.rgb(), new We(t.r, t.g, t.b, t.opacity)) : new We();
}
function ki(t, e, n, r) {
  return arguments.length === 1 ? ts(t) : new We(t, e, n, r ?? 1);
}
function We(t, e, n, r) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +r;
}
fn(We, ki, Wn(xt, {
  brighter: function(t) {
    return t = t == null ? rn : Math.pow(rn, t), new We(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker: function(t) {
    return t = t == null ? Et : Math.pow(Et, t), new We(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: function() {
    return "#" + jr(this.r) + jr(this.g) + jr(this.b);
  },
  toString: function() {
    var t = this.opacity;
    return t = isNaN(t) ? 1 : Math.max(0, Math.min(1, t)), (t === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (t === 1 ? ")" : ", " + t + ")");
  }
}));
function jr(t) {
  return t = Math.max(0, Math.min(255, Math.round(t) || 0)), (t < 16 ? "0" : "") + t.toString(16);
}
function Us(t, e, n, r) {
  return r <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new at(t, e, n, r);
}
function wh(t) {
  if (t instanceof at) return new at(t.h, t.s, t.l, t.opacity);
  if (t instanceof xt || (t = zt(t)), !t) return new at();
  if (t instanceof at) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, r = t.b / 255, i = Math.min(e, n, r), s = Math.max(e, n, r), a = NaN, l = s - i, u = (s + i) / 2;
  return l ? (e === s ? a = (n - r) / l + (n < r) * 6 : n === s ? a = (r - e) / l + 2 : a = (e - n) / l + 4, l /= u < 0.5 ? s + i : 2 - s - i, a *= 60) : l = u > 0 && u < 1 ? 0 : a, new at(a, l, u, t.opacity);
}
function xh(t, e, n, r) {
  return arguments.length === 1 ? wh(t) : new at(t, e, n, r ?? 1);
}
function at(t, e, n, r) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +r;
}
fn(at, xh, Wn(xt, {
  brighter: function(t) {
    return t = t == null ? rn : Math.pow(rn, t), new at(this.h, this.s, this.l * t, this.opacity);
  },
  darker: function(t) {
    return t = t == null ? Et : Math.pow(Et, t), new at(this.h, this.s, this.l * t, this.opacity);
  },
  rgb: function() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - r;
    return new We(
      ei(t >= 240 ? t - 240 : t + 120, i, r),
      ei(t, i, r),
      ei(t < 120 ? t + 240 : t - 120, i, r),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  }
}));
function ei(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
var wo = Math.PI / 180, xo = 180 / Math.PI, mr = 18, So = 0.96422, Mo = 1, ko = 0.82521, Co = 4 / 29, Jt = 6 / 29, Eo = 3 * Jt * Jt, Sh = Jt * Jt * Jt;
function zo(t) {
  if (t instanceof ut) return new ut(t.l, t.a, t.b, t.opacity);
  if (t instanceof gt) return To(t);
  t instanceof We || (t = ts(t));
  var e = ii(t.r), n = ii(t.g), r = ii(t.b), i = ti((0.2225045 * e + 0.7168786 * n + 0.0606169 * r) / Mo), s, a;
  return e === n && n === r ? s = a = i : (s = ti((0.4360747 * e + 0.3850649 * n + 0.1430804 * r) / So), a = ti((0.0139322 * e + 0.0971045 * n + 0.7141733 * r) / ko)), new ut(116 * i - 16, 500 * (s - i), 200 * (i - a), t.opacity);
}
function Mh(t, e, n, r) {
  return arguments.length === 1 ? zo(t) : new ut(t, e, n, r ?? 1);
}
function ut(t, e, n, r) {
  this.l = +t, this.a = +e, this.b = +n, this.opacity = +r;
}
fn(ut, Mh, Wn(xt, {
  brighter: function(t) {
    return new ut(this.l + mr * (t ?? 1), this.a, this.b, this.opacity);
  },
  darker: function(t) {
    return new ut(this.l - mr * (t ?? 1), this.a, this.b, this.opacity);
  },
  rgb: function() {
    var t = (this.l + 16) / 116, e = isNaN(this.a) ? t : t + this.a / 500, n = isNaN(this.b) ? t : t - this.b / 200;
    return e = So * ni(e), t = Mo * ni(t), n = ko * ni(n), new We(
      ri(3.1338561 * e - 1.6168667 * t - 0.4906146 * n),
      ri(-0.9787684 * e + 1.9161415 * t + 0.033454 * n),
      ri(0.0719453 * e - 0.2289914 * t + 1.4052427 * n),
      this.opacity
    );
  }
}));
function ti(t) {
  return t > Sh ? Math.pow(t, 1 / 3) : t / Eo + Co;
}
function ni(t) {
  return t > Jt ? t * t * t : Eo * (t - Co);
}
function ri(t) {
  return 255 * (t <= 31308e-7 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055);
}
function ii(t) {
  return (t /= 255) <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
}
function kh(t) {
  if (t instanceof gt) return new gt(t.h, t.c, t.l, t.opacity);
  if (t instanceof ut || (t = zo(t)), t.a === 0 && t.b === 0) return new gt(NaN, 0 < t.l && t.l < 100 ? 0 : NaN, t.l, t.opacity);
  var e = Math.atan2(t.b, t.a) * xo;
  return new gt(e < 0 ? e + 360 : e, Math.sqrt(t.a * t.a + t.b * t.b), t.l, t.opacity);
}
function Ch(t, e, n, r) {
  return arguments.length === 1 ? kh(t) : new gt(t, e, n, r ?? 1);
}
function gt(t, e, n, r) {
  this.h = +t, this.c = +e, this.l = +n, this.opacity = +r;
}
function To(t) {
  if (isNaN(t.h)) return new ut(t.l, 0, 0, t.opacity);
  var e = t.h * wo;
  return new ut(t.l, Math.cos(e) * t.c, Math.sin(e) * t.c, t.opacity);
}
fn(gt, Ch, Wn(xt, {
  brighter: function(t) {
    return new gt(this.h, this.c, this.l + mr * (t ?? 1), this.opacity);
  },
  darker: function(t) {
    return new gt(this.h, this.c, this.l - mr * (t ?? 1), this.opacity);
  },
  rgb: function() {
    return To(this).rgb();
  }
}));
var No = -0.14861, ns = 1.78277, rs = -0.29227, Dr = -0.90649, Rn = 1.97294, Ws = Rn * Dr, $s = Rn * ns, qs = ns * rs - Dr * No;
function Eh(t) {
  if (t instanceof Ct) return new Ct(t.h, t.s, t.l, t.opacity);
  t instanceof We || (t = ts(t));
  var e = t.r / 255, n = t.g / 255, r = t.b / 255, i = (qs * r + Ws * e - $s * n) / (qs + Ws - $s), s = r - i, a = (Rn * (n - i) - rs * s) / Dr, l = Math.sqrt(a * a + s * s) / (Rn * i * (1 - i)), u = l ? Math.atan2(a, s) * xo - 120 : NaN;
  return new Ct(u < 0 ? u + 360 : u, l, i, t.opacity);
}
function ct(t, e, n, r) {
  return arguments.length === 1 ? Eh(t) : new Ct(t, e, n, r ?? 1);
}
function Ct(t, e, n, r) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +r;
}
fn(Ct, ct, Wn(xt, {
  brighter: function(t) {
    return t = t == null ? rn : Math.pow(rn, t), new Ct(this.h, this.s, this.l * t, this.opacity);
  },
  darker: function(t) {
    return t = t == null ? Et : Math.pow(Et, t), new Ct(this.h, this.s, this.l * t, this.opacity);
  },
  rgb: function() {
    var t = isNaN(this.h) ? 0 : (this.h + 120) * wo, e = +this.l, n = isNaN(this.s) ? 0 : this.s * e * (1 - e), r = Math.cos(t), i = Math.sin(t);
    return new We(
      255 * (e + n * (No * r + ns * i)),
      255 * (e + n * (rs * r + Dr * i)),
      255 * (e + n * (Rn * r)),
      this.opacity
    );
  }
}));
function Ar(t) {
  return function() {
    return t;
  };
}
function Do(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function zh(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(r) {
    return Math.pow(t + r * e, n);
  };
}
function Th(t, e) {
  var n = e - t;
  return n ? Do(t, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : Ar(isNaN(t) ? e : t);
}
function Nh(t) {
  return (t = +t) == 1 ? Qt : function(e, n) {
    return n - e ? zh(e, n, t) : Ar(isNaN(e) ? n : e);
  };
}
function Qt(t, e) {
  var n = e - t;
  return n ? Do(t, n) : Ar(isNaN(t) ? e : t);
}
const br = (function t(e) {
  var n = Nh(e);
  function r(i, s) {
    var a = n((i = ki(i)).r, (s = ki(s)).r), l = n(i.g, s.g), u = n(i.b, s.b), h = Qt(i.opacity, s.opacity);
    return function(p) {
      return i.r = a(p), i.g = l(p), i.b = u(p), i.opacity = h(p), i + "";
    };
  }
  return r.gamma = t, r;
})(1);
function Dh(t, e) {
  var n = e ? e.length : 0, r = t ? Math.min(n, t.length) : 0, i = new Array(r), s = new Array(n), a;
  for (a = 0; a < r; ++a) i[a] = Ir(t[a], e[a]);
  for (; a < n; ++a) s[a] = e[a];
  return function(l) {
    for (a = 0; a < r; ++a) s[a] = i[a](l);
    return s;
  };
}
function Ah(t, e) {
  var n = /* @__PURE__ */ new Date();
  return t = +t, e -= t, function(r) {
    return n.setTime(t + e * r), n;
  };
}
function et(t, e) {
  return t = +t, e -= t, function(n) {
    return t + e * n;
  };
}
function Ih(t, e) {
  var n = {}, r = {}, i;
  (t === null || typeof t != "object") && (t = {}), (e === null || typeof e != "object") && (e = {});
  for (i in e)
    i in t ? n[i] = Ir(t[i], e[i]) : r[i] = e[i];
  return function(s) {
    for (i in n) r[i] = n[i](s);
    return r;
  };
}
var Ci = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, si = new RegExp(Ci.source, "g");
function Oh(t) {
  return function() {
    return t;
  };
}
function Lh(t) {
  return function(e) {
    return t(e) + "";
  };
}
function Ao(t, e) {
  var n = Ci.lastIndex = si.lastIndex = 0, r, i, s, a = -1, l = [], u = [];
  for (t = t + "", e = e + ""; (r = Ci.exec(t)) && (i = si.exec(e)); )
    (s = i.index) > n && (s = e.slice(n, s), l[a] ? l[a] += s : l[++a] = s), (r = r[0]) === (i = i[0]) ? l[a] ? l[a] += i : l[++a] = i : (l[++a] = null, u.push({ i: a, x: et(r, i) })), n = si.lastIndex;
  return n < e.length && (s = e.slice(n), l[a] ? l[a] += s : l[++a] = s), l.length < 2 ? u[0] ? Lh(u[0].x) : Oh(e) : (e = u.length, function(h) {
    for (var p = 0, m; p < e; ++p) l[(m = u[p]).i] = m.x(h);
    return l.join("");
  });
}
function Ir(t, e) {
  var n = typeof e, r;
  return e == null || n === "boolean" ? Ar(e) : (n === "number" ? et : n === "string" ? (r = zt(e)) ? (e = r, br) : Ao : e instanceof zt ? br : e instanceof Date ? Ah : Array.isArray(e) ? Dh : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? Ih : et)(t, e);
}
function Fh(t, e) {
  return t = +t, e -= t, function(n) {
    return Math.round(t + e * n);
  };
}
var Vs = 180 / Math.PI, Ei = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Io(t, e, n, r, i, s) {
  var a, l, u;
  return (a = Math.sqrt(t * t + e * e)) && (t /= a, e /= a), (u = t * n + e * r) && (n -= t * u, r -= e * u), (l = Math.sqrt(n * n + r * r)) && (n /= l, r /= l, u /= l), t * r < e * n && (t = -t, e = -e, u = -u, a = -a), {
    translateX: i,
    translateY: s,
    rotate: Math.atan2(e, t) * Vs,
    skewX: Math.atan(u) * Vs,
    scaleX: a,
    scaleY: l
  };
}
var wn, ai, Hs, Kn;
function Ph(t) {
  return t === "none" ? Ei : (wn || (wn = document.createElement("DIV"), ai = document.documentElement, Hs = document.defaultView), wn.style.transform = t, t = Hs.getComputedStyle(ai.appendChild(wn), null).getPropertyValue("transform"), ai.removeChild(wn), t = t.slice(7, -1).split(","), Io(+t[0], +t[1], +t[2], +t[3], +t[4], +t[5]));
}
function Bh(t) {
  return t == null || (Kn || (Kn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Kn.setAttribute("transform", t), !(t = Kn.transform.baseVal.consolidate())) ? Ei : (t = t.matrix, Io(t.a, t.b, t.c, t.d, t.e, t.f));
}
function Oo(t, e, n, r) {
  function i(h) {
    return h.length ? h.pop() + " " : "";
  }
  function s(h, p, m, g, _, E) {
    if (h !== m || p !== g) {
      var c = _.push("translate(", null, e, null, n);
      E.push({ i: c - 4, x: et(h, m) }, { i: c - 2, x: et(p, g) });
    } else (m || g) && _.push("translate(" + m + e + g + n);
  }
  function a(h, p, m, g) {
    h !== p ? (h - p > 180 ? p += 360 : p - h > 180 && (h += 360), g.push({ i: m.push(i(m) + "rotate(", null, r) - 2, x: et(h, p) })) : p && m.push(i(m) + "rotate(" + p + r);
  }
  function l(h, p, m, g) {
    h !== p ? g.push({ i: m.push(i(m) + "skewX(", null, r) - 2, x: et(h, p) }) : p && m.push(i(m) + "skewX(" + p + r);
  }
  function u(h, p, m, g, _, E) {
    if (h !== m || p !== g) {
      var c = _.push(i(_) + "scale(", null, ",", null, ")");
      E.push({ i: c - 4, x: et(h, m) }, { i: c - 2, x: et(p, g) });
    } else (m !== 1 || g !== 1) && _.push(i(_) + "scale(" + m + "," + g + ")");
  }
  return function(h, p) {
    var m = [], g = [];
    return h = t(h), p = t(p), s(h.translateX, h.translateY, p.translateX, p.translateY, m, g), a(h.rotate, p.rotate, m, g), l(h.skewX, p.skewX, m, g), u(h.scaleX, h.scaleY, p.scaleX, p.scaleY, m, g), h = p = null, function(_) {
      for (var E = -1, c = g.length, w; ++E < c; ) m[(w = g[E]).i] = w.x(_);
      return m.join("");
    };
  };
}
var Rh = Oo(Ph, "px, ", "px)", "deg)"), Uh = Oo(Bh, ", ", ")", ")"), xn = Math.SQRT2, oi = 2, Ys = 4, Wh = 1e-12;
function Gs(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function $h(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function qh(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
function Vh(t, e) {
  var n = t[0], r = t[1], i = t[2], s = e[0], a = e[1], l = e[2], u = s - n, h = a - r, p = u * u + h * h, m, g;
  if (p < Wh)
    g = Math.log(l / i) / xn, m = function(A) {
      return [
        n + A * u,
        r + A * h,
        i * Math.exp(xn * A * g)
      ];
    };
  else {
    var _ = Math.sqrt(p), E = (l * l - i * i + Ys * p) / (2 * i * oi * _), c = (l * l - i * i - Ys * p) / (2 * l * oi * _), w = Math.log(Math.sqrt(E * E + 1) - E), T = Math.log(Math.sqrt(c * c + 1) - c);
    g = (T - w) / xn, m = function(A) {
      var b = A * g, S = Gs(w), x = i / (oi * _) * (S * qh(xn * b + w) - $h(w));
      return [
        n + x * u,
        r + x * h,
        i * S / Gs(xn * b + w)
      ];
    };
  }
  return m.duration = g * 1e3, m;
}
function Lo(t) {
  return (function e(n) {
    n = +n;
    function r(i, s) {
      var a = t((i = ct(i)).h, (s = ct(s)).h), l = Qt(i.s, s.s), u = Qt(i.l, s.l), h = Qt(i.opacity, s.opacity);
      return function(p) {
        return i.h = a(p), i.s = l(p), i.l = u(Math.pow(p, n)), i.opacity = h(p), i + "";
      };
    }
    return r.gamma = e, r;
  })(1);
}
Lo(Th);
var is = Lo(Qt), sn = 0, In = 0, Sn = 0, Fo = 1e3, vr, On, yr = 0, Tt = 0, Or = 0, Un = typeof performance == "object" && performance.now ? performance : Date, Po = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function Lr() {
  return Tt || (Po(Hh), Tt = Un.now() + Or);
}
function Hh() {
  Tt = 0;
}
function wr() {
  this._call = this._time = this._next = null;
}
wr.prototype = Bo.prototype = {
  constructor: wr,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Lr() : +n) + (e == null ? 0 : +e), !this._next && On !== this && (On ? On._next = this : vr = this, On = this), this._call = t, this._time = n, zi();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, zi());
  }
};
function Bo(t, e, n) {
  var r = new wr();
  return r.restart(t, e, n), r;
}
function Yh() {
  Lr(), ++sn;
  for (var t = vr, e; t; )
    (e = Tt - t._time) >= 0 && t._call.call(null, e), t = t._next;
  --sn;
}
function Xs() {
  Tt = (yr = Un.now()) + Or, sn = In = 0;
  try {
    Yh();
  } finally {
    sn = 0, Xh(), Tt = 0;
  }
}
function Gh() {
  var t = Un.now(), e = t - yr;
  e > Fo && (Or -= e, yr = t);
}
function Xh() {
  for (var t, e = vr, n, r = 1 / 0; e; )
    e._call ? (r > e._time && (r = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : vr = n);
  On = t, zi(r);
}
function zi(t) {
  if (!sn) {
    In && (In = clearTimeout(In));
    var e = t - Tt;
    e > 24 ? (t < 1 / 0 && (In = setTimeout(Xs, t - Un.now() - Or)), Sn && (Sn = clearInterval(Sn))) : (Sn || (yr = Un.now(), Sn = setInterval(Gh, Fo)), sn = 1, Po(Xs));
  }
}
function Ks(t, e, n) {
  var r = new wr();
  return e = e == null ? 0 : +e, r.restart(function(i) {
    r.stop(), t(i + e);
  }, e, n), r;
}
var Kh = un("start", "end", "cancel", "interrupt"), Zh = [], Ro = 0, Zs = 1, Ti = 2, ir = 3, Js = 4, Ni = 5, sr = 6;
function Fr(t, e, n, r, i, s) {
  var a = t.__transition;
  if (!a) t.__transition = {};
  else if (n in a) return;
  Jh(t, n, {
    name: e,
    index: r,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Kh,
    tween: Zh,
    time: s.time,
    delay: s.delay,
    duration: s.duration,
    ease: s.ease,
    timer: null,
    state: Ro
  });
}
function ss(t, e) {
  var n = nt(t, e);
  if (n.state > Ro) throw new Error("too late; already scheduled");
  return n;
}
function bt(t, e) {
  var n = nt(t, e);
  if (n.state > ir) throw new Error("too late; already running");
  return n;
}
function nt(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function Jh(t, e, n) {
  var r = t.__transition, i;
  r[e] = n, n.timer = Bo(s, 0, n.time);
  function s(h) {
    n.state = Zs, n.timer.restart(a, n.delay, n.time), n.delay <= h && a(h - n.delay);
  }
  function a(h) {
    var p, m, g, _;
    if (n.state !== Zs) return u();
    for (p in r)
      if (_ = r[p], _.name === n.name) {
        if (_.state === ir) return Ks(a);
        _.state === Js ? (_.state = sr, _.timer.stop(), _.on.call("interrupt", t, t.__data__, _.index, _.group), delete r[p]) : +p < e && (_.state = sr, _.timer.stop(), _.on.call("cancel", t, t.__data__, _.index, _.group), delete r[p]);
      }
    if (Ks(function() {
      n.state === ir && (n.state = Js, n.timer.restart(l, n.delay, n.time), l(h));
    }), n.state = Ti, n.on.call("start", t, t.__data__, n.index, n.group), n.state === Ti) {
      for (n.state = ir, i = new Array(g = n.tween.length), p = 0, m = -1; p < g; ++p)
        (_ = n.tween[p].value.call(t, t.__data__, n.index, n.group)) && (i[++m] = _);
      i.length = m + 1;
    }
  }
  function l(h) {
    for (var p = h < n.duration ? n.ease.call(null, h / n.duration) : (n.timer.restart(u), n.state = Ni, 1), m = -1, g = i.length; ++m < g; )
      i[m].call(t, p);
    n.state === Ni && (n.on.call("end", t, t.__data__, n.index, n.group), u());
  }
  function u() {
    n.state = sr, n.timer.stop(), delete r[e];
    for (var h in r) return;
    delete t.__transition;
  }
}
function jt(t, e) {
  var n = t.__transition, r, i, s = !0, a;
  if (n) {
    e = e == null ? null : e + "";
    for (a in n) {
      if ((r = n[a]).name !== e) {
        s = !1;
        continue;
      }
      i = r.state > Ti && r.state < Ni, r.state = sr, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", t, t.__data__, r.index, r.group), delete n[a];
    }
    s && delete t.__transition;
  }
}
function Qh(t) {
  return this.each(function() {
    jt(this, t);
  });
}
function jh(t, e) {
  var n, r;
  return function() {
    var i = bt(this, t), s = i.tween;
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
function ef(t, e, n) {
  var r, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var s = bt(this, t), a = s.tween;
    if (a !== r) {
      i = (r = a).slice();
      for (var l = { name: e, value: n }, u = 0, h = i.length; u < h; ++u)
        if (i[u].name === e) {
          i[u] = l;
          break;
        }
      u === h && i.push(l);
    }
    s.tween = i;
  };
}
function tf(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var r = nt(this.node(), n).tween, i = 0, s = r.length, a; i < s; ++i)
      if ((a = r[i]).name === t)
        return a.value;
    return null;
  }
  return this.each((e == null ? jh : ef)(n, t, e));
}
function as(t, e, n) {
  var r = t._id;
  return t.each(function() {
    var i = bt(this, r);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return nt(i, r).value[e];
  };
}
function Uo(t, e) {
  var n;
  return (typeof e == "number" ? et : e instanceof zt ? br : (n = zt(e)) ? (e = n, br) : Ao)(t, e);
}
function nf(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function rf(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function sf(t, e, n) {
  var r, i = n + "", s;
  return function() {
    var a = this.getAttribute(t);
    return a === i ? null : a === r ? s : s = e(r = a, n);
  };
}
function af(t, e, n) {
  var r, i = n + "", s;
  return function() {
    var a = this.getAttributeNS(t.space, t.local);
    return a === i ? null : a === r ? s : s = e(r = a, n);
  };
}
function of(t, e, n) {
  var r, i, s;
  return function() {
    var a, l = n(this), u;
    return l == null ? void this.removeAttribute(t) : (a = this.getAttribute(t), u = l + "", a === u ? null : a === r && u === i ? s : (i = u, s = e(r = a, l)));
  };
}
function lf(t, e, n) {
  var r, i, s;
  return function() {
    var a, l = n(this), u;
    return l == null ? void this.removeAttributeNS(t.space, t.local) : (a = this.getAttributeNS(t.space, t.local), u = l + "", a === u ? null : a === r && u === i ? s : (i = u, s = e(r = a, l)));
  };
}
function uf(t, e) {
  var n = zr(t), r = n === "transform" ? Uh : Uo;
  return this.attrTween(t, typeof e == "function" ? (n.local ? lf : of)(n, r, as(this, "attr." + t, e)) : e == null ? (n.local ? rf : nf)(n) : (n.local ? af : sf)(n, r, e));
}
function cf(t, e) {
  return function(n) {
    this.setAttribute(t, e(n));
  };
}
function hf(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e(n));
  };
}
function ff(t, e) {
  var n, r;
  function i() {
    var s = e.apply(this, arguments);
    return s !== r && (n = (r = s) && hf(t, s)), n;
  }
  return i._value = e, i;
}
function df(t, e) {
  var n, r;
  function i() {
    var s = e.apply(this, arguments);
    return s !== r && (n = (r = s) && cf(t, s)), n;
  }
  return i._value = e, i;
}
function pf(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var r = zr(t);
  return this.tween(n, (r.local ? ff : df)(r, e));
}
function gf(t, e) {
  return function() {
    ss(this, t).delay = +e.apply(this, arguments);
  };
}
function _f(t, e) {
  return e = +e, function() {
    ss(this, t).delay = e;
  };
}
function mf(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? gf : _f)(e, t)) : nt(this.node(), e).delay;
}
function bf(t, e) {
  return function() {
    bt(this, t).duration = +e.apply(this, arguments);
  };
}
function vf(t, e) {
  return e = +e, function() {
    bt(this, t).duration = e;
  };
}
function yf(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? bf : vf)(e, t)) : nt(this.node(), e).duration;
}
function wf(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    bt(this, t).ease = e;
  };
}
function xf(t) {
  var e = this._id;
  return arguments.length ? this.each(wf(e, t)) : nt(this.node(), e).ease;
}
function Sf(t) {
  typeof t != "function" && (t = La(t));
  for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
    for (var s = e[i], a = s.length, l = r[i] = [], u, h = 0; h < a; ++h)
      (u = s[h]) && t.call(u, u.__data__, h, s) && l.push(u);
  return new mt(r, this._parents, this._name, this._id);
}
function Mf(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, r = e.length, i = n.length, s = Math.min(r, i), a = new Array(r), l = 0; l < s; ++l)
    for (var u = e[l], h = n[l], p = u.length, m = a[l] = new Array(p), g, _ = 0; _ < p; ++_)
      (g = u[_] || h[_]) && (m[_] = g);
  for (; l < r; ++l)
    a[l] = e[l];
  return new mt(a, this._parents, this._name, this._id);
}
function kf(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function Cf(t, e, n) {
  var r, i, s = kf(e) ? ss : bt;
  return function() {
    var a = s(this, t), l = a.on;
    l !== r && (i = (r = l).copy()).on(e, n), a.on = i;
  };
}
function Ef(t, e) {
  var n = this._id;
  return arguments.length < 2 ? nt(this.node(), n).on.on(t) : this.each(Cf(n, t, e));
}
function zf(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function Tf() {
  return this.on("end.remove", zf(this._id));
}
function Nf(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Wi(t));
  for (var r = this._groups, i = r.length, s = new Array(i), a = 0; a < i; ++a)
    for (var l = r[a], u = l.length, h = s[a] = new Array(u), p, m, g = 0; g < u; ++g)
      (p = l[g]) && (m = t.call(p, p.__data__, g, l)) && ("__data__" in p && (m.__data__ = p.__data__), h[g] = m, Fr(h[g], e, n, g, h, nt(p, n)));
  return new mt(s, this._parents, e, n);
}
function Df(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Oa(t));
  for (var r = this._groups, i = r.length, s = [], a = [], l = 0; l < i; ++l)
    for (var u = r[l], h = u.length, p, m = 0; m < h; ++m)
      if (p = u[m]) {
        for (var g = t.call(p, p.__data__, m, u), _, E = nt(p, n), c = 0, w = g.length; c < w; ++c)
          (_ = g[c]) && Fr(_, e, n, c, g, E);
        s.push(g), a.push(p);
      }
  return new mt(s, a, e, n);
}
var Af = Ot.prototype.constructor;
function If() {
  return new Af(this._groups, this._parents);
}
function Of(t, e) {
  var n, r, i;
  return function() {
    var s = en(this, t), a = (this.style.removeProperty(t), en(this, t));
    return s === a ? null : s === n && a === r ? i : i = e(n = s, r = a);
  };
}
function Wo(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Lf(t, e, n) {
  var r, i = n + "", s;
  return function() {
    var a = en(this, t);
    return a === i ? null : a === r ? s : s = e(r = a, n);
  };
}
function Ff(t, e, n) {
  var r, i, s;
  return function() {
    var a = en(this, t), l = n(this), u = l + "";
    return l == null && (u = l = (this.style.removeProperty(t), en(this, t))), a === u ? null : a === r && u === i ? s : (i = u, s = e(r = a, l));
  };
}
function Pf(t, e) {
  var n, r, i, s = "style." + e, a = "end." + s, l;
  return function() {
    var u = bt(this, t), h = u.on, p = u.value[s] == null ? l || (l = Wo(e)) : void 0;
    (h !== n || i !== p) && (r = (n = h).copy()).on(a, i = p), u.on = r;
  };
}
function Bf(t, e, n) {
  var r = (t += "") == "transform" ? Rh : Uo;
  return e == null ? this.styleTween(t, Of(t, r)).on("end.style." + t, Wo(t)) : typeof e == "function" ? this.styleTween(t, Ff(t, r, as(this, "style." + t, e))).each(Pf(this._id, t)) : this.styleTween(t, Lf(t, r, e), n).on("end.style." + t, null);
}
function Rf(t, e, n) {
  return function(r) {
    this.style.setProperty(t, e(r), n);
  };
}
function Uf(t, e, n) {
  var r, i;
  function s() {
    var a = e.apply(this, arguments);
    return a !== i && (r = (i = a) && Rf(t, a, n)), r;
  }
  return s._value = e, s;
}
function Wf(t, e, n) {
  var r = "style." + (t += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (e == null) return this.tween(r, null);
  if (typeof e != "function") throw new Error();
  return this.tween(r, Uf(t, e, n ?? ""));
}
function $f(t) {
  return function() {
    this.textContent = t;
  };
}
function qf(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Vf(t) {
  return this.tween("text", typeof t == "function" ? qf(as(this, "text", t)) : $f(t == null ? "" : t + ""));
}
function Hf() {
  for (var t = this._name, e = this._id, n = $o(), r = this._groups, i = r.length, s = 0; s < i; ++s)
    for (var a = r[s], l = a.length, u, h = 0; h < l; ++h)
      if (u = a[h]) {
        var p = nt(u, e);
        Fr(u, t, n, h, a, {
          time: p.time + p.delay + p.duration,
          delay: 0,
          duration: p.duration,
          ease: p.ease
        });
      }
  return new mt(r, this._parents, t, n);
}
function Yf() {
  var t, e, n = this, r = n._id, i = n.size();
  return new Promise(function(s, a) {
    var l = { value: a }, u = { value: function() {
      --i === 0 && s();
    } };
    n.each(function() {
      var h = bt(this, r), p = h.on;
      p !== t && (e = (t = p).copy(), e._.cancel.push(l), e._.interrupt.push(l), e._.end.push(u)), h.on = e;
    });
  });
}
var Gf = 0;
function mt(t, e, n, r) {
  this._groups = t, this._parents = e, this._name = n, this._id = r;
}
function $o() {
  return ++Gf;
}
var Bt = Ot.prototype;
mt.prototype = {
  constructor: mt,
  select: Nf,
  selectAll: Df,
  filter: Sf,
  merge: Mf,
  selection: If,
  transition: Hf,
  call: Bt.call,
  nodes: Bt.nodes,
  node: Bt.node,
  size: Bt.size,
  empty: Bt.empty,
  each: Bt.each,
  on: Ef,
  attr: uf,
  attrTween: pf,
  style: Bf,
  styleTween: Wf,
  text: Vf,
  remove: Tf,
  tween: tf,
  delay: mf,
  duration: yf,
  ease: xf,
  end: Yf
};
function Xf(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var os = 3;
(function t(e) {
  e = +e;
  function n(r) {
    return Math.pow(r, e);
  }
  return n.exponent = t, n;
})(os);
(function t(e) {
  e = +e;
  function n(r) {
    return 1 - Math.pow(1 - r, e);
  }
  return n.exponent = t, n;
})(os);
(function t(e) {
  e = +e;
  function n(r) {
    return ((r *= 2) <= 1 ? Math.pow(r, e) : 2 - Math.pow(2 - r, e)) / 2;
  }
  return n.exponent = t, n;
})(os);
var ls = 1.70158;
(function t(e) {
  e = +e;
  function n(r) {
    return r * r * ((e + 1) * r - e);
  }
  return n.overshoot = t, n;
})(ls);
(function t(e) {
  e = +e;
  function n(r) {
    return --r * r * ((e + 1) * r + e) + 1;
  }
  return n.overshoot = t, n;
})(ls);
(function t(e) {
  e = +e;
  function n(r) {
    return ((r *= 2) < 1 ? r * r * ((e + 1) * r - e) : (r -= 2) * r * ((e + 1) * r + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(ls);
var an = 2 * Math.PI, us = 1, cs = 0.3;
(function t(e, n) {
  var r = Math.asin(1 / (e = Math.max(1, e))) * (n /= an);
  function i(s) {
    return e * Math.pow(2, 10 * --s) * Math.sin((r - s) / n);
  }
  return i.amplitude = function(s) {
    return t(s, n * an);
  }, i.period = function(s) {
    return t(e, s);
  }, i;
})(us, cs);
(function t(e, n) {
  var r = Math.asin(1 / (e = Math.max(1, e))) * (n /= an);
  function i(s) {
    return 1 - e * Math.pow(2, -10 * (s = +s)) * Math.sin((s + r) / n);
  }
  return i.amplitude = function(s) {
    return t(s, n * an);
  }, i.period = function(s) {
    return t(e, s);
  }, i;
})(us, cs);
(function t(e, n) {
  var r = Math.asin(1 / (e = Math.max(1, e))) * (n /= an);
  function i(s) {
    return ((s = s * 2 - 1) < 0 ? e * Math.pow(2, 10 * s) * Math.sin((r - s) / n) : 2 - e * Math.pow(2, -10 * s) * Math.sin((r + s) / n)) / 2;
  }
  return i.amplitude = function(s) {
    return t(s, n * an);
  }, i.period = function(s) {
    return t(e, s);
  }, i;
})(us, cs);
var Di = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Xf
};
function Kf(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      return Di.time = Lr(), Di;
  return n;
}
function Zf(t) {
  var e, n;
  t instanceof mt ? (e = t._id, t = t._name) : (e = $o(), (n = Di).time = Lr(), t = t == null ? null : t + "");
  for (var r = this._groups, i = r.length, s = 0; s < i; ++s)
    for (var a = r[s], l = a.length, u, h = 0; h < l; ++h)
      (u = a[h]) && Fr(u, t, e, h, a, n || Kf(u, e));
  return new mt(r, this._parents, t, e);
}
Ot.prototype.interrupt = Qh;
Ot.prototype.transition = Zf;
function Zn(t) {
  return function() {
    return t;
  };
}
function Jf(t, e, n) {
  this.target = t, this.type = e, this.transform = n;
}
function _t(t, e, n) {
  this.k = t, this.x = e, this.y = n;
}
_t.prototype = {
  constructor: _t,
  scale: function(t) {
    return t === 1 ? this : new _t(this.k * t, this.x, this.y);
  },
  translate: function(t, e) {
    return t === 0 & e === 0 ? this : new _t(this.k, this.x + this.k * t, this.y + this.k * e);
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
var hs = new _t(1, 0, 0);
_t.prototype;
function li() {
  X.stopImmediatePropagation();
}
function Mn() {
  X.preventDefault(), X.stopImmediatePropagation();
}
function Qf() {
  return !X.button;
}
function jf() {
  var t = this, e, n;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, e = t.width.baseVal.value, n = t.height.baseVal.value) : (e = t.clientWidth, n = t.clientHeight), [[0, 0], [e, n]];
}
function Qs() {
  return this.__zoom || hs;
}
function ed() {
  return -X.deltaY * (X.deltaMode ? 120 : 1) / 500;
}
function td() {
  return "ontouchstart" in this;
}
function nd(t, e, n) {
  var r = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], s = t.invertY(e[0][1]) - n[0][1], a = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i),
    a > s ? (s + a) / 2 : Math.min(0, s) || Math.max(0, a)
  );
}
function rd() {
  var t = Qf, e = jf, n = nd, r = ed, i = td, s = [0, 1 / 0], a = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, u = Vh, h = [], p = un("start", "zoom", "end"), m, g, _ = 500, E = 150, c = 0;
  function w(O) {
    O.property("__zoom", Qs).on("wheel.zoom", C).on("mousedown.zoom", N).on("dblclick.zoom", B).filter(i).on("touchstart.zoom", V).on("touchmove.zoom", R).on("touchend.zoom touchcancel.zoom", j).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  w.transform = function(O, W) {
    var Y = O.selection ? O.selection() : O;
    Y.property("__zoom", Qs), O !== Y ? S(O, W) : Y.interrupt().each(function() {
      x(this, arguments).start().zoom(null, typeof W == "function" ? W.apply(this, arguments) : W).end();
    });
  }, w.scaleBy = function(O, W) {
    w.scaleTo(O, function() {
      var Y = this.__zoom.k, Z = typeof W == "function" ? W.apply(this, arguments) : W;
      return Y * Z;
    });
  }, w.scaleTo = function(O, W) {
    w.transform(O, function() {
      var Y = e.apply(this, arguments), Z = this.__zoom, H = b(Y), ne = Z.invert(H), he = typeof W == "function" ? W.apply(this, arguments) : W;
      return n(A(T(Z, he), H, ne), Y, a);
    });
  }, w.translateBy = function(O, W, Y) {
    w.transform(O, function() {
      return n(this.__zoom.translate(
        typeof W == "function" ? W.apply(this, arguments) : W,
        typeof Y == "function" ? Y.apply(this, arguments) : Y
      ), e.apply(this, arguments), a);
    });
  }, w.translateTo = function(O, W, Y) {
    w.transform(O, function() {
      var Z = e.apply(this, arguments), H = this.__zoom, ne = b(Z);
      return n(hs.translate(ne[0], ne[1]).scale(H.k).translate(
        typeof W == "function" ? -W.apply(this, arguments) : -W,
        typeof Y == "function" ? -Y.apply(this, arguments) : -Y
      ), Z, a);
    });
  };
  function T(O, W) {
    return W = Math.max(s[0], Math.min(s[1], W)), W === O.k ? O : new _t(W, O.x, O.y);
  }
  function A(O, W, Y) {
    var Z = W[0] - Y[0] * O.k, H = W[1] - Y[1] * O.k;
    return Z === O.x && H === O.y ? O : new _t(O.k, Z, H);
  }
  function b(O) {
    return [(+O[0][0] + +O[1][0]) / 2, (+O[0][1] + +O[1][1]) / 2];
  }
  function S(O, W, Y) {
    O.on("start.zoom", function() {
      x(this, arguments).start();
    }).on("interrupt.zoom end.zoom", function() {
      x(this, arguments).end();
    }).tween("zoom", function() {
      var Z = this, H = arguments, ne = x(Z, H), he = e.apply(Z, H), ue = Y || b(he), J = Math.max(he[1][0] - he[0][0], he[1][1] - he[0][1]), re = Z.__zoom, le = typeof W == "function" ? W.apply(Z, H) : W, ae = u(re.invert(ue).concat(J / re.k), le.invert(ue).concat(J / le.k));
      return function(ce) {
        if (ce === 1) ce = le;
        else {
          var Ne = ae(ce), K = J / Ne[2];
          ce = new _t(K, ue[0] - Ne[0] * K, ue[1] - Ne[1] * K);
        }
        ne.zoom(null, ce);
      };
    });
  }
  function x(O, W) {
    for (var Y = 0, Z = h.length, H; Y < Z; ++Y)
      if ((H = h[Y]).that === O)
        return H;
    return new z(O, W);
  }
  function z(O, W) {
    this.that = O, this.args = W, this.index = -1, this.active = 0, this.extent = e.apply(O, W);
  }
  z.prototype = {
    start: function() {
      return ++this.active === 1 && (this.index = h.push(this) - 1, this.emit("start")), this;
    },
    zoom: function(O, W) {
      return this.mouse && O !== "mouse" && (this.mouse[1] = W.invert(this.mouse[0])), this.touch0 && O !== "touch" && (this.touch0[1] = W.invert(this.touch0[0])), this.touch1 && O !== "touch" && (this.touch1[1] = W.invert(this.touch1[0])), this.that.__zoom = W, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (h.splice(this.index, 1), this.index = -1, this.emit("end")), this;
    },
    emit: function(O) {
      fr(new Jf(w, O, this.that.__zoom), p.apply, p, [O, this.that, this.args]);
    }
  };
  function C() {
    if (!t.apply(this, arguments)) return;
    var O = x(this, arguments), W = this.__zoom, Y = Math.max(s[0], Math.min(s[1], W.k * Math.pow(2, r.apply(this, arguments)))), Z = Qe(this);
    if (O.wheel)
      (O.mouse[0][0] !== Z[0] || O.mouse[0][1] !== Z[1]) && (O.mouse[1] = W.invert(O.mouse[0] = Z)), clearTimeout(O.wheel);
    else {
      if (W.k === Y) return;
      O.mouse = [Z, W.invert(Z)], jt(this), O.start();
    }
    Mn(), O.wheel = setTimeout(H, E), O.zoom("mouse", n(A(T(W, Y), O.mouse[0], O.mouse[1]), O.extent, a));
    function H() {
      O.wheel = null, O.end();
    }
  }
  function N() {
    if (g || !t.apply(this, arguments)) return;
    var O = x(this, arguments), W = ze(X.view).on("mousemove.zoom", ne, !0).on("mouseup.zoom", he, !0), Y = Qe(this), Z = X.clientX, H = X.clientY;
    Ji(X.view), li(), O.mouse = [Y, this.__zoom.invert(Y)], jt(this), O.start();
    function ne() {
      if (Mn(), !O.moved) {
        var ue = X.clientX - Z, J = X.clientY - H;
        O.moved = ue * ue + J * J > c;
      }
      O.zoom("mouse", n(A(O.that.__zoom, O.mouse[0] = Qe(O.that), O.mouse[1]), O.extent, a));
    }
    function he() {
      W.on("mousemove.zoom mouseup.zoom", null), Qi(X.view, O.moved), Mn(), O.end();
    }
  }
  function B() {
    if (t.apply(this, arguments)) {
      var O = this.__zoom, W = Qe(this), Y = O.invert(W), Z = O.k * (X.shiftKey ? 0.5 : 2), H = n(A(T(O, Z), W, Y), e.apply(this, arguments), a);
      Mn(), l > 0 ? ze(this).transition().duration(l).call(S, H, W) : ze(this).call(w.transform, H);
    }
  }
  function V() {
    if (t.apply(this, arguments)) {
      var O = x(this, arguments), W = X.changedTouches, Y, Z = W.length, H, ne, he;
      for (li(), H = 0; H < Z; ++H)
        ne = W[H], he = yi(this, W, ne.identifier), he = [he, this.__zoom.invert(he), ne.identifier], O.touch0 ? O.touch1 || (O.touch1 = he) : (O.touch0 = he, Y = !0);
      if (m && (m = clearTimeout(m), !O.touch1)) {
        O.end(), he = ze(this).on("dblclick.zoom"), he && he.apply(this, arguments);
        return;
      }
      Y && (m = setTimeout(function() {
        m = null;
      }, _), jt(this), O.start());
    }
  }
  function R() {
    var O = x(this, arguments), W = X.changedTouches, Y = W.length, Z, H, ne, he;
    for (Mn(), m && (m = clearTimeout(m)), Z = 0; Z < Y; ++Z)
      H = W[Z], ne = yi(this, W, H.identifier), O.touch0 && O.touch0[2] === H.identifier ? O.touch0[0] = ne : O.touch1 && O.touch1[2] === H.identifier && (O.touch1[0] = ne);
    if (H = O.that.__zoom, O.touch1) {
      var ue = O.touch0[0], J = O.touch0[1], re = O.touch1[0], le = O.touch1[1], ae = (ae = re[0] - ue[0]) * ae + (ae = re[1] - ue[1]) * ae, ce = (ce = le[0] - J[0]) * ce + (ce = le[1] - J[1]) * ce;
      H = T(H, Math.sqrt(ae / ce)), ne = [(ue[0] + re[0]) / 2, (ue[1] + re[1]) / 2], he = [(J[0] + le[0]) / 2, (J[1] + le[1]) / 2];
    } else if (O.touch0) ne = O.touch0[0], he = O.touch0[1];
    else return;
    O.zoom("touch", n(A(H, ne, he), O.extent, a));
  }
  function j() {
    var O = x(this, arguments), W = X.changedTouches, Y = W.length, Z, H;
    for (li(), g && clearTimeout(g), g = setTimeout(function() {
      g = null;
    }, _), Z = 0; Z < Y; ++Z)
      H = W[Z], O.touch0 && O.touch0[2] === H.identifier ? delete O.touch0 : O.touch1 && O.touch1[2] === H.identifier && delete O.touch1;
    O.touch1 && !O.touch0 && (O.touch0 = O.touch1, delete O.touch1), O.touch0 ? O.touch0[1] = this.__zoom.invert(O.touch0[0]) : O.end();
  }
  return w.wheelDelta = function(O) {
    return arguments.length ? (r = typeof O == "function" ? O : Zn(+O), w) : r;
  }, w.filter = function(O) {
    return arguments.length ? (t = typeof O == "function" ? O : Zn(!!O), w) : t;
  }, w.touchable = function(O) {
    return arguments.length ? (i = typeof O == "function" ? O : Zn(!!O), w) : i;
  }, w.extent = function(O) {
    return arguments.length ? (e = typeof O == "function" ? O : Zn([[+O[0][0], +O[0][1]], [+O[1][0], +O[1][1]]]), w) : e;
  }, w.scaleExtent = function(O) {
    return arguments.length ? (s[0] = +O[0], s[1] = +O[1], w) : [s[0], s[1]];
  }, w.translateExtent = function(O) {
    return arguments.length ? (a[0][0] = +O[0][0], a[1][0] = +O[1][0], a[0][1] = +O[0][1], a[1][1] = +O[1][1], w) : [[a[0][0], a[0][1]], [a[1][0], a[1][1]]];
  }, w.constrain = function(O) {
    return arguments.length ? (n = O, w) : n;
  }, w.duration = function(O) {
    return arguments.length ? (l = +O, w) : l;
  }, w.interpolate = function(O) {
    return arguments.length ? (u = O, w) : u;
  }, w.on = function() {
    var O = p.on.apply(p, arguments);
    return O === p ? w : O;
  }, w.clickDistance = function(O) {
    return arguments.length ? (c = (O = +O) * O, w) : Math.sqrt(c);
  }, w;
}
class id {
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
      X.stopPropagation();
    });
    const i = e.append("div").attr("class", "escher-zoom-container"), s = i.append("div").attr("class", "escher-3d-transform-container"), a = s.append("svg").attr("class", "escher-svg").attr("xmlns", "http://www.w3.org/2000/svg");
    a.select(".zoom-g").remove();
    const l = a.append("g").attr("class", "zoom-g");
    this.selection = e, this.container = i, this.css3TransformContainer = s, this.svg = a, this.zoomedSel = l, this.windowTranslate = { x: 0, y: 0 }, this.windowScale = 1, this._scrollBehavior = n, this._use3dTransform = r, this._panDragOn = !0, this._zoomBehavior = null, this._zoomTimeout = null, this._svgScale = this.windowScale, this._svgTranslate = this.windowTranslate, this._3dTransform = null, this._requestedFrame = !1, this.callbackManager = new hn(), this._updateScroll();
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
    Q.isUndefined(e) ? this._panDragOn = !this._panDragOn : this._panDragOn = e, this._panDragOn ? this.zoomedSel.style("cursor", "grab") : this.zoomedSel.style("cursor") === "grab" && this.zoomedSel.style("cursor", null), this._updateScroll();
  }
  /**
   * Update the pan and zoom behaviors. The behaviors are applied to the
   * css3TransformContainer node.
   */
  _updateScroll() {
    if (!Q.contains(["zoom", "pan", "none"], this._scrollBehavior))
      throw Error("Bad value for scroll_behavior: " + this._scrollBehavior);
    if (this.container.on("mousewheel.zoom", null).on("DOMMouseScroll.zoom", null).on("wheel.zoom", null).on("dblclick.zoom", null).on("mousewheel.escher", null).on("DOMMouseScroll.escher", null).on("wheel.escher", null).on("mousedown.zoom", null).on("touchstart.zoom", null).on("touchmove.zoom", null).on("touchend.zoom", null), this._zoomBehavior = rd().on("start", () => {
      X.sourceEvent !== null && (X.sourceEvent.stopPropagation(), X.sourceEvent.preventDefault());
    }).on("zoom", () => {
      this._goToCallback(X.transform.k, {
        x: X.transform.x,
        y: X.transform.y
      });
    }), this.container.call(this._zoomBehavior), this.container.on("dblclick.zoom", null), this._panDragOn || this.container.on("mousedown.zoom", null).on("touchstart.zoom", null).on("touchmove.zoom", null).on("touchend.zoom", null), this._scrollBehavior !== "zoom" && this.container.on("mousewheel.zoom", null).on("DOMMouseScroll.zoom", null).on("wheel.zoom", null), this._scrollBehavior === "pan") {
      const e = () => {
        const n = X, r = 0.5;
        n.stopPropagation(), n.preventDefault(), n.returnValue = !1;
        const i = (a, l) => (Q.isUndefined(a) ? l : -a / 1.5) * r, s = {
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
    if (!n || !("x" in n) || !("y" in n) || Q.isNaN(n.x) || Q.isNaN(n.y)) {
      console.error("Bad translate value");
      return;
    }
    const r = hs.translate(n.x, n.y).scale(e);
    this.container.call(this._zoomBehavior.transform, r);
  }
  /**
   * Execute the zoom called by the d3 zoom behavior.
   * @param {Number} scale - The scale, between 0 and 1
   * @param {Object} translate - The location, of the form { x: 2.0, y: 3.0 }
   */
  _goToCallback(e, n) {
    this.windowScale !== e && (this.windowScale = e, this.callbackManager.run("zoom_change")), this.windowTranslate = n, this._use3dTransform ? (Q.isNull(this._zoomTimeout) || clearTimeout(this._zoomTimeout), this._goTo3d(e, n, this._svgScale, this._svgTranslate), this._zoomTimeout = Q.delay(() => {
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
    const s = e / r, a = ge.c_minus_c(
      n,
      ge.c_times_scalar(i, s)
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
      ge.c_plus_c(this.windowTranslate, r)
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
var qo = ge.make_class();
qo.prototype = {
  init: sd,
  create_reaction: ld,
  update_reaction: ud,
  create_bezier: pd,
  update_bezier: gd,
  create_node: _d,
  update_node: md,
  create_text_label: bd,
  update_text_label: vd,
  create_membrane: ad,
  update_membrane: od,
  create_reaction_label: cd,
  update_reaction_label: hd,
  create_segment: fd,
  update_segment: dd
};
function sd(t, e, n) {
  this.behavior = t, this.settings = e, this.map = n, this.callback_manager = new hn();
}
function ad(t) {
  var e = t.append("rect").attr("class", "membrane");
  return this.callback_manager.run("create_membrane", this, t), e;
}
function od(t) {
  t.attr("width", function(e) {
    return e.width;
  }).attr("height", function(e) {
    return e.height;
  }).attr("transform", function(e) {
    return "translate(" + e.x + "," + e.y + ")";
  }).style("stroke-width", function(e) {
    return 10;
  }).attr("rx", function(e) {
    return 20;
  }).attr("ry", function(e) {
    return 20;
  }), this.callback_manager.run("update_membrane", this, t);
}
function ld(t) {
  var e = t.append("g").attr("id", function(n) {
    return "r" + n.reaction_id;
  }).attr("class", "reaction");
  return this.create_reaction_label(e), this.callback_manager.run("create_reaction", this, t), e;
}
function ud(t, e, n, r, i, s) {
  t.select(".reaction-label-group").call((function(a) {
    return this.update_reaction_label(a, s);
  }).bind(this)), ge.draw_a_nested_object(
    t,
    ".segment-group",
    "segments",
    "segment_id",
    this.create_segment.bind(this),
    (function(a) {
      return this.update_segment(
        a,
        e,
        n,
        r,
        i,
        s
      );
    }).bind(this),
    function(a) {
      a.remove();
    }
  ), this.callback_manager.run("update_reaction", this, t);
}
function cd(t, e) {
  var n = t.append("g").attr("class", "reaction-label-group");
  return n.append("text").attr("class", "reaction-label label"), n.append("g").attr("class", "all-genes-label-group"), this.callback_manager.run("create_reaction_label", this, t), n;
}
function hd(t, e) {
  nn(".4g");
  const n = this.settings.get("identifiers_on_map"), r = this.settings.get("reaction_styles"), i = this.settings.get("show_gene_reaction_rules"), s = this.settings.get("hide_all_labels"), a = this.settings.get("gene_font_size"), l = this.behavior.reactionLabelMouseover, u = this.behavior.reactionLabelMouseout, h = this.behavior.reactionLabelTouch, p = this.behavior.geneLabelMouseover, m = this.behavior.geneLabelMouseout, g = this.behavior.geneLabelTouch;
  t.attr("transform", function(A) {
    return "translate(" + A.label_x + "," + A.label_y + ")";
  }).call(this.behavior.turnOffDrag).call(this.behavior.reactionLabelDrag);
  var _ = t.select(".reaction-label").attr("visibility", s ? "hidden" : "visible");
  s || _.text(function(A) {
    var b = A[n];
    return e && r.indexOf("text") !== -1 && (b += " " + A.data_string), b;
  }).on("mouseover", l).on("mouseout", u).on("touchend", h);
  var E = function(A, b) {
    return A + a * 1.5 * (b + 1);
  }, c = t.select(".all-genes-label-group").selectAll(".gene-label-group").data(function(A) {
    var b = "gene_string" in A && A.gene_string !== null && i && !s && r.indexOf("text") !== -1, S = "gene_reaction_rule" in A && A.gene_reaction_rule !== null && i && !s;
    if (b)
      return console.warn("Showing gene_string. See TODO in source."), A.gene_string;
    if (S) {
      var x = mo(
        A.gene_reaction_rule,
        null,
        A.genes,
        null,
        n,
        null
      );
      return x.forEach(function(z, C) {
        z.label_x = A.label_x, z.label_y = E(A.label_y, C);
      }), x;
    } else
      return [];
  }), w = c.enter().append("g").attr("class", "gene-label-group");
  w.append("text").attr("class", "gene-label").style("font-size", a + "px");
  var T = w.merge(c);
  T.attr("transform", function(A, b) {
    return "translate(0, " + E(0, b) + ")";
  }), T.select("text").text((A) => A.text).on("mouseover", p).on("mouseout", m).on("touchend", g), c.exit().remove(), this.callback_manager.run("update_reaction_label", this, t);
}
function fd(t) {
  var e = t.append("g").attr("class", "segment-group").attr("id", function(n) {
    return "s" + n.segment_id;
  });
  return e.append("path").attr("class", "segment"), e.append("g").attr("class", "arrowheads"), e.append("g").attr("class", "stoichiometry-labels"), this.callback_manager.run("create_segment", this, t), e;
}
function dd(t, e, n, r, i, s) {
  const a = this.settings.get("reaction_styles"), l = s && a.indexOf("size") !== -1, u = s && a.indexOf("color") !== -1, h = this.settings.get("reaction_no_data_size"), p = this.settings.get("reaction_no_data_color"), m = this.settings.get("highlight_missing"), g = this.settings.get("hide_secondary_metabolites"), _ = this.settings.get("primary_metabolite_radius"), E = this.settings.get("secondary_metabolite_radius"), c = this.behavior.reactionObjectMouseover, w = this.behavior.reactionObjectMouseout, T = function(x, z) {
    let C = 20, N = 13;
    return z && (N = x === null ? h : e.reaction_size(x), isNaN(N) && (N = h), C = N * 2), { width: C, height: N };
  }, A = function(x, z, C, N) {
    var B = z || C > 0 ? x.height : 0, V = N ? _ : E;
    return V + B + 10;
  };
  t.selectAll(".segment").datum(function() {
    return Object.assign({}, this.parentNode.__data__, this.parentNode.parentNode.__data__);
  }).style("visibility", function(x) {
    var z = r[x.from_node_id], C = r[x.to_node_id];
    return g && (C.node_type === "metabolite" && !C.node_is_primary || z.node_type === "metabolite" && !z.node_is_primary) ? "hidden" : null;
  }).attr("d", function(x) {
    if (x.from_node_id === null || x.to_node_id === null)
      return null;
    var z = r[x.from_node_id], C = r[x.to_node_id], N = x.b1, B = x.b2;
    if (z.node_type === "metabolite") {
      var V = T(x.data, l), R = A(
        V,
        x.reversibility,
        x.from_node_coefficient,
        z.node_is_primary
      ), j = N === null ? C : N;
      z = Rt(R, z, j, "start");
    }
    if (C.node_type == "metabolite") {
      var V = T(x.data, l), R = A(
        V,
        x.reversibility,
        x.to_node_coefficient,
        C.node_is_primary
      ), j = B === null ? z : B;
      C = Rt(R, j, C, "end");
    }
    var O = "M" + z.x + "," + z.y + " ";
    return N !== null && B !== null && (O += "C" + N.x + "," + N.y + " " + B.x + "," + B.y + " "), O += C.x + "," + C.y, O;
  }).style("stroke", function(x) {
    var z = this.parentNode.parentNode.__data__.bigg_id, C = m && n !== null && !(z in n.reactions);
    if (C)
      return "red";
    if (u) {
      var N = x.data;
      return N === null ? p : e.reaction_color(N);
    }
    return null;
  }).style("stroke-width", function(x) {
    if (l) {
      var z = x.data;
      return z === null ? h : e.reaction_size(z);
    } else
      return null;
  }).attr("pointer-events", "visibleStroke").on("mouseover", c).on("mouseout", w);
  var b = t.select(".arrowheads").selectAll(".arrowhead").data(function(x) {
    var z = [], C = r[x.from_node_id], N = x.b1, B = r[x.to_node_id], V = x.b2;
    if (g && (B.node_type === "metabolite" && !B.node_is_primary || C.node_type === "metabolite" && !C.node_is_primary))
      return z;
    if (C.node_type === "metabolite" && (x.reversibility || x.from_node_coefficient > 0)) {
      var R = T(x.data, l), j = A(
        R,
        x.reversibility,
        x.from_node_coefficient,
        C.node_is_primary
      ), O = N === null ? B : N, W = ge.to_degrees(ge.get_angle([C, O])) + 90, Y = Rt(j, C, O, "start");
      z.push({
        data: x.data,
        x: Y.x,
        y: Y.y,
        size: R,
        rotation: W,
        show_arrowhead_flux: x.from_node_coefficient < 0 === x.reverse_flux || x.data === 0
      });
    }
    if (B.node_type === "metabolite" && (x.reversibility || x.to_node_coefficient > 0)) {
      var R = T(x.data, l), j = A(
        R,
        x.reversibility,
        x.to_node_coefficient,
        B.node_is_primary
      ), O = V === null ? C : V, W = ge.to_degrees(ge.get_angle([B, O])) + 90, Y = Rt(j, O, B, "end");
      z.push({
        data: x.data,
        x: Y.x,
        y: Y.y,
        size: R,
        rotation: W,
        show_arrowhead_flux: x.to_node_coefficient < 0 === x.reverse_flux || x.data === 0
      });
    }
    if (x.unconnected_segment_with_arrow) {
      var R = T(x.data, l), O = B, W = ge.to_degrees(ge.get_angle([C, O])) + 90;
      z.push({
        data: x.data,
        x: C.x,
        y: C.y,
        size: R,
        rotation: W,
        show_arrowhead_flux: x.to_node_coefficient < 0 === x.reverse_flux || x.data === 0
      });
    }
    return z;
  });
  b.enter().append("path").classed("arrowhead", !0).merge(b).attr("d", function(x) {
    return "M" + [-x.size.width / 2, 0] + " L" + [0, x.size.height] + " L" + [x.size.width / 2, 0] + " Z";
  }).attr("transform", function(x) {
    return "translate(" + x.x + "," + x.y + ")rotate(" + x.rotation + ")";
  }).style("fill", function(x) {
    if (u)
      if (x.show_arrowhead_flux) {
        var z = x.data;
        return z === null ? p : e.reaction_color(z);
      } else
        return "#FFFFFF";
    return null;
  }).style("stroke", function(x) {
    if (u) {
      var z = x.data;
      return z === null ? p : e.reaction_color(z);
    }
    return null;
  }), b.exit().remove();
  var S = t.select(".stoichiometry-labels").selectAll(".stoichiometry-label").data(function(x) {
    var z = [], C = r[x.from_node_id], N = x.b1, B = r[x.to_node_id], V = x.b2, R = 1.5;
    if (g && (B.node_type == "metabolite" && !B.node_is_primary || C.node_type == "metabolite" && !C.node_is_primary))
      return z;
    if (C.node_type === "metabolite" && Math.abs(x.from_node_coefficient) != 1) {
      var j = T(x.data, l), O = R * A(j, !1, 0, B.node_is_primary), W = N === null ? B : N;
      W = ge.c_plus_c(W, ge.rotate_coords(W, 0.5, C));
      var Y = Rt(O, C, W, "start");
      Y = ge.c_plus_c(Y, { x: 0, y: 7 }), z.push({
        coefficient: Math.abs(x.from_node_coefficient),
        x: Y.x,
        y: Y.y,
        data: x.data
      });
    }
    if (B.node_type === "metabolite" && Math.abs(x.to_node_coefficient) !== 1) {
      var j = T(x.data, l), O = R * A(j, !1, 0, B.node_is_primary), W = V === null ? C : V;
      W = ge.c_plus_c(
        W,
        ge.rotate_coords(W, 0.5, B)
      );
      var Y = Rt(O, W, B, "end");
      Y = ge.c_plus_c(Y, { x: 0, y: 7 }), z.push({
        coefficient: Math.abs(x.to_node_coefficient),
        x: Y.x,
        y: Y.y,
        data: x.data
      });
    }
    return z;
  });
  S.enter().append("text").attr("class", "stoichiometry-label").attr("text-anchor", "middle").merge(S).attr("transform", function(x) {
    return "translate(" + x.x + "," + x.y + ")";
  }).text(function(x) {
    return x.coefficient;
  }).style("fill", function(x) {
    if (u) {
      var z = x.data;
      return z === null ? p : e.reaction_color(z);
    }
    return null;
  }), S.exit().remove(), this.callback_manager.run("update_segment", this, t);
}
function pd(t) {
  var e = t.append("g").attr("id", function(n) {
    return n.bezier_id;
  }).attr("class", function(n) {
    return "bezier";
  });
  return e.append("path").attr("class", "connect-line"), e.append("circle").attr("class", function(n) {
    return "bezier-circle " + n.bezier;
  }).style("stroke-width", String(1) + "px").attr("r", String(7) + "px"), this.callback_manager.run("create_bezier", this, t), e;
}
function gd(t, e, n, r, i, s, a) {
  var l = this.settings.get("hide_secondary_metabolites");
  if (e)
    t.attr("visibility", "visible");
  else {
    t.attr("visibility", "hidden");
    return;
  }
  t.style("visibility", function(u) {
    var h = a[u.reaction_id].segments[u.segment_id], p = s[h.from_node_id], m = s[h.to_node_id];
    return l && (m.node_type === "metabolite" && !m.node_is_primary || p.node_type === "metabolite" && !p.node_is_primary) ? "hidden" : null;
  }), t.select(".bezier-circle").call(this.behavior.turnOffDrag).call(n).on("mouseover", r).on("mouseout", i).attr("transform", function(u) {
    return u.x === null || u.y === null ? "" : "translate(" + u.x + "," + u.y + ")";
  }), t.select(".connect-line").attr("d", function(u) {
    var h = a[u.reaction_id].segments[u.segment_id], p = u.bezier === "b1" ? s[h.from_node_id] : s[h.to_node_id];
    return u.x === null || u.y === null || p.x === null || p.y === null ? "" : "M" + u.x + ", " + u.y + " " + p.x + "," + p.y;
  }), this.callback_manager.run("update_bezier", this, t);
}
function _d(t, e, n) {
  var r = t.append("g").attr("class", "node").attr("id", function(s) {
    return "n" + s.node_id;
  });
  r.append("circle").attr("class", function(s) {
    var a = "node-circle";
    return s.node_type !== null && (a += " " + s.node_type + "-circle"), a;
  });
  var i = r.filter(function(s) {
    return s.node_type === "metabolite";
  });
  return i.append("text").attr("class", "node-label label"), this.callback_manager.run("create_node", this, t), r;
}
function md(t, e, n, r, i, s, a, l, u) {
  var h = this.settings.get("hide_secondary_metabolites"), p = this.settings.get("primary_metabolite_radius"), m = this.settings.get("secondary_metabolite_radius"), g = this.settings.get("marker_radius"), _ = this.settings.get("hide_all_labels"), E = this.settings.get("identifiers_on_map"), c = this.settings.get("metabolite_styles"), w = {
    color: this.settings.get("metabolite_no_data_color"),
    size: this.settings.get("metabolite_no_data_size")
  }, T = this.behavior.nodeLabelMouseover, A = this.behavior.nodeLabelMouseout, b = this.behavior.nodeLabelTouch, S = this.behavior.nodeObjectMouseover, x = this.behavior.nodeObjectMouseout;
  t.select(".node-circle").attr("transform", function(N) {
    return "translate(" + N.x + "," + N.y + ")";
  }).style("visibility", function(N) {
    return C(N, h) ? "hidden" : null;
  }).attr("r", function(N) {
    if (N.node_type === "metabolite") {
      var B = n && c.indexOf("size") !== -1;
      if (B) {
        var V = N.data;
        return V === null ? w.size : e.metabolite_size(V);
      } else
        return N.node_is_primary ? p : m;
    }
    return g;
  }).style("fill", function(N) {
    if (N.node_type === "metabolite") {
      var B = n && c.indexOf("color") !== -1;
      if (B) {
        var V = N.data;
        return V === null ? w.color : e.metabolite_color(V);
      } else
        return null;
    }
    return null;
  }).attr("data-bigg-id", function(N) {
    return N.bigg_id !== void 0 ? N.bigg_id : null;
  }).call(this.behavior.turnOffDrag).call(l).on("mousedown", r).on("click", i).on("mouseover", S).on("mouseout", x);
  var z = t.select(".node-label").attr("visibility", _ ? "hidden" : "visible");
  _ || z.style("visibility", function(N) {
    return C(N, h) ? "hidden" : null;
  }).attr("transform", function(N) {
    return "translate(" + N.label_x + "," + N.label_y + ")";
  }).text(function(N) {
    var B = N[E];
    return n && c.indexOf("text") !== -1 && (B += " " + N.data_string), B;
  }).call(this.behavior.turnOffDrag).call(u).on("mouseover", T).on("mouseout", A).on("touchend", b), this.callback_manager.run("update_node", this, t);
  function C(N, B) {
    return N.node_type === "metabolite" && B && !N.node_is_primary;
  }
}
function bd(t) {
  var e = t.append("g").attr("id", function(n) {
    return "l" + n.text_label_id;
  }).attr("class", "text-label");
  return e.append("text").attr("class", "label"), this.callback_manager.run("create_text_label", this, t), e;
}
function vd(t) {
  const e = this.behavior.textLabelMousedown, n = this.behavior.textLabelClick, r = this.behavior.turnOffDrag, i = this.behavior.selectableDrag;
  t.select(".label").text(function(s) {
    return s.text;
  }).attr("transform", function(s) {
    return "translate(" + s.x + "," + s.y + ")";
  }).on("mousedown", e).on("click", n).call(r).call(i), this.callback_manager.run("update_text_label", this, t);
}
function Rt(t, e, n, r) {
  const i = t, s = ge.distance(e, n);
  if (!i || !s)
    return console.warn("No space for displacement"), { x: e.x, y: e.y };
  if (r === "start")
    return {
      x: e.x + i * (n.x - e.x) / s,
      y: e.y + i * (n.y - e.y) / s
    };
  if (r === "end")
    return {
      x: n.x - i * (n.x - e.x) / s,
      y: n.y - i * (n.y - e.y) / s
    };
  console.error("bad displace value: " + r);
}
function yd(t) {
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
function Vo(t, e, n, r, i, s) {
  const a = Xi(t), l = i.length * 18, u = e - (e > s) - n / 2 >= -1;
  return Math.abs(a) < Math.PI / 7 ? r || u ? { x: -l * 0.3, y: 40 } : { x: -l * 0.3, y: -20 } : Math.abs(a - Math.PI) < Math.PI / 7 ? r || !u ? { x: -l * 0.3, y: 40 } : { x: -l * 0.3, y: -20 } : r ? {
    x: 25 - 38 * Math.abs(Math.abs(a) - Math.PI / 2),
    y: (Math.abs(a) - Math.PI / 2) * ((a > 0) * 2 - 1) * 50
  } : a < 0 && u || a > 0 && !u ? { x: 15, y: 0 } : { x: -l * 0.5, y: 30 };
}
function wd(t, e, n, r, i, s, a, l) {
  const u = ao(l), h = String(++s.reactions), p = { x: i.x, y: i.y }, m = 350, g = [
    p,
    ot(p, { x: m, y: 0 })
  ], _ = {
    x: (g[0].x + g[1].x) / 2,
    y: (g[0].y + g[1].y) / 2
  }, E = yd(u), c = 20, w = {
    name: e.name,
    bigg_id: e.bigg_id,
    reversibility: e.reversibility,
    gene_reaction_rule: e.gene_reaction_rule,
    genes: ke(e.genes),
    metabolites: ke(e.metabolites)
  };
  st(w, {
    label_x: _.x + E.x,
    label_y: _.y + E.y,
    segments: {}
  });
  const T = [], A = [];
  let b = 0, S = 0, x = !1;
  for (let H in w.metabolites) {
    const ne = n[H], he = w.metabolites[H], ue = ne.formula, J = {
      coefficient: he,
      bigg_id: H,
      name: ne.name
    };
    if (he < 0) {
      J.index = b;
      const re = /C([0-9]+)/.exec(ue);
      i.bigg_id === J.bigg_id ? T.push([J.index, 1 / 0]) : re && a.indexOf(dr(J.bigg_id)[0]) === -1 && T.push([J.index, parseInt(re[1])]), b++;
    } else {
      J.index = S;
      const re = /C([0-9]+)/.exec(ue);
      i.bigg_id === J.bigg_id ? (A.push([J.index, 1 / 0]), x = !0) : re && a.indexOf(dr(J.bigg_id)[0]) === -1 && A.push([J.index, parseInt(re[1])]), S++;
    }
    w.metabolites[H] = J;
  }
  const z = (H, ne) => ne[1] > H[1] ? ne : H, C = T.reduce(z, [0, 0])[0], N = A.reduce(z, [0, 0])[0];
  for (let H in w.metabolites) {
    const ne = w.metabolites[H];
    ne.coefficient < 0 ? (ne.is_primary = ne.index === C, ne.count = b) : (ne.is_primary = ne.index === N, ne.count = S);
  }
  const B = {}, V = [
    {
      node_type: "anchor_reactants",
      dis: { x: c * (x ? 1 : -1), y: 0 }
    },
    { node_type: "center", dis: { x: 0, y: 0 } },
    {
      node_type: "anchor_products",
      dis: { x: c * (x ? -1 : 1), y: 0 }
    }
  ], R = {};
  V.map((H) => {
    const ne = String(++s.nodes), he = H.node_type === "center" ? "midmarker" : "multimarker";
    B[ne] = {
      node_type: he,
      x: _.x + H.dis.x,
      y: _.y + H.dis.y,
      connected_segments: [],
      name: null,
      bigg_id: null,
      label_x: null,
      label_y: null,
      node_is_primary: null,
      data: null
    }, R[H.node_type] = ne;
  }), [
    [R.anchor_reactants, R.center, "reactants"],
    [R.anchor_products, R.center, "products"]
  ].map((H) => {
    const ne = H[2] === "products" ? H[0] : H[1], he = H[2] === "products" ? H[1] : H[0], ue = String(++s.segments), J = b === 0 && H[2] === "reactants" && w.reversibility || S === 0 && H[2] === "products";
    w.segments[ue] = {
      b1: null,
      b2: null,
      from_node_id: ne,
      to_node_id: he,
      from_node_coefficient: null,
      to_node_coefficient: null,
      reversibility: w.reversibility,
      data: w.data,
      reverse_flux: w.reverse_flux,
      unconnected_segment_with_arrow: J
    }, B[ne].connected_segments.push({
      segment_id: ue,
      reaction_id: h
    }), B[he].connected_segments.push({
      segment_id: ue,
      reaction_id: h
    });
  });
  const O = B;
  for (let H in w.metabolites) {
    const ne = w.metabolites[H];
    let he, ue;
    ne.coefficient < 0 ? (he = C, ue = R.anchor_reactants) : (he = N, ue = R.anchor_products);
    const J = xd(
      ne,
      he,
      g,
      _,
      m,
      x
    );
    if (i.bigg_id === ne.bigg_id) {
      const re = String(++s.segments), le = ne.coefficient > 0, ae = le ? ue : r, ce = le ? r : ue;
      w.segments[re] = {
        b1: J.b1,
        b2: J.b2,
        from_node_id: ae,
        to_node_id: ce,
        from_node_coefficient: le ? null : ne.coefficient,
        to_node_coefficient: le ? ne.coefficient : null,
        reversibility: w.reversibility
      }, i.connected_segments.push({
        segment_id: re,
        reaction_id: h
      }), O[ue].connected_segments.push({
        segment_id: re,
        reaction_id: h
      });
    } else {
      const re = String(++s.segments), le = String(++s.nodes), ae = ne.coefficient > 0, ce = ae ? ue : le, Ne = ae ? le : ue;
      w.segments[re] = {
        b1: J.b1,
        b2: J.b2,
        from_node_id: ce,
        to_node_id: Ne,
        from_node_coefficient: ae ? null : ne.coefficient,
        to_node_coefficient: ae ? ne.coefficient : null,
        reversibility: w.reversibility
      };
      const K = Vo(
        u,
        ne.index,
        ne.count,
        ne.is_primary,
        ne.bigg_id,
        he
      );
      O[le] = {
        connected_segments: [{
          segment_id: re,
          reaction_id: h
        }],
        x: J.circle.x,
        y: J.circle.y,
        node_is_primary: ne.is_primary,
        label_x: J.circle.x + K.x,
        label_y: J.circle.y + K.y,
        name: ne.name,
        bigg_id: ne.bigg_id,
        node_type: "metabolite"
      }, O[ue].connected_segments.push({
        segment_id: re,
        reaction_id: h
      });
    }
  }
  const W = [];
  for (let H in w.metabolites)
    W.push({
      bigg_id: H,
      coefficient: w.metabolites[H].coefficient
    });
  w.metabolites = W;
  const Y = {};
  Y[h] = w;
  const Z = Go(Y);
  return O[r] = i, Ai(O, Y, Z, u, p), {
    new_reactions: Y,
    new_beziers: Z,
    new_nodes: O
  };
}
function Ai(t, e, n, r, i) {
  const s = (u) => u === null ? null : Gi(u, r, i), a = [];
  let l = [];
  for (let u in t) {
    const h = t[u], p = s({ x: h.x, y: h.y }), m = Ho(h, e, p);
    h.connected_segments.map((g) => {
      const _ = e[g.reaction_id];
      if (_ === void 0) return;
      const E = g.segment_id, c = _.segments[E];
      if (c.to_node_id === u && c.b2) {
        const w = s(c.b2), T = wt(E, "b2");
        c.b2 = ot(c.b2, w), n[T].x = c.b2.x, n[T].y = c.b2.y;
      } else if (c.from_node_id === u && c.b1) {
        const w = s(c.b1), T = wt(E, "b1");
        c.b1 = ot(c.b1, w), n[T].x = c.b1.x, n[T].y = c.b1.y;
      }
    }), l = Yi([l, m.reaction_ids]), a.push(u);
  }
  return {
    node_ids: a,
    reaction_ids: l
  };
}
function Yt(t, e, n, r, i) {
  const s = Ho(t, n, i);
  return t.connected_segments.map((a) => {
    const l = n[a.reaction_id];
    if (Q.isUndefined(l)) return;
    const u = a.segment_id, h = l.segments[u];
    [["b1", "from_node_id"], ["b2", "to_node_id"]].forEach((m) => {
      const g = m[0], _ = m[1];
      if (h[_] === e && h[g]) {
        h[g] = ot(h[g], i);
        const E = r[wt(u, g)];
        E.x = h[g].x, E.y = h[g].y;
      }
    }), s.reaction_ids.indexOf(a.reaction_id) < 0 && s.reaction_ids.push(a.reaction_id);
  }), s;
}
function Ho(t, e, n) {
  t.x = t.x + n.x, t.y = t.y + n.y, t.label_x = t.label_x + n.x, t.label_y = t.label_y + n.y;
  const r = [];
  return t.connected_segments.map((i) => {
    const s = e[i.reaction_id];
    r.indexOf(i.reaction_id) < 0 && (r.push(i.reaction_id), t.node_type === "midmarker" && (s.label_x = s.label_x + n.x, s.label_y = s.label_y + n.y));
  }), { reaction_ids: r };
}
function Jn(t, e, n) {
  const r = Math.floor(n / 2);
  return t * (e - r + (e >= r));
}
function Qn(t, e, n, r) {
  const i = Math.floor(r / 2);
  return e + Math.abs(n - i + (n >= i)) * t;
}
function xd(t, e, n, r, i, s) {
  const a = n[0];
  n = [
    Pn(n[0], a),
    Pn(n[1], a)
  ], r = Pn(r, a);
  const l = 80, u = 0.4, h = 0.25, p = l * 0.3, m = 50, g = 20, _ = t.count - 1;
  let E, c;
  t.is_primary ? E = 20 : (E = 10, t.index > e ? c = t.index - 1 : c = t.index);
  const w = i - E, T = [{ x: E, y: 0 }, { x: w, y: 0 }];
  let A, b, S, x;
  return t.coefficient < 0 !== s && t.is_primary ? (A = {
    x: T[0].x,
    y: T[0].y
  }, S = {
    x: r.x * (1 - u) + T[0].x * u,
    y: r.y * (1 - u) + T[0].y * u
  }, x = {
    x: r.x * h + A.x * (1 - h),
    y: r.y * h + A.y * (1 - h)
  }, b = {
    x: n[0].x,
    y: n[0].y
  }) : t.coefficient < 0 !== s ? (A = {
    x: T[0].x + Qn(
      g,
      m,
      c,
      _
    ),
    y: T[0].y + Jn(p, c, _)
  }, S = {
    x: r.x * (1 - u) + T[0].x * u,
    y: r.y * (1 - u) + T[0].y * u
  }, x = {
    x: r.x * h + A.x * (1 - h),
    y: r.y * h + A.y * (1 - h)
  }, b = {
    x: n[0].x + Qn(g, m, c, _),
    y: n[0].y + Jn(l, c, _)
  }) : t.coefficient > 0 !== s && t.is_primary ? (A = {
    x: T[1].x,
    y: T[1].y
  }, S = {
    x: r.x * (1 - u) + T[1].x * u,
    y: r.y * (1 - u) + T[1].y * u
  }, x = {
    x: r.x * h + A.x * (1 - h),
    y: r.y * h + A.y * (1 - h)
  }, b = {
    x: n[1].x,
    y: n[1].y
  }) : t.coefficient > 0 !== s && (A = {
    x: T[1].x - Qn(g, m, c, _),
    y: T[1].y + Jn(p, c, _)
  }, S = {
    x: r.x * (1 - u) + T[1].x * u,
    y: r.y * (1 - u) + T[1].y * u
  }, x = {
    x: r.x * h + A.x * (1 - h),
    y: r.y * h + A.y * (1 - h)
  }, b = {
    x: n[1].x - Qn(g, m, c, _),
    y: n[1].y + Jn(l, c, _)
  }), {
    b1: ot(a, S),
    b2: ot(a, x),
    circle: ot(a, b)
  };
}
function Sd(t, e, n) {
  const r = String(++t.text_labels), i = { text: e, x: n.x, y: n.y };
  return { id: r, label: i };
}
function wt(t, e) {
  return t + "_" + e;
}
function Md(t) {
  const e = [];
  for (let n in t) {
    const r = t[n];
    for (let i in r.segments) {
      const s = r.segments[i];
      ["b1", "b2"].forEach(function(l) {
        s[l] !== null && e.push(wt(i, l));
      });
    }
  }
  return e;
}
function Yo(t, e) {
  const n = {};
  for (let r in t) {
    const i = t[r];
    ["b1", "b2"].forEach(function(s) {
      const a = i[s];
      if (a !== null) {
        const l = wt(r, s);
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
function Go(t) {
  const e = {};
  for (let n in t) {
    const r = t[n], i = Yo(r.segments, n);
    st(e, i);
  }
  return e;
}
const Ke = ze, ft = Qe;
class kd {
  constructor(e, n) {
    this.map = e, this.undoStack = n, this.emptyBehavior = () => {
    }, this.rotationModeEnabled = !1, this.rotationDrag = tt(), this.selectableMousedown = null, this.textLabelMousedown = null, this.textLabelClick = null, this.selectableDrag = this.emptyBehavior, this.nodeLabelMouseover = null, this.nodeLabelTouch = null, this.nodeLabelMouseout = null, this.reactionLabelMouseover = null, this.reactionLabelTouch = null, this.reactionLabelMouseout = null, this.geneLabelMouseover = null, this.geneLabelTouch = null, this.geneLabelMouseout = null, this.nodeObjectMouseover = null, this.nodeObjectMouseout = null, this.reactionObjectMouseover = null, this.reactionObjectMouseout = null, this.bezierDrag = this.emptyBehavior, this.bezierMouseover = null, this.bezierMouseout = null, this.reactionLabelDrag = this.emptyBehavior, this.nodeLabelDrag = this.emptyBehavior, this.dragging = !1;
  }
  averageLocation(e) {
    const n = [], r = [];
    for (const i in e) {
      const s = e[i];
      s.x !== void 0 && n.push(s.x), s.y !== void 0 && r.push(s.y);
    }
    return {
      x: ge.mean(n),
      y: ge.mean(r)
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
    }).call(tt().on("drag", () => {
      const i = ge.d3_transform_catch(r.attr("transform")), s = [
        X.dx + i.translate[0],
        X.dy + i.translate[1]
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
      const s = this.map, a = Object.keys(i), l = this.map.reactions, u = this.map.nodes, h = this.map.beziers, p = (w) => {
        X.sourceEvent.stopPropagation();
      }, m = (w, T, A, b) => {
        const S = Ai(
          i,
          l,
          h,
          T,
          b
        );
        s.draw_these_nodes(S.node_ids), s.draw_these_reactions(S.reaction_ids);
      }, g = (w) => {
      }, _ = (w, T, A) => {
        const b = {};
        a.forEach(function(x) {
          b[x] = u[x];
        });
        const S = Ai(
          b,
          l,
          h,
          -T,
          A
        );
        s.draw_these_nodes(S.node_ids), s.draw_these_reactions(S.reaction_ids);
      }, E = (w, T, A) => {
        const b = {};
        a.forEach((x) => {
          b[x] = u[x];
        });
        const S = (void 0)(
          b,
          l,
          h,
          T,
          A
        );
        s.draw_these_nodes(S.node_ids), s.draw_these_reactions(S.reaction_ids);
      }, c = () => this.center;
      this.rotationDrag = this.getGenericAngularDrag(
        p,
        m,
        g,
        _,
        E,
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
        X.stopPropagation();
      }, this.selectableClick = function(r) {
        X.stopPropagation(), !X.defaultPrevented && n.select_selectable(this, r, X.shiftKey);
      }, this.nodeMouseover = function(r) {
        Ke(this).style("stroke-width", null);
        const i = parseFloat(Ke(this).style("stroke-width"));
        Ke(this.parentNode).classed("selected") || Ke(this).style("stroke-width", i * 3 + "px");
      }, this.nodeMouseout = function(r) {
        Ke(this).style("stroke-width", null);
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
        if (X.defaultPrevented)
          return;
        const r = ge.d3_transform_catch(Ke(this).attr("transform")).translate, i = { x: r[0], y: r[1] };
        n.callback_manager.run("edit_text_label", null, Ke(this), i), X.stopPropagation();
      }, this.textLabelClick = null, this.map.sel.select("#text-labels").selectAll(".label").style("cursor", "text"), this.map.sel.on("mousedown.new_text_label", (function(r) {
        X.preventDefault();
        const i = {
          x: ft(r)[0],
          y: ft(r)[1]
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
              const l = ft(this), u = Object.assign(
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
      Ke(this).style("stroke-width", "3px");
    }, this.bezierMouseout = function(n) {
      Ke(this).style("stroke-width", "1px");
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
      s.connected_segments.push(l), a.push(ge.clone(l));
    }), r.delete_node_data([n]), r.sel.selectAll(".node-to-combine").classed("node-to-combine", !1), r.draw_everything(), a;
  }
  /**
   * Drag the selected nodes and text labels.
   * @param {} map -
   * @param {} undo_stack -
   */
  getSelectableDrag(e, n) {
    const r = tt();
    let i = null, s = null, a = null, l = null, u = null, h = null, p = null;
    const m = (E, c) => {
      const w = e.text_labels[E];
      w.x = w.x + c.x, w.y = w.y + c.y;
    }, g = (E) => {
      this.dragging = E;
    };
    r.on("start", function(E) {
      if (g(!0), X.sourceEvent.stopPropagation(), s = { x: 0, y: 0 }, Ke(this).attr("class").indexOf("label") === -1) {
        const c = this.parentNode.__data__, w = c.bigg_id, T = this.parentNode;
        i = setTimeout(() => {
          T.parentNode.insertBefore(T, T.parentNode.firstChild);
        }, 200), h = w, p = c.node_id;
      }
    }), r.on("drag", function(E) {
      Ke(this.parentNode).classed("selected") || e.select_selectable(this, E);
      const c = {};
      Ke(this).attr("class").indexOf("label") === -1 ? (c.type = "node", c.id = this.parentNode.__data__.node_id) : (c.type = "label", c.id = this.__data__.text_label_id);
      const w = e.get_selected_node_ids(), T = e.get_selected_text_label_ids();
      a = [], u = [], c.type === "node" && w.indexOf(c.id) === -1 ? a.push(c.id) : c.type === "label" && T.indexOf(c.id) === -1 ? u.push(c.id) : (a = w, u = T), l = [];
      const A = {
        x: X.dx,
        y: X.dy
      };
      if (s = ge.c_plus_c(s, A), a.forEach((b) => {
        const S = e.nodes[b], x = Yt(
          S,
          b,
          e.reactions,
          e.beziers,
          A
        );
        l = ge.uniqueConcat([l, x.reaction_ids]);
      }), u.forEach((b) => {
        m(b, A);
      }), e.draw_these_nodes(a), e.draw_these_reactions(l), e.draw_these_text_labels(u), c.type === "node" && h) {
        const b = X.sourceEvent;
        this.style.pointerEvents = "none";
        const S = document.elementFromPoint(b.clientX, b.clientY);
        if (this.style.pointerEvents = "", e.sel.selectAll(".node-to-combine").classed("node-to-combine", !1), S && S.classList.contains("metabolite-circle")) {
          const x = S.getAttribute("data-bigg-id"), z = S.parentNode.__data__ && S.parentNode.__data__.node_id;
          x === h && z !== p && Ke(S).classed("node-to-combine", !0);
        }
      }
    });
    const _ = this.combineNodesAndDraw.bind(this);
    return r.on("end", function() {
      if (g(!1), a === null) {
        s = null, a = null, u = null, l = null, i = null, h = null, p = null;
        return;
      }
      const E = [];
      if (e.sel.selectAll(".node-to-combine").each((c) => {
        E.push(c.node_id);
      }), E.length === 1) {
        const c = E[0], w = this.parentNode.__data__.node_id, T = ge.clone(e.nodes[w]), A = _(
          c,
          w
        ), b = ge.clone(s);
        n.push(() => {
          e.nodes[w] = T;
          const S = e.nodes[c], x = [];
          A.forEach((z) => {
            const C = e.reactions[z.reaction_id].segments[z.segment_id];
            C.from_node_id === c ? C.from_node_id = w : C.to_node_id === c ? C.to_node_id = w : console.error("Segment does not connect to fixed node"), S.connected_segments = S.connected_segments.filter((N) => !(N.reaction_id === z.reaction_id && N.segment_id === z.segment_id)), x.indexOf(z.reaction_id) === -1 && x.push(z.reaction_id);
          }), Yt(
            T,
            w,
            e.reactions,
            e.beziers,
            ge.c_times_scalar(b, -1)
          ), e.draw_these_nodes([w]), e.draw_these_reactions(x);
        }, () => {
          Yt(
            T,
            w,
            e.reactions,
            e.beziers,
            ge.c_times_scalar(b, 1)
          ), _(c, w);
        });
      } else {
        const c = ge.clone(s), w = ge.clone(a), T = ge.clone(u), A = ge.clone(l);
        n.push(() => {
          w.forEach((b) => {
            const S = e.nodes[b];
            Yt(
              S,
              b,
              e.reactions,
              e.beziers,
              ge.c_times_scalar(c, -1)
            );
          }), T.forEach((b) => {
            m(
              b,
              ge.c_times_scalar(c, -1)
            );
          }), e.draw_these_nodes(w), e.draw_these_reactions(A), e.draw_these_text_labels(T);
        }, () => {
          w.forEach((b) => {
            const S = e.nodes[b];
            Yt(
              S,
              b,
              e.reactions,
              e.beziers,
              c
            );
          }), T.forEach((b) => {
            m(b, c);
          }), e.draw_these_nodes(w), e.draw_these_reactions(A), e.draw_these_text_labels(T);
        });
      }
      clearTimeout(i), s = null, a = null, u = null, l = null, i = null, h = null, p = null;
    }), r;
  }
  getBezierDrag(e) {
    const n = (u, h, p, m, g) => {
      const _ = e.reactions[u].segments[h];
      _[p] = ge.c_plus_c(_[p], g), e.beziers[m].x = _[p].x, e.beziers[m].y = _[p].y;
    }, r = (u) => {
      u.dragging = !0;
    }, i = (u, h, p) => {
      n(
        u.reaction_id,
        u.segment_id,
        u.bezier,
        u.bezier_id,
        h
      ), e.draw_these_reactions([u.reaction_id], !1), e.draw_these_beziers([u.bezier_id]);
    }, s = (u) => {
      u.dragging = !1;
    }, a = (u, h) => {
      n(
        u.reaction_id,
        u.segment_id,
        u.bezier,
        u.bezier_id,
        ge.c_times_scalar(h, -1)
      ), e.draw_these_reactions([u.reaction_id], !1), e.draw_these_beziers([u.bezier_id]);
    }, l = (u, h) => {
      n(
        u.reaction_id,
        u.segment_id,
        u.bezier,
        u.bezier_id,
        h
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
    const n = (u, h) => {
      const p = e.reactions[u];
      p.label_x = p.label_x + h.x, p.label_y = p.label_y + h.y;
    }, r = (u) => {
      e.callback_manager.run("hide_tooltip");
    }, i = (u, h, p) => {
      n(u.reaction_id, h), e.draw_these_reactions([u.reaction_id]);
    }, s = () => {
    }, a = (u, h) => {
      n(u.reaction_id, ge.c_times_scalar(h, -1)), e.draw_these_reactions([u.reaction_id]);
    }, l = (u, h) => {
      n(u.reaction_id, h), e.draw_these_reactions([u.reaction_id]);
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
    const n = (u, h) => {
      const p = e.nodes[u];
      p.label_x = p.label_x + h.x, p.label_y = p.label_y + h.y;
    }, r = (u) => {
      e.callback_manager.run("hide_tooltip");
    }, i = (u, h, p) => {
      n(u.node_id, h), e.draw_these_nodes([u.node_id]);
    }, s = () => {
    }, a = (u, h) => {
      n(u.node_id, ge.c_times_scalar(h, -1)), e.draw_these_nodes([u.node_id]);
    }, l = (u, h) => {
      n(u.node_id, h), e.draw_these_nodes([u.node_id]);
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
    const l = tt(), u = this.undoStack, h = a.node();
    let p;
    return l.on("start", (m) => {
      this.dragging = !0, X.sourceEvent.stopPropagation(), p = { x: 0, y: 0 }, e(m);
    }), l.on("drag", (m) => {
      const g = {
        x: X.dx,
        y: X.dy
      }, _ = {
        x: ft(h)[0],
        y: ft(h)[1]
      };
      p = ge.c_plus_c(p, g), n(m, g, p, _);
    }), l.on("end", (m) => {
      this.dragging = !1;
      const g = ge.clone(m), _ = ge.clone(p), E = {
        x: ft(h)[0],
        y: ft(h)[1]
      };
      u.push(function() {
        i(g, _, E);
      }, function() {
        s(g, _, E);
      }), r(m);
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
    const u = tt(), h = this.undoStack, p = l.node();
    let m;
    return u.on("start", (g) => {
      this.dragging = !0, X.sourceEvent.stopPropagation(), m = 0, e(g);
    }), u.on("drag", (g) => {
      const _ = {
        x: X.dx,
        y: X.dy
      }, E = {
        x: ft(p)[0],
        y: ft(p)[1]
      }, c = a(), w = ge.angle_for_event(_, E, c);
      m = m + w, n(g, w, m, c);
    }), u.on("end", (g) => {
      this.dragging = !1;
      const _ = ge.clone(g), E = m, c = ge.clone(a());
      h.push(
        () => i(_, E, c),
        () => s(_, E, c)
      ), r(g);
    }), u;
  }
}
const Xt = {
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
function Xo(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Cd(t) {
  return t.length === 1 && (t = Ed(t)), {
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
function Ed(t) {
  return function(e, n) {
    return Xo(t(e), n);
  };
}
var zd = Cd(Xo), Td = zd.right, Ii = Math.sqrt(50), Oi = Math.sqrt(10), Li = Math.sqrt(2);
function Nd(t, e, n) {
  var r, i = -1, s, a, l;
  if (e = +e, t = +t, n = +n, t === e && n > 0) return [t];
  if ((r = e < t) && (s = t, t = e, e = s), (l = ar(t, e, n)) === 0 || !isFinite(l)) return [];
  if (l > 0)
    for (t = Math.ceil(t / l), e = Math.floor(e / l), a = new Array(s = Math.ceil(e - t + 1)); ++i < s; ) a[i] = (t + i) * l;
  else
    for (t = Math.floor(t * l), e = Math.ceil(e * l), a = new Array(s = Math.ceil(t - e + 1)); ++i < s; ) a[i] = (t - i) / l;
  return r && a.reverse(), a;
}
function ar(t, e, n) {
  var r = (e - t) / Math.max(0, n), i = Math.floor(Math.log(r) / Math.LN10), s = r / Math.pow(10, i);
  return i >= 0 ? (s >= Ii ? 10 : s >= Oi ? 5 : s >= Li ? 2 : 1) * Math.pow(10, i) : -Math.pow(10, -i) / (s >= Ii ? 10 : s >= Oi ? 5 : s >= Li ? 2 : 1);
}
function Dd(t, e, n) {
  var r = Math.abs(e - t) / Math.max(0, n), i = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)), s = r / i;
  return s >= Ii ? i *= 10 : s >= Oi ? i *= 5 : s >= Li && (i *= 2), e < t ? -i : i;
}
var Ko = Array.prototype, Ad = Ko.map, js = Ko.slice;
function Id(t) {
  return function() {
    return t;
  };
}
function Od(t) {
  return +t;
}
var ea = [0, 1];
function Zo(t, e) {
  return (e -= t = +t) ? function(n) {
    return (n - t) / e;
  } : Id(e);
}
function Ld(t) {
  return function(e, n) {
    var r = t(e = +e, n = +n);
    return function(i) {
      return i <= e ? 0 : i >= n ? 1 : r(i);
    };
  };
}
function Fd(t) {
  return function(e, n) {
    var r = t(e = +e, n = +n);
    return function(i) {
      return i <= 0 ? e : i >= 1 ? n : r(i);
    };
  };
}
function Pd(t, e, n, r) {
  var i = t[0], s = t[1], a = e[0], l = e[1];
  return s < i ? (i = n(s, i), a = r(l, a)) : (i = n(i, s), a = r(a, l)), function(u) {
    return a(i(u));
  };
}
function Bd(t, e, n, r) {
  var i = Math.min(t.length, e.length) - 1, s = new Array(i), a = new Array(i), l = -1;
  for (t[i] < t[0] && (t = t.slice().reverse(), e = e.slice().reverse()); ++l < i; )
    s[l] = n(t[l], t[l + 1]), a[l] = r(e[l], e[l + 1]);
  return function(u) {
    var h = Td(t, u, 1, i) - 1;
    return a[h](s[h](u));
  };
}
function Rd(t, e) {
  return e.domain(t.domain()).range(t.range()).interpolate(t.interpolate()).clamp(t.clamp());
}
function Ud(t, e) {
  var n = ea, r = ea, i = Ir, s = !1, a, l, u;
  function h() {
    return a = Math.min(n.length, r.length) > 2 ? Bd : Pd, l = u = null, p;
  }
  function p(m) {
    return (l || (l = a(n, r, s ? Ld(t) : t, i)))(+m);
  }
  return p.invert = function(m) {
    return (u || (u = a(r, n, Zo, s ? Fd(e) : e)))(+m);
  }, p.domain = function(m) {
    return arguments.length ? (n = Ad.call(m, Od), h()) : n.slice();
  }, p.range = function(m) {
    return arguments.length ? (r = js.call(m), h()) : r.slice();
  }, p.rangeRound = function(m) {
    return r = js.call(m), i = Fh, h();
  }, p.clamp = function(m) {
    return arguments.length ? (s = !!m, h()) : s;
  }, p.interpolate = function(m) {
    return arguments.length ? (i = m, h()) : i;
  }, h();
}
function Wd(t, e, n) {
  var r = t[0], i = t[t.length - 1], s = Dd(r, i, e ?? 10), a;
  switch (n = gr(n ?? ",f"), n.type) {
    case "s": {
      var l = Math.max(Math.abs(r), Math.abs(i));
      return n.precision == null && !isNaN(a = Uc(s, l)) && (n.precision = a), go(n, l);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(a = Wc(s, Math.max(Math.abs(r), Math.abs(i)))) && (n.precision = a - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(a = Rc(s)) && (n.precision = a - (n.type === "%") * 2);
      break;
    }
  }
  return nn(n);
}
function $d(t) {
  var e = t.domain;
  return t.ticks = function(n) {
    var r = e();
    return Nd(r[0], r[r.length - 1], n ?? 10);
  }, t.tickFormat = function(n, r) {
    return Wd(e(), n, r);
  }, t.nice = function(n) {
    n == null && (n = 10);
    var r = e(), i = 0, s = r.length - 1, a = r[i], l = r[s], u;
    return l < a && (u = a, a = l, l = u, u = i, i = s, s = u), u = ar(a, l, n), u > 0 ? (a = Math.floor(a / u) * u, l = Math.ceil(l / u) * u, u = ar(a, l, n)) : u < 0 && (a = Math.ceil(a * u) / u, l = Math.floor(l * u) / u, u = ar(a, l, n)), u > 0 ? (r[i] = Math.floor(a / u) * u, r[s] = Math.ceil(l / u) * u, e(r)) : u < 0 && (r[i] = Math.ceil(a * u) / u, r[s] = Math.floor(l * u) / u, e(r)), t;
  }, t;
}
function it() {
  var t = Ud(Zo, et);
  return t.copy = function() {
    return Rd(t, it());
  }, $d(t);
}
var ui = /* @__PURE__ */ new Date(), ci = /* @__PURE__ */ new Date();
function Be(t, e, n, r) {
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
    var u = [], h;
    if (s = i.ceil(s), l = l == null ? 1 : Math.floor(l), !(s < a) || !(l > 0)) return u;
    do
      u.push(h = /* @__PURE__ */ new Date(+s)), e(s, l), t(s);
    while (h < s && s < a);
    return u;
  }, i.filter = function(s) {
    return Be(function(a) {
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
    return ui.setTime(+s), ci.setTime(+a), t(ui), t(ci), Math.floor(n(ui, ci));
  }, i.every = function(s) {
    return s = Math.floor(s), !isFinite(s) || !(s > 0) ? null : s > 1 ? i.filter(r ? function(a) {
      return r(a) % s === 0;
    } : function(a) {
      return i.count(0, a) % s === 0;
    }) : i;
  }), i;
}
var Fi = Be(function() {
}, function(t, e) {
  t.setTime(+t + e);
}, function(t, e) {
  return e - t;
});
Fi.every = function(t) {
  return t = Math.floor(t), !isFinite(t) || !(t > 0) ? null : t > 1 ? Be(function(e) {
    e.setTime(Math.floor(e / t) * t);
  }, function(e, n) {
    e.setTime(+e + n * t);
  }, function(e, n) {
    return (n - e) / t;
  }) : Fi;
};
Fi.range;
var xr = 1e3, Nt = 6e4, Sr = 36e5, Jo = 864e5, Qo = 6048e5, qd = Be(function(t) {
  t.setTime(t - t.getMilliseconds());
}, function(t, e) {
  t.setTime(+t + e * xr);
}, function(t, e) {
  return (e - t) / xr;
}, function(t) {
  return t.getUTCSeconds();
});
qd.range;
var Vd = Be(function(t) {
  t.setTime(t - t.getMilliseconds() - t.getSeconds() * xr);
}, function(t, e) {
  t.setTime(+t + e * Nt);
}, function(t, e) {
  return (e - t) / Nt;
}, function(t) {
  return t.getMinutes();
});
Vd.range;
var Hd = Be(function(t) {
  t.setTime(t - t.getMilliseconds() - t.getSeconds() * xr - t.getMinutes() * Nt);
}, function(t, e) {
  t.setTime(+t + e * Sr);
}, function(t, e) {
  return (e - t) / Sr;
}, function(t) {
  return t.getHours();
});
Hd.range;
var fs = Be(function(t) {
  t.setHours(0, 0, 0, 0);
}, function(t, e) {
  t.setDate(t.getDate() + e);
}, function(t, e) {
  return (e - t - (e.getTimezoneOffset() - t.getTimezoneOffset()) * Nt) / Jo;
}, function(t) {
  return t.getDate() - 1;
});
fs.range;
function Lt(t) {
  return Be(function(e) {
    e.setDate(e.getDate() - (e.getDay() + 7 - t) % 7), e.setHours(0, 0, 0, 0);
  }, function(e, n) {
    e.setDate(e.getDate() + n * 7);
  }, function(e, n) {
    return (n - e - (n.getTimezoneOffset() - e.getTimezoneOffset()) * Nt) / Qo;
  });
}
var jo = Lt(0), Mr = Lt(1), Yd = Lt(2), Gd = Lt(3), or = Lt(4), Xd = Lt(5), Kd = Lt(6);
jo.range;
Mr.range;
Yd.range;
Gd.range;
or.range;
Xd.range;
Kd.range;
var Zd = Be(function(t) {
  t.setDate(1), t.setHours(0, 0, 0, 0);
}, function(t, e) {
  t.setMonth(t.getMonth() + e);
}, function(t, e) {
  return e.getMonth() - t.getMonth() + (e.getFullYear() - t.getFullYear()) * 12;
}, function(t) {
  return t.getMonth();
});
Zd.range;
var Dt = Be(function(t) {
  t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, function(t, e) {
  t.setFullYear(t.getFullYear() + e);
}, function(t, e) {
  return e.getFullYear() - t.getFullYear();
}, function(t) {
  return t.getFullYear();
});
Dt.every = function(t) {
  return !isFinite(t = Math.floor(t)) || !(t > 0) ? null : Be(function(e) {
    e.setFullYear(Math.floor(e.getFullYear() / t) * t), e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
  }, function(e, n) {
    e.setFullYear(e.getFullYear() + n * t);
  });
};
Dt.range;
var Jd = Be(function(t) {
  t.setUTCSeconds(0, 0);
}, function(t, e) {
  t.setTime(+t + e * Nt);
}, function(t, e) {
  return (e - t) / Nt;
}, function(t) {
  return t.getUTCMinutes();
});
Jd.range;
var Qd = Be(function(t) {
  t.setUTCMinutes(0, 0, 0);
}, function(t, e) {
  t.setTime(+t + e * Sr);
}, function(t, e) {
  return (e - t) / Sr;
}, function(t) {
  return t.getUTCHours();
});
Qd.range;
var ds = Be(function(t) {
  t.setUTCHours(0, 0, 0, 0);
}, function(t, e) {
  t.setUTCDate(t.getUTCDate() + e);
}, function(t, e) {
  return (e - t) / Jo;
}, function(t) {
  return t.getUTCDate() - 1;
});
ds.range;
function Ft(t) {
  return Be(function(e) {
    e.setUTCDate(e.getUTCDate() - (e.getUTCDay() + 7 - t) % 7), e.setUTCHours(0, 0, 0, 0);
  }, function(e, n) {
    e.setUTCDate(e.getUTCDate() + n * 7);
  }, function(e, n) {
    return (n - e) / Qo;
  });
}
var el = Ft(0), kr = Ft(1), jd = Ft(2), ep = Ft(3), lr = Ft(4), tp = Ft(5), np = Ft(6);
el.range;
kr.range;
jd.range;
ep.range;
lr.range;
tp.range;
np.range;
var rp = Be(function(t) {
  t.setUTCDate(1), t.setUTCHours(0, 0, 0, 0);
}, function(t, e) {
  t.setUTCMonth(t.getUTCMonth() + e);
}, function(t, e) {
  return e.getUTCMonth() - t.getUTCMonth() + (e.getUTCFullYear() - t.getUTCFullYear()) * 12;
}, function(t) {
  return t.getUTCMonth();
});
rp.range;
var At = Be(function(t) {
  t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, function(t, e) {
  t.setUTCFullYear(t.getUTCFullYear() + e);
}, function(t, e) {
  return e.getUTCFullYear() - t.getUTCFullYear();
}, function(t) {
  return t.getUTCFullYear();
});
At.every = function(t) {
  return !isFinite(t = Math.floor(t)) || !(t > 0) ? null : Be(function(e) {
    e.setUTCFullYear(Math.floor(e.getUTCFullYear() / t) * t), e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
  }, function(e, n) {
    e.setUTCFullYear(e.getUTCFullYear() + n * t);
  });
};
At.range;
function ip(t) {
  if (0 <= t.y && t.y < 100) {
    var e = new Date(-1, t.m, t.d, t.H, t.M, t.S, t.L);
    return e.setFullYear(t.y), e;
  }
  return new Date(t.y, t.m, t.d, t.H, t.M, t.S, t.L);
}
function jn(t) {
  if (0 <= t.y && t.y < 100) {
    var e = new Date(Date.UTC(-1, t.m, t.d, t.H, t.M, t.S, t.L));
    return e.setUTCFullYear(t.y), e;
  }
  return new Date(Date.UTC(t.y, t.m, t.d, t.H, t.M, t.S, t.L));
}
function kn(t) {
  return { y: t, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0 };
}
function sp(t) {
  var e = t.dateTime, n = t.date, r = t.time, i = t.periods, s = t.days, a = t.shortDays, l = t.months, u = t.shortMonths, h = Cn(i), p = En(i), m = Cn(s), g = En(s), _ = Cn(a), E = En(a), c = Cn(l), w = En(l), T = Cn(u), A = En(u), b = {
    a: H,
    A: ne,
    b: he,
    B: ue,
    c: null,
    d: ia,
    e: ia,
    f: Tp,
    H: Cp,
    I: Ep,
    j: zp,
    L: tl,
    m: Np,
    M: Dp,
    p: J,
    Q: oa,
    s: la,
    S: Ap,
    u: Ip,
    U: Op,
    V: Lp,
    w: Fp,
    W: Pp,
    x: null,
    X: null,
    y: Bp,
    Y: Rp,
    Z: Up,
    "%": aa
  }, S = {
    a: re,
    A: le,
    b: ae,
    B: ce,
    c: null,
    d: sa,
    e: sa,
    f: Vp,
    H: Wp,
    I: $p,
    j: qp,
    L: nl,
    m: Hp,
    M: Yp,
    p: Ne,
    Q: oa,
    s: la,
    S: Gp,
    u: Xp,
    U: Kp,
    V: Zp,
    w: Jp,
    W: Qp,
    x: null,
    X: null,
    y: jp,
    Y: eg,
    Z: tg,
    "%": aa
  }, x = {
    a: V,
    A: R,
    b: j,
    B: O,
    c: W,
    d: na,
    e: na,
    f: xp,
    H: ra,
    I: ra,
    j: bp,
    L: wp,
    m: mp,
    M: vp,
    p: B,
    Q: Mp,
    s: kp,
    S: yp,
    u: cp,
    U: hp,
    V: fp,
    w: up,
    W: dp,
    x: Y,
    X: Z,
    y: gp,
    Y: pp,
    Z: _p,
    "%": Sp
  };
  b.x = z(n, b), b.X = z(r, b), b.c = z(e, b), S.x = z(n, S), S.X = z(r, S), S.c = z(e, S);
  function z(K, te) {
    return function(se) {
      var G = [], Te = -1, _e = 0, Ce = K.length, Ae, f, y;
      for (se instanceof Date || (se = /* @__PURE__ */ new Date(+se)); ++Te < Ce; )
        K.charCodeAt(Te) === 37 && (G.push(K.slice(_e, Te)), (f = ta[Ae = K.charAt(++Te)]) != null ? Ae = K.charAt(++Te) : f = Ae === "e" ? " " : "0", (y = te[Ae]) && (Ae = y(se, f)), G.push(Ae), _e = Te + 1);
      return G.push(K.slice(_e, Te)), G.join("");
    };
  }
  function C(K, te) {
    return function(se) {
      var G = kn(1900), Te = N(G, K, se += "", 0), _e, Ce;
      if (Te != se.length) return null;
      if ("Q" in G) return new Date(G.Q);
      if ("p" in G && (G.H = G.H % 12 + G.p * 12), "V" in G) {
        if (G.V < 1 || G.V > 53) return null;
        "w" in G || (G.w = 1), "Z" in G ? (_e = jn(kn(G.y)), Ce = _e.getUTCDay(), _e = Ce > 4 || Ce === 0 ? kr.ceil(_e) : kr(_e), _e = ds.offset(_e, (G.V - 1) * 7), G.y = _e.getUTCFullYear(), G.m = _e.getUTCMonth(), G.d = _e.getUTCDate() + (G.w + 6) % 7) : (_e = te(kn(G.y)), Ce = _e.getDay(), _e = Ce > 4 || Ce === 0 ? Mr.ceil(_e) : Mr(_e), _e = fs.offset(_e, (G.V - 1) * 7), G.y = _e.getFullYear(), G.m = _e.getMonth(), G.d = _e.getDate() + (G.w + 6) % 7);
      } else ("W" in G || "U" in G) && ("w" in G || (G.w = "u" in G ? G.u % 7 : "W" in G ? 1 : 0), Ce = "Z" in G ? jn(kn(G.y)).getUTCDay() : te(kn(G.y)).getDay(), G.m = 0, G.d = "W" in G ? (G.w + 6) % 7 + G.W * 7 - (Ce + 5) % 7 : G.w + G.U * 7 - (Ce + 6) % 7);
      return "Z" in G ? (G.H += G.Z / 100 | 0, G.M += G.Z % 100, jn(G)) : te(G);
    };
  }
  function N(K, te, se, G) {
    for (var Te = 0, _e = te.length, Ce = se.length, Ae, f; Te < _e; ) {
      if (G >= Ce) return -1;
      if (Ae = te.charCodeAt(Te++), Ae === 37) {
        if (Ae = te.charAt(Te++), f = x[Ae in ta ? te.charAt(Te++) : Ae], !f || (G = f(K, se, G)) < 0) return -1;
      } else if (Ae != se.charCodeAt(G++))
        return -1;
    }
    return G;
  }
  function B(K, te, se) {
    var G = h.exec(te.slice(se));
    return G ? (K.p = p[G[0].toLowerCase()], se + G[0].length) : -1;
  }
  function V(K, te, se) {
    var G = _.exec(te.slice(se));
    return G ? (K.w = E[G[0].toLowerCase()], se + G[0].length) : -1;
  }
  function R(K, te, se) {
    var G = m.exec(te.slice(se));
    return G ? (K.w = g[G[0].toLowerCase()], se + G[0].length) : -1;
  }
  function j(K, te, se) {
    var G = T.exec(te.slice(se));
    return G ? (K.m = A[G[0].toLowerCase()], se + G[0].length) : -1;
  }
  function O(K, te, se) {
    var G = c.exec(te.slice(se));
    return G ? (K.m = w[G[0].toLowerCase()], se + G[0].length) : -1;
  }
  function W(K, te, se) {
    return N(K, e, te, se);
  }
  function Y(K, te, se) {
    return N(K, n, te, se);
  }
  function Z(K, te, se) {
    return N(K, r, te, se);
  }
  function H(K) {
    return a[K.getDay()];
  }
  function ne(K) {
    return s[K.getDay()];
  }
  function he(K) {
    return u[K.getMonth()];
  }
  function ue(K) {
    return l[K.getMonth()];
  }
  function J(K) {
    return i[+(K.getHours() >= 12)];
  }
  function re(K) {
    return a[K.getUTCDay()];
  }
  function le(K) {
    return s[K.getUTCDay()];
  }
  function ae(K) {
    return u[K.getUTCMonth()];
  }
  function ce(K) {
    return l[K.getUTCMonth()];
  }
  function Ne(K) {
    return i[+(K.getUTCHours() >= 12)];
  }
  return {
    format: function(K) {
      var te = z(K += "", b);
      return te.toString = function() {
        return K;
      }, te;
    },
    parse: function(K) {
      var te = C(K += "", ip);
      return te.toString = function() {
        return K;
      }, te;
    },
    utcFormat: function(K) {
      var te = z(K += "", S);
      return te.toString = function() {
        return K;
      }, te;
    },
    utcParse: function(K) {
      var te = C(K, jn);
      return te.toString = function() {
        return K;
      }, te;
    }
  };
}
var ta = { "-": "", _: " ", 0: "0" }, $e = /^\s*\d+/, ap = /^%/, op = /[\\^$*+?|[\]().{}]/g;
function De(t, e, n) {
  var r = t < 0 ? "-" : "", i = (r ? -t : t) + "", s = i.length;
  return r + (s < n ? new Array(n - s + 1).join(e) + i : i);
}
function lp(t) {
  return t.replace(op, "\\$&");
}
function Cn(t) {
  return new RegExp("^(?:" + t.map(lp).join("|") + ")", "i");
}
function En(t) {
  for (var e = {}, n = -1, r = t.length; ++n < r; ) e[t[n].toLowerCase()] = n;
  return e;
}
function up(t, e, n) {
  var r = $e.exec(e.slice(n, n + 1));
  return r ? (t.w = +r[0], n + r[0].length) : -1;
}
function cp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 1));
  return r ? (t.u = +r[0], n + r[0].length) : -1;
}
function hp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 2));
  return r ? (t.U = +r[0], n + r[0].length) : -1;
}
function fp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 2));
  return r ? (t.V = +r[0], n + r[0].length) : -1;
}
function dp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 2));
  return r ? (t.W = +r[0], n + r[0].length) : -1;
}
function pp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 4));
  return r ? (t.y = +r[0], n + r[0].length) : -1;
}
function gp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 2));
  return r ? (t.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function _p(t, e, n) {
  var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(e.slice(n, n + 6));
  return r ? (t.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function mp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 2));
  return r ? (t.m = r[0] - 1, n + r[0].length) : -1;
}
function na(t, e, n) {
  var r = $e.exec(e.slice(n, n + 2));
  return r ? (t.d = +r[0], n + r[0].length) : -1;
}
function bp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 3));
  return r ? (t.m = 0, t.d = +r[0], n + r[0].length) : -1;
}
function ra(t, e, n) {
  var r = $e.exec(e.slice(n, n + 2));
  return r ? (t.H = +r[0], n + r[0].length) : -1;
}
function vp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 2));
  return r ? (t.M = +r[0], n + r[0].length) : -1;
}
function yp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 2));
  return r ? (t.S = +r[0], n + r[0].length) : -1;
}
function wp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 3));
  return r ? (t.L = +r[0], n + r[0].length) : -1;
}
function xp(t, e, n) {
  var r = $e.exec(e.slice(n, n + 6));
  return r ? (t.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function Sp(t, e, n) {
  var r = ap.exec(e.slice(n, n + 1));
  return r ? n + r[0].length : -1;
}
function Mp(t, e, n) {
  var r = $e.exec(e.slice(n));
  return r ? (t.Q = +r[0], n + r[0].length) : -1;
}
function kp(t, e, n) {
  var r = $e.exec(e.slice(n));
  return r ? (t.Q = +r[0] * 1e3, n + r[0].length) : -1;
}
function ia(t, e) {
  return De(t.getDate(), e, 2);
}
function Cp(t, e) {
  return De(t.getHours(), e, 2);
}
function Ep(t, e) {
  return De(t.getHours() % 12 || 12, e, 2);
}
function zp(t, e) {
  return De(1 + fs.count(Dt(t), t), e, 3);
}
function tl(t, e) {
  return De(t.getMilliseconds(), e, 3);
}
function Tp(t, e) {
  return tl(t, e) + "000";
}
function Np(t, e) {
  return De(t.getMonth() + 1, e, 2);
}
function Dp(t, e) {
  return De(t.getMinutes(), e, 2);
}
function Ap(t, e) {
  return De(t.getSeconds(), e, 2);
}
function Ip(t) {
  var e = t.getDay();
  return e === 0 ? 7 : e;
}
function Op(t, e) {
  return De(jo.count(Dt(t), t), e, 2);
}
function Lp(t, e) {
  var n = t.getDay();
  return t = n >= 4 || n === 0 ? or(t) : or.ceil(t), De(or.count(Dt(t), t) + (Dt(t).getDay() === 4), e, 2);
}
function Fp(t) {
  return t.getDay();
}
function Pp(t, e) {
  return De(Mr.count(Dt(t), t), e, 2);
}
function Bp(t, e) {
  return De(t.getFullYear() % 100, e, 2);
}
function Rp(t, e) {
  return De(t.getFullYear() % 1e4, e, 4);
}
function Up(t) {
  var e = t.getTimezoneOffset();
  return (e > 0 ? "-" : (e *= -1, "+")) + De(e / 60 | 0, "0", 2) + De(e % 60, "0", 2);
}
function sa(t, e) {
  return De(t.getUTCDate(), e, 2);
}
function Wp(t, e) {
  return De(t.getUTCHours(), e, 2);
}
function $p(t, e) {
  return De(t.getUTCHours() % 12 || 12, e, 2);
}
function qp(t, e) {
  return De(1 + ds.count(At(t), t), e, 3);
}
function nl(t, e) {
  return De(t.getUTCMilliseconds(), e, 3);
}
function Vp(t, e) {
  return nl(t, e) + "000";
}
function Hp(t, e) {
  return De(t.getUTCMonth() + 1, e, 2);
}
function Yp(t, e) {
  return De(t.getUTCMinutes(), e, 2);
}
function Gp(t, e) {
  return De(t.getUTCSeconds(), e, 2);
}
function Xp(t) {
  var e = t.getUTCDay();
  return e === 0 ? 7 : e;
}
function Kp(t, e) {
  return De(el.count(At(t), t), e, 2);
}
function Zp(t, e) {
  var n = t.getUTCDay();
  return t = n >= 4 || n === 0 ? lr(t) : lr.ceil(t), De(lr.count(At(t), t) + (At(t).getUTCDay() === 4), e, 2);
}
function Jp(t) {
  return t.getUTCDay();
}
function Qp(t, e) {
  return De(kr.count(At(t), t), e, 2);
}
function jp(t, e) {
  return De(t.getUTCFullYear() % 100, e, 2);
}
function eg(t, e) {
  return De(t.getUTCFullYear() % 1e4, e, 4);
}
function tg() {
  return "+0000";
}
function aa() {
  return "%";
}
function oa(t) {
  return +t;
}
function la(t) {
  return Math.floor(+t / 1e3);
}
var Ut, rl, il;
ng({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function ng(t) {
  return Ut = sp(t), Ut.format, Ut.parse, rl = Ut.utcFormat, il = Ut.utcParse, Ut;
}
var sl = "%Y-%m-%dT%H:%M:%S.%LZ";
function rg(t) {
  return t.toISOString();
}
Date.prototype.toISOString || rl(sl);
function ig(t) {
  var e = new Date(t);
  return isNaN(e) ? null : e;
}
+/* @__PURE__ */ new Date("2000-01-01T00:00:00.000Z") || il(sl);
function St(t) {
  return t.match(/.{6}/g).map(function(e) {
    return "#" + e;
  });
}
St("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");
St("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");
St("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");
St("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");
is(ct(300, 0.5, 0), ct(-240, 0.5, 1));
is(ct(-100, 0.75, 0.35), ct(80, 1.5, 0.8));
is(ct(260, 0.75, 0.35), ct(80, 1.5, 0.8));
ct();
function Pr(t) {
  var e = t.length;
  return function(n) {
    return t[Math.max(0, Math.min(e - 1, Math.floor(n * e)))];
  };
}
Pr(St("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));
Pr(St("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));
Pr(St("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
Pr(St("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));
class sg {
  constructor() {
    this.x = it(), this.y = it(), this.x_size = it(), this.y_size = it(), this.size = it(), this.reaction_color = it().clamp(!0), this.reaction_size = it().clamp(!0), this.metabolite_color = it().clamp(!0), this.metabolite_size = it().clamp(!0);
  }
  connectToSettings(e, n, r) {
    ["reaction", "metabolite"].forEach((s) => {
      const a = `${s}_scale`, l = `${s}_scale_preset`, u = e.get(l), h = e.get(a);
      u && h && h !== Xt[u] ? (console.warn(`Both ${a} and ${l} are defined. Ignoring ${l}. Set ${l} to "false" to hide this warning.`), e.set(l, null)) : u ? e.set(a, Xt[u]) : h || console.error(`Must provide a ${a} or ${l}`), e.get(a) && e.get(a).length < 2 ? console.error(`Bad value for option ${a}. Scales must have at least 2 points.`) : this.setScale(s, a, r), e.streams[a].onValue((p) => {
        p && p !== Xt[e.get(l)] && e.set(l, null), this.setScale(s, p, r);
      }), e.streams[l].onValue((p) => {
        p && e.set(a, Xt[p]);
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
function hi(t, e) {
  return t + 1 > e - 1 ? 0 : t + 1;
}
function ag(t, e) {
  return t - 1 < 0 ? e - 1 : t - 1;
}
class og {
  constructor() {
    this.stack = Array(40), this.current = -1, this.oldest = -1, this.newest = -1, this.endOfStack = !0, this.topOfStack = !0;
  }
  push(e, n) {
    return this.current = hi(this.current, this.stack.length), this.endOfStack ? this.oldest = this.current : this.oldest === this.current && (this.oldest = hi(this.oldest, this.stack.length)), this.stack[this.current] = { undo: e, redo: n }, this.newest = this.current, this.topOfStack = !0, this.endOfStack = !1, { do: () => n() };
  }
  undo() {
    if (this.endOfStack) return console.warn("End of stack.");
    this.stack[this.current].undo(), this.current === this.oldest ? this.endOfStack = !0 : this.current = ag(this.current, this.stack.length), this.topOfStack = !1;
  }
  redo() {
    if (this.topOfStack) return console.warn("Top of stack.");
    this.endOfStack || (this.current = hi(this.current, this.stack.length)), this.stack[this.current].redo(), this.current === this.newest && (this.topOfStack = !0), this.endOfStack = !1;
  }
}
var fi = { exports: {} }, ua;
function lg() {
  return ua || (ua = 1, (function(t) {
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
      }, u, h = 1; h < 20; ++h)
        i[111 + h] = "f" + h;
      for (h = 0; h <= 9; ++h)
        i[h + 96] = h.toString();
      function p(C, N, B) {
        if (C.addEventListener) {
          C.addEventListener(N, B, !1);
          return;
        }
        C.attachEvent("on" + N, B);
      }
      function m(C) {
        if (C.type == "keypress") {
          var N = String.fromCharCode(C.which);
          return C.shiftKey || (N = N.toLowerCase()), N;
        }
        return i[C.which] ? i[C.which] : s[C.which] ? s[C.which] : String.fromCharCode(C.which).toLowerCase();
      }
      function g(C, N) {
        return C.sort().join(",") === N.sort().join(",");
      }
      function _(C) {
        var N = [];
        return C.shiftKey && N.push("shift"), C.altKey && N.push("alt"), C.ctrlKey && N.push("ctrl"), C.metaKey && N.push("meta"), N;
      }
      function E(C) {
        if (C.preventDefault) {
          C.preventDefault();
          return;
        }
        C.returnValue = !1;
      }
      function c(C) {
        if (C.stopPropagation) {
          C.stopPropagation();
          return;
        }
        C.cancelBubble = !0;
      }
      function w(C) {
        return C == "shift" || C == "ctrl" || C == "alt" || C == "meta";
      }
      function T() {
        if (!u) {
          u = {};
          for (var C in i)
            C > 95 && C < 112 || i.hasOwnProperty(C) && (u[i[C]] = C);
        }
        return u;
      }
      function A(C, N, B) {
        return B || (B = T()[C] ? "keydown" : "keypress"), B == "keypress" && N.length && (B = "keydown"), B;
      }
      function b(C) {
        return C === "+" ? ["+"] : (C = C.replace(/\+{2}/g, "+plus"), C.split("+"));
      }
      function S(C, N) {
        var B, V, R, j = [];
        for (B = b(C), R = 0; R < B.length; ++R)
          V = B[R], l[V] && (V = l[V]), N && N != "keypress" && a[V] && (V = a[V], j.push("shift")), w(V) && j.push(V);
        return N = A(V, j, N), {
          key: V,
          modifiers: j,
          action: N
        };
      }
      function x(C, N) {
        return C === null || C === n ? !1 : C === N ? !0 : x(C.parentNode, N);
      }
      function z(C) {
        var N = this;
        if (C = C || n, !(N instanceof z))
          return new z(C);
        N.target = C, N._callbacks = {}, N._directMap = {};
        var B = {}, V, R = !1, j = !1, O = !1;
        function W(J) {
          J = J || {};
          var re = !1, le;
          for (le in B) {
            if (J[le]) {
              re = !0;
              continue;
            }
            B[le] = 0;
          }
          re || (O = !1);
        }
        function Y(J, re, le, ae, ce, Ne) {
          var K, te, se = [], G = le.type;
          if (!N._callbacks[J])
            return [];
          for (G == "keyup" && w(J) && (re = [J]), K = 0; K < N._callbacks[J].length; ++K)
            if (te = N._callbacks[J][K], !(!ae && te.seq && B[te.seq] != te.level) && G == te.action && (G == "keypress" && !le.metaKey && !le.ctrlKey || g(re, te.modifiers))) {
              var Te = !ae && te.combo == ce, _e = ae && te.seq == ae && te.level == Ne;
              (Te || _e) && N._callbacks[J].splice(K, 1), se.push(te);
            }
          return se;
        }
        function Z(J, re, le, ae) {
          N.stopCallback(re, re.target || re.srcElement, le, ae) || J(re, le) === !1 && (E(re), c(re));
        }
        N._handleKey = function(J, re, le) {
          var ae = Y(J, re, le), ce, Ne = {}, K = 0, te = !1;
          for (ce = 0; ce < ae.length; ++ce)
            ae[ce].seq && (K = Math.max(K, ae[ce].level));
          for (ce = 0; ce < ae.length; ++ce) {
            if (ae[ce].seq) {
              if (ae[ce].level != K)
                continue;
              te = !0, Ne[ae[ce].seq] = 1, Z(ae[ce].callback, le, ae[ce].combo, ae[ce].seq);
              continue;
            }
            te || Z(ae[ce].callback, le, ae[ce].combo);
          }
          var se = le.type == "keypress" && j;
          le.type == O && !w(J) && !se && W(Ne), j = te && le.type == "keydown";
        };
        function H(J) {
          typeof J.which != "number" && (J.which = J.keyCode);
          var re = m(J);
          if (re) {
            if (J.type == "keyup" && R === re) {
              R = !1;
              return;
            }
            N.handleKey(re, _(J), J);
          }
        }
        function ne() {
          clearTimeout(V), V = setTimeout(W, 1e3);
        }
        function he(J, re, le, ae) {
          B[J] = 0;
          function ce(G) {
            return function() {
              O = G, ++B[J], ne();
            };
          }
          function Ne(G) {
            Z(le, G, J), ae !== "keyup" && (R = m(G)), setTimeout(W, 10);
          }
          for (var K = 0; K < re.length; ++K) {
            var te = K + 1 === re.length, se = te ? Ne : ce(ae || S(re[K + 1]).action);
            ue(re[K], se, ae, J, K);
          }
        }
        function ue(J, re, le, ae, ce) {
          N._directMap[J + ":" + le] = re, J = J.replace(/\s+/g, " ");
          var Ne = J.split(" "), K;
          if (Ne.length > 1) {
            he(J, Ne, re, le);
            return;
          }
          K = S(J, le), N._callbacks[K.key] = N._callbacks[K.key] || [], Y(K.key, K.modifiers, { type: K.action }, ae, J, ce), N._callbacks[K.key][ae ? "unshift" : "push"]({
            callback: re,
            modifiers: K.modifiers,
            action: K.action,
            seq: ae,
            level: ce,
            combo: J
          });
        }
        N._bindMultiple = function(J, re, le) {
          for (var ae = 0; ae < J.length; ++ae)
            ue(J[ae], re, le);
        }, p(C, "keypress", H), p(C, "keydown", H), p(C, "keyup", H);
      }
      z.prototype.bind = function(C, N, B) {
        var V = this;
        return C = C instanceof Array ? C : [C], V._bindMultiple.call(V, C, N, B), V;
      }, z.prototype.unbind = function(C, N) {
        var B = this;
        return B.bind.call(B, C, function() {
        }, N);
      }, z.prototype.trigger = function(C, N) {
        var B = this;
        return B._directMap[C + ":" + N] && B._directMap[C + ":" + N]({}, C), B;
      }, z.prototype.reset = function() {
        var C = this;
        return C._callbacks = {}, C._directMap = {}, C;
      }, z.prototype.stopCallback = function(C, N) {
        var B = this;
        if ((" " + N.className + " ").indexOf(" mousetrap ") > -1 || x(N, B.target))
          return !1;
        if ("composedPath" in C && typeof C.composedPath == "function") {
          var V = C.composedPath()[0];
          V !== C.target && (N = V);
        }
        return N.tagName == "INPUT" || N.tagName == "SELECT" || N.tagName == "TEXTAREA" || N.isContentEditable;
      }, z.prototype.handleKey = function() {
        var C = this;
        return C._handleKey.apply(C, arguments);
      }, z.addKeycodes = function(C) {
        for (var N in C)
          C.hasOwnProperty(N) && (i[N] = C[N]);
        u = null;
      }, z.init = function() {
        var C = z(n);
        for (var N in C)
          N.charAt(0) !== "_" && (z[N] = /* @__PURE__ */ (function(B) {
            return function() {
              return C[B].apply(C, arguments);
            };
          })(N));
      }, z.init(), e.Mousetrap = z, t.exports && (t.exports = z);
    })(typeof window < "u" ? window : null, typeof window < "u" ? document : null);
  })(fi)), fi.exports;
}
var ug = lg();
const ca = /* @__PURE__ */ ln(ug);
function ha(t, e) {
  if (!e) return t;
  const n = Q.isArray(t) ? t : [t], r = n.reduce((i, s) => {
    var a = s.replace("ctrl+", "meta+");
    return a !== s && i.push(a), i;
  }, n.slice());
  return r.length === n.length ? t : r;
}
class cg {
  constructor(e = {}, n = [], r = null, i = !1, s = null) {
    this.assignedKeys = e, this.inputList = n, this.mousetrap = r ? new ca(r) : new ca(), this.ctrlEqualsCmd = i, this.mousetrap.stopCallback = () => !1, this.escapeQueue = [], this.removeEscapeListener = null, this.settings = s, this.enabled = !0, this.update();
  }
  /**
   * Updated key bindings if attributes have changed.
   */
  update() {
    if (this.mousetrap.reset(), !!this.enabled)
      for (let e in this.assignedKeys) {
        const n = this.assignedKeys[e];
        if (!n.key) continue;
        const r = ha(n.key, this.ctrlEqualsCmd);
        n.inputList = this.inputList, this.mousetrap.bind(r, (i) => {
          if (n.requires && !this.settings.get(n.requires))
            return;
          let s = !1;
          if (n.ignoreWithInput)
            for (var a = 0, l = n.inputList.length; a < l; a++) {
              const u = n.inputList[a], h = Q.isFunction(u) ? u() : u;
              if (h !== null && h.is_visible()) {
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
    Q.isUndefined(e) && (e = !this.enabled), this.enabled = e, this.update();
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
    return this.mousetrap.bind(ha(e, this.ctrlEqualsCmd), (s) => {
      s.preventDefault(), n(), r && i();
    }), i;
  }
}
class hg {
  constructor(e, n) {
    this.selection = e, this.x = n.x, this.y = n.y, this.width = n.width, this.height = n.height, this.resizeEnabled = !0, this.callbackManager = new hn(), this.setup();
  }
  /**
   * Turn the resize on or off
   */
  toggleResize(e) {
    Q.isUndefined(e) && (e = !this.resizeEnabled), e ? this.selection.selectAll(".drag-rect").style("pointer-events", "auto") : this.selection.selectAll(".drag-rect").style("pointer-events", "none");
  }
  setup() {
    const r = this.selection.append("g").classed("canvas-group", !0).data([{ x: this.x, y: this.y }]), i = () => {
      X.sourceEvent.stopPropagation();
    }, s = (w, T, A) => {
      const S = Gt(A).translate;
      return w !== null && (S[0] = w), T !== null && (S[1] = T), "translate(" + S + ")";
    }, a = r.append("rect").attr("id", "mouse-node").attr("width", this.width * 10).attr("height", this.height * 10).attr("transform", "translate(" + [this.x - this.width * 10 / 2, this.y - this.height * 10 / 2] + ")").attr("pointer-events", "all");
    this.mouseNode = a;
    const l = r.append("rect").attr("id", "canvas").attr("width", this.width).attr("height", this.height).attr("transform", "translate(" + [this.x, this.y] + ")"), u = tt().on("start", i).on("drag", (w) => {
      const T = w.x;
      w.x = Math.min(w.x + this.width - 100 / 2, X.x), this.x = w.x, this.width = this.width + (T - w.x), h.attr("transform", (A) => s(A.x - 100 / 2, null, h.attr("transform"))), a.attr("transform", (A) => s(A.x, null, a.attr("transform"))).attr("width", this.width * 10), l.attr("transform", (A) => s(A.x, null, l.attr("transform"))).attr("width", this.width), _.attr("transform", (A) => s(A.x + 100 / 2, null, _.attr("transform"))).attr("width", this.width - 100), c.attr("transform", (A) => s(A.x + 100 / 2, null, c.attr("transform"))).attr("width", this.width - 100), this.callbackManager.run("resize");
    }), h = r.append("rect").classed("drag-rect", !0).attr("transform", (w) => "translate(" + [w.x - 100 / 2, w.y + 100 / 2] + ")").attr("height", this.height - 100).attr("id", "dragleft").attr("width", 100).attr("cursor", "ew-resize").classed("resize-rect", !0).call(u), p = tt().on("start", i).on("drag", (w) => {
      X.sourceEvent.stopPropagation();
      const T = Math.max(
        w.x + 100 / 2,
        w.x + this.width + X.dx
      );
      this.width = T - w.x, m.attr(
        "transform",
        (A) => s(T - 100 / 2, null, m.attr("transform"))
      ), a.attr("width", this.width * 10), l.attr("width", this.width), _.attr("width", this.width - 100), c.attr("width", this.width - 100), this.callbackManager.run("resize");
    }), m = r.append("rect").classed("drag-rect", !0).attr("transform", (w) => "translate(" + [w.x + this.width - 100 / 2, w.y + 100 / 2] + ")").attr("id", "dragright").attr("height", this.height - 100).attr("width", 100).attr("cursor", "ew-resize").classed("resize-rect", !0).call(p), g = tt().on("start", i).on("drag", (w) => {
      X.sourceEvent.stopPropagation();
      const T = w.y;
      w.y = Math.min(w.y + this.height - 100 / 2, X.y), this.y = w.y, this.height = this.height + (T - w.y), _.attr("transform", (A) => s(null, A.y - 100 / 2, _.attr("transform"))), a.attr("transform", (A) => s(null, A.y, a.attr("transform"))).attr("width", this.height * 10), l.attr("transform", (A) => s(null, A.y, l.attr("transform"))).attr("height", this.height), h.attr("transform", (A) => s(null, A.y + 100 / 2, h.attr("transform"))).attr("height", this.height - 100), m.attr("transform", (A) => s(null, A.y + 100 / 2, m.attr("transform"))).attr("height", this.height - 100), this.callbackManager.run("resize");
    }), _ = r.append("rect").classed("drag-rect", !0).attr("transform", (w) => "translate(" + [w.x + 100 / 2, w.y - 100 / 2] + ")").attr("height", 100).attr("width", this.width - 100).attr("cursor", "ns-resize").classed("resize-rect", !0).call(g), E = tt().on("start", i).on("drag", (w) => {
      X.sourceEvent.stopPropagation();
      const T = Math.max(
        w.y + 100 / 2,
        w.y + this.height + X.dy
      );
      this.height = T - w.y, c.attr("transform", (A) => s(
        null,
        T - 100 / 2,
        c.attr("transform")
      )), a.attr("height", this.height * 10), l.attr("height", this.height), h.attr("height", this.height - 100), m.attr("height", this.height - 100), this.callbackManager.run("resize");
    }), c = r.append("rect").classed("drag-rect", !0).attr("transform", (w) => "translate(" + [w.x + 100 / 2, w.y + this.height - 100 / 2] + ")").attr("height", 100).attr("width", this.width - 100).attr("cursor", "ns-resize").classed("resize-rect", !0).call(E);
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
class fg {
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
var ur = { exports: {} }, dg = ur.exports, fa;
function pg() {
  return fa || (fa = 1, (function(t) {
    (function() {
      var e = Array.prototype.slice, n = {
        toString: function() {
          return "Bacon";
        }
      };
      n.version = "0.7.95";
      var r = (typeof kt < "u" && kt !== null ? kt : this).Error, i = function() {
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
      }, h = function(o) {
        if (!(o != null && o._isEventStream))
          throw new r("not an EventStream : " + o);
      }, p = function(o) {
        if (!(o != null && o._isObservable))
          throw new r("not an Observable : " + o);
      }, m = function(o) {
        return l("not a function : " + o, b.isFunction(o));
      }, g = Array.isArray || function(o) {
        return o instanceof Array;
      }, _ = function(o) {
        return o && o._isObservable;
      }, E = function(o) {
        if (!g(o))
          throw new r("not an array : " + o);
      }, c = function(o) {
        return l("no arguments supported", o.length === 0);
      }, w = function(o) {
        for (var d = arguments.length, v = 1; 1 < d ? v < d : v > d; 1 < d ? v++ : v--)
          for (var M in arguments[v])
            o[M] = arguments[v][M];
        return o;
      }, T = function(o, d) {
        var v = {}.hasOwnProperty, M = function() {
        };
        M.prototype = d.prototype, o.prototype = new M();
        for (var L in d)
          v.call(d, L) && (o[L] = d[L]);
        return o;
      }, A = function(o) {
        return typeof Symbol < "u" && Symbol[o] ? Symbol[o] : typeof Symbol < "u" && typeof Symbol.for == "function" ? Symbol[o] = Symbol.for(o) : "@@" + o;
      }, b = {
        indexOf: (function() {
          return Array.prototype.indexOf ? function(o, d) {
            return o.indexOf(d);
          } : function(o, d) {
            for (var v = 0, M; v < o.length; v++)
              if (M = o[v], d === M)
                return v;
            return -1;
          };
        })(),
        indexWhere: function(o, d) {
          for (var v = 0, M; v < o.length; v++)
            if (M = o[v], d(M))
              return v;
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
          for (var v = [], M = 0, L; M < d.length; M++)
            L = d[M], o(L) && v.push(L);
          return v;
        },
        map: function(o, d) {
          return (function() {
            for (var v = [], M = 0, L; M < d.length; M++)
              L = d[M], v.push(o(L));
            return v;
          })();
        },
        each: function(o, d) {
          for (var v in o)
            if (Object.prototype.hasOwnProperty.call(o, v)) {
              var M = o[v];
              d(v, M);
            }
        },
        toArray: function(o) {
          return g(o) ? o : [o];
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
          for (var d = arguments.length <= 1 || arguments[1] === void 0 ? b.id : arguments[1], v = 0, M; v < o.length; v++)
            if (M = o[v], !d(M))
              return !1;
          return !0;
        },
        any: function(o) {
          for (var d = arguments.length <= 1 || arguments[1] === void 0 ? b.id : arguments[1], v = 0, M; v < o.length; v++)
            if (M = o[v], d(M))
              return !0;
          return !1;
        },
        without: function(o, d) {
          return b.filter(function(v) {
            return v !== o;
          }, d);
        },
        remove: function(o, d) {
          var v = b.indexOf(d, o);
          if (v >= 0)
            return d.splice(v, 1);
        },
        fold: function(o, d, v) {
          for (var M = 0, L; M < o.length; M++)
            L = o[M], d = v(d, L);
          return d;
        },
        flatMap: function(o, d) {
          return b.fold(d, [], function(v, M) {
            return v.concat(o(M));
          });
        },
        cached: function(o) {
          var d = ce;
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
          var d, v, M, L = {}.hasOwnProperty;
          try {
            return S++, o == null ? "undefined" : b.isFunction(o) ? "function" : g(o) ? S > 5 ? "[..]" : "[" + b.map(b.toString, o).toString() + "]" : (o != null ? o.toString : void 0) != null && o.toString !== Object.prototype.toString ? o.toString() : typeof o == "object" ? S > 5 ? "{..}" : (d = (function() {
              var U = [];
              for (v in o)
                L.call(o, v) && (M = (function() {
                  var q;
                  try {
                    return o[v];
                  } catch (ie) {
                    return ie;
                  }
                })(), U.push(b.toString(v) + ":" + b.toString(M)));
              return U;
            })(), "{" + d + "}") : o;
          } finally {
            S--;
          }
        }
      }, S = 0;
      n._ = b;
      var x = n.UpdateBarrier = /* @__PURE__ */ (function() {
        var o, d = [], v = {}, M = [], L = 0, U = {};
        function q(me) {
          me <= L || (M[me - 1] || (M[me - 1] = [[], 0]), L = me);
        }
        var ie = function(me, Se) {
          if (o || M.length) {
            q(1);
            for (var Ee = 0; Ee < L - 1 && !oe(me, M[Ee][0]); )
              Ee++;
            var Fe = M[Ee][0];
            Fe.push([me, Se]), o || de();
          } else
            return Se();
        };
        function oe(me, Se) {
          for (var Ee = 0; Ee < Se.length; Ee++)
            if (Se[Ee][0].id == me.id) return !0;
          return !1;
        }
        function de() {
          var me = L;
          if (me)
            for (; L >= me; ) {
              var Se = M[L - 1];
              if (!Se) throw new _e("Unexpected stack top: " + Se);
              var Ee = Se[0], Fe = Se[1];
              if (Fe < Ee.length) {
                var qe = Ee[Fe];
                qe[0];
                var rt = qe[1];
                Se[1]++, q(L + 1);
                var ht = !1;
                try {
                  for (rt(), ht = !0; L > me && M[L - 1][0].length == 0; )
                    L--;
                } finally {
                  ht || (M = [], L = 0);
                }
              } else {
                Se[0] = [], Se[1] = 0;
                break;
              }
            }
        }
        var be = function(me, Se) {
          if (o) {
            var Ee = v[me.id];
            return typeof Ee < "u" && Ee !== null ? Ee.push(Se) : (Ee = v[me.id] = [Se], d.push(me));
          } else
            return Se();
        }, xe = function() {
          for (; d.length > 0; )
            ve(0, !0);
          U = {};
        }, ve = function(me, Se) {
          var Ee = d[me], Fe = Ee.id, qe = v[Fe];
          d.splice(me, 1), delete v[Fe], Se && d.length > 0 && Le(Ee);
          for (var rt = 0, ht; rt < qe.length; rt++)
            ht = qe[rt], ht();
        }, Le = function(me) {
          if (!U[me.id]) {
            for (var Se = me.internalDeps(), Ee = 0, Fe; Ee < Se.length; Ee++)
              if (Fe = Se[Ee], Le(Fe), v[Fe.id]) {
                var qe = b.indexOf(d, Fe);
                ve(qe, !1);
              }
            U[me.id] = !0;
          }
        }, pe = function(me, Se, Ee, Fe) {
          if (o)
            return Ee.apply(Se, Fe);
          o = me;
          try {
            var qe = Ee.apply(Se, Fe);
            xe();
          } finally {
            o = void 0, de();
          }
          return qe;
        }, ye = function() {
          return o ? o.id : void 0;
        }, Ie = function(me, Se) {
          var Ee = !1, Fe = !1, qe = function() {
            return Fe = !0, Fe;
          }, rt = function() {
            return Ee = !0, qe();
          };
          return qe = me.dispatcher.subscribe(function(ht) {
            return ie(me, function() {
              if (!Ee) {
                var Hr = Se(ht);
                if (Hr === n.noMore)
                  return rt();
              }
            });
          }), Fe && qe(), rt;
        }, Ue = function() {
          return d.length > 0;
        };
        return { whenDoneWith: be, hasWaiters: Ue, inTransaction: pe, currentEventId: ye, wrappedSubscribe: Ie, afterTransaction: ie };
      })();
      function z(o, d) {
        var v = arguments.length <= 2 || arguments[2] === void 0 ? !1 : arguments[2];
        this.obs = o, this.sync = d, this.lazy = v, this.queue = [];
      }
      w(z.prototype, {
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
      function C() {
        z.apply(this, arguments);
      }
      T(C, z), w(C.prototype, {
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
      function N(o) {
        z.call(this, o, !0);
      }
      T(N, z), w(N.prototype, {
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
      }), z.isTrigger = function(o) {
        return o != null && o._isSource ? o.sync : o != null ? o._isEventStream : void 0;
      }, z.fromObservable = function(o) {
        return o != null && o._isSource ? o : o != null && o._isProperty ? new z(o, !1) : new C(o, !0);
      };
      function B(o, d, v) {
        this.context = o, this.method = d, this.args = v;
      }
      w(B.prototype, {
        _isDesc: !0,
        deps: function() {
          return this.cached || (this.cached = j([this.context].concat(this.args))), this.cached;
        },
        toString: function() {
          return b.toString(this.context) + "." + b.toString(this.method) + "(" + b.map(b.toString, this.args) + ")";
        }
      });
      var V = function(o, d) {
        var v = o || d;
        if (v && v._isDesc)
          return o || d;
        for (var M = arguments.length, L = Array(M > 2 ? M - 2 : 0), U = 2; U < M; U++)
          L[U - 2] = arguments[U];
        return new B(o, d, L);
      }, R = function(o, d) {
        return d.desc = o, d;
      }, j = function(o) {
        return g(o) ? b.flatMap(j, o) : _(o) ? [o] : typeof o < "u" && o !== null && o._isSource ? [o.obs] : [];
      };
      n.Desc = B, n.Desc.empty = new n.Desc("", "", []);
      var O = function(o) {
        return function(d) {
          for (var v = arguments.length, M = Array(v > 1 ? v - 1 : 0), L = 1; L < v; L++)
            M[L - 1] = arguments[L];
          if (typeof d == "object" && M.length) {
            var U = d, q = M[0];
            d = function() {
              return U[q].apply(U, arguments);
            }, M = M.slice(1);
          }
          return o.apply(void 0, [d].concat(M));
        };
      }, W = function(o) {
        return o = Array.prototype.slice.call(o), he.apply(void 0, o);
      }, Y = function(o, d) {
        return function() {
          for (var v = arguments.length, M = Array(v), L = 0; L < v; L++)
            M[L] = arguments[L];
          return o.apply(void 0, d.concat(M));
        };
      }, Z = function(o) {
        return function(d) {
          return function(v) {
            if (typeof v < "u" && v !== null) {
              var M = v[d];
              return b.isFunction(M) ? M.apply(v, o) : M;
            } else
              return;
          };
        };
      }, H = function(o, d) {
        var v = o.slice(1).split("."), M = b.map(Z(d), v);
        return function(L) {
          for (var U = 0, q; U < M.length; U++)
            q = M[U], L = q(L);
          return L;
        };
      }, ne = function(o) {
        return typeof o == "string" && o.length > 1 && o.charAt(0) === ".";
      }, he = O(function(o) {
        for (var d = arguments.length, v = Array(d > 1 ? d - 1 : 0), M = 1; M < d; M++)
          v[M - 1] = arguments[M];
        return b.isFunction(o) ? v.length ? Y(o, v) : o : ne(o) ? H(o, v) : b.always(o);
      }), ue = function(o, d) {
        return he.apply(void 0, [o].concat(d));
      }, J = function(o, d, v, M) {
        if (typeof d < "u" && d !== null && d._isProperty) {
          var L = d.sampledBy(o, function(U, q) {
            return [U, q];
          });
          return M.call(L, function(U) {
            var q = U[0];
            return U[1], q;
          }).map(function(U) {
            U[0];
            var q = U[1];
            return q;
          });
        } else
          return d = ue(d, v), M.call(o, d);
      }, re = function(o) {
        if (b.isFunction(o))
          return o;
        if (ne(o)) {
          var d = le(o);
          return function(v, M) {
            return v[d](M);
          };
        } else
          throw new r("not a function or a field key: " + o);
      }, le = function(o) {
        return o.slice(1);
      };
      function ae(o) {
        this.value = o;
      }
      w(ae.prototype, {
        _isSome: !0,
        getOrElse: function() {
          return this.value;
        },
        get: function() {
          return this.value;
        },
        filter: function(o) {
          return o(this.value) ? new ae(this.value) : ce;
        },
        map: function(o) {
          return new ae(o(this.value));
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
      var ce = {
        _isNone: !0,
        getOrElse: function(o) {
          return o;
        },
        filter: function() {
          return ce;
        },
        map: function() {
          return ce;
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
      }, Ne = function(o) {
        return typeof o < "u" && o !== null && o._isSome || typeof o < "u" && o !== null && o._isNone ? o : new ae(o);
      };
      n.noMore = "<no-more>", n.more = "<more>";
      var K = 0;
      function te() {
        this.id = ++K;
      }
      te.prototype._isEvent = !0, te.prototype.isEvent = function() {
        return !0;
      }, te.prototype.isEnd = function() {
        return !1;
      }, te.prototype.isInitial = function() {
        return !1;
      }, te.prototype.isNext = function() {
        return !1;
      }, te.prototype.isError = function() {
        return !1;
      }, te.prototype.hasValue = function() {
        return !1;
      }, te.prototype.filter = function() {
        return !0;
      }, te.prototype.inspect = function() {
        return this.toString();
      }, te.prototype.log = function() {
        return this.toString();
      };
      function se(o, d) {
        if (!(this instanceof se))
          return new se(o, d);
        te.call(this), !d && b.isFunction(o) || o != null && o._isNext ? (this.valueF = o, this.valueInternal = void 0) : (this.valueF = void 0, this.valueInternal = o);
      }
      T(se, te), se.prototype.isNext = function() {
        return !0;
      }, se.prototype.hasValue = function() {
        return !0;
      }, se.prototype.value = function() {
        var o;
        return (o = this.valueF) != null && o._isNext ? (this.valueInternal = this.valueF.value(), this.valueF = void 0) : this.valueF && (this.valueInternal = this.valueF(), this.valueF = void 0), this.valueInternal;
      }, se.prototype.fmap = function(o) {
        var d, v;
        return this.valueInternal ? (v = this.valueInternal, this.apply(function() {
          return o(v);
        })) : (d = this, this.apply(function() {
          return o(d.value());
        }));
      }, se.prototype.apply = function(o) {
        return new se(o);
      }, se.prototype.filter = function(o) {
        return o(this.value());
      }, se.prototype.toString = function() {
        return b.toString(this.value());
      }, se.prototype.log = function() {
        return this.value();
      }, se.prototype._isNext = !0;
      function G(o, d) {
        if (!(this instanceof G))
          return new G(o, d);
        se.call(this, o, d);
      }
      T(G, se), G.prototype._isInitial = !0, G.prototype.isInitial = function() {
        return !0;
      }, G.prototype.isNext = function() {
        return !1;
      }, G.prototype.apply = function(o) {
        return new G(o);
      }, G.prototype.toNext = function() {
        return new se(this);
      };
      function Te() {
        if (!(this instanceof Te))
          return new Te();
        te.call(this);
      }
      T(Te, te), Te.prototype.isEnd = function() {
        return !0;
      }, Te.prototype.fmap = function() {
        return this;
      }, Te.prototype.apply = function() {
        return this;
      }, Te.prototype.toString = function() {
        return "<end>";
      };
      function _e(o) {
        if (!(this instanceof _e))
          return new _e(o);
        this.error = o, te.call(this);
      }
      T(_e, te), _e.prototype.isError = function() {
        return !0;
      }, _e.prototype.fmap = function() {
        return this;
      }, _e.prototype.apply = function() {
        return this;
      }, _e.prototype.toString = function() {
        return "<error> " + b.toString(this.error);
      }, n.Event = te, n.Initial = G, n.Next = se, n.End = Te, n.Error = _e;
      var Ce = function(o) {
        return new G(o, !0);
      }, Ae = function(o) {
        return new se(o, !0);
      }, f = function() {
        return new Te();
      }, y = function(o) {
        return o && o._isEvent ? o : Ae(o);
      }, I = 0, Pt = function() {
      };
      function D(o) {
        this.desc = o, this.id = ++I, this.initialDesc = this.desc;
      }
      w(D.prototype, {
        _isObservable: !0,
        subscribe: function(o) {
          return x.wrappedSubscribe(this, o);
        },
        subscribeInternal: function(o) {
          return this.dispatcher.subscribe(o);
        },
        onValue: function() {
          var o = W(arguments);
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
          var o = W(arguments);
          return this.subscribe(function(d) {
            if (d.isError())
              return o(d.error);
          });
        },
        onEnd: function() {
          var o = W(arguments);
          return this.subscribe(function(d) {
            if (d.isEnd())
              return o();
          });
        },
        name: function(o) {
          return this._name = o, this;
        },
        withDescription: function() {
          return this.desc = V.apply(void 0, arguments), this;
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
      }), D.prototype.assign = D.prototype.onValue, D.prototype.forEach = D.prototype.onValue, D.prototype.inspect = D.prototype.toString, n.Observable = D;
      function P() {
        var o = arguments.length <= 0 || arguments[0] === void 0 ? [] : arguments[0];
        this.unsubscribe = b.bind(this.unsubscribe, this), this.unsubscribed = !1, this.subscriptions = [], this.starting = [];
        for (var d = 0, v; d < o.length; d++)
          v = o[d], this.add(v);
      }
      w(P.prototype, {
        add: function(o) {
          var d = this;
          if (!this.unsubscribed) {
            var v = !1, M = i;
            this.starting.push(o);
            var L = function() {
              if (!d.unsubscribed)
                return v = !0, d.remove(M), b.remove(o, d.starting);
            };
            return M = o(this.unsubscribe, L), this.unsubscribed || v ? M() : this.subscriptions.push(M), b.remove(o, this.starting), M;
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
      }), n.CompositeUnsubscribe = P;
      function F(o, d) {
        this._subscribe = o, this._handleEvent = d, this.subscribe = b.bind(this.subscribe, this), this.handleEvent = b.bind(this.handleEvent, this), this.pushing = !1, this.ended = !1, this.prevError = void 0, this.unsubSrc = void 0, this.subscriptions = [], this.queue = [];
      }
      F.prototype.hasSubscribers = function() {
        return this.subscriptions.length > 0;
      }, F.prototype.removeSub = function(o) {
        return this.subscriptions = b.without(o, this.subscriptions), this.subscriptions;
      }, F.prototype.push = function(o) {
        return o.isEnd() && (this.ended = !0), x.inTransaction(o, this, this.pushIt, [o]);
      }, F.prototype.pushToSubscriptions = function(o) {
        try {
          for (var d = this.subscriptions, v = d.length, M = 0; M < v; M++) {
            var L = d[M], U = L.sink(o);
            (U === n.noMore || o.isEnd()) && this.removeSub(L);
          }
          return !0;
        } catch (q) {
          throw this.pushing = !1, this.queue = [], q;
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
        return this.ended ? (o(f()), i) : (m(o), d = {
          sink: o
        }, this.subscriptions.push(d), this.subscriptions.length === 1 && (this.unsubSrc = this._subscribe(this.handleEvent), m(this.unsubSrc)), /* @__PURE__ */ (function(v) {
          return function() {
            if (v.removeSub(d), !v.hasSubscribers())
              return v.unsubscribeFromSource();
          };
        })(this));
      }, n.Dispatcher = F;
      function $(o, d, v) {
        if (!(this instanceof $))
          return new $(o, d, v);
        b.isFunction(o) && (v = d, d = o, o = B.empty), D.call(this, o), m(d), this.dispatcher = new F(d, v), Pt(this);
      }
      T($, D), w($.prototype, {
        _isEventStream: !0,
        toProperty: function(o) {
          var d = arguments.length === 0 ? ce : Ne(function() {
            return o;
          }), v = this.dispatcher, M = new n.Desc(this, "toProperty", [o]);
          return new Oe(M, function(L) {
            var U = !1, q = !1, ie = i, oe = n.more, de = function() {
              if (!U)
                return d.forEach(function(be) {
                  if (U = !0, oe = L(new G(be)), oe === n.noMore)
                    return ie(), ie = i, i;
                });
            };
            return ie = v.subscribe(function(be) {
              if (be.hasValue())
                return be.isInitial() && !q ? (d = new ae(function() {
                  return be.value();
                }), n.more) : (be.isInitial() || de(), U = !0, d = new ae(be), L(be));
              if (be.isEnd() && (oe = de()), oe !== n.noMore)
                return L(be);
            }), q = !0, de(), ie;
          });
        },
        toEventStream: function() {
          return this;
        },
        withHandler: function(o) {
          return new $(new n.Desc(this, "withHandler", [o]), this.dispatcher.subscribe, o);
        }
      }), n.EventStream = $, n.never = function() {
        return new $(V(n, "never"), function(o) {
          return o(f()), i;
        });
      }, n.when = function() {
        if (arguments.length === 0)
          return n.never();
        var o = arguments.length, d = "when: expecting arguments in the form (Observable+,function)+";
        l(d, o % 2 === 0);
        for (var v = [], M = [], L = 0, U = []; L < o; ) {
          U[L] = arguments[L], U[L + 1] = arguments[L + 1];
          for (var q = b.toArray(arguments[L]), ie = fe(arguments[L + 1]), oe = { f: ie, ixs: [] }, de = !1, be = 0, xe; be < q.length; be++) {
            xe = q[be];
            var ve = b.indexOf(v, xe);
            de || (de = z.isTrigger(xe)), ve < 0 && (v.push(xe), ve = v.length - 1);
            for (var Le = 0, pe; Le < oe.ixs.length; Le++)
              pe = oe.ixs[Le], pe.index === ve && pe.count++;
            oe.ixs.push({ index: ve, count: 1 });
          }
          l("At least one EventStream required", de || !q.length), q.length > 0 && M.push(oe), L = L + 2;
        }
        if (!v.length)
          return n.never();
        v = b.map(z.fromObservable, v);
        var ye = b.any(v, function(me) {
          return me.flatten;
        }) && ee(b.map(function(me) {
          return me.obs;
        }, v)), Ie = new n.Desc(n, "when", U), Ue = new $(Ie, function(me) {
          var Se = [], Ee = !1, Fe = function(Pe) {
            for (var He = 0, Ge; He < Pe.ixs.length; He++)
              if (Ge = Pe.ixs[He], !v[Ge.index].hasAtLeast(Ge.count))
                return !1;
            return !0;
          }, qe = function(Pe) {
            return !Pe.sync || Pe.ended;
          }, rt = function(Pe) {
            for (var He = 0, Ge; He < Pe.ixs.length; He++)
              if (Ge = Pe.ixs[He], !v[Ge.index].mayHave(Ge.count))
                return !0;
          }, ht = function(Pe) {
            return !Pe.source.flatten;
          }, Hr = function(Pe) {
            return function(He) {
              var Ge = function() {
                return x.whenDoneWith(Ue, ms);
              }, _s = function() {
                if (Se.length > 0) {
                  for (var Xe = n.more, Hn = Se.pop(), Yr = 0, gn; Yr < M.length; Yr++)
                    if (gn = M[Yr], Fe(gn)) {
                      var bs = (function() {
                        for (var _n = [], mn = 0, bn; mn < gn.ixs.length; mn++)
                          bn = gn.ixs[mn], _n.push(v[bn.index].consume());
                        return _n;
                      })();
                      return Xe = me(Hn.e.apply(function() {
                        var _n, mn = (function() {
                          for (var bn = [], Gr = 0, vs; Gr < bs.length; Gr++)
                            vs = bs[Gr], bn.push(vs.value());
                          return bn;
                        })();
                        return (_n = gn).f.apply(_n, mn);
                      })), Se.length && (Se = b.filter(ht, Se)), Xe === n.noMore ? Xe : _s();
                    }
                } else
                  return n.more;
              }, ms = function() {
                var Xe = _s();
                return Ee && (b.all(v, qe) || b.all(M, rt)) && (Xe = n.noMore, me(f())), Xe === n.noMore && He(), Xe;
              };
              return Pe.subscribe(function(Xe) {
                if (Xe.isEnd())
                  Ee = !0, Pe.markEnded(), Ge();
                else if (Xe.isError())
                  var Hn = me(Xe);
                else
                  Pe.push(Xe), Pe.sync && (Se.push({ source: Pe, e: Xe }), ye || x.hasWaiters() ? Ge() : ms());
                return Hn === n.noMore && He(), Hn || n.more;
              });
            };
          };
          return new n.CompositeUnsubscribe((function() {
            for (var Pe = [], He = 0, Ge; He < v.length; He++)
              Ge = v[He], Pe.push(Hr(Ge));
            return Pe;
          })()).unsubscribe;
        });
        return Ue;
      };
      var ee = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? [] : arguments[1], v = function(M) {
          if (b.contains(d, M))
            return !0;
          var L = M.internalDeps();
          return L.length ? (d.push(M), b.any(L, v)) : (d.push(M), !1);
        };
        return b.any(o, v);
      }, fe = function(o) {
        return b.isFunction(o) ? o : b.always(o);
      };
      n.groupSimultaneous = function() {
        for (var o = arguments.length, d = Array(o), v = 0; v < o; v++)
          d[v] = arguments[v];
        d.length === 1 && g(d[0]) && (d = d[0]);
        var M = (function() {
          for (var L = [], U = 0, q; U < d.length; U++)
            q = d[U], L.push(new N(q));
          return L;
        })();
        return R(new n.Desc(n, "groupSimultaneous", d), n.when(M, function() {
          for (var L = arguments.length, U = Array(L), q = 0; q < L; q++)
            U[q] = arguments[q];
          return U;
        }));
      };
      function we(o, d, v) {
        F.call(this, d, v), this.property = o, this.subscribe = b.bind(this.subscribe, this), this.current = ce, this.currentValueRootId = void 0, this.propertyEnded = !1;
      }
      T(we, F), w(we.prototype, {
        push: function(o) {
          return o.isEnd() && (this.propertyEnded = !0), o.hasValue() && (this.current = new ae(o), this.currentValueRootId = x.currentEventId()), F.prototype.push.call(this, o);
        },
        maybeSubSource: function(o, d) {
          return d === n.noMore ? i : this.propertyEnded ? (o(f()), i) : F.prototype.subscribe.call(this, o);
        },
        subscribe: function(o) {
          var d = this, v = n.more;
          if (this.current.isDefined && (this.hasSubscribers() || this.propertyEnded)) {
            var M = x.currentEventId(), L = this.currentValueRootId;
            return !this.propertyEnded && L && M && M !== L ? (x.whenDoneWith(this.property, function() {
              if (d.currentValueRootId === L)
                return o(Ce(d.current.get().value()));
            }), this.maybeSubSource(o, v)) : (x.inTransaction(void 0, this, function() {
              return v = o(Ce(this.current.get().value())), v;
            }, []), this.maybeSubSource(o, v));
          } else
            return this.maybeSubSource(o, v);
        }
      });
      function Oe(o, d, v) {
        D.call(this, o), m(d), this.dispatcher = new we(this, d, v), Pt(this);
      }
      T(Oe, D), w(Oe.prototype, {
        _isProperty: !0,
        changes: function() {
          var o = this;
          return new $(new n.Desc(this, "changes", []), function(d) {
            return o.dispatcher.subscribe(function(v) {
              if (!v.isInitial())
                return d(v);
            });
          });
        },
        withHandler: function(o) {
          return new Oe(new n.Desc(this, "withHandler", [o]), this.dispatcher.subscribe, o);
        },
        toProperty: function() {
          return c(arguments), this;
        },
        toEventStream: function() {
          var o = this;
          return new $(new n.Desc(this, "toEventStream", []), function(d) {
            return o.dispatcher.subscribe(function(v) {
              return v.isInitial() && (v = v.toNext()), d(v);
            });
          });
        }
      }), n.Property = Oe, n.constant = function(o) {
        return new Oe(new n.Desc(n, "constant", [o]), function(d) {
          return d(Ce(o)), d(f()), i;
        });
      }, n.fromBinder = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? b.id : arguments[1], v = new n.Desc(n, "fromBinder", [o, d]);
        return new $(v, function(M) {
          var L = !1, U = !1, q = function() {
            if (!L)
              return typeof ie < "u" && ie !== null ? (ie(), L = !0) : U = !0;
          }, ie = o(function() {
            for (var oe, de = arguments.length, be = Array(de), xe = 0; xe < de; xe++)
              be[xe] = arguments[xe];
            var ve = d.apply(this, be);
            g(ve) && ((oe = b.last(ve)) != null && oe._isEvent) || (ve = [ve]);
            for (var Le = n.more, pe = 0, ye; pe < ve.length; pe++)
              if (ye = ve[pe], Le = M(ye = y(ye)), Le === n.noMore || ye.isEnd())
                return q(), Le;
            return Le;
          });
          return U && q(), q;
        });
      }, n.Observable.prototype.map = function(o) {
        for (var d = arguments.length, v = Array(d > 1 ? d - 1 : 0), M = 1; M < d; M++)
          v[M - 1] = arguments[M];
        return J(this, o, v, function(L) {
          return R(new n.Desc(this, "map", [L]), this.withHandler(function(U) {
            return this.push(U.fmap(L));
          }));
        });
      };
      var Re = function(o) {
        return g(o[0]) ? o[0] : Array.prototype.slice.call(o);
      }, dn = function(o) {
        return b.isFunction(o[0]) ? [Re(Array.prototype.slice.call(o, 1)), o[0]] : [Re(Array.prototype.slice.call(o, 0, o.length - 1)), b.last(o)];
      };
      n.combineAsArray = function() {
        var o = Re(arguments);
        if (o.length) {
          for (var d = [], v = 0; v < o.length; v++) {
            var M = _(o[v]) ? o[v] : n.constant(o[v]);
            d.push(new z(M, !0));
          }
          return R(new n.Desc(n, "combineAsArray", o), n.when(d, function() {
            for (var L = arguments.length, U = Array(L), q = 0; q < L; q++)
              U[q] = arguments[q];
            return U;
          }).toProperty());
        } else
          return n.constant([]);
      }, n.onValues = function() {
        return n.combineAsArray(Array.prototype.slice.call(arguments, 0, arguments.length - 1)).onValues(arguments[arguments.length - 1]);
      }, n.combineWith = function() {
        var o = dn(arguments), d = o[0], v = o[1], M = new n.Desc(n, "combineWith", [v].concat(d));
        return R(M, n.combineAsArray(d).map(function(L) {
          return v.apply(void 0, L);
        }));
      }, n.Observable.prototype.combine = function(o, d) {
        var v = re(d), M = new n.Desc(this, "combine", [o, d]);
        return R(M, n.combineAsArray(this, o).map(function(L) {
          return v(L[0], L[1]);
        }));
      }, n.Observable.prototype.withStateMachine = function(o, d) {
        var v = o, M = new n.Desc(this, "withStateMachine", [o, d]);
        return R(M, this.withHandler(function(L) {
          var U = d(v, L), q = U[0], ie = U[1];
          v = q;
          for (var oe = n.more, de = 0, be; de < ie.length; de++)
            if (be = ie[de], oe = this.push(be), oe === n.noMore)
              return oe;
          return oe;
        }));
      };
      var $n = function(o, d) {
        return o === d;
      }, bl = function(o) {
        return typeof o < "u" && o !== null ? o._isNone : !1;
      };
      n.Observable.prototype.skipDuplicates = function() {
        var o = arguments.length <= 0 || arguments[0] === void 0 ? $n : arguments[0], d = new n.Desc(this, "skipDuplicates", []);
        return R(d, this.withStateMachine(ce, function(v, M) {
          return M.hasValue() ? M.isInitial() || bl(v) || !o(v.get(), M.value()) ? [new ae(M.value()), [M]] : [v, []] : [v, [M]];
        }));
      }, n.Observable.prototype.awaiting = function(o) {
        var d = new n.Desc(this, "awaiting", [o]);
        return R(d, n.groupSimultaneous(this, o).map(function(v) {
          return v[1].length === 0;
        }).toProperty(!1).skipDuplicates());
      }, n.Observable.prototype.not = function() {
        return R(new n.Desc(this, "not", []), this.map(function(o) {
          return !o;
        }));
      }, n.Property.prototype.and = function(o) {
        return R(new n.Desc(this, "and", [o]), this.combine(o, function(d, v) {
          return d && v;
        }));
      }, n.Property.prototype.or = function(o) {
        return R(new n.Desc(this, "or", [o]), this.combine(o, function(d, v) {
          return d || v;
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
        return R(new n.Desc(this, "bufferWithTime", [o]), this.bufferWithTimeOrCount(o, Number.MAX_VALUE));
      }, n.EventStream.prototype.bufferWithCount = function(o) {
        return R(new n.Desc(this, "bufferWithCount", [o]), this.bufferWithTimeOrCount(void 0, o));
      }, n.EventStream.prototype.bufferWithTimeOrCount = function(o, d) {
        var v = function(L) {
          if (L.values.length === d)
            return L.flush();
          if (o !== void 0)
            return L.schedule();
        }, M = new n.Desc(this, "bufferWithTimeOrCount", [o, d]);
        return R(M, this.buffer(o, v, v));
      }, n.EventStream.prototype.buffer = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? i : arguments[1], v = arguments.length <= 2 || arguments[2] === void 0 ? i : arguments[2], M = {
          scheduled: null,
          end: void 0,
          values: [],
          flush: function() {
            if (this.scheduled && (n.scheduler.clearTimeout(this.scheduled), this.scheduled = null), this.values.length > 0) {
              var q = this.values;
              this.values = [];
              var ie = this.push(Ae(q));
              if (this.end != null)
                return this.push(this.end);
              if (ie !== n.noMore)
                return v(this);
            } else if (this.end != null)
              return this.push(this.end);
          },
          schedule: function() {
            var q = this;
            if (!this.scheduled)
              return this.scheduled = o(function() {
                return q.flush();
              });
          }
        }, L = n.more;
        if (!b.isFunction(o)) {
          var U = o;
          o = function(q) {
            return n.scheduler.setTimeout(q, U);
          };
        }
        return R(new n.Desc(this, "buffer", []), this.withHandler(function(q) {
          var ie = this;
          return M.push = function(oe) {
            return ie.push(oe);
          }, q.isError() ? L = this.push(q) : q.isEnd() ? (M.end = q, M.scheduled || M.flush()) : (M.values.push(q.value()), d(M)), L;
        }));
      }, n.Observable.prototype.filter = function(o) {
        u(o);
        for (var d = arguments.length, v = Array(d > 1 ? d - 1 : 0), M = 1; M < d; M++)
          v[M - 1] = arguments[M];
        return J(this, o, v, function(L) {
          return R(new n.Desc(this, "filter", [L]), this.withHandler(function(U) {
            return U.filter(L) ? this.push(U) : n.more;
          }));
        });
      }, n.once = function(o) {
        return new $(new B(n, "once", [o]), function(d) {
          return d(y(o)), d(f()), i;
        });
      }, n.EventStream.prototype.concat = function(o) {
        var d = this;
        return new $(new n.Desc(d, "concat", [o]), function(v) {
          var M = i, L = d.dispatcher.subscribe(function(U) {
            return U.isEnd() ? (M = o.toEventStream().dispatcher.subscribe(v), M) : v(U);
          });
          return function() {
            return L(), M();
          };
        });
      }, n.Property.prototype.concat = function(o) {
        return Ur(this, this.changes().concat(o));
      }, n.concatAll = function() {
        var o = Re(arguments);
        return o.length ? R(new n.Desc(n, "concatAll", o), b.fold(b.tail(o), b.head(o).toEventStream(), function(d, v) {
          return d.concat(v);
        })) : n.never();
      };
      var Ur = function(o, d) {
        var v = new $(V(o, "justInitValue"), function(M) {
          var L = void 0, U = o.dispatcher.subscribe(function(q) {
            return q.isEnd() || (L = q), n.noMore;
          });
          return x.whenDoneWith(v, function() {
            return typeof L < "u" && L !== null && M(L), M(f());
          }), U;
        });
        return v.concat(d).toProperty();
      };
      n.Observable.prototype.flatMap = function() {
        return $r(this, qn(arguments));
      }, n.Observable.prototype.flatMapFirst = function() {
        return $r(this, qn(arguments), !0);
      };
      var qn = function(o) {
        return o.length === 1 && _(o[0]) ? b.always(o[0]) : W(o);
      }, Wr = function(o) {
        return _(o) ? o : n.once(o);
      }, $r = function(o, d, v, M) {
        var L = [o], U = [], q = new n.Desc(o, "flatMap" + (v ? "First" : ""), [d]), ie = new $(q, function(oe) {
          var de = new P(), be = [], xe = function(pe) {
            var ye = Wr(d(pe.value()));
            return U.push(ye), de.add(function(Ie, Ue) {
              return ye.dispatcher.subscribe(function(me) {
                if (me.isEnd())
                  return b.remove(ye, U), ve(), Le(Ue), n.noMore;
                typeof me < "u" && me !== null && me._isInitial && (me = me.toNext());
                var Se = oe(me);
                return Se === n.noMore && Ie(), Se;
              });
            });
          }, ve = function() {
            var pe = be.shift();
            if (pe)
              return xe(pe);
          }, Le = function(pe) {
            if (pe(), de.empty())
              return oe(f());
          };
          return de.add(function(pe, ye) {
            return o.dispatcher.subscribe(function(Ie) {
              return Ie.isEnd() ? Le(ye) : Ie.isError() ? oe(Ie) : v && de.count() > 1 ? n.more : de.unsubscribed ? n.noMore : M && de.count() > M ? be.push(Ie) : xe(Ie);
            });
          }), de.unsubscribe;
        });
        return ie.internalDeps = function() {
          return U.length ? L.concat(U) : L;
        }, ie;
      };
      n.Observable.prototype.flatMapWithConcurrencyLimit = function(o) {
        for (var d = arguments.length, v = Array(d > 1 ? d - 1 : 0), M = 1; M < d; M++)
          v[M - 1] = arguments[M];
        var L = new n.Desc(this, "flatMapWithConcurrencyLimit", [o].concat(v));
        return R(L, $r(this, qn(v), !1, o));
      }, n.Observable.prototype.flatMapConcat = function() {
        var o = new n.Desc(this, "flatMapConcat", Array.prototype.slice.call(arguments, 0));
        return R(o, this.flatMapWithConcurrencyLimit.apply(this, [1].concat(e.call(arguments))));
      }, n.later = function(o, d) {
        return R(new n.Desc(n, "later", [o, d]), n.fromBinder(function(v) {
          var M = function() {
            return v([d, f()]);
          }, L = n.scheduler.setTimeout(M, o);
          return function() {
            return n.scheduler.clearTimeout(L);
          };
        }));
      }, n.Observable.prototype.bufferingThrottle = function(o) {
        var d = new n.Desc(this, "bufferingThrottle", [o]);
        return R(d, this.flatMapConcat(function(v) {
          return n.once(v).concat(n.later(o).filter(!1));
        }));
      }, n.Property.prototype.bufferingThrottle = function() {
        return n.Observable.prototype.bufferingThrottle.apply(this, arguments).toProperty();
      };
      function pn() {
        if (!(this instanceof pn))
          return new pn();
        this.unsubAll = b.bind(this.unsubAll, this), this.subscribeAll = b.bind(this.subscribeAll, this), this.guardedSink = b.bind(this.guardedSink, this), this.sink = void 0, this.subscriptions = [], this.ended = !1, $.call(this, new n.Desc(n, "Bus", []), this.subscribeAll);
      }
      T(pn, $), w(pn.prototype, {
        unsubAll: function() {
          for (var o = this.subscriptions, d = 0, v; d < o.length; d++)
            v = o[d], typeof v.unsub == "function" && v.unsub();
        },
        subscribeAll: function(o) {
          if (this.ended)
            o(f());
          else {
            this.sink = o;
            for (var d = a(this.subscriptions), v = 0, M; v < d.length; v++)
              M = d[v], this.subscribeInput(M);
          }
          return this.unsubAll;
        },
        guardedSink: function(o) {
          var d = this;
          return function(v) {
            return v.isEnd() ? (d.unsubscribeInput(o), n.noMore) : d.sink(v);
          };
        },
        subscribeInput: function(o) {
          return o.unsub = o.input.dispatcher.subscribe(this.guardedSink(o.input)), o.unsub;
        },
        unsubscribeInput: function(o) {
          for (var d = this.subscriptions, v = 0, M; v < d.length; v++)
            if (M = d[v], M.input === o) {
              typeof M.unsub == "function" && M.unsub(), this.subscriptions.splice(v, 1);
              return;
            }
        },
        plug: function(o) {
          var d = this;
          if (p(o), !this.ended) {
            var v = { input: o };
            return this.subscriptions.push(v), typeof this.sink < "u" && this.subscribeInput(v), function() {
              return d.unsubscribeInput(o);
            };
          }
        },
        end: function() {
          if (this.ended = !0, this.unsubAll(), typeof this.sink == "function")
            return this.sink(f());
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
              return this.sink(Ae(o));
            } finally {
              if (d && this.pushQueue) {
                for (var v = 0; v < this.pushQueue.length; ) {
                  var o = this.pushQueue[v];
                  this.sink(Ae(o)), v++;
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
      }), n.Bus = pn;
      var gs = function(o, d) {
        return O(function(v) {
          for (var M = Y(d, [function(ie, oe) {
            return v.apply(void 0, ie.concat([oe]));
          }]), L = arguments.length, U = Array(L > 1 ? L - 1 : 0), q = 1; q < L; q++)
            U[q - 1] = arguments[q];
          return R(new n.Desc(n, o, [v].concat(U)), n.combineAsArray(U).flatMap(M));
        });
      };
      n.fromCallback = gs("fromCallback", function(o) {
        for (var d = arguments.length, v = Array(d > 1 ? d - 1 : 0), M = 1; M < d; M++)
          v[M - 1] = arguments[M];
        return n.fromBinder(function(L) {
          return ue(o, v)(L), i;
        }, function(L) {
          return [L, f()];
        });
      }), n.fromNodeCallback = gs("fromNodeCallback", function(o) {
        for (var d = arguments.length, v = Array(d > 1 ? d - 1 : 0), M = 1; M < d; M++)
          v[M - 1] = arguments[M];
        return n.fromBinder(function(L) {
          return ue(o, v)(L), i;
        }, function(L, U) {
          return L ? [new _e(L), f()] : [U, f()];
        });
      }), n.combineTemplate = function(o) {
        function d(pe) {
          return pe[pe.length - 1];
        }
        function v(pe, ye, Ie) {
          return d(pe)[ye] = Ie, Ie;
        }
        function M(pe, ye) {
          return function(Ie, Ue) {
            v(Ie, pe, Ue[ye]);
          };
        }
        function L(pe, ye) {
          return function(Ie) {
            v(Ie, pe, ye);
          };
        }
        function U(pe) {
          return g(pe) ? [] : {};
        }
        function q(pe, ye) {
          return function(Ie) {
            var Ue = U(ye);
            v(Ie, pe, Ue), Ie.push(Ue);
          };
        }
        function ie(pe) {
          if (_(pe))
            return !0;
          if (pe && (pe.constructor == Object || pe.constructor == Array)) {
            for (var ye in pe)
              if (Object.prototype.hasOwnProperty.call(pe, ye)) {
                var Ie = pe[ye];
                if (ie(Ie)) return !0;
              }
          }
        }
        function oe(pe, ye) {
          if (_(ye))
            ve.push(ye), xe.push(M(pe, ve.length - 1));
          else if (ie(ye)) {
            var Ie = function(Ue) {
              Ue.pop();
            };
            xe.push(q(pe, ye)), be(ye), xe.push(Ie);
          } else
            xe.push(L(pe, ye));
        }
        function de(pe) {
          for (var ye = U(o), Ie = [ye], Ue = 0, me; Ue < xe.length; Ue++)
            me = xe[Ue], me(Ie, pe);
          return ye;
        }
        function be(pe) {
          b.each(pe, oe);
        }
        var xe = [], ve = [], Le = ie(o) ? (be(o), n.combineAsArray(ve).map(de)) : n.constant(o);
        return R(new n.Desc(n, "combineTemplate", [o]), Le);
      }, n.Observable.prototype.mapEnd = function() {
        var o = W(arguments);
        return R(new n.Desc(this, "mapEnd", [o]), this.withHandler(function(d) {
          return d.isEnd() ? (this.push(Ae(o(d))), this.push(f()), n.noMore) : this.push(d);
        }));
      }, n.Observable.prototype.skipErrors = function() {
        return R(new n.Desc(this, "skipErrors", []), this.withHandler(function(o) {
          return o.isError() ? n.more : this.push(o);
        }));
      }, n.EventStream.prototype.takeUntil = function(o) {
        var d = {};
        return R(new n.Desc(this, "takeUntil", [o]), n.groupSimultaneous(this.mapEnd(d), o.skipErrors()).withHandler(function(v) {
          if (v.hasValue()) {
            var M = v.value(), L = M[0], U = M[1];
            if (U.length)
              return this.push(f());
            for (var q = n.more, ie = 0, oe; ie < L.length; ie++)
              oe = L[ie], oe === d ? q = this.push(f()) : q = this.push(Ae(oe));
            return q;
          } else
            return this.push(v);
        }));
      }, n.Property.prototype.takeUntil = function(o) {
        var d = this.changes().takeUntil(o);
        return R(new n.Desc(this, "takeUntil", [o]), Ur(this, d));
      }, n.Observable.prototype.flatMapLatest = function() {
        var o = qn(arguments), d = this.toEventStream();
        return R(new n.Desc(this, "flatMapLatest", [o]), d.flatMap(function(v) {
          return Wr(o(v)).takeUntil(d);
        }));
      }, n.Property.prototype.delayChanges = function(o, d) {
        return R(o, Ur(this, d(this.changes())));
      }, n.EventStream.prototype.delayChanges = function(o, d) {
        return R(o, d(this));
      }, n.Observable.prototype.delay = function(o) {
        return this.delayChanges(new n.Desc(this, "delay", [o]), function(d) {
          return d.flatMap(function(v) {
            return n.later(o, v);
          });
        });
      }, n.Observable.prototype.debounce = function(o) {
        return this.delayChanges(new n.Desc(this, "debounce", [o]), function(d) {
          return d.flatMapLatest(function(v) {
            return n.later(o, v);
          });
        });
      }, n.Observable.prototype.debounceImmediate = function(o) {
        return this.delayChanges(new n.Desc(this, "debounceImmediate", [o]), function(d) {
          return d.flatMapFirst(function(v) {
            return n.once(v).concat(n.later(o).filter(!1));
          });
        });
      }, n.Observable.prototype.decode = function(o) {
        return R(new n.Desc(this, "decode", [o]), this.combine(n.combineTemplate(o), function(d, v) {
          return v[d];
        }));
      }, n.Observable.prototype.scan = function(o, d) {
        var v = this, M;
        d = re(d);
        var L = Ne(o), U = !1, q = function(ie) {
          var oe = !1, de = i, be = n.more, xe = function() {
            if (!oe)
              return L.forEach(function(ve) {
                if (oe = U = !0, be = ie(new G(function() {
                  return ve;
                })), be === n.noMore)
                  return de(), de = i, de;
              });
          };
          return de = v.dispatcher.subscribe(function(ve) {
            if (ve.hasValue()) {
              if (U && ve.isInitial())
                return n.more;
              ve.isInitial() || xe(), oe = U = !0;
              var Le = L.getOrElse(void 0), pe = d(Le, ve.value());
              return L = new ae(pe), ie(ve.apply(function() {
                return pe;
              }));
            } else if (ve.isEnd() && (be = xe()), be !== n.noMore)
              return ie(ve);
          }), x.whenDoneWith(M, xe), de;
        };
        return M = new Oe(new n.Desc(this, "scan", [o, d]), q), M;
      }, n.Observable.prototype.diff = function(o, d) {
        return d = re(d), R(new n.Desc(this, "diff", [o, d]), this.scan([o], function(v, M) {
          return [M, d(v[0], M)];
        }).filter(function(v) {
          return v.length === 2;
        }).map(function(v) {
          return v[1];
        }));
      }, n.Observable.prototype.doAction = function() {
        var o = W(arguments);
        return R(new n.Desc(this, "doAction", [o]), this.withHandler(function(d) {
          return d.hasValue() && o(d.value()), this.push(d);
        }));
      }, n.Observable.prototype.doEnd = function() {
        var o = W(arguments);
        return R(new n.Desc(this, "doEnd", [o]), this.withHandler(function(d) {
          return d.isEnd() && o(), this.push(d);
        }));
      }, n.Observable.prototype.doError = function() {
        var o = W(arguments);
        return R(new n.Desc(this, "doError", [o]), this.withHandler(function(d) {
          return d.isError() && o(d.error), this.push(d);
        }));
      }, n.Observable.prototype.doLog = function() {
        for (var o = arguments.length, d = Array(o), v = 0; v < o; v++)
          d[v] = arguments[v];
        return R(new n.Desc(this, "doLog", d), this.withHandler(function(M) {
          return typeof console < "u" && console !== null && typeof console.log == "function" && console.log.apply(console, d.concat([M.log()])), this.push(M);
        }));
      }, n.Observable.prototype.endOnError = function(o) {
        typeof o < "u" && o !== null || (o = !0);
        for (var d = arguments.length, v = Array(d > 1 ? d - 1 : 0), M = 1; M < d; M++)
          v[M - 1] = arguments[M];
        return J(this, o, v, function(L) {
          return R(new n.Desc(this, "endOnError", []), this.withHandler(function(U) {
            return U.isError() && L(U.error) ? (this.push(U), this.push(f())) : this.push(U);
          }));
        });
      }, D.prototype.errors = function() {
        return R(new n.Desc(this, "errors", []), this.filter(function() {
          return !1;
        }));
      }, n.Observable.prototype.take = function(o) {
        return o <= 0 ? n.never() : R(new n.Desc(this, "take", [o]), this.withHandler(function(d) {
          return d.hasValue() ? (o--, o > 0 ? this.push(d) : (o === 0 && this.push(d), this.push(f()), n.noMore)) : this.push(d);
        }));
      }, n.Observable.prototype.first = function() {
        return R(new n.Desc(this, "first", []), this.take(1));
      }, n.Observable.prototype.mapError = function() {
        var o = W(arguments);
        return R(new n.Desc(this, "mapError", [o]), this.withHandler(function(d) {
          return d.isError() ? this.push(Ae(o(d.error))) : this.push(d);
        }));
      }, n.Observable.prototype.flatMapError = function(o) {
        var d = new n.Desc(this, "flatMapError", [o]);
        return R(d, this.mapError(function(v) {
          return new _e(v);
        }).flatMap(function(v) {
          return v instanceof _e ? o(v.error) : n.once(v);
        }));
      }, n.EventStream.prototype.flatScan = function(o, d) {
        var v = o;
        return this.flatMapConcat(function(M) {
          return Wr(d(v, M)).doAction(function(L) {
            return v = L;
          });
        }).toProperty(o);
      }, n.EventStream.prototype.sampledBy = function(o, d) {
        return R(new n.Desc(this, "sampledBy", [o, d]), this.toProperty().sampledBy(o, d));
      }, n.Property.prototype.sampledBy = function(o, d) {
        var v = !1;
        typeof d < "u" && d !== null ? d = re(d) : (v = !0, d = function(ie) {
          return ie.value();
        });
        var M = new z(this, !1, v), L = new z(o, !0, v), U = n.when([M, L], d), q = o._isProperty ? U.toProperty() : U;
        return R(new n.Desc(this, "sampledBy", [o, d]), q);
      }, n.Property.prototype.sample = function(o) {
        return R(new n.Desc(this, "sample", [o]), this.sampledBy(n.interval(o, {})));
      }, n.Observable.prototype.map = function(o) {
        if (o && o._isProperty)
          return o.sampledBy(this, s);
        for (var d = arguments.length, v = Array(d > 1 ? d - 1 : 0), M = 1; M < d; M++)
          v[M - 1] = arguments[M];
        return J(this, o, v, function(L) {
          return R(new n.Desc(this, "map", [L]), this.withHandler(function(U) {
            return this.push(U.fmap(L));
          }));
        });
      }, n.Observable.prototype.fold = function(o, d) {
        return R(new n.Desc(this, "fold", [o, d]), this.scan(o, d).sampledBy(this.filter(!1).mapEnd().toProperty()));
      }, D.prototype.reduce = D.prototype.fold;
      var Vn = [["addEventListener", "removeEventListener"], ["addListener", "removeListener"], ["on", "off"], ["bind", "unbind"]], vl = function(o) {
        for (var d, v = 0; v < Vn.length; v++) {
          d = Vn[v];
          var M = [o[d[0]], o[d[1]]];
          if (M[0] && M[1])
            return M;
        }
        for (var L = 0; L < Vn.length; L++) {
          d = Vn[L];
          var U = o[d[0]];
          if (U)
            return [U, function() {
            }];
        }
        throw new _e("No suitable event methods in " + o);
      };
      n.fromEventTarget = function(o, d, v) {
        var M = vl(o), L = M[0], U = M[1], q = new n.Desc(n, "fromEvent", [o, d]);
        return R(q, n.fromBinder(function(ie) {
          return L.call(o, d, ie), function() {
            return U.call(o, d, ie);
          };
        }, v));
      }, n.fromEvent = n.fromEventTarget, n.fromPoll = function(o, d) {
        var v = new n.Desc(n, "fromPoll", [o, d]);
        return R(v, n.fromBinder(function(M) {
          var L = n.scheduler.setInterval(M, o);
          return function() {
            return n.scheduler.clearInterval(L);
          };
        }, d));
      };
      function yl(o) {
        return [o, f()];
      }
      n.fromPromise = function(o, d) {
        var v = arguments.length <= 2 || arguments[2] === void 0 ? yl : arguments[2];
        return R(new n.Desc(n, "fromPromise", [o]), n.fromBinder(function(M) {
          var L = o.then(M, function(U) {
            return M(new _e(U));
          });
          return L && typeof L.done == "function" && L.done(), d ? function() {
            if (typeof o.abort == "function")
              return o.abort();
          } : function() {
          };
        }, v));
      }, n.Observable.prototype.groupBy = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? n._.id : arguments[1], v = {}, M = this;
        return M.filter(function(L) {
          return !v[o(L)];
        }).map(function(L) {
          var U = o(L), q = M.filter(function(de) {
            return o(de) === U;
          }), ie = n.once(L).concat(q), oe = d(ie, L).withHandler(function(de) {
            if (this.push(de), de.isEnd())
              return delete v[U];
          });
          return v[U] = oe, oe;
        });
      }, n.fromArray = function(o) {
        if (E(o), o.length) {
          var d = 0, v = new $(new n.Desc(n, "fromArray", [o]), function(M) {
            var L = !1, U = n.more, q = !1, ie = !1;
            function oe() {
              if (ie = !0, !q) {
                for (q = !0; ie; )
                  if (ie = !1, U !== n.noMore && !L) {
                    var de = o[d++];
                    U = M(y(de)), U !== n.noMore && (d === o.length ? M(f()) : x.afterTransaction(v, oe));
                  }
                return q = !1, q;
              }
            }
            return oe(), function() {
              return L = !0, L;
            };
          });
          return v;
        } else
          return R(new n.Desc(n, "fromArray", o), n.never());
      }, n.EventStream.prototype.holdWhen = function(o) {
        var d = !1, v = [], M = this, L = !1;
        return new $(new n.Desc(this, "holdWhen", [o]), function(U) {
          var q = new P(), ie = !1, oe = function(de) {
            if (typeof de == "function" && de(), q.empty() && ie)
              return U(f());
          };
          return q.add(function(de, be) {
            return o.subscribeInternal(function(xe) {
              if (xe.hasValue()) {
                if (d = xe.value(), !d) {
                  var ve = v;
                  return v = [], (function() {
                    for (var Le = [], pe = 0, ye; pe < ve.length; pe++)
                      ye = ve[pe], Le.push(U(Ae(ye)));
                    return L && (Le.push(U(f())), be()), Le;
                  })();
                }
              } else return xe.isEnd() ? oe(be) : U(xe);
            });
          }), q.add(function(de, be) {
            return M.subscribeInternal(function(xe) {
              return d && xe.hasValue() ? v.push(xe.value()) : xe.isEnd() && v.length ? (L = !0, oe(be)) : U(xe);
            });
          }), ie = !0, oe(), q.unsubscribe;
        });
      }, n.interval = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1];
        return R(new n.Desc(n, "interval", [o, d]), n.fromPoll(o, function() {
          return Ae(d);
        }));
      }, n.$ = {}, n.$.asEventStream = function(o, d, v) {
        var M = this;
        return b.isFunction(d) && (v = d, d = void 0), R(new n.Desc(this.selector || this, "asEventStream", [o]), n.fromBinder(function(L) {
          return M.on(o, d, L), function() {
            return M.off(o, d, L);
          };
        }, v));
      }, typeof jQuery < "u" && jQuery && (jQuery.fn.asEventStream = n.$.asEventStream), typeof Zepto < "u" && Zepto && (Zepto.fn.asEventStream = n.$.asEventStream), n.Observable.prototype.last = function() {
        var o;
        return R(new n.Desc(this, "last", []), this.withHandler(function(d) {
          if (d.isEnd())
            return o && this.push(o), this.push(f()), n.noMore;
          o = d;
        }));
      }, n.Observable.prototype.log = function() {
        for (var o = arguments.length, d = Array(o), v = 0; v < o; v++)
          d[v] = arguments[v];
        return this.subscribe(function(M) {
          typeof console < "u" && typeof console.log == "function" && console.log.apply(console, d.concat([M.log()]));
        }), this;
      }, n.EventStream.prototype.merge = function(o) {
        h(o);
        var d = this;
        return R(new n.Desc(d, "merge", [o]), n.mergeAll(this, o));
      }, n.mergeAll = function() {
        var o = Re(arguments);
        return o.length ? new $(new n.Desc(n, "mergeAll", o), function(d) {
          var v = 0, M = function(U) {
            return function(q) {
              return U.dispatcher.subscribe(function(ie) {
                if (ie.isEnd())
                  return v++, v === o.length ? d(f()) : n.more;
                var oe = d(ie);
                return oe === n.noMore && q(), oe;
              });
            };
          }, L = b.map(M, o);
          return new n.CompositeUnsubscribe(L).unsubscribe;
        }) : n.never();
      }, n.repeatedly = function(o, d) {
        var v = 0;
        return R(new n.Desc(n, "repeatedly", [o, d]), n.fromPoll(o, function() {
          return d[v++ % d.length];
        }));
      }, n.repeat = function(o) {
        var d = 0;
        return n.fromBinder(function(v) {
          var M = !1, L = n.more, U = function() {
          };
          function q(oe) {
            return oe.isEnd() ? M ? ie() : M = !0 : L = v(oe);
          }
          function ie() {
            var oe;
            for (M = !0; M && L !== n.noMore; )
              oe = o(d++), M = !1, oe ? U = oe.subscribeInternal(q) : v(f());
            return M = !0;
          }
          return ie(), function() {
            return U();
          };
        });
      }, n.retry = function(o) {
        if (!b.isFunction(o.source))
          throw new r("'source' option has to be a function");
        var d = o.source, v = o.retries || 0, M = 0, L = o.delay || function() {
          return 0;
        }, U = o.isRetryable || function() {
          return !0;
        }, q = !1, ie = null;
        return R(new n.Desc(n, "retry", [o]), n.repeat(function(oe) {
          function de() {
            return d(oe).endOnError().withHandler(function(ve) {
              if (ve.isError()) {
                if (ie = ve, !(U(ie.error) && (v === 0 || M < v)))
                  return q = !0, this.push(ve);
              } else
                return ve.hasValue() && (ie = null, q = !0), this.push(ve);
            });
          }
          if (q)
            return null;
          if (ie) {
            var be = {
              error: ie.error,
              retriesDone: M
            }, xe = n.later(L(be)).filter(!1);
            return M++, xe.concat(n.once().flatMap(de));
          } else
            return de();
        }));
      }, n.sequentially = function(o, d) {
        var v = 0;
        return R(new n.Desc(n, "sequentially", [o, d]), n.fromPoll(o, function() {
          var M = d[v++];
          return v < d.length ? M : v === d.length ? [M, f()] : f();
        }));
      }, n.Observable.prototype.skip = function(o) {
        return R(new n.Desc(this, "skip", [o]), this.withHandler(function(d) {
          return d.hasValue() ? o > 0 ? (o--, n.more) : this.push(d) : this.push(d);
        }));
      }, n.EventStream.prototype.skipUntil = function(o) {
        var d = o.take(1).map(!0).toProperty(!1);
        return R(new n.Desc(this, "skipUntil", [o]), this.filter(d));
      }, n.EventStream.prototype.skipWhile = function(o) {
        u(o);
        for (var d = !1, v = arguments.length, M = Array(v > 1 ? v - 1 : 0), L = 1; L < v; L++)
          M[L - 1] = arguments[L];
        return J(this, o, M, function(U) {
          return R(new n.Desc(this, "skipWhile", [U]), this.withHandler(function(q) {
            return d || !q.hasValue() || !U(q.value()) ? (q.hasValue() && (d = !0), this.push(q)) : n.more;
          }));
        });
      }, n.Observable.prototype.slidingWindow = function(o) {
        var d = arguments.length <= 1 || arguments[1] === void 0 ? 0 : arguments[1];
        return R(new n.Desc(this, "slidingWindow", [o, d]), this.scan([], function(v, M) {
          return v.concat([M]).slice(-o);
        }).filter(function(v) {
          return v.length >= d;
        }));
      };
      var qr = [], Pt = function(o) {
        if (qr.length && !Pt.running)
          try {
            Pt.running = !0, qr.forEach(function(d) {
              d(o);
            });
          } finally {
            delete Pt.running;
          }
      };
      n.spy = function(o) {
        return qr.push(o);
      }, n.Property.prototype.startWith = function(o) {
        return R(new n.Desc(this, "startWith", [o]), this.scan(o, function(d, v) {
          return v;
        }));
      }, n.EventStream.prototype.startWith = function(o) {
        return R(new n.Desc(this, "startWith", [o]), n.once(o).concat(this));
      }, n.Observable.prototype.takeWhile = function(o) {
        u(o);
        for (var d = arguments.length, v = Array(d > 1 ? d - 1 : 0), M = 1; M < d; M++)
          v[M - 1] = arguments[M];
        return J(this, o, v, function(L) {
          return R(new n.Desc(this, "takeWhile", [L]), this.withHandler(function(U) {
            return U.filter(L) ? this.push(U) : (this.push(f()), n.noMore);
          }));
        });
      }, n.Observable.prototype.throttle = function(o) {
        return this.delayChanges(new n.Desc(this, "throttle", [o]), function(d) {
          return d.bufferWithTime(o).map(function(v) {
            return v[v.length - 1];
          });
        });
      }, D.prototype.firstToPromise = function(o) {
        var d = this;
        if (typeof o != "function")
          if (typeof Promise == "function")
            o = Promise;
          else
            throw new r("There isn't default Promise, use shim or parameter");
        return new o(function(v, M) {
          return d.subscribe(function(L) {
            return L.hasValue() && v(L.value()), L.isError() && M(L.error), n.noMore;
          });
        });
      }, D.prototype.toPromise = function(o) {
        return this.last().firstToPromise(o);
      }, n.try = function(o) {
        return function(d) {
          try {
            return n.once(o(d));
          } catch (v) {
            return new n.Error(v);
          }
        };
      }, n.update = function(o) {
        function d(q) {
          return function() {
            for (var ie = arguments.length, oe = Array(ie), de = 0; de < ie; de++)
              oe[de] = arguments[de];
            return function(be) {
              return q.apply(void 0, [be].concat(oe));
            };
          };
        }
        for (var v = arguments.length, M = Array(v > 1 ? v - 1 : 0), L = 1; L < v; L++)
          M[L - 1] = arguments[L];
        for (var U = M.length - 1; U > 0; )
          M[U] instanceof Function || (M[U] = b.always(M[U])), M[U] = d(M[U]), U = U - 2;
        return R(new n.Desc(n, "update", [o].concat(M)), n.when.apply(n, M).scan(o, function(q, ie) {
          return ie(q);
        }));
      }, n.zipAsArray = function() {
        for (var o = arguments.length, d = Array(o), v = 0; v < o; v++)
          d[v] = arguments[v];
        var M = Re(d);
        return R(new n.Desc(n, "zipAsArray", M), n.zipWith(M, function() {
          for (var L = arguments.length, U = Array(L), q = 0; q < L; q++)
            U[q] = arguments[q];
          return U;
        }));
      }, n.zipWith = function() {
        for (var o = arguments.length, d = Array(o), v = 0; v < o; v++)
          d[v] = arguments[v];
        var M = dn(d), L = M[0], U = M[1];
        return L = b.map(function(q) {
          return q.toEventStream();
        }, L), R(new n.Desc(n, "zipWith", [U].concat(L)), n.when(L, U));
      }, n.Observable.prototype.zip = function(o, d) {
        return R(new n.Desc(this, "zip", [o]), n.zipWith([this, o], d || Array));
      };
      function Vr(o) {
        this.observable = o;
      }
      Vr.prototype.subscribe = function(o, d, v) {
        var M = typeof o == "function" ? { next: o, error: d, complete: v } : o, L = {
          closed: !1,
          unsubscribe: function() {
            L.closed = !0, U();
          }
        }, U = this.observable.subscribe(function(q) {
          q.isError() ? (M.error && M.error(q.error), L.unsubscribe()) : q.isEnd() ? (L.closed = !0, M.complete && M.complete()) : M.next && M.next(q.value());
        });
        return L;
      }, Vr.prototype[A("observable")] = function() {
        return this;
      }, n.Observable.prototype.toESObservable = function() {
        return new Vr(this);
      }, n.Observable.prototype[A("observable")] = n.Observable.prototype.toESObservable, n.fromESObservable = function(o) {
        var d;
        o[A("observable")] ? d = o[A("observable")]() : d = o;
        var v = new n.Desc(n, "fromESObservable", [d]);
        return new n.EventStream(v, function(M) {
          var L = d.subscribe({
            error: function() {
              M(new n.Error()), M(new n.End());
            },
            next: function(U) {
              M(new n.Next(U, !0));
            },
            complete: function() {
              M(new n.End());
            }
          });
          return L.unsubscribe ? function() {
            L.unsubscribe();
          } : L;
        });
      }, t !== null && t.exports != null ? (t.exports = n, n.Bacon = n) : this.Bacon = n;
    }).call(dg);
  })(ur)), ur.exports;
}
var gg = pg();
const Pi = /* @__PURE__ */ ln(gg);
function da(t) {
  return function(e) {
    return t.apply(null, e);
  };
}
let pa = class al {
  constructor(e, n, r, i, s, a, l, u, h, p, m) {
    if (l === null) {
      var g = i.get_size();
      l = {
        x: -g.width,
        y: -g.height,
        width: g.width * 3,
        height: g.height * 3
      };
    }
    Q.isUndefined(h) || h === null || h === "" ? h = "new_map" : h = String(h), Q.isUndefined(p) || p === null || p === "" ? p = xi() : p = String(p), Q.isUndefined(m) || m === null ? m = "" : m = String(m), this.callback_manager = new hn(), this.svg = e, this.defs = Ja(e, n), this.canvas = new hg(r, l), this.setup_containers(r), this.sel = r, this.zoomContainer = i, this.settings = s, this.cobra_model = a, this.largest_ids = {
      reactions: -1,
      nodes: -1,
      segments: -1,
      text_labels: -1
    }, this.undo_stack = new og(), this.behavior = new kd(this, this.undo_stack), this.draw = new qo(this.behavior, this.settings, this), this.key_manager = new cg(), this.key_manager.settings = s, this.key_manager.ctrlEqualsCmd = !0, this.enable_search = u, this.search_index = new fg(), this.map_name = h, this.map_id = p, this.map_description = m, this.beziers_enabled = !1, this.has_data_on_reactions = !1, this.has_data_on_nodes = !1, this.imported_reaction_data = null, this.imported_metabolite_data = null, this.imported_gene_data = null, this.nodes = {}, this.reactions = {}, this.beziers = {}, this.text_labels = {}, this.apply_reaction_data_to_map(null), this.apply_metabolite_data_to_map(null), this.apply_gene_data_to_map(null), this.scale = new sg(), this.scale.connectToSettings(this.settings, this, this.get_data_statistics.bind(this)), this.rotation_on = !1;
  }
  /**
   * Load a json map and add necessary fields for rendering.
   */
  static from_data(e, n, r, i, s, a, l, u) {
    var h = e[1].canvas, p = e[0].map_name, m = e[0].map_id, g = e[0].map_description.replace(/(\nLast Modified.*)+$/g, "") + `
Last Modified ` + Date(Date.now()).toString(), _ = new al(
      n,
      r,
      i,
      s,
      a,
      l,
      h,
      u,
      p,
      m,
      g
    );
    _.reactions = e[1].reactions, _.nodes = e[1].nodes, _.text_labels = e[1].text_labels;
    for (var E in _.nodes) {
      var c = _.nodes[E];
      if (c.connected_segments = [], u) {
        if (c.node_type !== "metabolite") continue;
        _.search_index.insert("n" + E, {
          name: c.bigg_id,
          data: {
            type: "metabolite",
            node_id: E
          }
        }), _.search_index.insert("n_name" + E, {
          name: c.name,
          data: {
            type: "metabolite",
            node_id: E
          }
        });
      }
    }
    for (var w in _.reactions) {
      var T = _.reactions[w];
      if (u) {
        _.search_index.insert(
          "r" + w,
          {
            name: T.bigg_id,
            data: {
              type: "reaction",
              reaction_id: w
            }
          }
        ), _.search_index.insert(
          "r_name" + w,
          {
            name: T.name,
            data: {
              type: "reaction",
              reaction_id: w
            }
          }
        );
        for (var A in T.genes) {
          var b = T.genes[A];
          _.search_index.insert(
            "r" + w + "_g" + A,
            {
              name: b.bigg_id,
              data: {
                type: "reaction",
                reaction_id: w
              }
            }
          ), _.search_index.insert(
            "r" + w + "_g_name" + A,
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
      var S = [];
      for (var x in T.segments) {
        var z = T.segments[x];
        if (z.reversibility = T.reversibility, !(z.from_node_id in _.nodes) || !(z.to_node_id in _.nodes)) {
          console.warn("Bad node references in segment " + x + ". Deleting segment."), S.push(x);
          continue;
        }
        const Y = _.nodes[z.from_node_id], Z = _.nodes[z.to_node_id];
        T.metabolites.forEach(function(H) {
          H.bigg_id === Y.bigg_id ? z.from_node_coefficient = H.coefficient : H.bigg_id === Z.bigg_id && (z.to_node_coefficient = H.coefficient);
        }), [Y, Z].forEach(function(H) {
          H.connected_segments.push({
            segment_id: x,
            reaction_id: w
          });
        });
        var C = _.nodes[z.from_node_id], N = _.nodes[z.to_node_id];
        if (C.node_type == "metabolite" || N.node_type == "metabolite") {
          var B = ot(C, to(Pn(N, C), 0.5));
          z.b1 === null && (z.b1 = B), z.b2 === null && (z.b2 = B);
        }
      }
      S.forEach(function(Y) {
        delete T.segments[Y];
      });
    }
    if (u)
      for (var V in _.text_labels) {
        var R = _.text_labels[V];
        _.search_index.insert("l" + V, {
          name: R.text,
          data: {
            type: "text_label",
            text_label_id: V
          }
        });
      }
    _.beziers = Go(_.reactions), _.largest_ids.reactions = W(_.reactions), _.largest_ids.nodes = W(_.nodes), _.largest_ids.text_labels = W(_.text_labels);
    var j = 0;
    for (var O in _.reactions)
      j = W(
        _.reactions[O].segments,
        j
      );
    return _.largest_ids.segments = j, _.apply_reaction_data_to_map(null), _.apply_metabolite_data_to_map(null), _.apply_gene_data_to_map(null), _;
    function W(Y, Z) {
      return Q.isUndefined(Z) && (Z = 0), Q.isUndefined(Y) ? Z : Math.max.apply(null, Object.keys(Y).map(function(H) {
        return parseInt(H);
      }).concat([Z]));
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
    this.reactions = {}, this.beziers = {}, this.nodes = {}, this.text_labels = {}, this.map_name = "new_map", this.map_id = xi(), this.map_description = "";
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
    Q.isUndefined(e) && (e = !0), Q.isUndefined(n) && (n = !0);
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
    Q.isUndefined(n) && (n = !0);
    var r = Nn(
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
    if (pt(
      this.sel,
      "#reactions",
      ".reaction",
      r,
      "reaction_id",
      this.draw.create_reaction.bind(this.draw),
      i
    ), n) {
      var s = Md(r);
      this.draw_these_beziers(s);
    }
  }
  /**
   * Remove any reactions that are not in *this.reactions*.
   * draw_beziers: (Boolean, default True) Whether to also clear deleted bezier
   * control points.
   */
  clear_deleted_reactions(e) {
    Q.isUndefined(e) && (e = !0), pt(
      this.sel,
      "#reactions",
      ".reaction",
      this.reactions,
      "reaction_id",
      null,
      function(n) {
        Qa(
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
    var n = Nn(this.nodes, e), r = (function(s) {
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
    pt(
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
    pt(
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
    var n = Nn(this.text_labels, e);
    pt(
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
    pt(
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
    var n = Nn(this.beziers, e), r = (function(i) {
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
    pt(
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
    pt(
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
    Q.isUndefined(e) ? this.beziers_enabled = !this.beziers_enabled : this.beziers_enabled = e, this.draw_all_beziers(), this.callback_manager.run("toggle_beziers", null, this.beziers_enabled);
  }
  /**
   * Returns True if the scale has changed.
   * @param {Array} keys - (Optional) The keys in reactions to apply data to.
   */
  apply_reaction_data_to_map(e, n) {
    const r = this.settings.get("reaction_styles"), i = this.settings.get("reaction_compare_style"), s = bo(
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
    const r = this.settings.get("metabolite_styles"), i = this.settings.get("metabolite_compare_style"), s = vo(
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
    var r = this.settings.get("reaction_styles"), i = this.settings.get("reaction_compare_style"), s = this.settings.get("identifiers_on_map"), a = this.settings.get("and_method_in_gene_reaction_rule"), l = yo(
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
        Q.isUndefined(r.data) ? console.error("metabolite missing ") : r.data !== null && n.push(r.data);
      }
    else if (e == "reaction")
      for (let p in this.reactions) {
        var i = this.reactions[p];
        Q.isUndefined(i.data) ? console.error("reaction data missing ") : i.data !== null && n.push(i.data);
      }
    if (n.length === 0) {
      const p = this.data_statistics[e] === null;
      return this.data_statistics[e] = null, e === "reaction" ? this.callback_manager.run("calc_data_stats__reaction", null, !p) : this.callback_manager.run("calc_data_stats__metabolite", null, !p), !p;
    }
    this.data_statistics[e] === null && (this.data_statistics[e] = {});
    let s = !0;
    var a = uo(n), l = [
      ["min", da(Math.min)],
      ["max", da(Math.max)],
      ["mean", lo],
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
      var m, g = p[0];
      if (n.length === 0)
        m = null;
      else {
        var _ = p[1];
        m = _(n);
      }
      m != this.data_statistics[e][g] && (s = !1), this.data_statistics[e][g] = m;
    }).bind(this)), this.data_statistics[e].min === this.data_statistics[e].max && this.data_statistics[e].min !== null) {
      var u = this.data_statistics[e].min, h = this.data_statistics[e].max;
      this.data_statistics[e].min = u - 1 - Math.abs(u) * 0.1, this.data_statistics[e].max = h + 1 + Math.abs(h) * 0.1;
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
      return !ze(this).classed("selected");
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
    r = Q.isUndefined(r) ? !1 : r;
    var i = this.sel.selectAll("#nodes,#text-labels").selectAll(".node,.text-label"), s;
    ze(e).attr("class").indexOf("text-label") == -1 ? s = e.parentNode : s = e, r ? ze(s).classed("selected", !ze(s).classed("selected")) : (i.classed("selected", !1), ze(s).classed("selected", !0));
    var a = this.sel.select("#nodes").selectAll(".selected"), l = 0, u, h;
    a.each(function(p) {
      h = p, u = { x: p.x, y: p.y }, l++;
    }), this.callback_manager.run("select_selectable", null, l, h, u);
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
    const n = this.getSelectedNodes(), r = Q.pick(
      n,
      (g) => g.node_type !== "metabolite" || g.node_is_primary
    ), i = Object.keys(r).length > 0, s = i ? r : n, a = Object.keys(s), l = a.reduce((g, _) => g + (e ? s[_].y : s[_].x), 0) / a.length, u = Q.pairs(s).map(([g, _]) => ({
      nodeId: g,
      displacement: e ? { x: 0, y: l - _.y } : { x: l - _.x, y: 0 }
    })), h = [], p = {};
    i && Q.mapObject(s, (g, _) => {
      g.connected_segments.map((E) => {
        const c = E.segment_id, w = E.reaction_id, T = this.reactions[w].segments[c], A = T.to_node_id === g.node_id, b = A ? T.from_node_id : T.to_node_id, S = this.nodes[b], x = A ? "b2" : "b1";
        if (S.node_id in n && T[x]) {
          const z = wt(c, x);
          if (h.push({
            reactionId: w,
            segmentId: c,
            bez: x,
            bezierId: z,
            displacement: e ? { x: 0, y: g.y - T[x].y } : { x: g.x - T[x].x, y: 0 }
          }), S.node_type === "metabolite" && !S.node_is_primary && !(b in p)) {
            const C = S.connected_segments.filter((N) => {
              const B = this.reactions[w].segments[c];
              return B.to_node_id === S.node_id ? B.from_node_id in n : B.to_node_id in n;
            });
            S.connected_segments.length <= C.length && (u.push({
              nodeId: b,
              displacement: e ? { x: 0, y: l - g.y } : { x: l - g.x, y: 0 }
            }), p[b] = !0);
          }
        }
      });
    });
    const m = (g, _) => {
      let E = [];
      g.map((c) => {
        const w = this.nodes[c.nodeId], T = Yt(
          w,
          c.nodeId,
          this.reactions,
          this.beziers,
          c.displacement
        );
        E = Yi([E, T.reaction_ids]);
      }), _.map((c) => {
        const w = this.reactions[c.reactionId].segments[c.segmentId];
        w[c.bez] = ot(w[c.bez], c.displacement), this.beziers[c.bezierId].x = w[c.bez].x, this.beziers[c.bezierId].y = w[c.bez].y;
      }), this.draw_these_nodes(g.map((c) => c.nodeId)), this.draw_these_reactions(E, !0);
    };
    this.undo_stack.push(
      // undo
      () => {
        const g = (_) => _.map((E) => ({
          ...E,
          displacement: { x: -E.displacement.x, y: -E.displacement.y }
        }));
        m(g(u), g(h));
      },
      // redo
      () => {
        m(u, h);
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
    var i = this.segments_and_reactions_for_nodes(e), s = i.segment_objs_w_segments, a = i.reactions, l = ke(e), u = ke(s), h = ke(a), p = ke(n), m = (function(g, _, E, c) {
      this.delete_node_data(Object.keys(e)), this.delete_segment_data(E), this.delete_reaction_data(Object.keys(_)), this.delete_text_label_data(Object.keys(c));
      var w = !1, T = !1;
      this.has_data_on_reactions && (w = this.calc_data_stats("reaction")), this.has_data_on_nodes && (T = this.calc_data_stats("metabolite")), r && (w ? this.draw_all_reactions(!0, !0) : this.clear_deleted_reactions(), T ? this.draw_all_nodes(!0) : this.clear_deleted_nodes(), this.clear_deleted_text_labels());
    }).bind(this);
    m(
      e,
      a,
      s,
      n
    ), this.undo_stack.push((function() {
      this.extend_nodes(l), this.extend_reactions(h);
      var g = Object.keys(h);
      for (var _ in u) {
        var E = u[_], c = E.segment;
        this.reactions[E.reaction_id].segments[E.segment_id] = c;
        var w = [c.from_node_id, c.to_node_id];
        w.forEach((function(S) {
          if (!(S in l)) {
            var x = this.nodes[S];
            x.connected_segments.push({
              reaction_id: E.reaction_id,
              segment_id: E.segment_id
            });
          }
        }).bind(this));
        var T = E.segment_id, A = E.reaction_id, b = {};
        b[T] = E.segment, st(this.beziers, Yo(b, A)), g.indexOf(E.reaction_id) === -1 && g.push(E.reaction_id);
      }
      if (this.has_data_on_reactions ? this.calc_data_stats("reaction") ? this.draw_all_reactions(!0, !1) : this.draw_these_reactions(g) : r && this.draw_these_reactions(g), this.has_data_on_nodes) {
        const S = this.calc_data_stats("metabolite");
        r && (S ? this.draw_all_nodes(!1) : this.draw_these_nodes(Object.keys(l)));
      } else
        r && this.draw_these_nodes(Object.keys(l));
      st(this.text_labels, p), r && this.draw_these_text_labels(Object.keys(p)), n = ke(p), e = ke(l), s = ke(u), a = ke(h);
    }).bind(this), (function() {
      m(
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
        var l = wt(r.segment_id, a);
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
          var u = wt(i, l);
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
    var i = ke(this.cobra_model.reactions[e]);
    if (Q.size(i.metabolites) === 0)
      throw Error("No metabolites in reaction " + i.bigg_id);
    const s = Q.map(
      i.metabolites,
      (w, T) => [w, T]
    ).filter((w) => w[0] < 0).map((w) => w[1]), a = s.length > 0 ? s[0] : Object.keys(i.metabolites)[0], l = this.cobra_model.metabolites[a], u = String(++this.largest_ids.nodes), h = Vo(
      Ki(r),
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
      label_x: n.x + h.x,
      label_y: n.y + h.y,
      name: l.name,
      bigg_id: a,
      node_type: "metabolite"
    }, m = {};
    m[u] = p, this._extend_and_draw_metabolite(m, u);
    var g = ke(m), _ = this.new_reaction_for_metabolite(
      e,
      u,
      r,
      !1
    ), E = _.redo, c = _.undo;
    this.undo_stack.push(() => {
      c(), this.delete_node_data(Object.keys(m)), m = ke(g), this.clear_deleted_nodes(), this.deselect_nodes();
    }, () => {
      this._extend_and_draw_metabolite(m, u), E();
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
    st(this.nodes, e);
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
    st(this.reactions, e);
  }
  _extend_and_draw_reaction(e, n, r, i) {
    this.extend_reactions(n), st(this.beziers, r), this.delete_node_data([i]), this.extend_nodes(e);
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
      var h = e[u];
      if (h.node_is_primary && u != i) {
        this.select_metabolite_with_id(u);
        var p = { x: h.x, y: h.y };
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
    var s = this.nodes[n], a = this.cobra_model.reactions[e], l = wd(
      e,
      a,
      this.cobra_model.metabolites,
      n,
      ke(s),
      this.largest_ids,
      this.settings.get("cofactors"),
      r
    ), u = l.new_nodes, h = l.new_reactions, p = l.new_beziers;
    this._extend_and_draw_reaction(
      u,
      h,
      p,
      n
    );
    var m = ke(u), g = ke(h), _ = ke(p), E = () => {
      if (delete u[n], this.delete_node_data(Object.keys(u)), this.delete_reaction_data(Object.keys(h)), this.select_metabolite_with_id(n), u = ke(m), h = ke(g), p = ke(_), this.has_data_on_reactions) {
        var w = this.calc_data_stats("reaction");
        w ? this.draw_all_reactions(!0, !0) : this.clear_deleted_reactions(!0);
      } else
        this.clear_deleted_reactions(!0);
      this.has_data_on_nodes ? this.calc_data_stats("metabolite") ? this.draw_all_nodes(!0) : this.clear_deleted_nodes() : this.clear_deleted_nodes();
    };
    const c = () => {
      this._extend_and_draw_reaction(
        u,
        h,
        p,
        n
      );
    };
    return i && this.undo_stack.push(E, c), { undo: E, redo: c };
  }
  cycle_primary_node() {
    var e = this.getSelectedNodes();
    if (!Q.isEmpty(e)) {
      var n = Object.keys(e)[0];
      e[n];
      var r = this.reactions, i = this.nodes, s = [], a;
      if (i[n].connected_segments.forEach(function(z) {
        a = [z.reaction_id];
        var C;
        try {
          if (C = r[z.reaction_id].segments[z.segment_id], C === void 0) throw new Error("undefined segment");
        } catch {
          console.warn("Could not find connected segment " + z.segment_id);
          return;
        }
        s.push(C.from_node_id == n ? C.to_node_id : C.from_node_id);
      }), s.length != 1) {
        console.error("Only connected nodes with a single reaction can be selected");
        return;
      }
      var l = s[0], u = [n];
      i[l].connected_segments.forEach(function(z) {
        var C;
        try {
          if (C = r[z.reaction_id].segments[z.segment_id], C === void 0) throw new Error("undefined segment");
        } catch {
          console.warn("Could not find connected segment " + z.segment_id);
          return;
        }
        var N = C.from_node_id == l ? C.to_node_id : C.from_node_id, B = i[N];
        B.node_type == "metabolite" && N != n && u.push(String(N));
      });
      for (var h = 0; h < u.length; h++)
        if (i[u[h]].connected_segments.length > 1) {
          console.error("Only connected nodes with a single reaction can be selected");
          return;
        }
      for (var p in e)
        if (p != n && u.indexOf(p) == -1) {
          console.warn("Selected nodes are not on the same reaction");
          return;
        }
      var m = [], S = u.length - 1, g = i[u[S]], _ = g.node_is_primary, E = {
        x: g.x,
        y: g.y,
        label_x: g.label_x,
        label_y: g.label_y
      };
      g.connected_segments.length > 1 && console.warn("Too many connected segments for node " + g.node_id);
      var c = g.connected_segments[0], w;
      try {
        if (w = r[c.reaction_id].segments[c.segment_id], w === void 0) throw new Error("undefined segment");
      } catch {
        console.error("Could not find connected segment " + c.segment_id);
        return;
      }
      var T = { b1: w.b1, b2: w.b2 }, A;
      u.forEach(function(z) {
        var C = i[z], N = C.node_is_primary, B = {
          x: C.x,
          y: C.y,
          label_x: C.label_x,
          label_y: C.label_y
        }, V = C.connected_segments[0], R = r[V.reaction_id].segments[V.segment_id], j = { b1: R.b1, b2: R.b2 };
        C.node_is_primary = _, C.x = E.x, C.y = E.y, C.label_x = E.label_x, C.label_y = E.label_y, R.b1 = T.b1, R.b2 = T.b2, _ = N, E = B, T = j, C.node_is_primary && (A = z), m.push(z);
      });
      var b = i[l].connected_segments, S = b.length - 1, x = [b[S]];
      b.forEach(function(z, C) {
        S != C && x.push(z);
      }), i[l].connected_segments = x, this.draw_these_nodes(m), this.draw_these_reactions(a), this.select_metabolite_with_id(A);
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
        const m = this.nodes[p];
        m.node_type == "metabolite" && (m.node_is_primary = !m.node_is_primary, i[p] = m);
      }).bind(this)), this.draw_these_nodes(Object.keys(i)), s) {
        var a = this.segments_and_reactions_for_nodes(i), l = {};
        for (var u in a.segment_objs_w_segments) {
          var h = a.segment_objs_w_segments[u].reaction_id;
          l[h] = !0;
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
      l.connected_segments.forEach(function(_) {
        var E;
        try {
          if (E = s[_.reaction_id].segments[_.segment_id], E === void 0) throw new Error("undefined segment");
        } catch {
          console.warn("Could not find connected segments for node");
          return;
        }
        var c = ke(_);
        c.segment = ke(E), n[_.segment_id] = c, _.reaction_id in i || (i[_.reaction_id] = []), i[_.reaction_id].push(_.segment_id);
      });
    }
    for (var u in i) {
      var h = s[u], p = i[u], m = !0;
      for (var g in h.segments)
        p.indexOf(g) == -1 && (m = !1);
      m && (r[u] = h);
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
    var r = Sd(this.largest_ids, n, e);
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
    if (Q.isUndefined(i) && (i = !1), n === "")
      throw new Error("Should not be called for empty string");
    var s = (function(l, u) {
      var h = this.text_labels[e];
      h.text = l, u && this.draw_these_text_labels([e]);
      var p = "l" + e, m = this.search_index.remove(p);
      !i && !m && console.warn("Could not find modified text label in search index"), this.search_index.insert(p, {
        name: l,
        data: { type: "text_label", text_label_id: e }
      });
    }).bind(this), a = ke(this.text_labels[e]);
    s(n, r), this.undo_stack.push((function() {
      i ? (this.delete_text_label_data([e]), this.clear_deleted_text_labels()) : s(a.text, !0);
    }).bind(this), (function() {
      i ? (this.text_labels[e] = ke(a), this.text_labels[e].text = n, this.draw_these_text_labels([e]), this.add_label_to_search_index(e, n)) : s(n, !0);
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
    Q.isUndefined(e) && (e = n === "nodes" ? 0.2 : 0), Q.isUndefined(n) && (n = "canvas");
    var r, i, s = this.get_size();
    if (e = e * s.height, n === "nodes") {
      var a = { x: null, y: null }, l = { x: null, y: null };
      for (var u in this.nodes) {
        var h = this.nodes[u];
        a.x === null && (a.x = h.x), a.y === null && (a.y = h.y), l.x === null && (l.x = h.x), l.y === null && (l.y = h.y), a.x = Math.min(a.x, h.x), a.y = Math.min(a.y, h.y), l.x = Math.max(l.x, h.x), l.y = Math.max(l.y, h.y);
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
    no(this.map_for_export(), this.map_name);
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
        reactions: ke(this.reactions),
        nodes: ke(this.nodes),
        text_labels: ke(this.text_labels),
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
      w.forEach(function(A) {
        i[A] = r[A];
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
      var h = e[1].nodes[u], p = {}, w;
      h.node_type === "metabolite" ? w = [
        "node_type",
        "x",
        "y",
        "bigg_id",
        "name",
        "label_x",
        "label_y",
        "node_is_primary"
      ] : w = ["node_type", "x", "y"], w.forEach(function(A) {
        p[A] = h[A];
      }), e[1].nodes[u] = p;
    }
    for (var m in e[1].text_labels) {
      var g = e[1].text_labels[m], _ = {}, w = ["x", "y", "text"];
      w.forEach(function(A) {
        _[A] = g[A];
      }), e[1].text_labels[m] = _;
    }
    var E = e[1].canvas, c = {}, w = ["x", "y", "width", "height"];
    return w.forEach(function(T) {
      c[T] = E[T];
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
        r === "svg" ? ro("saved_map", this.svg, !0) : r === "png" && io("saved_map", this.svg), this.zoomContainer._goToSvg(i, s, () => {
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
      for (var h in e.reactions) {
        const A = e.reactions[h];
        if (A.bigg_id == u.bigg_id) {
          r.forEach((x) => {
            u[x] = A[x];
          });
          let b = !0, S = null;
          for (let x in A.metabolites) {
            const z = A.metabolites[x], C = Q.find(u.metabolites, (B) => B.bigg_id === x);
            if (C === void 0) {
              b = !1;
              break;
            }
            const N = C.coefficient;
            if (S === null && (S = z > 0 != N > 0), S === !0 && z > 0 == N > 0 || S === !1 && z > 0 != N > 0) {
              b = !1;
              break;
            }
          }
          if (S && b) {
            u.metabolites.forEach((x) => {
              x.coefficient = -x.coefficient;
            });
            for (var p in u.segments) {
              const x = u.segments[p];
              x.reversibility = u.reversibility;
              const z = this.nodes[x.from_node_id], C = this.nodes[x.to_node_id];
              u.metabolites.forEach((N) => {
                N.bigg_id === z.bigg_id ? x.from_node_coefficient = N.coefficient : N.bigg_id === C.bigg_id && (x.to_node_coefficient = N.coefficient);
              });
            }
          }
          if (!b) {
            console.warn(`Metabolites for ${A.bigg_id} are different in model and map. Could
 not check and fix direction.`);
            break;
          }
          a = !0;
        }
      }
      a || (n[l] = !0);
    }
    for (var m in this.nodes) {
      var g = this.nodes[m];
      if (g.node_type == "metabolite") {
        a = !1;
        for (var _ in e.metabolites) {
          var E = e.metabolites[_];
          E.bigg_id == g.bigg_id && (s.forEach(function(A) {
            g[A] = E[A];
          }), a = !0);
        }
        a || (i[m] = !0);
      }
    }
    var c = Object.keys(n).length, w = Object.keys(i).length, T = 1e4;
    c === 0 && w === 0 ? this.set_status("Successfully converted attributes.", T) : w === 0 ? (this.set_status("Converted attributes, but count not find " + c + " reactions in the model.", T), this.settings.set("highlight_missing", !0)) : c === 0 ? (this.set_status("Converted attributes, but count not find " + w + " metabolites in the model.", T), this.settings.set("highlight_missing", !0)) : (this.set_status(
      "Converted attributes, but count not find " + c + " reactions and " + w + " metabolites in the model.",
      T
    ), this.settings.set("highlight_missing", !0)), this.draw_everything(), this.callback_manager.run("after_convert_map");
  }
};
function ga(t) {
  return function() {
    return t;
  };
}
function _g(t, e, n) {
  this.target = t, this.type = e, this.selection = n;
}
function _a() {
  X.stopImmediatePropagation();
}
function er() {
  X.preventDefault(), X.stopImmediatePropagation();
}
var ma = {}, di = { name: "space" }, Wt = { name: "handle" }, $t = { name: "center" }, pi = {}, gi = {}, mg = {
  name: "xy",
  handles: ["n", "e", "s", "w", "nw", "ne", "se", "sw"].map(Bi),
  input: function(t) {
    return t;
  },
  output: function(t) {
    return t;
  }
}, dt = {
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
}, ba = {
  e: "w",
  w: "e",
  nw: "ne",
  ne: "nw",
  se: "sw",
  sw: "se"
}, va = {
  n: "s",
  s: "n",
  nw: "sw",
  ne: "se",
  se: "ne",
  sw: "nw"
}, bg = {
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
}, vg = {
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
function Bi(t) {
  return { type: t };
}
function yg() {
  return !X.button;
}
function wg() {
  var t = this.ownerSVGElement || this;
  return [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]];
}
function _i(t) {
  for (; !t.__brush; ) if (!(t = t.parentNode)) return;
  return t.__brush;
}
function mi(t) {
  return t[0][0] === t[1][0] || t[0][1] === t[1][1];
}
function ya(t) {
  var e = t.__brush;
  return e ? e.dim.output(e.selection) : null;
}
function xg() {
  return Sg(mg);
}
function Sg(t) {
  var e = wg, n = yg, r = un(a, "start", "brush", "end"), i = 6, s;
  function a(g) {
    var _ = g.property("__brush", m).selectAll(".overlay").data([Bi("overlay")]);
    _.enter().append("rect").attr("class", "overlay").attr("pointer-events", "all").attr("cursor", dt.overlay).merge(_).each(function() {
      var c = _i(this).extent;
      ze(this).attr("x", c[0][0]).attr("y", c[0][1]).attr("width", c[1][0] - c[0][0]).attr("height", c[1][1] - c[0][1]);
    }), g.selectAll(".selection").data([Bi("selection")]).enter().append("rect").attr("class", "selection").attr("cursor", dt.selection).attr("fill", "#777").attr("fill-opacity", 0.3).attr("stroke", "#fff").attr("shape-rendering", "crispEdges");
    var E = g.selectAll(".handle").data(t.handles, function(c) {
      return c.type;
    });
    E.exit().remove(), E.enter().append("rect").attr("class", function(c) {
      return "handle handle--" + c.type;
    }).attr("cursor", function(c) {
      return dt[c.type];
    }), g.each(l).attr("fill", "none").attr("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush touchstart.brush", p);
  }
  a.move = function(g, _) {
    g.selection ? g.on("start.brush", function() {
      u(this, arguments).beforestart().start();
    }).on("interrupt.brush end.brush", function() {
      u(this, arguments).end();
    }).tween("brush", function() {
      var E = this, c = E.__brush, w = u(E, arguments), T = c.selection, A = t.input(typeof _ == "function" ? _.apply(this, arguments) : _, c.extent), b = Ir(T, A);
      function S(x) {
        c.selection = x === 1 && mi(A) ? null : b(x), l.call(E), w.brush();
      }
      return T && A ? S : S(1);
    }) : g.each(function() {
      var E = this, c = arguments, w = E.__brush, T = t.input(typeof _ == "function" ? _.apply(E, c) : _, w.extent), A = u(E, c).beforestart();
      jt(E), w.selection = T == null || mi(T) ? null : T, l.call(E), A.start().brush().end();
    });
  };
  function l() {
    var g = ze(this), _ = _i(this).selection;
    _ ? (g.selectAll(".selection").style("display", null).attr("x", _[0][0]).attr("y", _[0][1]).attr("width", _[1][0] - _[0][0]).attr("height", _[1][1] - _[0][1]), g.selectAll(".handle").style("display", null).attr("x", function(E) {
      return E.type[E.type.length - 1] === "e" ? _[1][0] - i / 2 : _[0][0] - i / 2;
    }).attr("y", function(E) {
      return E.type[0] === "s" ? _[1][1] - i / 2 : _[0][1] - i / 2;
    }).attr("width", function(E) {
      return E.type === "n" || E.type === "s" ? _[1][0] - _[0][0] + i : i;
    }).attr("height", function(E) {
      return E.type === "e" || E.type === "w" ? _[1][1] - _[0][1] + i : i;
    })) : g.selectAll(".selection,.handle").style("display", "none").attr("x", null).attr("y", null).attr("width", null).attr("height", null);
  }
  function u(g, _) {
    return g.__brush.emitter || new h(g, _);
  }
  function h(g, _) {
    this.that = g, this.args = _, this.state = g.__brush, this.active = 0;
  }
  h.prototype = {
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
    emit: function(g) {
      fr(new _g(a, g, t.output(this.state.selection)), r.apply, r, [g, this.that, this.args]);
    }
  };
  function p() {
    if (X.touches) {
      if (X.changedTouches.length < X.touches.length) return er();
    } else if (s) return;
    if (!n.apply(this, arguments)) return;
    var g = this, _ = X.target.__data__.type, E = (X.metaKey ? _ = "overlay" : _) === "selection" ? ma : X.altKey ? $t : Wt, c = t === gi ? null : bg[_], w = t === pi ? null : vg[_], T = _i(g), A = T.extent, b = T.selection, S = A[0][0], x, z, C = A[0][1], N, B, V = A[1][0], R, j, O = A[1][1], W, Y, Z, H, ne, he = !1, ue, J, re = Qe(g), le = re, ae = u(g, arguments).beforestart();
    _ === "overlay" ? T.selection = b = [
      [x = t === gi ? S : re[0], N = t === pi ? C : re[1]],
      [R = t === gi ? V : x, W = t === pi ? O : N]
    ] : (x = b[0][0], N = b[0][1], R = b[1][0], W = b[1][1]), z = x, B = N, j = R, Y = W;
    var ce = ze(g).attr("pointer-events", "none"), Ne = ce.selectAll(".overlay").attr("cursor", dt[_]);
    if (X.touches)
      ce.on("touchmove.brush", te, !0).on("touchend.brush touchcancel.brush", G, !0);
    else {
      var K = ze(X.view).on("keydown.brush", Te, !0).on("keyup.brush", _e, !0).on("mousemove.brush", te, !0).on("mouseup.brush", G, !0);
      Ji(X.view);
    }
    _a(), jt(g), l.call(g), ae.start();
    function te() {
      var Ce = Qe(g);
      he && !ue && !J && (Math.abs(Ce[0] - le[0]) > Math.abs(Ce[1] - le[1]) ? J = !0 : ue = !0), le = Ce, ne = !0, er(), se();
    }
    function se() {
      var Ce;
      switch (Z = le[0] - re[0], H = le[1] - re[1], E) {
        case di:
        case ma: {
          c && (Z = Math.max(S - x, Math.min(V - R, Z)), z = x + Z, j = R + Z), w && (H = Math.max(C - N, Math.min(O - W, H)), B = N + H, Y = W + H);
          break;
        }
        case Wt: {
          c < 0 ? (Z = Math.max(S - x, Math.min(V - x, Z)), z = x + Z, j = R) : c > 0 && (Z = Math.max(S - R, Math.min(V - R, Z)), z = x, j = R + Z), w < 0 ? (H = Math.max(C - N, Math.min(O - N, H)), B = N + H, Y = W) : w > 0 && (H = Math.max(C - W, Math.min(O - W, H)), B = N, Y = W + H);
          break;
        }
        case $t: {
          c && (z = Math.max(S, Math.min(V, x - Z * c)), j = Math.max(S, Math.min(V, R + Z * c))), w && (B = Math.max(C, Math.min(O, N - H * w)), Y = Math.max(C, Math.min(O, W + H * w)));
          break;
        }
      }
      j < z && (c *= -1, Ce = x, x = R, R = Ce, Ce = z, z = j, j = Ce, _ in ba && Ne.attr("cursor", dt[_ = ba[_]])), Y < B && (w *= -1, Ce = N, N = W, W = Ce, Ce = B, B = Y, Y = Ce, _ in va && Ne.attr("cursor", dt[_ = va[_]])), T.selection && (b = T.selection), ue && (z = b[0][0], j = b[1][0]), J && (B = b[0][1], Y = b[1][1]), (b[0][0] !== z || b[0][1] !== B || b[1][0] !== j || b[1][1] !== Y) && (T.selection = [[z, B], [j, Y]], l.call(g), ae.brush());
    }
    function G() {
      if (_a(), X.touches) {
        if (X.touches.length) return;
        s && clearTimeout(s), s = setTimeout(function() {
          s = null;
        }, 500), ce.on("touchmove.brush touchend.brush touchcancel.brush", null);
      } else
        Qi(X.view, ne), K.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
      ce.attr("pointer-events", "all"), Ne.attr("cursor", dt.overlay), T.selection && (b = T.selection), mi(b) && (T.selection = null, l.call(g)), ae.end();
    }
    function Te() {
      switch (X.keyCode) {
        case 16: {
          he = c && w;
          break;
        }
        case 18: {
          E === Wt && (c && (R = j - Z * c, x = z + Z * c), w && (W = Y - H * w, N = B + H * w), E = $t, se());
          break;
        }
        case 32: {
          (E === Wt || E === $t) && (c < 0 ? R = j - Z : c > 0 && (x = z - Z), w < 0 ? W = Y - H : w > 0 && (N = B - H), E = di, Ne.attr("cursor", dt.selection), se());
          break;
        }
        default:
          return;
      }
      er();
    }
    function _e() {
      switch (X.keyCode) {
        case 16: {
          he && (ue = J = he = !1, se());
          break;
        }
        case 18: {
          E === $t && (c < 0 ? R = j : c > 0 && (x = z), w < 0 ? W = Y : w > 0 && (N = B), E = Wt, se());
          break;
        }
        case 32: {
          E === di && (X.altKey ? (c && (R = j - Z * c, x = z + Z * c), w && (W = Y - H * w, N = B + H * w), E = $t) : (c < 0 ? R = j : c > 0 && (x = z), w < 0 ? W = Y : w > 0 && (N = B), E = Wt), Ne.attr("cursor", dt[_]), se());
          break;
        }
        default:
          return;
      }
      er();
    }
  }
  function m() {
    var g = this.__brush || { selection: null };
    return g.extent = e.apply(this, arguments), g.dim = t, g;
  }
  return a.extent = function(g) {
    return arguments.length ? (e = typeof g == "function" ? g : ga([[+g[0][0], +g[0][1]], [+g[1][0], +g[1][1]]]), a) : e;
  }, a.filter = function(g) {
    return arguments.length ? (n = typeof g == "function" ? g : ga(!!g), a) : n;
  }, a.handleSize = function(g) {
    return arguments.length ? (i = +g, a) : i;
  }, a.on = function() {
    var g = r.on.apply(r, arguments);
    return g === r ? a : g;
  }, a;
}
class Mg {
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
    const e = this.map, n = this.brushSel, r = e.sel.selectAll("#nodes,#text-labels"), i = e.canvas.sizeAndLocation(), s = i.width, a = i.height, l = i.x, u = i.y, h = this.turnOffCrosshair.bind(this);
    n.selectAll("*").remove();
    let p = !1;
    var m = xg().extent([[l, u], [l + s, u + a]]).on("start", () => {
      this.turnOffCrosshair(n), e.settings.get("hide_secondary_metabolites") && (e.settings.set("hide_secondary_metabolites", !1), e.draw_everything(), e.set_status("Showing secondary metabolites. You can hide them again in Settings.", 2e3));
    }).on("brush", function() {
      const g = X.sourceEvent.shiftKey, _ = ya(this);
      if (_ !== null) {
        var E = g ? r.selectAll(".node:not(.selected),.text-label:not(.selected)") : r.selectAll(".node,.text-label");
        E.classed("selected", (c) => {
          const w = c.x, T = c.y;
          return _[0][0] <= w && w < _[1][0] && _[0][1] <= T && T < _[1][1];
        });
      }
    }).on("end", function() {
      h(n);
      var g = ya(this);
      g === null ? p ? p = !1 : e.select_none() : (p = !0, n.call(m.move, null));
    });
    n.call(m), h(n);
  }
}
function kg(t, e) {
  const n = {
    savedValue: null,
    currentValue: null,
    lastStatus: null
  };
  return Pi.combineAsArray(t, e.toProperty(null)).scan(n, ({ savedValue: i, currentValue: s, lastStatus: a }, [l, u]) => {
    const h = a !== u;
    return h && u === "hold" ? {
      savedValue: s,
      currentValue: s,
      lastStatus: u
    } : !h && u === "hold" ? {
      savedValue: i,
      currentValue: l,
      lastStatus: u
    } : h && u === "abandon" ? {
      savedValue: null,
      currentValue: i,
      lastStatus: u
    } : h && u === "accept" ? {
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
class Cg {
  constructor(e, n) {
    this._options = e, this.statusBus = new Pi.Bus(), [this.busses, this.streams, this.acceptedStreams] = Q.chain(e).mapObject((r, i) => {
      const s = Q.contains(n, i), { bus: a, stream: l, acceptedStream: u } = this.createSetting(i, r, s);
      return [a, l, u];
    }).pairs().map(([r, [i, s, a]]) => [
      [r, i],
      [r, s],
      [r, a]
    ]).unzip().map((r) => Q.object(r)).value();
  }
  /**
   * Set up a new bus and stream for a conditional setting (i.e. one that can be
   * canceled in the settings menu.
   */
  createSetting(e, n, r) {
    const i = new Pi.Bus(), s = r ? kg(i, this.statusBus) : i.toEventStream(), a = s.sampledBy(
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
class Eg {
  constructor(e, n, r) {
    const i = e.append("div").attr("id", "text-edit-input");
    this.placedDiv = Tr(i, n), this.placedDiv.hide(), this.input = i.append("input"), this.map = n, this.setUpMapCallbacks(n), this.zoomContainer = r, this.setUpZoomCallbacks(r), this.isNew = !1;
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
var zg = function() {
}, je = {}, qt = [], wa = [];
function k(t, e) {
  var n = wa, r, i, s, a;
  for (a = arguments.length; a-- > 2; )
    qt.push(arguments[a]);
  for (e && e.children != null && (qt.length || qt.push(e.children), delete e.children); qt.length; )
    if ((i = qt.pop()) && i.pop !== void 0)
      for (a = i.length; a--; )
        qt.push(i[a]);
    else
      typeof i == "boolean" && (i = null), (s = typeof t != "function") && (i == null ? i = "" : typeof i == "number" ? i = String(i) : typeof i != "string" && (s = !1)), s && r ? n[n.length - 1] += i : n === wa ? n = [i] : n.push(i), r = s;
  var l = new zg();
  return l.nodeName = t, l.children = n, l.attributes = e ?? void 0, l.key = e == null ? void 0 : e.key, je.vnode !== void 0 && je.vnode(l), l;
}
function yt(t, e) {
  for (var n in e)
    t[n] = e[n];
  return t;
}
function on(t, e) {
  t != null && (typeof t == "function" ? t(e) : t.current = e);
}
var Tg = typeof Promise == "function" ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout, Ng = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i, ol = [];
function ll(t) {
  !t._dirty && (t._dirty = !0) && ol.push(t) == 1 && (je.debounceRendering || Tg)(Dg);
}
function Dg() {
  for (var t; t = ol.pop(); )
    t._dirty && Br(t);
}
function Ag(t, e, n) {
  return typeof e == "string" || typeof e == "number" ? t.splitText !== void 0 : typeof e.nodeName == "string" ? !t._componentConstructor && ul(t, e.nodeName) : n || t._componentConstructor === e.nodeName;
}
function ul(t, e) {
  return t.normalizedNodeName === e || t.nodeName.toLowerCase() === e.toLowerCase();
}
function cl(t) {
  var e = yt({}, t.attributes);
  e.children = t.children;
  var n = t.nodeName.defaultProps;
  if (n !== void 0)
    for (var r in n)
      e[r] === void 0 && (e[r] = n[r]);
  return e;
}
function Ig(t, e) {
  var n = e ? document.createElementNS("http://www.w3.org/2000/svg", t) : document.createElement(t);
  return n.normalizedNodeName = t, n;
}
function ps(t) {
  var e = t.parentNode;
  e && e.removeChild(t);
}
function xa(t, e, n, r, i) {
  if (e === "className" && (e = "class"), e !== "key") if (e === "ref")
    on(n, null), on(r, t);
  else if (e === "class" && !i)
    t.className = r || "";
  else if (e === "style") {
    if ((!r || typeof r == "string" || typeof n == "string") && (t.style.cssText = r || ""), r && typeof r == "object") {
      if (typeof n != "string")
        for (var s in n)
          s in r || (t.style[s] = "");
      for (var s in r)
        t.style[s] = typeof r[s] == "number" && Ng.test(s) === !1 ? r[s] + "px" : r[s];
    }
  } else if (e === "dangerouslySetInnerHTML")
    r && (t.innerHTML = r.__html || "");
  else if (e[0] == "o" && e[1] == "n") {
    var a = e !== (e = e.replace(/Capture$/, ""));
    e = e.toLowerCase().substring(2), r ? n || t.addEventListener(e, Sa, a) : t.removeEventListener(e, Sa, a), (t._listeners || (t._listeners = {}))[e] = r;
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
function Sa(t) {
  return this._listeners[t.type](je.event && je.event(t) || t);
}
var hl = [], Ri = 0, vt = !1, Cr = !1;
function fl() {
  for (var t; t = hl.shift(); )
    je.afterMount && je.afterMount(t), t.componentDidMount && t.componentDidMount();
}
function dl(t, e, n, r, i, s) {
  Ri++ || (vt = i != null && i.ownerSVGElement !== void 0, Cr = t != null && !("__preactattr_" in t));
  var a = pl(t, e, n, r, s);
  return i && a.parentNode !== i && i.appendChild(a), --Ri || (Cr = !1, s || fl()), a;
}
function pl(t, e, n, r, i) {
  var s = t, a = vt;
  if ((e == null || typeof e == "boolean") && (e = ""), typeof e == "string" || typeof e == "number")
    return t && t.splitText !== void 0 && t.parentNode && (!t._component || i) ? t.nodeValue != e && (t.nodeValue = e) : (s = document.createTextNode(e), t && (t.parentNode && t.parentNode.replaceChild(s, t), It(t, !0))), s.__preactattr_ = !0, s;
  var l = e.nodeName;
  if (typeof l == "function")
    return Pg(t, e, n, r);
  if (vt = l === "svg" ? !0 : l === "foreignObject" ? !1 : vt, l = String(l), (!t || !ul(t, l)) && (s = Ig(l, vt), t)) {
    for (; t.firstChild; )
      s.appendChild(t.firstChild);
    t.parentNode && t.parentNode.replaceChild(s, t), It(t, !0);
  }
  var u = s.firstChild, h = s.__preactattr_, p = e.children;
  if (h == null) {
    h = s.__preactattr_ = {};
    for (var m = s.attributes, g = m.length; g--; )
      h[m[g].name] = m[g].value;
  }
  return !Cr && p && p.length === 1 && typeof p[0] == "string" && u != null && u.splitText !== void 0 && u.nextSibling == null ? u.nodeValue != p[0] && (u.nodeValue = p[0]) : (p && p.length || u != null) && Og(s, p, n, r, Cr || h.dangerouslySetInnerHTML != null), Lg(s, e.attributes, h), vt = a, s;
}
function Og(t, e, n, r, i) {
  var s = t.childNodes, a = [], l = {}, u = 0, h = 0, p = s.length, m = 0, g = e ? e.length : 0, _, E, c, w, T;
  if (p !== 0)
    for (var A = 0; A < p; A++) {
      var b = s[A], S = b.__preactattr_, x = g && S ? b._component ? b._component.__key : S.key : null;
      x != null ? (u++, l[x] = b) : (S || (b.splitText !== void 0 ? !i || b.nodeValue.trim() : i)) && (a[m++] = b);
    }
  if (g !== 0)
    for (var A = 0; A < g; A++) {
      w = e[A], T = null;
      var x = w.key;
      if (x != null)
        u && l[x] !== void 0 && (T = l[x], l[x] = void 0, u--);
      else if (h < m) {
        for (_ = h; _ < m; _++)
          if (a[_] !== void 0 && Ag(E = a[_], w, i)) {
            T = E, a[_] = void 0, _ === m - 1 && m--, _ === h && h++;
            break;
          }
      }
      T = pl(T, w, n, r), c = s[A], T && T !== t && T !== c && (c == null ? t.appendChild(T) : T === c.nextSibling ? ps(c) : t.insertBefore(T, c));
    }
  if (u)
    for (var A in l)
      l[A] !== void 0 && It(l[A], !1);
  for (; h <= m; )
    (T = a[m--]) !== void 0 && It(T, !1);
}
function It(t, e) {
  var n = t._component;
  n ? Rr(n) : (t.__preactattr_ != null && on(t.__preactattr_.ref, null), (e === !1 || t.__preactattr_ == null) && ps(t), gl(t));
}
function gl(t) {
  for (t = t.lastChild; t; ) {
    var e = t.previousSibling;
    It(t, !0), t = e;
  }
}
function Lg(t, e, n) {
  var r;
  for (r in n)
    !(e && e[r] != null) && n[r] != null && xa(t, r, n[r], n[r] = void 0, vt);
  for (r in e)
    r !== "children" && r !== "innerHTML" && (!(r in n) || e[r] !== (r === "value" || r === "checked" ? t[r] : n[r])) && xa(t, r, n[r], n[r] = e[r], vt);
}
var Ln = [];
function _l(t, e, n) {
  var r, i = Ln.length;
  for (t.prototype && t.prototype.render ? (r = new t(e, n), Ve.call(r, e, n)) : (r = new Ve(e, n), r.constructor = t, r.render = Fg); i--; )
    if (Ln[i].constructor === t)
      return r.nextBase = Ln[i].nextBase, Ln.splice(i, 1), r;
  return r;
}
function Fg(t, e, n) {
  return this.constructor(t, n);
}
function Er(t, e, n, r, i) {
  t._disable || (t._disable = !0, t.__ref = e.ref, t.__key = e.key, delete e.ref, delete e.key, typeof t.constructor.getDerivedStateFromProps > "u" && (!t.base || i ? t.componentWillMount && t.componentWillMount() : t.componentWillReceiveProps && t.componentWillReceiveProps(e, r)), r && r !== t.context && (t.prevContext || (t.prevContext = t.context), t.context = r), t.prevProps || (t.prevProps = t.props), t.props = e, t._disable = !1, n !== 0 && (n === 1 || je.syncComponentUpdates !== !1 || !t.base ? Br(t, 1, i) : ll(t)), on(t.__ref, t));
}
function Br(t, e, n, r) {
  if (!t._disable) {
    var i = t.props, s = t.state, a = t.context, l = t.prevProps || i, u = t.prevState || s, h = t.prevContext || a, p = t.base, m = t.nextBase, g = p || m, _ = t._component, E = !1, c = h, w, T, A;
    if (t.constructor.getDerivedStateFromProps && (s = yt(yt({}, s), t.constructor.getDerivedStateFromProps(i, s)), t.state = s), p && (t.props = l, t.state = u, t.context = h, e !== 2 && t.shouldComponentUpdate && t.shouldComponentUpdate(i, s, a) === !1 ? E = !0 : t.componentWillUpdate && t.componentWillUpdate(i, s, a), t.props = i, t.state = s, t.context = a), t.prevProps = t.prevState = t.prevContext = t.nextBase = null, t._dirty = !1, !E) {
      w = t.render(i, s, a), t.getChildContext && (a = yt(yt({}, a), t.getChildContext())), p && t.getSnapshotBeforeUpdate && (c = t.getSnapshotBeforeUpdate(l, u));
      var b = w && w.nodeName, S, x;
      if (typeof b == "function") {
        var z = cl(w);
        T = _, T && T.constructor === b && z.key == T.__key ? Er(T, z, 1, a, !1) : (S = T, t._component = T = _l(b, z, a), T.nextBase = T.nextBase || m, T._parentComponent = t, Er(T, z, 0, a, !1), Br(T, 1, n, !0)), x = T.base;
      } else
        A = g, S = _, S && (A = t._component = null), (g || e === 1) && (A && (A._component = null), x = dl(A, w, a, n || !p, g && g.parentNode, !0));
      if (g && x !== g && T !== _) {
        var C = g.parentNode;
        C && x !== C && (C.replaceChild(x, g), S || (g._component = null, It(g, !1)));
      }
      if (S && Rr(S), t.base = x, x && !r) {
        for (var N = t, B = t; B = B._parentComponent; )
          (N = B).base = x;
        x._component = N, x._componentConstructor = N.constructor;
      }
    }
    for (!p || n ? hl.push(t) : E || (t.componentDidUpdate && t.componentDidUpdate(l, u, c), je.afterUpdate && je.afterUpdate(t)); t._renderCallbacks.length; )
      t._renderCallbacks.pop().call(t);
    !Ri && !r && fl();
  }
}
function Pg(t, e, n, r) {
  for (var i = t && t._component, s = i, a = t, l = i && t._componentConstructor === e.nodeName, u = l, h = cl(e); i && !u && (i = i._parentComponent); )
    u = i.constructor === e.nodeName;
  return i && u && (!r || i._component) ? (Er(i, h, 3, n, r), t = i.base) : (s && !l && (Rr(s), t = a = null), i = _l(e.nodeName, h, n), t && !i.nextBase && (i.nextBase = t, a = null), Er(i, h, 1, n, r), t = i.base, a && t !== a && (a._component = null, It(a, !1))), t;
}
function Rr(t) {
  je.beforeUnmount && je.beforeUnmount(t);
  var e = t.base;
  t._disable = !0, t.componentWillUnmount && t.componentWillUnmount(), t.base = null;
  var n = t._component;
  n ? Rr(n) : e && (e.__preactattr_ != null && on(e.__preactattr_.ref, null), t.nextBase = e, ps(e), Ln.push(t), gl(e)), on(t.__ref, null);
}
function Ve(t, e) {
  this._dirty = !0, this.context = e, this.props = t, this.state = this.state || {}, this._renderCallbacks = [];
}
yt(Ve.prototype, {
  setState: function(e, n) {
    this.prevState || (this.prevState = this.state), this.state = yt(yt({}, this.state), typeof e == "function" ? e(this.state, this.props) : e), n && this._renderCallbacks.push(n), ll(this);
  },
  forceUpdate: function(e) {
    e && this._renderCallbacks.push(e), Br(this, 2);
  },
  render: function() {
  }
});
function Bg(t, e, n) {
  return dl(n, t, {}, !1, e, !1);
}
class Rg extends Ve {
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
  Bg(
    /* @__PURE__ */ k(
      Rg,
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
class Ma extends Ve {
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
class tr extends Ve {
  setUpDrag() {
    if (ze(this.base).select(".pickerBox").on("mousedown.drag", null), !this.props.disabled) {
      const e = tt().on("start", () => {
        this.props.focus && this.props.focus();
      }).on("drag", () => {
        this.props.type !== "value" && this.props.onChange && this.props.onChange("type", "value");
        const n = this.props.value + X.dx / this.props.trackWidth * (this.props.max - this.props.min), r = Math.max(
          this.props.min,
          Math.min(
            this.props.max,
            n
          )
        );
        this.props.onChange("value", r);
      }).container(() => this.base.parentNode.parentNode);
      ze(this.base).select(".pickerBox").call(e);
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
var zn = { exports: {} }, bi, ka;
function Ug() {
  if (ka) return bi;
  ka = 1;
  var t = function(e, n, r, i, s, a, l, u) {
    if (process.env.NODE_ENV !== "production" && n === void 0)
      throw new Error("invariant requires an error message argument");
    if (!e) {
      var h;
      if (n === void 0)
        h = new Error(
          "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
        );
      else {
        var p = [r, i, s, a, l, u], m = 0;
        h = new Error(
          n.replace(/%s/g, function() {
            return p[m++];
          })
        ), h.name = "Invariant Violation";
      }
      throw h.framesToPop = 1, h;
    }
  };
  return bi = t, bi;
}
var Ca;
function Wg() {
  if (Ca) return zn.exports;
  Ca = 1;
  var t = Ug(), e = Object.prototype.hasOwnProperty, n = Array.prototype.splice, r = Object.prototype.toString, i = function(b) {
    return r.call(b).slice(8, -1);
  }, s = Object.assign || /* istanbul ignore next */
  function(S, x) {
    return a(x).forEach(function(z) {
      e.call(x, z) && (S[z] = x[z]);
    }), S;
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
      var S = Object.getPrototypeOf(b);
      return s(Object.create(S), b);
    } else
      return b;
  }
  function u() {
    var b = s({}, h);
    return S.extend = function(x, z) {
      b[x] = z;
    }, S.isEquals = function(x, z) {
      return x === z;
    }, S;
    function S(x, z) {
      typeof z == "function" && (z = { $apply: z }), Array.isArray(x) && Array.isArray(z) || t(
        !Array.isArray(z),
        "update(): You provided an invalid spec to update(). The spec may not contain an array except as the value of $set, $push, $unshift, $splice or any custom command allowing an array value."
      ), t(
        typeof z == "object" && z !== null,
        "update(): You provided an invalid spec to update(). The spec and every included key path must be plain objects containing one of the following commands: %s.",
        Object.keys(b).join(", ")
      );
      var C = x;
      return a(z).forEach(function(N) {
        if (e.call(b, N)) {
          var B = x === C;
          C = b[N](z[N], C, z, x), B && S.isEquals(C, x) && (C = x);
        } else {
          var V = i(x) === "Map" ? S(x.get(N), z[N]) : S(x[N], z[N]), R = i(C) === "Map" ? C.get(N) : C[N];
          (!S.isEquals(V, R) || typeof V > "u" && !e.call(x, N)) && (C === x && (C = l(x)), i(C) === "Map" ? C.set(N, V) : C[N] = V);
        }
      }), C;
    }
  }
  var h = {
    $push: function(b, S, x) {
      return m(S, x, "$push"), b.length ? S.concat(b) : S;
    },
    $unshift: function(b, S, x) {
      return m(S, x, "$unshift"), b.length ? b.concat(S) : S;
    },
    $splice: function(b, S, x, z) {
      return _(S, x), b.forEach(function(C) {
        E(C), S === z && C.length && (S = l(z)), n.apply(S, C);
      }), S;
    },
    $set: function(b, S, x) {
      return w(x), b;
    },
    $toggle: function(b, S) {
      g(b, "$toggle");
      var x = b.length ? l(S) : S;
      return b.forEach(function(z) {
        x[z] = !S[z];
      }), x;
    },
    $unset: function(b, S, x, z) {
      return g(b, "$unset"), b.forEach(function(C) {
        Object.hasOwnProperty.call(S, C) && (S === z && (S = l(z)), delete S[C]);
      }), S;
    },
    $add: function(b, S, x, z) {
      return A(S, "$add"), g(b, "$add"), i(S) === "Map" ? b.forEach(function(C) {
        var N = C[0], B = C[1];
        S === z && S.get(N) !== B && (S = l(z)), S.set(N, B);
      }) : b.forEach(function(C) {
        S === z && !S.has(C) && (S = l(z)), S.add(C);
      }), S;
    },
    $remove: function(b, S, x, z) {
      return A(S, "$remove"), g(b, "$remove"), b.forEach(function(C) {
        S === z && S.has(C) && (S = l(z)), S.delete(C);
      }), S;
    },
    $merge: function(b, S, x, z) {
      return T(S, b), a(b).forEach(function(C) {
        b[C] !== S[C] && (S === z && (S = l(z)), S[C] = b[C]);
      }), S;
    },
    $apply: function(b, S) {
      return c(b), b(S);
    }
  }, p = u();
  zn.exports = p, zn.exports.default = p, zn.exports.newContext = u;
  function m(b, S, x) {
    t(
      Array.isArray(b),
      "update(): expected target of %s to be an array; got %s.",
      x,
      b
    ), g(S[x], x);
  }
  function g(b, S) {
    t(
      Array.isArray(b),
      "update(): expected spec of %s to be an array; got %s. Did you forget to wrap your parameter in an array?",
      S,
      b
    );
  }
  function _(b, S) {
    t(
      Array.isArray(b),
      "Expected $splice target to be an array; got %s",
      b
    ), E(S.$splice);
  }
  function E(b) {
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
  function T(b, S) {
    t(
      S && typeof S == "object",
      "update(): $merge expects a spec of type 'object'; got %s",
      S
    ), t(
      b && typeof b == "object",
      "update(): $merge expects a target of type 'object'; got %s",
      b
    );
  }
  function A(b, S) {
    var x = i(b);
    t(
      x === "Map" || x === "Set",
      "update(): %s expects a target of type Set or Map; got %s",
      S,
      x
    );
  }
  return zn.exports;
}
var $g = Wg();
const Vt = /* @__PURE__ */ ln($g), Ht = 400;
class Ea extends Ve {
  /**
   * Sorts the color scale for makeGradient
   */
  sortScale() {
    return Q.sortBy(this.props.scale, (n) => n.type === "value" ? n.value : this.props.stats[n.type]);
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
    n === "type" && r !== "value" ? (i = Vt(this.props.scale, {
      [e]: {
        [n]: { $set: r },
        $unset: ["value"]
      }
    }), this.props.onChange(i)) : n === "value" && this.props.scale[e].type !== "value" ? (i = Vt(this.props.scale, {
      [e]: {
        [n]: { $set: r },
        type: { $set: "value" }
      }
    }), this.props.onChange(i)) : r === "value" ? (i = Vt(this.props.scale, {
      [e]: {
        [n]: { $set: r },
        $merge: { value: this.props.stats[this.props.scale[e].type] }
      }
    }), this.props.onChange(i)) : (!isNaN(parseFloat(r)) || r[0] === "#" && n === "color") && (i = Vt(this.props.scale, {
      [e]: {
        [n]: { $set: r }
      }
    }), this.props.onChange(i));
  }
  addColorStop(e) {
    const n = Vt(this.props.scale, {
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
    const n = Vt(this.props.scale, { $splice: [[[e], 1]] });
    this.props.onChange(n);
  }
  render() {
    if (!this.props.stats)
      return /* @__PURE__ */ k("div", { className: "scaleEditor" }, /* @__PURE__ */ k("div", null, /* @__PURE__ */ k(
        "div",
        {
          className: "scaleTrack disabled",
          style: { width: Ht }
        },
        this.props.type,
        " data not loaded",
        /* @__PURE__ */ k(tr, { location: 0, trackWidth: Ht, disabled: !0 }),
        /* @__PURE__ */ k(tr, { location: 1, trackWidth: Ht, disabled: !0 })
      )), /* @__PURE__ */ k("div", { className: "scaleLabels" }, /* @__PURE__ */ k("label", null, "Value:"), /* @__PURE__ */ k("label", null, "Color:"), /* @__PURE__ */ k("label", null, "Size:")), /* @__PURE__ */ k("div", { className: "noDataStyle" }, /* @__PURE__ */ k("label", { className: "styleHeader" }, "Styles for reactions with no data"), /* @__PURE__ */ k("br", null), /* @__PURE__ */ k("label", null, "Color:"), /* @__PURE__ */ k("input", { type: "text", className: "colorInput", disabled: !0 }), /* @__PURE__ */ k("input", { type: "color", className: "colorWheel", disabled: !0 }), /* @__PURE__ */ k("label", null, "Size:"), /* @__PURE__ */ k("input", { type: "text", className: "sizeInput", disabled: !0 })));
    const {
      pickerLocations: e,
      absoluteMax: n,
      absoluteMin: r
    } = this.placePickers(), i = this.props.scale.map((s, a) => {
      if (s.type !== "value")
        return /* @__PURE__ */ k(
          tr,
          {
            trackWidth: Ht,
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
          tr,
          {
            trackWidth: Ht,
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
        style: { width: Ht }
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
class za extends Ve {
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
class qg extends Ve {
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
          const i = "label", s = Q.contains(n, i) ? Q.filter(n, (a) => a !== i) : [...n, i];
          e.set("enable_tooltips", s);
        },
        checked: Q.contains(n, "label")
      }
    ), "Labels"), /* @__PURE__ */ k("label", { className: "tooltipOption", title: "If checked, tooltips will display over the reaction line segments and metabolite circles" }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        onClick: () => {
          const i = "object", s = Q.contains(n, i) ? Q.filter(n, (a) => a !== i) : [...n, i];
          e.set("enable_tooltips", s);
        },
        checked: Q.contains(n, "object")
      }
    ), "Objects"))))), /* @__PURE__ */ k("div", { className: "settingsTip", style: { marginTop: "16px" } }, /* @__PURE__ */ k("i", null, "Tip: To increase map performance, turn off text boxes (i.e. labels and gene reaction rules).")), /* @__PURE__ */ k("hr", null), /* @__PURE__ */ k("div", { className: "scaleTitle" }, /* @__PURE__ */ k("div", { className: "title" }, "Reactions"), /* @__PURE__ */ k(Ma, { disabled: r.reaction === null }, Object.values(Q.mapObject(Xt, (i, s) => /* @__PURE__ */ k(
      za,
      {
        name: s,
        scale: i,
        onClick: () => {
          e.set("reaction_scale_preset", s);
        }
      }
    ))))), /* @__PURE__ */ k(
      Ea,
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
          checked: Q.contains(e.get("reaction_styles"), "abs"),
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
          checked: Q.contains(e.get("reaction_styles"), "size"),
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
        checked: Q.contains(e.get("reaction_styles"), "color"),
        disabled: r.reaction === null
      }
    ), "Color"), /* @__PURE__ */ k("br", null), /* @__PURE__ */ k("label", { className: "optionGroup", title: "If checked, then show data values in the reaction labels" }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        name: "reactionStyle",
        onClick: () => this.handleStyle("text", "reaction_styles"),
        checked: Q.contains(e.get("reaction_styles"), "text"),
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
    )), /* @__PURE__ */ k("hr", null), /* @__PURE__ */ k("div", { className: "scaleTitle" }, /* @__PURE__ */ k("div", { className: "title" }, "Metabolites"), /* @__PURE__ */ k(Ma, { disabled: r.metabolite === null }, Object.values(Q.mapObject(Xt, (i, s) => /* @__PURE__ */ k(
      za,
      {
        name: s,
        scale: i,
        onClick: () => e.set("metabolite_scale", i)
      }
    ))))), /* @__PURE__ */ k(
      Ea,
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
        abs: Q.contains(e.get("metabolite_styles"), "abs")
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
          checked: Q.contains(e.get("metabolite_styles"), "abs"),
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
          checked: Q.contains(e.get("metabolite_styles"), "size"),
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
        checked: Q.contains(e.get("metabolite_styles"), "color"),
        disabled: r.metabolite === null
      }
    ), "Color"), /* @__PURE__ */ k("br", null), /* @__PURE__ */ k("label", { className: "optionGroup", title: "If checked, then show data values in the metabolite labels" }, /* @__PURE__ */ k(
      "input",
      {
        type: "checkbox",
        name: "metaboliteStyle",
        onClick: () => this.handleStyle("text", "metabolite_styles"),
        checked: Q.contains(e.get("metabolite_styles"), "text"),
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
class Tn extends Ve {
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
class Me extends Ve {
  constructor(e) {
    super(e), this.assignKeyForInput = this.assignKeyForInput.bind(this);
  }
  handleFileInput(e) {
    const n = e.files[0], r = new window.FileReader();
    r.onload = () => {
      ge.load_json_or_csv(n, rh, (i, s) => this.props.onClick(s));
    }, n !== void 0 && r.readAsText(n), e.value = null;
  }
  assignKeyForInput(e) {
    this.props.assignKey && this.props.assignKey(() => e.click());
  }
  render() {
    const e = Q.contains(this.props.disabledButtons, this.props.name.replace(/ \(.*\)$/, ""));
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
class Vg extends Ve {
  componentWillMount() {
    this.props.sel.selectAll(".escher-zoom-container").on("touchend.menuBar", () => this.setState({ dropdownVisible: !1 })).on("click.menuBar", () => this.setState({ dropdownVisible: !1 }));
  }
  componentWillUnmount() {
    this.props.sel.selectAll(".escher-zoom-container").on("touchend.menuBar", null).on("click.menuBar", null);
  }
  render() {
    const e = this.props.settings.get("enable_keys"), n = this.props.settings.get("disabled_buttons"), r = this.props.map.beziers_enabled, i = this.props.settings.get("full_screen_button");
    return /* @__PURE__ */ k("ul", { className: "menu-bar" }, /* @__PURE__ */ k(Tn, { name: "Map", dropdownVisible: this.props.dropdownVisible }, /* @__PURE__ */ k(
      Me,
      {
        name: "Save map JSON" + (e ? " (Ctrl+S)" : ""),
        onClick: () => this.props.saveMap(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: "Load map JSON" + (e ? " (Ctrl+O)" : ""),
        onClick: (s) => this.props.loadMap(s),
        assignKey: this.props.assignKeyLoadMap,
        type: "load",
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: "Export as SVG" + (e ? " (Ctrl+Shift+S)" : ""),
        onClick: () => this.props.save_svg(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: "Export as PNG" + (e ? " (Ctrl+Shift+P)" : ""),
        onClick: () => this.props.save_png(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: "Clear map",
        onClick: () => this.props.clear_map(),
        disabledButtons: n
      }
    )), /* @__PURE__ */ k(Tn, { name: "Model", dropdownVisible: this.props.dropdownVisible }, /* @__PURE__ */ k(
      Me,
      {
        name: "Load COBRA model JSON" + (e ? " (Ctrl+M)" : ""),
        onClick: (s) => this.props.loadModel(s),
        assignKey: this.props.assignKeyLoadModel,
        type: "load",
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: "Update names and gene reaction rules using model",
        onClick: () => this.props.updateRules(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: "Clear model",
        onClick: () => this.props.clearModel(),
        disabledButtons: n
      }
    )), /* @__PURE__ */ k(Tn, { name: "Data", dropdownVisible: this.props.dropdownVisible }, /* @__PURE__ */ k(
      Me,
      {
        name: "Load reaction data",
        onClick: (s) => this.props.setReactionData(s),
        type: "load",
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: "Clear reaction data",
        onClick: () => this.props.clearReactionData(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k("li", { name: "divider" }), /* @__PURE__ */ k(
      Me,
      {
        name: "Load gene data",
        onClick: (s) => this.props.setGeneData(s),
        type: "load",
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: "Clear gene data",
        onClick: () => this.props.clearGeneData(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k("li", { name: "divider" }), /* @__PURE__ */ k(
      Me,
      {
        name: "Load metabolite data",
        onClick: (s) => this.props.setMetaboliteData(s),
        type: "load",
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: "Clear metabolite data",
        onClick: () => this.props.clearMetaboliteData(),
        disabledButtons: n
      }
    )), /* @__PURE__ */ k(
      Tn,
      {
        name: "Edit",
        rightMenu: "true",
        dropdownVisible: this.props.dropdownVisible,
        disabledEditing: !this.props.settings.get("enable_editing")
      },
      /* @__PURE__ */ k(
        Me,
        {
          name: "Pan mode" + (e ? " (Z)" : ""),
          checkMark: this.props.mode === "zoom",
          onClick: () => this.props.setMode("zoom"),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Select mode" + (e ? " (V)" : ""),
          checkMark: this.props.mode === "brush",
          onClick: () => this.props.setMode("brush"),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Add reaction mode" + (e ? " (N)" : ""),
          checkMark: this.props.mode === "build",
          onClick: () => this.props.setMode("build"),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Rotate mode" + (e ? " (R)" : ""),
          checkMark: this.props.mode === "rotate",
          onClick: () => this.props.setMode("rotate"),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Text mode" + (e ? " (T)" : ""),
          checkMark: this.props.mode === "text",
          onClick: () => this.props.setMode("text"),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k("li", { name: "divider" }),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Delete" + (e ? " (Del)" : ""),
          onClick: () => this.props.deleteSelected(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Undo" + (e ? " (Ctrl+Z)" : ""),
          onClick: () => this.props.undo(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Redo" + (e ? " (Ctrl+Shift+Z)" : ""),
          onClick: () => this.props.redo(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k("li", { name: "divider" }),
      /* @__PURE__ */ k(
        Me,
        {
          name: `Align vertical${e ? " (Alt+L)" : ""}`,
          onClick: this.props.align_vertical,
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Me,
        {
          name: `Align horizontal${e ? " (Shift+Alt+L)" : ""}`,
          onClick: this.props.align_horizontal,
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Toggle primary/secondary" + (e ? " (P)" : ""),
          onClick: () => this.props.togglePrimary(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Rotate reactant locations" + (e ? " (C)" : ""),
          onClick: () => this.props.cyclePrimary(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k("li", { name: "divider" }),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Select all" + (e ? " (Ctrl+A)" : ""),
          onClick: () => this.props.selectAll(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Select none" + (e ? " (Ctrl+Shift+A)" : ""),
          onClick: () => this.props.selectNone(),
          disabledButtons: n
        }
      ),
      /* @__PURE__ */ k(
        Me,
        {
          name: "Invert selection",
          onClick: () => this.props.invertSelection(),
          disabledButtons: n
        }
      )
    ), /* @__PURE__ */ k(Tn, { name: "View", rightMenu: "true", dropdownVisible: this.props.dropdownVisible }, /* @__PURE__ */ k(
      Me,
      {
        name: `Zoom in${e ? " (+)" : ""}`,
        onClick: () => this.props.zoom_in(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: `Zoom out${e ? " (-)" : ""}`,
        onClick: () => this.props.zoom_out(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: `Zoom to nodes${e ? " (0)" : ""}`,
        onClick: () => this.props.zoomExtentNodes(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: `Zoom to canvas${e ? " (1)" : ""}`,
        onClick: () => this.props.zoomExtentCanvas(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: `Find${e ? " (F)" : ""}`,
        onClick: () => this.props.search(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k(
      Me,
      {
        name: `${r ? "Hide" : "Show"} control points${e ? " (B)" : ""}`,
        onClick: () => this.props.toggleBeziers(),
        disabledButtons: n
      }
    ), /* @__PURE__ */ k("li", { name: "divider" }), i && /* @__PURE__ */ k(
      Me,
      {
        name: "Full screen",
        onClick: () => this.props.full_screen(),
        checkMark: this.props.isFullScreen,
        disabledButtons: n
      }
    ), i && /* @__PURE__ */ k("li", { name: "divider" }), /* @__PURE__ */ k(
      Me,
      {
        name: `Settings${e ? " (,)" : ""}`,
        onClick: () => this.props.renderSettingsMenu(),
        disabledButtons: n,
        type: "settings"
      }
    )), /* @__PURE__ */ k("a", { className: "helpButton", target: "#", href: "https://escher.readthedocs.org" }, "?"));
  }
}
class Hg extends Ve {
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
    return Q.uniq(e, (r) => {
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
class Yg extends Ve {
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
class Gg {
  constructor(e, n, r, i, s) {
    this.div = e.append("div").attr("id", "tooltip-container"), this.tooltipRef = null, this.zoomContainer = r, this.setUpZoomCallbacks(r), this.callbackManager = new hn(), this.div.on("mouseover", this.cancelHideTooltip.bind(this)), this.div.on("mouseleave", this.hide.bind(this)), this.map = i, this.setUpMapCallbacks(i), this.settings = s, this.delay_hide_timeout = null, this.currentTooltip = null, Fn(
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
    this.placedDiv = Tr(this.div, e, void 0, !1), e.callback_manager.set("show_tooltip.tooltip_container", (n, r) => {
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
    if (this.cancelHideTooltip(), Q.contains(["reaction_label", "node_label", "gene_label", "reaction_object", "node_object"], e)) {
      const r = this.tooltipRef !== null && this.tooltipRef.get_size ? this.tooltipRef.get_size() : { width: 270, height: 100 };
      this.currentTooltip = { type: e, id: n[e.replace("_label", "_id").replace("_object", "_id")] };
      const i = this.zoomContainer.windowTranslate, s = this.zoomContainer.windowScale, a = this.map !== null ? this.map.get_size() : { width: 1e3, height: 1e3 }, l = { x: 0, y: 0 }, u = e === "reaction_object" ? n.xPos : n.label_x, h = e === "reaction_object" ? n.yPos : n.label_y, p = s * u + i.x + r.width, m = s * h + i.y + r.height;
      a.width < 500 ? (p > a.width && (l.x = -(p - a.width) / s), m > a.height - 74 && (l.y = -(m - a.height + 77) / s)) : (s * u + i.x + 0.5 * r.width > a.width ? l.x = -r.width / s : p > a.width && (l.x = -(p - a.width) / s), s * h + i.y + 0.5 * r.height > a.height - 45 ? l.y = -r.height / s : m > a.height - 45 && (l.y = -(m - a.height + 47) / s));
      const g = { x: u + l.x, y: h + 10 + l.y };
      this.placedDiv.place(g), this.passProps({
        display: !0,
        biggId: n.bigg_id,
        name: n.name,
        loc: g,
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
class Xg extends Ve {
  constructor() {
    super(), this.openBigg = this.openBigg.bind(this);
  }
  decompartmentalizeCheck(e, n) {
    return n === "metabolite" ? dr(e)[0] : e;
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
const ml = `svg.escher-svg #mouse-node {
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
class Kg {
  constructor(e, n, r, i, s) {
    i ? i instanceof Ot || ("node" in i ? i = ze(i.node()) : i = ze(i)) : i = ze("body").append("div"), s || (s = {}), r || (r = ml), this.map_data = e, this.model_data = n, this.embeddedCss = r, this.selection = i, this.menu_div = null, this.button_div = null, this.search_bar_div = null, this.searchBarRef = null, this.semanticOptions = null, this.mode = "zoom", this.selection.datum(this), this.selection.__builder__ = this, this.has_custom_reaction_styles = !!s.reaction_styles;
    const a = Xa(s, {
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
      tooltip_component: Xg,
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
    if (ho(this.selection, "svg"))
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
    this.settings = new Cg(a, l), this.settings.get("fill_screen") && this.settings.get("full_screen_button") && (this.settings.set("full_screen_button", !1), console.warn("The option full_screen_button has no effect when fill_screen is true")), this.isFullScreen = !1, this.settings.get("fill_screen") && (ze("html").classed("fill-screen", !0), ze("body").classed("fill-screen", !0), this.selection.classed("fill-screen-div", !0), this.isFullScreen = !0), this.savedFullScreenSettings = null, this.savedFullScreenParent = null, this.clearFullScreenEscape = null, this.callback_manager = new hn();
    const u = this.settings.get("first_load_callback");
    u !== null && this.callback_manager.set("first_load", () => {
      u(this);
    }), this.zoom_container = new id(
      this.selection,
      this.settings.get("scroll_behavior"),
      this.settings.get("use_3d_transform")
    ), this.zoom_container.callbackManager.set("zoom_change", () => {
      if (this.settings.get("semantic_zoom")) {
        const p = this.zoom_container.windowScale, m = this.settings.get("semantic_zoom").sort((g, _) => g.zoomLevel - _.zoomLevel).find((g) => g.zoomLevel > p);
        if (m) {
          let g = !1;
          Q.mapObject(m.options, (_, E) => {
            this.settings.get(E) !== _ && (this.settings.set(E, _), g = !0);
          }), g && this._updateData(!1, !0);
        }
      }
    }), this.settings.streams.use_3d_transform.onValue((p) => {
      this.zoom_container.setUse3dTransform(p);
    }), this.settings.streams.scroll_behavior.onValue((p) => {
      this.zoom_container.setScrollBehavior(p);
    }), this.settings.streams.enable_tooltips.onValue((p) => {
      this._updateTooltipSetting(p);
    }), this.mapToolsContainer = this.selection.append("div").attr("class", "map-tools-container"), this._createStatus(this.selection), this.load_model(this.model_data, !1);
    var h = this.selection.append("div").attr("class", "search-menu-container").append("div").attr("class", "search-menu-container-inline");
    this.menu_div = h.append("div"), this.search_bar_div = h.append("div"), this.button_div = this.selection.append("div"), Q.delay(() => {
      this.load_map(this.map_data, !1);
      const p = this._reactionCheckAddAbs();
      this._updateData(!0, !0), this.settings.statusBus.onValue((m) => {
        if (m === "accept") {
          if (this._updateData(!0, !0, ["reaction", "metabolite"], !1), this.zoom_container !== null) {
            const g = this.settings.get("scroll_behavior");
            this.zoom_container.setScrollBehavior(g);
          }
          this.map !== null && (this.map.draw_all_nodes(!1), this.map.draw_all_reactions(!0, !1), this.map.select_none());
        }
      }), p !== null && setTimeout(p, 500), Q.defer(() => this.callback_manager.run("first_load", this));
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
    Q.isNull(e) ? this.cobra_model = null : this.cobra_model = cn.from_cobra_json(e), this.map && (this.map.cobra_model = this.cobra_model, n && this._updateData(!0, !1), this.settings.get("highlight_missing") && this.map.draw_all_reactions(!1, !1)), this.callback_manager.run("load_model", null, e, n);
  }
  /**
   * For documentation of this function, see docs/javascript_api.rst
   */
  load_map(e, n = !0) {
    const r = {};
    if (this.settings.get("semantic_zoom")) {
      for (let u of this.settings.get("semantic_zoom"))
        Object.keys(u.options).map((h) => {
          r[h] === void 0 && (r[h] = this.settings.get(h));
        });
      this.semanticOptions = Object.assign({}, r);
    }
    wi(this.zoom_container.zoomedSel), wi(this.mapToolsContainer);
    const i = this.zoom_container.zoomedSel, s = this.zoom_container.svg;
    this.map && this.map.key_manager.toggle(!1), e !== null ? this.map = pa.from_data(
      e,
      s,
      this.embeddedCss,
      i,
      this.zoom_container,
      this.settings,
      this.cobra_model,
      this.settings.get("enable_search")
    ) : this.map = new pa(
      s,
      this.embeddedCss,
      i,
      this.zoom_container,
      this.settings,
      this.cobra_model,
      this.settings.get("canvas_size_and_loc"),
      this.settings.get("enable_search")
    ), this._setupStatus(this.map), this.map.set_status("Loading map ..."), this._updateTooltipSetting(this.settings.get("enable_tooltips")), n && this._updateData(!1, !0), this.build_input = new fh(
      this.mapToolsContainer,
      this.map,
      this.zoom_container,
      this.settings
    ), this.text_edit_input = new Eg(
      this.mapToolsContainer,
      this.map,
      this.zoom_container
    ), this.brush = new Mg(i, !1, this.map, ".canvas-group"), this.map.canvas.callbackManager.set("resize", () => {
      this.mode === "brush" && this.brush.toggle(!0);
    }), this.setUpSettingsMenu(this.mapToolsContainer), this.setUpButtonPanel(this.mapToolsContainer);
    const a = this.mapToolsContainer.append("div").attr("class", "search-menu-container").append("div").attr("class", "search-menu-container-inline");
    this.setUpMenuBar(a), this.setUpSearchBar(a), this.tooltip_container = new Gg(
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
      const u = this.settings.get("zoom_to_element").type, h = this.settings.get("zoom_to_element").id;
      if (Q.isUndefined(u) || ["reaction", "node"].indexOf(u) === -1)
        throw new Error('zoom_to_element type must be "reaction" or "node"');
      if (Q.isUndefined(h))
        throw new Error("zoom_to_element must include id");
      u === "reaction" ? this.map.zoom_to_reaction(h) : u === "node" && this.map.zoom_to_node(h);
    } else if (e)
      this.map.zoom_extent_canvas();
    else if (this.settings.get("starting_reaction") && this.cobra_model !== null) {
      const u = this.zoom_container.get_size(), h = { x: u.width / 2, y: u.height / 4 };
      this.map.new_reaction_from_scratch(
        this.settings.get("starting_reaction"),
        h,
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
      qg,
      (n) => {
        this.settingsMenuRef = n;
      },
      (n) => this.map.callback_manager.set("pass_props_settings_menu", n),
      e.append("div").node()
    ), this.passPropsSettingsMenu({
      display: !1,
      settings: this.settings,
      map: this.map
    }), Q.mapObject(this.settings.streams, (n, r) => {
      n.onValue((i) => {
        this.passPropsSettingsMenu();
      });
    }), this.settings.streams.reaction_styles.map((n) => Q.contains(n, "abs")).skipDuplicates().onValue(() => this._updateData(!1, !0)), this.settings.streams.metabolite_styles.map((n) => Q.contains(n, "abs")).skipDuplicates().onValue(() => this._updateData(!1, !0));
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
      Vg,
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
      Hg,
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
      Yg,
      null,
      (n) => this.map.callback_manager.set("pass_props_button_panel", n),
      e.append("div").node()
    ), this.passPropsButtonPanel({
      display: Q.contains(["all", "zoom"], this.settings.get("menu")),
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
    return this.settings.get("reaction_data") && !this.has_custom_reaction_styles && !Q.contains(e, "abs") ? (this.settings.set("reaction_styles", e.concat("abs")), () => {
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
    return n !== null && st(i, n.reactions), r !== null && st(i, r.reactions, !0), yn(e, "gene_data", i);
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
    const s = Q.contains(r, "reaction"), a = Q.contains(r, "metabolite");
    let l, u, h;
    a && n && this.map !== null && (l = yn(
      this.settings.get("metabolite_data"),
      "metabolite_data"
    ), this.map.apply_metabolite_data_to_map(l), i && this.map.draw_all_nodes(!1)), s && (this.settings.get("reaction_data") && n && this.map !== null ? (u = yn(
      this.settings.get("reaction_data"),
      "reaction_data"
    ), this.map.apply_reaction_data_to_map(u), i && this.map.draw_all_reactions(!1, !1)) : this.settings.get("gene_data") && n && this.map !== null ? (h = this._makeGeneDataObject(
      this.settings.get("gene_data"),
      this.cobra_model,
      this.map
    ), this.map.apply_gene_data_to_map(h), i && this.map.draw_all_reactions(!1, !1)) : n && this.map !== null && (this.map.apply_reaction_data_to_map(null), i && this.map.draw_all_reactions(!1, !1))), this.update_model_timer && clearTimeout(this.update_model_timer);
    const p = 5;
    this.update_model_timer = setTimeout(() => {
      a && e && this.cobra_model !== null && (l || (l = yn(
        this.settings.get("metabolite_data"),
        "metabolite_data"
      )), this.cobra_model.apply_metabolite_data(
        l,
        this.settings.get("metabolite_styles"),
        this.settings.get("metabolite_compare_style")
      )), s && (this.settings.get("reaction_data") && e && this.cobra_model !== null ? (u || (u = yn(
        this.settings.get("reaction_data"),
        "reaction_data"
      )), this.cobra_model.apply_reaction_data(
        u,
        this.settings.get("reaction_styles"),
        this.settings.get("reaction_compare_style")
      )) : this.settings.get("gene_data") && e && this.cobra_model !== null ? (h || (h = this._makeGeneDataObject(
        this.settings.get("gene_data"),
        this.cobra_model,
        this.map
      )), this.cobra_model.apply_gene_data(
        h,
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
      if (ze("html").classed("fill-screen", !1), ze("body").classed("fill-screen", !1), this.selection.classed("fill-screen-div", !1), this.isFullScreen = !1, this.clearFullScreenEscape && (this.clearFullScreenEscape(), this.clearFullScreenEscape = null), this.savedFullScreenParent) {
        const n = this.savedFullScreenParent.node();
        n.insertBefore(this.selection.remove().node(), n.firstChild), this.savedFullScreenParent = null;
      }
      this.savedFullScreenSettings !== null && Q.mapObject(this.savedFullScreenSettings, (n, r) => {
        this.settings.set(r, n);
      }), this.savedFullScreenSettings = null;
    } else {
      const n = this.settings.get("full_screen_button");
      Q.isObject(n) && (this.savedFullScreenSettings = Q.chain(n).pairs().map(([i, s]) => {
        if (Q.contains(e, i)) {
          const a = this.settings.get(i);
          return this.settings.set(i, s), [i, a];
        } else
          return console.warn(`${i} not recognized as an option for full_screen_button`), [null, null];
      }).filter(([i, s]) => i).object().value()), ze("html").classed("fill-screen", !0), ze("body").classed("fill-screen", !0), this.selection.classed("fill-screen-div", !0), this.isFullScreen = !0, this.savedFullScreenParent = ze(this.selection.node().parentNode);
      const r = ze("body").node();
      r.insertBefore(this.selection.remove().node(), r.firstChild), this.clearFullScreenEscape = this.map.key_manager.addEscapeListener(
        () => this.full_screen()
      );
    }
    this.map.zoom_extent_canvas(), this.passPropsButtonPanel({ isFullScreen: this.isFullScreen }), this.passPropsMenuBar({ isFullScreen: this.isFullScreen });
  }
}
const Zg = Za(Kg);
function Jg({ model: t, el: e }) {
  const n = t.get("height");
  e.style.height = n + "px", e.style.display = "block";
  const r = ze(e).append("div");
  r.style("height", n + "px"), r.style("width", "100%");
  const i = (E) => E && E !== "null" ? JSON.parse(E) : null, s = t.get("_options_json"), a = s ? JSON.parse(s) : {};
  let l = 0;
  const u = (E) => ({
    bigg_id: E,
    event_id: ++l
  }), h = (E, c) => {
    c && (t.set(`selected_${E}`, c), t.set(`selected_${E}_event`, u(c)), t.save_changes());
  }, p = (E, c) => {
    c && (t.set(`selected_${E}`, c), t.save_changes());
  }, m = (E) => {
    let c = E;
    for (; c; ) {
      if (c.__data__ && c.__data__.bigg_id) return c.__data__;
      c = c.parentNode;
    }
    return null;
  }, g = (E) => {
    !E.map || !E.map.sel || E.map.sel.selectAll(".reaction-label,.segment").on("click.escher_widget", function(c) {
      const w = c && c.bigg_id ? c : m(this);
      w && h("reaction", w.bigg_id);
    });
  }, _ = new Zg(
    i(t.get("map_json")),
    i(t.get("model_json")),
    ml,
    // scopes CSS inside the widget container for notebook environments
    r,
    {
      ...a,
      reaction_data: i(t.get("reaction_data")),
      metabolite_data: i(t.get("metabolite_data")),
      gene_data: i(t.get("gene_data")),
      first_load_callback: (E) => {
        requestAnimationFrame(() => {
          E.map && E.map.zoom_extent_canvas();
        }), E.map.key_manager.toggle(!1);
        const c = r.node();
        c.addEventListener("mouseenter", () => E.map.key_manager.toggle(!0)), c.addEventListener("mouseleave", () => E.map.key_manager.toggle(!1)), E.map.callback_manager.set("select_selectable", (w, T) => {
          T && T.node_type === "metabolite" && T.bigg_id && h("metabolite", T.bigg_id);
        }), E.map.callback_manager.set("show_tooltip.escher_widget", (w, T) => {
          (w === "reaction_object" || w === "reaction_label") && T && T.bigg_id && p("reaction", T.bigg_id);
        }), g(E), E.map.draw.callback_manager.set("update_reaction.escher_widget", () => {
          g(E);
        }), E.map.draw.callback_manager.set("update_reaction_label.escher_widget", () => {
          g(E);
        });
      }
    }
  );
  t.on("change:height", () => {
    const E = t.get("height");
    e.style.height = E + "px", r.style("height", E + "px"), requestAnimationFrame(() => {
      _.map && _.map.zoom_extent_canvas();
    });
  }), t.on("change:model_json", () => {
    _.load_model(i(t.get("model_json")));
  }), t.on("change:map_json", () => {
    _.load_map(i(t.get("map_json"))), requestAnimationFrame(() => {
      _.map && _.map.zoom_extent_canvas(), g(_);
    });
  }), t.on("change:reaction_data", () => {
    _.set_reaction_data(i(t.get("reaction_data")));
  }), t.on("change:metabolite_data", () => {
    _.set_metabolite_data(i(t.get("metabolite_data")));
  }), t.on("change:gene_data", () => {
    _.set_gene_data(i(t.get("gene_data")));
  });
}
export {
  Jg as render
};
//# sourceMappingURL=escher-widget.js.map
