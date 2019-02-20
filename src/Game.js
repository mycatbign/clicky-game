import React from "react";

// define all of the tiles used in the game
const tiles = ["bluebird", "buzz", "dingwall", "mike", "mrpotatoe", "olaf", "remi", "russell", "skinner", "stitch", "sully", "walle"];

// function that will shuffle the array for redisplay after each click
function shuffle(array) {
  //  borrowed from https://stackoverflow.com/a/2450976/1293256
  let currentIndex = array.length;
  let temporaryValue, randomIndex;
  // while there remain elements to shuffle...
  console.log("Unshuffled Array: " + array);
  while (0 !== currentIndex) {
    // pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // and swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  // make sure the tiles shuffled
  console.log("Shuffled Array: " + array);
  return array;
}

// function will make each tile a clickable button 
function TileButton(props) {
  const imgUrl = "images/" + props.name + ".png";
  return <button><img src={imgUrl} alt={props.name} onClick={props.onClick} /></button>
}

// define the game board display 
class Board extends React.Component {
  // function will make each tile a clickable button 
  renderTileButton(tile) {
    const name = this.props.tiles[tile];
    return <TileButton name={name} onClick={() => this.props.onClick(name)} />
  }
  // display the board after the user has made a click and the tiles are shuffled
  render() {
    return (
      <div>
        <div> {this.renderTileButton(0)} {this.renderTileButton(1)} {this.renderTileButton(2)} {this.renderTileButton(3)} </div>
        <div> {this.renderTileButton(4)} {this.renderTileButton(5)} {this.renderTileButton(6)} {this.renderTileButton(7)} </div>
        <div> {this.renderTileButton(8)} {this.renderTileButton(9)} {this.renderTileButton(10)} {this.renderTileButton(11)} </div>
      </div>
    );
  }
}

// set the game stateful items
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shuffledTiles: shuffle(tiles),  // when the the board is shuffled it will trigger a render
      currScore: 0,                   // when the users current score changes it will trigger a render
      highScore: 0,                   // when the top score changes it will trigger a render
      clickedTiles: [],               // tracking the tiles that have already been clicked
      message: "Welcome to Clicky"    // when we changet he message it triggers a render
    }
  }

  // actions to execute when a tile is clicked
  handleClick(tile) {
    let { currScore, highScore, clickedTiles } = this.state;
    // if user clicked a tile that is already in the clickedTile array then that means they clicked a tile twice - so game ends
    if (clickedTiles.includes(tile)) {
      currScore = 0;
      this.setState({
        currScore: 0,
        clickedTiles: [],
        message: "Oops - you already used that picture. Try again."
      });
    } else {
      // otherwise the user has clicked a valid available tile (never been clicked)
      currScore++;
      highScore = currScore > highScore ? currScore : highScore;
      let message = "Good guess - keep going..";
      clickedTiles = clickedTiles.concat([tile]);
      // see if the user has clicked all 12 tiles and therefore won the game
      // if so - reset score and empty clickedTiles so we can start again
      if (currScore === 12) {
        currScore = 0;
        clickedTiles = [];
        message = "You win! Great memory - lets play again.";
      }
      // otherwise increment everything which should drive a rerender and keep playing
      this.setState({
        shuffledTiles: shuffle(tiles),
        currScore: currScore,
        highScore: highScore,
        clickedTiles: clickedTiles,
        message: message
      });
    }
  }

  // render the board whenever any of the stateful items changes above
  render() {
    const { message, currScore, highScore, shuffledTiles } = this.state;
    return (
      <div>
        <h1>Click on an image to earn points, but don't click on any more than once!</h1>
        <h1>{message}</h1>
        <h1>Your Current Score: {currScore} --- Your Highest Score: {highScore}</h1>
        <Board tiles={shuffledTiles} onClick={(tile) => this.handleClick(tile)} />
      </div>
    );
  }
}

export default Game;