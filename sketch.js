
var topSkyColor, bottomSkyColor, newSkyColor;

var leftBorder, rightBorder;

var gameChar_x, gameChar_y;

var floorPos_y;

var isLeft, isRight, isPlummeting, isFalling, isGameOver, youWin;

var collectables;
var canyons;

var tree;
var trees_x;

var mountains;
var clouds; 

var cameraPosX;

var game_score;
var flagpole;
var lives;

var platforms;
var enemies;

var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/retro-jump-1-236684.mp3');
    jumpSound.setVolume(0.1);
    coinSound = loadSound('assets/classic-game-action-positive-3-224405.mp3');
    coinSound.setVolume(0.1);
    loseSound = loadSound('assets/classic-game-action-negative-3-224421.mp3');
    loseSound.setVolume(0.1);
    gameOverSound = loadSound('assets/8-bit-video-game-lose-sound-version-1-145828.mp3');
    gameOverSound.setVolume(0.1);
    winSound = loadSound('assets/win-sfx-38507.mp3');
    winSound.setVolume(0.1);
}

function setup()
{
    createCanvas(1024,575)
    
    startGame();
    
}

function draw()
{  
    cameraPosX = gameChar_x - width / 2; 
    
    if (isGameOver || youWin) {
        displayGameOverScreen();
        return;
    }
    
    //Scene --------------------------------------------------
 
     // sky gradient
    topSkyColor = color(30,144,255);
    bottomSkyColor = color(0,255,255);   
    for(var i = 0; i <  height; i++)
        {
            n = map(i, 0, height, 0, 1);
            
            newSkyColor = lerpColor(topSkyColor, bottomSkyColor, n);
            stroke(newSkyColor);
            line(0,i,width,i);
        }
   
    // sun
    fill(255,165,0);
    strokeWeight(2);
    stroke(305,255,0);
    ellipse(775,75,100,100);
    line(775,135,775,175); 
    line(775-50-10,75,50+725-50-10-50,75); 
    line(775-50, 115, 620+50,150);
    line(775-50+100, 115, 825+50,150);
    line(775-50+100, 40, 825+50,15);
    line(775-50, 40, 630+50,15);
    line(775,15,725+50,5)
    line(785+50,75,820+50+20,75); 
    noStroke();
    
    drawIndicators();
    
push();

    translate(-cameraPosX, 0);
    
    //ground
    noStroke();
    fill(0, 154, 23);
    rect(leftBorder, floorPos_y, rightBorder - leftBorder, height - floorPos_y);   
    
    //mountain
    for(var i = 0; i < mountains.length; i++)
        {
            renderMountains(mountains[i]);
        }
    
    //tree
    for(var i = 0; i < trees_x.length; i++)
        {
            fill(150,75,0);
            rect(trees_x[i],floorPos_y,50,-tree.TrunkHeight);
            fill(102,204,0);
            triangle(
                    trees_x[i]-50, 415-tree.TrunkHeight,
                    trees_x[i]+25, 315-tree.TrunkHeight,
                    trees_x[i]+100,415-tree.TrunkHeight);
            triangle(
                    trees_x[i]-50, 440-tree.TrunkHeight,
                    trees_x[i]+25, 340-tree.TrunkHeight,
                    trees_x[i]+100, 440-tree.TrunkHeight);
            triangle(
                    trees_x[i]-50, 475-tree.TrunkHeight,
                    trees_x[i]+25, 375-tree.TrunkHeight,
                    trees_x[i]+100, 455-tree.TrunkHeight);
        }

    //clouds
    for(var i = 0; i < clouds.length; i++)
        {
          renderClouds(clouds[i]);  
        }
    
    //canyon
    for(var i = 0; i < canyons.length; i++)
        {
            renderCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }
    
    //check border
    checkBorder(rightBorder);
  
    //collectable 
    for(var i = 0; i < collectables.length; i++)
        {
            renderCollectables(collectables[i]);
            checkCollectables(collectables[i]);
        }
    
    //flagpole
    renderFlagpole();
    
    //platform
    for(var i = 0; i < platforms.length; i++)
        {
            platforms[i].draw();
        }
    
    renderCharacter(); 
    
    // enemies
    for(var i = 0; i < enemies.length; i++)
        {
            enemies[i].draw(); 
            
            var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);
             
            if(isContact)
                {
                    isPlummeting = true;
                }
        }
 
    pop();
}

