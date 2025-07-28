import { Content } from 'pdfmake/interfaces';
import { DateFormatter } from 'src/utils';

interface HeaderSectionOptions {
  title?: string;
  subTitle?: string;
  showLogo?: boolean;
  showDate?: boolean;
}

const logo: Content = {
  image: 'src/assets/tucan-code-logo.png',
  width: 100,
  height: 100,
  alignment: 'center',
  margin: [0, 0, 0, 20],
};

export const headerSection = (options: HeaderSectionOptions): Content => {
  const headerLogo: Content = options.showLogo ? logo : '';
  const headerTitle: Content = options.title
    ? {
        stack: [
          {
            text: options.title,
            style: {
              alignment: 'center',
              bold: true,
              fontSize: 22,
            },
            margin: [0, 15, 0, 0],
          },
          {
            text: options.subTitle || '',
            style: {
              alignment: 'center',
              fontSize: 16,
            },
            margin: [0, 2, 0, 0],
          },
        ],
      }
    : '';

  return {
    columns: [
      headerLogo,
      headerTitle,
      {
        width: 100,
        text: DateFormatter.getDDMMYYYY(new Date()),
        alignment: 'right',
        margin: [20, 30, 20, 30],
        fontSize: 10
      },
    ],
  };
};
