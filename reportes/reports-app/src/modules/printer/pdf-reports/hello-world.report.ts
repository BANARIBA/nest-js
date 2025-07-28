import { TDocumentDefinitions } from 'pdfmake/interfaces';

interface ReportOptions {
  name: string;
}

export const helloWorldReport = (
  options: ReportOptions,
): TDocumentDefinitions => {
  const { name } = options;
  const docDefinition: TDocumentDefinitions = {
    content: [`Hola! soy ${name}.`],
  };
  return docDefinition;
};
