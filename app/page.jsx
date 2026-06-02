'use client';

import { useEffect, useMemo, useState } from 'react';

const LANGUAGE_KEY = 'friendtype-language';

const questionsZh = [
  ['一个你很在意的好朋友突然变冷淡，回消息也慢了很多。你更可能？', [['默认他可能不想继续靠近，我也开始慢慢抽离',{D:1,E:1,F:1,G:1}], ['找个不尴尬的时机直接问清楚',{S:1,C:1,L:1,O:1}], ['发点轻松的东西试探气氛，让对方好接',{S:1,E:1,F:1,O:1}], ['先退一步，把最近发生的事复盘一下',{D:1,C:1,L:1,G:1}]]],
  ['你刷到平时一起玩的朋友小圈子出去玩，但没人叫你。你会？', [['心里有点酸，但先不表现出来，看看后续',{D:1,E:1,F:1,G:1}], ['找其中一个人轻松问一句“你们怎么去的？”',{S:1,C:1,L:1,O:1}], ['自己安排点别的，再开玩笑说下次带我',{S:1,E:1,L:1,O:1}], ['默认他们有自己的圈子，我会少把自己放进去',{D:1,C:1,F:1,G:1}]]],
  ['一个你信任的好朋友答应你的事又临时掉链子。你第一步会？', [['说清楚这件事对你有影响，一起补救',{S:1,E:1,L:1,O:1}], ['先自己补救，但以后不会太依赖他这件事',{D:1,C:1,F:1,G:1}], ['问清楚卡在哪里，下次把规则说具体点',{S:1,C:1,L:1,G:1}], ['承认失望，但也给对方一点余地',{D:1,E:1,F:1,O:1}]]],
  ['几个熟朋友的群聊里，大家开始对一个决定各说各的。你会？', [['丢个轻松梗缓一下，再看谁真的有意见',{S:1,E:1,F:1,O:1}], ['先不急着讲话，等信息更完整再补一句',{D:1,C:1,F:1,G:1}], ['整理几个选项，让大家投票或定时间',{S:1,C:1,L:1,O:1}], ['私下问那个没说话的人是不是不舒服',{D:1,E:1,L:1,G:1}]]],
  ['一个普通朋友带你去见他的新朋友群，大家已经很熟了。你会？', [['顺着他们的节奏聊，先让气氛舒服起来',{S:1,E:1,F:1,O:1}], ['靠近熟人一点，边听边摸清这个圈子的规则',{D:1,C:1,F:1,G:1}], ['找一个共同话题切进去，但不过度表现',{S:1,C:1,L:1,G:1}], ['结束后真诚跟朋友说你的感受，不硬装熟',{D:1,E:1,L:1,O:1}]]],
  ['你和一个重要的好朋友有点冲突，但谁都没真正说破。你会？', [['约一个时间聊，想把误会拆开讲清楚',{S:1,C:1,L:1,O:1}], ['先冷静一下；如果对方也不提，我可能慢慢淡掉',{D:1,E:1,F:1,G:1}], ['从“我当时的感受”开头，也听对方怎么想',{S:1,E:1,F:1,O:1}], ['抓住核心问题，少说情绪，多说边界',{D:1,C:1,L:1,G:1}]]],
  ['一个刚开始变熟的朋友问你很私人的事，你还没完全准备好说。你会？', [['只透露一点点，先看对方能不能接住',{D:1,E:1,F:1,G:1}], ['直接说“我能讲，但我需要你保密”',{S:1,C:1,L:1,O:1}], ['如果当下氛围很安全，就诚实多讲一点',{S:1,E:1,F:1,O:1}], ['先不讲，除非这件事会影响你们关系',{D:1,C:1,L:1,G:1}]]],
  ['你最近状态很差，想找一个好朋友帮忙。你会？', [['直接找人说需要什么，也解释为什么重要',{S:1,E:1,L:1,O:1}], ['能不麻烦别人就先自己扛，真的不行再开口',{D:1,C:1,F:1,G:1}], ['发一个低压力请求，让对方方便就回',{S:1,C:1,F:1,O:1}], ['只找最信任的一个人，把范围控制住',{D:1,E:1,L:1,G:1}]]],
  ['一个关系很近的朋友明显在硬撑，说“没事”，但你看得出来不对。你会？', [['陪他待着，发点吃的或好笑的东西让他松一点',{S:1,E:1,F:1,O:1}], ['帮他把问题拆小，找资源或下一步方案',{D:1,C:1,L:1,G:1}], ['问他想要被陪、被分析，还是先被放过',{S:1,C:1,L:1,O:1}], ['安静陪着，不逼他说，也不急着解决',{D:1,E:1,F:1,G:1}]]],
  ['一个很亲近的朋友搬去很远的城市后，联系变少了。你会？', [['常常丢一点生活碎片过去，不要求秒回',{S:1,E:1,F:1,O:1}], ['接受中间会断联，但见面时认真补回来',{D:1,C:1,F:1,G:1}], ['固定一个轻量 check-in，比如每月电话',{S:1,C:1,L:1,G:1}], ['在重要节点发很真诚的消息，让关系不断线',{D:1,E:1,L:1,O:1}]]],
  ['你感觉一段曾经很近的友情正在慢慢变形，不像以前了。你会？', [['有点难过，但先把这份变化放在心里',{D:1,E:1,F:1,G:1}], ['找机会问一句：我们要不要重新对齐一下？',{S:1,C:1,L:1,O:1}], ['保留善意，但允许关系变成新的样子',{S:1,E:1,F:1,O:1}], ['接受现实，慢慢把投入调到更合适的位置',{D:1,C:1,L:1,G:1}]]],
  ['你和几个普通朋友要一起做决定，但每个人都说“随便”。你会？', [['列出几个选项和限制，让大家快速选',{S:1,C:1,L:1,O:1}], ['先听谁其实不想去，避免表面随便真委屈',{D:1,E:1,F:1,G:1}], ['把选择讲得有趣一点，让大家愿意参与',{S:1,E:1,F:1,O:1}], ['默默判断最稳的方案，必要时推一把',{D:1,C:1,L:1,G:1}]]],
  ['和一个曾经很熟的朋友几个月没聊，突然很想 reconnect。你会？', [['发一句“突然想你了”，但不给对方压力',{S:1,E:1,F:1,O:1}], ['等有真正想分享的东西，再认真开场',{D:1,C:1,L:1,G:1}], ['直接约个具体时间，别让寒暄停在表面',{S:1,C:1,L:1,O:1}], ['先从点赞或回复动态开始，慢慢把门打开',{D:1,E:1,F:1,G:1}]]],
  ['一个你真心在意的好朋友拿到很重要的成就，你会怎么庆祝？', [['公开狠狠夸，再私下发一大段真心话',{S:1,E:1,F:1,O:1}], ['私下祝贺，讲一个你真的替他开心的细节',{D:1,C:1,F:1,G:1}], ['组织大家一起庆祝，让这个时刻被看见',{S:1,C:1,L:1,O:1}], ['准备一个有意义的小礼物或长消息，不抢 spotlight',{D:1,E:1,L:1,G:1}]]],
  ['你很需要一个好朋友回应，但对方最近也很忙。你会？', [['直接说“我现在有点需要被确认一下”',{S:1,E:1,L:1,O:1}], ['先忍住不说，怕自己的需求给对方压力',{D:1,C:1,F:1,G:1}], ['问清楚你们最近怎么联系比较舒服，减少猜测',{S:1,C:1,L:1,G:1}], ['承认自己有点不安，同时给对方空间',{D:1,E:1,F:1,O:1}]]],
].map(([q, a]) => ({ q, a: a.map(([text, score]) => ({ text, score })) }));

