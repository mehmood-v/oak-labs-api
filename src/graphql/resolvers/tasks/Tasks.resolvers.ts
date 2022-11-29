import { GraphQLError } from 'graphql';
import { startups } from '../startups/Startups.resolvers';
import { UpdateParams } from '../phases/Phases.resolvers';
import { PhaseTypes } from '../../resolvers/phases/Phases.resolvers';
export interface TaskTypes {
  newTask: {
    name: string;
    startDate: Date;
    endDate: Date;
    completed: boolean;
    sequence: number;
    phaseId: number;
    startupId: number;
    taskId: number;
  };
}
interface UpdateTask extends UpdateParams {
  taskId: number;
}

export default {
  Mutation: {
    addTask: async (data: undefined, body: TaskTypes) => {
      const startup = startups.find((startup) => startup.startupId === body.newTask.startupId);

      if (!startup) {
        return new GraphQLError('Startup does not exist', {
          extensions: { code: 404 },
        });
      }

      const phase = startup.phases.find((phase) => phase.phaseId === body.newTask.phaseId);

      if (!phase) {
        return new GraphQLError('Phase does not exist', {
          extensions: { code: 404 },
        });
      }

      const tasks = phase.tasks;

      body.newTask.taskId = tasks[tasks.length - 1] ? tasks[tasks.length - 1]?.taskId + 1 : 1;
      body.newTask.completed = false;
      phase?.tasks.push(body.newTask);
      return {
        status: 200,
        success: true,
        message: `Task created successfully..`,
        name: body.newTask.name,
        startDate: body.newTask.startDate,
        endDate: body.newTask.endDate,
        completed: body.newTask.completed,
      };
    },

    markTaskAsCompleted: async (data: undefined, body: UpdateTask) => {
      const startup = startups.find((startup) => startup.startupId === body.startupId);

      if (!startup) {
        return new GraphQLError('Startup does not exist', {
          extensions: { code: 404 },
        });
      }

      const phase = startup.phases.find((phase) => phase.phaseId === body.phaseId);

      if (!phase) {
        return new GraphQLError('Phase does not exist', {
          extensions: { code: 404 },
        });
      }

      checkTaskCompletion(startup.phases, body.taskId, body.phaseId);

      const task = phase.tasks.find((task) => task.taskId === body.taskId);

      if (!task) {
        throw new GraphQLError('There is no task with this ID', {
          extensions: { code: 404 },
        });
      }

      if (task) {
        task.completed = true;
      }
      return {
        status: 200,
        success: true,
        message: `Task completed successfully..`,
        name: task.name,
        startDate: task.startDate,
        endDate: task.endDate,
        completed: task.completed,
        taskId: task.taskId,
      };
    },
  },
};

const checkTaskCompletion = (phase: PhaseTypes['newPhase'][], taskId: number, phaseId: number) => {
  for (const phaseItem of phase) {
    if (phaseItem.phaseId == phaseId) {
      return;
    }

    for (const taskItem of phaseItem.tasks) {
      if (!taskItem.completed) {
        throw new GraphQLError('Some tasks are completed in the previous phases', {
          extensions: { code: 404 },
        });
      }
    }
  }
};
