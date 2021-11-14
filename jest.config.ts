import type { Config } from '@jest/types';


const config: Config.InitialOptions = {
  "collectCoverage": true,
  testEnvironment: 'jsdom',  // среда выполнения тестов (для веб приложений)
  moduleDirectories: ['node_modules', 'src'], // корневой адрес
  preset: "ts-jest",
  "name": "Range Slider Fox",
  verbose: true,
  setupFiles: ['./jest.setup.ts'],
};
export default config;


