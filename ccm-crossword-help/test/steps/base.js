const { Given, Then } = require('cucumber');

Given(/^I am on the crossword-help page$/, async function () {
  await browser.url(browser.options.baseUrl);
});

Then(/^I can see a crossword which has already letters filled out$/, async function () {
  let selector = "#ccm-crossword-help-1 #ccm-crossword-1";
  await browser.waitForExist(selector);

  selector = "#ccm-crossword-help-1 #ccm-crossword-1 #help0";
  let value = await browser.getText(selector);
  assert.notStrictEqual(value, "");


  selector = "#ccm-crossword-help-1 #ccm-crossword-1 #help1";
  value = await browser.getText(selector);
  assert.notStrictEqual(value, "");
});