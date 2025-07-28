import fs from 'node:fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrinterService } from '../printer/printer.service';
import {
  countriesReport,
  employeeLetterReport,
  getStadisticsReport,
  helloWorldReport,
  OrderData,
  orderDetailsReport,
  svgGraphicsReport,
} from '../printer/pdf-reports';
import { PrismaService } from 'src/common/services/prisma.service';
import { SearchCountryByDto } from './dtos';
import { Prisma } from '@prisma/client';
import { getHtmlToPdfMakeContent } from 'src/utils';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from '../printer/pdf-reports/sections/header.section';
import { footerSection } from '../printer/pdf-reports/sections/footer.section';
import { getCommunityPdfReport } from '../printer/pdf-reports/community-report';

@Injectable()
export class ReportsService {
  constructor(
    public readonly prismaService: PrismaService,
    public readonly printerService: PrinterService,
  ) {}

  public hello() {
    const report = helloWorldReport({ name: 'Goku' });
    const doc = this.printerService.createPdf(report);
    return doc;
  }

  public async employeeLetter(employeeId: number) {
    const employee = await this.prismaService.employees.findUnique({
      where: { id: employeeId },
    });
    if (!employee)
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    const report = employeeLetterReport({
      employeerName: 'Goku Perez',
      employeerPosition: 'Gerente Recursos Humanos',
      employeeName: employee.name,
      employeePosition: employee.position,
      employeeStartDate: employee.start_date,
      employeeHours: employee.hours_per_day,
      employeeWorkSchedule: employee.work_schedule,
      employeeCompanyName: 'Empresa de Pruebas S.A.',
    });
    const doc = this.printerService.createPdf(report);
    return doc;
  }

  public async getCountries(searchCountryByDto: SearchCountryByDto) {
    const where: Prisma.countriesWhereInput = {
      local_name: {
        not: null,
      },
    };

    if (
      searchCountryByDto.continent &&
      searchCountryByDto.continent.trim() !== ''
    ) {
      where.continent = {
        equals: searchCountryByDto.continent,
      };
    }

    const countriesData = await this.prismaService.countries.findMany({
      where,
    });
    const report = countriesReport({ countries: countriesData });
    const doc = this.printerService.createPdf(report);
    return doc;
  }

  /*
    select 
	    * 
    from orders 
    inner join order_details on (orders.order_id= order_details.order_id)
    inner join products on (order_details.product_id = products.product_id)
    inner join customers on (orders.customer_id= customers.customer_id) 
    where orders.order_id = 10250
  */
  public async getOrderDetailsReport(orderId: number) {
    const order = await this.prismaService.orders.findUnique({
      where: {
        order_id: orderId,
      },
      include: {
        customers: true,
        order_details: {
          include: {
            products: true,
          },
        },
      },
    });
    if (!order)
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    const report = orderDetailsReport({ order: order as unknown as OrderData });
    const doc = this.printerService.createPdf(report);
    return doc;
  }

  public async getSVGGraphicsReport() {
    const report = await svgGraphicsReport();
    const doc = this.printerService.createPdf(report);
    return doc;
  }

  /*
    select count(*) as quantity, country from customers group by country order by count(*) desc limit 10
  */
  public async companyStadistics() {
    const data = await this.prismaService.customers.groupBy({
      by: ['country'],
      _count: true,
      orderBy: {
        _count: {
          country: 'desc',
        },
      },
      take: 10,
    });

    const topCountriesData = data.map((country) => ({
      country: country.country || 'Sin nombre',
      customers: country._count,
    }));

    const report = await getStadisticsReport({
      topCountries: topCountriesData,
    });
    const doc = this.printerService.createPdf(report);
    return doc;
  }

  public getHtmlToPdfReport() {
    const htmlToPdfReport = fs.readFileSync(
      'src/modules/printer/pdf-reports/html/basic-report-02.html',
      'utf8',
    );
    const content = getHtmlToPdfMakeContent(htmlToPdfReport);
    const docDefinition: TDocumentDefinitions = {
      pageMargins: [40, 110, 40, 60],
      header: headerSection({
        title: 'HTML to PDFMake',
        subTitle: 'VEAMOS COMO SE VE',
        showLogo: true,
        showDate: true,
      }),
      footer: footerSection,
      content: content,
    };
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }

  public getHtmlToPdfReport3() {
    const htmlToPdfReport = fs.readFileSync(
      'src/modules/printer/pdf-reports/html/basic-report-03.html',
      'utf8',
    );
    const content = getHtmlToPdfMakeContent(htmlToPdfReport, {
      client: 'GOKU PEREZ KAKAROTO',
      title: 'Curso NodeJS',
    });
    const docDefinition: TDocumentDefinitions = {
      pageMargins: [40, 110, 40, 60],
      header: headerSection({
        title: 'HTML to PDFMake',
        subTitle: 'VEAMOS COMO SE VE',
        showLogo: true,
        showDate: true,
      }),
      footer: footerSection,
      content: content,
    };
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }

  public getComunityReport() {
    const docDefinition = getCommunityPdfReport();
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }

  public getCustomSizeReport() {
    const doc = this.printerService.createPdf({
      // pageSize: 'TABLOID',
      pageSize: {
        width: 150,
        height: 300,
      },
      content: [
        {
          qr: 'https://devtalles.com',
          fit: 100,
          alignment: 'center',
        },
        {
          text: 'Reporte con tamanio',
          fontSize: 10,
          alignment: 'center',
          margin: [20, 20],
        },
      ],
    });
    return doc;
  }
}
