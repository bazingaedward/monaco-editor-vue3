import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, nextTick, normalizeStyle, onMounted, onUnmounted, openBlock, ref, renderSlot, toDisplayString, toRefs, unref, watch } from "vue";
import { editor } from "monaco-editor";
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
	const loading = ref({
		isLoading: false,
		loadingText: "Loading Monaco Editor...",
		progress: 0
	});
	const error = ref(null);
	const isReady = ref(false);
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
	const container = ref();
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
			editorInstance = editor.create(container.value, options);
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
	onMounted(() => {
		nextTick(() => {
			createEditor();
		});
	});
	onUnmounted(() => {
		destroyEditor();
	});
	watch(() => props.options, (opt) => {
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
	watch(() => props.value, (newValue) => {
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
	const container = ref();
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
			editorInstance = editor.createDiffEditor(container.value, options);
			setLoading({ progress: 70 });
			const originalModel = editor.createModel(props.original ?? "", props.language);
			const modifiedModel = editor.createModel(props.value ?? "", props.language);
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
	onMounted(() => {
		nextTick(() => {
			createEditor();
		});
	});
	onUnmounted(() => {
		destroyEditor();
	});
	watch([() => props.original, () => props.value], ([newOriginal, newValue]) => {
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
var MonacoLoading_default = /* @__PURE__ */ defineComponent({
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
			return openBlock(), createElementBlock("div", null, [createElementVNode("div", null, [
				_cache[0] || (_cache[0] = createElementVNode("div", null, [createElementVNode("div")], -1)),
				createElementVNode("div", null, toDisplayString(__props.loadingText), 1),
				__props.showProgress ? (openBlock(), createElementBlock("div", _hoisted_1$1, [createElementVNode("div", null, [createElementVNode("div", { style: normalizeStyle({ width: `${__props.progress}%` }) }, null, 4)]), createElementVNode("div", null, toDisplayString(__props.progress) + "%", 1)])) : createCommentVNode("", true)
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
var MonacoErrorBoundary_default = /* @__PURE__ */ defineComponent({
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
		const errorCode = computed(() => props.error.code);
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
			return openBlock(), createElementBlock("div", null, [createElementVNode("div", null, [
				_cache[1] || (_cache[1] = createElementVNode("div", null, [createElementVNode("svg", {
					width: "48",
					height: "48",
					viewBox: "0 0 24 24",
					fill: "none",
					xmlns: "http://www.w3.org/2000/svg"
				}, [
					createElementVNode("circle", {
						cx: "12",
						cy: "12",
						r: "10",
						stroke: "#dc3545",
						"stroke-width": "2"
					}),
					createElementVNode("path", {
						d: "m15 9-6 6",
						stroke: "#dc3545",
						"stroke-width": "2"
					}),
					createElementVNode("path", {
						d: "m9 9 6 6",
						stroke: "#dc3545",
						"stroke-width": "2"
					})
				])], -1)),
				_cache[2] || (_cache[2] = createElementVNode("div", null, "Monaco Editor Error", -1)),
				createElementVNode("div", null, toDisplayString(__props.error.message), 1),
				__props.error.details && __props.showDetails ? (openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("details", null, [_cache[0] || (_cache[0] = createElementVNode("summary", null, "Error Details", -1)), createElementVNode("pre", null, toDisplayString(__props.error.details), 1)])])) : createCommentVNode("", true),
				createElementVNode("div", null, [
					__props.error.recoverable && __props.showRetry ? (openBlock(), createElementBlock("button", {
						key: 0,
						onClick: handleRetry
					}, "Retry")) : createCommentVNode("", true),
					__props.showReload ? (openBlock(), createElementBlock("button", {
						key: 1,
						onClick: handleReload
					}, "Reload Page")) : createCommentVNode("", true),
					__props.showReport ? (openBlock(), createElementBlock("button", {
						key: 2,
						onClick: handleReport
					}, "Report Issue")) : createCommentVNode("", true)
				]),
				errorCode.value ? (openBlock(), createElementBlock("div", _hoisted_2, "Error Code: " + toDisplayString(errorCode.value), 1)) : createCommentVNode("", true)
			])]);
		};
	}
});
//#endregion
//#region src/CodeEditor.vue
var CodeEditor_default = /* @__PURE__ */ defineComponent({
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
		const { width, height } = toRefs(props);
		const editorWrapperStyle = computed(() => ({
			width: formatSize(width.value),
			height: formatSize(height.value),
			textAlign: "left",
			position: "relative"
		}));
		const editorContainerStyle = computed(() => ({
			width: "100%",
			height: "100%",
			visibility: isReady.value && !error.value ? "visible" : "hidden"
		}));
		const handleRetry = () => {
			retry();
			emit("error", null);
		};
		watch(loading, (newLoading) => {
			emit("loading", newLoading);
		}, { deep: true });
		watch(error, (newError) => {
			emit("error", newError);
		});
		watch(isReady, (ready) => {
			if (ready) emit("ready");
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref: "editorContainer",
				style: normalizeStyle(editorWrapperStyle.value),
				class: "monaco-code-editor"
			}, [!unref(isReady) && !unref(error) ? renderSlot(_ctx.$slots, "loading", {
				key: 0,
				loading: unref(loading),
				loadingText: __props.loadingText || unref(loading).loadingText,
				progress: unref(loading).progress,
				showProgress: __props.showProgress
			}, () => [__props.useDefaultLoading ? (openBlock(), createBlock(MonacoLoading_default, {
				key: 0,
				"loading-text": __props.loadingText || unref(loading).loadingText,
				progress: unref(loading).progress,
				"show-progress": __props.showProgress
			}, null, 8, [
				"loading-text",
				"progress",
				"show-progress"
			])) : createCommentVNode("", true)]) : unref(error) && __props.showErrorBoundary ? renderSlot(_ctx.$slots, "error", {
				key: 1,
				error: unref(error),
				retry: handleRetry,
				retryable: __props.retryable
			}, () => [__props.useDefaultErrorBoundary ? (openBlock(), createBlock(MonacoErrorBoundary_default, {
				key: 0,
				error: unref(error),
				"show-retry": __props.retryable,
				"show-details": true,
				"show-reload": false,
				"show-report": false,
				onRetry: handleRetry
			}, null, 8, ["error", "show-retry"])) : createCommentVNode("", true)]) : createCommentVNode("", true), createElementVNode("div", {
				ref_key: "container",
				ref: container,
				style: normalizeStyle(editorContainerStyle.value)
			}, null, 4)], 4);
		};
	}
});
//#endregion
//#region src/DiffEditor.vue
var DiffEditor_default = /* @__PURE__ */ defineComponent({
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
		const { width, height } = toRefs(props);
		const style = computed(() => ({
			width: formatSize(width.value),
			height: formatSize(height.value),
			textAlign: "left",
			position: "relative"
		}));
		const handleRetry = () => {
			retry();
			emit("error", null);
		};
		watch(loading, (newLoading) => {
			emit("loading", newLoading);
		}, { deep: true });
		watch(error, (newError) => {
			emit("error", newError);
		});
		watch(isReady, (ready) => {
			if (ready) emit("ready");
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref: "editorContainer",
				style: normalizeStyle(style.value)
			}, [!unref(isReady) && !unref(error) ? renderSlot(_ctx.$slots, "loading", {
				key: 0,
				loading: unref(loading),
				loadingText: __props.loadingText || unref(loading).loadingText,
				progress: unref(loading).progress,
				showProgress: __props.showProgress
			}, () => [__props.useDefaultLoading ? (openBlock(), createBlock(MonacoLoading_default, {
				key: 0,
				"loading-text": __props.loadingText || unref(loading).loadingText,
				progress: unref(loading).progress,
				"show-progress": __props.showProgress
			}, null, 8, [
				"loading-text",
				"progress",
				"show-progress"
			])) : createCommentVNode("", true)]) : unref(error) && __props.showErrorBoundary ? renderSlot(_ctx.$slots, "error", {
				key: 1,
				error: unref(error),
				retry: handleRetry,
				retryable: __props.retryable
			}, () => [__props.useDefaultErrorBoundary ? (openBlock(), createBlock(MonacoErrorBoundary_default, {
				key: 0,
				error: unref(error),
				"show-retry": __props.retryable,
				"show-details": true,
				"show-reload": false,
				"show-report": false,
				onRetry: handleRetry
			}, null, 8, ["error", "show-retry"])) : createCommentVNode("", true)]) : createCommentVNode("", true), createElementVNode("div", {
				ref_key: "container",
				ref: container,
				style: normalizeStyle({
					width: "100%",
					height: "100%",
					visibility: unref(isReady) && !unref(error) ? "visible" : "hidden"
				})
			}, null, 4)], 4);
		};
	}
});
//#endregion
//#region src/index.ts
var src_default = CodeEditor_default;
//#endregion
export { CodeEditor_default as CodeEditor, DiffEditor_default as DiffEditor, createDefaultOptions, deepMerge, src_default as default, formatSize, isSupportedLanguage, useCodeEditor, useCommonEditor, useDiffEditor, useEditorLifecycle, useEditorState, warnMsg };
