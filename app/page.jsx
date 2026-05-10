"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, RotateCcw, Share2, ChevronRight } from "lucide-react";

const questions = [
  ["群聊突然安静了，你会？", [["主动发梗，把气氛拉起来",{S:2,O:1}], ["等别人说话，我先观察",{D:2,G:1}], ["私聊最熟的人吐槽一下",{E:1,D:1}], ["直接潜水，安静也挺好",{D:2,C:1}]]],
  ["朋友突然冷淡，你第一反应是？", [["开始想是不是我做错了",{E:2,G:1}], ["给对方空间，等他想说",{C:2,D:1}], ["直接问清楚",{L:2,O:1}], ["先不管，可能只是忙",{C:2,F:1}]]],
  ["你在朋友群里更像？", [["组织者，负责约人和安排",{L:2,S:1}], ["观察者，看大家互动",{D:2,C:1}], ["气氛组，负责搞笑",{S:2,O:1}], ["消失人口，但关系还在",{D:2,G:1}]]],
  ["别人最常评价你？", [["好相处",{F:2,O:1}], ["有点高冷",{D:2,G:1}], ["很搞笑",{S:2,E:1}], ["很靠谱",{L:1,C:2}]]],
  ["朋友失恋时你会？", [["一直陪着，听他说完",{E:2,O:1}], ["帮他分析问题",{C:2,L:1}], ["带他出去玩，转移注意力",{S:2,F:1}], ["想安慰，但不知道怎么说",{D:1,G:2}]]],
  ["新朋友约你出去，你通常？", [["可以啊，多认识人挺好",{S:2,O:1}], ["看有没有熟人在",{G:2,D:1}], ["如果安排清楚我就去",{C:1,F:1}], ["大概率拒绝，太累了",{D:2,G:1}]]],
  ["朋友临时取消约定，你会？", [["有点失落，但不会说",{E:2,G:1}], ["没事，我自己也能玩",{C:2,D:1}], ["问清楚原因",{L:1,O:1}], ["下次可能就不主动约了",{G:2,E:1}]]],
  ["你更喜欢哪种友情？", [["天天聊天，分享生活",{S:2,E:1}], ["不常联系，但一见面还是熟",{D:1,C:2}], ["一起成长，互相督促",{L:2,C:1}], ["舒服自由，不互相绑架",{F:2,O:1}]]],
  ["你最不喜欢朋友哪一点？", [["忽冷忽热",{E:2,G:1}], ["控制欲太强",{F:2,D:1}], ["说话不算数",{C:2,L:1}], ["太爱装熟",{G:2,D:1}]]],
  ["朋友找你倾诉，你通常会？", [["认真听，很容易共情",{E:2,O:1}], ["给出解决方案",{C:2,L:1}], ["用玩笑让他轻松一点",{S:2,F:1}], ["陪着，但话不多",{D:1,C:1}]]],
  ["你交朋友最看重？", [["真诚",{E:1,O:2}], ["边界感",{D:1,G:2}], ["有趣",{S:2,F:1}], ["靠谱",{C:2,L:1}]]],
  ["多人聚会时你更常？", [["主动开启话题",{S:2,L:1}], ["跟熟人待在一起",{D:1,G:1}], ["哪里需要我就补哪里",{F:2,C:1}], ["观察谁和谁关系最好",{D:1,C:2}]]],
  ["朋友忘记你的生日，你会？", [["表面没事，心里记很久",{E:2,G:1}], ["真的没关系",{C:2,F:1}], ["开玩笑提醒他",{S:1,O:1}], ["看这个朋友平时对我怎样",{C:1,G:1}]]],
  ["你更像哪种朋友？", [["深夜接电话的人",{E:2,O:1}], ["负责把大家叫出来的人",{S:1,L:2}], ["默默帮忙但不邀功的人",{C:1,G:1}], ["突然出现又突然消失的人",{D:2,F:1}]]],
  ["你和朋友吵架后？", [["想马上说清楚",{L:1,O:2}], ["需要冷静一段时间",{D:1,C:1}], ["等对方先开口",{G:2,E:1}], ["看值不值得继续",{C:2,G:1}]]],
  ["你最容易被哪种朋友吸引？", [["热情开朗的人",{S:1,O:1}], ["成熟稳定的人",{C:2,G:1}], ["很有主见的人",{L:2,C:1}], ["懂分寸的人",{D:1,G:2}]]],
  ["别人突然夸你，你会？", [["开心到藏不住",{E:2,O:1}], ["表面冷静，心里开心",{D:1,G:1}], ["马上也夸回去",{S:1,F:1}], ["有点不知道怎么接",{G:2,D:1}]]],
  ["朋友之间你最不能接受？", [["背后说坏话",{E:1,G:2}], ["不尊重边界",{D:1,G:2}], ["只索取不付出",{C:2,L:1}], ["气氛太压抑",{S:2,F:1}]]],
  ["你发朋友圈/动态的频率？", [["经常发，记录生活",{S:1,O:2}], ["偶尔发，只发重要的",{C:1,G:1}], ["很少发，但会看别人",{D:2,G:1}], ["看心情，没固定规律",{F:2,E:1}]]],
  ["朋友问你意见时，你会？", [["直接说真话",{L:1,O:1}], ["先照顾他的感受",{E:2,F:1}], ["分析利弊",{C:2,L:1}], ["不太想替别人做决定",{F:2,G:1}]]],
  ["你理想中的朋友群是？", [["热闹、有梗、天天聊天",{S:2,O:1}], ["人不多，但都很真",{D:1,E:1}], ["大家互相支持，一起变好",{L:1,C:2}], ["不强求联系，各自舒服",{F:2,D:1}]]],
  ["当你心情不好时，你会？", [["找朋友说出来",{E:2,O:1}], ["自己消化",{D:2,G:1}], ["做点事转移注意力",{C:1,F:1}], ["装没事，但别人能看出来",{E:1,G:1}]]],
  ["你在友情里更希望？", [["被理解",{E:2,O:1}], ["被尊重",{G:2,D:1}], ["被需要",{L:1,E:1}], ["被轻松对待",{F:2,S:1}]]],
  ["如果朋友突然需要帮忙，你会？", [["马上出现",{E:1,O:2}], ["先判断我能不能真的帮上",{C:2,L:1}], ["能帮就帮，但不喜欢被理所当然",{G:2,C:1}], ["看关系亲不亲",{D:1,G:1}]]],
].map(([q,a])=>({q,a:a.map(([text,score])=>({text,score}))}));

