export declare type TRunnable = () => void | Promise<void>;

export declare function createBootTask(name: string, runnable: TRunnable): void;

export interface IBootProcess {}

export declare function createBootProcess(): IBootProcess;
