interface CountDownTimerConfig {
    type: 'countdown';
    name: string;
    initialTime: number;
    alarmBelow?: number;
    warnBelow?: number;
}

interface CountUpTimerConfig {
    type: 'countup';
    name: string;
    initialTime: number;
}

type TimerConfig = CountDownTimerConfig | CountUpTimerConfig;

    
export type { TimerConfig }