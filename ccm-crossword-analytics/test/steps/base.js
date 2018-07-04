const { Given, When, Then } = require('cucumber');

Given(/^I am on the crossword analytics page$/, async function () {
  await browser.url(browser.options.baseUrl);
});

Then(/^I can see crossword results$/, async function () {
  const selector = "#ccm-crossword-analytics-1";

  await browser.waitForExist(selector);
});

When(/^I filter by the user (.*)$/, async function (username) {
  const selector = `#ccm-crossword-analytics-1 #filter`;
  await browser.waitForExist(selector);

  await browser.click(selector);
  for (let i=0; i < username.length; i++) {
    await browser.keys(username[i]);
  }
});

Then(/^I can see (.*) solved crosswords$/, async function (number) {
  const selector = `#ccm-crossword-analytics-1 .table tbody .table_row`;
  await browser.waitForExist(selector);

  const elements = await browser.elements(selector);

  assert.equal(elements.value.length, number);
});