import myCurrentLocation, {message, getGreeting} from './myModule';

console.log('Hello Graph QL');
console.log(message);
console.log(myCurrentLocation);
console.log(getGreeting('Pooja'));


import add, {subtract} from './math';
console.log(add(4,5));
console.log(subtract(8,3));