const questionsEn = [
  ['A close friend you really care about suddenly feels distant and replies way less. What do you do?', [['Assume they may not want to stay close, so you slowly pull back too',{D:1,E:1,F:1,G:1}], ['Find a low-pressure moment and ask what is going on',{S:1,C:1,L:1,O:1}], ['Send something light to make it easy for them to re-enter',{S:1,E:1,F:1,O:1}], ['Step back first and replay what has happened recently',{D:1,C:1,L:1,G:1}]]],
  ['You see your usual hangout circle went out without you. What feels most natural?', [['Feel it, but keep it private and wait to see if it comes up',{D:1,E:1,F:1,G:1}], ['Casually ask one person how the plan happened',{S:1,C:1,L:1,O:1}], ['Make your own plan, then joke that next time they should bring you',{S:1,E:1,L:1,O:1}], ['Assume they have their own circle and place yourself there less',{D:1,C:1,F:1,G:1}]]],
  ['A close friend you trust breaks a promise again at the last minute. Your first move is...', [['Tell them it affected you and look for a repair together',{S:1,E:1,L:1,O:1}], ['Fix your side first, but rely on them less for this next time',{D:1,C:1,F:1,G:1}], ['Ask what blocked them, then make next time more specific',{S:1,C:1,L:1,G:1}], ['Admit you are disappointed while still leaving them room',{D:1,E:1,F:1,O:1}]]],
  ['A group chat with familiar friends is spiraling because everyone wants a different plan. You...', [['Drop something light to lower the tension, then read the room',{S:1,E:1,F:1,O:1}], ['Let the chat breathe and only add something when the picture is clearer',{D:1,C:1,F:1,G:1}], ['Turn the chaos into options, a poll, or a time everyone can choose',{S:1,C:1,L:1,O:1}], ['Check privately with the quiet person who seems uncomfortable',{D:1,E:1,L:1,G:1}]]],
  ['A casual friend brings you into their new friend group, and everyone already has history. You...', [['Match the room and ask easy follow-ups until it feels less stiff',{S:1,E:1,F:1,O:1}], ['Stay close to your friend and observe the group’s rhythm first',{D:1,C:1,F:1,G:1}], ['Find one shared topic and join in without over-performing',{S:1,C:1,L:1,G:1}], ['Tell your friend honestly afterward how it felt, instead of pretending',{D:1,E:1,L:1,O:1}]]],
  ['You and an important close friend have tension, but nobody has named it. You...', [['Set a time to talk because you want to actually understand it',{S:1,C:1,L:1,O:1}], ['Cool down first; if they never bring it up either, you may drift away',{D:1,E:1,F:1,G:1}], ['Start with how it felt for you and invite their side too',{S:1,E:1,F:1,O:1}], ['Cut to the core issue with fewer emotions and clearer boundaries',{D:1,C:1,L:1,G:1}]]],
  ['A friend you are just starting to get close with asks something very personal. You are not fully ready to share. You...', [['Give them a small piece first and see if they handle it with care',{D:1,E:1,F:1,G:1}], ['Say what you can share and clearly ask them to keep it private',{S:1,C:1,L:1,O:1}], ['If the moment feels safe, open up more honestly than planned',{S:1,E:1,F:1,O:1}], ['Keep it private unless it directly affects the friendship',{D:1,C:1,L:1,G:1}]]],
  ['You are having a rough week and want help from a close friend. You...', [['Ask directly for what you need and explain why it matters',{S:1,E:1,L:1,O:1}], ['Try not to bother anyone and only ask if you truly cannot handle it',{D:1,C:1,F:1,G:1}], ['Send a clear, low-pressure request so they can opt in easily',{S:1,C:1,F:1,O:1}], ['Tell one deeply trusted person and keep the circle small',{D:1,E:1,L:1,G:1}]]],
  ['A close friend says “I’m fine,” but you can tell they are not. You...', [['Stay nearby with food, memes, or little check-ins to soften the moment',{S:1,E:1,F:1,O:1}], ['Help break the problem into smaller next steps or resources',{D:1,C:1,L:1,G:1}], ['Ask whether they want comfort, solutions, company, or space',{S:1,C:1,L:1,O:1}], ['Sit with them quietly and do not force a confession or a fix',{D:1,E:1,F:1,G:1}]]],
  ['A very close friend moves far away and contact gets patchier. You...', [['Send small life updates often, with no pressure to reply instantly',{S:1,E:1,F:1,O:1}], ['Accept gaps, but make the catch-ups count when they happen',{D:1,C:1,F:1,G:1}], ['Create a lightweight ritual, like a monthly call or recurring check-in',{S:1,C:1,L:1,G:1}], ['Send sincere messages on important days so the thread never fully drops',{D:1,E:1,L:1,O:1}]]],
  ['A friendship that used to feel close is changing and does not feel like it used to. You...', [['Feel sad about it first, but keep that grief mostly private',{D:1,E:1,F:1,G:1}], ['Ask whether you two want to reset or realign the friendship',{S:1,C:1,L:1,O:1}], ['Keep the warmth, but allow the friendship to take a new shape',{S:1,E:1,F:1,O:1}], ['Accept the data and slowly rebalance how much you invest',{D:1,C:1,L:1,G:1}]]],
  ['You and a few casual friends need to make a plan, but everyone says “I’m down for whatever.” You...', [['List real options and constraints so people can choose fast',{S:1,C:1,L:1,O:1}], ['Listen for who secretly does not want the plan before weighing in',{D:1,E:1,F:1,G:1}], ['Make the options sound fun enough that people actually engage',{S:1,E:1,F:1,O:1}], ['Quietly identify the most workable plan and nudge the group there',{D:1,C:1,L:1,G:1}]]],
  ['You have not talked to a once-close friend in months, but you suddenly miss them. You...', [['Send a simple “I randomly miss you” with zero pressure attached',{S:1,E:1,F:1,O:1}], ['Wait until you have something real to say, then reach out intentionally',{D:1,C:1,L:1,G:1}], ['Suggest a specific time to catch up so it does not die as small talk',{S:1,C:1,L:1,O:1}], ['Start by reacting to a story or post and let the door open slowly',{D:1,E:1,F:1,G:1}]]],
  ['A close friend you genuinely care about hits a major win. How do you celebrate them?', [['Hype them publicly, then send a private message with all the feelings',{S:1,E:1,F:1,O:1}], ['Congratulate them privately with one detail that proves you mean it',{D:1,C:1,F:1,G:1}], ['Coordinate a group celebration so the moment feels properly seen',{S:1,C:1,L:1,O:1}], ['Prepare a meaningful note or gift without pulling attention onto yourself',{D:1,E:1,L:1,G:1}]]],
  ['You need reassurance from a close friend, but they have been busy too. You...', [['Say directly, “I think I need a little reassurance right now”',{S:1,E:1,L:1,O:1}], ['Hold it in because you worry your needs will pressure them',{D:1,C:1,F:1,G:1}], ['Ask what kind of communication rhythm would feel clear for both of you',{S:1,C:1,L:1,G:1}], ['Admit you feel a bit off while still giving them space',{D:1,E:1,F:1,O:1}]]],
].map(([q, a]) => ({ q, a: a.map(([text, score]) => ({ text, score })) }));

