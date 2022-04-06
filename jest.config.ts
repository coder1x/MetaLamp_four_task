import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  collectCoverage: true,
  // "coverageReporters": ["html"], // в папке coverage будет HTML страница с подробным описание покрытия.
  testEnvironment: 'jsdom', // среда выполнения тестов (для веб приложений)
  moduleDirectories: ['node_modules', 'src'], // корневой адрес
  preset: './jest.preset.ts',
  name: 'Range Slider Fox',
  verbose: true,
  setupFiles: ['./jest.setup.ts'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  // collectCoverageFrom: ["src/**/{!(*.d.ts),}.{ts,js,.tsx,.jsx}"],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  roots: ['<rootDir>/src'],
};
export default config;
