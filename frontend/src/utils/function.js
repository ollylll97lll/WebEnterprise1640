export const objectIsNull = object => {
    if (object === null || object === undefined) {
        return true;
    } else {
        return false;
    }
};

export const arrayIsEmpty = array => {
    if (objectIsNull(array) || array.length === 0) {
        return true;
    } else {
        return false;
    }
};