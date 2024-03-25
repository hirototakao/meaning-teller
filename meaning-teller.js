'use strict';
import bolt from '@slack/bolt';
import dotenv from 'dotenv';
import chalk from 'chalk';
import XlsxPopulate from "./node_modules/xlsx-populate/lib/XlsxPopulate.js";
import { returnChannelList } from './meaning-teller-class.js';
import { contentShare } from './meaning-teller-class.js';
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
          const retrievedValue = sheet.find(userInput)[0].address();
          console.log(chalk.green(`Cell Address: ${retrievedValue}`));
          if(retrievedValue !== undefined) {
            const desiredValue = retrievedValue.slice(1);
            await say(`Certainly <@${message.user}>, Here's meaning of *${sheet.cell(`A${desiredValue}`).value()}*.`);  
            await say(`*Meaning:* ${sheet.cell(`B${desiredValue}`).value()}`);
            await say(`*Synonyms:* ${sheet.cell(`C${desiredValue}`).value()}`);
            await say(`*URL:* ${sheet.cell(`D${desiredValue}`).value()}`);
          }
        }).catch(error => {
          console.error(chalk.red("Error occurred:", error));
        });
        });   
  
     //create-meaning function
     app.message(/create mea/i, async({say}) => {
        say('Please type in word, as in *"create word (type in here)"*.');
     });
     app.message(/create word (.+)/i, async({message, say}) => {
        const userInput = message.text.match(/create word (.+)/i)[1];
        if(userInput ===  meaningObject[userInput].index) {
          say(`Selected word is already existed!`);
          return;
        } else {
          await say(`Please type in meaning, as in *"create meaning (type in here)"*.`);
          console.log(chalk.blue(userInput));
          userInputWord = userInput;
        }
      });
     app.message(/create meaning (.+)/i, async({message, say}) => {
      const userInput = message.text.match(/create meaning (.+)/i)[1];
      await say(`Please type in synonyms, as in *"create synonyms (type in here)"*.`);
      console.log(chalk.blue(userInput));
      userInputMeaning = userInput; 
     });

     app.message(/create synonyms (.+)/i, async({message, say}) => {
        const userInput = message.text.match(/create synonyms (.+)/i)[1];
        await say(`Please type in URL, as in *"create URL (type in here)"*.`);
        console.log(chalk.blue(userInput));
        userInputSynonyms = userInput;
     });

     app.message(/create synonyms/i, async({say}) => {
        await say(`Please type in URL, as in *"create URL (type in here)"*.`);
        console.log(chalk.blue('Not set'));
        userInputSynonyms = 'Not set';
     });

      app.message(/create URL (.+)/i, async({message, say}) => {
        const userInputURL = message.text.match(/create URL (.+)/i)[1];
        await say(`Meaning-creation processing has been completed successfully.🥳`);
        console.log(chalk.blue(userInputURL));
        meaningObject[userInputWord] = {index: userInputWord, meaning: userInputMeaning, synonyms: userInputSynonyms, URL: userInputURL};
      });
     
    app.message(/create URL/i, async({say}) => {
      const userInputURL = 'Not set';
      await say(`Meaning-creation processing has been completed successfully.🥳`);
      console.log(chalk.blue('Not set'));
      meaningObject[userInputWord] = {index: userInputWord, meaning: userInputMeaning, synonyms: userInputSynonyms, URL: userInputURL};
    }); 

    app.message(/update (.+)/i, async({message, say}) => {
      const updateAt = message.text.match(/update (.+)/i)[1];
        if(updateAt === meaningObject[updateIndex].index){
          await say(`*Meaning:* ${meaningObject[updateAt].meaning}`);
          await say(`*Synonyms:* ${meaningObject[updateAt].synonyms}`);
          await say(`*URL:* ${meaningObject[updateAt].URL}`);
          await say(`Please select to type in item name and detail that is would like to update in ${updateAt}, as in *"update (item name) (detail). "*.`);
          updateIndex = updateAt;
        } else {
          say('Not found the selected word.');
          return;
        }
   });
   app.message(/update meaning (.+)/i, async({message, say}) => {
    const updateInput = await message.text.match(/update meaning (.+)/i)[1];
    await say(`It successfully updated meaning.😍 Please make sure whether enabled you to check same meaning or not.`);
    console.log(`UpdatedMeaning: ${updateInput}`);
    meaningObject[updateIndex].meaning = updateInput;
    }); 

  app.message(/update synonyms (.+)/i, async({message, say}) => {
    const updateInput = await message.text.match(/update synonyms (.+)/i)[1];
    await say(`It successfully updated meaning.😍 Please make sure whether enabled you to check same synonyms or not.`);
    console.log(`UpdatedSynonyms: ${updateInput}`);
    meaningObject[updateIndex].synonyms = updateInput;
    }); 

  app.message(/update URL (.+)/i, async({message, say}) => {
    const updateInput = await message.text.match(/update URL (.+)/i)[1];
    await say(`It successfully updated meaning.😍 Please make sure whether enabled you to check same URL or not.`);
    console.log(`UpdatedURL: ${updateInput}`);
    meaningObject[updateIndex].URL = updateInput;
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
          console.log(chalk.blue(`ChannelId: ${channelId}`));
          console.log(chalk.blue(`Latest message: ${message}`));
          console.log(chalk.blue(`PostedBy: ${postedBy}`));
          console.log(chalk.blue(`PostedChannel: ${postedChannel}`));
          await say(`Here's latest message of <#${channelId}|${channel.name}> below.`);
          await say(`*Latest message:* ${message}`);
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
     
