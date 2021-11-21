import type { Config } from '@jest/types';


const config: Config.InitialOptions = {
  "collectCoverage": true,
  //"coverageReporters": ["html"], // в папке coverage будет HTML страница с подробным описание покрытия.
  testEnvironment: 'jsdom',  // среда выполнения тестов (для веб приложений)
  moduleDirectories: ['node_modules', 'src'], // корневой адрес
  preset: './jest.preset.ts',
  "name": "Range Slider Fox",
  verbose: true,
  setupFiles: ['./jest.setup.ts'],
};
export default config;


