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
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// // Simple Array Methods

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // Slice Method
// console.log(arr.slice(2)); //Result: ['c', 'd', 'e']
// console.log(arr.slice(2, 4)); //Result: ['c', 'd']
// console.log(arr.slice(-2)); //Result: ['d', 'e'] - Negative index on Start
// console.log(arr.slice(1, -2)); //Result: ['b', 'c'] - Negative index on End
// console.log(arr.slice()); // ['a', 'b', 'c', 'd', 'e'] - Copy of array
// console.log([...arr]); // ['a', 'b', 'c', 'd', 'e'] - Same - Other way

// // Splice Method
// console.log(arr.splice(2)); //Result:['c', 'd', 'e'] - Work same like slice but remove other elements in original arr.
// arr.splice(-1); // Remove last element in array
// console.log(arr); //Result:['a', 'b'] or ['a']

// // Reverse Method
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'j'];

// console.log(arr2); // Result: ['j', 'i', 'h', 'g', 'j'] - Original array
// console.log(arr2.reverse()); // Result: ['j', 'i', 'h', 'g', 'j'] - Reverse array
// console.log(arr2); // Result: ['j', 'i', 'h', 'g', 'j'] - Take Reverse array

// // Concat Method
// const letters = arr.concat(arr2); // letters = arr + arr2
// console.log(letters); // Result: ['a', 'b', 'c', 'd', 'e', 'j', 'g', 'h', 'i', 'j']
// console.log([...arr, ...arr2]); // Result: ['a', 'b', 'c', 'd', 'e', 'j', 'g', 'h', 'i', 'j']

// // Join Method
// console.log(letters.join(' - ')); // Result: a - b - c - d - e - j - g - h - i - j

/////////////////////////////////////////////////////////

// // The new At Method

// const arr = [23, 11, 64];
// console.log(arr[0]); // Result: 23
// console.log(arr.at(0)); // Result: 23

// // if we want to find last element in array
// console.log(arr[arr.length - 1]); // Result: 64
// console.log(arr.slice(-1).at()); // Result: 64
// console.log(arr.at(-1)); // Result: 64

// //Work with String
// console.log('filip'.at(0)); // First latter
// console.log('filip'.at(-1)); // End letter

// /////////////////////////////////////////////////////////

// // Looping Arrays: forEach

// //Positive number are Deposits
// //Negative number are Withdrewals

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // for (const movement of movements) {

// //Access to index number
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: deposited ${movement} 🟢`);
//   } else {
//     console.log(`Movement ${i + 1}: withdrew ${Math.abs(movement)} 🔴`); // Use Math.abs() for remove '-'(negative value)
//   }
// }

// console.log('------------------------------------------');

// // Using forEach - to get same results from above

// // Always must use next order (movement(value), i(index), arr (array))
// movements.forEach(function (movement, i, arr) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: deposited ${movement} 🟢`);
//   } else {
//     console.log(`Movement ${i + 1}: withdrew ${Math.abs(movement)} 🔴`); // Use Math.abs() for remove '-'(negative value)
//   }
// });

/////////////////////////////////////////////

// // forEach with Maps and Sets

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// //loop with forEach through Map
// currencies.forEach(function (value, key, map) {
//   console.log(`This ${value}: ${key}`);
// });

// //loop with forEach through Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`This ${value}: ${key}`); //Result: This USD: USD  (key = value) Not have keys
// });

// /////////////////////////////////////////////////////////

// // Codding Challenge #1

// const dogsJuliaData1 = [3, 5, 2, 12, 7];
// const dogsKateData1 = [4, 1, 15, 8, 3];
// const dogsJuliaData2 = [9, 16, 6, 8, 3];
// const dogsKateData2 = [10, 5, 6, 1, 4];

// const checkDogs = function (dogsJulia, dogsKate) {
//   //  1). Remove data in array correct but frist copy dogsJulia data
//   const copyDogsJulia = dogsJulia.slice(); // Results: [3, 5, 2, 12, 7]
//   const onlyWithDogsJulia = copyDogsJulia.slice(1, 3); // Results: [5,2]

//   //  2). Create 1 array from Julia and Kate arrays
//   const dogsJuliaAndKate = onlyWithDogsJulia.concat(dogsKate); // Results: [5, 2, 4, 1, 15, 8, 3]

