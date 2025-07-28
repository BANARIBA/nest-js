import {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { CurrencyFormatter, DateFormatter } from 'src/utils';
import { footerSection } from './sections/footer.section';

interface ReportValues {
  title?: string;
  subtitle?: string;
  order: OrderData;
}

export interface OrderData {
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

const styles: StyleDictionary = {
  header: {
    fontSize: 20,
    bold: true,
    margin: [0, 30, 0, 0],
  },
  subHeader: {
    fontSize: 16,
    bold: true,
    margin: [0, 20, 0, 0],
  },
};

const logo: Content = {
  image: 'src/assets/tucan-banner.png',
  width: 100,
  height: 30,
  margin: [10, 30],
};

export const orderDetailsReport = (
  values: ReportValues,
): TDocumentDefinitions => {
  const { order } = values;

  const subTotal: number = order.order_details.reduce((acc, detail) => (acc + (Number(detail.quantity) * Number(detail.products.price))), 0)
  const total: number = subTotal * 1.15;

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
      // Address and Receipt Information
      {
        columns: [
          {
            text: order.customers.address,
          },
          {
            text: [
              {
                text: `Recibo No.${order.order_id}\n`,
                bold: true,
              },
              `Fecha del recibo: ${DateFormatter.getDDMMYYYY(new Date(order.order_date))}\nPagar antes de: ${DateFormatter.getDDMMYYYY(new Date())}\n`,
            ],
            alignment: 'right',
          },
        ],
      },
      // qr code
      {
        qr: 'https://devtalles.com',
        fit: 75,
        alignment: 'right',
        marginTop: 20,
      },
      // client address
      {
        text: [
          {
            text: `Cobrar a: \n`,
            bold: true,
            style: 'subHeader',
          },
          `
          Razón Social: ${order.customers.customer_name}
          Contacto: ${order.customers.contact_name}`,
        ],
      },
      // Order table
      {
        layout: 'headerLineOnly',
        margin: [0, 20],
        table: {
          headerRows: 1,
          widths: [50, '*', 'auto', 'auto', 'auto'],
          body: [
            ['ID', 'Descripcion', 'Cantidad', 'Precio Unitario', 'Total'],
            ...order.order_details.map((order_detail) =>[ 
              order_detail.order_id.toString(), 
              order_detail.products.product_name,
              order_detail.quantity.toString(),
              {
                text: CurrencyFormatter.formatCurrency(+order_detail.products.price),
                alignment: 'right',
              },
              {
                text: CurrencyFormatter.formatCurrency(+order_detail.quantity * +order_detail.products.price),
                alignment: 'right',
              },
            ]),
          ],
        },
      },
      '\n',
      // Total section
      {
        columns: [
          {
            width: '*',
            text: '',
          },
          {
            width: 'auto',
            layout: 'noBorders',
            table: {
              body: [
                [
                  { bold: true, text: 'Subtotal' },
                  {
                    text: CurrencyFormatter.formatCurrency(subTotal),
                    alignment: 'right',
                  },
                ],
                [
                  { bold: true, text: 'Total' },
                  {
                    text: CurrencyFormatter.formatCurrency(total),
                    alignment: 'right',
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
