export class DateFormatter {
  static formatter = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
  static getDDMMYYYY(date: Date): string {
    return DateFormatter.formatter.format(date);
  }
}
