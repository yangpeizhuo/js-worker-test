import type { Config, Global } from '@jest/types'
import type { JestEnvironment } from '@jest/environment'
import { WorkerSandbox, type Context } from 'js-worker-sandbox'
import { installCommonGlobals } from 'jest-util'
import { LegacyFakeTimers, ModernFakeTimers } from '@jest/fake-timers'
import { ModuleMocker } from 'jest-mock'

class WorkerEnvironment implements JestEnvironment<number> {
  context: Context | null
  global: Global.Global
  ws: WorkerSandbox
  fakeTimers: LegacyFakeTimers<number> | null
  fakeTimersModern: ModernFakeTimers | null
  moduleMocker: ModuleMocker | null

  constructor(config: Config.ProjectConfig) {
    this.ws = new WorkerSandbox();
    this.context = this.ws.context;

    const global = this.global = Object.assign(
      this.context,
      config.testEnvironmentOptions,
    ) as any;

    installCommonGlobals(global, config.globals)
  }

  async setup(): Promise<void> {}

  exportConditions(): string[] {
    return ['worker']
  }

  async teardown(): Promise<void> {}

  getVmContext(): Context | null {
    return this.context;
  }  
}

export default WorkerEnvironment