const resultsZh = {
  SELG: ['气氛掌控者','在熟朋友小圈子里，你很会读气氛，也愿意主动把卡住的关系重新推起来。',['社交发动机','情绪敏锐','主导感强','慢慢信任']],
  SELO: ['快乐小太阳','不管是普通朋友还是刚认识的人，你都容易让对方觉得轻松、被欢迎。',['热情','好接近','分享欲强','容易心软']],
  SEFG: ['高敏感陪伴者','对亲近的朋友，你很容易感受到细微变化，但也会怕自己的需求给别人压力。',['共情强','怕打扰','容易想多','温柔']],
  SEFO: ['无敌好朋友','你在亲近关系里很真诚，在新关系里也不太让人尴尬，是很舒服的靠近方式。',['好相处','真诚','情绪开放','随和']],
  SCLG: ['靠谱组织者','普通朋友局里你能把事推进，好朋友需要你时你也会想办法让事情落地。',['执行力强','会安排','现实稳定','有边界']],
  SCLO: ['社交军师','你能进入新圈子，也能看懂熟人局里的暗流，热络之外还有判断力。',['会说话','会分析','主动','清醒']],
  SCFG: ['清醒陪玩人','你可以参与热闹，但对普通朋友和好朋友的投入分得很清楚。',['外热内稳','不越界','懂场合','松弛']],
  SCFO: ['佛系开心果','你适合轻松自然的关系：普通朋友不尴尬，好朋友也不用互相绑架。',['松弛','有趣','不计较','接纳度高']],
  DELG: ['深夜倾听者','你不会轻易把所有人放进来，但真正亲近的人难过时，你会很认真地接住。',['共情','慢热','重感情','防备心']],
  DELO: ['回忆收藏家','对曾经很熟的人和重要节点，你记得很深，也愿意用真诚把关系接回来。',['重感情','细腻','真诚','慢热']],
  DEFG: ['独行观察者','你需要时间判断谁值得靠近；一旦感觉不对，你会保护自己、降低投入。',['安静','观察力强','边界清楚','慢慢靠近']],
  DEFO: ['温柔边界者','你对好朋友温柔，但对刚认识的人会保留空间，不会为了亲近而勉强自己。',['边界感','温和','自由','慢熟']],
  DCLG: ['冷静指挥官','你在亲近关系里不一定话多，但遇到承诺、冲突或决定时，会很清楚地处理核心问题。',['理性','可靠','主见强','距离感']],
  DCLO: ['成熟分析师','你能区分普通朋友、熟朋友和好朋友的分量，不轻易失控，也不随便投入。',['清醒','成熟','有判断力','真诚']],
  DCFG: ['高冷边界者','你刚开始会显得有距离感，但那是你在确认关系是否安全、是否值得投入。',['慢热','边界','冷静','不讨好']],
  DCFO: ['佛系自由人','你不喜欢被任何层级的友情绑架；关系舒服就靠近，不舒服就自然退开。',['自由','舒服','不强求','清醒']],
};

