import "@babel/polyfill";
import './index.html';
import './style.scss';
import { mult, sum } from './modules/calc';

console.log(mult(5,3));
console.log(sum(5,7));