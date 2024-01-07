// arabic dictionary

// arabic = ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩
export const arabic = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

// arabic = ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹
export const persian = ["۹", "۸", "۷", "۶", "۵", "۴", "۳", "۲", "۱", "۰"];

// hindi = ० १ २ ३ ४ ५ ६ ७ ८ ९
export const hindi = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

// korean = 영 일 이 삼 사 오 육 칠 팔 구 십 백
export const korean = [
  "영",
  "일",
  "이",
  "삼",
  "사",
  "오",
  "육",
  "칠",
  "팔",
  "구",
];

// chinese = 〇 一 二 三 四 五 六 七 八 九 十 百 千 萬 億 万 亿 壹 貳 叄 肆 伍 陸 柒 捌 玖 拾 佰 仟 贰 叁 陆
export const chinese = [
  "〇",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
];

const isRoman = (digit: string) => {
  /^(m{1,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})|m{0,4}(cm|c?d|d?c{1,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})|m{0,4}(cm|cd|d?c{0,3})(xc|x?l|l?x{1,3})(ix|iv|v?i{0,3})|m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|i?v|v?i{1,3}))$/.test(
    digit
  ) ||
    /^(M{1,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})|M{0,4}(CM|C?D|D?C{1,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})|M{0,4}(CM|CD|D?C{0,3})(XC|X?L|L?X{1,3})(IX|IV|V?I{0,3})|M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|I?V|V?I{1,3}))$/.test(
      digit
    );
};
export const parseRoman = (roman: string | any[]) => {
  let sum = 0;
  let romanMap = {
    i: 1,
    v: 5,
    x: 10,
    l: 50,
    c: 100,
    d: 500,
    m: 1000,
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  for (let i = 0; i < roman.length; i++) {
    const current = romanMap[roman[i]];
    const next = romanMap[roman[i + 1]];
    if (next === undefined) {
      sum += current;
      continue;
    }
    if (current >= next) {
      sum += current;
      continue;
    }
    sum -= current;
  }
  return sum;
};

// e = english, p = persian, a = arabic, c = chinese, k = korean
export const e2h = (s: string) =>
  s.replace(/\d/g, (d: string | number) => "०१२३४५६७८९"[d]);
export const h2e = (s: {
  replace: (arg0: RegExp, arg1: (d: any) => number) => any;
}) => s.replace(/[०-९]/g, (d: string) => "०१२३४५६७८९".indexOf(d));
export const e2p = (s: string) =>
  s.replace(/\d/g, (d: string | number) => "۰۱۲۳۴۵۶۷۸۹"[d]);
export const e2a = (s: string) =>
  s.replace(/\d/g, (d: string | number) => "٠١٢٣٤٥٦٧٨٩"[d]);
export const p2e = (s: {
  replace: (arg0: RegExp, arg1: (d: any) => number) => any;
}) => s.replace(/[۰-۹]/g, (d: string) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
export const a2e = (s: {
  replace: (arg0: RegExp, arg1: (d: any) => number) => any;
}) => s.replace(/[٠-٩]/g, (d: string) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
export const p2a = (s: string) =>
  s.replace(/[۰-۹]/g, (d: string) => "٠١٢٣٤٥٦٧٨٩"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
export const a2p = (s: string) =>
  s.replace(/[٠-٩]/g, (d: string) => "۰۱۲۳۴۵۶۷۸۹"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
export const e2c = (s: string) =>
  s.replace(/\d/g, (d: string | number) => "〇一二三四五六七八九"[d]);
export const c2e = (s: {
  replace: (arg0: RegExp, arg1: (d: any) => number) => any;
}) =>
  s.replace(/[〇,一,二,三,四,五,六,七,八,九]/g, (d: string) =>
    "〇一二三四五六七八九".indexOf(d)
  );
export const e2k = (s: string) =>
  s.replace(/\d/g, (d: string | number) => "영일이삼사오육칠팔구"[d]);
export const k2e = (s: {
  replace: (arg0: RegExp, arg1: (d: any) => number) => any;
}) =>
  s.replace(/[영,일,이,삼,사,오,육,칠,팔,구]/g, (d: string) =>
    "영일이삼사오육칠팔구".indexOf(d)
  );
