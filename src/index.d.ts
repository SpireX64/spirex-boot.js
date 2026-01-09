export declare type TRunnable = () => void | Promise<void>;

export type TBootTaskState = "idle" | "run" | "done";

export type TBootTaskDependence = {
    readonly on: TBootTask;
    readonly weak?: boolean;
};

export type TBootTask = {
    readonly name: string;
    readonly optional: boolean;
    readonly deps: readonly TBootTaskDependence[];
    readonly run: TRunnable;
};

export type TBootTaskOptions = {
    optional?: boolean;
    deps?: readonly (TBootTask | TBootTaskDependence)[];
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
