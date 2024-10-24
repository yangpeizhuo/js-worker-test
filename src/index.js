const NodeEnvironment = require('jest-environment-node').default;
const { WorkerSandbox } = require('js-worker-sandbox');

class WorkerEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);

    this.ws = new WorkerSandbox();

    Object.assign(this.global, this.ws.context, { process: {} });
    console.log("🚀 ~ WorkerEnvironment ~ constructor ~ this.global:", this.global)
  }

  async setup() {
    await super.setup();
    // 在这里可以添加 WorkerSandbox 特定的设置
  }

  async teardown() {
    // 在这里可以添加 WorkerSandbox 特定的清理
    await super.teardown();
  }

  getVmContext() {
    return this.ws.context;
  }
}

module.exports = WorkerEnvironment;