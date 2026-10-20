// ==UserScript==
// @name         VK_autosubscribtion
// @author       You
// @match        https://vk.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.ru
// @run-at       document-body
// ==/UserScript==

(function () {
  'use strict';
  const groupsAll = [
    ["14875387", "club14875387"], //Bel https://vk.ru/club14875387
    ["198518322", "iptvstreamshub"], // https://vk.ru/iptvstreamshub
    ["130237472", "club130237472"], //24 https://vk.ru/club130237472
    ["18331470", "marinaol"], //22	https://vk.ru/marinaol
    ["132944148", "iptvlistok"], //27 https://vk.ru/iptvlistok
    ["114119485", "aurahdclub"], //11 https://vk.ru/aurahdclub
    ["140398176", "oknotiviru"], //28 https://vk.ru/oknotiviru
    ["106796170", "club106796170"],//25 https://vk.ru/club106796170
    ["52218536", "club52218536"],//21 https://vk.ru/club52218536
    ["84120000", "club84120000"], //18 https://vk.ru/club84120000
    ["176994995", "tvlisty", "pinned"], //29 https://vk.ru/tvlisty
    ["167018774", "club167018774"], //30 https://vk.ru/club167018774
    ["171843329", "ru_iptv", "pinned"], //31 https://vk.ru/ru_iptv
    ["131638330", "galaktik_iptv", "pinned"], //33 https://vk.ru/galaktik_iptv
    ["186442856", "iptv_bt"], //35 https://vk.ru/iptv_bt
    ["120034509", "club120034509", "pinned"], //32 https://vk.ru/club120034509
    ["99770042", "club99770042"], //17 https://vk.ru/club99770042
    ["138553819", "club138553819"],//16 https://vk.ru/club138553819
    //NEW
    // PART 1
    ["141086755", "club141086755"],// https://vk.ru/club141086755
    ["136708898", "play_53"],// https://vk.ru/play_53
    ["24950442", "club24950442"],// https://vk.ru/club24950442
    ["206061686", "club206061686"],// https://vk.ru/club206061686
    ["35875023", "sputnikovetv"],// https://vk.ru/sputnikovetv
    ["175865636", "iplist"],// https://vk.ru/iplist
    ["148105703", "club148105703"],// https://vk.ru/club148105703
    ["132602273", "club132602273"],// https://vk.ru/club132602273
    ["218718758", "club218718758"],// https://vk.ru/club218718758
    ["86617505", "club86617505"],// https://vk.ru/club86617505  1101
    // PART 1
    ["44971717", "club44971717"],// https://vk.ru/club44971717  868
    ["64610320", "iptvworld"],// https://vk.ru/iptvworld
    ["183716378", "4at_biz"],// https://vk.ru/4at_biz
    ["114193852", "iptvstar"],// https://vk.ru/iptvstar  237
    ["220867147", "neoniptv"],// https://vk.ru/neoniptv  146
    ["106165979", "club106165979"],// https://vk.ru/club106165979  74
    ["129904512", "club129904512"],// https://vk.ru/club129904512  138
    ["87564019", "club87564019"],// https://vk.ru/club87564019  214
    ["182272329", "club182272329"],// https://vk.ru/club182272329  677
    ["85473521", "club85473521"],// https://vk.ru/club85473521  363
    // PART 2
    ["97046131", "club97046131"],// https://vk.ru/club97046131  268
    ["181633050", "iptvarmenia"],// https://vk.ru/iptvarmenia  274
    ["119225474", "aromashopvl"],// https://vk.ru/aromashopvl  197
    ["163108884", "club_playlistsiptv"],// https://vk.ru/club_playlistsiptv  177
    ["163420799", "club163420799"],// https://vk.ru/club163420799  165
    ["119462518", "club119462518"],// https://vk.ru/club119462518  155*
    ["85129289", "club85129289"],// https://vk.ru/club85129289  153
    ["88877831", "iptv15"],// https://vk.ru/iptv15  76
    ["133932827", "club133932827"],// https://vk.ru/club133932827  115
    ["114358721", "iptvmen"],// https://vk.ru/iptvmen  125
    // PART 3
    ["125907101", "club125907101"],// https://vk.ru/club125907101  129
    ["100749987", "club100749987"],// https://vk.ru/club100749987  128
    ["211817792", "freeiptvplaylist"],// https://vk.ru/freeiptvplaylist  121
    ["114852397", "club114852397"],// https://vk.ru/club114852397  121
    ["50738228", "club50738228"],// https://vk.ru/club50738228  114
    ["51856489", "club51856489"],// https://vk.ru/club51856489  102
    ["168355036", "club168355036"],// https://vk.ru/club168355036  101
    ["139627862", "clubiptv2017"],// https://vk.ru/clubiptv2017  100
    ["92481281", "club92481281"],// https://vk.ru/club92481281  80
    ["69750941", "online.iptv"],// https://vk.ru/online.iptv  76
    // PART 4
    ["33418379", "club33418379"],// https://vk.ru/club33418379  71
    ["60125045", "club60125045"],// https://vk.ru/club60125045  68
    ["75004959", "club75004959"],// https://vk.ru/club75004959  63
    ["191496548", "club191496548"],// https://vk.ru/club191496548  62
    ["67319747", "club67319747"],// https://vk.ru/club67319747  58
    ["88265046", "club88265046"],// https://vk.ru/club88265046  58
    ["116759968", "obstv"],// https://vk.ru/obstv  54
    ["24890840", "club24890840"],// https://vk.ru/club24890840  54
    ["113453722", "club113453722"],// https://vk.ru/club113453722  53
    ["72770953", "club72770953"],// https://vk.ru/club72770953  50
    ["66538865", "club66538865"],// https://vk.ru/club66538865  47
    // PART 5
    ["92609310", "club92609310"],// https://vk.ru/club92609310  47
    ["39933599", "ip_tv_player"],// https://vk.ru/ip_tv_player  46
    ["16982510", "club16982510"],// https://vk.ru/club16982510  41
    ["183858399", "tvbox_vk"],// https://vk.ru/tvbox_vk  39
    ["65587412", "plattexpod"],// https://vk.ru/plattexpod  38
    ["23943593", "club23943593"],// https://vk.ru/club23943593  38
    ["18046120", "club18046120"],// https://vk.ru/club18046120  37
    ["205480134", "club205480134"],// https://vk.ru/club205480134  35
    ["111331547", "club111331547"],// https://vk.ru/club111331547  32
    ["20716313", "club20716313"],// https://vk.ru/club20716313  32
    ["24096858", "club24096858"],// https://vk.ru/club24096858  32
    ["50585401", "club50585401"],// https://vk.ru/club50585401  31
    // PART 6
    ["224475216", "iptvbrestt"],// https://vk.ru/iptvbrestt  30
    ["69583842", "club169583842"],// https://vk.ru/club169583842  30
    ["200371453", "club200371453"],// https://vk.ru/club200371453 29
    ["133880267", "club133880267"],// https://vk.ru/club133880267 29
    ["138208217", "club138208217"],// https://vk.ru/club138208217 27
    ["224212394", "club224212394"],// https://vk.ru/club224212394 25
    ["17837395", "club17837395"],// https://vk.ru/club17837395 22
    ["80802384", "club80802384"],// https://vk.ru/club80802384 20
    ["178793178", "iptvsfera"],// https://vk.ru/iptvsfera 19
    ["129923189", "azimuth_tv"],// https://vk.ru/azimuth_tv  18
    ["182276122", "sharaclub_sat_iptv"],// https://vk.ru/sharaclub_sat_iptv  18
    ["112843747", "club112843747"],// https://vk.ru/club112843747  14
  ];

  // const groupsPost = {
  //   groupsScope: [...groupsAll]
  // }

  let gettingGroups = null;

  async function getData() {
    fetch('https://689069c9944bf437b595d196.mockapi.io/subscr1', {
      method: 'GET',
      headers: {'content-type': 'application/json'},
    }).then(res => {
      if (res.ok) {
        return res.json();
      }
      console.log("Ошибка 1!");
    }).then(tasks => {
      console.log("tasks: ", tasks[0].groupsScope);
      gettingGroups = tasks[0].groupsScope;
      startChecking();
    }).catch(error => {
      console.log("Ошибка 2!");
      console.log("Пробуем ещй раз!");
      setTimeout(() => {
        getData();
      }, 5000)
    });
  }

  function startChecking() {
    const linkSubscr = document.querySelector('.redesigned-group-main-action');
    console.log(linkSubscr);
    if (linkSubscr) {
      const textSubscr = linkSubscr.textContent;
      if (textSubscr.trim() === "В избранном") {
        console.log("Уже в избранном");
        loadNewDataAndGo();
        return;
      }
      if (textSubscr.trim() === "Избранное") {
        console.log("CLICK !!!!!!!!!!!!!!!!!!!!!!!");
        linkSubscr.click();
        setTimeout(() => {
          startChecking();
        }, 7000);
        return;
      }
      console.log("Вообще что-то непонятное! Давай пробовать ещё раз!");
      console.log("textSubscr: ", textSubscr.trim());
      setTimeout(() => {
        startChecking();
      }, 7000);
    }
  }


  async function loadNewDataAndGo() {
    gettingGroups.shift();
    const groupsPostSend = {
      groupsScope: [...gettingGroups]
    }

    console.log("DATA_SET: ", groupsPostSend);
    return fetch('https://6ad7e28e95e98f36aef2d318.mockapi.io/subscr1/1', {
      method: 'PUT',
      headers: {'content-type': 'application/json'},
      // Send your data in the request body as JSON
      body: JSON.stringify(groupsPostSend)
    }).then(res => {
      if (res.ok) {
        console.log(res.ok);
        const newGroup = `https://vk.ru/${gettingGroups[0][1]}`
        console.log(newGroup);
        setTimeout(() => {
          window.location.href = newGroup;
        }, 3000);
        return res.json();
      }
      console.log("Ошибка 3!")
    }).catch(error => {
      console.log("Ошибка 4!")
    })
  }


  // fetch('https://689069c9944bf437b595d196.mockapi.io/subscr1', {
  //   method: 'POST',
  //   headers: {'content-type': 'application/json'},
  //   // Send your data in the request body as JSON
  //   body: JSON.stringify(groupsPost)
  // }).then(res => {
  //   if (res.ok) {
  //     console.log(res.ok);
  //     return res.json();
  //   }
  //   console.log("Что-то не так здесь!")
  //   // handle error
  // }).then(task => {
  //   // do something with the new task
  // }).catch(error => {
  //   console.log("Что-то не так!")
  //   // handle error
  // })

  // const newGroups = localStorage.getItem("groupPost");
  // console.log("newGroups: ", newGroups);

  getData();
})();
