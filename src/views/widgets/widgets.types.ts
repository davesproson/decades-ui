// A Generic interface for the config handle
export interface ConfigHandle<T> {
    getData: () => T
}

export interface ConfigWidgetProps {
    visible: boolean,
    split: (rows: number, cols: number, rowPc: number[], colPc: number[]) => void,
    hide: () => void,
    top: boolean,
    setData: (data: any) => void
}

export interface WidgetConfiguration {
    name: string,
    type: string,
    widget: React.ReactElement,
    save: (props: ConfigWidgetProps) => void,
    icon: string,
}

export type RegistryType<T extends {name: string}> = {
    registered: T[],
    register: (widget: T) => void
}

export interface PluginType  {
    [key: string]: React.JSXElementConstructor<any>
}
