// ==UserScript==
// @name         AutoRepVK_0_mod04
// @author       You
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @run-at       document-body
// @updateURL    https://raw.githubusercontent.com/kladweb/autoposting-scripts/refs/heads/main/build/VK0_fin.js
// @downloadURL  hhttps://raw.githubusercontent.com/kladweb/autoposting-scripts/refs/heads/main/build/VK0_fin.js
// ==/UserScript==

(function () {
  'use strict';
  const idUser = '476124794';
  const posts = {sharavoz: "Sharavoz.tv", russkoetv: 'Русское ТВ'};
  const VKName = "vk0"

  // === PART START ===
  // version 1.1.5
  const urlBaseDataStat = "https://689069c9944bf437b595d196.mockapi.io/vkstat";
  const strategy = {
    all: "All groups",
    aftermy: "After my posts",
    my: "Skip my posts",
    players: "Competitors and comrades",
    firstWordPostAfter: "After post starts input",
    firstWordPostSkip: "Skip post starts input"
  };
  const competitors = {
    id358923511: "Анна Егорова",
    diwissmio: "Diwiss Iptv",
    id620542842: "Иван Смирнов",
    sergent771: "Сергей Щепетов",
    id469457210: "Алексей Гвоздев",
    pasha_dubrovsky: "Паша Дубровский",
    satiptv: "Людвиг Ванбетховен",
    id387929772: "Дмитрий (ILook)",
    id91715443: "Владислав Рыбалко",
  }
  const comrades = {
    id476124794: "VK0: Екатерина Менкина",
    id806571200: "VK2: Татьяна Андреева",
    id463839444: "VK6: Павел Каширский",
    id550973432: "VK9: Елена Поведайко",
    id562935165: "VK11: Василий Тис",
    id591910410: "VK13: Andrzey"
  }
  //players = competitors + comrades;
  const delays = {30: "30 sec", 15: "15 sec", 10: "10 sec"};
  const deeps = {1: 1, 2: 2, 3: 3, 5: 5, 9: 9};
  const numberBlockPost = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7};
  const [delayM, delayL, delayXL] = [2000, 3000, 10000];
  const currentInfoItems = {myip: "IP", missedposts: "Missed posts", leftposts: "Left posts", errorsposts: "Errors"};
  const firstWordInputs = {input1: ""};
  const postElements = []; //посты для публикации

  const strategyMenu = {headName: "STRATEGY", type: "radio", domElements: []}
  const postsMenu = {headName: "POSTS", type: "checkbox", domElements: []}
  const delayMenu = {headName: "DELAY", type: "radio", domElements: []};
  const deepMenu = {headName: "DEEP", type: "radio", domElements: []};
  const blockPostMenu = {headName: "BLOCKPOST", type: "checkbox", domElements: []};
  const competitorsMenu = {headName: "COMPETITORS", type: "checkbox", domElements: []};
  const comradesMenu = {headName: "COMRADES", type: "checkbox", domElements: []};
  const firstWordMenu = {headName: "First word of post", type: "text", domElements: []};
  const infoPanelMenu = {headName: "Last 12 hours", domElements: []};
  const currentInfoPanelMenu = {headName: "Current Info", domElements: []};

  // const buttonsSet = [
  //   {name: "SAVE POSTS", buttonDomElement: null, handler: savePosted},
  //   {name: "POST", buttonDomElement: null, handler: postCurrPost},
  //   {name: "SKIP", buttonDomElement: null, handler: skipCurrPost},
  //   {name: "START POSTING", buttonDomElement: null, handler: startScript},
  // ]

  const buttonsSet = {
    savePost: {name: "SAVE POSTS", buttonDomElement: null, handler: savePosted},
    doPost: {name: "POST", buttonDomElement: null, handler: postCurrPost},
    skipPost: {name: "SKIP", buttonDomElement: null, handler: skipCurrPost},
    startPosting: {name: "START POSTING", buttonDomElement: null, handler: startScript}
  }

  //Color Palette #4694
  const colors = {
    color01: '#816460',
    color02: '#B27D6A',
    color03: '#403F26',
    background01: '#FEF1C5',
    border01: '#F1C196',
  }

  const groupsBox = {
    0: [
      ["14875387", "club14875387"], //Bel https://vk.com/club14875387
      ["198518322", "iptvstreamshub"], // https://vk.com/iptvstreamshub
      ["130237472", "club130237472"], //24 https://vk.com/club130237472
      ["18331470", "marinaol"], //22	https://vk.com/marinaol
      ["132944148", "iptvlistok"], //27 https://vk.com/iptvlistok
      ["114119485", "aurahdclub"], //11 https://vk.com/aurahdclub
      ["140398176", "oknotiviru"], //28 https://vk.com/oknotiviru
      ["106796170", "club106796170"],//25 https://vk.com/club106796170
      ["52218536", "club52218536"],//21 https://vk.com/club52218536
      ["84120000", "club84120000"], //18 https://vk.com/club84120000
      ["176994995", "tvlisty", "pin"], //29 https://vk.com/tvlisty
      ["167018774", "club167018774"], //30 https://vk.com/club167018774
      ["171843329", "ru_iptv", "pin"], //31 https://vk.com/ru_iptv
      ["131638330", "galaktik_iptv", "pin"], //33 https://vk.com/galaktik_iptv
      ["186442856", "iptv_bt"], //35 https://vk.com/iptv_bt
      ["120034509", "club120034509", "pin"], //32 https://vk.com/club120034509
      ["99770042", "club99770042"], //17 https://vk.com/club99770042
      ["138553819", "club138553819"],//16 https://vk.com/club138553819
    ],
    1: [
      ["141086755", "club141086755"],// https://vk.com/club141086755
      ["136708898", "play_53"],// https://vk.com/play_53
      ["24950442", "club24950442"],// https://vk.com/club24950442
      ["206061686", "club206061686"],// https://vk.com/club206061686
      ["35875023", "sputnikovetv"],// https://vk.com/sputnikovetv
      ["175865636", "iplist", "pin"],// https://vk.com/iplist
      ["148105703", "club148105703"],// https://vk.com/club148105703
      ["132602273", "club132602273"],// https://vk.com/club132602273
      ["218718758", "club218718758"],// https://vk.com/club218718758
      ["86617505", "club86617505"],// https://vk.com/club86617505  1101
    ],
    2: [
      ["44971717", "club44971717", "pin"],// https://vk.com/club44971717  868
      ["64610320", "iptvworld"],// https://vk.com/iptvworld
      ["183716378", "4at_biz"],// https://vk.com/4at_biz
      ["114193852", "iptvstar"],// https://vk.com/iptvstar  237
      ["220867147", "neoniptv"],// https://vk.com/neoniptv  146
      ["106165979", "club106165979"],// https://vk.com/club106165979  74
      ["129904512", "club129904512"],// https://vk.com/club129904512  138
      ["87564019", "club87564019"],// https://vk.com/club87564019  214
      ["182272329", "club182272329"],// https://vk.com/club182272329  677
      ["85473521", "club85473521"],// https://vk.com/club85473521  363
    ],
    3: [
      ["97046131", "club97046131"],// https://vk.com/club97046131  268
      ["181633050", "iptvarmenia"],// https://vk.com/iptvarmenia  274
      ["119225474", "aromashopvl", "pin"],// https://vk.com/aromashopvl  197
      ["163108884", "club_playlistsiptv"],// https://vk.com/club_playlistsiptv  177
      ["163420799", "club163420799"],// https://vk.com/club163420799  165
      ["119462518", "club119462518"],// https://vk.com/club119462518  155*
      ["85129289", "club85129289"],// https://vk.com/club85129289  153
      ["88877831", "iptv15"],// https://vk.com/iptv15  76
      ["133932827", "club133932827"],// https://vk.com/club133932827  115
      ["114358721", "iptvmen", "pin"],// https://vk.com/iptvmen  125
    ],
    4: [
      ["125907101", "club125907101"],// https://vk.com/club125907101  129
      ["100749987", "club100749987"],// https://vk.com/club100749987  128
      ["211817792", "freeiptvplaylist"],// https://vk.com/freeiptvplaylist  121
      ["114852397", "club114852397"],// https://vk.com/club114852397  121
      ["50738228", "club50738228"],// https://vk.com/club50738228  114
      ["51856489", "club51856489"],// https://vk.com/club51856489  102
      ["168355036", "club168355036"],// https://vk.com/club168355036  101
      ["139627862", "clubiptv2017"],// https://vk.com/clubiptv2017  100
      ["92481281", "club92481281"],// https://vk.com/club92481281  80
      ["69750941", "online.iptv"],// https://vk.com/online.iptv  76
    ],
    5: [
      ["33418379", "club33418379"],// https://vk.com/club33418379  71
      ["60125045", "club60125045"],// https://vk.com/club60125045  68
      ["75004959", "club75004959", "pin"],// https://vk.com/club75004959  63
      ["191496548", "club191496548", "pin"],// https://vk.com/club191496548  62
      ["67319747", "club67319747"],// https://vk.com/club67319747  58
      ["88265046", "club88265046"],// https://vk.com/club88265046  58
      ["116759968", "obstv"],// https://vk.com/obstv  54
      ["24890840", "club24890840"],// https://vk.com/club24890840  54
      ["113453722", "club113453722"],// https://vk.com/club113453722  53
      ["72770953", "club72770953"],// https://vk.com/club72770953  50
    ],
    6: [
      ["66538865", "club66538865"],// https://vk.com/club66538865  47
      ["92609310", "club92609310"],// https://vk.com/club92609310  47
      ["39933599", "ip_tv_player"],// https://vk.com/ip_tv_player  46
      ["16982510", "club16982510"],// https://vk.com/club16982510  41
      ["183858399", "tvbox_vk", "pin"],// https://vk.com/tvbox_vk  39
      ["65587412", "plattexpod"],// https://vk.com/plattexpod  38
      ["23943593", "club23943593"],// https://vk.com/club23943593  38
      ["18046120", "club18046120"],// https://vk.com/club18046120  37
      ["205480134", "club205480134"],// https://vk.com/club205480134  35
      ["111331547", "club111331547"],// https://vk.com/club111331547  32
    ],
    7: [
      ["20716313", "club20716313"],// https://vk.com/club20716313  32
      ["24096858", "club24096858"],// https://vk.com/club24096858  32
      ["50585401", "club50585401"],// https://vk.com/club50585401  31
      ["224475216", "iptvbrestt", "pin"],// https://vk.com/iptvbrestt  30
      ["169583842", "club169583842"],// https://vk.com/club169583842  30
      ["200371453", "club200371453"],// https://vk.com/club200371453 29
      ["133880267", "club133880267"],// https://vk.com/club133880267 29
      ["138208217", "club138208217"],// https://vk.com/club138208217 27
      ["224212394", "club224212394"],// https://vk.com/club224212394 25
      ["17837395", "club17837395"],// https://vk.com/club17837395 22
      ["80802384", "club80802384"],// https://vk.com/club80802384 20
      ["178793178", "iptvsfera"],// https://vk.com/iptvsfera 19
      ["129923189", "azimuth_tv", "pin"],// https://vk.com/azimuth_tv  18
      ["182276122", "sharaclub_sat_iptv"],// https://vk.com/sharaclub_sat_iptv  18
      ["112843747", "club112843747"],// https://vk.com/club112843747  14
    ]
  };

  const menuVK = document.createElement('div');
  menuVK.style.cssText = `
  position: fixed;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  bottom: 50px;
  left: 10px;
  max-width: 500px;
  padding: 10px 0;
  box-sizing: border-box;
  font-size: 14px;
  text-align: center;
  color: ${colors.color01};
  background: ${colors.background01};
  border: 1px solid ${colors.border01};
  border-radius: 3px;
  z-index: 5000;
  `;

  const styleMenu1 = `width: 45%; margin: 4px auto; border: 1px solid ${colors.border01};`
  const styleMenu2 = `margin: 4px auto; border: 1px solid ${colors.border01};`
  const styleMenu3 = "width: 45%; margin: 0 auto";
  const stylesInpType1 = "text-align: left; padding: 4px;";
  const stylesInpType2 = "display: inline-block; padding: 4px;";
  const stylesInpType3 = "text-align: left; padding: 2px;";

  const strategyMenuDiv = createMenuBlock(strategy, strategyMenu, styleMenu2, stylesInpType1);
  const postsMenuDiv = createMenuBlock(posts, postsMenu, styleMenu2, stylesInpType1);
  const delayMenuDiv = createMenuBlock(delays, delayMenu, styleMenu2, stylesInpType1);
  const deepMenuDiv = createMenuBlock(deeps, deepMenu, styleMenu2, stylesInpType2);
  const blockPostMenuDiv = createMenuBlock(numberBlockPost, blockPostMenu, styleMenu2, stylesInpType2);
  const competitorsMenuDiv = createMenuBlock(competitors, competitorsMenu, styleMenu2, stylesInpType3);
  const comradesMenuDiv = createMenuBlock(comrades, comradesMenu, styleMenu2, stylesInpType3);
  const infoPanelDiv = createMenuBlock({}, infoPanelMenu, styleMenu1, stylesInpType1);
  const currentInfoPanelDiv = createMenuBlock({}, currentInfoPanelMenu, styleMenu1, stylesInpType1);
  const inputFirstWordDiv = createMenuBlock(firstWordInputs, firstWordMenu, styleMenu2, stylesInpType1);

  const buttonsBlockDiv = createButtonsBlock(buttonsSet);

  const menuGroupPostDiv = document.createElement("div");
  menuGroupPostDiv.append(strategyMenuDiv, postsMenuDiv, delayMenuDiv, deepMenuDiv, blockPostMenuDiv);
  menuGroupPostDiv.style.cssText = styleMenu3;

  const playersMenu = document.createElement('div');
  playersMenu.append(competitorsMenuDiv, comradesMenuDiv, inputFirstWordDiv);
  playersMenu.style.cssText = styleMenu3;

  menuVK.append(menuGroupPostDiv, playersMenu, infoPanelDiv, currentInfoPanelDiv, buttonsBlockDiv);
  document.querySelector(`body`).append(menuVK);

  strategyMenu.domElements.forEach(elem => elem.onclick = changeCompInputs);

  function createMenuBlock(items, menuObj, styleMenu, styleInput) {
    const menuBlock = document.createElement("div");
    menuBlock.style.cssText = styleMenu;
    const head = document.createElement('h6');
    head.style.margin = "0 0 4px";
    head.append(document.createTextNode(menuObj.headName));
    menuBlock.append(head);
    menuObj.headDomElement = head;
    const menuItems = Object.keys(items);
    menuItems.forEach((item) => {
      const inputBlock = document.createElement('div');
      const inputEl = document.createElement('input');
      inputEl.setAttribute('type', menuObj.type);
      inputEl.setAttribute('name', menuObj.headName);
      inputEl.setAttribute('id', item);
      const inputLabel = document.createElement('label');
      inputLabel.setAttribute('for', item);
      inputLabel.append(document.createTextNode(items[item]));
      inputBlock.append(inputEl, inputLabel);
      inputBlock.style.cssText = styleInput;
      menuBlock.append(inputBlock);
      menuObj.domElements.push(inputEl);
    });
    return menuBlock;
  }

  function createButtonsBlock(buttons) {
    const buttonsBlock = document.createElement("div");
    buttonsBlock.style.cssText = `width: 95%; margin: 4px 10px;`
    const buttonsItems = Object.keys(buttons);
    buttonsItems.forEach((btn) => {
      const buttonElement = document.createElement('button');
      buttonElement.style.cssText = `display: inline-block; margin: 20px 10px; color: ${colors.color01}; cursor: pointer;`;
      buttonElement.append(document.createTextNode(buttons[btn].name));
      buttonElement.onclick = buttons[btn].handler;
      buttonsBlock.append(buttonElement);
      buttons[btn].buttonDomElement = buttonElement;
    });
    return buttonsBlock;
  }

  function changeCompInputs(e) {
    console.log(e.target);
    console.log(e.currentTarget);
  }

  function savePosted() {

  }

  function postCurrPost() {

  }

  function skipCurrPost() {

  }

  function startScript() {

  }


  // === PART END ===
})();
