const { Given, When, Then } = require('cucumber');

Given(/^I am on the crossword page$/, async function () {
  await browser.url(browser.options.baseUrl);
});

Then(/^I can see a crossword$/, async function () {
  const selector = "#ccm-crossword-1";

  await browser.waitForExist(selector);
});

When(/^I finish the crossword with the first word (.*) and the second word (.*)$/, async function (first, second) {
  assert.equal(first.length, 4);
  assert.equal(second.length, 5);

  for (let i=0; i < first.length; i++) {
    let selector = `#ccm-crossword-1 #main #letter-${i}3`;

    await browser.click(selector);
    await browser.keys(first[i]);
  }

  for (let i=0; i<second.length; i++) {
    let selector = `#ccm-crossword-1 #main #letter-1${i}`;
    await browser.click(selector);
    await browser.keys(second[i]);
  }

  await browser.click("#ccm-crossword-1 #main #finish");
});


Then(/^I can see the crossword answered correctly$/, async function () {
  let selector = "#ccm-crossword-1 #main table .wrong";
  let elements = await browser.elements(selector).value;

  assert.equal(elements.length, 0);
});

Then(/^I can see the crossword is answered incorrectly$/, async function () {
  let selector = "#ccm-crossword-1 #main table .wrong";
  let elements = await browser.elements(selector).value;

  assert.notEqual(elements.length, 0);
});
