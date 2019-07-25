/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS =
  CryptoJS ||
  (function(a, d) {
    var b = {},
      c = (b.lib = {}),
      i = (c.Base = (function() {
        function a() {}
        return {
          extend: function(j) {
            a.prototype = this;
            var f = new a();
            j && f.mixIn(j);
            f.$super = this;
            return f;
          },
          create: function() {
            var a = this.extend();
            a.init.apply(a, arguments);
            return a;
          },
          init: function() {},
          mixIn: function(a) {
            for (var u in a) a.hasOwnProperty(u) && (this[u] = a[u]);
            a.hasOwnProperty("toString") && (this.toString = a.toString);
          },
          clone: function() {
            return this.$super.extend(this);
          }
        };
      })()),
      k = (c.WordArray = i.extend({
        init: function(a, j) {
          a = this.words = a || [];
          this.sigBytes = j != d ? j : 4 * a.length;
        },
        toString: function(a) {
          return (a || q).stringify(this);
        },
        concat: function(a) {
          var j = this.words,
            f = a.words,
            e = this.sigBytes,
            a = a.sigBytes;
          this.clamp();
          if (e % 4)
            for (var b = 0; b < a; b++)
              j[(e + b) >>> 2] |=
                ((f[b >>> 2] >>> (24 - 8 * (b % 4))) & 255) <<
                (24 - 8 * ((e + b) % 4));
          else if (65535 < f.length)
            for (b = 0; b < a; b += 4) j[(e + b) >>> 2] = f[b >>> 2];
          else j.push.apply(j, f);
          this.sigBytes += a;
          return this;
        },
        clamp: function() {
          var u = this.words,
            b = this.sigBytes;
          u[b >>> 2] &= 4294967295 << (32 - 8 * (b % 4));
          u.length = a.ceil(b / 4);
        },
        clone: function() {
          var a = i.clone.call(this);
          a.words = this.words.slice(0);
          return a;
        },
        random: function(u) {
          for (var b = [], f = 0; f < u; f += 4)
            b.push((4294967296 * a.random()) | 0);
          return k.create(b, u);
        }
      })),
      x = (b.enc = {}),
      q = (x.Hex = {
        stringify: function(a) {
          for (var b = a.words, a = a.sigBytes, f = [], e = 0; e < a; e++) {
            var c = (b[e >>> 2] >>> (24 - 8 * (e % 4))) & 255;
            f.push((c >>> 4).toString(16));
            f.push((c & 15).toString(16));
          }
          return f.join("");
        },
        parse: function(a) {
          for (var b = a.length, f = [], e = 0; e < b; e += 2)
            f[e >>> 3] |= parseInt(a.substr(e, 2), 16) << (24 - 4 * (e % 8));
          return k.create(f, b / 2);
        }
      }),
      l = (x.Latin1 = {
        stringify: function(a) {
          for (var b = a.words, a = a.sigBytes, f = [], e = 0; e < a; e++)
            f.push(
              String.fromCharCode((b[e >>> 2] >>> (24 - 8 * (e % 4))) & 255)
            );
          return f.join("");
        },
        parse: function(a) {
          for (var b = a.length, f = [], e = 0; e < b; e++)
            f[e >>> 2] |= (a.charCodeAt(e) & 255) << (24 - 8 * (e % 4));
          return k.create(f, b);
        }
      }),
      A = (x.Utf8 = {
        stringify: function(a) {
          try {
            return decodeURIComponent(escape(l.stringify(a)));
          } catch (b) {
            throw Error("Malformed UTF-8 data");
          }
        },
        parse: function(a) {
          return l.parse(unescape(encodeURIComponent(a)));
        }
      }),
      m = (c.BufferedBlockAlgorithm = i.extend({
        reset: function() {
          this._data = k.create();
          this._nDataBytes = 0;
        },
        _append: function(a) {
          "string" == typeof a && (a = A.parse(a));
          this._data.concat(a);
          this._nDataBytes += a.sigBytes;
        },
        _process: function(b) {
          var c = this._data,
            f = c.words,
            e = c.sigBytes,
            m = this.blockSize,
            l = e / (4 * m),
            l = b ? a.ceil(l) : a.max((l | 0) - this._minBufferSize, 0),
            b = l * m,
            e = a.min(4 * b, e);
          if (b) {
            for (var d = 0; d < b; d += m) this._doProcessBlock(f, d);
            d = f.splice(0, b);
            c.sigBytes -= e;
          }
          return k.create(d, e);
        },
        clone: function() {
          var a = i.clone.call(this);
          a._data = this._data.clone();
          return a;
        },
        _minBufferSize: 0
      }));
    c.Hasher = m.extend({
      init: function() {
        this.reset();
      },
      reset: function() {
        m.reset.call(this);
        this._doReset();
      },
      update: function(a) {
        this._append(a);
        this._process();
        return this;
      },
      finalize: function(a) {
        a && this._append(a);
        this._doFinalize();
        return this._hash;
      },
      clone: function() {
        var a = m.clone.call(this);
        a._hash = this._hash.clone();
        return a;
      },
      blockSize: 16,
      _createHelper: function(a) {
        return function(b, c) {
          return a.create(c).finalize(b);
        };
      },
      _createHmacHelper: function(a) {
        return function(b, c) {
          return ga.HMAC.create(a, c).finalize(b);
        };
      }
    });
    var ga = (b.algo = {});
    return b;
  })(Math);
