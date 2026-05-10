'use client';

import { useMemo, useState } from 'react';

const questions = [
  ['群聊突然安静了，你会？', [['主动发梗，把气氛拉起来',{S:2,O:1}], ['等别人说话，我先观察',{D:2,G:1}], ['私聊最熟的人吐槽一下',{E:1,D:1}], ['直接潜水，安静也挺好',{D:2,C:1}]]],
  ['朋友突然冷淡，你第一反应是？', [['开始想是不是我做错了',{E:2,G:1}], ['给对方空间，等他想说',{C:2,D:1}], ['直接问清楚',{L:2,O:1}], ['先不管，可能只是忙',{C:2,F:1}]]],
  ['你在朋友群里更像？', [['组织者，负责约人和安排',{L:2,S:1}], ['观察者，看大家互动',{D:2,C:1}], ['气氛组，负责搞笑',{S:2,O:1}], ['消失人口，但关系还在',{D:2,G:1}]]],
  ['别人最常评价你？', [['好相处',{F:2,O:1}], ['有点高冷',{D:2,G:1}], ['很搞笑',{S:2,E:1}], ['很靠谱',{L:1,C:2}]]],
  ['朋友失恋时你会？', [['一直陪着，听他说完',{E:2,O:1}], ['帮他分析问题',{C:2,L:1}], ['带他出去玩，转移注意力',{S:2,F:1}], ['想安慰，但不知道怎么说',{D:1,G:2}]]],
  ['新朋友约你出去，你通常？', [['可以啊，多认识人挺好',{S:2,O:1}], ['看有没有熟人在',{G:2,D:1}], ['如果安排清楚我就去',{C:1,F:1}], ['大概率拒绝，太累了',{D:2,G:1}]]],
  ['朋友临时取消约定，你会？', [['有点失落，但不会说',{E:2,G:1}], ['没事，我自己也能玩',{C:2,D:1}], ['问清楚原因',{L:1,O:1}], ['下次可能就不主动约了',{G:2,E:1}]]],
  ['你更喜欢哪种友情？', [['天天聊天，分享生活',{S:2,E:1}], ['不常联系，但一见面还是熟',{D:1,C:2}], ['一起成长，互相督促',{L:2,C:1}], ['舒服自由，不互相绑架',{F:2,O:1}]]],
  ['你最不喜欢朋友哪一点？', [['忽冷忽热',{E:2,G:1}], ['控制欲太强',{F:2,D:1}], ['说话不算数',{C:2,L:1}], ['太爱装熟',{G:2,D:1}]]],
  ['朋友找你倾诉，你通常会？', [['认真听，很容易共情',{E:2,O:1}], ['给出解决方案',{C:2,L:1}], ['用玩笑让他轻松一点',{S:2,F:1}], ['陪着，但话不多',{D:1,C:1}]]],
  ['你交朋友最看重？', [['真诚',{E:1,O:2}], ['边界感',{D:1,G:2}], ['有趣',{S:2,F:1}], ['靠谱',{C:2,L:1}]]],
  ['多人聚会时你更常？', [['主动开启话题',{S:2,L:1}], ['跟熟人待在一起',{D:1,G:1}], ['哪里需要我就补哪里',{F:2,C:1}], ['观察谁和谁关系最好',{D:1,C:2}]]],
  ['朋友忘记你的生日，你会？', [['表面没事，心里记很久',{E:2,G:1}], ['真的没关系',{C:2,F:1}], ['开玩笑提醒他',{S:1,O:1}], ['看这个朋友平时对我怎样',{C:1,G:1}]]],
  ['你更像哪种朋友？', [['深夜接电话的人',{E:2,O:1}], ['负责把大家叫出来的人',{S:1,L:2}], ['默默帮忙但不邀功的人',{C:1,G:1}], ['突然出现又突然消失的人',{D:2,F:1}]]],
  ['你和朋友吵架后？', [['想马上说清楚',{L:1,O:2}], ['需要冷静一段时间',{D:1,C:1}], ['等对方先开口',{G:2,E:1}], ['看值不值得继续',{C:2,G:1}]]],
  ['你最容易被哪种朋友吸引？', [['热情开朗的人',{S:1,O:1}], ['成熟稳定的人',{C:2,G:1}], ['很有主见的人',{L:2,C:1}], ['懂分寸的人',{D:1,G:2}]]],
  ['别人突然夸你，你会？', [['开心到藏不住',{E:2,O:1}], ['表面冷静，心里开心',{D:1,G:1}], ['马上也夸回去',{S:1,F:1}], ['有点不知道怎么接',{G:2,D:1}]]],
  ['朋友之间你最不能接受？', [['背后说坏话',{E:1,G:2}], ['不尊重边界',{D:1,G:2}], ['只索取不付出',{C:2,L:1}], ['气氛太压抑',{S:2,F:1}]]],
  ['你发朋友圈/动态的频率？', [['经常发，记录生活',{S:1,O:2}], ['偶尔发，只发重要的',{C:1,G:1}], ['很少发，但会看别人',{D:2,G:1}], ['看心情，没固定规律',{F:2,E:1}]]],
  ['朋友问你意见时，你会？', [['直接说真话',{L:1,O:1}], ['先照顾他的感受',{E:2,F:1}], ['分析利弊',{C:2,L:1}], ['不太想替别人做决定',{F:2,G:1}]]],
  ['你理想中的朋友群是？', [['热闹、有梗、天天聊天',{S:2,O:1}], ['人不多，但都很真',{D:1,E:1}], ['大家互相支持，一起变好',{L:1,C:2}], ['不强求联系，各自舒服',{F:2,D:1}]]],
  ['当你心情不好时，你会？', [['找朋友说出来',{E:2,O:1}], ['自己消化',{D:2,G:1}], ['做点事转移注意力',{C:1,F:1}], ['装没事，但别人能看出来',{E:1,G:1}]]],
  ['你在友情里更希望？', [['被理解',{E:2,O:1}], ['被尊重',{G:2,D:1}], ['被需要',{L:1,E:1}], ['被轻松对待',{F:2,S:1}]]],
  ['如果朋友突然需要帮忙，你会？', [['马上出现',{E:1,O:2}], ['先判断我能不能真的帮上',{C:2,L:1}], ['能帮就帮，但不喜欢被理所当然',{G:2,C:1}], ['看关系亲不亲',{D:1,G:1}]]],
].map(([q, a]) => ({ q, a: a.map(([text, score]) => ({ text, score })) }));

