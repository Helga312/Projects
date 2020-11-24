// getting all the functional elements from the DOM
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const negativeButton = document.querySelector('[data-negative-number]')
const allClearButton = document.querySelector('[data-all-clear]')
const deleteButton = document.querySelector('[data-delete]')
const equalsButton = document.querySelector('[data-equals]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

class Calculator {  // this way we set these text elements inside the calculator class
  constructor() {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()  // this way we bring all the values to default when we load the calculator; this command defines this.currentOperand, previousOperand, operation
  }

  // methods of the class
  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = null  //if we clear things, we do not need any operation to be selected
    this.newNumber = true  //logical variable, which helps to define the start and the end of each number
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  appendNumber(number) {  //adding a number after the clicks
    if (this.newNumber) {
      this.currentOperand = number
      this.newNumber = false
    } else {
      if (number === '.' && this.currentOperand.includes('.')) return
      this.currentOperand = this.currentOperand.toString() + number.toString()
      this.newNumber = false
    }
  }


  chooseOperation(operation) { //this happens when the user clicks on any operator
    if (this.currentOperand === '' && this.operation !== null) {
      this.operation = operation
      if (this.currentOperand === '' && this.operation !== "√x") return
    }

    if (this.previousOperand !== '') {
      this.compute() // makes calculations, if equals button was not clicked upon
    }

    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
    this.newNumber = true
  }

  addNegation(negation) { // this f adds/removes negation mark in front of the number
    if (this.currentOperand.includes('-')) {
      this.currentOperand = this.currentOperand.toString().slice(1, (this.currentOperand.toString()).length)
    } else if (this.currentOperand.toString()[0] === '.') {
      this.currentOperand = `-0${this.currentOperand}`
    } else this.currentOperand = `-${this.currentOperand}`
  }

  compute() {   //takes the numbers and calculates the result value
    let computation   //the result of computing
    let prev = parseFloat(this.previousOperand) //convert the string into a number
    let current = parseFloat(this.currentOperand)
    let pow  //the power of 10, to calculate decimals

    if (this.previousOperand.includes('.') && this.currentOperand.includes('.')) {

      if ((this.previousOperand.split('.')[1]).length >= (this.currentOperand.split('.')[1]).length) {
        pow = (this.previousOperand.split('.')[1]).length
      } else pow = (this.currentOperand.split('.')[1]).length
    } else if (this.previousOperand.includes('.') || this.currentOperand.includes('.')) {

      if (this.previousOperand.includes('.')) {
        pow = (this.previousOperand.split('.')[1]).length
      } else pow = (this.currentOperand.split('.')[1]).length
    } else pow = 1


    if (this.operation === '√x' && prev >= 0) {
      this.currentOperand = ''
    } else if (isNaN(prev) || isNaN(current)) return   //the update doesn't work if the prev or current are empty, when you click on equals button

    switch (this.operation) {
      case '+':
        computation = (prev * Math.pow(10, pow) + current * Math.pow(10, pow)) / Math.pow(10, pow)
        break
      case '-':
        computation = (prev * Math.pow(10, pow) - current * Math.pow(10, pow)) / Math.pow(10, pow)
        break
      case '*':
        computation = ((prev * Math.pow(10, pow)) * (current * Math.pow(10, pow))) / (Math.pow(10, pow) ** 2)
        break
      case '÷':
        computation = ((prev * Math.pow(10, pow)) / (current * Math.pow(10, pow)))
        break
      case '√x':
        computation = Math.sqrt(prev)
        break
      case 'xy':
        if (this.previousOperand.includes('.') && parseFloat(this.currentOperand) === parseInt(this.currentOperand)) {
          let precision = this.previousOperand.split('.')[1].length * parseInt(this.currentOperand)
          computation = Math.pow(prev, current).toFixed(precision)
        } else computation = Math.pow(prev, current)
        break
      default:
        return  //in case there is error and none of the mentioned operators are used
    }

    if (this.operation === 'xy' && prev < 0 && this.currentOperand.toString().includes('.')) {
      computation = 'error'
      this.updateDisplay()
    }

    this.previousOperand = ''
    this.currentOperand = computation.toString()
    this.operation = undefined
    this.newNumber = true

  }

  getDisplayNumber(number) {  //help function, which divides the number with commas by 3 digits: 555,555,500
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0]) // we get the first part of the array
    const decimalDigits = stringNumber.split('.')[1] // we get the second part of the array
    let integerDisplay
    let decimalDisplay = decimalDigits

    if (isNaN(integerDigits)) {
      integerDisplay = '' // будет отображать перед точкой пустую строчку, если не поставили 0
    } else if (number < 0 && this.operation === '√x') {
      integerDisplay = 'error'
    } else integerDisplay = integerDigits.toLocaleString('ru', { maximumFractionDigits: 0 })  //toLocaleString('en') добавляет запятые-разделители

    if (decimalDisplay != null && this.newNumber === false) { // updating number while clicking buttons
      return `${integerDisplay}.${decimalDisplay}`
    } else if (decimalDisplay != null && this.newNumber === true) {

      while (decimalDisplay[decimalDisplay.length - 1] == 0) {
        decimalDisplay = decimalDisplay.slice(0, -1)
      }
      if (decimalDisplay) {
        return `${integerDisplay}.${decimalDisplay}`
      } else return integerDisplay

    } else
      return integerDisplay
  }

  updateDisplay() {

    if (this.currentOperand.toString().includes('error')) {
      this.currentOperandTextElement.innerText = this.currentOperand
    } else this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)

    if (this.operation === 'xy') {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ^`
    }
    else if (this.getDisplayNumber(this.previousOperand).includes('error')) {
      this.currentOperandTextElement.innerText = 'error'
    } else if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else this.previousOperandTextElement.innerText = ''
  }

}


const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {   // arrow function
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {   // arrow function
  button.addEventListener('click', () => {
    if (button.innerText == '√x') {
      calculator.chooseOperation(button.innerText)
      calculator.compute()
      calculator.updateDisplay()
    } else {
      calculator.chooseOperation(button.innerText)
      calculator.updateDisplay()
    }
  })
})

negativeButton.addEventListener('click', () => {
  calculator.addNegation()
  calculator.updateDisplay()
})

equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
  calculator.delete()
  calculator.updateDisplay()
})
