import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { getHeaderSection } from './sections/header.section';
import { countries as Country } from '@prisma/client';
import { footerSection } from './sections/footer.section';

interface ReportOptions {
  title?: string;
  subTitle?: string;
  countries: Country[];
}

export const getCountriesReport = (
  reportOptions: ReportOptions,
): TDocumentDefinitions => {
  const { title, subTitle, countries } = reportOptions;
  return {
    pageOrientation: 'landscape',
    header: getHeaderSection({
      title: title ? title : 'Countries Report',
      subTitle: subTitle ? subTitle : 'List of Countries',
    }),
    footer: (currentPage, pageCount) => footerSection(currentPage, pageCount),
    pageMargins: [40, 110, 40, 60],
    content: [
      {
        layout: 'customLayout01',//'lightHorizontalLines', // optional
        table: {
          headerRows: 1,
          widths: [50, 50, 50, '*', 'auto', '*'],
          body: [
            ['ID', 'ISO2', 'ISO3', 'NAME', 'CONTINENT', 'LOCAL NAME'],
            ...countries.map((country) => [
              country.id.toString(),
              country.iso2.toString(),
              country.iso3 ? country.iso3.toString() : '',
              country.name ? { text: country.name.toString(), bold: true } : '',
              country.continent ? country.continent.toString() : '',
              country.local_name ? country.local_name.toString() : '',
            ]),
            ['', '', '', '', '', ''],
            ['', '', '', '', 'Totals', {
                text: countries.length,
                bold: true,
            }]
          ],
        },
      },

      // Tabla de totales
      {
        text: 'Totales',
        style: {
          fontSize: 16,
          bold: true,
          margin: [0, 40, 0, 0],
        },
      },
      {
        layout: 'noBorders',
        table: {
          headerRows: 1,
          widths: [50, 50, 70, '*', 'auto', '*'],
          body: [
            [
              {
                text: 'Total del Paises',
                colSpan: 2,
                bold: true,
              },
              {},

              {
                text: `${countries.length} paises`,
                bold: true,
              },
              {},
              {},
              {},
            ],
          ],
        },
      },
    ],
  };
};
