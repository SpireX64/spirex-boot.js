export declare type TRunnable = () => void | Promise<void>;

export declare function createBootTask(name: string, runnable: TRunnable): void;
