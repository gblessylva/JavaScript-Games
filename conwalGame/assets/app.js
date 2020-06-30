function $(selector, container) {
  return (container || document).querySelector(selector)
}

(function(){
  var _= self.Life = function(seed){
    this.seed= seed;
    this.height= seed.length;
    this.width= seed[0].length;

    this.prevBoard = [];
    this.board= cloneArray(seed);
  }

  _.prototype={

    next: function(){
      this.prevBoard = cloneArray(this.board);

      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var neighbours = this.aliveNeighbours(this.prevBoard, x, y)
          var alive = !!this.board[y][x]
         
          if(alive){
            if(neighbours < 2 || neighbours > 3){
              this.board[y][x]=0
            }
          }else{
            if (neighbours == 3) {
              this.board[y][x] = 1;
            }
          }
          
        }
        
      }
    },

    aliveNeighbours:  function(array, x, y){
      var prevRow = array[y-1] || [];
      var nextRow = array[y+1] || [];
      
      return[
        prevRow[x-1], prevRow[x], prevRow[x+1],
        array[y][x-1], array[y][x+1],
        nextRow[x-1], nextRow[x], nextRow[x+1],
      ].reduce( function (prev, cur) {
        return prev + +!!cur;
      }, 0)
    },
    

    toString: function(){
      return this.board.map(function (row){return row.join(' ')}).join('\n')
    }
    
  }
  function cloneArray(array){
    return  array.slice().map(function(row){return row.slice()})
    }
})();

// var game = new Life([
//     [0, 0, 2, 3, 0],
//     [2, 0, 2, 1, 0],
//     [0, 0, 2, 3, 0],
//     [0, 2, 0, 0, 0]
//   ])

//   console.log(game + '' )
  
//   game.next()

//   console.log(game + '')
 
( function(){
  
  var _= self.gameView = function(table, size){
    this.grid= table;
    this.size = size;
    this.started = false;
    this.autoPlay = false;

    this.createGrid();
  };

  _.prototype= {
    createGrid :  function(){
      var me = this;
      var fragment= document.createDocumentFragment()
      this.grid.innerHTML = ''
      this.checkboxes = []

      for (let y = 0; y < this.size; y++) {
        var row = document.createElement('tr')
        this.checkboxes[y] =[]
        for (let x = 0; x < this.size; x++) {
         var cell = document.createElement('td')
         var checkbox = document.createElement('input')
         checkbox.type='checkbox'
         this.checkboxes[y][x] = checkbox
         checkbox.coords = [y, x]

         cell.appendChild(checkbox)
         row.appendChild(cell) 
          
        }
        fragment.appendChild(row)
        this.grid.addEventListener('change', function(event){
          if(event.target.nodeName.toLowerCase() == 'input'){
            me.started = false
          }
        })
      }

      this.grid.addEventListener('keyup', function(evt){
        var checkbox = evt.target
       // console.log(checkbox)
        if(checkbox.nodeName.toLowerCase() == 'input'){
          var coords = checkbox.coords
          var y = coords[0]
          var x = coords[1]
        // console.log(evt.keyCode)

          switch (evt.keyCode) {
            case 38:  //top
            if(y>0){
              me.checkboxes[y-1][x].focus();
            }
             
            break;
            case 37: // Left
                 
            if(x>0){
              me.checkboxes[y][x - 1].focus()
              break;
            }
            case 39:  // Right
            if(x < me.size -1){
              me.checkboxes[y][x + 1].focus()
              break
            }
              
            case 40: //bottom
            if(y < me.size -1){
              me.checkboxes[y+1][x].focus()
              break
            }
              
            
          }
        }
      })
      
      this.grid.appendChild(fragment)
    },
    get boardArray(){
      return this.checkboxes.map(function(row){
        return row.map(function(checkbox){
          return +checkbox.checked
        })
      })
    },

    play: function(){

      this.game = new Life(this.boardArray)
      this.started = true;
    },
    next: function(){
      me = this;

      if(!this.started || this.game){
        this.play()
      }
      this.game.next()

      var board = this.game.board;

      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          this.checkboxes[y][x].checked = !!board[y][x] 
        }
      }

      if(this.autoPlay){
          this.timer = setTimeout(function ()  {
            me.next()
          }, 1000);
      }

    }
  }
  
})();

var gameShow = new gameView(document.getElementById('grid'), 12);

(function () {
  var buttons = {
    next: $('button.next')
  }
  
  buttons.next.addEventListener('click', function(){
    gameShow.next()
  })
  
  $('#autoplay').addEventListener('change', function(){
   buttons.next.disabled = this.checked;
   if(this.checked){
       gameShow.autoPlay = this.checked;
       gameShow.next()
   }
   else{
     clearTimeout(gameShow.timer)
   }
   
  })
})();


