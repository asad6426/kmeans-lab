(function(){
  "use strict";

  /* ---------------- chart geometry ---------------- */
  function px(x){ return 70 + (x/50)*546; }
  function py(y){ return 350 - (y/1000)*326; }

  var pointsData = {
    c1:{x:5,y:120},  c2:{x:42,y:890}, c3:{x:30,y:800}, c4:{x:18,y:300},
    c5:{x:45,y:950}, c6:{x:8,y:180},  c7:{x:38,y:820}, c8:{x:12,y:250}
  };
  var seeds = {c1:'k1', c2:'k2'};

  var steps = [
    {
      dot:"Start", label:"Step 1 / 8", title:"Seed the centroids",
      active:null,
      assigned:{c1:'k1', c2:'k2'},
      centroids:{k1:{x:5,y:120}, k2:{x:42,y:890}},
      narrative:"k = 2 is chosen for this problem. Two customers, c1 (5, 120) and c2 (42, 890), are picked at random to seed the two centroids.",
      calc:[]
    },
    {
      dot:"c3", label:"Step 2 / 8", title:"Evaluate c3 (30, 800)",
      active:'c3',
      assigned:{c1:'k1', c2:'k2', c3:'k2'},
      centroids:{k1:{x:5,y:120}, k2:{x:42,y:890}},
      narrative:"c3 is compared against both centroids. It lands far closer to k2, so it joins that cluster — matching the quiz answer for question 9.",
      calc:[
        "d(c3, k1) = √((30−5)² + (800−120)²) = √(625 + 462400) ≈ 680.5",
        "d(c3, k2) = √((30−42)² + (800−890)²) = √(144 + 8100) ≈ 90.8",
        "WIN|90.8 < 680.5  →  c3 joins k2",
        "new k2 centroid = ((42+30)/2, (890+800)/2) = (36, 845)"
      ],
      winner:'k2'
    },
    {
      dot:"c4", label:"Step 3 / 8", title:"Evaluate c4 (18, 300)",
      active:'c4',
      assigned:{c1:'k1', c2:'k2', c3:'k2', c4:'k1'},
      centroids:{k1:{x:5,y:120}, k2:{x:36,y:845}},
      narrative:"This is the case essay prompt 3 asks about. c4 sits much closer to k1 than to the now-updated k2, so it joins k1 instead.",
      calc:[
        "d(c4, k1) = √((18−5)² + (300−120)²) = √(169 + 32400) ≈ 180.5",
        "d(c4, k2) = √((18−36)² + (300−845)²) = √(324 + 297025) ≈ 545.3",
        "WIN|180.5 < 545.3  →  c4 joins k1",
        "new k1 centroid = ((5+18)/2, (120+300)/2) = (11.5, 210)"
      ],
      winner:'k1'
    },
    {
      dot:"c5", label:"Step 4 / 8", title:"Evaluate c5 (45, 950)",
      active:'c5',
      assigned:{c1:'k1', c2:'k2', c3:'k2', c4:'k1', c5:'k2'},
      centroids:{k1:{x:11.5,y:210}, k2:{x:36,y:845}},
      narrative:"A high-frequency, high-spend customer — clearly nearer k2 again.",
      calc:[
        "d(c5, k1) = √((45−11.5)² + (950−210)²) = √(1122.25 + 547600) ≈ 740.8",
        "d(c5, k2) = √((45−36)² + (950−845)²) = √(81 + 11025) ≈ 105.4",
        "WIN|105.4 < 740.8  →  c5 joins k2",
        "new k2 centroid = ((36+45)/2, (845+950)/2) = (40.5, 897.5)"
      ],
      winner:'k2'
    },
    {
      dot:"c6", label:"Step 5 / 8", title:"Evaluate c6 (8, 180)",
      active:'c6',
      assigned:{c1:'k1', c2:'k2', c3:'k2', c4:'k1', c5:'k2', c6:'k1'},
      centroids:{k1:{x:11.5,y:210}, k2:{x:40.5,y:897.5}},
      narrative:"A low-frequency, low-spend shopper — an easy call for k1.",
      calc:[
        "d(c6, k1) = √((8−11.5)² + (180−210)²) = √(12.25 + 900) ≈ 30.2",
        "d(c6, k2) = √((8−40.5)² + (180−897.5)²) = √(1056.25 + 514806.25) ≈ 718.2",
        "WIN|30.2 < 718.2  →  c6 joins k1",
        "new k1 centroid = ((11.5+8)/2, (210+180)/2) = (9.75, 195)"
      ],
      winner:'k1'
    },
    {
      dot:"c7", label:"Step 6 / 8", title:"Evaluate c7 (38, 820)",
      active:'c7',
      assigned:{c1:'k1', c2:'k2', c3:'k2', c4:'k1', c5:'k2', c6:'k1', c7:'k2'},
      centroids:{k1:{x:9.75,y:195}, k2:{x:40.5,y:897.5}},
      narrative:"Frequent and high-spend again — joins k2.",
      calc:[
        "d(c7, k1) = √((38−9.75)² + (820−195)²) = √(798.06 + 390625) ≈ 625.6",
        "d(c7, k2) = √((38−40.5)² + (820−897.5)²) = √(6.25 + 6006.25) ≈ 77.5",
        "WIN|77.5 < 625.6  →  c7 joins k2",
        "new k2 centroid = ((40.5+38)/2, (897.5+820)/2) = (39.25, 858.75)"
      ],
      winner:'k2'
    },
    {
      dot:"c8", label:"Step 7 / 8", title:"Evaluate c8 (12, 250)",
      active:'c8',
      assigned:{c1:'k1', c2:'k2', c3:'k2', c4:'k1', c5:'k2', c6:'k1', c7:'k2', c8:'k1'},
      centroids:{k1:{x:9.75,y:195}, k2:{x:39.25,y:858.75}},
      narrative:"The last customer — closer to k1's low-frequency, low-spend center.",
      calc:[
        "d(c8, k1) = √((12−9.75)² + (250−195)²) = √(5.06 + 3025) ≈ 55.1",
        "d(c8, k2) = √((12−39.25)² + (250−858.75)²) = √(742.56 + 370631.56) ≈ 609.4",
        "WIN|55.1 < 609.4  →  c8 joins k1",
        "new k1 centroid = ((9.75+12)/2, (195+250)/2) = (10.875, 222.5)"
      ],
      winner:'k1'
    },
    {
      dot:"Done", label:"Step 8 / 8", title:"Final segments",
      active:null,
      assigned:{c1:'k1', c2:'k2', c3:'k2', c4:'k1', c5:'k2', c6:'k1', c7:'k2', c8:'k1'},
      centroids:{k1:{x:10.875,y:222.5}, k2:{x:39.25,y:858.75}},
      narrative:"Every customer is assigned and no further point remains to test. k1 = {c1, c4, c6, c8} — occasional, low-spend shoppers. k2 = {c2, c3, c5, c7} — frequent, high-spend shoppers.",
      calc:[]
    }
  ];

  /* ---------------- static chart chrome ---------------- */
  var gridlines = document.getElementById('gridlines');
  var axes = document.getElementById('axes');
  var yTicks = [0,200,400,600,800,1000];
  var xTicks = [0,10,20,30,40,50];
  var gSvg = "";
  yTicks.forEach(function(v){
    gSvg += '<line class="gridline" x1="70" x2="616" y1="'+py(v)+'" y2="'+py(v)+'"></line>';
  });
  gridlines.innerHTML = gSvg;

  var aSvg = '<line class="axis-line" x1="70" y1="350" x2="616" y2="350"></line>';
  aSvg += '<line class="axis-line" x1="70" y1="24" x2="70" y2="350"></line>';
  yTicks.forEach(function(v){
    aSvg += '<text class="tick-label" x="60" y="'+(py(v)+3)+'" text-anchor="end">'+v+'</text>';
  });
  xTicks.forEach(function(v){
    aSvg += '<text class="tick-label" x="'+px(v)+'" y="365" text-anchor="middle">'+v+'</text>';
  });
  aSvg += '<text class="axis-label" x="343" y="392" text-anchor="middle">Monthly visit frequency</text>';
  aSvg += '<text class="axis-label" x="-187" y="20" text-anchor="middle" transform="rotate(-90)">Avg. order value ($)</text>';
  axes.innerHTML = aSvg;

  /* points layer (persistent nodes) */
  var pointsLayer = document.getElementById('points-layer');
  var pSvg = "";
  Object.keys(pointsData).forEach(function(id){
    var p = pointsData[id];
    var isSeed = !!seeds[id];
    pSvg += '<g>';
    pSvg += '<circle id="pt-'+id+'" class="pt pt-unassigned'+(isSeed?' pt-seed':'')+'" cx="'+px(p.x)+'" cy="'+py(p.y)+'" r="7"><title>'+id+' ('+p.x+', '+p.y+')</title></circle>';
    pSvg += '<text class="pt-label" x="'+(px(p.x)+10)+'" y="'+(py(p.y)+4)+'">'+id+'</text>';
    pSvg += '</g>';
  });
  pointsLayer.innerHTML = pSvg;

  /* dataset table (data shown first, before any calculation) */
  var datasetBody = document.getElementById('dataset-body');
  Object.keys(pointsData).forEach(function(id){
    var p = pointsData[id];
    var tr = document.createElement('tr');
    tr.id = 'ds-'+id;
    tr.innerHTML =
      '<td>'+id+(seeds[id] ? '<span class="ds-seed">seed · '+seeds[id]+'</span>' : '')+'</td>'+
      '<td>'+p.x+'</td>'+
      '<td>'+p.y+'</td>'+
      '<td><span class="ds-pill ds-pending" id="ds-pill-'+id+'">—</span></td>';
    datasetBody.appendChild(tr);
  });

  function paintDataset(assignedMap, activeId, winner){
    Object.keys(pointsData).forEach(function(id){
      var row = document.getElementById('ds-'+id);
      var pill = document.getElementById('ds-pill-'+id);
      var cluster = assignedMap[id];
      pill.textContent = cluster ? cluster : '—';
      pill.className = 'ds-pill' + (cluster ? ' ds-'+cluster : ' ds-pending');
      row.classList.remove('active-row', 'ds-win-k1', 'ds-win-k2');
      if(id === activeId){
        row.classList.add('active-row');
        if(winner){ row.classList.add('ds-win-'+winner); }
      }
    });
  }

  var activeRing = document.createElementNS("http://www.w3.org/2000/svg","circle");
  activeRing.setAttribute("id","active-ring");
  activeRing.setAttribute("class","active-ring");
  activeRing.setAttribute("r","13");
  document.getElementById('centroids-layer').appendChild(activeRing);

  var calcLinesG = document.getElementById('calc-lines');
  var centroidK1 = document.getElementById('centroid-k1');
  var centroidK2 = document.getElementById('centroid-k2');
  var centroidK1Label = document.getElementById('centroid-k1-label');
  var centroidK2Label = document.getElementById('centroid-k2-label');
  var formulaBanner = document.getElementById('formula-banner');
  var narrativeEl = document.getElementById('narrative');
  var calcEl = document.getElementById('calc-console');
  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var btnPlay = document.getElementById('btn-play');

  function dist(a,b){ return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)); }

  /* ---------------- shared helpers ---------------- */
  var current = 0;
  var playTimer = null;
  var pending = [];      // live setTimeout ids, cleared on any new navigation
  var animating = false;

  function clearPending(){
    pending.forEach(clearTimeout);
    pending = [];
  }
  function after(ms, fn){ pending.push(setTimeout(fn, ms)); }

  function setNav(i){
    current = i;
    btnPrev.disabled = (i === 0) || animating;
    btnNext.disabled = (i === steps.length-1) || animating;
    Array.prototype.forEach.call(document.querySelectorAll('.dot'), function(d, idx){
      d.classList.toggle('active', idx === i);
    });
  }

  function setPointClasses(assigned, poppedId){
    Object.keys(pointsData).forEach(function(id){
      var el = document.getElementById('pt-'+id);
      var cluster = assigned[id];
      var cls = 'pt ' + (cluster ? 'pt-'+cluster : 'pt-unassigned') + (seeds[id] ? ' pt-seed' : '');
      el.setAttribute('class', cls);
      if(id === poppedId){
        el.classList.remove('pop'); void el.getBBox(); el.classList.add('pop');
      }
    });
  }

  function placeCentroids(c){
    centroidK1.setAttribute('cx', px(c.k1.x)); centroidK1.setAttribute('cy', py(c.k1.y));
    centroidK2.setAttribute('cx', px(c.k2.x)); centroidK2.setAttribute('cy', py(c.k2.y));
    centroidK1Label.setAttribute('x', px(c.k1.x)); centroidK1Label.setAttribute('y', py(c.k1.y)+3.5);
    centroidK2Label.setAttribute('x', px(c.k2.x)); centroidK2Label.setAttribute('y', py(c.k2.y)+3.5);
  }

  function buildConsole(lines, immediate){
    calcEl.innerHTML = '';
    lines.forEach(function(line, idx){
      var row = document.createElement('div');
      row.className = 'calc-row';
      row.innerHTML = line.indexOf('WIN|') === 0
        ? '<span class="win">'+line.slice(4)+'</span>'
        : line;
      calcEl.appendChild(row);
      if(immediate){
        row.classList.add('show');
      } else {
        after(idx*200, function(){ row.classList.add('show'); });
      }
    });
  }

  function countUp(el, target, duration, done){
    var start = null;
    function step(ts){
      if(start === null) start = ts;
      var p = Math.min((ts-start)/duration, 1);
      var eased = 1 - Math.pow(1-p, 3);
      el.textContent = (target*eased).toFixed(1);
      if(p < 1){ requestAnimationFrame(step); }
      else { el.textContent = target.toFixed(1); if(done) done(); }
    }
    requestAnimationFrame(step);
  }

  /* ---------------- instant render (Prev / jump / initial) ---------------- */
  function renderInstant(i){
    clearPending(); animating = false;
    i = Math.max(0, Math.min(steps.length-1, i));
    var s = steps[i];
    setNav(i);

    document.getElementById('step-label').textContent = s.label;
    document.getElementById('step-title').textContent = s.title;
    narrativeEl.textContent = s.narrative;
    narrativeEl.classList.add('show');
    formulaBanner.classList.toggle('flash', !!s.active);

    setPointClasses(s.assigned, null);
    paintDataset(s.assigned, s.active, s.active ? s.winner : null);
    placeCentroids(s.centroids);
    buildConsole(s.calc, true);

    calcLinesG.innerHTML = '';
    if(s.active){
      var pt = pointsData[s.active];
      activeRing.setAttribute('cx', px(pt.x));
      activeRing.setAttribute('cy', py(pt.y));
      activeRing.classList.add('show');
      ['k1','k2'].forEach(function(k){
        var c = s.centroids[k];
        var isWin = s.winner === k;
        var line = document.createElementNS("http://www.w3.org/2000/svg","line");
        line.setAttribute('class','calc-line '+(isWin?'winner':'loser'));
        line.setAttribute('x1', px(pt.x)); line.setAttribute('y1', py(pt.y));
        line.setAttribute('x2', px(c.x));  line.setAttribute('y2', py(c.y));
        line.style.stroke = 'var(--'+k+')';
        calcLinesG.appendChild(line);
        var label = document.createElementNS("http://www.w3.org/2000/svg","text");
        label.setAttribute('class','dist-label show '+(isWin?'winner':'loser'));
        var mx = (px(pt.x)+px(c.x))/2, my = (py(pt.y)+py(c.y))/2;
        label.setAttribute('x', mx); label.setAttribute('y', my-6);
        label.style.fill = 'var(--'+k+')';
        label.textContent = dist(pt,c).toFixed(1);
        calcLinesG.appendChild(label);
      });
    } else {
      activeRing.classList.remove('show');
    }

    stopPlay();
  }

  /* ---------------- animated forward transition (Next / Play) ---------------- */
  function animateForward(i){
    clearPending();
    var s = steps[i];
    animating = true;
    setNav(i);

    document.getElementById('step-label').textContent = s.label;
    document.getElementById('step-title').textContent = s.title;
    narrativeEl.classList.remove('show');
    after(120, function(){ narrativeEl.textContent = s.narrative; narrativeEl.classList.add('show'); });

    formulaBanner.classList.toggle('flash', !!s.active);
    calcLinesG.innerHTML = '';
    calcEl.innerHTML = '';

    if(!s.active){
      buildConsole(s.calc, false);
      activeRing.classList.remove('show');
      paintDataset(s.assigned, null, null);
      if(i === steps.length-1){
        after(300, function(){
          centroidK1.classList.add('settle'); centroidK2.classList.add('settle');
          after(850, function(){ centroidK1.classList.remove('settle'); centroidK2.classList.remove('settle'); });
        });
      }
      after(500, function(){ animating = false; setNav(i); });
      return;
    }

    var pt = pointsData[s.active];
    activeRing.setAttribute('cx', px(pt.x));
    activeRing.setAttribute('cy', py(pt.y));
    activeRing.classList.add('show');
    paintDataset(i > 0 ? steps[i-1].assigned : {}, s.active, null);

    var lines = {}, labels = {};
    ['k1','k2'].forEach(function(k){
      var c = s.centroids[k];
      var line = document.createElementNS("http://www.w3.org/2000/svg","line");
      line.setAttribute('class','calc-line');
      line.setAttribute('x1', px(pt.x)); line.setAttribute('y1', py(pt.y));
      line.setAttribute('x2', px(c.x));  line.setAttribute('y2', py(c.y));
      line.style.stroke = 'var(--'+k+')';
      calcLinesG.appendChild(line);
      var len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      lines[k] = line;

      var label = document.createElementNS("http://www.w3.org/2000/svg","text");
      label.setAttribute('class','dist-label');
      var mx = (px(pt.x)+px(c.x))/2, my = (py(pt.y)+py(c.y))/2;
      label.setAttribute('x', mx); label.setAttribute('y', my-6);
      label.style.fill = 'var(--'+k+')';
      label.textContent = '0.0';
      calcLinesG.appendChild(label);
      labels[k] = label;
    });

    // draw-in (next frame, so the initial dasharray/offset is applied first)
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        lines.k1.style.strokeDashoffset = '0';
        lines.k2.style.strokeDashoffset = '0';
        labels.k1.classList.add('show');
        labels.k2.classList.add('show');
      });
    });

    after(600, function(){
      var d1 = dist(pt, s.centroids.k1), d2 = dist(pt, s.centroids.k2);
      countUp(labels.k1, d1, 650);
      countUp(labels.k2, d2, 650);
    });

    after(600+650+150, function(){
      var winner = s.winner, loser = winner === 'k1' ? 'k2' : 'k1';
      lines[winner].classList.add('winner'); labels[winner].classList.add('winner');
      lines[loser].classList.add('loser');   labels[loser].classList.add('loser');
      setPointClasses(s.assigned, s.active);
      paintDataset(s.assigned, s.active, winner);
      buildConsole(s.calc, false);

      var moveDelay = s.calc.length*200 + 300;
      after(moveDelay, function(){
        if(i+1 < steps.length){
          var target = {k1: steps[i+1].centroids.k1, k2: steps[i+1].centroids.k2};
          placeCentroids(target);
          var moved = winner;
          document.getElementById('centroid-'+moved).classList.add('settle');
          after(700, function(){ document.getElementById('centroid-'+moved).classList.remove('settle'); });
        }
        after(250, function(){ animating = false; setNav(i); });
      });
    });
  }

  /* stepper dots */
  var stepperEl = document.getElementById('stepper');
  steps.forEach(function(s, idx){
    var d = document.createElement('div');
    d.className = 'dot';
    d.textContent = s.dot;
    d.addEventListener('click', function(){ if(!animating) renderInstant(idx); });
    stepperEl.appendChild(d);
  });

  btnPrev.addEventListener('click', function(){ if(!animating) renderInstant(current-1); });
  btnNext.addEventListener('click', function(){
    if(animating || current >= steps.length-1) return;
    stopPlay();
    animateForward(current+1);
  });

  function stopPlay(){
    if(playTimer){ clearTimeout(playTimer); playTimer = null; }
    btnPlay.textContent = '▶ Play';
  }
  btnPlay.addEventListener('click', function(){
    if(playTimer){ stopPlay(); return; }
    if(current === steps.length-1){ renderInstant(0); }
    btnPlay.textContent = '⏸ Pause';
    function tick(){
      if(current >= steps.length-1){ stopPlay(); return; }
      animateForward(current+1);
      playTimer = setTimeout(tick, 3100);
    }
    playTimer = setTimeout(tick, 500);
  });

  renderInstant(0);

  /* ---------------- quiz ---------------- */
  var qa = [
    ["What is the fundamental objective of clustering in unsupervised learning?","Clustering aims to group data points into categories based on similarities or common characteristics. Points within the same cluster share similarities, while points in different clusters are distinct from one another."],
    ["How is the number of clusters (k) determined in a K-means problem?","The number of clusters is typically defined at the start of the process, often dictated by the specific requirements of the problem or provided in the question — for instance, segmenting data into two (k1, k2) or three clusters."],
    ["What role does a \"centroid\" play in the K-means clustering process?","A centroid serves as the central reference point, or \"mean\" value, for a cluster. It is the value used to calculate the distance of other data points to determine which cluster they belong to."],
    ["How can centroids be initialized at the beginning of the algorithm?","Initial centroids can be assigned by randomly selecting existing data points from the dataset — for example, the first two customers (c1 and c2) can be designated as the starting centroids for two respective clusters."],
    ["Which mathematical formula is used to determine the distance between an observed data point and a centroid?","The Euclidean distance formula: the square root of the sum of the squared differences of the coordinates, √((x₂−x₁)² + (y₂−y₁)²)."],
    ["Based on the distance calculation, how is a data point assigned to a specific cluster?","A data point is assigned to the cluster whose centroid is nearest in terms of distance. If the distance to the centroid of k2 is lower than the distance to the centroid of k1, the point is moved into the k2 cluster."],
    ["What must occur immediately after a new data point is assigned to a cluster?","The centroid for that specific cluster must be updated, so it remains a representative \"middle\" of all current members before the next point is evaluated."],
    ["How is a new centroid value calculated during the update step?","The new centroid is the mean of the coordinates of the existing centroid and the newly added data point — adding the x values and y values separately and dividing by two."],
    ["In the provided example of customer c3 (30, 800), why was it assigned to cluster k2 instead of k1?","The calculated distance between c3 and the centroid of k2 (approx. 200+) was significantly lower than the distance between c3 and the centroid of k1 (approx. 300+). c3 was assigned to k2 because it was the nearest cluster."],
    ["When does the process of calculating distances and updating centroids conclude?","The steps repeat for every remaining data point in the set, continuing until all customers or data points have been assigned to the most appropriate cluster based on the final updated centroids."]
  ];
  /* ---- quiz player engine: question first, answer cuts in after ---- */
  (function(){
    var total = qa.length;
    var idx = 0, revealed = false, playing = false, timers = [];

    var elProgress = document.getElementById('qp-progress');
    var elEyebrow  = document.getElementById('qp-eyebrow');
    var elQuestion = document.getElementById('qp-question');
    var elAnsWrap  = document.getElementById('qp-answer-wrap');
    var elAnswer   = document.getElementById('qp-answer');
    var elReveal   = document.getElementById('qp-reveal');
    var elPrev     = document.getElementById('qp-prev');
    var elNext     = document.getElementById('qp-next');
    var elPlay     = document.getElementById('qp-play');
    var elCount    = document.getElementById('qp-count');

    qa.forEach(function(_, i){
      var seg = document.createElement('div');
      seg.className = 'qp-seg';
      seg.innerHTML = '<span class="fill"></span>';
      seg.addEventListener('click', function(){ goTo(i); });
      elProgress.appendChild(seg);
    });
    var segs = elProgress.querySelectorAll('.qp-seg');

    function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

    function paintProgress(i){
      Array.prototype.forEach.call(segs, function(seg, si){
        var fill = seg.querySelector('.fill');
        fill.style.transition = 'none';
        fill.style.width = si < i ? '100%' : '0%';
      });
    }

    function show(i){
      idx = i; revealed = false;
      elEyebrow.textContent = 'Question ' + (i+1) + ' of ' + total;
      elQuestion.textContent = qa[i][0];
      elAnswer.textContent = qa[i][1];
      elAnsWrap.classList.remove('show');
      elReveal.classList.remove('hide');
      elReveal.textContent = 'Reveal answer';
      paintProgress(i);
      elPrev.disabled = i === 0;
      elNext.disabled = false;
      elCount.textContent = (i+1) + ' / ' + total;
    }

    function reveal(){
      if(revealed) return;
      revealed = true;
      elAnsWrap.classList.add('show');
      elReveal.classList.add('hide');
    }

    function stopPlaying(){
      clearTimers(); playing = false;
      elPlay.textContent = '▶ Play';
    }

    function goTo(i){
      stopPlaying();
      show(Math.max(0, Math.min(total-1, i)));
    }

    function playStep(i){
      show(i); playing = true;
      var fill = segs[i].querySelector('.fill');
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          fill.style.transition = 'width 6s linear';
          fill.style.width = '100%';
        });
      });
      timers.push(setTimeout(reveal, 2400));
      timers.push(setTimeout(function(){
        if(i+1 < total){ playStep(i+1); }
        else { stopPlaying(); paintProgress(total); }
      }, 6000));
    }

    elReveal.addEventListener('click', function(){ clearTimers(); reveal(); });
    elPrev.addEventListener('click', function(){ goTo(idx-1); });
    elNext.addEventListener('click', function(){
      if(!revealed){ clearTimers(); reveal(); }
      else { goTo(idx+1 < total ? idx+1 : idx); }
    });
    elPlay.addEventListener('click', function(){
      if(playing){ stopPlaying(); return; }
      elPlay.textContent = '⏸ Pause';
      playStep(idx >= total-1 ? 0 : idx);
    });

    show(0);
  })();

  /* ---------------- essay prompts ---------------- */
  var essays = [
    ["The Iterative Nature of K-Means","Explain why updating the centroid after every assignment is critical to the accuracy of the clustering process. How would the results differ if the centroids remained static?"],
    ["Customer Segmentation Logic","Using the online shopping behavior example, discuss how variables like \"purchase amount\" and \"frequency\" (represented by x and y coordinates) allow a business to distinguish between different types of shoppers."],
    ["Distance-Based Decision Making","Describe the step-by-step mathematical logic used to determine the placement of customer c4 (18, 300) when compared against two existing clusters."],
    ["Sensitivity to Initial Centers","Analyze the impact of \"random initialization\" of centroids. How might choosing different starting points for k1 and k2 affect the final membership of the clusters?"],
    ["Scaling the Algorithm","The example provided uses two variables (x and y). Discuss how the K-means procedure would adapt if additional variables, such as \"customer age\" or \"return rate,\" were added to the dataset."]
  ];
  var essayList = document.getElementById('essay-list');
  essays.forEach(function(e, idx){
    var div = document.createElement('div');
    div.className = 'essay-item';
    div.innerHTML = '<div class="essay-num">'+(idx+1)+'</div><div class="essay-body"><h3>'+e[0]+'</h3><p>'+e[1]+'</p></div>';
    essayList.appendChild(div);
  });

  /* ---------------- glossary ---------------- */
  var glossary = [
    ["Centroid","The central point of a cluster — initially a random data point, later the calculated mean of all points assigned to that cluster."],
    ["Clustering","An unsupervised learning method used to group data points so that points in the same group are more similar to each other than to those in other groups."],
    ["Distance Formula","√((x₂−x₁)² + (y₂−y₁)²) — measures the proximity between an observed data point and a centroid."],
    ["K-Means","A popular clustering algorithm that partitions data into k clusters by assigning points to the nearest centroid and iteratively updating those centroids."],
    ["Mean Calculation","Averaging the coordinates of data points to find the new \"center\" of a cluster after a point has been added."],
    ["Observed Value","The specific data point currently being evaluated for cluster assignment (e.g., a new customer's shopping data)."],
    ["Unsupervised Learning","A type of machine learning where the algorithm identifies patterns or groupings in data without pre-existing labels or instructions."],
    ["Variable","A characteristic or attribute (such as shopping frequency or total spend) used as a coordinate (x or y) to plot data points in the clustering space."]
  ];
  var gBody = document.getElementById('glossary-body');
  glossary.forEach(function(row){
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>'+row[0]+'</td><td>'+row[1]+'</td>';
    gBody.appendChild(tr);
  });

})();
