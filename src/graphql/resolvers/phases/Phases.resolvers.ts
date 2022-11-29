import { GraphQLError } from 'graphql';
import { startups } from '../startups/Startups.resolvers';
import { TaskTypes } from '../tasks/Tasks.resolvers';
export interface PhaseTypes {
  newPhase: {
    name: string;
    startDate: Date;
    endDate: Date;
    completed: boolean;
    sequence: number;
    startupId: number;
    phaseId: number;
    locked: boolean;
    tasks: TaskTypes['newTask'][];
  };
}
export interface UpdateParams {
  phaseId: number;
  startupId: number;
}

export default {
  Mutation: {
    addPhase: async (data: undefined, body: PhaseTypes) => {
      const getStartupToAddPhase = startups.find((startup) => startup.startupId === body.newPhase.startupId);
      if (!getStartupToAddPhase) {
        return new GraphQLError('Startup does not exist', {
          extensions: { code: 404 },
        });
      }

      const startupPhases = getStartupToAddPhase.phases;

      body.newPhase.phaseId = startupPhases[startupPhases.length - 1]
        ? startupPhases[startupPhases.length - 1]?.phaseId + 1
        : 1;
      body.newPhase.locked = true;
      body.newPhase.tasks = [];

      if (getStartupToAddPhase) startupPhases.push(body.newPhase);

      return {
        status: 200,
        success: true,
        message: `Phase created successfully..`,
        name: body.newPhase.name,
        startDate: body.newPhase.startDate,
        endDate: body.newPhase.endDate,
        completed: body.newPhase.completed,
        sequence: body.newPhase.sequence,
      };
    },
    markPhaseAsComplete: async (data: undefined, body: UpdateParams) => {
      const startup = startups.find((startup) => startup.startupId === body.startupId);

      if (!startup) {
        return new GraphQLError('Startup does not exist', {
          extensions: { code: 404 },
        });
      }

      const phaseTasks = startup?.phases.find((phase) => phase.phaseId === body.phaseId);
      if (!phaseTasks) {
        return new GraphQLError('Phase does not exist', {
          extensions: { code: 404 },
        });
      }

      const unCompletedTasks = phaseTasks?.tasks.filter((task) => task.completed === false);

      if (unCompletedTasks.length > 0) {
        return new GraphQLError(
          'This phase cannot be completed marked as completed because there are some uncomplete task in the phase.',
          {
            extensions: { code: 404 },
          },
        );
      }

      phaseTasks.completed = true;
      phaseTasks.locked = false;

      const nextPhase = startup?.phases.find((phase) => phase.phaseId === phaseTasks.phaseId + 1);

      if (nextPhase) {
        nextPhase.locked = false;
      }

      return {
        status: 200,
        success: true,
        message: `Phase completed successfully..`,
        name: phaseTasks.name,
        startDate: phaseTasks.startDate,
        endDate: phaseTasks.endDate,
        completed: phaseTasks.completed,
      };
    },
  },
};
