import QuantMEExtensionModule from "./modeling";
import React from "react";
import AdaptationPlugin from "./ui/adaptation/AdaptationPlugin";
import QuantMEController from "./ui/control/QuantMEController";
import DeploymentPlugin from "./ui/deployment/services/DeploymentPlugin";
import ExtensibleButton from "../../editor/ui/ExtensibleButton";
import BPMNConfigTab from "./configTabs/BPMNConfigTab";
import OpenToscaTab from "./configTabs/OpenToscaTab";
import NisqAnalyzerTab from "./configTabs/NisqAnalyzerTab";
import QrmDataTab from "./configTabs/QrmDataTab";
import HybridRuntimeTab from "./configTabs/HybridRuntimeTab";
import NotificationHandler from "../../editor/ui/notifications/NotificationHandler";
import {getQRMs} from "./qrm-manager";
import {startReplacementProcess} from "./replacement/QuantMETransformator";
import {loadDiagram} from "../../common/util/IoUtilities";
import {getModeler} from "../../editor/ModelerHandler";
import * as camundaConfig from "../../editor/config/EditorConfigManager";
import * as config from "./framework-config/config-manager";

let quantMEModdleExtension = require('./resources/quantum4bpmn.json')

export default {
    buttons: [<ExtensibleButton subButtons={[<AdaptationPlugin/>, <QuantMEController/>, <DeploymentPlugin/>]} title="QuantME" styleClass="quantme-logo"/>],
    configTabs: [
        {
            tabId: 'OpenTOSCAEndpointTab',
            tabTitle: 'OpenTOSCA',
            configTab: OpenToscaTab,
        },
        {
            tabId: 'BPMNTab',
            tabTitle: 'Workflow',
            configTab: BPMNConfigTab,
        },
        {
            tabId: 'NISQAnalyzerEndpointTab',
            tabTitle: 'NISQ Analyzer',
            configTab: NisqAnalyzerTab,
        },
        {
            tabId: 'QRMDataTab',
            tabTitle: 'QRM Data',
            configTab: QrmDataTab,
        },
        {
            tabId: 'HybridRuntimesTab',
            tabTitle: 'Hybrid Runtimes',
            configTab: HybridRuntimeTab,
        }],
    name: 'quantme',
    extensionModule: QuantMEExtensionModule,
    moddleDescription: quantMEModdleExtension,
    transformExtension: async () => {
        NotificationHandler.getInstance().displayNotification({
            type: 'info',
            title: 'Workflow Transformation Started!',
            content: 'Successfully started transformation process for the current workflow!',
            duration: 7000
        });
        const modeler = getModeler();

        let xml = await modeler.get('bpmnjs').saveXML();
        let currentQRMs = getQRMs();
        let result = await startReplacementProcess(xml.xml, currentQRMs,
            {
                nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
                transformationFrameworkEndpoint: config.getTransformationFrameworkEndpoint(),
                camundaEndpoint: camundaConfig.getCamundaEndpoint()
            });

        if (result.status === 'transformed') {
            await loadDiagram(result.xml, modeler);
        } else {
            NotificationHandler.getInstance().displayNotification({
                type: 'warning',
                title: 'Unable to transform workflow',
                content: result.cause.toString(),
                duration: 10000
            });
        }
    }
}