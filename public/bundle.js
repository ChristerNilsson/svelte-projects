
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
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
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

    const getStyler = (obj = {}) => {

    	const classes = {
    		'fs' : 'font-size $1',
    		'br':  'border-radius $1',
    		'clear' : 'clear $1',
    		'align' : 'text-align $1',
    		'float' : 'float $1',
    		'bg' : 'background-color $1 calcColor',
    		'tc' : 'color $1 calcColor',
    	};

    	const colors = {
    		'red': '#f44336',
    		'pink': '#e91e63',
    		'purple': '#9c27b0',
    		'deep-purple': '#673ab7',
    		'indigo': '#3f51b5',
    		'blue': '#2196f3',
    		'light-blue': '#03a9f4',
    		'cyan': '#00bcd4',
    		'teal': '#009688',
    		'green': '#4caf50',
    		'light-green': '#8bc34a',
    		'lime': '#cddc39',
    		'yellow': '#ffeb3b',
    		'amber': '#ffc107',
    		'orange': '#ff9800',
    		'deep-orange': '#ff5722',
    		'brown': '#795548',
    		'grey': '#9e9e9e',
    		'blue-grey': '#607d8b',
    		'black': '#000000',
    		'white': '#ffffff',
    	};
    	
    	const calcS = (stack) => {
    		const a = stack.pop();
    		const b = stack.pop();
    		const c = stack.pop();
    		return c+`:${(100-2*b*12/a)*(a/12)}%`
    	};

    	const calcColor = (stack) => {
    		const a = stack.pop();
    		const b = stack.pop();
    		return b + ":" + colors[a]
    	};

    	Object.assign(classes,obj);
    	return (line) => {
    		const arr = line.split(' ');
    		if (arr.length==0) return

    		const result = [];
    		for (const word of arr) {
    			const stack = [];
    			const params = word.split(':');
    			const verb = params[0];

    			if (! verb in classes) {
    				console.log("ERROR: missing " + verb);
    				return
    			}

    			const commands = classes[verb];
    			for (const command of commands.split(' ')) {
    				for (const cmd of command.split(':')) {

    					if (cmd == 'calcS') { 
    						result.push(calcS(stack));
    					} else if (cmd == 'calcColor') { 
    						result.push(calcColor(stack));
    					} else if (cmd == '$1') {
    						stack.push(params[1]);
    					} else if (cmd == '$2') {
    						stack.push(params[2]);
    					} else {
    						stack.push(cmd);
    					}
    				}
    			}

    			if (stack.length==1) {
    				result.push(stack.pop());
    			} else if (stack.length==2) {
    				const a = stack.pop();
    				const b = stack.pop();
    				result.push(b + ':' + a);
    			}
    		}
    		
    		return result.join('; ')
    	}
    };

    var styles = {getStyler};
    var styles_1 = styles.getStyler;

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
    	child_ctx.t = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.width = list[i];
    	return child_ctx;
    }

    // (23:2) {#each widths as width}
    function create_each_block_3(ctx) {
    	var option, t_value = ctx.width + "", t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = ctx.width;
    			option.value = option.__value;
    			add_location(option, file, 23, 3, 512);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(option);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_3.name, type: "each", source: "(23:2) {#each widths as width}", ctx });
    	return block;
    }

    // (31:2) {#each ss as t}
    function create_each_block_2(ctx) {
    	var option, t_value = ctx.t + "", t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = ctx.t;
    			option.value = option.__value;
    			add_location(option, file, 31, 3, 640);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(option);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_2.name, type: "each", source: "(31:2) {#each ss as t}", ctx });
    	return block;
    }

    // (38:1) {#each [0,1,2,3,4,5,6,7,8,9,10,11] as i}
    function create_each_block_1(ctx) {
    	var div, t0, t1, div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.w);
    			t1 = space();
    			attr_dev(div, "style", div_style_value = ctx.style('width margpx fs:20px br:5px float:left bg:red tc:black align:center'));
    			add_location(div, file, 38, 2, 786);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.w) {
    				set_data_dev(t0, ctx.w);
    			}

    			if ((changed.style) && div_style_value !== (div_style_value = ctx.style('width margpx fs:20px br:5px float:left bg:red tc:black align:center'))) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_1.name, type: "each", source: "(38:1) {#each [0,1,2,3,4,5,6,7,8,9,10,11] as i}", ctx });
    	return block;
    }

    // (46:1) {#each [0,1,2,3,4,5,6,7,8,9,10,11] as i}
    function create_each_block(ctx) {
    	var div, t0, t1, div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.s);
    			t1 = space();
    			attr_dev(div, "style", div_style_value = ctx.style(ctx.s + ' margproc fs:20px br:5px float:left bg:green tc:white align:center'));
    			add_location(div, file, 46, 2, 996);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.s) {
    				set_data_dev(t0, ctx.s);
    			}

    			if ((changed.style || changed.s) && div_style_value !== (div_style_value = ctx.style(ctx.s + ' margproc fs:20px br:5px float:left bg:green tc:white align:center'))) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(46:1) {#each [0,1,2,3,4,5,6,7,8,9,10,11] as i}", ctx });
    	return block;
    }

    function create_fragment(ctx) {
    	var div0, select0, t0, div1, select1, t1, div2, div2_style_value, t2, div3, div3_style_value, t3, pre, t4, pre_style_value, dispose;

    	let each_value_3 = ctx.widths;

    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = ctx.ss;

    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = [0,1,2,3,4,5,6,7,8,9,10,11];

    	let each_blocks_1 = [];

    	for (let i = 0; i < 12; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = [0,1,2,3,4,5,6,7,8,9,10,11];

    	let each_blocks = [];

    	for (let i = 0; i < 12; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			select1 = element("select");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t1 = space();
    			div2 = element("div");

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div3 = element("div");

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			pre = element("pre");
    			t4 = text("Challenge!\r\n* Use a margin\r\n* Fixed width (red)\r\n* Fixed column count (green)");
    			if (ctx.w === void 0) add_render_callback(() => ctx.select0_change_handler.call(select0));
    			add_location(select0, file, 21, 1, 457);
    			add_location(div0, file, 20, 0, 449);
    			if (ctx.s === void 0) add_render_callback(() => ctx.select1_change_handler.call(select1));
    			add_location(select1, file, 29, 1, 593);
    			add_location(div1, file, 28, 0, 585);
    			attr_dev(div2, "style", div2_style_value = ctx.style("clear:left"));
    			add_location(div2, file, 36, 0, 705);
    			attr_dev(div3, "style", div3_style_value = ctx.style("clear:left"));
    			add_location(div3, file, 44, 0, 916);
    			attr_dev(pre, "style", pre_style_value = ctx.style("fs:20px clear:left"));
    			add_location(pre, file, 52, 0, 1129);

    			dispose = [
    				listen_dev(select0, "change", ctx.select0_change_handler),
    				listen_dev(select1, "change", ctx.select1_change_handler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, select0);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(select0, null);
    			}

    			select_option(select0, ctx.w);

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, select1);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(select1, null);
    			}

    			select_option(select1, ctx.s);

    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks_1[i].m(div2, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, div3, anchor);

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			insert_dev(target, t3, anchor);
    			insert_dev(target, pre, anchor);
    			append_dev(pre, t4);
    		},

    		p: function update(changed, ctx) {
    			if (changed.widths) {
    				each_value_3 = ctx.widths;

    				let i;
    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(changed, child_ctx);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}
    				each_blocks_3.length = each_value_3.length;
    			}

    			if (changed.w) select_option(select0, ctx.w);

    			if (changed.ss) {
    				each_value_2 = ctx.ss;

    				let i;
    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(changed, child_ctx);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}
    				each_blocks_2.length = each_value_2.length;
    			}

    			if (changed.s) select_option(select1, ctx.s);

    			if (changed.style || changed.w) {
    				each_value_1 = [0,1,2,3,4,5,6,7,8,9,10,11];

    				let i;
    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(changed, child_ctx);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div2, null);
    					}
    				}

    				for (; i < 12; i += 1) {
    					each_blocks_1[i].d(1);
    				}
    			}

    			if ((changed.style) && div2_style_value !== (div2_style_value = ctx.style("clear:left"))) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (changed.style || changed.s) {
    				each_value = [0,1,2,3,4,5,6,7,8,9,10,11];

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < 12; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}

    			if ((changed.style) && div3_style_value !== (div3_style_value = ctx.style("clear:left"))) {
    				attr_dev(div3, "style", div3_style_value);
    			}

    			if ((changed.style) && pre_style_value !== (pre_style_value = ctx.style("fs:20px clear:left"))) {
    				attr_dev(pre, "style", pre_style_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div0);
    			}

    			destroy_each(each_blocks_3, detaching);

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(div1);
    			}

    			destroy_each(each_blocks_2, detaching);

    			if (detaching) {
    				detach_dev(t1);
    				detach_dev(div2);
    			}

    			destroy_each(each_blocks_1, detaching);

    			if (detaching) {
    				detach_dev(t2);
    				detach_dev(div3);
    			}

    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(t3);
    				detach_dev(pre);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    const MARGPX = 1;

    const MARGPROC = 0.1;

    function instance($$self, $$props, $$invalidate) {
    	
    	const widths = [50,60,100,120,150,200,300,600];
    	let w = 300;
    	const ss = 's:1 s:2 s:3 s:4 s:5 s:6 s:7 s:8 s:9 s:10 s:11 s:12'.split(' ');
    	let s = 's:2';

    	function select0_change_handler() {
    		w = select_value(this);
    		$$invalidate('w', w);
    		$$invalidate('widths', widths);
    	}

    	function select1_change_handler() {
    		s = select_value(this);
    		$$invalidate('s', s);
    		$$invalidate('ss', ss);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('w' in $$props) $$invalidate('w', w = $$props.w);
    		if ('s' in $$props) $$invalidate('s', s = $$props.s);
    		if ('style' in $$props) $$invalidate('style', style = $$props.style);
    	};

    	let style;

    	$$self.$$.update = ($$dirty = { w: 1 }) => {
    		if ($$dirty.w) { $$invalidate('style', style = styles_1({
    				'margpx': `margin ${MARGPX}px`,
    				'width': `width ${w-2*MARGPX}px`,
    				'margproc': `margin ${MARGPROC}%`,
    				's' : `width ${MARGPROC} $1 calcS`,
    			})); }
    	};

    	return {
    		widths,
    		w,
    		ss,
    		s,
    		style,
    		select0_change_handler,
    		select1_change_handler
    	};
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
