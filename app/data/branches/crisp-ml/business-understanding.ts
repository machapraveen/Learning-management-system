import { SubBranch } from '../../types';

export const businessUnderstanding: SubBranch = {
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
};