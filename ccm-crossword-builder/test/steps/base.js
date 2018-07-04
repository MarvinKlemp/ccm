const { Given, When, Then } = require('cucumber');

Given(/^I am on the crossword builder page$/, async function () {
  await browser.url(browser.options.baseUrl);
});

Then(/^I can see a crossword-builder$/, async function () {
  const selector = "#ccm-crossword-builder-1 #main";

  await browser.waitForExist(selector);
});

When(/^I generate the crossword$/, async function () {
  await browser.click("#ccm-crossword-builder-1 #main #finish");
});

Then(/^I can see the warning: (.*)$/, async function (warning) {
  const selector = "#ccm-crossword-builder-1 #main #result";
  const value = await browser.getText(selector);

  assert.equal(value, warning);
});


When(/^I remove all words$/, async function () {
  await browser.click("#ccm-crossword-builder-1 #main #i0 button");
  await browser.click("#ccm-crossword-builder-1 #main #i1 button");
});


When(/^I input the words(.*) with question (.*) and (.*) with question (.*)$/,
  async function (first, first_question, second, second_question) {

  let selector = "#ccm-crossword-builder-1 #main #w0";
  await browser.waitForExist(selector);
  await browser.click(selector);
  for (let key of first) {
    await browser.keys(key);
  }

  selector = "#ccm-crossword-builder-1 #main #i0 .question";
  await browser.waitForExist(selector);
  await browser.click(selector);
  for (let key of first_question) {
    await browser.keys(key);
  }

  selector = "#ccm-crossword-builder-1 #main #w1";
  await browser.waitForExist(selector);
  await browser.click(selector);
  for (let key of second) {
    await browser.keys(key);
  }

  selector = "#ccm-crossword-builder-1 #main #i1 .question";
  await browser.waitForExist(selector);
  await browser.click(selector);
  for (let key of second_question) {
    await browser.keys(key);
  }
});


Then(/^I can see a generated crossword$/, async function () {
  let selector = "#ccm-crossword-builder-1 #main #preview #ccm-crossword-1";
  await browser.waitForExist(selector).value;
});
