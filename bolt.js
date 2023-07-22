'use strict';
const bolt = require('@slack/bolt');
const dotenv = require('dotenv');
dotenv.config();
const todo = require('todo');

const app = new bolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: 'debug'
});
function sleep(sec) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, sec*1000);
  });
}

async function equal() {
  app.message(/mea equal/i, async function({ message, say }){
      say('Meaning: Something same quality or amount seriously.');
      await sleep(1);
      say('Synonyms: consider, examine');
      await sleep(1);
      say('https://dictionary.cambridge.org/dictionary/english/equal');
    });
}

async function revisit() {
  app.message(/mea revisit/i, async function({message, say}) {
    say('Meaning: Come over to place again or, considering or examining something again.');
    await sleep(1);
    say('Synonyms: consider, examine');
    await sleep(1);
    say('https://dictionary.cambridge.org/dictionary/english/examine');
  });
}

async function interbreed() {
  app.message(/mea interbreed/i, async function({message, say}) {
  say('Meaning: To group or species mix to another species, then it become new species or group due to group breed with another group.');
  await sleep(1);
  say('Antonyms: breed');
  await sleep(1);
  say('https://dictionary.cambridge.org/dictionary/english/interbreed');
});
}

async function dependent() {
  app.message(/mea dependent/i, async function({message, say}) {
  say('Meaning: State that help or depend as couple direction or a direction.');
  await sleep(1);
  say('Antonyms: independent');
  await sleep(1);
  say('https://dictionary.cambridge.org/dictionary/english/dependent');
});
}

async function glory() {
  app.message(/mea glory/i, async function({message, say}) {
  say('Meaning: Have been admirate something or someone due to someone or something has achievement.');
  await sleep(1);
  say('https://dictionary.cambridge.org/dictionary/english/glory');
});
}

async function liberty() {
  app.message(/mea liberty/i, async function({message, say}) {
  say('Meaning: To alive freedomly as wish freedom or go anywhere.');
  await sleep(1);
  say('Synonyms: freedom');
  await sleep(1);
  say('https://dictionary.cambridge.org/dictionary/english/liberty');
});
}

async function arrange() {
  app.message(/mea arrange/i, async function({message, say}) {
  say('Meaning: To plan, prepare and then organize, or to play or make music by particular instrument. ');
  await sleep(1);
  say('Synonyms: plan, prepare, organize');
  await sleep(1);
  say('https://dictionary.cambridge.org/dictionary/english/arrange');
});
}

async function admire() {
  app.message(/mea admire/i, async function({message, say}) {
  say('Meaning: You feeling that would praise someone with respect and pleasant.');
  await sleep(1);
  say('Synonyms: praise, respect');
  await sleep(1);
  say('https://dictionary.cambridge.org/dictionary/english/admire');
});
}


app.start();
equal();
revisit();
interbreed();
dependent();
glory();
liberty();
arrange();
admire();
