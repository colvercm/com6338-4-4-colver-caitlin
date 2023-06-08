const head = document.querySelector('head')
const body = document.querySelector('body')

// mocha CSS link
const mochaCSSPath = "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.css"
const mochaCSSLinkEl = document.createElement('link')
mochaCSSLinkEl.rel = 'stylesheet'
mochaCSSLinkEl.href = mochaCSSPath
head.prepend(mochaCSSLinkEl)

// custom styles for mocha runner
const mochaStyleEl = document.createElement('style')
mochaStyleEl.innerHTML =
  `#mocha {
    font-family: sans-serif;
    position: fixed;
    overflow-y: auto;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 48px 0 96px;
    background: white;
    color: black;
    display: none;
    margin: 0;
  }
  #mocha * {
    letter-spacing: normal;
    text-align: left;
  }
  #mocha .replay {
    pointer-events: none;
  }
  #mocha-test-btn {
    position: fixed;
    bottom: 50px;
    right: 50px;
    z-index: 1001;
    background-color: #007147;
    border: #009960 2px solid;
    color: white;
    font-size: initial;
    border-radius: 4px;
    padding: 12px 24px;
    transition: 200ms;
    cursor: pointer;
  }
  #mocha-test-btn:hover:not(:disabled) {
    background-color: #009960;
  }
  #mocha-test-btn:disabled {
    background-color: grey;
    border-color: grey;
    cursor: initial;
    opacity: 0.7;
  }`
head.appendChild(mochaStyleEl)

// mocha div
const mochaDiv = document.createElement('div')
mochaDiv.id = 'mocha'
body.appendChild(mochaDiv)

// run tests button
const testBtn = document.createElement('button')
testBtn.textContent = "Loading Tests"
testBtn.id = 'mocha-test-btn'
testBtn.disabled = true
body.appendChild(testBtn)

const scriptPaths = [
  "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/chai/4.3.4/chai.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/sinon.js/10.0.1/sinon.min.js",
  // "jsdom.js" // npx browserify _jsdom.js --standalone JSDOM -o jsdom.js
]
const scriptTags = scriptPaths.map(path => {
  const scriptTag = document.createElement('script')
  scriptTag.type = 'text/javascript'
  scriptTag.src = path
  return scriptTag
})

let loaded = 0
if (localStorage.getItem('test-run')) {
  // lazy load test dependencies
  scriptTags.forEach(tag => {
    body.appendChild(tag)
    tag.onload = function () {
      if (loaded !== scriptTags.length - 1) {
        loaded++
        return
      }
      testBtn.textContent = 'Run Tests'
      testBtn.disabled = false
      testBtn.onclick = __handleClick
      runTests()
    }
  })
} else {
  testBtn.textContent = 'Run Tests'
  testBtn.disabled = false
  testBtn.onclick = __handleClick
}

function __handleClick() {
  if (!localStorage.getItem('test-run') && this.textContent === 'Run Tests') {
    localStorage.setItem('test-run', true)
  } else {
    localStorage.removeItem('test-run')
  }
  window.location.reload()
}

function runTests() {
  testBtn.textContent = 'Running Tests'
  testBtn.disabled = true
  mochaDiv.style.display = 'block'
  body.style.overflow = 'hidden'

  mocha.setup("bdd");
  const expect = chai.expect;

  describe("Scantron Simulator Practice", function () {
    const pressKey = letter => document.dispatchEvent(new KeyboardEvent('keyup', { key: letter }))
    let previousLetterEl = document.getElementById('previous-letter')
    let lastGuessEl = document.getElementById('last-guess')
    let scoreEl = document.getElementById('score')
    let correctEl = document.getElementById('correct')
    let incorrectEl = document.getElementById('incorrect')
    let randomStub
    let resetBtn = document.querySelector('.game button')
    const stubRandom = num => {
      if (randomStub) randomStub.restore()
      randomStub = sinon.stub(Math, 'random').returns(num)
    }
    beforeEach(() => {
      stubRandom(0)
    })
    afterEach(sinon.restore)
    after(() => {
      testBtn.disabled = false
      testBtn.textContent = 'Close Tests'
    })
    describe('setup', () => {
      it('should start with blank score element', () => {
        expect(scoreEl.textContent).to.be.empty
      })
      it('should start with blank previous letter element ', () => {
        expect(previousLetterEl.textContent).to.be.empty
      })
      it('should start with blank last guess element ', () => {
        expect(lastGuessEl.textContent).to.be.empty
      })
      it('should start with correct count of 0', () => {
        expect(correctEl.textContent).to.eq('0')
      })
      it('should start with incorrect count of 0', () => {
        expect(incorrectEl.textContent).to.eq('0')
      })
      it('should do nothing when pressing an invalid key', () => {
        pressKey(' ')
        pressKey('Shift')
        pressKey('Alt')
        pressKey(',')
        pressKey('z')
        pressKey('Control')
        expect(scoreEl.textContent).to.be.empty
        expect(previousLetterEl.textContent).to.be.empty
        expect(lastGuessEl.textContent).to.be.empty
        expect(correctEl.textContent).to.eq('0')
        expect(incorrectEl.textContent).to.eq('0')
      })
    })
    describe('guessing incorrectly', () => {
      it('should increment incorrect count', () => {
        pressKey('e')
        expect(incorrectEl.textContent).to.eq('1')
      })
      it('should NOT increment correct count', () => {
        expect(correctEl.textContent).to.eq('0')
      })
      it('should update score', () => {
        expect(scoreEl.textContent).to.eq('0%')
      })
      it('should show guessed letter', () => {
        expect(lastGuessEl.textContent.toLowerCase()).to.eq('e')
      })
      it('should reveal previous letter', () => {
        expect(previousLetterEl.textContent.toLowerCase()).to.eq('a')
      })
    })
    describe('guessing correctly', () => {
      it('should increment correct count', () => {
        pressKey('a')
        expect(incorrectEl.textContent).to.eq('1')
      })
      it('should NOT increment incorrect count', () => {
        expect(correctEl.textContent).to.eq('1')
      })
      it('should update score', () => {
        expect(scoreEl.textContent).to.eq('50%')
      })
      it('should show guessed letter', () => {
        expect(lastGuessEl.textContent.toLowerCase()).to.eq('a')
      })
      it('should reveal previous letter', () => {
        expect(previousLetterEl.textContent.toLowerCase()).to.eq('a')
      })
    })
    describe('reset button', () => {
      it('should exist on page', () => {
        expect(resetBtn).to.exist
        expect(resetBtn).to.not.eq(testBtn)
        expect(resetBtn.textContent.toLowerCase())
          .to.include('reset')
      })
      it('should reset all info when clicked', () => {
        scoreEl.textContent = 'banana'
        previousLetterEl.textContent = 'banana'
        lastGuessEl.textContent = 'banana'
        correctEl.textContent = 'banana'
        incorrectEl.textContent = 'banana'
        resetBtn.click()
        expect(scoreEl.textContent).to.be.empty
        expect(previousLetterEl.textContent).to.be.empty
        expect(lastGuessEl.textContent).to.be.empty
        expect(correctEl.textContent).to.eq('0')
        expect(incorrectEl.textContent).to.eq('0')
      })
    })
  });

  mocha.run();
}