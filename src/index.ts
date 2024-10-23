import type { Config, Global } from '@jest/types'
import type { JestEnvironment } from '@jest/environment'
import { WorkerSandbox } from 'js-worker-sandbox'
import { installCommonGlobals } from 'jest-util'
import { LegacyFakeTimers, ModernFakeTimers } from '@jest/fake-timers'
import { ModuleMocker } from 'jest-mock'

interface Context {
  [key: string | number]: any
}

class WorkerEnvironment implements JestEnvironment<number> {
  context: Context | null
  fakeTimers: LegacyFakeTimers<number> | null
  fakeTimersModern: ModernFakeTimers | null
  global: Global.Global
  moduleMocker: ModuleMocker | null
  sandbox: WorkerSandbox

  constructor(config: Config.ProjectConfig) {
    this.sandbox = new WorkerSandbox({})
    this.context = this.sandbox.context;

    const global = (this.global = Object.assign(
      this.context,
      config.testEnvironmentOptions,
    ) as any)

    installCommonGlobals(global, config.globals)

    this.moduleMocker = new ModuleMocker(global)

    this.fakeTimers = new LegacyFakeTimers({
      config,
      global,
      moduleMocker: this.moduleMocker,
      timerConfig: {
        idToRef: (id: number) => id,
        refToId: (ref: number) => ref,
      },
    })

    this.fakeTimersModern = new ModernFakeTimers({
      config,
      global,
    })
  }

  async setup(): Promise<void> {
    // 在这里可以进行额外的设置
  }

  exportConditions(): string[] {
    return ['worker', 'browser']
  }
}

export default WorkerEnvironment