/* eslint-disable @typescript-eslint/no-var-requires */
import mongoose from './';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

interface TaskTypes {
  name: string;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  sequence: number;
}

const TasksSchema = new Schema<TaskTypes>({
  name: { type: String, required: true },
  startDate: { type: Date, default: Date.now() },
  endDate: { type: Date, default: Date.now() },
  completed: { type: Boolean, default: false },
  sequence: { type: Number, default: 0 },
});

TasksSchema.plugin(AutoIncrement, { id: 'task_seq', inc_field: 'sequence' });

const Tasks = mongoose.model<TaskTypes>('Tasks', TasksSchema);

export default Tasks;
