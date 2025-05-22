interface DashboardOptions {
    params: Array<string>,
    server?: string | undefined,
}

interface DashboardProps {
    params: Array<string>,
    size: "large" | "small",
    useURL: boolean,
    limits?: { param: string, min: number, max: number }[],
    server?: string,
}

export type { DashboardOptions, DashboardProps }
