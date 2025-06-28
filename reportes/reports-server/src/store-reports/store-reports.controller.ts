import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { StoreReportsService } from './store-reports.service';
import { Response } from 'express';

@Controller('store-reports')
export class StoreReportsController {
  constructor(
    private readonly storeReportsService: StoreReportsService
  ) {}

  @Get("order/:orderId")
  async getOrderReport(@Param("orderId", ParseIntPipe) orderId: number, @Res() response: Response) {
    const pdfDoc = await this.storeReportsService.getOrderReport(+orderId);
    pdfDoc.info.Title = `Order-Report-${orderId}.pdf`;
    response.setHeader("Content-Type", "application/pdf");
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get("svg-charts")
  async getSvgChartPdf(@Res() response: Response) {
    const pdfDoc = await this.storeReportsService.getSvgChartPdfDoc();
    pdfDoc.info.Title = "svg-charts-report.pdf";
    response.setHeader("Content-Type", "application/pdf");
    pdfDoc.pipe(response);
    pdfDoc.end();

  }

  @Get("countries-stadistics-chart")
  async getCustomersByCountryReport (@Res() response: Response) {
    const pdfDoc =  await this.storeReportsService.getCustomersByCountryReportGraphics();
    pdfDoc.info.Title = "";
    response.setHeader("Content-Type", "application/pdf");
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
