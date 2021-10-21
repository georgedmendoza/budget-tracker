// holds db connection 
let db;
// establish connectin to Indexeddb, called 'budget-tracker'
const request = indexedDB.open('budget-tracker', 1);

// if case db version changes or doesn't exist
request.onupgradeneeded = function(event) {
    // save ref too db
    const db = event.target.result;
    // new oject store(table) new_fund, set to auto increment and primary key
    db.createObjectStore('new_fund', { autoIncrement: true });
}

// when successful
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run function
    if(navigator.onLine) {
        // uploadFund();
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
}