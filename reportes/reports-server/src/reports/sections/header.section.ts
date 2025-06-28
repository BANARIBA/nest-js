import { Content } from 'pdfmake/interfaces';
import { DateFormatter } from 'src/helpers';

const logo: Content = {
  image: 'src/assets/tucan-code-logo.png',
  width: 100,
  height: 100,
  alignment: 'center',
  margin: [0, 0, 0, 20],
};

const currentDate: Content = {
  text: DateFormatter.getDDMMYYYY(new Date()),
  alignment: 'right',
  bold: true,
  margin: [0,20,30,0],
  fontSize: 10,
};

type HeaderOptions = {
  title?: string;
  subTitle?: string;
  showLogo?: boolean;
  showDate?: boolean;
};

export const getHeaderSection = (headerOptions: HeaderOptions): Content => {
  const { showLogo = true, showDate = true, title, subTitle } = headerOptions;

  const headerLogo: Content = showLogo ? logo : '';

  const headerDate: Content = showDate ? currentDate : ({} as Content);

  const headerSubtitle: Content = subTitle
    ? {
        text: subTitle,
        fontSize: 16,
        margin: [40, 2, 0, 0],
        alignment: 'center',
      }
    : ({} as Content);

  const headerTitle: Content = title
    ? {
        stack: [
          {
            text: title,
            fontSize: 30,
            margin: [30, 15, 0, 0],
            alignment: 'center',
            style: {
              fontSize: 22,
              bold: true,
            },
          },
          headerSubtitle,
        ],
      }
    : ({} as Content);

  return {
    columns: [
      headerLogo,
      headerTitle,
      { text: headerDate, margin: [0, 30, 20, 0], width: 100 },
    ],
  };
};
