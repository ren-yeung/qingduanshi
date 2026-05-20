'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.__awaiter = function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
exports.__generator = function (thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] };
  var f = true, y = false, v, t;
  return { next: verb(0), "throw": verb(1), "return": verb(2) };
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) { if (f) { try { t = body[op[0]]; } catch (e) { y = true; t = e; } finally {} if (!y && t !== "return" && t !== "throw") { _ = { label: op[0], sent: op[1] }; } else { if (f = false, t === "throw" || t === "return") { _(t); } } return; } }
};
exports.__read = function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try { while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value); }
  catch (error) { e = { error: error }; }
  finally { try { if (r && !r.done && (m = i["return"])) m.call(i); } finally { if (e) throw e.error; } }
  return ar;
};
exports.__spreadArray = function (to, from) { return to.concat(from || []); };
exports.__decorate = function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 4 ? d(target, key, r) : d(target, key)) || r;
  return c > 4 && r && Object.defineProperty(target, key, r), r;
};