//   // 3). Create loop
//   dogsJuliaAndKate.forEach(function (years, number) {
//     years > 3
//       ? console.log(
//           `Dog number ${number + 1} is an adult, and is ${years} years old!`
//         )
//       : console.log(
//           `Dog number ${number + 1} is still a puppy and have ${years} years!`
//         );
//   });
// };

// // 4). Check for 2 Data
// checkDogs(dogsJuliaData1, dogsKateData1);
// console.log('--------------------------------------');
// checkDogs(dogsJuliaData2, dogsKateData2);

///////////////////////////////////////////////

// // Coding Challenge #2

// const data1 = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanaAge = function (ages) {
//   // 1). Converting dogAges in humanAges - Using Map method
//   const humanAges = ages.map(function (age) {
//     return age <= 2 ? age * 2 : 16 + age * 4;
//   });
//   console.log(humanAges);

//   // 2). Filter all dogs which are 18years and old - Using Filter method
//   const oldDogs = humanAges.filter(function (age) {
//     return age >= 18;
//   });
//   console.log(oldDogs); // Result: [36, 32, 76, 48, 28] and [80, 40, 56, 36, 40, 32]

//   // 3). Calculate average from all oldDogs
//   const averageYearsArrow = oldDogs.reduce(
//     (total, age, i, arr) => total + age / arr.length,
//     0
//   );
//   console.log(averageYearsArrow.toFixed(2)); // Result: 44 / 47.33
// };
// calcAverageHumanaAge(data1); // Result:[36, 4, 32, 2, 76, 48, 28]
// calcAverageHumanaAge(data2); // Result:[80, 40, 56, 36, 40, 2, 32]

/////////////////////////////////////////////////////

// // Coding Challenge #3

// // Do it Codding Challenge #2 with chain method

// const data1 = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAgeChain = function (ages) {
//   const humanYears = ages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((total, age, i, arr) => total + age / arr.length, 0);
//   console.log(humanYears);
// };
// calcAverageHumanAgeChain(data1); // Result: 44
// calcAverageHumanAgeChain(data2); // Result: 47.333

// ////////////////////////////////////////////

// // The Map Method

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // We want to do conversion from EURO to USD
// const euroToUsd = 1.1; // Exchenge rate
// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// console.log(movements); // Result: [200, 450, -400, 3000, -650, -130, 70, 1300]
// console.log(movementsUSD); // Result: [220, 495, -440, 3300, -715, -143, 77, 1430]

// // With arrow funtion
// const movementsUSDarrow = movements.map(mov => mov * euroToUsd);
// console.log(movementsUSDarrow); // Result: [220, 495, -440, 3300, -715, -143, 77, 1430]

// // Using for loop for made same thing - BAD WAY
// const movementsUSDfor = [];
// for (const mov of movements) {
//   movementsUSDfor.push(mov * euroToUsd);
// }
// console.log(movementsUSDfor); // Result: [220, 495, -440, 3300, -715, -143, 77, 1430]

// //Example
// const movementsDescriptions = movements.map(function (mov, i) {
//   return `Movement ${
//     i + 1
//   }: ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)} ${mov > 0 ? '🟢' : '🔴'}`;
// });

// console.log(movementsDescriptions);

// //Same with arrow function
// const movementsDescriptionsArrow = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )} ${mov > 0 ? '🟢' : '🔴'}`
// );

// console.log(movementsDescriptionsArrow);

// ///////////////////////////////////////////////////////

// // The Filter Method

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // Using Filter Method filter only deposits
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits); //Results: [200, 450, 3000, 70, 1300]

// //Same using for loop - BAD WAY
// const depositsFor = [];
// for (const mov of movements) {
//   if (mov > 0) {
//     depositsFor.push(mov);
//   }
// }
// console.log(depositsFor); //Results: [200, 450, 3000, 70, 1300]

// // Using Filter Method filter only withdrawals
// const withdrawal = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(withdrawal); //Results: [-400, -650, -130]

////////////////////////////////////////////////////

