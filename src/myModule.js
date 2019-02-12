//Named export - has a name. Can have as many as we need.
const message = 'Some message from my module.js';

const location = 'Philadelphia';

const getGreeting = (name) => {
    return `Hello world ${name}`
}

export {message, getGreeting, location as default}