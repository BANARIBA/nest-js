import {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { CurrencyFormatter, DateFormatter } from 'src/helpers';
import { footerSection } from './sections/footer.section';

const logo: Content = {
  image: 'src/assets/tucan-banner.png',
  width: 100,
  height: 30,
  margin: [10, 30],
};

const styles: StyleDictionary = {
  header: {
    fontSize: 20,
    bold: true,
    margin: [0, 30, 0, 0],
  },
  subHeader: {
    bold: true,
    fontSize: 16,
    margin: [0, 20, 0, 0],
  },
};

export interface CompleteOrder {
  order_id: number;
  customer_id: number;
  order_date: Date;
  customers: Customers;
  order_details: OrderDetail[];
}

export interface Customers {
  customer_id: number;
  customer_name: string;
  contact_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface OrderDetail {
  order_detail_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  products: Products;
}

export interface Products {
  product_id: number;
  product_name: string;
  category_id: number;
  unit: string;
  price: string;
}

export interface ReportValues {
  title?: string;
  subTitle?: string;
  data: CompleteOrder;
}

export const getOrderReportPdf = (
  data: CompleteOrder,
): TDocumentDefinitions => {
  const subTotal = data.order_details.reduce(
    (acc, detail) => acc + detail.quantity * +detail.products.price,
    0,
  );

  const docDefinition: TDocumentDefinitions = {
    styles: styles,
    header: logo,
    footer: footerSection,
    pageMargins: [40, 60, 40, 60],
    content: [
      // Headers
      {
        text: 'Tucan Code',
        style: 'header',
      },
      // Addres abd receipt information
      {
        columns: [
          {
            text: '1221 W State Rd 84, Fort Lauderdale, FL 33315, Estados Unidos',
            alignment: 'left',
          },
          {
            text: [
              { text: `Recibo No. ${data.order_id}\n`, bold: true },
              `Fecha del recibo: ${DateFormatter.getDDMMYYYY(data.order_date)}\nPagar antes de: ${DateFormatter.getDDMMYYYY(new Date())}`,
            ],
            alignment: 'right',
          },
        ],
      },
      // QR Code
      {
        margin: [0, 20, 0, 0],
        qr: 'http://devtalles.com',
        fit: 75,
        alignment: 'right',
      },
      // Customer address
      {
        text: [
          { text: 'Cobrar a: \n', style: 'subHeader' },
          `
          Razon Social: ${data.customers.customer_name}
          ${data.customers.contact_name}
        `,
        ],
      },
      // Order details table
      {
        layout: 'headerLineOnly',
        table: {
          headerRows: 1,
          widths: [50, '*', 'auto', 'auto', 'auto'],
          body: [
            [
              'ID',
              'Descripcion',
              { text: 'Cantidad', alignment: 'center' },
              { text: 'Precio', alignment: 'right' },
              { text: 'Total', alignment: 'right' },
            ],
            ...data.order_details.map((orderDetails) => [
              orderDetails.order_id,
              orderDetails.products.product_name,
              {
                text: orderDetails.quantity,
                alignment: 'center',
              },
              {
                alignment: 'right',
                text: CurrencyFormatter.formatCurrency(
                  +orderDetails.products.price,
                ),
              },
              {
                alignment: 'right',
                text: CurrencyFormatter.formatCurrency(
                  +orderDetails.products.price * +orderDetails.quantity,
                ),
              },
            ]),
          ],
        },
      },
      // Salto de linea
      '\n\n',
      // Totals
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            layout: 'noBorders',
            table: {
              body: [
                [
                  'Subtotal',
                  {
                    text: CurrencyFormatter.formatCurrency(subTotal),
                    alignment: 'right',
                  },
                ],
                [
                  {
                    text: 'Total',
                    bold: true,
                  },
                  {
                    text: CurrencyFormatter.formatCurrency(subTotal * 1.15),
                    alignment: 'right',
                    bold: true,
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  };

  return docDefinition;
};