// // The Reduce Method

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// //Using Reduce Method to accumulate all value
// // acc - total value

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteretion ${i}: ${acc}`);
//   return acc + cur;
// }, 0); // Meaning starting point on counting in this case is 0;
// console.log(balance);
// console.log('----------------------------');

// // Using Arrow function

// const balanceArrow = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balanceArrow);
// console.log('----------------------------');

// //Using for Loop BAD WAY
// let sum = 0;
// for (const mov of movements) {
//   sum = sum + mov;
//   console.log(sum);
// }

// // Maximum value in array

// const max = movements.reduce(function (acc, mov) {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

// ////////////////////////////////////////////////////

// // The Magic of Chaining Methods

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;

// // PIPELINE
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0) // Only positive value - deposits
//   .map(mov => mov * euroToUsd) // Convert them to USD
//   .reduce((acc, mov) => acc + mov, 0); // Total of deposits in USD
// console.log(totalDepositsUSD);

////////////////////////////////////

// // The Find Method

// // The find method only return first element on the condition

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements); // Result: [200, 450, -400, 3000, -650, -130, 70, 1300]
// console.log(firstWithdrawal); // Result: -400

// // Exampele
// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// // The same with for / of loop
// for (const account of accounts) {
//   if (account.owner === 'Jessica Davis') {
//     console.log(account2);
//   }
// }

/////////////////////////////////////////////////////////

// // Same Method - Condition is True only if one element is true

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // EQUALITY
// console.log(movements);
// console.log(movements.includes(-130)); //Result: True

// // CONDITION

// //Check if we have deposits (above 0)
// const anyDeposit = movements.some(mov => mov > 0);
// console.log(anyDeposit); //Result: True

// //Check if we have deposits above 5000
// const bigDeposit = movements.some(mov => mov > 5000);
// console.log(bigDeposit); //Result: False

// //Check if some number exist
// const someNumber = movements.some(mov => mov === -130);
// console.log(someNumber); //Result: True

// // Every - Condition is True only when all elements are true

// const everyDeposit = movements.every(mov => mov > 0);
// console.log(everyDeposit); //Result: False

// // [430, 1000, 700, 50, 90] - account4.movements
// const everyDeposit1 = account4.movements.every(mov => mov > 0);
// console.log(everyDeposit1); //Result: True

// // Separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit)); //Result: True
// console.log(movements.every(deposit)); //Result: False
// console.log(movements.filter(deposit)); //[200, 450, 3000, 70, 1300]

// /////////////////////////////////////////////////////////////

// // flat and flatMap Method

// // flat

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat()); // Result [1, 2, 3, 4, 5, 6, 7, 8]

// // flat(i) i - meaning how deep to go
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2)); // Result [1, 2, 3, 4, 5, 6, 7, 8]

// // If we want to take all array of movements from account 1,2,3,4 - using Map
// const accountsMovements = accounts.map(acc => acc.movements);

// // all movements to one array
// const allMovements = accountsMovements.flat();

// // total balance
// const overalBalance = allMovements.reduce((acc, mov) => (acc = acc + mov), 0);
// console.log(overalBalance);

// // Same with chaining method
// const overalBalanceChain = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => (acc = acc + mov), 0);
// console.log(overalBalanceChain);

// // flatMap - combine flat and map methods
// const overalBalanceChainMap = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => (acc = acc + mov), 0);
// console.log(overalBalanceChainMap);

///////////////////////////////////////////////////

// // Sorting Arrays

// const owners = ['Filip', 'Gabriela', 'Dimitar', 'Mence', 'Benito'];
// console.log(owners.sort()); // Sort from A to Z - but change original Array

// //Number - not work correct with numbers
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements.sort()); // Results: [-130, -400, -650, 1300, 200, 3000, 450, 70]

// //Ascending
// const ascending = movements.sort((a, b) => a - b);
// console.log(ascending); // Results: [-650, -400, -130, 70, 200, 450, 1300, 3000]

// // Descending
// const descending = movements.sort((a, b) => b - a);
// console.log(descending); // Results: [3000, 1300, 450, 200, 70, -130, -400, -650]

////////////////////////////////////////////////////////////////////

// // More ways of Creating and Filling Arrays

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // Create Array
// const x = new Array(7); //Empty array [empty × 7]

// // Fill Array (a, b, c) a - index to fill / b - where to start / c - where to end
// x.fill(1, 3, 5);
// console.log(x); // Result: [empty × 3, 1, 1, empty × 2]

// // Change arr from above
// arr.fill(23, 2, 6);
// console.log(arr); // Result: [1, 2, 23, 23, 23, 23, 7]

// // Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y); // Result: [1, 1, 1, 1, 1, 1, 1]

// const z = Array.from({ length: 7 }, (_, i) => i + 1); // Must write _ because we need second parametar
// console.log(z); // Result: [1, 2, 3, 4, 5, 6, 7]

// // Example - create array with results of dice, 100 raunds and results from them
// const random = Array.from(
//   { length: 100 },
//   () => Math.floor(Math.random() * 6) + 1
// );
// console.log(random);

// //Example

// labelBalance.addEventListener('click', function () {
//   //Convert 1300€ to 1300

//   //Take movements in UI - el is second parametar
//   const movementUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementUI);
// });

// /////////////////////////////////////////////////////

// // Array Methods Practise

// // Exercise 1). SUM of all Deposit Movements
// const bankDepositSum = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .filter(acc => acc > 0)
//   .reduce((sum, cur) => (sum = sum + cur), 0);
// console.log(bankDepositSum); //Result:25180

// // Exercise 2). How many Deposits bigger than 1000$
// // 1 Way
// const numDeposit1000_1way = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .filter(acc => acc >= 1000).length;
// console.log(numDeposit1000_1way); //Results:6

// // 2 Way
// const numDeposit1000_2way = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .filter(acc => acc >= 1000)
//   .reduce((sum, cur, i) => (i = i + 1), 0);
// console.log(numDeposit1000_2way); //Results:6

// // Exercise 3). Two object one for Deposits one for Withdraws

// // 1 Way
// const sums = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0
//         ? (sums.deposits = sums.deposits = sums.deposits + cur)
//         : (sums.withdrawals = sums.withdrawals = sums.withdrawals + cur);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(sums); //Results: {deposits: 25180, withdrawals: -7340}

// // 2 Way
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals); //Results: 25180 -7340

// // Exercise 4) this is a nice title -> This Is a Nice Title

// const convertTitleCase = function (title) {
//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     // Create first letter Big and create logic for exceptions
//     .map(word =>
//       exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
//     )
//     .join(' ');
//   return titleCase;
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

///////////////////////////////////////////////////////////////

// //Coding Challenge #4

// // TEST DATA:
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// // 1). Create new property recFood for each dog
// dogs.forEach(function (dog) {
//   dog.recFood = Math.trunc(dog.weight ** 0.75 * 28);
// });
// console.log(dogs);

// // 2). Find dog of Sarah and according of logic write to eating to much or too little
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah); // Result: {weight: 13, curFood: 275, owners: Array(2), recFood: 191}
// console.log(
//   `Sarah's dog is eating to ${
//     dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
//   }. `
// );

// // 3).
// //Owners which dogs Eat to much
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .map(dog => dog.owners)
//   .flat();
// console.log(ownersEatTooMuch); //Result: ['Matilda', 'Sarah', 'John']

// //Owners which dogs Eat to little
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .map(dog => dog.owners)
//   .flat();
// console.log(ownersEatTooLittle); //Result: ['Alice', 'Bob', 'Michael']

// // 4) Write String
// console.log(`
//  ${ownersEatTooMuch.join(' and ')}'s dog eat too much`);
// console.log(`
//  ${ownersEatTooLittle.join(' and ')}'s dog eat too little`);

// // 5). Check if some dog eat same food like that is rec.
// const recAndCur = dogs.some(dog => dog.recFood === dog.curFood);
// console.log(recAndCur); //Result: false

// // 6). Check if any dog eating okay amount of food
// const enoughtFood = dogs.some(
//   dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
// );
// console.log(enoughtFood); //Result: true

// // 7). Which dog eat good
// const dogWhoEatGood = dogs.filter(
//   dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
// );
// console.log(dogWhoEatGood);

// // 8).Sorted according recFood - ascending order
// const dogsCopy = dogs.slice().sort((a, b) => a.recFood - b.recFood);
// console.log(dogsCopy);
