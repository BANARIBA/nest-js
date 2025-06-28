import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrinterService } from 'src/printer/printer.service';
import {
  getEmploymentLetter,
  getEmploymentLetterById,
  getHelloWorldReport,
} from 'src/reports';
import { getCountriesReport } from 'src/reports/countries.report';
import { GetCountriesByDto } from './dtos/get-countries-by.dto';

@Injectable()
export class BasicReportsService extends PrismaClient implements OnModuleInit {
  private readonly logger: Logger = new Logger(
    'PRISMA Basic Reports Srv Loaded',
  );

  constructor(private readonly printerService: PrinterService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database Connected!');
  }

  public hello() {
    const doc = this.printerService.createPDF(
      getHelloWorldReport({ name: 'Goku' }),
    );
    return doc;
  }

  public employeeLetter() {
    const doc = this.printerService.createPDF(getEmploymentLetter());
    return doc;
  }

  public async employeeLetterById(employeeId: number) {
    const employee = await this.employees.findUnique({
      where: { id: employeeId },
    });
    if (!employee) throw new NotFoundException('Empleado no encontrado.');
    const doc = this.printerService.createPDF(
      getEmploymentLetterById({
        employeerName: 'Goku Perez Kakaroto',
        employeerPosition: 'Manager RRHH',
        employeeName: employee.name,
        employeePosition: employee.position,
        employeeStartDate: employee.start_date,
        employeeHours: employee.hours_per_day,
        employeeWorkSchedule: employee.work_schedule,
        employeeCompany: 'Tucan Code Corp.',
      }),
    );
    return doc;
  }

  public async getCountryReport(getCountriesByDto: GetCountriesByDto) {
    const searchBy: {[key: string]: string} = {};
    if (getCountriesByDto.continent) {
      searchBy.continent = getCountriesByDto.continent;
    }
    const countries = await this.countries.findMany({
      where: {
        local_name: {
          not: null,
        },
        ...searchBy,
      },
    });
    return this.printerService.createPDF(
      getCountriesReport({ countries: countries }),
    );
  }
}