const resultText = {
  SELG:["气氛掌控者","你不是单纯外向，你是能把一群人重新点亮的人。",["社交发动机","情绪敏锐","主导感强","慢慢信任"]],
  SELO:["快乐小太阳","你像朋友群里的光，出现的时候气氛自然会变轻。",["热情","好接近","分享欲强","容易心软"]],
  SEFG:["高敏感陪伴者","你很会陪人，但也很容易把别人的情绪背到自己身上。",["共情强","怕打扰","容易想多","温柔"]],
  SEFO:["无敌好朋友","你给人的感觉很舒服，像永远不会让人尴尬的安全区。",["好相处","真诚","情绪开放","随和"]],
  SCLG:["靠谱组织者","朋友聚不聚得起来，很多时候就看你在不在。",["执行力强","会安排","现实稳定","有边界"]],
  SCLO:["社交军师","你不是只会热闹，你还很会判断局势。",["会说话","会分析","主动","清醒"]],
  SCFG:["清醒陪玩人","你可以很热闹，但你心里其实一直很有分寸。",["外热内稳","不越界","懂场合","松弛"]],
  SCFO:["佛系开心果","你不喜欢复杂关系，只想轻松、真诚、好玩。",["松弛","有趣","不计较","接纳度高"]],
  DELG:["深夜倾听者","你不是最热闹的人，但别人真正难过时，第一个想到的可能是你。",["共情","慢热","重感情","防备心"]],
  DELO:["回忆收藏家","你很念旧，记得很多别人以为你早就忘了的小事。",["重感情","细腻","真诚","慢热"]],
  DEFG:["独行观察者","你不是不需要朋友，你只是需要真正舒服的朋友。",["安静","观察力强","边界清楚","慢慢靠近"]],
  DEFO:["温柔边界者","你温柔，但不是没有底线；你安静，但不是没有感情。",["边界感","温和","自由","慢熟"]],
  DCLG:["冷静指挥官","你不一定话多，但关键时刻你很能扛事。",["理性","可靠","主见强","距离感"]],
  DCLO:["成熟分析师","你像朋友群里的导航系统，不吵，但很有方向。",["清醒","成熟","有判断力","真诚"]],
  DCFG:["高冷边界者","你看起来不好接近，但熟了之后其实很真。",["慢热","边界","冷静","不讨好"]],
  DCFO:["佛系自由人","你不喜欢被友情绑架，但你也不是冷漠的人。",["自由","舒服","不强求","清醒"]],
};
const axisPairs = [["S","D"],["E","C"],["L","F"],["G","O"]];
const desc = {S:"社交能量",D:"独处能量",E:"情绪感知",C:"冷静分析",L:"主导关系",F:"随和自由",G:"慢热防备",O:"开放表达"};

