import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { getDonutChart } from './charts/donut.chart';
import { getHeaderSection } from './sections/header.section';

type TopCountry = {
  country: string;
  customers: number;
};

type ReportOptions = {
  title?: string;
  subtitle?: string;
  topCountries: TopCountry[];
};

export const getCountriesStadisticsReport = async (
  reportOptions: ReportOptions,
): Promise<TDocumentDefinitions> => {
  const donutChart = await getDonutChart({
    position: 'left',
    entries: reportOptions.topCountries.map((country) => ({
      label: country.country,
      value: country.customers,
    })),
  });

  const docDefinition: TDocumentDefinitions = {
    pageMargins: [40,100,40,60],
    header: getHeaderSection({
      title: 'Estadisticas de clientes',
      subTitle: 'Top 10 paises con mas clientes',
    }),
    content: [
      {
        columns: [
          {
            stack: [
              {
                text: '10 Paises Con Mas Clientes',
                alignment: 'center',
                margin: [0, 0, 0, 10],
              },
              { image: donutChart, width: 300 },
            ],
          },
          {
            layout: 'lightHorizontalLines',
            width: 'auto',
            table: {
              headerRows: 1,
              widths: [100, 'auto'],
              body: [
                ['Pais', 'Clientes'],
                ...reportOptions.topCountries.map((country) => [
                  country.country,
                  country.customers,
                ]),
              ],
            },
          },
        ],
      },
    ],
  };

  return docDefinition;
};
