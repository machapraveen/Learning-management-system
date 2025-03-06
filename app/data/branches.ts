export interface SubBranch {
  id: string;
  title: string;
  description?: string;
  subbranches?: SubBranch[];
}

export interface Branch {
  id: string;
  title: string;
  description?: string;
  subbranches: SubBranch[];
}

export const practicalDataScience: Branch = {
  id: 'practical-data-science',
  title: 'PRACTICAL DATA SCIENCE',
  description: 'Note: For Artificial Intelligence & Deep Learning We Have a Separate Mindmap',
  subbranches: [
    {
      id: 'probability',
      title: 'Probability',
    },
    {
      id: 'probability-distributions',
      title: 'Probability Distributions',
    },
    {
      id: 'inferential-statistics',
      title: 'Inferential Statistics',
    },
    {
      id: 'mathematical-foundations',
      title: 'Mathematical Foundations',
    },
  ],
};

export const crispML: Branch = {
  id: 'crisp-ml',
  title: 'CRISP-ML(Q)',
  description: 'Cross Industry Standard Process for Machine Learning with Quality Assurance',
  subbranches: [
    {
      id: 'business-understanding',
      title: '1a. Business Understanding',
      subbranches: [
        {
          id: 'identify-business-selection',
          title: 'a. Identify Business Selection',
        },
        {
          id: 'identify-high-level-selection',
          title: 'b. Identify High Level Selection',
        },
        {
          id: 'record-business-objective',
          title: 'c. Record Business Objective',
        },
        {
          id: 'record-business-constraint',
          title: 'd. Record Business Constraint',
        },
        {
          id: 'success-criteria',
          title: 'Success Criteria',
          subbranches: [
            {
              id: 'business-success-criteria',
              title: 'Business Success Criteria',
            },
            {
              id: 'ml-success-criteria',
              title: 'ML Success Criteria',
            },
            {
              id: 'economic-success-criteria',
              title: 'Economic Success Criteria',
            },
          ],
        },
        {
          id: 'project-charter',
          title: 'Project Charter',
          description: 'This is the first document, which gets prepared on any project',
          subbranches: [
            {
              id: 'high-level-details',
              title: 'This contains details at a high level',
            },
            {
              id: 'project-sponsor',
              title: 'This document is signed by Project Sponsor',
            },
          ],
        },
      ],
    },
    {
      id: 'data-understanding',
      title: '1b. Data Understanding',
    },
    {
      id: 'data-preparation',
      title: '2. Data Preparation',
    },
    {
      id: 'model-building',
      title: '3. Model Building',
    },
    {
      id: 'evaluation',
      title: '4. Evaluation',
    },
    {
      id: 'model-deployment',
      title: '5. Model Deployment',
    },
    {
      id: 'monitoring-maintenance',
      title: '6. Monitoring & Maintenance',
    },
  ],
};

export const mainBranches = [practicalDataScience, crispML];