const resultsEn = {
  SELG: ['Vibe Commander','In familiar friend groups, you read the room quickly and are willing to move stuck dynamics forward.',['Social engine','Emotionally sharp','Takes the lead','Trusts slowly']],
  SELO: ['Happy Little Sun','With casual friends or new people, you make things feel warmer and easier almost immediately.',['Warm','Approachable','Loves sharing','Soft-hearted']],
  SEFG: ['Highly Sensitive Companion','With close friends, you notice small emotional shifts fast, but you may worry that your own needs are too much.',['Deep empathy','Afraid to bother','Overthinks','Gentle']],
  SEFO: ['Ultimate Good Friend','You are sincere with close friends and easy around newer people, which makes your closeness feel safe.',['Easygoing','Sincere','Emotionally open','Flexible']],
  SCLG: ['Reliable Organizer','In casual plans you move things forward, and when close friends need you, you try to make help practical.',['Gets things done','Plans well','Grounded','Has boundaries']],
  SCLO: ['Social Strategist','You can enter new groups while still reading the hidden dynamics in familiar ones.',['Good with words','Analytical','Proactive','Clear-headed']],
  SCFG: ['Clear-Headed Playmate','You can join the fun, but you are clear about how much energy casual friends versus close friends get.',['Warm outside, steady inside','Respects limits','Reads the moment','Relaxed']],
  SCFO: ['Chill Joy-Bringer','You do best in friendships that feel natural: casual friends stay easy, close friends stay unforced.',['Relaxed','Fun','Not petty','Accepting']],
  DELG: ['Late-Night Listener','You do not let everyone in quickly, but when someone is truly close, you show up with serious care.',['Empathetic','Slow to warm','Deeply attached','Guarded']],
  DELO: ['Memory Keeper','You remember once-close people and meaningful moments, and you can reconnect with real sincerity.',['Sentimental','Delicate','Sincere','Slow to warm']],
  DEFG: ['Solo Observer','You take time to decide who is worth getting close to; when something feels off, you protect your energy.',['Quiet','Observant','Clear boundaries','Opens slowly']],
  DEFO: ['Gentle Boundary-Keeper','You are soft with close friends, but with newer people you keep enough space to stay comfortable.',['Boundaried','Kind','Free','Slow to open']],
  DCLG: ['Calm Commander','You may not be loud in close friendships, but around promises, conflict, or decisions, you handle the core issue clearly.',['Rational','Reliable','Strong-minded','Keeps distance']],
  DCLO: ['Mature Analyst','You can tell the difference between casual friends, familiar friends, and close friends, and you invest accordingly.',['Clear','Mature','Good judgment','Sincere']],
  DCFG: ['Cool Boundary-Setter','You can seem distant at first because you are checking whether the relationship is safe and worth investing in.',['Slow to warm','Boundaried','Calm','Does not people-please']],
  DCFO: ['Chill Free Spirit','You do not want any level of friendship to feel binding; if it feels good, you move closer, and if not, you step back.',['Free','Comfortable','Low-pressure','Clear-headed']],
};

