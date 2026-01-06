export type TBootTask = {
    readonly name: string;
    readonly runnable: TRunnable;
    readonly deps: readonly TBootTaskDependence[];
};

export type TRunnable = () => void | Promise<void>;

export type TBootTaskDependence = {
    readonly on: TBootTask;
}

export type TBootTaskDependenciesList = readonly (TBootTask | TBootTaskDependence)[]

export declare function createBootTask(
    name: string,
    runnable: TRunnable,
    dependencies?: TBootTaskDependenciesList,
): TBootTask;

export type TBootProcessState = "idle" | "run" | "done";

export interface IBootProcess {
    readonly state: TBootProcessState;
    readonly count: number;

    add(task: TBootTask): IBootProcess;

    run(): Promise<void>;
}

export declare function createBootProcess(): IBootProcess;
