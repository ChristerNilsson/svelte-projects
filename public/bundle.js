
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0,
        MAX_SAFE_INTEGER = 9007199254740991,
        MAX_INTEGER = 1.7976931348623157e+308,
        NAN = 0 / 0;

    /** `Object#toString` result references. */
    var funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        symbolTag = '[object Symbol]';

    /** Used to match leading and trailing whitespace. */
    var reTrim = /^\s+|\s+$/g;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeMax = Math.max;

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length &&
        (typeof value == 'number' || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8-9 which returns 'object' for typed array and other constructors.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    var lodash_range = range;

    /* src\App.svelte generated by Svelte v3.12.1 */

    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.i = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.i = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.i = list[i];
    	return child_ctx;
    }

    // (268:3) {#each range(200) as i}
    function create_each_block_2(ctx) {
    	var div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file, 268, 4, 7560);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_2.name, type: "each", source: "(268:3) {#each range(200) as i}", ctx });
    	return block;
    }

    // (271:3) {#each range(10) as i}
    function create_each_block_1(ctx) {
    	var div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "block3");
    			add_location(div, file, 271, 4, 7616);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_1.name, type: "each", source: "(271:3) {#each range(10) as i}", ctx });
    	return block;
    }

    // (283:5) {#each range(18) as i}
    function create_each_block(ctx) {
    	var div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file, 283, 6, 7910);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(283:5) {#each range(18) as i}", ctx });
    	return block;
    }

    function create_fragment(ctx) {
    	var div4, input, t0, div1, div0, t1, div3, div2, h20, t3, p, t4, b0, t6, b1, t8, b2, t10, br, t11, b3, t13, t14, button0, t16, header, h21, t18, h10, t20, main, div6, div5, t21, t22, section, div9, h22, t24, h11, t26, div8, div7, t27, h23, t28, span, t29, button1, t31, h3, dispose;

    	let each_value_2 = lodash_range(200);

    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = lodash_range(10);

    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = lodash_range(18);

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			input = element("input");
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			h20 = element("h2");
    			h20.textContent = "rules";
    			t3 = space();
    			p = element("p");
    			t4 = text("Please use the ");
    			b0 = element("b");
    			b0.textContent = "UP";
    			t6 = text(" key to rotate your tetromino, and ");
    			b1 = element("b");
    			b1.textContent = "LEFT";
    			t8 = text(" and ");
    			b2 = element("b");
    			b2.textContent = "RIGHT";
    			t10 = text(" to ");
    			br = element("br");
    			t11 = text(" move across the board. Pressing ");
    			b3 = element("b");
    			b3.textContent = "DOWN";
    			t13 = text(" will speed up the tetromino.");
    			t14 = space();
    			button0 = element("button");
    			button0.textContent = "X";
    			t16 = space();
    			header = element("header");
    			h21 = element("h2");
    			h21.textContent = "Welcome";
    			t18 = space();
    			h10 = element("h1");
    			h10.textContent = "to tetris";
    			t20 = space();
    			main = element("main");
    			div6 = element("div");
    			div5 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t21 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t22 = space();
    			section = element("section");
    			div9 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Your Score";
    			t24 = space();
    			h11 = element("h1");
    			h11.textContent = "0";
    			t26 = space();
    			div8 = element("div");
    			div7 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t27 = space();
    			h23 = element("h2");
    			t28 = text("Lines:");
    			span = element("span");
    			t29 = space();
    			button1 = element("button");
    			button1.textContent = "Start / Pause";
    			t31 = space();
    			h3 = element("h3");
    			h3.textContent = "made with love 2020";
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "toggler");
    			add_location(input, file, 248, 1, 6962);
    			add_location(div0, file, 249, 24, 7027);
    			attr_dev(div1, "class", "hamburger");
    			add_location(div1, file, 249, 1, 7004);
    			add_location(h20, file, 252, 3, 7100);
    			attr_dev(b0, "class", "bold");
    			add_location(b0, file, 253, 21, 7137);
    			attr_dev(b1, "class", "bold");
    			add_location(b1, file, 253, 78, 7194);
    			attr_dev(b2, "class", "bold");
    			add_location(b2, file, 253, 107, 7223);
    			add_location(br, file, 253, 136, 7252);
    			attr_dev(b3, "class", "bold");
    			add_location(b3, file, 253, 173, 7289);
    			add_location(p, file, 253, 3, 7119);
    			attr_dev(button0, "class", "close");
    			add_location(button0, file, 254, 3, 7351);
    			attr_dev(div2, "class", "menu-content");
    			add_location(div2, file, 251, 2, 7069);
    			attr_dev(div3, "class", "menu");
    			add_location(div3, file, 250, 1, 7047);
    			attr_dev(div4, "class", "menu-wrap");
    			add_location(div4, file, 247, 0, 6936);
    			add_location(h21, file, 260, 1, 7425);
    			add_location(h10, file, 261, 1, 7444);
    			add_location(header, file, 259, 0, 7414);
    			attr_dev(div5, "class", "grid");
    			add_location(div5, file, 266, 2, 7508);
    			attr_dev(div6, "class", "game");
    			add_location(div6, file, 265, 1, 7486);
    			attr_dev(h22, "class", "score");
    			add_location(h22, file, 278, 3, 7737);
    			attr_dev(h11, "class", "score-display");
    			add_location(h11, file, 279, 3, 7775);
    			attr_dev(div7, "class", "previous-grid");
    			add_location(div7, file, 281, 4, 7846);
    			attr_dev(span, "class", "lines-score");
    			add_location(span, file, 286, 36, 7985);
    			attr_dev(h23, "class", "lines-display");
    			add_location(h23, file, 286, 4, 7953);
    			attr_dev(div8, "class", "previous-shape");
    			add_location(div8, file, 280, 3, 7812);
    			attr_dev(div9, "class", "display");
    			add_location(div9, file, 277, 2, 7711);
    			attr_dev(button1, "class", "button");
    			attr_dev(button1, "href", "#");
    			add_location(button1, file, 289, 2, 8048);
    			attr_dev(h3, "class", "footer");
    			add_location(h3, file, 290, 2, 8131);
    			attr_dev(section, "class", "column-left");
    			add_location(section, file, 276, 1, 7678);
    			add_location(main, file, 264, 0, 7477);
    			dispose = listen_dev(button1, "click", ctx.startBtnClick);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, input);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h20);
    			append_dev(div2, t3);
    			append_dev(div2, p);
    			append_dev(p, t4);
    			append_dev(p, b0);
    			append_dev(p, t6);
    			append_dev(p, b1);
    			append_dev(p, t8);
    			append_dev(p, b2);
    			append_dev(p, t10);
    			append_dev(p, br);
    			append_dev(p, t11);
    			append_dev(p, b3);
    			append_dev(p, t13);
    			append_dev(div2, t14);
    			append_dev(div2, button0);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, header, anchor);
    			append_dev(header, h21);
    			append_dev(header, t18);
    			append_dev(header, h10);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div6);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div5, null);
    			}

    			append_dev(div5, t21);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div5, null);
    			}

    			append_dev(main, t22);
    			append_dev(main, section);
    			append_dev(section, div9);
    			append_dev(div9, h22);
    			append_dev(div9, t24);
    			append_dev(div9, h11);
    			append_dev(div9, t26);
    			append_dev(div9, div8);
    			append_dev(div8, div7);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div7, null);
    			}

    			append_dev(div8, t27);
    			append_dev(div8, h23);
    			append_dev(h23, t28);
    			append_dev(h23, span);
    			append_dev(section, t29);
    			append_dev(section, button1);
    			append_dev(section, t31);
    			append_dev(section, h3);
    		},

    		p: function update(changed, ctx) {
    			if (changed.range) {
    				const old_length = each_value_2.length;
    				each_value_2 = lodash_range(200);

    				let i;
    				for (i = old_length; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (!each_blocks_2[i]) {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div5, t21);
    					}
    				}

    				for (i = each_value_2.length; i < old_length; i += 1) {
    					each_blocks_2[i].d(1);
    				}
    				each_blocks_2.length = each_value_2.length;
    			}

    			if (changed.range) {
    				const old_length = each_value_1.length;
    				each_value_1 = lodash_range(10);

    				let i;
    				for (i = old_length; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (!each_blocks_1[i]) {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div5, null);
    					}
    				}

    				for (i = each_value_1.length; i < old_length; i += 1) {
    					each_blocks_1[i].d(1);
    				}
    				each_blocks_1.length = each_value_1.length;
    			}

    			if (changed.range) {
    				const old_length = each_value.length;
    				each_value = lodash_range(18);

    				let i;
    				for (i = old_length; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (!each_blocks[i]) {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div7, null);
    					}
    				}

    				for (i = each_value.length; i < old_length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div4);
    				detach_dev(t16);
    				detach_dev(header);
    				detach_dev(t20);
    				detach_dev(main);
    			}

    			destroy_each(each_blocks_2, detaching);

    			destroy_each(each_blocks_1, detaching);

    			destroy_each(each_blocks, detaching);

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    const width = 10;

    function instance($$self) {
    	

    	let currentIndex = 0;
    	let currentRotation = 0;
    	let score = 0;
    	let lines = 0;
    	let timerId;
    	let nextRandom = 0;

    	let squares;

    	const colors = [
    		'url(images/blue_block.png)',
    		'url(images/pink_block.png)',
    		'url(images/purple_block.png)',
    		'url(images/peach_block.png)',
    		'url(images/yellow_block.png)'
    	];

    	function control(e) {
    		if (e.key === 'd') moveright();
    		if (e.key === 'w') rotate();
    		if (e.key === 'a') moveleft();
    		if (e.key === 's') moveDown();
    	}
    	document.addEventListener('keypress', control);

    	//The Tetrominoes
    	const lTetromino = [
    		[1,width+1,width*2+1,2],
    		[width,width+1,width+2,width*2+2],
    		[1,width+1,width*2+1,width*2],
    		[width,width*2,width*2+1,width*2+2]
    	];

    	const zTetromino = [
    		[0,width,width+1,width*2+1],
    		[width+1, width+2,width*2,width*2+1],
    		[0,width,width+1,width*2+1],
    		[width+1, width+2,width*2,width*2+1]
    	];

    	const tTetromino = [
    		[1,width,width+1,width+2],
    		[1,width+1,width+2,width*2+1],
    		[width,width+1,width+2,width*2+1],
    		[1,width,width+1,width*2+1]
    	];

    	const oTetromino = [
    		[0,1,width,width+1],
    		[0,1,width,width+1],
    		[0,1,width,width+1],
    		[0,1,width,width+1]
    	];

    	const iTetromino = [
    		[1,width+1,width*2+1,width*3+1],
    		[width,width+1,width+2,width+3],
    		[1,width+1,width*2+1,width*3+1],
    		[width,width+1,width+2,width+3]
    	];

    	const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    	//Randomly Select Tetromino
    	let random = Math.floor(Math.random()*theTetrominoes.length);
    	let current = theTetrominoes[random][currentRotation];

    	//move the Tetromino moveDown
    	let currentPosition = 4;

    	//draw the shape
    	function draw() {
    		current.forEach( index => {
    			squares[currentPosition + index].classList.add('block');
    			squares[currentPosition + index].style.backgroundImage = colors[random];
    		});
    	}

    	//undraw the shape
    	function undraw() {
    		current.forEach( index => {
    			squares[currentPosition + index].classList.remove('block');
    			squares[currentPosition + index].style.backgroundImage = 'none';

    		});
    	}

    	//move down on loop
    	function moveDown() {
    		undraw();
    		currentPosition = currentPosition += width;
    		draw();
    		freeze();
    	}

    	//move left and prevent collisions with shapes moving left
    	function moveright() {
    		undraw();
    		const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    		if(!isAtRightEdge) currentPosition += 1;
    		if(current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
    			currentPosition -= 1;
    		}
    		draw();
    	}

    	//move right and prevent collisions with shapes moving right
    	function moveleft() {
    		undraw();
    		const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    		if(!isAtLeftEdge) currentPosition -= 1;
    		if(current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
    			currentPosition += 1;
    		}
    		draw();
    	}

    	//freeze the shape
    	function freeze() {
    		// if block has settled
    		if(current.some(index => squares[currentPosition + index + width].classList.contains('block3') || squares[currentPosition + index + width].classList.contains('block2'))) {
    			// make it block2
    			current.forEach(index => squares[index + currentPosition].classList.add('block2'));
    			// start a new tetromino falling
    			random = nextRandom;
    			nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    			current = theTetrominoes[random][currentRotation];
    			currentPosition = 4;
    			draw();
    			displayShape();
    			addScore();
    			gameOver();
    		}
    	}
    	freeze();

    	//Rotate the Tetromino
    	function rotate() {
    		undraw();
    		currentRotation ++;
    		if(currentRotation === current.length) {
    			currentRotation=0;
    		}
    		current = theTetrominoes[random][currentRotation];
    		draw();
    	}

    	//Game Over
    	function gameOver() {
    		if(current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
    			scoreDisplay.innerHTML = 'end';
    			clearInterval(timerId);
    		}
    	}


    onMount(async () => {

    		const grid = document.querySelector('.grid');
    		squares = Array.from(grid.querySelectorAll('div'));
    	//	const startBtn = document.querySelector('.button')
    		const hamburgerBtn = document.querySelector('.toggler');
    		const menu = document.querySelector('.menu');
    		const span = document.getElementsByClassName('close')[0];
    		const scoreDisplay = document.querySelector('.score-display');
    		const linesDisplay = document.querySelector('.lines-score');
    		const displaySquares = document.querySelectorAll('.previous-grid div');

    		//Styling eventListeners
    		hamburgerBtn.addEventListener('click', () => {
    			menu.style.display = 'flex';
    		});

    		span.addEventListener('click', () => {
    			menu.style.display = 'none';
    		});
    	

    	});

    	const startBtnClick = () => {
    		if (timerId) {
    			clearInterval(timerId);
    			timerId = null;
    		} else {
    			draw();
    			timerId = setInterval(moveDown, 1000);
    			nextRandom = Math.floor(Math.random()*theTetrominoes.length);
    			displayShape();
    		}
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('currentIndex' in $$props) currentIndex = $$props.currentIndex;
    		if ('currentRotation' in $$props) currentRotation = $$props.currentRotation;
    		if ('score' in $$props) score = $$props.score;
    		if ('lines' in $$props) lines = $$props.lines;
    		if ('timerId' in $$props) timerId = $$props.timerId;
    		if ('nextRandom' in $$props) nextRandom = $$props.nextRandom;
    		if ('squares' in $$props) squares = $$props.squares;
    		if ('random' in $$props) random = $$props.random;
    		if ('current' in $$props) current = $$props.current;
    		if ('currentPosition' in $$props) currentPosition = $$props.currentPosition;
    	};

    	return { startBtnClick };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment.name });
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