function keyPressed()
{
    
    if(keyCode == 37 && !isPlummeting)
        {
            isLeft = true;
        }
    else if(keyCode == 39 && !isPlummeting)
        {
            isRight = true;
        }
     else if(keyCode == 32 && (isGameOver || youWin))
        {
            startGame();
        }
    else if(keyCode == 32 && !isFalling && !isPlummeting)
        {
            isFalling = true;
            gameChar_y -= 100;
            jumpSound.play();
        }

}

function keyReleased()
{
   if(keyCode == 37)
        {
            isLeft = false;
        }   
    else if(keyCode == 39)
        {
            isRight = false;
        } 
}

function renderClouds(_clouds)
{
    fill(255);
    noStroke();   
    
    ellipse(
        _clouds.x_pos - _clouds.offsetLeft, 
        _clouds.y_pos, 
        _clouds.smallWidth, 
        _clouds.smallHeight);
    
    ellipse(
        _clouds.x_pos, 
        _clouds.y_pos, 
        _clouds.width, 
        _clouds.height);
    
    ellipse(
        _clouds.x_pos + _clouds.offsetRight, 
        _clouds.y_pos, 
        _clouds.smallWidth, 
        _clouds.smallHeight);
}

function renderMountains(_mountains)
{
    fill(0,0,128,100);
    triangle(
            _mountains.x_pos, _mountains.y_pos, 
            _mountains.x_pos + 200, _mountains.y_pos - 300, 
            _mountains.x_pos + 400, _mountains.y_pos);
    fill(255,255,255); 
    triangle(
            _mountains.x_pos + 150, _mountains.y_pos - 225, 
            _mountains.x_pos + 200, _mountains.y_pos - 300, 
            _mountains.x_pos + 250, _mountains.y_pos - 225);  
}

function renderCollectables(_coin)
{
    if(_coin.isFound == false)
        {
            fill(255,255,0);
            stroke(0);
            strokeWeight(1);
            ellipse(_coin.x_pos,
            _coin.y_pos,
            50*_coin.scale,
            50*_coin.scale)
            fill(200,200,0);
            ellipse(_coin.x_pos,
            _coin.y_pos,
            40*_coin.scale,
            40*_coin.scale);
            fill(255,255,0);
            ellipse(_coin.x_pos,
            _coin.y_pos,
            20*_coin.scale,
            20*_coin.scale);   
        }
    
    if(_coin.isFound == true)
        {
            _coin.y_pos -= 60;
        }
}

function checkCollectables(_coin)
{
    if(dist(gameChar_x, gameChar_y-40, _coin.x_pos, _coin.y_pos) < 30 )
    {
        _coin.isFound = true;
        coinSound.play();
        game_score +=1;
    }
}

function renderCanyon(_canyon)
{
    noStroke();
    fill(160,82,45);
    rect(_canyon.x_pos,_canyon.y_pos,_canyon.width,_canyon.height);

    stroke(100, 50, 10,75);
    strokeWeight(2);

    line(_canyon.x_pos + 25, 453, _canyon.x_pos + 30, 460); 
    line(_canyon.x_pos + 10, 500, _canyon.x_pos + 30, 570); 
    line(_canyon.x_pos + 60, 458, _canyon.x_pos + 70, 480); 
    line(_canyon.x_pos + 15, 470, _canyon.x_pos + 55, 490);
    line(_canyon.x_pos + 50, 510, _canyon.x_pos + 65, 570);
}

function checkCanyon(_canyon)
{
  if(gameChar_x > _canyon.x_pos && gameChar_x < (_canyon.x_pos + _canyon.width) && gameChar_y == floorPos_y)
        {
           isPlummeting = true;
        }         
            
}  

function checkBorder(_rightBorder)
{
  if(gameChar_x > _rightBorder && gameChar_y == floorPos_y)
    {
       isPlummeting = true;
    }  
}

function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(100);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y-250);
    
    noStroke();
    fill(250,100,250);
    
    rect(flagpole.x_pos, flagpole.y_pos-75, 50,50);
    var d = abs(gameChar_x - flagpole.x_pos);
    
    if(d < 30 && game_score == 4)
        {
            if(flagpole.y_pos > floorPos_y-180)
                {
                    flagpole.y_pos -= 2;
                    isLeft = false;
                    isRight = false;
                }
            else
            {
                youWin = true;
                winSound.play();
             }
        }
    
}    
    
