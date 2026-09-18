// Run inside the service/container with its private environment and mounted volume.
// Writes participant information only when explicitly run by an administrator.
import { accessConfig } from '../src/lib/server/recordings-access.js';
import { creditStore } from '../src/lib/server/recovery-credits.js';
const config = accessConfig(process.env);
const store = creditStore(process.env);
if (!config.ready || !store.ready) throw new Error('Recovery environment and credit volume must be configured');
const rows = ['email,credits_allocated,credits_used,credits_remaining'];
for (const email of [...config.emails].sort()) {
 const { allocated, used, remaining } = store.usage(email);
 // Quote all cells and suppress spreadsheet formula evaluation for email values.
 const safeEmail = /^[=+@-]/.test(email) ? "'"+email : email;
 rows.push([safeEmail,allocated,used,remaining].map(x=>'"'+String(x).replaceAll('"','""')+'"').join(','));
}
process.stdout.write(rows.join('\n')+'\n');
