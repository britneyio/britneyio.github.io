/* =====================================================================
   app.js — all behavior for the retro portfolio.

   Loaded directly by index.html (<script src="app.js" defer>). Edit this
   file and refresh the browser — no build step required.

   Everything is wrapped in one IIFE so nothing leaks to the global scope.
   Sections below, in order:
     CONTENT               - the resume data (edit this to change the site)
     DESKTOP WINDOW RENDER - build each window's HTML from the data
     WINDOW MANAGER        - open/close/focus/drag the app windows
     SNAKE                 - the little canvas game
     TERMINAL              - the boot screen + typed-out resume view
   ===================================================================== */
(function(){
  /* ---------------- CONTENT ----------------
     Single source of truth for everything shown on the site. Both the
     desktop windows and the terminal read from this object, so editing a
     value here updates it in both places. */
  var resume={
    name:"Ise Okhiria",
    role:"Software Development Engineer",
    contact:{
      email:"britneyiseo@gmail.com",
      phone:"901-518-5080",
      linkedin:"https://linkedin.com/in/iseokhiria"
    },
    summary:{
      now:"Software Development Engineer at Amazon, building real-time systems that keep 100+ fulfillment centers running.",
      going: "I enjoy building software that solves real problems, and I like to focus on mission driven work that has a tangible impact on people's lives."
    },
    about:[
      "At Amazon I work on real-time workforce optimization across the fulfillment network; before that I built analytics and financial education products at a startup, and trained machine-learning models for biomedical research.",
    ],
    education:{degree:"B.S. in Computer Science", school:"Northeastern University", date:"May 2025"},
    experience:[
      {yr:"Jun 2025 — Present", role:"Software Development Engineer", co:"Amazon · Minneapolis, MN", points:[
        "Led the design and launch of a real-time workforce optimization experiment across 44 fulfillment centers, aligning stakeholders on the approach and cutting wasted worker travel time by 50%.",
        "Eliminated recurring deployment conflicts for 12 engineers across 2 teams by splitting a shared config pipeline into independent, team-owned deployment pipelines built with AWS AppConfig, AWS CDK, and TypeScript.",
        "Coordinated rollback and built a recovery pipeline that reprocessed 5.8M messages during a production outage as on-call engineer, restoring real-time data flow for warehouse operations.",
        "Implemented event-driven pipelines exposing 39 operational metrics across 100+ fulfillment centers, enabling large-scale analysis and ongoing algorithm improvements."
      ]},
      {yr:"Jan 2023 — Jun 2025", role:"Software Developer", co:"Willow Inc. · Boston, MA", points:[
        "Led end-to-end development of an internal business analytics dashboard using React and Django, with REST APIs and cloud services for real-time analytics and visualization.",
        "Ran unit and integration testing, debugged performance issues, maintained technical documentation, and enforced best practices for maintainability, scalability, and quality.",
        "Designed and launched fintech platform features: an advisory certification platform, advisor directory, and advisor AI matching tool."
      ]},
      {yr:"Sep 2023 — Aug 2024", role:"Machine Learning Researcher", co:"Ghoreishi Lab · Boston, MA", points:[
        "Developed a Support Vector Machine model in Python to help identify blood biomarkers for mental-disorder diagnosis and classification, reaching 92% classification accuracy.",
        "Collaborated with the research team on literature review, study design, data collection/analysis, and interpretation using statistical and ML techniques.",
        "Published a peer-reviewed paper in an IEEE journal and presented at MIT URTC.",
        "Paper: https://ieeexplore.ieee.org/document/10937586"
      ]}
    ],
    projects:[
      {name:"OFF RAG Assistant", date:"2026 — Present", desc:"A retrieval-augmented-generation assistant over the Open Food Facts wiki: it ingests and normalizes MediaWiki content, chunks and embeds it, retrieves the top-k passages by cosine similarity, and generates answers grounded in — and citing — the source, refusing when the evidence is insufficient. Retrieval is measured with recall@k and generation with citation accuracy against a hand-built gold set.", tags:["Python","RAG","BGE-M3","Chroma","Claude API"]},
      {name:"RL Agent for IoT Security", date:"Jan 2025 — May 2025", desc:"Engineered a safe reinforcement-learning agent using deep Q-learning (DQN) and Soft Actor-Critic (SAC) to explore simulated dynamic smart-home network environments within safety constraints.", tags:["Python","DQN","SAC","Safe RL"], links:[{label:"GitHub",url:"https://github.com/britneyio/SafeRL-for-IoT"}]},
      {name:"Bipolar Biomarkers SVM", date:"Sep 2023 — Aug 2024", desc:"Developed a Support Vector Machine model in Python to identify blood biomarkers for mental-disorder diagnosis and classification, reaching 92% classification accuracy. Contributed to literature review, study design, and data analysis, and published a peer-reviewed paper in an IEEE journal (presented at MIT URTC).", tags:["Python","SVM","Machine Learning","Research"], links:[{label:"GitHub",url:"https://github.com/britneyio/Bipolar-Biomarkers-SVM"},{label:"IEEE Paper",url:"https://ieeexplore.ieee.org/document/10937586"}]},
      {name:"Closet Project", date:"Jan 2022 — Jan 2023", desc:"Built a wardrobe-management web app with Python and React over a RESTful API backend, using PostgreSQL for storage, with dynamic item tracking and outfit planning.", tags:["Python","React","PostgreSQL","REST"], links:[{label:"GitHub",url:"https://github.com/britneyio/the-closet-project"}]}
    ],
    skills:{
      "Cloud & Infra":["AWS","AWS CDK","AWS AppConfig","Google Cloud","Docker","Heroku","Linux"],
      "Languages":["Python","TypeScript","JavaScript","Java","Go","SQL (PostgreSQL)","HTML/CSS"],
      "Frameworks & Tools":["React","Django","REST APIs","Git","ROS","Data Visualization"],
      "Strengths":["Innovation","Collaboration","Adaptability","Critical Thinking"]
    },
    interests:["Webtoon","Drums","Rock Climbing"]
  };

  /* ---------------- DESKTOP WINDOW RENDER ----------------
     Small helpers, then we fill each window body's innerHTML from `resume`.
     User-supplied strings always go through escapeHtml first so a stray
     "<" or "&" in the data can't break the markup. */
  function byId(id){return document.getElementById(id);}
  // Escape the 3 HTML-significant characters so data renders as literal text.
  function escapeHtml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  // Escape first, THEN turn bare http(s) URLs into safe anchor tags.
  function linkifyUrls(s){
    return escapeHtml(s).replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
  }

  byId("b-about").innerHTML=
    '<h2>About Me</h2>'+
    '<p class="tag-lead">'+escapeHtml(resume.name)+' &middot; '+escapeHtml(resume.role)+'</p>'+
    '<p>'+escapeHtml(resume.summary.now)+' '+escapeHtml(resume.summary.going)+'</p>'+
    resume.about.map(function(p){return '<p>'+escapeHtml(p)+'</p>';}).join('')+
    '<p class="tag-lead">Education</p><p>'+escapeHtml(resume.education.degree)+' &mdash; '+escapeHtml(resume.education.school)+' &middot; '+escapeHtml(resume.education.date)+'</p>';

  byId("b-exp").innerHTML='<h2>Experience</h2><ul class="xp">'+resume.experience.map(function(x){
    return '<li><div class="xp__yr">'+escapeHtml(x.yr)+'</div><div class="xp__role">'+escapeHtml(x.role)+'</div><div class="xp__co">'+escapeHtml(x.co)+'</div><ul class="xp__pts">'+
      x.points.map(function(p){return '<li>'+linkifyUrls(p)+'</li>';}).join('')+'</ul></li>';
  }).join('')+'</ul>';

  byId("b-proj").innerHTML='<h2>Projects</h2><div class="pj">'+resume.projects.map(function(p){
    return '<article><h3>'+escapeHtml(p.name)+'</h3><p class="date">'+escapeHtml(p.date)+'</p><p>'+escapeHtml(p.desc)+'</p>'+
      (p.links?'<p class="links">'+p.links.map(function(l){return '<a href="'+encodeURI(l.url)+'" target="_blank" rel="noopener">'+escapeHtml(l.label)+' ↗</a>';}).join(' &middot; ')+'</p>':'')+
      '<div class="tags">'+
      p.tags.map(function(t){return '<span class="tag">'+escapeHtml(t)+'</span>';}).join('')+'</div></article>';
  }).join('')+'</div>';

  byId("b-skills").innerHTML='<h2>Skills</h2>'+Object.keys(resume.skills).map(function(g){
    return '<div class="skill-grp"><h3>'+escapeHtml(g)+'</h3><div class="badges">'+
      resume.skills[g].map(function(s){return '<span class="badge">'+escapeHtml(s)+'</span>';}).join('')+'</div></div>';
  }).join('');

  byId("b-int").innerHTML='<h2>Interests</h2><div class="badges">'+resume.interests.map(function(i){return '<span class="badge">'+escapeHtml(i)+'</span>';}).join('')+'</div>';

  /* ---------------- WINDOW MANAGER ----------------
     Fake OS windowing: each .win is a section; a matching button in the
     taskbar tracks it. topZIndex climbs so the focused window sits on top.
     This is a "single page" desktop — opening one window closes the others. */
  var desktop=byId("desktop"), tasks=byId("tasks"), startButton=byId("startbtn"), startMenu=byId("startmenu");
  var topZIndex=20;                                   // bumped each focus so the active window stacks on top
  function isMobileViewport(){return window.matchMedia("(max-width:640px)").matches;}
  // Raise a window above the rest and sync the .active / taskbar .on highlights.
  function focusWindow(win){topZIndex++;win.style.zIndex=topZIndex;document.querySelectorAll(".win").forEach(function(x){x.classList.toggle("active",x===win);});document.querySelectorAll(".task").forEach(function(t){t.classList.toggle("on",t.dataset.win===win.id);});}
  function taskButtonFor(id){return tasks.querySelector('[data-win="'+id+'"]');}
  // Show a window: close whatever else is open, center it on desktop (not
  // mobile), make sure it has a taskbar button, then focus it.
  function openWindow(id){
    var win=byId(id); if(!win) return;
    /* single "page": close any other open window first */
    document.querySelectorAll(".win").forEach(function(x){if(x!==win&&!x.hidden){x.hidden=true;var t=taskButtonFor(x.id);if(t)t.remove();if(x.id==="w-games")Snake.stop();}});
    if(win.hidden)win.hidden=false;
    if(!isMobileViewport()){
      // Center the window horizontally on the desktop and open it near the top
      // (over the icon row — the higher z-index means it cleanly covers them).
      var margin=24,d=desktop.getBoundingClientRect(),maxW=d.width-margin*2;
      win.style.width=""; if(win.offsetWidth>maxW)win.style.width=maxW+"px";
      win.style.left=Math.round(Math.max(margin,(d.width-win.offsetWidth)/2))+"px";
      win.style.top="24px";
    }
    if(!taskButtonFor(id)){var b=document.createElement("button");b.className="task out";b.dataset.win=id;b.textContent=win.dataset.title;
      b.addEventListener("click",function(){if(win.hidden){win.hidden=false;focusWindow(win);}else if(win.classList.contains("active")){win.hidden=true;b.classList.remove("on");}else focusWindow(win);});
      tasks.appendChild(b);}
    focusWindow(win); if(id==="w-games") Snake.ready();
  }
  function closeWindow(win){win.hidden=true;var t=taskButtonFor(win.id);if(t)t.remove();if(win.id==="w-games")Snake.stop();}

  // When the terminal is open, a desktop-icon click scrolls to the matching
  // terminal section instead of opening a window. This maps window id -> section id.
  var WINDOW_TO_SECTION={"w-about":"sec-about","w-exp":"sec-exp","w-proj":"sec-proj","w-skills":"sec-skills","w-int":"sec-int"};
  function selectIcon(elm){if(elm.classList.contains("icon")){document.querySelectorAll(".icon").forEach(function(i){i.classList.remove("sel");});elm.classList.add("sel");}}
  document.querySelectorAll("[data-win]").forEach(function(elm){
    if(elm.classList.contains("task"))return;
    elm.addEventListener("click",function(){
      var id=elm.dataset.win;
      if(!terminal.classList.contains("off")){           /* terminal open: scroll to that section */
        if(WINDOW_TO_SECTION[id]){scrollToSection(WINDOW_TO_SECTION[id]);selectIcon(elm);return;}
        if(id==="w-games"){launchDesktop();openWindow("w-games");selectIcon(elm);return;}
      }
      openWindow(id);hideStartMenu();selectIcon(elm);
    });
  });

  document.querySelectorAll(".win").forEach(function(win){
    win.addEventListener("pointerdown",function(){focusWindow(win);},true);
    win.querySelector(".cl").addEventListener("click",function(e){e.stopPropagation();closeWindow(win);});
    win.querySelector(".mn").addEventListener("click",function(e){e.stopPropagation();win.hidden=true;var t=taskButtonFor(win.id);if(t)t.classList.remove("on");});
    // Drag the window by its title bar (pointer events cover mouse + touch;
    // dragging is disabled on mobile, where windows are full-screen).
    var bar=win.querySelector(".win__bar"),dragging=false,offsetX=0,offsetY=0;
    bar.addEventListener("pointerdown",function(e){if(e.target.closest(".win__btns")||isMobileViewport())return;dragging=true;bar.style.cursor="grabbing";var r=win.getBoundingClientRect();offsetX=e.clientX-r.left;offsetY=e.clientY-r.top;bar.setPointerCapture(e.pointerId);});
    bar.addEventListener("pointermove",function(e){if(!dragging)return;var d=desktop.getBoundingClientRect();var nx=e.clientX-d.left-offsetX,ny=e.clientY-d.top-offsetY;nx=Math.max(0,Math.min(nx,d.width-60));ny=Math.max(0,Math.min(ny,d.height-40));win.style.left=nx+"px";win.style.top=ny+"px";});
    bar.addEventListener("pointerup",function(){dragging=false;bar.style.cursor="grab";});
  });

  document.addEventListener("keydown",function(e){if(e.key==="Escape"){var a=document.querySelector(".win.active:not([hidden])");if(a)closeWindow(a);hideStartMenu();}});

  function hideStartMenu(){startMenu.hidden=true;startButton.setAttribute("aria-expanded","false");}
  startButton.addEventListener("click",function(e){e.stopPropagation();var wasHidden=startMenu.hidden;startMenu.hidden=!wasHidden;startButton.setAttribute("aria-expanded",String(wasHidden));});
  document.addEventListener("click",function(e){
    if(!startMenu.hidden&&!startMenu.contains(e.target)&&e.target!==startButton)hideStartMenu();
    if(!e.target.closest(".icon"))document.querySelectorAll(".icon").forEach(function(i){i.classList.remove("sel");});
  });

  var clock=byId("clock");
  function updateClock(){var d=new Date(),h=d.getHours(),m=d.getMinutes();clock.textContent=(h<10?"0":"")+h+":"+(m<10?"0":"")+m;}
  updateClock();setInterval(updateClock,15000);

  /* terminal <-> desktop
     The site has two "modes": the graphical desktop and the fullscreen
     terminal overlay. These two functions swap between them. */
  var terminal=byId("terminal");
  function showTerminal(){document.querySelectorAll(".win").forEach(function(win){if(!win.hidden){win.hidden=true;var t=taskButtonFor(win.id);if(t)t.remove();if(win.id==="w-games")Snake.stop();}});terminal.classList.remove("off");desktop.classList.add("term-on");hideStartMenu();startBoot();}
  function launchDesktop(){terminal.classList.add("off");desktop.classList.remove("term-on");document.querySelectorAll(".icon").forEach(function(i){i.classList.remove("sel");});}
  byId("term-icon").addEventListener("click",showTerminal);
  byId("mi-term").addEventListener("click",function(){showTerminal();});
  byId("term-exit").addEventListener("click",launchDesktop);
  byId("startpc").addEventListener("click",showTerminal);
  byId("contactpc").addEventListener("click",function(){showTerminal();(function reach(){if(byId("sec-contact"))scrollToSection("sec-contact");else setTimeout(reach,120);})();});

  /* ---------------- SNAKE ----------------
     A self-contained mini-game on a 15x15 grid drawn to a <canvas>. Exposes
     only { ready, stop } so the window manager can init/teardown it. */
  var Snake=(function(){
    var canvas=byId("snake"),ctx=canvas.getContext("2d"),GRID=15,cellSize=canvas.width/GRID;
    // body = array of {x,y} cells, head first; direction = current heading.
    var body,direction,food,timer,score,running=false,scoreLabel=byId("snake-score");
    function placeFood(){food={x:Math.floor(Math.random()*GRID),y:Math.floor(Math.random()*GRID)};}
    function resetGame(){body=[{x:7,y:7},{x:6,y:7},{x:5,y:7}];direction={x:1,y:0};score=0;placeFood();scoreLabel.textContent="SCORE 0";draw();}
    function draw(){ctx.fillStyle="#1a1220";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#ff9dcb";ctx.fillRect(food.x*cellSize,food.y*cellSize,cellSize,cellSize);for(var i=0;i<body.length;i++){ctx.fillStyle=i===0?"#57ffb0":"#1fa56d";ctx.fillRect(body[i].x*cellSize+1,body[i].y*cellSize+1,cellSize-2,cellSize-2);}}
    // One tick: move the head; end the game on a wall/self hit; grow when it
    // eats food (skip the tail-pop), otherwise pop the tail to keep length.
    function step(){var head={x:body[0].x+direction.x,y:body[0].y+direction.y};if(head.x<0||head.y<0||head.x>=GRID||head.y>=GRID||body.some(function(s){return s.x===head.x&&s.y===head.y;})){stopGame();ctx.fillStyle="rgba(26,18,32,.82)";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#ff9dcb";ctx.font="12px PressStart, monospace";ctx.textAlign="center";ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2);return;}body.unshift(head);if(head.x===food.x&&head.y===food.y){score++;scoreLabel.textContent="SCORE "+score;placeFood();}else body.pop();draw();}
    function startGame(){resetGame();running=true;clearInterval(timer);timer=setInterval(step,140);}
    function stopGame(){running=false;clearInterval(timer);}
    function ready(){if(!body)resetGame();}
    byId("snake-start").addEventListener("click",startGame);
    document.addEventListener("keydown",function(e){if(!running)return;var k=e.key.toLowerCase(),nextDir=null;if(k==="arrowup"||k==="w")nextDir={x:0,y:-1};else if(k==="arrowdown"||k==="s")nextDir={x:0,y:1};else if(k==="arrowleft"||k==="a")nextDir={x:-1,y:0};else if(k==="arrowright"||k==="d")nextDir={x:1,y:0};if(nextDir&&(nextDir.x!==-direction.x||nextDir.y!==-direction.y)){direction=nextDir;e.preventDefault();}});
    return {ready:ready,stop:stopGame};
  })();

  /* ---------------- TERMINAL (scroll + section bar) ----------------
     Renders the resume as terminal output. printLine adds plain text,
     printHtml adds pre-built markup (links/bold), printHeader adds a section
     heading with an id the "GO>" bar can scroll to. */
  var termOut=byId("term-out"), termScroll=byId("term-scroll");
  var prefersReducedMotion=window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  function printLine(text,cls){var d=document.createElement("div");d.className="tl"+(cls?" "+cls:"");d.textContent=text;termOut.appendChild(d);return d;}
  function printHtml(html,cls){var d=document.createElement("div");d.className="tl"+(cls?" "+cls:"");d.innerHTML=html;termOut.appendChild(d);return d;}
  function printHeader(t,id){var d=printHtml(escapeHtml(t),"h");if(id)d.id=id;d.setAttribute("role","heading");d.setAttribute("aria-level","2");return d;}
  function scrollTerminalToBottom(){termScroll.scrollTop=termScroll.scrollHeight;}

  function printAbout(){printHeader("ABOUT","sec-about");var bn=printHtml(escapeHtml(resume.name),"bigname");bn.setAttribute("role","heading");bn.setAttribute("aria-level","1");printLine(resume.role,"sub");printHtml(escapeHtml(resume.summary.now)+" "+escapeHtml(resume.summary.going),"k");printLine("");resume.about.forEach(function(p){printLine(p);printLine("");});printHtml("<b>Education:</b> "+escapeHtml(resume.education.degree)+" — "+escapeHtml(resume.education.school)+" · "+escapeHtml(resume.education.date),"k");}
  function printExperience(){printHeader("EXPERIENCE","sec-exp");resume.experience.forEach(function(x){printHtml("<b>"+escapeHtml(x.role)+"</b>","k");printLine(x.co+"  |  "+x.yr,"sub");x.points.forEach(function(p){printHtml("- "+linkifyUrls(p),"b");});printLine("");});}
  function printProjects(){printHeader("PROJECTS","sec-proj");resume.projects.forEach(function(p){printHtml("<b>"+escapeHtml(p.name)+"</b>","k");printLine(p.date,"sub");printLine(p.desc);if(p.links)p.links.forEach(function(l){printHtml(escapeHtml(l.label)+": "+linkifyUrls(l.url),"sub");});printLine("["+p.tags.join("] [")+"]","sub");printLine("");});}
  function printSkills(){printHeader("SKILLS","sec-skills");Object.keys(resume.skills).forEach(function(g){printHtml("<b>"+escapeHtml(g)+":</b> "+escapeHtml(resume.skills[g].join(", ")),"k");});}
  function printInterests(){printHeader("INTERESTS","sec-int");printLine(resume.interests.join("  ·  "));}
  function printContact(){printHeader("CONTACT","sec-contact");printHtml("email     "+'<a href="mailto:'+resume.contact.email+'">'+escapeHtml(resume.contact.email)+"</a>","k");printHtml("phone     "+escapeHtml(resume.contact.phone),"k");printHtml("linkedin  "+'<a href="'+resume.contact.linkedin+'" target="_blank" rel="noopener">'+escapeHtml(resume.contact.linkedin)+"</a>","k");}
  function printAll(){printAbout();printExperience();printProjects();printSkills();printInterests();printContact();}

  function scrollToSection(id){var h=byId(id);if(!h)return;var delta=h.getBoundingClientRect().top-termScroll.getBoundingClientRect().top;termScroll.scrollTo({top:termScroll.scrollTop+delta-8,behavior:prefersReducedMotion?"auto":"smooth"});}
  document.querySelectorAll("#term-cmdbar [data-go]").forEach(function(b){b.addEventListener("click",function(){scrollToSection(b.dataset.go);});});
  byId("cmd-startx").addEventListener("click",function(){launchDesktopFromTerminal();});

  function launchDesktopFromTerminal(){printHtml("Launching PIXEL/OS ...","k");scrollTerminalToBottom();setTimeout(launchDesktop,550);}

  /* boot sequence: print the fake BIOS lines one at a time (or all at once
     if the user prefers reduced motion), then render the full resume. Guarded
     by hasBooted so re-entering the terminal doesn't replay it. */
  var bootMessages=[
    "MICRO-OKHIRIA 2000  BIOS v1.2",
    "CPU ....... 8-BIT  OK",
    "Memory Test ....... 640K  OK",
    "Detecting drives ....... [C:]  PIXEL/OS",
    "Mounting /home/guest ....... OK",
    "Loading resume.exe ...",
    "",
    "Welcome. Scroll to read, tap a section on the bar below,",
    "or hit Desktop » to boot the graphical interface.",
    ""
  ];
  function finishBoot(){printAll();termScroll.scrollTop=0;}
  var hasBooted=false;
  function startBoot(){
    if(hasBooted)return; hasBooted=true;
    if(prefersReducedMotion){bootMessages.forEach(function(b){printLine(b,"k");});finishBoot();}
    else{var i=0;(function next(){if(i<bootMessages.length){printLine(bootMessages[i],"k");i++;scrollTerminalToBottom();setTimeout(next,200);}else finishBoot();})();}
  }
})();
