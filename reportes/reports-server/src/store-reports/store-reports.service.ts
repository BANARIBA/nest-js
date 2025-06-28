import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrinterService } from 'src/printer/printer.service';
import {
  basicChartSvgReport,
  getOrderReportPdf,
  getCountriesStadisticsReport,
} from 'src/reports';

@Injectable()
export class StoreReportsService extends PrismaClient implements OnModuleInit {
  constructor(private readonly printerService: PrinterService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  public async getOrderReport(orderId: number) {
    const order = await this.orders.findUnique({
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
      throw new NotFoundException(`La orden ${orderId} no fue encontrada.`);
    const doc = this.printerService.createPDF(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      getOrderReportPdf(order as any),
    );
    return doc;
  }

  public async getSvgChartPdfDoc() {
    const docDefinition = await basicChartSvgReport();
    const doc = this.printerService.createPDF(docDefinition);
    return doc;
  }

  public async getCustomersByCountryReportGraphics() {
    /* QUERY => SELECT Count(*) AS CustomersQuantity, Country FROM Customers GROUP BY Country ORDER BY Count(*) DESC LIMIT 10;*/
    const topCountries = await this.customers.groupBy({
      by: ['country'],
      _count: true,
      orderBy: {
        _count: {
          country: 'desc',
        },
      },
      take: 10,
    });

    const topCountryData = topCountries.map((country) => ({
      country: country.country!,
      customers: country._count,
    }));

    const docDefinition = await getCountriesStadisticsReport({
      topCountries: topCountryData,
    });
    const doc = this.printerService.createPDF(docDefinition);
    return doc;
  }
}
