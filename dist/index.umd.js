(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("vue"), require("monaco-editor")) : typeof define === "function" && define.amd ? define([
		"exports",
		"vue",
		"monaco-editor"
	], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["monaco-editor-vue3"] = {}, global.Vue, global["monaco-editor"]));
})(this, function(exports, vue, monaco_editor) {
	Object.defineProperties(exports, {
		__esModule: { value: true },
		[Symbol.toStringTag]: { value: "Module" }
	});
	//#region src/utils.ts
	/**
	* Output warning message
	* @param msg Warning message
	*/
	var warnMsg = (msg) => {
		console.warn(`[MonacoEditorVue3]: ${msg}`);
	};
	/**
	* Check if it is a valid size value
	* @param value Size value
	* @returns Formatted size value
	*/
	var formatSize = (value) => {
		if (typeof value === "number") return `${value}px`;
		if (typeof value === "string") {
			if (value.includes("%") || value.includes("px") || value.includes("rem") || value.includes("em")) return value;
			return `${value}px`;
		}
		return "100%";
	};
	/**
	* Deep merge objects
	* @param target Target object
	* @param source Source object
	* @returns Merged object
	*/
	var deepMerge = (target, source) => {
		const result = { ...target };
		for (const key in source) if (Object.hasOwn(source, key)) {
			const sourceValue = source[key];
			const targetValue = result[key];
			if (typeof sourceValue === "object" && sourceValue !== null && !Array.isArray(sourceValue) && typeof targetValue === "object" && targetValue !== null && !Array.isArray(targetValue)) result[key] = deepMerge(targetValue, sourceValue);
			else result[key] = sourceValue;
		}
		return result;
	};
	/**
	* Create default configuration for monaco editor instance
	* @param language Language type
	* @returns Default configuration object
	*/
	var createDefaultOptions = (language = "javascript") => ({
		language,
		theme: "vs",
		automaticLayout: true,
		minimap: { enabled: false },
		scrollBeyondLastLine: false,
		fontSize: 14,
		lineHeight: 24,
		tabSize: 2,
		wordWrap: "on",
		contextmenu: true,
		selectOnLineNumbers: true
	});
	/**
	* Verify if the language is supported by Monaco Editor
	* @param language Language identifier
	* @returns Whether the language is supported
	*/
	var isSupportedLanguage = (language) => {
		return [
			"javascript",
			"typescript",
			"json",
			"html",
			"css",
			"scss",
			"less",
			"python",
			"java",
			"csharp",
			"cpp",
			"php",
			"ruby",
			"go",
			"rust",
			"sql",
			"markdown",
			"xml",
			"yaml",
			"dockerfile",
			"shell",
			"powershell"
		].includes(language.toLowerCase());
	};
	//#endregion
	//#region src/hook.ts
	/**
	* General editor error handling and state management Hook
	*/
	var useEditorState = () => {
		const loading = (0, vue.ref)({
			isLoading: false,
			loadingText: "Loading Monaco Editor...",
			progress: 0
		});
		const error = (0, vue.ref)(null);
		const isReady = (0, vue.ref)(false);
		const setLoading = (state) => {
			loading.value = {
				...loading.value,
				...state
			};
		};
		const setError = (err) => {
			error.value = err;
			if (err) {
				warnMsg(`Editor Error [${err.code}]: ${err.message}`);
				if (err.details) console.error("Error details:", err.details);
			}
		};
		const clearError = () => {
			error.value = null;
		};
		const setReady = (ready) => {
			isReady.value = ready;
			if (ready) setLoading({
				isLoading: false,
				progress: 100
			});
		};
		return {
			loading,
			error,
			isReady,
			setLoading,
			setError,
			clearError,
			setReady
		};
	};
	/**
	* Lifecycle hook management
	*/
	var useEditorLifecycle = (hooks) => {
		const executeHook = async (hookName, ...args) => {
			const hook = hooks?.[hookName];
			if (hook) try {
				await hook.apply(null, args);
			} catch (error) {
				hooks?.onError?.({
					code: "LIFECYCLE_ERROR",
					message: `Error in ${hookName} hook`,
					details: error instanceof Error ? error.message : String(error),
					recoverable: true
				});
			}
		};
		return { executeHook };
	};
	var useCommonEditor = () => {};
	var useCodeEditor = (props, emit) => {
		let editorInstance = null;
		const container = (0, vue.ref)();
		const { loading, error, isReady, setLoading, setError, clearError, setReady } = useEditorState();
		const { executeHook } = useEditorLifecycle(props.lifecycle);
		const createEditor = async () => {
			try {
				if (!container.value) throw new Error("Container element not found");
				await executeHook("beforeCreate");
				setLoading({
					isLoading: true,
					progress: 20
				});
				await executeHook("onCreating");
				emit("editorWillMount");
				setLoading({ progress: 50 });
				const options = {
					value: props.value,
					language: props.language,
					theme: props.theme,
					...props.options
				};
				editorInstance = monaco_editor.editor.create(container.value, options);
				setLoading({ progress: 80 });
				await executeHook("onCreated", editorInstance);
				editorInstance.onDidChangeModelContent((event) => {
					const value = editorInstance.getValue();
					if (props.value !== value) {
						emit("change", value, event);
						emit("update:value", value);
					}
				});
				setReady(true);
				await executeHook("onReady", editorInstance);
				emit("editorDidMount", editorInstance);
			} catch (err) {
				const editorError = {
					code: "EDITOR_CREATE_FAILED",
					message: "Failed to create Monaco editor",
					details: err instanceof Error ? err.message : String(err),
					recoverable: true
				};
				setError(editorError);
				await executeHook("onError", editorError);
			}
		};
		const destroyEditor = async () => {
			try {
				await executeHook("beforeDestroy");
				if (editorInstance) {
					editorInstance.dispose();
					editorInstance = null;
				}
				setReady(false);
				clearError();
				await executeHook("onDestroyed");
			} catch (err) {
				setError({
					code: "EDITOR_DESTROY_FAILED",
					message: "Failed to destroy Monaco editor",
					details: err instanceof Error ? err.message : String(err),
					recoverable: false
				});
			}
		};
		(0, vue.onMounted)(() => {
			(0, vue.nextTick)(() => {
				createEditor();
			});
		});
		(0, vue.onUnmounted)(() => {
			destroyEditor();
		});
		(0, vue.watch)(() => props.options, (opt) => {
			if (!opt || !editorInstance) return;
			try {
				editorInstance.updateOptions(opt);
			} catch (err) {
				setError({
					code: "OPTIONS_UPDATE_FAILED",
					message: "Failed to update editor options",
					details: err instanceof Error ? err.message : String(err),
					recoverable: true
				});
			}
		}, { deep: true });
		(0, vue.watch)(() => props.value, (newValue) => {
			if (!editorInstance || newValue === void 0) return;
			if (editorInstance.getValue() !== newValue) try {
				editorInstance.setValue(newValue);
			} catch (err) {
				setError({
					code: "VALUE_UPDATE_FAILED",
					message: "Failed to update editor value",
					details: err instanceof Error ? err.message : String(err),
					recoverable: true
				});
			}
		});
		const retry = () => {
			clearError();
			createEditor();
		};
		return {
			editorInstance,
			container,
			loading,
			error,
			isReady,
			retry,
			destroy: destroyEditor
		};
	};
	var useDiffEditor = (props, emit) => {
		let editorInstance = null;
		const container = (0, vue.ref)();
		const { loading, error, isReady, setLoading, setError, clearError, setReady } = useEditorState();
		const { executeHook } = useEditorLifecycle(props.lifecycle);
		const createEditor = async () => {
			try {
				if (!container.value) throw new Error("Container element not found");
				await executeHook("beforeCreate");
				setLoading({
					isLoading: true,
					progress: 20
				});
				await executeHook("onCreating");
				emit("editorWillMount");
				setLoading({ progress: 50 });
				const options = {
					value: props.value,
					language: props.language,
					theme: props.theme,
					...props.options
				};
				editorInstance = monaco_editor.editor.createDiffEditor(container.value, options);
				setLoading({ progress: 70 });
				const originalModel = monaco_editor.editor.createModel(props.original ?? "", props.language);
				const modifiedModel = monaco_editor.editor.createModel(props.value ?? "", props.language);
				editorInstance.setModel({
					original: originalModel,
					modified: modifiedModel
				});
				setLoading({ progress: 80 });
				await executeHook("onCreated", editorInstance);
				editorInstance.getModifiedEditor().onDidChangeModelContent((event) => {
					const value = (editorInstance?.getModifiedEditor()).getValue();
					if (props.value !== value) {
						emit("change", value, event);
						emit("update:value", value);
					}
				});
				setReady(true);
				await executeHook("onReady", editorInstance);
				emit("editorDidMount", editorInstance);
			} catch (err) {
				const editorError = {
					code: "DIFF_EDITOR_CREATE_FAILED",
					message: "Failed to create Monaco diff editor",
					details: err instanceof Error ? err.message : String(err),
					recoverable: true
				};
				setError(editorError);
				await executeHook("onError", editorError);
			}
		};
		const destroyEditor = async () => {
			try {
				await executeHook("beforeDestroy");
				if (editorInstance) {
					editorInstance.dispose();
					editorInstance = null;
				}
				setReady(false);
				clearError();
				await executeHook("onDestroyed");
			} catch (err) {
				setError({
					code: "DIFF_EDITOR_DESTROY_FAILED",
					message: "Failed to destroy Monaco diff editor",
					details: err instanceof Error ? err.message : String(err),
					recoverable: false
				});
			}
		};
		(0, vue.onMounted)(() => {
			(0, vue.nextTick)(() => {
				createEditor();
			});
		});
		(0, vue.onUnmounted)(() => {
			destroyEditor();
		});
		(0, vue.watch)([() => props.original, () => props.value], ([newOriginal, newValue]) => {
			if (!editorInstance) return;
			try {
				const model = editorInstance.getModel();
				if (model) {
					if (newOriginal !== void 0) model.original.setValue(newOriginal);
					if (newValue !== void 0) model.modified.setValue(newValue);
				}
			} catch (err) {
				setError({
					code: "DIFF_VALUE_UPDATE_FAILED",
					message: "Failed to update diff editor values",
					details: err instanceof Error ? err.message : String(err),
					recoverable: true
				});
			}
		});
		const retry = () => {
			clearError();
			createEditor();
		};
		return {
			editorInstance,
			container,
			loading,
			error,
			isReady,
			retry,
			destroy: destroyEditor
		};
	};
	//#endregion
	//#region src/components/MonacoLoading.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$1 = { key: 0 };
	//#endregion
	//#region src/components/MonacoLoading.vue
	var MonacoLoading_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "MonacoLoading",
		props: {
			loadingText: { default: "Loading Monaco Editor..." },
			progress: { default: 0 },
			showProgress: {
				type: Boolean,
				default: true
			}
		},
		setup(__props) {
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", null, [(0, vue.createElementVNode)("div", null, [
					_cache[0] || (_cache[0] = (0, vue.createElementVNode)("div", null, [(0, vue.createElementVNode)("div")], -1)),
					(0, vue.createElementVNode)("div", null, (0, vue.toDisplayString)(__props.loadingText), 1),
					__props.showProgress ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$1, [(0, vue.createElementVNode)("div", null, [(0, vue.createElementVNode)("div", { style: (0, vue.normalizeStyle)({ width: `${__props.progress}%` }) }, null, 4)]), (0, vue.createElementVNode)("div", null, (0, vue.toDisplayString)(__props.progress) + "%", 1)])) : (0, vue.createCommentVNode)("", true)
				])]);
			};
		}
	});
	//#endregion
	//#region src/components/MonacoErrorBoundary.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1 = { key: 0 };
	var _hoisted_2 = { key: 1 };
	//#endregion
	//#region src/components/MonacoErrorBoundary.vue
	var MonacoErrorBoundary_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "MonacoErrorBoundary",
		props: {
			error: {},
			showDetails: {
				type: Boolean,
				default: true
			},
			showRetry: {
				type: Boolean,
				default: true
			},
			showReload: {
				type: Boolean,
				default: false
			},
			showReport: {
				type: Boolean,
				default: false
			}
		},
		emits: [
			"retry",
			"reload",
			"report"
		],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emit = __emit;
			const errorCode = (0, vue.computed)(() => props.error.code);
			const handleRetry = () => {
				emit("retry");
			};
			const handleReload = () => {
				if (typeof window !== "undefined") window.location.reload();
				emit("reload");
			};
			const handleReport = () => {
				emit("report", props.error);
			};
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", null, [(0, vue.createElementVNode)("div", null, [
					_cache[1] || (_cache[1] = (0, vue.createElementVNode)("div", null, [(0, vue.createElementVNode)("svg", {
						width: "48",
						height: "48",
						viewBox: "0 0 24 24",
						fill: "none",
						xmlns: "http://www.w3.org/2000/svg"
					}, [
						(0, vue.createElementVNode)("circle", {
							cx: "12",
							cy: "12",
							r: "10",
							stroke: "#dc3545",
							"stroke-width": "2"
						}),
						(0, vue.createElementVNode)("path", {
							d: "m15 9-6 6",
							stroke: "#dc3545",
							"stroke-width": "2"
						}),
						(0, vue.createElementVNode)("path", {
							d: "m9 9 6 6",
							stroke: "#dc3545",
							"stroke-width": "2"
						})
					])], -1)),
					_cache[2] || (_cache[2] = (0, vue.createElementVNode)("div", null, "Monaco Editor Error", -1)),
					(0, vue.createElementVNode)("div", null, (0, vue.toDisplayString)(__props.error.message), 1),
					__props.error.details && __props.showDetails ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1, [(0, vue.createElementVNode)("details", null, [_cache[0] || (_cache[0] = (0, vue.createElementVNode)("summary", null, "Error Details", -1)), (0, vue.createElementVNode)("pre", null, (0, vue.toDisplayString)(__props.error.details), 1)])])) : (0, vue.createCommentVNode)("", true),
					(0, vue.createElementVNode)("div", null, [
						__props.error.recoverable && __props.showRetry ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("button", {
							key: 0,
							onClick: handleRetry
						}, "Retry")) : (0, vue.createCommentVNode)("", true),
						__props.showReload ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("button", {
							key: 1,
							onClick: handleReload
						}, "Reload Page")) : (0, vue.createCommentVNode)("", true),
						__props.showReport ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("button", {
							key: 2,
							onClick: handleReport
						}, "Report Issue")) : (0, vue.createCommentVNode)("", true)
					]),
					errorCode.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_2, "Error Code: " + (0, vue.toDisplayString)(errorCode.value), 1)) : (0, vue.createCommentVNode)("", true)
				])]);
			};
		}
	});
	//#endregion
	//#region src/CodeEditor.vue
	var CodeEditor_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "CodeEditor",
		props: {
			loadingText: {},
			showProgress: {
				type: Boolean,
				default: true
			},
			showErrorBoundary: {
				type: Boolean,
				default: true
			},
			retryable: {
				type: Boolean,
				default: true
			},
			lifecycle: {},
			useDefaultLoading: {
				type: Boolean,
				default: true
			},
			useDefaultErrorBoundary: {
				type: Boolean,
				default: true
			},
			value: { default: "" },
			width: { default: "100%" },
			height: { default: "100%" },
			theme: { default: "vs" },
			language: { default: "javascript" },
			options: { default: () => ({}) }
		},
		emits: [
			"editorWillMount",
			"editorDidMount",
			"change",
			"update:value",
			"error",
			"ready",
			"loading"
		],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emit = __emit;
			const { container, loading, error, isReady, retry } = useCodeEditor(props, emit);
			const { width, height } = (0, vue.toRefs)(props);
			const editorWrapperStyle = (0, vue.computed)(() => ({
				width: formatSize(width.value),
				height: formatSize(height.value),
				textAlign: "left",
				position: "relative"
			}));
			const editorContainerStyle = (0, vue.computed)(() => ({
				width: "100%",
				height: "100%",
				visibility: isReady.value && !error.value ? "visible" : "hidden"
			}));
			const handleRetry = () => {
				retry();
				emit("error", null);
			};
			(0, vue.watch)(loading, (newLoading) => {
				emit("loading", newLoading);
			}, { deep: true });
			(0, vue.watch)(error, (newError) => {
				emit("error", newError);
			});
			(0, vue.watch)(isReady, (ready) => {
				if (ready) emit("ready");
			});
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					ref: "editorContainer",
					style: (0, vue.normalizeStyle)(editorWrapperStyle.value),
					class: "monaco-code-editor"
				}, [!(0, vue.unref)(isReady) && !(0, vue.unref)(error) ? (0, vue.renderSlot)(_ctx.$slots, "loading", {
					key: 0,
					loading: (0, vue.unref)(loading),
					loadingText: __props.loadingText || (0, vue.unref)(loading).loadingText,
					progress: (0, vue.unref)(loading).progress,
					showProgress: __props.showProgress
				}, () => [__props.useDefaultLoading ? ((0, vue.openBlock)(), (0, vue.createBlock)(MonacoLoading_default, {
					key: 0,
					"loading-text": __props.loadingText || (0, vue.unref)(loading).loadingText,
					progress: (0, vue.unref)(loading).progress,
					"show-progress": __props.showProgress
				}, null, 8, [
					"loading-text",
					"progress",
					"show-progress"
				])) : (0, vue.createCommentVNode)("", true)]) : (0, vue.unref)(error) && __props.showErrorBoundary ? (0, vue.renderSlot)(_ctx.$slots, "error", {
					key: 1,
					error: (0, vue.unref)(error),
					retry: handleRetry,
					retryable: __props.retryable
				}, () => [__props.useDefaultErrorBoundary ? ((0, vue.openBlock)(), (0, vue.createBlock)(MonacoErrorBoundary_default, {
					key: 0,
					error: (0, vue.unref)(error),
					"show-retry": __props.retryable,
					"show-details": true,
					"show-reload": false,
					"show-report": false,
					onRetry: handleRetry
				}, null, 8, ["error", "show-retry"])) : (0, vue.createCommentVNode)("", true)]) : (0, vue.createCommentVNode)("", true), (0, vue.createElementVNode)("div", {
					ref_key: "container",
					ref: container,
					style: (0, vue.normalizeStyle)(editorContainerStyle.value)
				}, null, 4)], 4);
			};
		}
	});
	//#endregion
	//#region src/DiffEditor.vue
	var DiffEditor_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "DiffEditor",
		props: {
			loadingText: {},
			showProgress: {
				type: Boolean,
				default: true
			},
			showErrorBoundary: {
				type: Boolean,
				default: true
			},
			retryable: {
				type: Boolean,
				default: true
			},
			lifecycle: {},
			useDefaultLoading: {
				type: Boolean,
				default: true
			},
			useDefaultErrorBoundary: {
				type: Boolean,
				default: true
			},
			value: { default: "" },
			original: { default: "" },
			width: { default: "100%" },
			height: { default: "100%" },
			theme: { default: "vs" },
			language: { default: "javascript" },
			options: { default: () => ({}) }
		},
		emits: [
			"editorWillMount",
			"editorDidMount",
			"change",
			"update:value",
			"error",
			"ready",
			"loading"
		],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emit = __emit;
			const { container, loading, error, isReady, retry } = useDiffEditor(props, emit);
			const { width, height } = (0, vue.toRefs)(props);
			const style = (0, vue.computed)(() => ({
				width: formatSize(width.value),
				height: formatSize(height.value),
				textAlign: "left",
				position: "relative"
			}));
			const handleRetry = () => {
				retry();
				emit("error", null);
			};
			(0, vue.watch)(loading, (newLoading) => {
				emit("loading", newLoading);
			}, { deep: true });
			(0, vue.watch)(error, (newError) => {
				emit("error", newError);
			});
			(0, vue.watch)(isReady, (ready) => {
				if (ready) emit("ready");
			});
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					ref: "editorContainer",
					style: (0, vue.normalizeStyle)(style.value)
				}, [!(0, vue.unref)(isReady) && !(0, vue.unref)(error) ? (0, vue.renderSlot)(_ctx.$slots, "loading", {
					key: 0,
					loading: (0, vue.unref)(loading),
					loadingText: __props.loadingText || (0, vue.unref)(loading).loadingText,
					progress: (0, vue.unref)(loading).progress,
					showProgress: __props.showProgress
				}, () => [__props.useDefaultLoading ? ((0, vue.openBlock)(), (0, vue.createBlock)(MonacoLoading_default, {
					key: 0,
					"loading-text": __props.loadingText || (0, vue.unref)(loading).loadingText,
					progress: (0, vue.unref)(loading).progress,
					"show-progress": __props.showProgress
				}, null, 8, [
					"loading-text",
					"progress",
					"show-progress"
				])) : (0, vue.createCommentVNode)("", true)]) : (0, vue.unref)(error) && __props.showErrorBoundary ? (0, vue.renderSlot)(_ctx.$slots, "error", {
					key: 1,
					error: (0, vue.unref)(error),
					retry: handleRetry,
					retryable: __props.retryable
				}, () => [__props.useDefaultErrorBoundary ? ((0, vue.openBlock)(), (0, vue.createBlock)(MonacoErrorBoundary_default, {
					key: 0,
					error: (0, vue.unref)(error),
					"show-retry": __props.retryable,
					"show-details": true,
					"show-reload": false,
					"show-report": false,
					onRetry: handleRetry
				}, null, 8, ["error", "show-retry"])) : (0, vue.createCommentVNode)("", true)]) : (0, vue.createCommentVNode)("", true), (0, vue.createElementVNode)("div", {
					ref_key: "container",
					ref: container,
					style: (0, vue.normalizeStyle)({
						width: "100%",
						height: "100%",
						visibility: (0, vue.unref)(isReady) && !(0, vue.unref)(error) ? "visible" : "hidden"
					})
				}, null, 4)], 4);
			};
		}
	});
	//#endregion
	//#region src/index.ts
	var src_default = CodeEditor_default;
	//#endregion
	exports.CodeEditor = CodeEditor_default;
	exports.DiffEditor = DiffEditor_default;
	exports.createDefaultOptions = createDefaultOptions;
	exports.deepMerge = deepMerge;
	exports.default = src_default;
	exports.formatSize = formatSize;
	exports.isSupportedLanguage = isSupportedLanguage;
	exports.useCodeEditor = useCodeEditor;
	exports.useCommonEditor = useCommonEditor;
	exports.useDiffEditor = useDiffEditor;
	exports.useEditorLifecycle = useEditorLifecycle;
	exports.useEditorState = useEditorState;
	exports.warnMsg = warnMsg;
});
