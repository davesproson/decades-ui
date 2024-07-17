// Required physical constants
export const MA = 300,
    KELV = 273.15,
    K = 0.286,
    L = 2.5e6,
    RV = 461,
    RD = 287,
    CP = 1.01e3

// Parameters for isotherm lines
export const dIsoTherm = 10,
    isoThermMin = -80.0, //in °C 
    isoThermMax = 60.0; //in °C 

// Parameters for potential temperature lines
export const dTheta = 10,
    thetaMin = -20,
    thetaMax = 90;

// Parameters for pressure lines
export const dPress = 50,
    pressMin = 200,
    pressMax = 1100;

// Parameters for saturated adiabats
export const dSALR = 2.0,
    SALRMin = -40, //°C
    SALRMax = 60; //°C