import { flatten, concat } from "lodash";

console.log(flatten([1, 2, [3, 4], 5, [6, 7]]));
console.log(concat([1, 2], [3, 4], 5, [6, 7]));