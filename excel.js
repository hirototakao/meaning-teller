import XlsxPopulate from "./node_modules/xlsx-populate/lib/XlsxPopulate.js";
import chalk from 'chalk';

XlsxPopulate.fromFileAsync("./meaning-teller.xlsx").then( async(workbook) => {
  const desiredValue = workbook.find("Hello")[0].address().slice(1);
   console.log(workbook.sheet(0).cell(`B${desiredValue}`).value());
}).then(() => {
  console.log(chalk.green("Excel file has been successfully written."));
}).catch(error => {
  console.error(chalk.red("Error occurred:", error));
});