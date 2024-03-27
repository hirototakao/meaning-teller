'use strict';

import bolt from '@slack/bolt';
import dotenv from 'dotenv';
import chalk from 'chalk';
import XlsxPopulate from "./node_modules/xlsx-populate/lib/XlsxPopulate.js";
dotenv.config();

const app = new bolt.App(
  { token: process.env.SLACK_BOT_TOKEN, 
    appToken: process.env.SLACK_APP_TOKEN, 
    socketMode: true, 
    logLevel: 'debug' 
  });     
  
  async function creatingData(userInputWord, userInputMeaning, userInputSynonyms, userInputURL) {
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