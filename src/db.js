const users = [{
    id: '1',
    name: 'Pooja Shroff',
    email: 'pooja@example.com',
    age: 27
}, {
    id: '2',
    name: 'Santosh Prabhu',
    email: 'santosh@example.com',
    age: 27
}, {
    id: '3',
    name: 'Deepa Shroff',
    email: 'deepa@example.com'
}];

// Demo posts data
const posts = [{
    id: '1000',
    title: 'My first post',
    body: 'I am learning Graph QL',
    published: true,
    author: '1'
}, {
    id: '1001',
    title: 'My second post',
    body: 'I like succulents',
    published: true,
    author: '1'
}, {
    id: '1002',
    title: 'My third post',
    body: 'I like to paint with watercolors',
    published: true,
    author: '2'
}]

// Comments
const comments = [{
    id: '2000',
    text: 'This is my first comment',
    author: '1',
    post: '1000'
},{
    id: '2001',
    text: 'This is a nice comment',
    author: '2',
    post: '1000'
},{
    id: '2002',
    text: 'This is a mean comment',
    author: '2',
    post: '1001'
},{
    id: '2003',
    text: 'This comment is on YouTube',
    author: '3',
    post: '1002'
}]

const db = {
    users,
    posts,
    comments
};

export {db as default};