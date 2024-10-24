const fs = require('fs');
const path = require('path');

const NodeEnvironment = require('jest-environment-node').default;
const { WorkerVM } = require('js-worker-sandbox');

class WorkerEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    
    this.vm = new WorkerVM({
      extend: (sandboxContext) => {
        sandboxContext.addEventListener = (type, listener) => {
          if (type === 'fetch') {
            this.fetchListener = listener;
          }
        };

        return sandboxContext;
      },
    });

    Object.assign(this.global, this.vm.context);

    this.global.vm = this.vm;
  }

  async setup() {
    await super.setup();
    // 如果需要，可以在这里添加额外的设置
  }

  async teardown() {
    await super.teardown();
    // 如果需要，可以在这里添加额外的清理
  }

  runScript(script) {
    return this.vm.evaluate(script);
  }
}

module.exports = WorkerEnvironment;
