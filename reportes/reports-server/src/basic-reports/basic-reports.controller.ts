import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { BasicReportsService } from './basic-reports.service';
import { Response } from 'express';
import { GetCountriesByDto } from './dtos/get-countries-by.dto';

@Controller('basic-reports')
export class BasicReportsController {
  constructor(private readonly basicReportsService: BasicReportsService) {}

  @Get()
  hello (@Res() response: Response) {
    const pdfDoc = this.basicReportsService.hello();
    pdfDoc.info.Title = "Hello-World.pdf";
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get("employee-letter")
  employeeLetter (@Res() response: Response) {
    const pdfDoc = this.basicReportsService.employeeLetter();
    pdfDoc.info.Title = "Employee-Letter.pdf";
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get("employee-letter/:employeeId")
  async employeeLetterById (@Res() response: Response, @Param('employeeId') employeeId: string) {
    const pdfDoc = await this.basicReportsService.employeeLetterById(+employeeId);
    pdfDoc.info.Title = "Employee-Letter-By-Code.pdf";
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  // http://localhost:3000/basic-reports/countries Or http://localhost:3000/basic-reports/countries?continent=Oceania
  @Get("countries")
  async getCountriesReport(
    @Query() getCountriesByDto: GetCountriesByDto,
    @Res() response: Response
  ) {
    const pdfDoc = await this.basicReportsService.getCountryReport(getCountriesByDto);
    pdfDoc.info.Title = "Countries-Report.pdf";
    response.setHeader("Content-Type", "application/pdf");
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