const results = {
  SELG: ['气氛掌控者','你不是单纯外向，你是能把一群人重新点亮的人。',['社交发动机','情绪敏锐','主导感强','慢慢信任']],
  SELO: ['快乐小太阳','你像朋友群里的光，出现的时候气氛自然会变轻。',['热情','好接近','分享欲强','容易心软']],
  SEFG: ['高敏感陪伴者','你很会陪人，但也很容易把别人的情绪背到自己身上。',['共情强','怕打扰','容易想多','温柔']],
  SEFO: ['无敌好朋友','你给人的感觉很舒服，像永远不会让人尴尬的安全区。',['好相处','真诚','情绪开放','随和']],
  SCLG: ['靠谱组织者','朋友聚不聚得起来，很多时候就看你在不在。',['执行力强','会安排','现实稳定','有边界']],
  SCLO: ['社交军师','你不是只会热闹，你还很会判断局势。',['会说话','会分析','主动','清醒']],
  SCFG: ['清醒陪玩人','你可以很热闹，但你心里其实一直很有分寸。',['外热内稳','不越界','懂场合','松弛']],
  SCFO: ['佛系开心果','你不喜欢复杂关系，只想轻松、真诚、好玩。',['松弛','有趣','不计较','接纳度高']],
  DELG: ['深夜倾听者','你不是最热闹的人，但别人真正难过时，第一个想到的可能是你。',['共情','慢热','重感情','防备心']],
  DELO: ['回忆收藏家','你很念旧，记得很多别人以为你早就忘了的小事。',['重感情','细腻','真诚','慢热']],
  DEFG: ['独行观察者','你不是不需要朋友，你只是需要真正舒服的朋友。',['安静','观察力强','边界清楚','慢慢靠近']],
  DEFO: ['温柔边界者','你温柔，但不是没有底线；你安静，但不是没有感情。',['边界感','温和','自由','慢熟']],
  DCLG: ['冷静指挥官','你不一定话多，但关键时刻你很能扛事。',['理性','可靠','主见强','距离感']],
  DCLO: ['成熟分析师','你像朋友群里的导航系统，不吵，但很有方向。',['清醒','成熟','有判断力','真诚']],
  DCFG: ['高冷边界者','你看起来不好接近，但熟了之后其实很真。',['慢热','边界','冷静','不讨好']],
  DCFO: ['佛系自由人','你不喜欢被友情绑架，但你也不是冷漠的人。',['自由','舒服','不强求','清醒']],
};