function Button({children,className="",...props}){return <button {...props} className={`inline-flex items-center justify-center rounded-2xl px-6 py-3 font-bold transition disabled:opacity-30 ${className}`}>{children}</button>}
function calc(answers){const score={S:0,D:0,E:0,C:0,L:0,F:0,G:0,O:0};answers.forEach((c,i)=>{if(c==null)return;Object.entries(questions[i].a[c].score).forEach(([k,v])=>score[k]+=v)});const code=axisPairs.map(([a,b])=>score[a]>=score[b]?a:b).join("");return {score,code,data:resultText[code]||resultText.SEFO};}

export default function Page(){
 const [screen,setScreen]=useState("home"); const [index,setIndex]=useState(0); const [answers,setAnswers]=useState(Array(questions.length).fill(null)); const selected=answers[index]; const result=useMemo(()=>calc(answers),[answers]);
 const choose=i=>{const n=[...answers]; n[index]=i; setAnswers(n)}; const next=()=> index<questions.length-1?setIndex(index+1):setScreen("result"); const restart=()=>{setAnswers(Array(questions.length).fill(null));setIndex(0);setScreen("home")};
 const percent=Math.round(((index+1)/questions.length)*100); const [name,line,tags]=result.data;
 return <div className="min-h-screen bg-[#070712] text-white overflow-hidden relative">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,70,239,.28),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,.18),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(124,58,237,.25),transparent_35%)]"/>
  <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-8">
  <AnimatePresence mode="wait">
  {screen==="home"&&<motion.div key="home" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-18}} className="w-full text-center">
   <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"><Sparkles className="h-4 w-4 text-fuchsia-300"/>FriendType™ 友情人格测试</div>
   <h1 className="text-5xl font-black tracking-tight md:text-7xl">测出你在朋友眼里<br/><span className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-200 bg-clip-text text-transparent">是什么类型的人</span></h1>
   <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/65">24 道题，生成你的四字母友情人格。像 MBTI 一样，但是测试你在友情里的相处方式。</p>
   <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"><Button onClick={()=>setScreen("quiz")} className="bg-white text-black hover:bg-white/90">开始测试 <ChevronRight className="ml-2 h-5 w-5"/></Button><div className="flex items-center gap-2 text-sm text-white/45"><Users className="h-4 w-4"/>已有 23,481 人完成测试</div></div>
  </motion.div>}
  {screen==="quiz"&&<motion.div key="quiz" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/[.07] p-6 shadow-2xl backdrop-blur-2xl md:p-9">
   <div className="mb-2 flex justify-between text-xs text-white/50"><span>Question {index+1} / {questions.length}</span><span>{percent}%</span></div><div className="h-2 rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-300" animate={{width:`${percent}%`}}/></div>
   <h2 className="mt-9 text-3xl font-black md:text-4xl">{questions[index].q}</h2>
   <div className="mt-8 grid gap-3">{questions[index].a.map((o,i)=><button key={o.text} onClick={()=>choose(i)} className={`rounded-2xl border p-5 text-left transition ${selected===i?"border-fuchsia-300 bg-fuchsia-300/15":"border-white/10 bg-white/[.04] hover:bg-white/[.08]"}`}><span className={`mr-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${selected===i?"bg-fuchsia-300 text-black":"bg-white/10 text-white/60"}`}>{String.fromCharCode(65+i)}</span>{o.text}</button>)}</div>
   <div className="mt-8 flex justify-between"><Button onClick={()=>setIndex(Math.max(0,index-1))} disabled={index===0} className="bg-white/5 text-white/70 hover:bg-white/10">上一题</Button><Button onClick={next} disabled={selected==null} className="bg-white text-black hover:bg-white/90">{index===questions.length-1?"查看结果":"下一题"}</Button></div>
  </motion.div>}
  {screen==="result"&&<motion.div key="result" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.07] shadow-2xl backdrop-blur-2xl">
   <div className="p-7 md:p-10"><div className="text-sm font-bold uppercase tracking-[.35em] text-fuchsia-200/80">Your friendship type</div><h2 className="mt-5 text-6xl font-black md:text-8xl">{result.code}</h2><h3 className="mt-2 bg-gradient-to-r from-fuchsia-200 via-white to-cyan-200 bg-clip-text text-4xl font-black text-transparent md:text-6xl">{name}</h3><p className="mt-6 max-w-2xl text-xl leading-8 text-white/75">“{line}”</p><div className="mt-7 flex flex-wrap gap-2">{tags.map(t=><span key={t} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/75">#{t}</span>)}</div></div>
   <div className="grid gap-px bg-white/10 md:grid-cols-3"><div className="bg-[#0b0b18]/95 p-7"><b className="text-cyan-200">你的友情优势</b><p className="mt-3 leading-7 text-white/68">你能用自己的方式给朋友稳定感，也很清楚自己在关系里的节奏。</p></div><div className="bg-[#0b0b18]/95 p-7"><b className="text-fuchsia-200">可能的风险点</b><p className="mt-3 leading-7 text-white/68">有时候你会把真实需求藏起来，导致别人误会你不在意。</p></div><div className="bg-[#0b0b18]/95 p-7"><b className="text-violet-200">适合的朋友类型</b><p className="mt-3 leading-7 text-white/68">适合能尊重你边界、同时愿意真诚表达的人。</p></div></div>
   <div className="p-7 md:p-10"><div className="mb-4 text-sm font-bold text-white/50">你的四个维度</div><div className="grid gap-3 md:grid-cols-4">{axisPairs.map(([a,b])=>{const total=result.score[a]+result.score[b]||1;const left=Math.round(result.score[a]/total*100);const win=result.score[a]>=result.score[b]?a:b;return <div key={a+b} className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><div className="flex justify-between text-sm font-bold"><span>{a}</span><span>{b}</span></div><div className="my-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-fuchsia-300 to-cyan-200" style={{width:`${left}%`}}/></div><div className="text-xs text-white/50">更偏向：<span className="text-white">{win} · {desc[win]}</span></div></div>})}</div><div className="mt-8 flex gap-3"><Button onClick={restart} className="border border-white/15 bg-transparent text-white hover:bg-white/10"><RotateCcw className="mr-2 h-4 w-4"/>重新测试</Button><Button onClick={()=>navigator.clipboard?.writeText(`我的 FriendType 是 ${result.code} — ${name}`)} className="bg-white text-black hover:bg-white/90"><Share2 className="mr-2 h-4 w-4"/>复制结果</Button></div></div>
  </motion.div>}
  </AnimatePresence></main></div>
}
