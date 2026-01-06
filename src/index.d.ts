export type TBootTask = {
    readonly name: string;
    readonly run: TRunnable;
    readonly optional: boolean;
    readonly deps: readonly TBootTaskDependence[];
};

export type TRunnable = () => void | Promise<void>;

export type TBootTaskDependence = {
    readonly on: TBootTask;
    readonly weak?: boolean;
};

export type TBootTaskDependenciesList = readonly (
    | TBootTask
    | TBootTaskDependence
)[];

export type TBootTaskOptions = {
    deps?: TBootTaskDependenciesList;
    optional?: boolean;
};

export declare function createBootTask(
    name: string,
    runnable: TRunnable,
    dependencies?: TBootTaskDependenciesList,
): TBootTask;

export declare function createBootTask(
    name: string,
    runnable: TRunnable,
    options: TBootTaskOptions,
): TBootTask;

export type TBootProcessState = "idle" | "run" | "done";

export interface IBootProcess {
    readonly state: TBootProcessState;
    readonly count: number;

    add(task: TBootTask): IBootProcess;

    run(): Promise<void>;
}

export declare function createBootProcess(): IBootProcess;
