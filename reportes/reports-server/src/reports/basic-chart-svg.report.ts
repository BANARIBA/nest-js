import fs from 'node:fs';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { CHART_COLORS, chartJsToImage, numbers } from 'src/helpers';

const svgContent = fs.readFileSync('src/assets/ford.svg', 'utf-8');

const generateChartImage = async () => {
  const chartConfig = {
    type: 'bar', // Show a bar chart
    data: {
      labels: [2012, 2013, 2014, 2015, 2016], // Set X-axis labels
      datasets: [
        {
          label: 'Users', // Create the 'Users' dataset
          data: [120, 60, 50, 180, 120], // Add data to the chart
        },
      ],
    },
  };

  return chartJsToImage(chartConfig);
};

export const basicChartSvgReport = async (): Promise<TDocumentDefinitions> => {
  const [chart, chartDonut] = await Promise.all([
    generateChartImage(),
    generateDonut(),
  ]);
  return {
    content: [
      {
        svg: svgContent,
        width: 100,
        fit: [100, 100],
      },
      {
        image: chart,
        width: 500,
      },
      {
        image: chartDonut,
        width: 500,
      },
    ],
  };
};

export const generateDonut = async () => {
  const DATA_COUNT = 5;
  const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

  const data = {
    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
    datasets: [
      {
        label: 'Dataset 1',
        data: numbers(NUMBER_CFG),
        backgroundColor: Object.values(CHART_COLORS),
      },
    ],
  };

  const config = {
    type: 'doughnut',
    data: data,
    options: {
      title: {
        display: true,
        text: 'Chart.js Dougnut Chart',
      },
    },
  };

  return chartJsToImage(config);
};
