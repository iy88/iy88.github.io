! function() {
    "use strict";
    var e = (e, r, i) => Math.min(Math.max(e, r), i),
        r = (e, r) => e + Math.random() * (r - e),
        i = e => e * (.5 - Math.random()),
        t = window.AudioContext || window.webkitAudioContext,
        o = window.OfflineAudioContext || window.webkitOfflineAudioContext,
        n = new t,
        {
            sampleRate: a
        } = n,
        s = (e, r, i) => {
            for (var t = r * a, o = n.createBuffer(1, t, a), c = o.getChannelData(0), s = 0; s < t; s++) c[s] = e(s / a, s, c) * i;
            return o
        },
        l = ["c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b"],
        v = (e, r, i) => {
            for (var t = {}, o = o => {
                    var n, a = {
                        get: () => (n || (n = s(e((e => 2 ** ((e - 69) / 12) * 440)(o)), r, i)), n)
                    };
                    Object.defineProperty(t, o, a), Object.defineProperty(t, (e => {
                        return l[e % 12] + (Math.floor(e / 12) - 1)
                    })(o), a)
                }, n = 21; n <= 105; n++) o(n);
            return t
        },
        m = n.createGain();
    m.gain.value = .3, m.connect(n.destination);
    var d = n.createGain();
    d.gain.value = 1 - m.gain.value, d.connect(n.destination);
    var g = n.createConvolver();
    g.connect(m);
    var p = n.createGain();
    p.gain.value = .8, p.connect(d), p.connect(g);
    var f = s((e, r, i) => (2 * Math.random() - 1) * Math.pow(i.length, -r / i.length), 2, 1);
    ((e, r, i, t) => {
        var n = new o(1, f.length, a),
            c = n.createBiquadFilter();
        c.type = "lowpass", c.Q.value = 1e-4, c.frequency.value = r, c.frequency.linearRampToValueAtTime(i, t), c.connect(n.destination);
        var s = n.createBufferSource();
        s.buffer = f, s.connect(c), s.start();
        var l = n.startRendering();
        void 0 !== l ? l.then(r => e.buffer = r) : n.oncomplete = (r => e.buffer = r.renderedBuffer)
    })(g, 1760, 220, 1);
    var u = e => r => Math.sin(2 * r * Math.PI * e),
        h = e => () => r => Math.exp(-r * e),
        y = (e, r) => i => {
            var t = e(i),
                o = r(i);
            return e => t(e) + o(e)
        },
        x = (e, r) => i => {
            var t = e(i),
                o = r(i);
            return e => t(e) * o(e)
        },
        w = (e, r) => i => e(((e, r) => e * 2 ** (r / 12))(i, r)),
        z = x(y(y(u, w(u, .1)), w(u, -.1)), h(16)),
        b = x(x(u, () => {
            var e = 0;
            return () => {
                var r = (e + .02 * i(1)) / 1.02;
                return (-1 > (e += r) || e > 1) && (e -= r), 3.5 * e
            }
        }), h(32)),
        L = x(x(u, () => () => i(.8)), h(24)),
        _ = x(y(u, w(u, 7)), h(1)),
        C = (v(z, 2, .2), v(z, 2, .2)),
        M = (v(b, 2, .5), v(L, 2, 1)),
        F = v(_, 6, .3),
        P = e => ((e, r = n.destination) => {
            var i = n.createBufferSource();
            i.buffer = e, i.connect(r), i.start()
        })(e, p),
        R = () => {
            n.resume(), (async() => {
                n.resume()
            })(), document.removeEventListener("click", R)
        };
    document.addEventListener("click", R);
    for (var A, D, j, B, I, E, O, S, k, T = (e, r) => {
            var i = 0;
            return r.map(r => {
                e[i++] = r.x, e[i++] = r.y, e[i++] = r.z
            }), e
        }, q = (e, r) => {
            var i = new Float32Array(3 * r.vertices.length);
            e.attrs.position = T(i, r.vertices);
            var t = new Float32Array(3 * r.colors.length);
            return e.attrs.color = T(t, r.colors), e
        }, W = (e = 0, r = 0, i = 0) => ({
            x: e,
            y: r,
            z: i
        }), G = (e, r, i, t) => (e.x = r, e.y = i, e.z = t, e), H = (e, r) => (e.x = r, e.y = r, e.z = r, e), V = e => W(e.x, e.y, e.z), N = (e, r) => (e.x += r.x, e.y += r.y, e.z += r.z, e), U = (e, r, i) => (e.x += r.x * i, e.y += r.y * i, e.z += r.z * i, e), K = (e, r) => (e.x -= r.x, e.y -= r.y, e.z -= r.z, e), $ = (e, r, i) => (e.x = r.x - i.x, e.y = r.y - i.y, e.z = r.z - i.z, e), Y = (e, r) => (e.x *= r, e.y *= r, e.z *= r, e), X = (e, r) => {
            var {
                x: i,
                y: t,
                z: o
            } = e, n = 1 / (r[3] * i + r[7] * t + r[11] * o + r[15]);
            return e.x = (r[0] * i + r[4] * t + r[8] * o + r[12]) * n, e.y = (r[1] * i + r[5] * t + r[9] * o + r[13]) * n, e.z = (r[2] * i + r[6] * t + r[10] * o + r[14]) * n, e
        }, Q = (e, r) => {
            var {
                x: i,
                y: t,
                z: o
            } = e, n = r.x, a = r.y, c = r.z, s = r.w, l = s * i + a * o - c * t, v = s * t + c * i - n * o, m = s * o + n * t - a * i, d = -n * i - a * t - c * o;
            return e.x = l * s + d * -n + v * -c - m * -a, e.y = v * s + d * -a + m * -n - l * -c, e.z = m * s + d * -c + l * -a - v * -n, e
        }, J = (e, r) => {
            var {
                x: i,
                y: t,
                z: o
            } = e;
            return e.x = r[0] * i + r[4] * t + r[8] * o, e.y = r[1] * i + r[5] * t + r[9] * o, e.z = r[2] * i + r[6] * t + r[10] * o, ie(e)
        }, Z = (e, r) => Y(e, 1 / r), ee = (e, r) => e.x * r.x + e.y * r.y + e.z * r.z, re = e => Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z), ie = e => Z(e, re(e) || 1), te = (e, r) => {
            var {
                x: i,
                y: t,
                z: o
            } = e;
            return e.x = t * r.z - o * r.y, e.y = o * r.x - i * r.z, e.z = i * r.y - t * r.x, e
        }, oe = (e, r, i) => {
            var t = r.x,
                o = r.y,
                n = r.z,
                a = i.x,
                c = i.y,
                s = i.z;
            return e.x = o * s - n * c, e.y = n * a - t * s, e.z = t * c - o * a, e
        }, ne = (e, r) => Math.sqrt(ae(e, r)), ae = (e, r) => {
            var i = e.x - r.x,
                t = e.y - r.y,
                o = e.z - r.z;
            return i * i + t * t + o * o
        }, ce = (e, r) => (e.x = r[12], e.y = r[13], e.z = r[14], e), se = (e, r) => (e.x = r[0], e.y = r[1], e.z = r[2], e), le = W(0, 1, 0), ve = (e, r, i) => {
            var t = ee(e, r);
            t < 0 ? t *= i : t /= i, U(e, r, -t)
        }, me = () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), de = (A = W(), D = W(), j = W(), (e, r, i, t) => (ie($(j, r, i)), re(j) || (j.z = 1), ie(oe(A, t, j)), re(A) || (1 === Math.abs(t.z) ? j.x += 1e-4 : j.z += 1e-4, ie(oe(A, t, j))), oe(D, j, A), e[0] = A.x, e[4] = D.x, e[8] = j.x, e[1] = A.y, e[5] = D.y, e[9] = j.y, e[2] = A.z, e[6] = D.z, e[10] = j.z, e)), ge = (e, r, i) => {
            var t = r[0],
                o = r[4],
                n = r[8],
                a = r[12],
                c = r[1],
                s = r[5],
                l = r[9],
                v = r[13],
                m = r[2],
                d = r[6],
                g = r[10],
                p = r[14],
                f = r[3],
                u = r[7],
                h = r[11],
                y = r[15],
                x = i[0],
                w = i[4],
                z = i[8],
                b = i[12],
                L = i[1],
                _ = i[5],
                C = i[9],
                M = i[13],
                F = i[2],
                P = i[6],
                R = i[10],
                A = i[14],
                D = i[3],
                j = i[7],
                B = i[11],
                I = i[15];
            return e[0] = t * x + o * L + n * F + a * D, e[4] = t * w + o * _ + n * P + a * j, e[8] = t * z + o * C + n * R + a * B, e[12] = t * b + o * M + n * A + a * I, e[1] = c * x + s * L + l * F + v * D, e[5] = c * w + s * _ + l * P + v * j, e[9] = c * z + s * C + l * R + v * B, e[13] = c * b + s * M + l * A + v * I, e[2] = m * x + d * L + g * F + p * D, e[6] = m * w + d * _ + g * P + p * j, e[10] = m * z + d * C + g * R + p * B, e[14] = m * b + d * M + g * A + p * I, e[3] = f * x + u * L + h * F + y * D, e[7] = f * w + u * _ + h * P + y * j, e[11] = f * z + u * C + h * R + y * B, e[15] = f * b + u * M + h * A + y * I, e
        }, pe = (e, r) => {
            var i = r[0],
                t = r[1],
                o = r[2],
                n = r[3],
                a = r[4],
                c = r[5],
                s = r[6],
                l = r[7],
                v = r[8],
                m = r[9],
                d = r[10],
                g = r[11],
                p = r[12],
                f = r[13],
                u = r[14],
                h = r[15],
                y = m * u * l - f * d * l + f * s * g - c * u * g - m * s * h + c * d * h,
                x = p * d * l - v * u * l - p * s * g + a * u * g + v * s * h - a * d * h,
                w = v * f * l - p * m * l + p * c * g - a * f * g - v * c * h + a * m * h,
                z = p * m * s - v * f * s - p * c * d + a * f * d + v * c * u - a * m * u,
                b = i * y + t * x + o * w + n * z;
            if (0 === b) return (e => (e.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), e))(e);
            var L = 1 / b;
            return e[0] = y * L, e[1] = (f * d * n - m * u * n - f * o * g + t * u * g + m * o * h - t * d * h) * L, e[2] = (c * u * n - f * s * n + f * o * l - t * u * l - c * o * h + t * s * h) * L, e[3] = (m * s * n - c * d * n - m * o * l + t * d * l + c * o * g - t * s * g) * L, e[4] = x * L, e[5] = (v * u * n - p * d * n + p * o * g - i * u * g - v * o * h + i * d * h) * L, e[6] = (p * s * n - a * u * n - p * o * l + i * u * l + a * o * h - i * s * h) * L, e[7] = (a * d * n - v * s * n + v * o * l - i * d * l - a * o * g + i * s * g) * L, e[8] = w * L, e[9] = (p * m * n - v * f * n - p * t * g + i * f * g + v * t * h - i * m * h) * L, e[10] = (a * f * n - p * c * n + p * t * l - i * f * l - a * t * h + i * c * h) * L, e[11] = (v * c * n - a * m * n - v * t * l + i * m * l + a * t * g - i * c * g) * L, e[12] = z * L, e[13] = (v * f * o - p * m * o + p * t * d - i * f * d - v * t * u + i * m * u) * L, e[14] = (p * c * o - a * f * o - p * t * s + i * f * s + a * t * u - i * c * u) * L, e[15] = (a * m * o - v * c * o + v * t * s - i * m * s - a * t * d + i * c * d) * L, e
        }, fe = (e = 0, r = 0, i = 0, t = 1) => ({
            x: e,
            y: r,
            z: i,
            w: t
        }), ue = (e, r, i, t, o) => (e.x = r, e.y = i, e.z = t, e.w = o, e), he = e => {
            var r = (e => Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w))(e);
            return r ? (r = 1 / r, e.x = e.x * r, e.y = e.y * r, e.z = e.z * r, e.w = e.w * r) : (e.x = 0, e.y = 0, e.z = 0, e.w = 1), e
        }, ye = (e, r) => {
            var i = e.x,
                t = e.y,
                o = e.z,
                n = e.w,
                a = r.x,
                c = r.y,
                s = r.z,
                l = r.w;
            return e.x = i * l + n * a + t * s - o * c, e.y = t * l + n * c + o * a - i * s, e.z = o * l + n * s + i * c - t * a, e.w = n * l - i * a - t * c - o * s, e
        }, xe = () => ({
            parent: void 0,
            children: [],
            components: [],
            position: W(),
            quaternion: fe(),
            scale: W(1, 1, 1),
            matrix: me(),
            matrixWorld: me(),
            modelViewMatrix: me(),
            visible: !0
        }), we = (B = me(), (e, r) => {
            de(B, r, e.position, le), ((e, r) => {
                var i, t = r[0],
                    o = r[4],
                    n = r[8],
                    a = r[1],
                    c = r[5],
                    s = r[9],
                    l = r[2],
                    v = r[6],
                    m = r[10],
                    d = t + c + m;
                d > 0 ? (i = .5 / Math.sqrt(d + 1), e.w = .25 / i, e.x = (v - s) * i, e.y = (n - l) * i, e.z = (a - o) * i) : t > c && t > m ? (i = 2 * Math.sqrt(1 + t - c - m), e.w = (v - s) / i, e.x = .25 * i, e.y = (o + a) / i, e.z = (n + l) / i) : c > m ? (i = 2 * Math.sqrt(1 + c - t - m), e.w = (n - l) / i, e.x = (o + a) / i, e.y = .25 * i, e.z = (s + v) / i) : (i = 2 * Math.sqrt(1 + m - t - c), e.w = (a - o) / i, e.x = (n + l) / i, e.y = (s + v) / i, e.z = .25 * i)
            })(e.quaternion, B)
        }), ze = (e, r) => (r.parent = e, e.children.push(r), e), be = (e, r) => {
            r(e), e.children.map(e => be(e, r))
        }, Le = e => {
            (e => {
                ((e, r, i, t) => {
                    var {
                        x: o,
                        y: n,
                        z: a,
                        w: c
                    } = i, s = o + o, l = n + n, v = a + a, m = o * s, d = o * l, g = o * v, p = n * l, f = n * v, u = a * v, h = c * s, y = c * l, x = c * v, w = t.x, z = t.y, b = t.z;
                    e[0] = (1 - (p + u)) * w, e[1] = (d + x) * w, e[2] = (g - y) * w, e[3] = 0, e[4] = (d - x) * z, e[5] = (1 - (m + u)) * z, e[6] = (f + h) * z, e[7] = 0, e[8] = (g + y) * b, e[9] = (f - h) * b, e[10] = (1 - (m + p)) * b, e[11] = 0, e[12] = r.x, e[13] = r.y, e[14] = r.z, e[15] = 1
                })(e.matrix, e.position, e.quaternion, e.scale)
            })(e), e.parent ? ge(e.matrixWorld, e.parent.matrixWorld, e.matrix) : ((e, r) => (e.set(r), e))(e.matrixWorld, e.matrix), e.children.map(Le)
        }, _e = Math.PI / 180, Ce = e => {
            var {
                near: r,
                far: i
            } = e, t = r * Math.tan(.5 * e.fov * _e), o = -t, n = o * e.aspect, a = t * e.aspect, c = 2 * r / (a - n), s = 2 * r / (t - o), l = (a + n) / (a - n), v = (t + o) / (t - o), m = -(i + r) / (i - r), d = -2 * i * r / (i - r);
            e.projectionMatrix.set([c, 0, 0, 0, 0, s, 0, 0, l, v, m, -1, 0, 0, d, 0])
        }, Me = fe(), Fe = fe(), Pe = e => ({
            parent: void 0,
            update() {},
            ...e
        }), Re = (e, ...r) => (r.map(r => {
            Ae(e, r) || (r.parent = e, e.components.push(r))
        }), e), Ae = (e, r) => e.components.includes(r), De = (e, ...r) => {
            e.components.map(e => e.update(e, ...r))
        }, je = (e = W(1 / 0, 1 / 0, 1 / 0), r = W(-1 / 0, -1 / 0, -1 / 0)) => ({
            min: e,
            max: r
        }), Be = (e, r) => (Object.assign(e.min, r.min), Object.assign(e.max, r.max), e), Ie = (e, r) => (((e, r) => (e.x = Math.min(e.x, r.x), e.y = Math.min(e.y, r.y), e.z = Math.min(e.z, r.z), e))(e.min, r), ((e, r) => (e.x = Math.max(e.x, r.x), e.y = Math.max(e.y, r.y), e.z = Math.max(e.z, r.z), e))(e.max, r), e), Ee = (E = W(), O = (e => {
            var {
                geometry: r
            } = e;
            r && r.vertices.map(r => {
                Object.assign(E, r), X(E, e.matrixWorld), Ie(I, E)
            })
        }), (e, r) => (I = e, Le(r), be(r, O), e)), Oe = (e, r) => !(e.max.x <= r.min.x || e.min.x >= r.max.x || e.max.y <= r.min.y || e.min.y >= r.max.y || e.max.z <= r.min.z || e.min.z >= r.max.z), Se = (e, r) => (N(e.min, r), N(e.max, r), e), ke = (e, r, i) => ({
            a: e,
            b: r,
            c: i,
            color: W(1, 1, 1),
            vertexColors: []
        }), Te = (S = W(), (e, r, i, t) => (G(S, r, i, t), e.vertices.map(e => N(e, S)), e)), qe = (e, r) => {
            var i = e.vertices.length;
            return e.vertices.push(...r.vertices.map(V)), e.faces.push(...r.faces.map(e => {
                var r = (e => ({
                    a: e.a,
                    b: e.b,
                    c: e.c,
                    color: V(e.color),
                    vertexColors: e.vertexColors.map(V)
                }))(e);
                return r.a += i, r.b += i, r.c += i, r
            })), e
        }, We = (e, r, i) => {
            var t = e / 2,
                o = r / 2,
                n = i / 2;
            return ((e, r, i) => {
                var t, o = e.vertices.length;
                for (t = 0; t < r.length; t += 3) e.vertices.push(W(r[t], r[t + 1], r[t + 2]));
                for (t = 0; t < i.length; t += 3) e.faces.push(ke(o + i[t], o + i[t + 1], o + i[t + 2]));
                return e
            })({
                vertices: [],
                faces: []
            }, [t, o, n, t, o, -n, t, -o, n, t, -o, -n, -t, o, -n, -t, o, n, -t, -o, -n, -t, -o, n], [0, 2, 1, 2, 3, 1, 4, 6, 5, 6, 7, 5, 4, 5, 1, 5, 0, 1, 7, 6, 2, 6, 3, 2, 5, 7, 0, 7, 2, 0, 1, 3, 4, 3, 6, 4])
        }, Ge = [0], He = [1], Ve = [2], Ne = [3], Ue = [4], Ke = [5], $e = [6], Ye = [7], Xe = [].concat(Ge, He), Qe = [].concat(Ve, Ne), Je = [].concat(Ue, Ke), Ze = [].concat($e, Ye), er = [].concat(Ge, Ve), rr = [].concat(He, Ne), ir = [].concat(Ue, $e), tr = [].concat(Ke, Ye), or = [].concat(Ge, Ke), nr = [].concat(He, Ue), ar = [].concat(Ve, Ye), cr = [].concat(Ne, $e), sr = [].concat(Xe, Qe), lr = [].concat(Je, Ze), vr = {
            px_py_pz: Ge,
            px_py_nz: He,
            px_ny_pz: Ve,
            px_ny_nz: Ne,
            nx_py_nz: Ue,
            nx_py_pz: Ke,
            nx_ny_nz: $e,
            nx_ny_pz: Ye,
            px_py: Xe,
            px_ny: Qe,
            nx_py: Je,
            nx_ny: Ze,
            px_pz: er,
            px_nz: rr,
            nx_nz: ir,
            nx_pz: tr,
            py_pz: or,
            py_nz: nr,
            ny_pz: ar,
            ny_nz: cr,
            px: sr,
            nx: lr,
            py: [].concat(Xe, Je),
            ny: [].concat(Qe, Ze),
            pz: [].concat(er, tr),
            nz: [].concat(rr, ir),
            all: [].concat(sr, lr)
        }, mr = (...e) => e.reduceRight((e, r) => (...i) => e(r(...i))), dr = e => (...r) => i => e(i, ...r), gr = dr((() => (e, r) => (Object.keys(r).map(i => {
            var t = se(W(), r[i]),
                o = vr[i];
            e.faces.map(e => o.map(r => ((e, r, i) => {
                e.a === r && (e.vertexColors[0] = i), e.b === r && (e.vertexColors[1] = i), e.c === r && (e.vertexColors[2] = i)
            })(e, r, t)))
        }), e))()), pr = dr((e, r) => {
            var i = se(W(), r);
            return e.faces.map(e => {
                for (var r = 0; r < 3; r++) void 0 === e.vertexColors[r] && (e.vertexColors[r] = i)
            }), e
        }), fr = dr((k = W(), (e, r) => (((e, r, i = W()) => (G(i, 0, 0, 0), r.map(r => N(i, e.vertices[r])), Z(i, r.length), i))(e, vr[r], k), Te(e, -k.x, -k.y, -k.z)))), ur = dr((() => {
            var e = W();
            return (r, i = W()) => (t, o) => (Object.keys(o).map(n => {
                var a = o[n],
                    c = vr[n];
                if (Array.isArray(a)) se(e, a);
                else if ("object" == typeof a) Object.assign(e, i, a);
                else {
                    if ("number" != typeof a) return;
                    H(e, a)
                }
                c.map(i => r(t.vertices[i], e))
            }), t)
        })()((e, r) => (e.x *= r.x, e.y *= r.y, e.z *= r.z, e), W(1, 1, 1))), hr = (e = W(), r = 1) => ({ ...xe(),
            color: e,
            intensity: r,
            target: xe()
        }), yr = 1 / 6, xr = (e => {
            var r, i = new Uint8Array(256);
            for (r = 0; r < 256; r++) i[r] = r;
            for (r = 0; r < 255; r++) {
                var t = r + ~~(e() * (256 - r)),
                    o = i[r];
                i[r] = i[t], i[t] = o
            }
            return i
        })(Math.random), wr = new Uint8Array(512), zr = new Uint8Array(512), br = 0; br < 512; br++) wr[br] = xr[255 & br], zr[br] = wr[br] % 12;
    var Lr, _r, Cr, Mr, Fr, Pr, Rr, Ar, Dr, jr, Br, Ir, Er, Or, Sr, kr, Tr = new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]),
        qr = (e, r, i) => {
            var t, o, n, a, c, s, l, v, m, d, g = (e + r + i) * (1 / 3),
                p = Math.floor(e + g),
                f = Math.floor(r + g),
                u = Math.floor(i + g),
                h = (p + f + u) * yr,
                y = e - (p - h),
                x = r - (f - h),
                w = i - (u - h);
            y >= x ? x >= w ? (c = 1, s = 0, l = 0, v = 1, m = 1, d = 0) : y >= w ? (c = 1, s = 0, l = 0, v = 1, m = 0, d = 1) : (c = 0, s = 0, l = 1, v = 1, m = 0, d = 1) : x < w ? (c = 0, s = 0, l = 1, v = 0, m = 1, d = 1) : y < w ? (c = 0, s = 1, l = 0, v = 0, m = 1, d = 1) : (c = 0, s = 1, l = 0, v = 1, m = 1, d = 0);
            var z = y - c + yr,
                b = x - s + yr,
                L = w - l + yr,
                _ = y - v + 2 * yr,
                C = x - m + 2 * yr,
                M = w - d + 2 * yr,
                F = y - 1 + .5,
                P = x - 1 + .5,
                R = w - 1 + .5,
                A = 255 & p,
                D = 255 & f,
                j = 255 & u,
                B = .6 - y * y - x * x - w * w;
            if (B < 0) t = 0;
            else {
                var I = 3 * zr[A + wr[D + wr[j]]];
                t = (B *= B) * B * (Tr[I] * y + Tr[I + 1] * x + Tr[I + 2] * w)
            }
            var E = .6 - z * z - b * b - L * L;
            if (E < 0) o = 0;
            else {
                var O = 3 * zr[A + c + wr[D + s + wr[j + l]]];
                o = (E *= E) * E * (Tr[O] * z + Tr[O + 1] * b + Tr[O + 2] * L)
            }
            var S = .6 - _ * _ - C * C - M * M;
            if (S < 0) n = 0;
            else {
                var k = 3 * zr[A + v + wr[D + m + wr[j + d]]];
                n = (S *= S) * S * (Tr[k] * _ + Tr[k + 1] * C + Tr[k + 2] * M)
            }
            var T = .6 - F * F - P * P - R * R;
            if (T < 0) a = 0;
            else {
                var q = 3 * zr[A + 1 + wr[D + 1 + wr[j + 1]]];
                a = (T *= T) * T * (Tr[q] * F + Tr[q + 1] * P + Tr[q + 2] * R)
            }
            return 32 * (t + o + n + a)
        },
        Wr = () => ({
            color: W(1, 1, 1),
            specular: W(1 / 15, 1 / 15, 1 / 15),
            shininess: 30,
            emissive: W()
        }),
        Gr = (e, r) => ({ ...xe(),
            geometry: e,
            material: r
        }),
        Hr = (e, r) => Pe({
            physics: r,
            shape: 1,
            boundingBox: ((e, r) => ((e => (e.min.x = e.min.y = e.min.z = 1 / 0, e.max.x = e.max.y = e.max.z -= 1 / 0, e))(e), Ee(e, r), e))(je(), e),
            velocity: W(),
            update(e, r) {
                U(e.parent.position, e.velocity, r)
            }
        }),
        Vr = (e, r) => Re(e, Hr(e, r)),
        Nr = e => e.physics,
        Ur = e => {
            var r = [];
            return be(e, e => {
                r.push(...((e, r) => e.components.filter(r))(e, Nr))
            }), r
        },
        Kr = (Lr = W(), {
            1(e, r, i, t) {
                var o = t.max.x - i.min.x,
                    n = i.max.x - t.min.x,
                    a = t.max.y - i.min.y,
                    c = i.max.y - t.min.y,
                    s = t.max.z - i.min.z,
                    l = i.max.z - t.min.z,
                    v = 0;
                o > 0 && n > 0 && (v = o < n ? o : -n);
                var m = 0;
                a > 0 && c > 0 && (m = a < c ? a : -c);
                var d = 0;
                s > 0 && l > 0 && (d = s < l ? s : -l);
                var g = Math.abs(v),
                    p = Math.abs(m),
                    f = Math.abs(d);
                g < p && g < f ? G(Lr, v, 0, 0) : p < f ? G(Lr, 0, m, 0) : G(Lr, 0, 0, d);
                var u = e.parent,
                    h = r.parent;
                1 === e.physics ? (U(h.position, Lr, -1.001), ve(r.velocity, ie(Lr), 1.001)) : 1 === r.physics ? (U(u.position, Lr, 1.001), ve(e.velocity, ie(Lr), 1.001)) : (Y(Lr, .5), N(u.position, Lr), K(h.position, Lr))
            }
        }),
        $r = (_r = je(), Cr = je(), e => {
            for (var r = [], i = 0; i < e.length; i++)
                for (var t = e[i], o = i + 1; o < e.length; o++) {
                    var n = e[o];
                    if (1 === t.physics && 1 === n.physics) return;
                    var a = t.parent,
                        c = n.parent;
                    if (Se(Be(_r, t.boundingBox), a.position), Se(Be(Cr, n.boundingBox), c.position), Oe(_r, Cr)) {
                        var s = Kr[t.shape | n.shape](t, n, _r, Cr);
                        s && r.push(s)
                    }
                }
            return r
        }),
        Yr = (Mr = W(), Fr = W(), e => {
            if ((e => !(e.command.up < 10 || (2 & e.movementFlags ? (e.command.up = 0, 1) : (e.groundPlane = !1, e.walking = !1, e.movementFlags |= 2, e.body.velocity.y = 270, 0))))(e)) Xr(e);
            else {
                Jr(e);
                var r = e.command.forward,
                    i = e.command.right,
                    t = Zr(e);
                e.viewForward.y = 0, e.viewRight.y = 0, ve(e.viewForward, e.groundTrace.normal, 1.001), ve(e.viewRight, e.groundTrace.normal, 1.001), ie(e.viewForward), ie(e.viewRight), H(Mr, 0), U(Mr, e.viewForward, r), U(Mr, e.viewRight, i), Object.assign(Fr, Mr);
                var o = re(Fr);
                ie(Fr), ei(e, Fr, o *= t, 10), ve(e.body.velocity, e.groundTrace.normal, 1.001), e.body.velocity.x || e.body.velocity.z
            }
        }),
        Xr = (() => {
            var e = W(),
                r = W();
            return i => {
                Jr(i);
                var t = i.command.forward,
                    o = i.command.right,
                    n = Zr(i);
                i.viewForward.y = 0, i.viewRight.y = 0, ie(i.viewForward), ie(i.viewRight), H(e, 0), U(e, i.viewForward, t), U(e, i.viewRight, o), e.y = 0, Object.assign(r, e);
                var a = re(r);
                ie(r), ei(i, r, a *= n, 1), i.groundPlane && ve(i.body.velocity, i.groundTrace.normal, 1.001), i.body.velocity.y -= i.gravity * i.dt
            }
        })(),
        Qr = (Pr = W(), Rr = W(), e => {
            Y(Object.assign(Rr, e.viewForward), -16), N(Rr, e.grapplePoint), $(Pr, Rr, e.object.position);
            var r = re(Pr);
            ie(Pr), Y(Pr, r <= 100 ? 10 * r : 800), Object.assign(e.body.velocity, Pr), e.groundPlane = !1
        }),
        Jr = (Ar = W(), e => {
            var r = e.body.velocity;
            Object.assign(Ar, r), e.walking && (Ar.y = 0);
            var i = re(Ar);
            if (i < 1) return r.x = 0, void(r.z = 0);
            var t = 0;
            e.walking && (t += 6 * (i < 100 ? 100 : i) * e.dt);
            var o = i - t;
            o < 0 && (o = 0), Y(r, o /= i)
        }),
        Zr = e => {
            var r = Math.abs(e.command.forward);
            if (Math.abs(e.command.right) > r && (r = Math.abs(e.command.right)), Math.abs(e.command.up) > r && (r = Math.abs(e.command.up)), !r) return 0;
            var i = Math.sqrt(e.command.forward ** 2 + e.command.right ** 2 + e.command.up ** 2);
            return e.speed * r / (127 * i)
        },
        ei = (e, r, i, t) => {
            var o = i - ee(e.body.velocity, r);
            if (!(o <= 0)) {
                var n = t * e.dt * i;
                n > o && (n = o), U(e.body.velocity, r, n)
            }
        },
        ri = (() => {
            var e = je(),
                r = je(),
                i = W(0, -.25, 0);
            return t => {
                var o = Ur(t.scene).filter(e => e !== t.body);
                Se(Be(e, t.body.boundingBox), t.object.position), Se(e, i);
                for (var n = 0; n < o.length; n++) {
                    var a = o[n];
                    if (Se(Be(r, a.boundingBox), a.parent.position), Oe(e, r)) return t.groundPlane = !0, void(t.walking = !0)
                }
                t.groundPlane = !1, t.walking = !1
            }
        })(),
        ii = (e = W(), r = W()) => ({
            origin: e,
            direction: r
        }),
        ti = (Dr = W(), jr = W(), Br = W(), Ir = W(), (e, r, i, t, o) => {
            $(jr, i, r), $(Br, t, r), oe(Ir, jr, Br);
            var n = ee(e.direction, Ir),
                a = 1;
            if (!(n > 0) && n < 0) {
                a = -1, n *= -1, $(Dr, e.origin, r);
                var c = a * ee(e.direction, oe(Br, Dr, Br));
                if (!(c < 0)) {
                    var s = a * ee(e.direction, te(jr, Dr));
                    if (!(s < 0 || c + s > n)) {
                        var l = -a * ee(Dr, Ir);
                        if (!(l < 0)) return ((e, r, i = W()) => N(Y(Object.assign(i, e.direction), r), e.origin))(e, l / n, o)
                    }
                }
            }
        }),
        oi = (Er = me(), Or = ii(), Sr = W(), kr = W(), (e, r) => {
            var i = [];
            pe(Er, r.matrixWorld), ni(((e, r) => (Object.assign(e.origin, r.origin), Object.assign(e.direction, r.direction), e))(Or, e), Er);
            var {
                vertices: t,
                faces: o
            } = r.geometry;
            return o.map((o, n) => {
                var a = t[o.a],
                    c = t[o.b],
                    s = t[o.c],
                    l = ((e, r, i, t, o, n) => {
                        if (ti(r, i, t, o, n)) return Object.assign(kr, n), X(kr, e.matrixWorld), V(kr)
                    })(r, Or, a, c, s, Sr);
                l && i.push({
                    point: l,
                    object: r,
                    face: o,
                    faceIndex: n,
                    distance: ne(e.origin, l)
                })
            }), i
        }),
        ni = (e, r) => (X(e.origin, r), J(e.direction, r), e),
        ai = (e, r, i) => {
            e.uniform1f(r, i)
        },
        ci = (e, r, i) => {
            e.uniformMatrix4fv(r, !1, i)
        },
        si = (e, r, i) => {
            e.uniform3f(r, i.x, i.y, i.z)
        },
        li = "#extension GL_OES_standard_derivatives : enable\nprecision highp float;precision highp int;\n#define RECIPROCAL_PI 0.31830988618\n#define saturate(a)clamp(a,0.0,1.0)\nuniform vec3 diffuse;uniform vec3 emissive;uniform vec3 specular;uniform float shininess;struct IncidentLight{vec3 color;vec3 direction;};struct ReflectedLight{vec3 directDiffuse;vec3 directSpecular;vec3 indirectDiffuse;vec3 indirectSpecular;};struct GeometricContext{vec3 position;vec3 normal;vec3 viewDir;};varying vec3 vColor;uniform vec3 fogColor;uniform float fogNear;uniform float fogFar;vec3 BRDF_Diffuse_Lambert(const in vec3 diffuseColor){return RECIPROCAL_PI*diffuseColor;}vec3 F_Schlick(const in vec3 specularColor,const in float dotLH){float fresnel=exp2((-5.55473*dotLH-6.98316)*dotLH);return(1.0-specularColor)*fresnel+specularColor;}float G_BlinnPhong_Implicit(){return 0.25;}float D_BlinnPhong(const in float shininess,const in float dotNH){return RECIPROCAL_PI*(shininess*0.5+1.0)*pow(dotNH,shininess);}vec3 BRDF_Specular_BlinnPhong(const in IncidentLight incidentLight,const in GeometricContext geometry,const in vec3 specularColor,const in float shininess){vec3 halfDir=normalize(incidentLight.direction+geometry.viewDir);float dotNH=saturate(dot(geometry.normal,halfDir));float dotLH=saturate(dot(incidentLight.direction,halfDir));vec3 F=F_Schlick(specularColor,dotLH);float G=G_BlinnPhong_Implicit();float D=D_BlinnPhong(shininess,dotNH);return F*(G*D);}uniform vec3 ambientLightColor;vec3 getAmbientLightIrradiance(const in vec3 ambientLightColor){vec3 irradiance=ambientLightColor;return irradiance;}struct DirectionalLight{vec3 direction;vec3 color;};uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];void getDirectionalDirectLightIrradiance(const in DirectionalLight directionalLight,const in GeometricContext geometry,out IncidentLight directLight){directLight.color=directionalLight.color;directLight.direction=directionalLight.direction;}varying vec3 vViewPosition;struct BlinnPhongMaterial{vec3 diffuseColor;vec3 specularColor;float specularShininess;};void RE_Direct_BlinnPhong(const in IncidentLight directLight,const in GeometricContext geometry,const in BlinnPhongMaterial material,inout ReflectedLight reflectedLight){float dotNL=saturate(dot(geometry.normal,directLight.direction));vec3 irradiance=dotNL*directLight.color;reflectedLight.directDiffuse+=irradiance*BRDF_Diffuse_Lambert(material.diffuseColor);reflectedLight.directSpecular+=irradiance*BRDF_Specular_BlinnPhong(directLight,geometry,material.specularColor,material.specularShininess);}void RE_IndirectDiffuse_BlinnPhong(const in vec3 irradiance,const in GeometricContext geometry,const in BlinnPhongMaterial material,inout ReflectedLight reflectedLight){reflectedLight.indirectDiffuse+=irradiance*BRDF_Diffuse_Lambert(material.diffuseColor);}void main(){vec3 diffuseColor=diffuse;ReflectedLight reflectedLight=ReflectedLight(vec3(0.0),vec3(0.0),vec3(0.0),vec3(0.0));diffuseColor*=vColor;vec3 fdx=dFdx(vViewPosition);vec3 fdy=dFdy(vViewPosition);vec3 normal=normalize(cross(fdx,fdy));BlinnPhongMaterial material;material.diffuseColor=diffuseColor;material.specularColor=specular;material.specularShininess=shininess;GeometricContext geometry;geometry.position=-vViewPosition;geometry.normal=normal;geometry.viewDir=normalize(vViewPosition);IncidentLight directLight;DirectionalLight directionalLight;for(int i=0;i<NUM_DIR_LIGHTS;i++){directionalLight=directionalLights[i];getDirectionalDirectLightIrradiance(directionalLight,geometry,directLight);RE_Direct_BlinnPhong(directLight,geometry,material,reflectedLight);}vec3 irradiance=getAmbientLightIrradiance(ambientLightColor);RE_IndirectDiffuse_BlinnPhong(irradiance,geometry,material,reflectedLight);vec3 outgoingLight=reflectedLight.directDiffuse+reflectedLight.indirectDiffuse+reflectedLight.directSpecular+reflectedLight.indirectSpecular+emissive;float depth=gl_FragCoord.z/gl_FragCoord.w;float fogFactor=smoothstep(fogNear,fogFar,depth);gl_FragColor=vec4(mix(outgoingLight,fogColor,fogFactor),1.0);}",
        vi = c.getContext("webgl");
    vi.clearColor(0, 0, 0, 0), vi.enable(vi.DEPTH_TEST), vi.enable(vi.CULL_FACE), vi.getExtension("OES_standard_derivatives");
    var mi = !0,
        di = xe();
    di.fogColor = W(1, 1, 1), di.fogNear = 1, di.fogFar = 1e3;
    var gi, pi, fi = ((e = 60, r = 1, i = .1, t = 2e3) => {
        var o = { ...xe(),
            fov: e,
            near: i,
            far: t,
            aspect: r,
            up: V(le),
            matrixWorldInverse: me(),
            projectionMatrix: me()
        };
        return Ce(o), o
    })(90);
    ((e, r) => {
        "pointerLockElement" in document ? (document.addEventListener("pointerlockchange", () => {
            e.enabled = r === document.pointerLockElement
        }), document.addEventListener("click", () => r.requestPointerLock())) : e.enabled = !0
    })((pi = {
        object: gi = fi,
        sensitivity: .002,
        enabled: !1,
        onMouseMove(e) {
            if (pi.enabled) {
                var {
                    movementX: r,
                    movementY: i
                } = e, t = -i * pi.sensitivity, o = -r * pi.sensitivity;
                he(ue(Me, t, 0, 0, 1)), he(ue(Fe, 0, o, 0, 1)), ye(gi.quaternion, Me), ye(Fe, gi.quaternion), Object.assign(gi.quaternion, Fe)
            }
        }
    }, document.addEventListener("mousemove", pi.onMouseMove), pi), c);
    var ui = ((i, t, o) => {
            var n = [.8, .9, 1];
            i.clearColor(...n, 1), G(t.fogColor, ...n), t.fogFar = 2048;
            var a = xe();
            ze(t, a);
            var c = (() => {
                    var e = {};
                    return document.addEventListener("keydown", r => e[r.code] = !0), document.addEventListener("keyup", r => e[r.code] = !1), e
                })(),
                s = W(.3, .3, .3),
                l = hr(W(.8, .8, 1));
            G(l.position, 0, 64, 256);
            var v = hr(W(.5, .5, .6), 4);
            G(v.position, 128, 512, -128);
            var m = [l, v];
            m.map(e => ze(a, e));
            var d = xe();
            ze(d, o), ze(a, d);
            var g = Vr(Gr(We(30, 56, 30), Wr()), 2);
            g.position.y += 28, g.visible = !1, ze(a, g);
            var p = ((e, r) => ({
                object: e,
                body: r,
                scene: void 0,
                command: {
                    forward: 0,
                    right: 0,
                    up: 0,
                    hook: 0
                },
                dt: 0,
                gravity: 800,
                speed: 320,
                viewForward: W(),
                viewRight: W(),
                grapplePoint: W(),
                movementFlags: 0,
                walking: !1,
                groundPlane: !1,
                groundTrace: {
                    normal: W(0, 1, 0)
                }
            }))(g, (e => ((e, r) => e.components.find(r))(e, Nr))(g));
            p.scene = a;
            var f = W(8, -8, 0),
                u = W(),
                h = W(),
                y = fr("nz")(We(2, 1, 1)),
                x = Wr();
            G(x.color, .1, .1, .1), G(x.emissive, .9, .9, 1);
            var w = Gr(y, x);
            w.visible = !1, ze(a, w);
            var z = We(3, 3, 3),
                b = Wr();
            G(b.specular, .3, .3, .3);
            var L = Gr(z, b);
            L.visible = !1, ze(a, L);
            var _ = 100,
                R = _ / 6,
                A = _ / 8,
                D = document.querySelector(".g"),
                j = document.querySelector(".p");
            j.hidden = !1;
            var B = [
                    [0, 60, 0],
                    [0, 180, -900],
                    [372, 80, -2700],
                    [1560, 24, -2960],
                    [2480, 128, -1600],
                    [5448, 80, -2112],
                    [5876, 200, -7200],
                    [8192, -144, -11800]
                ].map(([e, r, i]) => W(e, r, i)),
                I = 0,
                E = qe(mr(fr("ny"), ur({
                    py: [0, 1, 0]
                }))(We(24, 24, 24)), mr(fr("py"), ur({
                    ny: [0, 1, 0]
                }))(We(24, 24, 24))),
                O = B.map((e, r) => {
                    var i = Wr();
                    G(i.color, .5, .5, .5), G(i.emissive, .5, .5, .5);
                    var t = Gr(E, i);
                    return Object.assign(t.position, e), t.position.y += 28, t.visible = r > 0, ze(a, t), t
                }),
                S = je(W(7680, -260, -12312), W(8704, 0, -11288)),
                k = Wr(),
                T = Vr(Gr(We(1024, 24, 1024), k), 1);
            ze(a, T), G(k.color, .5, .5, .5), G(T.position, 8192, 5120, -11800), Re(a, Pe({
                update(r, i) {
                    var t = Ur(a);
                    $r(t), p.dt = i, p.command.forward = 0, p.command.right = 0, p.command.up = 0, p.command.hook = 0, (c.KeyW || c.ArrowUp) && p.command.forward++, (c.KeyS || c.ArrowDown) && p.command.forward--, (c.KeyA || c.ArrowLeft) && p.command.right--, (c.KeyD || c.ArrowRight) && p.command.right++, c.Space && p.command.up++, (c.ShiftLeft || c.ShiftRight) && p.command.hook++, p.command.forward *= 127, p.command.right *= 127, p.command.up *= 127, Q(G(p.viewForward, 0, 0, -1), o.quaternion), ie(te(G(p.viewRight, 0, -1, 0), p.viewForward)), (e => {
                        e.command.up < 10 && (e.movementFlags &= -3), ri(e), 2048 & e.movementFlags ? (Qr(e), Xr(e)) : e.walking ? Yr(e) : Xr(e), ri(e)
                    })(p), Object.assign(d.position, g.position);
                    var n = ii();
                    Object.assign(n.origin, g.position), G(n.direction, 0, 0, -1), Q(n.direction, o.quaternion);
                    var s = 3072 & p.movementFlags;
                    if (p.command.hook) {
                        if (!s) {
                            var l = ((e, r) => [].concat(...r.map(r => oi(e, r))).sort((e, r) => e.distance - r.distance))(n, t.map(e => e.parent).filter(e => e !== g));
                            l.length && (Object.assign(p.grapplePoint, l[0].point), Object.assign(L.position, g.position), N(L.position, Q(Object.assign(u, f), o.quaternion)), p.movementFlags |= 1024, (() => P(C.a3))())
                        }
                    } else p.movementFlags &= -3073;
                    if (s = 3072 & p.movementFlags, w.visible = s, L.visible = s, s) {
                        if (1024 & p.movementFlags) {
                            $(h, p.grapplePoint, L.position);
                            var v = Math.min(re(h), 1024 * i);
                            ie(h), U(L.position, h, v), v || (p.movementFlags &= -1025, p.movementFlags |= 2048, (() => P(M.a3))())
                        }
                        Object.assign(w.position, g.position), N(w.position, Q(Object.assign(u, f), o.quaternion)), w.scale.z = ne(w.position, L.position), we(w, L.position)
                    }(_ += s ? -R * i : A * i) <= 0 && (p.movementFlags &= -3073, c.ShiftLeft = !1, c.ShiftRight = !1), _ = e(_, 0, 100), j.style.setProperty("--p-w", `${_}%`);
                    var m = ((e, r, i, t, o) => t + (e - r) * (o - t) / (i - r))(g.position.y, -512, -1536, 1, 0);
                    D.style.opacity = e(m, 0, 1), B.map((e, r) => {
                        var i = O[r],
                            t = 1 === i.material.emissive.y;
                        e && ne(g.position, e) <= 64 && (I = r, i.material.emissive.y = 1, !t && r > 0 && (() => P(F.e3))())
                    });
                    var y = g.position.y <= -2048,
                        x = B[I];
                    y && x && ((() => P(F.a2))(), Object.assign(g.position, x), _ = 100), ((e, r) => e.min.x <= r.x && r.x <= e.max.x && e.min.y <= r.y && r.y <= e.max.y && e.min.z <= r.z && r.z <= e.max.z)(S, g.position) && (T.position.y -= 2048 * i, T.position.y = Math.max(-132, T.position.y))
                }
            }));
            var q = (({
                    octaves: e = 8,
                    period: r = 16,
                    lacunarity: i = 2,
                    gain: t = .5
                } = {}) => (o, n, a) => {
                    for (var c = 1 / r, s = t, l = 0, v = 0; v < e; v++) l += s * qr(o * c, n * c, a * c), c *= i, s *= t;
                    return l
                })(),
                H = (e, r, i, t, o = 1, n = 1, a = [], c = [], s = 1) => {
                    var l = qe(mr(fr("ny"), ur({
                        py: [o, 1, o]
                    }), ...a)(We(e, i, r)), mr(fr("py"), ur({
                        ny: [n, 1, n]
                    }), ...c)(We(e, t, r)));
                    return l.vertices.map(((e, r = 1) => i => Y(i, 1 + r * q(i.x + e, i.y + e, i.z + e)))(e * Math.random(), s)), l
                },
                V = (...e) => H(...e, .6, .2, [], [pr([.8, .8, .8]), gr({
                    ny: [.3, .2, .2]
                })]),
                K = [.6, .6, .6],
                X = [pr(K)],
                J = [pr(K), gr({
                    ny: [.3, .2, .2]
                })],
                Z = (e, r, i) => {
                    var t = Vr(Gr(e, r), 1);
                    se(t.position, i), ze(a, t)
                };
            [
                [V(128, 128, 16, 32), [-64, 16, -320]],
                [V(128, 128, 16, 32), [-32, 48, -512]],
                [V(128, 128, 16, 32), [0, 80, -704]],
                [V(128, 128, 16, 32), [0, 120, -920]],
                [V(192, 400, 16, 32), [-256, -72, -1536]],
                [V(512, 192, 24, 32), [360, 16, -2700]],
                [V(128, 128, 12, 32), [960, -64, -2800]],
                [V(128, 128, 12, 24), [1560, -24, -2950]],
                [V(192, 1024, 40, 128), [1920, 116, -2160]],
                [V(768, 512, 32, 128), [2496, 64, -1600]],
                [V(256, 256, 16, 32), [4672, 160, -1984]],
                [V(128, 128, 16, 32), [4864, 128, -2016]],
                [V(128, 128, 16, 32), [5056, 96, -2048]],
                [V(128, 128, 16, 32), [5248, 64, -2080]],
                [V(128, 128, 16, 32), [5448, 24, -2112]],
                [V(256, 1024, 24, 32), [5704, -128, -2784]],
                [V(512, 512, 24, 32), [5876, 128, -7200]],
                [V(360, 360, 16, 32), [6912, 128, -11456]]
            ].map(([e, i]) => {
                var t = Wr();
                G(t.color, .5, r(.7, .8), .5), Z(e, t, i)
            });
            var ee = (...e) => H(...e, r(.8, .9), r(.4, .6), X, J, .2);
            return [
                [ee(240, 480, 40, 480), [0, -24, 0]],
                [ee(384, 384, 384, 640), [-480, 170, -1536]],
                [ee(384, 384, 384, 680), [480, 130, -2048]],
                [ee(384, 384, 384, 480), [-480, 130, -2560]],
                [ee(768, 320, 1536, 512), [384, 256, -3072]],
                [ee(256, 300, 240, 128), [1440, 320, -2900]],
                [ee(256, 300, 240, 128), [1440, 320, -2960]],
                [ee(256, 300, 240, 320), [1920, 320, -3200]],
                [ee(240, 270, 240, 360), [2240, 272, -2800]],
                [ee(256, 192, 240, 360), [2240, 128, -2240]],
                [ee(256, 192, 240, 360), [3072, 0, -1440]],
                [ee(256, 256, 256, 360), [3584, 128, -1952]],
                [ee(256, 256, 320, 240), [4096, 256, -1664]],
                [ee(160, 160, 208, 400), [4672, 448, -1984]],
                [ee(480, 480, 64, 128), [5768, 1600, -4032]],
                [ee(128, 256, 320, 480), [5448, 1472, -4928]],
                [ee(128, 384, 320, 240), [6088, 1536, -5888]],
                [ee(640, 128, 800, 512), [5768, 768, -6592]],
                [ee(256, 256, 640, 512), [6400, 0, -10496]],
                [ee(224, 224, 768, 576), [6912, 512, -11456]]
            ].map(([e, r]) => {
                var i = Wr();
                G(i.color, .5, .5, .5), Z(e, i, r)
            }), [
                [
                    [256, 64, 64],
                    [2508, 96, -1500]
                ],
                [
                    [64, 56, 320],
                    [2240, 96, -1600]
                ],
                [
                    [128, 128, 2048],
                    [5920, -320, -8736]
                ],
                [
                    [1024, 8, 1024],
                    [8192, -260, -11800]
                ],
                [
                    [1024, 128, 32],
                    [8192, -192, -12312]
                ],
                [
                    [1024, 128, 32],
                    [8192, -192, -11288]
                ],
                [
                    [32, 128, 1024],
                    [7680, -192, -11800]
                ],
                [
                    [32, 128, 1024],
                    [8704, -192, -11800]
                ],
                [
                    [256, 64, 256],
                    [7936, -256, -12088]
                ]
            ].map(([e, r]) => {
                var i = Wr(),
                    t = Vr(Gr(We(...e), i), 1);
                G(i.color, .5, .5, .5), se(t.position, r), ze(a, t)
            }), {
                ambient: s,
                directional: m
            }
        })(vi, di, fi),
        hi = ((e, r, i) => {
            var t = e.createProgram(),
                o = (r, i) => {
                    var o = e.createShader(r);
                    e.shaderSource(o, i), e.compileShader(o), e.attachShader(t, o)
                };
            return o(e.VERTEX_SHADER, r), o(e.FRAGMENT_SHADER, i), e.linkProgram(t), t
        })(vi, "precision highp float;precision highp int;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;attribute vec3 position;varying vec3 vViewPosition;attribute vec3 color;varying vec3 vColor;void main(){vColor.xyz=color.xyz;vec4 mvPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mvPosition;vViewPosition=-mvPosition.xyz;}", li.replace(/NUM_DIR_LIGHTS/g, ui.directional.length));
    vi.useProgram(hi);
    var yi, xi = ((e, r) => {
            for (var i = {}, t = e.getProgramParameter(r, e.ACTIVE_ATTRIBUTES), o = 0; o < t; o++) {
                var n = e.getActiveAttrib(r, o),
                    {
                        name: a
                    } = n;
                i[a] = e.getAttribLocation(r, a)
            }
            return i
        })(vi, hi),
        wi = ((e, r) => {
            for (var i = {}, t = e.getProgramParameter(r, e.ACTIVE_UNIFORMS), o = 0; o < t; o++) {
                var n = e.getActiveUniform(r, o),
                    {
                        name: a
                    } = n;
                i[a] = e.getUniformLocation(r, a)
            }
            return i
        })(vi, hi),
        zi = 0,
        bi = new WeakMap,
        Li = (e, r, i, t) => {
            var o = bi.get(i);
            o || (o = {}, bi.set(i, o));
            var n = o[e];
            n || (n = ((e, r) => {
                var i = e.createBuffer();
                return e.bindBuffer(e.ARRAY_BUFFER, i), e.bufferData(e.ARRAY_BUFFER, r, e.STATIC_DRAW), i
            })(vi, i.attrs[e]), o[e] = n), ((e, r, i, t) => {
                e.bindBuffer(e.ARRAY_BUFFER, i), e.enableVertexAttribArray(r), e.vertexAttribPointer(r, t, e.FLOAT, !1, 0, 0)
            })(vi, r, n, t)
        },
        _i = new WeakMap,
        Ci = e => {
            var {
                geometry: r,
                material: i
            } = e;
            si(vi, wi.fogColor, di.fogColor), ai(vi, wi.fogNear, di.fogNear), ai(vi, wi.fogFar, di.fogFar), si(vi, wi.diffuse, i.color), si(vi, wi.specular, i.specular), ai(vi, wi.shininess, i.shininess), si(vi, wi.emissive, i.emissive), ge(e.modelViewMatrix, fi.matrixWorldInverse, e.matrixWorld), ci(vi, wi.modelViewMatrix, e.modelViewMatrix), ci(vi, wi.projectionMatrix, fi.projectionMatrix);
            var t = _i.get(r);
            t || (t = ((e, r) => q(e, (e => {
                var r = [],
                    i = [];
                return e.faces.map(t => {
                    r.push(e.vertices[t.a], e.vertices[t.b], e.vertices[t.c]);
                    var {
                        vertexColors: o
                    } = t;
                    if (3 === o.length) i.push(...o);
                    else {
                        var {
                            color: n
                        } = t;
                        i.push(n, n, n)
                    }
                }), {
                    vertices: r,
                    colors: i
                }
            })(r)))({
                attrs: {}
            }, r), _i.set(r, t)), Li("position", xi.position, t, 3), Li("color", xi.color, t, 3), vi.drawArrays(vi.TRIANGLES, 0, t.attrs.position.length / 3)
        },
        Mi = W(),
        Fi = () => {
            Le(di), pe(fi.matrixWorldInverse, fi.matrixWorld), vi.clear(vi.COLOR_BUFFER_BIT | vi.DEPTH_BUFFER_BIT), si(vi, wi.ambientLightColor, ui.ambient), ui.directional.map((e, r) => {
                var i = W(),
                    t = ce(Mi, e.matrixWorld);
                ce(i, e.target.matrixWorld), J(K(t, i), fi.matrixWorldInverse);
                var o = Y(Object.assign(i, e.color), e.intensity);
                si(vi, wi[`directionalLights[${r}].direction`], t), si(vi, wi[`directionalLights[${r}].color`], o)
            }), be(di, e => {
                e.visible && e.geometry && e.material && Ci(e)
            })
        },
        Pi = () => {
            (() => {
                var e = .001 * (performance.now() || 0);
                yi || (yi = e);
                var r = Math.min(e - yi, .1);
                for (zi += r, yi = e; zi >= 1 / 60;) be(di, e => {
                    De(e, 1 / 60, di)
                }), zi -= 1 / 60
            })(), Fi(), mi && requestAnimationFrame(Pi)
        },
        Ri = (e, r) => {
            var {
                devicePixelRatio: i = 1
            } = window;
            c.width = e * i, c.height = r * i, c.style.width = `${e}px`, c.style.height = `${r}px`, vi.viewport(0, 0, c.width, c.height), fi.aspect = e / r, Ce(fi)
        };
    Ri(window.innerWidth, window.innerHeight), Pi(), window.addEventListener("resize", () => {
        Ri(window.innerWidth, window.innerHeight), Fi()
    }), document.addEventListener("keypress", e => {
        "KeyP" === e.code && ((mi = !mi) ? Pi() : document.exitPointerLock())
    })
}();