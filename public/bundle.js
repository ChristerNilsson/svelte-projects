
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
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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

    /* src\Menu.svelte generated by Svelte v3.12.1 */

    const file = "src\\Menu.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.c = list[i];
    	return child_ctx;
    }

    // (24:1) {#each children as c}
    function create_each_block(ctx) {
    	var div, t_value = ctx.c + "", t, div_class_value, dispose;

    	function click_handler() {
    		return ctx.click_handler(ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", div_class_value = "mnu " + (ctx.selected==ctx.c ? 'text-red' : '') + " svelte-8lopxj");
    			add_location(div, file, 24, 2, 350);
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

    			if ((changed.selected || changed.children) && div_class_value !== (div_class_value = "mnu " + (ctx.selected==ctx.c ? 'text-red' : '') + " svelte-8lopxj")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			dispose();
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
    			attr_dev(div, "class", "nav svelte-8lopxj");
    			add_location(div, file, 22, 0, 305);
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
    			if (changed.selected || changed.children) {
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
    	let { children } = $$props;
    	$$invalidate('children', children = children.split('|'));
    	let { selected = children[0] } = $$props;

    	const writable_props = ['children', 'selected'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = ({ c }) => $$invalidate('selected', selected=c);

    	$$self.$set = $$props => {
    		if ('children' in $$props) $$invalidate('children', children = $$props.children);
    		if ('selected' in $$props) $$invalidate('selected', selected = $$props.selected);
    	};

    	$$self.$capture_state = () => {
    		return { children, selected };
    	};

    	$$self.$inject_state = $$props => {
    		if ('children' in $$props) $$invalidate('children', children = $$props.children);
    		if ('selected' in $$props) $$invalidate('selected', selected = $$props.selected);
    	};

    	return { children, selected, click_handler };
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["children", "selected"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Menu", options, id: create_fragment.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.children === undefined && !('children' in props)) {
    			console.warn("<Menu> was created without expected prop 'children'");
    		}
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

    /* src\App.svelte generated by Svelte v3.12.1 */

    const file$1 = "src\\App.svelte";

    // (45:0) {#if selectedMenu == 'Play'}
    function create_if_block_1(ctx) {
    	var div0, t0, t1, t2, t3, div1, button0, t4, t5, t6, button1, t7, t8, t9, button2, t10, t11;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(a);
    			t1 = text(" to ");
    			t2 = text(b);
    			t3 = space();
    			div1 = element("div");
    			button0 = element("button");
    			t4 = text("+");
    			t5 = text(ctx.ADD);
    			t6 = space();
    			button1 = element("button");
    			t7 = text("*");
    			t8 = text(ctx.MUL);
    			t9 = space();
    			button2 = element("button");
    			t10 = text("+");
    			t11 = text(ctx.DIV);
    			attr_dev(div0, "class", "col s6 fs center-align svelte-10cfbjx");
    			add_location(div0, file$1, 45, 1, 1194);
    			add_location(button0, file$1, 49, 2, 1302);
    			add_location(button1, file$1, 50, 2, 1329);
    			add_location(button2, file$1, 51, 2, 1356);
    			attr_dev(div1, "class", "col s6 fs marg center-align svelte-10cfbjx");
    			add_location(div1, file$1, 48, 1, 1257);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button0);
    			append_dev(button0, t4);
    			append_dev(button0, t5);
    			append_dev(div1, t6);
    			append_dev(div1, button1);
    			append_dev(button1, t7);
    			append_dev(button1, t8);
    			append_dev(div1, t9);
    			append_dev(div1, button2);
    			append_dev(button2, t10);
    			append_dev(button2, t11);
    		},

    		p: function update(changed, ctx) {
    			if (changed.ADD) {
    				set_data_dev(t5, ctx.ADD);
    			}

    			if (changed.MUL) {
    				set_data_dev(t8, ctx.MUL);
    			}

    			if (changed.DIV) {
    				set_data_dev(t11, ctx.DIV);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div0);
    				detach_dev(t3);
    				detach_dev(div1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1.name, type: "if", source: "(45:0) {#if selectedMenu == 'Play'}", ctx });
    	return block;
    }

    // (56:0) {#if selectedMenu=='Setup'}
    function create_if_block(ctx) {
    	var div8, div0, t0, input0, input0_updating = false, t1, div1, t2, input1, input1_updating = false, t3, div2, t4, input2, input2_updating = false, t5, div3, t6, input3, input3_updating = false, t7, div4, t8, input4, input4_updating = false, t9, div5, t10, input5, input5_updating = false, t11, div6, t12, input6, input6_updating = false, t13, div7, t14, input7, input7_updating = false, dispose;

    	function input0_input_handler() {
    		input0_updating = true;
    		ctx.input0_input_handler.call(input0);
    	}

    	function input1_input_handler() {
    		input1_updating = true;
    		ctx.input1_input_handler.call(input1);
    	}

    	function input2_input_handler() {
    		input2_updating = true;
    		ctx.input2_input_handler.call(input2);
    	}

    	function input3_input_handler() {
    		input3_updating = true;
    		ctx.input3_input_handler.call(input3);
    	}

    	function input4_input_handler() {
    		input4_updating = true;
    		ctx.input4_input_handler.call(input4);
    	}

    	function input5_input_handler() {
    		input5_updating = true;
    		ctx.input5_input_handler.call(input5);
    	}

    	function input6_input_handler() {
    		input6_updating = true;
    		ctx.input6_input_handler.call(input6);
    	}

    	function input7_input_handler() {
    		input7_updating = true;
    		ctx.input7_input_handler.call(input7);
    	}

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div0 = element("div");
    			t0 = text("ADD    ");
    			input0 = element("input");
    			t1 = space();
    			div1 = element("div");
    			t2 = text("MUL    ");
    			input1 = element("input");
    			t3 = space();
    			div2 = element("div");
    			t4 = text("DIV    ");
    			input2 = element("input");
    			t5 = space();
    			div3 = element("div");
    			t6 = text("SUB    ");
    			input3 = element("input");
    			t7 = space();
    			div4 = element("div");
    			t8 = text("M      ");
    			input4 = element("input");
    			t9 = space();
    			div5 = element("div");
    			t10 = text("N      ");
    			input5 = element("input");
    			t11 = space();
    			div6 = element("div");
    			t12 = text("MAX    ");
    			input6 = element("input");
    			t13 = space();
    			div7 = element("div");
    			t14 = text("SHUFFLE");
    			input7 = element("input");
    			attr_dev(input0, "style", fs);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "0");
    			attr_dev(input0, "max", "100");
    			add_location(input0, file$1, 58, 29, 1482);
    			attr_dev(div0, "class", "col s3");
    			add_location(div0, file$1, 58, 2, 1455);
    			attr_dev(input1, "style", fs);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "100");
    			add_location(input1, file$1, 59, 29, 1580);
    			attr_dev(div1, "class", "col s3");
    			add_location(div1, file$1, 59, 2, 1553);
    			attr_dev(input2, "style", fs);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "min", "0");
    			attr_dev(input2, "max", "100");
    			add_location(input2, file$1, 60, 29, 1678);
    			attr_dev(div2, "class", "col s3");
    			add_location(div2, file$1, 60, 2, 1651);
    			attr_dev(input3, "style", fs);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "min", "0");
    			attr_dev(input3, "max", "100");
    			add_location(input3, file$1, 61, 29, 1776);
    			attr_dev(div3, "class", "col s3");
    			add_location(div3, file$1, 61, 2, 1749);
    			attr_dev(input4, "style", fs);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "min", "1");
    			attr_dev(input4, "max", "12");
    			add_location(input4, file$1, 63, 29, 1876);
    			attr_dev(div4, "class", "col s3");
    			add_location(div4, file$1, 63, 2, 1849);
    			attr_dev(input5, "style", fs);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "min", "1");
    			attr_dev(input5, "max", "24");
    			add_location(input5, file$1, 64, 29, 1971);
    			attr_dev(div5, "class", "col s3");
    			add_location(div5, file$1, 64, 2, 1944);
    			attr_dev(input6, "style", fs);
    			attr_dev(input6, "type", "number");
    			attr_dev(input6, "min", "10");
    			attr_dev(input6, "max", "1000");
    			add_location(input6, file$1, 65, 29, 2066);
    			attr_dev(div6, "class", "col s3");
    			add_location(div6, file$1, 65, 2, 2039);
    			attr_dev(input7, "style", fs);
    			attr_dev(input7, "type", "number");
    			attr_dev(input7, "min", "0");
    			attr_dev(input7, "max", "1");
    			add_location(input7, file$1, 66, 29, 2166);
    			attr_dev(div7, "class", "col s3");
    			add_location(div7, file$1, 66, 2, 2139);
    			attr_dev(div8, "class", "row fs svelte-10cfbjx");
    			add_location(div8, file$1, 57, 1, 1431);

    			dispose = [
    				listen_dev(input0, "input", input0_input_handler),
    				listen_dev(input1, "input", input1_input_handler),
    				listen_dev(input2, "input", input2_input_handler),
    				listen_dev(input3, "input", input3_input_handler),
    				listen_dev(input4, "input", input4_input_handler),
    				listen_dev(input5, "input", input5_input_handler),
    				listen_dev(input6, "input", input6_input_handler),
    				listen_dev(input7, "input", input7_input_handler)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div0);
    			append_dev(div0, t0);
    			append_dev(div0, input0);

    			set_input_value(input0, ctx.ADD);

    			append_dev(div8, t1);
    			append_dev(div8, div1);
    			append_dev(div1, t2);
    			append_dev(div1, input1);

    			set_input_value(input1, ctx.MUL);

    			append_dev(div8, t3);
    			append_dev(div8, div2);
    			append_dev(div2, t4);
    			append_dev(div2, input2);

    			set_input_value(input2, ctx.DIV);

    			append_dev(div8, t5);
    			append_dev(div8, div3);
    			append_dev(div3, t6);
    			append_dev(div3, input3);

    			set_input_value(input3, ctx.SUB);

    			append_dev(div8, t7);
    			append_dev(div8, div4);
    			append_dev(div4, t8);
    			append_dev(div4, input4);

    			set_input_value(input4, ctx.M);

    			append_dev(div8, t9);
    			append_dev(div8, div5);
    			append_dev(div5, t10);
    			append_dev(div5, input5);

    			set_input_value(input5, ctx.N);

    			append_dev(div8, t11);
    			append_dev(div8, div6);
    			append_dev(div6, t12);
    			append_dev(div6, input6);

    			set_input_value(input6, ctx.MAX);

    			append_dev(div8, t13);
    			append_dev(div8, div7);
    			append_dev(div7, t14);
    			append_dev(div7, input7);

    			set_input_value(input7, ctx.SHUFFLE);
    		},

    		p: function update(changed, ctx) {
    			if (!input0_updating && changed.ADD) set_input_value(input0, ctx.ADD);
    			input0_updating = false;
    			if (!input1_updating && changed.MUL) set_input_value(input1, ctx.MUL);
    			input1_updating = false;
    			if (!input2_updating && changed.DIV) set_input_value(input2, ctx.DIV);
    			input2_updating = false;
    			if (!input3_updating && changed.SUB) set_input_value(input3, ctx.SUB);
    			input3_updating = false;
    			if (!input4_updating && changed.M) set_input_value(input4, ctx.M);
    			input4_updating = false;
    			if (!input5_updating && changed.N) set_input_value(input5, ctx.N);
    			input5_updating = false;
    			if (!input6_updating && changed.MAX) set_input_value(input6, ctx.MAX);
    			input6_updating = false;
    			if (!input7_updating && changed.SHUFFLE) set_input_value(input7, ctx.SHUFFLE);
    			input7_updating = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div8);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(56:0) {#if selectedMenu=='Setup'}", ctx });
    	return block;
    }

    function create_fragment$1(ctx) {
    	var updating_selected, t0, t1, if_block1_anchor, current;

    	function menu_selected_binding(value) {
    		ctx.menu_selected_binding.call(null, value);
    		updating_selected = true;
    		add_flush_callback(() => updating_selected = false);
    	}

    	let menu_props = { children: children$1 };
    	if (ctx.selectedMenu !== void 0) {
    		menu_props.selected = ctx.selectedMenu;
    	}
    	var menu = new Menu({ props: menu_props, $$inline: true });

    	binding_callbacks.push(() => bind(menu, 'selected', menu_selected_binding));

    	var if_block0 = (ctx.selectedMenu == 'Play') && create_if_block_1(ctx);

    	var if_block1 = (ctx.selectedMenu=='Setup') && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			menu.$$.fragment.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var menu_changes = {};
    			if (!updating_selected && changed.selectedMenu) {
    				menu_changes.selected = ctx.selectedMenu;
    			}
    			menu.$set(menu_changes);

    			if (ctx.selectedMenu == 'Play') {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.selectedMenu=='Setup') {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
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

    			if (detaching) {
    				detach_dev(t0);
    			}

    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach_dev(t1);
    			}

    			if (if_block1) if_block1.d(detaching);

    			if (detaching) {
    				detach_dev(if_block1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    let children$1 = 'Play|Setup';

    let a=17;

    let b=1;

    let selectedTree='Setup';

    let hor = 'hor';

    const fs = 'font-size:30px';

    function instance$1($$self, $$props, $$invalidate) {
    	
    	let selectedMenu;
    	let path=[''];

    	let ADD = 2;
    	let MUL = 3;
    	let DIV = 4;
    	let SUB = 5;
    	let M = 10;
    	let N = 12;
    	let MAX = 20;
    	let SHUFFLE = 0;

    	// if (curr=='') return 'File|Edit|Selection'
    	// if (curr=='File') return 'New File|New Window|Open File|Open Folder|Open Workspace|Open Recent'
    	// if (curr=='Edit') return 'Undo|Redo|Cut|Copy|Paste|Find|Replace|Find in Files|Replace in Files|Toggle Line Comment|Toggle Block Comment'
    	// if (curr=='Selection') return 'Select All|Expand Selection|Shrink Selection|Copy Line Up|Copy Line Down|Move Line Up|Move Line Down|Duplicate Selection'

    	function menu_selected_binding(value) {
    		selectedMenu = value;
    		$$invalidate('selectedMenu', selectedMenu);
    	}

    	function input0_input_handler() {
    		ADD = to_number(this.value);
    		$$invalidate('ADD', ADD);
    	}

    	function input1_input_handler() {
    		MUL = to_number(this.value);
    		$$invalidate('MUL', MUL);
    	}

    	function input2_input_handler() {
    		DIV = to_number(this.value);
    		$$invalidate('DIV', DIV);
    	}

    	function input3_input_handler() {
    		SUB = to_number(this.value);
    		$$invalidate('SUB', SUB);
    	}

    	function input4_input_handler() {
    		M = to_number(this.value);
    		$$invalidate('M', M);
    	}

    	function input5_input_handler() {
    		N = to_number(this.value);
    		$$invalidate('N', N);
    	}

    	function input6_input_handler() {
    		MAX = to_number(this.value);
    		$$invalidate('MAX', MAX);
    	}

    	function input7_input_handler() {
    		SHUFFLE = to_number(this.value);
    		$$invalidate('SHUFFLE', SHUFFLE);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('children' in $$props) $$invalidate('children', children$1 = $$props.children);
    		if ('selectedMenu' in $$props) $$invalidate('selectedMenu', selectedMenu = $$props.selectedMenu);
    		if ('path' in $$props) path = $$props.path;
    		if ('a' in $$props) $$invalidate('a', a = $$props.a);
    		if ('b' in $$props) $$invalidate('b', b = $$props.b);
    		if ('ADD' in $$props) $$invalidate('ADD', ADD = $$props.ADD);
    		if ('MUL' in $$props) $$invalidate('MUL', MUL = $$props.MUL);
    		if ('DIV' in $$props) $$invalidate('DIV', DIV = $$props.DIV);
    		if ('SUB' in $$props) $$invalidate('SUB', SUB = $$props.SUB);
    		if ('M' in $$props) $$invalidate('M', M = $$props.M);
    		if ('N' in $$props) $$invalidate('N', N = $$props.N);
    		if ('MAX' in $$props) $$invalidate('MAX', MAX = $$props.MAX);
    		if ('SHUFFLE' in $$props) $$invalidate('SHUFFLE', SHUFFLE = $$props.SHUFFLE);
    		if ('selectedTree' in $$props) selectedTree = $$props.selectedTree;
    		if ('hor' in $$props) hor = $$props.hor;
    	};

    	return {
    		selectedMenu,
    		ADD,
    		MUL,
    		DIV,
    		SUB,
    		M,
    		N,
    		MAX,
    		SHUFFLE,
    		menu_selected_binding,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$1.name });
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