function drawIndicators()
{

    var lives_startX = 170;  
    var lives_startY = 120; 
    
    fill(150,150,150,50);
    noStroke();
    rect(80,95,170,70);
    
    // lives ----  
    
    fill(255);
    noStroke();
    textSize(20);
    text("Lives: ",90,120);

    for (var i = 0; i < lives; i++)
    {
        var offset = i * 30; 
        var live_scale = 0.3;

        // hands
        stroke(200, 150, 150);
        strokeWeight(5 * live_scale);
        line(lives_startX + offset - 22 * live_scale, lives_startY - 30 * live_scale, lives_startX + offset + 22 * live_scale, lives_startY - 30 * live_scale);
        noStroke();

        // body
        fill(0, 112, 200);
        rect(lives_startX + offset - 13 * live_scale, lives_startY - 40 * live_scale, 26 * live_scale, 35 * live_scale);

        // head
        fill(200, 150, 150);
        ellipse(lives_startX + offset, lives_startY - 50 * live_scale, 35 * live_scale);

        // legs
        fill(0);
        rect(lives_startX + offset - 15 * live_scale, lives_startY - 8 * live_scale, 10 * live_scale, 10 * live_scale);
        rect(lives_startX + offset + 5 * live_scale, lives_startY - 8 * live_scale, 10 * live_scale, 10 * live_scale);
    }
    
    // Scores ----
    
    fill(255);
    noStroke();
    textSize(20);
    text("Scores: ",90,150);
     
    for(var i = 0; i < 4; i++)
    {

        if (i <= game_score - 1)
            {
                fill(255, 255, 0); 
            }
        else
            {
               fill(200, 200, 200); 
            }   
        stroke(150);
        strokeWeight(1);
        ellipse(lives_startX + i*20, lives_startY + 23, 15, 15);
    }
    
    
}

function displayGameOverScreen()
{
    if(isGameOver)
    {
        fill(0,0,0);
        noStroke();
        rect(0, 0, width, height);

        textSize(84);
        fill('white');
        textAlign(CENTER, CENTER);
        text('Game Over', (width / 2), height / 2);
        textSize(35);
        text('Press Space to continue', (width / 2), 75 + height / 2);
    }

    if(youWin)
    {
        fill(0,0,0);
        noStroke();
        rect(0, 0, width, height);

        textSize(84);
        fill('white');
        textAlign(CENTER, CENTER);
        text('Level complete!', width / 2, height / 2);
        textSize(35);
        text('Press Space to continue', width / 2, 75 + height / 2);
    } 
}

