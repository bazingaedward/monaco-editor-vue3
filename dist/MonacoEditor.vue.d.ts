declare const _default: import("vue").DefineComponent<{
    diffEditor: {
        type: BooleanConstructor;
        default: boolean;
    };
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    original: StringConstructor;
    value: StringConstructor;
    language: {
        type: StringConstructor;
        default: string;
    };
    theme: {
        type: StringConstructor;
        default: string;
    };
    options: {
        type: ObjectConstructor;
        default(): {};
    };
}, {
    style: import("vue").ComputedRef<{
        width: string | number;
        height: string | number;
        'text-align': string;
    }>;
}, any, {}, {
    initMonaco(): void;
    _setModel(value: any, original: any): void;
    _setValue(value: any): any;
    _getValue(): any;
    _getEditor(): any;
    _setOriginal(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("change" | "editorWillMount" | "editorDidMount" | "update:value")[], "change" | "editorWillMount" | "editorDidMount" | "update:value", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    diffEditor: {
        type: BooleanConstructor;
        default: boolean;
    };
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    original: StringConstructor;
    value: StringConstructor;
    language: {
        type: StringConstructor;
        default: string;
    };
    theme: {
        type: StringConstructor;
        default: string;
    };
    options: {
        type: ObjectConstructor;
        default(): {};
    };
}>> & {
    onChange?: ((...args: any[]) => any) | undefined;
    onEditorWillMount?: ((...args: any[]) => any) | undefined;
    onEditorDidMount?: ((...args: any[]) => any) | undefined;
    "onUpdate:value"?: ((...args: any[]) => any) | undefined;
}, {
    height: string | number;
    width: string | number;
    options: Record<string, any>;
    language: string;
    theme: string;
    diffEditor: boolean;
}>;
export default _default;
