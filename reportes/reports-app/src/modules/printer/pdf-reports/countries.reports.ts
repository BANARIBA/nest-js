import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';
import { countries as Country } from '@prisma/client';
import { footerSection } from './sections/footer.section';

interface CountriesReportOptions {
  title?: string;
  subTitle?: string;
  countries: Country[];
}

export const countriesReport = (
  countriesReportOptions: CountriesReportOptions,
): TDocumentDefinitions => {
  const docDefinition: TDocumentDefinitions = {
    pageOrientation: 'landscape', // horizontal orientation
    header: headerSection({
      title: countriesReportOptions.title ?? 'Countries Report',
      subTitle: countriesReportOptions.subTitle ?? 'List of countries',
      showLogo: true,
      showDate: true,
    }),
    footer: footerSection, //(currentPage, pageCount/*, pageSize*/) => footerSection(currentPage, pageCount),
    pageMargins: [40, 110, 40, 60],
    content: [
      {
        layout: 'customLayout01', //'lightHorizontalLines', // optional
        table: {
          headerRows: 1,
          widths: [50, 50, 50, '*', 'auto', '*'], // Adjust widths as needed
          body: [
            [
              { text: 'ID', style: { color: 'white', bold: true } },
              { text: 'ISO2', style: { color: 'white', bold: true } },
              { text: 'ISO3', style: { color: 'white', bold: true } },
              { text: 'Name', style: { color: 'white', bold: true } },
              { text: 'Continent', style: { color: 'white', bold: true } },
              { text: 'Local Name', style: { color: 'white', bold: true } },
            ],
            ...countriesReportOptions.countries.map((country) => [
              country.id.toString(),
              country.iso2.toString(),
              country.iso3?.toString() ?? 'N/A',
              country.name?.toString() ?? 'N/A',
              country.continent?.toString() ?? 'N/A',
              country.local_name?.toString() ?? 'N/A',
            ]),
            ['', '', '', '', '', ''], // Empty row for spacing
            [
              {
                text: 'Total:',
                colSpan: 5,
                alignment: 'right',
                style: {
                  color: '#fff',
                },
              },
              {},
              {},
              {},
              {},
              {
                text:
                  countriesReportOptions.countries.length.toString() +
                  ' Paises',
                style: {
                  color: '#fff',
                },
                bold: true,
              },
            ],
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
          widths: [25, 15, 70, 'auto', 'auto', 'auto'],
          body: [
            [
              {
                text: 'Total de países: ',
                colSpan: 3,
                bold: true,
              },
              {},
              {},
              {
                text: countriesReportOptions.countries.length,
                bold: true,
              },
              {},
              {},
            ],
          ],
        },
      },
    ],
  };

  return docDefinition;
};