const axisPairs = [['S','D'], ['E','C'], ['L','F'], ['G','O']];
const descZh = { S:'社交能量', D:'独处能量', E:'情绪感知', C:'冷静分析', L:'主导关系', F:'随和自由', G:'慢热防备', O:'开放表达' };
const descEn = { S:'Social energy', D:'Solo energy', E:'Emotional awareness', C:'Calm analysis', L:'Leads relationships', F:'Flexible freedom', G:'Slow-to-trust guard', O:'Open expression' };

const ui = {
  zh: {
    languageLabel: '语言',
    zh: '中文',
    en: 'English',
    heroPill: 'FriendType™ 友情人格测试',
    brandSub: '友情人格引擎',
    headlineTop: '测出你在朋友眼里',
    headlineAccent: '是什么类型的人',
    intro: '15 道高质量情境题，生成你的四字母友情人格。像 MBTI 一样，但是测试你在友情里的相处方式。',
    matchLine: '找到最适合你的朋友',
    liveBadge: '现在可测',
    metricQuestions: '15 道题',
    metricTypes: '16 种类型',
    metricSave: '结果可复制',
    previewLabel: '结果预览',
    previewType: 'SEFO',
    previewName: '无敌好朋友',
    previewText: '舒服、真诚、好接近',
    previewTags: ['真诚', '随和', '情绪开放'],
    start: '开始测试 →',
    completed: '已生成 20,000+ 份人格档案',
    question: '题目',
    previous: '上一题',
    next: '下一题',
    viewResult: '查看结果',
    resultPill: '你的友情类型',
    strengthTitle: '你的友情优势',
    strengthText: '你能用自己的方式给朋友稳定感，也很清楚自己在关系里的节奏。',
    riskTitle: '可能的风险点',
    riskText: '有时候你会把真实需求藏起来，导致别人误会你不在意。',
    fitTitle: '适合的朋友类型',
    fitText: '适合能尊重你边界、同时愿意真诚表达的人。',
    dimensions: '你的四个维度',
    leans: '更偏向：',
    restart: '重新测试',
    copy: '复制结果',
    copiedResult: (code, name) => `我的 FriendType 是 ${code} — ${name}`,
  },
  en: {
    languageLabel: 'Language',
    zh: '中文',
    en: 'English',
    heroPill: 'FriendType™ Friendship Personality Test',
    brandSub: 'Friendship personality engine',
    headlineTop: 'Discover what type of friend',
    headlineAccent: 'you are in their eyes',
    intro: 'Answer 15 high-signal scenarios to generate your four-letter friendship type. Like MBTI, but for how you show up in friendships.',
    matchLine: 'Find the friends who fit you best',
    liveBadge: 'Ready now',
    metricQuestions: '15 questions',
    metricTypes: '16 types',
    metricSave: 'Copyable result',
    previewLabel: 'Result preview',
    previewType: 'SEFO',
    previewName: 'Ultimate Good Friend',
    previewText: 'Comfortable, sincere, easy to approach',
    previewTags: ['Sincere', 'Flexible', 'Open'],
    start: 'Start test →',
    completed: 'Over 20,000 personality profiles generated',
    question: 'Question',
    previous: 'Previous',
    next: 'Next',
    viewResult: 'View result',
    resultPill: 'Your friendship type',
    strengthTitle: 'Your friendship strength',
    strengthText: 'You give friends stability in your own way, and you understand your rhythm in relationships.',
    riskTitle: 'Possible blind spot',
    riskText: 'Sometimes you hide what you really need, which can make others think you do not care.',
    fitTitle: 'Best-fit friend type',
    fitText: 'You fit well with people who respect your boundaries and are willing to express themselves sincerely.',
    dimensions: 'Your four dimensions',
    leans: 'Leans toward: ',
    restart: 'Retake test',
    copy: 'Copy result',
    copiedResult: (code, name) => `My FriendType is ${code} - ${name}`,
  },
};

