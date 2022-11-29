/* eslint-disable @typescript-eslint/no-var-requires */

import mongoose from '.';
const AutoIncrement = require('mongoose-sequence')(mongoose);
import { Types } from 'mongoose';
const Schema = mongoose.Schema;

interface StartupTypes {
  name: string;
  owner: string;
  startDate: Date;
  funding: string;
  phases: Types.ObjectId[];
  currentPhase: string;
  sequence: number;
}

const StartupSchema = new Schema<StartupTypes>({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  startDate: { type: Date, required: true },
  funding: { type: String, required: true },
  phases: [{ type: Schema.Types.ObjectId, ref: 'Phases' }],
  sequence: { type: Number, default: 0 },
});

StartupSchema.plugin(AutoIncrement, { id: 'startup_seq', inc_field: 'sequence' });
const Startup = mongoose.model<StartupTypes>('Startup', StartupSchema);

export default Startup;
