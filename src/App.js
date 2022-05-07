import { useState, useEffect } from 'react'
import './App.css'
import SingleCard from './components/SingleCard'

const cardImages = [
  { "src": "/img/helmet-1.png", matched: false },
  { "src": "/img/potion-1.png", matched: false },
  { "src": "/img/ring-1.png", matched: false },
  { "src": "/img/scroll-1.png", matched: false },
  { "src": "/img/shield-1.png", matched: false },
  { "src": "/img/sword-1.png", matched: false }
]

function App() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)

  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)

  // shuffle cards for new game

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({...card, id: Math.random() }))
      
      setChoiceOne(null)
      setChoiceTwo(null)
      setCards(shuffledCards)
      setTurns(0)
  }

  // handle a choice
  const handleChoice = (card) => {
    console.log(card)
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  // Compare 2 selected cards
  // Runs when either choiceOne or choiceTwo is selected
  // As it lists them as a dependancy
  useEffect(() => {
    // If both choices made
    if(choiceOne && choiceTwo) {
      setDisabled(true)
      // We have a match
      if(choiceOne.src === choiceTwo.src) {
        // Take in previous cards state 
        setCards(prevCards => {
          // Return a new array of cards with matched prop updated
          // for either choice as both choice src's are equal at this point
          return prevCards.map(card => {
            if(card.src === choiceOne.src) {
              // Use spread operator to spread object attributes and values out in
              // to the new object, but update matched to be true
              return {...card, matched: true}
            } else {
              // Return the card as is
              return card
            }
          })
        })
        resetTurn()
      }else{
        // Make it so that the cards don't instantly turn back
        // This allows them to stay card up for 1 second before flipping back over
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  const resetTurn = () => {
    // Reset the choices
    setChoiceOne(null)
    setChoiceTwo(null)

    // Increase the turns by 1
    setTurns(prevTurns => prevTurns + 1)
    // Re-enable the img's for clicking (see handleClick in SingleCard.js)
    setDisabled(false)
  }

  // Start a new game straight away by calling shuffleCards()
  useEffect(() => {
    shuffleCards()
  }, [])

  // The actual content displayed on the page
  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>

      {/* Note that each card is a SingleCard component
          Pass in card id generated in shuffleCards as key
          Pass in the card for access to attributes and identifying component with card object
          Pass in function handleChoice so we can call it within SingleCard and be able to update state in App.js
          Pass in a bool called 'flipped', which is true when either of the choices match the card, or the card itself has been flagged as matched
          Pass in a bool called 'disabled' which starts as false to allow clicking (see handleClick in SingleCard.js)
          this bool is changed to true when two choices have been made, then a comparison is made, then bool goes back to false to allow clicking and flipping */}
      <div className="card-grid">
        {cards.map(card => (
          <SingleCard 
            key={card.id}
            card={card} 
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>Turn: {turns}</p>
    </div>
  );
}

export default App