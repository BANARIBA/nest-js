import { Content } from 'pdfmake/interfaces';

export const footerSection = (
  currentPage: number,
  pageCount: number,
): Content => {
  const footerContent: Content = {
    text: 'Pagina ' + currentPage.toString() + ' de ' + pageCount,
    alignment: 'right',
    margin: [20, 20, 20, 20],
    style: {
      fontSize: 12,
      bold: true,
    },
  };

  return { columns: [footerContent] };
};
