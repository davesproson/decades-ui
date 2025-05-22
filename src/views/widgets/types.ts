
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
    configComponent: React.ReactElement,
    save: (props: ConfigWidgetProps) => boolean,
    icon: string,
    tooltip: string,
    component: React.JSXElementConstructor<any>
}

export type RegistryType<T extends { type: string }> = {
    registered: T[],
    register: (widget: T) => void
    getWidget: (type: string) => T
}

export interface PluginType {
    [key: string]: React.JSXElementConstructor<any>
}
