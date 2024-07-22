interface CountDownTimerConfig {
    type: 'countdown';
    name: string;
    initialTime: number;
    alarmBelow?: number;
    warnBelow?: number;
    id: string;
}

interface CountUpTimerConfig {
    type: 'countup';
    name: string;
    initialTime: number;
    id: string;
}

type TimerConfig = CountDownTimerConfig | CountUpTimerConfig;

    
export type { TimerConfig }