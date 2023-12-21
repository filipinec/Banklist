'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////////////

// Update UI

const updateUI = function () {
  //Display movements
  dispayMovements(currentAccount.movements);

  //Display balance
  calcDisplayBalance(currentAccount);

  //Display summary
  calcDisplaySummary(currentAccount.movements);
};
// Event handler

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submiting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields and remove focus on the field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// Account close - findIndex Method
btnClose.addEventListener('click', function (e) {
  e.preventDefault(); // prevent default
  const usernameClose = inputCloseUsername.value;
  const passwordClose = Number(inputClosePin.value);

  //Create Logic
  if (
    usernameClose === currentAccount.username &&
    passwordClose === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }

  //Clear fields
  inputCloseUsername.value = inputClosePin.value = '';
});

/////////////////////////////////////////////

// Implementing Transfers

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default submiting
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //Check: if have enoght money, if balance is bigger than 0
  // Check if the transfer is not on the same account and check exist of account
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // DEPOSIT to the array of account where we sent
    receiverAcc.movements.push(amount);

    // WITHDRAWAL to the array of account from where we sent
    currentAccount.movements.push(-amount);

    // Update UI
    updateUI(currentAccount);
  }
  // Cleaning fields
  inputTransferAmount.value = inputTransferTo.value = '';
});

//Create Loan - Same Method

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  // Loan can be 10 % of high value deposit in array // If we have deposit max of 25 000 we can loan max 250 000
  const amount = currentAccount.movements.some(mov => mov >= loanAmount * 0.1);

  // TWO CONDITIONS
  if (loanAmount > 0 && amount) {
    // Add movement
    currentAccount.movements.push(loanAmount);
    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// Create DOM Elements

//Creat function for Display Movementrs
const dispayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // Remove old elements from html also can use textContent = ''
  //Sorting the movements in ascending
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    //Create logic if value is greater than 0 is deposit or if is less than is withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html); // new Method to add new html element (where to put, what element to put)/ USE: afterbegin / beforeend
  });
};

/////////////////////////////////////////////

// Calculating and print balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//////////////////////////////////////////////////

//Calculation and display the incumes out and interest

const calcDisplaySummary = function (movements) {
  // Calculation and display Incumes of Money
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  // Calculation and display Out of Money
  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  // Calculation and display Interest
  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * currentAccount.interestRate) / 100)
    .filter(int => int >= 1)

    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//Computing Usernames
//Create function for username
const createUsernames = function (accs) {
  //Create ne property in object
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUsernames(accounts);

// Sorting  movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  dispayMovements(currentAccount.movements, !sorted);
  sorted = !sorted; //Using for change movement (sorted / non sorted)
});
