import { Content } from 'pdfmake/interfaces';

export const footerSection = (
  currentPage: number,
  pageCount: number,
): Content => {
  return {
    text: `Pagina ${currentPage} de ${pageCount}`,
    alignment: 'right',
    bold: true,
    margin: [0, 20, 20, 0]
  };
};
