const path = require('path');
const { WorkerSandbox } = require("js-worker-sandbox");

describe('worker test', () => {
  let ws;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation();

    ws = new WorkerSandbox({
      scriptPath: path.join(__dirname, './base.js')
    });
  });

  afterAll(() => {
    console.log.mockRestore();

    ws = null;
  });

  it('respond with "Hello Worker!"', async () => {
    const response = await ws.dispatchFetch('http://localhost:8000/');

    expect(console.log).toHaveBeenCalledWith('http://localhost:8000/');
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);

    const text = await response.text();
    expect(text).toBe('Hello Worker!');
  });

  it('respond with "Hello Test!"', async () => {
    const response = await ws.dispatchFetch('http://localhost:8000/test');

    expect(console.log).toHaveBeenCalledWith('http://localhost:8000/test');
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);

    const text = await response.text();
    expect(text).toBe('Hello Test!');
  });
});