export declare type TRunnable = () => void | Promise<void>;

export type TBootTask = {
    readonly name;
    readonly run: TRunnable;
};

export declare function createBootTask(
    name: string,
    runnable: TRunnable,
): TBootTask;

export interface IBootProcess {
    readonly count: number;

    add(task: TBootTask): IBootProcess;
}

export declare function createBootProcess(): IBootProcess;
