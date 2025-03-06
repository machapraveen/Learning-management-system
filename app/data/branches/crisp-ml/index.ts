import { Branch } from '../../types';
import { businessUnderstanding } from './business-understanding';
import { dataUnderstanding } from './data-understanding';
import { dataPreparation } from './data-preparation';
import { modelBuilding } from './model-building';
import { evaluation } from './evaluation';
import { modelDeployment } from './model-deployment';
import { monitoringMaintenance } from './monitoring-maintenance';

export const crispML: Branch = {
  id: 'crisp-ml',
  title: 'CRISP-ML(Q)',
  description: 'Cross Industry Standard Process for Machine Learning with Quality Assurance',
  subbranches: [
    businessUnderstanding,
    dataUnderstanding,
    dataPreparation,
    modelBuilding,
    evaluation,
    modelDeployment,
    monitoringMaintenance,
  ],
};