const matches = {
  SELO: [
    { type: 'DCFG', name: '高冷边界者', percent: 94, desc: '你的热情能自然靠近对方，对方的稳定边界也能让你不容易乱想。' },
    { type: 'DEFG', name: '独行观察者', percent: 90, desc: '你负责打开气氛，对方负责让关系保持舒服的距离。' },
    { type: 'SEFO', name: '无敌好朋友', percent: 87, desc: '你们都轻松真诚，相处起来没有太多压力。' },
  ],
  SELG: [
    { type: 'DCFO', name: '佛系自由人', percent: 92, desc: '你负责把关系带热，对方负责让关系不变得太沉重。' },
    { type: 'DELO', name: '回忆收藏家', percent: 88, desc: '你的主动会让对方感到被重视，对方的细腻也会回应你的情绪。' },
    { type: 'SCFG', name: '清醒陪玩人', percent: 85, desc: '你们都能玩起来，但对方更有分寸，能帮你稳住节奏。' },
  ],
  SEFG: [
    { type: 'SCLG', name: '靠谱组织者', percent: 93, desc: '你提供情绪价值，对方提供现实稳定，是很互补的友情组合。' },
    { type: 'DCLO', name: '成熟分析师', percent: 89, desc: '你容易感受很多，对方能帮你把问题想清楚。' },
    { type: 'DCLG', name: '冷静指挥官', percent: 85, desc: '你的温柔能软化对方，对方的冷静也能保护你。' },
  ],
  SEFO: [
    { type: 'DCFG', name: '高冷边界者', percent: 95, desc: '你的好接近能降低对方的防备，对方的边界感也会让关系很健康。' },
    { type: 'DEFG', name: '独行观察者', percent: 91, desc: '你不会给对方太大压力，所以慢热的人也愿意靠近你。' },
    { type: 'SCFO', name: '佛系开心果', percent: 88, desc: '你们都喜欢轻松相处，很少把友情变成负担。' },
  ],
  SCLG: [
    { type: 'SEFG', name: '高敏感陪伴者', percent: 93, desc: '你负责安排和稳定，对方负责关心和感受。' },
    { type: 'SELO', name: '快乐小太阳', percent: 89, desc: '你的靠谱会给对方安全感，对方的热情会让你更放松。' },
    { type: 'DELO', name: '回忆收藏家', percent: 86, desc: '你的行动力能维护关系，对方会记住你的付出。' },
  ],
  SCLO: [
    { type: 'DCFO', name: '佛系自由人', percent: 91, desc: '你很会判断局势，对方很松弛，能避免关系太紧绷。' },
    { type: 'SEFG', name: '高敏感陪伴者', percent: 88, desc: '你能给建议，对方能给情绪理解，互相补位。' },
    { type: 'DEFO', name: '温柔边界者', percent: 84, desc: '你的主动会推动关系，对方的温和边界让相处不失控。' },
  ],
  SCFG: [
    { type: 'SELG', name: '气氛掌控者', percent: 90, desc: '对方负责带动气氛，你负责保持分寸和稳定。' },
    { type: 'DELO', name: '回忆收藏家', percent: 87, desc: '你外热内稳，对方细腻念旧，关系容易长期保温。' },
    { type: 'SCFO', name: '佛系开心果', percent: 84, desc: '你们都能玩，也都不会太过度要求彼此。' },
  ],
  SCFO: [
    { type: 'DELG', name: '深夜倾听者', percent: 92, desc: '你的轻松能治愈对方的内耗，对方的深度也会让关系更真。' },
    { type: 'DCFG', name: '高冷边界者', percent: 89, desc: '你不会强迫对方表达，所以对方会慢慢信任你。' },
    { type: 'SEFO', name: '无敌好朋友', percent: 86, desc: '你们都很好相处，友情会自然舒服地发展。' },
  ],
  DELG: [
    { type: 'SELO', name: '快乐小太阳', percent: 94, desc: '对方的主动热情能把你从内耗里拉出来，你的深度也会打动对方。' },
    { type: 'SCLG', name: '靠谱组织者', percent: 90, desc: '你需要稳定的陪伴，对方刚好很可靠、会行动。' },
    { type: 'SCFO', name: '佛系开心果', percent: 86, desc: '对方的松弛感能让你放下防备，不用一直想太多。' },
  ],
  DELO: [
    { type: 'SCFO', name: '佛系开心果', percent: 92, desc: '你很重感情，对方很轻松，能让你不被过去困住。' },
    { type: 'SEFO', name: '无敌好朋友', percent: 89, desc: '对方真诚好相处，你会觉得这段友情很安全。' },
    { type: 'SCLG', name: '靠谱组织者', percent: 85, desc: '对方会用行动维护关系，你会用细节记住关系。' },
  ],
  DEFG: [
    { type: 'SELO', name: '快乐小太阳', percent: 93, desc: '对方能主动靠近你，但又不会让关系变得太复杂。' },
    { type: 'SEFO', name: '无敌好朋友', percent: 90, desc: '对方舒服自然，很适合你的慢热节奏。' },
    { type: 'SCFO', name: '佛系开心果', percent: 86, desc: '对方轻松不强求，你会更愿意慢慢打开自己。' },
  ],
  DEFO: [
    { type: 'SCLO', name: '社交军师', percent: 91, desc: '对方主动清醒，能推动关系；你温和有边界，能让关系稳定。' },
    { type: 'SEFO', name: '无敌好朋友', percent: 88, desc: '对方真诚随和，不会让你觉得被冒犯。' },
    { type: 'DCLO', name: '成熟分析师', percent: 84, desc: '你们都比较成熟，适合建立低消耗、高信任的友情。' },
  ],
  DCLG: [
    { type: 'SEFG', name: '高敏感陪伴者', percent: 92, desc: '你的冷静能保护对方，对方的温柔能让你更愿意表达。' },
    { type: 'SELO', name: '快乐小太阳', percent: 88, desc: '对方带来热度，你提供稳定，是很典型的互补组合。' },
    { type: 'DELO', name: '回忆收藏家', percent: 85, desc: '你重行动，对方重细节，关系会很有长期感。' },
  ],
  DCLO: [
    { type: 'SEFG', name: '高敏感陪伴者', percent: 93, desc: '你能帮对方理清问题，对方能让你感受到被理解。' },
    { type: 'DEFO', name: '温柔边界者', percent: 89, desc: '你们都成熟有分寸，很适合稳定、低压力的友情。' },
    { type: 'SCFO', name: '佛系开心果', percent: 85, desc: '对方会让你不要一直太理性，关系更轻松。' },
  ],
  DCFG: [
    { type: 'SELO', name: '快乐小太阳', percent: 95, desc: '对方主动又温暖，最容易突破你的慢热和距离感。' },
    { type: 'SEFO', name: '无敌好朋友', percent: 91, desc: '对方真诚舒服，不会强迫你快速打开自己。' },
    { type: 'SCFO', name: '佛系开心果', percent: 87, desc: '对方随和不黏人，你会觉得关系很安全。' },
  ],
  DCFO: [
    { type: 'SELG', name: '气氛掌控者', percent: 92, desc: '对方负责把你拉进热闹里，你负责让关系保持轻松。' },
    { type: 'SCLO', name: '社交军师', percent: 88, desc: '对方会推动关系和话题，你能给关系足够空间。' },
    { type: 'DELO', name: '回忆收藏家', percent: 85, desc: '对方重感情，你很自由，组合起来既有温度也不压迫。' },
  ],
};

