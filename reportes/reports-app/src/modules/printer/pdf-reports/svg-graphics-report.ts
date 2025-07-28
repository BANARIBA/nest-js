import fs from 'node:fs';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as Utils from '../../../utils/charts.util';

const svgContent = fs.readFileSync('src/assets/ford.svg', 'utf8');

const generateChartImage = async () => {
  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      datasets: [
        {
          label: 'Mi Primer grafico',
          data: [65, 59, 80, 81, 56, 55, 10],
          backgroundColor: 'rgba(93,75,192,0.2)',
          borderColor: 'rgb(81,75,192)',
          borderWidth: 1,
        },
      ],
    },
  };
  return await Utils.chartJsToImage(
    chartConfig /*, { height: 200, width: 200 }*/,
  );
};

const generateDonut = async () => {
  const DATA_COUNT = 5;
  const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

  const data = {
    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
    datasets: [
      {
        label: 'Dataset 1',
        data: Utils.numbers(NUMBER_CFG),
        backgroundColor: Object.values(Utils.CHART_COLORS),
      },
    ],
  };
  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
    },
  };

  return await Utils.chartJsToImage(config);
};

export const svgGraphicsReport = async (): Promise<TDocumentDefinitions> => {
  const [chart, chartDonut] = await Promise.all([
    generateChartImage(),
    generateDonut(),
  ]);
  const docDefinition: TDocumentDefinitions = {
    content: [
      {
        svg: svgContent,
        width: 150,
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

  return docDefinition;
};
