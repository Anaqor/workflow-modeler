/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "@bpmn-io/properties-panel/preact/compat";

let ModelUtil = require('bpmn-js/lib/util/ModelUtil');
import {TextFieldEntry, isTextFieldEntryEdited, TextAreaEntry, SelectEntry} from '@bpmn-io/properties-panel';
import * as consts from '../../quantme/Constants';
import {useService} from 'bpmn-js-properties-panel';
import {useState} from "@bpmn-io/properties-panel/preact/hooks";

export function AlgorithmEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.algorithm;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            algorithm: newValue
        });
    };

    return <TextFieldEntry
        id={consts.ALGORITHM}
        element={element}
        label={translate('Algorithm')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function ProviderEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.provider;
    }

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            provider: newValue
        });
    }

    return <TextFieldEntry
        id={consts.PROVIDER}
        element={element}
        label={translate('Provider')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function QuantumCircuitEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.quantumCircuit;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            quantumCircuit: newValue
        });
    };

    return <TextFieldEntry
        id={consts.QUANTUM_CIRCUIT}
        element={element}
        label={translate('Quantum Circuit')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function UrlEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.url;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            url: newValue
        });
    };

    return <TextFieldEntry
        id={consts.URL}
        label={translate('URL')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function EncodingSchemaEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.encodingSchema;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            encodingSchema: newValue
        });
    };

    return <TextFieldEntry
        id={consts.ENCODING_SCHEMA}
        label={translate('Encoding Schema')}
        modelProperty={consts.ENCODING_SCHEMA}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function ProgrammingLanguageEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.programmingLanguage;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            programmingLanguage: newValue
        });
    };

    return <TextFieldEntry
        id={consts.PROGRAMMING_LANGUAGE}
        label={translate('Programming Language')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function OracleIdEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.oracleId;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            oracleId: newValue
        });
    };

    return <TextFieldEntry
        id={consts.ORACLE_ID}
        label={translate('Oracle Id')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function OracleCircuitEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.oracleCircuit;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            oracleCircuit: newValue
        });
    };

    return <TextFieldEntry
        id={consts.ORACLE_CIRCUIT}
        label={translate('Oracle Circuit')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function OracleURLEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.oracleURL;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            oracleURL: newValue
        });
    };

    return <TextFieldEntry
        id={consts.ORACLE_URL}
        label={translate('Oracle URL')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function QpuEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.qpu;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            qpu: newValue
        });
    };

    return <TextFieldEntry
        id={consts.QPU}
        label={translate('QPU')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function ShotsEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.shots;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            shots: newValue
        });
    };

    const validate = function (values) {
        return values && isNaN(values) ? translate('Shots attribute must contain an Integer!') : '';
    };

    return <TextFieldEntry
        id={consts.SHOTS}
        label={translate('Shots')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
        validate={validate}
    />;
}

export function MaxAgeEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.maxAge;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            maxAge: newValue
        });
    };

    return <TextFieldEntry
        id={consts.MAX_AGE}
        label={translate('Max Age (in minutes)')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function ProvidersEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.providers;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            providers: newValue
        });
    };

    return <TextFieldEntry
        id={consts.PROVIDERS}
        label={translate('Providers for the Selection')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function SimulatorsAllowedEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.simulatorsAllowed;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            simulatorsAllowed: newValue
        });
    };

    return <TextFieldEntry
        id={consts.SIMULATORS_ALLOWED}
        label={translate('Simulators Allowed (true/false)')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function SelectionStrategyEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.selectionStrategy;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            selectionStrategy: newValue
        });
    };

    return <TextFieldEntry
        id={consts.SELECTION_STRATEGY}
        label={translate('Selection Strategy')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />;
}

export function CalibrationMethodEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.calibrationMethod;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            calibrationMethod: newValue
        });
    };

    const selectOptions = [
        { value: 'fullMatrix', label: 'Full Matrix' },
        { value: 'tpnm', label: 'TPNM'},
        { value: 'ctmp', label: 'CTMP' },
        { value: 'ddot', label: 'DDOT' },
        { value: 'conditionallyRigorous', label: 'Conditionally Rigorous' },
        { value: 'fuzzyCMeans', label: 'Fuzzy C-Means' },
        { value: 'cumulantCM', label: 'Cumulant CM' },
        { value: 'sclableTMatrix', label: 'Sclable T-Matrix' }
    ];

    const getOptions = function (element) {
        return selectOptions;
    }

    return <SelectEntry
        id={consts.CALIBRATION_METHOD}
        label={translate('Calibration Matrix Generation Method')}
        getValue={getValue}
        setValue={setValue}
        getOptions={getOptions}
        debounce={debounce}
    />;
}

