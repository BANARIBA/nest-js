import { TDocumentDefinitions } from 'pdfmake/interfaces';

export const getCommunityPdfReport = (): TDocumentDefinitions => {
  const docDefinition: TDocumentDefinitions = {
    defaultStyle: { fontSize: 10 },
    content: [
      {
        columns: [
          {
            image: 'src/assets/tucan-code-logo.png',
            width: 50,
          },
          {
            text: `Forestal Admin Community SAP\n RUT: 44.123.12.33\nCamino Montana km 14\nTelefono: 312.3123.123123`,
            alignment: 'center',
          },
          {
            width: 140,
            alignment: 'right',
            layout: 'borderBlue',
            table: {
              body: [
                [
                  {
                    layout: 'noBorders',
                    table: {
                      body: [
                        ['No. Factura:', '123-456'],
                        ['Fecha:', '2025-07-30'],
                        ['Version:', '2025-001'],
                      ],
                    },
                  },
                ],
              ],
            },
          },
        ],
      },
      // LINEA HORIZONTAL
      {
        margin: [0, 5],
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 5,
            x2: 515,
            y2: 5,
            lineWidth: 1,
            lineColor: '#3A4546',
          },
        ],
      },
      // DETALLES DEL CLIENTE, TABLA COMPLEJA
      {
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            [
              {
                text: 'Datos del cliente',
                fillColor: '#5775E1',
                color: 'white',
                colSpan: 4,
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {},
              {},
              {},
            ],
            // Razon social
            [
              {
                text: 'Razon Social',
                fillColor: '#343A40',
                color: 'white',
                bold: true,
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'Nombre de la empresa',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'Direccion',
                fillColor: '#343A40',
                color: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'Calle falsa 123',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
            ],
            // RUT
            [
              {
                text: 'RUT',
                fillColor: '#343A40',
                color: 'white',
                bold: true,
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'Kamehouse city km 10000',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'Telefono',
                fillColor: '#343A40',
                color: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: '99-99-99-99',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
            ],
            // GIRO Y CONDICION DE PAGO
            [
              {
                text: 'GIRO',
                fillColor: '#343A40',
                color: 'white',
                bold: true,
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'Paypal',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'Condicion de pago',
                fillColor: '#343A40',
                color: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'PENDIENTE',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
            ],
          ],
        },
      },
      {
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            [
              {
                text: 'ss',
                fillColor: 'white',
                color: 'white',
                colSpan: 4,
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {},
              {},
              {},
            ],
            [
              {
                text: 'Nombre del Proyecto',
                fillColor: '#343A40',
                color: 'white',
                bold: true,
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'APP SAR',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'Contacto',
                fillColor: '#343A40',
                color: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'bti.proyectos@google.com',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
            ],
            [
              {
                text: 'Direccion',
                fillColor: '#343A40',
                color: 'white',
                bold: true,
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'COLONIA DEL NORESTE',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'Email',
                fillColor: '#343A40',
                color: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'bti.proyectos@google.com',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
            ],
            [
              {
                text: 'Ciudad',
                fillColor: '#343A40',
                color: 'white',
                bold: true,
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'CIUDAD DEL NORESTE',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: 'Telefono',
                fillColor: '#343A40',
                color: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
              {
                text: '99-99-99-99',
                fillColor: 'white',
                // border: [false, false, false, false], // Elimina todos los borders izq, der, arriba, abajo
              },
            ],
          ],
        },
      }
    ],
  };

  return docDefinition;
};