function renderCharacter()
{
    //Character Render ---------------------------------------------
    
    if(isLeft && isFalling)             // jumping left code
        {
            //body
            fill(255,0,0);
            rect(gameChar_x - 7, gameChar_y - 40, 13,25);

            //hands
            stroke(200,150,150);
            strokeWeight(5);
            line(gameChar_x, gameChar_y - 30, 
            gameChar_x-10, gameChar_y - 35);
            noStroke();

            //head
            fill(200,150,150);
            ellipse(gameChar_x - 4, gameChar_y - 50,35,25);

            //legs
            fill(0);
            rect(gameChar_x - 11, gameChar_y - 20, 10,10);
            
        }
    
    else if(isLeft)                     // walking left
        {
            //body
            fill(255,0,0);
            rect(gameChar_x - 7, gameChar_y - 40, 13,35);

            //hands
            stroke(200,150,150);
            strokeWeight(5);
            line(gameChar_x, gameChar_y - 30, 
                gameChar_x-10, gameChar_y - 20);
            noStroke();

            //head
            fill(200,150,150);
            ellipse(gameChar_x-4, gameChar_y - 50,35,25);

            //legs
            fill(0);
            rect(gameChar_x - 6, gameChar_y - 10, 10,10);
            
        }
    
    else if(isRight && isFalling)       // jumping right
        {
            //body
            fill(255,0,0);
            rect(gameChar_x - 7, gameChar_y - 40, 13,25);

            //hands
            stroke(200,150,150);
            strokeWeight(5);
            line(gameChar_x, gameChar_y - 30, 
            gameChar_x+10, gameChar_y - 35);
            noStroke();

            //head
            fill(200,150,150);
            ellipse(gameChar_x+4, gameChar_y - 50,35,25);

            //legs
            fill(0);
            rect(gameChar_x + 3, gameChar_y - 20, 10,10);
            
        }
    
    else if(isRight)                    // walking right
        {
            //body
            fill(255,0,0);
            rect(gameChar_x - 7, gameChar_y - 40, 13,35);

            //hands
            stroke(200,150,150);
            strokeWeight(5);
            line(gameChar_x, gameChar_y - 30, 
            gameChar_x+10, gameChar_y - 20);
            noStroke();

            //head
            fill(200,150,150);
            ellipse(gameChar_x+4, gameChar_y - 50,35,25);

            //legs
            fill(0);
            rect(gameChar_x - 6, gameChar_y - 10, 10,10);
            
        }
    
    else if(isFalling || isPlummeting)  //jumping facing forward
        {
            
    //hands
	stroke(200,150,150);
	strokeWeight(5);
	line(gameChar_x - 20, gameChar_y - 40, 
         gameChar_x - 5,gameChar_y - 30);
	line(gameChar_x + 20, gameChar_y - 40, 
		gameChar_x + 5,gameChar_y - 30);
	noStroke();

	//body
	fill(255,0,0);
	rect(gameChar_x - 13, gameChar_y - 40, 26,25);

	//head
	fill(200,150,150);
	ellipse(gameChar_x, gameChar_y - 50,35);

	//legs
	fill(0);
	rect(gameChar_x - 15, gameChar_y - 20, 10,10)
	rect(gameChar_x + 5, gameChar_y - 20, 10,10)
            
        }
    
    else                                //standing front facing
        {
            //hands
            stroke(200,150,150);
            strokeWeight(5);
            line(gameChar_x - 22, gameChar_y - 30,  
            gameChar_x - 22+44,gameChar_y - 30);
            noStroke();

            //body
            fill(255,0,0);
            rect(gameChar_x - 13, gameChar_y - 40, 26,35);

            //head
            fill(200,150,150);
            ellipse(gameChar_x, gameChar_y - 50,35);

            //legs
            fill(0);
            rect(gameChar_x - 15, gameChar_y - 8, 10,10)
            rect(gameChar_x + 5, gameChar_y - 8, 10,10)
        }
    
    
//Character Moove ---------------------------------------------- 
    
    if(isLeft && gameChar_x > leftBorder)
        {
            gameChar_x -= 3;
        }
    
    if(isRight)
        {
            gameChar_x += 3;
        }
    
    if(isPlummeting)
        {
            gameChar_y += 5
            isLeft = false;
            isRight = false;
 
            
            if(gameChar_y > height + 200)
                {
                    if(lives > 1)
                        {
                            loseSound.play();
                            lives -= 1;
                            resetCharacter();
                        }
                    else
                        {
                            lives = 0;
                            isGameOver = true;
                            resetCharacter();
                            gameOverSound.play();
                        }
                }
            return;  
        } 
             
    if(gameChar_y < floorPos_y)
        {           
            var isContact = false;
            
            for(var i = 0; i < platforms.length; i++)
                {
                    if(platforms[i].checkContact(gameChar_x, gameChar_y) == true)
                        {
                           isContact = true; 
                            break;
                        }
                }
            
            if(isContact == false)
                {
                    gameChar_y += 2;
                    isFalling = true;
                }
            else if(isContact == true)
                {
                    isFalling = false;
                }
            
    if(gameChar_y >= floorPos_y)
                {
                    gameChar_y = floorPos_y;
                    isFalling = false; 
                }
        }
}

function resetCharacter() 
{
    gameChar_x = 120;
    gameChar_y = floorPos_y;
    isPlummeting = false;
    isFalling = false;
}

