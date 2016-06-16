(function() {
  'use strict';

  angular
    .module('16bitHeroes')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, toastr, $scope, $interval) {
    var vm = this;

    //var magusReady = $interval(magusAnim, 1000);
    var globalTimer = $interval(tick, 1000)

    var anim_timer = 1;

    $scope.paused = false;
    $scope.team = [];
    $scope.commands = [];

    $scope.char1 = { "name": "Magus", "init": 0, "initmod": 1.25, "position": "back", "hp": 68, "hptotal": 180, "commands": ["Fight", "Magic"]  }
    $scope.char2 = { "name": "Mog", "init": 0, "initmod": 1, "position": "front", "hp": 42, "hptotal": 220, "commands": ["Fight", "Dance"]  }
    $scope.char3 = { "name": "Shadow", "init": 0, "initmod": 1.50, "position": "front", "hp": 66, "hptotal": 100, "commands": ["Fight", "Throw"] }
    $scope.char4 = { "name": "Edgar", "init": 0, "initmod": .85, "position": "front", "hp": 124, "hptotal": 180, "commands": ["Fight", "Tools"]  }
    $scope.char5 = { "name": "Setzer", "init": 0, "initmod": 1.35, "position": "back", "hp": 100, "hptotal": 100, "commands": ["Fight", "Slot"]  }

    $scope.team.push($scope.char1); 
    $scope.team.push($scope.char2); 
    $scope.team.push($scope.char3); 
    $scope.team.push($scope.char4); 
    $scope.team.push($scope.char5);
    
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

    function tick(){
      if(!$scope.paused) {
        for (var c = 0; c < $scope.team.length; c++){
          updateInit($scope.team[c], c);
          $scope.$apply;
        }
      }
    }

    function updateInit(char, num){
      
        var classStr = '.char' + (num + 1);
        var init = 10;

        if($scope.team[num].init < 100){
          $scope.team[num].init += (init * $scope.team[num].initmod)
          $(classStr + ' .init').css('background-size', $scope.team[num].init + '% .7px' );
          $(classStr).removeClass('selected');
        } else {
          $scope.paused = true;
          $(classStr + ' .init').css('background', 'url(../assets/images/init-full.png)' );
          $(classStr + ' .init').css('background-size', '100% .7px' );         
          $(classStr).addClass('selected');
          inputCommand(char, num);
        }
    }   

    function inputCommand(char, num){
      $scope.commands = char.commands;
      $scope.currentChar = char;
      $scope.currentNum = num;
      console.log($scope.currentChar.name)
    }

    $scope.runCommand = function(command){
      console.log(command);
      $scope.currentChar.init = 0; 
      $('.char' + ($scope.currentNum + 1) + ' .init').css('background', 'url(../assets/images/init.png)' );
      $('.char' + ($scope.currentNum + 1) + ' .init').css('background-size', '0% .7px' );
      $scope.paused = false;
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
