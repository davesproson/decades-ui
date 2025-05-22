import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ParameterID = string | number;

// Internal representation of a parameter
interface Parameter {
    id: ParameterID,
    name: string,
    raw: string,
    units: string,
    selected: boolean,
    status: boolean | null,
    axisId: number | null
};

// Decades API representation of a parameter
interface DecadesParameter {
    ParameterIdentifier: number | string,
    ParameterName: string,
    DisplayText: string,
    DisplayUnits: string,
    available: boolean | null
};

// Internal representation of an axis
interface Axis {
    id: number,
    units: string,
    scaling: {
        auto: boolean,
        min: string,
        max: string
    }
};

// Shape of the state of the parameters slice
type ParamsState = {
    params: Parameter[],
    axes: Axis[],
    paramSet: string,
    paramsDispatched: boolean
}


/**
 * Generates a new axis with a unique ID and specified units.
 * 
 * @param units - The units for the new axis.
 * @param axes - An array of existing axes.
 * @returns A new axis object with a unique ID, specified units, and default scaling.
 */
const getNewAxis = (units: string, axes: Array<Axis>): Axis => {
    for (let i = 1; i < axes.length + 1; i++) {
        if (!axes.find(axis => axis.id === i)) {
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

/**
 * Converts a DecadesParameter object to a Parameter object.
 *
 * @param param - The DecadesParameter object to convert.
 * @returns A new Parameter object with properties mapped from the DecadesParameter.
 */
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

/**
 * Manages the association of a parameter with an axis in the state.
 * 
 * If the parameter is selected, it assigns an existing axis with matching units
 * or creates a new axis if none exists. If the parameter is not selected, it
 * removes the association and deletes the axis if no other parameters are using it.
 * 
 * @param param - The parameter to manage.
 * @param state - The current state containing parameters and axes.
 */
const manageAxis = (param: Parameter, state: ParamsState) => {
    if (param.selected) {
        const pAxis = state.axes.find(axis => axis.units === param.units)
        if (!pAxis) {
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
        if (nParamsOnAxis === 0) {
            const axisIndex = state.axes.findIndex(axis => axis.id === axisId);
            state.axes.splice(axisIndex, 1);
        }
    }
    const usedAxes = [...new Set(
        state.params.filter(param => param.selected).map(param => param.axisId)
    )];

    state.axes = state.axes.filter(axis => usedAxes.includes(axis.id));
}

// Slice for managing parameters and axes
export const paramSlice = createSlice({

    name: 'params',
    initialState: {
        params: [],
        axes: [],
        paramSet: '',
        paramsDispatched: false
    } as ParamsState,
    reducers: {
        // Set the dispatched status of the parameters
        setParamsDispatched: (state, action: PayloadAction<boolean>) => {
            state.paramsDispatched = action.payload;
        },

        // Set the parameter set
        setParamSet: (state, action: PayloadAction<string>) => {
            state.paramSet = action.payload;
        },

        // Add a parameter to the state
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

        // Set the parameters in the state
        setParams: (state, action: PayloadAction<Array<DecadesParameter>>) => {
            let params = action.payload;
            if (!(params instanceof Array)) {
                console.error("Expected array of parameters");
                params = []
            }
            state.params = new Array();
            for (const param of params) {
                const paramToAdd = paramFromDecadesParam(param)
                state.params.push(paramToAdd);
            }
        },

        // Set the status of a parameter. Status is used to indicate if a parameter is available.
        setParamStatus: (state, action: PayloadAction<Parameter>) => {
            const param = state.params.find(param => param.id === action.payload.id);
            if (param) {
                param.status = action.payload.status;
            }
        },

        // Toggle the selected status of a parameter
        toggleParamSelected: (state, action: PayloadAction<{ id: ParameterID }>) => {
            const param = state.params.find(param => param.id === action.payload.id);
            if (param) {
                param.selected = !param.selected;
                manageAxis(param, state);
            }
        },

        // Unselect all parameters and clear axes
        unselectAllParams: (state) => {
            state.params.forEach(param => param.selected = false);
            state.axes = []
        },

        // Select parameters by their raw names. The raw name is the name used in the Decades API.
        selectParamsByRawName: (state, action: PayloadAction<Array<string>>) => {
            state.params.forEach(param => param.selected = false);
            state.axes = []
            const rawNames = action.payload
            state.params.forEach(param => {
                if (rawNames.includes(param.raw) && param.status) {
                    param.selected = true;
                }
                manageAxis(param, state);
            });
        },

        // Add a new axis to the state, and assign it to a parameter
        addNewAxis: (state, action: PayloadAction<{ paramId: ParameterID }>) => {
            const paramId = action.payload.paramId;
            const param = state.params.find(param => param.id === paramId);
            if (!param) {
                console.error(`Could not find param with id ${paramId}`);
                return;
            }
            const nParamsWithUnit = state.params.filter(
                p => p.selected && p.units === param.units
            ).length;

            if (nParamsWithUnit === 1) return
            const newAxis = getNewAxis(param.units, state.axes);
            state.axes.push(newAxis);
            param.axisId = newAxis.id;
        },

        // Select an axis for a parameter
        selectAxis: (state, action: PayloadAction<{ axisId: number, paramId: ParameterID }>) => {
            const paramId = action.payload.paramId;
            const axisId = action.payload.axisId;
            const param = state.params.find(param => param.id === paramId);
            if (!param) {
                console.error(`Could not find param with id ${paramId}`);
                return;
            }
            param.axisId = axisId;

            const usedAxes = [...new Set(
                state.params.filter(param => param.selected).map(param => param.axisId)
            )];

            state.axes = state.axes.filter(axis => usedAxes.includes(axis.id));
        },

        // Set the scaling of an axis
        setAxisScaling: (state, action) => {
            const axisId = action.payload.axisId;
            const scaling = action.payload.scaling;
            const axis = state.axes.find(axis => axis.id === axisId);
            if (!axis) {
                console.error(`Could not find axis with id ${axisId}`);
                return;
            }
            axis.scaling = scaling;
        },

        // Reset the status of all parameters to null (unknown)
        resetParameterStatuses: (state) => {
            state.params.forEach(param => param.status = null);
        }
    },
});


export const {
    addParam, setParams, toggleParamSelected, unselectAllParams, addNewAxis,
    selectAxis, setParamStatus, setParamSet, setParamsDispatched, setAxisScaling,
    selectParamsByRawName, resetParameterStatuses
} = paramSlice.actions;

export default paramSlice.reducer;

export type { ParamsState, DecadesParameter, Parameter, Axis }

export const testFunctions = {
    paramFromDecadesParam
}