function startGame()
{
    isLeft = false;
    isRight = false;
    isFalling = false; 
    isGameOver = false;
    youWin = false; 
    
    floorPos_y = 450;
    leftBorder = -200;
    rightBorder = 1600;
    
    lives = 3;
    game_score = 0;
    resetCharacter();
    
    tree = {TrunkHeight: 100};
    trees_x = [300,500,900,1000,1150];
    
    flagpole = {x_pos:2125, y_pos: floorPos_y, isReached: false}
    
    collectables = [
        {x_pos: -150,y_pos: 400, scale: 0.6, isFound: false},
        {x_pos: 400,y_pos: 375, scale: 0.6, isFound: false},
        {x_pos: 1800,y_pos: floorPos_y - 200, scale: 0.6, isFound: false},
        {x_pos: 700 ,y_pos: 250, scale: 0.6, isFound: false}
    ]; 
    
    clouds = [
            {x_pos: -200,y_pos: 50,width: 100,height: 75,offsetLeft: 50,offsetRight: 50,smallWidth: 75,smallHeight: 50},
            {x_pos: 125,y_pos: 50,width: 100,height: 75,offsetLeft: 50,offsetRight: 50,smallWidth: 75,smallHeight: 50},
            {x_pos: 350,y_pos: 40,width: 100,height: 75,offsetLeft: 50,offsetRight: 50,smallWidth: 75,smallHeight: 50},
            {x_pos: 550,y_pos: 50,width: 100,height: 75,offsetLeft: 50,offsetRight: 50,smallWidth: 75,smallHeight: 50},
            {x_pos: 860,y_pos: 50,width: 100,height: 75,offsetLeft: 50,offsetRight: 50,smallWidth: 75,smallHeight: 50},
            {x_pos: 1050,y_pos: 40,width: 100,height: 75,offsetLeft: 50,offsetRight: 50,smallWidth: 75,smallHeight: 50}  
    ];
    
    mountains =  [
        {x_pos: 300, y_pos: floorPos_y},
        {x_pos: 710, y_pos: floorPos_y},
        {x_pos: 1150, y_pos: floorPos_y}
    ];
     
    canyons =  [
        {x_pos: 200, y_pos: floorPos_y, width:75, height: 576-350},
        {x_pos: -40, y_pos: floorPos_y, width:75, height: 576-350},
        {x_pos: 1250, y_pos: floorPos_y, width:75, height: 576-350},
        {x_pos: 650, y_pos: floorPos_y, width:175 ,  height: 576-350}        
    ];
    
    platforms = [];
    
    platforms.push(createPlatforms(675,floorPos_y - 75,100));
    platforms.push(createPlatforms(1600,floorPos_y - 75,100));
    platforms.push(createPlatforms(1750,floorPos_y - 125,100));
    platforms.push(createPlatforms(2050,floorPos_y,100));
    
    enemies = [];
    
    enemies.push(new Enemy(500,floorPos_y-20, 100));
    enemies.push(new Enemy(1000,floorPos_y-20, 100));
      
}

function createPlatforms(x, y, length)
{
    var p = {
            x: x,
            y: y,
            length: length,
            draw: function()
                    {
                        fill(50,205,50);
                        stroke(0);
                        strokeWeight(2);
                        rect(this.x, this.y, this.length, 20)
                    },
            checkContact: function(charPosX, charPosY)
                            {
                                if(charPosX > this.x && 
                                   charPosX < this.x + this.length)
                                        {
                                            var d = this.y - charPosY;
                                            if(d >= 0 && d < 5)
                                                {
                                                   return true;
                                                }
                                        }
                                else {return false}
                            }
            }
    return p
}

function Enemy(x,y,range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
        {
            this.currentX += this.inc;
            if(this.currentX >= this.x+ this.range)
                {
                    this.inc = -1
                }
            else if(this.currentX < this.x)
                {
                    this.inc = 1
                }
        }
    
    this.draw = function()
        {
            this.update();

            // bee's body
            fill(255, 204, 0);
            ellipse(this.currentX, this.y, 50, 30);

            // stripes
            fill(0);
            rect(this.currentX - 5, this.y - 13, 3, 25);
            rect(this.currentX, this.y - 13, 3, 25);
            rect(this.currentX + 5, this.y - 13, 3, 25);
            rect(this.currentX + 10, this.y - 13, 3, 25);

            // wings
            fill(173, 216, 230, 150);
            ellipse(this.currentX - 10, this.y - 20, 20, 10);
            ellipse(this.currentX + 10, this.y - 20, 20, 10);

            // eyes
            fill(255);
            ellipse(this.currentX - 15, this.y - 5, 8, 8);
            fill(0);
            ellipse(this.currentX - 17, this.y - 5, 3, 3);
        
            fill(0);
            triangle(this.currentX + 25, this.y, this.currentX + 35, this.y - 5, this.currentX + 35, this.y + 5); // Stinger
        
        }
    
    this.checkContact = function(charPosX, charPosY) 
        {
            var d = dist(charPosX, charPosY, this.currentX, this.y);
            if(d < 30)
                {
                    return true;
                }
            return false;
        }
}