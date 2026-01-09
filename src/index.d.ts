export declare type TRunnable = () => void | Promise<void>;

export type TBootTaskState = "idle" | "run" | "done";

export type TBootTask = {
    readonly name: string;
    readonly optional: boolean;
    readonly run: TRunnable;
};

export type TBootTaskOptions = {
    optional?: boolean;
};

export declare function createBootTask(
    name: string,
    runnable: TRunnable,
    options?: TBootTaskOptions,
): TBootTask;

export type TBootProcessState = "idle" | "run" | "done";

export interface IBootProcess {
    readonly count: number;
    readonly state: TBootProcessState;

    getTaskState(task: TBootTask): TBootTaskState | undefined;

    add(task: TBootTask): IBootProcess;

    run(): Promise<void>;
}

export declare function createBootProcess(): IBootProcess;
