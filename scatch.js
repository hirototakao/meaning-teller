"use strict";
import bolt from '@slack/bolt';
import dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config();

const app = new bolt.app(
{
 token: process.env.SLACK_BOT_TOKEN,
 appToken: process.env.SLACK_APP_TOKEN,
 socketMode: true,
 logLevel: 'debug'
});

async function getIPAddress(n, page) {
try {
 const userInformation = await app.client.team.accessLogs({
   token:process.env.SLACK_BOT_TOKEN,
   before: 1701620221,
   count: n,
   page: page,
   limit: 1
 });

 console.log(chalk.blue(userInformation));
} catch(error) {
  console.error(chalk.red(error));
}
}

getIPAddress("1", "12");
