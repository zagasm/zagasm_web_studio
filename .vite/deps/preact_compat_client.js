import {
  D,
  E,
  H,
  g,
  k,
  l,
  x
} from "./chunk-56LTLMIT.js";
import "./chunk-EWTE5DHJ.js";

// node_modules/preact/hooks/dist/hooks.module.js
var t;
var r;
var u;
var i;
var f = [];
var c = l;
var e = c.__b;
var a = c.__r;
var v = c.diffed;
var l2 = c.__c;
var m = c.unmount;
var s = c.__;
function j() {
  for (var n; n = f.shift(); ) if (n.__P && n.__H) try {
    n.__H.__h.forEach(z), n.__H.__h.forEach(B), n.__H.__h = [];
  } catch (t2) {
    n.__H.__h = [], c.__e(t2, n.__v);
  }
}
c.__b = function(n) {
  r = null, e && e(n);
}, c.__ = function(n, t2) {
  n && t2.__k && t2.__k.__m && (n.__m = t2.__k.__m), s && s(n, t2);
}, c.__r = function(n) {
  a && a(n), t = 0;
  var i2 = (r = n.__c).__H;
  i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n2) {
    n2.__N && (n2.__ = n2.__N), n2.i = n2.__N = void 0;
  })) : (i2.__h.forEach(z), i2.__h.forEach(B), i2.__h = [], t = 0)), u = r;
}, c.diffed = function(n) {
  v && v(n);
  var t2 = n.__c;
  t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w)(j)), t2.__H.__.forEach(function(n2) {
    n2.i && (n2.__H = n2.i), n2.i = void 0;
  })), u = r = null;
}, c.__c = function(n, t2) {
  t2.some(function(n2) {
    try {
      n2.__h.forEach(z), n2.__h = n2.__h.filter(function(n3) {
        return !n3.__ || B(n3);
      });
    } catch (r2) {
      t2.some(function(n3) {
        n3.__h && (n3.__h = []);
      }), t2 = [], c.__e(r2, n2.__v);
    }
  }), l2 && l2(n, t2);
}, c.unmount = function(n) {
  m && m(n);
  var t2, r2 = n.__c;
  r2 && r2.__H && (r2.__H.__.forEach(function(n2) {
    try {
      z(n2);
    } catch (n3) {
      t2 = n3;
    }
  }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w(n) {
  var t2, r2 = function() {
    clearTimeout(u2), k2 && cancelAnimationFrame(t2), setTimeout(n);
  }, u2 = setTimeout(r2, 100);
  k2 && (t2 = requestAnimationFrame(r2));
}
function z(n) {
  var t2 = r, u2 = n.__c;
  "function" == typeof u2 && (n.__c = void 0, u2()), r = t2;
}
function B(n) {
  var t2 = r;
  n.__c = n.__(), r = t2;
}

// node_modules/preact/compat/dist/compat.module.js
function g3(n, t2) {
  for (var e2 in t2) n[e2] = t2[e2];
  return n;
}
function E2(n, t2) {
  for (var e2 in n) if ("__source" !== e2 && !(e2 in t2)) return true;
  for (var r2 in t2) if ("__source" !== r2 && n[r2] !== t2[r2]) return true;
  return false;
}
function N(n, t2) {
  this.props = n, this.context = t2;
}
(N.prototype = new x()).isPureReactComponent = true, N.prototype.shouldComponentUpdate = function(n, t2) {
  return E2(this.props, n) || E2(this.state, t2);
};
var T2 = l.__b;
l.__b = function(n) {
  n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), T2 && T2(n);
};
var A2 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
var F2 = l.__e;
l.__e = function(n, t2, e2, r2) {
  if (n.then) {
    for (var u2, o = t2; o = o.__; ) if ((u2 = o.__c) && u2.__c) return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k), u2.__c(n, t2);
  }
  F2(n, t2, e2, r2);
};
var U = l.unmount;
function V(n, t2, e2) {
  return n && (n.__c && n.__c.__H && (n.__c.__H.__.forEach(function(n2) {
    "function" == typeof n2.__c && n2.__c();
  }), n.__c.__H = null), null != (n = g3({}, n)).__c && (n.__c.__P === e2 && (n.__c.__P = t2), n.__c = null), n.__k = n.__k && n.__k.map(function(n2) {
    return V(n2, t2, e2);
  })), n;
}
function W(n, t2, e2) {
  return n && e2 && (n.__v = null, n.__k = n.__k && n.__k.map(function(n2) {
    return W(n2, t2, e2);
  }), n.__c && n.__c.__P === t2 && (n.__e && e2.appendChild(n.__e), n.__c.__e = true, n.__c.__P = e2)), n;
}
function P2() {
  this.__u = 0, this.o = null, this.__b = null;
}
function j2(n) {
  var t2 = n.__.__c;
  return t2 && t2.__a && t2.__a(n);
}
function B2() {
  this.i = null, this.l = null;
}
l.unmount = function(n) {
  var t2 = n.__c;
  t2 && t2.__R && t2.__R(), t2 && 32 & n.__u && (n.type = null), U && U(n);
}, (P2.prototype = new x()).__c = function(n, t2) {
  var e2 = t2.__c, r2 = this;
  null == r2.o && (r2.o = []), r2.o.push(e2);
  var u2 = j2(r2.__v), o = false, i2 = function() {
    o || (o = true, e2.__R = null, u2 ? u2(c2) : c2());
  };
  e2.__R = i2;
  var c2 = function() {
    if (!--r2.__u) {
      if (r2.state.__a) {
        var n2 = r2.state.__a;
        r2.__v.__k[0] = W(n2, n2.__c.__P, n2.__c.__O);
      }
      var t3;
      for (r2.setState({ __a: r2.__b = null }); t3 = r2.o.pop(); ) t3.forceUpdate();
    }
  };
  r2.__u++ || 32 & t2.__u || r2.setState({ __a: r2.__b = r2.__v.__k[0] }), n.then(i2, i2);
}, P2.prototype.componentWillUnmount = function() {
  this.o = [];
}, P2.prototype.render = function(n, e2) {
  if (this.__b) {
    if (this.__v.__k) {
      var r2 = document.createElement("div"), o = this.__v.__k[0].__c;
      this.__v.__k[0] = V(this.__b, r2, o.__O = o.__P);
    }
    this.__b = null;
  }
  var i2 = e2.__a && g(k, null, n.fallback);
  return i2 && (i2.__u &= -33), [g(k, null, e2.__a ? null : n.children), i2];
};
var H2 = function(n, t2, e2) {
  if (++e2[1] === e2[0] && n.l.delete(t2), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.l.size)) for (e2 = n.i; e2; ) {
    for (; e2.length > 3; ) e2.pop()();
    if (e2[1] < e2[0]) break;
    n.i = e2 = e2[2];
  }
};
(B2.prototype = new x()).__a = function(n) {
  var t2 = this, e2 = j2(t2.__v), r2 = t2.l.get(n);
  return r2[0]++, function(u2) {
    var o = function() {
      t2.props.revealOrder ? (r2.push(u2), H2(t2, n, r2)) : u2();
    };
    e2 ? e2(o) : o();
  };
}, B2.prototype.render = function(n) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var t2 = H(n.children);
  n.revealOrder && "b" === n.revealOrder[0] && t2.reverse();
  for (var e2 = t2.length; e2--; ) this.l.set(t2[e2], this.i = [1, 0, this.i]);
  return n.children;
}, B2.prototype.componentDidUpdate = B2.prototype.componentDidMount = function() {
  var n = this;
  this.l.forEach(function(t2, e2) {
    H2(n, e2, t2);
  });
};
var q2 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
var G2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
var J2 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
var K = /[A-Z0-9]/g;
var Q = "undefined" != typeof document;
var X = function(n) {
  return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n);
};
function nn(n, t2, e2) {
  return null == t2.__k && (t2.textContent = ""), D(n, t2), "function" == typeof e2 && e2(), n ? n.__c : null;
}
function tn(n, t2, e2) {
  return E(n, t2), "function" == typeof e2 && e2(), n ? n.__c : null;
}
x.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t2) {
  Object.defineProperty(x.prototype, t2, { configurable: true, get: function() {
    return this["UNSAFE_" + t2];
  }, set: function(n) {
    Object.defineProperty(this, t2, { configurable: true, writable: true, value: n });
  } });
});
var en = l.event;
function rn() {
}
function un() {
  return this.cancelBubble;
}
function on() {
  return this.defaultPrevented;
}
l.event = function(n) {
  return en && (n = en(n)), n.persist = rn, n.isPropagationStopped = un, n.isDefaultPrevented = on, n.nativeEvent = n;
};
var cn;
var ln = { enumerable: false, configurable: true, get: function() {
  return this.class;
} };
var fn = l.vnode;
l.vnode = function(n) {
  "string" == typeof n.type && function(n2) {
    var t2 = n2.props, e2 = n2.type, u2 = {}, o = -1 === e2.indexOf("-");
    for (var i2 in t2) {
      var c2 = t2[i2];
      if (!("value" === i2 && "defaultValue" in t2 && null == c2 || Q && "children" === i2 && "noscript" === e2 || "class" === i2 || "className" === i2)) {
        var l3 = i2.toLowerCase();
        "defaultValue" === i2 && "value" in t2 && null == t2.value ? i2 = "value" : "download" === i2 && true === c2 ? c2 = "" : "translate" === l3 && "no" === c2 ? c2 = false : "o" === l3[0] && "n" === l3[1] ? "ondoubleclick" === l3 ? i2 = "ondblclick" : "onchange" !== l3 || "input" !== e2 && "textarea" !== e2 || X(t2.type) ? "onfocus" === l3 ? i2 = "onfocusin" : "onblur" === l3 ? i2 = "onfocusout" : J2.test(i2) && (i2 = l3) : l3 = i2 = "oninput" : o && G2.test(i2) ? i2 = i2.replace(K, "-$&").toLowerCase() : null === c2 && (c2 = void 0), "oninput" === l3 && u2[i2 = l3] && (i2 = "oninputCapture"), u2[i2] = c2;
      }
    }
    "select" == e2 && u2.multiple && Array.isArray(u2.value) && (u2.value = H(t2.children).forEach(function(n3) {
      n3.props.selected = -1 != u2.value.indexOf(n3.props.value);
    })), "select" == e2 && null != u2.defaultValue && (u2.value = H(t2.children).forEach(function(n3) {
      n3.props.selected = u2.multiple ? -1 != u2.defaultValue.indexOf(n3.props.value) : u2.defaultValue == n3.props.value;
    })), t2.class && !t2.className ? (u2.class = t2.class, Object.defineProperty(u2, "className", ln)) : (t2.className && !t2.class || t2.class && t2.className) && (u2.class = u2.className = t2.className), n2.props = u2;
  }(n), n.$$typeof = q2, fn && fn(n);
};
var an = l.__r;
l.__r = function(n) {
  an && an(n), cn = n.__c;
};
var sn = l.diffed;
l.diffed = function(n) {
  sn && sn(n);
  var t2 = n.props, e2 = n.__e;
  null != e2 && "textarea" === n.type && "value" in t2 && t2.value !== e2.value && (e2.value = null == t2.value ? "" : t2.value), cn = null;
};
function bn(n) {
  return !!n.__k && (D(null, n), true);
}

// node_modules/preact/compat/client.mjs
function createRoot(container) {
  return {
    // eslint-disable-next-line
    render: function(children) {
      nn(children, container);
    },
    // eslint-disable-next-line
    unmount: function() {
      bn(container);
    }
  };
}
function hydrateRoot(container, children) {
  tn(children, container);
  return createRoot(container);
}
var client_default = {
  createRoot,
  hydrateRoot
};
export {
  createRoot,
  client_default as default,
  hydrateRoot
};
//# sourceMappingURL=preact_compat_client.js.map
