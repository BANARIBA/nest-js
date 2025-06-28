import { CHART_COLORS, chartJsToImage } from 'src/helpers';

type DonutEntry = {
  label: string;
  value: number;
};

type DonutOptions = {
  position: 'top' | 'bottom' | 'left' | 'right';
  entries: DonutEntry[];
};

export const getDonutChart = async (
  donutOptions: DonutOptions,
): Promise<string> => {
  const { entries, position = 'top' } = donutOptions;
  const data = {
    labels: entries.map((entry) => entry.label),
    datasets: [
      {
        label: 'Dataset 1',
        data: entries.map((entry) => entry.value),
        backgroundColor: Object.values(CHART_COLORS),
      },
    ],
  };

  const config = {
    type: 'doughnut',
    data: data,
    options: {
      legend: {
        position: position,
      },
      // title: {
      //   text: 'Chart.js Doughnut Chart',
      //   display: true,
      // },
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

  return chartJsToImage(config);
};
