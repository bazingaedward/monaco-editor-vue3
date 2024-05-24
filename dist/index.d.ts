import { App } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { DefineComponent } from 'vue';
import { PropType as PropType_2 } from 'vue';
import { PublicProps } from 'vue';

declare type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;

declare type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

declare type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: PropType_2<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: PropType_2<T[K]>;
        required: true;
    };
};

declare type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};

declare const _default: {
    install: (app: App) => void;
};
export default _default;

export declare const MonacoEditor: DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<MonacoEditorProps>, {
    diffEditor: boolean;
    width: string;
    height: string;
    language: string;
    theme: string;
    value: string;
    options: () => {};
}>, {}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    editorWillMount: (...args: any[]) => void;
    editorDidMount: (...args: any[]) => void;
    change: (...args: any[]) => void;
    "update:value": (...args: any[]) => void;
}, string, PublicProps, Readonly<globalThis.ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<MonacoEditorProps>, {
    diffEditor: boolean;
    width: string;
    height: string;
    language: string;
    theme: string;
    value: string;
    options: () => {};
}>>> & {
    onEditorWillMount?: ((...args: any[]) => any) | undefined;
    onEditorDidMount?: ((...args: any[]) => any) | undefined;
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:value"?: ((...args: any[]) => any) | undefined;
}, {
    value: string;
    language: string;
    theme: string;
    diffEditor: boolean;
    width: string | number;
    height: string | number;
    options: object;
}, {}>;

declare interface MonacoEditorProps {
    diffEditor?: boolean;
    width?: string | number;
    height?: string | number;
    original?: string;
    value?: string;
    theme?: string;
    language?: string;
    options?: object;
}

export { }
