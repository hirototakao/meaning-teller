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

  export async function contentShare(messageRelatedInfo) {
    const channelName = messageRelatedInfo.text.match(/share (.+)/i)[1];
    const postedBy = messageRelatedInfo.user;
    const postedChannel = messageRelatedInfo.channel;
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
        const messages = [`Here's latest message of <#${channelId}|${channel.name}> below.`,
                          `*Latest message:* ${message}`];
        for(let i = 0; i < messages.length; i++){
          await app.client.chat.postMessage({
            channel: messageRelatedInfo.channel,
            text: messages[i]
          });
        }
      }
      });
      
  } catch(error) {
    console.log(chalk.red(error));
    await say("Latest Message couldn't find from the channel.");
    await say('Access the channel below to make sure whether this chanel existed latest message or not.');
    channels.forEach(async (channel) => {
      if(channel.name === channelName) {
        const channelId = channel.id;
        await app.client.chat.postMessage({
          channel: channelId,
          text: `<${channelId}|${channelName}>`
        });
      }
   });
  }
   }

export async function returnChannelList(callback) {
  const conversationLists = await app.client.conversations.list({
    token: process.env.SLACK_BOT_TOKEN,
    types: "public_channel,private_channel"
    });
    callback(conversationLists.channels);
} 