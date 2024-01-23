'use strict';

import bolt from '@slack/bolt';
import dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config();

const app = new bolt.App(
  { token: process.env.SLACK_BOT_TOKEN, 
    appToken: process.env.SLACK_APP_TOKEN, 
    socketMode: true, 
    logLevel: 'debug' 
  });     

export class otherFunction { //class that is handles processing other than main function
   async youtuberRecommend(username, channelId) {
    try {
      const messages = [`Certainly, <@${username}>. Here's the list of recommended youtube channel for learning English.`, 
                      '<https://www.youtube.com/@Hapaeikaiwapage/videos|Hapa 英会話>',
                      "As my impression:\nThis youtube channel is only Japanese version, but I feel like this channel important to wether how you can use simple word a lot and with different way rather than whether can use new expression or word, so I recommend this channel for those who would like to revise learning method for scratch.",
                      '<https://www.youtube.com/channel/UCgeaC4OEk0t54m2hWQtjjIw|Atsueigo>',
                      "As myimpression:\nThis channel is kind of channel that managing by people such a hardcore crowd of learning English, so it's extremely professional English and you can learn about learning-method. So if you want to learn more casually or with communication, it's unrecommendable. So I recommend this channel for those who want to learn English in your own country or who would like to plan your learning-method firmly."];
    for(let i = 0; i < messages.length; i++){
      await app.client.chat.postMessage({
        channel: channelId,
        text: messages[i]
    });
    console.log(chalk.blue(messages[i]));
    }
    } catch(error) {
      console.error(chalk.red(error));
    }
  }
  async listChannel(channelId) {
    const conversationLists = await app.client.conversations.list({
      token: process.env.SLACK_BOT_TOKEN,
      types: "public_channel,private_channel"
      });
      const channels = conversationLists.channels;
      channels.forEach(async(channelList) => {
        try{
        const channelIds = channelList.id;
        const channelNames = channelList.name;
         app.client.chat.postMessage({
          channel: channelId,
          text: `<#${channelIds}|${channelNames}>\nhttps://app.slack.com/client/T05F5GD3ERG/${channelIds}`
         });
        } catch(error){
          console.log(chalk.red(error));
        }
  });
  }
}   