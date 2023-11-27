interface AlarmProps {
    name: string,
    id: any,
    description: string,
    parameters: string[],
    rule: string,
    passingText?: string,
    failingText?: string,
    display?: string,
    disableFlash?: boolean,
    remove?: () => void,
    flashActive?: boolean,
    interval?: number,
    failOnNoData?: boolean,
}


interface AlarmOptions {
    params: Array<string>,
    server?: string | undefined,
};

interface AlarmListProps {
    alarms?: Array<AlarmProps>
    openExternal?: boolean
}

export type { AlarmProps, AlarmOptions, AlarmListProps }