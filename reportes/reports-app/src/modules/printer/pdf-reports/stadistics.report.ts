import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { getDonutChart } from './charts/donut.chart';
import { headerSection } from './sections/header.section';
import { getLineChart } from './charts/line.chart';
import { getBarChat } from './charts/bar.chart';
import { footerSection } from './sections/footer.section';
import { getPolarChart } from './charts/polar.chart';

interface TopCountry {
  country: string;
  customers: number;
}

interface ReportOptions {
  title?: string;
  subTitle?: string;
  topCountries: TopCountry[];
}

export const getStadisticsReport = async (
  options: ReportOptions,
): Promise<TDocumentDefinitions> => {
  const [donutChart, lineChart, barChart, polarChart] = await Promise.all([
    getDonutChart({
      entries: options.topCountries.map((topCountry) => ({
        label: topCountry.country,
        value: topCountry.customers,
      })),
      position: 'left',
    }),
    getLineChart(),
    getBarChat(),
    getPolarChart(),
  ]);

  const docDefinition: TDocumentDefinitions = {
    pageMargins: [40, 100, 40, 60],
    header: headerSection({
      title: options.title ?? 'Estadisticas de clientes',
      subTitle: options.subTitle ?? 'Top 10 de paises con mas clientes',
      showLogo: true,
    }),
    footer: footerSection,
    content: [
      {
        columns: [
          {
            stack: [
              {
                text: '10 Paises con mas clientes',
                alignment: 'center',
                margin: [0, 0, 0, 10],
                bold: true,
              },
              {
                image: donutChart,
                width: 320,
              },
            ],
          },
          {
            width: 'auto',
            layout: 'lightHorizontalLines',
            table: {
              headerRows: 1,
              widths: [100, 'auto'],
              body: [
                ['Pais', 'Clientes'],
                ...options.topCountries.map((topCountry) => [
                  topCountry.country,
                  topCountry.customers,
                ]),
              ],
            },
          },
        ],
      },
      {
        image: lineChart,
        width: 500,
        margin: [0, 20],
      },
      {
        columnGap: 10,
        columns: [
          {
            image: barChart,
            width: 250,
            margin: [0, 20],
          },
          {
            image: polarChart,
            width: 300,
            margin: [0, 20],
          },
        ],
      },
    ],
  };
  return docDefinition;
};
