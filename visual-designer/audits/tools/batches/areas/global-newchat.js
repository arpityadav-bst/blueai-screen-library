// Area: Global chrome — New Chat icon (A4). One capture point, breakpoint-conditional selector:
// compact uses #baiNewBtn, wide uses #baiSideNew (never both — an unscoped `#a, #b` selector once
// silently matched whichever renders first regardless of breakpoint; fixed to be explicit).
module.exports = {
  name: 'Global/New Chat',
  async run(page, combo, { shotAsserted }) {
    const records = [];
    records.push(await shotAsserted(page, {
      visualInstanceId: `A4.newchaticon.default.${combo.theme}.${combo.key}`,
      matrixId: 'A4', state: 'newchaticon', theme: combo.theme, breakpoint: combo.key,
      expectActiveTopTab: 'chat',
      expectSelectorVisible: combo.key === 'wide' ? '#baiSideNew' : '#baiNewBtn',
    }));
    return records;
  },
};
