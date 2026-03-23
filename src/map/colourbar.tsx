import { When } from "@/components/flow"
import { badData } from "@/settings"
import { colourMaps } from "@/utils"
import { useState } from "react"

const colors = (cMap: number[][]) => new Array(256).fill(0).map((_, i) => {
    const xd = i / 255.0
    const [r, g, b] = colourMaps.interpolate(cMap, xd)
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
})


const selectorStyle = (cMap: number[][]) => {
    const sty: React.CSSProperties = {
        color: 'black',
        background: `linear-gradient(to top, ${colors(cMap || colourMaps.maps.viridis).filter((_, i) => i % 8 == 0).join(', ')})`,
        padding: '2px 4px',
        borderRadius: '4px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        height: '50px',
        width: '50px',
        zIndex: 1000,
        marginLeft: "5px"
    };
    return sty;
};


const ExpandedColorSelector = ({ onChangeColorMap, closeSelector }: { onChangeColorMap: (colorMap: string) => void, closeSelector: () => void }) => {
    return (
        <div className="z-[1000] relative flex flex-row-reverse my-2.5">
            {Object.entries(colourMaps.maps).map(([key, value]) => (
                <button key={key} style={selectorStyle(value)} onClick={() => {
                    onChangeColorMap(key)
                    closeSelector()
                }} />
            ))}
        </div>
    )
}

const CollapsedColorSelector = ({ cm, onClick }: { cm: string, onClick: () => void }) => {
    return (
        <div className="z-[1000] relative flex flex-row-reverse my-2.5">
            <button
                style={selectorStyle(colourMaps.maps[cm])}
                onClick={onClick}
            />
        </div>
    )
}

const ColorBarLabel = ({ value }: { value: number }) => {
    const labelStyle: React.CSSProperties = {
        color: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: '2px 4px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: 'bold',
        margin: '2px',
    }

    return <span style={labelStyle}>{value.toFixed(2)}</span>;
}

const ColorBarContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: '25px',
            right: "25px",
            height: '50%',
        }}>{children}</div>
    );
}

const ColorBarGradient = ({ children, colorData }: { children: React.ReactNode, colorData: number[][] }) => {
    return (
        <div className="flex flex-row-reverse h-full">
            <div style={{
                background: `linear-gradient(to top, ${colors(colorData).filter((_, i) => i % 8 == 0).join(', ')})`,
                height: '100%',
                width: '50px',
                zIndex: 1000,
                position: 'relative',
                borderRadius: '4px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                {children}
            </div>
        </div>
    );
}

type ColourBarProps = {
    data: Array<number>
    onChangeColorMap: (colorMap: string) => void
    colorMap: string
}

const ColourBar = ({ data, colorMap, onChangeColorMap }: ColourBarProps) => {
    const [selectorOpen, setSelectorOpen] = useState(false);
    let fData = data.filter(d => d !== badData);
    if (fData.length === 0) return null;
    const dataMean = fData.reduce((a, b) => a + b, 0) / fData.length;
    const dataMin = Math.min(...fData);
    const dataMax = Math.max(...fData);
    const data25th = (dataMin + dataMean) / 2;
    const data75th = (dataMax + dataMean) / 2;

    const colorData = colourMaps.maps[colorMap] || colourMaps.maps.viridis;

    return (
        <ColorBarContainer>
            <ColorBarGradient colorData={colorData}>
                <ColorBarLabel value={dataMax} />
                <ColorBarLabel value={data75th} />
                <ColorBarLabel value={dataMean} />
                <ColorBarLabel value={data25th} />
                <ColorBarLabel value={dataMin} />
            </ColorBarGradient>
            <When condition={selectorOpen}>
                <ExpandedColorSelector onChangeColorMap={onChangeColorMap} closeSelector={() => setSelectorOpen(false)} />
            </When>
            <When condition={!selectorOpen}>
                <CollapsedColorSelector cm={colorMap} onClick={() => setSelectorOpen(true)} />
            </When>
        </ColorBarContainer>
    )
};

export default ColourBar;