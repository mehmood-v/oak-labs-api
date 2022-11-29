import { PhaseTypes } from '../phases/Phases.resolvers';

interface StartupTypes {
  newStartup: {
    name: string;
    startDate: Date;
    endDate: Date;
    completed: boolean;
    sequence: number;
    startupId: number;
    owner: string;
    funding: string;

    phases: PhaseTypes['newPhase'][];
  };
}

export const startups: StartupTypes['newStartup'][] = [];

export default {
  Mutation: {
    addStartup: async (data: undefined, body: StartupTypes) => {
      body.newStartup.startupId = startups[startups.length - 1] ? startups[startups.length - 1]?.startupId + 1 : 1;
      body.newStartup.phases = [];
      startups.push(body.newStartup);

      return {
        status: 200,
        success: true,
        message: `Startup created successfully..`,
        name: body.newStartup.name,
        owner: body.newStartup.owner,
        startDate: body.newStartup.startDate,
        funding: body.newStartup.funding,
        startupId: body.newStartup.startupId,
      };
    },
  },
  Query: {
    getStartups: async () => {
      return startups;
    },
  },
};