export function MitigationMethodEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.mitigationMethod;
    };

    const setValue = function (newValue) {

        const bo = element.businessObject;
        const isCM = (newValue === 'matrixInversion' || newValue === 'pertubativeREM' || newValue === 'geneticBasedREM' || newValue === 'mthree');

        // remove CM value if non CM method is selected
        if (!isCM) {
            return modeling.updateProperties(element, {
                mitigationMethod: newValue,
                calibrationMethod: undefined
            });
        } // set default CM value if CM method is selected and non CM method was selected previously
        else if (isCM && !bo.calibrationMethod) {
            return modeling.updateProperties(element, {
                mitigationMethod: newValue,
                calibrationMethod: 'fullMatrix'
            });
        }
        return modeling.updateProperties(element, {
            mitigationMethod: newValue,
        });
    };

    const selectOptions = [
        { value: 'matrixInversion', label: 'Matrix Inversion' },
        { value: 'pertubativeREM', label: 'Pertubative REM' },
        { value: 'mthree', label: 'Mthree' },
        { value: 'geneticBasedREM', label: 'Genetic-Based REM' },
        { value: 'activeREM', label: 'Active REM' },
        { value: 'modelFreeREM', label: 'Model-Free REM' },
        { value: 'hybridREM', label: 'Hybrid REM' },
        { value: 'crosstalkREM', label: 'Crosstalk-Focused REM' },
        { value: 'sim', label: 'SIM' },
        { value: 'aim', label: 'AIM' },
        { value: 'bfa', label: 'BFA' },
        { value: 'truncatedNeumannSeries', label: 'Truncated Neumann Series' },
        { value: 'lsu', label: 'LSU' },
        { value: 'dnnREM', label: 'DNN-Based REM' }
    ];

    const getOptions = function (element) {
        return selectOptions;
    };

    return <SelectEntry
        id={consts.MITIGATION_METHOD}
        label={translate('Mitigation Method')}
        getValue={getValue}
        setValue={setValue}
        getOptions={getOptions}
        debounce={debounce}
    />;
}

export function DNNHiddenLayersEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.dnnHiddenLayer;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            dnnHiddenLayer: newValue
        });
    };

    const hidden = function () {
        let mitigationMethod = element.businessObject.mitigationMethod;
        console.log('MitigationMethode is now ' + mitigationMethod + ', so this entry has now hide = ' + !(mitigationMethod === 'dnnREM'));
        return !(mitigationMethod === 'dnnREM');
    }

    return <HiddenTextFieldEntry
        id={consts.DNN_HIDDEN_LAYER}
        label={translate('Number of DNN Hidden Layers')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
        hidden={hidden}
    />;
}

export function NeighborhoodRangeEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');


    const getValue = function () {
        return element.businessObject.neighborhoodRange;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            neighborhoodRange: newValue
        });
    };

    const validate = function (newValue) {
        return newValue && isNaN(newValue) ? translate('Shots attribute must contain an Integer!') : '';
    };

    const hidden = function () {
        let calibrationMethod = element.businessObject.calibrationMethod;
        return !(calibrationMethod === 'sclableTMatrix');
    };

    return <HiddenTextFieldEntry
        id={consts.NEIGHBORHOOD_RANGE}
        label={translate('Neighborhood Range')}
        modelProperty={consts.NEIGHBORHOOD_RANGE}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
        validate={validate}
        hidden={hidden}
    />;
}

export function ObjectiveFunctionEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.objectiveFunction;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            objectiveFunction: newValue
        });
    };

    const hidden = function () {
        let mitigationMethod = element.businessObject.mitigationMethod;
        return !(mitigationMethod === 'geneticBasedREM');
    };

    return <HiddenTextFieldEntry
        id={consts.OBJECTIVE_FUNCTION}
        label={translate('Objective Function')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
        hidden={hidden}
    />;
}

export function OptimizerEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.optimizer;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            optimizer: newValue
        });
    };

    const hidden = function (mitigationMethod) {
        const hide = !(mitigationMethod === 'geneticBasedREM');
        console.log('Should hide OptimizerEntry: ' + hide);
        return hide;
    };

    return <HiddenTextFieldEntry
        id={consts.OPTIMIZER}
        label={translate('Optimizer')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
        hidden={hidden}
    />;
}

export function MaxREMCostsEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const [hide, setHide] = useState(false);

    const getValue = function () {
        return element.businessObject.maxREMCosts;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            maxREMCosts: newValue
        });
    };

    const validate = function (newValue) {
        return newValue && isNaN(newValue) ? translate('Max REM Costs attribute must contain an Integer!') : '';
    };

    return <TextFieldEntry
        id={consts.MAX_REM_COSTS}
        label={translate('Max REM Costs (in $)')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
        validate={validate}
    />;
}

export function MaxCMSizeEntry({element}) {

    const modeling = useService('modeling');
    const translate = useService('translate') || function (str) {
        return str
    };
    const debounce = useService('debounceInput');

    const getValue = function () {
        return element.businessObject.maxCMSize;
    };

    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            maxCMSize: newValue
        });
    };

    const validate = function (newValue) {
        return newValue && isNaN(newValue) ? translate('Max CM Size attribute must contain an Integer!') : '';
    };

    const hidden = function () {
        let mitigationMethod = element.businessObject.mitigationMethod;
        return !(mitigationMethod === 'matrixInversion' || mitigationMethod === 'pertubativeREM' || mitigationMethod === 'geneticBasedREM' || mitigationMethod === 'mthree');
    };

    return <HiddenTextFieldEntry
        id={consts.MAX_CM_SIZE}
        label={translate('Max CM Size (in MB)')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
        validate={validate}
        hidden={hidden}
    />;
}

function HiddenTextFieldEntry({id, element, label, getValue, setValue, debounce, hidden}) {

    return <>
        {!hidden() && (<TextFieldEntry
            id={id}
            element={element}
            label={label}
            getValue={getValue}
            setValue={setValue}
            debounce={debounce}
        />)}
    </>;
}
