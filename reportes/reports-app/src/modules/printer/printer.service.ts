import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import type {
  TDocumentDefinitions,
  BufferOptions,
  CustomTableLayout,
} from 'pdfmake/interfaces';

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
    hLineWidth: function (i: number, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return i === node.table.headerRows ? 2 : 1;
    },
    vLineWidth: function (/*i: number*/) {
      return 0;
    },
    hLineColor: function (i: number) {
      return i === 1 ? 'black' : '#aaa';
    },
    paddingLeft: function (i: number) {
      return i === 0 ? 0 : 8;
    },
    paddingRight: function (i: number, node) {
      const widthsLength = node.table.widths?.length ?? 0;
      return i === widthsLength - 1 ? 0 : 8;
    },
    fillColor: function (i: number, node) {
      if (i === 0) {
        return '#7b90be';
      }
      if (i === node.table.body.length - 1) {
        return '#7b90be';
      }
      return i % 2 === 0 ? '#f3f3f3' : '#fff';
    },
  },
  borderBlue: {
    hLineColor: function(){
      return '#5f96d4';
    },
    vLineColor: function(){
      return '#5f96d4';
    }
  }
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts);

  public createPdf(
    docDefinition: TDocumentDefinitions,
    options: BufferOptions = {
      tableLayouts: customTableLayouts,
    },
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, options);
  }
}