(function(a) {
  var d = CryptoJS,
    b = d.lib,
    c = b.Base,
    i = b.WordArray,
    d = (d.x64 = {});
  d.Word = c.extend({
    init: function(a, b) {
      this.high = a;
      this.low = b;
    }
  });
  d.WordArray = c.extend({
    init: function(b, c) {
      b = this.words = b || [];
      this.sigBytes = c != a ? c : 8 * b.length;
    },
    toX32: function() {
      for (var a = this.words, b = a.length, c = [], d = 0; d < b; d++) {
        var A = a[d];
        c.push(A.high);
        c.push(A.low);
      }
      return i.create(c, this.sigBytes);
    },
    clone: function() {
      for (
        var a = c.clone.call(this),
          b = (a.words = this.words.slice(0)),
          d = b.length,
          l = 0;
        l < d;
        l++
      )
        b[l] = b[l].clone();
      return a;
    }
  });
})();
(function() {
  function a() {
    return i.create.apply(i, arguments);
  }
  var d = CryptoJS,
    b = d.lib.Hasher,
    c = d.x64,
    i = c.Word,
    k = c.WordArray,
    c = d.algo,
    x = [
      a(1116352408, 3609767458),
      a(1899447441, 602891725),
      a(3049323471, 3964484399),
      a(3921009573, 2173295548),
      a(961987163, 4081628472),
      a(1508970993, 3053834265),
      a(2453635748, 2937671579),
      a(2870763221, 3664609560),
      a(3624381080, 2734883394),
      a(310598401, 1164996542),
      a(607225278, 1323610764),
      a(1426881987, 3590304994),
      a(1925078388, 4068182383),
      a(2162078206, 991336113),
      a(2614888103, 633803317),
      a(3248222580, 3479774868),
      a(3835390401, 2666613458),
      a(4022224774, 944711139),
      a(264347078, 2341262773),
      a(604807628, 2007800933),
      a(770255983, 1495990901),
      a(1249150122, 1856431235),
      a(1555081692, 3175218132),
      a(1996064986, 2198950837),
      a(2554220882, 3999719339),
      a(2821834349, 766784016),
      a(2952996808, 2566594879),
      a(3210313671, 3203337956),
      a(3336571891, 1034457026),
      a(3584528711, 2466948901),
      a(113926993, 3758326383),
      a(338241895, 168717936),
      a(666307205, 1188179964),
      a(773529912, 1546045734),
      a(1294757372, 1522805485),
      a(1396182291, 2643833823),
      a(1695183700, 2343527390),
      a(1986661051, 1014477480),
      a(2177026350, 1206759142),
      a(2456956037, 344077627),
      a(2730485921, 1290863460),
      a(2820302411, 3158454273),
      a(3259730800, 3505952657),
      a(3345764771, 106217008),
      a(3516065817, 3606008344),
      a(3600352804, 1432725776),
      a(4094571909, 1467031594),
      a(275423344, 851169720),
      a(430227734, 3100823752),
      a(506948616, 1363258195),
      a(659060556, 3750685593),
      a(883997877, 3785050280),
      a(958139571, 3318307427),
      a(1322822218, 3812723403),
      a(1537002063, 2003034995),
      a(1747873779, 3602036899),
      a(1955562222, 1575990012),
      a(2024104815, 1125592928),
      a(2227730452, 2716904306),
      a(2361852424, 442776044),
      a(2428436474, 593698344),
      a(2756734187, 3733110249),
      a(3204031479, 2999351573),
      a(3329325298, 3815920427),
      a(3391569614, 3928383900),
      a(3515267271, 566280711),
      a(3940187606, 3454069534),
      a(4118630271, 4000239992),
      a(116418474, 1914138554),
      a(174292421, 2731055270),
      a(289380356, 3203993006),
      a(460393269, 320620315),
      a(685471733, 587496836),
      a(852142971, 1086792851),
      a(1017036298, 365543100),
      a(1126000580, 2618297676),
      a(1288033470, 3409855158),
      a(1501505948, 4234509866),
      a(1607167915, 987167468),
      a(1816402316, 1246189591)
    ],
    q = [];
  (function() {
    for (var b = 0; 80 > b; b++) q[b] = a();
  })();
  c = c.SHA512 = b.extend({
    _doReset: function() {
      this._hash = k.create([
        a(1779033703, 4089235720),
        a(3144134277, 2227873595),
        a(1013904242, 4271175723),
        a(2773480762, 1595750129),
        a(1359893119, 2917565137),
        a(2600822924, 725511199),
        a(528734635, 4215389547),
        a(1541459225, 327033209)
      ]);
    },
    _doProcessBlock: function(a, b) {
      for (
        var c = this._hash.words,
          d = c[0],
          i = c[1],
          j = c[2],
          f = c[3],
          e = c[4],
          k = c[5],
          K = c[6],
          c = c[7],
          Y = d.high,
          L = d.low,
          Z = i.high,
          M = i.low,
          $ = j.high,
          N = j.low,
          aa = f.high,
          O = f.low,
          ba = e.high,
          P = e.low,
          ca = k.high,
          Q = k.low,
          da = K.high,
          R = K.low,
          ea = c.high,
          S = c.low,
          r = Y,
          n = L,
          E = Z,
          C = M,
          F = $,
          D = N,
          V = aa,
          G = O,
          s = ba,
          o = P,
          T = ca,
          H = Q,
          U = da,
          I = R,
          W = ea,
          J = S,
          t = 0;
        80 > t;
        t++
      ) {
        var y = q[t];
        if (16 > t)
          var p = (y.high = a[b + 2 * t] | 0),
            g = (y.low = a[b + 2 * t + 1] | 0);
        else {
          var p = q[t - 15],
            g = p.high,
            v = p.low,
            p = ((v << 31) | (g >>> 1)) ^ ((v << 24) | (g >>> 8)) ^ (g >>> 7),
            v =
              ((g << 31) | (v >>> 1)) ^
              ((g << 24) | (v >>> 8)) ^
              ((g << 25) | (v >>> 7)),
            B = q[t - 2],
            g = B.high,
            h = B.low,
            B = ((h << 13) | (g >>> 19)) ^ ((g << 3) | (h >>> 29)) ^ (g >>> 6),
            h =
              ((g << 13) | (h >>> 19)) ^
              ((h << 3) | (g >>> 29)) ^
              ((g << 26) | (h >>> 6)),
            g = q[t - 7],
            X = g.high,
            z = q[t - 16],
            w = z.high,
            z = z.low,
            g = v + g.low,
            p = p + X + (g >>> 0 < v >>> 0 ? 1 : 0),
            g = g + h,
            p = p + B + (g >>> 0 < h >>> 0 ? 1 : 0),
            g = g + z,
            p = p + w + (g >>> 0 < z >>> 0 ? 1 : 0);
          y.high = p;
          y.low = g;
        }
        var X = (s & T) ^ (~s & U),
          z = (o & H) ^ (~o & I),
          y = (r & E) ^ (r & F) ^ (E & F),
          ha = (n & C) ^ (n & D) ^ (C & D),
          v =
            ((n << 4) | (r >>> 28)) ^
            ((r << 30) | (n >>> 2)) ^
            ((r << 25) | (n >>> 7)),
          B =
            ((r << 4) | (n >>> 28)) ^
            ((n << 30) | (r >>> 2)) ^
            ((n << 25) | (r >>> 7)),
          h = x[t],
          ia = h.high,
          fa = h.low,
          h =
            J +
            (((s << 18) | (o >>> 14)) ^
              ((s << 14) | (o >>> 18)) ^
              ((o << 23) | (s >>> 9))),
          w =
            W +
            (((o << 18) | (s >>> 14)) ^
              ((o << 14) | (s >>> 18)) ^
              ((s << 23) | (o >>> 9))) +
            (h >>> 0 < J >>> 0 ? 1 : 0),
          h = h + z,
          w = w + X + (h >>> 0 < z >>> 0 ? 1 : 0),
          h = h + fa,
          w = w + ia + (h >>> 0 < fa >>> 0 ? 1 : 0),
          h = h + g,
          w = w + p + (h >>> 0 < g >>> 0 ? 1 : 0),
          g = B + ha,
          y = v + y + (g >>> 0 < B >>> 0 ? 1 : 0),
          W = U,
          J = I,
          U = T,
          I = H,
          T = s,
          H = o,
          o = (G + h) | 0,
          s = (V + w + (o >>> 0 < G >>> 0 ? 1 : 0)) | 0,
          V = F,
          G = D,
          F = E,
          D = C,
          E = r,
          C = n,
          n = (h + g) | 0,
          r = (w + y + (n >>> 0 < h >>> 0 ? 1 : 0)) | 0;
      }
      L = d.low = (L + n) | 0;
      d.high = (Y + r + (L >>> 0 < n >>> 0 ? 1 : 0)) | 0;
      M = i.low = (M + C) | 0;
      i.high = (Z + E + (M >>> 0 < C >>> 0 ? 1 : 0)) | 0;
      N = j.low = (N + D) | 0;
      j.high = ($ + F + (N >>> 0 < D >>> 0 ? 1 : 0)) | 0;
      O = f.low = (O + G) | 0;
      f.high = (aa + V + (O >>> 0 < G >>> 0 ? 1 : 0)) | 0;
      P = e.low = (P + o) | 0;
      e.high = (ba + s + (P >>> 0 < o >>> 0 ? 1 : 0)) | 0;
      Q = k.low = (Q + H) | 0;
      k.high = (ca + T + (Q >>> 0 < H >>> 0 ? 1 : 0)) | 0;
      R = K.low = (R + I) | 0;
      K.high = (da + U + (R >>> 0 < I >>> 0 ? 1 : 0)) | 0;
      S = c.low = (S + J) | 0;
      c.high = (ea + W + (S >>> 0 < J >>> 0 ? 1 : 0)) | 0;
    },
    _doFinalize: function() {
      var a = this._data,
        b = a.words,
        c = 8 * this._nDataBytes,
        d = 8 * a.sigBytes;
      b[d >>> 5] |= 128 << (24 - (d % 32));
      b[(((d + 128) >>> 10) << 5) + 31] = c;
      a.sigBytes = 4 * b.length;
      this._process();
      this._hash = this._hash.toX32();
    },
    blockSize: 32
  });
  d.SHA512 = b._createHelper(c);
  d.HmacSHA512 = b._createHmacHelper(c);
})();
(function() {
  var a = CryptoJS,
    d = a.x64,
    b = d.Word,
    c = d.WordArray,
    d = a.algo,
    i = d.SHA512,
    d = (d.SHA384 = i.extend({
      _doReset: function() {
        this._hash = c.create([
          b.create(3418070365, 3238371032),
          b.create(1654270250, 914150663),
          b.create(2438529370, 812702999),
          b.create(355462360, 4144912697),
          b.create(1731405415, 4290775857),
          b.create(2394180231, 1750603025),
          b.create(3675008525, 1694076839),
          b.create(1203062813, 3204075428)
        ]);
      },
      _doFinalize: function() {
        i._doFinalize.call(this);
        this._hash.sigBytes -= 16;
      }
    }));
  a.SHA384 = i._createHelper(d);
  a.HmacSHA384 = i._createHmacHelper(d);
})();
(function() {
  var a = CryptoJS,
    d = a.enc.Utf8;
  a.algo.HMAC = a.lib.Base.extend({
    init: function(a, c) {
      a = this._hasher = a.create();
      "string" == typeof c && (c = d.parse(c));
      var i = a.blockSize,
        k = 4 * i;
      c.sigBytes > k && (c = a.finalize(c));
      for (
        var x = (this._oKey = c.clone()),
          q = (this._iKey = c.clone()),
          l = x.words,
          A = q.words,
          m = 0;
        m < i;
        m++
      )
        (l[m] ^= 1549556828), (A[m] ^= 909522486);
      x.sigBytes = q.sigBytes = k;
      this.reset();
    },
    reset: function() {
      var a = this._hasher;
      a.reset();
      a.update(this._iKey);
    },
    update: function(a) {
      this._hasher.update(a);
      return this;
    },
    finalize: function(a) {
      var c = this._hasher,
        a = c.finalize(a);
      c.reset();
      return c.finalize(this._oKey.clone().concat(a));
    }
  });
})();
