import axios from 'axios';
import colorLib from '@kurkle/color';

interface ChartOptions {
  height?: number;
  width?: number;
}

export const chartJsToImage = async (
  chartConfig: Record<string, any>, // <-- Mejora respecto a 'unknown'
  options: ChartOptions = {}
): Promise<string> => {
  const params = new URLSearchParams();

  if (options.height) params.append('height', options.height.toString());
  if (options.width) params.append('width', options.width.toString());

  const encodedUri = encodeURIComponent(JSON.stringify(chartConfig));
  const chartUrl = `https://quickchart.io/chart?c=${encodedUri}&${params.toString()}`;

  const response = await axios.get<ArrayBuffer>(chartUrl, {
    responseType: 'arraybuffer',
  });

  return `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
};

let _seed: number = Date.now();

export function srand(seed: number): void {
  _seed = seed;
}

export function rand(min: number = 0, max: number = 0): number {
  _seed = (_seed * 9301 + 49297) % 233280;
  return min + (_seed / 233280) * (max - min);
}

export const CHART_COLORS: string[] = [
  '#4dc9f6',
  '#f67019',
  '#f53794',
  '#537bc4',
  '#acc236',
  '#166a8f',
  '#00a950',
  '#727478',
  '#9756cf',
];

export const NAMED_COLORS: Record<string, string> = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
};

export function transparentize(value: string, opacity: number): string {
  const alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
}

export interface NumbersConfig {
  min?: number;
  max?: number;
  count?: number;
  from?: number[];
  decimals?: number;
  continuity?: number;
}

export function numbers(config: NumbersConfig = {}): (number | null)[] {
  const cfg = config ?? {};
  const min = cfg.min ?? 0;
  const max = cfg.max ?? 100;
  const from = cfg.from ?? [];
  const count = cfg.count ?? 8;
  const decimals = cfg.decimals ?? 8;
  const continuity = cfg.continuity ?? 1;
  const dfactor = Math.pow(10, decimals);
  const data: (number | null)[] = [];

  for (let i = 0; i < count; ++i) {
    const value = (from[i] || 0) + rand(min, max);
    if (rand() <= continuity) {
      data.push(Math.round(dfactor * value) / dfactor);
    } else {
      data.push(null);
    }
  }

  return data;
}

const MONTHS: string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

interface MonthsConfig {
  count?: number;
  section?: number;
}

export function months(config: MonthsConfig = {}): string[] {
  const cfg = config ?? {};
  const count = cfg.count ?? 12;
  const section = cfg.section;
  const values: string[] = [];

  for (let i = 0; i < count; ++i) {
    const value = MONTHS[i % 12];
    values.push(section ? value.substring(0, section) : value);
  }

  return values;
}
