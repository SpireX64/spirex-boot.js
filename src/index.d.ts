export type TBootTask = {
    readonly name: string;
    readonly runnable: TRunnable;
};

export type TRunnable = () => void | Promise<void>;

export declare function createBootTask(
    name: string,
    runnable: TRunnable,
): TBootTask;

export interface IBootProcess {
    readonly count: number;
}

export declare function createBootProcess(): IBootProcess;
