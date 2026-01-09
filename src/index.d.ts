export declare type TRunnable = () => void | Promise<void>;

export type TBootTask = {
    readonly name: string;
    readonly run: TRunnable;
};

export declare function createBootTask(
    name: string,
    runnable: TRunnable,
): TBootTask;

export type TBootProcessState = 'idle' | 'run' | 'done';

export interface IBootProcess {
    readonly count: number;
    readonly state: TBootProcessState;

    add(task: TBootTask): IBootProcess;

    run(): Promise<void>;
}

export declare function createBootProcess(): IBootProcess;
