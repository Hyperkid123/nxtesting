import { SyncDependenciesExecutorSchema } from './schema';
import executor from './executor';

const options: SyncDependenciesExecutorSchema = {};

describe('SyncDependencies Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
