// Area: Login gate (B2-B5) — triggered by sending the first-ever chat message. 4-step sequential
// flow: claim -> browser -> signing -> success. Each step's timing is a fixed setTimeout in
// index.html's renderLoginGate() (1700ms browser->signing, 1300ms signing->done); waits below give
// a safety margin over those.
module.exports = {
  name: 'Login',
  async run(page, combo, { shotAsserted }) {
  const records = [];

  const composer = page.locator('input[type="text"]:visible, textarea:visible').first();
  await composer.fill('Draft a status update for the team');
  await page.locator('button[aria-label="Send message" i], .bai-send').first().click({ force: true }).catch(async () => { await page.keyboard.press('Enter'); });
  await page.waitForTimeout(300);

  // B2 - claim step
  records.push(await shotAsserted(page, {
    visualInstanceId: `B2.claimstep.default.${combo.theme}.${combo.key}`,
    matrixId: 'B2', state: 'claimstep', theme: combo.theme, breakpoint: combo.key,
    expectVisibleText: 'Sign in to claim',
    expectSelectorAbsent: '.lg-close, [class*="close"][class*="lg"]',
  }));

  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button, .bai-onb-cta')).find(b => b.textContent.includes('Sign in')); if (b) b.click(); });
  await page.waitForTimeout(300);
  records.push(await shotAsserted(page, {
    visualInstanceId: `B3.browserstep.default.${combo.theme}.${combo.key}`,
    matrixId: 'B3', state: 'browserstep', theme: combo.theme, breakpoint: combo.key,
    expectVisibleText: 'Check your browser',
  }));

  await page.waitForTimeout(2000);
  records.push(await shotAsserted(page, {
    visualInstanceId: `B4.signingstep.default.${combo.theme}.${combo.key}`,
    matrixId: 'B4', state: 'signingstep', theme: combo.theme, breakpoint: combo.key,
    expectTextAbsent: 'Check your browser',
  }));

  await page.waitForTimeout(1500);
  records.push(await shotAsserted(page, {
    visualInstanceId: `B5.successstep.default.${combo.theme}.${combo.key}`,
    matrixId: 'B5', state: 'successstep', theme: combo.theme, breakpoint: combo.key,
    expectVisibleText: 'Continue',
  }));

    return records;
  },
};
