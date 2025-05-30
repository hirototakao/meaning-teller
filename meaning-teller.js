'use strict';
import bolt from '@slack/bolt';
import dotenv from 'dotenv';
import chalk from 'chalk';
import XlsxPopulate from "./node_modules/xlsx-populate/lib/XlsxPopulate.js";
import puppeteer from "puppeteer";
import { scrape_data_from_Online } from "./meaning-teller-class.js";
import { createMeaning } from './meaning-teller-class.js';
import { creatingData } from "./meaning-teller-class.js";
import { returnChannelList } from './meaning-teller-class.js';
dotenv.config();
const app = new bolt.App(
  { token: process.env.SLACK_BOT_TOKEN, 
    appToken: process.env.SLACK_APP_TOKEN, 
    socketMode: true, 
    logLevel: 'debug' 
  });           

      let userInputWord; // A index and word of posted userInput.
      let userInputMeaning; // A meaning of posted userInput.
      let userInputSynonyms; // A synonyms of posted userInput
      let updateIndex; // A index which is update to

      app.message(/mea (.+)/i, async({message, say}) => {
        const userInput = await message.text.match(/mea (.+)/i)[1];
        XlsxPopulate.fromFileAsync("./meaning-teller.xlsx").then( async(workbook) => {
          const sheet = workbook.sheet(0);
          const retrievedValue = sheet.find(userInput)[0];
          console.log(chalk.green(`Cell Address: ${retrievedValue}`));
          try {
            const desiredValue = retrievedValue.address().slice(1);
            console.log(desiredValue);
            await say(`Certainly <@${message.user}>, Here's meaning of *${sheet.cell(`A${desiredValue}`).value()}*.`);  
            await say(`*Meaning:* ${sheet.cell(`B${desiredValue}`).value()}`);
            await say(`*Synonyms:* ${sheet.cell(`C${desiredValue}`).value()}`);
            await say(`*URL:* ${sheet.cell(`D${desiredValue}`).value()}`);
          } catch(error) {
            //If there is no precisely matched word.
            console.error(chalk.red(error));
            await say("It's auto-generating meaning of the word...");
            const scrapingResult = await scrape_data_from_Online(userInput);
            if(scrapingResult === null) {
              say("It failed to auto-generate the meaning of the word. Please try again, or please create the meaning of the word if possible.");
              return;
            } 
            await say(`Certainly, <@${message.user}>, Here're meaning of *${userInput}*.`);
            await say(`*Meaning:* ${scrapingResult.meaning}`);
            await say(`*Synonyms:* ${scrapingResult.synonyms}`);
            await say(`*URL:* ${scrapingResult.meaningUrl}`);
            creatingData(userInput, scrapingResult.meaning, scrapingResult.synonyms, scrapingResult.meaningUrl);
          }

        }).catch(error => {
          console.error(chalk.red("Error occurred:", error));
        });
        });   
  
     app.message(/create word (.+)/i, async({message, say}) => {
        const userInput = message.text.match(/create word (.+)/i)[1];
        XlsxPopulate.fromFileAsync("./meaning-teller.xlsx").then(async(workbook) => {
          const sheet = workbook.sheet(0);
          const retrievedValue = sheet.find(userInput)[0];
          console.log(retrievedValue);
          if(retrievedValue === undefined) {
            await say(`Please type in meaning, as in *"create meaning (type in here)"*.`);
            userInputWord = userInput;
          }

        });
      });
     app.message(/create meaning (.+)/i, async({message, say}) => {
      const userInput = message.text.match(/create meaning (.+)/i)[1];
      await say(`Please type in synonyms, as in *"create synonyms (type in here)"*.`);
      userInputMeaning = userInput; 
     });

     app.message(/create synonyms (.+)/i, async({message, say}) => {
        const userInput = message.text.match(/create synonyms (.+)/i)[1];
        if(userInput === undefined || userInput === ""){
        await say(`Please type in URL, as in *"create URL (type in here)"*.`);
        userInputSynonyms = 'Not set';            
        }
        await say(`Please type in URL, as in *"create URL (type in here)"*.`);
        userInputSynonyms = userInput;
     });

      app.message(/create URL (.+)/i, async({message, say}) => {
        const userInputURL = message.text.match(/create URL (.+)/i)[1];
        await createMeaning(userInputWord, userInputMeaning, userInputSynonyms, userInputURL);
        await say(`Meaning-creation processing has been completed successfully.🥳`);
      });

  app.message(/update (.+)/i, async({message, say}) => {
    const userInput = message.text.match(/update (.+)/i)[1];
    console.log(chalk.blue(`User message: ${userInput}`));
    const workbook = await XlsxPopulate.fromFileAsync("./meaning-teller.xlsx");
      const sheet = workbook.sheet(0);
      updateIndex = await sheet.find(userInput)[0].address().slice(1);
      console.log(chalk.green(`Row number: ${updateIndex}`));
        await say(`Certainly <@${message.user}>, Please check data of selected word "*${sheet.cell(`A${updateIndex}`).value()}*".`);  
        await say(`*Meaning:* ${sheet.cell(`B${updateIndex}`).value()}`);
        await say(`*Synonyms:* ${sheet.cell(`C${updateIndex}`).value()}`);
        await say(`*URL:* ${sheet.cell(`D${updateIndex}`).value()}`);
        await say(`Please select to type in item name and detail that is would like to update in frame, as in "*update (item name) (detail)*".`)
  });

  app.message(/update meaning (.+)/i, async({message, say}) => {
    const updateInput = await message.text.match(/update meaning (.+)/i)[1];
    console.log(chalk.green(`User message: ${updateInput}`));
    XlsxPopulate.fromFileAsync("./meaning-teller.xlsx").then( async(workbook) => {
      const replaceValue = await workbook.sheet(0).cell(`B${updateIndex}`).value();
      console.log(chalk.green(replaceValue));
      await workbook.sheet(0).find(replaceValue, updateInput);
      await say(`It successfully updated meaning.😍 Please try to make sure whether it successfully updated or not if you want.`);
      return workbook.toFileAsync("./meaning-teller.xlsx");
    });
  });

  app.message(/update synonyms (.+)/i, async({message, say}) => {
    const updateInput = await message.text.match(/update synonyms (.+)/i)[1];
    XlsxPopulate.fromFileAsync("./meaning-teller.xlsx").then( async(workbook) => {
      const replaceValue = await workbook.sheet(0).cell(`C${updateIndex}`).value();
      await workbook.sheet(0).find(replaceValue, updateInput);
      await say(`It successfully updated synonyms.😍 Please try to make sure whether it successfully updated or not if you want.`);
      return workbook.toFileAsync("./meaning-teller.xlsx");
    });
  });

  app.message(/update URL (.+)/i, async({message, say}) => {
    const updateInput = await message.text.match(/update URL (.+)/i)[1];
    XlsxPopulate.fromFileAsync("./meaning-teller.xlsx").then( async(workbook) => {
      const replaceValue = await workbook.sheet(0).cell(`D${updateIndex}`).value();
      await workbook.sheet(0).find(replaceValue, updateInput);
      await say(`It successfully updated URL.😍 Please try to make sure whether it successfully updated or not if you want.`);
      return workbook.toFileAsync("./meaning-teller.xlsx");
    });
  });

       //listing-channel function
       app.command('/listchannel', async({ack, say}) => {
          await ack();
          returnChannelList((channels) => {
            channels.forEach(async(channelList) => {
              try{
              const channelIds = channelList.id;
              const channelNames = channelList.name;
               say(`<#${channelIds}|${channelNames}>\nhttps://app.slack.com/client/T05F5GD3ERG/${channelIds}`);
              } catch(error){
                console.log(chalk.red(error));
              }
            });
          });
        });

      //Recommending youtube chanel function 
    app.message(/recommend youtube learning English/i, async({message, say}) => {
      await say(`Certainly, <@${message.user}>. Here's the list of recommended youtube channel for learning English.`);
      await say('<https://www.youtube.com/@Hapaeikaiwapage/videos|Hapa 英会話>');
      await say("This youtube channel is only Japanese version, but I feel like this channel important to wether how you can use simple word a lot and with different way rather than whether can use new expression or word, so I recommend this channel for those who would like to revise learning method for scratch.");
      await say('<https://www.youtube.com/channel/UCgeaC4OEk0t54m2hWQtjjIw|Atsueigo>');
      await say("This channel is kind of channel that managing by people such a hardcore crowd of learning English, so it's extremely professional English and you can learn about learning-method. So if you want to learn more casually or with communication, it's unrecommendable. So I recommend this channel for those who want to learn English in your own country or who would like to plan your learning-method firmly.");
    });
    //function that is easy to share content of other channel.
    app.message(/share (.+)/i, async({message, say}) => {
        const channelName = message.text.match(/share (.+)/i)[1];
        const postedBy = message.user;
        const postedChannel = message.channel;
        const conversationLists = await app.client.conversations.list({
         token: process.env.SLACK_BOT_TOKEN,
         types: "public_channel,private_channel"
        });
        const channels = conversationLists.channels;
      try{
        channels.forEach(async (channel) => {
          if(channel.name === channelName) {
            const channelId = channel.id;
         const result = await app.client.conversations.history({
            token: process.env.SLACK_BOT_TOKEN,
            channel: channelId,
            inclusive: true,
            limit: 1
          });
          const message = result.messages[0].text;
          await say(`Here's latest message of <#${channelId}|${channel.name}> below.`);
          await say(`*Latest message:* ${message}`);
          console.log(chalk.blue(`ChannelId: ${channelId}`));
          console.log(chalk.blue(`Latest message: ${message}`));
          console.log(chalk.blue(`PostedBy: ${postedBy}`));
          console.log(chalk.blue(`PostedChannel: ${postedChannel}`));
        }
        });
        
    } catch(error) {
      console.log(chalk.red(error));
      await say("Latest Message couldn't find from the channel.");
      await say('Access the channel below to make sure whether this chanel existed latest message or not.');
      channels.forEach(async (channel) => {
        if(channel.name === channelName) {
          const channelId = channel.id;
          await say(`<${channelId}|${channelName}>\nhttps://app.slack.com/client/T05F5GD3ERG/${channelId}`);
        }
     });
    }
    });          
    
    app.start();
     
