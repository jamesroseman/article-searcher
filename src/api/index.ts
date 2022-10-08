import * as dotenv from 'dotenv';
import * as path from 'path';

import { EnvVarUtils } from '../utils/EnvVarUtils';
import createServer from './server/createServer';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function main() {
  // Create the API server.
  const { app } = await createServer();
  const apiUrl: string = EnvVarUtils.getApiUrl();
  const apiPort: number = EnvVarUtils.getApiPort();
  await app.listen(apiPort);

  // eslint-disable-next-line no-console
  console.log(`[x] GraphQL API Server started on port ${apiUrl}:${apiPort}`);
}

main();