import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { SearchCountryByDto } from './dtos';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // Seccion 3
  @Get()
  hello(@Res() response: Response) {
    const pdfDoc = this.reportsService.hello();
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'test.pdf';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('employee-letter/:employeeId')
  async employeeLetter(
    @Res() response: Response,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    const pdfDoc = await this.reportsService.employeeLetter(employeeId);
    pdfDoc.info.Title = 'employee-letter.pdf';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  // Seccion 4
  @Get('countries')
  async countries(
    @Res() response: Response,
    @Query() searchCountryByDto: SearchCountryByDto,
  ) {
    const pdfDoc = await this.reportsService.getCountries(searchCountryByDto);
    pdfDoc.info.Title = 'countries-data.pdf';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  // Seccion 5
  @Get('orders/details/:orderId')
  async orderDetails(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.getOrderDetailsReport(orderId);
    pdfDoc.info.Title = 'order-details.pdf';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  // Seccion 6
  @Get('svg-charts-report')
  async svgChartsReport(@Res() response: Response) {
    const pdfDoc = await this.reportsService.getSVGGraphicsReport();
    pdfDoc.info.Title = 'svg-charts.pdf';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('company-stadistics')
  async companyStadistics(@Res() response: Response) {
    const pdfDoc = await this.reportsService.companyStadistics();
    pdfDoc.info.Title = 'stadistics.pdf';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('html-to-pdf-report')
  getHtmlToPDFReport(@Res() response: Response) {
    const pdfDoc = this.reportsService.getHtmlToPdfReport();
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'html-to-pdf-report.pdf';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('html-to-pdf-report-3')
  getHtmlToPDFReport3(@Res() response: Response) {
    const pdfDoc = this.reportsService.getHtmlToPdfReport3();
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'html-to-pdf-report.pdf';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('html-to-pdf-report-personalized')
  getComunityReport(@Res() response: Response) {
    const pdfDoc = this.reportsService.getComunityReport();
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'community-report.pdf';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('custom-size-report')
  CustomSizeReport(@Res() response: Response) {
    const pdfDoc = this.reportsService.getCustomSizeReport();
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'custom-size-report.pdf';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
