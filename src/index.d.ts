export type TBootTask = {
    readonly name: string;
    readonly runnable: TRunnable;
};

export type TRunnable = () => void | Promise<void>;

export declare function createBootTask(
    name: string,
    runnable: TRunnable,
): TBootTask;

export type TBootProcessState = "idle" | "run" | "done";

export interface IBootProcess {
    readonly state: TBootProcessState;
    readonly count: number;

    add(task: TBootTask): IBootProcess;

    run(): Promise<void>;
}

export declare function createBootProcess(): IBootProcess;
