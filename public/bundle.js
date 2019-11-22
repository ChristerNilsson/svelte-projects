
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, callback) {
        const unsub = store.subscribe(callback);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
            : ctx.$$scope.ctx;
    }
    function get_slot_changes(definition, ctx, changed, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
            : ctx.$$scope.changed || {};
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
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
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        if (component.$$.props.indexOf(name) === -1)
            return;
        component.$$.bound[name] = callback;
        callback(component.$$.ctx[name]);
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
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

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const shapeRendering = writable('crispEdges');

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

    /* src\Menu.svelte generated by Svelte v3.12.1 */

    const file = "src\\Menu.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.c = list[i];
    	return child_ctx;
    }

    // (27:2) {:else}
    function create_else_block(ctx) {
    	var div, t_value = ctx.c + "", t, dispose;

    	function click_handler_1() {
    		return ctx.click_handler_1(ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "mnu svelte-a3tg82");
    			set_style(div, "color", ctx.color);
    			add_location(div, file, 27, 3, 491);
    			dispose = listen_dev(div, "click", click_handler_1);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.children) && t_value !== (t_value = ctx.c + "")) {
    				set_data_dev(t, t_value);
    			}

    			if (changed.color) {
    				set_style(div, "color", ctx.color);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block.name, type: "else", source: "(27:2) {:else}", ctx });
    	return block;
    }

    // (25:2) {#if selected==c}
    function create_if_block(ctx) {
    	var div, t_value = ctx.c + "", t, dispose;

    	function click_handler() {
    		return ctx.click_handler(ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "mnu text-red svelte-a3tg82");
    			add_location(div, file, 25, 3, 409);
    			dispose = listen_dev(div, "click", click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.children) && t_value !== (t_value = ctx.c + "")) {
    				set_data_dev(t, t_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(25:2) {#if selected==c}", ctx });
    	return block;
    }

    // (24:1) {#each children as c}
    function create_each_block(ctx) {
    	var if_block_anchor;

    	function select_block_type(changed, ctx) {
    		if (ctx.selected==ctx.c) return create_if_block;
    		return create_else_block;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},

    		d: function destroy(detaching) {
    			if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(24:1) {#each children as c}", ctx });
    	return block;
    }

    function create_fragment(ctx) {
    	var div;

    	let each_value = ctx.children;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(div, "class", "nav svelte-a3tg82");
    			set_style(div, "background-color", ctx.bgcolor);
    			add_location(div, file, 22, 0, 307);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if (changed.selected || changed.children || changed.color) {
    				each_value = ctx.children;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if (changed.bgcolor) {
    				set_style(div, "background-color", ctx.bgcolor);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { color='black', bgcolor='grey', children, selected = children[0] } = $$props;

    	const writable_props = ['color', 'bgcolor', 'children', 'selected'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = ({ c }) => $$invalidate('selected', selected=c);

    	const click_handler_1 = ({ c }) => $$invalidate('selected', selected=c);

    	$$self.$set = $$props => {
    		if ('color' in $$props) $$invalidate('color', color = $$props.color);
    		if ('bgcolor' in $$props) $$invalidate('bgcolor', bgcolor = $$props.bgcolor);
    		if ('children' in $$props) $$invalidate('children', children = $$props.children);
    		if ('selected' in $$props) $$invalidate('selected', selected = $$props.selected);
    	};

    	$$self.$capture_state = () => {
    		return { color, bgcolor, children, selected };
    	};

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate('color', color = $$props.color);
    		if ('bgcolor' in $$props) $$invalidate('bgcolor', bgcolor = $$props.bgcolor);
    		if ('children' in $$props) $$invalidate('children', children = $$props.children);
    		if ('selected' in $$props) $$invalidate('selected', selected = $$props.selected);
    	};

    	return {
    		color,
    		bgcolor,
    		children,
    		selected,
    		click_handler,
    		click_handler_1
    	};
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["color", "bgcolor", "children", "selected"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Menu", options, id: create_fragment.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.children === undefined && !('children' in props)) {
    			console.warn("<Menu> was created without expected prop 'children'");
    		}
    	}

    	get color() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bgcolor() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bgcolor(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Canvas.svelte generated by Svelte v3.12.1 */

    const file$1 = "src\\Canvas.svelte";

    function create_fragment$1(ctx) {
    	var svg, rect, current, dispose;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			rect = svg_element("rect");

    			if (default_slot) default_slot.c();
    			attr_dev(rect, "width", "200");
    			attr_dev(rect, "height", "200");
    			set_style(rect, "stroke-width", "0");
    			add_location(rect, file$1, 14, 1, 292);

    			attr_dev(svg, "class", "col left s6 svelte-nsyltz");
    			attr_dev(svg, "width", "200");
    			attr_dev(svg, "height", "200");
    			set_style(svg, "margin", "2px 2px 0px");
    			attr_dev(svg, "shape-rendering", ctx.$shapeRendering);
    			add_location(svg, file$1, 13, 0, 181);
    			dispose = listen_dev(rect, "click", ctx.click);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(svg_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, rect);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}

    			if (!current || changed.$shapeRendering) {
    				attr_dev(svg, "shape-rendering", ctx.$shapeRendering);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(svg);
    			}

    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $shapeRendering;

    	validate_store(shapeRendering, 'shapeRendering');
    	component_subscribe($$self, shapeRendering, $$value => { $shapeRendering = $$value; $$invalidate('$shapeRendering', $shapeRendering); });

    	let { click = () => {} } = $$props;

    	const writable_props = ['click'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Canvas> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('click' in $$props) $$invalidate('click', click = $$props.click);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { click, $shapeRendering };
    	};

    	$$self.$inject_state = $$props => {
    		if ('click' in $$props) $$invalidate('click', click = $$props.click);
    		if ('$shapeRendering' in $$props) shapeRendering.set($shapeRendering);
    	};

    	return { click, $shapeRendering, $$slots, $$scope };
    }

    class Canvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["click"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Canvas", options, id: create_fragment$1.name });
    	}

    	get click() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set click(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Grid.svelte generated by Svelte v3.12.1 */

    const file$2 = "src\\Grid.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.i = list[i];
    	return child_ctx;
    }

    // (19:1) {#each range(0,200,20) as i}
    function create_each_block$1(ctx) {
    	var line0, t, line1;

    	const block = {
    		c: function create() {
    			line0 = svg_element("line");
    			t = space();
    			line1 = svg_element("line");
    			attr_dev(line0, "x1", ctx.i);
    			attr_dev(line0, "y1", 0);
    			attr_dev(line0, "x2", ctx.i);
    			attr_dev(line0, "y2", 200);
    			attr_dev(line0, "class", "grid svelte-1qz94ed");
    			add_location(line0, file$2, 19, 4, 290);
    			attr_dev(line1, "y1", ctx.i);
    			attr_dev(line1, "x1", 0);
    			attr_dev(line1, "y2", ctx.i);
    			attr_dev(line1, "x2", 200);
    			attr_dev(line1, "class", "grid svelte-1qz94ed");
    			add_location(line1, file$2, 20, 4, 345);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, line0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, line1, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(line0);
    				detach_dev(t);
    				detach_dev(line1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$1.name, type: "each", source: "(19:1) {#each range(0,200,20) as i}", ctx });
    	return block;
    }

    // (18:0) <Canvas {click}>
    function create_default_slot(ctx) {
    	var t, current;

    	let each_value = lodash_range(0,200,20);

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();

    			if (default_slot) default_slot.c();
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.range) {
    				each_value = lodash_range(0,200,20);

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(t);
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot.name, type: "slot", source: "(18:0) <Canvas {click}>", ctx });
    	return block;
    }

    function create_fragment$2(ctx) {
    	var current;

    	var canvas = new Canvas({
    		props: {
    		click: ctx.click,
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			canvas.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(canvas, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var canvas_changes = {};
    			if (changed.click) canvas_changes.click = ctx.click;
    			if (changed.$$scope) canvas_changes.$$scope = { changed, ctx };
    			canvas.$set(canvas_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(canvas.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(canvas.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(canvas, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	
    	let { click = () => {} } = $$props;

    	const writable_props = ['click'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('click' in $$props) $$invalidate('click', click = $$props.click);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { click };
    	};

    	$$self.$inject_state = $$props => {
    		if ('click' in $$props) $$invalidate('click', click = $$props.click);
    	};

    	return { click, $$slots, $$scope };
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["click"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Grid", options, id: create_fragment$2.name });
    	}

    	get click() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set click(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Rect.svelte generated by Svelte v3.12.1 */

    const file$3 = "src\\Rect.svelte";

    // (5:0) <Grid>
    function create_default_slot$1(ctx) {
    	var rect0, t, rect1;

    	const block = {
    		c: function create() {
    			rect0 = svg_element("rect");
    			t = space();
    			rect1 = svg_element("rect");
    			attr_dev(rect0, "x", "10");
    			attr_dev(rect0, "y", "20");
    			attr_dev(rect0, "width", "30");
    			attr_dev(rect0, "height", "40");
    			set_style(rect0, "stroke-width", "1");
    			set_style(rect0, "stroke", "red");
    			set_style(rect0, "fill", "yellow");
    			add_location(rect0, file$3, 5, 1, 67);
    			attr_dev(rect1, "x", "30");
    			attr_dev(rect1, "y", "40");
    			attr_dev(rect1, "width", "40");
    			attr_dev(rect1, "height", "50");
    			set_style(rect1, "stroke-width", "1");
    			set_style(rect1, "stroke", "yellow");
    			set_style(rect1, "fill", "red");
    			add_location(rect1, file$3, 6, 1, 153);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, rect0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, rect1, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(rect0);
    				detach_dev(t);
    				detach_dev(rect1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$1.name, type: "slot", source: "(5:0) <Grid>", ctx });
    	return block;
    }

    function create_fragment$3(ctx) {
    	var current;

    	var grid = new Grid({
    		props: {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			grid.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var grid_changes = {};
    			if (changed.$$scope) grid_changes.$$scope = { changed, ctx };
    			grid.$set(grid_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    class Rect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$3, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Rect", options, id: create_fragment$3.name });
    	}
    }

    /* src\Circle.svelte generated by Svelte v3.12.1 */

    const file$4 = "src\\Circle.svelte";

    // (5:0) <Grid>
    function create_default_slot$2(ctx) {
    	var circle0, t0, circle1, t1, circle2;

    	const block = {
    		c: function create() {
    			circle0 = svg_element("circle");
    			t0 = space();
    			circle1 = svg_element("circle");
    			t1 = space();
    			circle2 = svg_element("circle");
    			attr_dev(circle0, "cx", "50");
    			attr_dev(circle0, "cy", "40");
    			attr_dev(circle0, "r", "40");
    			set_style(circle0, "stroke-width", "2");
    			set_style(circle0, "stroke", "red");
    			set_style(circle0, "fill", "yellow");
    			add_location(circle0, file$4, 5, 1, 67);
    			attr_dev(circle1, "cx", "130");
    			attr_dev(circle1, "cy", "140");
    			attr_dev(circle1, "r", "60");
    			set_style(circle1, "stroke-width", "3");
    			set_style(circle1, "stroke", "yellow");
    			set_style(circle1, "fill", "red");
    			add_location(circle1, file$4, 6, 1, 143);
    			attr_dev(circle2, "cx", "100");
    			attr_dev(circle2, "cy", "100");
    			attr_dev(circle2, "r", "50");
    			set_style(circle2, "stroke-width", "5");
    			set_style(circle2, "stroke", "white");
    			set_style(circle2, "fill", "black");
    			add_location(circle2, file$4, 7, 1, 221);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, circle0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, circle1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, circle2, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(circle0);
    				detach_dev(t0);
    				detach_dev(circle1);
    				detach_dev(t1);
    				detach_dev(circle2);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$2.name, type: "slot", source: "(5:0) <Grid>", ctx });
    	return block;
    }

    function create_fragment$4(ctx) {
    	var current;

    	var grid = new Grid({
    		props: {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			grid.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var grid_changes = {};
    			if (changed.$$scope) grid_changes.$$scope = { changed, ctx };
    			grid.$set(grid_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    class Circle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$4, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Circle", options, id: create_fragment$4.name });
    	}
    }

    /* src\Line.svelte generated by Svelte v3.12.1 */

    const file$5 = "src\\Line.svelte";

    // (5:0) <Grid>
    function create_default_slot$3(ctx) {
    	var line0, t, line1;

    	const block = {
    		c: function create() {
    			line0 = svg_element("line");
    			t = space();
    			line1 = svg_element("line");
    			attr_dev(line0, "x1", "50");
    			attr_dev(line0, "y1", "40");
    			attr_dev(line0, "x2", "100");
    			attr_dev(line0, "y2", "100");
    			set_style(line0, "stroke-width", "2");
    			set_style(line0, "stroke", "red");
    			add_location(line0, file$5, 5, 1, 67);
    			attr_dev(line1, "x1", "100");
    			attr_dev(line1, "y1", "100");
    			attr_dev(line1, "x2", "190");
    			attr_dev(line1, "y2", "100");
    			set_style(line1, "stroke-width", "5");
    			set_style(line1, "stroke", "yellow");
    			add_location(line1, file$5, 6, 1, 140);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, line0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, line1, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(line0);
    				detach_dev(t);
    				detach_dev(line1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$3.name, type: "slot", source: "(5:0) <Grid>", ctx });
    	return block;
    }

    function create_fragment$5(ctx) {
    	var current;

    	var grid = new Grid({
    		props: {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			grid.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var grid_changes = {};
    			if (changed.$$scope) grid_changes.$$scope = { changed, ctx };
    			grid.$set(grid_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    class Line extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$5, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Line", options, id: create_fragment$5.name });
    	}
    }

    /* src\CRect.svelte generated by Svelte v3.12.1 */

    const file$6 = "src\\CRect.svelte";

    function create_fragment$6(ctx) {
    	var rect, rect_x_value, rect_y_value;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", rect_x_value = ctx.x-ctx.w/2);
    			attr_dev(rect, "y", rect_y_value = ctx.y-ctx.h/2);
    			attr_dev(rect, "width", ctx.w);
    			attr_dev(rect, "height", ctx.h);
    			attr_dev(rect, "style", ctx.style);
    			add_location(rect, file$6, 5, 0, 78);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.x || changed.w) && rect_x_value !== (rect_x_value = ctx.x-ctx.w/2)) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if ((changed.y || changed.h) && rect_y_value !== (rect_y_value = ctx.y-ctx.h/2)) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (changed.w) {
    				attr_dev(rect, "width", ctx.w);
    			}

    			if (changed.h) {
    				attr_dev(rect, "height", ctx.h);
    			}

    			if (changed.style) {
    				attr_dev(rect, "style", ctx.style);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(rect);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { x=0, y=0, w=100, h=100, style='' } = $$props;

    	const writable_props = ['x', 'y', 'w', 'h', 'style'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<CRect> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('x' in $$props) $$invalidate('x', x = $$props.x);
    		if ('y' in $$props) $$invalidate('y', y = $$props.y);
    		if ('w' in $$props) $$invalidate('w', w = $$props.w);
    		if ('h' in $$props) $$invalidate('h', h = $$props.h);
    		if ('style' in $$props) $$invalidate('style', style = $$props.style);
    	};

    	$$self.$capture_state = () => {
    		return { x, y, w, h, style };
    	};

    	$$self.$inject_state = $$props => {
    		if ('x' in $$props) $$invalidate('x', x = $$props.x);
    		if ('y' in $$props) $$invalidate('y', y = $$props.y);
    		if ('w' in $$props) $$invalidate('w', w = $$props.w);
    		if ('h' in $$props) $$invalidate('h', h = $$props.h);
    		if ('style' in $$props) $$invalidate('style', style = $$props.style);
    	};

    	return { x, y, w, h, style };
    }

    class CRect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$6, safe_not_equal, ["x", "y", "w", "h", "style"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "CRect", options, id: create_fragment$6.name });
    	}

    	get x() {
    		throw new Error("<CRect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<CRect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<CRect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<CRect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get w() {
    		throw new Error("<CRect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set w(value) {
    		throw new Error("<CRect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get h() {
    		throw new Error("<CRect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set h(value) {
    		throw new Error("<CRect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<CRect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<CRect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\CText.svelte generated by Svelte v3.12.1 */

    const file$7 = "src\\CText.svelte";

    function create_fragment$7(ctx) {
    	var text_1, current;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");

    			if (default_slot) default_slot.c();

    			attr_dev(text_1, "x", ctx.x);
    			attr_dev(text_1, "y", ctx.y);
    			attr_dev(text_1, "style", ctx.style);
    			attr_dev(text_1, "text-anchor", "middle");
    			attr_dev(text_1, "alignment-baseline", "middle");
    			add_location(text_1, file$7, 5, 0, 66);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(text_1_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);

    			if (default_slot) {
    				default_slot.m(text_1, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}

    			if (!current || changed.x) {
    				attr_dev(text_1, "x", ctx.x);
    			}

    			if (!current || changed.y) {
    				attr_dev(text_1, "y", ctx.y);
    			}

    			if (!current || changed.style) {
    				attr_dev(text_1, "style", ctx.style);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(text_1);
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$7.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { x=0, y=0, style='' } = $$props;

    	const writable_props = ['x', 'y', 'style'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<CText> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('x' in $$props) $$invalidate('x', x = $$props.x);
    		if ('y' in $$props) $$invalidate('y', y = $$props.y);
    		if ('style' in $$props) $$invalidate('style', style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { x, y, style };
    	};

    	$$self.$inject_state = $$props => {
    		if ('x' in $$props) $$invalidate('x', x = $$props.x);
    		if ('y' in $$props) $$invalidate('y', y = $$props.y);
    		if ('style' in $$props) $$invalidate('style', style = $$props.style);
    	};

    	return { x, y, style, $$slots, $$scope };
    }

    class CText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$7, safe_not_equal, ["x", "y", "style"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "CText", options, id: create_fragment$7.name });
    	}

    	get x() {
    		throw new Error("<CText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<CText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<CText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<CText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<CText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<CText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Text.svelte generated by Svelte v3.12.1 */

    const file$8 = "src\\Text.svelte";

    // (24:3) <CText>
    function create_default_slot_1(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("Grumpy!");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_1.name, type: "slot", source: "(24:3) <CText>", ctx });
    	return block;
    }

    // (18:0) <Grid click={() => angle=angle+10}>
    function create_default_slot$4(ctx) {
    	var g2, g0, g1, g2_transform_value, current;

    	var crect = new CRect({
    		props: { w: "144", h: "45" },
    		$$inline: true
    	});

    	var ctext = new CText({
    		props: {
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			g2 = svg_element("g");
    			g0 = svg_element("g");
    			crect.$$.fragment.c();
    			g1 = svg_element("g");
    			ctext.$$.fragment.c();
    			attr_dev(g0, "class", "fn red svelte-15h7gt4");
    			add_location(g0, file$8, 19, 2, 447);
    			attr_dev(g1, "class", "sw0 fs40 f-yellow svelte-15h7gt4");
    			add_location(g1, file$8, 22, 2, 502);
    			attr_dev(g2, "transform", g2_transform_value = "translate(100,100) rotate(" + ctx.angle + ")");
    			add_location(g2, file$8, 18, 1, 392);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, g2, anchor);
    			append_dev(g2, g0);
    			mount_component(crect, g0, null);
    			append_dev(g2, g1);
    			mount_component(ctext, g1, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var ctext_changes = {};
    			if (changed.$$scope) ctext_changes.$$scope = { changed, ctx };
    			ctext.$set(ctext_changes);

    			if ((!current || changed.angle) && g2_transform_value !== (g2_transform_value = "translate(100,100) rotate(" + ctx.angle + ")")) {
    				attr_dev(g2, "transform", g2_transform_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(crect.$$.fragment, local);

    			transition_in(ctext.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(crect.$$.fragment, local);
    			transition_out(ctext.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(g2);
    			}

    			destroy_component(crect);

    			destroy_component(ctext);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$4.name, type: "slot", source: "(18:0) <Grid click={() => angle=angle+10}>", ctx });
    	return block;
    }

    function create_fragment$8(ctx) {
    	var current;

    	var grid = new Grid({
    		props: {
    		click: ctx.func,
    		$$slots: { default: [create_default_slot$4] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			grid.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var grid_changes = {};
    			if (changed.angle) grid_changes.click = ctx.func;
    			if (changed.$$scope || changed.angle) grid_changes.$$scope = { changed, ctx };
    			grid.$set(grid_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$8.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	
    	let angle = 0;

    	const func = () => $$invalidate('angle', angle=angle+10);

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('angle' in $$props) $$invalidate('angle', angle = $$props.angle);
    	};

    	return { angle, func };
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$8, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Text", options, id: create_fragment$8.name });
    	}
    }

    /* src\Each.svelte generated by Svelte v3.12.1 */

    const file$9 = "src\\Each.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.i = list[i];
    	return child_ctx;
    }

    // (10:1) {#each [50,100,150] as i}
    function create_each_block$2(ctx) {
    	var circle;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", ctx.i);
    			attr_dev(circle, "cy", ctx.i);
    			attr_dev(circle, "r", "10");
    			attr_dev(circle, "class", "svelte-1fr0k24");
    			add_location(circle, file$9, 10, 2, 170);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(circle);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$2.name, type: "each", source: "(10:1) {#each [50,100,150] as i}", ctx });
    	return block;
    }

    // (9:0) <Grid>
    function create_default_slot$5(ctx) {
    	var each_1_anchor;

    	let each_value = [50,100,150];

    	let each_blocks = [];

    	for (let i = 0; i < 3; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(each_1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$5.name, type: "slot", source: "(9:0) <Grid>", ctx });
    	return block;
    }

    function create_fragment$9(ctx) {
    	var current;

    	var grid = new Grid({
    		props: {
    		$$slots: { default: [create_default_slot$5] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			grid.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var grid_changes = {};
    			if (changed.$$scope) grid_changes.$$scope = { changed, ctx };
    			grid.$set(grid_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$9.name, type: "component", source: "", ctx });
    	return block;
    }

    class Each extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$9, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Each", options, id: create_fragment$9.name });
    	}
    }

    /* src\If.svelte generated by Svelte v3.12.1 */

    const file$a = "src\\If.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.i = list[i];
    	return child_ctx;
    }

    // (18:2) {:else}
    function create_else_block$1(ctx) {
    	var rect;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", 20*ctx.i-10);
    			attr_dev(rect, "y", 20*ctx.i-10);
    			attr_dev(rect, "width", "20");
    			attr_dev(rect, "height", "20");
    			attr_dev(rect, "class", "svelte-1604l3w");
    			add_location(rect, file$a, 18, 3, 289);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(rect);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$1.name, type: "else", source: "(18:2) {:else}", ctx });
    	return block;
    }

    // (16:2) {#if i%2==0}
    function create_if_block$1(ctx) {
    	var circle;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", 20*ctx.i);
    			attr_dev(circle, "cy", 20*ctx.i);
    			attr_dev(circle, "r", "10");
    			attr_dev(circle, "class", "svelte-1604l3w");
    			add_location(circle, file$a, 16, 3, 238);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(circle);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$1.name, type: "if", source: "(16:2) {#if i%2==0}", ctx });
    	return block;
    }

    // (15:1) {#each range(11) as i}
    function create_each_block$3(ctx) {
    	var if_block_anchor;

    	function select_block_type(changed, ctx) {
    		if (ctx.i%2==0) return create_if_block$1;
    		return create_else_block$1;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if_block.p(changed, ctx);
    		},

    		d: function destroy(detaching) {
    			if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$3.name, type: "each", source: "(15:1) {#each range(11) as i}", ctx });
    	return block;
    }

    // (14:0) <Grid>
    function create_default_slot$6(ctx) {
    	var each_1_anchor;

    	let each_value = lodash_range(11);

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.range) {
    				each_value = lodash_range(11);

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(each_1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$6.name, type: "slot", source: "(14:0) <Grid>", ctx });
    	return block;
    }

    function create_fragment$a(ctx) {
    	var current;

    	var grid = new Grid({
    		props: {
    		$$slots: { default: [create_default_slot$6] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			grid.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var grid_changes = {};
    			if (changed.$$scope) grid_changes.$$scope = { changed, ctx };
    			grid.$set(grid_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$a.name, type: "component", source: "", ctx });
    	return block;
    }

    class If extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$a, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "If", options, id: create_fragment$a.name });
    	}
    }

    /* src\Range.svelte generated by Svelte v3.12.1 */

    const file$b = "src\\Range.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.i = list[i];
    	return child_ctx;
    }

    // (11:1) {#each range(11) as i}
    function create_each_block$4(ctx) {
    	var circle;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", 20*ctx.i);
    			attr_dev(circle, "cy", 20*ctx.i);
    			attr_dev(circle, "r", 2*ctx.i);
    			attr_dev(circle, "class", "svelte-1fr0k24");
    			add_location(circle, file$b, 11, 2, 202);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(circle);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$4.name, type: "each", source: "(11:1) {#each range(11) as i}", ctx });
    	return block;
    }

    // (10:0) <Grid>
    function create_default_slot$7(ctx) {
    	var each_1_anchor;

    	let each_value = lodash_range(11);

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.range) {
    				each_value = lodash_range(11);

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(each_1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$7.name, type: "slot", source: "(10:0) <Grid>", ctx });
    	return block;
    }

    function create_fragment$b(ctx) {
    	var current;

    	var grid = new Grid({
    		props: {
    		$$slots: { default: [create_default_slot$7] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			grid.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var grid_changes = {};
    			if (changed.$$scope) grid_changes.$$scope = { changed, ctx };
    			grid.$set(grid_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$b.name, type: "component", source: "", ctx });
    	return block;
    }

    class Range extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$b, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Range", options, id: create_fragment$b.name });
    	}
    }

    /* src\Chess.svelte generated by Svelte v3.12.1 */

    const file$c = "src\\Chess.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.j = list[i];
    	return child_ctx;
    }

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.i = list[i];
    	return child_ctx;
    }

    // (11:3) {:else}
    function create_else_block$2(ctx) {
    	var rect;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", 20+20*ctx.i);
    			attr_dev(rect, "y", 20+20*ctx.j);
    			attr_dev(rect, "width", "20");
    			attr_dev(rect, "height", "20");
    			set_style(rect, "fill", "black");
    			add_location(rect, file$c, 11, 4, 268);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(rect);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$2.name, type: "else", source: "(11:3) {:else}", ctx });
    	return block;
    }

    // (9:3) {#if (i+j)%2==0}
    function create_if_block$2(ctx) {
    	var rect;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", 20+20*ctx.i);
    			attr_dev(rect, "y", 20+20*ctx.j);
    			attr_dev(rect, "width", "20");
    			attr_dev(rect, "height", "20");
    			set_style(rect, "fill", "white");
    			add_location(rect, file$c, 9, 4, 181);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(rect);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$2.name, type: "if", source: "(9:3) {#if (i+j)%2==0}", ctx });
    	return block;
    }

    // (8:2) {#each range(8) as j}
    function create_each_block_1(ctx) {
    	var if_block_anchor;

    	function select_block_type(changed, ctx) {
    		if ((ctx.i+ctx.j)%2==0) return create_if_block$2;
    		return create_else_block$2;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if_block.p(changed, ctx);
    		},

    		d: function destroy(detaching) {
    			if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_1.name, type: "each", source: "(8:2) {#each range(8) as j}", ctx });
    	return block;
    }

    // (7:1) {#each range(8) as i}
    function create_each_block$5(ctx) {
    	var each_1_anchor;

    	let each_value_1 = lodash_range(8);

    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.range) {
    				each_value_1 = lodash_range(8);

    				let i;
    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value_1.length;
    			}
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(each_1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$5.name, type: "each", source: "(7:1) {#each range(8) as i}", ctx });
    	return block;
    }

    // (6:0) <Canvas>
    function create_default_slot$8(ctx) {
    	var each_1_anchor;

    	let each_value = lodash_range(8);

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.range) {
    				each_value = lodash_range(8);

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(each_1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$8.name, type: "slot", source: "(6:0) <Canvas>", ctx });
    	return block;
    }

    function create_fragment$c(ctx) {
    	var current;

    	var canvas = new Canvas({
    		props: {
    		$$slots: { default: [create_default_slot$8] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			canvas.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(canvas, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var canvas_changes = {};
    			if (changed.$$scope) canvas_changes.$$scope = { changed, ctx };
    			canvas.$set(canvas_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(canvas.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(canvas.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(canvas, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$c.name, type: "component", source: "", ctx });
    	return block;
    }

    class Chess extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$c, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Chess", options, id: create_fragment$c.name });
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
    var INFINITY$1 = 1 / 0,
        MAX_SAFE_INTEGER$1 = 9007199254740991,
        MAX_INTEGER$1 = 1.7976931348623157e+308,
        NAN$1 = 0 / 0;

    /** `Object#toString` result references. */
    var funcTag$1 = '[object Function]',
        genTag$1 = '[object GeneratorFunction]',
        symbolTag$1 = '[object Symbol]';

    /** Used to match leading and trailing whitespace. */
    var reTrim$1 = /^\s+|\s+$/g;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex$1 = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary$1 = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal$1 = /^0o[0-7]+$/i;

    /** Used to detect unsigned integer values. */
    var reIsUint$1 = /^(?:0|[1-9]\d*)$/;

    /** Built-in method references without a dependency on `root`. */
    var freeParseFloat = parseFloat,
        freeParseInt$1 = parseInt;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString$1 = objectProto$1.toString;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeFloor = Math.floor,
        nativeMin = Math.min,
        nativeRandom = Math.random;

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex$1(value, length) {
      length = length == null ? MAX_SAFE_INTEGER$1 : length;
      return !!length &&
        (typeof value == 'number' || reIsUint$1.test(value)) &&
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
    function isIterateeCall$1(value, index, object) {
      if (!isObject$1(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike$1(object) && isIndex$1(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq$1(object[index], value);
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
    function eq$1(value, other) {
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
    function isArrayLike$1(value) {
      return value != null && isLength$1(value.length) && !isFunction$1(value);
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
    function isFunction$1(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8-9 which returns 'object' for typed array and other constructors.
      var tag = isObject$1(value) ? objectToString$1.call(value) : '';
      return tag == funcTag$1 || tag == genTag$1;
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
    function isLength$1(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
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
    function isObject$1(value) {
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
    function isObjectLike$1(value) {
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
    function isSymbol$1(value) {
      return typeof value == 'symbol' ||
        (isObjectLike$1(value) && objectToString$1.call(value) == symbolTag$1);
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
    function toFinite$1(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber$1(value);
      if (value === INFINITY$1 || value === -INFINITY$1) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER$1;
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
    function toNumber$1(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol$1(value)) {
        return NAN$1;
      }
      if (isObject$1(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject$1(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim$1, '');
      var isBinary = reIsBinary$1.test(value);
      return (isBinary || reIsOctal$1.test(value))
        ? freeParseInt$1(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex$1.test(value) ? NAN$1 : +value);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall$1(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toFinite$1(lower);
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toFinite$1(upper);
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    var lodash_random = random;

    /* src\Random.svelte generated by Svelte v3.12.1 */

    const file$d = "src\\Random.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.i = list[i];
    	return child_ctx;
    }

    // (8:1) {#each range(10) as i }
    function create_each_block$6(ctx) {
    	var circle;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", lodash_random(1,200));
    			attr_dev(circle, "cy", lodash_random(1,200));
    			attr_dev(circle, "r", lodash_random(10,20));
    			set_style(circle, "fill", "black");
    			set_style(circle, "stroke", "white");
    			set_style(circle, "stroke-width", "1");
    			add_location(circle, file$d, 8, 2, 166);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(circle);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$6.name, type: "each", source: "(8:1) {#each range(10) as i }", ctx });
    	return block;
    }

    // (7:0) <Grid>
    function create_default_slot$9(ctx) {
    	var each_1_anchor;

    	let each_value = lodash_range(10);

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.random || changed.range) {
    				each_value = lodash_range(10);

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(each_1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$9.name, type: "slot", source: "(7:0) <Grid>", ctx });
    	return block;
    }

    function create_fragment$d(ctx) {
    	var current;

    	var grid = new Grid({
    		props: {
    		$$slots: { default: [create_default_slot$9] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			grid.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var grid_changes = {};
    			if (changed.$$scope) grid_changes.$$scope = { changed, ctx };
    			grid.$set(grid_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$d.name, type: "component", source: "", ctx });
    	return block;
    }

    class Random extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$d, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Random", options, id: create_fragment$d.name });
    	}
    }

    /* src\Button.svelte generated by Svelte v3.12.1 */

    const file$e = "src\\Button.svelte";

    function create_fragment$e(ctx) {
    	var div, t0, t1, button, dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.i);
    			t1 = space();
    			button = element("button");
    			button.textContent = "Click!";
    			set_style(div, "color", "red");
    			add_location(div, file$e, 2, 0, 28);
    			add_location(button, file$e, 3, 0, 62);
    			dispose = listen_dev(button, "click", ctx.click_handler);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.i) {
    				set_data_dev(t0, ctx.i);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    				detach_dev(t1);
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$e.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let i=0;

    	const click_handler = () => $$invalidate('i', i++, i);

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('i' in $$props) $$invalidate('i', i = $$props.i);
    	};

    	return { i, click_handler };
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$e, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Button", options, id: create_fragment$e.name });
    	}
    }

    /* src\Click.svelte generated by Svelte v3.12.1 */

    function create_fragment$f(ctx) {
    	const block = {
    		c: noop,

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$f.name, type: "component", source: "", ctx });
    	return block;
    }

    class Click extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$f, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Click", options, id: create_fragment$f.name });
    	}
    }

    /* src\Shortcut.svelte generated by Svelte v3.12.1 */

    const file$f = "src\\Shortcut.svelte";

    function create_fragment$g(ctx) {
    	var div, t0, t1, t2, t3, button0, t5, button1, t7, button2, dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.a);
    			t1 = text(" to ");
    			t2 = text(b);
    			t3 = space();
    			button0 = element("button");
    			button0.textContent = "+2";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "*2";
    			t7 = space();
    			button2 = element("button");
    			button2.textContent = "/2";
    			set_style(div, "color", "white");
    			add_location(div, file$f, 6, 0, 74);
    			add_location(button0, file$f, 7, 0, 119);
    			add_location(button1, file$f, 8, 0, 163);
    			add_location(button2, file$f, 9, 0, 207);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler),
    				listen_dev(button1, "click", ctx.click_handler_1),
    				listen_dev(button2, "click", ctx.click_handler_2)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, button2, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.a) {
    				set_data_dev(t0, ctx.a);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    				detach_dev(t3);
    				detach_dev(button0);
    				detach_dev(t5);
    				detach_dev(button1);
    				detach_dev(t7);
    				detach_dev(button2);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$g.name, type: "component", source: "", ctx });
    	return block;
    }

    let b=1;

    function instance$7($$self, $$props, $$invalidate) {
    	let a=17;
    	const op=(value) => $$invalidate('a', a=value);

    	const click_handler = () => op(a+2);

    	const click_handler_1 = () => op(a*2);

    	const click_handler_2 = () => a%2==0 ? op(a/2):a;

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('a' in $$props) $$invalidate('a', a = $$props.a);
    		if ('b' in $$props) $$invalidate('b', b = $$props.b);
    	};

    	return {
    		a,
    		op,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	};
    }

    class Shortcut extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$g, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Shortcut", options, id: create_fragment$g.name });
    	}
    }

    /* src\ColorPair.svelte generated by Svelte v3.12.1 */

    const file$g = "src\\ColorPair.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.c = list[i];
    	return child_ctx;
    }

    // (16:2) {#each circles as c}
    function create_each_block$7(ctx) {
    	var circle, circle_cx_value, circle_cy_value, circle_fill_value, dispose;

    	function click_handler() {
    		return ctx.click_handler(ctx);
    	}

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", circle_cx_value = ctx.c.x);
    			attr_dev(circle, "cy", circle_cy_value = ctx.c.y);
    			attr_dev(circle, "r", r);
    			attr_dev(circle, "fill", circle_fill_value = ctx.c.color);
    			add_location(circle, file$g, 16, 3, 397);
    			dispose = listen_dev(circle, "click", click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.circles) && circle_cx_value !== (circle_cx_value = ctx.c.x)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if ((changed.circles) && circle_cy_value !== (circle_cy_value = ctx.c.y)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if ((changed.circles) && circle_fill_value !== (circle_fill_value = ctx.c.color)) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(circle);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$7.name, type: "each", source: "(16:2) {#each circles as c}", ctx });
    	return block;
    }

    // (14:0) <Grid>
    function create_default_slot$a(ctx) {
    	var g;

    	let each_value = ctx.circles;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(g, "stroke", "#fff");
    			attr_dev(g, "stroke-width", "1");
    			add_location(g, file$g, 14, 1, 336);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if (changed.circles || changed.r) {
    				each_value = ctx.circles;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(g);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$a.name, type: "slot", source: "(14:0) <Grid>", ctx });
    	return block;
    }

    function create_fragment$h(ctx) {
    	var current;

    	var grid = new Grid({
    		props: {
    		$$slots: { default: [create_default_slot$a] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			grid.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var grid_changes = {};
    			if (changed.$$scope || changed.circles) grid_changes.$$scope = { changed, ctx };
    			grid.$set(grid_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$h.name, type: "component", source: "", ctx });
    	return block;
    }

    const r=50;

    function instance$8($$self, $$props, $$invalidate) {
    	let circles = [];
    	for (const x of [80,120]) {
    		for (const y of [80,120]) {
    			const color = circles.length%2==0 ? '#00f8' : '#ff08';
    			circles.push({color:color,x:x,y:y});
    		}
    	}
    	const click = (c) => $$invalidate('circles', circles = circles.filter((circle)=>circle!=c));

    	const click_handler = ({ c }) => click(c);

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('circles' in $$props) $$invalidate('circles', circles = $$props.circles);
    	};

    	return { circles, click, click_handler };
    }

    class ColorPair extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$h, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "ColorPair", options, id: create_fragment$h.name });
    	}
    }

    /* src\Bind.svelte generated by Svelte v3.12.1 */

    const file$h = "src\\Bind.svelte";

    function create_fragment$i(ctx) {
    	var div, t0_value = ctx.i*ctx.i + "", t0, t1, input, input_updating = false, dispose;

    	function input_input_handler() {
    		input_updating = true;
    		ctx.input_input_handler.call(input);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			set_style(div, "color", "red");
    			add_location(div, file$h, 4, 0, 34);
    			attr_dev(input, "type", "number");
    			add_location(input, file$h, 5, 0, 70);
    			dispose = listen_dev(input, "input", input_input_handler);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);

    			set_input_value(input, ctx.i);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.i) && t0_value !== (t0_value = ctx.i*ctx.i + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if (!input_updating && changed.i) set_input_value(input, ctx.i);
    			input_updating = false;
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    				detach_dev(t1);
    				detach_dev(input);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$i.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let i=10;

    	function input_input_handler() {
    		i = to_number(this.value);
    		$$invalidate('i', i);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('i' in $$props) $$invalidate('i', i = $$props.i);
    	};

    	return { i, input_input_handler };
    }

    class Bind extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$i, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Bind", options, id: create_fragment$i.name });
    	}
    }

    /* src\KeyUp.svelte generated by Svelte v3.12.1 */

    const file$i = "src\\KeyUp.svelte";

    function create_fragment$j(ctx) {
    	var div0, t0, t1, t2, div1, t3, t4, t5, input, dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text("key: ");
    			t1 = text(ctx.key);
    			t2 = space();
    			div1 = element("div");
    			t3 = text("keycode: ");
    			t4 = text(ctx.keyCode);
    			t5 = space();
    			input = element("input");
    			set_style(div0, "color", "red");
    			add_location(div0, file$i, 9, 0, 132);
    			set_style(div1, "color", "yellow");
    			add_location(div1, file$i, 10, 0, 173);
    			add_location(input, file$i, 11, 0, 225);
    			dispose = listen_dev(input, "keyup", ctx.handleKey);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, input, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.key) {
    				set_data_dev(t1, ctx.key);
    			}

    			if (changed.keyCode) {
    				set_data_dev(t4, ctx.keyCode);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div0);
    				detach_dev(t2);
    				detach_dev(div1);
    				detach_dev(t5);
    				detach_dev(input);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$j.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let key='';
    	let keyCode='';
    	const handleKey = (event) => {
    		$$invalidate('key', key=event.key);
    		$$invalidate('keyCode', keyCode=event.keyCode);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('keyCode' in $$props) $$invalidate('keyCode', keyCode = $$props.keyCode);
    	};

    	return { key, keyCode, handleKey };
    }

    class KeyUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$j, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "KeyUp", options, id: create_fragment$j.name });
    	}
    }

    /* src\GuessMyNumber.svelte generated by Svelte v3.12.1 */

    const file$j = "src\\GuessMyNumber.svelte";

    function create_fragment$k(ctx) {
    	var div, t0, t1, t2, t3, t4, t5, input, input_updating = false, dispose;

    	function input_input_handler() {
    		input_updating = true;
    		ctx.input_input_handler.call(input);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.low);
    			t1 = text(" to ");
    			t2 = text(ctx.high);
    			t3 = space();
    			t4 = text(ctx.msg);
    			t5 = space();
    			input = element("input");
    			attr_dev(input, "type", "number");
    			add_location(input, file$j, 17, 1, 413);
    			set_style(div, "color", "white");
    			add_location(div, file$j, 15, 0, 361);

    			dispose = [
    				listen_dev(input, "input", input_input_handler),
    				listen_dev(input, "keyup", ctx.keyup)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(div, t5);
    			append_dev(div, input);

    			set_input_value(input, ctx.guess);
    		},

    		p: function update(changed, ctx) {
    			if (changed.low) {
    				set_data_dev(t0, ctx.low);
    			}

    			if (changed.high) {
    				set_data_dev(t2, ctx.high);
    			}

    			if (changed.msg) {
    				set_data_dev(t4, ctx.msg);
    			}

    			if (!input_updating && changed.guess) set_input_value(input, ctx.guess);
    			input_updating = false;
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$k.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let low = 1;
    	let high = 127;
    	let guess;
    	let msg ='';
    	let secret = lodash_random(low,high);
    	const keyup = (event)=> {
    		if (event.key!='Enter') return
    		if (guess < secret) $$invalidate('low', low=guess+1);
    		if (guess > secret) $$invalidate('high', high=guess-1);
    		if (guess==secret) $$invalidate('msg', msg = 'Yes! The number was ' + secret);
    		// guess = ''
    	};

    	function input_input_handler() {
    		guess = to_number(this.value);
    		$$invalidate('guess', guess);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('low' in $$props) $$invalidate('low', low = $$props.low);
    		if ('high' in $$props) $$invalidate('high', high = $$props.high);
    		if ('guess' in $$props) $$invalidate('guess', guess = $$props.guess);
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    		if ('secret' in $$props) secret = $$props.secret;
    	};

    	return {
    		low,
    		high,
    		guess,
    		msg,
    		keyup,
    		input_input_handler
    	};
    }

    class GuessMyNumber extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$k, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "GuessMyNumber", options, id: create_fragment$k.name });
    	}
    }

    /* src\Translate.svelte generated by Svelte v3.12.1 */

    const file$k = "src\\Translate.svelte";

    function create_fragment$l(ctx) {
    	var svg, rect, line0, line1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			attr_dev(rect, "x", "-100");
    			attr_dev(rect, "y", "-100");
    			attr_dev(rect, "width", "200");
    			attr_dev(rect, "height", "200");
    			set_style(rect, "fill", "grey");
    			add_location(rect, file$k, 9, 1, 128);
    			attr_dev(line0, "y1", "0");
    			attr_dev(line0, "y2", "90");
    			set_style(line0, "stroke", "black");
    			attr_dev(line0, "class", "svelte-1uht7ny");
    			add_location(line0, file$k, 10, 1, 191);
    			attr_dev(line1, "y1", "0");
    			attr_dev(line1, "y2", "90");
    			set_style(line1, "stroke", "red");
    			attr_dev(line1, "transform", "translate(20)");
    			attr_dev(line1, "class", "svelte-1uht7ny");
    			add_location(line1, file$k, 11, 1, 233);
    			attr_dev(svg, "viewBox", "-100 -100 200 200");
    			attr_dev(svg, "class", "svelte-1uht7ny");
    			add_location(svg, file$k, 8, 0, 92);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, rect);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(svg);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$l.name, type: "component", source: "", ctx });
    	return block;
    }

    class Translate extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$l, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Translate", options, id: create_fragment$l.name });
    	}
    }

    /* src\Rotate.svelte generated by Svelte v3.12.1 */

    const file$l = "src\\Rotate.svelte";

    function create_fragment$m(ctx) {
    	var svg, rect, line0, line1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			attr_dev(rect, "x", "-100");
    			attr_dev(rect, "y", "-100");
    			attr_dev(rect, "width", "200");
    			attr_dev(rect, "height", "200");
    			set_style(rect, "fill", "grey");
    			add_location(rect, file$l, 9, 1, 128);
    			attr_dev(line0, "y2", "90");
    			set_style(line0, "stroke", "black");
    			attr_dev(line0, "class", "svelte-1uht7ny");
    			add_location(line0, file$l, 10, 1, 191);
    			attr_dev(line1, "y2", "90");
    			set_style(line1, "stroke", "red");
    			attr_dev(line1, "transform", "rotate(45)");
    			attr_dev(line1, "class", "svelte-1uht7ny");
    			add_location(line1, file$l, 11, 1, 228);
    			attr_dev(svg, "viewBox", "-100 -100 200 200");
    			attr_dev(svg, "class", "svelte-1uht7ny");
    			add_location(svg, file$l, 8, 0, 92);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, rect);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(svg);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$m.name, type: "component", source: "", ctx });
    	return block;
    }

    class Rotate extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$m, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Rotate", options, id: create_fragment$m.name });
    	}
    }

    /* src\Scale.svelte generated by Svelte v3.12.1 */

    const file$m = "src\\Scale.svelte";

    function create_fragment$n(ctx) {
    	var svg, rect, line0, line1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			attr_dev(rect, "x", "-100");
    			attr_dev(rect, "y", "-100");
    			attr_dev(rect, "width", "200");
    			attr_dev(rect, "height", "200");
    			set_style(rect, "fill", "grey");
    			add_location(rect, file$m, 9, 1, 128);
    			attr_dev(line0, "y1", "0");
    			attr_dev(line0, "y2", "90");
    			set_style(line0, "stroke", "black");
    			attr_dev(line0, "class", "svelte-1uht7ny");
    			add_location(line0, file$m, 10, 1, 191);
    			attr_dev(line1, "y1", "0");
    			attr_dev(line1, "y2", "90");
    			set_style(line1, "stroke", "red");
    			attr_dev(line1, "transform", "rotate(90) scale(0.5)");
    			attr_dev(line1, "class", "svelte-1uht7ny");
    			add_location(line1, file$m, 11, 1, 233);
    			attr_dev(svg, "viewBox", "-100 -100 200 200");
    			attr_dev(svg, "class", "svelte-1uht7ny");
    			add_location(svg, file$m, 8, 0, 92);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, rect);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(svg);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$n.name, type: "component", source: "", ctx });
    	return block;
    }

    class Scale extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$n, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Scale", options, id: create_fragment$n.name });
    	}
    }

    /* src\Clock.svelte generated by Svelte v3.12.1 */

    const file$n = "src\\Clock.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.offset = list[i];
    	return child_ctx;
    }

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.i = list[i];
    	return child_ctx;
    }

    // (38:4) <CText>
    function create_default_slot$b(ctx) {
    	var t_value = 1+(ctx.i+2)%12 + "", t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$b.name, type: "slot", source: "(38:4) <CText>", ctx });
    	return block;
    }

    // (41:3) {#each range(1,5) as offset}
    function create_each_block_1$1(ctx) {
    	var line;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "minor svelte-1izseje");
    			attr_dev(line, "y1", "42");
    			attr_dev(line, "y2", "45");
    			attr_dev(line, "transform", "rotate(" + 6 * ctx.offset + ")");
    			add_location(line, file$n, 41, 4, 1097);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(line);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_1$1.name, type: "each", source: "(41:3) {#each range(1,5) as offset}", ctx });
    	return block;
    }

    // (34:1) {#each range(12) as i}
    function create_each_block$8(ctx) {
    	var g1, line, g0, current;

    	var ctext = new CText({
    		props: {
    		$$slots: { default: [create_default_slot$b] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	let each_value_1 = lodash_range(1,5);

    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			g1 = svg_element("g");
    			line = svg_element("line");
    			g0 = svg_element("g");
    			ctext.$$.fragment.c();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(line, "class", "major svelte-1izseje");
    			attr_dev(line, "y1", "35");
    			attr_dev(line, "y2", "45");
    			add_location(line, file$n, 35, 3, 916);
    			attr_dev(g0, "transform", "translate(" + 30 + ") rotate(" + -30*ctx.i + ")");
    			attr_dev(g0, "class", "fs svelte-1izseje");
    			add_location(g0, file$n, 36, 3, 955);
    			attr_dev(g1, "transform", "rotate(" + 30 * ctx.i + ")");
    			add_location(g1, file$n, 34, 2, 877);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, g1, anchor);
    			append_dev(g1, line);
    			append_dev(g1, g0);
    			mount_component(ctext, g0, null);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g1, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var ctext_changes = {};
    			if (changed.$$scope) ctext_changes.$$scope = { changed, ctx };
    			ctext.$set(ctext_changes);

    			if (changed.range) {
    				each_value_1 = lodash_range(1,5);

    				let i;
    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value_1.length;
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(ctext.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(ctext.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(g1);
    			}

    			destroy_component(ctext);

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$8.name, type: "each", source: "(34:1) {#each range(12) as i}", ctx });
    	return block;
    }

    function create_fragment$o(ctx) {
    	var svg, circle, line0, line0_transform_value, line1, line1_transform_value, g, line2, line3, g_transform_value, current;

    	let each_value = lodash_range(12);

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle = svg_element("circle");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			g = svg_element("g");
    			line2 = svg_element("line");
    			line3 = svg_element("line");
    			attr_dev(circle, "class", "clock-face svelte-1izseje");
    			attr_dev(circle, "r", "48");
    			add_location(circle, file$n, 30, 1, 792);
    			attr_dev(line0, "class", "hour svelte-1izseje");
    			attr_dev(line0, "y1", "2");
    			attr_dev(line0, "y2", "-20");
    			attr_dev(line0, "transform", line0_transform_value = "rotate(" + (30 * ctx.hours + ctx.minutes / 2) + ")");
    			add_location(line0, file$n, 47, 1, 1216);
    			attr_dev(line1, "class", "minute svelte-1izseje");
    			attr_dev(line1, "y1", "4");
    			attr_dev(line1, "y2", "-30");
    			attr_dev(line1, "transform", line1_transform_value = "rotate(" + (6 * ctx.minutes + ctx.seconds / 10) + ")");
    			add_location(line1, file$n, 48, 1, 1299);
    			attr_dev(line2, "class", "second svelte-1izseje");
    			attr_dev(line2, "y1", "10");
    			attr_dev(line2, "y2", "-38");
    			add_location(line2, file$n, 50, 2, 1427);
    			attr_dev(line3, "class", "second-counterweight svelte-1izseje");
    			attr_dev(line3, "y1", "10");
    			attr_dev(line3, "y2", "2");
    			add_location(line3, file$n, 51, 2, 1466);
    			attr_dev(g, "transform", g_transform_value = "rotate(" + 6 * ctx.seconds + ")");
    			add_location(g, file$n, 49, 1, 1386);
    			attr_dev(svg, "viewBox", "-50 -50 100 100");
    			attr_dev(svg, "class", "svelte-1izseje");
    			add_location(svg, file$n, 29, 0, 758);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			append_dev(svg, line0);
    			append_dev(svg, line1);
    			append_dev(svg, g);
    			append_dev(g, line2);
    			append_dev(g, line3);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.range) {
    				each_value = lodash_range(12);

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(svg, line0);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}

    			if ((!current || changed.hours || changed.minutes) && line0_transform_value !== (line0_transform_value = "rotate(" + (30 * ctx.hours + ctx.minutes / 2) + ")")) {
    				attr_dev(line0, "transform", line0_transform_value);
    			}

    			if ((!current || changed.minutes || changed.seconds) && line1_transform_value !== (line1_transform_value = "rotate(" + (6 * ctx.minutes + ctx.seconds / 10) + ")")) {
    				attr_dev(line1, "transform", line1_transform_value);
    			}

    			if ((!current || changed.seconds) && g_transform_value !== (g_transform_value = "rotate(" + 6 * ctx.seconds + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(svg);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$o.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	

    	let time = new Date();

    	onMount(() => {
    		const interval = setInterval(() => {$$invalidate('time', time = new Date());}, 1000);
    		return () => clearInterval(interval)
    	});

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('time' in $$props) $$invalidate('time', time = $$props.time);
    		if ('hours' in $$props) $$invalidate('hours', hours = $$props.hours);
    		if ('minutes' in $$props) $$invalidate('minutes', minutes = $$props.minutes);
    		if ('seconds' in $$props) $$invalidate('seconds', seconds = $$props.seconds);
    	};

    	let hours, minutes, seconds;

    	$$self.$$.update = ($$dirty = { time: 1 }) => {
    		if ($$dirty.time) { $$invalidate('hours', hours = time.getHours()); }
    		if ($$dirty.time) { $$invalidate('minutes', minutes = time.getMinutes()); }
    		if ($$dirty.time) { $$invalidate('seconds', seconds = time.getSeconds()); }
    	};

    	return { hours, minutes, seconds };
    }

    class Clock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$o, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Clock", options, id: create_fragment$o.name });
    	}
    }

    const helpTexts = {

    	L1grid:
`<script>
  import range from 'lodash.range'
  const N=200
</script>

<style>
  .grid {
    stroke:#ccc; 
    fill:#888;
  }
  * {
    shape-rendering:crispEdges;
    stroke:black;
    fill:white;
  }
</style>

<svg width={N} height={N}>
  <rect width={N} height={N} class=grid/>
  {#each range(0,N,20) as i}
    <line x1={i} y1={0} x2={i} y2={N} class=grid />
    <line y1={i} x1={0} y2={i} x2={N} class=grid />
  {/each}
  <slot/>
</svg>`    ,

    	L1rect:
`<script>
  import Grid from './Grid.svelte'
</script>

<Grid>
  <rect x=... y=... width=... height=... style='stroke-width:...; stroke:...; fill:...'/>
</Grid>`    ,

    	L1circle:
`<circle cx=... cy=... r=.../>`    ,

    	L1line:
`<line x1=... y1=... x2=... y2=.../>`    ,

    	L2each:
`{#each range(...) as i}
  <circle ... />
{/each}`    ,

    	L2if:
`{#if ... }
  <circle ... />
{:else}
  <rect ... />
{/if}`    ,

    	L2range:
`{#each ... }
  <circle ... />
{/each}`    ,

    	L2chess:
`{#each ...}
  {#each ...}
    {#if ...}
      <rect .../>
    {:else}
      <rect .../>
    {/if}
  {/each}
{/each}`    ,

    	L3random:
`<...>
  import ... from '...'
  import random from 'lodash.random'
</...>

{#each range(...) as ... }
  <circle cx={random(0,200)} cy=... r=... />
{/each}`    ,

    	L3button:
`<...>
  let i=0
</...>

<div style=...>...</div>
<button on:click = { () => i++ } > ... </button>`    ,

    	L3shortcut:
`<...>
  let ...=17
  let ...=1
  const op=(value) => ...
</...>

<div ...> {a} to {b} </div>
<button on:click={()=>op(a+2)}> ... </button>
<button on:click={...}> ... </button>
<button on:click={()=> ... ? ... : ... } > ... </button>`    ,

    	L4canvas:
`<svg>
  <rect ... />
</svg>`    ,

    	L4colorPair:
`<...>
  let circles = []
  const r=...
  for (const x of [...]) {
    for (const y of [...]) {
      const color = circles.length ... == 0 ? '#00f8' : '#...'
      circles.push({..., ..., ...})
    }
  }
  const click = (...) => ... = ... .filter((...) => ... != ...)
</...>

<g stroke='#...' stroke-width=...>
  {#each ...}
    <... on:click={()=>click(c)} cx=... cy=... r=... fill=.../>
  {/each}
</g>`    ,

    	'L5bind:':
`<...>
  let i=...
</...>

<div ...>{...}</div>
<input type=number bind:value={i}/>`    ,

    	'L5on:keyup':
`<...>
  let key=''
  let keyCode=''
  const handleKey = (...) => {
    ... = event.key
    ... = event.keyCode
  }
</...>

<div ...> ... </div>
<div ...> ... </div>
<input on:keyup={...}/>`    ,

    	L5guessMyNumber:
`<...>
  import ... from 'lodash.random'
  let low = 1
  let high = 127
  let guess
  let msg =''
  let secret = random(..., ...)
  const keyup = (...)=> {
    if (event.key != 'Enter') return
    if (... < ...) low = ...
    if (... > ...) high = ...
    if (... == ...) msg = ...
  }
</...>
<div ...>
  {...} to {...} {...}
  <input on:keyup = {...} type=... bind:value={...}/>
</div>`    ,

    	L6text:
`<style>
  .fs40 {font: italic 1px serif}
</style>

<text x=... y=... class='fs40' text-anchor=... alignment-baseline=... >
  ...
</text>`    ,

    	L6translate:
`<... y1=... y2=... style=... transform="translate(...)"/>`    ,

    	L6rotate:
`<... y2=... style=... transform="rotate(...)"/>`    ,

    	L6scale:
`<... y1=... y2=... style=... transform="rotate(...) scale(...)"/>`    ,

    	L6clock:
`<...>
  import range from 'lodash.range'
  import { onMount } from 'svelte'

  let time = new Date()

  $: hours = time.getHours()
  $: minutes = time.getMinutes()
  $: seconds = time.getSeconds()

  onMount(() => {
    const interval = setInterval(() => {time = new Date()}, ...)
    return () => clearInterval(interval)
  })
</...>

<style>
  svg { width: 100%; height: 100% }
  .clock-face { stroke: ...; fill: ... }
  .minor { stroke: ...; stroke-width: ... }
  .major { stroke: ...; stroke-width: ... }
  .hour { stroke: ... }
  .minute { stroke: ... }
  .second, .second-counterweight { stroke: rgb(...,...,...) }
  .second-counterweight { stroke-width: ... }
  .fs {font-size: ... }
</style>

<svg viewBox='-50 -50 100 100'>
  <circle class='...' r = ... />

  <!-- markers -->
  {#each range(...) as i}
    <g transform = 'rotate({...})'>
      <line class='major' y1=... y2=... />

      {#each range(..., ...) as offset}
        <line class='minor' y1=... y2=... transform='rotate(...)' />
      {/each}
    </g>
  {/each}

  <!-- hands -->
  <line class='hour' y1=... y2=... transform='rotate({...})' />
  <line class='minute' y1=... y2=... transform='rotate(...)' />
  <g transform='rotate(...)'>
    <line class='second' y1=... y2=... />
    <line class='second-counterweight' y1=... y2=... />
  </g>
</svg>`

    };

    /* src\App.svelte generated by Svelte v3.12.1 */

    const file$o = "src\\App.svelte";

    // (83:1) {:else}
    function create_else_block$3(ctx) {
    	var updating_selected, current;

    	function menu_selected_binding_1(value) {
    		ctx.menu_selected_binding_1.call(null, value);
    		updating_selected = true;
    		add_flush_callback(() => updating_selected = false);
    	}

    	let menu_props = { children: ctx.children1 };
    	if (ctx.selected1 !== void 0) {
    		menu_props.selected = ctx.selected1;
    	}
    	var menu = new Menu({ props: menu_props, $$inline: true });

    	binding_callbacks.push(() => bind(menu, 'selected', menu_selected_binding_1));

    	const block = {
    		c: function create() {
    			menu.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var menu_changes = {};
    			if (changed.children1) menu_changes.children = ctx.children1;
    			if (!updating_selected && changed.selected1) {
    				menu_changes.selected = ctx.selected1;
    			}
    			menu.$set(menu_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(menu, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$3.name, type: "else", source: "(83:1) {:else}", ctx });
    	return block;
    }

    // (81:1) {#if selected0=='keywords'}
    function create_if_block_24(ctx) {
    	var updating_selected, current;

    	function menu_selected_binding(value) {
    		ctx.menu_selected_binding.call(null, value);
    		updating_selected = true;
    		add_flush_callback(() => updating_selected = false);
    	}

    	let menu_props = {
    		children: ctx.children1,
    		color: "yellow",
    		bgcolor: "black"
    	};
    	if (ctx.selected1 !== void 0) {
    		menu_props.selected = ctx.selected1;
    	}
    	var menu = new Menu({ props: menu_props, $$inline: true });

    	binding_callbacks.push(() => bind(menu, 'selected', menu_selected_binding));

    	const block = {
    		c: function create() {
    			menu.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var menu_changes = {};
    			if (changed.children1) menu_changes.children = ctx.children1;
    			if (!updating_selected && changed.selected1) {
    				menu_changes.selected = ctx.selected1;
    			}
    			menu.$set(menu_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(menu, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_24.name, type: "if", source: "(81:1) {#if selected0=='keywords'}", ctx });
    	return block;
    }

    // (91:1) {#if selected1 == 'svg'}
    function create_if_block_23(ctx) {
    	var current;

    	var canvas = new Canvas({ $$inline: true });

    	const block = {
    		c: function create() {
    			canvas.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(canvas, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(canvas.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(canvas.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(canvas, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_23.name, type: "if", source: "(91:1) {#if selected1 == 'svg'}", ctx });
    	return block;
    }

    // (92:1) {#if selected1 == 'canvas'}
    function create_if_block_22(ctx) {
    	var current;

    	var canvas = new Canvas({ $$inline: true });

    	const block = {
    		c: function create() {
    			canvas.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(canvas, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(canvas.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(canvas.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(canvas, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_22.name, type: "if", source: "(92:1) {#if selected1 == 'canvas'}", ctx });
    	return block;
    }

    // (93:1) {#if selected1 == 'grid'}
    function create_if_block_21(ctx) {
    	var current;

    	var grid = new Grid({ $$inline: true });

    	const block = {
    		c: function create() {
    			grid.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_21.name, type: "if", source: "(93:1) {#if selected1 == 'grid'}", ctx });
    	return block;
    }

    // (94:1) {#if selected1 == 'rect'}
    function create_if_block_20(ctx) {
    	var current;

    	var rect = new Rect({ $$inline: true });

    	const block = {
    		c: function create() {
    			rect.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(rect, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(rect.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(rect.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(rect, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_20.name, type: "if", source: "(94:1) {#if selected1 == 'rect'}", ctx });
    	return block;
    }

    // (95:1) {#if selected1 == 'circle'}
    function create_if_block_19(ctx) {
    	var current;

    	var circle = new Circle({ $$inline: true });

    	const block = {
    		c: function create() {
    			circle.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(circle, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(circle.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(circle.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(circle, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_19.name, type: "if", source: "(95:1) {#if selected1 == 'circle'}", ctx });
    	return block;
    }

    // (96:1) {#if selected1 == 'line'}
    function create_if_block_18(ctx) {
    	var current;

    	var line = new Line({ $$inline: true });

    	const block = {
    		c: function create() {
    			line.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(line, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(line.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(line.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(line, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_18.name, type: "if", source: "(96:1) {#if selected1 == 'line'}", ctx });
    	return block;
    }

    // (97:1) {#if selected1 == 'text'}
    function create_if_block_17(ctx) {
    	var current;

    	var text_1 = new Text({ $$inline: true });

    	const block = {
    		c: function create() {
    			text_1.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_17.name, type: "if", source: "(97:1) {#if selected1 == 'text'}", ctx });
    	return block;
    }

    // (100:1) {#if selected1 == 'each'}
    function create_if_block_16(ctx) {
    	var current;

    	var each_1 = new Each({ $$inline: true });

    	const block = {
    		c: function create() {
    			each_1.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(each_1, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(each_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(each_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(each_1, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_16.name, type: "if", source: "(100:1) {#if selected1 == 'each'}", ctx });
    	return block;
    }

    // (101:1) {#if selected1 == 'if'}
    function create_if_block_15(ctx) {
    	var current;

    	var if_1 = new If({ $$inline: true });

    	const block = {
    		c: function create() {
    			if_1.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(if_1, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(if_1, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_15.name, type: "if", source: "(101:1) {#if selected1 == 'if'}", ctx });
    	return block;
    }

    // (102:1) {#if selected1 == 'range'}
    function create_if_block_14(ctx) {
    	var current;

    	var range_1 = new Range({ $$inline: true });

    	const block = {
    		c: function create() {
    			range_1.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(range_1, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(range_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(range_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(range_1, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_14.name, type: "if", source: "(102:1) {#if selected1 == 'range'}", ctx });
    	return block;
    }

    // (103:1) {#if selected1 == 'chess'}
    function create_if_block_13(ctx) {
    	var current;

    	var chess = new Chess({ $$inline: true });

    	const block = {
    		c: function create() {
    			chess.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(chess, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(chess.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(chess.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(chess, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_13.name, type: "if", source: "(103:1) {#if selected1 == 'chess'}", ctx });
    	return block;
    }

    // (106:1) {#if selected1 == 'random'}
    function create_if_block_12(ctx) {
    	var current;

    	var random = new Random({ $$inline: true });

    	const block = {
    		c: function create() {
    			random.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(random, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(random.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(random.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(random, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_12.name, type: "if", source: "(106:1) {#if selected1 == 'random'}", ctx });
    	return block;
    }

    // (107:1) {#if selected1 == 'button'}
    function create_if_block_11(ctx) {
    	var current;

    	var button = new Button({ $$inline: true });

    	const block = {
    		c: function create() {
    			button.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_11.name, type: "if", source: "(107:1) {#if selected1 == 'button'}", ctx });
    	return block;
    }

    // (108:1) {#if selected1 == 'on:click'}
    function create_if_block_10(ctx) {
    	var current;

    	var click = new Click({ $$inline: true });

    	const block = {
    		c: function create() {
    			click.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(click, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(click.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(click.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(click, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_10.name, type: "if", source: "(108:1) {#if selected1 == 'on:click'}", ctx });
    	return block;
    }

    // (109:1) {#if selected1 == 'shortcut'}
    function create_if_block_9(ctx) {
    	var current;

    	var shortcut = new Shortcut({ $$inline: true });

    	const block = {
    		c: function create() {
    			shortcut.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(shortcut, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(shortcut.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(shortcut.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(shortcut, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_9.name, type: "if", source: "(109:1) {#if selected1 == 'shortcut'}", ctx });
    	return block;
    }

    // (112:1) {#if selected1 == 'colorPair'}
    function create_if_block_8(ctx) {
    	var current;

    	var colorpair = new ColorPair({ $$inline: true });

    	const block = {
    		c: function create() {
    			colorpair.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(colorpair, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(colorpair.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(colorpair.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(colorpair, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_8.name, type: "if", source: "(112:1) {#if selected1 == 'colorPair'}", ctx });
    	return block;
    }

    // (115:1) {#if selected1 == 'bind:'}
    function create_if_block_7(ctx) {
    	var current;

    	var bind_1 = new Bind({ $$inline: true });

    	const block = {
    		c: function create() {
    			bind_1.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(bind_1, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(bind_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(bind_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(bind_1, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_7.name, type: "if", source: "(115:1) {#if selected1 == 'bind:'}", ctx });
    	return block;
    }

    // (116:1) {#if selected1 == 'on:keyup'}
    function create_if_block_6(ctx) {
    	var current;

    	var keyup = new KeyUp({ $$inline: true });

    	const block = {
    		c: function create() {
    			keyup.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(keyup, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(keyup.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(keyup.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(keyup, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_6.name, type: "if", source: "(116:1) {#if selected1 == 'on:keyup'}", ctx });
    	return block;
    }

    // (117:1) {#if selected1 == 'guessMyNumber'}
    function create_if_block_5(ctx) {
    	var current;

    	var guessmynumber = new GuessMyNumber({ $$inline: true });

    	const block = {
    		c: function create() {
    			guessmynumber.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(guessmynumber, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(guessmynumber.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(guessmynumber.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(guessmynumber, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_5.name, type: "if", source: "(117:1) {#if selected1 == 'guessMyNumber'}", ctx });
    	return block;
    }

    // (120:1) {#if selected1 == 'translate'}
    function create_if_block_4(ctx) {
    	var current;

    	var translate = new Translate({ $$inline: true });

    	const block = {
    		c: function create() {
    			translate.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(translate, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(translate.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(translate.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(translate, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_4.name, type: "if", source: "(120:1) {#if selected1 == 'translate'}", ctx });
    	return block;
    }

    // (121:1) {#if selected1 == 'rotate'}
    function create_if_block_3(ctx) {
    	var current;

    	var rotate = new Rotate({ $$inline: true });

    	const block = {
    		c: function create() {
    			rotate.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(rotate, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(rotate.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(rotate.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(rotate, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_3.name, type: "if", source: "(121:1) {#if selected1 == 'rotate'}", ctx });
    	return block;
    }

    // (122:1) {#if selected1 == 'scale'}
    function create_if_block_2(ctx) {
    	var current;

    	var scale = new Scale({ $$inline: true });

    	const block = {
    		c: function create() {
    			scale.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(scale, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(scale.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(scale.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(scale, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2.name, type: "if", source: "(122:1) {#if selected1 == 'scale'}", ctx });
    	return block;
    }

    // (123:1) {#if selected1 == 'clock'}
    function create_if_block_1(ctx) {
    	var current;

    	var clock = new Clock({ $$inline: true });

    	const block = {
    		c: function create() {
    			clock.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(clock, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(clock.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(clock.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(clock, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1.name, type: "if", source: "(123:1) {#if selected1 == 'clock'}", ctx });
    	return block;
    }

    // (128:1) {#if helpTexts[selected0+selected1]}
    function create_if_block$3(ctx) {
    	var textarea, textarea_value_value;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			textarea.disabled = true;
    			set_style(textarea, "width", "500px");
    			set_style(textarea, "height", "500px");
    			textarea.value = textarea_value_value = helpTexts[ctx.selected0+ctx.selected1];
    			attr_dev(textarea, "class", "svelte-ckszui");
    			add_location(textarea, file$o, 128, 2, 4350);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.selected0 || changed.selected1) && textarea_value_value !== (textarea_value_value = helpTexts[ctx.selected0+ctx.selected1])) {
    				prop_dev(textarea, "value", textarea_value_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(textarea);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$3.name, type: "if", source: "(128:1) {#if helpTexts[selected0+selected1]}", ctx });
    	return block;
    }

    function create_fragment$p(ctx) {
    	var div0, updating_selected, t0, updating_selected_1, t1, current_block_type_index, if_block0, t2, div1, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, div2, current;

    	function menu0_selected_binding(value) {
    		ctx.menu0_selected_binding.call(null, value);
    		updating_selected = true;
    		add_flush_callback(() => updating_selected = false);
    	}

    	let menu0_props = { children: ctx.children3 };
    	if (ctx.selected3 !== void 0) {
    		menu0_props.selected = ctx.selected3;
    	}
    	var menu0 = new Menu({ props: menu0_props, $$inline: true });

    	binding_callbacks.push(() => bind(menu0, 'selected', menu0_selected_binding));

    	function menu1_selected_binding(value_1) {
    		ctx.menu1_selected_binding.call(null, value_1);
    		updating_selected_1 = true;
    		add_flush_callback(() => updating_selected_1 = false);
    	}

    	let menu1_props = { children: ctx.children0 };
    	if (ctx.selected0 !== void 0) {
    		menu1_props.selected = ctx.selected0;
    	}
    	var menu1 = new Menu({ props: menu1_props, $$inline: true });

    	binding_callbacks.push(() => bind(menu1, 'selected', menu1_selected_binding));

    	var if_block_creators = [
    		create_if_block_24,
    		create_else_block$3
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.selected0=='keywords') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	var if_block1 = (ctx.selected1 == 'svg') && create_if_block_23(ctx);

    	var if_block2 = (ctx.selected1 == 'canvas') && create_if_block_22(ctx);

    	var if_block3 = (ctx.selected1 == 'grid') && create_if_block_21(ctx);

    	var if_block4 = (ctx.selected1 == 'rect') && create_if_block_20(ctx);

    	var if_block5 = (ctx.selected1 == 'circle') && create_if_block_19(ctx);

    	var if_block6 = (ctx.selected1 == 'line') && create_if_block_18(ctx);

    	var if_block7 = (ctx.selected1 == 'text') && create_if_block_17(ctx);

    	var if_block8 = (ctx.selected1 == 'each') && create_if_block_16(ctx);

    	var if_block9 = (ctx.selected1 == 'if') && create_if_block_15(ctx);

    	var if_block10 = (ctx.selected1 == 'range') && create_if_block_14(ctx);

    	var if_block11 = (ctx.selected1 == 'chess') && create_if_block_13(ctx);

    	var if_block12 = (ctx.selected1 == 'random') && create_if_block_12(ctx);

    	var if_block13 = (ctx.selected1 == 'button') && create_if_block_11(ctx);

    	var if_block14 = (ctx.selected1 == 'on:click') && create_if_block_10(ctx);

    	var if_block15 = (ctx.selected1 == 'shortcut') && create_if_block_9(ctx);

    	var if_block16 = (ctx.selected1 == 'colorPair') && create_if_block_8(ctx);

    	var if_block17 = (ctx.selected1 == 'bind:') && create_if_block_7(ctx);

    	var if_block18 = (ctx.selected1 == 'on:keyup') && create_if_block_6(ctx);

    	var if_block19 = (ctx.selected1 == 'guessMyNumber') && create_if_block_5(ctx);

    	var if_block20 = (ctx.selected1 == 'translate') && create_if_block_4(ctx);

    	var if_block21 = (ctx.selected1 == 'rotate') && create_if_block_3(ctx);

    	var if_block22 = (ctx.selected1 == 'scale') && create_if_block_2(ctx);

    	var if_block23 = (ctx.selected1 == 'clock') && create_if_block_1(ctx);

    	var if_block24 = (helpTexts[ctx.selected0+ctx.selected1]) && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			menu0.$$.fragment.c();
    			t0 = space();
    			menu1.$$.fragment.c();
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			t7 = space();
    			if (if_block6) if_block6.c();
    			t8 = space();
    			if (if_block7) if_block7.c();
    			t9 = space();
    			if (if_block8) if_block8.c();
    			t10 = space();
    			if (if_block9) if_block9.c();
    			t11 = space();
    			if (if_block10) if_block10.c();
    			t12 = space();
    			if (if_block11) if_block11.c();
    			t13 = space();
    			if (if_block12) if_block12.c();
    			t14 = space();
    			if (if_block13) if_block13.c();
    			t15 = space();
    			if (if_block14) if_block14.c();
    			t16 = space();
    			if (if_block15) if_block15.c();
    			t17 = space();
    			if (if_block16) if_block16.c();
    			t18 = space();
    			if (if_block17) if_block17.c();
    			t19 = space();
    			if (if_block18) if_block18.c();
    			t20 = space();
    			if (if_block19) if_block19.c();
    			t21 = space();
    			if (if_block20) if_block20.c();
    			t22 = space();
    			if (if_block21) if_block21.c();
    			t23 = space();
    			if (if_block22) if_block22.c();
    			t24 = space();
    			if (if_block23) if_block23.c();
    			t25 = space();
    			div2 = element("div");
    			if (if_block24) if_block24.c();
    			attr_dev(div0, "class", "row left s1 m svelte-ckszui");
    			add_location(div0, file$o, 77, 0, 2770);
    			attr_dev(div1, "class", "col left s2 m svelte-ckszui");
    			add_location(div1, file$o, 87, 0, 3118);
    			attr_dev(div2, "class", "col left s8 m svelte-ckszui");
    			add_location(div2, file$o, 126, 0, 4280);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(menu0, div0, null);
    			append_dev(div0, t0);
    			mount_component(menu1, div0, null);
    			append_dev(div0, t1);
    			if_blocks[current_block_type_index].m(div0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t4);
    			if (if_block3) if_block3.m(div1, null);
    			append_dev(div1, t5);
    			if (if_block4) if_block4.m(div1, null);
    			append_dev(div1, t6);
    			if (if_block5) if_block5.m(div1, null);
    			append_dev(div1, t7);
    			if (if_block6) if_block6.m(div1, null);
    			append_dev(div1, t8);
    			if (if_block7) if_block7.m(div1, null);
    			append_dev(div1, t9);
    			if (if_block8) if_block8.m(div1, null);
    			append_dev(div1, t10);
    			if (if_block9) if_block9.m(div1, null);
    			append_dev(div1, t11);
    			if (if_block10) if_block10.m(div1, null);
    			append_dev(div1, t12);
    			if (if_block11) if_block11.m(div1, null);
    			append_dev(div1, t13);
    			if (if_block12) if_block12.m(div1, null);
    			append_dev(div1, t14);
    			if (if_block13) if_block13.m(div1, null);
    			append_dev(div1, t15);
    			if (if_block14) if_block14.m(div1, null);
    			append_dev(div1, t16);
    			if (if_block15) if_block15.m(div1, null);
    			append_dev(div1, t17);
    			if (if_block16) if_block16.m(div1, null);
    			append_dev(div1, t18);
    			if (if_block17) if_block17.m(div1, null);
    			append_dev(div1, t19);
    			if (if_block18) if_block18.m(div1, null);
    			append_dev(div1, t20);
    			if (if_block19) if_block19.m(div1, null);
    			append_dev(div1, t21);
    			if (if_block20) if_block20.m(div1, null);
    			append_dev(div1, t22);
    			if (if_block21) if_block21.m(div1, null);
    			append_dev(div1, t23);
    			if (if_block22) if_block22.m(div1, null);
    			append_dev(div1, t24);
    			if (if_block23) if_block23.m(div1, null);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, div2, anchor);
    			if (if_block24) if_block24.m(div2, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var menu0_changes = {};
    			if (!updating_selected && changed.selected3) {
    				menu0_changes.selected = ctx.selected3;
    			}
    			menu0.$set(menu0_changes);

    			var menu1_changes = {};
    			if (!updating_selected_1 && changed.selected0) {
    				menu1_changes.selected = ctx.selected0;
    			}
    			menu1.$set(menu1_changes);

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block0 = if_blocks[current_block_type_index];
    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				}
    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			if (ctx.selected1 == 'svg') {
    				if (!if_block1) {
    					if_block1 = create_if_block_23(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t3);
    				} else transition_in(if_block1, 1);
    			} else if (if_block1) {
    				group_outros();
    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'canvas') {
    				if (!if_block2) {
    					if_block2 = create_if_block_22(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, t4);
    				} else transition_in(if_block2, 1);
    			} else if (if_block2) {
    				group_outros();
    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'grid') {
    				if (!if_block3) {
    					if_block3 = create_if_block_21(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div1, t5);
    				} else transition_in(if_block3, 1);
    			} else if (if_block3) {
    				group_outros();
    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'rect') {
    				if (!if_block4) {
    					if_block4 = create_if_block_20(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div1, t6);
    				} else transition_in(if_block4, 1);
    			} else if (if_block4) {
    				group_outros();
    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'circle') {
    				if (!if_block5) {
    					if_block5 = create_if_block_19(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(div1, t7);
    				} else transition_in(if_block5, 1);
    			} else if (if_block5) {
    				group_outros();
    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'line') {
    				if (!if_block6) {
    					if_block6 = create_if_block_18(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(div1, t8);
    				} else transition_in(if_block6, 1);
    			} else if (if_block6) {
    				group_outros();
    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'text') {
    				if (!if_block7) {
    					if_block7 = create_if_block_17(ctx);
    					if_block7.c();
    					transition_in(if_block7, 1);
    					if_block7.m(div1, t9);
    				} else transition_in(if_block7, 1);
    			} else if (if_block7) {
    				group_outros();
    				transition_out(if_block7, 1, 1, () => {
    					if_block7 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'each') {
    				if (!if_block8) {
    					if_block8 = create_if_block_16(ctx);
    					if_block8.c();
    					transition_in(if_block8, 1);
    					if_block8.m(div1, t10);
    				} else transition_in(if_block8, 1);
    			} else if (if_block8) {
    				group_outros();
    				transition_out(if_block8, 1, 1, () => {
    					if_block8 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'if') {
    				if (!if_block9) {
    					if_block9 = create_if_block_15(ctx);
    					if_block9.c();
    					transition_in(if_block9, 1);
    					if_block9.m(div1, t11);
    				} else transition_in(if_block9, 1);
    			} else if (if_block9) {
    				group_outros();
    				transition_out(if_block9, 1, 1, () => {
    					if_block9 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'range') {
    				if (!if_block10) {
    					if_block10 = create_if_block_14(ctx);
    					if_block10.c();
    					transition_in(if_block10, 1);
    					if_block10.m(div1, t12);
    				} else transition_in(if_block10, 1);
    			} else if (if_block10) {
    				group_outros();
    				transition_out(if_block10, 1, 1, () => {
    					if_block10 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'chess') {
    				if (!if_block11) {
    					if_block11 = create_if_block_13(ctx);
    					if_block11.c();
    					transition_in(if_block11, 1);
    					if_block11.m(div1, t13);
    				} else transition_in(if_block11, 1);
    			} else if (if_block11) {
    				group_outros();
    				transition_out(if_block11, 1, 1, () => {
    					if_block11 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'random') {
    				if (!if_block12) {
    					if_block12 = create_if_block_12(ctx);
    					if_block12.c();
    					transition_in(if_block12, 1);
    					if_block12.m(div1, t14);
    				} else transition_in(if_block12, 1);
    			} else if (if_block12) {
    				group_outros();
    				transition_out(if_block12, 1, 1, () => {
    					if_block12 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'button') {
    				if (!if_block13) {
    					if_block13 = create_if_block_11(ctx);
    					if_block13.c();
    					transition_in(if_block13, 1);
    					if_block13.m(div1, t15);
    				} else transition_in(if_block13, 1);
    			} else if (if_block13) {
    				group_outros();
    				transition_out(if_block13, 1, 1, () => {
    					if_block13 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'on:click') {
    				if (!if_block14) {
    					if_block14 = create_if_block_10(ctx);
    					if_block14.c();
    					transition_in(if_block14, 1);
    					if_block14.m(div1, t16);
    				} else transition_in(if_block14, 1);
    			} else if (if_block14) {
    				group_outros();
    				transition_out(if_block14, 1, 1, () => {
    					if_block14 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'shortcut') {
    				if (!if_block15) {
    					if_block15 = create_if_block_9(ctx);
    					if_block15.c();
    					transition_in(if_block15, 1);
    					if_block15.m(div1, t17);
    				} else transition_in(if_block15, 1);
    			} else if (if_block15) {
    				group_outros();
    				transition_out(if_block15, 1, 1, () => {
    					if_block15 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'colorPair') {
    				if (!if_block16) {
    					if_block16 = create_if_block_8(ctx);
    					if_block16.c();
    					transition_in(if_block16, 1);
    					if_block16.m(div1, t18);
    				} else transition_in(if_block16, 1);
    			} else if (if_block16) {
    				group_outros();
    				transition_out(if_block16, 1, 1, () => {
    					if_block16 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'bind:') {
    				if (!if_block17) {
    					if_block17 = create_if_block_7(ctx);
    					if_block17.c();
    					transition_in(if_block17, 1);
    					if_block17.m(div1, t19);
    				} else transition_in(if_block17, 1);
    			} else if (if_block17) {
    				group_outros();
    				transition_out(if_block17, 1, 1, () => {
    					if_block17 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'on:keyup') {
    				if (!if_block18) {
    					if_block18 = create_if_block_6(ctx);
    					if_block18.c();
    					transition_in(if_block18, 1);
    					if_block18.m(div1, t20);
    				} else transition_in(if_block18, 1);
    			} else if (if_block18) {
    				group_outros();
    				transition_out(if_block18, 1, 1, () => {
    					if_block18 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'guessMyNumber') {
    				if (!if_block19) {
    					if_block19 = create_if_block_5(ctx);
    					if_block19.c();
    					transition_in(if_block19, 1);
    					if_block19.m(div1, t21);
    				} else transition_in(if_block19, 1);
    			} else if (if_block19) {
    				group_outros();
    				transition_out(if_block19, 1, 1, () => {
    					if_block19 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'translate') {
    				if (!if_block20) {
    					if_block20 = create_if_block_4(ctx);
    					if_block20.c();
    					transition_in(if_block20, 1);
    					if_block20.m(div1, t22);
    				} else transition_in(if_block20, 1);
    			} else if (if_block20) {
    				group_outros();
    				transition_out(if_block20, 1, 1, () => {
    					if_block20 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'rotate') {
    				if (!if_block21) {
    					if_block21 = create_if_block_3(ctx);
    					if_block21.c();
    					transition_in(if_block21, 1);
    					if_block21.m(div1, t23);
    				} else transition_in(if_block21, 1);
    			} else if (if_block21) {
    				group_outros();
    				transition_out(if_block21, 1, 1, () => {
    					if_block21 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'scale') {
    				if (!if_block22) {
    					if_block22 = create_if_block_2(ctx);
    					if_block22.c();
    					transition_in(if_block22, 1);
    					if_block22.m(div1, t24);
    				} else transition_in(if_block22, 1);
    			} else if (if_block22) {
    				group_outros();
    				transition_out(if_block22, 1, 1, () => {
    					if_block22 = null;
    				});
    				check_outros();
    			}

    			if (ctx.selected1 == 'clock') {
    				if (!if_block23) {
    					if_block23 = create_if_block_1(ctx);
    					if_block23.c();
    					transition_in(if_block23, 1);
    					if_block23.m(div1, null);
    				} else transition_in(if_block23, 1);
    			} else if (if_block23) {
    				group_outros();
    				transition_out(if_block23, 1, 1, () => {
    					if_block23 = null;
    				});
    				check_outros();
    			}

    			if (helpTexts[ctx.selected0+ctx.selected1]) {
    				if (if_block24) {
    					if_block24.p(changed, ctx);
    				} else {
    					if_block24 = create_if_block$3(ctx);
    					if_block24.c();
    					if_block24.m(div2, null);
    				}
    			} else if (if_block24) {
    				if_block24.d(1);
    				if_block24 = null;
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu0.$$.fragment, local);

    			transition_in(menu1.$$.fragment, local);

    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			transition_in(if_block6);
    			transition_in(if_block7);
    			transition_in(if_block8);
    			transition_in(if_block9);
    			transition_in(if_block10);
    			transition_in(if_block11);
    			transition_in(if_block12);
    			transition_in(if_block13);
    			transition_in(if_block14);
    			transition_in(if_block15);
    			transition_in(if_block16);
    			transition_in(if_block17);
    			transition_in(if_block18);
    			transition_in(if_block19);
    			transition_in(if_block20);
    			transition_in(if_block21);
    			transition_in(if_block22);
    			transition_in(if_block23);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(menu0.$$.fragment, local);
    			transition_out(menu1.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(if_block6);
    			transition_out(if_block7);
    			transition_out(if_block8);
    			transition_out(if_block9);
    			transition_out(if_block10);
    			transition_out(if_block11);
    			transition_out(if_block12);
    			transition_out(if_block13);
    			transition_out(if_block14);
    			transition_out(if_block15);
    			transition_out(if_block16);
    			transition_out(if_block17);
    			transition_out(if_block18);
    			transition_out(if_block19);
    			transition_out(if_block20);
    			transition_out(if_block21);
    			transition_out(if_block22);
    			transition_out(if_block23);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div0);
    			}

    			destroy_component(menu0);

    			destroy_component(menu1);

    			if_blocks[current_block_type_index].d();

    			if (detaching) {
    				detach_dev(t2);
    				detach_dev(div1);
    			}

    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			if (if_block11) if_block11.d();
    			if (if_block12) if_block12.d();
    			if (if_block13) if_block13.d();
    			if (if_block14) if_block14.d();
    			if (if_block15) if_block15.d();
    			if (if_block16) if_block16.d();
    			if (if_block17) if_block17.d();
    			if (if_block18) if_block18.d();
    			if (if_block19) if_block19.d();
    			if (if_block20) if_block20.d();
    			if (if_block21) if_block21.d();
    			if (if_block22) if_block22.d();
    			if (if_block23) if_block23.d();

    			if (detaching) {
    				detach_dev(t25);
    				detach_dev(div2);
    			}

    			if (if_block24) if_block24.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$p.name, type: "component", source: "", ctx });
    	return block;
    }

    let selectedTree='';

    let hor = 'hor';

    let selected2 = '';

    function instance$d($$self, $$props, $$invalidate) {
    	let $shapeRendering;

    	validate_store(shapeRendering, 'shapeRendering');
    	component_subscribe($$self, shapeRendering, $$value => { $shapeRendering = $$value; $$invalidate('$shapeRendering', $shapeRendering); });

    	

    	const help=(selected0,keyword) => selected0=='keywords' && selected1!='' ? window.open('https://github.com/ChristerNilsson/svelte-projects/wiki/'+keyword, '_blank') : 0;
    	const link=(link) => window.open(links[link], '_blank');
    	
    	const links = {};
    	links['Svelte'] = 'https://github.com/ChristerNilsson/svelte-projects/wiki/Svelte';
    	links['REPL'] = 'https://svelte.dev/repl/hello-world?version=3.15.0';
    	let path = [""];

    	const children0 = 'L1|L2|L3|L4|L5|L6|keywords'.split('|');
    	let selected0 = '';
    	
    	let children1 = [''];
    	let children3 = 'Svelte|REPL|render:auto|render:crisp'.split('|');
    		
    	let selected1 = '';
    	let selected3 = '';

    	function menu0_selected_binding(value) {
    		selected3 = value;
    		$$invalidate('selected3', selected3);
    	}

    	function menu1_selected_binding(value_1) {
    		selected0 = value_1;
    		$$invalidate('selected0', selected0);
    	}

    	function menu_selected_binding(value) {
    		selected1 = value;
    		$$invalidate('selected1', selected1), $$invalidate('selected0', selected0);
    	}

    	function menu_selected_binding_1(value) {
    		selected1 = value;
    		$$invalidate('selected1', selected1), $$invalidate('selected0', selected0);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('selectedTree' in $$props) selectedTree = $$props.selectedTree;
    		if ('hor' in $$props) hor = $$props.hor;
    		if ('path' in $$props) path = $$props.path;
    		if ('selected0' in $$props) $$invalidate('selected0', selected0 = $$props.selected0);
    		if ('children1' in $$props) $$invalidate('children1', children1 = $$props.children1);
    		if ('children3' in $$props) $$invalidate('children3', children3 = $$props.children3);
    		if ('selected1' in $$props) $$invalidate('selected1', selected1 = $$props.selected1);
    		if ('selected2' in $$props) selected2 = $$props.selected2;
    		if ('selected3' in $$props) $$invalidate('selected3', selected3 = $$props.selected3);
    		if ('$shapeRendering' in $$props) shapeRendering.set($shapeRendering);
    	};

    	$$self.$$.update = ($$dirty = { selected0: 1, selected1: 1, selected3: 1 }) => {
    		if ($$dirty.selected0) { if (selected0=='L1') $$invalidate('children1', children1 = 'grid|rect|circle|line'.split('|')); }
    		if ($$dirty.selected0) { if (selected0=='L2') $$invalidate('children1', children1 = 'each|if|range|chess'.split('|')); }
    		if ($$dirty.selected0) { if (selected0=='L3') $$invalidate('children1', children1 = 'random|button|shortcut'.split('|')); }
    		if ($$dirty.selected0) { if (selected0=='L4') $$invalidate('children1', children1 = 'canvas|colorPair'.split('|')); }
    		if ($$dirty.selected0) { if (selected0=='L5') $$invalidate('children1', children1 = 'bind:|on:keyup|guessMyNumber'.split('|')); }
    		if ($$dirty.selected0) { if (selected0=='L6') $$invalidate('children1', children1 = 'text|translate|rotate|scale|clock'.split('|')); }
    		if ($$dirty.selected0) { if (selected0=='keywords') $$invalidate('children1', children1 = 'bind:|button|circle|$:|each|g|if|line|on:click|on:keyup|random|range|rect|rotate|scale|style|styles|svg|text|translate'.split('|')); }
    		if ($$dirty.selected0) { if (selected0) $$invalidate('selected1', selected1 = ''); }
    		if ($$dirty.selected0 || $$dirty.selected1) { help(selected0,selected1); }
    		if ($$dirty.selected3) { if (selected3 == 'render:auto') set_store_value(shapeRendering, $shapeRendering='auto');
    				else if (selected3 == 'render:crisp') set_store_value(shapeRendering, $shapeRendering='crispEdges');
    				else link(selected3); }
    	};

    	return {
    		children0,
    		selected0,
    		children1,
    		children3,
    		selected1,
    		selected3,
    		menu0_selected_binding,
    		menu1_selected_binding,
    		menu_selected_binding,
    		menu_selected_binding_1
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$p, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$p.name });
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
