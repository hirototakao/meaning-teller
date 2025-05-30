import XlsxPopulate from "./node_modules/xlsx-populate/lib/XlsxPopulate.js";
import chalk from 'chalk';

XlsxPopulate.fromFileAsync("./meaning-teller.xlsx").then( async(workbook) => {
  const desiredValue = workbook.find("segregate")[0]._value;
   console.log(desiredValue);
   console.log(workbook.sheet(0).cell(`B${desiredValue}`).value());
   console.log(workbook.sheet(0).usedRange().address());
}).then(() => {
  console.log(chalk.green("Excel file has been successfully written."));
}).catch(error => {
  console.error(chalk.red("Error occurred:", error));
});