(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{901:function(e,t,n){"use strict";n.r(t),n.d(t,"announceNoteUpdates",(function(){return o}));var s=n(159),o=e=>{var{dispatch:t,getState:n}=e,o=(e,n,o)=>new Notification(n,{body:o,tag:e}).onclick=()=>t(s.a.ui.openNote(e));return(e,t,s,i,l)=>{var c,d,a;if(n().settings.sendNotifications&&!l&&i)if(0!==Object.getOwnPropertyNames(s).length)if("r"!==(null===(c=i.deleted)||void 0===c?void 0:c.o))if(null!=s&&s.publishURL||null===(d=t.publishURL)||void 0===d||!d.length)if(null==s||null===(a=s.systemTags)||void 0===a||!a.includes("published")||t.systemTags.includes("published"))if(!i.tags||i.content)1===Object.getOwnPropertyNames(i).length&&(i.systemTags&&(null==s?void 0:s.systemTags.includes("published"))!==t.systemTags.includes("published")||i.publishURL)||1===Object.getOwnPropertyNames(i).length&&i.systemTags||o(e,"Note Updated",t.content.slice(0,200)||"(no content)");else{var u=new Set((null==s?void 0:s.tags)||[]),g=new Set(t.tags),r=[...u.values()].filter(e=>!g.has(e)),h=[...g.values()].filter(e=>!u.has(e));o(e,"Tags modified: ".concat(t.content.slice(0,20)||"(untitled)"),[h.length>0&&"Added: ".concat(h.join(", ").slice(0,20)),r.length>0&&"Removed: ".concat(r.join(", ").slice(0,20))].filter(Boolean).join("\n"))}else o(e,"Note Unpublished",t.content.slice(0,200)||"(no content)");else o(e,"Note Published",t.content.slice(0,200)||"(no content)");else o(e,i.deleted.v?"Note Trashed":"Note Restored",t.content.slice(0,200)||"(no content)");else o(e,"New Note",t.content.slice(0,200)||"(no content)")}}}}]);