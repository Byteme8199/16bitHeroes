(function() {
  'use strict';

  angular
    .module('16bitHeroes')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, toastr, $scope, $interval) {
    var vm = this;

    var anim_timer = 1;
    var ticker

    $scope.paused = false;
    $scope.team = [];
    $scope.commands = [];

    $scope.showBattle = false;
    $scope.showSelect = false;
    $scope.showParty = false;
    $scope.showStore = false;
    $scope.showEquip = false;

    $scope.uniqueID = 0;

    $scope.gil = 1000;

    $scope.unlocked = ["Cecil", "Rosa", "Rydia", "Kain", "Tellah", "Yang", "PalomPorom", "Golbez", "FuSoYa", "Edge", "Cid", "Edward", "Terra", "Locke", "Edgar", "Setzer", "Mog", "Banon", "Celes", "Cyan", "Gau", "GoGo", "Kefka", "Leo", "Relm", "Sabin", "Shadow", "Strago", "Umaro", "Crono", "Frog", "Lucca", "Robo", "Ayla", "Magus", "Marle", "Ryu", "Nina", "Bow", "Randi"]
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
      $scope.showStore = false;
      $scope.showEquip = false;

      $scope.selectedItem = "";
      $scope.equipmentType = "";

      if(view === 'battle'){
        $scope.showBattle = true;
        ticker = $interval(tick, 30);
        $scope.paused = false;
      } else if(view === 'select') {
        $scope.checkDisabled();
        $scope.showSelect = true;
      } else if(view === 'party') {
        $scope.showParty = true;
      } else if(view === 'store') {
        $scope.showStore = true;
      } else if(view === 'equip') {
        $scope.showEquip = true;
      }
    }

    $scope.enemyForce = []

    $scope.returnEnemy = function(name, x, y, num){
      if(name == 'Guard') {
        return { "num": num, "name": "Guard", "init": 0, "level": 5, "pixelheight": 0, "hp": 40, "hptotal": 40, "stats": {"speed": 30, "magic": 6, "attack": 16, "defense": 100, "evasion": 0, "magic_defense": 140, "magic_evasion": 0, "hit_rate": 100}, "exp": 48, "gil": 48, "spacingx": x, "spacingy": y, "image": "assets/images/ff6enemies.png", "offsetx": 0, "offsety": 0, "width": 150, "height": 207, "zoom": 0 }
      }
    }


    // enemy Group 1?
    $scope.enemyForce.push($scope.returnEnemy("Guard", 10, 180, 1));
    $scope.enemyForce.push($scope.returnEnemy("Guard", 10, 350, 2));
    $scope.enemyForce.push($scope.returnEnemy("Guard", 210, 270, 3));

    //console.log($scope.enemyForce);

    $scope.getEquipment = function(name){
      var thisItem = [];
      angular.forEach($scope.equipment, function(item) {
        if(item.id === name){
          thisItem = item;
        }
      });
      return thisItem
    }

    $scope.selectedItem = "";

    $scope.setItem = function(item){
      $scope.selectedItem = item;
    }

    $scope.getTotal = function(char, ability){
      if(ability === 'power'){
        return ($scope.getEquipment(char.equipment.left).power || 0) + ($scope.getEquipment(char.equipment.right).power || 0) + ($scope.getEquipment(char.equipment.helm).power || 0) + ($scope.getEquipment(char.equipment.armor).power || 0) + ($scope.getEquipment(char.equipment.relic).power || 0)
      } else if(ability === 'hit_rate'){
        return ($scope.getEquipment(char.equipment.left).hit_rate || 0) + ($scope.getEquipment(char.equipment.right).hit_rate || 0) + ($scope.getEquipment(char.equipment.helm).hit_rate || 0) + ($scope.getEquipment(char.equipment.armor).hit_rate || 0) + ($scope.getEquipment(char.equipment.relic).hit_rate || 0)
      } else if(ability === 'defense'){
        return ($scope.getEquipment(char.equipment.left).defense || 0) + ($scope.getEquipment(char.equipment.right).defense || 0) + ($scope.getEquipment(char.equipment.helm).defense || 0) + ($scope.getEquipment(char.equipment.armor).defense || 0) + ($scope.getEquipment(char.equipment.relic).defense || 0)
      } else if(ability === 'evasion'){
        return ($scope.getEquipment(char.equipment.left).evasion || 0) + ($scope.getEquipment(char.equipment.right).evasion || 0) + ($scope.getEquipment(char.equipment.helm).evasion || 0) + ($scope.getEquipment(char.equipment.armor).evasion || 0) + ($scope.getEquipment(char.equipment.relic).evasion || 0)
      } else if(ability === 'magic_defense'){
        return ($scope.getEquipment(char.equipment.left).magic_defense || 0) + ($scope.getEquipment(char.equipment.right).magic_defense || 0) + ($scope.getEquipment(char.equipment.helm).magic_defense || 0) + ($scope.getEquipment(char.equipment.armor).magic_defense || 0) + ($scope.getEquipment(char.equipment.relic).magic_defense || 0)
      } else if(ability === 'magic_evasion'){
        return ($scope.getEquipment(char.equipment.left).magic_evasion || 0) + ($scope.getEquipment(char.equipment.right).magic_evasion || 0) + ($scope.getEquipment(char.equipment.helm).magic_evasion || 0) + ($scope.getEquipment(char.equipment.armor).magic_evasion || 0) + ($scope.getEquipment(char.equipment.relic).magic_evasion || 0)
      } 
    }

    $scope.getTotalComparison = function(char, ability, newItem){

      var oldItem = ""

      if(newItem.slot === 'left'){
        oldItem = $scope.getEquipment(char.equipment.left)
      } else if(newItem.slot === 'right'){
        oldItem = $scope.getEquipment(char.equipment.right)
      } else if(newItem.slot === 'helm'){
        oldItem = $scope.getEquipment(char.equipment.helm)
      } else if(newItem.slot === 'armor'){
        oldItem = $scope.getEquipment(char.equipment.armor)
      } else if(newItem.slot === 'relic'){
        oldItem = $scope.getEquipment(char.equipment.relic)
      }

      var oldItemStat
      var newItemStat

      if(ability === 'power'){
        oldItemStat = oldItem.power || 0;
        newItemStat = newItem.power || 0;
      } else if(ability === 'hit_rate'){
        oldItemStat = oldItem.hit_rate || 0;
        newItemStat = newItem.hit_rate || 0;
      } else if(ability === 'defense'){
        oldItemStat = oldItem.defense || 0;
        newItemStat = newItem.defense || 0;
      } else if(ability === 'evasion'){
        oldItemStat = oldItem.evasion || 0;
        newItemStat = newItem.evasion || 0;
      } else if(ability === 'magic_defense'){
        oldItemStat = oldItem.magic_defense || 0;
        newItemStat = newItem.magic_defense || 0;
      } else if(ability === 'magic_evasion'){
        oldItemStat = oldItem.magic_evasion || 0;
        newItemStat = newItem.magic_evasion || 0;
      } 

      var oldTotal = $scope.getTotal(char, ability)
      var newTotal = oldTotal - oldItemStat + newItemStat
      var diff = newTotal - oldTotal
      var diffdiv = ""

      if(diff === 0){
        diffdiv = "E"
      } else if (diff < 0){
        diffdiv = "<i class='fa fa-caret-down red' aria-hidden='true'></i> " + diff
      } else if (diff > 0){
        diffdiv = "<i class='fa fa-caret-up green' aria-hidden='true'></i> " + diff
      }

      //console.log(oldTotal, newTotal, diff, oldItem, newItem.slot)

      return diffdiv
    }

    $scope.filterFn = function(char, item) {
      var isProficient = false;

      angular.forEach(char.proficiencies, function(prof) {
        if(prof === item.type){
          isProficient += true
        }
      });

      return isProficient
    };

    $scope.setEquipmentType = function(itemType){
      $scope.equipmentType = itemType;
    }

    $scope.purchaseEquipment = function(item){
      $scope.uniqueID += 1;
      if(($scope.gil - item.cost) >= 0){
        item.uniqueID = $scope.uniqueID;
        $scope.equipmentList.push(item)
        $scope.gil -= item.cost;
      }
      console.log($scope.equipmentList)
    }

    $scope.owned = function(item) {
      var num = 0
      angular.forEach($scope.equipmentList, function(list) {
        if(item.name === list.name){
          num++;
        }
      });
      return num;
    }

    $scope.equipCharacter = function(item, itemIndex, char){
      console.log($scope.equipmentList)
      $scope.equipmentList.splice(itemIndex, 1);
      char.equipment[item.slot].push(item.id)
      console.log($scope.equipmentList);
      console.log(char);
    }

    $scope.selectCharacterToEquip = function(char){
      $scope.selectedCharacterToEquip = char
    }

    $scope.equipmentList = [];

    $scope.equipmentTypes = [ 'Claw', 'Glove', 'Dirk', 'Dagger', 'Sword', 'Katana', 'Mace', 'Hammer', 'Axe', 'Spear', 'Javelin', 'Scythe', 'Staff', 'Rod', 'Harp', 'Whip', 'Gun', 'Bow', 'Boomerang', 'Ninja', 'Shield', 'HeavyShield', 'Robe', 'LightArmor', 'HeavyArmor', 'Hat', 'HeavyHelm', 'Relic' ]
    $scope.equipment = [

      ///// WEAPONS ///////////

        ///// CLAWS ///////////
        ///// GLOVES ////////

        ///// DIRKS ///////////        
        
        ///// DAGGGER ///////////
        {'id': 'Dagger-1', 'uniqueID': 0, 'name': 'Dagger', 'hit_rate': 180, 'power': 26, 'type': 'Dagger', 'slot': 'right', 'cost': 150, 'desc': 'Light and well-balanced dagger.'},
        {'id': 'Dagger-2', 'uniqueID': 0, 'name': 'Mithril Knife', 'hit_rate': 180, 'power': 30, 'type': 'Dagger', 'slot': 'right', 'cost': 300, 'desc': 'Sturdy adventurer\'s knife forged from pure mythril.'},
        
        ///// SWORD ///////////
        {'id': 'Sword-1', 'uniqueID': 0, 'name': 'Mythril Sword', 'hit_rate': 150, 'power': 38, 'type': 'Sword', 'slot': 'right', 'cost': 450, 'desc': 'Simple sword forged from mythril.'},
        
        ///// KATANAS ///////////

        ///// MACES ///////////
        ///// HAMMERS /////////
        ///// AXES /////////

        ///// SPEARS ///////////
        ///// JAVELINS ////////
        ///// SCYTHES ///////

        ///// STAVES /////////
        ///// RODS ///////////
        ///// HARPS /////////  
        ///// WHIPS /////////
        
        ///// GUNS /////////
        ///// BOWS ///////////
        ////  BOOMERANGS ////////
        ///// THROWN ///////////


      ///// SHIELDS ////////////

        ///// SHIELDS ///////
        {'id': 'Shield-1', 'uniqueID': 0, 'name': 'Buckler', 'defense': 16, 'magic_defense': 10, 'evasion': 10, 'magic_evasion': 0, 'type': 'Shield', 'slot': 'left', 'cost': 200, 'desc': 'Light and simple shield.'},

        ///// HEAVY SHIELDS ///////
        {'id': 'HeavyShield-1', 'uniqueID': 0, 'name': 'Heavy Shield', 'defense': 22, 'magic_defense': 14, 'evasion': 10, 'magic_evasion': 0, 'type': 'HeavyShield', 'slot': 'left', 'cost': 400, 'desc': 'Large, sturdy shield made of steel.'},


      /////  ARMORS ///////////

        ///// HEAVY ARMOR ///////
        {'id': 'HeavyArmor-1', 'uniqueID': 0, 'name': 'Iron Armor', 'defense': 40, 'magic_defense': 27, 'evasion': 0, 'magic_evasion': 0, 'type': 'HeavyArmor', 'slot': 'armor', 'cost': 700, 'desc': 'Suit of heavy iron armor'},

        ///// LIGHT ARMOR ///////
        {'id': 'LightArmor-1', 'uniqueID': 0, 'name': 'Leather Armor', 'defense': 28, 'magic_defense': 19, 'evasion': 0, 'magic_evasion': 0, 'type': 'LightArmor', 'slot': 'armor', 'cost': 10, 'desc': 'Armor made of hardened leather.'},

        ///// ROBES ///////
        {'id': 'Robe-1', 'uniqueID': 0, 'name': 'Cotton Robe', 'defense': 32, 'magic_defense': 21, 'evasion': 0, 'magic_evasion': 0, 'type': 'Robe', 'slot': 'armor', 'cost': 200, 'desc': 'Mutilayered cotton robe.'},


      ///// HELMS /////////

        ////// HATS /////
        {'id': 'Hat-1', 'uniqueID': 0, 'name': 'Leather Cap', 'defense': 11, 'magic_defense': 7, 'evasion': 0, 'magic_evasion': 0, 'type': 'Hat', 'slot': 'helm', 'cost': 10, 'desc': 'Lightweight, stitched leather cap.'},

        ////// HEAVY HELMETS /////
        {'id': 'HeavyHelm-1', 'uniqueID': 0, 'name': 'Iron Helm', 'defense': 18, 'magic_defense': 12, 'evasion': 0, 'magic_evasion': 0, 'type': 'HeavyHelm', 'slot': 'helm', 'cost': 1000, 'desc': 'Heavy iron helm.'},


      ///// RELICS ////////////
        
        ///// STATUS EFFECTS ////
        {'id': 'StatusEffect-1', 'uniqueID': 0, 'name': 'Guard Ring', 'type': 'Relic', 'slot': 'relic', 'cost': 5000, 'desc': 'Ring enchanted with Protect. Casts Protect on the wearer.'}

    ]

    $scope.calcHP = function(lvl, stamina){
      var hp = stamina * lvl * (Math.sqrt(lvl) / 3) + stamina
      if (hp > 9999) {
        hp = 9999
      }
      return Math.ceil(hp)
    }

    $scope.calcMP = function(lvl, magic){
      var mp = magic * lvl * (Math.sqrt(lvl) / 30) + (magic / 2)
      if (mp > 999) {
        mp = 999
      }
      return Math.ceil(mp)
    }

    $scope.returnCharacter = function(name){

      ///////// FF4 /////////

      if(name == 'Cecil'){
        return { "name": "Cecil", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": $scope.calcHP(1, 36), "mp_total": $scope.calcMP(1, 30), "hp_total": $scope.calcHP(1, 36),
            "stats": {"strength": 40, "speed": 29, "stamina": 36, "magic": 30, "attack": 25, "defense": 51, "evasion": 7, "magic_defense": 27, "magic_evasion": 5},
            "status": {"defending": false}, "commands": ["Fight", "Defend", "Cover", "Magic"], 
            "equipment": {"left": "HeavyShield-1", "right": "Sword-1", "helm": "HeavyHelm-1", "armor": "HeavyArmor-1", "relic": "StatusEffect-1"},
            //"equipment": {"left": "", "right": "", "helm": "", "armor": "", "relic": ""},
            "proficiencies": ["Dagger","Sword","Shield","HeavyShield","HeavyArmor", "LightArmor","Robe","Hat","HeavyHelm","Relic"]

        }
      }

      if(name == 'Cid'){
        return { "name": "Cid", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 28), "hp": $scope.calcHP(1, 38), "mp_total": $scope.calcMP(1, 28), "hp_total": $scope.calcHP(1, 38),
            "stats": {"strength": 44, "speed": 25, "stamina": 38, "magic": 28, "attack": 27, "defense": 50, "evasion": 6, "magic_defense": 30, "magic_evasion": 6},
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Analyze", "Airship"],
            "equipment": {"left": "", "right": "", "helm": "", "armor": "", "relic": ""},
            "proficiencies": ["Dagger","Sword","Shield","HeavyShield","HeavyArmor", "LightArmor","Robe","Hat","HeavyHelm","Relic"]
        }
      }

      if(name == 'Edge'){
        return { "name": "Edge", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 32), "hp": $scope.calcHP(1, 30), "mp_total": $scope.calcMP(1, 32), "hp_total": $scope.calcHP(1, 30),
            "stats": {"strength": 35, "speed": 36, "stamina": 30, "magic": 32, "attack": 25, "defense": 46, "evasion": 15, "magic_defense": 25, "magic_evasion": 15},
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Throw", "Steal", "Ninjitsu"],
            "equipment": {"left": "", "right": "", "helm": "", "armor": "", "relic": ""},
            "proficiencies": ["Dagger","Sword","Shield","LightArmor","Robe","Hat","Relic"]
        }
      }

      if(name == 'Edward'){
        return { "name": "Edward", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 35), "hp": $scope.calcHP(1, 28), "mp_total": $scope.calcMP(1, 35), "hp_total": $scope.calcHP(1, 28), 
            "stats": {"strength": 30, "speed": 32, "stamina": 28, "magic": 35, "attack": 20, "defense": 42, "evasion": 10, "magic_defense": 25, "magic_evasion": 10},
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Sing", "Heal", "Hide"],
            "equipment": {"left": "", "right": "", "helm": "", "armor": "", "relic": ""},
            "proficiencies": ["Dagger","Sword","Shield","LightArmor","Robe","Hat","Relic"],
            "sing": [
              {'name': 'Sonata', 'element': 'song', 'class': 'white', 'power': -4521, 'hitrate': 120, 'runic': true, 'multiple': true, "castingTime": 5000, "animationTime": 3000, "cost": 1 }
            ]
        }
      }

      if(name == 'FuSoYa'){
        return { "name": "FuSoYa", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 39), "hp": $scope.calcHP(1, 22), "mp_total": $scope.calcMP(1, 39), "hp_total": $scope.calcHP(1, 22),
            "stats": {"strength": 28, "speed": 25, "stamina": 22, "magic": 39, "attack": 20, "defense": 40, "evasion": 5, "magic_defense": 33, "magic_evasion": 10},
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Bless"],
            "equipment": {"left": "", "right": "", "helm": "", "armor": "", "relic": ""},
            "proficiencies": ["Dagger","Shield","Robe","Hat","Relic"],
            "magic": [
                {'name': 'Fire', 'element': 'Fire', 'class': 'black', 'power': 40, 'hitrate': 120, 'runic': true, 'multiple': true, "castingTime": 3000, "animationTime": 1000, "cost": 1 }, 
                {'name': 'Fira', 'element': 'Fire', 'class': 'black', 'power': 60, 'hitrate': 150, 'runic': true, 'multiple': true, "castingTime": 5000, "animationTime": 3000, "cost": 2 }
            ]
        }
      }

      if(name == 'Rosa'){
        return { "name": "Rosa", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": {"left": "Dagger-1", "right": "", "helm": "", "armor": "HeavyArmor-1", "relic": "StatusEffect-1"},
            "magic": [
                {'name': 'Cure', 'element': 'holy', 'class': 'white', 'power': -21, 'hitrate': 255, 'runic': true, 'multiple': false, "castingTime": 1000, "animationTime": 3000, "cost": 1 }, 
                {'name': 'Cura', 'element': 'holy', 'class': 'white', 'power': -60, 'hitrate': 0, 'runic': true, 'multiple': false, "castingTime": 5000, "animationTime": 3000, "cost": 2 }
            ]
        }
      }

      if(name == 'Kain'){
        return { "name": "Kain", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] }
      }

      if(name == 'Rydia'){
        return { "name": "Rydia", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Golbez'){
        return { "name": "Golbez", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'PalomPorom'){
        return { "name": "PalomPorom", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 60, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Tellah'){
        return { "name": "Tellah", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Yang'){
        return { "name": "Yang", "game": "Final Fantasy 4", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      ///////// FF6 /////////

      if(name == 'Banon'){
        return { "name": "Banon", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Pray"],
            "equipment": ["", "", "", "", ""] }
      }

      if(name == 'Celes'){
        return { "name": "Celes", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Cyan'){
        return { "name": "Cyan", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Edgar'){
        return { "name": "Edgar", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Gau'){
        return { "name": "Gau", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'GoGo'){
        return { "name": "GoGo", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Kefka'){
        return { "name": "Kefka", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Leo'){
        return { "name": "Leo", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Locke'){
        return { "name": "Locke", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Mog'){
        return { "name": "Mog", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Relm'){
        return { "name": "Relm", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Sabin'){
        return { "name": "Sabin", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Setzer'){
        return { "name": "Setzer", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Shadow'){
        return { "name": "Shadow", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Strago'){
        return { "name": "Strago", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Terra'){
        return { "name": "Terra", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Umaro'){
        return { "name": "Umaro", "game": "Final Fantasy 6", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      //////  Chrono Trigger //////////

      if(name == 'Crono'){
        return { "name": "Crono", "game": "Chrono Trigger", "init": 0, "level": 1, "pixelheight": 40, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Ayla'){
        return { "name": "Ayla", "game": "Chrono Trigger", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Frog'){
        return { "name": "Frog", "game": "Chrono Trigger", "init": 0, "level": 1, "pixelheight": 20, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Robo'){
        return { "name": "Robo", "game": "Chrono Trigger", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Magus'){
        return { "name": "Magus", "game": "Chrono Trigger", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Lucca'){
        return { "name": "Lucca", "game": "Chrono Trigger", "init": 0, "level": 1, "pixelheight": 40, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Marle'){
        return { "name": "Marle", "game": "Chrono Trigger", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      ////////////// Secret of Mana //////////

      if(name == 'Randi'){
        return { "name": "Randi", "game": "Secret of Mana", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Popoi'){
        return { "name": "Popoi", "game": "Secret of Mana", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Primm'){
        return { "name": "Primm", "game": "Secret of Mana", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      //////////// Breath of Fire 2 /////////////

      if(name == 'Bleu'){
        return { "name": "Bleu", "game": "Breath of Fire 2", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Bow'){
        return { "name": "Bow", "game": "Breath of Fire 2", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Jean'){
        return { "name": "Jean", "game": "Breath of Fire 2", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Katt'){
        return { "name": "Katt", "game": "Breath of Fire 2", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Nina'){
        return { "name": "Nina", "game": "Breath of Fire 2", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Rand'){
        return { "name": "Rand", "game": "Breath of Fire 2", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Ryu'){
        return { "name": "Ryu", "game": "Breath of Fire 2", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Spar'){
        return { "name": "Spar", "game": "Breath of Fire 2", "init": 0, "level": 1, "pixelheight": 0, "position": "back", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
      }

      if(name == 'Sten'){
        return { "name": "Sten", "game": "Breath of Fire 2", "init": 0, "level": 1, "pixelheight": 0, "position": "front", "mp": $scope.calcMP(1, 30), "hp": 100,
            "status": [{"defending": false}], "commands": ["Fight", "Defend", "Magic", "Runic"],
            "equipment": ["", "", "", "", ""] 
        }
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
          //console.log($scope.returnCharacter(name))
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
            if ($scope.team[rando].hp <= 0) {
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
        $scope.enemyForce[num].init += ((96 * ($scope.enemyForce[num].stats.speed + 20)) / 16);
      } else {
        pickTeamTarget(enemy, function() {
            
            var hit = toHitEnemy(enemy, $scope.currentAITarget, "fight");
            var dmg = toDmgEnemy(enemy, $scope.currentAITarget);

            $scope.shownActionInit("Attack");

            if(hit){
              console.log(enemy.name + " hit for " + dmg)
              $scope.changeHP($scope.currentAITarget, dmg);
            } else {
              console.log(enemy.name + " missed!")
            }
            
            //$scope.currentAITarget.hp -= 100;  ///  Put the code you want to actually work here....
            $scope.enemyForce[num].init = 0;
        })
      }
    }

    function updateInit(char, num){
      var classStr = "." + $scope.team[num].name + "_status";
      if($scope.team[num].init < 65536){
        $scope.team[num].init += ((96 * ($scope.team[num].stats.speed + 20)) / 16)
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

    function toHit(status, char, target, ability, abilityType){

      var blockValue = 0

      if(abilityType == "Magic"){
        blockValue = 255 - (target.stats.magic_evasion * 2) + 1
      } else {
        blockValue = 255 - (target.stats.evasion * 2) + 1
      }
      
      var weaponToHit = $scope.getEquipment(char.equipment.left);

      if((weaponToHit.hit_rate * blockValue / 256) > Math.floor(Math.random() * 99 + 1)){
        return true
      } else {
        return false
      }

    }


    function toHitEnemy(enemy, target, abilityType){

      var blockValue = 0

      if(abilityType == "Magic"){
        blockValue = 255 - (target.stats.magic_evasion * 2) + 1
      } else {
        blockValue = 255 - (target.stats.evasion * 2) + 1
      }
      
      if((enemy.stats.hit_rate * blockValue / 256) > Math.floor(Math.random() * 99 + 1)){
        return true
      } else {
        return false
      }

    }

    
    function toDmg(status, char, target, ability){
    
      var strength2 = char.stats.strength * 2
      var attack = char.stats.attack + $scope.getEquipment(char.equipment.left).power
      var battlePower
      var dmg

      if(strength2 > 255){
        strength2 = 255;
      }

      battlePower = strength2 + attack;

      dmg = battlePower + ((char.level * char.level * attack) / 256) * 3 / 2
      dmg = (dmg * (255 - target.stats.defense) / 256) + 1

      if(char.position === "back"){
        dmg = dmg / 2
      }
      return Math.floor(dmg)
    }


    function toDmgEnemy(enemy, target){

      //  Physical Defense Only..  will need Magic Defense Eventually.
      var targetDef = ($scope.getEquipment(target.equipment.left).defense || 0) + ($scope.getEquipment(target.equipment.right).defense || 0) + ($scope.getEquipment(target.equipment.helm).defense || 0) + ($scope.getEquipment(target.equipment.armor).defense || 0) + target.stats.defense
      var dmg = enemy.level * enemy.level * (enemy.stats.attack * 4 + Math.floor(Math.random() * 63 + 56)) / 256

      dmg = (dmg * (255 - targetDef) / 256) + 1

      if(target.position === "back"){
        dmg = dmg / 2
      }
      return Math.floor(dmg)
    }



    function addToQueue(action, target, timer, char, ability){

      console.log(char.name + " prepares " + ability.name + " against " + target.name)
      /// Add Timer, and then Add Action Results
      showAnim(char, 'casting' + char.name)   // Chanting Spell / Getting Ready to do an Action

      setTimeout(doAction, timer);

      function doAction(){

        if(char.hp > 0){

          console.log(char.name + " casts " + ability.name + " against " + target.name)

          $scope.shownActionInit(ability.name);
          

          if(action === 'Fight'){
            // Actual formula should go here
            var hit = toHit(status, char, target, ability, "");
            var dmg = toDmg(status, char, target, ability);

            if(hit){
              console.log("You hit for " + dmg)
              $scope.changeHP(target, dmg);
            } else {
              console.log("You missed!")
            }
          }


          if(action === 'Magic'){

            //  Show Casting Animation and Casting Sprite for Character
            $('#' + char.name).append('<div class="magicCast"></div>')
            showAnim(char, 'cast' + char.name)  //  Casting Spell // Initiating Action Animations
            
            //Remove Casting Animation when it's done
            setTimeout(function(){
              $('.magicCast').remove();
              
              //When that's done, then have the spell go off...
              $('#' + target.name + (target.num-1)).append('<div class="spell' + ability.name + '"></div>')

              // Remove the spell animation once it's done.
              setTimeout(function(){
                $('.spell' + ability.name).remove();

                // when it's done THEN do damage to the target
                $scope.changeHP(target, ability.power);

              }, ability.animationTime)

            }, 1000)

          }

          if(action === 'Sing'){
            $scope.changeHP(target, ability.power);
          }
          
        }
        
      }

    }

    $scope.shownActionInit = function(name){
      $scope.shownAction = name;
      $scope.showAction = true;
      setTimeout(function(){
        $scope.shownAction = '';
        $scope.showAction = false;
      }, 2500)
    }

    $scope.changeHP = function(target, dmg){
      var targetID
      target.hp -= dmg;
      if(target.hp < 0 ){
        targetID = "#" + target.name + (target.num - 1);
        $(targetID).addClass('deathBlow')
      }
    }

    function showAnim(target, anim){
      var targetID;
      targetID = "#" + target.name;
      $(targetID).removeClass();
      $(targetID).addClass('character');
      $(targetID).addClass(target.name);
      $(targetID).addClass(anim);
    }

  }
})();
