import { Injectable } from '@nestjs/common';
import {
  BufferOptions,
  CustomTableLayout,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';

// Define font files
const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf',
  },
};

const customTableLayouts: Record<string, CustomTableLayout> = {
  customLayout01: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return i === node.table.headerRows ? 2 : 1;
    },
    vLineWidth: function (i) {
      return 0;
    },
    hLineColor: function (i) {
      return i === 1 ? 'black' : '#bbbbbb';
    },
    paddingLeft: function (i) {
      return i === 0 ? 0 : 8;
    },
    paddingRight: function (i, node) {
      const colCount = node.table.body[0].length;
      return i === colCount - 1 ? 0 : 8;
    },
    fillColor: function (i, node) {
      if (i === 0) return "#7b90be";
      if (i === node.table.body.length - 1) return "#7b90bf"; // si estamos en la ultima linea del arreglo
      return i % 2 === 0 ? "#f3f3f3" : "#fff";
    }
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts);

  createPDF(
    documentDefinitions: TDocumentDefinitions,
    options: BufferOptions = {
      tableLayouts: customTableLayouts,
    },
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(documentDefinitions, options);
  }
}
