const { Given, When, Then } = require('cucumber');

Given(/^I am on the composition page$/, async function () {
  await browser.url(browser.options.baseUrl);
});

Then(/^I can see the first component$/, async function () {
  let selector = "#ccm-composition-1";
  await browser.waitForExist(selector);

  selector = "#ccm-composition-1 #main #ccm-crossword-1";
  await browser.waitForExist(selector);
});

When(/^I finish the first component$/, async function () {
  const first = "BEAR";
  const second = "TIGER";

  for (let i=0; i < first.length; i++) {
    let selector = `#ccm-composition-1 #main #ccm-crossword-1 #main #letter-${i}3`;

    await browser.click(selector);
    await browser.keys(first[i]);
  }

  for (let i=0; i<second.length; i++) {
    let selector = `#ccm-composition-1 #main #ccm-crossword-1 #main #letter-1${i}`;
    await browser.click(selector);
    await browser.keys(second[i]);
  }

  await browser.click("#ccm-composition-1 #main #ccm-crossword-1 #main #finish");
});

Then(/^I can see the second component$/, async function () {
  const selector = "#ccm-crossword-highchart-1";

  await browser.waitForExist(selector);
});
