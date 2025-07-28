import * as Utils from 'src/utils/charts.util';

interface DonutEntry {
  label: string;
  value: number;
}

interface DonutOptions {
  position: 'left' | 'right' | 'top' | 'bottom';
  entries: DonutEntry[];
}

export const getDonutChart = async (options: DonutOptions): Promise<string> => {
  const data = {
    labels: options.entries.map((entry) => entry.label),
    datasets: [
      {
        label: 'Dataset 1',
        data: options.entries.map((entry) => entry.value),
        backgroundColor: Object.values(Utils.CHART_COLORS),
      },
    ],
  };
  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      legend: {
        position: options.position || 'left',
      },
      plugins: {
        datalabels: {
          color: 'white',
          font: {
            weight: 'bold',
            size: 14,
          },
        },
      },
    },
  };
  return await Utils.chartJsToImage(config);
};
