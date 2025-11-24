import { Compiler } from 'webpack';

declare class UIDebuggerWebpackPlugin {
    apply(compiler: Compiler): void;
}

export { UIDebuggerWebpackPlugin };
