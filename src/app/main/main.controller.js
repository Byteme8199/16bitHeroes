(function() {
  'use strict';

  angular
    .module('16bitHeroes')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, toastr, $scope, $interval) {
    var vm = this;

    //var magusReady = $interval(magusAnim, 1000);
    

    var anim_timer = 1;
    var ticker

    $scope.paused = false;
    $scope.team = [];
    $scope.commands = [];

    $scope.showBattle = false;
    $scope.showSelect = false;
    $scope.showParty = false;

    $scope.unlocked = ["Cecil", "Rosa", "Rydia", "Kain", "Tellah", "Yang", "PalomPorom", "Golbez", "FuSoYa", "Edge", "Cid", "Edward", "Terra", "Locke", "Edgar", "Setzer", "Mog", "Banon", "Celes", "Cyan", "Gau", "GoGo", "Kefka", "Leo", "Relm", "Sabin", "Shadow", "Strago", "Umaro", "Crono", "Frog", "Lucca", "Ryu", "Nina", "Bow", "Randi"]
    //$scope.unlocked = ["Cecil", "Rosa", "Rydia", "Terra", "Locke", "Edgar", "Crono", "Frog", "Lucca", "Ryu", "Nina", "Bow", "Randi"]
    
    $scope.roster = []
    $scope.ff4 = { "name": "Final Fantasy 4", "roster": [ { "locked": true, "name": "Cecil"}, { "locked": true, "name": "Cid"}, { "locked": true, "name": "Edge"}, { "locked": true, "name": "Edward"}, { "locked": true, "name": "FuSoYa"}, { "locked": true, "name": "Golbez"}, { "locked": true, "name": "Kain"}, { "locked": true, "name": "PalomPorom"}, { "locked": true, "name": "Rosa"}, { "locked": true, "name": "Rydia"}, { "locked": true, "name": "Tellah"}, { "locked": true, "name": "Yang" }]};
    $scope.ff6 = { "name": "Final Fantasy 6", "roster": [ { "locked": true, "name": "Banon"}, { "locked": true, "name": "Celes"}, { "locked": true, "name": "Cyan"}, { "locked": true, "name": "Edgar"}, { "locked": true, "name": "Gau"}, { "locked": true, "name": "GoGo"}, { "locked": true, "name": "Kefka"}, { "locked": true, "name": "Leo"}, { "locked": true, "name": "Locke"}, { "locked": true, "name": "Mog"}, { "locked": true, "name": "Relm"}, { "locked": true, "name": "Sabin"}, { "locked": true, "name": "Setzer"}, { "locked": true, "name": "Shadow"}, { "locked": true, "name": "Strago"}, { "locked": true, "name": "Terra"}, { "locked": true, "name": "Umaro"}]};
    $scope.ct = { "name": "Chrono Trigger", "roster": [ { "locked": true, "name": "Ayla"}, { "locked": true, "name": "Crono"}, { "locked": true, "name": "Frog"}, { "locked": true, "name": "Lucca"}, { "locked": true, "name": "Magus"}, { "locked": true, "name": "Marle"}, { "locked": true, "name": "Robo"}]};
    $scope.som = { "name": "Secret of Mana", "roster": [ { "locked": true, "name": "Popoi"}, { "locked": true, "name": "Primm"}, { "locked": true, "name": "Randi"}]};
    $scope.bof = { "name": "Breath of Fire 2", "roster": [ { "locked": true, "name": "Bleu"}, { "locked": true, "name": "Bow"}, { "locked": true, "name": "Jean"}, { "locked": true, "name": "Katt"}, { "locked": true, "name": "Nina"}, { "locked": true, "name": "Rand"}, { "locked": true, "name": "Ryu"}, { "locked": true, "name": "Spar"}, { "locked": true, "name": "Sten"}]};
    $scope.roster.push($scope.ff4, $scope.ff6, $scope.ct, $scope.bof, $scope.som);

    $scope.switchViews = function(view){
      console.log(view);
      $scope.paused = true;
      $scope.showBattle = false;
      $scope.showSelect = false;
      $scope.showParty = false;

      if(view === 'battle'){
        $scope.showBattle = true;
        ticker = $interval(tick, 30);
        $scope.paused = false;
      } else if(view === 'select') {
        $scope.checkDisabled();
        $scope.showSelect = true;
      } else if(view === 'party') {
        $scope.showParty = true;
      }
    }

    $scope.enemyForce = []

    $scope.returnEnemy = function(name, x, y, num){
      if(name == 'Goblin') {
        return { "num": num, "name": "Goblin", "init": 0, "speed": 40, "level": 3, "pixelheight": 0, "hp": 6, "hptotal": 6, "strength": 19, "exp": 28, "gil": 5, "spacingx": x, "spacingy": y, "image": "assets/images/ff6enemies2.png", "offsetx": 1402, "offsety": 435, "width": 117, "height": 130, "zoom": 0 }
      }
      if(name == 'Slut') {
        return { "num": num, "name": "Slut", "init": 0, "speed": 36, "level": 3, "pixelheight": 0, "hp": 23, "hptotal": 23, "strength": 19, "exp": 28, "gil": 5, "spacingx": x, "spacingy": y, "image": "assets/images/ff6enemies2.png", "offsetx": 722, "offsety": 1691, "width": 206, "height": 220, "zoom": 0 }
      }
    }


    // enemy Group 1?
    $scope.enemyForce.push($scope.returnEnemy("Slut", 25, 250, 1));
    $scope.enemyForce.push($scope.returnEnemy("Goblin", 240, 270, 2));
    $scope.enemyForce.push($scope.returnEnemy("Goblin", 240, 400, 3));

    //console.log($scope.enemyForce);


    $scope.returnCharacter = function(name){

      ///////// FF4 /////////

      if(name == 'Cecil'){
        return { "name": "Cecil", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 28, "position": "front", "hp": 100, "hptotal": 1000, "defending": false, "commands": ["Fight", "Defend", "Cover", "Magic"] }
      }
      if(name == 'Cid'){
        return { "name": "Cid", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 26, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Analyze", "Airship"] }
      }
      if(name == 'Edge'){
        return { "name": "Edge", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 34, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Throw", "Steal", "Ninjitsu"] }
      }
      if(name == 'Edward'){
        return { "name": "Edward", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 31, "position": "back", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Sing", "Heal", "Hide"], "sing": [{'name': 'Sonata', 'element': 'song', 'class': 'white', 'power': -4521, 'hitrate': 120, 'runic': true, 'multiple': true, "castingTime": 5000, "animationTime": 3000 }] }
      }
      if(name == 'FuSoYa'){
        return { "name": "FuSoYa", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 40, "position": "back", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Bless"], "magic": [{'name': 'fire', 'element': 'fire', 'class': 'black', 'power': 21, 'hitrate': 120, 'runic': true, 'multiple': true, "castingTime": 3000, "animationTime": 3000 }, {'name': 'fira', 'element': 'fire', 'class': 'black', 'power': 60, 'hitrate': 150, 'runic': true, 'multiple': true, "castingTime": 5000, "animationTime": 3000 }] }
      }
      if(name == 'Rosa'){
        return { "name": "Rosa", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "back", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"], "magic": [{'name': 'cure', 'element': 'holy', 'class': 'white', 'power': -21, 'hitrate': 0, 'runic': true, 'multiple': false, "castingTime": 1000, "animationTime": 3000 }, {'name': 'cura', 'element': 'holy', 'class': 'white', 'power': -60, 'hitrate': 0, 'runic': true, 'multiple': false, "castingTime": 5000, "animationTime": 3000 }] }
      }
      if(name == 'Kain'){
        return { "name": "Kain", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Rydia'){
        return { "name": "Rydia", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "back", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Golbez'){
        return { "name": "Golbez", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'PalomPorom'){
        return { "name": "PalomPorom", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 60, "mp": 10, "mptotal": 100, "speed": 30, "position": "back", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Tellah'){
        return { "name": "Tellah", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "back", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Yang'){
        return { "name": "Yang", "game": "Final Fantasy 4", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }

      ///////// FF6 /////////

      if(name == 'Banon'){
        return { "name": "Banon", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 27, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Pray"] }
      }
      if(name == 'Celes'){
        return { "name": "Celes", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Cyan'){
        return { "name": "Cyan", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Edgar'){
        return { "name": "Edgar", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Gau'){
        return { "name": "Gau", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'GoGo'){
        return { "name": "GoGo", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Kefka'){
        return { "name": "Kefka", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Leo'){
        return { "name": "Leo", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Locke'){
        return { "name": "Locke", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Mog'){
        return { "name": "Mog", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Relm'){
        return { "name": "Relm", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Sabin'){
        return { "name": "Sabin", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Setzer'){
        return { "name": "Setzer", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Shadow'){
        return { "name": "Shadow", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Strago'){
        return { "name": "Strago", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Terra'){
        return { "name": "Terra", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Umaro'){
        return { "name": "Umaro", "game": "Final Fantasy 6", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }

      //////  Chrono Trigger //////////

      if(name == 'Crono'){
        return { "name": "Crono", "game": "Chrono Trigger", "init": 0, "level": 1, "strength": 20, "pixelheight": 40, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Ayla'){
        return { "name": "Ayla", "game": "Chrono Trigger", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Frog'){
        return { "name": "Frog", "game": "Chrono Trigger", "init": 0, "level": 1, "strength": 20, "pixelheight": 20, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Robo'){
        return { "name": "Robo", "game": "Chrono Trigger", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Magus'){
        return { "name": "Magus", "game": "Chrono Trigger", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Lucca'){
        return { "name": "Lucca", "game": "Chrono Trigger", "init": 0, "level": 1, "strength": 20, "pixelheight": 40, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Marle'){
        return { "name": "Marle", "game": "Chrono Trigger", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }

      ////////////// Secret of Mana //////////

      if(name == 'Randi'){
        return { "name": "Randi", "game": "Secret of Mana", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Popoi'){
        return { "name": "Popoi", "game": "Secret of Mana", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Primm'){
        return { "name": "Primm", "game": "Secret of Mana", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }

      //////////// Breath of Fire 2 /////////////

      if(name == 'Bleu'){
        return { "name": "Bleu", "game": "Breath of Fire 2", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Bow'){
        return { "name": "Bow", "game": "Breath of Fire 2", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Jean'){
        return { "name": "Jean", "game": "Breath of Fire 2", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Katt'){
        return { "name": "Katt", "game": "Breath of Fire 2", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Nina'){
        return { "name": "Nina", "game": "Breath of Fire 2", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Rand'){
        return { "name": "Rand", "game": "Breath of Fire 2", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Ryu'){
        return { "name": "Ryu", "game": "Breath of Fire 2", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Spar'){
        return { "name": "Spar", "game": "Breath of Fire 2", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
      if(name == 'Sten'){
        return { "name": "Sten", "game": "Breath of Fire 2", "init": 0, "level": 1, "strength": 20, "pixelheight": 0, "mp": 10, "mptotal": 100, "speed": 30, "position": "front", "hp": 100, "hptotal": 160, "defending": false, "commands": ["Fight", "Defend", "Magic", "Runic"] }
      }
    }

    $scope.addChar = function(name, locked){
      var noDupes = true;
      if(!locked && $scope.team.length < 5){
        angular.forEach($scope.team, function(char) {
          if(char.name === name){
            noDupes = false;
          }
        })
        if(noDupes){
          $scope.team.push($scope.returnCharacter(name));
        }
      }
      //console.log($scope.team);
    }

    $scope.removeChar = function(num){
      $scope.team.splice(num, 1);
    }

    $scope.currentGameID = 0
    $scope.currentGame = $scope.roster[0].name

    $scope.changeGame = function(num){
      if(num < 5 && num > -1){ 
        $("#gameSelectHolder").css('margin-top', -(410 * num));  
        $scope.currentGameID = num;
        $scope.currentSlotID = 0;
        $scope.currentGame = $scope.roster[$scope.currentGameID].name
        $scope.checkDisabled();
      }
    }

    $scope.checkDisabled = function(){
      var i = 0;
      angular.forEach($scope.roster, function(game) {
        $("#gameSelectHolder .gameSelect:nth-child(" + ( i + 1 ) + ")").css('margin-left', 0);
        if(game.name === $scope.currentGame){
          $("#gameSelectHolder .gameSelect:nth-child(" + ( i + 1 ) + ") .thin-portrait").removeClass('grey');
        } else {
          $("#gameSelectHolder .gameSelect:nth-child(" + ( i + 1 ) + ") .thin-portrait").addClass('grey');
        }
        i++;
      })
    }

    $scope.changeCharacterSlot = function(num){
      if(num > -1 && num < ($scope.roster[$scope.currentGameID].roster.length) - 4){
        $("#gameSelectHolder .gameSelect:nth-child(" + ($scope.currentGameID + 1) + ")").css('margin-left', -(130 * num));
        $scope.currentSlotID = num;
      }
      
    }

    function isDisabled(){
      console.log("Unlocking Characters");
      angular.forEach($scope.unlocked, function(unlockedchar) {
        angular.forEach($scope.roster, function(game) {
          angular.forEach(game.roster, function(char) {
            if(unlockedchar === char.name){
              char["locked"] = false;
            }
          })
        })
      })
    }

    function selectCharacters(){
      isDisabled();
      $scope.switchViews('select');
      //console.log($scope.roster);
    }

    selectCharacters()


    $scope.loadCharacters = function(){
      if($scope.team.length === 5){
        //console.log("Let's Get Menu'ing!");
        $scope.switchViews('party');
        checkSpacing();
      } else {
        //console.log("Select 5 Characters, Please");
      }
    }


    $scope.changePosition = function(char){
      checkSpacing();
      if(char.position === 'back' && $scope.frontrow.length < 3) {
        char.position = 'front';
      } else if (char.position === 'front' && $scope.backrow.length < 3) {
        char.position = 'back';
      } else {
        console.log("Can't do that...")
      }
      checkSpacing(); 
    }


    $scope.goodColumns = false; 


    function checkSpacing(){
      $scope.frontrow = [];
      $scope.backrow = [];
      angular.forEach($scope.team, function(char) { 
        if(char.position === 'back'){
          $scope.backrow.push(char);
        } else {
          $scope.frontrow.push(char);
        }
      });
      if ($scope.frontrow.length > 3 || $scope.backrow.length > 3){
        //Fix the spacing!
        console.log("Fix the Spacing!")
      }
      if ($scope.frontrow.length <= 3 && $scope.backrow.length <= 3){
        $scope.goodColumns = true;
      }
    }

    function tick(){
        var enemiesDead = 0;
        var teamDead = 0;

        for (var c = 0; c < $scope.team.length; c++){
          if($scope.team[c].hp > 0){
            updateInit($scope.team[c], c);
            teamDead += 1
          } else {
            showAnim($scope.team[c], 'dead' + $scope.team[c].name) 
          }
        }
        for (var d = 0; d < $scope.enemyForce.length; d++){
          if($scope.enemyForce[d].hp > 0){
            updateInitBoss($scope.enemyForce[d], d);
            enemiesDead += 1
          }
        }

        if(teamDead === 0) {
          console.log("Game Over")
          // Drop Equipment / Gear
          $interval.cancel(ticker);
          $scope.clearInputs = true
        }

        if(enemiesDead === 0) {
          console.log("You Won!");
          // Get Experience
          // Get Gil & Treasure
          // Get Next Match
          $interval.cancel(ticker);
        }

        
    }

    function pickTeamTarget(enemy, callback) {
        var rando = Math.floor(Math.random() * $scope.team.length);
        $scope.currentAITarget = '';
        loop();
        function loop() {
            if ($scope.team[rando].hp < 0) {
              setTimeout(loop, 100);
            } else {
              // Found an applicable team target...
              $scope.currentAITarget = $scope.team[rando]
              callback();
            }
        }
    }

    function updateInitBoss(enemy, num){
      if($scope.enemyForce[num].init < 65536){
        $scope.enemyForce[num].init += ((96 * ($scope.enemyForce[num].speed + 20)) / 16);
      } else {
        pickTeamTarget(enemy, function() {
            $scope.currentAITarget.hp -= 4;  ///  Put the code you want to actually work here....
            $scope.enemyForce[num].init = 0;
            console.log(enemy.name + " " +  num + " Attacks " + $scope.currentAITarget.name + " for 4 dmg");
        })
      }
    }

    function updateInit(char, num){
      var classStr = "." + $scope.team[num].name + "_status";
      if($scope.team[num].init < 65536){
        $scope.team[num].init += ((96 * ($scope.team[num].speed + 20)) / 16)
        $(classStr + ' .init').css('background-size', (($scope.team[num].init / 65536) * 100) + '% 10px' );
        //console.log(classStr + " " + (($scope.team[num].init / 65536) * 100) + '%');
      } else {
        if(!$scope.paused){
          inputCommand(char, num);
        }
      }
    }   

    $scope.inputting = false;

    function inputCommand(char, num){
      $scope.inputting = true;
      $scope.paused = true;
      $scope.target = [];
      $("#selectedCharacter").css('top', (parseInt($('.' + char.name).css('top')) - 35))
      $("#selectedCharacter").css('left', (parseInt($('.' + char.name).css('left')) + 20))
      $("." + char.name + "_status strong").css('color', 'yellow');
      $scope.commands = char.commands;
      $scope.currentChar = char;
      $scope.team[num].init = 0;

      // Reset 1-turn Statuses   
      $scope.currentChar.defending = false;
    }

    $scope.selectTarget = function(group, row, num){
      if(group === "enemy"){
        $scope.target = $scope.enemyForce[num];
      } else {
          if(row === 'front') {
            $scope.target = $scope.frontrow[num];
          } else {
            $scope.target = $scope.backrow[num];
          }
          //console.log($scope.target)
      }
    }

    function resetCommands(){
      //console.log("resetting commands");
      $("#selectedCharacter").css('top', -1000)
      $("." + $scope.currentChar.name + "_status strong").css('color', 'white');
      $scope.inputting = false;
      $scope.commands = [];
      $scope.subActionList = [];
      $scope.paused = false;
      $scope.target = [];
      $scope.chosenSubAction = '';
    }

    function getTarget(callback) {
        loop();
        function loop() {
            if ($scope.target.length === 0) {
              setTimeout(loop, 100);
            } else {
              callback();
            }
        }
    }

    function selectSubAction(callback) {
        $scope.chosenSubAction = ''
        loop();
        function loop() {
            if ($scope.chosenSubAction === '') {
              setTimeout(loop, 100);
            } else {
              callback();
            }
        }
    }

    $scope.movePointer = function(){
      $(".boss").mouseover(function() {
        $('.pointer').css('top', parseInt($(this).css('top')) + 50);
        $('.pointer').css('left', parseInt($(this).css('left')) + 140);
        $('.pointer').css('transform', 'scaleX(-1)');
      })
      $(".character").mouseover(function() {
        $('.pointer').css('top', parseInt($(this).css('top')) + 20);
        $('.pointer').css('left', parseInt($(this).css('left')) - 80);
        $('.pointer').css('transform', 'scaleX(1)');
      })
    }
    
    $scope.removePointer = function(){
      $scope.target = [];
      $('.pointer').css('top', -1000);
      $('.pointer').css('left', -1000);
    }

    $scope.selectSubAction = function(action){
      $scope.chosenSubAction = action
    }

    $scope.runCommand = function(command){

      /// ADD SELECT ICON NEXT TO COMMAND NAME AFTER INITIAL SELECTION AND BETWEEN TARGET SELECT
      
      if(command === "Fight") {
        getTarget(function() {
            addToQueue('Fight', $scope.target, 1000, $scope.currentChar, {"name": "Fight"});
            resetCommands()
        });
      }

      if(command === "Defend") {
        $scope.currentChar.defending = true;
        resetCommands();
      }

      if(command == "Magic") {

        $scope.subActionList = $scope.currentChar.magic;
        $scope.commands = [];

        selectSubAction(function(){
          getTarget(function() {
            addToQueue('Magic', $scope.target, $scope.chosenSubAction.castingTime, $scope.currentChar, $scope.chosenSubAction);
            resetCommands();
          });
        });
      }

      if(command == "Sing") {

        $scope.subActionList = $scope.currentChar.sing;
        $scope.commands = [];

        selectSubAction(function(){
          getTarget(function() {
            addToQueue('Sing', $scope.target, $scope.chosenSubAction.castingTime, $scope.currentChar, $scope.chosenSubAction);
            resetCommands();
          });
        });
      }

    }

    function addToQueue(action, target, timer, char, ability){

      console.log(char.name + " prepares " + ability.name + " against " + target.name)
      /// Add Timer, and then Add Action Results
      showAnim(char, 'casting' + char.name)   // Chanting Spell / Getting Ready to do an Action

      setTimeout(doAction, timer);

      function doAction(){

        if(char.hp > 0){
          console.log(char.name + " casts " + ability.name + " against " + target.name)

          shownAction(ability.name);
          

          if(action === 'Fight'){
            // Actual formula should go here
            target.hp -= char.strength;
          }

          if(action === 'Magic'){
            showAnim(char, 'cast' + char.name)  //  Casting Spell // Initiating Action Animations
            target.hp -= ability.power;
            setTimeout(function(){
              showAnim(char, 'goback' + char.name)
            }, ability.animationTime)
          }

          if(action === 'Sing'){
            target.hp -= ability.power;
          }
          if(target.hp < 0 ){
            showAnim(target, 'deathBlow')
          }

          
        }

        
      }

      function shownAction(name){
        $scope.shownAction = name;
        $scope.showAction = true;
        setTimeout(function(){
          $scope.shownAction = '';
          $scope.showAction = false;
        }, 2500)
      }

    }



    function showAnim(target, anim){
      var targetID = '';
      if (target.num) {
        targetID = "#" + target.name + (target.num - 1);
      } else {
        targetID = "#" + target.name;
      }
      $(targetID).removeClass();
      $(targetID).addClass('character');
      $(targetID).addClass(target.name);
      $(targetID).addClass(anim);
    }

    function magusAnim() {
        if(anim_timer < 2){
          anim_timer ++;
        } else {
          anim_timer = 1;
        }
        $('.magus').removeClass('ready_frame1');
        $('.magus').removeClass('ready_frame2');
        $('.magus').addClass('ready_frame' + anim_timer);
    }

    // var horizon = Horizon();
    //   horizon.onReady(function() {
    //     var heroes = horizon("heroes");
    //     // var hero = { name: "Dark Knight Cecil"};
    //     // heroes.store(hero)

    //     heroes.fetch().subscribe(function (items) {
    //       items.forEach(function (item) {
    //         // Each result from the chat collection
    //         //  will pass through this function
    //         console.log(item);
    //       });
    //     },
    //     // If an error occurs, this function
    //     //  will execute with the `err` message
    //     function (err) {
    //       console.log(err);
    //     });

    //     //document.querySelector('h1').innerHTML = 'App works!'
    //   });
    // horizon.connect();
  }
})();
