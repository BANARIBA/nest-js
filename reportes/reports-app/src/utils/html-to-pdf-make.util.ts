import htmlToPdfMake from 'html-to-pdfmake';
import { JSDOM } from 'jsdom';

interface ContentReplacer {
  [key: string]: string;
}

export const getHtmlToPdfMakeContent = (html: string, replacers: ContentReplacer = {}) => {
  Object.entries(replacers).forEach(([key, value]) =>{
    const key1 = `{{ ${key} }}`;
    const key2 = `{{${key}}}`;
    html = html.replaceAll(key1, value).replaceAll(key2, value);
  });
  const { window } = new JSDOM();
  return htmlToPdfMake(html, { window: window });
};
