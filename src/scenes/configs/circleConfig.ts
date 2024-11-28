export interface CircleConfig {
  x: number;
  y: number;
  radius: number;
  phase: number;
}

export const createCircleConfigs = (width: number, height: number): CircleConfig[] => [
  { x: width * 0.3, y: height * 0.6, radius: 80, phase: 0 },
  { x: width * 0.7, y: height * 0.4, radius: 100, phase: Math.PI / 3 },
  { x: width * 0.5, y: height * 0.7, radius: 120, phase: Math.PI / 2 }
];