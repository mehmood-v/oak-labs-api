/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose from './';
const Schema = mongoose.Schema;
import { Types } from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);
interface PhaseTypes {
  name: string;
  startDate: Date;
  endDate: Date;
  tasks: Types.ObjectId[];
  completed: boolean;
  locked: boolean;
  sequence: number;
}

const PhaseSchema = new Schema<PhaseTypes>({
  name: { type: String, required: true },
  startDate: { type: Date, default: Date.now() },
  endDate: { type: Date, default: Date.now() },
  completed: { type: Boolean, default: false },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Tasks' }],
  sequence: { type: Number, default: 0 },
  locked: { type: Boolean, default: true },
});

PhaseSchema.plugin(AutoIncrement, { id: 'phase_seq', inc_field: 'sequence' });
const PhaseModal = mongoose.model<PhaseTypes>('Phases', PhaseSchema);
export default PhaseModal;
