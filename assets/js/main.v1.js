(function(){
  'use strict';
  var burger=document.getElementById('burger'), drawer=document.getElementById('drawer'), closeBtn=document.getElementById('drawerClose');
  function openD(){ if(!drawer) return; drawer.hidden=false; document.body.classList.add('is-locked'); burger.setAttribute('aria-expanded','true'); if(closeBtn) closeBtn.focus(); }
  function closeD(){ if(!drawer) return; drawer.hidden=true; document.body.classList.remove('is-locked'); burger.setAttribute('aria-expanded','false'); burger.focus(); }
  if(burger&&drawer){ burger.addEventListener('click',openD); if(closeBtn) closeBtn.addEventListener('click',closeD);
    drawer.querySelectorAll('[data-close]').forEach(function(el){el.addEventListener('click',closeD)});
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!drawer.hidden) closeD();
      if(e.key==='Tab'&&!drawer.hidden){ var f=drawer.querySelectorAll('a,button'),first=f[0],last=f[f.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();} } });
    window.addEventListener('resize',function(){ if(window.innerWidth>1180&&!drawer.hidden) closeD(); }); }

  // 1. наряд-заказ
  var TYPES={'Легковая':'легковая','Микроавтобус':'микроавтобус','Грузовик':'грузовик'};
  var NEEDS={
    'Мотор':'разборка и дефектовка, замена или ремонт мотора, регулировки после сборки',
    'Сцепление':'снятие коробки, замена диска, корзины и выжимного, проверка маховика',
    'КПП':'снятие и разборка коробки, дефектовка, замена изношенных узлов',
    'Ходовая':'диагностика на подъёмнике, замена рычагов, шаровых, стоек, сайлентблоков',
    'Арки и крылья':'вырезка повреждённого, сварка новых элементов, антикор шва',
    'Пороги':'вырезка и вварка ремвставок, обработка и покраска',
    'Рихтовка':'правка вмятин, шпатлёвка, подготовка под покраску',
    'Покраска':'подбор цвета, подготовка, грунт, база, лак, сушка в камере',
    'Бампер и пластик':'ремонт трещин и креплений, пайка пластика, покраска'
  };
  var naryad=document.getElementById('naryad');
  var picked={};
  if(naryad){
    var typeSel=document.getElementById('n-type'), out=document.getElementById('n-out'), waBtn=document.getElementById('n-wa');
    function paintN(){
      var list=Object.keys(picked).filter(function(k){return picked[k];});
      var rows=['<li><b>Авто:</b> '+(typeSel.value||'не указано')+'</li>'];
      if(!list.length){ rows.push('<li>Отметьте, что нужно сделать — наряд соберётся здесь.</li>'); }
      list.forEach(function(k){ rows.push('<li><b>'+k+':</b> '+NEEDS[k]+'</li>'); });
      rows.push('<li><b>Оплата:</b> наличными, безналом или в рассрочку — уточним при записи.</li>');
      out.innerHTML='<p class="mono" style="margin:0 0 4px">Наряд-заказ</p><ul>'+rows.join('')+'</ul>';
      if(waBtn){
        var NL=String.fromCharCode(10);
        var txt='Заявка в автокомплекс ТранспортМиксСтрой'+NL+'Авто: '+(typeSel.value||'—')+NL+
          (list.length?('Нужно: '+list.join(', ')):'')+NL+'Город: —'+NL+'Комментарий: —';
        waBtn.href='https://wa.me/375291867980?text='+encodeURIComponent(txt);
      }
    }
    naryad.querySelectorAll('[data-need]').forEach(function(b){
      b.addEventListener('click',function(){
        var k=b.getAttribute('data-need'); picked[k]=!picked[k];
        b.setAttribute('aria-pressed',picked[k]?'true':'false'); paintN();
      });
    });
    if(typeSel) typeSel.addEventListener('change',paintN);
    paintN();
  }

  // 2. симптом -> узел
  var SYM={
    's1':['Стук на кочках','Ходовая часть: стойки, шаровые, сайлентблоки, опоры. Смотрим на подъёмнике, проверяем люфты и пыльники, меняем парой.'],
    's2':['Сцепление буксует, пахнет горелым','Сцепление: диск, корзина, выжимной. Снимаем коробку, проверяем маховик и сальники, меняем комплектом.'],
    's3':['Не включается передача, хруст','КПП и приводы: тросы или кулиса, синхронизаторы, подшипники. Сначала диагностика, потом разборка.'],
    's4':['Тянет в сторону, ест резину','Ходовая и углы установки колёс: люфты, тяги, наконечники, затем регулировка сход-развала.'],
    's5':['Гнилые пороги, арки','Кузов и сварка: вырезаем ржавое до металла, ввариваем ремвставки, антикор и покраска шва.'],
    's6':['Вмятина или царапина на двери','Рихтовка и покраска: правка, шпатлёвка, грунт, подбор цвета, база и лак в камере.'],
    's7':['Треснул бампер, сломаны крепления','Пластик: пайка трещин, восстановление креплений, покраска в цвет кузова.']
  };
  var symPanel=document.getElementById('sym-out');
  if(symPanel){
    document.querySelectorAll('[data-sym]').forEach(function(b){
      b.addEventListener('click',function(){
        var k=b.getAttribute('data-sym'), d=SYM[k];
        document.querySelectorAll('[data-sym]').forEach(function(x){x.setAttribute('aria-pressed','false')});
        b.setAttribute('aria-pressed','true');
        symPanel.innerHTML='<h3>'+d[0]+'</h3><p>'+d[1]+'</p><p class="mono" style="margin-top:14px">Дальше — запись и осмотр</p>';
      });
    });
  }

  // 3. форма
  var form=document.getElementById('z-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var g=function(id){var el=document.getElementById(id);return el?el.value.trim():'';};
      var NL=String.fromCharCode(10);
      var lines=['Заявка с сайта ТранспортМиксСтрой',
        'Имя: '+(g('z-name')||'—'),
        'Телефон: '+(g('z-tel')||'—'),
        'Авто: '+(g('z-car')||'—'),
        'Что нужно: '+(g('z-what')||'—'),
        'Комментарий: '+(g('z-note')||'—')];
      var txt=lines.join(NL);
      var out=document.getElementById('z-out');
      if(out){ out.textContent='Открываю WhatsApp с готовой заявкой.'; }
      window.open('https://wa.me/375291867980?text='+encodeURIComponent(txt),'_blank','noopener');
    });
  }
})();