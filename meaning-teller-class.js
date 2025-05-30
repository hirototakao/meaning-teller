'use strict';

import bolt from '@slack/bolt';
import dotenv from 'dotenv';
import chalk from 'chalk';
import puppeteer from "puppeteer";
import XlsxPopulate from "./node_modules/xlsx-populate/lib/XlsxPopulate.js";
dotenv.config();

const app = new bolt.App(
  { token: process.env.SLACK_BOT_TOKEN, 
    appToken: process.env.SLACK_APP_TOKEN, 
    socketMode: true, 
    logLevel: 'debug' 
  });     
  
  export async function creatingData(userInputWord, userInputMeaning, userInputSynonyms, userInputURL) {
    XlsxPopulate.fromFileAsync("./meaning-teller.xlsx").then( async(workbook) => {
      const sheet = workbook.sheet(0);
      const EndOfUsedValue = workbook.sheet(0).usedRange().address().slice(4);
      console.log(EndOfUsedValue);
      sheet.cell(`A${EndOfUsedValue}`).relativeCell(1, 0).value(userInputWord);
      sheet.cell(`B${EndOfUsedValue}`).relativeCell(1, 0).value(userInputMeaning);
      sheet.cell(`C${EndOfUsedValue}`).relativeCell(1, 0).value(userInputSynonyms);
      sheet.cell(`D${EndOfUsedValue}`).relativeCell(1, 0).value(userInputURL);
      return workbook.toFileAsync("./meaning-teller.xlsx");
    });
  }

    export async function createMeaning(userInputWord, userInputMeaning, userInputSynonyms, userInputURL) {
      if(userInputURL === undefined || userInputURL === ""){
        userInputURL = 'Not set';
        if(userInputSynonyms === undefined || userInputSynonyms === ""){
          userInputSynonyms = "Not set";
          await creatingData(userInputWord, userInputMeaning, userInputSynonyms, userInputURL);
        } else {
          await creatingData(userInputWord, userInputMeaning, userInputSynonyms, userInputURL);
        }
      } else {
        if(userInputSynonyms === undefined || userInputSynonyms === ""){
          userInputSynonyms = "Not set";
          await creatingData(userInputWord, userInputMeaning, userInputSynonyms, userInputURL);
        } else {
          await creatingData(userInputWord, userInputMeaning, userInputSynonyms, userInputURL);
        }
      }
    }    

export async function returnChannelList(callback) {
  const conversationLists = await app.client.conversations.list({
    token: process.env.SLACK_BOT_TOKEN,
    types: "public_channel,private_channel"
  });
  callback(conversationLists.channels);
  } 

  export async function scrape_data_from_Online(word) {

    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    
    const meaningUrl = `https://dictionary.cambridge.org/dictionary/english/${word}`;
    
    const synonymUrl = `https://dictionary.cambridge.org/thesaurus/${word}`;
    
    const selectors = ["article#page-content .page .pr.dictionary .link .pr.di.superentry .di-body .entry .entry-body .pr.entry-body__el .pos-body .pr.dsense.dsense-noh .sense-body.dsense_b .def-block.ddef_block. .ddef_h .def.ddef_d.db", 
                       "article#page-content .page .pr.dictionary .link .pr.di.superentry .di-body .entry .entry-body .pr.entry-body__el .pos-body .pr.dsense .sense-body.dsense_b .def-block.ddef_block .ddef_h .def.ddef_d.db",
                       "article#page-content .page .pr.dictionary .link .pr.di.superentry .di-body .entry .entry-body .pr.entry-body__el .pos-body .pr.dsense. .sense-body.dsense_b .def-block.ddef_block .hflxrev.hdf-xs.hdb-s.hdf-l .hflx1 .ddef_h .def.ddef_d.db"];    
    
    try {
    let meaning = null;
    for(let selector of selectors){
      try {
        const text_Content = await page.$eval(selector, el => el.textContent);
        if(text_Content) {
          meaning = text_Content;
          console.log(chalk.blue("Meaning:", meaning));
          break;
        }
      } catch(error) {
        meaning = "Not set";
        continue;
      }  
    }
    
    await page.goto(synonymUrl);
       
    const synonyms = await page.$$eval("a span.dx-h.dthesButton.synonym", el => {
       return `${el[0].innerText}, ${el[1].innerText, el[2].innerText}, ${el[3].innerText}, ${el[4].innerText}`;
    });
    await browser.close();
    
    const meaningData = {meaning, synonyms, meaningUrl};
    return meaningData;
  } catch(error) {
    console.error(chalk.red("An error occurred:", error));
    throw error;
  }
}