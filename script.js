const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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
  const loanAmount = Math.floor(inputLoanAmount.value);

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
        <div class="movements__value">${mov.toFixed(2)}€</div>
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
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

//////////////////////////////////////////////////

//Calculation and display the incumes out and interest

const calcDisplaySummary = function (movements) {
  // Calculation and display Incumes of Money
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  // Calculation and display Out of Money
  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  // Calculation and display Interest
  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * currentAccount.interestRate) / 100)
    .filter(int => int >= 1)

    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
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

////////////////////////////////////////////

// // Lectures

// // Converting and checking numbers

// console.log(23 === 23.0); // Result: True
// console.log(0.1 + 0.2 === 0.3); // Result: False

// //Convert String to Number
// console.log(Number('23'));
// //Short way to converts string to number
// console.log(+'23');

// //PARSING
// //Using parseInt
// console.log(Number.parseInt('30px')); //Result: 30
// console.log(Number.parseInt('e30')); //Result: Nan (not work - only if first element is a number)

// //Using parseFloat
// console.log(Number.parseInt('2.5rem')); // Result: 2 - only whole num.
// console.log(Number.parseFloat('2.5rem')); // Result: 2.5 all num.

// // isNan - check if value is Nan
// console.log(Number.isNaN(20)); // Result: false - Number
// console.log(Number.isNaN('20')); // Result: false - String
// console.log(Number.isNaN(+'20X')); // Result: true - Nan
// console.log(Number.isNaN(23 / 0)); // Result: false - infinity

// //isFinite - check if value is number
// console.log(Number.isFinite(20)); // Result: true
// console.log(Number.isFinite('20')); // Result: false

// // isInteger - check if value is number
// console.log(Number.isInteger(23)); // Result: true
// console.log(Number.isInteger(23.0)); // Result: true
// console.log(Number.isInteger(23 / 0)); // Result: false

///////////////////////////////////////

// Math and Rounding

// // Square
// console.log(Math.sqrt(25)); // Result: 5
// console.log(25 ** (1 / 2)); // Result: 5

// // Max value
// console.log(Math.max(5, 7, 1, 23, 11, 2)); // Result: 23
// console.log(Math.max(5, 7, 1, '23', 11, 2)); // Result: 23
// console.log(Math.max(5, 7, 1, '23px', 11, 2)); // Result: NaN

// // Min value
// console.log(Math.min(5, 7, 1, 23, 11, 2)); // Result: 1

// // PI
// console.log(Math.PI);

// // Ramdom number
// console.log(Math.random()); // Result: 0 - 1
// console.log(Math.trunc(1.5)); // Result: 1

// //Create function with random number between 0 and 20
// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(15, 20));

// // Rounding integers
// console.log(Math.trunc(23.3)); // Result: 23
// console.log(Math.trunc(23.9)); // Result: 23

// console.log(Math.ceil(23.3)); // Result: 24
// console.log(Math.ceil(23.9)); // Result: 24

// console.log(Math.round(23.3)); // Result: 23
// console.log(Math.round(23.9)); // Result: 24

// console.log(Math.trunc(-23.3)); // Result: 24
// console.log(Math.floor(-23.3)); // Result: 24 better optiom

// // Rounding decimals
// console.log((2.7).toFixed(0)); // Result: 3
// console.log((2.745643).toFixed(2)); // Result: 2.75

///////////////////////////////////////////////////

// // The remainder operator

// console.log(5 % 2); // Result: 1 (5 / 2 = 2.5 or 2 and ramainder 1)
// console.log(8 % 3); // Result: 2

// console.log(6 % 2);

// //Check if number is even or odd
// const checkNum = function (num) {
//   const number = num % 2;
//   if (number === 0) {
//     console.log(`${num} is even number `);
//   } else {
//     console.log(`${num} is odd number `);
//   }
// };

// checkNum(567); // Result: 567 is odd number
// checkNum(256); // Result: 256 is even number

// // Example - color gray every even movement
// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = '#D3D3D3';
//     }
//     // Every 3 movement color in dark grey
//     if (i % 3 === 0) {
//       row.style.backgroundColor = '#9E9E9E';
//     }
//   });
// });

//////////////////////////////////////////////////////////

// Creating Dates

// Create a date
const now = new Date();
console.log(now);
console.log(new Date('Dec 22 2023 19:39:14'));
