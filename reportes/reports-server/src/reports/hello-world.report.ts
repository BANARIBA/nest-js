import { TDocumentDefinitions } from 'pdfmake/interfaces';

type ReportOptions = {
    name: string;
}

export const getHelloWorldReport = ({name}: ReportOptions): TDocumentDefinitions => {
  const docDefinition: TDocumentDefinitions = {
    content: [`Hello & Welcome: ${name}`],
  };

  return docDefinition;
};