const translations = {
  zh: { questions: questionsZh, results: resultsZh, desc: descZh, ui: ui.zh },
  en: { questions: questionsEn, results: resultsEn, desc: descEn, ui: ui.en },
};

function calc(answers, copy) {
  const score = { S:0, D:0, E:0, C:0, L:0, F:0, G:0, O:0 };
  answers.forEach((choice, i) => {
    if (choice === null) return;
    Object.entries(copy.questions[i].a[choice].score).forEach(([k, v]) => { score[k] += v; });
  });
  const code = axisPairs.map(([a, b]) => score[a] >= score[b] ? a : b).join('');
  return { score, code, data: copy.results[code] || copy.results.SEFO };
}

export default function Page() {
  const [lang, setLang] = useState('zh');
  const copy = translations[lang];
  const t = copy.ui;
  const questions = copy.questions;
  const [screen, setScreen] = useState('home');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questionsZh.length).fill(null));
  const result = useMemo(() => calc(answers, copy), [answers, copy]);
  const selected = answers[index];
  const percent = Math.round(((index + 1) / questions.length) * 100);
  const [name, line, tags] = result.data;

  useEffect(() => {
    const saved = window.localStorage.getItem(LANGUAGE_KEY);
    if (saved === 'zh' || saved === 'en') setLang(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

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
    setAnswers(Array(questionsZh.length).fill(null));
    setIndex(0);
    setScreen('home');
  }

  return (
    <main className="page">
      <div className="glow glow1" />
      <div className="glow glow2" />
      <div className="language-switcher" aria-label={t.languageLabel}>
        <button type="button" className={lang === 'zh' ? 'active' : ''} onClick={() => setLang('zh')}>{t.zh}</button>
        <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>{t.en}</button>
      </div>
      {screen === 'home' && (
        <section className="hero-stage">
          <div className="hero-copy">
            <div className="brand-lockup">
              <div className="brand-mark">FT</div>
              <div><b>FriendType</b><span>{t.brandSub}</span></div>
            </div>
            <div className="pill">{t.heroPill}</div>
            <h1>{t.headlineTop}<br /><span>{t.headlineAccent}</span></h1>
            <p>{t.intro}</p>
            <div className="match-line">{t.matchLine}</div>
            <div className="hero-actions">
              <button className="primary" onClick={() => setScreen('quiz')}>{t.start}</button>
              <div className="hero-count"><span>{t.completed}</span></div>
            </div>
            <div className="hero-metrics">
              <span>{t.metricQuestions}</span>
              <span>{t.metricTypes}</span>
              <span>{t.metricSave}</span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="status-pill">{t.liveBadge}</div>
            <div className="type-code">{t.previewType}</div>
            <div className="type-name">{t.previewName}</div>
            <p>{t.previewText}</p>
            <div className="trait-stack">{t.previewTags.map(tag => <span key={tag}>#{tag}</span>)}</div>
            <div className="signal-grid">
              {axisPairs.map(([a, b], i) => (
                <div className="signal" key={a+b}>
                  <div><b>{a}</b><span>{b}</span></div>
                  <i style={{ width: `${[72, 64, 58, 78][i]}%` }} />
                </div>
              ))}
            </div>
            <div className="preview-label">{t.previewLabel}</div>
          </div>
        </section>
      )}

      {screen === 'quiz' && (
        <section className="card quiz">
          <div className="top"><span>{t.question} {index + 1} / {questions.length}</span><span>{percent}%</span></div>
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
            <button className="ghost" disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))}>{t.previous}</button>
            <button className="primary" disabled={selected === null} onClick={goNext}>{index === questions.length - 1 ? t.viewResult : t.next}</button>
          </div>
        </section>
      )}

      {screen === 'result' && (
        <section className="card result">
          <div className="pill">{t.resultPill}</div>
          <h3>{result.code}</h3>
          <h1><span>{name}</span></h1>
          <p className="quote">“{line}”</p>
          <div className="tags">{tags.map(t => <span key={t}>#{t}</span>)}</div>
          <div className="grid">
            <div><b>{t.strengthTitle}</b><p>{t.strengthText}</p></div>
            <div><b>{t.riskTitle}</b><p>{t.riskText}</p></div>
            <div><b>{t.fitTitle}</b><p>{t.fitText}</p></div>
          </div>
          <h4>{t.dimensions}</h4>
          <div className="dims">
            {axisPairs.map(([a, b]) => {
              const total = result.score[a] + result.score[b] || 1;
              const left = Math.round((result.score[a] / total) * 100);
              const winner = result.score[a] >= result.score[b] ? a : b;
              return <div className="dim" key={a+b}><div><b>{a}</b><b>{b}</b></div><div className="bar"><div style={{ width: `${left}%` }} /></div><p>{t.leans}{winner} · {copy.desc[winner]}</p></div>;
            })}
          </div>
          <div className="actions">
            <button className="ghost" onClick={restart}>{t.restart}</button>
            <button className="primary" onClick={() => navigator.clipboard?.writeText(t.copiedResult(result.code, name))}>{t.copy}</button>
          </div>
        </section>
      )}
    </main>
  );
}