const axisPairs = [['S','D'], ['E','C'], ['L','F'], ['G','O']];
const desc = { S:'社交能量', D:'独处能量', E:'情绪感知', C:'冷静分析', L:'主导关系', F:'随和自由', G:'慢热防备', O:'开放表达' };

function calc(answers) {
  const score = { S:0, D:0, E:0, C:0, L:0, F:0, G:0, O:0 };
  answers.forEach((choice, i) => {
    if (choice === null) return;
    Object.entries(questions[i].a[choice].score).forEach(([k, v]) => { score[k] += v; });
  });
  const code = axisPairs.map(([a, b]) => score[a] >= score[b] ? a : b).join('');
  return { score, code, data: results[code] || results.SEFO };
}

export default function Page() {
  const [screen, setScreen] = useState('home');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const result = useMemo(() => calc(answers), [answers]);
  const selected = answers[index];
  const percent = Math.round(((index + 1) / questions.length) * 100);
  const [name, line, tags] = result.data;

  function choose(i) {
    const nextAnswers = [...answers];
    nextAnswers[index] = i;
    setAnswers(nextAnswers);
  }

  function goNext() {
    if (index < questions.length - 1) setIndex(index + 1);
    else setScreen('result');
  }

  function restart() {
    setAnswers(Array(questions.length).fill(null));
    setIndex(0);
    setScreen('home');
  }


  function saveResultImage() {
    const matchList = matches[result.code] || [];
    const canvas = document.createElement('canvas');
    const scale = 2;
    const width = 900;
    const height = 1600;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function drawText(text, x, y, size, color = '#ffffff', weight = '700', align = 'left') {
      ctx.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.textBaseline = 'top';
      ctx.fillText(text, x, y);
    }

    function wrapText(text, x, y, maxWidth, lineHeight, size = 28, color = 'rgba(255,255,255,0.72)', weight = '500') {
      ctx.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const chars = String(text).split('');
      let line = '';
      let yy = y;
      chars.forEach((ch) => {
        const test = line + ch;
        if (ctx.measureText(test).width > maxWidth && line) {
          ctx.fillText(line, x, yy);
          line = ch;
          yy += lineHeight;
        } else {
          line = test;
        }
      });
      if (line) ctx.fillText(line, x, yy);
      return yy + lineHeight;
    }

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#090914');
    bg.addColorStop(0.45, '#111122');
    bg.addColorStop(1, '#071827');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.28;
    ctx.fillStyle = '#d946ef';
    ctx.beginPath(); ctx.arc(70, 120, 260, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath(); ctx.arc(830, 1420, 280, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 44) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

    ctx.fillStyle = 'rgba(255,255,255,0.075)';
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 2;
    roundRect(58, 60, 784, 1480, 36);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    roundRect(92, 100, 240, 48, 24); ctx.fill();
    drawText('FriendType™ 友情人格', 115, 113, 20, 'rgba(255,255,255,0.72)', '800');

    drawText(result.code, 92, 190, 108, '#ffffff', '950');
    const titleGradient = ctx.createLinearGradient(92, 325, 620, 325);
    titleGradient.addColorStop(0, '#f0abfc');
    titleGradient.addColorStop(0.55, '#ffffff');
    titleGradient.addColorStop(1, '#a5f3fc');
    drawText(name, 92, 335, 62, titleGradient, '950');
    wrapText(`“${line}”`, 92, 430, 710, 42, 28, 'rgba(255,255,255,0.74)', '600');

    let tagX = 92;
    let tagY = 540;
    tags.forEach((tag) => {
      ctx.font = '800 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
      const tw = ctx.measureText(`#${tag}`).width + 38;
      if (tagX + tw > 805) { tagX = 92; tagY += 54; }
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.strokeStyle = 'rgba(255,255,255,0.13)';
      roundRect(tagX, tagY, tw, 40, 20); ctx.fill(); ctx.stroke();
      drawText(`#${tag}`, tagX + 19, tagY + 8, 20, 'rgba(255,255,255,0.78)', '800');
      tagX += tw + 12;
    });

    let y = tagY + 88;
    drawText('最匹配的前三朋友类型', 92, y, 34, '#ffffff', '950');
    y += 60;
    matchList.forEach((m, i) => {
      ctx.fillStyle = 'rgba(0,0,0,0.24)';
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      roundRect(92, y, 716, 150, 24); ctx.fill(); ctx.stroke();
      drawText(`TOP ${i + 1}`, 118, y + 24, 20, '#a5f3fc', '900');
      drawText(`${m.type} — ${m.name}`, 118, y + 55, 28, '#ffffff', '950');
      wrapText(m.desc, 118, y + 94, 500, 28, 18, 'rgba(255,255,255,0.64)', '600');
      drawText(`${m.percent}%`, 730, y + 48, 44, '#a5f3fc', '950', 'center');
      y += 174;
    });

    y += 8;
    drawText('你的四个维度', 92, y, 30, '#ffffff', '900');
    y += 56;
    axisPairs.forEach(([a, b], idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const boxX = 92 + col * 365;
      const boxY = y + row * 132;
      const total = result.score[a] + result.score[b] || 1;
      const left = Math.round((result.score[a] / total) * 100);
      const winner = result.score[a] >= result.score[b] ? a : b;
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.strokeStyle = 'rgba(255,255,255,0.11)';
      roundRect(boxX, boxY, 340, 108, 22); ctx.fill(); ctx.stroke();
      drawText(a, boxX + 22, boxY + 20, 22, '#ffffff', '900');
      drawText(b, boxX + 300, boxY + 20, 22, '#ffffff', '900');
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      roundRect(boxX + 22, boxY + 55, 296, 12, 6); ctx.fill();
      const barG = ctx.createLinearGradient(boxX + 22, boxY + 55, boxX + 318, boxY + 55);
      barG.addColorStop(0, '#f0abfc'); barG.addColorStop(0.55, '#8b5cf6'); barG.addColorStop(1, '#67e8f9');
      ctx.fillStyle = barG;
      roundRect(boxX + 22, boxY + 55, Math.max(12, 296 * left / 100), 12, 6); ctx.fill();
      drawText(`${winner} · ${desc[winner]}`, boxX + 22, boxY + 78, 18, 'rgba(255,255,255,0.62)', '700');
    });

    drawText('friendtype.io', width / 2, 1484, 24, 'rgba(255,255,255,0.45)', '800', 'center');

    const link = document.createElement('a');
    link.download = `FriendType-${result.code}-${name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <main className="page">
      <div className="glow glow1" />
      <div className="glow glow2" />
      {screen === 'home' && (
        <section className="hero card">
          <div className="pill">FriendType™ 友情人格测试</div>
          <h1>测出你在朋友眼里<br /><span>是什么类型的人</span></h1>
          <p>24 道题，生成你的四字母友情人格。像 MBTI 一样，但是测试你在友情里的相处方式。</p>
          <button className="primary" onClick={() => setScreen('quiz')}>开始测试 →</button>
          <div className="small">已有 23,481 人完成测试</div>
        </section>
      )}

      {screen === 'quiz' && (
        <section className="card quiz">
          <div className="top"><span>Question {index + 1} / {questions.length}</span><span>{percent}%</span></div>
          <div className="bar"><div style={{ width: `${percent}%` }} /></div>
          <h2>{questions[index].q}</h2>
          <div className="answers">
            {questions[index].a.map((option, i) => (
              <button key={option.text} onClick={() => choose(i)} className={selected === i ? 'answer active' : 'answer'}>
                <b>{String.fromCharCode(65 + i)}</b><span>{option.text}</span>
              </button>
            ))}
          </div>
          <div className="actions">
            <button className="ghost" disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))}>上一题</button>
            <button className="primary" disabled={selected === null} onClick={goNext}>{index === questions.length - 1 ? '查看结果' : '下一题'}</button>
          </div>
        </section>
      )}

      {screen === 'result' && (
        <section className="card result">
          <div className="pill">Your friendship type</div>
          <h3>{result.code}</h3>
          <h1><span>{name}</span></h1>
          <p className="quote">“{line}”</p>
          <div className="tags">{tags.map(t => <span key={t}>#{t}</span>)}</div>
          <div className="grid">
            <div><b>你的友情优势</b><p>你能用自己的方式给朋友稳定感，也很清楚自己在关系里的节奏。</p></div>
            <div><b>可能的风险点</b><p>有时候你会把真实需求藏起来，导致别人误会你不在意。</p></div>
            <div><b>适合的朋友类型</b><p>适合能尊重你边界、同时愿意真诚表达的人。</p></div>
          </div>
          <h4>你的四个维度</h4>
          <div className="dims">
            {axisPairs.map(([a, b]) => {
              const total = result.score[a] + result.score[b] || 1;
              const left = Math.round((result.score[a] / total) * 100);
              const winner = result.score[a] >= result.score[b] ? a : b;
              return <div className="dim" key={a+b}><div><b>{a}</b><b>{b}</b></div><div className="bar"><div style={{ width: `${left}%` }} /></div><p>更偏向：{winner} · {desc[winner]}</p></div>;
            })}
          </div>
          <div className="match-section">
            <h4>最匹配的前三朋友类型</h4>
            <div className="match-list">
              {(matches[result.code] || []).map((m, i) => (
                <div className="match-card" key={m.type}>
                  <div>
                    <div className="match-rank">TOP {i + 1}</div>
                    <div className="match-name">{m.type} — {m.name}</div>
                    <p>{m.desc}</p>
                  </div>
                  <div className="match-percent">{m.percent}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className="actions">
            <button className="ghost" onClick={restart}>重新测试</button>
            <button className="primary" onClick={saveResultImage}>保存结果</button>
          </div>
        </section>
      )}
    </main>
  );
}
