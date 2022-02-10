// imports
const ExcelJS = require('exceljs');
const FileSaver = require('file-saver');

// exports
export default function workbook() {
  return {
    create(params) {
      const { sheetName, headers } = params;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(sheetName || 'sheet01');

      worksheet.columns = headers;
      return Promise.resolve({ workbook, worksheet });
    },
    addRows(params) {
      const { rows, worksheet } = params;

      worksheet.addRows(rows);
      return Promise.resolve();
    },
    writeToDisk(params) {
      const { workbook, fileName } = params;
      return workbook.xlsx.writeBuffer()
        .then(buffer => FileSaver.saveAs(new Blob([buffer]), fileName || `${Date.now()}_workbook.xlsx`));
    }
  };
}