// ==UserScript==
// @name         AutoRepVK_11_mod05_remote
// @author       kladweb
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @run-at       document-body
// @updateURL    https://raw.githubusercontent.com/kladweb/autoposting-scripts/refs/heads/main/build/VK11_fin.js
// @downloadURL  hhttps://raw.githubusercontent.com/kladweb/autoposting-scripts/refs/heads/main/build/VK11_fin.js
// ==/UserScript==

(function () {
  'use strict';
  const idUser = '562935165';
  const posts = {best: "The best operators", mediabox: "MEDIABOX"};
  const VKName = "vk11";

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
    st77sh: "Стас Щербаков",
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
  const deeps = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 9: 9};
  const numberBlockPost = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7};
  let [delayM, delayL, delayXL] = [2000, 4000, 10000];
  const firstWordInputs = {input1: "", input2: ""};
  let isSkipCurrPost = false;
  let isPostCurrPost = false;
  const postForPublish = []; //посты для публикации
  const groupsForPublish = []; //группы для постов
  const boxNumbers = []; //номера блоков групп, выбранных пользователем
  let currentNumberGr = 0;
  let currentNumberPost = 0;
  let currentNamePost = null;
  let currentPost = null; //объект поста для сохранения в IndexDb
  let functionRepetitions = 0;
  let deepAmount = 0;
  let IdFirstPostForSubmitChecking = null;
  let myPostText = null;
  let isMinimize = false;


  const strategyMenu = {headName: "STRATEGY", type: "radio", domElements: {}}
  const postsMenu = {headName: "POSTS", type: "checkbox", domElements: {}}
  const delayMenu = {headName: "DELAY", type: "radio", domElements: {}};
  const deepMenu = {headName: "DEEP", type: "radio", domElements: {}};
  const blockPostMenu = {headName: "BLOCKPOST", type: "checkbox", domElements: {}};
  const competitorsMenu = {headName: "COMPETITORS", type: "checkbox", domElements: {}};
  const comradesMenu = {headName: "COMRADES", type: "checkbox", domElements: {}};
  const firstWordMenu = {headName: "Start words of posts", type: "text", domElements: {}};
  const extraSettings = {headName: "SETTINGS", type: "checkbox", domElements: {}};

  const buttonsSet = {
    savePost: {name: "SAVE POSTS", domElement: null, handler: savePosted},
    doPost: {name: "POST", domElement: null, handler: postCurrPost},
    skipPost: {name: "SKIP", domElement: null, handler: skipCurrPost},
    startPosting: {name: "START POSTING", domElement: null, handler: startScript}
  }

  const extraSets = {
    // skipMyPostFirst: "Skip my first post",
    // skipMyPostDeep: "Skip my post with deep",
    fast: "Fast checking"
  }

  //Color Palette #4694
  const colors = {
    color01: '#816460',
    color02: '#B27D6A',
    color03: '#403F26',
    info01: '#4f930a',
    info02: '#126AEFFF',
    info03: '#ff1414',
    background01: '#FEF1C5',
    border01: '#F1C196',
  }

  const infoPanelItems = {}
  for (const key in posts) {
    infoPanelItems[key] = {};
    infoPanelItems[key].name = posts[key];
    infoPanelItems[key].domElement = null;
    infoPanelItems[key].infoColor = colors.info01;
    infoPanelItems[key].bold = true;
    infoPanelItems[key].startValue = 0;
    infoPanelItems[key]._loadedValue = 0;
    infoPanelItems[key]._currentValue = 0;
    infoPanelItems[key].valueObject = null;
  }

  for (const key in infoPanelItems) {
    Object.defineProperty(infoPanelItems[key], "currentValue", {
      get() {
        return this._currentValue;
      },
      set(value) {
        this._currentValue = value;
        if (this.domElement) {
          this.domElement.innerText = this.loadedValue + this._currentValue;
          this.domElement.style.color = this.infoColor;
        }
      }
    });
    Object.defineProperty(infoPanelItems[key], "loadedValue", {
      get() {
        return this._loadedValue;
      },
      set(value) {
        this._loadedValue = value;
        if (this.domElement) {
          this.domElement.innerText = this.loadedValue + this._currentValue;
        }
      }
    });
  }

  const currentInfoItems = {
    myip: {
      name: "IP",
      domElement: null,
      infoColor: colors.info02,
      startValue: "...wait",
      _currentValue: 0,
    },
    missedposts: {
      name: "Missed posts",
      domElement: null,
      infoColor: colors.info03,
      bold: true,
      startValue: "-",
      _currentValue: 0
    },
    leftposts: {
      name: "Left posts",
      domElement: null,
      infoColor: colors.info01,
      startValue: "-",
      _currentValue: 0
    },
    errorsposts: {
      name: "Errors",
      domElement: null,
      infoColor: colors.info01,
      bold: true,
      startValue: "-",
      _currentValue: 0
    },
  };

  for (const key in currentInfoItems) {
    Object.defineProperty(currentInfoItems[key], "currentValue", {
      get() {
        return this._currentValue;
      },
      set(value) {
        this._currentValue = value;
        if (this.domElement) {
          this.domElement.innerText = this._currentValue;
        }
      }
    });
  }

  const infoPanelMenu = {headName: "Last 12 hours", items: infoPanelItems};
  const logsInfoMenu = {headName: "Logs Info", items: {}};
  const currentInfoMenu = {headName: "Current Info", items: currentInfoItems};

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
      ["176994995", "tvlisty", "pin"], //29 https://vk.com/tvlisty
      ["167018774", "club167018774"], //30 https://vk.com/club167018774
      ["171843329", "ru_iptv", "pin"], //31 https://vk.com/ru_iptv
      ["186442856", "iptv_bt"], //35 https://vk.com/iptv_bt
      ["138553819", "club138553819"],//16 https://vk.com/club138553819
      ["24950442", "club24950442"],// https://vk.com/club24950442 ***
      ["86617505", "club86617505"],// https://vk.com/club86617505  1101
      ["99770042", "club99770042"], //17 https://vk.com/club99770042
    ],
    1: [
      ["120034509", "club120034509", "pin"], //32 https://vk.com/club120034509
      ["131638330", "galaktik_iptv", "pin"], //33 https://vk.com/galaktik_iptv
      ["84120000", "club84120000"], //18 https://vk.com/club84120000
      ["141086755", "club141086755"],// https://vk.com/club141086755
      ["136708898", "play_53"],// https://vk.com/play_53
      ["206061686", "club206061686"],// https://vk.com/club206061686
      ["35875023", "sputnikovetv"],// https://vk.com/sputnikovetv
      ["175865636", "iplist", "pin"],// https://vk.com/iplist
      ["148105703", "club148105703"],// https://vk.com/club148105703
      ["132602273", "club132602273"],// https://vk.com/club132602273
    ],
    2: [
      ["218718758", "club218718758"],// https://vk.com/club218718758
      ["44971717", "club44971717", "pin"],// https://vk.com/club44971717  868
      ["64610320", "iptvworld"],// https://vk.com/iptvworld
      ["183716378", "4at_biz"],// https://vk.com/4at_biz
      ["114193852", "iptvstar"],// https://vk.com/iptvstar  237
      ["220867147", "neoniptv"],// https://vk.com/neoniptv  146
      ["106165979", "club106165979"],// https://vk.com/club106165979  74
      ["129904512", "club129904512"],// https://vk.com/club129904512  138
      ["87564019", "club87564019"],// https://vk.com/club87564019  214
      ["182272329", "club182272329"],// https://vk.com/club182272329  677
    ],
    3: [
      ["85473521", "club85473521"],// https://vk.com/club85473521  363
      ["97046131", "club97046131"],// https://vk.com/club97046131  268
      ["181633050", "iptvarmenia"],// https://vk.com/iptvarmenia  274
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
  transform-origin: bottom left;
  transition: all 0.5s;
  `;

  const styleMenu1 = `width: 45%; margin: 4px auto; border: 1px solid ${colors.border01};`;
  const styleMenu2 = `margin: 4px auto; border: 1px solid ${colors.border01};`;
  const styleMenu3 = "width: 45%; margin: 0 auto;";
  const stylesInpType1 = "text-align: left; padding: 4px;";
  const stylesInpType2 = "display: inline-block; padding: 3px;";
  const stylesInpType3 = "text-align: left; padding: 2px;";

  const strategyMenuDiv = createMenuBlock(strategy, strategyMenu, styleMenu2, stylesInpType1);
  const postsMenuDiv = createMenuBlock(posts, postsMenu, styleMenu2, stylesInpType1);
  const delayMenuDiv = createMenuBlock(delays, delayMenu, styleMenu2, stylesInpType1);
  const deepMenuDiv = createMenuBlock(deeps, deepMenu, styleMenu2, stylesInpType2);
  const blockPostMenuDiv = createMenuBlock(numberBlockPost, blockPostMenu, styleMenu2, stylesInpType2);
  const competitorsMenuDiv = createMenuBlock(competitors, competitorsMenu, styleMenu2, stylesInpType3);
  const comradesMenuDiv = createMenuBlock(comrades, comradesMenu, styleMenu2, stylesInpType3);
  const inputFirstWordDiv = createMenuBlock(firstWordInputs, firstWordMenu, styleMenu2, stylesInpType1);
  const extraSettingsDiv = createMenuBlock(extraSets, extraSettings, styleMenu2, stylesInpType3);
  const infoPanelDiv = createInfoBlock(infoPanelMenu, styleMenu2);

  const currentInfoDiv = createInfoBlock(currentInfoMenu, styleMenu1);
  const logsInfoDiv = createInfoBlock(logsInfoMenu, styleMenu1);
  const logsInfoFieldDiv = document.createElement("div");
  logsInfoFieldDiv.style.cssText = "text-align: left; height: 100px; overflow: auto;";
  logsInfoDiv.append(logsInfoFieldDiv);

  const buttonsBlockDiv = createButtonsBlock(buttonsSet);

  const menuGroupPostDiv = document.createElement("div");
  menuGroupPostDiv.append(strategyMenuDiv, postsMenuDiv, delayMenuDiv, deepMenuDiv, blockPostMenuDiv, infoPanelDiv);
  menuGroupPostDiv.style.cssText = styleMenu3;
  const playersMenu = document.createElement('div');
  playersMenu.append(competitorsMenuDiv, comradesMenuDiv, inputFirstWordDiv, extraSettingsDiv);
  playersMenu.style.cssText = styleMenu3;

  const minimizeButton = document.createElement("button");
  minimizeButton.append(document.createTextNode("_"));
  minimizeButton.style.cssText = `
  position: fixed;
  bottom: 50px;
  left: 10px;
  color: ${colors.color01};
  border: 1px solid ${colors.border01};
  z-index: 5010;
  `;

  menuVK.append(menuGroupPostDiv, playersMenu, logsInfoDiv, currentInfoDiv, buttonsBlockDiv);
  document.querySelector(`body`).append(menuVK, minimizeButton);

  function createMenuBlock(items, menuObj, styleMenu, styleInput) {
    const menuBlock = document.createElement("div");
    menuBlock.style.cssText = styleMenu;
    const head = document.createElement('h6');
    head.style.cssText = "margin: 2px auto; width: fit-content;"
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
      if (menuObj.type === "text") {
        inputEl.style.width = "calc(100% - 8px)";
      }
      inputBlock.append(inputEl, inputLabel);
      inputBlock.style.cssText = styleInput;
      menuBlock.append(inputBlock);
      menuObj.domElements[item] = inputEl;
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
      buttons[btn].domElement = buttonElement;
    });
    return buttonsBlock;
  }

  function createInfoBlock(menuObj, styleMenu) {
    const infoBlock = document.createElement("div");
    infoBlock.style.cssText = styleMenu;
    const head = document.createElement('h6');
    head.style.margin = "0 0 4px";
    head.append(document.createTextNode(menuObj.headName));
    infoBlock.append(head);

    for (const key in menuObj.items) {
      const postEl = document.createElement('p');
      postEl.style.cssText = "margin: 4px; text-align: left;";
      const postDivSpan = document.createElement('span');
      postDivSpan.style.color = menuObj.items[key].infoColor;
      postDivSpan.append(document.createTextNode(menuObj.items[key].startValue));
      postDivSpan.style.fontWeight = menuObj.items[key].bold ? "bold" : "normal";
      postEl.append(document.createTextNode(`${menuObj.items[key].name}: `), postDivSpan);
      menuObj.items[key].domElement = postDivSpan;
      infoBlock.append(postEl);
    }
    return infoBlock;
  }

  function addLogsInfo(infoText, color = colors.info01) {
    const infoNode = document.createElement("p");
    infoNode.style.cssText = `margin: 4px 0; color: ${color};`;
    infoNode.textContent = infoText;
    logsInfoFieldDiv.append(infoNode);
  }

  function setListenersStrategyMenu() {
    for (const key in strategyMenu.domElements) {
      strategyMenu.domElements[key].onchange = updateDisableInputs;
    }
    blockPostMenu.headDomElement.onclick = updateCheckedInputs;
    competitorsMenu.headDomElement.onclick = updateCheckedInputs;
    comradesMenu.headDomElement.onclick = updateCheckedInputs;
    minimizeButton.onclick = minimizeMenu;
  }

  function minimizeMenu() {
    if (isMinimize) {
      menuVK.style.transform = "scale(1)";
      minimizeButton.innerText = "_";
    } else {
      menuVK.style.transform = "scale(0)";
      minimizeButton.innerText = "□";
    }
    isMinimize = !isMinimize;
  }

  function updateDisableInputs(e) {
    switch (e.target.id) {
      case "all":
        changeDisableInputs(deepMenu.domElements, e.target.checked);
        // extraSettings.domElements.skipMyPostDeep.disabled = e.target.checked;
        changeDisableInputs(competitorsMenu.domElements, e.target.checked);
        changeDisableInputs(comradesMenu.domElements, e.target.checked);
        competitorsMenu.headDomElement.style.cursor = e.target.checked ? "text" : "pointer";
        comradesMenu.headDomElement.style.cursor = e.target.checked ? "text" : "pointer";
        changeDisableInputs(firstWordMenu.domElements, e.target.checked);
        break;
      case "aftermy":
      case "my":
        changeDisableInputs(deepMenu.domElements, !e.target.checked);
        changeDisableInputs(competitorsMenu.domElements, e.target.checked);
        changeDisableInputs(comradesMenu.domElements, e.target.checked);
        competitorsMenu.headDomElement.style.cursor = e.target.checked ? "text" : "pointer";
        comradesMenu.headDomElement.style.cursor = e.target.checked ? "text" : "pointer";
        changeDisableInputs(firstWordMenu.domElements, e.target.checked);
        break;
      case "players":
        changeDisableInputs(deepMenu.domElements, !e.target.checked);
        changeDisableInputs(competitorsMenu.domElements, !e.target.checked);
        changeDisableInputs(comradesMenu.domElements, !e.target.checked);
        competitorsMenu.headDomElement.style.cursor = e.target.checked ? "pointer" : "text";
        comradesMenu.headDomElement.style.cursor = e.target.checked ? "pointer" : "text";
        changeDisableInputs(firstWordMenu.domElements, e.target.checked);
        break;
      case "firstWordPostAfter":
      case "firstWordPostSkip":
        changeDisableInputs(deepMenu.domElements, !e.target.checked);
        changeDisableInputs(competitorsMenu.domElements, e.target.checked);
        competitorsMenu.headDomElement.style.cursor = e.target.checked ? "text" : "pointer";
        comradesMenu.headDomElement.style.cursor = e.target.checked ? "text" : "pointer";
        changeDisableInputs(comradesMenu.domElements, e.target.checked);
        changeDisableInputs(firstWordMenu.domElements, !e.target.checked);
        break;
    }
  }

  function changeDisableInputs(inputs, isChecked) {
    for (const key in inputs) {
      inputs[key].disabled = isChecked;
    }
  }

  function updateCheckedInputs(e) {
    if (e.target.innerText !== "BLOCKPOST" && !strategyMenu.domElements.players.checked) {
      return;
    }
    switch (e.target.innerText) {
      case "BLOCKPOST":
        changeCheckedInputs(blockPostMenu.domElements);
        break;
      case "COMPETITORS":
        changeCheckedInputs(competitorsMenu.domElements);
        break;
      case "COMRADES":
        changeCheckedInputs(comradesMenu.domElements);
        break;
    }
  }

  function changeCheckedInputs(inputs) {
    const inputsArr = Object.values(inputs);
    if (inputsArr.every(input => input.checked)) {
      inputsArr.forEach(item => item.checked = false);
    } else {
      inputsArr.forEach(item => item.checked = true);
    }
  }

  function setDefaultInputsChecked() {
    delayMenu.domElements["15"].checked = true;
    deepMenu.domElements["1"].checked = true;
    strategyMenu.domElements.all.click();
    blockPostMenu.headDomElement.style.cursor = "pointer";
  }

  function enableButton(button) {
    button.disabled = false;
    button.style.cursor = 'pointer';
  }

  function disableButton(button) {
    button.disabled = true;
    button.style.cursor = 'auto';
  }

  function enableMenus() {
    Object.values(strategyMenu.domElements).forEach((el) => el.disabled = false);
    Object.values(postsMenu.domElements).forEach((el) => el.disabled = false);
    Object.values(blockPostMenu.domElements).forEach((el) => el.disabled = false);
  }

  function disableMenus() {
    Object.values(strategyMenu.domElements).forEach((el) => el.disabled = true);
    Object.values(postsMenu.domElements).forEach((el) => el.disabled = true);
    Object.values(blockPostMenu.domElements).forEach((el) => el.disabled = true);
  }

  async function getIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      const errorInfo = 'Error fetching IP address:' + error;
      console.error(errorInfo);
      addLogsInfo(errorInfo, colors.info03);
    }
  }

  async function saveIPAddress() {
    try {
      await navigator.clipboard.writeText(currentInfoItems.myip.domElement.innerText)
      .then(() => {
        currentInfoItems.myip.domElement.style.color = colors.info02;
        setTimeout(() => {
          currentInfoItems.myip.domElement.style.color = colors.info01;
        }, 1500);
      });
    } catch (error) {
      const errorInfo = "4: IP адрес не  сохранен! Ошибка: " + error;
      console.error(errorInfo);
      addLogsInfo(errorInfo, colors.info03);
    }
  }

  function initStartData() {
    setListenersStrategyMenu();
    setDefaultInputsChecked();
    Object.keys(posts).forEach(post => loadAmountPosts(post));
    getIp().then((ip) => {
      currentInfoItems.myip.currentValue = ip;
      currentInfoItems.myip.domElement.style.color = colors.info01;
      currentInfoItems.myip.domElement.style.cursor = "pointer";
      currentInfoItems.myip.domElement.onclick = saveIPAddress;
    });
  }

  function loadAmountPosts(namePost) {
    fetch(`${urlBaseDataStat}/${VKName}${namePost}`, {
      method: 'GET',
      headers: {'content-type': 'application/json'},
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("0: Something went wrong!");
      }
    })
    .then(renderInfo => {
      const result = renderInfo.posts;
      const resultFilter = result.filter((pack) => {
        const currentDate = new Date();
        const packDate = new Date(pack.date);
        return (currentDate - packDate) / 3600000 < 12;
      });
      infoPanelItems[namePost].valueObject = resultFilter;
      const sumArr = resultFilter.reduce((accum, currentValue) => accum + currentValue.amount, 0);
      infoPanelItems[namePost].loadedValue = sumArr;
    })
    .catch(error => {
      const errorInfo = "Ошибка получения количества постов с mockapi: " + error;
      console.error(errorInfo);
      addLogsInfo(errorInfo, colors.info03);
    })
  }

  function saveAmountPosts(namePost) {
    const amount = infoPanelItems[currentNamePost].currentValue;
    if (!infoPanelItems[currentNamePost] || amount === 0) {
      return;
    }
    disableButton(buttonsSet.savePost.domElement);
    const newData = {
      posts: [{amount: amount, date: new Date()}, ...infoPanelItems[namePost].valueObject],
    };
    fetch(`${urlBaseDataStat}/${VKName}${namePost}`, {
      method: 'PUT',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(newData)
    }).then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("2: Something went wrong!");
    }).then(task => {
      infoPanelItems[currentNamePost].currentValue = 0;
      infoPanelItems[currentNamePost].loadedValue += amount;
      infoPanelItems[currentNamePost].valueObject = newData.posts;
      infoPanelItems[namePost].domElement.style.color = colors.info02;
      console.log("2: Данные на сервере обновлены!");
    }).catch(error => {
      const errorInfo = "Ошибка сохранения данных опубликованных постов на mockapi: " + error;
      console.log(errorInfo);
      addLogsInfo(errorInfo, colors.info03);
    })
  }

  function savePosted() {
    saveAmountPosts(currentNamePost);
  }

  function postCurrPost() {
    disableButton(buttonsSet.doPost.domElement);
    isPostCurrPost = true;
  }

  function skipCurrPost() {
    disableButton(buttonsSet.skipPost.domElement);
    isSkipCurrPost = true;
  }

  function clearDataBeforeStartCycle() {
    currentNumberGr = 0;
    groupsForPublish.length = 0;
    postForPublish.length = 0;
    currentInfoItems.missedposts.currentValue = 0;
    currentInfoItems.leftposts.currentValue = 0;
    currentInfoItems.errorsposts.currentValue = 0;
    currentInfoItems.missedposts.domElement.innerText = currentInfoItems.missedposts.startValue;
    currentInfoItems.leftposts.domElement.innerText = currentInfoItems.leftposts.startValue;
    currentInfoItems.errorsposts.domElement.innerText = currentInfoItems.errorsposts.startValue;
  }

  function clearDataBeforeBigCycle() {
    //clear
  }

  function saveOnClose(e) {
    e.preventDefault();
    saveAmountPosts(currentNamePost);
    return 'You have made changes. They will be lost if you continue.';
  }

  /**
   * INIT SCRIPT
   **/
  initStartData();

  /**
   * START SCRIPT
   **/
  function startScript() {
    if ((Object.values(postsMenu.domElements)).every(element => !element.checked)) {
      alert('Не выбрано ни одного поста (POSTS) !');
      return;
    }
    if ((Object.values(blockPostMenu.domElements)).every(element => !element.checked)) {
      alert('Не выбрано ни одного набора групп (BLOCKPOST) для постов !');
      return;
    }
    if (strategyMenu.domElements.players.checked &&
      (Object.values(competitorsMenu.domElements)).every(element => element.checked) &&
      (Object.values(comradesMenu.domElements)).every(element => element.checked)) {
      alert('Необходимо выбрать хотя бы одного пользователя COMPETITORS и/или COMRADES !')
      return;
    }
    clearDataBeforeStartCycle();
    for (let key in delayMenu.domElements) {
      if (delayMenu.domElements[key].checked) {
        delayXL = (+key) * 1000;
      }
    }

    for (const key in postsMenu.domElements) {
      if (postsMenu.domElements[key].checked) {
        postForPublish.push(key);
      }
    }

    currentNamePost = postForPublish[currentNumberPost];

    if (boxNumbers.length === 0) {
      const blockPostMenuGroups = Object.values(blockPostMenu.domElements);
      blockPostMenuGroups.forEach(group => {
        if (group.checked) {
          boxNumbers.push(Number(group.id));
        }
      });
    }

    blockPostMenu.domElements[boxNumbers[0]].parentNode.style.border = "2px solid green";

    //берем первый из выбранных бокс(набор) групп
    groupsForPublish.push(...groupsBox[boxNumbers[0]]);

    // Shuffle array using the Fisher–Yates shuffle
    for (let i = groupsForPublish.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [groupsForPublish[i], groupsForPublish[j]] = [groupsForPublish[j], groupsForPublish[i]];
    }
    currentInfoItems.leftposts.currentValue = groupsForPublish.length;

    console.log('Запускаем скрипты: ', postForPublish);
    disableButton(buttonsSet.startPosting.domElement);
    window.addEventListener('beforeunload', saveOnClose);
    loadPost();
  }

  function loadPost() {
    fetch(`https://642dd59966a20ec9cea70c6c.mockapi.io/tasks/${VKName}_${currentNamePost}`, {
      method: 'GET',
      headers: {'content-type': 'application/json'},
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Something went wrong!");
      }
    }).then(post => {
      currentPost = post;
      // console.log('CURRENT POST: ', currentPost.text);
      myPostText = currentPost.text.substring(0, 31);
      savePostToDb();
    }).catch(error => {
      const errorInfo = "Ошибка чтения поста с mockapi: " + error;
      console.log(errorInfo);
      addLogsInfo(errorInfo, colors.info03);
      enableButton(buttonsSet.startPosting.domElement);
      enableMenus();
    })
  }

  function savePostToDb() {
    const request = indexedDB.open("posting-draft-v1", 1);
    request.onerror = function (event) {
      const errorInfo = "An error occurred with IndexedDB, " + event;
      console.error(errorInfo);
      addLogsInfo(errorInfo, colors.info03);
      enableButton(buttonsSet.startPosting.domElement);
      enableMenus();
    };
    request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction("posting-draft", "readwrite");
      const store = transaction.objectStore("posting-draft");
      const keyStore = `${idUser}--${groupsForPublish[currentNumberGr][0]}`;
      const idQuery = store.get(keyStore);
      idQuery.onsuccess = function () {
        store.put(currentPost, keyStore);
        disableMenus();
        checkEnterToBookMarks();
      };
    };
  }

  function delayAct(action, delay) {
    console.log(action.name);
    scheduler
    .postTask(action, {delay: delay});
    // return (setTimeout(action, delay));
  }

  function nextClickAction(selector, nextCallback, delay) {
    const linkToClick = document.querySelector(selector);
    if (linkToClick) {
      linkToClick.click();
      delayAct(nextCallback, delay);
    } else {
      delayAct(() => {
        nextClickAction(selector, nextCallback, delay);
      }, delayM);
    }
  }

  function checkEnterToBookMarks() {
    const URLHash = window.location.href;
    if (URLHash === 'https://vk.com/bookmarks?type=group') {
      checkLoadGroupsList();
    } else {
      enterToBookMarks();
    }
  }

  function enterToBookMarks() {
    nextClickAction('a[href="/bookmarks?from_menu=1"]', checkLoadGroupsList, delayL);
  }

  function checkLoadGroupsList() {
    const emptyFeed = document.querySelector('.BookmarksEmptyFeed');
    const bookmarksGroup = document.querySelector('.bookmarks_rows_group');
    if (emptyFeed || (bookmarksGroup && bookmarksGroup.innerText.includes("Добавляйте"))) {
      loadNarrativeList();
    } else {
      delayAct(checkLoadGroupPage, delayL);
    }
  }

  function loadNarrativeList() {
    nextClickAction('#ui_rmenu_narrative', loadGroupsList, delayM);
  }

  function loadGroupsList() {
    nextClickAction('#ui_rmenu_group', enterToBookMarks, delayL);
  }

  function checkLoadGroupPage() {
    const URLHash = window.location.href;
    if (functionRepetitions > 10) {
      functionRepetitions = 0;
      enterToBookMarks();
      return;
    }
    if (URLHash === 'https://vk.com/bookmarks?type=group') {
      functionRepetitions = 0;
      delayAct(enterToCurrentGroup, delayM);
    } else {
      functionRepetitions++;
      delayAct(checkLoadGroupPage, delayL);
    }
  }

  function enterToCurrentGroup() {
    enableButton(buttonsSet.skipPost.domElement);
    const groupHref = `/${groupsForPublish[currentNumberGr][1]}`;
    const linkGroup = document.querySelector(`.group_link[href^="${groupHref}"]`);
    if (linkGroup) {
      console.log("linkGroup: ", linkGroup);
      linkGroup.click();
      delayAct(checkCurrentGroup, delayM);
    } else {
      console.log("Didn't find group: ", groupHref);
      console.log("Scrolling page...");
      window.scrollBy(0, 1500);
      delayAct(checkLoadGroupPage, delayM);
    }
  }

  function checkCurrentGroup() {
    const URLHash = window.location.href;
    if (URLHash === 'https://vk.com/bookmarks?type=group') {
      if (functionRepetitions > 10) {
        functionRepetitions = 0;
        delayAct(enterToCurrentGroup, delayM);
      } else {
        functionRepetitions++;
        delayAct(checkCurrentGroup, delayM);
      }
    } else {
      functionRepetitions = 0;
      for (const key in deepMenu.domElements) {
        if (deepMenu.domElements[key].checked) {
          deepAmount = +(key);
        }
      }
      console.log("deepAmount: ", deepAmount);
      const scrollBehavior = extraSettings.domElements.fast.checked ? 'auto' : 'smooth';
      window.scrollBy({top: deepAmount * 500, left: 0, behavior: scrollBehavior});
      if (extraSettings.domElements.fast.checked) {
        delayAct(checkNecessityPosting, delayM);
      } else {
        delayAct(scrollPageBack, delayM);
      }
    }
  }

  function scrollPageBack() {
    window.scrollTo({top: 500, left: 0, behavior: 'smooth'});
    delayAct(checkNecessityPosting, delayM);
  }

  /**
   * NECESSITY POSTING
   **/
  function checkNecessityPosting() {
    if (isSkipCurrPost) {
      skipPosting();
      return;
    }
    if (isPostCurrPost) {
      makePost();
      return;
    }
    let currentStrategy = null;
    for (const key in strategyMenu.domElements) {
      if (strategyMenu.domElements[key].checked) {
        currentStrategy = key;
        break;
      }
    }
    console.log("currentStrategy: ", currentStrategy);

    const players = [];
    if (currentStrategy === "players") {
      (Object.values(competitorsMenu.domElements)).forEach((element) => {
        if (element.checked) {
          players.push(element.id);
        }
      });
      (Object.values(comradesMenu.domElements)).forEach((element) => {
        if (element.checked) {
          players.push(element.id);
        }
      });
    }

    let firstWordValues = []
    if (currentStrategy === "firstWordPostAfter" || currentStrategy === "firstWordPostSkip") {
      for (const key in firstWordMenu.domElements) {
        const currValue = firstWordMenu.domElements[key].value.trim();
        if (currValue) {
          firstWordValues.push(currValue);
        }
      }
    }

    const checkingPosts = Array.from(document.querySelectorAll('.post'));
    //check "pin" in the group, if yes, then we increase deepAmount by 1;
    const isFirstPin = checkingPosts[0]?.querySelector('.PostHeaderTitle__pin');
    if (isFirstPin) {
      checkingPosts[0].remove();
      console.log("*** There is PIN ***");
      checkingPosts.shift();
    }
    checkingPosts.splice(deepAmount);
    IdFirstPostForSubmitChecking = checkingPosts[0]?.id;

    const avatarRichFirst = checkingPosts[0]?.querySelector('.AvatarRich');
    if (!avatarRichFirst) {
      console.log("Не найден avatarRichFirst, попробуем снова...");
      delayAct(checkNecessityPosting, delayL);
      return;
    }
    const postUserIdFirst = avatarRichFirst.getAttribute('href');
    let blockTextPostFirst = checkingPosts[0].querySelector('[data-testid="showmoretext"]');
    let messageText = " ";
    if (blockTextPostFirst) {
      messageText = blockTextPostFirst.innerText.includes(myPostText);
    }
    if (postUserIdFirst.substring(3) === idUser && messageText) {
      console.log("Опаньки... Мой пост уже есть! Уходим!");
      skipPosting();
      return;
    }

    if (currentStrategy === "all") {
      makePost();
      return;
    }

    let isNecessityPosting = false;
    for (let i = 0; i < checkingPosts.length; i++) {
      const avatarRich = checkingPosts[i].querySelector('.AvatarRich');
      if (!avatarRich) {
        console.log("Didn't find AvatarRich. checkingPosts: ", checkingPosts);
        delayAct(checkNecessityPosting, delayL);
        return;
      }
      const postUserId = avatarRich.getAttribute('href');
      console.log("postUserId: ", postUserId);

      if (currentStrategy === "aftermy") {
        console.log("00 Compare ", postUserId.substring(3), " and ", idUser);
        if (postUserId.substring(3) === idUser) {
          isNecessityPosting = true;
          break;
        }
        continue;
      }
      if (currentStrategy === "my") {
        console.log("01 Compare ", postUserId.substring(3), " and ", idUser);
        if (postUserId.substring(3) === idUser) {
          isNecessityPosting = false;
          break;
        }
        isNecessityPosting = true;
        continue;
      }
      if (currentStrategy === "players") {
        console.log("02 Compare ", players, " and ", postUserId.substring(1));
        if (players.some(element => postUserId.substring(1).includes(element))) {
          isNecessityPosting = true;
          break;
        }
        continue;
      }
      if (currentStrategy === "firstWordPostAfter") {
        console.log("03 Compare... ");
        const blockTextPost = checkingPosts[i].querySelector('[data-testid="showmoretext"]');
        let isBreak = false;
        firstWordValues.forEach((value) => {
          if (blockTextPost && blockTextPost.innerText.includes(value)) {
            isBreak = true;
          }
        });
        if (isBreak) {
          isNecessityPosting = true;
          break;
        }
        continue;
      }
      if (currentStrategy === "firstWordPostSkip") {
        const blockTextPost = checkingPosts[i].querySelector('[data-testid="showmoretext"]');
        console.log("04 Compare... ");
        let isBreak = false;
        firstWordValues.forEach((value) => {
          if (blockTextPost && blockTextPost.innerText.includes(value)) {
            isBreak = true;
          }
        });
        if (isBreak) {
          isNecessityPosting = false;
          break;
        }
        isNecessityPosting = true;
        continue;
      }
    }
    console.log("ЗАВЕРШИЛИ ЦИКЛ ПРОВЕРКИ.");
    if (isNecessityPosting) {
      makePost();
    } else {
      skipPosting();
    }
  }

  function skipPosting() {
    isSkipCurrPost = false;
    enableButton(buttonsSet.skipPost.domElement);
    currentInfoItems.missedposts.currentValue++;
    startNewCycle(delayM);
  }

  function makePost() {
    isPostCurrPost = false;
    clickCreatePost();
  }

  function clickCreatePost() {
    const postCreateButton = document.querySelector('[data-testid="posting_create_post_button"]');
    if (postCreateButton) {
      postCreateButton.click();
      delayAct(clickOpenDraftPost, delayM);
    } else {
      delayAct(submitGroup, delayM);
    }
    // nextClickAction('[data-testid="posting_create_post_button"]', clickOpenDraftPost, delayM);
  }

  function submitGroup() {
    const submitButton = document.querySelector('[data-testid="group-subscribe-button"]');
    if (submitButton) {
      submitButton.click();
      delayAct(clickCreatePost, delayM);
    } else {
      console.log("Кнопка ПОДПИСАТЬСЯ не найдена");
      delayAct(clickCreatePost, delayM);
    }
  }

  function clickOpenDraftPost() {
    const openDraft = document.querySelector('.box_controls_buttons .FlatButton--primary');
    if (openDraft) {
      openDraft.click();
      functionRepetitions = 0;
      delayAct(clickContinuePost, delayM);
    } else {
      console.log('Button Открыть черновик didn\'t find!');
      if (functionRepetitions > 5) {
        functionRepetitions = 0;
        groupsForPublish.push(groupsForPublish[currentNumberGr]);
        currentInfoItems.leftposts.currentValue++;
        currentInfoItems.errorsposts.currentValue++;
        startNewCycle(delayM);
      } else {
        functionRepetitions++;
        delayAct(clickOpenDraftPost, delayM);
      }
    }
  }

  function clickContinuePost() {
    nextClickAction('[data-testid="posting_base_screen_next"]', clickSavePost, delayM);
  }

  function clickSavePost() {
    if (isSkipCurrPost) {
      currentInfoItems.missedposts.currentValue++;
      isSkipCurrPost = false;
      delayAct(clickCloseDraftPost, delayM);
      return;
    }
    nextClickAction('[data-testid="posting_submit_button"]', checkPostSubmit, delayL);
  }

  function clickCloseDraftPost() {
    if (functionRepetitions > 5) {
      functionRepetitions = 0;
      startNewCycle(delayM);
      return;
    }
    const closeButton = document.querySelector('[data-testid="modal-close-button"]');
    if (closeButton) {
      closeButton.click();
      functionRepetitions = 0;
      delayAct(startNewCycle.bind(null, delayM), delayM);
    } else {
      functionRepetitions++;
      delayAct(clickCloseDraftPost, delayM);
    }
  }

  function checkPostSubmit() {
    const currentFirstPost = document.querySelector('.post');
    if (!currentFirstPost) {
      delayAct(checkPostSubmit, delayL);
      return;
    }
    console.log("POST 1: ", currentFirstPost.id);
    console.log("POST 2: ", IdFirstPostForSubmitChecking);
    if (currentFirstPost.id !== IdFirstPostForSubmitChecking) {
      infoPanelItems[currentNamePost].currentValue++;
      enableButton(buttonsSet.savePost.domElement);
      delayAct(startNewCycle, delayM);
    } else {
      delayAct(checkPostSubmit, delayM);
    }
  }

  function startNewCycle(newDelay = delayXL) {
    isPostCurrPost = false;
    enableButton(buttonsSet.doPost.domElement);
    currentInfoItems.leftposts.currentValue--;

    nextClickAction('a[href="/bookmarks?from_menu=1"]', updateCycleData.bind(null, newDelay), delayM);
  }

  function updateCycleData(newDelay = delayXL) {
    console.log("newDelay: ", newDelay);
    const isLastSmallCycle = currentNumberPost >= postForPublish.length - 1;
    const isLastBigCycle = currentNumberGr >= groupsForPublish.length - 1;

    //Если завершается большой круг, сохраняем кол-во опубликованных постов на сервере.
    if (isLastBigCycle && infoPanelItems[currentNamePost]) {
      addLogsInfo(`Box№${boxNumbers[0]}:  ${infoPanelItems[currentNamePost].currentValue}`, colors.info02);
      saveAmountPosts(currentNamePost);
    }
    if (isLastSmallCycle && isLastBigCycle) {
      delayAct(checkNextBox(), delayM);
      return;
    }
    if (isLastBigCycle) {
      currentNumberPost++;
      currentNamePost = postForPublish[currentNumberPost];
      currentNumberGr = 0;
      clearDataBeforeBigCycle();
      delayAct(loadPost, newDelay);
      return;
    }
    currentNumberGr++;
    delayAct(savePostToDb, newDelay);
  }

  function checkNextBox() {
    if (boxNumbers.length <= 1) {
      enterNews();
    } else {
      blockPostMenu.domElements[boxNumbers[0]].parentNode.style.border = "none";
      boxNumbers.shift();
      startScript();
    }
  }

  function enterNews() {
    nextClickAction('a[href="/feed"]', scrollPage, delayM);
  }

  function scrollPage(k = 10) {
    if (isSkipCurrPost) {
      isSkipCurrPost = false;
      enableButton(buttonsSet.skipPost.domElement);
      k = 0;
    }
    const n = 1000;
    const m = 5000;
    const timer = Math.floor(Math.random() * (m - n + 1)) + n;
    const a = 300;
    const b = 700;
    const dist = Math.floor(Math.random() * (b - a + 1)) + a;
    setTimeout(() => {
      window.scrollBy({top: dist, left: 0, behavior: 'smooth'});
      if (k <= 0) {
        window.removeEventListener('beforeunload', saveOnClose);
        enableButton(buttonsSet.startPosting.domElement);
        enableMenus();
        alert('ВСЕ СДЕЛАНО !!!');
      } else {
        scrollPage(k - 1);
      }
    }, timer);
  }

})();
