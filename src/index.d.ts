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

    add(task: TBootTask): IBootProcess
}

export declare function createBootProcess(): IBootProcess;
