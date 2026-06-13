import axios from 'axios';

export const isPrice = (num) => {
    //Do something with the input
    var regex  = /^\d+(?:\.\d{0,2})$/;
    var numStr = num;
    alert(regex.test(numStr))
    if (regex.test(numStr)) {
        return true;
    }
    else {
        return false;
    }
 };
 
 export const justAnAlert = () => {
    alert('hello');
 };