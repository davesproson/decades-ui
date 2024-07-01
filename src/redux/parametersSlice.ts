import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ParameterID = string | number;

interface Parameter {
    id: ParameterID,
    name: string,
    raw: string,
    units: string,
    selected: boolean,
    status: boolean | null,
    axisId: number | null
};

interface DecadesParameter {
    ParameterIdentifier: number | string,
    ParameterName: string,
    DisplayText: string,
    DisplayUnits: string,
    available: boolean | null
};


interface Axis {
    id: number,
    units: string,
    scaling: {
        auto: boolean,
        min: string,
        max: string
    }
};

type ParamsState = {
    params: Parameter[],
    axes: Axis[],
    paramSet: string,
    paramsDispatched: boolean
}

const getNewAxis = (units: string, axes: Array<Axis>): Axis => {
    for(let i=1; i<axes.length+1; i++) {
        if(!axes.find(axis => axis.id === i)) {
            return {
                id: i,
                units: units,
                scaling: {
                    auto: true,
                    min: "",
                    max: ""
                }
            }
        }
    }
    const id = axes.length + 1;
    return {
        id: id,
        units: units,
        scaling: {
            auto: true,
            min: "",
            max: ""
        }
    }
}

const paramFromDecadesParam = (param: DecadesParameter): Parameter => {
    return {
        id: param.ParameterIdentifier,
        raw: param.ParameterName,
        name: param.DisplayText,
        units: param.DisplayUnits,
        selected: false,
        axisId: null,
        status: param.available
    }
}

export const paramSlice = createSlice({

	name: 'params',
	initialState: {
        params: [],
        axes: [],
        paramSet: '',
        paramsDispatched: false
    } as ParamsState,
	reducers: {
        setParamsDispatched: (state, action: PayloadAction<boolean>) => {
            state.paramsDispatched = action.payload;
        },
        setParamSet: (state, action: PayloadAction<string>) => {
            state.paramSet = action.payload;
        },
		addParam: (state, action: PayloadAction<Parameter>) => {
			const param = {
				id: action.payload.id.toString(),
				name: action.payload.name,
                raw: action.payload.raw,
                units: action.payload.units,
				selected: false,
                status: null
			} as Parameter;
			state.params.push(param);
		},
        setParams: (state, action: PayloadAction<Array<DecadesParameter>>) => {
            const params = action.payload;
            state.params = new Array();
            for(const param of params) {
                const paramToAdd = paramFromDecadesParam(param)
                state.params.push(paramToAdd);
            }
        },
        setParamStatus: (state, action: PayloadAction<Parameter>) => {
            const param = state.params.find(param => param.id === action.payload.id);
            if (param) {
                param.status = action.payload.status;
            }
        },
        toggleParamSelected: (state, action: PayloadAction<{name: string}>) => {

            const param = state.params.find(param => param.raw === action.payload.name);

            if (param !== undefined) {
                param.selected = !param.selected;
                if(param.selected) {
                    const pAxis = state.axes.find(axis => axis.units === param.units)
                    if(!pAxis) {
                        const newAxis = getNewAxis(
                            param.units, state.axes
                        );
                        state.axes.push(newAxis);
                        param.axisId = newAxis.id;
                    } else {
                        param.axisId = pAxis.id;
                    }
                } else {
                    const axisId = param.axisId;
                    param.axisId = null;
                    const nParamsOnAxis = state.params.filter(param => param.axisId === axisId).length;
                    if(nParamsOnAxis === 0) {
                        const axisIndex = state.axes.findIndex(axis => axis.id === axisId);
                        state.axes.splice(axisIndex, 1);
                    }
                }
                const usedAxes = [...new Set(
                    state.params.filter(param => param.selected).map(param => param.axisId)
                )];
    
                state.axes = state.axes.filter(axis => usedAxes.includes(axis.id));
            }
        },
        unselectAllParams: (state) => {
            state.params.forEach(param => param.selected = false);
            state.axes = []
        },
        addNewAxis: (state, action: PayloadAction<{paramId: ParameterID}>) => {
            const paramId = action.payload.paramId;
            const param = state.params.find(param => param.id === paramId);
            if(!param) {
                console.error(`Could not find param with id ${paramId}`);
                return;
            }
            const nParamsWithUnit = state.params.filter(
                p => p.selected && p.units === param.units
            ).length;

            if(nParamsWithUnit === 1) return
            const newAxis = getNewAxis(param.units, state.axes);
            state.axes.push(newAxis);
            param.axisId = newAxis.id;
        },
        selectAxis: (state, action: PayloadAction<{axisId: number, paramId: ParameterID}>) => {
            const paramId = action.payload.paramId;
            const axisId = action.payload.axisId;
            const param = state.params.find(param => param.id === paramId);
            if(!param) {
                console.error(`Could not find param with id ${paramId}`);
                return;
            }
            param.axisId = axisId;

            const usedAxes = [...new Set(
                state.params.filter(param => param.selected).map(param => param.axisId)
            )];

            state.axes = state.axes.filter(axis => usedAxes.includes(axis.id));
        },
        setAxisScaling: (state, action) => {
            const axisId = action.payload.axisId;
            const scaling = action.payload.scaling;
            const axis = state.axes.find(axis => axis.id === axisId);
            if(!axis) {
                console.error(`Could not find axis with id ${axisId}`);
                return;
            }
            axis.scaling = scaling;
        }
	},
});


export const { 
    addParam, setParams, toggleParamSelected, unselectAllParams, addNewAxis,
    selectAxis, setParamStatus, setParamSet, setParamsDispatched, setAxisScaling
} = paramSlice.actions;

export default paramSlice.reducer;

export type { ParamsState, DecadesParameter, Parameter, Axis }